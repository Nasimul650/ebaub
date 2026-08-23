import React from 'react';
import { getAdmissionsData } from '@/utils/supabase/queries';
import AdmissionsContent from '@/components/admissions/AdmissionsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admissions | EXIM Bank Agricultural University Bangladesh',
  description: 'Apply now for undergraduate and graduate programs across various faculties at EBAUB.',
};

export const revalidate = 3600; // Cache for 1 hour

export default async function AdmissionsPage() {
  const faculties = await getAdmissionsData();

  return (
    <main className="w-full bg-white">
      <AdmissionsContent faculties={faculties} />
    </main>
  );
}
