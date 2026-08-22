import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function TeacherWelcomeBanner() {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
        Teacher Workspace & AI Tools
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
        Welcome back, Sabrina Chowdhury!
      </h1>
      <p className="text-xs sm:text-sm text-slate-600">
        Use the AI Question / Quiz Generator to build instant quizzes for your classes, upload course materials, and manage student assessments.
      </p>
      <div className="pt-2">
        <Link
          href="/teacher/ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Open AI Question Generator &rarr;
        </Link>
      </div>
    </div>
  );
}
