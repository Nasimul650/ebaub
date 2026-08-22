import BackToTopButton from "@/components/public/BackToTopButton";
import {
  getDepartments,
  getEvents,
  getFaculties,
  getFacultyMembers,
  getNews,
  getNotices,
  getPrograms,
} from "@/lib/mock/mockServices";
import HeroSection from "@/components/home/HeroSection";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import MetricsSection from "@/components/home/MetricsSection";
import FacultyMentorshipSection from "@/components/home/FacultyMentorshipSection";
import CurriculumTechSection from "@/components/home/CurriculumTechSection";
import AdmissionsInquirySection from "@/components/home/AdmissionsInquirySection";
import HomeNoticeGridSection from "@/components/home/HomeNoticeGridSection";

export default async function HomePage() {
  const [
    notices,
    news,
    events,
    programs,
    faculties,
    departments,
    facultyMembers,
  ] = await Promise.all([
    getNotices(),
    getNews(),
    getEvents(),
    getPrograms(),
    getFaculties(),
    getDepartments(),
    getFacultyMembers(),
  ]);

  const importantNotices = notices.slice(0, 4);

  return (
    <div className="min-h-screen ambient-glow-canvas py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      {/* Floating Canvas Sheet (Matching 11.mp4 exact container structure) */}
      <div className="max-w-7xl mx-auto floating-sheet rounded-3xl sm:rounded-[36px] overflow-hidden">
        {/* 1. HERO SECTION (Matching 11.mp4 Hero Frame 00:01 - 00:03)               */}
        <section className="pt-12 sm:pt-20 pb-16 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
          <HeroSection />
          {/* Social Proof / Partner Logos Strip (Matching 11.mp4 frame 00:03) */}
          <SocialProofStrip />
        </section>
        {/* ========================================================================= */}
        {/* 2. LARGE METRICS STATEMENT (Matching 11.mp4 Frame 00:04 - 00:05)          */}
        {/* 
        <MetricsSection />

        {/* ========================================================================= */}
        {/* 3. ALTERNATING SPLIT SECTION 1 (Matching 11.mp4 Frame 00:06 - 00:07)      */}
        {/* ========================================================================= */}
        <FacultyMentorshipSection />

        {/* ========================================================================= */}
        {/* 4. ALTERNATING SPLIT SECTION 2 (Matching 11.mp4 Frame 00:08 - 00:09)      */}
        {/* ========================================================================= */}
        <CurriculumTechSection />

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE INQUIRY & ADMISSIONS CARD (Matching 11.mp4 Frame 00:10)    */}
        {/* ========================================================================= */}
        <AdmissionsInquirySection />

        {/* ========================================================================= */}
        {/* 6. RESOURCE & NOTICE CARDS GRID (Matching 11.mp4 Frame 00:12)             */}
        {/* ========================================================================= */}
        <HomeNoticeGridSection notices={importantNotices} />
      </div>

      {/* Floating Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
