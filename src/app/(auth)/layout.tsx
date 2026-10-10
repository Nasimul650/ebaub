import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If already logged in, redirect to the user's role-specific dashboard
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase();
    if (rawRole === 'admin') {
      redirect('/admin');
    } else if (rawRole === 'teacher') {
      redirect('/teacher');
    } else {
      redirect('/student');
    }
  }

  return <>{children}</>;
}
