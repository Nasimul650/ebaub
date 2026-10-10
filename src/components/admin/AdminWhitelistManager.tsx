'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Building2, 
  Hash, 
  Tag, 
  Calendar, 
  UserCheck, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Check, 
  Copy, 
  ShieldCheck, 
  Users, 
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { whitelistCredential, deleteWhitelistedCredential } from '@/app/actions/whitelist';
import type { DepartmentWithFaculty } from '@/utils/supabase/queries';

interface WhitelistEntry {
  id: string;
  institutional_id: string;
  role: string;
  department_id?: string | null;
  batch?: string | null;
  is_claimed?: boolean;
  claimed_by?: string | null;
  created_at?: string;
  departments?: {
    id: string;
    name: string;
    faculties?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

interface AdminWhitelistManagerProps {
  departments: DepartmentWithFaculty[];
  initialWhitelist?: WhitelistEntry[];
}

export default function AdminWhitelistManager({
  departments,
  initialWhitelist = []
}: AdminWhitelistManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active Tab: 'student' | 'teacher' | 'overview'
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'overview'>('student');

  // Form State
  const [studentId, setStudentId] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentBatch, setStudentBatch] = useState('');

  const [teacherId, setTeacherId] = useState('');
  const [teacherDept, setTeacherDept] = useState('');

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastWhitelisted, setLastWhitelisted] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Whitelist list & filtering
  const [whitelistList, setWhitelistList] = useState<WhitelistEntry[]>(initialWhitelist);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unclaimed' | 'claimed'>('all');

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WhitelistEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Copy ID
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Group departments by faculty for clean organized selects
  const facultyGroups = React.useMemo(() => {
    const groups: { [facultyName: string]: DepartmentWithFaculty[] } = {};
    departments.forEach((dept) => {
      const fName = dept.faculty_name || 'General Academic';
      if (!groups[fName]) groups[fName] = [];
      groups[fName].push(dept);
    });
    return groups;
  }, [departments]);

  // Submit Student Whitelist
  const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('role', 'student');
    formData.append('institutional_id', studentId);
    formData.append('department_id', studentDept);
    formData.append('batch', studentBatch);

