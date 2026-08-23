import { google } from '@ai-sdk/google';
import { streamText, Message } from 'ai';
import { 
  getLatestNews, 
  getActiveNotices, 
  getFacultiesWithDepartments,
  getAdmissionsData
} from '@/utils/supabase/queries';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch brief contextual data to inject into the system prompt
    const [news, notices, faculties, admissions] = await Promise.all([
      getLatestNews(3),
      getActiveNotices(3),
      getFacultiesWithDepartments(),
      getAdmissionsData()
    ]);

    // Build context string
    const contextStr = `
CURRENT EBAUB CONTEXT:
---
Recent News: ${news.map(n => n.title).join(' | ')}
Recent Notices: ${notices.map(n => n.title).join(' | ')}
Faculties: ${faculties.map(f => f.name).join(', ')}
---
`;

    const systemPrompt = `You are the official AI Assistant for EXIM Bank Agricultural University Bangladesh (EBAUB).
Your role is to assist prospective students, current students, and visitors with information about the university.

Strict Rules:
1. Be concise, professional, and helpful.
2. ALWAYS use the provided context to answer questions accurately.
3. If a user asks a question completely unrelated to EBAUB, education, or academia, politely decline to answer.
4. If you don't know the exact answer, recommend they check the "Admissions" or "Notices" page, or contact the university at info@ebaub.edu.bd.
5. Do NOT hallucinate policies or dates that are not in your context.

${contextStr}
`;

    // Initiate streaming using Vercel AI SDK
    const result = await streamText({
      model: google('gemini-3.5-flash-lite'), // Using the requested 3.5 flash-lite model
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
