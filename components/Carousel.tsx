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
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      emblaApi.reInit({ duration: 0 });
    }

    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
      const i = emblaApi.selectedScrollSnap();
      if (slideCount) setLiveText(`Item ${i + 1} of ${slideCount}`);
    };

    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    update();

    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi, slideCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext(); }
    },
    [scrollPrev, scrollNext]
  );

  const btnCls = 'absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-navy transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow enabled:hover:bg-brand-mustard disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={handleKeyDown}
    >
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {liveText}
      </span>

      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex gap-6 pb-4 list-none">
          {children}
        </ul>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        disabled={!canPrev}
        className={`${btnCls} left-0 -translate-x-4`}
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        disabled={!canNext}
        className={`${btnCls} right-0 translate-x-4`}
      >
        ›
      </button>
    </div>
  );
}
