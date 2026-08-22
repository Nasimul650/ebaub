import Link from 'next/link';

interface MegaMenuProps {
  activeMenu: string | null;
}

export default function MegaMenu({ activeMenu }: MegaMenuProps) {
  if (!activeMenu) return null;

  return (
    <div className="max-w-7xl mx-auto">
      
      {activeMenu === 'academics' && (
        <div className="grid grid-cols-3 gap-12 text-xs">
          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">DEGREE PROGRAMS</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">B.Sc. in Computer Science & Engineering (B.Sc. CSE)</Link></li>
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">B.Sc. in Agriculture (Honours)</Link></li>
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">Bachelor of Business Administration (BBA)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">FACULTIES</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">Faculty of Computer Science & Engineering</Link></li>
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">Faculty of Agriculture</Link></li>
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">Faculty of Business Administration</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">ACADEMIC EXCELLENCE</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/faculty" className="hover:text-emerald-600 transition-colors">Faculty Directory & Research Labs</Link></li>
              <li><Link href="/academics" className="hover:text-emerald-600 transition-colors">Undergraduate Curriculums & Credits</Link></li>
            </ul>
          </div>
        </div>
      )}

      {activeMenu === 'admissions' && (
        <div className="grid grid-cols-3 gap-12 text-xs">
          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">SPRING 2027 ADMISSION</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/admissions" className="text-emerald-700 font-bold hover:underline">Applications Now Open</Link></li>
              <li><Link href="/admissions" className="hover:text-emerald-600 transition-colors">How to Apply Step-by-Step</Link></li>
              <li><Link href="/admissions" className="hover:text-emerald-600 transition-colors">Admission Test Dates & Venue</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">ELIGIBILITY</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/admissions" className="hover:text-emerald-600 transition-colors">B.Sc. CSE Minimum GPA & Math Requirements</Link></li>
              <li><Link href="/admissions" className="hover:text-emerald-600 transition-colors">B.Sc. Agriculture Science Background</Link></li>
              <li><Link href="/admissions" className="hover:text-emerald-600 transition-colors">BBA Admission Guidelines</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">CONTACT & LOCATION</div>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Admissions Desk & Helpline</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Campus Map, Rajshahi, Bangladesh</Link></li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
