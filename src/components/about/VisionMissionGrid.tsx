import React from 'react';
import { Target, Award } from 'lucide-react';
import { SiteSettings } from '@/types';

interface Props {
  settings: SiteSettings;
}

export default function VisionMissionGrid({ settings }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-campus-50 text-campus-800 flex items-center justify-center border border-campus-100">
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
  );
}
