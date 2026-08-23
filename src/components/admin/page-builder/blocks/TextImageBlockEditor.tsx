'use client';

import React from 'react';
import { TextImageBlockData } from '@/types';
import { FileUpload } from '@/components/ui/file-upload';
import { AlignLeft, AlignRight } from 'lucide-react';

interface Props {
  data: TextImageBlockData;
  onChange: (data: TextImageBlockData) => void;
}

export default function TextImageBlockEditor({ data, onChange }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Block title..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Paragraph</label>
        <textarea
          value={data.paragraph || ''}
          onChange={(e) => onChange({ ...data, paragraph: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-campus-400 focus:border-campus-400 outline-none"
          placeholder="Text content..."
          rows={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Image Upload</label>
          <FileUpload
            bucket="media"
            accept="image/*"
            onUploadSuccess={(url) => onChange({ ...data, image_url: url })}
          />
          {data.image_url && (
            <div className="mt-2">
              <img src={data.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Image Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange({ ...data, image_alignment: 'left' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${
                data.image_alignment === 'left' 
                  ? 'bg-campus-50 border-campus-400 text-campus-900 font-bold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlignLeft className="w-4 h-4" /> Left
            </button>
            <button
              onClick={() => onChange({ ...data, image_alignment: 'right' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${
                data.image_alignment === 'right' 
                  ? 'bg-campus-50 border-campus-400 text-campus-900 font-bold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlignRight className="w-4 h-4" /> Right
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
