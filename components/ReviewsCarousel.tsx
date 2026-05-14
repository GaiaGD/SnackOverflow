'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface Review {
  id: string;
  authorName: string;
  authorTitle: string;
  quote: string;
  starRating: number;
}

interface ReviewsCarouselProps {
  title: string;
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-zinc-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.374 2.451a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.952 2.7c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.058 9.394c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ title, reviews }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const focusedIndex = useRef(0);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const scrollToCard = useCallback(
    (index: number) => {
      const card = cardRefs.current[index];
      if (!card) return;
      card.scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      card.focus();
      focusedIndex.current = index;
    },
    [prefersReducedMotion]
  );

  const prev = useCallback(() => {
    const next = Math.max(0, focusedIndex.current - 1);
    scrollToCard(next);
  }, [scrollToCard]);

  const next = useCallback(() => {
    const n = Math.min(reviews.length - 1, focusedIndex.current + 1);
    scrollToCard(n);
  }, [reviews.length, scrollToCard]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };

    track.addEventListener('keydown', handleKey);
    return () => track.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': reviews.map((r) => ({
      '@type': 'Review',
      reviewBody: r.quote,
      author: { '@type': 'Person', name: r.authorName, jobTitle: r.authorTitle },
      reviewRating: { '@type': 'Rating', ratingValue: r.starRating, bestRating: 5 },
    })),
  };

  return (
    <section
      role="region"
      aria-label="Customer reviews"
      className="py-16 px-6 bg-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl space-y-8">
        <h2 className="text-3xl font-bold text-zinc-900 text-center">{title}</h2>

        <div className="relative">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-40"
          >
            ‹
          </button>

          <ul
            ref={trackRef}
            role="list"
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {reviews.map((review, i) => (
              <li
                key={review.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                role="listitem"
                tabIndex={0}
                onFocus={() => { focusedIndex.current = i; }}
                className="snap-center flex-none w-80 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
              >
                <StarRating rating={review.starRating} />
                <blockquote className="mt-4 text-zinc-700 text-sm leading-relaxed">
                  {review.quote}
                </blockquote>
                <footer className="mt-4">
                  <p className="font-semibold text-zinc-900 text-sm">{review.authorName}</p>
                  <p className="text-zinc-500 text-xs">{review.authorTitle}</p>
                </footer>
              </li>
            ))}
          </ul>

          <button
            onClick={next}
            aria-label="Next review"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
