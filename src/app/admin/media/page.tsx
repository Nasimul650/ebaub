import React from 'react';
import { Image as ImageIcon, Upload, Copy } from 'lucide-react';
import { getMediaItems } from '@/lib/mock/mockServices';

export default async function AdminMediaPage() {
  const mediaItems = await getMediaItems();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerald-700" /> Media Library Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">Upload and manage image assets for news, notices, and banners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaItems.map(item => (
          <div key={item.id} className="clean-card bg-white rounded-3xl overflow-hidden space-y-3 p-4">
            <div className="h-40 rounded-2xl overflow-hidden border border-slate-100">
              <img src={item.filePath} alt={item.altText} className="w-full h-full object-cover" />
            </div>
            <div className="text-xs text-slate-800 font-bold truncate">{item.filename}</div>
            <div className="text-[10px] text-slate-400">{(item.fileSize / 1024).toFixed(0)} KB</div>
          </div>
        ))}
      </div>
    </div>
  );
}
