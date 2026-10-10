import { streamText, convertToCoreMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { messages, studentName, departmentName } = await req.json();

    const resolvedStudentName = (studentName || 'Student').trim();
    const resolvedDeptName = (departmentName || 'General Studies').trim();

    // 1. Sanitize incoming messages
    const rawMessages = Array.isArray(messages) ? messages : [];

    // Filter out messages with empty content and no attachments
    let validMessages = rawMessages.filter((m: any) => {
      const hasText = typeof m.content === 'string' && m.content.trim().length > 0;
      const hasAttachments = Array.isArray(m.experimental_attachments) && m.experimental_attachments.length > 0;
      return hasText || hasAttachments;
    });

    // Ensure user turn comes first by stripping leading assistant greetings
    while (validMessages.length > 0 && validMessages[0].role === 'assistant') {
      validMessages.shift();
    }

    // Fallback if empty
    if (validMessages.length === 0) {
      validMessages = [
        {
          role: 'user',
          content: `Hello! I am ${resolvedStudentName} from the ${resolvedDeptName} department. Please introduce yourself as my EBAUB AI Study Assistant.`
        }
      ];
    }

    // Ensure any user message with attachments but empty content has non-empty text
    validMessages = validMessages.map((m: any) => {
      if (m.role === 'user' && (!m.content || !m.content.trim())) {
        return {
          ...m,
          content: 'Please analyze and explain this attached academic material step-by-step.'
        };
      }
      return m;
    });

    // 2. Pre-search relevant university course materials for the student's query
    const lastUserMessage = validMessages.slice().reverse().find((m: any) => m.role === 'user');
    const queryText = (lastUserMessage?.content || '').trim();

    let courseMaterialsContext = '';
    if (queryText.length > 2) {
      try {
        const supabase = await createClient();
        const words = queryText
          .replace(/[^\w\s-]/g, ' ')
          .split(/\s+/)
          .filter((w: string) => w.length >= 3 && !['what', 'how', 'why', 'can', 'you', 'the', 'and', 'this', 'that', 'with', 'help', 'please'].includes(w.toLowerCase()))
          .slice(0, 4);

        let dbQuery = supabase
          .from('course_materials')
          .select(`
            id,
            title,
            course_code,
            file_name,
            file_url,
            created_at
          `);

        if (words.length > 0) {
          const conditions = words.map((w: string) => `title.ilike.%${w}%,course_code.ilike.%${w}%,file_name.ilike.%${w}%`).join(',');
          dbQuery = dbQuery.or(conditions);
        }

        const { data: matchedMaterials } = await dbQuery
          .order('created_at', { ascending: false })
          .limit(5);

        if (matchedMaterials && matchedMaterials.length > 0) {
          courseMaterialsContext = `\n\n--- MATCHING UNIVERSITY COURSE MATERIALS IN EBAUB DATABASE ---\n` +
            matchedMaterials.map((m: any) => `- "${m.title}" | Course: ${m.course_code} | File: ${m.file_name} | Link: ${m.file_url}`).join('\n') +
            `\nWhen answering, if relevant, cite these materials with their title, course code, and download link.`;
        }
      } catch (dbErr) {
        console.warn('Course material lookup error:', dbErr);
      }
    }

    const systemPrompt = `You are the official EBAUB AI Study Assistant at EXIM Bank Agricultural University Bangladesh (EBAUB). You are currently tutoring ${resolvedStudentName}, an enrolled student in the ${resolvedDeptName} department.

Your goal is to explain academic concepts clearly, help them prepare for exams, and act as a Socratic tutor (ask guiding questions rather than just giving the answer).

If the student uploads a document or image, act as a meticulous academic tutor. Break down the provided material line-by-line or concept-by-concept. Use rich formatting: bold key terms, use blockquotes for citing the document, create markdown tables for comparisons, and output LaTeX for any mathematical equations (using $$ for display blocks and $ for inline math). Keep the layout visually pleasing and easy to digest.

GUIDELINES:
1. Explain academic concepts clearly with relevant real-world examples and step-by-step logic.
2. Ask probing, Socratic follow-up questions to help ${resolvedStudentName} think through problems rather than immediately giving final answers.
3. When referencing university course materials, cite the course code, document title, and link.
4. Output LaTeX for any mathematical equations (using $$ for display blocks and $ for inline math).
5. Format code blocks with appropriate language tags for syntax highlighting (e.g. \`\`\`python, \`\`\`cpp, \`\`\`java, \`\`\`sql).${courseMaterialsContext}`;

    // 3. Convert messages to CoreMessages
    const coreMessages = convertToCoreMessages(validMessages);

    // 4. Stream response using gemini-3.5-flash-lite, fallback to gemini-3.5-flash
    try {
      const result = await streamText({
        model: google('gemini-3.5-flash-lite'),
        system: systemPrompt,
        messages: coreMessages,
      });

      return result.toDataStreamResponse();
    } catch (modelErr) {
      console.warn('gemini-3.5-flash-lite failed, falling back to gemini-3.5-flash:', modelErr);
      try {
        const fallbackResult = await streamText({
          model: google('gemini-3.5-flash'),
          system: systemPrompt,
          messages: coreMessages,
        });
        return fallbackResult.toDataStreamResponse();
      } catch (fallbackErr: any) {
        console.error('Fallback model error:', fallbackErr);
        return new Response(
          JSON.stringify({ error: fallbackErr?.message || 'AI Tutor service temporarily unavailable.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error: any) {
    console.error('Study Assistant API Exception:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error processing study tutor query.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

