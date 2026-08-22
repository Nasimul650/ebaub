import React from 'react';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, Calendar, FileText, ArrowRight, PhoneCall } from 'lucide-react';
import { getPrograms } from '@/lib/mock/mockServices';

export default async function AdmissionsPage() {
  const programs = await getPrograms();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          EBAUB Admissions Office
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 heading-display tracking-tight">
          Begin Your Academic Journey at EBAUB
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Admissions are now open for the Spring 2027 academic session across all faculties.
        </p>
      </div>

      {/* Step by Step Admission Flow */}
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

      {/* Eligibility Requirements Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Program Requirements</h2>
        
        <div className="space-y-4">
          {programs.map(p => (
            <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>{p.title} ({p.code})</span>
                <span className="text-emerald-700 text-xs font-bold">{p.degreeLevel}</span>
              </div>
              <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">Eligibility:</span> {p.admissionRequirements}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
