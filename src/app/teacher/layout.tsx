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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900">Teacher Hub</div>
              <div className="text-[10px] text-emerald-800 font-bold uppercase">EBAUB Faculty</div>
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
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-700" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
              T
            </div>
            <div>
              <div className="font-bold text-slate-900">Sabrina Chowdhury</div>
              <div className="text-[10px] text-slate-500">Assistant Professor, CSE</div>
            </div>
          </div>
          <Link href="/" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
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
