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
  Command
} from 'lucide-react';
import CommandMenuModal from '../public/CommandMenuModal';
import PublicAIFloatingWidget from '../public/PublicAIFloatingWidget';
import MegaMenu from './MegaMenu';
import PortalDropdown from './PortalDropdown';
import MobileNavDrawer from './MobileNavDrawer';

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
      {/* Main Clean Header (Positioned sticky with relative anchor for absolute dropdowns) */}
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
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

          {/* Center Navigation Links (Stable font weight to prevent layout shift) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-700">
            
            <Link 
              href="/about" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              About
            </Link>

            {/* Academics Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('academics')}
                onMouseEnter={() => setActiveMegaMenu('academics')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                  activeMegaMenu === 'academics'
                    ? 'bg-slate-100 text-emerald-700 scale-105'
                    : 'hover:bg-slate-100 hover:text-emerald-700'
                }`}
              >
                <span>Academics</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMegaMenu === 'academics' ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Admissions Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('admissions')}
                onMouseEnter={() => setActiveMegaMenu('admissions')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                  activeMegaMenu === 'admissions'
                    ? 'bg-slate-100 text-emerald-700 scale-105'
                    : 'hover:bg-slate-100 hover:text-emerald-700'
                }`}
              >
                <span>Admissions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMegaMenu === 'admissions' ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
            </div>

            <Link 
              href="/faculty" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Faculty
            </Link>

            <Link 
              href="/notices" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Notices
            </Link>

            <Link 
              href="/news" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              News
            </Link>

            <Link 
              href="/events" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Events
            </Link>

            <Link 
              href="/contact" 
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Contact
            </Link>

          </nav>

          {/* Right Action Tools (Search, Public AI, Portals) */}
          <div className="flex items-center gap-3">
            
            {/* Search Command Center Button */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all hover:scale-105 active:scale-95"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Portals Access Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portals</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <PortalDropdown 
                isOpen={portalDropdownOpen} 
                onClose={() => setPortalDropdownOpen(false)} 
              />
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

        {/* MEGA MENU PANEL (Animated with explicit .animate-megamenu keyframes) */}
        {activeMegaMenu && (
          <div 
            className="absolute top-full left-0 right-0 z-50 hidden lg:block bg-white border-b border-slate-200 shadow-2xl py-8 px-8 animate-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          >
            <div className="max-w-7xl mx-auto">
              <MegaMenu activeMenu={activeMegaMenu} />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer isOpen={mobileMenuOpen} />
      </header>

      {/* Command Menu Modal */}
      <CommandMenuModal isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

      {/* Public Floating AI Assistant */}
      <PublicAIFloatingWidget isOpen={aiWidgetOpen} onClose={() => setAiWidgetOpen(false)} />
    </>
  );
}
