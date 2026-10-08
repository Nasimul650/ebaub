import React from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=teacher');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase();

  // Secondary Server-Side Guard: Strictly allow Teachers only
  if (rawRole !== 'teacher') {
    if (rawRole === 'admin') {
      redirect('/admin');
    } else {
      redirect('/student');
    }
  }

  return (
    <div className="h-screen bg-campus-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      <TeacherSidebar profile={profile} />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
