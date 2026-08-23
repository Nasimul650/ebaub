import React from 'react';
import { Building2, FolderTree, ArrowRight } from 'lucide-react';
import { getFacultiesWithDepartments } from '@/utils/supabase/queries';
import { AddFacultyForm, AddDepartmentForm, DeleteButton } from '@/components/admin/AcademicStructureForms';

export default async function AcademicStructurePage() {
  const hierarchy = await getFacultiesWithDepartments();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-emerald-700" /> Academic Structure
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage the university's Faculties and their respective Departments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Existing Structure */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" /> Current Hierarchy
            </h2>
            
            {hierarchy.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No faculties exist yet.</p>
                <p className="text-slate-400 mt-1">Use the forms on the right to create your academic structure.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {hierarchy.map(faculty => (
                  <div key={faculty.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 relative group">
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteButton id={faculty.id} type="faculty" />
                    </div>
                    
                    <h3 className="text-base font-extrabold text-campus-900 mb-1 pr-10">{faculty.name}</h3>
                    {faculty.description && (
                      <p className="text-slate-500 text-[11px] mb-4 pr-10">{faculty.description}</p>
                    )}
                    
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-campus-200">
                      {faculty.departments?.length > 0 ? (
                        faculty.departments.map(dept => (
                          <div key={dept.id} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm group/dept">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-3 h-3 text-slate-300" />
                              <span className="font-bold text-slate-700">{dept.name}</span>
                            </div>
                            <div className="opacity-0 group-hover/dept:opacity-100 transition-opacity">
                              <DeleteButton id={dept.id} type="department" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 italic text-[11px] py-2">No departments assigned yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Creation Forms */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <AddFacultyForm />
          <AddDepartmentForm hierarchy={hierarchy} />
        </div>
      </div>
    </div>
  );
}
