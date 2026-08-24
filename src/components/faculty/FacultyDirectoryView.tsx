'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowRight, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { FacultyHierarchy, FacultyItem } from '@/utils/supabase/queries';

export default function FacultyDirectoryView({ 
  hierarchy, 
  allMembers 
}: { 
  hierarchy: FacultyHierarchy[]; 
  allMembers: FacultyItem[] 
}) {
  const [expandedFacultyId, setExpandedFacultyId] = useState<string | null>(
    hierarchy.length > 0 ? hierarchy[0].id : null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  const toggleFaculty = (id: string) => {
    setExpandedFacultyId(expandedFacultyId === id ? null : id);
  };

  const filteredMembers = selectedDepartmentId
    ? allMembers.filter(m => m.department_id === selectedDepartmentId)
    : expandedFacultyId
      ? allMembers.filter(m => m.departments?.faculty_id === expandedFacultyId)
      : allMembers;

  const currentFaculty = hierarchy.find(f => f.id === expandedFacultyId);
  const currentDepartment = currentFaculty?.departments?.find(d => d.id === selectedDepartmentId);
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Left Sidebar (Hierarchy) */}
      <div className="w-full lg:w-[280px] shrink-0 space-y-2 lg:sticky lg:top-28 z-10">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-full flex lg:hidden items-center justify-between text-xs font-extrabold text-slate-900 uppercase tracking-widest font-bangla"
          >
            <span className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-campus-50 text-campus-700">
                <BookOpen className="w-4 h-4" />
              </span>
              Filter Directory
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <h2 className="hidden lg:flex text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-5 items-center gap-2.5 font-bangla">
            <span className="p-1.5 rounded-lg bg-campus-50 text-campus-700">
              <BookOpen className="w-4 h-4" />
            </span>
            Academic Departments
          </h2>
          
          <div className={`space-y-3 mt-5 lg:mt-0 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <button
              onClick={() => {
                setExpandedFacultyId(null);
                setSelectedDepartmentId(null);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !expandedFacultyId 
                  ? 'bg-campus-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-campus-900'
              } font-bangla`}
            >
              All Faculties & Departments
            </button>

            {hierarchy.map(fac => (
              <div key={fac.id} className="space-y-1.5">
                <button
                  onClick={() => {
                    toggleFaculty(fac.id);
                    if (expandedFacultyId !== fac.id) setSelectedDepartmentId(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    expandedFacultyId === fac.id && !selectedDepartmentId 
                      ? 'bg-campus-900 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-50'
                  } font-bangla`}
                >
                  <span className="truncate">{fac.name}</span>
                  {expandedFacultyId === fac.id ? (
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  )}
                </button>
                
                {expandedFacultyId === fac.id && fac.departments?.length > 0 && (
                  <div className="pl-4 space-y-1 mt-2 border-l-2 border-slate-100 ml-4 py-1">
                    {fac.departments.map(dep => (
                      <button
                        key={dep.id}
                        onClick={() => {
                          setSelectedDepartmentId(dep.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                          selectedDepartmentId === dep.id 
                            ? 'text-campus-800 bg-campus-50' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        } font-bangla`}
                      >
                        {selectedDepartmentId === dep.id && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-campus-600 rounded-r-full -ml-4" />
                        )}
                        {dep.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Area (List View) */}
      <div className="flex-1 min-w-0">
        <div className="mb-8 pb-6 border-b border-slate-200/70">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display font-bangla">
            {selectedDepartmentId ? currentDepartment?.name : expandedFacultyId ? currentFaculty?.name : 'All Faculty Members'}
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-bangla">
            Showing <span className="font-bold text-slate-900">{filteredMembers.length}</span> member{filteredMembers.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        <div className="space-y-4">
          {filteredMembers.map((faculty) => (
            <Link
              key={faculty.id}
              href={`/faculty/${faculty.id}`}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-campus-300 transition-all duration-300"
            >
              {/* Profile Image */}
              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative group-hover:scale-105 transition-transform duration-500">
                {faculty.image_url ? (
                  <img 
                    src={faculty.image_url} 
                    alt={faculty.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors truncate font-bangla">
                  {faculty.name}
                </h3>
                <p className="text-sm font-bold text-campus-700 mt-1 mb-2.5 truncate font-bangla">
                  {faculty.title}
                </p>

                {faculty.departments && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 font-bangla truncate max-w-full">
                    {faculty.departments.name}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-campus-900 group-hover:text-white items-center justify-center transition-all duration-300">
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-24 text-center bg-slate-50/50 rounded-3xl border border-slate-100">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 font-bangla">No Members Found</h3>
            <p className="text-sm text-slate-500 mt-2 font-bangla">There are currently no faculty members assigned to this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
