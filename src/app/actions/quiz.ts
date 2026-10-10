'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type QuestionType = 'mcq' | 'short_answer' | 'creative';
export type QuizStatus = 'draft' | 'published';

export type QuestionInput = {
  id?: string;
  question: string;
  question_type?: QuestionType;
  options?: string[];
  correctAnswer?: string;
  correct_answer?: string;
  suggestedAnswer?: string;
  suggested_answer?: string;
  grading_rubric?: string;
};

export type SaveQuizInput = {
  id?: string;
  course_code: string;
  title: string;
  status?: QuizStatus;
  exam_type?: QuestionType;
  questions: QuestionInput[];
};

/**
 * Server Action: saveGeneratedQuiz
 * Saves an AI-generated quiz/exam and all its child questions to Supabase
 */
export async function saveGeneratedQuiz(quizData: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required. Please sign in to save your exam.' };
    }

    // Role Guard: Strictly Teachers and Admins
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role || user.user_metadata?.role || '').toString().toUpperCase();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only faculty members and administrators can save exams.' };
    }

    // Validate Input Payload
    const courseCode = (quizData?.course_code || quizData?.courseCode || '').toString().trim().toUpperCase();
    const title = (quizData?.title || '').toString().trim();
    const rawStatus: QuizStatus = (quizData?.status === 'published') ? 'published' : 'draft';
    const examType: QuestionType = (quizData?.exam_type || quizData?.questionType || 'mcq') as QuestionType;
    const rawQuestions: any[] = Array.isArray(quizData?.questions) ? quizData.questions : [];

    if (!courseCode) {
      return { success: false, error: 'Course code is required (e.g. CSE-1201).' };
    }
    if (!title) {
      return { success: false, error: 'Exam title is required.' };
    }
    if (rawQuestions.length === 0) {
      return { success: false, error: 'At least one question is required to save an exam.' };
    }

    // Validate questions structure based on examType
    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      const qText = (q.question || q.question_text || '').toString().trim();
      const qType = q.question_type || q.questionType || examType;

      if (!qText) {
        return { success: false, error: `Question ${i + 1} prompt must not be blank.` };
      }

      // If MCQ, enforce 4 options and valid correct answer
      if (qType === 'mcq') {
        const options: string[] = Array.isArray(q.options) 
          ? q.options.map((opt: any) => opt.toString().trim()) 
          : [];
        const correctAns = (q.correctAnswer || q.correct_answer || '').toString().trim();

        if (options.length !== 4 || options.some((opt: string) => !opt)) {
          return { success: false, error: `Question ${i + 1} (MCQ) must contain exactly 4 non-empty options.` };
        }
        if (!correctAns || !options.includes(correctAns)) {
          return { 
            success: false, 
            error: `Question ${i + 1} has an invalid correct answer. It must match one of the 4 options.` 
          };
        }
      }
    }

    // Step 1: Insert parent record into `quizzes`
    const { data: insertedQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        teacher_id: user.id,
        course_code: courseCode,
        title: title,
        status: rawStatus,
        exam_type: examType,
      })
      .select('id, course_code, title, status, exam_type, created_at')
      .single();

    if (quizError) {
      console.error('Insert Exam Error:', quizError);
      if (quizError.message?.includes('quizzes') || quizError.code === '42P01') {
        return {
          success: false,
          error: 'The "quizzes" table has not been initialized in Supabase yet. Please execute migration 0017_exam_generator_upgrade.sql in the Supabase SQL Editor.'
        };
      }
      return { success: false, error: quizError.message || 'Failed to save exam record.' };
    }

    // Step 2: Insert child records into `quiz_questions`
    const questionsPayload = rawQuestions.map((q: any) => {
      const qText = (q.question || q.question_text || '').toString().trim();
      const qType = q.question_type || q.questionType || examType;
      const isMcq = qType === 'mcq';

      const options = isMcq && Array.isArray(q.options) 
        ? q.options.map((opt: any) => opt.toString().trim()) 
        : null;
      const correctAns = isMcq 
        ? (q.correctAnswer || q.correct_answer || '').toString().trim() 
        : null;
      const suggestedAns = (q.suggestedAnswer || q.suggested_answer || q.grading_rubric || '').toString().trim() || null;

      return {
        quiz_id: insertedQuiz.id,
        question_type: qType,
        question_text: qText,
        options: options,
        correct_answer: correctAns,
        suggested_answer: suggestedAns,
        grading_rubric: suggestedAns,
      };
    });

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsPayload);

    if (questionsError) {
      console.error('Insert Exam Questions Error:', questionsError);
      await supabase.from('quizzes').delete().eq('id', insertedQuiz.id);
      return { 
        success: false, 
        error: questionsError.message || 'Failed to save exam questions to the database.' 
      };
    }

    // Step 3: Revalidate paths
    revalidatePath('/teacher/quizzes');
    revalidatePath('/teacher/quizzes/new');
    revalidatePath('/teacher');

    const statusLabel = rawStatus === 'published' ? 'Published' : 'Saved as Draft';
    return {
      success: true,
      quizId: insertedQuiz.id,
      status: rawStatus,
      message: `Exam "${title}" (${courseCode}) successfully ${statusLabel.toLowerCase()} with ${rawQuestions.length} questions!`
    };

  } catch (error: any) {
    console.error('saveGeneratedQuiz Exception:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while saving the exam.'
    };
  }
}

