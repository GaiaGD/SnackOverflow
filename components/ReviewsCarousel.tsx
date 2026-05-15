import Carousel from './Carousel';
import ReviewCard from './ReviewCard';
import type { Review } from './ReviewCard';

export type { Review };

interface ReviewsCarouselProps {
  title: string;
  reviews: Review[];
}

export default function ReviewsCarousel({ title, reviews }: ReviewsCarouselProps) {
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
    <section className="py-16 px-6 bg-brand-purple">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl space-y-8">
        <h2 className="text-3xl font-bold text-brand-yellow text-center">{title}</h2>

        <Carousel label="Customer reviews">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
