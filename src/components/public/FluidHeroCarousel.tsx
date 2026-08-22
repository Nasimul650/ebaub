'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import gsap from 'gsap';

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
    badge: 'Faculty of Computer Science & Engineering',
    title: 'Pioneering Artificial Intelligence & Web Engineering',
    description: 'Empowering students with theoretical mastery and hands-on software development to shape tomorrow\'s tech ecosystem.',
    ctaText: 'Explore CSE Programs',
    ctaLink: '/academics'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
    badge: 'Faculty of Agriculture',
    title: 'Precision Farming & Sustainable Agricultural Science',
    description: 'Leading research in crop pathology, soil technology, and high-yield agro-engineering solutions.',
    ctaText: 'Discover Agriculture Faculty',
    ctaLink: '/academics'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
    badge: 'CSE Department 2-Year Anniversary',
    title: 'Celebrating Two Years of Innovation & Academic Excellence',
    description: 'Join faculty, students, and administration for our anniversary showcase and tech presentation.',
    ctaText: 'View Ceremony Details',
    ctaLink: '/notices/cse-2yr-anniversary-ceremony'
  }
];

export default function FluidHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [current, isPlaying]);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [current]);

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[current];

  return (
    <section className="relative w-full h-[85vh] min-h-[580px] max-h-[800px] overflow-hidden bg-slate-950">
      
      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-105 transition-transform duration-[8000ms] ease-out"
          />
          {/* Subtle Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
        </div>
      ))}

      {/* Fluid Glass Content Card Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div
          ref={textRef}
          className="w-full max-w-2xl glass-overlay p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6"
        >
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeSlide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white heading-display leading-tight">
            {activeSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {activeSlide.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.ctaLink}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admissions"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              Admission Info
            </Link>
          </div>

        </div>
      </div>

      {/* Manual Controls & Indicator Bar */}
      <div className="absolute bottom-8 right-4 sm:right-8 z-30 flex items-center gap-4 glass-overlay px-4 py-2.5 rounded-full text-white text-xs">
        
        {/* Play/Pause Autoplay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label={isPlaying ? 'Pause Carousel' : 'Play Carousel'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Slide Numbers */}
        <span className="font-bold text-amber-400">
          0{current + 1} <span className="text-slate-500 font-normal">/ 0{slides.length}</span>
        </span>

        {/* Slide Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1 border-l border-slate-700/80 pl-3">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>
  );
}
