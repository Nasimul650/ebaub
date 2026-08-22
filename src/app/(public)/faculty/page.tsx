import React from 'react';
import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';
import { getAllFaculty } from '@/utils/supabase/queries';

export const metadata = {
  title: 'Faculty Members | EBAUB',
  description: 'Meet the distinguished faculty members and academic staff at EXIM Bank Agricultural University Bangladesh',
};

export default async function FacultyPage() {
  const facultyList = await getAllFaculty(100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 heading-display mb-6">
          Our Distinguished Faculty
        </h1>
        <p className="text-lg text-slate-600">
          Meet our dedicated academic staff committed to excellence in teaching, research, and innovation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {facultyList.map((faculty) => (
          <Link
            key={faculty.id}
            href={`/faculty/${faculty.id}`}
            className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center p-6"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-sm relative">
              {faculty.image_url ? (
                <img 
                  src={faculty.image_url} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-campus-800 transition-colors">
              {faculty.name}
            </h3>
            <p className="text-sm font-semibold text-campus-700 mt-1 mb-4">
              {faculty.title}
            </p>

            {faculty.bio && (
              <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1">
                {faculty.bio}
              </p>
            )}

            <div className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-campus-800 transition-colors">
              <span>View Profile</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {facultyList.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Faculty Members Found</h3>
            <p className="text-slate-500 mt-2">Faculty directory will be updated soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
