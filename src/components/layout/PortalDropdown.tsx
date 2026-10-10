'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Bell, 
  Settings, 
  Calendar, 
  Bot, 
  Loader2,
  ArrowRight,
  ExternalLink,
  Hash
} from 'lucide-react';
import type { CurrentUser } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface PortalDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user?: CurrentUser | null;
}

export default function PortalDropdown({
  isOpen,
  onClose,
  user = null,
}: PortalDropdownProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatarUrl]);

  if (!isOpen) return null;

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      onClose();
      window.location.href = '/';
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/';
    }
  };

  // -------------------------------------------------------------
  // GUEST / LOGGED-OUT VIEW (Matches public design)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div
        className="absolute top-full right-0 mt-2 min-w-max w-72 rounded-3xl bg-white border border-slate-200/90 shadow-2xl py-3 text-xs font-medium z-50 animate-dropdown overflow-hidden"
        onClick={onClose}
      >
        <div className="px-4 py-2 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
          Access Digital Workspace
        </div>

        {/* Student Login */}
        <Link
          href="/student"
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-900 font-medium transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/70 shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Student Login
            </div>
            <div className="text-[10px] text-slate-500">Materials & AI Tutor</div>
          </div>
        </Link>

        {/* Teacher Login */}
        <Link
          href="/teacher"
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-900 font-medium transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-campus-50 flex items-center justify-center text-campus-700 border border-campus-200/70 shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 group-hover:text-campus-900 transition-colors">
              Teacher Login
            </div>
            <div className="text-[10px] text-slate-500">Faculty Management</div>
          </div>
        </Link>

        {/* Admin Login */}
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-campus-900 font-medium transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/70 shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Admin Login
            </div>
            <div className="text-[10px] text-slate-500">Administrative Portal</div>
          </div>
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED / LOGGED-IN VIEW (Tailored to Role)
  // -------------------------------------------------------------
  const role = user.role;
  const initial = (user.fullName || user.email || 'U').charAt(0).toUpperCase();

  const getRoleHeaderDetails = () => {
    if (role === 'ADMIN') {
      return {
        badgeText: 'System Administrator',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        avatarBg: 'bg-purple-600 text-white',
        dashboardUrl: '/admin',
        dashboardTitle: 'Admin Control Center',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />,
      };
    }
    if (role === 'TEACHER') {
      return {
        badgeText: 'Faculty Instructor',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        avatarBg: 'bg-blue-600 text-white',
        dashboardUrl: '/teacher',
        dashboardTitle: 'Teacher Academic Dashboard',
        icon: <Briefcase className="w-3.5 h-3.5 text-blue-700" />,
      };
    }
    return {
      badgeText: 'Enrolled Student',
      badgeClass: 'bg-campus-100 text-campus-900 border-campus-200',
      avatarBg: 'bg-campus-900 text-white',
      dashboardUrl: '/student',
      dashboardTitle: 'Student Learning Dashboard',
      icon: <GraduationCap className="w-3.5 h-3.5 text-campus-800" />,
    };
  };

  const headerInfo = getRoleHeaderDetails();

  return (
    <div
      className="absolute top-full right-0 mt-2 w-80 rounded-3xl bg-white border border-slate-200/90 shadow-2xl py-2 text-xs font-medium z-50 animate-dropdown overflow-hidden"
      onClick={onClose}
    >
      {/* User Header Profile Card */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl ${headerInfo.avatarBg} flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 overflow-hidden`}>
            {user.avatarUrl && !imgError ? (
              <img 
                src={user.avatarUrl} 
                alt={user.fullName} 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              initial
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="font-extrabold text-slate-900 text-sm truncate">
              {user.fullName}
            </div>
            <div className="text-[11px] text-slate-500 truncate" title={user.email}>
              {user.email}
            </div>
          </div>
        </div>

        {/* Role & ID Badges */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${headerInfo.badgeClass}`}>
            {headerInfo.icon}
            <span>{headerInfo.badgeText}</span>
          </span>

          {user.role === 'STUDENT' && user.batch && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              <span>{user.batch}</span>
            </span>
          )}

          {user.institutionalId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
              <Hash className="w-2.5 h-2.5 text-slate-400" />
              <span>{user.institutionalId}</span>
            </span>
          )}
        </div>
      </div>

      {/* Primary Dashboard Link Banner */}
      <div className="p-2 border-b border-slate-100">
        <Link
          href={headerInfo.dashboardUrl}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white font-bold transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-campus-300" />
            <span className="text-xs">{headerInfo.dashboardTitle}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-campus-300 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Role-Specific Quick Workspace Links */}
      <div className="py-2">
        <div className="px-4 py-1.5 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
          Quick Workspace Tools
        </div>

        {/* 1. ADMIN OPTIONS */}
        {role === 'ADMIN' && (
          <div className="space-y-0.5">
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 hover:text-purple-950 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-900">Manage User Accounts</div>
                <div className="text-[10px] text-slate-400">Teachers, Students & Credentials</div>
              </div>
            </Link>

            <Link
              href="/admin/structure"
              className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 hover:text-purple-950 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-900">Academic Structure</div>
                <div className="text-[10px] text-slate-400">Faculties & Departments</div>
              </div>
            </Link>

            <Link
              href="/admin/notices"
              className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 hover:text-purple-950 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-900">Notices & Bulletins</div>
                <div className="text-[10px] text-slate-400">Publish Campus Announcements</div>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 hover:text-purple-950 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-900">Site Settings</div>
                <div className="text-[10px] text-slate-400">Portal & Content Configurations</div>
              </div>
            </Link>

            {/* Admin Cross-Portal Access */}
            <div className="pt-2 mt-1 border-t border-slate-100">
              <div className="px-4 py-1 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                Cross-Portal Access
              </div>
              <Link
                href="/teacher"
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors group"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-blue-900">Teacher Portal</div>
                  <div className="text-[10px] text-slate-400">Materials, Routine & AI Quizzes</div>
                </div>
              </Link>
              <Link
                href="/student"
                className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-950 transition-colors group"
              >
                <div className="w-7 h-7 rounded-xl bg-campus-100/70 text-campus-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-campus-900">Student Portal</div>
                  <div className="text-[10px] text-slate-400">Materials & AI Tutor</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 2. TEACHER OPTIONS */}
        {role === 'TEACHER' && (
          <div className="space-y-0.5">
            <Link
              href="/teacher/materials"
              className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-900 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-blue-900">Course Materials & Repo</div>
                <div className="text-[10px] text-slate-400">Upload & Explore University Files</div>
              </div>
            </Link>

            <Link
              href="/teacher/ai"
              className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-900 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-campus-100/70 text-campus-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-campus-900">AI Teaching Assistant</div>
                <div className="text-[10px] text-slate-400">Generate Quizzes & Lesson Plans</div>
              </div>
            </Link>

            <Link
              href="/teacher/teaching"
              className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-900 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-amber-900">Teaching Routine & Schedule</div>
                <div className="text-[10px] text-slate-400">Syllabus & Assigned Classes</div>
              </div>
            </Link>
          </div>
        )}

        {/* 3. STUDENT OPTIONS */}
        {role === 'STUDENT' && (
          <div className="space-y-0.5">
            <Link
              href="/student/materials"
              className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-900 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-blue-900">Course Materials</div>
                <div className="text-[10px] text-slate-400">Download Lecture Slides & Notes</div>
              </div>
            </Link>

            <Link
              href="/student/study"
              className="flex items-center gap-3 px-4 py-2 hover:bg-campus-50 text-slate-700 hover:text-campus-900 transition-colors group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-900">AI Study Companion</div>
                <div className="text-[10px] text-slate-400">Interactive 24/7 AI Tutor</div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Account Settings Link */}
      <div className="pt-1 border-t border-slate-100 px-2">
        <Link
          href="/settings/profile"
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-campus-900 hover:bg-slate-50 text-xs font-bold transition-colors group"
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-campus-700 transition-colors" />
          <span>Profile & Account Settings</span>
        </Link>
      </div>

      {/* Sign Out Action Button */}
      <div className="pt-1 px-2 pb-1">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-colors group disabled:opacity-50"
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-600" />
          ) : (
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
          )}
          <span>{isSigningOut ? 'Signing out...' : 'Sign Out of Account'}</span>
        </button>
      </div>
    </div>
  );
}
