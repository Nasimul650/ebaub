import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Mail, GraduationCap } from 'lucide-react';
import { getFacultyById } from '@/utils/supabase/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FacultyDetailPage({ params }: Props) {
  const { id } = await params;
  const faculty = await getFacultyById(id);

  if (!faculty) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/faculty" className="inline-flex items-center gap-2 text-slate-500 hover:text-campus-800 font-semibold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Faculty Directory
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-campus-900 to-campus-800"></div>
          
          <div className="px-8 sm:px-12 pb-12">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-end -mt-24 mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white bg-slate-100 shadow-lg shrink-0">
                {faculty.image_url ? (
                  <img 
                    src={faculty.image_url} 
                    alt={faculty.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-20 h-20" />
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left pb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                  {faculty.name}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-campus-50 text-campus-800 font-bold text-sm rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  {faculty.title}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 border-t border-slate-100 pt-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">Biography</h2>
                  {faculty.bio ? (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                      {faculty.bio.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No biography available at this time.</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                      <a href={`mailto:contact@ebaub.edu.bd`} className="hover:text-campus-700 hover:underline">contact@ebaub.edu.bd</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
