import Link from "next/link";
import { Sparkles, ArrowRight, GraduationCap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left Hero Column: Typography & CTAs */}
      <div className="lg:col-span-7 space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>CSE Department 2-Year Anniversary Prototype</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 heading-display leading-[1.12]">
          Empowering the next generation of engineers.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
          Eastern Bank Agricultural University (EBAUB) brings modern
          digital education, theoretical foundations, and high-impact
          computing research directly to students and faculty.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/academics"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Explore Degree Programs</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            href="/admissions"
            className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors"
          >
            Admission Guidelines
          </Link>
        </div>
      </div>

      {/* Right Hero Column: Interactive UI Preview Card (Matching 11.mp4 preview card) */}
      <div className="lg:col-span-5">
        <div className="clean-card rounded-2xl p-6 hero-card-glow space-y-5">
          {/* Header of widget */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                CSE
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">
                  Department of CSE
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  B.Sc. in Computer Science & Engineering
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Active Session
            </span>
          </div>

          {/* Growth / Sparkline Graphic mockup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span>Curriculum Progress & Credits</span>
              <span className="font-bold text-slate-900">
                160 Total Credits
              </span>
            </div>

            {/* Graph bar visualization */}
            <div className="h-20 w-full bg-white rounded-xl border border-slate-200/80 p-3 flex items-end gap-2 justify-between">
              <div className="w-full bg-slate-100 rounded-t-sm h-[40%]" />
              <div className="w-full bg-slate-100 rounded-t-sm h-[55%]" />
              <div className="w-full bg-slate-100 rounded-t-sm h-[70%]" />
              <div className="w-full bg-emerald-500 rounded-t-sm h-[90%] relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  160 Cr
                </div>
              </div>
            </div>
          </div>

          {/* Metric pill indicators */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <div className="text-[10px] text-slate-500">
                Degree Duration
              </div>
              <div className="font-bold text-slate-900 mt-0.5">
                4.0 Years (8 Sem)
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <div className="text-[10px] text-slate-500">
                Department Status
              </div>
              <div className="font-bold text-emerald-700 mt-0.5">
                2-Year Anniversary
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Powered by Headless CMS
            </span>
            <Link
              href="/academics"
              className="text-emerald-700 font-bold hover:underline"
            >
              View Syllabus &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
