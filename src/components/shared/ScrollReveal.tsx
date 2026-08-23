'use client';

import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapConfig';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  triggerStart?: string;
  stagger?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  triggerStart = 'top 85%',
  stagger,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let x = 0;
        let y = 0;

        switch (direction) {
          case 'up':
            y = distance;
            break;
          case 'down':
            y = -distance;
            break;
          case 'left':
            x = distance;
            break;
          case 'right':
            x = -distance;
            break;
        }

        gsap.from(el.children.length > 1 && stagger ? el.children : el, {
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
            once: true,
          },
          x,
          y,
          opacity: 0,
          duration,
          delay,
          stagger: stagger || 0,
          ease: 'power3.out',
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { opacity: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [direction, delay, duration, distance, triggerStart, stagger] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
