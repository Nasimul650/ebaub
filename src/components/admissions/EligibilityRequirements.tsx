import React from 'react';
import { Program } from '@/types';

interface Props {
  programs: Program[];
}

export default function EligibilityRequirements({ programs }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900">Program Requirements</h2>
      
      <div className="space-y-4">
        {programs.map(p => (
          <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
              <span>{p.title} ({p.code})</span>
              <span className="text-campus-800 text-xs font-bold">{p.degreeLevel}</span>
            </div>
            <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">Eligibility:</span> {p.admissionRequirements}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
