'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: gradeExamSubmission
 * Dedicated action for grading exam submissions with teacher/admin assignment verification.
 */
export async function gradeExamSubmission(
  submissionId: string,
  score: number,
  feedback?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Authentication required.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = (profile?.role || '').toUpperCase();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Only faculty members can grade exams.' };
    }

    const admin = createAdminClient();

    // Verify instructor is assigned to course / created the quiz
    if (role !== 'ADMIN') {
      const { data: sub } = await admin
        .from('exam_submissions')
        .select('quiz_id')
        .eq('id', submissionId)
        .single();

      if (sub?.quiz_id) {
        const { data: quiz } = await admin
          .from('quizzes')
          .select('created_by, teacher_id')
          .eq('id', sub.quiz_id)
          .single();

        const isAssigned = quiz?.created_by === user.id || quiz?.teacher_id === user.id;
        if (!isAssigned) {
          return { success: false, error: 'Not authorized to grade this exam: You are not the assigned instructor.' };
        }
      }
    }

    const { error: updateErr } = await admin
      .from('exam_submissions')
      .update({
        score,
        ...(feedback !== undefined ? { feedback } : {}),
      })
      .eq('id', submissionId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath('/teacher/quizzes');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to grade submission.' };
  }
}
