'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { EventItem } from '@/types';

export interface EventScheduleFormProps {
  onSubmit: (event: Partial<EventItem>) => Promise<void>;
}

export default function EventScheduleForm({ onSubmit }: EventScheduleFormProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('EBAUB Campus');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await onSubmit({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      summary: description.slice(0, 100),
      description,
      location,
      startTime: new Date().toISOString(),
      bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
      isPublished: true
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Plus className="w-4 h-4 text-blue-600" /> Schedule New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CSE Anniversary Ceremony"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Central Auditorium"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Event details..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
        >
          Publish Event
        </button>
      </form>
    </div>
  );
}
