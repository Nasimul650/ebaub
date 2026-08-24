import React from 'react';
import { getAllPageSiteSettings } from '@/utils/supabase/queries';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const allSettings = await getAllPageSiteSettings();

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <SiteSettingsManager initialSettings={allSettings as any} />
    </div>
  );
}
