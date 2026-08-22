import React from 'react';
import { BookOpen } from 'lucide-react';
import { getPrograms } from '@/lib/mock/mockServices';
import ProgramsTable from '@/components/admin/ProgramsTable';

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" /> Programs CMS Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage degree offerings, credits, and admission requirements</p>
      </div>

      <ProgramsTable programs={programs} />
    </div>
  );
}
