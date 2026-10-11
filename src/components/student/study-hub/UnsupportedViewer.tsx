'use client';

import React from 'react';
import { FileQuestion, Download, FileText } from 'lucide-react';

interface Props {
  fileUrl: string;
  fileType?: string;
  onExtractToNotes?: (text: string) => void;
}

export default function UnsupportedViewer({ fileUrl, fileType }: Props) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
        <FileQuestion className="w-8 h-8 text-slate-400" />
      </div>

      <h4 className="font-bold text-slate-800 text-base mb-1">
        Preview Unavailable {fileType ? `(${fileType.toUpperCase()})` : ''}
      </h4>

      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        This file type is not supported for preview. You can still use the notepad to write your study notes.
      </p>

      {fileUrl ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#044e32] text-white hover:bg-campus-800 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-campus-300" />
          <span>Download Original File</span>
        </a>
      ) : (
        <div className="text-xs text-slate-400 italic">No source file URL attached.</div>
      )}
    </div>
  );
}
