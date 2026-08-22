'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { NewsItem } from '@/types';

export interface NewsCreateFormProps {
  onSubmit: (news: Partial<NewsItem>) => Promise<void>;
}

export default function NewsCreateForm({ onSubmit }: NewsCreateFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await onSubmit({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      summary,
      content,
      category,
      authorName: 'EBAUB Editor',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      isPublished: true
    });

    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Plus className="w-4 h-4 text-campus-700" /> Create News Article
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Headline Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="News headline..."
              className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-campus-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-campus-700"
            >
              <option value="Academic">Academic</option>
              <option value="Research & Achievement">Research & Achievement</option>
              <option value="Technology & Innovation">Technology & Innovation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Short Summary</label>
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Brief summary..."
            className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-campus-700"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Full Article Body</label>
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Full article text..."
            className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-campus-700"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !content.trim()}
          className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
        >
          Publish Article
        </button>
      </form>
    </div>
  );
}
