'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Server, Cpu, Database } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

export default function CurriculumTechSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (cardsGridRef.current) {
          const cards = cardsGridRef.current.children;

          // Staggered entrance on scroll
          gsap.from(cards, {
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            onComplete: () => {
              // Continuous subtle floating yoyo effect
              gsap.to(cards, {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                stagger: {
                  each: 0.2,
                  from: 'random',
                },
                ease: 'sine.inOut',
              });
            },
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
    <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
      {/* Row 2 Left: High-Contrast Text */}
      <div className="space-y-6">
        <div className="text-xs uppercase tracking-wider font-bold text-blue-700">
          Industry-Ready Curriculums
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 heading-display leading-tight tracking-tight">
          Modern tools, software stacks, and laboratory engineering.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          From algorithms and data structures to distributed cloud architectures and smart farming IoT sensors, our undergraduate programs prepare graduates to excel in global technology ecosystems.
        </p>

        <div className="pt-2">
          <Link
            href="/academics"
            className="text-sm font-bold text-slate-900 hover:text-blue-700 flex items-center gap-2 transition-colors group"
          >
            <span>See all program curriculums and admission requirements</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Row 2 Right: Scattered Grid of Floating App / Tech Stack Cards with Yoyo Animation */}
      <div className="relative">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl -z-10" />

        <div ref={cardsGridRef} className="grid grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-3 hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-campus-100 text-campus-800 flex items-center justify-center font-bold text-sm shadow-2xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900">Algorithms & DS</div>
            <p className="text-xs text-slate-500 leading-relaxed">C++, Java, Python, Problem Solving</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-3 hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <Server className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900">Web Engineering</div>
            <p className="text-xs text-slate-500 leading-relaxed">Next.js, React, Node.js, Fullstack Cloud</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-3 hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900">AI & Neural Nets</div>
            <p className="text-xs text-slate-500 leading-relaxed">PyTorch, TensorFlow, Agro Vision</p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xl space-y-3 hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900">Relational DBs</div>
            <p className="text-xs text-slate-500 leading-relaxed">PostgreSQL, SQL, Cloud Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
