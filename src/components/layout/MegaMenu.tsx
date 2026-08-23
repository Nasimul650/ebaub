import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, Building2, Users, FileText, CheckCircle2, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  activeMenu: string | null;
  onItemClick?: () => void;
  faculties?: any[];
  programs?: any[];
}

export default function MegaMenu({ activeMenu, onItemClick, faculties = [], programs = [] }: MegaMenuProps) {
  if (!activeMenu) return null;

  return (
    <div className="max-w-7xl mx-auto py-2">
      {activeMenu === 'academics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Col 1: Programs */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-campus-900 tracking-wider">
              <GraduationCap className="w-4 h-4 text-campus-700" />
              <span>Programs</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              {programs.length > 0 ? (
                programs.map((prog: any) => (
                  <li key={prog.id}>
                    <Link href={`/academics/${prog.id}`} onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                      <span className="truncate pr-4">{prog.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No programs available.</li>
              )}
            </ul>
          </div>

          {/* Col 2: Faculties */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-blue-800 tracking-wider">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Faculties</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              {faculties.length > 0 ? (
                faculties.map((fac: any) => (
                  <li key={fac.id}>
                    <Link href="/academics" onClick={onItemClick} className="hover:text-blue-700 transition-colors flex items-center justify-between group">
                      <span className="truncate pr-4">{fac.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No faculties available.</li>
              )}
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-campus-50/50 border border-campus-200/60 hover:bg-campus-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-amber-800 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Academic Excellence</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <Link href="/faculty" onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                  <span>Faculty Directory & AI Research</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/academics" onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                  <span>Undergraduate Curriculums & Credits</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/academic-calendar" onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                  <span>Academic Calendar & Deadlines</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      )}

      {activeMenu === 'admissions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Col 1 */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-campus-50/60 border border-campus-200/70 hover:bg-campus-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-campus-900 tracking-wider">
              <Sparkles className="w-4 h-4 text-campus-700" />
              <span>Spring 2027 Admission</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <Link href="/admissions" onClick={onItemClick} className="text-campus-900 font-bold hover:underline flex items-center justify-between group">
                  <span>Applications Now Open</span>
                  <ArrowRight className="w-3 h-3 text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/admissions" onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                  <span>How to Apply Step-by-Step</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/admissions" onClick={onItemClick} className="hover:text-campus-800 transition-colors flex items-center justify-between group">
                  <span>Admission Test Dates & Venue</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-campus-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-purple-800 tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Eligibility</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <Link href="/admissions" onClick={onItemClick} className="hover:text-purple-700 transition-colors flex items-center justify-between group">
                  <span>B.Sc. CSE Minimum Requirements</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/admissions" onClick={onItemClick} className="hover:text-purple-700 transition-colors flex items-center justify-between group">
                  <span>B.Sc. Agriculture Background</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/admissions" onClick={onItemClick} className="hover:text-purple-700 transition-colors flex items-center justify-between group">
                  <span>BBA Admission Guidelines</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-amber-800 tracking-wider">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Contact & Help</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <Link href="/contact" onClick={onItemClick} className="hover:text-amber-700 transition-colors flex items-center justify-between group">
                  <span>Admissions Desk Helpline</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={onItemClick} className="hover:text-amber-700 transition-colors flex items-center justify-between group">
                  <span>Campus Location & Visits</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
