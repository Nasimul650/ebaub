import React from 'react';
import { getSiteSettings } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import VisionMissionGrid from '@/components/about/VisionMissionGrid';
import CSEMilestoneCard from '@/components/about/CSEMilestoneCard';

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-16">
      <PageHeader
        badge="About Eastern Bank Agricultural University"
        headline="Pioneering Excellence in Science, Agriculture & Technology"
        description={`Established in ${settings.establishedYear}, ${settings.universityName} (${settings.shortName}) stands as a beacon of academic leadership in Rajshahi, Bangladesh.`}
      />
      <VisionMissionGrid settings={settings} />
      <CSEMilestoneCard />
    </div>
  );
}
