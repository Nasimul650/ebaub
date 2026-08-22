'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  LayoutDashboard, 
  BookOpenCheck, 
  GraduationCap, 
  Bot, 
  LogOut 
} from 'lucide-react';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { label: 'AI Quiz Generator', href: '/teacher/ai', icon: Sparkles },
    { label: 'Course Materials', href: '/teacher/materials', icon: BookOpenCheck },
    { label: 'Teaching Overview', href: '/teacher/teaching', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Teacher Hub</div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase">EBAUB Faculty</div>
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
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
              T
            </div>
            <div>
              <div className="font-bold text-white">Sabrina Chowdhury</div>
              <div className="text-[10px] text-slate-400">Assistant Professor, CSE</div>
            </div>
          </div>
          <Link href="/" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>

    </div>
  );
}
