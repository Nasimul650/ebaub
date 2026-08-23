import React from 'react';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';
import { getAllPrograms } from '@/utils/supabase/queries';
import ProgramsTable from '@/components/admin/ProgramsTable';

export default async function AdminProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" /> Programs CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage degree offerings and requirements</p>
        </div>
        
        <Link 
          href="/admin/programs/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </Link>
      </div>

      <ProgramsTable programs={programs} />
    </div>
  );
}
