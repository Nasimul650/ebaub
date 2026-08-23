'use client';

import React from 'react';
import { HeroBlockData } from '@/types';

interface Props {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
}

export default function HeroBlockEditor({ data, onChange }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Badge</label>
        <input
          type="text"
          value={data.badge || ''}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="e.g. Welcome to EBAUB"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Headline</label>
        <input
          type="text"
          value={data.headline || ''}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Main headline..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Subheadline</label>
        <textarea
          value={data.subheadline || ''}
          onChange={(e) => onChange({ ...data, subheadline: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Brief description below headline..."
          rows={3}
        />
      </div>
    </div>
  );
}
