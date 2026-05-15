interface HeroBlockProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
}

export default function HeroBlock({ headline, subheadline, ctaText, ctaUrl }: HeroBlockProps) {
  return (
    <section className="bg-brand-purple py-24 px-6">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-yellow sm:text-6xl">
          {headline}
        </h1>
        <p className="text-lg text-white/80 sm:text-xl max-w-2xl mx-auto">
          {subheadline}
        </p>
        <a
          href={ctaUrl || '#lead-form'}
          className="inline-flex items-center justify-center rounded-2xl bg-brand-teal px-8 py-4 text-base font-semibold text-brand-purple shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal transition-opacity"
        >
          {ctaText || 'Get a Demo'}
        </a>
      </div>
    </section>
  );
}
