'use client';

import React from 'react';
import { RichTextBlockData } from '@/types';

interface Props {
  data: RichTextBlockData;
  onChange: (data: RichTextBlockData) => void;
}

export default function RichTextBlockEditor({ data, onChange }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Title (Optional)</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Section title..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Content (HTML/Markdown supported depending on renderer)</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none font-mono"
          placeholder="Enter rich text content..."
          rows={8}
        />
      </div>
    </div>
  );
}
