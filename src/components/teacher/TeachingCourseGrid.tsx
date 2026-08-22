import React from 'react';

interface Course {
  code: string;
  title: string;
  students: number;
  schedule: string;
}

interface Props {
  courses: Course[];
}

export default function TeachingCourseGrid({ courses }: Props) {
  return (
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
  );
}
