import Link from 'next/link';

export default function AnnouncementBanner() {
  return (
    <div className="bg-campus-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
      <span className="bg-campus-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
        2nd Anniversary
      </span>
      <span className="text-campus-200">
        CSE Department Celebrates 2 Years of Academic Excellence & Digital Innovation
      </span>
      <Link href="/notices/cse-2yr-anniversary-ceremony" className="text-campus-400 hover:text-campus-300 font-semibold underline ml-1 flex items-center gap-1">
        Learn More &rarr;
      </Link>
    </div>
  );
}
