'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { Building2, Loader2, Plus, Trash2, LibraryBig } from 'lucide-react';
import { FacultyHierarchy } from '@/utils/supabase/queries';
import { createAcademicFaculty, createAcademicDepartment, deleteAcademicFaculty, deleteAcademicDepartment } from '@/app/actions/cms';
import { useRouter } from 'next/navigation';

export function AddFacultyForm() {
  const [state, formAction, isPending] = useActionState(createAcademicFaculty, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById('faculty-form') as HTMLFormElement;
      if (form) form.reset();
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form id="faculty-form" action={formAction} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
      <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
        <LibraryBig className="w-4 h-4 text-campus-700" /> Add New Faculty
      </h3>
      
      {state?.error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{state.error}</p>}
      {state?.success && <p className="text-xs text-green-700 bg-green-50 p-2 rounded-lg">{state.message}</p>}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name *</label>
          <input 
            type="text" 
            name="name" 
            required
            placeholder="e.g. Faculty of Law"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-2 focus:ring-campus-600/10 outline-none"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
          <input 
            type="text" 
            name="description" 
            placeholder="Brief description..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-2 focus:ring-campus-600/10 outline-none"
            disabled={isPending}
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-campus-800 hover:bg-campus-900 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Faculty
        </button>
      </div>
    </form>
  );
}

export function AddDepartmentForm({ hierarchy }: { hierarchy: FacultyHierarchy[] }) {
  const [state, formAction, isPending] = useActionState(createAcademicDepartment, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById('department-form') as HTMLFormElement;
      if (form) form.reset();
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form id="department-form" action={formAction} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
      <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-campus-700" /> Add New Department
      </h3>

      {state?.error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{state.error}</p>}
      {state?.success && <p className="text-xs text-green-700 bg-green-50 p-2 rounded-lg">{state.message}</p>}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Parent Faculty *</label>
          <select 
            name="faculty_id" 
            required
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-2 focus:ring-campus-600/10 outline-none bg-white"
            disabled={isPending}
          >
            <option value="">-- Select Faculty --</option>
            {hierarchy.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
          <input 
            type="text" 
            name="name" 
            required
            placeholder="e.g. Department of Civil Law"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-2 focus:ring-campus-600/10 outline-none"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
          <input 
            type="text" 
            name="description" 
            placeholder="Brief description..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-2 focus:ring-campus-600/10 outline-none"
            disabled={isPending}
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending || hierarchy.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-campus-800 hover:bg-campus-900 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Department
        </button>
      </div>
    </form>
  );
}

export function DeleteButton({ id, type }: { id: string, type: 'faculty' | 'department' }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    if (type === 'faculty') {
      await deleteAcademicFaculty(id);
    } else {
      await deleteAcademicDepartment(id);
    }
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title={`Delete ${type}`}
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
