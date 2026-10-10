'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  FolderDown, 
  Bot, 
  LogOut, 
  UserCheck,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  X
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

type Profile = {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  email?: string | null;
};

export default function StudentSidebar({ profile }: { profile?: Profile | null }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [profile?.avatar_url]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Study Hub', href: '/student/study', icon: BookOpen },
    { label: 'Course Files', href: '/student/files', icon: FolderDown },
    { label: 'AI Tutor', href: '/student/ai-tutor', icon: Bot },
  ];

  // Resolve Profile Data
  const fullName = profile?.full_name?.trim();
  const firstName = profile?.first_name?.trim();
  const lastName = profile?.last_name?.trim();
  
  let displayName = 'EBAUB Student';
  if (fullName) {
    displayName = fullName;
  } else if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (firstName) {
    displayName = firstName;
  } else if (lastName) {
    displayName = lastName;
  } else if (profile?.email) {
    displayName = profile.email.split('@')[0];
  }
  
  const firstLetter = displayName.charAt(0).toUpperCase();
  
  let roleDisplay = 'Student';
  if (profile?.role === 'ADMIN') roleDisplay = 'Administrator';
  else if (profile?.role === 'TEACHER') roleDisplay = 'Teacher';
  else if (profile?.role === 'STUDENT') roleDisplay = 'Student';
  else if (profile?.role) roleDisplay = profile.role;

  return (
    <>
      {/* Mobile Top Navbar (Visible on screens < md) */}
      <header className="md:hidden h-[76px] bg-campus-950 border-b border-campus-900 px-4 flex items-center justify-between shrink-0 z-30">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-campus-400 flex items-center justify-center text-campus-950 shadow-xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white truncate">Student Hub</div>
            <div className="text-[10px] text-campus-200 font-bold uppercase truncate">EBAUB Digital Campus</div>
          </div>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 rounded-xl bg-campus-900 border border-campus-800 text-campus-200 hover:text-white hover:bg-campus-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-campus-950/80 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setIsMobileOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar: Desktop Sidebar + Mobile Slide-out Drawer */}
      <aside 
        className={`bg-campus-950 flex flex-col shrink-0 transition-transform md:transition-all duration-300 ease-in-out z-50 fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full shadow-2xl md:shadow-none md:static md:h-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-[15px] top-[76px] -translate-y-1/2 bg-campus-800 text-campus-100 p-1.5 rounded-full border border-campus-950 hover:bg-campus-700 hover:text-white transition-colors z-50 hidden md:flex items-center justify-center shadow-md"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Sidebar Header (Drawer header on mobile, Top header on desktop) */}
        <div className="p-4 sm:p-5 border-b border-campus-900 flex items-center justify-between h-[76px] shrink-0">
          <Link 
            href="/" 
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 min-w-max"
          >
            <div className="w-10 h-10 rounded-xl bg-campus-400 flex items-center justify-center text-campus-950 shadow-xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
              <div className="font-extrabold text-sm text-white truncate">Student Hub</div>
              <div className="text-[10px] text-campus-200 font-bold uppercase truncate">EBAUB Digital Campus</div>
            </div>
          </Link>

          {/* Close button inside Drawer for Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-xl bg-campus-900 border border-campus-800 text-campus-200 hover:text-white hover:bg-campus-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Mode Quick Return Banner */}
        {profile?.role === 'ADMIN' && (
          <div className={`px-4 py-2 border-b border-purple-800/40 bg-purple-950/60 flex items-center shrink-0 ${isCollapsed ? 'md:justify-center md:px-2' : 'justify-between'}`}>
            <Link 
              href="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 text-[11px] font-bold text-purple-300 hover:text-white transition-colors"
              title="Admin View Active — Click to return to Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className={isCollapsed ? 'md:hidden' : 'inline'}>Admin View (Return)</span>
            </Link>
          </div>
        )}

        {/* Nav Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden text-xs font-semibold custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href === '/student/files' && pathname.startsWith('/student/materials')) ||
              (item.href === '/student/ai-tutor' && pathname.startsWith('/student/ai'));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center px-3.5 py-3 rounded-xl transition-all min-w-max overflow-hidden ${
                  isActive
                    ? 'bg-campus-900 text-white font-bold border border-campus-800 shadow-2xs'
                    : 'text-campus-100 hover:bg-campus-900 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-campus-200'}`} />
                <span className={`ml-3 transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto block'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Profile & Settings Dropup */}
        <div className="relative p-4 border-t border-campus-900 h-[76px] flex items-center shrink-0" ref={menuRef}>
          {/* Dropup Menu */}
          <div 
            className={`absolute bottom-[calc(100%-12px)] left-4 ${isCollapsed ? 'md:w-48 right-4' : 'right-4'} bg-campus-900 border border-campus-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ease-out origin-bottom ${
              isMenuOpen 
                ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                : 'opacity-0 translate-y-3 pointer-events-none scale-95'
            }`}
          >
            <div className="p-2 space-y-1">
              {profile?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 rounded-lg transition-colors border border-purple-500/20"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                  Return to Admin Portal
                </Link>
              )}
              <Link 
                href="/settings/profile" 
                onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-campus-100 hover:bg-campus-800 hover:text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Profile & Account Settings
              </Link>
              <form action={logout}>
                <button 
                  type="submit" 
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* Profile Trigger */}
          <div className="flex items-center justify-between gap-2 w-full overflow-hidden">
            <div className="flex items-center gap-3 min-w-max">
              <div 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Settings & Profile"
                className="w-10 h-10 rounded-full bg-campus-800 text-white font-extrabold flex items-center justify-center text-sm shadow-inner shrink-0 overflow-hidden cursor-pointer hover:ring-2 ring-campus-600 transition-all"
              >
                {profile?.avatar_url && !imgError ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={displayName} 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  firstLetter
                )}
              </div>
              <div className={`transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
                <div className="font-bold text-white text-sm truncate max-w-[130px]" title={displayName}>
                  {displayName}
                </div>
                <div className="text-[11px] text-campus-200 font-medium truncate max-w-[130px]" title={roleDisplay}>
                  {roleDisplay}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors shrink-0 ${isCollapsed ? 'md:hidden' : ''} ${
                isMenuOpen 
                  ? 'bg-campus-800 text-white' 
                  : 'text-campus-200 hover:bg-campus-800 hover:text-white'
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
