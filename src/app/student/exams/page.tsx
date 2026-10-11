import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getOfficialPublishedExams, getStudentPracticeQuizzes } from '@/app/actions/exam';
import StudentExamDashboardClient from '@/components/student/exams/StudentExamDashboardClient';

export const dynamic = 'force-dynamic';

export default async function StudentExamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle();

  const studentName =
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    user.email?.split('@')[0] ||
    'Student';

  // Fetch official exams and practice arena quizzes
  const [officialResult, { quizzes: practiceQuizzes = [] }] = await Promise.all([
    getOfficialPublishedExams(),
    getStudentPracticeQuizzes(),
  ]);

  const officialExams = officialResult.exams || [];
  const studentFaculty = officialResult.studentFaculty || '';
  const studentDepartment = officialResult.studentDepartment || '';

  return (
    <div className="py-2">
      <StudentExamDashboardClient
        officialExams={officialExams}
        practiceQuizzes={practiceQuizzes}
        studentName={studentName}
        studentFaculty={studentFaculty}
        studentDepartment={studentDepartment}
      />
    </div>
  );
}
