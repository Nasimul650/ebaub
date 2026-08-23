import React from 'react';
import { Program } from '@/types';

export interface ProgramsTableProps {
  programs: Program[];
}

export default function ProgramsTable({ programs }: ProgramsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs shadow-xs">
      <table className="w-full text-left">
        <thead className="bg-campus-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
          <tr>
            <th className="p-4">Program Title</th>
            <th className="p-4">Code</th>
            <th className="p-4">Level</th>
            <th className="p-4">Credits</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {programs.map(p => (
            <tr key={p.id} className="hover:bg-campus-50/80">
              <td className="p-4 font-bold text-slate-900">{p.title}</td>
              <td className="p-4 text-purple-700 font-bold">{p.code}</td>
              <td className="p-4 text-slate-500">{p.degreeLevel}</td>
              <td className="p-4 text-slate-500">{p.totalCredits} Credits</td>
              <td className="p-4 text-campus-800 font-bold">Active / Published</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
