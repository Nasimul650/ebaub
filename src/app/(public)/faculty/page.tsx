import React from 'react';
import { getAllFaculty, getFacultiesWithDepartments, getPageSiteSettings } from '@/utils/supabase/queries';
import FacultyDirectoryView from '@/components/faculty/FacultyDirectoryView';
import PageHeader from '@/components/shared/PageHeader';
import type { FacultyPageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';
import { Sparkles, Briefcase } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <PageHeader
        badge={badge}
        headline={headline}
        description={description}
      />

      {/* Faculty Callout Information Strip */}
      {(recruitmentNotice || researchFocus) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 border border-emerald-200/60 rounded-3xl p-6 text-xs text-slate-700">
          {researchFocus && (
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Research & Innovation</span>
                <span className="font-bangla leading-relaxed">{researchFocus}</span>
              </div>
            </div>
          )}
          {recruitmentNotice && (
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Join Our Academic Roster</span>
                <span className="font-bangla leading-relaxed">{recruitmentNotice}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <FacultyDirectoryView hierarchy={hierarchy} allMembers={facultyList} />
    </div>
  );
}
