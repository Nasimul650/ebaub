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
      
      {/* 1. Hero & Social Proof (Primary Light Section) */}
      <section className="w-full bg-gradient-to-b from-emerald-50/50 to-white py-16 sm:py-24">
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          <HeroSection />
          <SocialProofStrip />
        </div>
      </section>

      {/* 2. Dark/Premium Section: Stats & Metrics */}
      <section className="w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white py-24 sm:py-32 shadow-2xl relative overflow-hidden">
        {/* Corner Light Source */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-800 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-900/60 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <MetricsSection />
        </div>
      </section>

      {/* 3. Primary Light Section: Discovery & Faculty Mentorship */}
      <section className="w-full bg-gradient-to-b from-emerald-50/50 to-white py-24 sm:py-32 border-t border-slate-200/50">
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <FacultyMentorshipSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Alternate Light Section: Campus Life / Curriculum & Tech Stacks */}
      <section className="w-full bg-gradient-to-tr from-slate-50 via-white to-amber-50/40 py-24 sm:py-32 border-t border-b border-slate-200/50">
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <CurriculumTechSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Primary Light Section: Admissions Inquiry Desk */}
      <section className="w-full bg-gradient-to-b from-emerald-50/50 to-white py-24 sm:py-32">
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <AdmissionsInquirySection />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Alternate Light Section: Official Notices & Circulars */}
      <section className="w-full bg-gradient-to-tr from-slate-50 via-white to-amber-50/40 py-24 sm:py-32 border-t border-slate-200/50">
        {/* Inner container MUST NOT have a background color */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <HomeNoticeGridSection notices={notices} />
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
