import React from 'react';
import { RichTextBlockData } from '@/types';

interface Props {
  data: RichTextBlockData;
}

export default function RichTextBlock({ data }: Props) {
  return (
    <div className="max-w-3xl mx-auto w-full opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      {data.title && (
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{data.title}</h2>
      )}
      <div className="prose prose-slate max-w-none">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
          {data.content}
        </div>
      </div>
    </div>
  );
}
