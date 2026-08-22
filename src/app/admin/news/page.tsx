'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { getNews, createNews, deleteNews } from '@/lib/mock/mockServices';
import { NewsItem } from '@/types';
import NewsCreateForm from '@/components/admin/NewsCreateForm';
import NewsTable from '@/components/admin/NewsTable';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    getNews().then(setNewsList);
  }, []);

  const handleCreate = async (newsData: Partial<NewsItem>) => {
    const newItem = await createNews(newsData as Omit<NewsItem, 'id' | 'createdAt' | 'publishedAt'>);
    setNewsList(prev => [newItem, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete news article?')) return;
    await deleteNews(id);
    setNewsList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-emerald-700" /> News & Press Release CMS
        </h1>
        <p className="text-xs text-slate-500 mt-1">Publish press releases, research news, and departmental achievements</p>
      </div>

      {/* Form */}
      <NewsCreateForm onSubmit={handleCreate} />

      {/* List */}
      <NewsTable newsList={newsList} onDelete={handleDelete} />
    </div>
  );
}
