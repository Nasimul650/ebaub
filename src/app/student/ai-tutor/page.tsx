import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import StudentAiTutorClient from '@/components/student/StudentAiTutorClient';

export const dynamic = 'force-dynamic';

export default async function StudentAiTutorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  // Fetch student's profile and enrolled department
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

  // Fallback checks
  const studentName = 
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    (user.user_metadata?.full_name as string)?.trim() ||
    user.email?.split('@')[0] ||
    'Student';

  const deptData: any = Array.isArray(profile?.departments)
    ? profile?.departments[0]
    : profile?.departments;

  const departmentName = deptData?.name || 'Computer Science';

  return (
    <div className="pb-6">
      <StudentAiTutorClient 
        studentName={studentName} 
        departmentName={departmentName} 
      />
    </div>
  );
}
