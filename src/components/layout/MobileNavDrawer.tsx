'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Bot, 
  Bell, 
  LogOut, 
  Users, 
  Building2, 
  Settings,
  Calendar,
  Loader2
} from 'lucide-react';
import type { CurrentUser } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  faculties?: any[];
  programs?: any[];
  user?: CurrentUser | null;
}

export default function MobileNavDrawer({ 
  isOpen, 
  onClose, 
  faculties = [], 
  programs = [],
  user = null
}: MobileNavDrawerProps) {
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      if (onClose) onClose();
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

  const initial = (user?.fullName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="lg:hidden bg-campus-50 border-b border-campus-200 px-4 py-4 space-y-3 text-sm font-semibold max-h-[80vh] overflow-y-auto">
      {/* ------------------------------------------------------------- */}
      {/* USER PROFILE CARD & ROLE WORKSPACE (IF LOGGED IN)             */}
      {/* ------------------------------------------------------------- */}
      {user ? (
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 mb-2">
          {/* User Header */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
              user.role === 'ADMIN' ? 'bg-purple-600 text-white' : 
              user.role === 'TEACHER' ? 'bg-blue-600 text-white' : 'bg-campus-900 text-white'
            }`}>
              {initial}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="font-extrabold text-slate-900 text-xs truncate">
                {user.fullName}
              </div>
              <div className="text-[10px] text-slate-500 truncate" title={user.email}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Role Pill */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' :
              user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              'bg-campus-100 text-campus-900 border-campus-200'
            }`}>
              {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> :
               user.role === 'TEACHER' ? <Briefcase className="w-3 h-3" /> :
               <GraduationCap className="w-3 h-3" />}
              <span>
                {user.role === 'ADMIN' ? 'Administrator' : 
                 user.role === 'TEACHER' ? 'Teacher / Faculty' : 'Student'}
              </span>
            </span>
            {user.institutionalId && (
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                ID: {user.institutionalId}
              </span>
            )}
          </div>

          {/* Direct Dashboard Button */}
          <Link
            href={user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/student'}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-campus-900 hover:bg-campus-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-campus-300" />
            <span>Open {user.role === 'ADMIN' ? 'Admin' : user.role === 'TEACHER' ? 'Teacher' : 'Student'} Dashboard</span>
          </Link>

          {/* Role Links */}
          <div className="pt-1 border-t border-slate-100 space-y-1 text-xs">
            {user.role === 'ADMIN' && (
              <>
                <Link href="/admin/users" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-purple-900">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Manage User Accounts</span>
                </Link>
                <Link href="/admin/structure" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-purple-900">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Academic Structure</span>
                </Link>
                <Link href="/admin/settings" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-purple-900">
                  <Settings className="w-3.5 h-3.5 text-purple-600" />
                  <span>Site Settings</span>
                </Link>
              </>
            )}

            {user.role === 'TEACHER' && (
              <>
                <Link href="/teacher/materials" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Course Materials & Repository</span>
                </Link>
                <Link href="/teacher/ai" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <Sparkles className="w-3.5 h-3.5 text-campus-700" />
                  <span>AI Assistant & Quizzes</span>
                </Link>
                <Link href="/teacher/teaching" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>Teaching Schedule</span>
                </Link>
              </>
            )}

            {user.role === 'STUDENT' && (
              <>
                <Link href="/student/materials" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Course Materials</span>
                </Link>
                <Link href="/student/study" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Study Companion</span>
                </Link>
                <Link href="/student/notices" onClick={onClose} className="flex items-center gap-2 py-1.5 text-slate-700 hover:text-campus-900">
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Notice Board</span>
                </Link>
              </>
            )}

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2 py-1.5 w-full text-left text-red-600 hover:text-red-700 pt-2 border-t border-slate-100 font-bold"
            >
              {isSigningOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* GUEST LOGIN BUTTONS */
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5 mb-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-1">
            Access Portals
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <Link
              href="/student"
              onClick={onClose}
              className="py-2 px-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100"
            >
              Student
            </Link>
            <Link
              href="/teacher"
              onClick={onClose}
              className="py-2 px-1 rounded-xl bg-campus-50 text-campus-800 border border-campus-200 font-bold hover:bg-campus-100"
            >
              Teacher
            </Link>
            <Link
              href="/admin"
              onClick={onClose}
              className="py-2 px-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold hover:bg-amber-100"
            >
              Admin
            </Link>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STANDARD NAVIGATION LINKS                                     */}
      {/* ------------------------------------------------------------- */}
      <Link href="/about" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">About EBAUB</Link>
      
      {/* Academics Accordion */}
      <div>
        <button 
          onClick={() => setAcademicsOpen(!academicsOpen)}
          className="w-full flex items-center justify-between py-2 text-slate-700 hover:text-campus-800"
        >
          <span>Academics & Programs</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${academicsOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {academicsOpen && (
          <div className="pl-4 pr-2 py-2 space-y-4 border-l-2 border-campus-200 ml-2 mt-1">
            {faculties.map((faculty) => (
              <div key={faculty.id} className="space-y-2">
                <Link 
                  href={`/academics/${faculty.slug}`}
                  onClick={onClose} 
                  className="font-bold text-campus-900 block"
                >
                  {faculty.name}
                </Link>
                {programs.filter(p => p.faculty_id === faculty.id).length > 0 && (
                  <ul className="space-y-2 pl-2">
                    {programs.filter(p => p.faculty_id === faculty.id).map(program => (
                      <li key={program.id}>
                        <Link 
                          href={`/academics/${faculty.slug}#${program.slug}`}
                          onClick={onClose}
                          className="text-xs text-slate-600 hover:text-campus-700 flex items-center gap-1.5"
                        >
                          <GraduationCap className="w-3 h-3 text-campus-400" />
                          {program.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/admissions" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Admissions</Link>
      <Link href="/faculty" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Faculty Directory</Link>
      <Link href="/notices" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Notices</Link>
      <Link href="/news" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">News & Achievements</Link>
      <Link href="/events" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Events</Link>
      <Link href="/contact" onClick={onClose} className="block py-2 text-slate-700 hover:text-campus-800">Contact</Link>
    </div>
  );
}
