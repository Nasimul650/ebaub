'use client';

import React from 'react';
import { CtaBannerBlockData } from '@/types';

interface Props {
  data: CtaBannerBlockData;
  onChange: (data: CtaBannerBlockData) => void;
}

export default function CtaBannerBlockEditor({ data, onChange }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Headline</label>
        <input
          type="text"
          value={data.headline || ''}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Banner headline..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Brief description text..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Button Text</label>
          <input
            type="text"
            value={data.button_text || ''}
            onChange={(e) => onChange({ ...data, button_text: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
            placeholder="e.g. Apply Now"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Button Link</label>
          <input
            type="text"
            value={data.button_link || ''}
            onChange={(e) => onChange({ ...data, button_link: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
            placeholder="e.g. /admissions"
          />
        </div>
      </div>
    </div>
  );
}
