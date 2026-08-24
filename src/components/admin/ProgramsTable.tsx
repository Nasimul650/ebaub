import React from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { ProgramItem } from '@/utils/supabase/queries';

export interface ProgramsTableProps {
  programs: ProgramItem[];
}

export default function ProgramsTable({ programs }: ProgramsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4 w-[35%]">Program Name</th>
              <th className="p-4 w-[25%]">Faculty / Department</th>
              <th className="p-4 w-[15%]">Degree Level</th>
              <th className="p-4 w-[15%]">Duration</th>
              <th className="p-4 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {programs.map(p => (
              <tr key={p.id} className="hover:bg-campus-50/80 transition-colors">
                <td className="p-4 font-extrabold text-slate-900">{p.name}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{p.departments?.name}</span>
                    <span className="text-[10px] text-slate-400">{p.departments?.faculties?.name}</span>
                  </div>
                </td>
                <td className="p-4 text-purple-700 font-bold">{p.degree_level}</td>
                <td className="p-4 text-slate-500">{p.duration_years} Years</td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/admin/programs/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-campus-100 text-slate-600 hover:text-campus-800 font-bold rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            
            {programs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                  No programs found. Click "Add Program" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
