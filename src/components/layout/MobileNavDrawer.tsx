import Link from 'next/link';

interface MobileNavDrawerProps {
  isOpen: boolean;
}

export default function MobileNavDrawer({ isOpen }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs font-semibold">
      <Link href="/about" className="block py-2 text-slate-700 hover:text-emerald-700">About EBAUB</Link>
      <Link href="/academics" className="block py-2 text-slate-700 hover:text-emerald-700">Academics & Programs</Link>
      <Link href="/admissions" className="block py-2 text-slate-700 hover:text-emerald-700">Admissions</Link>
      <Link href="/faculty" className="block py-2 text-slate-700 hover:text-emerald-700">Faculty Directory</Link>
      <Link href="/notices" className="block py-2 text-slate-700 hover:text-emerald-700">Notices</Link>
      <Link href="/news" className="block py-2 text-slate-700 hover:text-emerald-700">News & Achievements</Link>
      <Link href="/events" className="block py-2 text-slate-700 hover:text-emerald-700">Events</Link>
      <Link href="/contact" className="block py-2 text-slate-700 hover:text-emerald-700">Contact</Link>
    </div>
  );
}
