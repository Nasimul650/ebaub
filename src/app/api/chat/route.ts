import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { 
  getLatestNews, 
  getActiveNotices, 
  getAllPrograms,
  getPageBySlug
} from '@/utils/supabase/queries';

export const maxDuration = 30;

function formatContextData(news: any[], notices: any[], programs: any[], aboutPage: any) {
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

    const [news, notices, programs, aboutPage] = await Promise.all([
      getLatestNews(3),
      getActiveNotices(3),
      getAllPrograms(),
      getPageBySlug('about')
    ]);

    const dynamicContext = formatContextData(news, notices, programs, aboutPage);

    const systemPrompt = `You are the EBAUB AI Assistant. Base your answers ONLY on the provided context below. If the answer is not in the context, politely state that you do not have that information and refer them to info@ebaub.edu.bd.

STATIC CONTEXT:
University Name: EXIM Bank Agricultural University Bangladesh (EBAUB)
Location: 69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh
Email: info@ebaub.edu.bd
Phone: 02-588893525 to 588893529

DYNAMIC CONTEXT:
${dynamicContext}
`;

    const result = await streamText({
      model: google('gemini-3.5-flash-lite'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
