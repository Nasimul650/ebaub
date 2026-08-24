import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Globe 
} from 'lucide-react';
import type { GlobalFooterSettings, GlobalSiteSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

interface Props {
  settings?: Partial<GlobalFooterSettings> | GlobalSiteSettings;
}

export default function Footer({ settings }: Props) {
  const fallback = PAGE_SETTINGS_DEFAULTS.global_footer;

  // Resolve settings whether passed as GlobalFooterSettings or legacy GlobalSiteSettings
  const siteName = (settings as GlobalFooterSettings)?.site_name || (settings as GlobalSiteSettings)?.general?.site_name || fallback.site_name;
  const shortName = (settings as GlobalFooterSettings)?.short_name || (settings as GlobalSiteSettings)?.general?.short_name || fallback.short_name;
  const tagline = (settings as GlobalFooterSettings)?.tagline || (settings as GlobalSiteSettings)?.general?.tagline || fallback.tagline;
  const accreditation = (settings as GlobalFooterSettings)?.accreditation || (settings as GlobalSiteSettings)?.general?.accreditation || fallback.accreditation;
  
  const campusAddress = (settings as GlobalFooterSettings)?.campus_address || (settings as GlobalSiteSettings)?.contact?.campus_address || fallback.campus_address;
  const inquiriesEmail = (settings as GlobalFooterSettings)?.inquiries_email || (settings as GlobalSiteSettings)?.contact?.inquiries_email || fallback.inquiries_email;
  const hotlinePhone = (settings as GlobalFooterSettings)?.hotline_phone || (settings as GlobalSiteSettings)?.contact?.hotline_phone || fallback.hotline_phone;
  const admissionsPhone = (settings as GlobalFooterSettings)?.admissions_phone || (settings as GlobalSiteSettings)?.contact?.admissions_phone || fallback.admissions_phone;
  
  const facebookUrl = (settings as GlobalFooterSettings)?.facebook_url || (settings as GlobalSiteSettings)?.socials?.facebook_url || fallback.facebook_url;
  const linkedinUrl = (settings as GlobalFooterSettings)?.linkedin_url || (settings as GlobalSiteSettings)?.socials?.linkedin_url || fallback.linkedin_url;
  const youtubeUrl = (settings as GlobalFooterSettings)?.youtube_url || (settings as GlobalSiteSettings)?.socials?.youtube_url || fallback.youtube_url;
  const studentPortalUrl = (settings as GlobalFooterSettings)?.student_portal_url || (settings as GlobalSiteSettings)?.socials?.student_portal_url || fallback.student_portal_url;
  const teacherPortalUrl = (settings as GlobalFooterSettings)?.teacher_portal_url || (settings as GlobalSiteSettings)?.socials?.teacher_portal_url || fallback.teacher_portal_url;

  return (
    <footer className="bg-emerald-950 text-slate-100 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-800/80 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-extrabold text-base sm:text-lg text-white leading-tight font-bangla">
                {siteName}
              </span>
            </div>
            
            <div className="space-y-3 text-slate-300 text-xs sm:text-sm font-bangla">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">{campusAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href={`mailto:${inquiriesEmail}`} className="hover:text-amber-400 transition-colors">
                  {inquiriesEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href={`tel:${hotlinePhone}`} className="hover:text-amber-400 transition-colors font-mono">
                  {hotlinePhone} {admissionsPhone ? `(Admissions: ${admissionsPhone})` : ''}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Explore</h4>
            <ul className="space-y-3 font-medium text-slate-300">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors duration-300">About EBAUB</Link></li>
              <li><Link href="/academics" className="hover:text-amber-400 transition-colors duration-300">Academic Programs</Link></li>
              <li><Link href="/admissions" className="hover:text-amber-400 transition-colors duration-300">Admissions</Link></li>
              <li><Link href="/faculty" className="hover:text-amber-400 transition-colors duration-300">Faculty Directory</Link></li>
              <li><Link href="/events" className="hover:text-amber-400 transition-colors duration-300">Campus Life</Link></li>
            </ul>
          </div>

          {/* Column 3: Digital Campus */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Digital Campus</h4>
            <ul className="space-y-3 font-medium text-slate-300">
              <li>
                <Link href={studentPortalUrl || "/student"} className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2">
                  <span>Student Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </Link>
              </li>
              <li>
                <Link href={teacherPortalUrl || "/teacher"} className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2">
                  <span>Teacher Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2">
                  <span>Admin CMS</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect & Socials */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <p className="text-slate-300 mb-6 text-xs sm:text-sm font-bangla">
              {tagline}
            </p>
            <div className="flex items-center gap-4">
              {facebookUrl && (
                <a 
                  href={facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Organization"
                  className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {youtubeUrl && (
                <a 
                  href={youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {!facebookUrl && !linkedinUrl && !youtubeUrl && (
                <a 
                  href="https://ebaub.ac.bd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Official Web"
                  className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-400 text-xs sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} {shortName}. All rights reserved.
          </p>
          {accreditation && (
            <p className="text-[11px] text-slate-400 max-w-md text-center sm:text-right font-bangla">
              {accreditation}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
