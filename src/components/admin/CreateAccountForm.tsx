'use client';

import React, { useState } from 'react';
import { 
  UserPlus, 
  GraduationCap, 
  Briefcase, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  RefreshCw,
  Mail,
  User,
  Hash
} from 'lucide-react';
import { createUniversityAccount, type AdminAccountResult } from '@/app/actions/admin-users';
import type { DepartmentWithFaculty } from '@/utils/supabase/queries';

interface CreateAccountFormProps {
  departments: DepartmentWithFaculty[];
}

export default function CreateAccountForm({ departments = [] }: CreateAccountFormProps) {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [institutionalId, setInstitutionalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [departmentId, setDepartmentId] = useState('');
  const [deptList, setDeptList] = useState<DepartmentWithFaculty[]>(departments);

  React.useEffect(() => {
    if (departments && departments.length > 0) {
      setDeptList(departments);
    }
  }, [departments]);

  // Client-side fallback in case SSR returns empty
  React.useEffect(() => {
    if (deptList.length === 0) {
      import('@/utils/supabase/client').then(({ createClient }) => {
        const supabase = createClient();
        supabase
          .from('departments')
          .select('id, name, faculty_id, faculties(id, name)')
          .order('name', { ascending: true })
          .then(({ data }) => {
            if (data && data.length > 0) {
              const mapped: DepartmentWithFaculty[] = data.map((row: any) => ({
                id: row.id,
                name: row.name,
                faculty_id: row.faculty_id,
                faculty_name: Array.isArray(row.faculties) ? row.faculties[0]?.name : (row.faculties?.name || undefined),
              }));
              setDeptList(mapped);
            }
          });
      });
    }
  }, [deptList.length]);

  // Group departments by faculty name for a clean, organized hierarchy
  const groupedDepartments = React.useMemo(() => {
    const groups: Record<string, DepartmentWithFaculty[]> = {};
    deptList.forEach((dept) => {
      const faculty = dept.faculty_name || 'General / Other Departments';
      if (!groups[faculty]) {
        groups[faculty] = [];
      }
      groups[faculty].push(dept);
    });
    return groups;
  }, [deptList]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<AdminAccountResult['account'] | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate random secure password helper
  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
    let generated = 'Eb#';
    for (let i = 0; i < 9; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const resetForm = () => {
    setInstitutionalId('');
    setFullName('');
    setEmail('');
    setPassword('');
    setDepartmentId('');
    setErrorMessage(null);
    setSuccessResult(null);
    setCopied(false);
  };

  const handleCopyCredentials = () => {
    if (!successResult) return;
    const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';
    const text = [
      `EBAUB Digital Campus - Account Provisioning`,
      `----------------------------------------`,
      `Role: ${successResult.role === 'TEACHER' ? 'Faculty / Teacher' : 'Student'}`,
      `Full Name: ${successResult.full_name}`,
      `Institutional ID: ${successResult.institutional_id}`,
      `Login Email: ${successResult.email}`,
      `Password: ${successResult.password || '(configured)'}`,
      `Portal Login: ${portalUrl}`,
      `----------------------------------------`,
      `Please log in and update your credentials as needed.`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessResult(null);
    setCopied(false);

    if (!institutionalId.trim()) {
      setErrorMessage(`Please enter the ${role === 'teacher' ? 'Teacher ID Number' : 'Student Roll / Registration Number'}.`);
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter the full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Please enter or generate a temporary password (at least 6 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('institutional_id', institutionalId.trim());
      formData.append('full_name', fullName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      if (departmentId) {
        formData.append('department_id', departmentId);
      }

      const res = await createUniversityAccount(formData);

      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res.account) {
        setSuccessResult(res.account);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating the account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Selection Tabs */}
      <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 max-w-md shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setRole('teacher');
            setErrorMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            role === 'teacher'
              ? 'bg-white text-campus-950 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-campus-700" />
          <span>Create Teacher Account</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole('student');
            setErrorMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            role === 'student'
              ? 'bg-white text-campus-950 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-campus-700" />
          <span>Create Student Account</span>
        </button>
      </div>

      {/* Success Notification & Credentials Box */}
      {successResult && (
        <div className="p-6 bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base">
                  Account Successfully Provisioned!
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  {successResult.role === 'TEACHER' ? 'Faculty Member' : 'Student'} credentials are live and verified.
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCredentials}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Credentials Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Credentials</span>
                </>
              )}
            </button>
          </div>

          {/* Credentials Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Role</div>
              <div className="font-extrabold text-slate-900 mt-0.5">{successResult.role}</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Institutional ID</div>
              <div className="font-extrabold text-campus-900 font-mono mt-0.5">{successResult.institutional_id}</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Login Email</div>
              <div className="font-extrabold text-slate-900 truncate mt-0.5" title={successResult.email}>{successResult.email}</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Temporary Password</div>
              <div className="font-extrabold text-amber-700 font-mono mt-0.5">{successResult.password}</div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Create another {role} account</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Account Creation Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-2 text-campus-700 text-xs font-bold uppercase tracking-wider mb-1">
            <UserPlus className="w-4 h-4" />
            <span>Official Credential Generator</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 heading-display">
            {role === 'teacher' ? 'Provision Teacher / Faculty Account' : 'Provision Student Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'teacher'
              ? 'Issue authentic institutional credentials for professors, lecturers, and departmental instructors.'
              : 'Issue authentic institutional credentials for registered university undergraduate and graduate students.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Institutional ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-campus-700" />
                <span>
                  {role === 'teacher' ? 'Teacher ID Number' : 'Student ID / Roll Number'}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={institutionalId}
                onChange={(e) => setInstitutionalId(e.target.value.toUpperCase())}
                placeholder={role === 'teacher' ? 'e.g. T-2024-CSE-012' : 'e.g. 2024-CSE-045'}
                className="w-full text-xs font-mono uppercase px-3.5 py-2.5 bg-campus-50/50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 transition-colors"
                disabled={isSubmitting}
                required
              />
              <p className="text-[11px] text-slate-400">
                Official university identification number used across records.
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-campus-700" />
                <span>Full Legal Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'teacher' ? 'e.g. Dr. Mohammad Rafiqul Islam' : 'e.g. Abdullah Al Mamun'}
                className="w-full text-xs px-3.5 py-2.5 bg-campus-50/50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 transition-colors"
                disabled={isSubmitting}
                required
              />
              <p className="text-[11px] text-slate-400">
                Full name as registered on institutional records and certificates.
              </p>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-campus-700" />
                <span>Official / Contact Email Address</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'e.g. rafiqul.cse@ebaub.ac.bd' : 'e.g. student.mamun@ebaub.ac.bd'}
                className="w-full text-xs px-3.5 py-2.5 bg-campus-50/50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 transition-colors"
                disabled={isSubmitting}
                required
              />
              <p className="text-[11px] text-slate-400">
                Used for sign-in and password recovery communications.
              </p>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-campus-700" />
                <span>Department / Faculty</span>
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-campus-50/50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="">-- Select Assigned Department / Faculty --</option>
                {Object.keys(groupedDepartments).length > 0 ? (
                  Object.entries(groupedDepartments).map(([facultyName, depts]) => (
                    <optgroup key={facultyName} label={facultyName}>
                      {depts.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </optgroup>
                  ))
                ) : (
                  deptList.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} {dept.faculty_name ? `(${dept.faculty_name})` : ''}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[11px] text-slate-400">
                Associates materials, notices, and academic structure with this user.
              </p>
            </div>
          </div>

          {/* Temporary Password & Generator */}
          <div className="pt-2 border-t border-slate-100">
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-campus-700" />
                  <span>Temporary Password</span>
                  <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-campus-700 hover:text-campus-900 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate Secure Password</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full text-xs font-mono pr-10 px-3.5 py-2.5 bg-campus-50/50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-campus-700 transition-colors"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                The account will be auto-confirmed so the user can sign in immediately.
              </p>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !institutionalId.trim() || !fullName.trim() || !email.trim() || !password}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-campus-300" />
                  <span>Provision {role === 'teacher' ? 'Teacher' : 'Student'} Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
