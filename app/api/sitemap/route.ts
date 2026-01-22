import { NextResponse } from 'next/server';
import { locales, SUPPORTED_COUNTRIES } from '@/context/adapt';

export async function GET() {
  const staticRoutes = ['', '/about', '/staff', '/ministry', '/implicate', '/donation', '/join', '/contact'];
  const paths: string[] = [];

  // Routes globales par langue
  staticRoutes.forEach(route => {
    locales.forEach(locale => paths.push(`/${locale}${route}`));
  });

  // Routes par pays
  SUPPORTED_COUNTRIES.forEach(country => {
    const code = country.code.toLowerCase();
    locales.forEach(locale => {
      paths.push(`/${locale}/${code}`);
      paths.push(`/${locale}/${code}/staff`);
    });
  });

  return NextResponse.json({ paths: Array.from(new Set(paths)) });
}
