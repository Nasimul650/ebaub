import React from 'react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md"
    : "w-full flex flex-col items-center justify-center min-h-[400px] p-8";

  return (
    <div className={`${containerClasses}`}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-campus-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '500ms' }} />

        {/* Main Premium Loader Container */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-8">
          {/* Outer Ring 1 - Slow Spin */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-campus-300 border-r-campus-300 animate-[spin_3s_linear_infinite] opacity-60" />
          
          {/* Outer Ring 2 - Reverse Medium Spin */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-transparent border-b-campus-500 border-l-campus-500 animate-[spin_2s_linear_infinite_reverse] opacity-80" />
          
          {/* Inner Ring - Fast Spin */}
          <div className="absolute inset-4 sm:inset-6 rounded-full border-2 border-slate-200/50 border-t-campus-700 animate-spin shadow-sm" />
          
          {/* Center Glowing Dot */}
          <div className="absolute inset-0 m-auto w-2 h-2 sm:w-3 sm:h-3 bg-campus-800 rounded-full animate-pulse shadow-[0_0_12px_rgba(15,118,110,0.8)]" />
        </div>

        {/* Typography & Bouncing Dots */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-[0.2em] font-bangla">
            {message}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-campus-300 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-campus-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-campus-700 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
