import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import SocialProofStrip from '@/components/home/SocialProofStrip';
import MetricsSection from '@/components/home/MetricsSection';
import FacultyMentorshipSection from '@/components/home/FacultyMentorshipSection';
import CurriculumTechSection from '@/components/home/CurriculumTechSection';
import AdmissionsInquirySection from '@/components/home/AdmissionsInquirySection';
import HomeNoticeGridSection from '@/components/home/HomeNoticeGridSection';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { getNotices } from '@/lib/mock/mockServices';

export default async function HomePage() {
  const notices = await getNotices();

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. Hero & Social Proof */}
      <section className="w-full py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          <HeroSection />
          <SocialProofStrip />
        </div>
      </section>

      {/* 2. Stats & Metrics Section */}
      <section className="w-full bg-slate-50/80 py-24 sm:py-32 border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MetricsSection />
        </div>
      </section>

      {/* 3. Feature Z-Pattern Row 1: Faculty Mentorship */}
      <section className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <FacultyMentorshipSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Feature Z-Pattern Row 2: Curriculum & Tech Stacks */}
      <section className="w-full bg-slate-50/80 py-24 sm:py-32 border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <CurriculumTechSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Admissions Inquiry Desk */}
      <section className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <AdmissionsInquirySection />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Official Notices & Circulars */}
      <section className="w-full bg-slate-50/80 py-24 sm:py-32 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <HomeNoticeGridSection notices={notices} />
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
