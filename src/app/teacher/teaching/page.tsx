import React from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

export default function TeachingOverviewPage() {
  const courses = [
    { code: 'CSE-2101', title: 'Data Structures & Algorithms', students: 45, schedule: 'Sun & Tue: 10:00 AM' },
    { code: 'CSE-3205', title: 'Artificial Intelligence', students: 38, schedule: 'Mon & Wed: 11:30 AM' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 heading-display">Teaching Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Assigned faculty courses & class schedules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, i) => (
          <div key={i} className="clean-card bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                {course.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{course.students} Enrolled Students</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
            <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">Class Schedule:</span> {course.schedule}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
