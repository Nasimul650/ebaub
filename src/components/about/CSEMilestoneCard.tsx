import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CSEMilestoneCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-6 shadow-xs">
      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-emerald-600" /> CSE Department 2-Year Anniversary Milestone
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
        Department of Computer Science & Engineering
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        The CSE Department at EBAUB was established to fulfill the growing regional and global demand for high-caliber computer scientists. Over the past 2 years, the department has grown into an incubator for AI research, software engineering, and modern web technology.
      </p>
      <div className="pt-2 flex flex-wrap gap-4">
        <Link href="/academics" className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors">
          Browse CSE Degrees
        </Link>
        <Link href="/faculty" className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors">
          Meet CSE Faculty
        </Link>
      </div>
    </div>
  );
}
