import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FacultyMentorshipSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
      
      {/* Row 1 Left: Floating Profile Cards with Soft Drop Shadows */}
      <div className="relative flex justify-center">
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-3xl blur-2xl -z-10" />

        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Dr. Anisur Rahman"
              className="w-18 h-18 rounded-2xl object-cover border border-slate-200 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-slate-900">Dr. Anisur Rahman</h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-700 font-bold">Associate Professor & AI Lab Head</p>
              <p className="text-[11px] text-slate-500 font-medium">Department of CSE, EBAUB</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed font-normal">
            "Our mission is to mentor students through hands-on coding, machine learning research, and scalable system architecture."
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Research Focus Areas</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Machine Learning
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                Agri-Tech AI
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                Computer Vision
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">EBAUB Research Cell</span>
            <Link href="/faculty" className="text-emerald-700 font-bold hover:underline">
              View Faculty Directory &rarr;
            </Link>
          </div>

        </div>

      </div>

      {/* Row 1 Right: High-Contrast Text */}
      <div className="space-y-6">
        <div className="text-xs uppercase tracking-wider font-bold text-emerald-700">
          World-Class Academic Mentorship
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display leading-tight tracking-tight">
          Learn directly from dedicated researchers and engineers.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          At EBAUB, education extends beyond standard lectures. Faculty members collaborate directly with students on practical software engineering, cloud architectures, and machine learning models applied to real-world challenges.
        </p>

        <div className="pt-2">
          <Link
            href="/faculty"
            className="text-sm font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-2 transition-colors group"
          >
            <span>Explore all faculty members and research labs</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
