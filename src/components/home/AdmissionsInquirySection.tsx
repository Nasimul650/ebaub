import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function AdmissionsInquirySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
      
      {/* Left Column: Clean Embedded Form Card with Soft Drop Shadows */}
      <div className="relative flex justify-center">
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 to-campus-400/15 rounded-3xl blur-2xl -z-10" />

        <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-campus-900 text-white flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-6 h-6 text-campus-400" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 heading-display">Start Your Application</h3>
            <p className="text-xs text-slate-500">Admissions Open for Spring 2027 Academic Session</p>
          </div>

          <form className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Tanvir Ahmed"
                className="w-full bg-campus-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="tanvir@example.com"
                className="w-full bg-campus-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Program of Interest</label>
              <select
                className="w-full bg-campus-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-campus-700 shadow-2xs"
              >
                <option>B.Sc. in Computer Science & Engineering</option>
                <option>B.Sc. in Agriculture (Honours)</option>
                <option>Bachelor of Business Administration (BBA)</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full py-4 rounded-xl bg-campus-900 hover:bg-campus-900 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] duration-300"
            >
              Submit Application Inquiry
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Admissions Desk will respond within 24 hours.
          </p>

        </div>

      </div>

      {/* Right Column: Accreditation & Trust Badges */}
      <div className="space-y-8">
        
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider font-bold text-campus-800">
            Admissions Desk
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display leading-tight tracking-tight">
            Ready to begin your academic journey at EBAUB?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Join over 1,000+ graduates and researchers making meaningful contributions in computing, precision agriculture, and modern tech enterprises.
          </p>
        </div>

        {/* 3 Institutional Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-campus-50 border border-slate-200/80 text-center space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-campus-700 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-2xs">
              ★
            </div>
            <div className="text-xs font-extrabold text-slate-900">UGC Approved</div>
            <p className="text-[10px] text-slate-500 font-medium">Government Certified</p>
          </div>

          <div className="p-5 rounded-2xl bg-campus-50 border border-slate-200/80 text-center space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-2xs">
              ★
            </div>
            <div className="text-xs font-extrabold text-slate-900">Top CSE Faculty</div>
            <p className="text-[10px] text-slate-500 font-medium">Expert Mentors</p>
          </div>

          <div className="p-5 rounded-2xl bg-campus-50 border border-slate-200/80 text-center space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-2xs">
              ★
            </div>
            <div className="text-xs font-extrabold text-slate-900">AI Research Cell</div>
            <p className="text-[10px] text-slate-500 font-medium">Published Papers</p>
          </div>
        </div>

      </div>

    </div>
  );
}
