'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface ExamQuestionForStudent {
  id: string;
  question_type: string;
  question_text: string;
  options?: string[] | null;
}

export interface ExamSummary {
  id: string;
  course_code: string;
  title: string;
  status: string;
  exam_type: string;
  is_practice: boolean;
  created_at: string;
  question_count: number;
  submission_status: 'Not Started' | 'Completed' | 'Graded';
  score?: number | null;
  total_questions?: number | null;
  latest_submission_id?: string | null;
  teacher_name?: string;
  teacher_id?: string;
  faculty_name?: string;
  department_name?: string;
}

const FACULTY_COURSE_PREFIX_MAP: Record<string, string[]> = {
  agriculture: ['AG', 'AGRON', 'SOIL', 'HORT', 'ENTO', 'PATH', 'AGEC'],
  cse: ['CSE', 'EEE', 'SWE', 'MATH', 'PHY', 'CHEM'],
  business: ['BBA', 'FIN', 'MKT', 'ACT', 'MGT', 'HRM', 'BUS', 'ACC', 'ECO'],
  law: ['LAW', 'JUR', 'CIV', 'CON', 'CRIM', 'LL'],
};

const FACULTY_UUID_MAP: Record<string, string> = {
  '31a61ba5-5059-4f9e-97a5-b5aba92aab65': 'agriculture',
  '2c1f667a-34f7-4416-8563-134ed350359e': 'cse',
  'e795fc21-a58d-4f18-9bbd-6ca9ebfd8dec': 'business',
  'ce7a6e67-6659-4b12-9078-daa2f36e6c92': 'law',
};

/**
 * Helper to fetch student submissions from both exam_submissions table and fallback study_sessions storage
 */
async function getStudentSubmissionsMap(admin: any, studentId: string): Promise<Map<string, any>> {
  const subMap = new Map<string, any>();

  // 1. Try from official exam_submissions table
  try {
    const { data: subs, error: subError } = await admin
      .from('exam_submissions')
      .select('id, quiz_id, score, total_questions, submitted_at')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (!subError && subs) {
      for (const sub of subs) {
        if (!subMap.has(sub.quiz_id)) {
          subMap.set(sub.quiz_id, sub);
        }
      }
    }
  } catch {
    // Ignore schema cache errors
  }

  // 2. Also check fallback storage in study_sessions table
  try {
    const { data: fallbackSubs } = await admin
      .from('study_sessions')
      .select('id, title, notes_content, created_at')
      .eq('student_id', studentId)
      .like('title', '__EXAM_SUBMISSION__:%')
      .order('created_at', { ascending: false });

    if (fallbackSubs && fallbackSubs.length > 0) {
      for (const fs of fallbackSubs) {
        try {
          const quizId = fs.title.replace('__EXAM_SUBMISSION__:', '').trim();
          if (!subMap.has(quizId) && fs.notes_content) {
            const parsed = JSON.parse(fs.notes_content);
            subMap.set(quizId, {
              id: fs.id,
              quiz_id: quizId,
              score: parsed.score ?? null,
              total_questions: parsed.total_questions ?? null,
              submitted_at: parsed.submitted_at || fs.created_at,
            });
          }
        } catch {
          // ignore corrupted JSON
        }
      }
    }
  } catch {
    // Ignore
  }

  return subMap;
}

/**
 * Check whether a quiz aligns with a student's faculty and department
 */
function isQuizAlignedWithStudent(
  quiz: { course_code?: string; teacher_id?: string },
  studentFacultyKey: string | null,
  studentFacultyId: string | null,
  studentDeptId: string | null,
  teacher: { faculty_id?: string | null; department_id?: string | null } | null | undefined
): boolean {
  // If student has no faculty and no department assigned, show all exams
  if (!studentFacultyId && !studentDeptId) return true;

  // Direct department match
  if (studentDeptId && teacher?.department_id && studentDeptId === teacher.department_id) {
    return true;
  }

  // Direct teacher faculty match
  if (studentFacultyId && teacher?.faculty_id && studentFacultyId === teacher.faculty_id) {
    return true;
  }

  const rawCourse = (quiz.course_code || '').trim().toUpperCase();
  if (!rawCourse) return true;

  // Check which faculty the course code belongs to
  let courseBelongsToFaculty: string | null = null;
  for (const [fKey, prefixes] of Object.entries(FACULTY_COURSE_PREFIX_MAP)) {
    if (prefixes.some((p) => rawCourse.startsWith(p) || rawCourse.includes(p))) {
      courseBelongsToFaculty = fKey;
      break;
    }
  }

  if (courseBelongsToFaculty && studentFacultyKey) {
    return courseBelongsToFaculty === studentFacultyKey;
  }

  // If teacher has a known faculty that differs from student, exclude
  if (teacher?.faculty_id && studentFacultyId && teacher.faculty_id !== studentFacultyId) {
    return false;
  }

  return true;
}

