'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Search, 
  Bot, 
  UserCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Command,
  BookOpen,
  ShieldCheck,
  Building2,
  Bell,
  ArrowRight
} from 'lucide-react';
import CommandMenuModal from '../public/CommandMenuModal';
import PublicAIFloatingWidget from '../public/PublicAIFloatingWidget';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [aiWidgetOpen, setAiWidgetOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const toggleMegaMenu = (menuName: string) => {
    if (activeMegaMenu === menuName) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuName);
    }
  };

  return (
    <>
      {/* Top Notification Bar (Inspired by video/modern SaaS header) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
          2nd Anniversary
        </span>
        <span className="text-slate-200">
          CSE Department Celebrates 2 Years of Academic Excellence & Digital Innovation
        </span>
        <Link href="/notices/cse-2yr-anniversary-ceremony" className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1 flex items-center gap-1">
          Learn More &rarr;
        </Link>
      </div>

      {/* Main Clean Header (Matching 11.mp4 navigation bar) */}
      <header
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                EBAUB <span className="text-emerald-700 font-semibold text-[11px] px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md">Campus</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Eastern Bank Agricultural University</p>
            </div>
          </Link>

          {/* Center Navigation Links (Pill style matching 11.mp4) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700">
            
            <Link 
              href="/about" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              About
            </Link>

            {/* Academics Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('academics')}
                onMouseEnter={() => setActiveMegaMenu('academics')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  activeMegaMenu === 'academics'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>Academics</span>
                {activeMegaMenu === 'academics' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            {/* Admissions Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('admissions')}
                onMouseEnter={() => setActiveMegaMenu('admissions')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  activeMegaMenu === 'admissions'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>Admissions</span>
                {activeMegaMenu === 'admissions' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            <Link 
              href="/faculty" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Faculty
            </Link>

            <Link 
              href="/notices" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Notices
            </Link>

            <Link 
              href="/news" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              News
            </Link>

            <Link 
              href="/events" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Events
            </Link>

            <Link 
              href="/contact" 
              className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>

          </nav>

          {/* Right Action Tools (Search, Public AI, Portals) */}
          <div className="flex items-center gap-3">
            
            {/* Search Command Center Button */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-500 font-mono shadow-xs border border-slate-200">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Public AI Launcher */}
            <button
              onClick={() => setAiWidgetOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all hover:scale-105"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Portals Access Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portals</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 text-xs font-medium z-50 animate-in fade-in"
                  onClick={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Access Digital Workspace</div>
                  <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-slate-900 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Headless CMS (Admin)
                  </Link>
                  <Link href="/teacher" className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-slate-900 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Teacher Workspace + AI
                  </Link>
                  <Link href="/student" className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-slate-900 font-semibold">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Student Study Workspace
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* MEGA MENU PANEL (Clean Light UI matching 11.mp4) */}
        {activeMegaMenu && (
          <div 
            className="hidden lg:block bg-white border-t border-b border-slate-200 py-8 px-8 shadow-xl animate-in fade-in slide-in-from-top-1"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          >
            <div className="max-w-7xl mx-auto">
              
              {activeMegaMenu === 'academics' && (
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

              {activeMegaMenu === 'admissions' && (
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
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs font-semibold">
            <Link href="/about" className="block py-2 text-slate-700 hover:text-emerald-700">About EBAUB</Link>
            <Link href="/academics" className="block py-2 text-slate-700 hover:text-emerald-700">Academics & Programs</Link>
            <Link href="/admissions" className="block py-2 text-slate-700 hover:text-emerald-700">Admissions</Link>
            <Link href="/faculty" className="block py-2 text-slate-700 hover:text-emerald-700">Faculty Directory</Link>
            <Link href="/notices" className="block py-2 text-slate-700 hover:text-emerald-700">Notices</Link>
            <Link href="/news" className="block py-2 text-slate-700 hover:text-emerald-700">News & Achievements</Link>
            <Link href="/events" className="block py-2 text-slate-700 hover:text-emerald-700">Events</Link>
            <Link href="/contact" className="block py-2 text-slate-700 hover:text-emerald-700">Contact</Link>
          </div>
        )}
      </header>

      {/* Command Menu Modal */}
      <CommandMenuModal isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

      {/* Public Floating AI Assistant */}
      <PublicAIFloatingWidget isOpen={aiWidgetOpen} onClose={() => setAiWidgetOpen(false)} />
    </>
  );
}
