'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createTeachingMaterial } from '@/lib/mock/mockServices';

export default function MaterialUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [description, setDescription] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTeachingMaterial({
      teacherId: 'fm-3',
      teacherName: 'Sabrina Chowdhury',
      departmentId: 'd-cse',
      title,
      subject,
      description,
      fileUrl: '#',
      isPublished: true
    });

    setTitle('');
    setDescription('');
    router.refresh();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Upload className="w-4 h-4 text-campus-700" /> Upload & Publish New Material
      </h2>

      <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Material Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. CSE-2101 Graph Theory Lecture Slides"
            className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-campus-700"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-campus-700"
          >
            <option value="Data Structures">Data Structures & Algorithms</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Database Systems">Database Systems</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief summary of contents..."
            className="w-full bg-campus-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-campus-700"
          ></textarea>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-5 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs disabled:opacity-50"
          >
            Publish Material
          </button>
        </div>
      </form>
    </div>
  );
}
