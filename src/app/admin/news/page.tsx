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
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-emerald-400" /> News & Press Release CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1">Publish press releases, research news, and departmental achievements</p>
      </div>

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" /> Create News Article
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Headline Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="News headline..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Academic">Academic</option>
                <option value="Research & Achievement">Research & Achievement</option>
                <option value="Technology & Innovation">Technology & Innovation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Short Summary</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Brief summary..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Article Body</label>
            <textarea
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Full article text..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow disabled:opacity-50"
          >
            Publish Article
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white">
          News Articles ({newsList.length})
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Published Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {newsList.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">{item.title}</td>
                <td className="p-4 text-slate-400">{item.category}</td>
                <td className="p-4 text-slate-400">{new Date(item.publishedAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
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
