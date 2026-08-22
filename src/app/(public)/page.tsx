import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Bell, 
  Newspaper, 
  Calendar, 
  Users, 
  Award, 
  ArrowRight, 
  Building2, 
  ChevronRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Microscope,
  Cpu,
  TrendingUp,
  FileText,
  Mail,
  Check,
  Layers,
  Code2,
  Server,
  Database
} from 'lucide-react';
import BackToTopButton from '@/components/public/BackToTopButton';
import { getNotices, getNews, getEvents, getPrograms, getFaculties, getDepartments, getFacultyMembers } from '@/lib/mock/mockServices';

export default async function HomePage() {
  const [notices, news, events, programs, faculties, departments, facultyMembers] = await Promise.all([
    getNotices(),
    getNews(),
    getEvents(),
    getPrograms(),
    getFaculties(),
    getDepartments(),
    getFacultyMembers()
  ]);

  const importantNotices = notices.slice(0, 4);

  return (
    <div className="min-h-screen ambient-glow-canvas py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      
      {/* Floating Canvas Sheet (Matching 11.mp4 exact container structure) */}
      <div className="max-w-7xl mx-auto floating-sheet rounded-3xl sm:rounded-[36px] overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Matching 11.mp4 Hero Frame 00:01 - 00:03)               */}
        {/* ========================================================================= */}
        <section className="pt-12 sm:pt-20 pb-16 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>CSE Department 2-Year Anniversary Prototype</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 heading-display leading-[1.12]">
                Empowering the next generation of engineers.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Eastern Bank Agricultural University (EBAUB) brings modern digital education, theoretical foundations, and high-impact computing research directly to students and faculty.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/academics"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Degree Programs</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>

                <Link
                  href="/admissions"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Admission Guidelines
                </Link>
              </div>

            </div>

            {/* Right Hero Column: Interactive UI Preview Card (Matching 11.mp4 preview card) */}
            <div className="lg:col-span-5">
              <div className="clean-card rounded-2xl p-6 hero-card-glow space-y-5">
                
                {/* Header of widget */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      CSE
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">Department of CSE</div>
                      <div className="text-[10px] text-slate-500 font-medium">B.Sc. in Computer Science & Engineering</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Active Session
                  </span>
                </div>

                {/* Growth / Sparkline Graphic mockup */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>Curriculum Progress & Credits</span>
                    <span className="font-bold text-slate-900">160 Total Credits</span>
                  </div>
                  
                  {/* Graph bar visualization */}
                  <div className="h-20 w-full bg-white rounded-xl border border-slate-200/80 p-3 flex items-end gap-2 justify-between">
                    <div className="w-full bg-slate-100 rounded-t-sm h-[40%]" />
                    <div className="w-full bg-slate-100 rounded-t-sm h-[55%]" />
                    <div className="w-full bg-slate-100 rounded-t-sm h-[70%]" />
                    <div className="w-full bg-emerald-500 rounded-t-sm h-[90%] relative group">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        160 Cr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric pill indicators */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <div className="text-[10px] text-slate-500">Degree Duration</div>
                    <div className="font-bold text-slate-900 mt-0.5">4.0 Years (8 Sem)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <div className="text-[10px] text-slate-500">Department Status</div>
                    <div className="font-bold text-emerald-700 mt-0.5">2-Year Anniversary</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Powered by Headless CMS</span>
                  <Link href="/academics" className="text-emerald-700 font-bold hover:underline">
                    View Syllabus &rarr;
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* Social Proof / Partner Logos Strip (Matching 11.mp4 frame 00:03) */}
          <div className="mt-16 pt-10 border-t border-slate-100 text-center space-y-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Recognized & Accredited Higher Education in Bangladesh
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm">
              <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> UGC Bangladesh Approved
              </span>
              <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                <Award className="w-4 h-4 text-amber-500" /> CSE 2-Year Anniversary
              </span>
              <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                <Microscope className="w-4 h-4 text-sky-600" /> AI & Precision Agri Labs
              </span>
              <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                <Layers className="w-4 h-4 text-purple-600" /> Modern Digital Campus
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. LARGE METRICS STATEMENT (Matching 11.mp4 Frame 00:04 - 00:05)          */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 sm:px-12 lg:px-16 text-center bg-slate-50/50 border-b border-slate-100 space-y-12">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display">
              Turn academic rigor into real-world innovations.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              The Department of Computer Science & Engineering and Faculty of Agriculture equip students with theoretical foundations and practical software engineering capabilities.
            </p>
          </div>

          {/* 3 Metric Stats (Matching 300%, 70%, 60% row in video) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display">
                160+
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Curriculum Credits
              </div>
              <p className="text-xs text-slate-500">
                Rigorous coursework covering AI, Algorithms, Web Engineering & Cloud Systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700 heading-display">
                100%
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Digital Campus CMS
              </div>
              <p className="text-xs text-slate-500">
                Custom Headless CMS enables live notice publishing and dynamic student portals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-600 heading-display">
                2 Years
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                CSE Department
              </div>
              <p className="text-xs text-slate-500">
                Celebrating two years of continuous excellence in computer science education.
              </p>
            </div>

          </div>

          <div className="pt-2">
            <Link
              href="/academics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <span>Explore Academic Faculties</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. ALTERNATING SPLIT SECTION 1 (Matching 11.mp4 Frame 00:06 - 00:07)      */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Card: Faculty Profile Widget */}
            <div className="lg:col-span-5">
              <div className="clean-card rounded-2xl p-6 bg-white space-y-5">
                
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                    alt="Dr. Anisur Rahman"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Dr. Anisur Rahman</h3>
                    <p className="text-xs text-emerald-700 font-bold">Associate Professor & AI Lab Head</p>
                    <p className="text-[11px] text-slate-500">Department of CSE, EBAUB</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  "Our mission is to mentor students through hands-on coding, machine learning research, and real-world system architecture."
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Research Focus</div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      Machine Learning
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                      Agri-Tech AI
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                      Computer Vision
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">EBAUB Research Cell</span>
                  <Link href="/faculty" className="text-emerald-700 hover:underline">
                    View Faculty Directory &rarr;
                  </Link>
                </div>

              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-700">
                World-Class Academic Mentorship
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
                Learn directly from dedicated researchers and engineers.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                At EBAUB, education extends beyond standard lectures. Faculty members collaborate with students on practical software engineering, cloud architectures, and machine learning models applied to regional agricultural challenges.
              </p>
              <div className="pt-2">
                <Link
                  href="/faculty"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>Explore all faculty members and research interests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ALTERNATING SPLIT SECTION 2 (Matching 11.mp4 Frame 00:08 - 00:09)      */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100 bg-slate-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs uppercase tracking-wider font-bold text-blue-700">
                Industry-Ready Curriculums
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
                Modern tools, software stacks, and laboratory engineering.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                From algorithms and data structures to distributed cloud architectures and smart farming IoT sensors, our undergraduate programs prepare graduates to excel in global technology industries.
              </p>
              <div className="pt-2">
                <Link
                  href="/academics"
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>See all program curriculums and admission requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Badge Grid: Tech & Curriculum Badges */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">Algorithms & DS</div>
                  <p className="text-[10px] text-slate-500">C++, Java, Python, Problem Solving</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">Web Engineering</div>
                  <p className="text-[10px] text-slate-500">Next.js, React, Node, Fullstack</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">AI & Neural Nets</div>
                  <p className="text-[10px] text-slate-500">PyTorch, TensorFlow, Computer Vision</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">Relational DBs</div>
                  <p className="text-[10px] text-slate-500">PostgreSQL, SQL, Cloud Storage</p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE INQUIRY & ADMISSIONS CARD (Matching 11.mp4 Frame 00:10)    */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Card: Clean Form Card */}
            <div className="lg:col-span-5">
              <div className="clean-card rounded-2xl p-6 sm:p-8 bg-white space-y-5">
                
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Start Your Application</h3>
                  <p className="text-xs text-slate-500">Admissions Open for Spring 2027</p>
                </div>

                <form className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="tanvir@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Program of Interest</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option>B.Sc. in Computer Science & Engineering</option>
                      <option>B.Sc. in Agriculture (Honours)</option>
                      <option>Bachelor of Business Administration (BBA)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Submit Application Inquiry
                  </button>
                </form>

                <p className="text-[10px] text-center text-slate-400">
                  Admissions Office will respond within 24 hours.
                </p>

              </div>
            </div>

            {/* Right Column: Accreditation Badges */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
                Ready to begin your academic journey at EBAUB?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Join over 1,000+ graduates and researchers making meaningful contributions in technology, agricultural innovation, and business management.
              </p>

              {/* 3 Institutional Trust Badges (Matching Leader badges in 11.mp4) */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                    ★
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">UGC Approved</div>
                  <p className="text-[10px] text-slate-500">Government Certified</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                    ★
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">Top CSE Faculty</div>
                  <p className="text-[10px] text-slate-500">Expert Mentors</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                    ★
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">AI Research Cell</div>
                  <p className="text-[10px] text-slate-500">Published Papers</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. RESOURCE & NOTICE CARDS GRID (Matching 11.mp4 Frame 00:12)             */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 sm:px-12 lg:px-16 bg-slate-50/50">
          <div className="space-y-10">
            
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display">
                Official notices and resources to explore.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Access official circulars, exam routines, admission circulars, and departmental publications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {importantNotices.map((notice, idx) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.slug}`}
                  className="clean-card rounded-2xl p-6 bg-white space-y-4 group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {notice.category} Notice
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notice.summary}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read circular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* Floating Back to Top Button */}
      <BackToTopButton />

    </div>
  );
}
