'use client';

import React, { useState } from 'react';
import { Info, Image as ImageIcon, Loader2, Download, AlertCircle } from 'lucide-react';

interface Props {
  fileUrl: string;
  onExtractToNotes: (text: string) => void;
}

export default function ImageViewer({ fileUrl }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use file-proxy to prevent CORS issues
  const proxiedUrl = fileUrl ? `/api/file-proxy?url=${encodeURIComponent(fileUrl)}` : '';

  if (!fileUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Image Provided</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No image source was found for this study session.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Subtle Info Banner */}
      <div className="px-4 py-2.5 bg-campus-50/80 border-b border-campus-100 flex items-center justify-between text-xs text-campus-950 shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-campus-700 shrink-0" />
          <span className="font-medium">
            Image files don&apos;t support text extraction. Use the notepad to manually type your notes.
          </span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-campus-800 hover:text-campus-950 hover:underline shrink-0"
        >
          <Download className="w-3 h-3" />
          <span>Full Image</span>
        </a>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center relative custom-scrollbar">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-campus-700 animate-spin mb-2" />
            <span className="text-xs">Loading image...</span>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">Image Failed to Load</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mb-3">
              We couldn&apos;t display this image directly.
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-campus-900 text-white hover:bg-campus-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        ) : (
          <div className="max-w-full max-h-full flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proxiedUrl}
              alt="Study Material Preview"
              className={`max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-xl transition-opacity duration-200 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
