'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  FolderDown, 
  Bot, 
  Bell, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Study Hub', href: '/student/study', icon: BookOpen },
    { label: 'Course Files', href: '/student/files', icon: FolderDown },
    { label: 'AI Study Assistant', href: '/student/ai', icon: Bot },
    { label: 'Student Notices', href: '/student/notices', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Student Hub</div>
              <div className="text-[10px] text-sky-400 font-semibold uppercase">EBAUB Campus</div>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
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
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile strip */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 font-bold text-xs">
              S
            </div>
            <div>
              <div className="font-bold text-white">CSE Student</div>
              <div className="text-[10px] text-slate-400">B.Sc. CSE Year 2</div>
            </div>
          </div>
          <Link href="/" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>

    </div>
  );
}
