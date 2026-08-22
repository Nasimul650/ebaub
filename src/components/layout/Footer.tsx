import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-campus-950 text-campus-200 text-xs border-t border-campus-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-campus-900 border border-campus-800/80 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-6 h-6 text-campus-400" />
              </div>
              <span className="font-extrabold text-base text-white">EBAUB Digital Campus</span>
            </div>
            <p className="text-xs text-campus-200/80 leading-relaxed">
              Eastern Bank Agricultural University is dedicated to developing world-class engineers, computer scientists, and agricultural leaders through modern education and technology.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-campus-300">
              <ShieldCheck className="w-4 h-4 text-campus-400" />
              <span>CSE Dept. 2-Year Anniversary</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[11px]">Quick Navigation</h4>
            <ul className="space-y-2.5 font-medium text-campus-200/90">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About University</Link></li>
              <li><Link href="/academics" className="hover:text-white transition-colors">Programs & Curriculums</Link></li>
              <li><Link href="/faculty" className="hover:text-white transition-colors">Faculty Directory</Link></li>
              <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions Guidelines</Link></li>
              <li><Link href="/notices" className="hover:text-white transition-colors">Official Notice Board</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals & Tools */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[11px]">Digital Campus</h4>
            <ul className="space-y-2.5 font-medium text-campus-200/90">
              <li><Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5"/> Headless CMS (Admin)</Link></li>
              <li><Link href="/teacher" className="hover:text-white transition-colors flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5"/> Teacher Workspace + AI</Link></li>
              <li><Link href="/student" className="hover:text-white transition-colors flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5"/> Student Study Hub</Link></li>
              <li><Link href="/notices/cse-2yr-anniversary-ceremony" className="hover:text-white transition-colors text-campus-300 font-semibold">Anniversary Notice</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3 text-campus-200/90">
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[11px]">Campus Contact</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-campus-400 shrink-0 mt-0.5" />
              <span>EBAUB Main Campus, Rajshahi, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-campus-400 shrink-0" />
              <span>info@ebaub.ac.bd</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-campus-400 shrink-0" />
              <span>+880-1700-000000</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-campus-900 flex flex-col sm:flex-row items-center justify-between text-xs text-campus-300 gap-4">
          <p>© {new Date().getFullYear()} Eastern Bank Agricultural University (EBAUB). All rights reserved.</p>
          <p className="flex items-center gap-1 text-campus-300">
            Engineered by <span className="font-bold text-white">EBAUB CSE Department</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
