import React from 'react';
import { BookOpen } from 'lucide-react';
import { getPrograms } from '@/lib/mock/mockServices';

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-400" /> Programs CMS Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage degree offerings, credits, and admission requirements</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4">Program Title</th>
              <th className="p-4">Code</th>
              <th className="p-4">Level</th>
              <th className="p-4">Credits</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {programs.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">{p.title}</td>
                <td className="p-4 text-purple-400 font-semibold">{p.code}</td>
                <td className="p-4 text-slate-400">{p.degreeLevel}</td>
                <td className="p-4 text-slate-400">{p.totalCredits} Credits</td>
                <td className="p-4 text-emerald-400 font-bold">Active / Published</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
