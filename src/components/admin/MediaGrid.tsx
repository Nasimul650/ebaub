import React from 'react';
import { MediaItem } from '@/types';

export interface MediaGridProps {
  media: MediaItem[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {media.map(item => (
        <div key={item.id} className="clean-card bg-white rounded-3xl overflow-hidden space-y-3 p-4">
          <div className="h-40 rounded-2xl overflow-hidden border border-slate-100">
            <img src={item.filePath} alt={item.altText || item.filename} className="w-full h-full object-cover" />
          </div>
          <div className="text-xs text-slate-800 font-bold truncate">{item.filename}</div>
          <div className="text-[10px] text-slate-400">{(item.fileSize / 1024).toFixed(0)} KB</div>
        </div>
      ))}
    </div>
  );
}
