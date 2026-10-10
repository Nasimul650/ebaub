'use client';

import React, { useActionState, Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import Link from 'next/link';
import { Sparkles, ShieldCheck, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const rawPortal = searchParams.get('portal')?.toLowerCase();
  const rawRedirect = searchParams.get('redirectTo')?.toLowerCase() || '';
  const isRegistered = searchParams.get('registered') === 'true';
  const registeredEmail = searchParams.get('email') || '';

  const detectedPortal = 
    rawPortal === 'teacher' || rawRedirect.includes('teacher') 
      ? 'teacher'
      : rawPortal === 'student' || rawRedirect.includes('student')
      ? 'student'
      : 'admin';

  const [activePortal, setActivePortal] = useState<'teacher' | 'admin' | 'student'>(detectedPortal);

  // Sync state if external searchParams change
  useEffect(() => {
    if (rawPortal === 'teacher' || rawPortal === 'admin' || rawPortal === 'student') {
      setActivePortal(rawPortal);
    }
  }, [rawPortal]);

  const [state, formAction, pending] = useActionState(login, null);

  const handlePortalSwitch = (portal: 'teacher' | 'admin' | 'student') => {
    setActivePortal(portal);
    const newPath = portal === 'teacher' ? '/teacher' : portal === 'student' ? '/student' : '/admin';
    const newUrl = `/login?portal=${portal}&redirectTo=${encodeURIComponent(newPath)}`;
    window.history.replaceState(null, '', newUrl);
  };

  const getPortalInfo = () => {
    switch (activePortal) {
      case 'teacher':
        return {
          title: 'Sign in to Teacher Workspace',
          badge: 'Teacher Portal + AI Tools',
          badgeBg: 'bg-campus-50 text-campus-800 border-campus-200',
          icon: <Sparkles className="w-4 h-4 text-campus-700" />,
          redirectTo: '/teacher'
        };
      case 'student':
        return {
          title: 'Sign in to Student Study Hub',
          badge: 'Student Study Workspace',
          badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <BookOpen className="w-4 h-4 text-blue-600" />,
          redirectTo: '/student'
        };
      default:
        return {
          title: 'Sign in to Headless CMS',
          badge: 'Administrative Portal',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
          redirectTo: '/admin'
        };
    }
  };

  const portalInfo = getPortalInfo();

  return (
    <div className="min-h-screen bg-campus-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-campus-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-campus-400" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight heading-display">EBAUB Digital Campus</span>
        </Link>

        {/* Portal Destination Badge */}
        <div className="flex justify-center mb-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${portalInfo.badgeBg} shadow-2xs`}>
            {portalInfo.icon}
            <span>{portalInfo.badge}</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight heading-display">
          {portalInfo.title}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          EXIM Bank Agricultural University Bangladesh
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Quick Portal Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handlePortalSwitch('teacher')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activePortal === 'teacher'
                  ? 'bg-white text-campus-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-campus-700" />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activePortal === 'admin'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('student')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activePortal === 'student'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span>Student</span>
            </button>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Hidden Portal & Redirect Fields strictly synchronized with activePortal */}
            <input type="hidden" name="portal" value={activePortal} />
            <input type="hidden" name="redirectTo" value={portalInfo.redirectTo} />

            {/* Registration Success Banner */}
            {isRegistered && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Account Claimed Successfully! </span>
                  Please sign in with your email and new password.
                </div>
              </div>
            )}

            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold animate-in fade-in">
                {state.error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Email or Registration Number
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={registeredEmail}
                  required
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 bg-campus-50/50 rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:border-campus-700 text-xs text-slate-900 transition-colors"
                  placeholder={portalInfo.placeholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 bg-campus-50/50 rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:border-campus-700 text-xs text-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-campus-800 focus:ring-campus-700 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div>
                <a href="#" className="font-semibold text-campus-800 hover:text-campus-900 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-campus-900 hover:bg-campus-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-campus-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {pending ? 'Signing in...' : `Sign in to ${activePortal.charAt(0).toUpperCase() + activePortal.slice(1)} Portal`}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs space-y-2">
            <div>
              <span className="text-slate-500">First time here? </span>
              <Link
                href="/signup"
                className="font-bold text-campus-800 hover:text-campus-900 transition-colors underline-offset-4 hover:underline"
              >
                Claim your account
              </Link>
            </div>
            <div>
              <Link href="/contact" className="font-semibold text-slate-400 hover:text-campus-800 transition-colors">
                Need assistance? Contact IT Support
              </Link>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-campus-800 transition-colors font-medium">
            &larr; Return to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-campus-50 flex items-center justify-center">
        <div className="text-xs font-bold text-slate-400 animate-pulse">Loading login portal...</div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
