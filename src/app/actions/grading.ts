'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface TeacherOverviewStats {
  totalExamsPublished: number;
  totalSubmissionsReceived: number;
  averageScore: number | null;
  pendingGradingCount: number;
  recentExams: Array<{
    id: string;
    course_code: string;
    title: string;
    exam_type: string;
    status: string;
    created_at: string;
    question_count: number;
    submissions_count: number;
    pending_grading_count: number;
  }>;
}

export interface StudentSubmissionItem {
  id: string;
  quiz_id: string;
  student_id: string;
  student_name: string;
  institutional_id: string;
  email: string;
  department_name: string;
  score: number | null;
  total_questions: number;
  submitted_at: string;
  status: 'Needs Grading' | 'Graded' | 'Auto-Graded';
}

export interface QuestionGradingDetail {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[] | null;
  correct_answer?: string | null;
  suggested_answer?: string | null;
  grading_rubric?: string | null;
  student_answer: string;
  is_correct: boolean | null;
}

export interface SubmissionDetailsResponse {
  success: boolean;
  submission?: {
    id: string;
    quiz_id: string;
    student_id: string;
    score: number | null;
    total_questions: number;
    submitted_at: string;
    feedback?: string | null;
  };
  quiz?: {
    id: string;
    course_code: string;
    title: string;
    exam_type: string;
  };
  student?: {
    id: string;
    full_name: string;
    institutional_id: string;
    email: string;
    department_name: string;
  };
  questions?: QuestionGradingDetail[];
  error?: string;
}

/**
 * 1. Fetch high-level analytics for teacher overview
 */
