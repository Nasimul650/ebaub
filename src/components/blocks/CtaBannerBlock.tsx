import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBannerBlockData } from '@/types';

interface Props {
  data: CtaBannerBlockData;
}

export default function CtaBannerBlock({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-campus-950 via-campus-900 to-campus-950 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      {/* Decorative blur circle */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-campus-800 rounded-full blur-[90px] opacity-40 pointer-events-none" />

      <div className="relative z-10 space-y-6 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white heading-display tracking-tight leading-tight">
          {data.headline}
        </h2>
        
        {data.description && (
          <p className="text-campus-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        )}

        <div className="pt-2">
          <Link 
            href={data.button_link || '#'} 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-campus-400 hover:bg-campus-300 text-campus-950 font-bold text-sm shadow-xl transition-all hover:scale-105"
          >
            <span>{data.button_text}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
