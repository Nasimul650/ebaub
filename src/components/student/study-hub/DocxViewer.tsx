'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertCircle, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  fileUrl: string;
  onExtractToNotes: (text: string) => void;
}

interface FloatingButtonPosition {
  x: number;
  y: number;
}

export default function DocxViewer({ fileUrl, onExtractToNotes }: Props) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [buttonPos, setButtonPos] = useState<FloatingButtonPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const convertDocument = useCallback(async () => {
    if (!fileUrl) {
      setError('No document URL provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setButtonPos(null);

    try {
      const response = await fetch('/api/convert-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fileUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to convert document (${response.status})`);
      }

      const data = await response.json();
      setHtmlContent(data.html || '<p className="text-slate-400 italic">Document is empty.</p>');
    } catch (err: any) {
      console.error('Docx conversion error:', err);
      setError(err?.message || 'Failed to load and convert the Word document.');
    } finally {
      setIsLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    convertDocument();
  }, [convertDocument]);

  const handleSelectionCheck = useCallback(() => {
    if (typeof window === 'undefined') return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) {
      setButtonPos(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setButtonPos(null);
      setSelectedText('');
      return;
    }

    // Check if selection is within the contentRef
    const range = selection.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) {
      setButtonPos(null);
      setSelectedText('');
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      // Calculate position relative to container
      const relativeTop = rect.bottom - containerRect.top + (containerRef.current?.scrollTop || 0) + 8;
      const relativeLeft = Math.max(
        16,
        Math.min(
          rect.left - containerRect.left + rect.width / 2 - 70,
          containerRect.width - 160
        )
      );

      setButtonPos({
        x: relativeLeft,
        y: relativeTop,
      });
      setSelectedText(text);
    }
  }, []);

  const handleExtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedText) return;

    try {
      onExtractToNotes(selectedText);
    } catch (err) {
      console.error('Failed to extract notes from docx:', err);
    }

    // Clear selection and hide button
    setButtonPos(null);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleSelectionCheck}
      onKeyUp={handleSelectionCheck}
      className="relative h-full w-full overflow-y-auto bg-white custom-scrollbar select-text"
    >
      {/* Floating Extract Button */}
      {buttonPos && selectedText && (
        <div
          style={{
            position: 'absolute',
            left: `${buttonPos.x}px`,
            top: `${buttonPos.y}px`,
            zIndex: 999,
          }}
          className="animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={handleExtract}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#044e32] text-white text-xs font-semibold shadow-lg hover:bg-campus-800 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-campus-300" />
            <span>Extract to Notes</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
          <Loader2 className="w-8 h-8 text-campus-700 animate-spin mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">Converting Word Document...</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Parsing formatting and styles for interactive study reading.
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Unable to Preview Document</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
            {error}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={convertDocument}
              className="text-xs flex items-center gap-1.5 border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
            {fileUrl && (
              <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-campus-900 text-white hover:bg-campus-950 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Rendered Document Content */}
      {!isLoading && !error && (
        <div className="max-w-3xl mx-auto px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium flex items-center gap-1.5 text-campus-900">
              <FileText className="w-3.5 h-3.5 text-campus-700" />
              Word Document Preview
            </span>
            <span className="text-[11px] text-slate-400">
              Highlight text to extract into your notes
            </span>
          </div>

          <div
            ref={contentRef}
            className="prose prose-sm sm:prose-base max-w-none text-slate-800 leading-relaxed font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-p:my-2 prose-table:border prose-table:border-slate-200 prose-td:p-2 prose-th:p-2 prose-th:bg-slate-50"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
}
