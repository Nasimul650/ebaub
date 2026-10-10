import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpenCheck, GraduationCap, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  quizCount: number;
  publishedCount?: number;
  draftCount?: number;
  materialCount: number;
  courseCount: number;
}

export default function TeacherStatsGrid({ 
  quizCount, 
  publishedCount = 0, 
  draftCount = 0, 
  materialCount, 
  courseCount 
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {/* AI Exams Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3 shadow-xs hover:border-campus-300 transition-colors flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> AI-Generated Exams
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
              Exam Hub
            </span>
          </div>

          <div className="text-3xl font-extrabold text-slate-900 heading-display">
            {quizCount} <span className="text-lg font-semibold text-slate-500">{quizCount === 1 ? 'Exam' : 'Exams'}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> {publishedCount} Published
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <Clock className="w-3.5 h-3.5" /> {draftCount} Draft
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link 
            href="/teacher/quizzes/new" 
            className="text-amber-700 font-bold hover:text-amber-800 hover:underline flex items-center gap-1"
          >
            Create New &rarr;
          </Link>
          <Link 
            href="/teacher/quizzes" 
            className="text-slate-500 font-semibold hover:text-slate-800 hover:underline flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Course Materials Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3 shadow-xs hover:border-campus-300 transition-colors flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <BookOpenCheck className="w-4 h-4 text-campus-700" /> Teaching Materials
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200/60">
              Repository
            </span>
          </div>

          <div className="text-3xl font-extrabold text-slate-900 heading-display">
            {materialCount} <span className="text-lg font-semibold text-slate-500">{materialCount === 1 ? 'Document' : 'Documents'}</span>
          </div>

          <p className="text-xs text-slate-500 pt-0.5 truncate">
            Lecture notes, slides, and syllabus files
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link 
            href="/teacher/materials" 
            className="text-campus-800 font-bold hover:text-campus-900 hover:underline flex items-center gap-1"
          >
            Upload Material &rarr;
          </Link>
          <Link 
            href="/teacher/materials" 
            className="text-slate-500 font-semibold hover:text-slate-800 hover:underline flex items-center gap-1"
          >
            View Files <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Assigned / Active Courses Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3 shadow-xs hover:border-campus-300 transition-colors flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Active Course Modules
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/60">
              Academic
            </span>
          </div>

          <div className="text-3xl font-extrabold text-slate-900 heading-display">
            {courseCount} <span className="text-lg font-semibold text-slate-500">{courseCount === 1 ? 'Course' : 'Courses'}</span>
          </div>

          <p className="text-xs text-slate-500 pt-0.5 truncate">
            Courses with active exams or course materials
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link 
            href="/teacher/teaching" 
            className="text-blue-700 font-bold hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            Course Overview &rarr;
          </Link>
          <Link 
            href="/teacher/materials" 
            className="text-slate-500 font-semibold hover:text-slate-800 hover:underline flex items-center gap-1"
          >
            By Course <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
