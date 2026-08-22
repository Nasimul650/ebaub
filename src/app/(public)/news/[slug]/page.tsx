import React from 'react';
import { notFound } from 'next/navigation';
import { getNewsBySlug } from '@/lib/mock/mockServices';
import NewsDetailView from '@/components/news/NewsDetailView';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-12 lg:p-16">
      <NewsDetailView item={item} />
    </div>
  );
}
