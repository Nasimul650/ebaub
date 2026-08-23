import React from 'react';
import { getPrograms } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import AdmissionStepsGrid from '@/components/admissions/AdmissionStepsGrid';
import EligibilityRequirements from '@/components/admissions/EligibilityRequirements';

export default async function AdmissionsPage() {
  const programs = await getPrograms();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <PageHeader
        badge="EBAUB Admissions Office"
        headline="Begin Your Academic Journey at EBAUB"
        description="Admissions are now open for the Spring 2027 academic session across all faculties."
      />
      <AdmissionStepsGrid />
      <EligibilityRequirements programs={programs} />
    </div>
  );
}
