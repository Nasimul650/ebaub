'use client';

import React, { useState, useTransition } from 'react';
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
  Clock
} from 'lucide-react';
import { updateSiteSettings } from '@/app/actions/settings';
import type { 
  GlobalSiteSettings, 
  HeroSettings, 
  GeneralSettings, 
  ContactSettings, 
  SocialSettings 
} from '@/types/settings';

interface Props {
  initialSettings: GlobalSiteSettings;
}

type TabType = 'hero' | 'general' | 'contact' | 'socials';

export default function SiteSettingsManager({ initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isPending, startTransition] = useTransition();

  // Tab Form States
  const [heroData, setHeroData] = useState<HeroSettings>(initialSettings.hero);
  const [generalData, setGeneralData] = useState<GeneralSettings>(initialSettings.general);
  const [contactData, setContactData] = useState<ContactSettings>(initialSettings.contact);
  const [socialsData, setSocialsData] = useState<SocialSettings>(initialSettings.socials);

  // Status feedback
  const [status, setStatus] = useState<{
    tab: TabType;
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSave = (tab: TabType) => {
    setStatus(null);

    let payload: Record<string, any> = {};
    if (tab === 'hero') payload = heroData;
    else if (tab === 'general') payload = generalData;
    else if (tab === 'contact') payload = contactData;
    else if (tab === 'socials') payload = socialsData;

    startTransition(async () => {
      const result = await updateSiteSettings(tab, payload);
      if (result.success) {
        setStatus({
          tab,
          type: 'success',
          message: result.message || 'Settings updated successfully! Public layout revalidated.'
        });
      } else {
        setStatus({
          tab,
          type: 'error',
          message: result.error || 'Failed to save settings. Please try again.'
        });
      }
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    {
      id: 'hero',
      label: 'Hero & Media',
      icon: Sparkles,
      description: 'Homepage headline, subtitle, video URL, and fallback cover images.'
    },
    {
      id: 'general',
      label: 'General & SEO',
      icon: Globe,
      description: 'University name, taglines, accreditation, and search metadata.'
    },
    {
      id: 'contact',
      label: 'Contact & Campus',
      icon: MapPin,
      description: 'Campus address, inquiry emails, hotline numbers, and office hours.'
    },
    {
      id: 'socials',
      label: 'Socials & Links',
      icon: Share2,
      description: 'Official social profiles, YouTube channel, and portal links.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-campus-900 text-white shadow-sm">
              <Sliders className="w-6 h-6 text-campus-300" />
            </div>
            <span>Global Site Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized static content manager for hero copy, contact details, social links, and SEO metadata.
          </p>
        </div>

        {/* Global Quick Status */}
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

      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setStatus(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-campus-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-campus-50 hover:text-campus-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* ========================================================================= */}
        {/* TAB 1: HERO & MEDIA */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('hero');
            }}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Hero Section & Showcase Media
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit the primary headline, description, and visual assets on the homepage hero banner.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={heroData.badge_text || ''}
                  onChange={(e) => setHeroData({ ...heroData, badge_text: e.target.value })}
                  placeholder="e.g. Excellence in Higher Education"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Main Headline <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={heroData.headline}
                  onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                  placeholder="e.g. Empowering the next generation of engineers."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Subtitle / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  placeholder="Comprehensive subtitle describing EBAUB's mission and engineering excellence..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Fallback Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={heroData.fallback_image_url || ''}
                    onChange={(e) => setHeroData({ ...heroData, fallback_image_url: e.target.value })}
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
                    value={heroData.video_url || ''}
                    onChange={(e) => setHeroData({ ...heroData, video_url: e.target.value })}
                    placeholder="https://example.com/campus-tour.mp4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save Hero Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GENERAL & SEO */}
        {/* ========================================================================= */}
        {activeTab === 'general' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('general');
            }}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> General Information & Metadata
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure official branding, acronyms, taglines, search engine descriptions, and accreditation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={generalData.site_name}
                    onChange={(e) => setGeneralData({ ...generalData, site_name: e.target.value })}
                    placeholder="EXIM Bank Agricultural University Bangladesh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Short Name / Acronym <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={generalData.short_name}
                    onChange={(e) => setGeneralData({ ...generalData, short_name: e.target.value })}
                    placeholder="EBAUB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all uppercase font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Institutional Tagline
                </label>
                <input
                  type="text"
                  value={generalData.tagline}
                  onChange={(e) => setGeneralData({ ...generalData, tagline: e.target.value })}
                  placeholder="Excellence in Agricultural Sciences, Engineering & Business"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Meta Description (SEO)
                </label>
                <textarea
                  rows={2}
                  value={generalData.meta_description}
                  onChange={(e) => setGeneralData({ ...generalData, meta_description: e.target.value })}
                  placeholder="Summary for search engines (Google, Bing)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Accreditation & Approval Notice
                </label>
                <textarea
                  rows={2}
                  value={generalData.accreditation}
                  onChange={(e) => setGeneralData({ ...generalData, accreditation: e.target.value })}
                  placeholder="Approved by UGC & Ministry of Education, Govt. of the People's Republic of Bangladesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save General Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CONTACT & CAMPUS INFO */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('contact');
            }}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" /> Contact Info & Physical Campus Location
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update official contact channels, hotline phone lines, email addresses, and visiting hours.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Official Campus Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={contactData.campus_address}
                  onChange={(e) => setContactData({ ...contactData, campus_address: e.target.value })}
                  placeholder="69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> General Inquiries Email <span className="text-red-500">*</span>
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
                    <Mail className="w-3.5 h-3.5 text-amber-500" /> Admissions Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={contactData.admissions_email || ''}
                    onChange={(e) => setContactData({ ...contactData, admissions_email: e.target.value })}
                    placeholder="admission@ebaub.edu.bd"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Main Hotline Phone <span className="text-red-500">*</span>
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500" /> Admissions Desk Phone Lines
                  </label>
                  <input
                    type="text"
                    value={contactData.admissions_phone || ''}
                    onChange={(e) => setContactData({ ...contactData, admissions_phone: e.target.value })}
                    placeholder="02-588893526 to 29"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Official Office Hours
                </label>
                <input
                  type="text"
                  value={contactData.office_hours}
                  onChange={(e) => setContactData({ ...contactData, office_hours: e.target.value })}
                  placeholder="Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                    <span>Saving Changes...</span>
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

        {/* ========================================================================= */}
        {/* TAB 4: SOCIALS & EXTERNAL LINKS */}
        {/* ========================================================================= */}
        {activeTab === 'socials' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('socials');
            }}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" /> Social Profiles & Portal Links
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set URLs for official social media channels, student/faculty dashboards, and external resources.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Official Facebook Page URL</span>
                  {socialsData.facebook_url && (
                    <a href={socialsData.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-campus-800 font-bold hover:underline inline-flex items-center gap-1">
                      <span>Test link</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  value={socialsData.facebook_url}
                  onChange={(e) => setSocialsData({ ...socialsData, facebook_url: e.target.value })}
                  placeholder="https://www.facebook.com/ebaub.chapai"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>LinkedIn Organization URL</span>
                  {socialsData.linkedin_url && (
                    <a href={socialsData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-campus-800 font-bold hover:underline inline-flex items-center gap-1">
                      <span>Test link</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  value={socialsData.linkedin_url}
                  onChange={(e) => setSocialsData({ ...socialsData, linkedin_url: e.target.value })}
                  placeholder="https://www.linkedin.com/company/ebaub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>YouTube Channel URL</span>
                  {socialsData.youtube_url && (
                    <a href={socialsData.youtube_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-campus-800 font-bold hover:underline inline-flex items-center gap-1">
                      <span>Test link</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  value={socialsData.youtube_url}
                  onChange={(e) => setSocialsData({ ...socialsData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/@ebaub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Student Portal Link / Path
                  </label>
                  <input
                    type="text"
                    value={socialsData.student_portal_url}
                    onChange={(e) => setSocialsData({ ...socialsData, student_portal_url: e.target.value })}
                    placeholder="/student"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Teacher Portal Link / Path
                  </label>
                  <input
                    type="text"
                    value={socialsData.teacher_portal_url}
                    onChange={(e) => setSocialsData({ ...socialsData, teacher_portal_url: e.target.value })}
                    placeholder="/teacher"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-600 transition-all font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-campus-300" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save Social Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
