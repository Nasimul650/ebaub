import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NoticeItem } from '@/types';

interface Props {
  notices: NoticeItem[];
}

export default function NoticeListFeed({ notices }: Props) {
  return (
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
                <span className="px-2.5 py-0.5 rounded-full bg-campus-100 text-slate-700 font-bold text-[10px]">
                  {notice.category}
                </span>
                <span className="text-slate-400 font-medium">
                  Published: {new Date(notice.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-campus-800 transition-colors">
                {notice.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {notice.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-campus-800 shrink-0">
              <span>Read Circular</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
