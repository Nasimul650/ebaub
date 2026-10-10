'use client';

import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, Trigger, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import { Sparkles, AlertCircle } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

interface Props {
  pdfUrl: string;
  onExtractToNotes: (text: string) => void;
}

export default function StudyHubPdfViewer({ pdfUrl, onExtractToNotes }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.TextSelection,
    renderHighlightTarget: (props: RenderHighlightTargetProps) => (
      <div
        style={{
          background: '#044e32',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '10px',
          position: 'absolute',
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transform: 'translateY(6px)',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.02em',
        }}
        onClick={() => {
          onExtractToNotes(props.selectedText);
          props.toggle();
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-campus-300" />
        <span>Extract to Notes</span>
      </div>
    ),
  });

  if (!pdfUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No PDF Document Found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          This study session does not have a linked PDF file. You can still use the notepad on the right to draft your study notes.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full w-full">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
}
