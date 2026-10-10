'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Users, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Mail, 
  Hash, 
  X, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown,
  BookOpen,
  Tag,
  Clock,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { UserProfileItem, DepartmentWithFaculty } from '@/utils/supabase/queries';
import { deleteUniversityUser } from '@/app/actions/admin-users';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

interface UserAccountsTableProps {
  initialProfiles: UserProfileItem[];
  departments?: DepartmentWithFaculty[];
}

export default function UserAccountsTable({ 
  initialProfiles,
  departments = []
}: UserAccountsTableProps) {
  // --- STATE ---
  // Level 1: Faculty Selection ('ALL' | 'ADMINS' | faculty name string)
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  // Level 2: Role Selection ('ALL' | 'TEACHER' | 'STUDENT' | 'ADMIN')
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  // Level 3: Department, Batch (Students only), Search, Sort, Pagination
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'id-asc'>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Local reactive list of profiles
  const [profilesList, setProfilesList] = useState<UserProfileItem[]>(initialProfiles);

  useEffect(() => {
    setProfilesList(initialProfiles);
  }, [initialProfiles]);

  // Inspector Modal State
  const [inspectingUser, setInspectingUser] = useState<UserProfileItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Deletion Modal & Feedback State
  const [deletingUser, setDeletingUser] = useState<UserProfileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [feedbackNotification, setFeedbackNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deletingUser || isDeleting) return;

    // Strict client-side admin check
    if ((deletingUser.role || '').toUpperCase() === 'ADMIN') {
      setDeleteError('Security Violation: Administrator accounts cannot be deleted.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteUniversityUser(deletingUser.id);
      if (res.success) {
        const removedId = deletingUser.id;
        setProfilesList((prev) => prev.filter((p) => p.id !== removedId));
        if (inspectingUser?.id === removedId) {
          setInspectingUser(null);
        }
        setDeletingUser(null);
        setFeedbackNotification({
          type: 'success',
          message: res.message || 'User deleted successfully.'
        });
        setTimeout(() => setFeedbackNotification(null), 5000);
      } else {
        setDeleteError(res.error || 'Failed to delete user.');
      }
    } catch (err: any) {
      setDeleteError(err?.message || 'Unexpected error occurred while deleting user.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- DERIVED METADATA ---

  // Canonical list of faculties from departments & profiles
  const facultiesList = useMemo(() => {
    const set = new Set<string>();
    departments.forEach((d) => {
      if (d.faculty_name) set.add(d.faculty_name);
    });
    profilesList.forEach((p) => {
      if (p.faculty_name) set.add(p.faculty_name);
      if (p.department?.faculty_name) set.add(p.department.faculty_name);
    });
    return Array.from(set).sort();
  }, [departments, profilesList]);

  // Overall Global Counts
  const overallStats = useMemo(() => {
    let teachers = 0;
    let students = 0;
    let admins = 0;

    profilesList.forEach((p) => {
      const r = (p.role || '').toUpperCase();
      if (r === 'TEACHER') teachers++;
      else if (r === 'STUDENT') students++;
      else if (r === 'ADMIN') admins++;
    });

    return {
      total: profilesList.length,
      teachers,
      students,
      admins,
    };
  }, [profilesList]);

  // Counts per Faculty
  const facultyStats = useMemo(() => {
    const stats: Record<string, { total: number; teachers: number; students: number }> = {};
    facultiesList.forEach((fac) => {
      stats[fac] = { total: 0, teachers: 0, students: 0 };
    });

    profilesList.forEach((p) => {
      const fac = p.faculty_name || p.department?.faculty_name;
      if (fac && stats[fac]) {
        stats[fac].total++;
        const r = (p.role || '').toUpperCase();
        if (r === 'TEACHER') stats[fac].teachers++;
        else if (r === 'STUDENT') stats[fac].students++;
      }
    });

    return stats;
  }, [facultiesList, profilesList]);

  // Departments available for dropdown (filtered by selected faculty)
  const availableDepartments = useMemo(() => {
    if (selectedFaculty === 'ALL' || selectedFaculty === 'ADMINS') {
      return departments;
    }
    return departments.filter((d) => d.faculty_name === selectedFaculty);
  }, [departments, selectedFaculty]);

  // Unique batches available for students (contextualized by selected faculty & department)
  const { batchesList, hasUnassignedBatchStudents } = useMemo(() => {
    const set = new Set<string>();
    let hasUnassigned = false;

    profilesList.forEach((p) => {
      const r = (p.role || '').toUpperCase();
      if (r === 'STUDENT') {
        const fac = p.faculty_name || p.department?.faculty_name || null;
        if (selectedFaculty !== 'ALL' && selectedFaculty !== 'ADMINS' && fac !== selectedFaculty) {
          return;
        }
        if (selectedDepartment !== 'ALL' && p.department_id !== selectedDepartment) {
          return;
        }

        if (p.batch && p.batch.trim()) {
          set.add(p.batch.trim());
        } else {
          hasUnassigned = true;
        }
      }
    });

    const sortedBatches = Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );

    return {
      batchesList: sortedBatches,
      hasUnassignedBatchStudents: hasUnassigned,
    };
  }, [profilesList, selectedFaculty, selectedDepartment]);

  // Handle Faculty change (and sync role selection & reset batch)
  const handleFacultyChange = (faculty: string) => {
    setSelectedFaculty(faculty);
    setSelectedDepartment('ALL');
    setSelectedBatch('ALL');
    setCurrentPage(1);

    if (faculty === 'ADMINS') {
      setSelectedRole('ADMIN');
    } else if (selectedRole === 'ADMIN') {
      setSelectedRole('ALL');
    }
  };

  // Handle Role tab change (resets student-only batch filter when leaving students view)
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (role !== 'STUDENT') {
      setSelectedBatch('ALL');
    }
    setCurrentPage(1);
  };

  // --- FILTERING & SORTING LOGIC ---
  const filteredProfiles = useMemo(() => {
    return profilesList.filter((p) => {
      const role = (p.role || '').toUpperCase();
      const fac = p.faculty_name || p.department?.faculty_name || null;

      // 1. Faculty Filter
      if (selectedFaculty === 'ADMINS') {
        if (role !== 'ADMIN') return false;
      } else if (selectedFaculty !== 'ALL') {
        if (fac !== selectedFaculty) return false;
      }

      // 2. Role Filter
      if (selectedRole !== 'ALL') {
        if (role !== selectedRole) return false;
      }

      // 3. Department Filter
      if (selectedDepartment !== 'ALL') {
        if (p.department_id !== selectedDepartment) return false;
      }

      // 4. Batch Filter (FOR STUDENTS ONLY: Teachers and Admins have no batch)
      if (selectedRole === 'STUDENT' && selectedBatch !== 'ALL') {
        if (selectedBatch === 'UNASSIGNED') {
          if (p.batch && p.batch.trim()) return false;
        } else {
          if ((p.batch || '').trim().toLowerCase() !== selectedBatch.toLowerCase()) return false;
        }
      }

      // 5. Search Query (matches Name, ID, Email, Department, Faculty, Batch)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const fullName = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`).toLowerCase();
        const email = (p.email || '').toLowerCase();
        const id = (p.institutional_id || '').toLowerCase();
        const dept = (p.department?.name || '').toLowerCase();
        const faculty = (fac || '').toLowerCase();
        const batch = (p.batch || '').toLowerCase();

        const matches = 
          fullName.includes(q) ||
          email.includes(q) ||
          id.includes(q) ||
          dept.includes(q) ||
          faculty.includes(q) ||
          batch.includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [profilesList, selectedFaculty, selectedRole, selectedDepartment, selectedBatch, searchQuery]);

  // Sorted Profiles
  const sortedProfiles = useMemo(() => {
    const list = [...filteredProfiles];
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'name-asc') {
        const nameA = (a.full_name || a.email).toLowerCase();
        const nameB = (b.full_name || b.email).toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'name-desc') {
        const nameA = (a.full_name || a.email).toLowerCase();
        const nameB = (b.full_name || b.email).toLowerCase();
        return nameB.localeCompare(nameA);
      }
      if (sortBy === 'id-asc') {
        const idA = (a.institutional_id || '').toLowerCase();
        const idB = (b.institutional_id || '').toLowerCase();
        return idA.localeCompare(idB);
      }
      return 0;
    });
    return list;
  }, [filteredProfiles, sortBy]);

  // Reset to page 1 if filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFaculty, selectedRole, selectedDepartment, selectedBatch, searchQuery, pageSize]);

  // --- PAGINATION SLICE ---
  const totalPages = Math.max(1, Math.ceil(sortedProfiles.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedProfiles.length);
  const currentProfiles = useMemo(() => {
    return sortedProfiles.slice(startIndex, endIndex);
  }, [sortedProfiles, startIndex, endIndex]);

  // Active filters check
  const isFiltered = 
    selectedFaculty !== 'ALL' || 
    selectedRole !== 'ALL' || 
    selectedDepartment !== 'ALL' || 
    selectedBatch !== 'ALL' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    setSelectedFaculty('ALL');
    setSelectedRole('ALL');
    setSelectedDepartment('ALL');
    setSelectedBatch('ALL');
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // --- COPY HELPERS ---
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // --- EXPORT TO CSV ---
  const handleExportCSV = () => {
    if (sortedProfiles.length === 0) return;

    const headers = ['Full Name', 'Institutional ID', 'Role', 'Batch', 'Faculty', 'Department', 'Email', 'Created Date'];
    const rows = sortedProfiles.map((p) => [
      `"${(p.full_name || `${p.first_name || ''} ${p.last_name || ''}`).replace(/"/g, '""').trim()}"`,
      `"${(p.institutional_id || '').replace(/"/g, '""')}"`,
      `"${p.role}"`,
      `"${(p.batch || 'N/A').replace(/"/g, '""')}"`,
      `"${(p.faculty_name || p.department?.faculty_name || 'N/A').replace(/"/g, '""')}"`,
      `"${(p.department?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${p.email}"`,
      `"${new Date(p.created_at).toISOString().split('T')[0]}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const batchSuffix = selectedRole === 'STUDENT' && selectedBatch !== 'ALL' ? `_${selectedBatch.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : '';
    link.setAttribute('download', `ebaub_users_${selectedFaculty.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${selectedRole.toLowerCase()}${batchSuffix}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const getRoleBadge = (role: string, batch?: string | null) => {
    const r = (role || '').toUpperCase();
    if (r === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3 h-3" />
          <span>Admin</span>
        </span>
      );
    }
    if (r === 'TEACHER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Briefcase className="w-3 h-3" />
          <span>Teacher</span>
        </span>
      );
    }
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-campus-50 text-campus-800 border border-campus-200">
          <GraduationCap className="w-3 h-3" />
          <span>Student</span>
        </span>
        {batch && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRoleChange('STUDENT');
              setSelectedBatch(batch);
            }}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200 transition-colors cursor-pointer"
            title={`Filter students by Batch: ${batch}`}
          >
            {batch}
          </button>
        )}
      </div>
    );
  };

  // Dynamic role counts under the current faculty selection
  const currentFacultyCounts = useMemo(() => {
    if (selectedFaculty === 'ALL') {
      return {
        all: overallStats.total,
        teachers: overallStats.teachers,
        students: overallStats.students,
        admins: overallStats.admins,
      };
    }
    if (selectedFaculty === 'ADMINS') {
      return {
        all: overallStats.admins,
        teachers: 0,
        students: 0,
        admins: overallStats.admins,
      };
    }
    const stat = facultyStats[selectedFaculty] || { total: 0, teachers: 0, students: 0 };
    return {
      all: stat.total,
      teachers: stat.teachers,
      students: stat.students,
      admins: 0,
    };
  }, [selectedFaculty, overallStats, facultyStats]);

  return (
    <div className="space-y-6">
      {/* Feedback Notification Banner */}
      {feedbackNotification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs animate-in fade-in ${
          feedbackNotification.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : 'bg-red-50 border border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotification(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP OVERALL STATS CARDS                               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Total Accounts</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{overallStats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across all 4 faculties</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Teachers</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{overallStats.teachers}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified instructors</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-campus-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{overallStats.students}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Enrolled learners</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-purple-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrators</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{overallStats.admins}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">System operators</div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. LEVEL 1: FACULTY & ADMIN NAVIGATION PILLS             */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-campus-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Filter by University Faculty & Administration
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Select a faculty to inspect its departmental teachers and students
          </span>
        </div>

        {/* Faculty Pills Wrap */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* All University Pill */}
          <button
            type="button"
            onClick={() => handleFacultyChange('ALL')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFaculty === 'ALL'
                ? 'bg-campus-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>All University</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedFaculty === 'ALL'
                  ? 'bg-campus-800 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {overallStats.total}
            </span>
          </button>

          {/* Specific Faculty Pills */}
          {facultiesList.map((facultyName) => {
            const count = facultyStats[facultyName]?.total || 0;
            const isSelected = selectedFaculty === facultyName;
            return (
              <button
                key={facultyName}
                type="button"
                onClick={() => handleFacultyChange(facultyName)}
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

          {/* System Admins Pill */}
          <button
            type="button"
            onClick={() => handleFacultyChange('ADMINS')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFaculty === 'ADMINS'
                ? 'bg-purple-900 text-white shadow-xs ring-2 ring-purple-800/20'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Staff</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedFaculty === 'ADMINS'
                  ? 'bg-purple-800 text-white'
                  : 'bg-purple-200 text-purple-800'
              }`}
            >
              {overallStats.admins}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LEVEL 2: UNDER-FACULTY ROLE TABS                      */}
      {/* ======================================================== */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-px">
        {selectedFaculty !== 'ADMINS' ? (
          <>
            {/* Tab: All in Faculty */}
            <button
              onClick={() => handleRoleChange('ALL')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
                selectedRole === 'ALL'
                  ? 'border-campus-800 text-campus-900 bg-campus-50/50 rounded-t-2xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Users className={`w-4 h-4 ${selectedRole === 'ALL' ? 'text-campus-800' : 'text-slate-400'}`} />
              <span>All Members</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  selectedRole === 'ALL'
                    ? 'bg-campus-800 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentFacultyCounts.all}
              </span>
            </button>

            {/* Tab: Teachers */}
            <button
              onClick={() => handleRoleChange('TEACHER')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
                selectedRole === 'TEACHER'
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50 rounded-t-2xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Briefcase className={`w-4 h-4 ${selectedRole === 'TEACHER' ? 'text-blue-700' : 'text-slate-400'}`} />
              <span>Teachers & Faculty</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  selectedRole === 'TEACHER'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentFacultyCounts.teachers}
              </span>
            </button>

            {/* Tab: Students */}
            <button
              onClick={() => handleRoleChange('STUDENT')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
                selectedRole === 'STUDENT'
                  ? 'border-campus-800 text-campus-900 bg-campus-50/50 rounded-t-2xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${selectedRole === 'STUDENT' ? 'text-campus-800' : 'text-slate-400'}`} />
              <span>Enrolled Students</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  selectedRole === 'STUDENT'
                    ? 'bg-campus-800 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentFacultyCounts.students}
              </span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 font-bold text-xs sm:text-sm text-purple-900 border-b-2 border-purple-800 bg-purple-50/50 rounded-t-2xl">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Administrative Accounts ({overallStats.admins})</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. LEVEL 3: GRANULAR CONTROLS (SEARCH, DEPT, SORT, EXPORT)*/}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full min-w-0 sm:min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, legal name, email, or department..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter (Only for academic views) */}
          {selectedFaculty !== 'ADMINS' && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Department:
              </span>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedBatch('ALL');
                }}
                className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 max-w-[210px] truncate"
              >
                <option value="ALL">All Departments</option>
                {selectedFaculty === 'ALL' ? (
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
                  availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Batch Filter (STUDENTS ONLY: Hidden for Teachers & Admin) */}
          {selectedRole === 'STUDENT' && (
            <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in duration-150">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-campus-700" />
                <span>Batch:</span>
              </span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="text-xs bg-indigo-50/50 border border-indigo-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700 max-w-[180px] truncate"
              >
                <option value="ALL">All Batches ({currentFacultyCounts.students})</option>
                {hasUnassignedBatchStudents && (
                  <option value="UNASSIGNED">Unassigned Batch</option>
                )}
                {batchesList.map((batchName) => (
                  <option key={batchName} value={batchName}>
                    {batchName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="id-asc">Institutional ID</option>
            </select>
          </div>

          {/* Rows Per Page */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
              Rows:
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 font-medium focus:outline-none focus:border-campus-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Export to CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={sortedProfiles.length === 0}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 shrink-0"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. ACTIVE FILTER CHIPS & STATS BAR                       */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-700">
            Showing {sortedProfiles.length === 0 ? 0 : startIndex + 1}–{endIndex} of {sortedProfiles.length} accounts
          </span>

          {selectedFaculty !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
              Faculty: {selectedFaculty === 'ADMINS' ? 'Admins' : selectedFaculty}
              <button onClick={() => setSelectedFaculty('ALL')} className="hover:text-campus-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedRole !== 'ALL' && selectedFaculty !== 'ADMINS' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
              Role: {selectedRole}
              <button onClick={() => setSelectedRole('ALL')} className="hover:text-campus-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedDepartment !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
              Dept: {departments.find((d) => d.id === selectedDepartment)?.name || selectedDepartment}
              <button onClick={() => setSelectedDepartment('ALL')} className="hover:text-campus-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedRole === 'STUDENT' && selectedBatch !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-medium">
              Batch: {selectedBatch === 'UNASSIGNED' ? 'Unassigned' : selectedBatch}
              <button onClick={() => setSelectedBatch('ALL')} className="hover:text-indigo-900" title="Clear batch filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-campus-50 text-campus-800 border border-campus-200 text-[11px] font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')} className="hover:text-campus-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* ======================================================== */}
      {/* 6. USERS DATA TABLE                                      */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-campus-50/70 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-[30%]">Member & Contact</th>
                <th className="p-4 w-[18%]">Institutional ID</th>
                <th className="p-4 w-[12%]">Role</th>
                <th className="p-4 w-[24%]">Faculty & Department</th>
                <th className="p-4 w-[10%]">Registered</th>
                <th className="p-4 w-[6%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentProfiles.map((p) => {
                const displayName = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'University Member';
                const initial = displayName.charAt(0).toUpperCase();
                const facultyName = p.faculty_name || p.department?.faculty_name || null;

                return (
                  <tr 
                    key={p.id} 
                    className="hover:bg-campus-50/40 transition-colors group cursor-pointer"
                    onClick={() => setInspectingUser(p)}
                  >
                    {/* Member & Contact */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors overflow-hidden ${
                          p.is_pending_signup
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-white group-hover:border-campus-300'
                        }`}>
                          {p.avatar_url ? (
                            <img src={p.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                          ) : p.is_pending_signup ? (
                            <Clock className="w-4 h-4 text-amber-600" />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 group-hover:text-campus-900 transition-colors truncate max-w-[200px]">
                              {displayName}
                            </span>
                            {p.is_pending_signup && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shrink-0 shadow-2xs">
                                <Clock className="w-2.5 h-2.5 text-amber-600" />
                                Not signed up
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            {p.is_pending_signup ? (
                              <span className="text-slate-400 italic font-medium">
                                Awaiting user sign up
                              </span>
                            ) : (
                              <>
                                <span className="truncate max-w-[180px]" title={p.email}>
                                  {p.email}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyEmail(p.email, e)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5"
                                  title="Copy email"
                                >
                                  {copiedEmail === p.email ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Institutional ID */}
                    <td className="p-4">
                      {p.institutional_id ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-[11px] border border-slate-200">
                          <span>{p.institutional_id}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyId(p.institutional_id!, e)}
                            className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                            title="Copy ID"
                          >
                            {copiedId === p.institutional_id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {getRoleBadge(p.role, p.batch)}
                        {p.is_pending_signup && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shrink-0 shadow-2xs">
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            <span>Not signed up</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Faculty & Department */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        {p.department?.name ? (
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold truncate max-w-[210px]" title={p.department.name}>
                            <Building2 className="w-3.5 h-3.5 text-campus-700 shrink-0" />
                            <span className="truncate">{p.department.name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unassigned Department</span>
                        )}
                        {facultyName && (
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[210px]" title={facultyName}>
                            {facultyName}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(p.created_at)}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingUser(p);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-900 transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {(p.role || '').toUpperCase() === 'ADMIN' ? (
                          <div
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50 text-purple-400 border border-purple-100/80 cursor-not-allowed"
                            title="Administrator Account (Protected from deletion)"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingUser(p);
                              setDeleteError(null);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/60 hover:border-red-200 transition-colors"
                            title={`Delete ${(p.role || '').toLowerCase() || 'user'} account`}
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
              {sortedProfiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-1">
                        No user accounts found
                      </div>
                      <p className="text-xs text-slate-400">
                        {isFiltered
                          ? 'No university members match your selected faculty, role, batch, or search keyword.'
                          : 'No university user accounts exist yet in the database.'}
                      </p>
                      {isFiltered ? (
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 text-xs font-bold text-campus-800 hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset all filters</span>
                        </button>
                      ) : (
                        <Link
                          href="/admin/users/create"
                          className="mt-2 text-xs font-bold text-campus-800 hover:underline"
                        >
                          + Provision your first user account
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. PAGINATION CONTROLS (OPTIMIZED FOR 10K+ RECORDS)      */}
      {/* ======================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span> ({sortedProfiles.length} total users)
          </div>

          <div className="flex items-center gap-1.5">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Page Number Chips */}
            <div className="hidden md:flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  );
                })
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-campus-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. USER PROFILE INSPECTOR MODAL                          */}
      {/* ======================================================== */}
      <Dialog 
        open={!!inspectingUser} 
        onOpenChange={(open) => !open && setInspectingUser(null)}
      >
        <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-campus-50 border border-campus-200 flex items-center justify-center text-campus-700 font-extrabold overflow-hidden">
                  {inspectingUser?.avatar_url ? (
                    <img src={inspectingUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    inspectingUser ? inspectingUser.full_name?.charAt(0) || 'U' : 'U'
                  )}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    {inspectingUser?.full_name || 'Member Details'}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Official institutional credentials and academic affiliation
                  </DialogDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {inspectingUser && getRoleBadge(inspectingUser.role, inspectingUser.batch)}
                {inspectingUser?.is_pending_signup && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Not signed up</span>
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          {inspectingUser && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Whitelist Pre-Authorized Banner */}
              {inspectingUser.is_pending_signup && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-amber-950">Pre-Authorized (Not signed up yet)</div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      This ID has been whitelisted by an administrator. The student or teacher can claim this account anytime by setting their personal password at the Sign-Up portal (<code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-amber-950">/signup</code>). Once registered, this tag will disappear automatically.
                    </p>
                  </div>
                </div>
              )}
              {/* Key Credentials Card */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>Institutional ID</span>
                  </div>
                  <div className="font-mono font-extrabold text-campus-900 text-sm mt-0.5 flex items-center gap-1.5">
                    <span>{inspectingUser.institutional_id || 'Not Assigned'}</span>
                    {inspectingUser.institutional_id && (
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(inspectingUser.institutional_id!, e)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Copy ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>Email Address</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5 truncate flex items-center gap-1.5" title={inspectingUser.email}>
                    <span className="truncate">{inspectingUser.email}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyEmail(inspectingUser.email, e)}
                      className="text-slate-400 hover:text-slate-600 shrink-0"
                      title="Copy Email"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Academic Hierarchy */}
              <div className="space-y-2.5 p-4 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Faculty Affiliation:</span>
                  <span className="font-bold text-slate-900">
                    {inspectingUser.faculty_name || inspectingUser.department?.faculty_name || 'General / Non-Faculty'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Department:</span>
                  <span className="font-bold text-slate-900">
                    {inspectingUser.department?.name || 'Unassigned'}
                  </span>
                </div>

                {inspectingUser.batch && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Batch / Cohort:</span>
                    <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {inspectingUser.batch}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Account Created:</span>
                  <span className="font-bold text-slate-900">
                    {new Date(inspectingUser.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">System UUID:</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]" title={inspectingUser.id}>
                    {inspectingUser.id}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 mt-2">
            {(inspectingUser?.role || '').toUpperCase() === 'ADMIN' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Protected Administrator Account</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const target = inspectingUser;
                  setInspectingUser(null);
                  setDeletingUser(target);
                  setDeleteError(null);
                }}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete User Account</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setInspectingUser(null)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-campus-900 text-white font-bold text-xs hover:bg-campus-800 transition-colors"
            >
              Close Details
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 9. DELETE USER CONFIRMATION MODAL                        */}
      {/* ======================================================== */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && !isDeleting && setDeletingUser(null)}
      >
        <DialogContent className="w-[95vw] sm:max-w-md p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs mx-auto sm:mx-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold text-slate-900">
                Delete University User Account
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                This action will permanently remove this member from university records and revoke portal access.
              </DialogDescription>
            </div>
          </DialogHeader>

          {deletingUser && (
            <div className="space-y-4 py-2">
              {/* User Snapshot Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {deletingUser.full_name || 'University Member'}
                  </span>
                  {getRoleBadge(deletingUser.role, deletingUser.batch)}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold block">Institutional ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {deletingUser.institutional_id || 'Not Assigned'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Email Address:</span>
                    <span className="text-slate-800 font-medium truncate block" title={deletingUser.email}>
                      {deletingUser.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Callout */}
              <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-2xl text-red-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-red-950">Permanent Irreversible Action</div>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    {deletingUser.is_pending_signup
                      ? 'This will cancel their whitelist pre-authorization. They will no longer be able to claim this ID at sign up.'
                      : 'This will delete their authentication login, institutional profile, and course enrollments. You cannot undo this action.'}
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold animate-in fade-in">
                  {deleteError}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeletingUser(null)}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
