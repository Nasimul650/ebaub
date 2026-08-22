import React from 'react';
import { notFound } from 'next/navigation';
import { getNoticeBySlug } from '@/lib/mock/mockServices';
import NoticeDetailView from '@/components/notices/NoticeDetailView';

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
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-12 lg:p-16">
      <NoticeDetailView notice={notice} />
    </div>
  );
}
