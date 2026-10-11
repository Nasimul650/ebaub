import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTeacherOverviewStats } from '@/app/actions/grading';
import TeacherOverviewClient from '@/components/teacher/TeacherOverviewClient';

export const dynamic = 'force-dynamic';

export default async function TeacherOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=teacher');
  }

  // Fetch teacher profile & department
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, first_name, last_name, role, department_id')
    .eq('id', user.id)
    .maybeSingle();

  let departmentName = '';
  if (profile?.department_id) {
    const { data: dept } = await supabase
      .from('departments')
      .select('name')
      .eq('id', profile.department_id)
      .maybeSingle();
    if (dept) departmentName = dept.name;
  }

  const teacherName =
    profile?.full_name?.trim() ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') ||
    user.email?.split('@')[0] ||
    'Faculty Instructor';

  const res = await getTeacherOverviewStats(user.id);

  const fallbackStats = {
    totalExamsPublished: 0,
    totalSubmissionsReceived: 0,
    averageScore: null,
    pendingGradingCount: 0,
    recentExams: [],
  };

  return (
    <div className="py-2">
      <TeacherOverviewClient
        stats={res.stats || fallbackStats}
        teacherName={teacherName}
        departmentName={departmentName}
      />
    </div>
  );
}
