import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getCourseMaterialsForStudent } from '@/utils/supabase/queries';
import { getStudySessions } from '@/app/actions/study-hub';
import StudyHubDashboardClient from '@/components/student/study-hub/StudyHubDashboardClient';

export const dynamic = 'force-dynamic';

export default async function StudyHubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  // Fetch student profile and department
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      first_name,
      last_name,
      role,
      department_id,
      departments (
        id,
        name
      )
    `)
    .eq('id', user.id)
    .maybeSingle();

  const studentName =
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    user.email?.split('@')[0] ||
    'Student';

  const deptData: any = Array.isArray(profile?.departments)
    ? profile?.departments[0]
    : profile?.departments;

  const departmentName = deptData?.name || 'General Studies';

  // Fetch student's accessible course materials uploaded by professors
  const materials = await getCourseMaterialsForStudent({
    studentDeptId: profile?.department_id || undefined,
  });

  // Fetch student's existing study sessions
  const { sessions = [] } = await getStudySessions();

  return (
    <div className="py-2">
      <StudyHubDashboardClient
        initialSessions={sessions}
        materials={materials}
        studentName={studentName}
        departmentName={departmentName}
      />
    </div>
  );
}
