export interface Review {
  id: string;
  authorName: string;           // required in Contentful
  starRating: number;           // required in Contentful
  authorTitle?: string;
  quote?: string;
}

interface ReviewCardProps extends Review {
  index: number;
  total: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${i < rating ? 'text-brand-navy' : 'text-brand-navy/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.374 2.451a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.952 2.7c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.058 9.394c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewCard({ authorName, authorTitle, quote, starRating, index, total }: ReviewCardProps) {
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${authorName}, review ${index + 1} of ${total}`}
      tabIndex={0}
      className="w-80 rounded-2xl bg-white p-6 shadow-sm"
    >
      <StarRating rating={starRating} />
      {quote && (
        <blockquote className="mt-4 text-brand-navy/80 text-sm leading-relaxed">
          {quote}
        </blockquote>
      )}
      <footer className="mt-4">
        <p className="font-semibold text-brand-navy text-sm">{authorName}</p>
        {authorTitle && (
          <p className="text-brand-navy/70 text-xs">{authorTitle}</p>
        )}
      </footer>
    </article>
  );
}
