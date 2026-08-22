import React from 'react';

export default function AdmissionStepsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-100">1</div>
        <h3 className="font-bold text-slate-900 text-base">Select Program</h3>
        <p className="text-xs text-slate-500">Review eligibility requirements for B.Sc. CSE, B.Sc. Ag, or BBA.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center border border-amber-100">2</div>
        <h3 className="font-bold text-slate-900 text-base">Submit Application</h3>
        <p className="text-xs text-slate-500">Complete online application form and upload academic transcripts.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center border border-blue-100">3</div>
        <h3 className="font-bold text-slate-900 text-base">Admission Test</h3>
        <p className="text-xs text-slate-500">Attend written test & interview on specified campus dates.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-extrabold flex items-center justify-center border border-purple-100">4</div>
        <h3 className="font-bold text-slate-900 text-base">Enrollment</h3>
        <p className="text-xs text-slate-500">Verify documents and complete semester registration.</p>
      </div>
    </div>
  );
}
