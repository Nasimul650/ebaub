import React from 'react';
import { getNews } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import NewsArticlesGrid from '@/components/news/NewsArticlesGrid';

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-12">
      <PageHeader
        badge="University News & Press Releases"
        headline="EBAUB Stories, Achievements & Research News"
        description="Read the latest stories regarding departmental updates, faculty awards, student tech accomplishments, and campus breakthroughs."
      />
      <NewsArticlesGrid news={newsList} />
    </div>
  );
}
