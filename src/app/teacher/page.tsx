import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTeacherQuizzes } from '@/app/actions/quiz';
import { getTeacherMaterials } from '@/utils/supabase/queries';
import TeacherWelcomeBanner from '@/components/teacher/TeacherWelcomeBanner';
import TeacherStatsGrid from '@/components/teacher/TeacherStatsGrid';
import RecentQuizzesList from '@/components/teacher/RecentQuizzesList';
import RecentMaterialsList from '@/components/teacher/RecentMaterialsList';

export const dynamic = 'force-dynamic';

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=teacher');
  }

  // Concurrently fetch profile details, AI quizzes, and course materials
  const [profileResult, quizzes, materials] = await Promise.all([
    supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        first_name,
        last_name,
        role,
        department_id,
        departments(
          id,
          name,
          code,
          faculties(
            id,
            name
          )
        )
      `)
      .eq('id', user.id)
      .maybeSingle(),
    getTeacherQuizzes(),
    getTeacherMaterials(user.id)
  ]);

  const profile = profileResult.data;

  // Resolve Teacher Display Name
  const resolvedName = 
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    (user.user_metadata?.full_name as string)?.trim() ||
    user.email?.split('@')[0] ||
    'Faculty Member';

  // Resolve Department and Faculty information
  const deptData: any = Array.isArray(profile?.departments) 
    ? profile?.departments[0] 
    : profile?.departments;

  const facultyData: any = deptData?.faculties
    ? (Array.isArray(deptData.faculties) ? deptData.faculties[0] : deptData.faculties)
    : null;

  const departmentName = deptData?.name || '';
  const facultyName = facultyData?.name || '';

  // Aggregate stats
  const quizCount = quizzes.length;
  const publishedQuizCount = quizzes.filter(q => q.status === 'published').length;
  const draftQuizCount = quizzes.filter(q => q.status !== 'published').length;
  const materialCount = materials.length;

  // Compute unique active courses across quizzes and materials
  const distinctCourses = new Set<string>();
  quizzes.forEach(q => {
    if (q.course_code?.trim()) distinctCourses.add(q.course_code.trim().toUpperCase());
  });
  materials.forEach(m => {
    if (m.course_code?.trim()) distinctCourses.add(m.course_code.trim().toUpperCase());
  });
  const courseCount = distinctCourses.size;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Dynamic Personalized Welcome Banner */}
      <TeacherWelcomeBanner 
        teacherName={resolvedName}
        departmentName={departmentName}
        facultyName={facultyName}
        role={profile?.role || ''}
      />

      {/* Live Statistics Grid */}
      <TeacherStatsGrid 
        quizCount={quizCount}
        publishedCount={publishedQuizCount}
        draftCount={draftQuizCount}
        materialCount={materialCount}
        courseCount={courseCount}
      />

      {/* Live AI Quizzes & Exams Section */}
      <RecentQuizzesList quizzes={quizzes} />

      {/* Live Course Materials Section */}
      <RecentMaterialsList materials={materials} />
    </div>
  );
}
