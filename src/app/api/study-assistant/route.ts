import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { messages, studentName, departmentName } = await req.json();

    const resolvedStudentName = (studentName || 'Student').trim();
    const resolvedDeptName = (departmentName || 'General Studies').trim();

    const systemPrompt = `You are the official EBAUB AI Study Assistant. You are currently tutoring ${resolvedStudentName}, a student in the ${resolvedDeptName} department. Your goal is to explain academic concepts clearly, help them prepare for exams, and act as a Socratic tutor (ask guiding questions rather than just giving the answer). Use the search_materials tool if they ask about specific course files.

GUIDELINES:
1. Explain academic concepts clearly with relevant real-world examples and step-by-step logic.
2. Ask probing, Socratic follow-up questions to help ${resolvedStudentName} think through problems rather than immediately giving final answers.
3. When searching course materials, mention the course code and exact document title so the student can easily identify and access them.
4. Format responses cleanly using GitHub-flavored Markdown (headings, lists, bold keywords, and code blocks where applicable).`;

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
      maxSteps: 3,
      tools: {
        search_materials: tool({
          description: "Searches the student's university course materials for relevant PDFs, syllabi, and lecture notes based on a topic or course code.",
          parameters: z.object({
            query: z.string().describe("The search query, topic, keyword, or course code to find course materials for")
          }),
          execute: async ({ query }: { query: string }) => {
            try {
              const supabase = await createClient();
              const q = (query || '').trim();

              let dbQuery = supabase
                .from('course_materials')
                .select(`
                  id,
                  title,
                  course_code,
                  file_name,
                  file_url,
                  created_at,
                  course_material_departments (
                    department_id,
                    departments (
                      id,
                      name
                    )
                  )
                `);

              if (q) {
                const term = `%${q}%`;
                dbQuery = dbQuery.or(`title.ilike.${term},course_code.ilike.${term},file_name.ilike.${term}`);
              }

              const { data, error } = await dbQuery
                .order('created_at', { ascending: false })
                .limit(6);

              if (error) {
                console.error('search_materials tool error:', error);
                return {
                  query,
                  found: 0,
                  materials: [],
                  message: 'Could not fetch course materials from database.'
                };
              }

              const rawMaterials = data || [];

              // Map materials into clean response
              const materials = rawMaterials.map((m: any) => ({
                title: m.title,
                course_code: m.course_code,
                file_name: m.file_name,
                file_url: m.file_url,
              }));

              return {
                query,
                found: materials.length,
                materials
              };
            } catch (err: any) {
              console.error('search_materials execution error:', err);
              return {
                query,
                found: 0,
                materials: [],
                error: err?.message || 'Unexpected search error'
              };
            }
          }
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Study Assistant API Exception:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error processing study tutor query.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
