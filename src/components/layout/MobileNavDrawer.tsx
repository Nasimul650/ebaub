import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, GraduationCap } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  faculties?: any[];
  programs?: any[];
}

export default function MobileNavDrawer({ isOpen, onClose, faculties = [], programs = [] }: MobileNavDrawerProps) {
  const [academicsOpen, setAcademicsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-campus-50 border-b border-campus-200 px-4 py-4 space-y-2 text-sm font-semibold max-h-[70vh] overflow-y-auto">
      <Link href="/about" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">About EBAUB</Link>
      
      {/* Academics Accordion */}
      <div>
        <button 
          onClick={() => setAcademicsOpen(!academicsOpen)}
          className="w-full flex items-center justify-between py-2 text-slate-700 hover:text-campus-800"
        >
          <span>Academics & Programs</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${academicsOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {academicsOpen && (
          <div className="pl-4 pr-2 py-2 space-y-4 border-l-2 border-campus-200 ml-2 mt-1">
            {faculties.map((faculty) => (
              <div key={faculty.id} className="space-y-2">
                <Link 
                  href={`/academics/${faculty.slug}`}
                  onClick={onClose} 
                  className="font-bold text-campus-900 block"
                >
                  {faculty.name}
                </Link>
                {programs.filter(p => p.faculty_id === faculty.id).length > 0 && (
                  <ul className="space-y-2 pl-2">
                    {programs.filter(p => p.faculty_id === faculty.id).map(program => (
                      <li key={program.id}>
                        <Link 
                          href={`/academics/${faculty.slug}#${program.slug}`}
                          onClick={onClose}
                          className="text-xs text-slate-600 hover:text-campus-700 flex items-center gap-1.5"
                        >
                          <GraduationCap className="w-3 h-3 text-campus-400" />
                          {program.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/admissions" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Admissions</Link>
      <Link href="/faculty" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Faculty Directory</Link>
      <Link href="/notices" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Notices</Link>
      <Link href="/news" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">News & Achievements</Link>
      <Link href="/events" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Events</Link>
      <Link href="/contact" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Contact</Link>
    </div>
  );
}
