'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Upload, 
  FileArchive, 
  FileSpreadsheet, 
  Presentation, 
  Loader2, 
  AlertTriangle,
  FolderOpen,
  Eye,
  UserCheck,
  Compass,
  GraduationCap,
  Building2,
  X,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import type { CourseMaterial, DepartmentOption } from '@/types';
import type { DepartmentWithFaculty } from '@/utils/supabase/queries';
import { formatFileSize } from '@/lib/utils';
import { deleteCourseMaterial } from '@/app/actions/teacher';
import UploadMaterialDialog from './UploadMaterialDialog';
import ViewMaterialDialog from './ViewMaterialDialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

interface TeacherMaterialsTableProps {
  myMaterials?: CourseMaterial[];
  allMaterials?: CourseMaterial[];
  initialMaterials?: CourseMaterial[];
  departments?: DepartmentWithFaculty[];
  defaultDepartmentId?: string | null;
  currentUserId?: string;
}

export default function TeacherMaterialsTable({ 
  myMaterials,
  allMaterials,
  initialMaterials,
  departments = [],
  defaultDepartmentId = null,
  currentUserId = ''
}: TeacherMaterialsTableProps) {
  // Tab State: 'my' = My Uploaded Materials, 'all' = All Faculty Materials
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');

  // Materials data lists with optimistic updates
  const [myMaterialsList, setMyMaterialsList] = useState<CourseMaterial[]>(
    myMaterials || initialMaterials || []
  );
  const [allMaterialsList, setAllMaterialsList] = useState<CourseMaterial[]>(
    allMaterials || initialMaterials || []
  );

  // Sync state if props change
  useEffect(() => {
    if (myMaterials) {
      setMyMaterialsList(myMaterials);
    } else if (initialMaterials) {
      setMyMaterialsList(initialMaterials);
    }
  }, [myMaterials, initialMaterials]);

  useEffect(() => {
    if (allMaterials) {
      setAllMaterialsList(allMaterials);
    } else if (initialMaterials) {
      setAllMaterialsList(initialMaterials);
    }
  }, [allMaterials, initialMaterials]);

  // Tab 1 (My Materials) Filter States
  const [mySearchQuery, setMySearchQuery] = useState<string>('');
  const [mySelectedCourse, setMySelectedCourse] = useState<string>('ALL');

  // Tab 2 (All Faculty Materials) Filter States
  const [allSearchQuery, setAllSearchQuery] = useState<string>('');
  const [allSelectedFaculty, setAllSelectedFaculty] = useState<string>('ALL');
  const [allSelectedDepartment, setAllSelectedDepartment] = useState<string>('ALL');
  const [allSelectedCourse, setAllSelectedCourse] = useState<string>('ALL');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [viewingMaterial, setViewingMaterial] = useState<CourseMaterial | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<CourseMaterial | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // --- DERIVED METADATA FOR FILTERS ---

  // Distinct faculties derived from departments and all materials
  const facultiesList = useMemo(() => {
    const map = new Map<string, string>();
    departments.forEach((d) => {
      if (d.faculty_name) {
        map.set(d.faculty_name, d.faculty_name);
      }
    });
    allMaterialsList.forEach((m) => {
      m.departments?.forEach((d) => {
        if (d.faculty_name) {
          map.set(d.faculty_name, d.faculty_name);
        }
      });
    });
    return Array.from(map.values()).sort();
  }, [departments, allMaterialsList]);

  // Unique course codes for My Materials
  const myUniqueCourses = useMemo(() => {
    const set = new Set<string>();
    myMaterialsList.forEach((m) => {
      if (m.course_code) set.add(m.course_code);
    });
    return Array.from(set).sort();
  }, [myMaterialsList]);

  // Unique course codes for All Materials (optionally filtered by selected faculty)
  const allUniqueCourses = useMemo(() => {
    const set = new Set<string>();
    allMaterialsList.forEach((m) => {
      if (allSelectedFaculty === 'ALL') {
        if (m.course_code) set.add(m.course_code);
      } else {
        const matchesFac = m.departments?.some((d) => d.faculty_name === allSelectedFaculty);
        if (matchesFac && m.course_code) set.add(m.course_code);
      }
    });
    return Array.from(set).sort();
  }, [allMaterialsList, allSelectedFaculty]);

  // Departments available in the department dropdown (filtered if a specific faculty is selected)
  const availableDepartments = useMemo(() => {
    if (allSelectedFaculty === 'ALL') {
      return departments;
    }
    return departments.filter((d) => d.faculty_name === allSelectedFaculty);
  }, [departments, allSelectedFaculty]);

  // Faculty material counts
  const facultyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    facultiesList.forEach((fac) => {
      counts[fac] = allMaterialsList.filter((m) =>
        m.departments?.some((d) => d.faculty_name === fac)
      ).length;
    });
    return counts;
  }, [facultiesList, allMaterialsList]);

  // --- FILTERED LISTS ---

  // Filtered My Materials (Tab 1)
  const filteredMyMaterials = useMemo(() => {
    return myMaterialsList.filter((m) => {
      const matchesCourse = mySelectedCourse === 'ALL' || m.course_code === mySelectedCourse;
      const q = mySearchQuery.toLowerCase().trim();
      const matchesQuery = 
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.file_name.toLowerCase().includes(q) ||
        m.course_code.toLowerCase().includes(q) ||
        (m.departments && m.departments.some((d) => d.name.toLowerCase().includes(q)));

      return matchesCourse && matchesQuery;
    });
  }, [myMaterialsList, mySelectedCourse, mySearchQuery]);

  // Filtered All Materials (Tab 2)
  const filteredAllMaterials = useMemo(() => {
    return allMaterialsList.filter((m) => {
      // 1. Faculty filter
      const matchesFaculty =
        allSelectedFaculty === 'ALL' ||
        (m.departments && m.departments.some((d) => d.faculty_name === allSelectedFaculty));

      // 2. Department filter
      const matchesDepartment =
        allSelectedDepartment === 'ALL' ||
        (m.departments && m.departments.some((d) => d.id === allSelectedDepartment));

      // 3. Course filter
      const matchesCourse =
        allSelectedCourse === 'ALL' || m.course_code === allSelectedCourse;

      // 4. Search query
      const q = allSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.file_name.toLowerCase().includes(q) ||
        m.course_code.toLowerCase().includes(q) ||
        (m.teacher_name && m.teacher_name.toLowerCase().includes(q)) ||
        (m.teacher_email && m.teacher_email.toLowerCase().includes(q)) ||
        (m.departments && m.departments.some((d) => d.name.toLowerCase().includes(q) || (d.faculty_name && d.faculty_name.toLowerCase().includes(q))));

      return matchesFaculty && matchesDepartment && matchesCourse && matchesQuery;
    });
  }, [allMaterialsList, allSelectedFaculty, allSelectedDepartment, allSelectedCourse, allSearchQuery]);

  // Helper to check if any filter is active in Tab 2
  const isAllFilterActive = 
    allSelectedFaculty !== 'ALL' || 
    allSelectedDepartment !== 'ALL' || 
    allSelectedCourse !== 'ALL' || 
    allSearchQuery.trim() !== '';

  const resetAllFilters = () => {
    setAllSelectedFaculty('ALL');
    setAllSelectedDepartment('ALL');
    setAllSelectedCourse('ALL');
    setAllSearchQuery('');
  };

  // --- DELETE HANDLER ---
  const handleDeleteConfirm = async () => {
    if (!deletingMaterial) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteCourseMaterial(deletingMaterial.id, deletingMaterial.file_url);
      if (res.error) {
        setDeleteError(res.error);
        setIsDeleting(false);
        return;
      }

      // Optimistically remove from both state lists
      setMyMaterialsList((prev) => prev.filter((m) => m.id !== deletingMaterial.id));
      setAllMaterialsList((prev) => prev.filter((m) => m.id !== deletingMaterial.id));
      setDeletingMaterial(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete material.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper icons and date formatters
  const getFileIcon = (fileName: string, mime: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'zip' || ext === 'rar' || mime?.includes('zip')) {
      return <FileArchive className="w-4 h-4 text-amber-600" />;
    }
    if (ext === 'ppt' || ext === 'pptx' || mime?.includes('presentation')) {
      return <Presentation className="w-4 h-4 text-orange-600" />;
    }
    if (ext === 'xls' || ext === 'xlsx' || mime?.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-campus-600" />;
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

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* MAIN HEADER WITH ACTION BUTTON                           */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-50 border border-campus-200/80 text-campus-800 text-[11px] font-bold tracking-wider uppercase mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-campus-700" />
            Teacher Academic Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display tracking-tight">
            Course Materials & University Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage your uploaded lecture files and explore syllabus materials, lecture notes, and lab manuals shared by colleagues across all faculties.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Upload className="w-4 h-4 text-campus-300" />
          <span>Upload New Material</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* DUAL NAVIGATION TABS                                     */}
      {/* ======================================================== */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-px">
        {/* Tab 1: My Uploads */}
        <button
          onClick={() => setActiveTab('my')}
          className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'my'
              ? 'border-campus-800 text-campus-900 bg-campus-50/50 rounded-t-2xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <UserCheck className={`w-4 h-4 ${activeTab === 'my' ? 'text-campus-800' : 'text-slate-400'}`} />
          <span>My Uploaded Materials</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              activeTab === 'my'
                ? 'bg-campus-800 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {myMaterialsList.length}
          </span>
        </button>

        {/* Tab 2: All Faculty Materials */}
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-campus-800 text-campus-900 bg-campus-50/50 rounded-t-2xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === 'all' ? 'text-campus-800' : 'text-slate-400'}`} />
          <span>All Faculty Materials</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              activeTab === 'all'
                ? 'bg-campus-800 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {allMaterialsList.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MY UPLOADED MATERIALS                             */}
      {/* ======================================================== */}
      {activeTab === 'my' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Subheader & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={mySearchQuery}
                onChange={(e) => setMySearchQuery(e.target.value)}
                placeholder="Search by title, file name, or course code..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 shadow-2xs"
              />
              {mySearchQuery && (
                <button
                  onClick={() => setMySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Course:</span>
              <select
                value={mySelectedCourse}
                onChange={(e) => setMySelectedCourse(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 shadow-2xs"
              >
                <option value="ALL">All My Courses ({myMaterialsList.length})</option>
                {myUniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c} ({myMaterialsList.filter((m) => m.course_code === c).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead className="bg-campus-50/70 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 w-[38%]">Title & File Name</th>
                    <th className="p-4 w-[24%]">Course & Tagged Departments</th>
                    <th className="p-4 w-[12%]">Size</th>
                    <th className="p-4 w-[14%]">Upload Date</th>
                    <th className="p-4 w-[12%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredMyMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-campus-50/40 transition-colors group">
                      {/* Title & File Name */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:border-campus-300 transition-colors">
                            {getFileIcon(mat.file_name, mat.file_type)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-campus-900 transition-colors">
                              {mat.title}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                              {mat.file_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course & Tagged Departments */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-campus-100/70 text-campus-900 font-extrabold text-[11px] border border-campus-200/60 font-mono">
                            {mat.course_code}
                          </span>
                          {mat.departments && mat.departments.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-[260px]">
                              {mat.departments.map((dept) => (
                                <span
                                  key={dept.id}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/80"
                                >
                                  {dept.name}
                                </span>
                              ))}
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

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* In-App Preview */}
                          <button
                            onClick={() => setViewingMaterial(mat)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                            title="View / Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Download */}
                          <a
                            href={mat.file_url}
                            download={mat.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete (Owner only) */}
                          <button
                            onClick={() => {
                              setDeleteError(null);
                              setDeletingMaterial(mat);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty State */}
                  {filteredMyMaterials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                            <FolderOpen className="w-6 h-6" />
                          </div>
                          <div className="font-bold text-slate-800 text-sm mt-1">
                            No materials found in your uploads
                          </div>
                          <p className="text-xs text-slate-400">
                            {mySearchQuery || mySelectedCourse !== 'ALL'
                              ? 'No course files match the selected filter or search keyword.'
                              : 'You have not uploaded any lecture files or syllabus materials yet.'}
                          </p>
                          <button
                            onClick={() => setIsUploadOpen(true)}
                            className="mt-2 text-xs font-bold text-campus-800 hover:underline"
                          >
                            + Upload your first material
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ALL FACULTY MATERIALS (ORGANIZED UNIVERSITY REPO) */}
      {/* ======================================================== */}
      {activeTab === 'all' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Top Organization Card: Faculty Navigation Pills */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-campus-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Browse by University Faculty
                </h3>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Click a faculty pill to narrow materials instantly
              </div>
            </div>

            {/* Faculty Pills Carousel / Wrap */}
            <div className="flex flex-wrap items-center gap-2">
              {/* All Faculties Pill */}
              <button
                type="button"
                onClick={() => {
                  setAllSelectedFaculty('ALL');
                  setAllSelectedDepartment('ALL');
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  allSelectedFaculty === 'ALL'
                    ? 'bg-campus-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>All Faculties</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    allSelectedFaculty === 'ALL'
                      ? 'bg-campus-800 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {allMaterialsList.length}
                </span>
              </button>

              {/* Specific Faculty Pills */}
              {facultiesList.map((facultyName) => {
                const count = facultyCounts[facultyName] || 0;
                const isSelected = allSelectedFaculty === facultyName;
                return (
                  <button
                    key={facultyName}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setAllSelectedFaculty('ALL');
                        setAllSelectedDepartment('ALL');
                      } else {
                        setAllSelectedFaculty(facultyName);
                        setAllSelectedDepartment('ALL');
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-campus-900 text-white shadow-xs ring-2 ring-campus-800/20'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <span>{facultyName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isSelected
                          ? 'bg-campus-800 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Filter & Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={allSearchQuery}
                onChange={(e) => setAllSearchQuery(e.target.value)}
                placeholder="Search by title, course, file, or instructor name..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 focus:bg-white"
              />
              {allSearchQuery && (
                <button
                  onClick={() => setAllSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Department:
              </span>
              <select
                value={allSelectedDepartment}
                onChange={(e) => setAllSelectedDepartment(e.target.value)}
                className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 max-w-[200px] truncate"
              >
                <option value="ALL">All Departments</option>
                {allSelectedFaculty === 'ALL' ? (
                  // Group by faculty when All Faculties is selected
                  facultiesList.map((faculty) => {
                    const deptsInFac = departments.filter((d) => d.faculty_name === faculty);
                    if (deptsInFac.length === 0) return null;
                    return (
                      <optgroup key={faculty} label={faculty}>
                        {deptsInFac.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : (
                  // Show only departments under the selected faculty
                  availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Course:
              </span>
              <select
                value={allSelectedCourse}
                onChange={(e) => setAllSelectedCourse(e.target.value)}
                className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 max-w-[150px]"
              >
                <option value="ALL">All Courses</option>
                {allUniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters Button */}
            {isAllFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors shrink-0"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Active Filter Chips & Feedback Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700">
                Showing {filteredAllMaterials.length} of {allMaterialsList.length} materials
              </span>

              {allSelectedFaculty !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
                  Faculty: {allSelectedFaculty}
                  <button onClick={() => setAllSelectedFaculty('ALL')} className="hover:text-campus-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {allSelectedDepartment !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
                  Dept: {departments.find((d) => d.id === allSelectedDepartment)?.name || allSelectedDepartment}
                  <button onClick={() => setAllSelectedDepartment('ALL')} className="hover:text-campus-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {allSelectedCourse !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
                  Course: {allSelectedCourse}
                  <button onClick={() => setAllSelectedCourse('ALL')} className="hover:text-campus-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {allSearchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
                  Search: &ldquo;{allSearchQuery}&rdquo;
                  <button onClick={() => setAllSearchQuery('')} className="hover:text-campus-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              Available across all university departments
            </span>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-campus-50/70 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 w-[32%]">Course Material</th>
                    <th className="p-4 w-[22%]">Instructor / Uploader</th>
                    <th className="p-4 w-[22%]">Course & Faculty / Dept</th>
                    <th className="p-4 w-[11%]">Size</th>
                    <th className="p-4 w-[13%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredAllMaterials.map((mat) => {
                    const isOwner = currentUserId && mat.teacher_id === currentUserId;
                    const uploaderName = mat.teacher_name || mat.teacher_email || 'Instructor';

                    return (
                      <tr key={mat.id} className="hover:bg-campus-50/40 transition-colors group">
                        {/* Title & File Name */}
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:border-campus-300 transition-colors">
                              {getFileIcon(mat.file_name, mat.file_type)}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-campus-900 transition-colors">
                                {mat.title}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate max-w-[260px]">
                                {mat.file_name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Instructor / Uploader */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-campus-100 border border-campus-200 flex items-center justify-center text-campus-900 font-extrabold text-[10px] shrink-0">
                              {uploaderName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 truncate max-w-[140px]">
                                  {uploaderName}
                                </span>
                                {isOwner && (
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px] border border-emerald-200">
                                    You
                                  </span>
                                )}
                              </div>
                              {mat.teacher_email && (
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                  {mat.teacher_email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Course & Faculty / Dept */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-campus-100/70 text-campus-900 font-extrabold text-[11px] border border-campus-200/60 font-mono">
                              {mat.course_code}
                            </span>
                            {mat.departments && mat.departments.length > 0 && (
                              <div className="flex flex-wrap gap-1 max-w-[240px]">
                                {mat.departments.map((dept) => (
                                  <span
                                    key={dept.id}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/80"
                                    title={dept.faculty_name ? `Faculty: ${dept.faculty_name}` : undefined}
                                  >
                                    {dept.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Size */}
                        <td className="p-4 text-slate-600 font-medium">
                          <div>{formatFileSize(mat.file_size)}</div>
                          <div className="text-[10px] text-slate-400">{formatDate(mat.created_at)}</div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* In-App Preview */}
                            <button
                              onClick={() => setViewingMaterial(mat)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                              title="View / Preview Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Download */}
                            <a
                              href={mat.file_url}
                              download={mat.file_name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete (ONLY shown if the current teacher is the author) */}
                            {isOwner && (
                              <button
                                onClick={() => {
                                  setDeleteError(null);
                                  setDeletingMaterial(mat);
                                }}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                                title="Delete My Material"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Empty State */}
                  {filteredAllMaterials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="font-bold text-slate-800 text-sm mt-1">
                            No university materials found
                          </div>
                          <p className="text-xs text-slate-400">
                            No course materials match your current faculty, department, or search filters.
                          </p>
                          {isAllFilterActive && (
                            <button
                              onClick={resetAllFilters}
                              className="mt-2 text-xs font-bold text-campus-800 hover:underline inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset all filters</span>
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
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS: UPLOAD, VIEW, DELETE                             */}
      {/* ======================================================== */}

      {/* Upload Dialog */}
      <UploadMaterialDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        existingCourses={myUniqueCourses}
        departments={departments}
        defaultDepartmentId={defaultDepartmentId}
        onSuccess={() => {
          // Full sync upon upload
          window.location.reload();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deletingMaterial} 
        onOpenChange={(open) => !open && !isDeleting && setDeletingMaterial(null)}
      >
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Delete Course Material
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to permanently delete this material? This will remove the file from the student and teacher portals.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
              {deleteError}
            </div>
          )}

          {deletingMaterial && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{deletingMaterial.title}</div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                {deletingMaterial.course_code} • {deletingMaterial.file_name} ({formatFileSize(deletingMaterial.file_size)})
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeletingMaterial(null)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Material</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* In-App Document Preview Modal */}
      <ViewMaterialDialog
        material={viewingMaterial}
        isOpen={!!viewingMaterial}
        onClose={() => setViewingMaterial(null)}
      />
    </div>
  );
}
