'use client';

import React, { useRef } from 'react';
import { ShieldCheck, Award, Microscope, Layers, Building2 } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

export default function SocialProofStrip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const logoItems = el.querySelectorAll('.logo-cloud-item');
        gsap.fromTo(
          logoItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-bold">
        Accredited & Recognized Across National Academic & Research Bodies
      </p>

      {/* Horizontal flex row of muted logos / partner bodies */}
      <div className="flex flex-wrap items-center justify-between gap-8 sm:gap-12 text-slate-400 font-bold text-sm">
        <div className="logo-cloud-item flex items-center gap-2 hover:text-slate-700 transition-colors">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>UGC Bangladesh</span>
        </div>

        <div className="logo-cloud-item flex items-center gap-2 hover:text-slate-700 transition-colors">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <span>CSE Anniversary Cell</span>
        </div>

        <div className="logo-cloud-item flex items-center gap-2 hover:text-slate-700 transition-colors">
          <Microscope className="w-5 h-5 text-sky-600 shrink-0" />
          <span>National AI Research</span>
        </div>

        <div className="logo-cloud-item flex items-center gap-2 hover:text-slate-700 transition-colors">
          <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>Ministry of Agriculture</span>
        </div>

        <div className="logo-cloud-item flex items-center gap-2 hover:text-slate-700 transition-colors">
          <Layers className="w-5 h-5 text-purple-600 shrink-0" />
          <span>EBAUB Digital Labs</span>
        </div>
      </div>
    </div>
  );
}
