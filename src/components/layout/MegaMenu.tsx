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
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors flex flex-col h-full">
            <div className="flex items-center gap-2 text-[11px] uppercase font-bold text-blue-800 tracking-wider">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Faculties</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium flex-1">
              {faculties.length > 0 ? (
                faculties.map((fac: any) => (
                  <li key={fac.id}>
                    <Link href={`/academics?faculty=${fac.id}`} onClick={onItemClick} className="hover:text-blue-700 transition-colors flex items-center justify-between group">
                      <span className="truncate pr-4">{fac.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No faculties available.</li>
              )}
            </ul>
            <div className="pt-3 mt-auto border-t border-slate-200/60">
              <Link href="/academics" onClick={onItemClick} className="inline-flex items-center gap-1.5 text-blue-700 font-bold hover:text-blue-800 transition-colors group">
                View All Faculties
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
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
    </div>
  );
}
