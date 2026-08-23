import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GraduationCap, ChevronRight, Home, BookOpen, Clock } from 'lucide-react';
import { getProgramById } from '@/utils/supabase/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  const deptName = program.departments?.name;
  const facName = program.departments?.faculties?.name;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/" className="hover:text-campus-800 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/academics" className="hover:text-campus-800 transition-colors">
              Academics
            </Link>
            {facName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">{facName}</span>
              </>
            )}
            {deptName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">{deptName}</span>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-campus-800 truncate max-w-[200px]">{program.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div className="h-40 bg-gradient-to-r from-purple-900 to-purple-800 flex items-center px-8 sm:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-700/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-950/40 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                {program.degree_level} Degree
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold heading-display drop-shadow-sm">{program.name}</h1>
            </div>
          </div>
          
          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" /> Program Overview
                  </h2>
                  <div className="prose prose-slate prose-p:text-slate-600 prose-headings:text-slate-900 max-w-none text-sm">
                    {program.description ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{program.description}</p>
                    ) : (
                      <p className="italic text-slate-400">Detailed description for this program is not available yet.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Program Details</h3>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-purple-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{program.degree_level}</p>
                      <p className="text-xs text-slate-500">Degree Level</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{program.duration_years} Years</p>
                      <p className="text-xs text-slate-500">Duration</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/admissions" 
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-campus-800 hover:bg-campus-900 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Apply for Admission
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
