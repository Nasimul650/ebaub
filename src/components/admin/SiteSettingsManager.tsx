'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  Sparkles, 
  Globe, 
  MapPin, 
  Share2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Mail,
  Phone,
  Clock,
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Layers,
  FileText,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { updateSiteSettings } from '@/app/actions/settings';
import type { 
  GlobalFooterSettings,
  HomePageSettings,
  AcademicsPageSettings,
  AdmissionsPageSettings,
  FacultyPageSettings,
  StudentLifePageSettings,
  ContactPageSettings
} from '@/types/settings';

interface Props {
  initialSettings: {
    global_footer: GlobalFooterSettings;
    home: HomePageSettings;
    academics: AcademicsPageSettings;
    admissions: AdmissionsPageSettings;
    faculty: FacultyPageSettings;
    student_life: StudentLifePageSettings;
    contact: ContactPageSettings;
  };
}

type PageKey = 'global_footer' | 'home' | 'academics' | 'admissions' | 'faculty' | 'student_life' | 'contact';

export default function SiteSettingsManager({ initialSettings }: Props) {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [isPending, startTransition] = useTransition();

  // Individual Form States
  const [globalFooterData, setGlobalFooterData] = useState<GlobalFooterSettings>(initialSettings.global_footer);
  const [homeData, setHomeData] = useState<HomePageSettings>(initialSettings.home);
  const [academicsData, setAcademicsData] = useState<AcademicsPageSettings>(initialSettings.academics);
  const [admissionsData, setAdmissionsData] = useState<AdmissionsPageSettings>(initialSettings.admissions);
  const [facultyData, setFacultyData] = useState<FacultyPageSettings>(initialSettings.faculty);
  const [studentLifeData, setStudentLifeData] = useState<StudentLifePageSettings>(initialSettings.student_life);
  const [contactData, setContactData] = useState<ContactPageSettings>(initialSettings.contact);

  // Status feedback
  const [status, setStatus] = useState<{
    page: PageKey;
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSave = (page: PageKey) => {
    setStatus(null);

    let payload: Record<string, any> = {};
    if (page === 'global_footer') payload = globalFooterData;
    else if (page === 'home') payload = homeData;
    else if (page === 'academics') payload = academicsData;
    else if (page === 'admissions') payload = admissionsData;
    else if (page === 'faculty') payload = facultyData;
    else if (page === 'student_life') payload = studentLifeData;
    else if (page === 'contact') payload = contactData;

    startTransition(async () => {
      const result = await updateSiteSettings(page, payload);
      if (result.success) {
        setStatus({
          page,
          type: 'success',
          message: result.message || 'Page settings updated successfully!'
        });
      } else {
        setStatus({
          page,
          type: 'error',
          message: result.error || 'Failed to save settings. Please try again.'
        });
      }
    });
  };

  const navPages: { 
    id: PageKey; 
    label: string; 
    route: string;
    icon: React.ComponentType<{ className?: string }>; 
    description: string;
  }[] = [
    {
      id: 'home',
      label: 'Home Page',
      route: '/',
      icon: Home,
      description: 'Hero headline, subtitle, video URL, CTA buttons, and trust metrics.'
    },
    {
      id: 'global_footer',
      label: 'Global & Footer',
      route: 'All Pages',
      icon: Globe,
      description: 'Site name, tagline, accreditation, footer links, and social profiles.'
    },
    {
      id: 'academics',
      label: 'Academics',
      route: '/academics',
      icon: BookOpen,
      description: 'Page title, curriculum overview notes, and advising contact email.'
    },
    {
      id: 'admissions',
      label: 'Admissions',
      route: '/admissions',
      icon: GraduationCap,
      description: 'Hero copy, deadlines highlight, financial aid and scholarship text.'
    },
    {
      id: 'faculty',
      label: 'Faculty Directory',
      route: '/faculty',
      icon: Users,
      description: 'Directory header, educator highlights, and recruitment callout.'
    },
    {
      id: 'student_life',
      label: 'Student & Campus Life',
      route: '/events',
      icon: Calendar,
      description: 'Events header, student clubs overview, and campus facilities text.'
    },
    {
      id: 'contact',
      label: 'Contact & Campus',
      route: '/contact',
      icon: MapPin,
      description: 'Official address, hotline, email desk, and transit directions.'
    }
  ];

  const activePageMeta = navPages.find(p => p.id === activePage) || navPages[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-campus-900 text-white shadow-sm">
              <Sliders className="w-6 h-6 text-campus-300" />
            </div>
            <span>Page Static Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Individually manage headlines, copy, media URLs, callouts, and metadata for every public page.
          </p>
        </div>

        {/* Global Quick Status Banner */}
        {status && (
          <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            status.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Vertical Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PAGE NAVIGATION LIST */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xs space-y-1.5">
            <div className="px-4 py-3 border-b border-slate-100 mb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configurable Pages
              </h2>
            </div>

            {navPages.map((page) => {
              const Icon = page.icon;
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setActivePage(page.id);
                    setStatus(null);
                  }}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-campus-900 text-white shadow-md'
                      : 'text-slate-700 hover:bg-campus-50 hover:text-campus-950'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isActive ? 'bg-campus-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {page.label}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                        isActive ? 'bg-campus-800 text-campus-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {page.route}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 line-clamp-1 ${
                      isActive ? 'text-campus-200' : 'text-slate-500'
                    }`}>
                      {page.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Special Excluded Notice: About Page */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Looking for the About Page?</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              The <strong>/about</strong> page uses the modular block builder architecture instead of singleton static fields.
            </p>
            <Link
              href="/admin/pages/about"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-950 hover:underline pt-1"
            >
              <span>Open About Page Block Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTIVE PAGE FORM PANEL */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Active Page Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-[10px] font-bold uppercase tracking-wide mb-1.5">
                <span>Target: {activePageMeta.route}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {activePageMeta.label} Content & Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePageMeta.description}
              </p>
            </div>

            {activePageMeta.route !== 'All Pages' && (
              <a
                href={activePageMeta.route}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-campus-900 hover:border-campus-400 transition-colors"
              >
                <span>View Live Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* ========================================================================= */}
          {/* PAGE 1: HOME PAGE */}
          {/* ========================================================================= */}
          {activePage === 'home' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('home');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hero Badge Text
                  </label>
                  <input
                    type="text"
                    value={homeData.badge_text || ''}
                    onChange={(e) => setHomeData({ ...homeData, badge_text: e.target.value })}
                    placeholder="e.g. CSE Department 2-Year Anniversary Prototype"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hero Main Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={homeData.hero_headline}
                    onChange={(e) => setHomeData({ ...homeData, hero_headline: e.target.value })}
                    placeholder="e.g. Empowering the next generation of engineers."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hero Subtitle / Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={homeData.hero_subtitle}
                    onChange={(e) => setHomeData({ ...homeData, hero_subtitle: e.target.value })}
                    placeholder="Comprehensive description of EBAUB..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Fallback Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={homeData.hero_fallback_image_url || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero_fallback_image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-slate-400" /> Background Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={homeData.hero_video_url || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero_video_url: e.target.value })}
                      placeholder="https://example.com/campus-tour.mp4"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={homeData.explore_cta_text || ''}
                      onChange={(e) => setHomeData({ ...homeData, explore_cta_text: e.target.value })}
                      placeholder="Explore Degree Programs"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={homeData.admissions_cta_text || ''}
                      onChange={(e) => setHomeData({ ...homeData, admissions_cta_text: e.target.value })}
                      placeholder="Admission Guidelines"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Home Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Home Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: GLOBAL & FOOTER */}
          {/* ========================================================================= */}
          {activePage === 'global_footer' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('global_footer');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      University Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={globalFooterData.site_name}
                      onChange={(e) => setGlobalFooterData({ ...globalFooterData, site_name: e.target.value })}
                      placeholder="EXIM Bank Agricultural University Bangladesh"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-semibold font-bangla"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Short Name / Acronym <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={globalFooterData.short_name}
                      onChange={(e) => setGlobalFooterData({ ...globalFooterData, short_name: e.target.value })}
                      placeholder="EBAUB"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all uppercase font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tagline / Motto
                  </label>
                  <input
                    type="text"
                    value={globalFooterData.tagline}
                    onChange={(e) => setGlobalFooterData({ ...globalFooterData, tagline: e.target.value })}
                    placeholder="Excellence in Agricultural Sciences, Engineering & Business"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Accreditation & Approval Notice
                  </label>
                  <textarea
                    rows={2}
                    value={globalFooterData.accreditation}
                    onChange={(e) => setGlobalFooterData({ ...globalFooterData, accreditation: e.target.value })}
                    placeholder="Approved by UGC & Ministry of Education, Govt. of the People's Republic of Bangladesh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Social & Portal Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Facebook Page URL</label>
                      <input
                        type="url"
                        value={globalFooterData.facebook_url}
                        onChange={(e) => setGlobalFooterData({ ...globalFooterData, facebook_url: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn URL</label>
                      <input
                        type="url"
                        value={globalFooterData.linkedin_url}
                        onChange={(e) => setGlobalFooterData({ ...globalFooterData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube URL</label>
                      <input
                        type="url"
                        value={globalFooterData.youtube_url}
                        onChange={(e) => setGlobalFooterData({ ...globalFooterData, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Global Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Global & Footer Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 3: ACADEMICS */}
          {/* ========================================================================= */}
          {activePage === 'academics' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('academics');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Header Badge Text
                  </label>
                  <input
                    type="text"
                    value={academicsData.header_badge || ''}
                    onChange={(e) => setAcademicsData({ ...academicsData, header_badge: e.target.value })}
                    placeholder="Academics & Degree Programs"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Page Main Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={academicsData.header_headline}
                    onChange={(e) => setAcademicsData({ ...academicsData, header_headline: e.target.value })}
                    placeholder="Explore EBAUB Faculties, Departments & Curriculums"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Page Header Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={academicsData.header_description}
                    onChange={(e) => setAcademicsData({ ...academicsData, header_description: e.target.value })}
                    placeholder="Discover our industry-aligned undergraduate degree offerings..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Academic Advising Contact Email
                    </label>
                    <input
                      type="email"
                      value={academicsData.advising_contact_email || ''}
                      onChange={(e) => setAcademicsData({ ...academicsData, advising_contact_email: e.target.value })}
                      placeholder="academic.advising@ebaub.edu.bd"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Curriculum / OBE Framework Note
                    </label>
                    <input
                      type="text"
                      value={academicsData.curriculum_overview_text || ''}
                      onChange={(e) => setAcademicsData({ ...academicsData, curriculum_overview_text: e.target.value })}
                      placeholder="All degree curriculums follow outcome-based education (OBE) guidelines..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Academics Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Academics Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 4: ADMISSIONS */}
          {/* ========================================================================= */}
          {activePage === 'admissions' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('admissions');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Header Badge Text
                    </label>
                    <input
                      type="text"
                      value={admissionsData.header_badge || ''}
                      onChange={(e) => setAdmissionsData({ ...admissionsData, header_badge: e.target.value })}
                      placeholder="Fall 2027 Admissions Open"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Apply Button Text
                    </label>
                    <input
                      type="text"
                      value={admissionsData.apply_cta_text || ''}
                      onChange={(e) => setAdmissionsData({ ...admissionsData, apply_cta_text: e.target.value })}
                      placeholder="Apply Now"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admissions Hero Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={admissionsData.header_headline}
                    onChange={(e) => setAdmissionsData({ ...admissionsData, header_headline: e.target.value })}
                    placeholder="Begin Your Journey at EXIM Bank Agricultural University"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admissions Hero Subtitle / Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={admissionsData.header_description}
                    onChange={(e) => setAdmissionsData({ ...admissionsData, header_description: e.target.value })}
                    placeholder="Discover your potential with our rigorous academic programs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Upcoming Deadlines Callout Highlight
                  </label>
                  <input
                    type="text"
                    value={admissionsData.deadline_highlight_text || ''}
                    onChange={(e) => setAdmissionsData({ ...admissionsData, deadline_highlight_text: e.target.value })}
                    placeholder="Spring & Fall 2027 Application Deadlines are actively underway."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Financial Aid & Scholarship Callout Snippet
                  </label>
                  <textarea
                    rows={2}
                    value={admissionsData.financial_aid_snippet || ''}
                    onChange={(e) => setAdmissionsData({ ...admissionsData, financial_aid_snippet: e.target.value })}
                    placeholder="Need-based scholarships, merit waivers (up to 100%), and EXIM Bank Foundation stipends..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Admissions Desk Hotline
                    </label>
                    <input
                      type="text"
                      value={admissionsData.admissions_hotline || ''}
                      onChange={(e) => setAdmissionsData({ ...admissionsData, admissions_hotline: e.target.value })}
                      placeholder="02-588893526 to 29"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Admissions Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={admissionsData.admissions_email || ''}
                      onChange={(e) => setAdmissionsData({ ...admissionsData, admissions_email: e.target.value })}
                      placeholder="admission@ebaub.edu.bd"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Admissions Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Admissions Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 5: FACULTY DIRECTORY */}
          {/* ========================================================================= */}
          {activePage === 'faculty' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('faculty');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Header Badge Text
                  </label>
                  <input
                    type="text"
                    value={facultyData.header_badge || ''}
                    onChange={(e) => setFacultyData({ ...facultyData, header_badge: e.target.value })}
                    placeholder="Distinguished Educators"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Faculty Page Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={facultyData.header_headline}
                    onChange={(e) => setFacultyData({ ...facultyData, header_headline: e.target.value })}
                    placeholder="Academic Faculty Directory"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Faculty Page Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={facultyData.header_description}
                    onChange={(e) => setFacultyData({ ...facultyData, header_description: e.target.value })}
                    placeholder="Meet our dedicated academic staff committed to excellence in teaching..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Faculty Recruitment Notice / Callout
                  </label>
                  <input
                    type="text"
                    value={facultyData.join_faculty_notice || ''}
                    onChange={(e) => setFacultyData({ ...facultyData, join_faculty_notice: e.target.value })}
                    placeholder="Interested in joining our academic roster? Submit your CV and portfolio to hr@ebaub.edu.bd."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Research & Academic Excellence Focus Note
                  </label>
                  <input
                    type="text"
                    value={facultyData.research_focus_text || ''}
                    onChange={(e) => setFacultyData({ ...facultyData, research_focus_text: e.target.value })}
                    placeholder="Leading breakthroughs in Precision Agriculture, Software Architecture, and Machine Learning."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Faculty Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Faculty Directory Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 6: STUDENT & CAMPUS LIFE */}
          {/* ========================================================================= */}
          {activePage === 'student_life' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('student_life');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Header Badge Text
                  </label>
                  <input
                    type="text"
                    value={studentLifeData.header_badge || ''}
                    onChange={(e) => setStudentLifeData({ ...studentLifeData, header_badge: e.target.value })}
                    placeholder="Campus Events & Student Life"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Events Page Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={studentLifeData.header_headline}
                    onChange={(e) => setStudentLifeData({ ...studentLifeData, header_headline: e.target.value })}
                    placeholder="Vibrant Campus Life & Extracurriculars"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Events Page Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={studentLifeData.header_description}
                    onChange={(e) => setStudentLifeData({ ...studentLifeData, header_description: e.target.value })}
                    placeholder="Stay connected with upcoming academic events, workshops, seminars..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Student Clubs & Societies Highlight
                  </label>
                  <textarea
                    rows={2}
                    value={studentLifeData.clubs_highlight_text || ''}
                    onChange={(e) => setStudentLifeData({ ...studentLifeData, clubs_highlight_text: e.target.value })}
                    placeholder="Join 15+ student clubs including Computer Club, Robotics Guild, Cultural Society..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Campus Facilities & Technology Highlight
                  </label>
                  <textarea
                    rows={2}
                    value={studentLifeData.facilities_snippet || ''}
                    onChange={(e) => setStudentLifeData({ ...studentLifeData, facilities_snippet: e.target.value })}
                    placeholder="Modern computer labs, smart classrooms, botanical research fields, central library..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Student Life Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Student Life Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PAGE 7: CONTACT & CAMPUS */}
          {/* ========================================================================= */}
          {activePage === 'contact' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave('contact');
              }}
              className="space-y-6 animate-in fade-in duration-200"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Header Badge Text
                    </label>
                    <input
                      type="text"
                      value={contactData.header_badge || ''}
                      onChange={(e) => setContactData({ ...contactData, header_badge: e.target.value })}
                      placeholder="Contact EBAUB"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Main Hotline Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactData.hotline_phone}
                      onChange={(e) => setContactData({ ...contactData, hotline_phone: e.target.value })}
                      placeholder="02-588893525"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Page Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={contactData.header_headline}
                    onChange={(e) => setContactData({ ...contactData, header_headline: e.target.value })}
                    placeholder="Get in Touch with EBAUB University Administration"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Page Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={contactData.header_description}
                    onChange={(e) => setContactData({ ...contactData, header_description: e.target.value })}
                    placeholder="We welcome inquiries regarding admissions, departmental programs, research..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Physical Campus Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={contactData.campus_address}
                    onChange={(e) => setContactData({ ...contactData, campus_address: e.target.value })}
                    placeholder="69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-medium font-bangla"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Inquiries Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactData.inquiries_email}
                      onChange={(e) => setContactData({ ...contactData, inquiries_email: e.target.value })}
                      placeholder="info@ebaub.edu.bd"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Office / Visiting Hours
                    </label>
                    <input
                      type="text"
                      value={contactData.office_hours}
                      onChange={(e) => setContactData({ ...contactData, office_hours: e.target.value })}
                      placeholder="Sunday – Thursday: 9:00 AM – 5:00 PM"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Transport & Directions Guide
                  </label>
                  <textarea
                    rows={2}
                    value={contactData.transport_directions || ''}
                    onChange={(e) => setContactData({ ...contactData, transport_directions: e.target.value })}
                    placeholder="Located at Boro Indara More, easily accessible via regional transport..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-bangla"
                  />
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                      <span>Saving Contact Settings...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Contact Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
