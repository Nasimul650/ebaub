import React from 'react';
import TeachingCourseGrid from '@/components/teacher/TeachingCourseGrid';

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

      <TeachingCourseGrid courses={courses} />
    </div>
  );
}
