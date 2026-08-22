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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <NewsDetailView item={item} />
    </div>
  );
}
