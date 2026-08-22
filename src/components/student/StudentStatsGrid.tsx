import React from 'react';
import Link from 'next/link';

interface Props {
  materialCount: number;
  noticeCount: number;
}

export default function StudentStatsGrid({ materialCount, noticeCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">Available Materials</div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{materialCount} Documents</div>
        <Link href="/student/study" className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 pt-2">
          Open Study Hub &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">AI Study Assistant</div>
        <div className="text-3xl font-extrabold text-campus-800 heading-display">Ready</div>
        <Link href="/student/ai" className="text-xs text-campus-800 font-bold hover:underline flex items-center gap-1 pt-2">
          Launch AI Study Tutor &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-slate-500">Active Notices</div>
        <div className="text-3xl font-extrabold text-amber-700 heading-display">{noticeCount} Notices</div>
        <Link href="/student/notices" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 pt-2">
          View Announcements &rarr;
        </Link>
      </div>
    </div>
  );
}
