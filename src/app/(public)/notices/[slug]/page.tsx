import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bell, Calendar, ArrowLeft, Download, Share2, Tag } from 'lucide-react';
import { getNoticeBySlug } from '@/lib/mock/mockServices';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);

  if (!notice) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* Back button */}
      <Link href="/notices" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Notices
      </Link>

      {/* Notice Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs">
        
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {notice.isImportant && (
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold uppercase text-[10px]">
              Urgent Notice
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
            {notice.category} Category
          </span>
          <span className="text-slate-500">
            Target: {notice.targetAudience}
          </span>
          <span className="text-slate-500 font-medium">
            Published: {new Date(notice.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
          {notice.title}
        </h1>

        <p className="text-sm font-medium text-slate-700 leading-relaxed border-l-2 border-emerald-600 pl-4 py-1">
          {notice.summary}
        </p>

        {/* Full Notice Content */}
        <div className="pt-6 border-t border-slate-100 text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
          {notice.content}
        </div>

        {/* Attachment download if available */}
        {notice.attachmentUrl && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Official Circular PDF Attachment</span>
            </div>
            <a
              href={notice.attachmentUrl}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors"
            >
              Download PDF
            </a>
          </div>
        )}

      </div>

    </div>
  );
}
