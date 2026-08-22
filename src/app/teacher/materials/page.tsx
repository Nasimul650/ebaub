'use client';

import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Upload, Trash2, Plus, FileText } from 'lucide-react';
import { getTeachingMaterials, createTeachingMaterial } from '@/lib/mock/mockServices';
import { TeachingMaterial } from '@/types';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [description, setDescription] = useState('');

  useEffect(() => {
    getTeachingMaterials().then(setMaterials);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMat = await createTeachingMaterial({
      teacherId: 'fm-3',
      teacherName: 'Sabrina Chowdhury',
      departmentId: 'd-cse',
      title,
      subject,
      description,
      fileUrl: '#',
      isPublished: true
    });

    setMaterials(prev => [newMat, ...prev]);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Course Materials Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Publish lecture slides, lab manuals, and syllabus files for students</p>
      </div>

      {/* Upload Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-400" /> Upload & Publish New Material
        </h2>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Material Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CSE-2101 Graph Theory Lecture Slides"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Subject</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Data Structures">Data Structures & Algorithms</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Database Systems">Database Systems</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of contents..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow disabled:opacity-50"
            >
              Publish Material
            </button>
          </div>
        </form>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Published Materials ({materials.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(mat => (
            <div key={mat.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {mat.subject}
              </span>
              <h3 className="font-bold text-white text-sm mt-1">{mat.title}</h3>
              <p className="text-xs text-slate-400">{mat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
