import React from 'react';
import { getFaculties, getDepartments, getPrograms } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import FacultiesGrid from '@/components/academics/FacultiesGrid';
import ProgramDetailsList from '@/components/academics/ProgramDetailsList';

export default async function AcademicsPage() {
  const [faculties, departments, programs] = await Promise.all([
    getFaculties(),
    getDepartments(),
    getPrograms()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <PageHeader
        badge="Academics & Degree Programs"
        headline="Explore EBAUB Faculties, Departments & Curriculums"
        description="Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities."
      />
      <FacultiesGrid faculties={faculties} />
      <ProgramDetailsList programs={programs} departments={departments} />
    </div>
  );
}
