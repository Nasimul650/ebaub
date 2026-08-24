import React from 'react';
import { getAdmissionsData, getPageSiteSettings } from '@/utils/supabase/queries';
import AdmissionsContent from '@/components/admissions/AdmissionsContent';
import type { AdmissionsPageSettings } from '@/types/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admissions | EXIM Bank Agricultural University Bangladesh',
  description: 'Apply now for undergraduate and graduate programs across various faculties at EBAUB.',
};

export const revalidate = 3600; // Cache for 1 hour

export default async function AdmissionsPage() {
  const [faculties, admissionsSettings] = await Promise.all([
    getAdmissionsData(),
    getPageSiteSettings<AdmissionsPageSettings>('admissions')
  ]);

  return (
    <main className="w-full bg-white">
      <AdmissionsContent 
        faculties={faculties} 
        admissionsSettings={admissionsSettings} 
      />
    </main>
  );
}
