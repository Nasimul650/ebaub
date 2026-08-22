import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Award, Target, Users, BookOpen, ArrowRight } from 'lucide-react';
import { getSiteSettings } from '@/lib/mock/mockServices';

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          About Eastern Bank Agricultural University
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Pioneering Excellence in Science, Agriculture & Technology
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Established in {settings.establishedYear}, {settings.universityName} ({settings.shortName}) stands as a beacon of academic leadership in Rajshahi, Bangladesh.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To become a premier regional and international university recognized for cutting-edge research in Computer Science, Agricultural Engineering, and sustainable technology.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To empower students with rigorous academic foundations, hands-on software & agricultural engineering skills, ethical leadership, and continuous innovation.
          </p>
        </div>
      </div>

      {/* CSE Department Highlight */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 md:p-12 space-y-6">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> CSE Department 2-Year Anniversary Milestone
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Department of Computer Science & Engineering
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The CSE Department at EBAUB was established to fulfill the growing regional and global demand for high-caliber computer scientists. Over the past 2 years, the department has grown into an incubator for AI research, software engineering, and web technology.
        </p>
        <div className="pt-2 flex flex-wrap gap-4">
          <Link href="/academics" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
            Browse CSE Degrees
          </Link>
          <Link href="/faculty" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700">
            Meet CSE Faculty
          </Link>
        </div>
      </div>

    </div>
  );
}
