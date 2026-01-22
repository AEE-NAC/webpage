import { MetadataRoute } from 'next';
import { locales, SUPPORTED_COUNTRIES } from '@/context/adapt';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
    : "http://localhost:3000";

  // Liste exhaustive des routes statiques par langue
  const staticRoutes = [
    '',
    '/about',
    '/staff',
    '/ministry',
    '/implicate',
    '/donation',
    '/join',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Génération des routes globales (ex: /fr/about)
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // 2. Génération des routes spécifiques aux pays (ex: /fr/HT et /fr/HT/staff)
  SUPPORTED_COUNTRIES.forEach((country) => {
    const countryCode = country.code.toLowerCase();
    locales.forEach((locale) => {
      // Page d'accueil du pays
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/${countryCode}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
      // Page Staff du pays
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/${countryCode}/staff`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
