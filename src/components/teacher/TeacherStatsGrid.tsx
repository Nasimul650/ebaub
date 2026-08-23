import React from 'react';
import Link from 'next/link';

interface Props {
  quizCount: number;
  materialCount: number;
  courseCount: number;
}

export default function TeacherStatsGrid({ quizCount, materialCount, courseCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">Generated AI Quizzes</div>
        <div className="text-3xl font-extrabold text-amber-700 heading-display">{quizCount} Quizzes</div>
        <Link href="/teacher/ai" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 pt-2">
          Generate New Quiz &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">Published Materials</div>
        <div className="text-3xl font-extrabold text-campus-800 heading-display">{materialCount} Documents</div>
        <Link href="/teacher/materials" className="text-xs text-campus-800 font-bold hover:underline flex items-center gap-1 pt-2">
          Upload Material &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">Assigned Courses</div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{courseCount} Courses</div>
        <Link href="/teacher/teaching" className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 pt-2">
          View Courses &rarr;
        </Link>
      </div>
    </div>
  );
}
