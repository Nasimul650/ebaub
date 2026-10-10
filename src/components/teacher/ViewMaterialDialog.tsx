'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Eye, 
  Download, 
  ExternalLink, 
  FileText, 
  FileArchive, 
  AlertCircle,
  FileSpreadsheet,
  Presentation,
  Loader2
} from 'lucide-react';
import type { CourseMaterial } from '@/types';
import { formatFileSize } from '@/lib/utils';

interface ViewMaterialDialogProps {
  material: CourseMaterial | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewMaterialDialog({
  material,
  isOpen,
  onClose
}: ViewMaterialDialogProps) {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!material) return null;

  const fileType = (material.file_type || '').toLowerCase();
  const fileName = (material.file_name || '').toLowerCase();
  const ext = fileName.split('.').pop() || '';

  const isPdf = fileType.includes('pdf') || ext === 'pdf';
  const isImage = fileType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext);
  const isOffice = 
    fileType.includes('word') || 
    fileType.includes('officedocument') || 
    fileType.includes('presentation') || 
    fileType.includes('powerpoint') || 
    fileType.includes('spreadsheet') || 
    fileType.includes('excel') || 
    ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext);
  const isZipOrArchive = 
    fileType.includes('zip') || 
    fileType.includes('compressed') || 
    ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-4xl max-h-[90vh] h-[85vh] p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <DialogHeader className="pr-8 space-y-1 shrink-0 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-campus-100 text-campus-900 font-extrabold text-[11px] font-mono border border-campus-200">
              {material.course_code}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {formatFileSize(material.file_size)} • {ext.toUpperCase()}
            </span>
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[85%]">
            {material.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono truncate">
            {material.file_name}
          </DialogDescription>
        </DialogHeader>

        {/* Action Controls & Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-campus-700" />
            <span>Document Preview Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
              title="Open raw file in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>

            <a
              href={material.file_url}
              download={material.file_name}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-semibold text-[11px] transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 w-full min-h-0 relative rounded-2xl bg-slate-50/70 border border-slate-200 overflow-hidden mt-3 flex items-center justify-center">
          {/* Case 1: PDF or Images */}
          {(isPdf || isImage) && (
            <div className="relative w-full h-full">
              {isImage ? (
                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={material.file_url}
                    alt={material.title}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
                  />
                </div>
              ) : (
                <iframe
                  src={material.file_url}
                  className="w-full h-full rounded-md border-0"
                  title={material.title}
                  onLoad={() => setIframeLoading(false)}
                />
              )}
            </div>
          )}

          {/* Case 2: Microsoft Office files via Google Docs Viewer */}
          {isOffice && !isPdf && !isImage && (
            <div className="relative w-full h-full">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.file_url)}&embedded=true`}
                className="w-full h-full rounded-md border-0"
                title={material.title}
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          )}

          {/* Case 3: Fallback for ZIP, archives or unsupported formats */}
          {!isPdf && !isImage && !isOffice && (
            <div className="p-8 text-center max-w-sm flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                {isZipOrArchive ? (
                  <FileArchive className="w-8 h-8" />
                ) : (
                  <FileText className="w-8 h-8" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Preview not available for this file type
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isZipOrArchive
                    ? 'Compressed archives (.zip, .rar) must be downloaded to inspect their contents.'
                    : `Direct preview is not supported for .${ext || 'unknown'} files.`}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={material.file_url}
                  download={material.file_name}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
                >
                  <Download className="w-4 h-4 text-campus-300" />
                  <span>Download File ({formatFileSize(material.file_size)})</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
