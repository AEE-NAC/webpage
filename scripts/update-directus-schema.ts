#!/usr/bin/env npx tsx
import { loadEnv } from './load-env';

loadEnv();

async function getAccessToken(): Promise<{ token: string; origin: string }> {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const origin = new URL(directusUrl).origin;

  if (directusToken) {
    const probe = await fetch(`${origin}/fields/cms_content/content_type`, {
      headers: { Authorization: `Bearer ${directusToken}` },
    });
    if (probe.ok) {
      return { token: directusToken, origin };
    }
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

  return { token: accessToken, origin };
}

async function updateContentTypeLength() {
  const { token, origin } = await getAccessToken();

  const fieldResponse = await fetch(`${origin}/fields/cms_content/content_type`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!fieldResponse.ok) {
    const text = await fieldResponse.text();
    throw new Error(`Failed to fetch field schema: ${fieldResponse.status} ${text}`);
  }

  const fieldJson = (await fieldResponse.json().catch(() => ({}))) as any;
  const currentMax = fieldJson?.data?.schema?.max_length;

  if (currentMax && currentMax >= 10) {
    console.log(`content_type max_length already ${currentMax}, no update needed.`);
    return;
  }

  const patchResponse = await fetch(`${origin}/fields/cms_content/content_type`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schema: {
        max_length: 10,
      },
    }),
  });

  const patchJson = (await patchResponse.json().catch(() => ({}))) as any;
  if (!patchResponse.ok) {
    const err = patchJson?.errors?.[0]?.message || `${patchResponse.status} ${patchResponse.statusText}`;
    throw new Error(`Failed to update schema: ${err}`);
  }

  console.log('Updated cms_content.content_type max_length to 10.');
}

updateContentTypeLength().catch((error) => {
  console.error('Schema update failed:', error.message);
  process.exit(1);
});
