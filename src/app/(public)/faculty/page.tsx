import React from 'react';
import { getAllFaculty, getFacultiesWithDepartments } from '@/utils/supabase/queries';
import FacultyDirectoryView from '@/components/faculty/FacultyDirectoryView';

export const metadata = {
  title: 'Faculty Directory | EBAUB',
  description: 'Meet the distinguished faculty members and academic staff at EXIM Bank Agricultural University Bangladesh',
};

export default async function FacultyPage() {
  const facultyList = await getAllFaculty(200);
  const hierarchy = await getFacultiesWithDepartments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 heading-display mb-6">
          Academic Faculty Directory
        </h1>
        <p className="text-lg text-slate-600">
          Meet our dedicated academic staff committed to excellence in teaching, research, and innovation across our various faculties and departments.
        </p>
      </div>

      <FacultyDirectoryView hierarchy={hierarchy} allMembers={facultyList} />
    </div>
  );
}
