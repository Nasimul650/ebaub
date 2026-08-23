'use client';

import React from 'react';
import { StatsBlockData } from '@/types';
import { Plus, X } from 'lucide-react';

interface Props {
  data: StatsBlockData;
  onChange: (data: StatsBlockData) => void;
}

export default function StatsBlockEditor({ data, onChange }: Props) {
  const stats = Array.isArray(data.stats) ? data.stats : [];

  const handleAddStat = () => {
    if (stats.length < 8) {
      onChange({
        ...data,
        stats: [...stats, { value: '', label: '' }]
      });
    }
  };

  const handleUpdateStat = (index: number, field: 'value' | 'label', val: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: val };
    onChange({ ...data, stats: newStats });
  };

  const handleRemoveStat = (index: number) => {
    if (stats.length > 1) {
      const newStats = stats.filter((_, i) => i !== index);
      onChange({ ...data, stats: newStats });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Headline</label>
        <input
          type="text"
          value={data.headline || ''}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Stats section headline..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-slate-700">Stats Items ({stats.length}/8)</label>
          <button
            onClick={handleAddStat}
            disabled={stats.length >= 8}
            className="flex items-center gap-1 text-sm bg-campus-100 text-campus-900 px-3 py-1 rounded-lg font-bold hover:bg-campus-200 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleUpdateStat(index, 'value', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
                  placeholder="Value (e.g. 50+)"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleUpdateStat(index, 'label', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
                  placeholder="Label (e.g. Years of Excellence)"
                />
              </div>
              <button
                onClick={() => handleRemoveStat(index)}
                disabled={stats.length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
