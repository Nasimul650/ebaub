import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function TeacherWelcomeBanner() {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
      <span className="px-3 py-1 rounded-full bg-campus-50 text-campus-900 text-xs font-bold uppercase tracking-wider">
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4 text-campus-400" /> Open AI Question Generator &rarr;
        </Link>
      </div>
    </div>
  );
}
