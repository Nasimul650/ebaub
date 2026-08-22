'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, GraduationCap } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

interface SlideData {
  id: number;
  image: string;
  badge: string;
  headline: string;
  subhead: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85',
    badge: 'CSE Dept. 2-Year Anniversary Milestone',
    headline: 'Empowering the Next Generation of Computer Scientists & Engineers.',
    subhead: 'Eastern Bank Agricultural University combines world-class computing research, practical software engineering, and modern digital campus workflows.',
    ctaText: 'Explore Degree Programs',
    ctaLink: '/academics',
    secondaryText: 'Admission Guidelines',
    secondaryLink: '/admissions',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85',
    badge: 'Artificial Intelligence & Smart Agriculture',
    headline: 'Pioneering AI Research & Precision Agro-Technology.',
    subhead: 'Collaborating directly with faculty mentors in state-of-the-art laboratory environments to solve global computational and agricultural challenges.',
    ctaText: 'Meet Faculty Mentors',
    ctaLink: '/faculty',
    secondaryText: 'Research Labs',
    secondaryLink: '/about',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=85',
    badge: 'Spring 2027 Admissions Open',
    headline: 'Begin Your Academic Journey at EBAUB University.',
    subhead: 'UGC-accredited Bachelor degrees with comprehensive 160-credit industry-aligned curriculums and headless digital learning workspaces.',
    ctaText: 'Apply for Admission',
    ctaLink: '/admissions',
    secondaryText: 'Official Notices',
    secondaryLink: '/notices',
  },
];

export default function HeroCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Transition animation using useGSAP
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Image transition: scale up previous image slightly while fading out, fade in active image
        imageRefs.current.forEach((imgEl, idx) => {
          if (!imgEl) return;
          if (idx === currentIdx) {
            gsap.fromTo(
              imgEl,
              { opacity: 0, scale: 1.08 },
              { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
            );
          } else {
            gsap.to(imgEl, {
              opacity: 0,
              scale: 1.05,
              duration: 0.8,
              ease: 'power2.inOut',
            });
          }
        });

        // Stagger in text elements inside the glass card
        if (textContainerRef.current) {
          const children = textContainerRef.current.children;
          gsap.fromTo(
            children,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
              delay: 0.3,
            }
          );
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        imageRefs.current.forEach((imgEl, idx) => {
          if (!imgEl) return;
          gsap.set(imgEl, { opacity: idx === currentIdx ? 1 : 0, scale: 1 });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [currentIdx] }
  );

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[85vh] lg:min-h-[88vh] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl border border-slate-200/80"
    >
      {/* Background Images with GSAP Scale & Fade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          ref={(el) => {
            imageRefs.current[idx] = el;
          }}
          className={`absolute inset-0 w-full h-full ${
            idx === currentIdx ? 'z-0 opacity-100' : '-z-10 opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
          {/* Subtle Dark / Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/40 to-slate-900/30" />
        </div>
      ))}

      {/* Fluid Glassmorphism Card Overlay */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-4xl mx-4 sm:mx-8 p-8 sm:p-12 lg:p-14 rounded-3xl backdrop-blur-xl bg-white/85 sm:bg-white/90 border border-white/80 shadow-2xl text-slate-900"
      >
        <div ref={textContainerRef} className="space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 heading-display leading-[1.1] tracking-tight">
            {activeSlide.headline}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
            {activeSlide.subhead}
          </p>

          {/* CTA & Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.ctaLink}
              className="px-7 py-3.5 rounded-2xl bg-campus-800 hover:bg-campus-900 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>

            <Link
              href={activeSlide.secondaryLink}
              className="px-7 py-3.5 rounded-2xl bg-campus-50 hover:bg-campus-100 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
            >
              {activeSlide.secondaryText}
            </Link>
          </div>
        </div>

        {/* Manual Navigation Controls (Touch-Friendly) */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between">
          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIdx
                    ? 'w-8 bg-campus-800 shadow-xs'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-11 h-11 rounded-2xl bg-campus-50 hover:bg-campus-100 text-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-11 h-11 rounded-2xl bg-campus-900 hover:bg-campus-800 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <ChevronRight className="w-5 h-5 text-campus-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
