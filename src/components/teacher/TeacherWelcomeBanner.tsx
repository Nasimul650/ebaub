import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpenCheck, GraduationCap, Building2 } from 'lucide-react';

interface TeacherWelcomeBannerProps {
  teacherName?: string;
  departmentName?: string;
  facultyName?: string;
  role?: string;
}

export default function TeacherWelcomeBanner({
  teacherName,
  departmentName,
  facultyName,
  role
}: TeacherWelcomeBannerProps) {
  const resolvedName = teacherName?.trim() || 'Faculty Member';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 relative overflow-hidden">
      {/* Background decorative glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 bg-campus-100/60 rounded-full blur-3xl opacity-70"
      />

      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-campus-50 border border-campus-200/60 text-campus-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-campus-700" />
          {role === 'ADMIN' ? 'Administrator • Faculty Workspace' : 'Teacher Workspace & AI Assessment Tools'}
        </span>
        {departmentName && (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Dept. of {departmentName}
          </span>
        )}
      </div>

      <div className="relative z-10 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display tracking-tight">
          Welcome back, {resolvedName}!
        </h1>
        {facultyName && (
          <p className="text-xs sm:text-sm font-medium text-campus-900/80">
            {facultyName}
          </p>
        )}
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl pt-1">
          Generate instant AI-powered exams (MCQs, short answer, and creative questions), publish course lecture materials, and organize student assessments.
        </p>
      </div>

      <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
        <Link
          href="/teacher/quizzes/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-campus-400" /> Open AI Exam Generator &rarr;
        </Link>
        <Link
          href="/teacher/quizzes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all active:scale-[0.98]"
        >
          Manage Exams
        </Link>
        <Link
          href="/teacher/materials"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all active:scale-[0.98]"
        >
          <BookOpenCheck className="w-4 h-4 text-slate-500" /> Course Materials
        </Link>
      </div>
    </div>
  );
}
