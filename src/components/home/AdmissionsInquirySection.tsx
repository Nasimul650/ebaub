import { GraduationCap } from "lucide-react";

export default function AdmissionsInquirySection() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Card: Clean Form Card */}
        <div className="lg:col-span-5">
          <div className="clean-card rounded-2xl p-6 sm:p-8 bg-white space-y-5">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Start Your Application
              </h3>
              <p className="text-xs text-slate-500">
                Admissions Open for Spring 2027
              </p>
            </div>

            <form className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="tanvir@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Program of Interest
                </label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600">
                  <option>B.Sc. in Computer Science & Engineering</option>
                  <option>B.Sc. in Agriculture (Honours)</option>
                  <option>Bachelor of Business Administration (BBA)</option>
                </select>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                Submit Application Inquiry
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-400">
              Admissions Office will respond within 24 hours.
            </p>
          </div>
        </div>

        {/* Right Column: Accreditation Badges */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
            Ready to begin your academic journey at EBAUB?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Join over 1,000+ graduates and researchers making meaningful
            contributions in technology, agricultural innovation, and
            business management.
          </p>

          {/* 3 Institutional Trust Badges (Matching Leader badges in 11.mp4) */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ★
              </div>
              <div className="text-xs font-extrabold text-slate-900">
                UGC Approved
              </div>
              <p className="text-[10px] text-slate-500">
                Government Certified
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ★
              </div>
              <div className="text-xs font-extrabold text-slate-900">
                Top CSE Faculty
              </div>
              <p className="text-[10px] text-slate-500">Expert Mentors</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ★
              </div>
              <div className="text-xs font-extrabold text-slate-900">
                AI Research Cell
              </div>
              <p className="text-[10px] text-slate-500">Published Papers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
