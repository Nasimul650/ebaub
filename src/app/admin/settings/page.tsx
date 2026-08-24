import React from 'react';
import { getSiteSettings } from '@/utils/supabase/queries';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <SiteSettingsManager initialSettings={settings} />
    </div>
  );
}
