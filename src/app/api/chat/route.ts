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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const [news, notices, programs, aboutPage, faculties] = await Promise.all([
      getLatestNews(3),
      getActiveNotices(3),
      getAllPrograms(),
      getPageBySlug('about'),
      getFacultiesWithDepartments()
    ]);

    const dynamicContext = formatContextData(news, notices, programs, aboutPage, faculties);

    const systemPrompt = `You are the EBAUB AI Agent, the official assistant for EXIM Bank Agricultural University Bangladesh.

INSTRUCTIONS:
1. For general university questions (programs, faculties, campus info, admissions), answer DIRECTLY from the DYNAMIC CONTEXT below — do NOT call any tool.
2. ONLY use the search_internal_database tool when you need to look up a SPECIFIC person (e.g. a faculty member's name), a SPECIFIC notice title, or other precise details NOT covered in the context below.
3. If search_internal_database returns no results AND you need more info, use search_web with 'site:https://ebaub.ac.bd/# or site:https://www.facebook.com/ebaub.chapai' appended.
4. For general knowledge or math questions, answer directly and concisely.
5. FORMATTING: Use clean, human-friendly formatting. Do NOT use LaTeX math delimiters like '$' or '$$' (write math expressions naturally like '1 + 2 = 3'). Use bullet points and bold headers neatly.
6. Always respond immediately with your answer.

STATIC CONTEXT:\nUniversity Name: EXIM Bank Agricultural University Bangladesh (EBAUB)\nLocation: 69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh\nEmail: info@ebaub.edu.bd\nPhone: 02-588893525 to 588893529

DYNAMIC RECENT CONTEXT:
${dynamicContext}
`;

    const result = await streamText({
      model: google('gemini-3.5-flash-lite'),
      system: systemPrompt,
      messages,
      maxSteps: 5,
      tools: {
        search_internal_database: tool({
          description: "Searches the official EBAUB university database for news, notices, faculty, and programs.",
          parameters: z.object({
            query: z.string().describe("The search query (e.g. name of a faculty member, notice keyword, program)"),
          }),
          execute: async ({ query }) => {
            const supabase = await createClient();
            const term = `%${query}%`;
            
            const [newsRes, noticesRes, facultyRes, programsRes] = await Promise.all([
              supabase.from('news').select('id, title, summary').or(`title.ilike.${term},summary.ilike.${term}`).limit(3),
              supabase.from('notices').select('id, title, description, category').or(`title.ilike.${term},category.ilike.${term}`).limit(3),
              supabase.from('faculty_members').select('id, name, title, bio').or(`name.ilike.${term},title.ilike.${term},bio.ilike.${term}`).limit(3),
              supabase.from('programs').select('id, name, degree_level').or(`name.ilike.${term},degree_level.ilike.${term}`).limit(3),
            ]);

            return {
              news: newsRes.data || [],
              notices: noticesRes.data || [],
              faculty: facultyRes.data || [],
              programs: programsRes.data || []
            };
          }
        }),
        search_web: tool({
          description: "Searches the live internet for recent information if the internal database fails.",
          parameters: z.object({
            query: z.string().describe("The search query to look up on the web"),
          }),
          execute: async ({ query }) => {
            try {
              const res = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  api_key: process.env.TAVILY_API_KEY || 'default',
                  query: query,
                  search_depth: 'basic'
                })
              });
              
              if (!res.ok) {
                return { error: 'Web search unavailable due to rate limit or missing API key.', query };
              }
              
              const data = await res.json();
              return { results: data.results || [] };
            } catch (error) {
              return { error: 'Web search unavailable.', query };
            }
          }
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
