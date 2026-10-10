import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?portal=admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase();

  // Secondary Server-Side Guard: Strictly allow Admins only
  if (rawRole !== 'admin') {
    if (rawRole === 'teacher') {
      redirect('/teacher');
    } else {
      redirect('/student');
    }
  }

  const resolvedProfile = profile ? {
    ...profile,
    avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || null,
  } : profile;

  return (
    <div className="h-screen h-[100dvh] bg-campus-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* CMS Sidebar */}
      <AdminSidebar profile={resolvedProfile} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
