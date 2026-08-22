import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  badge: string;
  headline: string;
  description: string;
}

export default function PageHeader({ badge, headline, description }: PageHeaderProps) {
  return (
    <div className="text-center space-y-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-xs font-bold">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>{badge}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 heading-display">
        {headline}
      </h1>
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}
