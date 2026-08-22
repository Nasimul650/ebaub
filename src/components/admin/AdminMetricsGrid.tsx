import React from 'react';
import Link from 'next/link';
import { Bell, Newspaper, Calendar, BookOpen } from 'lucide-react';

export interface AdminMetricsGridProps {
  noticeCount: number;
  newsCount: number;
  eventCount: number;
  programCount: number;
}

export default function AdminMetricsGrid({ noticeCount, newsCount, eventCount, programCount }: AdminMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Notices</span>
          <Bell className="w-5 h-5 text-campus-500" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{noticeCount}</div>
        <Link href="/admin/notices" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
          Manage Notices &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">News Articles</span>
          <Newspaper className="w-5 h-5 text-campus-700" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{newsCount}</div>
        <Link href="/admin/news" className="text-xs text-campus-800 font-bold hover:underline flex items-center gap-1">
          Manage News &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Campus Events</span>
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{eventCount}</div>
        <Link href="/admin/events" className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1">
          Manage Events &rarr;
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Programs Offered</span>
          <BookOpen className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900 heading-display">{programCount}</div>
        <Link href="/admin/programs" className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1">
          Manage Programs &rarr;
        </Link>
      </div>
    </div>
  );
}
