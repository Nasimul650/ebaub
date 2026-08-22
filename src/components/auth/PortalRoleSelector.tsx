'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types';

export default function PortalRoleSelector() {
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
    <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-xl space-y-8 text-slate-900">
      
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-white shadow-md">
          <GraduationCap className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">EBAUB Digital Campus</h1>
        <p className="text-xs text-slate-500">Select a Role Portal to test the prototype</p>
      </div>

      {/* Role Cards Selector */}
      <div className="space-y-3">
        <button
          onClick={() => setRole('ADMIN')}
          className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            role === 'ADMIN'
              ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <div>
              <div className="font-bold text-sm">Headless CMS Admin</div>
              <div className="text-[11px] text-slate-500">Manage pages, news, notices, events</div>
            </div>
          </div>
          {role === 'ADMIN' && <div className="w-2 h-2 rounded-full bg-amber-600" />}
        </button>

        <button
          onClick={() => setRole('TEACHER')}
          className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            role === 'TEACHER'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="font-bold text-sm">Teacher Workspace + AI</div>
              <div className="text-[11px] text-slate-500">AI Quiz Generator & Material Manager</div>
            </div>
          </div>
          {role === 'TEACHER' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
        </button>

        <button
          onClick={() => setRole('STUDENT')}
          className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            role === 'STUDENT'
              ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-bold text-sm">Student Study Workspace</div>
              <div className="text-[11px] text-slate-500">Study materials, AI tutor, notices</div>
            </div>
          </div>
          {role === 'STUDENT' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
        </button>
      </div>

      {/* Enter Portal Button */}
      <button
        onClick={() => handlePortalEntry(role)}
        className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
      >
        <span>Enter {role} Portal</span>
        <ArrowRight className="w-4 h-4 text-emerald-400" />
      </button>

      <div className="text-center">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 hover:underline">
          &larr; Return to Public Website
        </Link>
      </div>

    </div>
  );
}
