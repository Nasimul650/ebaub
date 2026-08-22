import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, Calendar, Award } from 'lucide-react';
import { NoticeItem } from '@/types';

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
        <Link href="/notices" className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
          <span>View All Notices</span>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.slice(0, 4).map(notice => (
          <Link
            key={notice.id}
            href={`/notices/${notice.slug}`}
            className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-4 hover:translate-y-[-2px] transition-transform group block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {notice.category}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {new Date(notice.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {notice.summary}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span>Read circular</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
