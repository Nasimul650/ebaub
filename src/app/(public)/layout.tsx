import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getFacultiesWithDepartments, getAllPrograms, getPageSiteSettings } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import type { GlobalFooterSettings } from '@/types/settings';
import type { CurrentUser } from '@/types';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch data for the MegaMenu, global footer settings, and authenticated user
  const [faculties, programs, footerSettings] = await Promise.all([
    getFacultiesWithDepartments(),
    getAllPrograms(5), // Only fetch top 5 for the megamenu
    getPageSiteSettings<GlobalFooterSettings>('global_footer')
  ]);

  let currentUser: CurrentUser | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      let { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, first_name, last_name, role, institutional_id, batch, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        const fallbackRes = await supabase
          .from('profiles')
          .select('id, full_name, first_name, last_name, role, institutional_id, batch, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        profile = fallbackRes.data as any;
      }

      const rawRole = ((profile?.role || user.user_metadata?.role || 'STUDENT') as string).toUpperCase();
      const role = rawRole === 'ADMIN' ? 'ADMIN' : (rawRole === 'TEACHER' ? 'TEACHER' : 'STUDENT');
      const fullName = profile?.full_name || 
        (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '') || 
        user.user_metadata?.full_name || 
        user.email?.split('@')[0] || 
        'User';

      currentUser = {
        id: user.id,
        email: user.email || '',
        fullName,
        role,
        institutionalId: profile?.institutional_id || user.user_metadata?.institutional_id || null,
        batch: (profile as any)?.batch || user.user_metadata?.batch || null,
        avatarUrl: (profile as any)?.avatar_url || user.user_metadata?.avatar_url || null,
      };
    }
  } catch (err) {
    console.warn('Could not fetch user in PublicLayout:', err);
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-campus-700 selection:text-white">
      <Navbar faculties={faculties} programs={programs} currentUser={currentUser} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer settings={footerSettings} />
    </div>
  );
}
