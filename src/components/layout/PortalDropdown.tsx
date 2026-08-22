'use client';

import Link from 'next/link';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface PortalDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PortalDropdown({ isOpen, onClose }: PortalDropdownProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 text-xs font-medium z-50 animate-in fade-in"
      onClick={onClose}
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
  );
}
