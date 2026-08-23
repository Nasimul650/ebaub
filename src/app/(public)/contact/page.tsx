import React from 'react';
import { getSiteSettings } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import CampusInfoCard from '@/components/contact/CampusInfoCard';
import ContactForm from '@/components/contact/ContactForm';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <PageHeader
        badge="Contact EBAUB"
        headline="Get in Touch with EBAUB University Administration"
        description="We welcome inquiries regarding admissions, departmental programs, research collaborations, and campus visits."
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <CampusInfoCard settings={settings} />
        <ContactForm />
      </div>
    </div>
  );
}
