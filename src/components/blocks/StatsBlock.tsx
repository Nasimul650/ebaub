import React from 'react';
import { StatsBlockData } from '@/types';

interface Props {
  data: StatsBlockData;
}

export default function StatsBlock({ data }: Props) {
  return (
    <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] space-y-8">
      {data.headline && (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">
          {data.headline}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs transition-transform hover:-translate-y-1"
          >
            <div className="text-3xl font-extrabold text-campus-900">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
