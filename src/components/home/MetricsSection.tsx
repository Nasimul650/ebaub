'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, Award } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

export default function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Stagger entrance for the 3 individual stat columns
        if (cardsGridRef.current) {
          const cards = cardsGridRef.current.children;
          gsap.from(cards, {
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
          });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (cardsGridRef.current) {
          gsap.set(cardsGridRef.current.children, { opacity: 1, y: 0 });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="text-center space-y-16">
      
      {/* Centered Text Block */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display tracking-tight">
          Turn academic rigor into real-world innovations.
        </h2>
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal">
          The Department of Computer Science & Engineering and Faculty of Agriculture equip students with theoretical foundations and practical software engineering capabilities.
        </p>
      </div>

      {/* 3-Column Stats Grid with Massive Numbers, Descriptive Text, and Centered Logos below */}
      <div
        ref={cardsGridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {/* Column 1 */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-4 flex flex-col justify-between items-center text-center">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 heading-display">
              160+
            </div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Curriculum Credits
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Rigorous coursework covering AI, Algorithms, Web Engineering & Cloud Systems.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Academic Standard</span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-4 flex flex-col justify-between items-center text-center">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-emerald-600 heading-display">
              100%
            </div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Digital Campus CMS
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Custom Headless CMS enables live notice publishing and dynamic student portals.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Next.js Architecture</span>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-4 flex flex-col justify-between items-center text-center">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-amber-500 heading-display">
              2 Years
            </div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              CSE Department
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Celebrating two years of continuous excellence in computer science education.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Anniversary Milestone</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Link
          href="/academics"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.02]"
        >
          <span>Explore Academic Faculties</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>

    </div>
  );
}
