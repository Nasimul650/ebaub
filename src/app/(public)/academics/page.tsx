import React from 'react';
import Link from 'next/link';
import { BookOpen, Building2, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import { getFaculties, getDepartments, getPrograms } from '@/lib/mock/mockServices';

export default async function AcademicsPage() {
  const [faculties, departments, programs] = await Promise.all([
    getFaculties(),
    getDepartments(),
    getPrograms()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Academics & Degree Programs
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore EBAUB Faculties, Departments & Curriculums
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities.
        </p>
      </div>

      {/* Faculties Grid */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" /> University Faculties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculties.map(faculty => (
            <div key={faculty.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
              {faculty.imageUrl && (
                <div className="h-40 relative">
                  <img src={faculty.imageUrl} alt={faculty.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-3 flex-1">
                <h3 className="font-bold text-base text-white">{faculty.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faculty.description}</p>
                <div className="text-[11px] text-amber-400 font-semibold pt-2">
                  Dean: {faculty.deanName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Programs List Detail */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" /> Offered Degree Programs
        </h2>

        <div className="space-y-6">
          {programs.map(program => {
            const dept = departments.find(d => d.id === program.departmentId);
            return (
              <div key={program.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                      <span>{dept?.title}</span>
                      <span>•</span>
                      <span>{program.degreeLevel}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{program.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                      {program.code}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium text-xs">
                      {program.durationYears} Years | {program.totalCredits} Credits
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div>
                    <h4 className="font-bold text-white mb-2">Program Overview</h4>
                    <p className="leading-relaxed">{program.description}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Admission Requirements</h4>
                    <p className="leading-relaxed">{program.admissionRequirements}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-amber-400">Curriculum Structure:</span>
                  <p className="text-slate-400">{program.curriculumOverview}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