/**
 * Fetch official published exams for students
 */
export async function getOfficialPublishedExams(): Promise<{
  success: boolean;
  exams: ExamSummary[];
  studentFaculty?: string;
  studentDepartment?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, exams: [], error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    // 1. Fetch current student's profile for faculty and department filtering
    const { data: studentProfile } = await admin
      .from('profiles')
      .select('id, department_id, faculty_id, role')
      .eq('id', user.id)
      .maybeSingle();

    let studentFacultyName = '';
    let studentDeptName = '';
    const studentFacultyId = studentProfile?.faculty_id || null;
    const studentDeptId = studentProfile?.department_id || null;
    const studentFacultyKey = studentFacultyId ? (FACULTY_UUID_MAP[studentFacultyId] || null) : null;

    if (studentFacultyId) {
      const { data: fac } = await admin
        .from('faculties')
        .select('name')
        .eq('id', studentFacultyId)
        .maybeSingle();
      studentFacultyName = fac?.name || '';
    }

    if (studentDeptId) {
      const { data: dept } = await admin
        .from('departments')
        .select('name')
        .eq('id', studentDeptId)
        .maybeSingle();
      studentDeptName = dept?.name || '';
    }

    // 2. Query published quizzes using admin client
    const { data: quizzes, error: quizError } = await admin
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
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (quizError) {
      console.warn('getOfficialPublishedExams quizError:', quizError.message);
      return { success: true, exams: [] };
    }

    // Filter out exams created by the student themselves (those are practice quizzes)
    const officialCandidateQuizzes = (quizzes || []).filter(
      (q: any) => q.teacher_id !== user.id && !q.is_practice
    );

    // 3. Fetch instructor/teacher profiles for teacher names and department/faculty alignment
    const teacherIds = Array.from(
      new Set(officialCandidateQuizzes.map((q: any) => q.teacher_id).filter(Boolean))
    );

    const teacherMap = new Map<string, any>();
    if (teacherIds.length > 0) {
      const { data: teacherProfiles } = await admin
        .from('profiles')
        .select('id, full_name, email, department_id, faculty_id')
        .in('id', teacherIds);

      (teacherProfiles || []).forEach((t: any) => {
        teacherMap.set(t.id, t);
      });
    }

    // 4. Fetch student submissions (both official and fallback)
    const subMap = await getStudentSubmissionsMap(admin, user.id);

    // 5. Filter official exams by student's faculty & department
    const alignedQuizzes = officialCandidateQuizzes.filter((q: any) => {
      const teacher = teacherMap.get(q.teacher_id);
      return isQuizAlignedWithStudent(q, studentFacultyKey, studentFacultyId, studentDeptId, teacher);
    });

    const exams: ExamSummary[] = alignedQuizzes.map((q: any) => {
      const sub = subMap.get(q.id);
      const isCompleted = Boolean(sub);
      const qCount = Array.isArray(q.quiz_questions) ? q.quiz_questions.length : 0;
      const teacher = teacherMap.get(q.teacher_id);
      const teacherName = teacher?.full_name?.trim() || teacher?.email?.split('@')[0] || 'Faculty Instructor';

      let submissionStatus: 'Not Started' | 'Completed' | 'Graded' = 'Not Started';
      if (isCompleted) {
        submissionStatus = (q.exam_type === 'mcq' && typeof sub.score === 'number') ? 'Graded' : 'Completed';
      }

      return {
        id: q.id,
        course_code: q.course_code,
        title: q.title,
        status: q.status,
        exam_type: q.exam_type || 'mcq',
        is_practice: false,
        created_at: q.created_at,
        question_count: qCount,
        submission_status: submissionStatus,
        score: sub?.score ?? null,
        total_questions: sub?.total_questions ?? qCount,
        latest_submission_id: sub?.id ?? null,
        teacher_name: teacherName,
        teacher_id: q.teacher_id,
        faculty_name: studentFacultyName,
        department_name: studentDeptName,
      };
    });

    return {
      success: true,
      exams,
      studentFaculty: studentFacultyName,
      studentDepartment: studentDeptName,
    };
  } catch (err: any) {
    console.error('getOfficialPublishedExams exception:', err);
    return { success: false, exams: [], error: err.message };
  }
}

