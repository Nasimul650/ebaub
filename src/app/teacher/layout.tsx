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

  // Secondary Server-Side Guard: Strictly allow Teachers and Admins
  if (rawRole !== 'teacher' && rawRole !== 'admin') {
    redirect('/student');
  }

  const resolvedProfile = profile ? {
    ...profile,
    avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || null,
  } : profile;

  return (
    <div className="h-screen h-[100dvh] bg-campus-50 text-slate-900 flex flex-col md:flex-row overflow-hidden print:h-auto print:bg-white print:overflow-visible print:block">
      <TeacherSidebar profile={resolvedProfile} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 print:p-0 print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
