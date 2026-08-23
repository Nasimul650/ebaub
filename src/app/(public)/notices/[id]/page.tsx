import React from 'react';
import { notFound } from 'next/navigation';
import { getNoticeById } from '@/utils/supabase/queries';
import NoticeDetailView from '@/components/notices/NoticeDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <NoticeDetailView notice={notice} />
    </div>
  );
}
