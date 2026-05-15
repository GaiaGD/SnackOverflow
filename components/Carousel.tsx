'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

interface CarouselProps {
  children: React.ReactNode;
  label?: string;
  slideCount?: number;
}

export default function Carousel({ children, label, slideCount }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' });
  const [liveText, setLiveText] = useState('');

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      emblaApi.reInit({ duration: 0 });
    }

    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      if (slideCount) setLiveText(`Item ${i + 1} of ${slideCount}`);
    };

    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, slideCount]);

  // Arrow keys work when any element inside the carousel is focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext(); }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <div
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={handleKeyDown}
    >
      {/* Polite announcement on slide change for screen readers */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {liveText}
      </span>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-2 pb-4">
          {children}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal"
      >
        ›
      </button>
    </div>
  );
}
