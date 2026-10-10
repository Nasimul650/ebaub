import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 45;

// Schema for Multiple Choice Questions (MCQ)
const mcqItemSchema = z.object({
  question: z.string().describe('The academic question prompt'),
  options: z.array(z.string()).length(4).describe('Exactly four distinct multiple-choice answer options'),
  correctAnswer: z.string().describe('The correct answer verbatim matching one of the four options')
});

const mcqQuizSchema = z.object({
  questions: z.array(mcqItemSchema)
});

// Schema for Short Questions and Creative Questions
const openEndedItemSchema = z.object({
  question: z.string().describe('The question prompt or scenario-based examination question'),
  suggestedAnswer: z.string().describe('Comprehensive model solution, key scoring criteria, or grading rubric for the instructor')
});

const openEndedQuizSchema = z.object({
  questions: z.array(openEndedItemSchema)
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
    const rawType = (body.questionType || body.examType || 'mcq').toString().toLowerCase().trim();
    const questionType = (rawType === 'short' || rawType === 'short_answer') ? 'short_answer' :
                         (rawType === 'creative') ? 'creative' : 'mcq';

    const topic = (body.topic || '').toString().trim();
    const sourceText = (body.sourceText || '').toString().trim();
    const courseCode = (body.courseCode || '').toString().trim();
    const count = Math.min(Math.max(Number(body.count) || (questionType === 'creative' ? 3 : 5), 1), 15);
    const difficulty = (body.difficulty || 'Medium').toString();
    const faculty = (body.faculty || '').toString().trim();

    // Material Attachment Parameters
    const fileUrl = (body.fileUrl || '').toString().trim();
    const fileName = (body.fileName || '').toString().trim();
    const fileType = (body.fileType || '').toString().trim();
    const fileBase64 = (body.fileBase64 || '').toString().trim();

    if (!topic && !sourceText && !fileUrl && !fileBase64) {
      return NextResponse.json(
        { error: 'Please provide a topic, paste source notes, or attach a course material file.' },
        { status: 400 }
      );
    }

    // 3. Resolve attached file buffer if present
    let fileBuffer: Buffer | null = null;
    let effectiveMime = fileType || 'application/pdf';

    if (fileBase64) {
      try {
        const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
        fileBuffer = Buffer.from(cleanBase64, 'base64');
      } catch (err) {
        console.error('Base64 decode error:', err);
      }
    } else if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      try {
        const fileRes = await fetch(fileUrl);
        if (fileRes.ok) {
          const arrBuf = await fileRes.arrayBuffer();
          fileBuffer = Buffer.from(arrBuf);
        }
      } catch (err) {
        console.error('Fetch fileUrl error:', err);
      }
    }

    // 4. Construct Question-Type-Specific Prompt
    let promptInstructions = '';
    let jsonSchemaExample = '';

    if (questionType === 'mcq') {
      promptInstructions = `Create exactly ${count} challenging academic Multiple-Choice Questions (MCQs) for undergraduate university students.
Requirements:
1. Provide exactly 4 plausible, distinct options per question. Distractors must represent common academic misconceptions.
2. The "correctAnswer" must match one of the 4 options verbatim.
3. No trivial options like "All of the above" or "None of the above".`;
      jsonSchemaExample = `{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}`;
    } else if (questionType === 'short_answer') {
      promptInstructions = `Create exactly ${count} academic Short Answer Questions suitable for 3 to 5 marks each in a university examination.
Requirements:
1. Test deep conceptual understanding, definitions, differences, biological/computational mechanisms, or concise derivations.
2. For each question, provide a detailed "suggestedAnswer" containing bullet points, key keywords, and a clear grading rubric indicating how full marks should be awarded.`;
      jsonSchemaExample = `{
  "questions": [
    {
      "question": "Differentiate between X and Y with relevant examples. (4 Marks)",
      "suggestedAnswer": "Key Scoring Criteria: 1) Definition of X (1 mark); 2) Definition of Y (1 mark); 3) Contrast of mechanisms (1 mark); 4) Relevant real-world examples (1 mark)."
    }
  ]
}`;
    } else {
      // Creative / Scenario-Based Questions
      promptInstructions = `Create exactly ${count} higher-order Creative / Scenario-Based Examination Questions (Bloom's Taxonomy: Analysis, Evaluation, Synthesis) for university students.
Requirements:
1. Provide a realistic scenario, problem statement, agricultural case, business problem, or technical codebase challenge as a stem.
2. Follow the stem with structured analytical sub-questions (e.g., Part a: Conceptual/Recall [2 marks], Part b: Application to the scenario [4 marks], Part c: Evaluation/Critical recommendation [4 marks]).
3. For each question, provide a comprehensive "suggestedAnswer" detailing the complete solution, evaluation points, and instructor grading rubric.`;
      jsonSchemaExample = `{
  "questions": [
    {
      "question": "Stem / Scenario: [Detailed case description]...\\n\\na) Define the primary phenomenon described. (2 Marks)\\nb) Analyze why the condition occurred under the given parameters. (4 Marks)\\nc) Formulate a remedial strategy and evaluate its long-term viability. (4 Marks)",
      "suggestedAnswer": "Grading Rubric & Model Solution: a) Model definition... [2m]; b) Analysis of cause-and-effect... [4m]; c) Comprehensive recommendation with viability trade-offs... [4m]."
    }
  ]
}`;
    }

    const basePrompt = `You are a distinguished university professor designing an official academic examination.
Exam Type: ${questionType.toUpperCase()}
${faculty ? `Faculty Division: ${faculty}` : ''}
${courseCode ? `Course Code: ${courseCode}` : ''}
${topic ? `Topic / Subject Matter: ${topic}` : ''}
${fileName ? `Attached Course Material Document: ${fileName}` : ''}
Difficulty Level: ${difficulty}

${sourceText ? `Source Lecture Material / Topic Guidance:\n"""\n${sourceText}\n"""\n` : ''}

${promptInstructions}

${fileBuffer ? 'Base your questions strictly on the concepts, formulas, case examples, and data in the attached course material document.' : 'Ensure the exam questions are intellectually rigorous, clear, and unambiguous.'}`;

    // Candidate models
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ];

    let resultQuestions: any[] | null = null;
    let lastError: any = null;

    // A) If a file buffer is attached (PDF), use multimodal generateText
    if (fileBuffer && effectiveMime.includes('pdf')) {
      for (const modelName of candidateModels) {
        try {
          const textResult = await generateText({
            model: google(modelName),
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `${basePrompt}
You MUST reply with raw JSON only (no markdown fences, no explanatory text).
Format strictly matching:
${jsonSchemaExample}`
                  },
                  {
                    type: 'file',
                    mimeType: effectiveMime,
                    data: fileBuffer
                  }
                ]
              }
            ]
          });

          const rawText = textResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedJson = JSON.parse(rawText);

          if (questionType === 'mcq') {
            const validated = mcqQuizSchema.parse(parsedJson);
            if (validated.questions.length > 0) {
              resultQuestions = validated.questions;
              break;
            }
          } else {
            const validated = openEndedQuizSchema.parse(parsedJson);
            if (validated.questions.length > 0) {
              resultQuestions = validated.questions;
              break;
            }
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    // B) Text-based generation with generateObject (for MCQ or open-ended)
    if (!resultQuestions) {
      for (const modelName of candidateModels) {
        try {
          if (questionType === 'mcq') {
            const objectResult = await generateObject({
              model: google(modelName),
              output: 'array',
              schema: mcqItemSchema,
              prompt: `${basePrompt}\n\nCRITICAL: Return an array where each item has "question", "options" (array of 4 strings), and "correctAnswer" (verbatim match).`
            });
            if (Array.isArray(objectResult.object) && objectResult.object.length > 0) {
              const validated = mcqQuizSchema.parse({ questions: objectResult.object });
              resultQuestions = validated.questions;
              break;
            }
          } else {
            const objectResult = await generateObject({
              model: google(modelName),
              output: 'array',
              schema: openEndedItemSchema,
              prompt: `${basePrompt}\n\nCRITICAL: Return an array where each item has "question" (string) and "suggestedAnswer" (string model solution & grading rubric).`
            });
            if (Array.isArray(objectResult.object) && objectResult.object.length > 0) {
              const validated = openEndedQuizSchema.parse({ questions: objectResult.object });
              resultQuestions = validated.questions;
              break;
            }
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    // C) Text fallback with JSON parsing
    if (!resultQuestions) {
      for (const modelName of candidateModels) {
        try {
          const textResult = await generateText({
            model: google(modelName),
            prompt: `${basePrompt}
You MUST reply with raw JSON only (no markdown fences, no explanatory text).
Format strictly matching:
${jsonSchemaExample}`
          });

          const rawText = textResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedJson = JSON.parse(rawText);

          if (questionType === 'mcq') {
            const validated = mcqQuizSchema.parse(parsedJson);
            if (validated.questions.length > 0) {
              resultQuestions = validated.questions;
              break;
            }
          } else {
            const validated = openEndedQuizSchema.parse(parsedJson);
            if (validated.questions.length > 0) {
              resultQuestions = validated.questions;
              break;
            }
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    if (!resultQuestions || resultQuestions.length === 0) {
      console.error('Quiz Generation Error:', lastError);
      return NextResponse.json(
        { error: 'Failed to generate examination questions. Please check your source material and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      questionType,
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
