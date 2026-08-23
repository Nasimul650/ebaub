import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { NoticeItem } from '@/utils/supabase/queries';

export default function NoticeDetailView({ notice }: { notice: NoticeItem & { content?: string } }) {
  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/notices" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Notices
      </Link>

      {/* Notice Content Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {notice.priority === 'High' && (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-extrabold uppercase text-[10px] border border-red-200">
              High Priority
            </span>
          )}
          {notice.priority === 'Medium' && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold uppercase text-[10px] border border-amber-200">
              Important
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-campus-100 text-slate-700 font-bold border border-slate-200">
            {notice.category || 'General'}
          </span>
          <span className="text-slate-500 font-medium">
            Date: {notice.date ? new Date(notice.date).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
          {notice.title}
        </h1>

        {notice.description && (
          <p className="text-sm font-medium text-slate-700 leading-relaxed border-l-2 border-campus-700 pl-4 py-1">
            {notice.description}
          </p>
        )}

        {/* Full Notice Content */}
        <div className="pt-6 border-t border-slate-100 text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
          {notice.content || notice.description || "No further details."}
        </div>

        {/* Attachment download if available */}
        {notice.attachment_url && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Download className="w-4 h-4 text-campus-700" />
              <span>Official Circular PDF Attachment</span>
            </div>
            <a
              href={notice.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow transition-colors"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
