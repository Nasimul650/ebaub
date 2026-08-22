import React from 'react';
import { getNews } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import NewsArticlesGrid from '@/components/news/NewsArticlesGrid';

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <PageHeader
        badge="University News & Press Releases"
        headline="EBAUB Stories, Achievements & Research News"
        description="Read the latest stories regarding departmental updates, faculty awards, student tech accomplishments, and campus breakthroughs."
      />
      <NewsArticlesGrid news={newsList} />
    </div>
  );
}
