import { streamText, convertToCoreMessages, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

export const maxDuration = 120;

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
          content: `Hello! I am ${resolvedStudentName} from the ${resolvedDeptName} department. Please introduce yourself as my EBAUB AI Study Assistant.`,
        },
      ];
    }

    // Ensure any user message with attachments but empty content has non-empty text
    validMessages = validMessages.map((m: any) => {
      if (m.role === 'user' && (!m.content || !m.content.trim())) {
        return {
          ...m,
          content: 'Please analyze and explain this attached academic material thoroughly.',
        };
      }
      return m;
    });

    // 2. Build the system prompt
    const systemPrompt = `You are the EBAUB AI Study Assistant — a world-class academic tutor at EXIM Bank Agricultural University Bangladesh (EBAUB).

Student: ${resolvedStudentName}
Department: ${resolvedDeptName}

# YOUR CORE IDENTITY
You are an exceptionally thorough, patient, and brilliant academic tutor. You do NOT give lazy one-paragraph answers. You are known for providing **comprehensive, university-level explanations** that students actually learn from. Think of yourself as the best professor they've ever had — someone who makes complex topics crystal clear.

# RESPONSE QUALITY RULES (CRITICAL — FOLLOW THESE STRICTLY)

1. **BE COMPREHENSIVE**: When a student asks you to solve problems, explain concepts, or create notes — do ALL of them thoroughly. NEVER stop after one example and ask "should I continue?" — that's lazy. Complete the entire request in one response.

2. **GIVE DIRECT ANSWERS**: When a student asks for solutions, provide the **full, working solution** with clear explanations. Do NOT deflect with Socratic questions when they explicitly want answers. Only use Socratic questioning when the student is clearly trying to learn a concept (not when they need homework solutions or notes).

3. **RICH FORMATTING**: Structure every response beautifully:
   - Use **## headings** and **### subheadings** to organize content
   - Use **bold** for key terms, definitions, and important concepts
   - Use \`inline code\` for variable names, function names, keywords
   - Use fenced code blocks with language tags (\`\`\`c, \`\`\`python, \`\`\`java, etc.) for all code
   - Use > blockquotes to cite from uploaded documents
   - Use markdown tables for comparisons, summaries, data
   - Use numbered lists for steps, bullet lists for features/properties
   - Use LaTeX math: $inline$ for inline equations, $$display$$ for display equations on their own line

4. **DOCUMENT ANALYSIS**: When a student uploads a PDF, image, or document:
   - Read the ENTIRE document carefully
   - Address ALL problems/questions/sections, not just the first one
   - For problem sets: solve EVERY problem with full solution, code, and explanation
   - For lecture notes: create organized summaries with key takeaways
   - For syllabi: break down topics, suggest study strategies, highlight exam-relevant sections

5. **CODE QUALITY**: When writing code:
   - Write clean, commented, compilable/runnable code
   - Include sample input/output
   - Explain the logic step-by-step
   - Mention time/space complexity when relevant

6. **MATH & SCIENCE**: 
   - Show complete derivations step-by-step
   - Use proper LaTeX notation
   - Explain each step, don't skip intermediate steps
   - Include diagrams described in text when helpful

7. **DEPTH OVER BREVITY**: A 1000-word thorough answer is always better than a 200-word shallow one. Never sacrifice quality for brevity. Students deserve complete, professional-grade academic content.

# LANGUAGE
- Default to English, but if the student writes in Bangla/Bengali, respond in Bangla using English technical terms.
- Be warm and encouraging but professional.

# WHAT NOT TO DO
- ❌ Do NOT give one-liner answers
- ❌ Do NOT stop after solving one problem when asked to solve many
- ❌ Do NOT ask "Would you like me to continue?" — just continue
- ❌ Do NOT say "Let me know if you want more details" — give all details upfront
- ❌ Do NOT be vague or hand-wavy — be precise and thorough
- ❌ Do NOT refuse to solve problems — you are an academic tutor, solving problems IS your job`;

    // 3. Convert messages to CoreMessages
    const coreMessages = convertToCoreMessages(validMessages);

    // 4. Define the search_materials tool
    const searchMaterialsTool = tool({
      description:
        'Searches the EBAUB university course materials database for relevant PDFs, syllabi, lecture notes, and documents based on a topic, course code, or keyword.',
      parameters: z.object({
        query: z
          .string()
          .describe('The search query — a topic name, course code, or keyword to search for in the course materials database.'),
      }),
      execute: async ({ query }) => {
        try {
          const supabase = await createClient();
          const words = query
            .replace(/[^\w\s-]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length >= 2)
            .slice(0, 6);

          let dbQuery = supabase.from('course_materials').select(`
              id, title, course_code, file_name, file_url, created_at
            `);

          if (words.length > 0) {
            const conditions = words
              .map((w) => `title.ilike.%${w}%,course_code.ilike.%${w}%,file_name.ilike.%${w}%`)
              .join(',');
            dbQuery = dbQuery.or(conditions);
          }

          const { data: materials } = await dbQuery
            .order('created_at', { ascending: false })
            .limit(8);

          if (materials && materials.length > 0) {
            return {
              found: materials.length,
              materials: materials.map((m: any) => ({
                title: m.title,
                course_code: m.course_code,
                file_name: m.file_name,
                file_url: m.file_url,
              })),
            };
          }

          return { found: 0, materials: [] };
        } catch (err) {
          console.warn('search_materials tool error:', err);
          return { found: 0, materials: [], error: 'Database search failed' };
        }
      },
    });

    // 5. Stream response — primary model: gemini-3.8-flash, fallback: gemini-3.5-flash
    try {
      const result = await streamText({
        model: google('gemini-3.8-flash'),
        system: systemPrompt,
        messages: coreMessages,
        tools: {
          search_materials: searchMaterialsTool,
        },
        maxSteps: 4,
        temperature: 0.4,
        maxTokens: 16384,
      });

      return result.toDataStreamResponse();
    } catch (modelErr) {
      console.warn('gemini-3.8-flash failed, falling back to gemini-3.5-flash:', modelErr);
      try {
        const fallbackResult = await streamText({
          model: google('gemini-3.5-flash'),
          system: systemPrompt,
          messages: coreMessages,
          tools: {
            search_materials: searchMaterialsTool,
          },
          maxSteps: 4,
          temperature: 0.4,
          maxTokens: 12000,
        });
        return fallbackResult.toDataStreamResponse();
      } catch (fallbackErr: any) {
        console.error('Fallback model error:', fallbackErr);
        return new Response(
          JSON.stringify({
            error: fallbackErr?.message || 'AI Tutor service temporarily unavailable.',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error: any) {
    console.error('Study Assistant API Exception:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Internal server error processing study tutor query.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

