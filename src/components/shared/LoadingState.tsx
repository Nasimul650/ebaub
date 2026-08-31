import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "w-full flex flex-col items-center justify-center min-h-[400px] p-8";

  return (
    <div className={`${containerClasses} min-h-screen`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full blur-xl bg-campus-500/20 animate-pulse"></div>
        {/* Spinner */}
        <Loader2 className="w-12 h-12 text-campus-700 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse font-bangla tracking-wide">
        {message}
      </p>
    </div>
  );
}