/**
 * Fetch practice quizzes generated by the student
 */
export async function getStudentPracticeQuizzes(): Promise<{
  success: boolean;
  quizzes: ExamSummary[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, quizzes: [], error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    // Query quizzes created by the current user
    let data: any[] = [];
    const { data: userQuizzes, error: quizError } = await admin
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
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });

    if (!quizError && userQuizzes) {
      data = userQuizzes;
    }

    // Fetch student's submissions for practice tests (both official and fallback)
    const subMap = await getStudentSubmissionsMap(admin, user.id);

    const summaries: ExamSummary[] = data.map((q: any) => {
      const sub = subMap.get(q.id);
      const isCompleted = Boolean(sub);
      const qCount = Array.isArray(q.quiz_questions) ? q.quiz_questions.length : 0;

      return {
        id: q.id,
        course_code: q.course_code,
        title: q.title,
        status: q.status,
        exam_type: q.exam_type || 'mcq',
        is_practice: true,
        created_at: q.created_at,
        question_count: qCount,
        submission_status: isCompleted ? 'Completed' : 'Not Started',
        score: sub?.score ?? null,
        total_questions: sub?.total_questions ?? qCount,
        latest_submission_id: sub?.id ?? null,
        teacher_name: 'Self-Generated Practice',
      };
    });

    return { success: true, quizzes: summaries };
  } catch (err: any) {
    console.error('getStudentPracticeQuizzes exception:', err);
    return { success: false, quizzes: [], error: err.message };
  }
}

/**
 * Fetch exam for student taking mode (securely strips correct_answer & suggested_answer)
 */
