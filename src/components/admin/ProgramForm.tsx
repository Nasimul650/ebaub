'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { FacultyHierarchy, AcademicDepartment } from '@/utils/supabase/queries';

export default function ProgramForm({ 
  action, 
  initialData, 
  hierarchy = [] 
}: { 
  action: any, 
  initialData?: any,
  hierarchy?: FacultyHierarchy[]
}) {
  const router = useRouter();
  
  // Dependent dropdown state
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(
    initialData?.departments?.faculty_id || ''
  );
  
  const [availableDepartments, setAvailableDepartments] = useState<AcademicDepartment[]>([]);

  useEffect(() => {
    if (selectedFacultyId && hierarchy.length > 0) {
      const faculty = hierarchy.find(f => f.id === selectedFacultyId);
      setAvailableDepartments(faculty?.departments || []);
    } else {
      setAvailableDepartments([]);
    }
  }, [selectedFacultyId, hierarchy]);

  const [state, formAction, isPending] = useActionState<{ error?: string, success?: boolean, message?: string } | null, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/programs');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
      <form action={formAction} className="p-6 sm:p-8 space-y-6">
        
        {state?.error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-bold">
            {state.message} Redirecting...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-slate-700">Program Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={initialData?.name}
                required
                placeholder="e.g. B.Sc. in Computer Science"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="degree_level" className="block text-sm font-bold text-slate-700">Degree Level *</label>
                <select 
                  id="degree_level" 
                  name="degree_level"
                  required
                  defaultValue={initialData?.degree_level || ''}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
                  disabled={isPending || state?.success}
                >
                  <option value="">Select Level</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="duration_years" className="block text-sm font-bold text-slate-700">Duration (Years)</label>
                <input 
                  type="number" 
                  id="duration_years" 
                  name="duration_years"
                  defaultValue={initialData?.duration_years || 4}
                  min={1} max={10}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                  disabled={isPending || state?.success}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="faculty" className="block text-sm font-bold text-slate-700">Faculty</label>
              <select 
                id="faculty" 
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white"
                disabled={isPending || state?.success || hierarchy.length === 0}
              >
                <option value="">-- Select Faculty --</option>
                {hierarchy.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department_id" className="block text-sm font-bold text-slate-700">Department *</label>
              <select 
                id="department_id" 
                name="department_id"
                required
                defaultValue={initialData?.department_id || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                disabled={!selectedFacultyId || availableDepartments.length === 0 || isPending || state?.success}
              >
                <option value="">-- Select Department --</option>
                {availableDepartments.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </select>
              {!selectedFacultyId && <p className="text-xs text-slate-500">Select a faculty first to see departments.</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 h-full flex flex-col">
              <label htmlFor="description" className="block text-sm font-bold text-slate-700">Program Description</label>
              <textarea 
                id="description" 
                name="description" 
                defaultValue={initialData?.description}
                rows={12}
                placeholder="Detailed information about the academic program, admission criteria, and syllabus highlights..."
                className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
                disabled={isPending || state?.success}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending || state?.success}
            className="flex items-center gap-2 px-6 py-3 bg-campus-800 hover:bg-campus-900 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> {initialData ? 'Update Program' : 'Create Program'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
