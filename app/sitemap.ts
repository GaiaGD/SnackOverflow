import type { MetadataRoute } from 'next';
import { getAllLandingPageSlugs } from '@/lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
  const slugs = await getAllLandingPageSlugs();

  const landingPages = slugs
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    ...landingPages,
  ];
}
