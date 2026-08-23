import React from 'react';
import { getSiteSettings } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import VisionMissionGrid from '@/components/about/VisionMissionGrid';
import CSEMilestoneCard from '@/components/about/CSEMilestoneCard';

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <PageHeader
        badge="About EXIM Bank Agricultural University Bangladesh"
        headline="Pioneering Excellence in Science, Agriculture & Technology"
        description={`Established in ${settings.establishedYear}, ${settings.universityName} (${settings.shortName}) stands as a beacon of academic leadership in Rajshahi, Bangladesh.`}
      />
      <VisionMissionGrid settings={settings} />
      <CSEMilestoneCard />
    </div>
  );
}
