import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MetricsSection() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 text-center bg-slate-50/50 border-b border-slate-100 space-y-12">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display">
          Turn academic rigor into real-world innovations.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          The Department of Computer Science & Engineering and Faculty of
          Agriculture equip students with theoretical foundations and
          practical software engineering capabilities.
        </p>
      </div>

      {/* 3 Metric Stats (Matching 300%, 70%, 60% row in video) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display">
            160+
          </div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Curriculum Credits
          </div>
          <p className="text-xs text-slate-500">
            Rigorous coursework covering AI, Algorithms, Web Engineering &
            Cloud Systems.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700 heading-display">
            100%
          </div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Digital Campus CMS
          </div>
          <p className="text-xs text-slate-500">
            Custom Headless CMS enables live notice publishing and dynamic
            student portals.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold text-amber-600 heading-display">
            2 Years
          </div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            CSE Department
          </div>
          <p className="text-xs text-slate-500">
            Celebrating two years of continuous excellence in computer
            science education.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Link
          href="/academics"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          <span>Explore Academic Faculties</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>
    </section>
  );
}
