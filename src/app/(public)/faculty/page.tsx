import React from 'react';
import { getFacultyMembers, getDepartments } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import FacultyCardsGrid from '@/components/faculty/FacultyCardsGrid';

export default async function FacultyPage() {
  const [facultyMembers, departments] = await Promise.all([
    getFacultyMembers(),
    getDepartments()
  ]);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-12">
      <PageHeader
        badge="Faculty Directory"
        headline="Distinguished EBAUB Professors & Faculty Members"
        description="Meet the dedicated educators, researchers, and technical leaders guiding students across our academic departments."
      />
      <FacultyCardsGrid members={facultyMembers} departments={departments} />
    </div>
  );
}
