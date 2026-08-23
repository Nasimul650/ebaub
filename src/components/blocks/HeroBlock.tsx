import React from 'react';
import { Sparkles } from 'lucide-react';
import { HeroBlockData } from '@/types';

interface Props {
  data: HeroBlockData;
}

export default function HeroBlock({ data }: Props) {
  return (
    <div className="text-center space-y-4 max-w-3xl mx-auto opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      {data.badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-campus-50 border border-campus-200 text-campus-800 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-campus-600" />
          <span>{data.badge}</span>
        </div>
      )}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display tracking-tight leading-tight">
        {data.headline}
      </h1>
      {data.subheadline && (
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
          {data.subheadline}
        </p>
      )}
    </div>
  );
}
