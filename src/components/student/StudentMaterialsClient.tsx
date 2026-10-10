'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  FileArchive, 
  FileSpreadsheet, 
  Presentation, 
  FolderOpen,
  Eye,
  Building2,
  X,
  BookOpen,
  CheckCircle2,
  Layers
} from 'lucide-react';
import type { CourseMaterial, DepartmentOption } from '@/types';
import { formatFileSize } from '@/lib/utils';
import ViewMaterialDialog from '@/components/teacher/ViewMaterialDialog';

interface StudentMaterialsClientProps {
  initialMaterials: CourseMaterial[];
  departments: DepartmentOption[];
  studentDepartmentId: string | null;
}

export default function StudentMaterialsClient({
  initialMaterials,
  departments,
  studentDepartmentId
}: StudentMaterialsClientProps) {
  // Department filter defaults to student's assigned department if available, else 'all'
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(() => {
    if (studentDepartmentId && departments.some((d) => d.id === studentDepartmentId)) {
      return studentDepartmentId;
    }
    return 'all';
  });

  // Course filter state ('all' or specific course code)
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewingMaterial, setViewingMaterial] = useState<CourseMaterial | null>(null);

  // Student's department name for UI indication
  const studentDepartment = useMemo(() => {
    if (!studentDepartmentId) return null;
    return departments.find((d) => d.id === studentDepartmentId) || null;
  }, [departments, studentDepartmentId]);

  // Dynamically compute available unique courses based on department selection or all materials
  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    initialMaterials.forEach((m) => {
      if (m.course_code && m.course_code.trim()) {
        const code = m.course_code.trim();
        if (selectedDepartmentId === 'all') {
          set.add(code);
        } else {
          const matchesDept = m.departments && m.departments.some((d) => d.id === selectedDepartmentId);
          if (matchesDept) {
            set.add(code);
          }
        }
      }
    });
    return Array.from(set).sort();
  }, [initialMaterials, selectedDepartmentId]);

  // Compute course material counts for badge labels
  const courseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialMaterials.forEach((m) => {
      if (m.course_code && m.course_code.trim()) {
        const code = m.course_code.trim();
        const matchesDept = selectedDepartmentId === 'all' || 
          (m.departments && m.departments.some((d) => d.id === selectedDepartmentId));
        if (matchesDept) {
          counts[code] = (counts[code] || 0) + 1;
        }
      }
    });
    return counts;
  }, [initialMaterials, selectedDepartmentId]);

  // Filtered and smartly ordered materials
  const filteredMaterials = useMemo(() => {
    let result = [...initialMaterials];

    // 1. Department Filter
    if (selectedDepartmentId !== 'all') {
      result = result.filter(
        (m) => m.departments && m.departments.some((d) => d.id === selectedDepartmentId)
      );
    } else if (studentDepartmentId) {
      // If "all", order materials so those matching student's department appear first
      result.sort((a, b) => {
        const aMatches = a.departments?.some((d) => d.id === studentDepartmentId) ? 1 : 0;
        const bMatches = b.departments?.some((d) => d.id === studentDepartmentId) ? 1 : 0;

        if (bMatches !== aMatches) {
          return bMatches - aMatches;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    // 2. Course Filter
    if (selectedCourse !== 'all') {
      result = result.filter(
        (m) => (m.course_code || '').trim().toLowerCase() === selectedCourse.toLowerCase()
      );
    }

    // 3. Real-time Text Search (title, course_code, file_name, or department name)
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((m) => {
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesCode = m.course_code.toLowerCase().includes(q);
        const matchesFileName = m.file_name.toLowerCase().includes(q);
        const matchesDept = m.departments && m.departments.some((d) => d.name.toLowerCase().includes(q));
        return matchesTitle || matchesCode || matchesFileName || matchesDept;
      });
    }

    return result;
  }, [initialMaterials, selectedDepartmentId, selectedCourse, studentDepartmentId, searchQuery]);

  const getFileIcon = (fileName: string, mime: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'zip' || ext === 'rar' || mime.includes('zip')) {
      return <FileArchive className="w-4 h-4 text-amber-600" />;
    }
    if (ext === 'ppt' || ext === 'pptx' || mime.includes('presentation')) {
      return <Presentation className="w-4 h-4 text-orange-600" />;
    }
    if (ext === 'xls' || ext === 'xlsx' || mime.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  // Determine total materials matching current department for the "All Courses" count
  const departmentFilteredTotal = useMemo(() => {
    if (selectedDepartmentId === 'all') return initialMaterials.length;
    return initialMaterials.filter((m) =>
      m.departments && m.departments.some((d) => d.id === selectedDepartmentId)
    ).length;
  }, [initialMaterials, selectedDepartmentId]);

  return (
    <div className="space-y-6">
      {/* Header & Department Context */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-800 text-[11px] font-bold tracking-wide uppercase mb-1">
            Student Portal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display tracking-tight">
            Course Files & Study Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access lecture slides, syllabus sheets, and study materials shared by university faculty.
          </p>
        </div>

        {studentDepartment && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-campus-50/70 border border-campus-200 text-xs">
            <div className="w-7 h-7 rounded-xl bg-campus-900 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-campus-800 font-bold uppercase tracking-wider">
                My Enrolled Department
              </div>
              <div className="text-xs font-extrabold text-slate-900">
                {studentDepartment.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Real-time Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code, title, or file name..."
            className="w-full pl-9 pr-9 py-2.5 bg-campus-50/50 hover:bg-campus-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Container */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Department Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto">
            <span className="text-slate-500 font-semibold hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3 text-campus-700" />
              <span>Dept:</span>
            </span>
            <select
              value={selectedDepartmentId}
              onChange={(e) => {
                setSelectedDepartmentId(e.target.value);
                // Reset course if selected course is no longer available under the newly selected department
                setSelectedCourse('all');
              }}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 shadow-2xs cursor-pointer w-full sm:w-auto min-w-0 sm:min-w-[170px]"
            >
              <option value="all">
                All Departments ({initialMaterials.length})
              </option>
              {departments.map((dept) => {
                const isMine = dept.id === studentDepartmentId;
                const count = initialMaterials.filter(
                  (m) => m.departments && m.departments.some((d) => d.id === dept.id)
                ).length;
                return (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} {isMine ? '★ (My Dept)' : ''} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Course Filter Dropdown (NEW) */}
          <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto">
            <span className="text-slate-500 font-semibold hidden sm:inline flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-campus-700" />
              <span>Course:</span>
            </span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 shadow-2xs cursor-pointer w-full sm:w-auto min-w-0 sm:min-w-[160px]"
            >
              <option value="all">
                All Courses ({departmentFilteredTotal})
              </option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c} ({courseCounts[c] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Quick reset button if any filter is active */}
          {(selectedDepartmentId !== (studentDepartmentId || 'all') || selectedCourse !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDepartmentId(studentDepartmentId || 'all');
                setSelectedCourse('all');
                setSearchQuery('');
              }}
              className="text-[11px] text-campus-700 hover:text-campus-900 font-semibold px-2 py-1 rounded-lg hover:bg-campus-50 transition-colors shrink-0"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-700">
            Showing {filteredMaterials.length} of {initialMaterials.length} files
          </span>

          {selectedDepartmentId !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-semibold">
              <Building2 className="w-3 h-3 text-campus-700" />
              <span>Dept: {departments.find(d => d.id === selectedDepartmentId)?.name || 'Department'}</span>
              <button 
                onClick={() => {
                  setSelectedDepartmentId('all');
                  setSelectedCourse('all');
                }} 
                className="hover:text-campus-950 p-0.5 ml-0.5"
                title="Clear department filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCourse !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-semibold">
              <BookOpen className="w-3 h-3 text-indigo-700" />
              <span>Course: {selectedCourse}</span>
              <button 
                onClick={() => setSelectedCourse('all')} 
                className="hover:text-indigo-950 p-0.5 ml-0.5"
                title="Clear course filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
              <span>Keyword: &quot;{searchQuery}&quot;</span>
              <button 
                onClick={() => setSearchQuery('')} 
                className="hover:text-slate-900 p-0.5 ml-0.5"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Clear All Filters Action */}
        {(selectedDepartmentId !== (studentDepartmentId || 'all') || selectedCourse !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedDepartmentId(studentDepartmentId || 'all');
              setSelectedCourse('all');
              setSearchQuery('');
            }}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Materials Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead className="bg-campus-50/80 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-[38%]">Material & File</th>
                <th className="p-4 w-[24%]">Course & Tagged Departments</th>
                <th className="p-4 w-[12%]">Size</th>
                <th className="p-4 w-[12%]">Upload Date</th>
                <th className="p-4 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMaterials.map((mat) => {
                const isMatchingMyDept = 
                  studentDepartmentId && 
                  mat.departments?.some((d) => d.id === studentDepartmentId);

                return (
                  <tr key={mat.id} className="hover:bg-campus-50/50 transition-colors group">
                    {/* Material Title & File Name */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:border-campus-300 transition-colors">
                          {getFileIcon(mat.file_name, mat.file_type)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-campus-900 transition-colors flex items-center gap-1.5">
                            <span>{mat.title}</span>
                            {isMatchingMyDept && selectedDepartmentId === 'all' && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-campus-100 text-campus-900 border border-campus-200 shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                My Dept
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                            {mat.file_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course Code & Tagged Departments */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {/* Clickable Course Code Badge */}
                        <button
                          type="button"
                          onClick={() => setSelectedCourse(mat.course_code.trim())}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-campus-100/70 hover:bg-campus-200/90 text-campus-900 font-extrabold text-[11px] border border-campus-200/60 font-mono transition-colors cursor-pointer"
                          title={`Filter by course: ${mat.course_code}`}
                        >
                          {mat.course_code}
                        </button>

                        {mat.departments && mat.departments.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-[240px]">
                            {mat.departments.map((dept) => {
                              const isStudentDept = dept.id === studentDepartmentId;
                              return (
                                <button
                                  type="button"
                                  key={dept.id}
                                  onClick={() => setSelectedDepartmentId(dept.id)}
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                                    isStudentDept
                                      ? 'bg-campus-900 hover:bg-campus-800 text-white border-campus-900 font-semibold'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                  }`}
                                  title={`Filter by department: ${dept.name}`}
                                >
                                  {dept.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Size */}
                    <td className="p-4 font-medium text-slate-600">
                      {formatFileSize(mat.file_size)}
                    </td>

                    {/* Upload Date */}
                    <td className="p-4 text-slate-500">
                      {formatDate(mat.created_at)}
                    </td>

                    {/* Actions: In-App Preview & Download */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* View in-app preview modal */}
                        <button
                          onClick={() => setViewingMaterial(mat)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-campus-50 hover:bg-campus-100 text-campus-800 font-bold text-xs transition-colors border border-campus-200"
                          title="Preview Document in Browser"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        {/* Download link */}
                        <a
                          href={mat.file_url}
                          download={mat.file_name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-1.5 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-1">
                        No materials found
                      </div>
                      <p className="text-xs text-slate-400">
                        {searchQuery || selectedDepartmentId !== 'all' || selectedCourse !== 'all'
                          ? 'No files match your department, course, or search keywords.'
                          : 'There are currently no course materials published.'}
                      </p>
                      {(searchQuery || selectedDepartmentId !== 'all' || selectedCourse !== 'all') && (
                        <button
                          onClick={() => {
                            setSelectedDepartmentId('all');
                            setSelectedCourse('all');
                            setSearchQuery('');
                          }}
                          className="mt-2 text-xs font-bold text-campus-800 hover:underline"
                        >
                          Show all course materials
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Document Preview Modal */}
      <ViewMaterialDialog
        material={viewingMaterial}
        isOpen={!!viewingMaterial}
        onClose={() => setViewingMaterial(null)}
      />
    </div>
  );
}
