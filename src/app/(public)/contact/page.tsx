import React from 'react';
import { getSiteSettings } from '@/lib/mock/mockServices';
import PageHeader from '@/components/shared/PageHeader';
import CampusInfoCard from '@/components/contact/CampusInfoCard';
import ContactForm from '@/components/contact/ContactForm';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-12">
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
