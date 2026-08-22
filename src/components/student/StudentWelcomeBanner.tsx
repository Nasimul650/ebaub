import React from 'react';

export default function StudentWelcomeBanner() {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
        Student Workspace
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
        Welcome back, CSE Student!
      </h1>
      <p className="text-xs sm:text-sm text-slate-600">
        Access your enrolled course materials, download class files, and ask your Student AI Study Assistant for conceptual explanations.
      </p>
    </div>
  );
}
