import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { getDepartmentsWithFaculty } from '@/utils/supabase/queries';
import CreateAccountForm from '@/components/admin/CreateAccountForm';

export default async function CreateUserAccountPage() {
  const departments = await getDepartmentsWithFaculty();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/users" className="hover:text-campus-800 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>User Accounts</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Provision New Credentials</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display tracking-tight">
            Provision Institutional Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create verified Teacher and Student credentials using their official university institutional ID numbers.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Users</span>
        </Link>
      </div>

      {/* Account Creation Form */}
      <CreateAccountForm departments={departments} />
    </div>
  );
}
