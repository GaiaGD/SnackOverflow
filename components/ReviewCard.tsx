export interface Review {
  id: string;
  authorName: string;
  authorTitle: string;
  quote: string;
  starRating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${i < rating ? 'text-brand-yellow' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.374 2.451a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.952 2.7c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.058 9.394c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewCard({ authorName, authorTitle, quote, starRating }: Review) {
  return (
    <article className="flex-none w-80 rounded-2xl border border-brand-teal/30 bg-white/10 p-6 shadow-sm">
      <StarRating rating={starRating} />
      <blockquote className="mt-4 text-white/80 text-sm leading-relaxed">
        {quote}
      </blockquote>
      <footer className="mt-4">
        <p className="font-semibold text-brand-teal text-sm">{authorName}</p>
        <p className="text-white/50 text-xs">{authorTitle}</p>
      </footer>
    </article>
  );
}
