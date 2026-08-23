'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, Award, Sparkles } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

export default function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textHeaderRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (textHeaderRef.current) {
          gsap.fromTo(
            textHeaderRef.current.children,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: textHeaderRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }

        if (cardsGridRef.current) {
          gsap.fromTo(
            cardsGridRef.current.children,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsGridRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="text-center space-y-16 w-full max-w-6xl mx-auto text-white">
      
      {/* Centered Text Block */}
      <div ref={textHeaderRef} className="max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-campus-900/90 border border-campus-700/80 text-amber-300 text-xs font-bold shadow-md">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Academic Excellence & Computational Rigor</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white heading-display tracking-tight leading-tight">
          Turn academic rigor into real-world innovations.
        </h2>
        <p className="text-base sm:text-lg text-campus-100/90 leading-relaxed font-normal">
          The Department of Computer Science & Engineering and Faculty of Agriculture equip students with theoretical foundations and practical software engineering capabilities.
        </p>
      </div>

      {/* 3-Column Stats Grid with Glassmorphism Cards & Perfect Contrast */}
      <div
        ref={cardsGridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
      >
        {/* Column 1 */}
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5 flex flex-col justify-between items-center text-center text-white hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px] transition-all">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-amber-300 heading-display">
              160+
            </div>
            <div className="text-xs font-bold text-campus-100 uppercase tracking-wider">
              Curriculum Credits
            </div>
            <p className="text-xs text-campus-200/80 leading-relaxed max-w-xs">
              Rigorous coursework covering AI, Algorithms, Web Engineering & Cloud Systems.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-campus-300">
              <BookOpen className="w-4 h-4 text-campus-400" />
              <span>Academic Standard</span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5 flex flex-col justify-between items-center text-center text-white hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px] transition-all">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-white heading-display">
              100%
            </div>
            <div className="text-xs font-bold text-campus-100 uppercase tracking-wider">
              Digital Campus CMS
            </div>
            <p className="text-xs text-campus-200/80 leading-relaxed max-w-xs">
              Custom Headless CMS enables live notice publishing and dynamic student portals.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-campus-300">
              <Layers className="w-4 h-4 text-campus-400" />
              <span>Next.js Architecture</span>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5 flex flex-col justify-between items-center text-center text-white hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px] transition-all">
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-extrabold text-amber-300 heading-display">
              2 Years
            </div>
            <div className="text-xs font-bold text-campus-100 uppercase tracking-wider">
              CSE Department
            </div>
            <p className="text-xs text-campus-200/80 leading-relaxed max-w-xs">
              Celebrating two years of continuous excellence in computer science education.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-campus-300">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Anniversary Milestone</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Link
          href="/academics"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-2xl transition-all hover:scale-[1.02]"
        >
          <span>Explore Academic Faculties</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </Link>
      </div>

    </div>
  );
}
