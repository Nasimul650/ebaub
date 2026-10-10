'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Building2,
  Bell, 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Image as ImageIcon, 
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Mail,
  GraduationCap,
  FileText,
  UserCheck,
  Briefcase,
  X
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

type Profile = {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  email?: string | null;
};

export default function AdminSidebar({ profile }: { profile?: Profile | null }) {
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
    { label: 'CMS Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'User Accounts', href: '/admin/users', icon: UserCheck },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    { label: 'Academic Structure', href: '/admin/structure', icon: Building2 },
    { label: 'Programs CMS', href: '/admin/programs', icon: BookOpen },
    { label: 'Admissions CMS', href: '/admin/admissions', icon: GraduationCap },
    { label: 'Academic Calendar', href: '/admin/calendar', icon: Calendar },
    { label: 'Faculty CMS', href: '/admin/faculty', icon: Users },
    { label: 'Contact Inbox', href: '/admin/messages', icon: Mail },
    { label: 'Notices CMS', href: '/admin/notices', icon: Bell },
    { label: 'News CMS', href: '/admin/news', icon: Newspaper },
    { label: 'Events CMS', href: '/admin/events', icon: Calendar },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Pages', href: '/admin/pages/about', icon: FileText },
  ];

  // Resolve Profile Data
  const firstName = profile?.first_name;
  const lastName = profile?.last_name;
  
  let displayName = 'CMS Admin';
  if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (firstName) {
    displayName = firstName;
  } else if (lastName) {
    displayName = lastName;
  }
  
  const firstLetter = displayName.charAt(0).toUpperCase();
  
  let roleDisplay = 'Content Manager';
  if (profile?.role === 'ADMIN') roleDisplay = 'Administrator';
  else if (profile?.role === 'TEACHER') roleDisplay = 'Teacher';
  else if (profile?.role === 'STUDENT') roleDisplay = 'Student';
  else if (profile?.role) roleDisplay = profile.role;

  return (
    <>
      {/* Mobile Top Navbar (Visible on screens < md) */}
      <header className="md:hidden h-[76px] bg-campus-950 border-b border-campus-900 px-4 flex items-center justify-between shrink-0 z-30">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-campus-400 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white truncate">Headless CMS</div>
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
            <div className="w-10 h-10 rounded-xl bg-campus-400 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
              <div className="font-extrabold text-sm text-white truncate">Headless CMS</div>
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

        {/* Nav Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden text-xs font-semibold custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

          {/* Cross-Portal Access for Admins */}
          <div className={`pt-3 mt-2 border-t border-campus-900/80 ${isCollapsed ? 'md:px-0' : 'px-1'}`}>
            <div className={`px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-campus-300 ${isCollapsed ? 'md:hidden' : 'block'}`}>
              Role Portals
            </div>
            <div className="space-y-1">
              <Link
                href="/teacher"
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? "Teacher Academic Portal" : undefined}
                className="flex items-center px-3.5 py-2.5 rounded-xl text-campus-200 hover:text-white hover:bg-campus-900 transition-colors text-xs font-semibold group"
              >
                <Briefcase className="w-4 h-4 shrink-0 text-blue-400 group-hover:scale-105 transition-transform" />
                <span className={`ml-3 transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto block'}`}>
                  Teacher Portal
                </span>
              </Link>
              <Link
                href="/student"
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? "Student Learning Portal" : undefined}
                className="flex items-center px-3.5 py-2.5 rounded-xl text-campus-200 hover:text-white hover:bg-campus-900 transition-colors text-xs font-semibold group"
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-emerald-400 group-hover:scale-105 transition-transform" />
                <span className={`ml-3 transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto block'}`}>
                  Student Portal
                </span>
              </Link>
            </div>
          </div>
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
              <Link 
                href="/teacher" 
                onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-blue-300 hover:bg-blue-950/40 hover:text-white rounded-lg transition-colors"
              >
                <Briefcase className="w-4 h-4 shrink-0 text-blue-400" />
                Teacher Portal
              </Link>
              <Link 
                href="/student" 
                onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-950/40 hover:text-white rounded-lg transition-colors"
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-emerald-400" />
                Student Portal
              </Link>
              <div className="border-t border-campus-800 my-1" />
              <Link 
                href="/settings/profile" 
                onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-campus-100 hover:bg-campus-800 hover:text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Profile Settings
              </Link>
              <Link 
                href="/admin/settings" 
                onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-campus-100 hover:bg-campus-800 hover:text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Site Settings
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
