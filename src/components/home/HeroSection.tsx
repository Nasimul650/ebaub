'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

export default function HeroSection() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();

        // 1. Hero left-column typography entrance (Headline, Subhead, Button)
        if (leftColRef.current) {
          const textElements = leftColRef.current.querySelectorAll('.hero-anim-item');
          tl.from(textElements, {
            y: 50,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: 'power3.out',
          });
        }

        // 2. Floating UI card on the right (delayed entrance with x: 50, opacity: 0, subtle rotation)
        if (cardRef.current) {
          tl.from(
            cardRef.current,
            {
              x: 50,
              opacity: 0,
              rotation: 4,
              duration: 1.4,
              ease: 'power3.out',
            },
            '-=1.0' // overlap with text entrance
          );

          // 3. Continuous subtle floating yoyo effect
          gsap.to(cardRef.current, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.5,
          });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (leftColRef.current) {
          gsap.set(leftColRef.current.querySelectorAll('.hero-anim-item'), { opacity: 1, y: 0 });
        }
        if (cardRef.current) {
          gsap.set(cardRef.current, { opacity: 1, x: 0, y: 0, rotation: 0 });
        }
      });

      return () => mm.revert();
    },
    { scope: heroContainerRef }
  );

  return (
    <div
      ref={heroContainerRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
    >
      {/* Left Hero Column: Massive Typography & Solid CTA */}
      <div ref={leftColRef} className="space-y-8">
        
        {/* Badge */}
        <div className="hero-anim-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>CSE Department 2-Year Anniversary Prototype</span>
        </div>

        {/* Massive Typography */}
        <h1 className="hero-anim-item text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 heading-display leading-[1.08] tracking-tight">
          Empowering the next generation of engineers.
        </h1>

        {/* Muted Subheadline */}
        <p className="hero-anim-item text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-xl">
          Eastern Bank Agricultural University (EBAUB) combines rigorous academic foundations, hands-on engineering, and digital campus workflows.
        </p>

        {/* Solid CTA Button & Secondary Link */}
        <div className="hero-anim-item pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/academics"
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Degree Programs</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            href="/admissions"
            className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base transition-colors"
          >
            Admission Guidelines
          </Link>
        </div>

      </div>

      {/* Right Hero Column: Floating Glassmorphism Mockup Card */}
      <div className="relative flex justify-center lg:justify-end">
        
        {/* Ambient Blur Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-3xl blur-2xl -z-10" />

        <div
          ref={cardRef}
          className="w-full max-w-lg bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Header of widget */}
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  Department of CSE
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  B.Sc. in Computer Science & Engineering
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Active Session
            </span>
          </div>

          {/* Growth / Sparkline Graphic mockup */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Curriculum Progress & Credits</span>
              <span className="font-bold text-slate-900">
                160 Total Credits
              </span>
            </div>

            {/* Visual Progress Graph Bars */}
            <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-200/80 p-3 flex items-end gap-2.5 justify-between">
              <div className="w-full bg-slate-200 rounded-t-sm h-[35%]" />
              <div className="w-full bg-slate-200 rounded-t-sm h-[50%]" />
              <div className="w-full bg-slate-200 rounded-t-sm h-[65%]" />
              <div className="w-full bg-emerald-500 rounded-t-sm h-[90%] relative group shadow-sm">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  160 Cr
                </div>
              </div>
            </div>
          </div>

          {/* Metric pill indicators */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-medium">
                Degree Duration
              </div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                4.0 Years (8 Sem)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-medium">
                Department Milestone
              </div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">
                2-Year Anniversary
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Powered by Headless CMS
            </span>
            <Link
              href="/academics"
              className="text-emerald-700 font-bold hover:underline"
            >
              View Syllabus &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
