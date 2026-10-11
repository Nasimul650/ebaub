'use client';

import React, { useState } from 'react';
import { Presentation, Download, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  fileUrl: string;
  onExtractToNotes: (text: string) => void;
}

export default function PptxViewer({ fileUrl, onExtractToNotes }: Props) {
  const [iframeError, setIframeError] = useState(false);

  if (!fileUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Presentation className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Presentation Found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No PowerPoint file was linked to this session.
        </p>
      </div>
    );
  }

  // Microsoft Office Online Viewer embed URL
  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  return (
    <div className="h-full w-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Banner */}
      <div className="px-4 py-2.5 bg-campus-50/90 border-b border-campus-200/80 flex items-center justify-between text-xs text-campus-950 shrink-0">
        <div className="flex items-center gap-2">
          <Presentation className="w-4 h-4 text-campus-700 shrink-0" />
          <span className="font-semibold text-campus-900">
            PowerPoint preview - select text below to extract
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-campus-800 hover:text-campus-950 hover:underline"
          >
            <Download className="w-3 h-3" />
            <span>Download PPT</span>
          </a>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-campus-800 hover:text-campus-950 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open in Tab</span>
          </a>
        </div>
      </div>

      {/* Presentation Viewer Area */}
      <div className="flex-1 w-full h-full relative">
        {iframeError ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">Unable to Preview Presentation</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
              The presentation could not be embedded directly. You can download the slide deck to view locally.
            </p>
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#044e32] text-white hover:bg-campus-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Presentation</span>
            </a>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title="PowerPoint Document Preview"
            className="w-full h-full border-0 bg-white"
            onError={() => setIframeError(true)}
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
