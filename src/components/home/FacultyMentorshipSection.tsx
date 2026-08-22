import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FacultyMentorshipSection() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Card: Faculty Profile Widget */}
        <div className="lg:col-span-5">
          <div className="clean-card rounded-2xl p-6 bg-white space-y-5">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Dr. Anisur Rahman"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Dr. Anisur Rahman
                </h3>
                <p className="text-xs text-emerald-700 font-bold">
                  Associate Professor & AI Lab Head
                </p>
                <p className="text-[11px] text-slate-500">
                  Department of CSE, EBAUB
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
              &quot;Our mission is to mentor students through hands-on coding,
              machine learning research, and real-world system
              architecture.&quot;
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Research Focus
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  Machine Learning
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                  Agri-Tech AI
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                  Computer Vision
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">EBAUB Research Cell</span>
              <Link
                href="/faculty"
                className="text-emerald-700 hover:underline"
              >
                View Faculty Directory &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Text Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-700">
            World-Class Academic Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display leading-tight">
            Learn directly from dedicated researchers and engineers.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            At EBAUB, education extends beyond standard lectures. Faculty
            members collaborate with students on practical software
            engineering, cloud architectures, and machine learning models
            applied to regional agricultural challenges.
          </p>
          <div className="pt-2">
            <Link
              href="/faculty"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>
                Explore all faculty members and research interests
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
