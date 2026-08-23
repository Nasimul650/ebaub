'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { FacultyHierarchy, AcademicDepartment } from '@/utils/supabase/queries';

export default function FacultyForm({ 
  action, 
  initialData, 
  hierarchy = [] 
}: { 
  action: any, 
  initialData?: any,
  hierarchy?: FacultyHierarchy[]
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '');
  
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
        router.push('/admin/faculty');
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
              <label htmlFor="name" className="block text-sm font-bold text-slate-700">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={initialData?.name}
                required
                placeholder="e.g. Dr. Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-slate-700">Academic Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="title" 
                name="title"
                required
                placeholder="e.g. Professor of Computer Science"
                defaultValue={initialData?.title}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900"
                disabled={isPending || state?.success}
              />
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
              <label htmlFor="department_id" className="block text-sm font-bold text-slate-700">Department</label>
              <select 
                id="department_id" 
                name="department_id"
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
              <label htmlFor="bio" className="block text-sm font-bold text-slate-700">Biography</label>
              <textarea 
                id="bio" 
                name="bio" 
                defaultValue={initialData?.bio}
                rows={11}
                placeholder="Brief professional biography..."
                className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-campus-600 focus:ring-4 focus:ring-campus-600/10 outline-none transition-all text-slate-900 resize-y"
                disabled={isPending || state?.success}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <input type="hidden" name="image_url" value={imageUrl || ''} />
          
          <label className="block text-sm font-bold text-slate-700">Profile Photo</label>
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 shrink-0 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <UserPlus className="w-10 h-10 text-slate-300" />
              )}
            </div>
            
            <div className="flex-1 max-w-sm">
              <FileUpload 
                bucket="public_media" 
                accept="image/*"
                onUploadSuccess={setImageUrl}
              />
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
              <><UserPlus className="w-5 h-5" /> {initialData ? 'Update Profile' : 'Add Faculty Member'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
