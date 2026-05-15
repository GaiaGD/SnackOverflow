'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

interface CarouselProps {
  children: React.ReactNode;
  label?: string;
}

export default function Carousel({ children, label }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div role="region" aria-label={label} className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-2 pb-4">
          {children}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal"
      >
        ›
      </button>
    </div>
  );
}
