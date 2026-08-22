import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function CSEMilestoneCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white border border-emerald-800/80 rounded-3xl p-8 md:p-12 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Corner light source */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-700 rounded-full blur-[90px] opacity-40 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-amber-300 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CSE Department 2-Year Anniversary Milestone</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white heading-display tracking-tight leading-tight">
          Department of Computer Science & Engineering
        </h2>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-3xl">
          The CSE Department at EBAUB was established to fulfill the growing regional and global demand for high-caliber computer scientists. Over the past 2 years, the department has grown into an incubator for AI research, software engineering, and modern web technology.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link 
            href="/academics" 
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Browse CSE Degrees</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
          <Link 
            href="/faculty" 
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
          >
            Meet CSE Faculty
          </Link>
        </div>
      </div>
    </div>
  );
}
