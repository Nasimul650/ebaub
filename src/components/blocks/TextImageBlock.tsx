import React from 'react';
import { Target, Award, ImageIcon } from 'lucide-react';
import { TextImageBlockData } from '@/types';

interface Props {
  data: TextImageBlockData;
}

export default function TextImageBlock({ data }: Props) {
  const isMission = data.title.toLowerCase().includes('mission');
  const Icon = isMission ? Award : Target;
  
  const textContent = (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-campus-50 text-campus-800 flex items-center justify-center border border-campus-100">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{data.title}</h2>
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.paragraph}</p>
    </div>
  );

  const imageContent = (
    <div className="h-full min-h-[300px] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200 flex items-center justify-center relative">
      {data.image_url ? (
        <img 
          src={data.image_url} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className="w-16 h-16 text-slate-300" />
      )}
    </div>
  );

  return (
    <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      {!data.image_url ? (
        textContent
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch`}>
          {data.image_alignment === 'right' ? (
            <>
              {textContent}
              {imageContent}
            </>
          ) : (
            <>
              {imageContent}
              {textContent}
            </>
          )}
        </div>
      )}
    </div>
  );
}
