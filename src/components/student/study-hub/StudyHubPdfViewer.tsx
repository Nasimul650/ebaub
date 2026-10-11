'use client';

import React, { Component } from 'react';
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
  onError?: (error: Error) => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class PdfViewerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('StudyHubPdfViewer caught rendering error:', error, errorInfo);
    if (this.props.onError) {
      try {
        this.props.onError(error);
      } catch (err) {
        console.warn('PdfViewer onError callback failed:', err);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">PDF Preview Error</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            We encountered an issue rendering this PDF document. You can still use the notepad on the right to draft your study notes.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function StudyHubPdfViewer({ pdfUrl, onExtractToNotes, onError }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.TextSelection,
    renderHighlightTarget: (props: RenderHighlightTargetProps) => {
      try {
        if (
          !props ||
          !props.selectionRegion ||
          !props.selectedText ||
          typeof props.selectedText !== 'string' ||
          !props.selectedText.trim()
        ) {
          return <div style={{ display: 'none' }} />;
        }

        return (
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
              try {
                if (props.selectedText) {
                  onExtractToNotes(props.selectedText);
                }
                requestAnimationFrame(() => {
                  try {
                    props.toggle();
                  } catch (toggleErr) {
                    console.warn('PDF highlight toggle error suppressed:', toggleErr);
                  }
                });
              } catch (clickErr) {
                console.error('Failed to extract text from PDF:', clickErr);
              }
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-campus-300" />
            <span>Extract to Notes</span>
          </div>
        );
      } catch (renderTargetErr) {
        console.warn('PDF highlight target render error suppressed:', renderTargetErr);
        return <div style={{ display: 'none' }} />;
      }
    },
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
    <PdfViewerErrorBoundary onError={onError}>
      <div className="h-full w-full overflow-hidden flex flex-col">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-full w-full">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
              renderError={(error) => {
                if (onError) {
                  try {
                    onError(new Error(error.message));
                  } catch {}
                }
                return (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
                    <h4 className="font-bold text-slate-700 text-sm">Unable to Render PDF</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      {error.message || 'The PDF file could not be displayed.'}
                    </p>
                  </div>
                );
              }}
            />
          </div>
        </Worker>
      </div>
    </PdfViewerErrorBoundary>
  );
}
