import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Program, Department } from '@/types';

interface Props {
  programs: Program[];
  departments: Department[];
}

export default function ProgramDetailsList({ programs, departments }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-amber-600" /> Offered Degree Programs
      </h2>

      <div className="space-y-6">
        {programs.map(program => {
          const dept = departments.find(d => d.id === program.departmentId);
          return (
            <div key={program.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-campus-800 font-bold mb-1">
                    <span>{dept?.title}</span>
                    <span>•</span>
                    <span>{program.degreeLevel}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{program.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-campus-50 border border-campus-200 text-campus-900 font-bold text-xs">
                    {program.code}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-campus-100 text-slate-700 font-medium text-xs">
                    {program.durationYears} Years | {program.totalCredits} Credits
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Program Overview</h4>
                  <p className="leading-relaxed">{program.description}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Admission Requirements</h4>
                  <p className="leading-relaxed">{program.admissionRequirements}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <span className="font-bold text-slate-900">Curriculum Structure:</span>
                <p className="text-slate-600">{program.curriculumOverview}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
