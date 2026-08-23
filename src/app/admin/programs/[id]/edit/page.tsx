import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import ProgramForm from '@/components/admin/ProgramForm';
import { updateProgram } from '@/app/actions/cms';
import { getProgramById, getFacultiesWithDepartments } from '@/utils/supabase/queries';

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const programData = await getProgramById(id);
  const hierarchy = await getFacultiesWithDepartments();

  if (!programData) {
    notFound();
  }

  const updateAction = updateProgram.bind(null, id);

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
            <BookOpenCheck className="w-6 h-6 text-campus-800" /> Edit Program
          </h1>
          <p className="text-xs text-slate-500 mt-1">Update degree information</p>
        </div>
      </div>

      <ProgramForm action={updateAction} initialData={programData} hierarchy={hierarchy} />
    </div>
  );
}
