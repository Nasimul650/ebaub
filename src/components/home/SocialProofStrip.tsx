import { ShieldCheck, Award, Microscope, Layers } from "lucide-react";

export default function SocialProofStrip() {
  return (
    <div className="mt-16 pt-10 border-t border-slate-100 text-center space-y-6">
      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
        Recognized & Accredited Higher Education in Bangladesh
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm">
        <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> UGC
          Bangladesh Approved
        </span>
        <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
          <Award className="w-4 h-4 text-amber-500" /> CSE 2-Year
          Anniversary
        </span>
        <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
          <Microscope className="w-4 h-4 text-sky-600" /> AI & Precision
          Agri Labs
        </span>
        <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
          <Layers className="w-4 h-4 text-purple-600" /> Modern Digital
          Campus
        </span>
      </div>
    </div>
  );
}
