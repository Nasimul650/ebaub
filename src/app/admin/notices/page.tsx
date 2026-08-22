'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getNotices, createNotice, deleteNotice } from '@/lib/mock/mockServices';
import { NoticeItem } from '@/types';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Admission' | 'General' | 'Exam'>('Academic');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'PUBLIC'>('ALL');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newNotice = await createNotice({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      summary,
      content,
      category,
      targetAudience,
      isImportant,
      isPublished: true
    });

    setNotices(prev => [newNotice, ...prev]);
    setTitle('');
    setSummary('');
    setContent('');
    setIsImportant(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    await deleteNotice(id);
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-400" /> Notices CMS Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Create, publish, and delete official university notices</p>
      </div>

      {/* Create Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Create New Official Notice
        </h2>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Class Suspension Notice"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Admission">Admission</option>
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">ALL</option>
                  <option value="STUDENTS">STUDENTS</option>
                  <option value="TEACHERS">TEACHERS</option>
                  <option value="PUBLIC">PUBLIC</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Short Summary</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Brief headline summary..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Notice Content</label>
            <textarea
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Type full notice text..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={isImportant}
              onChange={e => setIsImportant(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500"
            />
            <label htmlFor="important" className="text-amber-300 font-semibold cursor-pointer">
              Mark as Important / High Priority Notice
            </label>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow disabled:opacity-50"
          >
            Publish Notice to Website
          </button>
        </form>
      </div>

      {/* Notices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white">
          Active Notices ({notices.length})
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Published</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {notices.map(n => (
              <tr key={n.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">
                  {n.title}
                  {n.isImportant && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Important</span>}
                </td>
                <td className="p-4 text-slate-400">{n.category}</td>
                <td className="p-4 text-slate-400">{n.targetAudience}</td>
                <td className="p-4 text-slate-400">{new Date(n.publishedAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(n.id)}
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
