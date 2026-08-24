import React from 'react';
import { getFacultiesWithDepartments, getAllPrograms, getPageSiteSettings } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import ProgramDirectoryView from '@/components/academics/ProgramDirectoryView';
import type { AcademicsPageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

interface Props {
  searchParams: Promise<{ faculty?: string }>;
}

export default async function AcademicsPage({ searchParams }: Props) {
  const { faculty } = await searchParams;
  
  const [hierarchy, programs, academicsSettings] = await Promise.all([
    getFacultiesWithDepartments(),
    getAllPrograms(200),
    getPageSiteSettings<AcademicsPageSettings>('academics')
  ]);

  const fallback = PAGE_SETTINGS_DEFAULTS.academics;
  const badge = academicsSettings?.header_badge || fallback.header_badge;
  const headline = academicsSettings?.header_headline || fallback.header_headline;
  const description = academicsSettings?.header_description || fallback.header_description;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />
      <ProgramDirectoryView 
        hierarchy={hierarchy} 
        allPrograms={programs} 
        initialFacultyId={faculty} 
      />
    </div>
  );
}
