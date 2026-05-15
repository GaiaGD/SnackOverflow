import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLandingPageBySlug } from '@/lib/contentful';
import HeroBlock from '@/components/HeroBlock';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import type { Review } from '@/components/ReviewsCarousel';
import LeadCaptureSection from '@/components/LeadCaptureSection';

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const page = await getLandingPageBySlug(params.slug).catch(() => null);

  const title = str(page?.fields.seoTitle) || str(page?.fields.title) || 'SnackOverflow';
  const description = str(page?.fields.seoDescription) || '';

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
  const url = `${siteUrl}/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'SnackOverflow',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Contentful v11 can return fields as `string | { [locale]: string }`.
// This helper always resolves to a plain string.
function str(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const first = Object.values(val as Record<string, unknown>)[0];
    return typeof first === 'string' ? first : '';
  }
  return '';
}

function num(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && val !== null) {
    const first = Object.values(val as Record<string, unknown>)[0];
    return typeof first === 'number' ? first : 0;
  }
  return 0;
}

type RawBlock = {
  sys: { id: string; contentType?: { sys?: { id?: string } } };
  fields: Record<string, unknown>;
};

type RawReview = {
  sys: { id: string };
  fields: Record<string, unknown>;
};

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const page = await getLandingPageBySlug(params.slug).catch(() => null);

  if (!page) {
    notFound();
  }

  const blocks = (page.fields.blocks as unknown as RawBlock[] | undefined) ?? [];

  return (
    <main>
      {blocks.map((block) => {
        if (!block?.sys) return null;
        const contentTypeId = block.sys.contentType?.sys?.id;

        if (contentTypeId === 'heroBlock') {
          return (
            <HeroBlock
              key={block.sys.id}
              headline={str(block.fields.headline)}
              subheadline={str(block.fields.subheadline)}
              ctaText={str(block.fields.ctaText)}
              ctaUrl={str(block.fields.ctaUrl) || '#'}
            />
          );
        }

        if (contentTypeId === 'reviewsBlock') {
          const rawReviews = (block.fields.reviews as RawReview[] | undefined) ?? [];
          const reviews: Review[] = rawReviews.map((r) => ({
            id: r.sys.id,
            authorName: str(r.fields.authorName),
            authorTitle: str(r.fields.authorTitle),
            quote: str(r.fields.quote),
            starRating: num(r.fields.starRating),
          }));
          return (
            <ReviewsCarousel
              key={block.sys.id}
              title={str(block.fields.title)}
              reviews={reviews}
            />
          );
        }

        if (contentTypeId === 'leadCaptureBlock') {
          return (
            <LeadCaptureSection
              key={block.sys.id}
              title={str(block.fields.title)}
            />
          );
        }

        return null;
      })}
    </main>
  );
}
