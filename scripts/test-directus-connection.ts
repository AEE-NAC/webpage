#!/usr/bin/env npx tsx
/**
 * Test Script: Vérifier la Connexion Directus
 * 
 * Ce script teste que votre frontend peut communiquer avec Directus
 * 
 * Usage:
 *   npx tsx scripts/test-directus-connection.ts
 */

import { loadEnv } from './load-env';

loadEnv();

async function testConnection() {
  await ensureDirectusToken();
  const { CMSService } = await import('@/services/directus.conf');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Testing Directus Connection                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const tests = [
    {
      name: 'French Home Content',
      fn: () => CMSService.getPageContent('', 'fr-FR'),
      expectMinKeys: 1
    },
    {
      name: 'English About Content',
      fn: () => CMSService.getPageContent('about', 'en-US'),
      expectMinKeys: 0
    },
    {
      name: 'Haiti Regional Content',
      fn: () => CMSService.getPageContent('', 'fr-FR', 'HT'),
      expectMinKeys: 0
    },
    {
      name: 'Spanish Contact Content',
      fn: () => CMSService.getPageContent('contact', 'es-ES'),
      expectMinKeys: 0
    },
    {
      name: 'Creole Navigation',
      fn: () => CMSService.getPageContent('nav', 'ht-HT'),
      expectMinKeys: 1
    },
    {
      name: 'Active Popovers (FR)',
      fn: () => CMSService.getActivePopovers('fr-FR', 'HT'),
      expectMinItems: 0
    },
    {
      name: 'Weekly Words (EN)',
      fn: () => CMSService.getWeeklyWords('en-US'),
      expectMinItems: 0
    },
    {
      name: 'Newsletters (FR)',
      fn: () => CMSService.getNewsletters('fr-FR'),
      expectMinItems: 0
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();

      if (Array.isArray(result)) {
        const itemCount = result.length;
        const success = itemCount >= (test.expectMinItems || 0);
        console.log(
          `${success ? '✅' : '⚠️ '} ${test.name}`,
          `(${itemCount} items)`
        );
        if (success) passed++;
        else failed++;
      } else {
        const keyCount = Object.keys(result).length;
        const success = keyCount >= (test.expectMinKeys ?? 0);
        console.log(
          `${success ? '✅' : '⚠️ '} ${test.name}`,
          `(${keyCount} keys)`
        );
        if (success) passed++;
        else failed++;

        if (keyCount > 0 && keyCount <= 5) {
          console.log('   Sample keys:', Object.keys(result).slice(0, 3).join(', '));
        }
      }
    } catch (error: any) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║  Results: ${passed} passed, ${failed} failed                                 ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝\n`);

  if (failed === 0) {
    console.log('✅ All tests passed! Your Directus setup is working.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check your Directus setup.\n');
    console.log('Troubleshooting:');
    console.log('1. Verify NEXT_PUBLIC_DIRECTUS_URL and NEXT_PUBLIC_DIRECTUS_TOKEN in .env.local');
    console.log('2. Check that Directus server is running and accessible');
    console.log('3. Verify collections exist: cms_content, cms_popovers, etc.');
    console.log('4. Check public role permissions in Directus\n');
    process.exit(1);
  }
}

async function ensureDirectusToken() {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const origin = new URL(directusUrl).origin;

  if (directusToken) {
    const probe = await fetch(`${origin}/items/cms_content?limit=1`, {
      headers: { Authorization: `Bearer ${directusToken}` },
    });
    if (probe.ok) return;
  }

  if (!adminUsername || !adminPassword) {
    throw new Error('Directus token invalid and ADMIN_USERNAME/ADMIN_PASSWORD are missing.');
  }

  const loginResponse = await fetch(`${origin}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminUsername, password: adminPassword }),
  });

  const loginJson = (await loginResponse.json().catch(() => ({}))) as any;
  const accessToken = loginJson?.data?.access_token as string | undefined;

  if (!loginResponse.ok || !accessToken) {
    const err = loginJson?.errors?.[0]?.message || `${loginResponse.status} ${loginResponse.statusText}`;
    throw new Error(`Directus login failed: ${err}`);
  }

  process.env.NEXT_PUBLIC_DIRECTUS_TOKEN = accessToken;
}

testConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
