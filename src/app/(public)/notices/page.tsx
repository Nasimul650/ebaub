import React from 'react';
import Link from 'next/link';
import { Bell, Calendar, Download, AlertCircle, Tag, ArrowRight } from 'lucide-react';
import { getNotices } from '@/lib/mock/mockServices';

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          Official Announcement Board
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          EBAUB University Notices & Circulars
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Stay informed with official academic notices, exam routines, admission circulars, and departmental announcements.
        </p>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <Link
            key={notice.id}
            href={`/notices/${notice.slug}`}
            className={`block p-6 rounded-2xl border transition-all ${
              notice.isImportant
                ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-950/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 text-xs">
                  {notice.isImportant && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                      Urgent / Important
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-semibold text-[10px]">
                    {notice.category}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Published: {new Date(notice.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white hover:text-amber-300 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {notice.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 shrink-0">
                <span>Read Circular</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
