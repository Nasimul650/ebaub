'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type GeneratedQuestionInput = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type SaveQuizInput = {
  course_code: string;
  title: string;
  questions: GeneratedQuestionInput[];
};

/**
 * Server Action: saveGeneratedQuiz
 * Saves an AI-generated quiz and all its child questions to Supabase
 */
export async function saveGeneratedQuiz(quizData: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required. Please sign in to save your quiz.' };
    }

    // Secondary Role Guard: Strictly Teachers and Admins
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role || user.user_metadata?.role || '').toString().toUpperCase();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only faculty members and administrators can save quizzes.' };
    }

    // Validate Input Payload
    const courseCode = (quizData?.course_code || quizData?.courseCode || '').toString().trim().toUpperCase();
    const title = (quizData?.title || '').toString().trim();
    const rawQuestions = Array.isArray(quizData?.questions) ? quizData.questions : [];

    if (!courseCode) {
      return { success: false, error: 'Course code is required (e.g. CSE-301).' };
    }
    if (!title) {
      return { success: false, error: 'Quiz title is required.' };
    }
    if (rawQuestions.length === 0) {
      return { success: false, error: 'At least one question is required to save a quiz.' };
    }

    // Validate questions structure
    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      const qText = (q.question || q.question_text || '').toString().trim();
      const options: string[] = Array.isArray(q.options) 
        ? q.options.map((opt: any) => opt.toString().trim()) 
        : [];
      const correctAns = (q.correctAnswer || q.correct_answer || '').toString().trim();

      if (!qText) {
        return { success: false, error: `Question ${i + 1} must not be blank.` };
      }
      if (options.length !== 4 || options.some((opt: string) => !opt)) {
        return { success: false, error: `Question ${i + 1} must contain exactly 4 non-empty options.` };
      }
      if (!correctAns || !options.includes(correctAns)) {
        return { 
          success: false, 
          error: `Question ${i + 1} has an invalid correct answer. It must match one of the 4 options.` 
        };
      }
    }

    // Step 1: Insert parent record into `quizzes`
    const { data: insertedQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        teacher_id: user.id,
        course_code: courseCode,
        title: title,
      })
      .select('id, course_code, title, created_at')
      .single();

    if (quizError) {
      console.error('Insert Quiz Error:', quizError);
      if (quizError.message?.includes('quizzes') || quizError.code === '42P01') {
        return {
          success: false,
          error: 'The "quizzes" table has not been initialized in Supabase yet. Please execute migration 0016_quizzes_schema.sql in the Supabase SQL Editor.'
        };
      }
      return { success: false, error: quizError.message || 'Failed to save quiz record.' };
    }

    // Step 2: Insert child records into `quiz_questions`
    const questionsPayload = rawQuestions.map((q: any) => {
      const qText = (q.question || q.question_text || '').toString().trim();
      const options = q.options.map((opt: any) => opt.toString().trim());
      const correctAns = (q.correctAnswer || q.correct_answer || '').toString().trim();
      return {
        quiz_id: insertedQuiz.id,
        question_text: qText,
        options: options,
        correct_answer: correctAns,
      };
    });

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsPayload);

    if (questionsError) {
      console.error('Insert Quiz Questions Error:', questionsError);
      // Rollback parent record
      await supabase.from('quizzes').delete().eq('id', insertedQuiz.id);
      return { 
        success: false, 
        error: questionsError.message || 'Failed to save quiz questions to the database.' 
      };
    }

    // Step 3: Revalidate dashboard and quiz routes
    revalidatePath('/teacher/quizzes');
    revalidatePath('/teacher/quizzes/new');
    revalidatePath('/teacher');
    revalidatePath('/teacher/ai');

    return {
      success: true,
      quizId: insertedQuiz.id,
      message: `Quiz "${title}" (${courseCode}) with ${rawQuestions.length} questions was successfully saved to your course question bank!`
    };

  } catch (error: any) {
    console.error('saveGeneratedQuiz Exception:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while saving the quiz.'
    };
  }
}

/**
 * Server Action: getTeacherQuizzes
 * Returns all quizzes created by the current authenticated teacher
 */
export async function getTeacherQuizzes() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        id,
        course_code,
        title,
        created_at,
        quiz_questions (
          id,
          question_text,
          options,
          correct_answer
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getTeacherQuizzes Error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getTeacherQuizzes Exception:', err);
    return [];
  }
}

/**
 * Server Action: deleteQuiz
 * Deletes a quiz and cascades to all child questions
 */
export async function deleteQuiz(quizId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/teacher/quizzes');
    revalidatePath('/teacher');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete quiz.' };
  }
}
