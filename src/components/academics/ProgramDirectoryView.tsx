'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ChevronDown, ChevronRight, GraduationCap, Search } from 'lucide-react';
import { FacultyHierarchy, ProgramItem } from '@/utils/supabase/queries';

export default function ProgramDirectoryView({ 
  hierarchy, 
  allPrograms,
  initialFacultyId 
}: { 
  hierarchy: FacultyHierarchy[]; 
  allPrograms: ProgramItem[];
  initialFacultyId?: string;
}) {
  const [expandedFacultyId, setExpandedFacultyId] = useState<string | null>(
    initialFacultyId || (hierarchy.length > 0 ? hierarchy[0].id : null)
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Update expanded faculty if the URL param changes
  useEffect(() => {
    if (initialFacultyId) {
      setExpandedFacultyId(initialFacultyId);
      setSelectedDepartmentId(null);
    }
  }, [initialFacultyId]);

  const toggleFaculty = (id: string) => {
    setExpandedFacultyId(expandedFacultyId === id ? null : id);
  };

  // Filter hierarchy for the sidebar based on search query
  const filteredHierarchy = hierarchy.filter(fac => {
    const matchesFac = fac.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDep = fac.departments?.some(dep => dep.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFac || matchesDep;
  });

  const filteredPrograms = selectedDepartmentId
    ? allPrograms.filter(p => p.department_id === selectedDepartmentId)
    : expandedFacultyId
      ? allPrograms.filter(p => p.departments?.faculty_id === expandedFacultyId)
      : allPrograms;

  const currentFaculty = hierarchy.find(f => f.id === expandedFacultyId);
  const currentDepartment = currentFaculty?.departments?.find(d => d.id === selectedDepartmentId);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Left Sidebar (Hierarchy) */}
      <div className="w-full md:w-72 shrink-0 space-y-4 sticky top-24">
        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Find faculty or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none text-sm bg-white shadow-sm transition-all"
          />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Building2Icon className="w-4 h-4 text-campus-700" /> Academic Faculties
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                setExpandedFacultyId(null);
                setSelectedDepartmentId(null);
                setSearchQuery(''); // clear search when clicking all
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                !expandedFacultyId ? 'bg-campus-800 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Programs
            </button>

            {filteredHierarchy.map(fac => (
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
                        onClick={() => setSelectedDepartmentId(dep.id)}
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
            {selectedDepartmentId ? currentDepartment?.name : expandedFacultyId ? currentFaculty?.name : 'All Programs'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Link
              key={program.id}
              href={`/academics/${program.id}`}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group p-6"
            >
              <div className="mb-4 text-purple-600 bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors line-clamp-2">
                {program.name}
              </h3>
              
              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-campus-700">
                  {program.degree_level} • {program.duration_years} Years
                </p>
                {program.departments && (
                  <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                    {program.departments.name}
                  </p>
                )}
              </div>

              <div className="mt-6 flex-1 text-xs text-slate-600 line-clamp-3">
                {program.description}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 inline-flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-campus-800 transition-colors w-full">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform ml-auto" />
              </div>
            </Link>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Programs Found</h3>
            <p className="text-sm text-slate-500 mt-2">There are currently no programs available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" />
    </svg>
  )
}
