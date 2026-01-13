import { MetadataRoute } from 'next';
import { locales } from '@/context/adapt';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
    : "http://localhost:3000";

  // List your static routes here
  const routes = [
    '',
    '/about',
    '/staff',
    '/ministry',
    '/implicate',
    '/donate',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
