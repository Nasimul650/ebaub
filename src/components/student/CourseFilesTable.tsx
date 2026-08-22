import React from 'react';
import { FileCode, Download } from 'lucide-react';
import { TeachingMaterial } from '@/types';

interface Props {
  materials: TeachingMaterial[];
}

export default function CourseFilesTable({ materials }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
          <tr>
            <th className="p-4">File Name</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Uploaded Date</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {materials.map((file, i) => (
            <tr key={file.id || i} className="hover:bg-slate-50/80">
              <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>{file.title}</span>
              </td>
              <td className="p-4 text-slate-500">{file.subject}</td>
              <td className="p-4 text-slate-500">{new Date(file.createdAt || Date.now()).toLocaleDateString()}</td>
              <td className="p-4 text-right">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs">
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
