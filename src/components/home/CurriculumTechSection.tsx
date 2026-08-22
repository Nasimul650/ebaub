import Link from "next/link";
import { ArrowRight, Code2, Server, Cpu, Database } from "lucide-react";

export default function CurriculumTechSection() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100 bg-slate-50/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Text Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs uppercase tracking-wider font-bold text-blue-700">
            Industry-Ready Curriculums
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
            Modern tools, software stacks, and laboratory engineering.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            From algorithms and data structures to distributed cloud
            architectures and smart farming IoT sensors, our undergraduate
            programs prepare graduates to excel in global technology
            industries.
          </p>
          <div className="pt-2">
            <Link
              href="/academics"
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
            >
              <span>
                See all program curriculums and admission requirements
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Badge Grid: Tech & Curriculum Badges */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900">
                Algorithms & DS
              </div>
              <p className="text-[10px] text-slate-500">
                C++, Java, Python, Problem Solving
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <Server className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900">
                Web Engineering
              </div>
              <p className="text-[10px] text-slate-500">
                Next.js, React, Node, Fullstack
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900">
                AI & Neural Nets
              </div>
              <p className="text-[10px] text-slate-500">
                PyTorch, TensorFlow, Computer Vision
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Database className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900">
                Relational DBs
              </div>
              <p className="text-[10px] text-slate-500">
                PostgreSQL, SQL, Cloud Storage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
