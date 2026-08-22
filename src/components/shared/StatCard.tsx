import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href: string;
  color: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
}

const colorMap = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

export default function StatCard({ icon: Icon, label, value, href, color }: StatCardProps) {
  const colorStyles = colorMap[color] || colorMap.blue;
  
  return (
    <Link href={href} className="clean-card rounded-2xl p-5 bg-white space-y-3 group block hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorStyles.bg} ${colorStyles.text}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
    </Link>
  );
}
