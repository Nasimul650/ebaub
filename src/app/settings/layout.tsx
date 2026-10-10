import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  LayoutDashboard, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/settings/profile');
  }

  // Fetch basic profile to know role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, first_name, last_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  const roleRaw = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase();
  const dashboardHref = roleRaw === 'admin' ? '/admin' : roleRaw === 'teacher' ? '/teacher' : '/student';
  const dashboardLabel = roleRaw === 'admin' ? 'Admin Control Center' : 
    roleRaw === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard';

  const displayName = profile?.full_name || 
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
    user.email?.split('@')[0] || 
    'User';

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-campus-700 selection:text-white flex flex-col">
      {/* Subtle radial background gradient to make cards pop */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.07),rgba(255,255,255,0))]" 
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/70"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">Back to {dashboardLabel}</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="text-campus-800">EBAUB</span>
              <span className="text-slate-400 font-medium">Digital Workspace Settings</span>
            </div>
          </div>

          {/* User Quick Pill */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-campus-900 text-white flex items-center justify-center font-extrabold text-xs overflow-hidden shadow-2xs">
              {(profile?.avatar_url || user.user_metadata?.avatar_url) ? (
                <img src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400 font-medium capitalize">
                {roleRaw}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Settings Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200/70 py-4 text-center text-[11px] text-slate-400">
        <span>EXIM Bank Agricultural University Bangladesh (EBAUB) &bull; Official Digital Campus</span>
      </footer>
    </div>
  );
}