export async function getExamForTaking(quizId: string): Promise<{
  success: boolean;
  quiz?: any;
  questions?: ExamQuestionForStudent[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Please sign in to take this exam.' };
    }

    const admin = createAdminClient();

    // 1. Fetch quiz meta using admin client
    const { data: quiz, error: quizError } = await admin
      .from('quizzes')
      .select('id, course_code, title, status, exam_type, created_at')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return { success: false, error: 'Exam not found.' };
    }

    // 2. Fetch questions securely - omitting correct_answer and suggested_answer to prevent cheating
    const { data: questions, error: questionsError } = await admin
      .from('quiz_questions')
      .select('id, question_type, question_text, options')
      .eq('quiz_id', quizId);

    if (questionsError) {
      return { success: false, error: 'Failed to load exam questions.' };
    }

    return {
      success: true,
      quiz: {
        ...quiz,
        is_practice: (quiz as any).is_practice || false,
      },
      questions: (questions || []).map((q: any) => ({
        id: q.id,
        question_type: q.question_type || 'mcq',
        question_text: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
      })),
    };
  } catch (err: any) {
    console.error('getExamForTaking exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submit exam answers, perform server-side auto-grading for MCQs, and record submission
 */
export async function submitExam(
  quizId: string,
  answers: Record<string, string>
): Promise<{
  success: boolean;
  submissionId?: string;
  score?: number;
  total?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please log in to submit your exam.' };
    }

    const admin = createAdminClient();

    // 1. Fetch true questions with correct answers from DB securely on server
    const { data: questions, error: qErr } = await admin
      .from('quiz_questions')
      .select('id, question_type, correct_answer')
      .eq('quiz_id', quizId);

    if (qErr || !questions || questions.length === 0) {
      return { success: false, error: 'Unable to evaluate exam questions.' };
    }

    let calculatedScore = 0;
    let mcqCount = 0;

    const answersToInsert: Array<{
      question_id: string;
      student_answer: string;
      is_correct: boolean | null;
    }> = [];

    // Evaluate answers
    for (const q of questions) {
      const studentAns = (answers[q.id] || '').trim();
      const isMcq = (q.question_type || 'mcq').toLowerCase() === 'mcq';

      let isCorrect: boolean | null = null;

      if (isMcq) {
        mcqCount += 1;
        const normalizedCorrect = (q.correct_answer || '').trim().toLowerCase();
        const normalizedStudent = studentAns.toLowerCase();

        // Exact or trimmed match
        if (studentAns && normalizedCorrect && normalizedCorrect === normalizedStudent) {
          isCorrect = true;
          calculatedScore += 1;
        } else {
          isCorrect = false;
        }
      }

      answersToInsert.push({
        question_id: q.id,
        student_answer: studentAns,
        is_correct: isCorrect,
      });
    }

    const finalScore = mcqCount > 0 ? calculatedScore : null;

    // 2. Try inserting into official exam_submissions table
    let submissionId = `sub-${Date.now()}`;
    let writeSuccess = false;

    try {
      const { data: submission, error: subError } = await admin
        .from('exam_submissions')
        .insert({
          quiz_id: quizId,
          student_id: user.id,
          score: finalScore,
          total_questions: questions.length,
        })
        .select('id')
        .single();

      if (!subError && submission) {
        submissionId = submission.id;
        writeSuccess = true;

        // Bulk insert into exam_answers
        if (answersToInsert.length > 0) {
          const answersPayload = answersToInsert.map((a) => ({
            submission_id: submission.id,
            question_id: a.question_id,
            student_answer: a.student_answer,
            is_correct: a.is_correct,
          }));

          await admin.from('exam_answers').insert(answersPayload);
        }
      }
    } catch (e: any) {
      console.warn('exam_submissions write attempt caught:', e?.message);
    }

    // 3. Fallback persistence in study_sessions if exam_submissions is not yet migrated
    if (!writeSuccess) {
      try {
        const fallbackPayload = {
          quiz_id: quizId,
          student_id: user.id,
          score: finalScore,
          total_questions: questions.length,
          answers: answersToInsert,
          submitted_at: new Date().toISOString(),
        };

        const { data: fallbackRow, error: fbErr } = await admin
          .from('study_sessions')
          .insert({
            student_id: user.id,
            title: `__EXAM_SUBMISSION__:${quizId}`,
            notes_content: JSON.stringify(fallbackPayload),
          })
          .select('id')
          .single();

        if (!fbErr && fallbackRow) {
          submissionId = fallbackRow.id;
          writeSuccess = true;
        }
      } catch (fbErr: any) {
        console.error('Fallback submission persistence caught:', fbErr?.message);
      }
    }

    revalidatePath('/student/exams');
    revalidatePath(`/student/exams/${quizId}/results`);

    return {
      success: true,
      submissionId,
      score: calculatedScore,
      total: questions.length,
    };
  } catch (err: any) {
    console.error('submitExam exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get detailed submission results with questions, student answers, and correct answers
 */
export async function getExamSubmissionResults(quizId: string, submissionId?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const admin = createAdminClient();

    // 1. Fetch submission record (from exam_submissions or fallback study_sessions)
    let subData: any = null;
    let fallbackAnswers: any[] | null = null;

    try {
      let subQuery = admin
        .from('exam_submissions')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('student_id', user.id);

      if (submissionId && !submissionId.startsWith('temp-') && !submissionId.startsWith('sub-')) {
        subQuery = subQuery.eq('id', submissionId);
      } else {
        subQuery = subQuery.order('submitted_at', { ascending: false }).limit(1);
      }

      const { data } = await subQuery.maybeSingle();
      subData = data;
    } catch {
      // Table fallback
    }

    // Check fallback in study_sessions if subData is null
    if (!subData) {
      try {
        let fbQuery = admin
          .from('study_sessions')
          .select('id, title, notes_content, created_at')
          .eq('student_id', user.id)
          .like('title', `__EXAM_SUBMISSION__:${quizId}`);

        if (submissionId && !submissionId.startsWith('temp-') && !submissionId.startsWith('sub-')) {
          fbQuery = fbQuery.eq('id', submissionId);
        } else {
          fbQuery = fbQuery.order('created_at', { ascending: false }).limit(1);
        }

        const { data: fbRow } = await fbQuery.maybeSingle();
        if (fbRow && fbRow.notes_content) {
          const parsed = JSON.parse(fbRow.notes_content);
          subData = {
            id: fbRow.id,
            quiz_id: quizId,
            student_id: user.id,
            score: parsed.score ?? null,
            total_questions: parsed.total_questions ?? 0,
            submitted_at: parsed.submitted_at || fbRow.created_at,
          };
          fallbackAnswers = parsed.answers || [];
        }
      } catch {
        // Fallback error
      }
    }

    // Default submission record if neither found
    if (!subData) {
      subData = {
        id: submissionId || `sub-${Date.now()}`,
        quiz_id: quizId,
        student_id: user.id,
        score: null,
        total_questions: 0,
        submitted_at: new Date().toISOString(),
      };
    }

    // 2. Fetch quiz details
    const { data: quiz } = await admin
      .from('quizzes')
      .select('id, course_code, title, exam_type')
      .eq('id', quizId)
      .single();

    // 3. Fetch questions with solutions
    const { data: questions } = await admin
      .from('quiz_questions')
      .select('id, question_type, question_text, options, correct_answer, suggested_answer, grading_rubric')
      .eq('quiz_id', quizId);

    // 4. Fetch student's answers
    let answers: any[] = [];
    if (fallbackAnswers && Array.isArray(fallbackAnswers)) {
      answers = fallbackAnswers;
    } else {
      try {
        const { data: ansData } = await admin
          .from('exam_answers')
          .select('question_id, student_answer, is_correct')
          .eq('submission_id', subData.id);
        answers = ansData || [];
      } catch {
        // Fallback
      }
    }

    const answerMap = new Map<string, any>();
    (answers || []).forEach((a: any) => {
      answerMap.set(a.question_id, a);
    });

    const evaluatedQuestions = (questions || []).map((q: any) => {
      const studentAnsRecord = answerMap.get(q.id);
      return {
        id: q.id,
        question_type: q.question_type || 'mcq',
        question_text: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer,
        suggested_answer: q.suggested_answer,
        grading_rubric: q.grading_rubric,
        student_answer: studentAnsRecord?.student_answer || '',
        is_correct: studentAnsRecord?.is_correct ?? null,
      };
    });

    return {
      success: true,
      submission: subData,
      quiz: {
        ...quiz,
        is_practice: (quiz as any)?.is_practice || false,
      },
      questions: evaluatedQuestions,
    };
  } catch (err: any) {
    console.error('getExamSubmissionResults exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Save an AI-generated practice quiz for a student
 */
export async function savePracticeExam(examData: {
  courseCode: string;
  title: string;
  examType: string;
  questions: Array<{
    question: string;
    options?: string[];
    correctAnswer?: string;
    suggestedAnswer?: string;
  }>;
}): Promise<{
  success: boolean;
  quizId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Please log in to save your practice exam.' };
    }

    if (!examData.questions || examData.questions.length === 0) {
      return { success: false, error: 'Cannot save an empty quiz.' };
    }

    const admin = createAdminClient();

    let insertedQuiz: any = null;
    let quizError: any = null;

    // Try insert with teacher_id
    const payload = {
      teacher_id: user.id,
      course_code: examData.courseCode || 'PRACTICE',
      title: examData.title || 'AI Practice Quiz',
      status: 'published',
      exam_type: examData.examType || 'mcq',
    };

    const res = await admin
      .from('quizzes')
      .insert(payload)
      .select('id')
      .single();

    if (!res.error && res.data) {
      insertedQuiz = res.data;
    } else {
      quizError = res.error;
    }

    if (quizError || !insertedQuiz) {
      console.error('Save practice exam error:', quizError);
      return { success: false, error: quizError?.message || 'Failed to save practice exam.' };
    }

    // Insert questions
    const questionsPayload = examData.questions.map((q) => ({
      quiz_id: insertedQuiz.id,
      question_type: examData.examType || 'mcq',
      question_text: q.question,
      options: q.options || [],
      correct_answer: q.correctAnswer || null,
      suggested_answer: q.suggestedAnswer || null,
    }));

    const { error: questionsError } = await admin
      .from('quiz_questions')
      .insert(questionsPayload);

    if (questionsError) {
      console.error('Save practice questions error:', questionsError);
      return { success: false, error: 'Failed to insert questions.' };
    }

    revalidatePath('/student/exams');
    return { success: true, quizId: insertedQuiz.id };
  } catch (err: any) {
    console.error('savePracticeExam exception:', err);
    return { success: false, error: err.message };
  }
}
