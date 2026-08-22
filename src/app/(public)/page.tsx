import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import SocialProofStrip from '@/components/home/SocialProofStrip';
import MetricsSection from '@/components/home/MetricsSection';
import FacultyMentorshipSection from '@/components/home/FacultyMentorshipSection';
import CurriculumTechSection from '@/components/home/CurriculumTechSection';
import AdmissionsInquirySection from '@/components/home/AdmissionsInquirySection';
import HomeNoticeGridSection from '@/components/home/HomeNoticeGridSection';
import HomeNewsGridSection from '@/components/home/HomeNewsGridSection';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { getLatestNews, getActiveNotices } from '@/utils/supabase/queries';

export default async function HomePage() {
  const news = await getLatestNews();
  const notices = await getActiveNotices();

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. Hero & Social Proof */}
      <section className="w-full bg-transparent py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          <HeroSection />
          <SocialProofStrip />
        </div>
      </section>

      {/* 2. Dark/Premium Section: Stats & Metrics */}
      <section className="w-full bg-gradient-to-br from-campus-950 via-campus-900 to-campus-900 text-white py-24 sm:py-32 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-campus-900 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-campus-900/60 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <MetricsSection />
        </div>
      </section>

      {/* 3. News Section (Live DB Content) */}
      <section className="w-full bg-transparent py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <HomeNewsGridSection news={news} />
          </ScrollReveal>
        </div>
      </section>

      {/* 4. About / Faculty Mentorship */}
      <section className="w-full bg-white py-24 sm:py-32 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <FacultyMentorshipSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Official Notices (Live DB Content) */}
      <section className="w-full bg-transparent py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <HomeNoticeGridSection notices={notices} />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Campus Life / Curriculum & Tech Stacks */}
      <section className="w-full bg-white py-24 sm:py-32 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <CurriculumTechSection />
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Admissions Inquiry Desk */}
      <section className="w-full bg-transparent py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" triggerStart="top 85%">
            <AdmissionsInquirySection />
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
