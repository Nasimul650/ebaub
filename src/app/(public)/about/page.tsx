import React from 'react';
import { getSiteSettings } from '@/lib/mock/mockServices';
import { getPageBySlug } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import VisionMissionGrid from '@/components/about/VisionMissionGrid';
import CSEMilestoneCard from '@/components/about/CSEMilestoneCard';
import BlockRenderer from '@/components/blocks/BlockRenderer';

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  let blocks = page?.content_blocks || [];
  if (typeof blocks === 'string') {
    try {
      blocks = JSON.parse(blocks);
    } catch (e) {
      console.error('Failed to parse blocks:', e);
      blocks = [];
    }
  }

  // Fallback to static content if no page exists or blocks are empty
  if (!page || !blocks || blocks.length === 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