export async function getTeacherOverviewStats(teacherId?: string): Promise<{
  success: boolean;
  stats?: TeacherOverviewStats;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    // Check user role
    const { data: profile } = await admin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role || '').toUpperCase();
    const isAdmin = role === 'ADMIN';
    const effectiveTeacherId = teacherId || user.id;

    // Fetch exams created by teacher (or all exams if admin)
    let quizQuery = admin
      .from('quizzes')
      .select(`
        id,
        course_code,
        title,
        status,
        exam_type,
        created_at,
        teacher_id,
        quiz_questions (
          id
        )
      `)
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      quizQuery = quizQuery.eq('teacher_id', effectiveTeacherId);
    }

    const { data: quizzes, error: qErr } = await quizQuery;

    if (qErr) {
      console.error('getTeacherOverviewStats quiz error:', qErr);
      return { success: false, error: qErr.message };
    }

    const teacherQuizzes = quizzes || [];
    const publishedQuizzes = teacherQuizzes.filter((q) => q.status === 'published');
    const quizIds = publishedQuizzes.map((q) => q.id);

    // 2. Fetch all submissions (both from official exam_submissions and fallback study_sessions)
    let allSubmissions: Array<{
      id: string;
      quiz_id: string;
      student_id: string;
      score: number | null;
      total_questions: number;
      submitted_at: string;
      exam_type?: string;
    }> = [];

    // Attempt official exam_submissions
    try {
      if (quizIds.length > 0) {
        const { data: officialSubs } = await admin
          .from('exam_submissions')
          .select('id, quiz_id, student_id, score, total_questions, submitted_at')
          .in('quiz_id', quizIds);

        if (officialSubs && officialSubs.length > 0) {
          allSubmissions = [...officialSubs];
        }
      }
    } catch {
      // Ignore if table not yet migrated
    }

    // Attempt fallback study_sessions storage
    try {
      const { data: fallbackSubs } = await admin
        .from('study_sessions')
        .select('id, title, notes_content, created_at')
        .like('title', '__EXAM_SUBMISSION__:%');

      if (fallbackSubs && fallbackSubs.length > 0) {
        for (const row of fallbackSubs) {
          try {
            const qId = row.title.replace('__EXAM_SUBMISSION__:', '').trim();
            if (quizIds.includes(qId)) {
              const parsed = JSON.parse(row.notes_content);
              // Avoid duplicate if already found in official table
              const exists = allSubmissions.some((s) => s.id === row.id || (s.quiz_id === qId && s.student_id === parsed.student_id));
              if (!exists) {
                allSubmissions.push({
                  id: row.id,
                  quiz_id: qId,
                  student_id: parsed.student_id,
                  score: parsed.score ?? null,
                  total_questions: parsed.total_questions ?? 0,
                  submitted_at: parsed.submitted_at || row.created_at,
                });
              }
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch {
      // Ignore
    }

    // 3. Map submissions per quiz
    const quizSubMap = new Map<string, typeof allSubmissions>();
    for (const sub of allSubmissions) {
      const list = quizSubMap.get(sub.quiz_id) || [];
      list.push(sub);
      quizSubMap.set(sub.quiz_id, list);
    }

    // 4. Calculate analytics
    let totalSubmissionsCount = allSubmissions.length;
    let totalScoresSum = 0;
    let gradedSubmissionsCount = 0;
    let pendingGradingCount = 0;

    const quizExamTypeMap = new Map<string, string>();
    publishedQuizzes.forEach((q) => quizExamTypeMap.set(q.id, q.exam_type || 'mcq'));

    for (const sub of allSubmissions) {
      const qType = quizExamTypeMap.get(sub.quiz_id) || 'mcq';
      const isMcq = qType === 'mcq';

      if (typeof sub.score === 'number' && sub.total_questions > 0) {
        totalScoresSum += (sub.score / sub.total_questions) * 100;
        gradedSubmissionsCount += 1;
      } else if (!isMcq && sub.score === null) {
        pendingGradingCount += 1;
      }
    }

    const averageScore = gradedSubmissionsCount > 0
      ? Math.round(totalScoresSum / gradedSubmissionsCount)
      : null;

    // 5. Build recent exams summary table items
    const recentExams = publishedQuizzes.slice(0, 10).map((q) => {
      const subs = quizSubMap.get(q.id) || [];
      const isMcq = (q.exam_type || 'mcq') === 'mcq';
      const pendingCount = subs.filter((s) => !isMcq && s.score === null).length;
      const qCount = Array.isArray(q.quiz_questions) ? q.quiz_questions.length : 0;

      return {
        id: q.id,
        course_code: q.course_code,
        title: q.title,
        exam_type: q.exam_type || 'mcq',
        status: q.status,
        created_at: q.created_at,
        question_count: qCount,
        submissions_count: subs.length,
        pending_grading_count: pendingCount,
      };
    });

    return {
      success: true,
      stats: {
        totalExamsPublished: publishedQuizzes.length,
        totalSubmissionsReceived: totalSubmissionsCount,
        averageScore,
        pendingGradingCount,
        recentExams,
      },
    };
  } catch (err: any) {
    console.error('getTeacherOverviewStats exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Fetch all submissions for a specific exam with student profile details
 */
export async function getExamSubmissions(quizId: string): Promise<{
  success: boolean;
  quiz?: {
    id: string;
    course_code: string;
    title: string;
    exam_type: string;
    status: string;
    created_at: string;
    question_count: number;
  };
  submissions: StudentSubmissionItem[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, submissions: [], error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    // Verify instructor / admin role
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role || '').toUpperCase();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { success: false, submissions: [], error: 'Permission denied: Only faculty members can view submissions.' };
    }

    // 1. Fetch quiz info
    const { data: quiz, error: quizError } = await admin
      .from('quizzes')
      .select(`
        id,
        course_code,
        title,
        status,
        exam_type,
        created_at,
        teacher_id,
        quiz_questions (
          id
        )
      `)
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return { success: false, submissions: [], error: 'Exam not found' };
    }

    // Teachers can only view submissions for their own quizzes
    if (role === 'TEACHER' && quiz.teacher_id !== user.id) {
      return { success: false, submissions: [], error: 'Permission denied: You can only view submissions for your own exams.' };
    }

    const questionCount = Array.isArray(quiz.quiz_questions) ? quiz.quiz_questions.length : 0;

    // 2. Fetch submissions from official exam_submissions and fallback study_sessions
    const rawSubs: Array<{
      id: string;
      quiz_id: string;
      student_id: string;
      score: number | null;
      total_questions: number;
      submitted_at: string;
    }> = [];

    try {
      const { data: officialSubs } = await admin
        .from('exam_submissions')
        .select('id, quiz_id, student_id, score, total_questions, submitted_at')
        .eq('quiz_id', quizId)
        .order('submitted_at', { ascending: false });

      if (officialSubs && officialSubs.length > 0) {
        rawSubs.push(...officialSubs);
      }
    } catch {
      // Table fallback
    }

    try {
      const { data: fallbackSubs } = await admin
        .from('study_sessions')
        .select('id, title, notes_content, created_at')
        .like('title', `__EXAM_SUBMISSION__:${quizId}`)
        .order('created_at', { ascending: false });

      if (fallbackSubs && fallbackSubs.length > 0) {
        for (const row of fallbackSubs) {
          try {
            const parsed = JSON.parse(row.notes_content);
            const exists = rawSubs.some((s) => s.id === row.id || s.student_id === parsed.student_id);
            if (!exists) {
              rawSubs.push({
                id: row.id,
                quiz_id: quizId,
                student_id: parsed.student_id,
                score: parsed.score ?? null,
                total_questions: parsed.total_questions ?? questionCount,
                submitted_at: parsed.submitted_at || row.created_at,
              });
            }
          } catch {
            // Ignore
          }
        }
      }
    } catch {
      // Ignore
    }

    // 3. Fetch student profiles
    const studentIds = Array.from(new Set(rawSubs.map((s) => s.student_id).filter(Boolean)));
    const profileMap = new Map<string, any>();
    const deptMap = new Map<string, string>();

    if (studentIds.length > 0) {
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, full_name, first_name, last_name, email, institutional_id, username, department_id, batch')
        .in('id', studentIds);

      (profiles || []).forEach((p) => profileMap.set(p.id, p));

      // Fetch department names
      const deptIds = Array.from(new Set((profiles || []).map((p) => p.department_id).filter(Boolean)));
      if (deptIds.length > 0) {
        const { data: depts } = await admin
          .from('departments')
          .select('id, name')
          .in('id', deptIds);

        (depts || []).forEach((d) => deptMap.set(d.id, d.name));
      }
    }

    // 4. Construct final items
    const isMcq = (quiz.exam_type || 'mcq') === 'mcq';

    const submissions: StudentSubmissionItem[] = rawSubs.map((sub) => {
      const p = profileMap.get(sub.student_id);
      const studentName =
        p?.full_name?.trim() ||
        (p?.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : '') ||
        p?.email?.split('@')[0] ||
        'Student';

      const institutionalId =
        p?.institutional_id?.trim() ||
        p?.username?.trim() ||
        (p?.batch ? `Batch ${p.batch}` : 'N/A');

      const departmentName = deptMap.get(p?.department_id) || 'General';

      let status: 'Needs Grading' | 'Graded' | 'Auto-Graded' = 'Needs Grading';
      if (typeof sub.score === 'number') {
        status = isMcq ? 'Auto-Graded' : 'Graded';
      } else if (isMcq) {
        status = 'Auto-Graded';
      }

      return {
        id: sub.id,
        quiz_id: sub.quiz_id,
        student_id: sub.student_id,
        student_name: studentName,
        institutional_id: institutionalId,
        email: p?.email || '',
        department_name: departmentName,
        score: sub.score,
        total_questions: sub.total_questions || questionCount,
        submitted_at: sub.submitted_at,
        status,
      };
    });

    return {
      success: true,
      quiz: {
        id: quiz.id,
        course_code: quiz.course_code,
        title: quiz.title,
        exam_type: quiz.exam_type || 'mcq',
        status: quiz.status,
        created_at: quiz.created_at,
        question_count: questionCount,
      },
      submissions,
    };
  } catch (err: any) {
    console.error('getExamSubmissions exception:', err);
    return { success: false, submissions: [], error: err.message };
  }
}

/**
 * 3. Fetch detailed submission paper for review and manual grading
 */
export async function getSubmissionDetails(submissionId: string): Promise<SubmissionDetailsResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    let subRecord: any = null;
    let fallbackAnswers: any[] | null = null;
    let fallbackFeedback: string | null = null;

    // 1. Try official exam_submissions
    try {
      const { data: officialSub } = await admin
        .from('exam_submissions')
        .select('*')
        .eq('id', submissionId)
        .maybeSingle();

      if (officialSub) {
        subRecord = officialSub;
      }
    } catch {
      // Table fallback
    }

    // 2. Try fallback in study_sessions
    if (!subRecord) {
      try {
        const { data: fbRow } = await admin
          .from('study_sessions')
          .select('id, title, notes_content, created_at')
          .eq('id', submissionId)
          .maybeSingle();

        if (fbRow && fbRow.notes_content) {
          const parsed = JSON.parse(fbRow.notes_content);
          subRecord = {
            id: fbRow.id,
            quiz_id: parsed.quiz_id || fbRow.title.replace('__EXAM_SUBMISSION__:', '').trim(),
            student_id: parsed.student_id,
            score: parsed.score ?? null,
            total_questions: parsed.total_questions ?? 0,
            submitted_at: parsed.submitted_at || fbRow.created_at,
          };
          fallbackAnswers = parsed.answers || [];
          fallbackFeedback = parsed.feedback || null;
        }
      } catch {
        // Ignore
      }
    }

    if (!subRecord) {
      return { success: false, error: 'Submission record not found.' };
    }

    // 3. Fetch quiz info
    const { data: quiz, error: quizErr } = await admin
      .from('quizzes')
      .select('id, course_code, title, exam_type, teacher_id')
      .eq('id', subRecord.quiz_id)
      .single();

    if (quizErr || !quiz) {
      return { success: false, error: 'Associated exam not found.' };
    }

    // Verify instructor / admin or submission owner role
    const { data: callerProfile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const callerRole = (callerProfile?.role || '').toUpperCase();
    const isOwnerTeacher = (callerRole === 'TEACHER' || callerRole === 'ADMIN') && (quiz.teacher_id === user.id || (quiz as any).creator_id === user.id || callerRole === 'ADMIN');
    const isStudentOwner = subRecord.student_id === user.id;

    if (!isOwnerTeacher && !isStudentOwner) {
      return { success: false, error: 'Permission denied: You do not have permission to view this submission.' };
    }

    // 4. Fetch student profile
    const { data: studentProfile } = await admin
      .from('profiles')
      .select('id, full_name, first_name, last_name, email, institutional_id, username, department_id, batch')
      .eq('id', subRecord.student_id)
      .maybeSingle();

    let deptName = 'General';
    if (studentProfile?.department_id) {
      const { data: dept } = await admin
        .from('departments')
        .select('name')
        .eq('id', studentProfile.department_id)
        .maybeSingle();
      if (dept) deptName = dept.name;
    }

    const studentName =
      studentProfile?.full_name?.trim() ||
      (studentProfile?.first_name ? `${studentProfile.first_name} ${studentProfile.last_name || ''}`.trim() : '') ||
      studentProfile?.email?.split('@')[0] ||
      'Student';

    const institutionalId =
      studentProfile?.institutional_id?.trim() ||
      studentProfile?.username?.trim() ||
      (studentProfile?.batch ? `Batch ${studentProfile.batch}` : 'N/A');

    // 5. Fetch quiz questions
    const { data: questions, error: qErr } = await admin
      .from('quiz_questions')
      .select('id, question_type, question_text, options, correct_answer, suggested_answer, grading_rubric')
      .eq('quiz_id', subRecord.quiz_id);

    if (qErr) {
      return { success: false, error: 'Failed to load exam questions.' };
    }

    // 6. Fetch student answers
    let studentAnswersMap = new Map<string, { student_answer: string; is_correct: boolean | null }>();

    if (fallbackAnswers && Array.isArray(fallbackAnswers)) {
      fallbackAnswers.forEach((ans: any) => {
        studentAnswersMap.set(ans.question_id, {
          student_answer: ans.student_answer || '',
          is_correct: ans.is_correct ?? null,
        });
      });
    } else {
      try {
        const { data: officialAnswers } = await admin
          .from('exam_answers')
          .select('question_id, student_answer, is_correct')
          .eq('submission_id', subRecord.id);

        (officialAnswers || []).forEach((ans: any) => {
          studentAnswersMap.set(ans.question_id, {
            student_answer: ans.student_answer || '',
            is_correct: ans.is_correct ?? null,
          });
        });
      } catch {
        // Table fallback
      }
    }

    // 7. Combine questions with student answers
    const questionDetails: QuestionGradingDetail[] = (questions || []).map((q: any) => {
      const ans = studentAnswersMap.get(q.id);
      return {
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type || quiz.exam_type || 'mcq',
        options: Array.isArray(q.options) ? q.options : null,
        correct_answer: q.correct_answer || null,
        suggested_answer: q.suggested_answer || null,
        grading_rubric: q.grading_rubric || null,
        student_answer: ans?.student_answer || '',
        is_correct: ans?.is_correct ?? null,
      };
    });

    return {
      success: true,
      submission: {
        id: subRecord.id,
        quiz_id: subRecord.quiz_id,
        student_id: subRecord.student_id,
        score: subRecord.score ?? null,
        total_questions: subRecord.total_questions || questionDetails.length,
        submitted_at: subRecord.submitted_at,
        feedback: fallbackFeedback,
      },
      quiz: {
        id: quiz.id,
        course_code: quiz.course_code,
        title: quiz.title,
        exam_type: quiz.exam_type || 'mcq',
      },
      student: {
        id: studentProfile?.id || subRecord.student_id,
        full_name: studentName,
        institutional_id: institutionalId,
        email: studentProfile?.email || '',
        department_name: deptName,
      },
      questions: questionDetails,
    };
  } catch (err: any) {
    console.error('getSubmissionDetails exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. Server Action: updateSubmissionScore
 * Allows teachers to manually override or finalize the total score and feedback for a submission
 */
export async function updateSubmissionScore(
  submissionId: string,
  manualScore: number,
  feedback?: string
): Promise<{
  success: boolean;
  submissionId?: string;
  score?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please log in as an instructor.' };
    }

    const admin = createAdminClient();

    // Verify instructor / admin role
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role || '').toUpperCase();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { success: false, error: 'Permission denied: Only faculty members can grade submissions.' };
    }

    if (typeof manualScore !== 'number' || isNaN(manualScore) || manualScore < 0) {
      return { success: false, error: 'Score must be a non-negative number.' };
    }

    // Verify instructor assignment / ownership
    if (role !== 'ADMIN') {
      const { data: sub } = await admin
        .from('exam_submissions')
        .select('quiz_id')
        .eq('id', submissionId)
        .maybeSingle();

      if (sub?.quiz_id) {
        const { data: quiz } = await admin
          .from('quizzes')
          .select('teacher_id')
          .eq('id', sub.quiz_id)
          .maybeSingle();

        if (quiz && quiz.teacher_id && quiz.teacher_id !== user.id) {
          return { success: false, error: 'Not authorized to grade this course: You are not the assigned instructor.' };
        }
      }
    }

    let updated = false;
    let targetQuizId = '';

    // 1. Try updating official exam_submissions table
    try {
      const { data: officialRow, error: officialErr } = await admin
        .from('exam_submissions')
        .update({
          score: manualScore,
        })
        .eq('id', submissionId)
        .select('id, quiz_id')
        .maybeSingle();

      if (!officialErr && officialRow) {
        updated = true;
        targetQuizId = officialRow.quiz_id;
      }
    } catch {
      // Table fallback
    }

    // 2. Try updating fallback study_sessions table
    try {
      const { data: fallbackRow } = await admin
        .from('study_sessions')
        .select('id, title, notes_content')
        .eq('id', submissionId)
        .maybeSingle();

      if (fallbackRow && fallbackRow.notes_content) {
        const parsed = JSON.parse(fallbackRow.notes_content);
        parsed.score = manualScore;
        if (feedback !== undefined) {
          parsed.feedback = feedback.trim();
        }
        parsed.graded_at = new Date().toISOString();
        parsed.graded_by = user.id;

        const { error: updateErr } = await admin
          .from('study_sessions')
          .update({
            notes_content: JSON.stringify(parsed),
          })
          .eq('id', submissionId);

        if (!updateErr) {
          updated = true;
          targetQuizId = parsed.quiz_id || fallbackRow.title.replace('__EXAM_SUBMISSION__:', '').trim();
        }
      }
    } catch {
      // Ignore
    }

    if (!updated) {
      return { success: false, error: 'Submission not found or could not be updated.' };
    }

    // Revalidate paths for real-time dashboard sync
    revalidatePath('/teacher/overview');
    if (targetQuizId) {
      revalidatePath(`/teacher/quizzes/${targetQuizId}/submissions`);
      revalidatePath(`/student/exams/${targetQuizId}/results`);
    }
    revalidatePath('/student/exams');

    return {
      success: true,
      submissionId,
      score: manualScore,
    };
  } catch (err: any) {
    console.error('updateSubmissionScore exception:', err);
    return { success: false, error: err.message };
  }
}