/**
 * Server Action: updateQuiz
 * Updates an existing exam record and replaces its questions
 */
export async function updateQuiz(quizId: string, quizData: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Please sign in.' };
    }

    const courseCode = (quizData?.course_code || quizData?.courseCode || '').toString().trim().toUpperCase();
    const title = (quizData?.title || '').toString().trim();
    const rawStatus: QuizStatus = (quizData?.status === 'published') ? 'published' : 'draft';
    const examType: QuestionType = (quizData?.exam_type || quizData?.questionType || 'mcq') as QuestionType;
    const rawQuestions: any[] = Array.isArray(quizData?.questions) ? quizData.questions : [];

    if (!courseCode || !title || rawQuestions.length === 0) {
      return { success: false, error: 'Course code, title, and at least one question are required.' };
    }

    // Update parent quiz
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({
        course_code: courseCode,
        title: title,
        status: rawStatus,
        exam_type: examType
      })
      .eq('id', quizId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Replace child questions: Delete old questions
    await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);

    // Insert updated questions
    const questionsPayload = rawQuestions.map((q: any) => {
      const qText = (q.question || q.question_text || '').toString().trim();
      const qType = q.question_type || q.questionType || examType;
      const isMcq = qType === 'mcq';

      const options = isMcq && Array.isArray(q.options) 
        ? q.options.map((opt: any) => opt.toString().trim()) 
        : null;
      const correctAns = isMcq 
        ? (q.correctAnswer || q.correct_answer || '').toString().trim() 
        : null;
      const suggestedAns = (q.suggestedAnswer || q.suggested_answer || q.grading_rubric || '').toString().trim() || null;

      return {
        quiz_id: quizId,
        question_type: qType,
        question_text: qText,
        options: options,
        correct_answer: correctAns,
        suggested_answer: suggestedAns,
        grading_rubric: suggestedAns,
      };
    });

    const { error: insertQuestionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsPayload);

    if (insertQuestionsError) {
      return { success: false, error: insertQuestionsError.message };
    }

    revalidatePath('/teacher/quizzes');
    revalidatePath(`/teacher/quizzes/${quizId}/edit`);
    revalidatePath(`/teacher/quizzes/${quizId}/print`);
    revalidatePath('/teacher');

    return {
      success: true,
      quizId,
      status: rawStatus,
      message: `Exam "${title}" successfully updated!`
    };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update exam.' };
  }
}

/**
 * Server Action: toggleQuizStatus
 * Flips an exam status between 'draft' and 'published'
 */
export async function toggleQuizStatus(quizId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get current status
    const { data: quiz, error: fetchErr } = await supabase
      .from('quizzes')
      .select('id, status, title')
      .eq('id', quizId)
      .single();

    if (fetchErr || !quiz) {
      return { success: false, error: 'Exam not found.' };
    }

    const nextStatus: QuizStatus = quiz.status === 'published' ? 'draft' : 'published';

    const { error: updateErr } = await supabase
      .from('quizzes')
      .update({ status: nextStatus })
      .eq('id', quizId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath('/teacher/quizzes');
    revalidatePath('/teacher');

    return { 
      success: true, 
      status: nextStatus,
      message: `Exam "${quiz.title}" is now ${nextStatus === 'published' ? 'Published' : 'Draft'}.` 
    };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to toggle status.' };
  }
}

/**
 * Server Action: getTeacherQuizzes
 * Returns all quizzes/exams created by the current authenticated teacher
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
        status,
        exam_type,
        created_at,
        quiz_questions (
          id,
          question_type,
          question_text,
          options,
          correct_answer,
          suggested_answer,
          grading_rubric
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
 * Server Action: getQuizById
 * Fetches single exam with all questions for Editing or Print views
 */
export async function getQuizById(quizId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        id,
        course_code,
        title,
        status,
        exam_type,
        created_at,
        quiz_questions (
          id,
          question_type,
          question_text,
          options,
          correct_answer,
          suggested_answer,
          grading_rubric
        )
      `)
      .eq('id', quizId)
      .single();

    if (error || !data) {
      console.error('getQuizById Error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('getQuizById Exception:', err);
    return null;
  }
}

/**
 * Server Action: deleteQuiz
 * Deletes an exam and cascades to all child questions
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
