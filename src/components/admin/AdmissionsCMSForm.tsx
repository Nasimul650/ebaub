'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { FacultyHierarchy } from '@/utils/supabase/queries';
import { upsertAdmissionInfo } from '@/app/actions/cms';
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdmissionsCMSForm({ faculties }: { faculties: FacultyHierarchy[] }) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(faculties[0]?.id || '');
  const [state, formAction, isPending] = useActionState(upsertAdmissionInfo, null);
  
  const selectedFaculty = faculties.find(f => f.id === selectedFacultyId);
  const admissionsInfo = selectedFaculty?.admissions_info;

  const [formData, setFormData] = useState({
    requirements: '',
    process_steps: '',
    important_dates: ''
  });

  useEffect(() => {
    if (admissionsInfo) {
      setFormData({
        requirements: admissionsInfo.requirements || '',
        process_steps: admissionsInfo.process_steps || '',
        important_dates: admissionsInfo.important_dates || ''
      });
    } else {
      setFormData({ requirements: '', process_steps: '', important_dates: '' });
    }
  }, [admissionsInfo, selectedFacultyId]);

  return (
    <div className="space-y-8">
      {state?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="text-sm font-semibold">{state.message}</p>
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm font-semibold">{state.error}</p>
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Select Faculty</label>
        <select
          value={selectedFacultyId}
          onChange={(e) => setSelectedFacultyId(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500"
        >
          {faculties.map(faculty => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name} {faculty.admissions_info ? '(Has Data)' : '(Empty)'}
            </option>
          ))}
        </select>
      </div>

      {selectedFacultyId && (
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="faculty_id" value={selectedFacultyId} />

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Requirements</label>
            <textarea
              name="requirements"
              rows={5}
              value={formData.requirements}
              onChange={e => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Enter academic eligibility and requirements..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500"
            />
            <p className="text-xs text-slate-500">Use standard text or markdown-style lists.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Application Process</label>
            <textarea
              name="process_steps"
              rows={5}
              value={formData.process_steps}
              onChange={e => setFormData(prev => ({ ...prev, process_steps: e.target.value }))}
              placeholder="Step 1: ...&#10;Step 2: ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Important Dates</label>
            <textarea
              name="important_dates"
              rows={5}
              value={formData.important_dates}
              onChange={e => setFormData(prev => ({ ...prev, important_dates: e.target.value }))}
              placeholder="Applications Open: Oct 1&#10;Deadline: Dec 15"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 bg-campus-900 hover:bg-campus-800 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-70"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isPending ? 'Saving...' : 'Save Admissions Data'}
          </button>
        </form>
      )}
    </div>
  );
}
