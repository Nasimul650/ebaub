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
      className="absolute top-full right-0 mt-2 min-w-max w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl py-3 text-xs font-medium z-50 animate-dropdown"
      onClick={onClose}
    >
      <div className="px-4 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
        Access Digital Workspace
      </div>
      <Link 
        href="/admin" 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-800 font-medium transition-all hover:translate-x-1"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-slate-900">Headless CMS</div>
          <div className="text-[10px] text-slate-500">Administrative Portal</div>
        </div>
      </Link>
      
      <Link 
        href="/teacher" 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-800 font-medium transition-all hover:translate-x-1"
      >
        <div className="w-8 h-8 rounded-lg bg-campus-50 flex items-center justify-center text-campus-700 border border-campus-200/60 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-slate-900">Teacher Tools + AI</div>
          <div className="text-[10px] text-slate-500">Faculty Management</div>
        </div>
      </Link>
      
      <Link 
        href="/student" 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-800 font-medium transition-all hover:translate-x-1"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/60 shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-slate-900">Student Study Hub</div>
          <div className="text-[10px] text-slate-500">Materials & AI Tutor</div>
        </div>
      </Link>
    </div>
  );
}
