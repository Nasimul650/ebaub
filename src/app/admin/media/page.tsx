import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getMediaItems } from '@/lib/mock/mockServices';
import MediaGrid from '@/components/admin/MediaGrid';

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

      <MediaGrid media={mediaItems} />
    </div>
  );
}
