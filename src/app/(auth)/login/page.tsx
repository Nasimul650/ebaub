'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, Sparkles, BookOpen, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('ADMIN');

  const handlePortalEntry = (selectedRole: UserRole) => {
    if (selectedRole === 'ADMIN' || selectedRole === 'EDITOR') {
      router.push('/admin');
    } else if (selectedRole === 'TEACHER') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 text-slate-100">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 mx-auto flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">EBAUB Digital Campus</h1>
          <p className="text-xs text-slate-400">Select a Role Portal to test the prototype</p>
        </div>

        {/* Role Cards Selector */}
        <div className="space-y-3">
          <button
            onClick={() => setRole('ADMIN')}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              role === 'ADMIN'
                ? 'bg-amber-500/10 border-amber-500/60 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-sm">Headless CMS Admin</div>
                <div className="text-[11px] text-slate-400">Manage pages, news, notices, events</div>
              </div>
            </div>
            {role === 'ADMIN' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
          </button>

          <button
            onClick={() => setRole('TEACHER')}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              role === 'TEACHER'
                ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-sm">Teacher Workspace + AI</div>
                <div className="text-[11px] text-slate-400">AI Quiz Generator & Material Manager</div>
              </div>
            </div>
            {role === 'TEACHER' && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setRole('STUDENT')}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              role === 'STUDENT'
                ? 'bg-sky-500/10 border-sky-500/60 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-bold text-sm">Student Study Workspace</div>
                <div className="text-[11px] text-slate-400">Study materials, AI tutor, notices</div>
              </div>
            </div>
            {role === 'STUDENT' && <div className="w-2 h-2 rounded-full bg-sky-400" />}
          </button>
        </div>

        {/* Enter Portal Button */}
        <button
          onClick={() => handlePortalEntry(role)}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>Enter {role} Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:underline">
            &larr; Return to Public Website
          </Link>
        </div>

      </div>

    </div>
  );
}
