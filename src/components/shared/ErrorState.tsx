'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  reset?: () => void;
  fullScreen?: boolean;
}

export default function ErrorState({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred while loading this page. Please try again.',
  reset,
  fullScreen = false
}: ErrorStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 p-6"
    : "w-full flex flex-col items-center justify-center min-h-[400px] p-8";

  return (
    <div className={containerClasses}>
      <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm max-w-md w-full text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h2 className="text-xl font-extrabold text-slate-900 mb-2 font-bangla">
          {title}
        </h2>
        
        <p className="text-sm text-slate-500 mb-8 font-bangla leading-relaxed">
          {message}
        </p>

        {reset && (
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
