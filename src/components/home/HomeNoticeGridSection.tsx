import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { NoticeItem } from "@/types";

interface Props {
  notices: NoticeItem[];
}

export default function HomeNoticeGridSection({ notices }: Props) {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 bg-slate-50/50">
      <div className="space-y-10">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-display">
            Official notices and resources to explore.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Access official circulars, exam routines, admission circulars,
            and departmental publications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/notices/${notice.slug}`}
              className="clean-card rounded-2xl p-6 bg-white space-y-4 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {notice.category} Notice
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {notice.summary}
                </p>
              </div>

              <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read circular</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
