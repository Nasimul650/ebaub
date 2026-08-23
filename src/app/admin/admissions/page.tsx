import React from 'react';
import { requireAdmin } from '@/app/actions/cms';
import { getAdmissionsData } from '@/utils/supabase/queries';
import AdmissionsCMSForm from '@/components/admin/AdmissionsCMSForm';

export const metadata = {
  title: 'Admissions CMS | Admin Dashboard',
};

export default async function AdmissionsAdminPage() {
  await requireAdmin();
  const faculties = await getAdmissionsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admissions CMS</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage admission requirements, processes, and deadlines per faculty.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <AdmissionsCMSForm faculties={faculties} />
      </div>
    </div>
  );
}
