import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLandingPageBySlug } from '@/lib/contentful';
import HeroBlock from '@/components/HeroBlock';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import type { Review } from '@/components/ReviewsCarousel';
import LeadCaptureSection from '@/components/LeadCaptureSection';
import ProductsBlock from '@/components/ProductsBlock';
import type { Product } from '@/components/ProductCard';

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const page = await getLandingPageBySlug(params.slug).catch(() => null);

  const title = str(page?.fields.seoTitle) || 'SnackOverflow';
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

function assetUrl(val: unknown): string | undefined {
  if (!val || typeof val !== 'object') return undefined;
  const file = ((val as Record<string, unknown>).fields as Record<string, unknown> | undefined)?.file as Record<string, unknown> | undefined;
  const url = file?.url as string | undefined;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
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
          const headline = str(block.fields.headline);
          if (!headline) return null;
          return (
            <HeroBlock
              key={block.sys.id}
              headline={headline}
              subheadline={str(block.fields.subheadline) || undefined}
              ctaText={str(block.fields.ctaText) || undefined}
              ctaUrl={str(block.fields.ctaUrl) || undefined}
              backgroundImageUrl={assetUrl(block.fields.backgroundImage)}
            />
          );
        }

        if (contentTypeId === 'reviewsBlock') {
          const rawReviews = (block.fields.reviews as RawReview[] | undefined) ?? [];
          const reviews: Review[] = rawReviews
            .filter((r) => r.fields)
            .filter((r) => str(r.fields.authorName) && num(r.fields.starRating) > 0)
            .map((r) => ({
              id: r.sys.id,
              authorName: str(r.fields.authorName),
              starRating: num(r.fields.starRating),
              authorTitle: str(r.fields.authorTitle) || undefined,
              quote: str(r.fields.quote) || undefined,
            }));
          return (
            <ReviewsCarousel
              key={block.sys.id}
              title={str(block.fields.title) || undefined}
              reviews={reviews}
            />
          );
        }

        if (contentTypeId === 'leadCaptureBlock') {
          return (
            <LeadCaptureSection
              key={block.sys.id}
              title={str(block.fields.title) || undefined}
            />
          );
        }

        if (contentTypeId === 'productsBlock') {
          const rawProducts = (block.fields.products as RawReview[] | undefined) ?? [];
          const products: Product[] = rawProducts
            .filter((p) => p.fields)
            .filter((p) => str(p.fields.productTitle))
            .map((p) => ({
              id: p.sys.id,
              productTitle: str(p.fields.productTitle),
              productDescription: str(p.fields.productDescription) || undefined,
            }));
          return (
            <ProductsBlock
              key={block.sys.id}
              title={str(block.fields.title) || undefined}
              products={products}
            />
          );
        }

        return null;
      })}
    </main>
  );
}
