import Link from 'next/link';

export default function AnnouncementBanner() {
  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
      <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
        2nd Anniversary
      </span>
      <span className="text-slate-200">
        CSE Department Celebrates 2 Years of Academic Excellence & Digital Innovation
      </span>
      <Link href="/notices/cse-2yr-anniversary-ceremony" className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1 flex items-center gap-1">
        Learn More &rarr;
      </Link>
    </div>
  );
}
