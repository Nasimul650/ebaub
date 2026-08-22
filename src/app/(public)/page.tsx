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
    /* Massive, horizontally centered white container sitting on top of the gradient background */
    <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/80 px-6 sm:px-12 lg:px-16 divide-y divide-slate-100">
      
      {/* 1. Hero Section (2-Column Grid with GSAP Timeline Entrance & Floating Glassmorphism Card) */}
      <section className="py-20 sm:py-28 lg:py-32">
        <HeroSection />
      </section>

      {/* 2. Logo Cloud / Social Proof Strip (Staggered ScrollTrigger Entrance) */}
      <section className="py-12 sm:py-16">
        <SocialProofStrip />
      </section>

      {/* 3. Stats Section (Centered Text Block + Staggered 3-Column Massive Numbers Grid) */}
      <section className="py-24 sm:py-32">
        <ScrollReveal direction="up" triggerStart="top 85%">
          <MetricsSection />
        </ScrollReveal>
      </section>

      {/* 4. Feature Z-Pattern Row 1: Faculty Mentorship (Profile Card Left, Text Right) */}
      <section className="py-24 sm:py-32">
        <ScrollReveal direction="up" triggerStart="top 85%">
          <FacultyMentorshipSection />
        </ScrollReveal>
      </section>

      {/* 5. Feature Z-Pattern Row 2: Curriculum & Tech Stacks (Text Left, App Grid Right + Floating Yoyo) */}
      <section className="py-24 sm:py-32">
        <ScrollReveal direction="up" triggerStart="top 85%">
          <CurriculumTechSection />
        </ScrollReveal>
      </section>

      {/* 6. Embedded Inquiry Form & Accreditation Badges */}
      <section className="py-24 sm:py-32">
        <ScrollReveal direction="up" triggerStart="top 85%">
          <AdmissionsInquirySection />
        </ScrollReveal>
      </section>

      {/* 7. Resource & Notice Grid Section */}
      <section className="py-24 sm:py-32">
        <ScrollReveal direction="up" triggerStart="top 85%">
          <HomeNoticeGridSection notices={notices} />
        </ScrollReveal>
      </section>

    </div>
  );
}
