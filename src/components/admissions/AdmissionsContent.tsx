'use client';

import React, { useRef, useState } from 'react';
import { FacultyHierarchy } from '@/utils/supabase/queries';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText, CheckCircle, Calendar, GraduationCap, Building2 } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface AdmissionsContentProps {
  faculties: FacultyHierarchy[];
}

export default function AdmissionsContent({ faculties }: AdmissionsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter only faculties that have admissions data configured
  const activeFaculties = faculties.filter(f => f.admissions_info);

  useGSAP(() => {
    const blocks = gsap.utils.toArray('.faculty-block') as HTMLElement[];
    
    blocks.forEach((block) => {
      gsap.fromTo(block, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    gsap.fromTo('.hero-content',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-campus-950 text-white py-24 sm:py-32 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-campus-400 via-campus-900 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center hero-content">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campus-900/50 border border-campus-800/50 text-emerald-400 text-sm font-bold tracking-wide uppercase mb-6">
            <GraduationCap className="w-4 h-4" /> Fall 2027 Admissions Open
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Begin Your Journey at <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-campus-300">EXIM Bank Agricultural University</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover your potential with our rigorous academic programs. Explore requirements, application steps, and key dates below.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-campus-950 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
            Apply Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Faculty Sections */}
      <div className="py-12 sm:py-20 flex flex-col">
        {activeFaculties.map((faculty, index) => {
          const isEven = index % 2 === 0;
          return (
            <section 
              key={faculty.id} 
              className={`faculty-block w-full py-16 sm:py-24 ${isEven ? 'bg-slate-50' : 'bg-emerald-50/20'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                  
                  {/* Faculty Info */}
                  <div className="w-full lg:w-1/3 shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-campus-100 text-campus-800 mb-6 shadow-sm">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{faculty.name}</h2>
                    {faculty.description && (
                      <p className="text-slate-600 leading-relaxed text-sm mb-6">
                        {faculty.description}
                      </p>
                    )}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Associated Departments</h4>
                      <div className="flex flex-wrap gap-2">
                        {faculty.departments?.map(dept => (
                          <span key={dept.id} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                            {dept.name}
                          </span>
                        ))}
                        {(!faculty.departments || faculty.departments.length === 0) && (
                          <span className="text-slate-500 text-xs italic">No departments listed.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Tabs */}
                  <div className="w-full lg:w-2/3">
                    <FacultyAdmissionsTabs facultyName={faculty.name} admissionsInfo={faculty.admissions_info} />
                  </div>

                </div>
              </div>
            </section>
          );
        })}

        {activeFaculties.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No faculties currently listed for admissions.
          </div>
        )}
      </div>
    </div>
  );
}

// Extracted Tab Component to keep state isolated per faculty
function FacultyAdmissionsTabs({ facultyName, admissionsInfo }: { facultyName: string, admissionsInfo: any }) {
  const [activeTab, setActiveTab] = useState<'requirements' | 'process' | 'dates'>('requirements');

  const tabs = [
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'process', label: 'Application Process', icon: CheckCircle },
    { id: 'dates', label: 'Important Dates', icon: Calendar },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Tab Nav */}
      <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50 hide-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-5 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                isActive 
                  ? 'border-campus-700 text-campus-900 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-campus-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8 min-h-[300px]">
        {activeTab === 'requirements' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Academic Eligibility</h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {admissionsInfo?.requirements || 'Eligibility requirements will be published soon.'}
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">How to Apply</h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {admissionsInfo?.process_steps || 'Application process steps will be published soon.'}
            </div>
          </div>
        )}

        {activeTab === 'dates' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Upcoming Deadlines</h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {admissionsInfo?.important_dates || 'Important dates will be published soon.'}
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100">
              * Dates are subject to change by the academic council. Please check your registered email for direct updates regarding {facultyName} schedules.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
