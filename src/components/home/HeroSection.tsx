'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, GraduationCap, ChevronLeft, ChevronRight, Layers, ShieldCheck } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  credits: string;
  metric: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
    badge: 'CSE Dept. 2-Year Milestone',
    title: 'Department of Computer Science & Engineering',
    credits: '160 Total Credits',
    metric: '4.0 Years • 8 Semesters',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    badge: 'AI & Smart Agriculture Lab',
    title: 'Precision Computing & Agri-Tech Research',
    credits: '160 Credits • Lab Integrated',
    metric: 'Faculty Mentored Projects',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    badge: 'Admissions Open Spring 2027',
    title: 'Undergraduate Degree Programs',
    credits: 'UGC Bangladesh Approved',
    metric: 'Modern Digital Campus',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideContentRef = useRef<HTMLDivElement>(null);

  // Entrance animation for typography on page load
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();

        // 1. Left Column typography entrance
        if (leftColRef.current) {
          const textItems = leftColRef.current.querySelectorAll('.hero-anim-item');
          tl.from(textItems, {
            y: 50,
            opacity: 0,
            duration: 1.4,
            stagger: 0.18,
            ease: 'power3.out',
          });
        }

        // 2. Right Column floating UI card entrance
        if (rightColRef.current) {
          tl.from(
            rightColRef.current,
            {
              x: 50,
              opacity: 0,
              duration: 1.4,
              ease: 'power3.out',
            },
            '-=1.0'
          );

          // Subtle floating motion
          gsap.to(rightColRef.current, {
            y: -8,
            duration: 3.5,
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
        if (rightColRef.current) {
          gsap.set(rightColRef.current, { opacity: 1, x: 0, y: 0 });
        }
      });

      return () => mm.revert();
    },
    { scope: heroContainerRef }
  );

  // Slide transition animation inside right-side floating container
  useEffect(() => {
    imageRefs.current.forEach((imgEl, idx) => {
      if (!imgEl) return;
      if (idx === currentSlide) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
        );
      } else {
        gsap.to(imgEl, {
          opacity: 0,
          scale: 1.04,
          duration: 0.7,
          ease: 'power2.inOut',
        });
      }
    });

    if (slideContentRef.current) {
      gsap.fromTo(
        slideContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const active = heroSlides[currentSlide];

  return (
    <div
      ref={heroContainerRef}
      className="relative w-full min-h-[80vh] flex items-center"
    >

      {/* 2. Strict 2-Column Hero Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-16">
        
        {/* 3. Left Column: Massive Left-Aligned Typography & Primary Deep Green CTA */}
        <div ref={leftColRef} className="space-y-8 text-left">
          
          {/* Badge */}
          <div className="hero-anim-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-campus-50 border border-campus-200 text-campus-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>CSE Department 2-Year Anniversary Prototype</span>
          </div>

          {/* Massive, tight typography for H1 */}
          <h1 className="hero-anim-item text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 heading-display leading-[1.06] break-words">
            Empowering the next generation of engineers.
          </h1>

          {/* Muted Subtitle */}
          <p className="hero-anim-item text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
            EXIM Bank Agricultural University Bangladesh (EBAUB) combines rigorous academic foundations, hands-on engineering, and digital campus workflows.
          </p>

          {/* CTA Button: Primary Deep Green */}
          <div className="hero-anim-item pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/academics"
              className="px-8 py-4 rounded-xl bg-campus-800 hover:bg-campus-900 text-white font-bold text-sm sm:text-base shadow-lg flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Degree Programs</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>

            <Link
              href="/admissions"
              className="px-8 py-4 rounded-xl bg-campus-100 hover:bg-campus-200 text-slate-800 font-bold text-sm sm:text-base transition-colors"
            >
              Admission Guidelines
            </Link>
          </div>

          {/* Trust Metric Micro Row */}
          <div className="hero-anim-item pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-campus-700" /> UGC Bangladesh Approved
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" /> 160 Credit Curriculum
            </span>
          </div>

        </div>

        {/* 4. Right Column: Floating UI Carousel Element */}
        <div ref={rightColRef} className="relative flex justify-center lg:justify-end">
          
          {/* Floating UI Container */}
          <div className="relative w-full max-w-lg aspect-[4/4.8] sm:aspect-[4/4.5] rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden bg-campus-900 flex flex-col justify-between">
            
            {/* Background Images Cross-Fading Inside this Container */}
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                className={`absolute inset-0 w-full h-full ${
                  idx === currentSlide ? 'z-0 opacity-100' : '-z-10 opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-campus-950/90 via-campus-900/40 to-campus-900/20" />
              </div>
            ))}

            {/* Top Floating Badge inside UI card */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold shadow-sm border border-white/60">
                <GraduationCap className="w-3.5 h-3.5 text-campus-800" />
                <span>{active.badge}</span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1.5 bg-campus-950/60 backdrop-blur-md rounded-xl p-1 border border-white/10">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-7 h-7 rounded-lg hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-7 h-7 rounded-lg hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Floating Glass Card inside the UI element */}
            <div className="relative z-10 p-5">
              <div
                ref={slideContentRef}
                className="p-5 rounded-xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl space-y-3.5 text-slate-900"
              >
                <div>
                  <div className="text-[11px] text-campus-800 font-extrabold uppercase tracking-wider">
                    {active.metric}
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-0.5 leading-snug">
                    {active.title}
                  </h3>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>Curriculum Progress</span>
                    <span className="text-slate-900">{active.credits}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-campus-700 rounded-full w-[85%]" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  {/* Indicators */}
                  <div className="flex items-center gap-1.5">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentSlide
                            ? 'w-6 bg-campus-800'
                            : 'w-1.5 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Link
                    href="/academics"
                    className="text-campus-800 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
