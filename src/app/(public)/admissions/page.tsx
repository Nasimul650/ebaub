import React from 'react';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, Calendar, FileText, ArrowRight, PhoneCall } from 'lucide-react';
import { getPrograms } from '@/lib/mock/mockServices';

export default async function AdmissionsPage() {
  const programs = await getPrograms();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          EBAUB Admissions Office
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Begin Your Academic Journey at EBAUB
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Admissions are now open for the Spring 2027 academic session across all faculties.
        </p>
      </div>

      {/* Step by Step Admission Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">1</div>
          <h3 className="font-bold text-white text-base">Select Program</h3>
          <p className="text-xs text-slate-400">Review eligibility requirements for B.Sc. CSE, B.Sc. Ag, or BBA.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">2</div>
          <h3 className="font-bold text-white text-base">Submit Application</h3>
          <p className="text-xs text-slate-400">Complete online application form and upload academic transcripts.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center">3</div>
          <h3 className="font-bold text-white text-base">Admission Test</h3>
          <p className="text-xs text-slate-400">Attend written test & interview on specified campus dates.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center">4</div>
          <h3 className="font-bold text-white text-base">Enrollment</h3>
          <p className="text-xs text-slate-400">Verify documents and complete semester registration.</p>
        </div>
      </div>

      {/* Eligibility Requirements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Program Requirements</h2>
        
        <div className="space-y-4">
          {programs.map(p => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{p.title} ({p.code})</span>
                <span className="text-emerald-400 text-xs font-semibold">{p.degreeLevel}</span>
              </div>
              <p className="text-xs text-slate-300"><span className="font-semibold text-slate-400">Eligibility:</span> {p.admissionRequirements}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
