import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, AlertCircle } from 'lucide-react';
import { NoticeItem } from '@/utils/supabase/queries';

export default function HomeNoticeGridSection({ notices }: { notices: NoticeItem[] }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Official Circulars</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display mt-1">
            Latest Notices & Campus Circulars
          </h2>
        </div>
        <Link href="/notices" className="text-xs font-bold text-slate-900 hover:text-campus-800 flex items-center gap-1.5 transition-colors">
          <span>View All Notices</span>
          <ArrowRight className="w-4 h-4 text-campus-700" />
        </Link>
      </div>

      {!notices || notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No active notices</h3>
          <p className="text-xs text-slate-500 mt-1">There are currently no new campus circulars.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map(notice => (
            <Link
              key={notice.id}
              href={`/notices/${notice.id}`}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-4 hover:translate-y-[-2px] transition-transform group block flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  notice.priority === 'High' 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : notice.priority === 'Medium' 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-campus-100 text-slate-700 border-slate-200'
                }`}>
                  {notice.priority || 'Normal'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  {notice.date ? new Date(notice.date).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-campus-800 transition-colors">
                {notice.title}
              </h3>
              
              {notice.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                  {notice.description}
                </p>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-campus-800 mt-auto">
                <span>Read Full Circular</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
