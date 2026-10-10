import React from 'react';
import StudentSidebar from '@/components/student/StudentSidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=student');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase();

  // Secondary Server-Side Guard: Strictly allow Students only
  if (rawRole !== 'student') {
    if (rawRole === 'admin') {
      redirect('/admin');
    } else if (rawRole === 'teacher') {
      redirect('/teacher');
    }
  }

  const resolvedProfile = profile ? {
    ...profile,
    avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || null,
  } : profile;

  return (
    <div className="h-screen bg-campus-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      <StudentSidebar profile={resolvedProfile} />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
