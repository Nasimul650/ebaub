import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { 
  getLatestNews, 
  getActiveNotices, 
  getAllPrograms,
  getPageBySlug,
  getFacultiesWithDepartments
} from '@/utils/supabase/queries';

export const maxDuration = 30;

function formatContextData(news: any[], notices: any[], programs: any[], aboutPage: any, faculties: any[]) {
  let aboutText = '';
  
  if (aboutPage && aboutPage.content_blocks) {
    let blocks = aboutPage.content_blocks;
    if (typeof blocks === 'string') {
      try { blocks = JSON.parse(blocks); } catch(e) {}
    }
    if (Array.isArray(blocks)) {
      aboutText = blocks.map(b => {
        if (b.type === 'hero') return `${b.data?.headline} - ${b.data?.subheadline}`;
        if (b.type === 'text_image') return `${b.data?.title}: ${b.data?.paragraph}`;
        if (b.type === 'stats') return `Stats: ${b.data?.stats?.map((s: any) => `${s.value} ${s.label}`).join(', ')}`;
        return '';
      }).filter(Boolean).join('\n');
    }
  }

  return `
--- ABOUT EBAUB ---
${aboutText}

--- FACULTIES & DEPARTMENTS ---
${faculties.map(f => `- ${f.name} (Departments: ${f.departments?.map((d: any) => d.name).join(', ') || 'N/A'})`).join('\n')}

--- LATEST NOTICES ---
${notices.map(n => `Title: ${n.title} | Date: ${n.date || 'Recent'} | Details: ${n.description || 'Check notice board'}`).join('\n')}

--- LATEST NEWS ---
${news.map(n => `Title: ${n.title} | Details: ${n.summary || 'Check news portal'}`).join('\n')}

--- ACADEMIC PROGRAMS ---
${programs.map(p => `- ${p.name} (${p.degree})`).join('\n')}
`;
}

// Function to search live web & university social media (Facebook/Portal) via Tavily
async function searchWebContext(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return '';

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} site:https://ebaub.ac.bd/# or site:https://www.facebook.com/ebaub.chapai`,
        search_depth: 'basic'
      }),
      signal: AbortSignal.timeout(5000) // 5s timeout failsafe
    });

    if (!res.ok) return '';
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) return '';

    return results
      .slice(0, 4)
      .map((r: any) => `Source: ${r.title} (${r.url})\nDetails: ${r.content}`)
      .join('\n---\n');
  } catch (error) {
    console.warn('Tavily search skipped or timed out:', error);
    return '';
  }
}

// Function to search internal Supabase database specifically for the query
async function searchInternalDatabase(query: string): Promise<string> {
  try {
    const supabase = await createClient();
    const term = `%${query.trim()}%`;

    const [newsRes, noticesRes, facultyRes, programsRes, eventsRes] = await Promise.all([
      supabase.from('news').select('title, summary, date').or(`title.ilike.${term},summary.ilike.${term}`).limit(3),
      supabase.from('notices').select('title, description, category, date').or(`title.ilike.${term},category.ilike.${term}`).limit(3),
      supabase.from('faculty_members').select('name, title, bio, email').or(`name.ilike.${term},title.ilike.${term}`).limit(3),
      supabase.from('programs').select('name, degree_level, description').or(`name.ilike.${term},degree_level.ilike.${term}`).limit(3),
      supabase.from('events').select('title, description, event_date, location').or(`title.ilike.${term},description.ilike.${term}`).limit(3),
    ]);

    const items: string[] = [];
    if (eventsRes.data?.length) items.push(...eventsRes.data.map(e => `[Event] ${e.title} | Date: ${e.event_date || 'TBD'} | Location: ${e.location || 'Campus'} | ${e.description || ''}`));
    if (newsRes.data?.length) items.push(...newsRes.data.map(n => `[News] ${n.title} | ${n.summary || ''}`));
    if (noticesRes.data?.length) items.push(...noticesRes.data.map(n => `[Notice] ${n.title} | ${n.description || ''}`));
    if (facultyRes.data?.length) items.push(...facultyRes.data.map(f => `[Faculty] ${f.name} (${f.title}) | ${f.email || ''} | ${f.bio || ''}`));
    if (programsRes.data?.length) items.push(...programsRes.data.map(p => `[Program] ${p.name} (${p.degree_level})`));

    return items.join('\n');
  } catch (error) {
    return '';
  }
}

// Helper to detect conversational messages, greetings, and basic math to skip external searches
function isConversationalOrMath(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return true;

  const greetings = [
    'hi', 'hello', 'hey', 'assalam', 'assalamualaikum', 'good morning',
    'good afternoon', 'good evening', 'thanks', 'thank you', 'ok', 'okay',
    'bye', 'goodbye', 'who are you', 'what can you do', 'help'
  ];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '?') || q.startsWith(g + '!'))) {
    return true;
  }

  // Basic math check (e.g. "1+1", "5 * 10", "what is 2 + 2")
  if (/^(\d+[\s+\-*/^=]+\d+|what is \d+[\s+\-*/^=]+\d+)/i.test(q)) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages?.slice().reverse().find((m: any) => m.role === 'user')?.content?.trim() || '';

    // Step 1: Always load base university structure & latest updates
    const [news, notices, programs, aboutPage, faculties] = await Promise.all([
      getLatestNews(4),
      getActiveNotices(4),
      getAllPrograms(),
      getPageBySlug('about'),
      getFacultiesWithDepartments()
    ]);

    let targetedDbResults = '';
    let liveWebResults = '';

    const isNonSearch = isConversationalOrMath(lastUserMessage);

    // Step 2: Database-First Search (Supabase)
    if (!isNonSearch && lastUserMessage.length > 2) {
      targetedDbResults = await searchInternalDatabase(lastUserMessage);
    }

    // Step 3: Fallback to Tavily ONLY IF internal database found nothing and query is university-related
    // If the database already answered or query is general, Tavily is completely bypassed
    if (!isNonSearch && !targetedDbResults && lastUserMessage.length > 3) {
      liveWebResults = await searchWebContext(lastUserMessage);
    }

    const dynamicContext = formatContextData(news, notices, programs, aboutPage, faculties);

    const systemPrompt = `You are the EBAUB AI Agent, the official intelligent assistant for EXIM Bank Agricultural University Bangladesh (EBAUB).

UNIVERSITY STATIC CONTEXT:
University Name: EXIM Bank Agricultural University Bangladesh (EBAUB)
Location: 69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh
Email: info@ebaub.edu.bd
Phone: 02-588893525 to 588893529

DYNAMIC RECENT RECORDS:
${dynamicContext}
${targetedDbResults ? `\nTARGETED DATABASE MATCHES:\n${targetedDbResults}` : ''}
${liveWebResults ? `\nLIVE UNIVERSITY SOCIAL MEDIA & ONLINE CONTEXT (OFFICIAL FACEBOOK / WEB):\n${liveWebResults}` : ''}

INSTRUCTIONS:
1. When asked about specific events, festivals, workshops, notices, or news (including from the official Facebook page or portal), use the provided context to answer thoroughly and enthusiastically with dates, venues, themes, and key highlights.
2. For general university queries (programs, admissions, departments, tuition, contact), answer clearly and accurately using the context.
3. For general knowledge or math questions, answer directly and concisely using your native intelligence.
4. FORMATTING: Use clean, human-friendly formatting. Do NOT use raw LaTeX math delimiters like '$' or '$$'. Use bullet points and bold text for easy reading.
5. Always provide an immediate, helpful response.`;

    const result = await streamText({
      model: google('gemini-3.5-flash-lite'),
      system: systemPrompt,
      messages
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
