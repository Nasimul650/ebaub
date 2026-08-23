import React from 'react';
import Link from 'next/link';
import { User, Plus, Database } from 'lucide-react';
import { getAllFaculty, getFacultiesWithDepartments } from '@/utils/supabase/queries';
import { seedAcademicData } from '@/app/actions/cms';
import { revalidatePath } from 'next/cache';

export default async function AdminFacultyPage() {
  const facultyList = await getAllFaculty(100);
  const hierarchy = await getFacultiesWithDepartments();

  // Temporary action wrapper for the seed button
  async function handleSeed() {
    'use server';
    await seedAcademicData();
    revalidatePath('/admin/faculty');
    revalidatePath('/admin/faculty/create');
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
            <User className="w-6 h-6 text-campus-800" /> Faculty CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage academic staff and faculty directories</p>
        </div>
        <div className="flex items-center gap-3">
          {hierarchy.length === 0 && (
            <form action={handleSeed}>
              <button 
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
              >
                <Database className="w-4 h-4" />
                Seed Departments
              </button>
            </form>
          )}
          <Link 
            href="/admin/faculty/create"
            className="flex items-center gap-2 px-4 py-2 bg-campus-800 hover:bg-campus-900 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Faculty Member
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
          Faculty Roster ({facultyList.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Title</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {facultyList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No faculty members found. Click "Add Faculty Member" to add one.
                  </td>
                </tr>
              ) : (
                facultyList.map(item => (
                  <tr key={item.id} className="hover:bg-campus-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      {item.name}
                    </td>
                    <td className="p-4 text-slate-500 font-semibold">{item.title}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link
                        href={`/admin/faculty/${item.id}/edit`}
                        className="p-1.5 rounded bg-campus-50 text-campus-700 hover:bg-campus-100 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
