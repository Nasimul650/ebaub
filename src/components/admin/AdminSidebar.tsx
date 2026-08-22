'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Bell, 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Image as ImageIcon, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'CMS Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Notices CMS', href: '/admin/notices', icon: Bell },
    { label: 'News CMS', href: '/admin/news', icon: Newspaper },
    { label: 'Events CMS', href: '/admin/events', icon: Calendar },
    { label: 'Programs CMS', href: '/admin/programs', icon: BookOpen },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ];

  return (
    <aside className="w-full md:w-64 bg-campus-900 text-campus-100 flex flex-col shrink-0">
      
      {/* Header Logo */}
      <div className="p-6 border-b border-campus-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-campus-400 flex items-center justify-center text-slate-950 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-campus-100">Headless CMS</div>
            <div className="text-[10px] text-campus-300 font-bold uppercase">EBAUB Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="p-4 space-y-1.5 flex-1 text-xs font-semibold">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-campus-800 text-campus-100 font-bold border border-campus-700 shadow-2xs'
                  : 'text-campus-200 hover:bg-campus-800 hover:text-campus-100'
              }`}
            >
              <Icon className="w-4 h-4 text-campus-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-campus-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-campus-800 text-campus-900 font-extrabold flex items-center justify-center text-xs">
            A
          </div>
          <div>
            <div className="font-bold text-campus-100">CMS Admin</div>
            <div className="text-[10px] text-campus-300">Content Manager</div>
          </div>
        </div>
        <Link href="/" className="p-2 rounded-lg hover:bg-campus-800 text-campus-400 hover:text-campus-100">
          <LogOut className="w-4 h-4" />
        </Link>
      </div>

    </aside>
  );
}
