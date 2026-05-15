import { createClient, EntryFieldTypes, Entry, EntrySkeletonType } from 'contentful';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
});

// ---------- Entry Skeletons (contentful v10+ pattern) ----------

export interface ReviewSkeleton extends EntrySkeletonType {
  contentTypeId: 'review';
  fields: {
    authorName: EntryFieldTypes.Symbol;
    authorTitle: EntryFieldTypes.Symbol;
    quote: EntryFieldTypes.Text;
    starRating: EntryFieldTypes.Integer;
  };
}

export interface HeroBlockSkeleton extends EntrySkeletonType {
  contentTypeId: 'heroBlock';
  fields: {
    headline: EntryFieldTypes.Symbol;
    subheadline: EntryFieldTypes.Symbol;
    ctaText: EntryFieldTypes.Symbol;
    ctaUrl: EntryFieldTypes.Symbol;
  };
}

export interface ReviewsBlockSkeleton extends EntrySkeletonType {
  contentTypeId: 'reviewsBlock';
  fields: {
    title: EntryFieldTypes.Symbol;
    reviews: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ReviewSkeleton>>;
  };
}

export interface LeadCaptureBlockSkeleton extends EntrySkeletonType {
  contentTypeId: 'leadCaptureBlock';
  fields: {
    title: EntryFieldTypes.Symbol;
  };
}

export interface LandingPageSkeleton extends EntrySkeletonType {
  contentTypeId: 'landingPage';
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    seoTitle: EntryFieldTypes.Symbol;
    seoDescription: EntryFieldTypes.Text;
    blocks: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<HeroBlockSkeleton | ReviewsBlockSkeleton | LeadCaptureBlockSkeleton>
    >;
  };
}

// ---------- Typed Entry aliases ----------

export type HeroBlockEntry = Entry<HeroBlockSkeleton>;
export type ReviewsBlockEntry = Entry<ReviewsBlockSkeleton>;
export type ReviewEntry = Entry<ReviewSkeleton>;
export type LandingPageEntry = Entry<LandingPageSkeleton>;

// ---------- Fetch helpers ----------

export async function getLandingPageBySlug(
  slug: string,
  preview = false
): Promise<LandingPageEntry | null> {
  const client = preview ? contentfulPreviewClient : contentfulClient;

  const result = await client.getEntries<LandingPageSkeleton>({
    content_type: 'landingPage',
    'fields.slug': slug,
    include: 3,
    limit: 1,
  });

  return (result.items[0] as LandingPageEntry) ?? null;
}

export async function getAllLandingPageSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const result = await contentfulClient.getEntries<LandingPageSkeleton>({
    content_type: 'landingPage',
    select: ['fields.slug', 'sys.updatedAt'],
    limit: 1000,
  });

  return result.items.map((item) => ({
    slug: typeof item.fields.slug === 'string' ? item.fields.slug : '',
    updatedAt: item.sys.updatedAt,
  }));
}
