import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import { NoticeItem } from '@/utils/supabase/queries';

interface Props {
  notices: NoticeItem[];
}

export default function NoticeListFeed({ notices }: Props) {
  if (!notices || notices.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        No active notices found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.map(notice => (
        <Link
          key={notice.id}
          href={`/notices/${notice.id}`}
          className="clean-card block p-6 sm:p-8 rounded-3xl bg-white space-y-3 group shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all border border-slate-200/80"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 text-xs">
                {notice.priority === 'High' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px] uppercase border border-red-200">
                    High Priority
                  </span>
                )}
                {notice.priority === 'Medium' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase border border-amber-200">
                    Important
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-campus-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                  {notice.category || 'General'}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Bell className="w-3 h-3" />
                  {notice.date ? new Date(notice.date).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-campus-800 transition-colors">
                {notice.title}
              </h3>
              {notice.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {notice.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-campus-800 shrink-0">
              <span>Read Circular</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