    startTransition(async () => {
      const res = await whitelistCredential(formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Student ID whitelisted successfully!');
        setLastWhitelisted(res.whitelist);
        setStudentId('');
        setStudentDept('');
        setStudentBatch('');
        router.refresh();
      }
    });
  };

  // Submit Teacher Whitelist
  const handleTeacherSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('role', 'teacher');
    formData.append('institutional_id', teacherId);
    formData.append('department_id', teacherDept);

    startTransition(async () => {
      const res = await whitelistCredential(formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Teacher ID whitelisted successfully!');
        setLastWhitelisted(res.whitelist);
        setTeacherId('');
        setTeacherDept('');
        router.refresh();
      }
    });
  };

  // Handle Delete Whitelist Entry
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteWhitelistedCredential(itemToDelete.id);
      if (res.error) {
        alert(res.error);
      } else {
        setWhitelistList(prev => prev.filter(i => i.id !== itemToDelete.id));
        setDeleteModalOpen(false);
        setItemToDelete(null);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      alert('Failed to remove whitelist entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Whitelist Table
  const filteredWhitelist = whitelistList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.institutional_id.toLowerCase().includes(q) ||
      (item.batch && item.batch.toLowerCase().includes(q)) ||
      (item.departments?.name && item.departments.name.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterRole !== 'all' && item.role.toLowerCase() !== filterRole) return false;
    if (filterStatus === 'unclaimed' && item.is_claimed) return false;
    if (filterStatus === 'claimed' && !item.is_claimed) return false;

    return true;
  });

  return (
    <div className="space-y-6">

      {/* TOP TAB NAVIGATION */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs flex flex-wrap sm:flex-nowrap gap-1">
        <button
          type="button"
          onClick={() => { setActiveTab('student'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'student'
              ? 'bg-campus-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-campus-400" />
          <span>Whitelist Student</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('teacher'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'teacher'
              ? 'bg-campus-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Whitelist Teacher</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('overview'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-campus-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Whitelist Bank ({whitelistList.length})</span>
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-2xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Error: </span>
            {errorMsg}
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs shadow-2xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          {lastWhitelisted && (
            <div className="bg-white/80 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-700">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                    {lastWhitelisted.role}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ID: {lastWhitelisted.institutional_id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Ready for user claim. Direct the user to the Sign-Up page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(lastWhitelisted.institutional_id)}
                  className="text-xs font-bold gap-1.5 rounded-xl border-emerald-300 hover:bg-emerald-50"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
                </Button>
                <Link href="/signup" target="_blank">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold gap-1.5 rounded-xl border-emerald-300 hover:bg-emerald-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open Sign-Up</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: WHITELIST STUDENT FORM */}
      {/* ========================================================================= */}
      {activeTab === 'student' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-campus-600" /> Pre-authorize Student ID
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Add Student to Whitelist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the student&apos;s official registration number and cohort details. The student will use this ID to self-register their account at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-campus-900">/signup</code>.
            </p>
          </div>

          <form onSubmit={handleStudentSubmit} className="space-y-5">
            {/* Hidden field passing role = 'student' */}
            <input type="hidden" name="role" value="student" />

            {/* Institutional ID (Student Reg Number) */}
            <div className="space-y-1.5">
              <Label htmlFor="student-id" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Institutional ID / Registration Number *</span>
              </Label>
              <Input
                id="student-id"
                name="institutional_id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 1901015 or CSE-2024-001"
                required
                className="w-full text-xs font-mono font-bold rounded-xl border-slate-200 focus-visible:ring-campus-400 h-10 uppercase"
              />
              <p className="text-[11px] text-slate-400">
                Official student ID / registration number issued by EBAUB Academic Section.
              </p>
            </div>

            {/* 2-Column Responsive Layout for Department & Batch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Select */}
              <div className="space-y-1.5">
                <Label htmlFor="student-dept" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Department *</span>
                </Label>
                <select
                  id="student-dept"
                  name="department_id"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-white px-3.5 h-10 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-campus-400 text-slate-900 transition-colors"
                >
                  <option value="">-- Select Student Department --</option>
                  {Object.entries(facultyGroups).map(([facultyName, depts]) => (
                    <optgroup key={facultyName} label={facultyName}>
                      {depts.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Department determines course material access and syllabus.
                </p>
              </div>

              {/* Batch Input */}
              <div className="space-y-1.5">
                <Label htmlFor="student-batch" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Batch / Academic Session</span>
                </Label>
                <Input
                  id="student-batch"
                  name="batch"
                  value={studentBatch}
                  onChange={(e) => setStudentBatch(e.target.value)}
                  placeholder="e.g. 9th Batch, Fall 2024"
                  className="w-full text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 h-10"
                />
                <p className="text-[11px] text-slate-400">
                  Optional cohort identifier used for batch-wide announcements.
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                The ID will be locked to the student role upon self-registration.
              </span>

              <Button
                type="submit"
                disabled={isPending || !studentId.trim() || !studentDept}
                size="lg"
                className="w-full sm:w-auto bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs shadow-xs rounded-xl gap-2 px-6"
              >
                {isPending ? (
                  <span>Whitelisting ID...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-campus-300" />
                    <span>Whitelist Student ID</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WHITELIST TEACHER FORM */}
      {/* ========================================================================= */}
      {activeTab === 'teacher' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-campus-700 bg-campus-50 border border-campus-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-campus-600" /> Pre-authorize Faculty ID
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Add Teacher to Whitelist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the teacher&apos;s official faculty ID and primary department. When the teacher signs up at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-campus-900">/signup</code>, they will automatically receive full Teacher Workspace and AI Exam Generator privileges.
            </p>
          </div>

          <form onSubmit={handleTeacherSubmit} className="space-y-5">
            {/* Hidden field passing role = 'teacher' */}
            <input type="hidden" name="role" value="teacher" />

            {/* Institutional ID (Teacher ID) */}
            <div className="space-y-1.5">
              <Label htmlFor="teacher-id" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Teacher Institutional ID / Faculty ID *</span>
              </Label>
              <Input
                id="teacher-id"
                name="institutional_id"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="e.g. T-CSE-004 or FAC-AG-012"
                required
                className="w-full text-xs font-mono font-bold rounded-xl border-slate-200 focus-visible:ring-campus-400 h-10 uppercase"
              />
              <p className="text-[11px] text-slate-400">
                Official faculty number assigned by EBAUB Human Resources / Registrar.
              </p>
            </div>

            {/* Department Select */}
            <div className="space-y-1.5">
              <Label htmlFor="teacher-dept" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Academic Department *</span>
              </Label>
              <select
                id="teacher-dept"
                name="department_id"
                value={teacherDept}
                onChange={(e) => setTeacherDept(e.target.value)}
                required
                className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-white px-3.5 h-10 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-campus-400 text-slate-900 transition-colors"
              >
                <option value="">-- Select Teacher Department --</option>
                {Object.entries(facultyGroups).map(([facultyName, depts]) => (
                  <optgroup key={facultyName} label={facultyName}>
                    {depts.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Determines the faculty member&apos;s department question bank and material uploads.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                The user will be granted the Teacher role upon registration.
              </span>

              <Button
                type="submit"
                disabled={isPending || !teacherId.trim() || !teacherDept}
                size="lg"
                className="w-full sm:w-auto bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs shadow-xs rounded-xl gap-2 px-6"
              >
                {isPending ? (
                  <span>Whitelisting ID...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-campus-300" />
                    <span>Whitelist Teacher ID</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WHITELIST BANK OVERVIEW TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Search & Filter Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whitelisted IDs or depts..."
                className="pl-9 text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 w-full"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar">
              {/* Role filter */}
              <button
                type="button"
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterRole === 'all' ? 'bg-campus-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Roles
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('student')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterRole === 'student' ? 'bg-campus-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Students
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('teacher')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterRole === 'teacher' ? 'bg-campus-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Teachers
              </button>

              <span className="text-slate-300">|</span>

              {/* Status filter */}
              <button
                type="button"
                onClick={() => setFilterStatus('unclaimed')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === 'unclaimed' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unclaimed
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('claimed')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === 'claimed' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Claimed
              </button>
            </div>
          </div>

          {/* Table Container with w-full overflow-x-auto */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Institutional ID</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Role</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Department</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Batch</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Claim Status</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Created</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWhitelist.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No whitelisted records found. Pre-authorize an ID using the tabs above.
                      </td>
                    </tr>
                  ) : (
                    filteredWhitelist.map((item) => {
                      const isClaimed = item.is_claimed;
                      const isTeacher = item.role.toLowerCase() === 'teacher';
                      const createdDate = item.created_at
                        ? new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Recent';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-lg bg-campus-50 text-campus-900 border border-campus-200">
                                {item.institutional_id}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.institutional_id)}
                                className="text-slate-400 hover:text-slate-700"
                                title="Copy ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              isTeacher 
                                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}>
                              {isTeacher ? 'Teacher' : 'Student'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                            {item.departments?.name || 'Unassigned'}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {item.batch || '—'}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isClaimed ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Claimed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Unclaimed (Ready)
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                            {createdDate}
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            {!isClaimed ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete(item);
                                  setDeleteModalOpen(true);
                                }}
                                className="h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-bold gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Revoke</span>
                              </Button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Active Profile
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REVOKE / DELETE MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Revoke Whitelisted ID?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 leading-relaxed pt-2">
              Are you sure you want to revoke <strong className="text-slate-900">{itemToDelete?.institutional_id}</strong> ({itemToDelete?.role}) from the whitelist? The user will no longer be able to claim this ID during registration.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
              }}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Revoking...' : 'Revoke Whitelist'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
