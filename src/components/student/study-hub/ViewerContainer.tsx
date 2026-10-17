'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StudyHubPdfViewer = dynamic(() => import('./StudyHubPdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
      Loading PDF Viewer...
    </div>
  ),
});

const DocxViewer = dynamic(() => import('./DocxViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
      Loading Document Viewer...
    </div>
  ),
});

const ImageViewer = dynamic(() => import('./ImageViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
      Loading Image Viewer...
    </div>
  ),
});

const PptxViewer = dynamic(() => import('./PptxViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
      Loading Presentation Viewer...
    </div>
  ),
});

const UnsupportedViewer = dynamic(() => import('./UnsupportedViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
      Loading Viewer...
    </div>
  ),
});

export interface ViewerContainerProps {
  fileFormat: string;
  pdfUrl: string;
  rawFileUrl: string;
  onExtractToNotes: (text: string) => void;
}

export function ViewerContainer({
  fileFormat,
  pdfUrl,
  rawFileUrl,
  onExtractToNotes,
}: ViewerContainerProps) {
  switch (fileFormat) {
    case 'pdf':
      return <StudyHubPdfViewer pdfUrl={pdfUrl} onExtractToNotes={onExtractToNotes} />;
    case 'docx':
      return <DocxViewer fileUrl={rawFileUrl} onExtractToNotes={onExtractToNotes} />;
    case 'pptx':
      return <PptxViewer fileUrl={rawFileUrl} onExtractToNotes={onExtractToNotes} />;
    case 'image':
      return <ImageViewer fileUrl={rawFileUrl} onExtractToNotes={onExtractToNotes} />;
    case 'unsupported':
    default:
      return <UnsupportedViewer fileUrl={rawFileUrl} onExtractToNotes={onExtractToNotes} />;
  }
}
