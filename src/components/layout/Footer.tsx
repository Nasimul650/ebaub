import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Globe, Users, PlayCircle } from 'lucide-react';

export default function Footer() {
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
              <span className="font-extrabold text-lg text-white leading-tight">
                EXIM Bank Agricultural<br/>University Bangladesh
              </span>
            </div>
            
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>69-69/1, Boro Indara More,<br/>Chapai Nawabganj, 6300, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>info@ebaub.edu.bd</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>+880 1700 000000</span>
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
                <Link href="/student" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2">
                  <span>Student Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2">
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

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <p className="text-slate-300 mb-6">Stay updated with the latest news, events, and academic announcements.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300">
                <Globe className="w-5 h-5" />
                <span className="sr-only">Social Web</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300">
                <Users className="w-5 h-5" />
                <span className="sr-only">Community</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-300">
                <PlayCircle className="w-5 h-5" />
                <span className="sr-only">Video</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} EBAUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
