import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, UserPen } from 'lucide-react';
import FacultyForm from '@/components/admin/FacultyForm';
import { updateFaculty } from '@/app/actions/cms';
import { getFacultyById } from '@/utils/supabase/queries';

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facultyData = await getFacultyById(id);

  if (!facultyData) {
    notFound();
  }

  const updateAction = updateFaculty.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/faculty" 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <UserPen className="w-6 h-6 text-campus-800" /> Edit Faculty Member
          </h1>
          <p className="text-xs text-slate-500 mt-1">Make changes to the faculty profile</p>
        </div>
      </div>

      <FacultyForm action={updateAction} initialData={facultyData} />
    </div>
  );
}
