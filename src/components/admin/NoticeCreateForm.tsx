'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { NoticeItem } from '@/types';

export interface NoticeCreateFormProps {
  onSubmit: (notice: Partial<NoticeItem>) => Promise<void>;
}

export default function NoticeCreateForm({ onSubmit }: NoticeCreateFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Admission' | 'General' | 'Exam'>('Academic');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'PUBLIC'>('ALL');
  const [isImportant, setIsImportant] = useState(false);

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
      targetAudience,
      isImportant,
      isPublished: true
    });

    setTitle('');
    setSummary('');
    setContent('');
    setIsImportant(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Plus className="w-4 h-4 text-amber-600" /> Create New Official Notice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Class Suspension Notice"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="Academic">Academic</option>
                <option value="Admission">Admission</option>
                <option value="General">General</option>
                <option value="Exam">Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
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
          <label className="block text-slate-700 font-semibold mb-1">Short Summary</label>
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Brief headline summary..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Full Notice Content</label>
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type full notice text..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
          ></textarea>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="important"
            checked={isImportant}
            onChange={e => setIsImportant(e.target.checked)}
            className="rounded bg-slate-50 border-slate-300 text-amber-600"
          />
          <label htmlFor="important" className="text-amber-800 font-semibold cursor-pointer text-xs">
            Mark as Important / High Priority Notice
          </label>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !content.trim()}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
        >
          Publish Notice to Website
        </button>
      </form>
    </div>
  );
}
