import React from 'react';
import Link from 'next/link';
import { Bell, Calendar, Download, AlertCircle, Tag, ArrowRight } from 'lucide-react';
import { getNotices } from '@/lib/mock/mockServices';

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          Official Announcement Board
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 heading-display tracking-tight">
          EBAUB University Notices & Circulars
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Stay informed with official academic notices, exam routines, admission circulars, and departmental announcements.
        </p>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <Link
            key={notice.id}
            href={`/notices/${notice.slug}`}
            className="clean-card block p-6 sm:p-8 rounded-3xl bg-white space-y-3 group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 text-xs">
                  {notice.isImportant && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase">
                      Urgent / Priority
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {notice.category}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Published: {new Date(notice.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {notice.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 shrink-0">
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
