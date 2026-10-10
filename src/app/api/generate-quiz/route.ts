import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 45;

const questionItemSchema = z.object({
  question: z.string().describe('The academic question prompt'),
  options: z.array(z.string()).length(4).describe('Exactly four distinct multiple-choice answer options'),
  correctAnswer: z.string().describe('The correct answer verbatim matching one of the four options')
});

const quizSchema = z.object({
  questions: z.array(questionItemSchema)
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate caller
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be signed in to generate quizzes.' },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    const body = await req.json();
    const topic = (body.topic || '').toString().trim();
    const sourceText = (body.sourceText || '').toString().trim();
    const courseCode = (body.courseCode || '').toString().trim();
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 15);
    const difficulty = (body.difficulty || 'Medium').toString();

    if (!topic && !sourceText) {
      return NextResponse.json(
        { error: 'Please provide a topic or source material to generate questions.' },
        { status: 400 }
      );
    }

    // 3. Construct Academic Generation Prompt
    const prompt = `You are a distinguished university professor designing an official academic multiple-choice examination.
Create exactly ${count} challenging academic multiple-choice questions for undergraduate university students.

${courseCode ? `Course Code: ${courseCode}` : ''}
${topic ? `Topic / Subject Matter: ${topic}` : ''}
Difficulty Level: ${difficulty}

${sourceText ? `Source Lecture Material / Syllabus Reference:\n"""\n${sourceText}\n"""\n` : ''}

Strict Academic Requirements:
1. Every question must test deep conceptual understanding, critical application, or analytical reasoning. Avoid trivial recall questions.
2. Provide exactly 4 plausible, distinct options per question. Distractors must represent common academic misconceptions.
3. The "correctAnswer" must match one of the 4 options verbatim.
4. Ensure no answer choices like "All of the above" or "None of the above" are used.
5. Provide clear, professional phrasing appropriate for a higher education syllabus.`;

    // 4. Try generating via Vercel AI SDK generateObject
    // Candidate models in order of priority
    const candidateModels = [
      'gemini-1.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ];

    let resultQuestions: z.infer<typeof questionItemSchema>[] | null = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        // Attempt using generateObject with array output
        const objectResult = await generateObject({
          model: google(modelName),
          output: 'array',
          schema: questionItemSchema,
          prompt: `${prompt}\n\nCRITICAL: Provide each item with fields: "question", "options" (array of 4 strings), and "correctAnswer" (string matching one of the options).`
        });

        if (Array.isArray(objectResult.object) && objectResult.object.length > 0) {
          const validated = quizSchema.parse({ questions: objectResult.object });
          resultQuestions = validated.questions;
          break;
        }
      } catch (err: any) {
        lastError = err;
        // Continue to next candidate model if available
      }
    }

    // 5. Fallback: If structured object translation failed, try generateText with JSON schema
    if (!resultQuestions) {
      for (const modelName of ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest']) {
        try {
          const textResult = await generateText({
            model: google(modelName),
            prompt: `${prompt}
You MUST reply with raw JSON only (no markdown fences, no explanatory text).
Format strictly matching:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}`
          });

          const rawText = textResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedJson = JSON.parse(rawText);
          const validated = quizSchema.parse(parsedJson);
          if (validated.questions.length > 0) {
            resultQuestions = validated.questions;
            break;
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    if (!resultQuestions || resultQuestions.length === 0) {
      console.error('Quiz Generation Error:', lastError);
      return NextResponse.json(
        { error: 'Failed to generate quiz questions with AI. Please try adjusting your prompt or topic.' },
        { status: 500 }
      );
    }

    // 6. Return generated JSON matching quizSchema
    return NextResponse.json({
      success: true,
      questions: resultQuestions
    });

  } catch (error: any) {
    console.error('Generate Quiz Route Error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during quiz generation.' },
      { status: 500 }
    );
  }
}
