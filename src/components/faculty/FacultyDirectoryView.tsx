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
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Left Sidebar (Hierarchy) */}
      <div className="w-full md:w-64 shrink-0 space-y-2 md:sticky md:top-24">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-full flex md:hidden items-center justify-between text-sm font-extrabold text-slate-900 uppercase tracking-widest"
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-campus-700" /> Filter Directory</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <h2 className="hidden md:flex text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 items-center gap-2">
            <BookOpen className="w-4 h-4 text-campus-700" /> Academic Faculties
          </h2>
          
          <div className={`space-y-2 mt-4 md:mt-0 ${isMobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <button
              onClick={() => {
                setExpandedFacultyId(null);
                setSelectedDepartmentId(null);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                !expandedFacultyId ? 'bg-campus-800 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Faculties & Departments
            </button>

            {hierarchy.map(fac => (
              <div key={fac.id} className="space-y-1">
                <button
                  onClick={() => {
                    toggleFaculty(fac.id);
                    if (expandedFacultyId !== fac.id) setSelectedDepartmentId(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    expandedFacultyId === fac.id && !selectedDepartmentId ? 'bg-campus-800 text-white' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">{fac.name}</span>
                  {expandedFacultyId === fac.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>
                
                {expandedFacultyId === fac.id && fac.departments?.length > 0 && (
                  <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-200 ml-3">
                    {fac.departments.map(dep => (
                      <button
                        key={dep.id}
                        onClick={() => {
                          setSelectedDepartmentId(dep.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          selectedDepartmentId === dep.id ? 'bg-campus-100 text-campus-800' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
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

      {/* Right Content Area (Grid) */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-900 heading-display">
            {selectedDepartmentId ? currentDepartment?.name : expandedFacultyId ? currentFaculty?.name : 'All Faculty Members'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Showing {filteredMembers.length} result{filteredMembers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((faculty) => (
            <Link
              key={faculty.id}
              href={`/faculty/${faculty.id}`}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center p-6"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-sm relative">
                {faculty.image_url ? (
                  <img 
                    src={faculty.image_url} 
                    alt={faculty.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors line-clamp-1">
                {faculty.name}
              </h3>
              <p className="text-xs font-bold text-campus-700 mt-1 mb-2 line-clamp-1">
                {faculty.title}
              </p>

              {faculty.departments && (
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-4 line-clamp-2">
                  {faculty.departments.name}
                </p>
              )}

              <div className="mt-auto inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-400 group-hover:text-campus-800 transition-colors">
                <span>View Profile</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-20 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Members Found</h3>
            <p className="text-sm text-slate-500 mt-2">There are currently no faculty members assigned to this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
