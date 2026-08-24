import React from 'react';
import { getPageSiteSettings } from '@/utils/supabase/queries';
import PageHeader from '@/components/shared/PageHeader';
import CampusInfoCard from '@/components/contact/CampusInfoCard';
import ContactForm from '@/components/contact/ContactForm';
import type { ContactPageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

export default async function ContactPage() {
  const contactSettings = await getPageSiteSettings<ContactPageSettings>('contact');

  const fallback = PAGE_SETTINGS_DEFAULTS.contact;
  const badge = contactSettings?.header_badge || fallback.header_badge;
  const headline = contactSettings?.header_headline || fallback.header_headline;
  const description = contactSettings?.header_description || fallback.header_description;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <CampusInfoCard settings={contactSettings} />
        <ContactForm />
      </div>
    </div>
  );
}
