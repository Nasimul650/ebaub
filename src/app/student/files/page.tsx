import React from 'react';
import { FolderDown, FileCode, FileSpreadsheet, Download } from 'lucide-react';

export default function StudentFilesPage() {
  const dummyFiles = [
    { name: 'CSE-2101_Lecture_01_BinaryTrees.pdf', size: '2.4 MB', date: 'Aug 14, 2026', type: 'PDF Document' },
    { name: 'CSE-2101_Lab_Assignment_02.cpp', size: '14 KB', date: 'Aug 16, 2026', type: 'Source Code' },
    { name: 'CSE-3205_AI_NeuralNetworks_Slides.pdf', size: '5.1 MB', date: 'Aug 10, 2026', type: 'PDF Presentation' }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Course Files Library</h1>
        <p className="text-xs text-slate-500 mt-1">Direct file repository for enrolled department courses</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-4">File Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Size</th>
              <th className="p-4">Uploaded Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dummyFiles.map((file, i) => (
              <tr key={i} className="hover:bg-slate-50/80">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>{file.name}</span>
                </td>
                <td className="p-4 text-slate-500">{file.type}</td>
                <td className="p-4 text-slate-500">{file.size}</td>
                <td className="p-4 text-slate-500">{file.date}</td>
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
    </div>
  );
}
