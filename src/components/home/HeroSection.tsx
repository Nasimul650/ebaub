'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import type { HomePageSettings, HeroSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85',
    badge: 'CSE Dept. 2-Year Milestone',
    title: 'Excellence in Computing',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85',
    badge: 'Smart Agriculture Lab',
    title: 'Precision Research',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=85',
    badge: 'Admissions Open',
    title: 'Shape the Future',
  },
];

interface Props {
  heroSettings?: Partial<HomePageSettings> | HeroSettings;
}

export default function HeroSection({ heroSettings }: Props) {
  const fallback = PAGE_SETTINGS_DEFAULTS.home;
  
  const badgeText = (heroSettings as HomePageSettings)?.badge_text || (heroSettings as HeroSettings)?.badge_text || fallback.badge_text;
  const headline = (heroSettings as HomePageSettings)?.hero_headline || (heroSettings as HeroSettings)?.headline || fallback.hero_headline;
  const subtitle = (heroSettings as HomePageSettings)?.hero_subtitle || (heroSettings as HeroSettings)?.subtitle || fallback.hero_subtitle;
  const fallbackImage = (heroSettings as HomePageSettings)?.hero_fallback_image_url || (heroSettings as HeroSettings)?.fallback_image_url || fallback.hero_fallback_image_url;
  
  const exploreCtaText = (heroSettings as HomePageSettings)?.explore_cta_text || fallback.explore_cta_text;
  const admissionsCtaText = (heroSettings as HomePageSettings)?.admissions_cta_text || fallback.admissions_cta_text;

  const heroSlides = React.useMemo(() => {
    if (!fallbackImage) return defaultSlides;
    return [
      {
        ...defaultSlides[0],
        image: fallbackImage,
        badge: badgeText || defaultSlides[0].badge
      },
      ...defaultSlides.slice(1)
    ];
  }, [fallbackImage, badgeText]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Classic Smooth Entrance Animation
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (contentRef.current) {
        const textItems = contentRef.current.querySelectorAll('.hero-anim-item');
        gsap.fromTo(textItems, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        );
      }
    });
  }, { scope: heroContainerRef });

  // Elegant Background Image Crossfade
  useEffect(() => {
    imageRefs.current.forEach((imgEl, idx) => {
      if (!imgEl) return;
      if (idx === currentSlide) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
        );
      } else {
        gsap.to(imgEl, {
          opacity: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power2.inOut',
        });
      }
    });
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div ref={heroContainerRef} className="relative w-full h-[75vh] min-h-[600px] flex items-center bg-black overflow-hidden">
      
      {/* Background Slider Images */}
      {heroSlides.map((slide, idx) => (
        <div
          key={slide.id}
          ref={(el) => { imageRefs.current[idx] = el; }}
          className={`absolute inset-0 w-full h-full ${
            idx === currentSlide ? 'z-0' : '-z-10'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Classic Elite Gradient Overlays for Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-campus-950/95 via-campus-900/70 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-campus-950/80 via-transparent to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-3xl space-y-8">
          
          <div className="hero-anim-item inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase font-bangla backdrop-blur-sm">
            {badgeText}
          </div>

          <h1 className="hero-anim-item text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight heading-display leading-[1.15] font-bangla drop-shadow-xl">
            {headline}
          </h1>

          <p className="hero-anim-item text-base sm:text-lg text-slate-300 font-medium leading-relaxed font-bangla max-w-2xl drop-shadow-lg">
            {subtitle}
          </p>

          <div className="hero-anim-item flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/admissions"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 font-bangla shadow-lg shadow-emerald-900/50"
            >
              <span className="leading-none translate-y-[1px]">{admissionsCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/academics"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 font-bangla"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              <span className="leading-none translate-y-[1px]">{exploreCtaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side Navigation Arrows */}
      <div className="absolute bottom-8 right-4 sm:right-6 lg:right-8 z-30 flex items-center gap-3 sm:gap-4">
         <button 
           onClick={prevSlide} 
           aria-label="Previous Slide"
           className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
         >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
         </button>
         <button 
           onClick={nextSlide} 
           aria-label="Next Slide"
           className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
         >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
         </button>
      </div>

      {/* Center Bottom Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'w-10 h-2.5 bg-emerald-500' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      
    </div>
  );
}
