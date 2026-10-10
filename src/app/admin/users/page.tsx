import React from 'react';
import Link from 'next/link';
import { UserPlus, Users } from 'lucide-react';
import { getUniversityProfiles, getDepartmentsWithFaculty } from '@/utils/supabase/queries';
import UserAccountsTable from '@/components/admin/UserAccountsTable';

export default async function AdminUsersPage() {
  const [profiles, departments] = await Promise.all([
    getUniversityProfiles(),
    getDepartmentsWithFaculty(),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-800 text-[11px] font-bold tracking-wide uppercase mb-1">
            System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display tracking-tight">
            Institutional User Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage, organize, and verify official university credentials for instructors, enrolled students, and administrative staff across all faculties.
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <UserPlus className="w-4 h-4 text-campus-300" />
          <span>Provision New Account</span>
        </Link>
      </div>

      {/* Accounts Table & Filters */}
      <UserAccountsTable 
        initialProfiles={profiles} 
        departments={departments}
      />
    </div>
  );
}
