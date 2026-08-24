import React from 'react';
import { getAllFaculty, getFacultiesWithDepartments, getPageSiteSettings } from '@/utils/supabase/queries';
import FacultyDirectoryView from '@/components/faculty/FacultyDirectoryView';
import PageHeader from '@/components/shared/PageHeader';
import type { FacultyPageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';
import { Sparkles, Briefcase, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Faculty Directory | EBAUB',
  description: 'Meet the distinguished faculty members and academic staff at EXIM Bank Agricultural University Bangladesh',
};

export default async function FacultyPage() {
  const [facultyList, hierarchy, facultySettings] = await Promise.all([
    getAllFaculty(200),
    getFacultiesWithDepartments(),
    getPageSiteSettings<FacultyPageSettings>('faculty')
  ]);

  const fallback = PAGE_SETTINGS_DEFAULTS.faculty;
  const badge = facultySettings?.header_badge || fallback.header_badge;
  const headline = facultySettings?.header_headline || fallback.header_headline;
  const description = facultySettings?.header_description || fallback.header_description;
  const recruitmentNotice = facultySettings?.join_faculty_notice || fallback.join_faculty_notice;
  const researchFocus = facultySettings?.research_focus_text || fallback.research_focus_text;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />

      {/* Faculty Highlights / Callout Cards */}
      {(recruitmentNotice || researchFocus) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchFocus && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 heading-display">
                    Research & Innovation
                  </h3>
                  <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                    Faculty Focus
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-bangla">
                  {researchFocus}
                </p>
              </div>
            </div>
          )}

          {recruitmentNotice && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Briefcase className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 heading-display">
                    Join Our Academic Roster
                  </h3>
                  <a 
                    href="mailto:hr@ebaub.edu.bd" 
                    className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Contact HR</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-bangla">
                  {recruitmentNotice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <FacultyDirectoryView hierarchy={hierarchy} allMembers={facultyList} />
    </div>
  );
}
