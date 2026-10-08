'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Users, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Building2,
  Calendar,
  Mail,
  Hash,
  X
} from 'lucide-react';
import type { UserProfileItem } from '@/utils/supabase/queries';

interface UserAccountsTableProps {
  initialProfiles: UserProfileItem[];
}

export default function UserAccountsTable({ initialProfiles }: UserAccountsTableProps) {
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Stats counters
  const stats = useMemo(() => {
    let teachers = 0;
    let students = 0;
    let admins = 0;

    initialProfiles.forEach((p) => {
      const r = (p.role || '').toUpperCase();
      if (r === 'TEACHER') teachers++;
      else if (r === 'STUDENT') students++;
      else if (r === 'ADMIN') admins++;
    });

    return {
      total: initialProfiles.length,
      teachers,
      students,
      admins,
    };
  }, [initialProfiles]);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((p) => {
      const matchesRole = roleFilter === 'ALL' || (p.role || '').toUpperCase() === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesRole;

      const matchesName = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`).toLowerCase().includes(q);
      const matchesEmail = (p.email || '').toLowerCase().includes(q);
      const matchesId = (p.institutional_id || '').toLowerCase().includes(q);
      const matchesDept = (p.department?.name || '').toLowerCase().includes(q);

      return matchesRole && (matchesName || matchesEmail || matchesId || matchesDept);
    });
  }, [initialProfiles, roleFilter, searchQuery]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const getRoleBadge = (role: string) => {
    const r = (role || '').toUpperCase();
    if (r === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3 h-3" />
          <span>Admin</span>
        </span>
      );
    }
    if (r === 'TEACHER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Briefcase className="w-3 h-3" />
          <span>Teacher</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-campus-50 text-campus-800 border border-campus-200">
        <GraduationCap className="w-3 h-3" />
        <span>Student</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>Teachers</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.teachers}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-campus-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span>Students</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.students}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-purple-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Admins</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.admins}</div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: `All Users (${stats.total})` },
            { id: 'TEACHER', label: `Teachers (${stats.teachers})` },
            { id: 'STUDENT', label: `Students (${stats.students})` },
            { id: 'ADMIN', label: `Admins (${stats.admins})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === tab.id
                  ? 'bg-campus-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Create Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-campus-700 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Link
            href="/admin/users/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4 text-campus-300" />
            <span>Provision New User</span>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead className="bg-campus-50/80 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-[35%]">User & Contact</th>
                <th className="p-4 w-[18%]">Institutional ID</th>
                <th className="p-4 w-[15%]">Role</th>
                <th className="p-4 w-[20%]">Department</th>
                <th className="p-4 w-[12%] text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProfiles.map((p) => {
                const displayName = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'University Member';
                const initial = displayName.charAt(0).toUpperCase();

                return (
                  <tr key={p.id} className="hover:bg-campus-50/50 transition-colors group">
                    {/* User & Contact */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-slate-700 text-xs shrink-0 group-hover:bg-white group-hover:border-campus-300 transition-colors">
                          {initial}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-extrabold text-slate-900 group-hover:text-campus-900 transition-colors truncate max-w-[240px]">
                            {displayName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[240px]" title={p.email}>
                            {p.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Institutional ID */}
                    <td className="p-4">
                      {p.institutional_id ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-[11px] border border-slate-200">
                          {p.institutional_id}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      {getRoleBadge(p.role)}
                    </td>

                    {/* Department */}
                    <td className="p-4">
                      {p.department?.name ? (
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-campus-700 shrink-0" />
                          <span className="truncate max-w-[200px]" title={p.department.name}>
                            {p.department.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">General / Unassigned</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-right text-slate-500 font-medium">
                      {formatDate(p.created_at)}
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-1">
                        No user accounts found
                      </div>
                      <p className="text-xs text-slate-400">
                        {searchQuery || roleFilter !== 'ALL'
                          ? 'No university members match your selected role filter or search keyword.'
                          : 'No university credentials have been provisioned yet.'}
                      </p>
                      <Link
                        href="/admin/users/create"
                        className="mt-2 text-xs font-bold text-campus-800 hover:underline"
                      >
                        + Provision your first user account
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
