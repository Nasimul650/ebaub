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
  ChevronDown
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

  const closeAllDropdowns = () => {
    setActiveMegaMenu(null);
    setPortalDropdownOpen(false);
  };

  const handleMegaMenuHover = (menuName: string) => {
    setPortalDropdownOpen(false);
    setActiveMegaMenu(menuName);
  };

  const toggleMegaMenu = (menuName: string) => {
    setPortalDropdownOpen(false);
    if (activeMegaMenu === menuName) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuName);
    }
  };

  const togglePortalDropdown = () => {
    setActiveMegaMenu(null);
    setPortalDropdownOpen(!portalDropdownOpen);
  };

  const openSearch = () => {
    closeAllDropdowns();
    setCommandMenuOpen(true);
  };

  const openAiWidget = () => {
    closeAllDropdowns();
    setAiWidgetOpen(true);
  };

  return (
    <>
      {/* Main Clean Header */}
      <header
        className="sticky top-0 z-50 bg-campus-50/95 backdrop-blur-md border-b border-campus-200/80 transition-all shadow-sm relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group shrink-0"
            onMouseEnter={() => setActiveMegaMenu(null)}
            onClick={closeAllDropdowns}
          >
            <div className="w-10 h-10 rounded-xl bg-campus-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-campus-400" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                EBAUB <span className="text-campus-800 font-semibold text-[11px] px-2 py-0.5 bg-campus-50 border border-campus-200 rounded-md">Campus</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Eastern Bank Agricultural University</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-700">
            
            <Link 
              href="/about" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              About
            </Link>

            {/* Academics Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('academics')}
                onMouseEnter={() => handleMegaMenuHover('academics')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                  activeMegaMenu === 'academics'
                    ? 'bg-campus-100 text-campus-800 scale-105'
                    : 'hover:bg-campus-100 hover:text-campus-800'
                }`}
              >
                <span>Academics</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMegaMenu === 'academics' ? 'rotate-180 text-campus-700' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Admissions Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('admissions')}
                onMouseEnter={() => handleMegaMenuHover('admissions')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                  activeMegaMenu === 'admissions'
                    ? 'bg-campus-100 text-campus-800 scale-105'
                    : 'hover:bg-campus-100 hover:text-campus-800'
                }`}
              >
                <span>Admissions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMegaMenu === 'admissions' ? 'rotate-180 text-campus-700' : 'text-slate-400'}`} />
              </button>
            </div>

            <Link 
              href="/faculty" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              Faculty
            </Link>

            <Link 
              href="/notices" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              Notices
            </Link>

            <Link 
              href="/news" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              News
            </Link>

            <Link 
              href="/events" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              Events
            </Link>

            <Link 
              href="/contact" 
              onMouseEnter={() => setActiveMegaMenu(null)}
              onClick={closeAllDropdowns}
              className="px-3.5 py-2 rounded-lg hover:text-campus-800 hover:bg-campus-100 transition-colors"
            >
              Contact
            </Link>

          </nav>

          {/* Right Action Tools (Search, Public AI, Portals) */}
          <div className="flex items-center gap-3">
            
            {/* Search Command Center Button */}
            <button
              onClick={openSearch}
              onMouseEnter={() => setActiveMegaMenu(null)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-campus-50/80 text-slate-700 hover:text-campus-900 border border-campus-200 hover:border-campus-300 text-xs font-medium shadow-xs transition-all hover:scale-105 active:scale-95 group"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 text-campus-700 group-hover:text-campus-900 transition-colors" />
              <span>Search</span>
            </button>

            {/* Public AI Launcher */}
            <button
              onClick={openAiWidget}
              onMouseEnter={() => setActiveMegaMenu(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-campus-50 hover:bg-campus-100 text-campus-900 border border-campus-200 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-campus-700" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Portals Access Dropdown Container */}
            <div className="relative">
              <button
                onClick={togglePortalDropdown}
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 duration-300"
              >
                <UserCheck className="w-3.5 h-3.5 text-campus-400" />
                <span>Portals</span>
                <ChevronDown className={`w-3 h-3 text-campus-300 transition-transform duration-300 ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <PortalDropdown 
                isOpen={portalDropdownOpen} 
                onClose={() => setPortalDropdownOpen(false)} 
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-campus-50 text-slate-700 hover:bg-campus-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* MEGA MENU PANEL */}
        {activeMegaMenu && (
          <div 
            className="absolute top-full left-0 right-0 z-50 hidden lg:block bg-campus-50 border-b border-campus-200 shadow-2xl py-8 px-8 animate-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          >
            <div className="max-w-7xl mx-auto">
              <MegaMenu 
                activeMenu={activeMegaMenu} 
                onItemClick={closeAllDropdowns}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer isOpen={mobileMenuOpen} />
      </header>

      {/* Backdrop overlay to close mega menu when mouse exits down */}
      {activeMegaMenu && (
        <div 
          className="fixed inset-0 top-18 z-40 bg-campus-950/5 backdrop-blur-[0.5px]"
          onClick={closeAllDropdowns}
          onMouseEnter={closeAllDropdowns}
        />
      )}

      {/* Command Menu Modal */}
      <CommandMenuModal isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

      {/* Public Floating AI Assistant */}
      <PublicAIFloatingWidget isOpen={aiWidgetOpen} onClose={() => setAiWidgetOpen(false)} />
    </>
  );
}
