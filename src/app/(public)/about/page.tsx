import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Award, Target, Users, BookOpen, ArrowRight } from 'lucide-react';
import { getSiteSettings } from '@/lib/mock/mockServices';

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          About Eastern Bank Agricultural University
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 heading-display tracking-tight">
          Pioneering Excellence in Science, Agriculture & Technology
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Established in {settings.establishedYear}, {settings.universityName} ({settings.shortName}) stands as a beacon of academic leadership in Rajshahi, Bangladesh.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To become a premier regional and international university recognized for cutting-edge research in Computer Science, Agricultural Engineering, and sustainable technology.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To empower students with rigorous academic foundations, hands-on software & agricultural engineering skills, ethical leadership, and continuous innovation.
          </p>
        </div>
      </div>

      {/* CSE Department Highlight */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> CSE Department 2-Year Anniversary Milestone
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-display">
          Department of Computer Science & Engineering
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The CSE Department at EBAUB was established to fulfill the growing regional and global demand for high-caliber computer scientists. Over the past 2 years, the department has grown into an incubator for AI research, software engineering, and modern web technology.
        </p>
        <div className="pt-2 flex flex-wrap gap-4">
          <Link href="/academics" className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors">
            Browse CSE Degrees
          </Link>
          <Link href="/faculty" className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors">
            Meet CSE Faculty
          </Link>
        </div>
      </div>

    </div>
  );
}
