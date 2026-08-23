import React from 'react';
import { getFacultiesWithDepartments, getAllPrograms } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import ProgramDirectoryView from '@/components/academics/ProgramDirectoryView';

interface Props {
  searchParams: Promise<{ faculty?: string }>;
}

export default async function AcademicsPage({ searchParams }: Props) {
  const { faculty } = await searchParams;
  
  const [hierarchy, programs] = await Promise.all([
    getFacultiesWithDepartments(),
    getAllPrograms(200)
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <PageHeader
        badge="Academics & Degree Programs"
        headline="Explore EBAUB Faculties, Departments & Curriculums"
        description="Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities."
      />
      <ProgramDirectoryView 
        hierarchy={hierarchy} 
        allPrograms={programs} 
        initialFacultyId={faculty} 
      />
    </div>
  );
}
