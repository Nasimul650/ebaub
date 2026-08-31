'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-campus-900/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Decorative Icon */}
        <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-campus-100 rounded-3xl rotate-12 transition-transform duration-500 hover:rotate-45" />
          <div className="absolute inset-0 bg-campus-800 rounded-3xl -rotate-6 shadow-xl" />
          <Compass className="w-10 h-10 text-white relative z-10 animate-[spin_10s_linear_infinite]" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl sm:text-9xl font-black text-slate-900 tracking-tighter mb-4 opacity-90">
          4<span className="text-campus-700">0</span>4
        </h1>
        
        {/* Messages */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4 font-bangla">
          Lost in Campus?
        </h2>
        
        <p className="text-base text-slate-500 mb-10 font-bangla leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-campus-900 text-white rounded-xl text-sm font-bold hover:bg-campus-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') window.history.back();
            }}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
