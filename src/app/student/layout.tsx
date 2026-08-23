import React from 'react';
import StudentSidebar from '@/components/student/StudentSidebar';
import { createClient } from '@/utils/supabase/server';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="h-screen bg-campus-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      <StudentSidebar profile={profile} />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
