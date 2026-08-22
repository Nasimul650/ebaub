import AdmissionsInquirySection from "@/components/home/AdmissionsInquirySection";
import CurriculumTechSection from "@/components/home/CurriculumTechSection";
import FacultyMentorshipSection from "@/components/home/FacultyMentorshipSection";
import HeroSection from "@/components/home/HeroSection";
import HomeNoticeGridSection from "@/components/home/HomeNoticeGridSection";
import MetricsSection from "@/components/home/MetricsSection";
import SocialProofStrip from "@/components/home/SocialProofStrip";
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
      <div className="max-w-7xl mx-auto floating-sheet rounded-3xl sm:rounded-[36px] overflow-hidden">
        <section className="pt-12 sm:pt-20 pb-16 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
          <HeroSection />
          <SocialProofStrip />
        </section>
        <MetricsSection />
        <FacultyMentorshipSection />
        <CurriculumTechSection />
        <AdmissionsInquirySection />
        <HomeNoticeGridSection notices={importantNotices} />
      </div>

      <BackToTopButton />
    </div>
  );
}
