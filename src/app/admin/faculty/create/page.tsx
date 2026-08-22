import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import FacultyForm from '@/components/admin/FacultyForm';
import { createFaculty } from '@/app/actions/cms';

export default function CreateFacultyPage() {
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
            <UserPlus className="w-6 h-6 text-campus-800" /> Add Faculty Member
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create a new faculty profile</p>
        </div>
      </div>

      <FacultyForm action={createFaculty} />
    </div>
  );
}
