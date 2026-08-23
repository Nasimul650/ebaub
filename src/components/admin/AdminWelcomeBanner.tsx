import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminWelcomeBanner() {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
        <ShieldCheck className="w-4 h-4 text-amber-600" /> EBAUB Custom Headless CMS
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
        Content Management Control Panel
      </h1>
      <p className="text-xs sm:text-sm text-slate-600">
        Manage public university notices, news releases, campus events, degree programs, and media assets without touching source code.
      </p>
    </div>
  );
}
