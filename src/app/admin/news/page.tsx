'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Trash2 } from 'lucide-react';
import { getNews, createNews, deleteNews } from '@/lib/mock/mockServices';
import { NewsItem } from '@/types';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');

  useEffect(() => {
    getNews().then(setNewsList);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newItem = await createNews({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      summary,
      content,
      category,
      authorName: 'EBAUB Editor',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      isPublished: true
    });

    setNewsList(prev => [newItem, ...prev]);
    setTitle('');
    setSummary('');
    setContent('');
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" /> Create News Article
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Headline Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="News headline..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Article Body</label>
            <textarea
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Full article text..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
          >
            Publish Article
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
          News Articles ({newsList.length})
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Published Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {newsList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/80">
                <td className="p-4 font-bold text-slate-900">{item.title}</td>
                <td className="p-4 text-slate-500">{item.category}</td>
                <td className="p-4 text-slate-500">{new Date(item.publishedAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
