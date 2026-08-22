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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <NoticeDetailView notice={notice} />
    </div>
  );
}
