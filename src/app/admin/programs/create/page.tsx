import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookPlus } from 'lucide-react';
import ProgramForm from '@/components/admin/ProgramForm';
import { createProgram } from '@/app/actions/cms';
import { getFacultiesWithDepartments } from '@/utils/supabase/queries';

export default async function CreateProgramPage() {
  const hierarchy = await getFacultiesWithDepartments();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/programs" 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <BookPlus className="w-6 h-6 text-campus-800" /> Add Academic Program
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create a new degree offering</p>
        </div>
      </div>

      <ProgramForm action={createProgram} hierarchy={hierarchy} />
    </div>
  );
}
