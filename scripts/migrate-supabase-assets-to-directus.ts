#!/usr/bin/env npx tsx
import { loadEnv } from './load-env';
import * as fs from 'fs';
import * as path from 'path';

loadEnv();

type AssetMap = Record<string, { fileId: string; assetUrl: string }>;

const outputDir = path.join(process.cwd(), 'temp', 'migration-export');
const assetMapPath = path.join(outputDir, '20_directus_asset_map.json');
const supabaseStoragePattern = /supabase\.co\/storage\/v1\/object\/public\//i;

async function getAccessToken(): Promise<{ token: string; origin: string }> {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const origin = new URL(directusUrl).origin;

  if (directusToken) {
    const probe = await fetch(`${origin}/items/cms_content?limit=1`, {
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

function loadAssetMap(): AssetMap {
  if (!fs.existsSync(assetMapPath)) return {};
  return JSON.parse(fs.readFileSync(assetMapPath, 'utf-8')) as AssetMap;
}

function saveAssetMap(map: AssetMap) {
  fs.writeFileSync(assetMapPath, JSON.stringify(map, null, 2));
}

function extractFilename(url: string): string {
  const pathname = new URL(url).pathname;
  const name = decodeURIComponent(pathname.split('/').pop() || 'file');
  return name || 'file';
}

async function uploadToDirectus(url: string, token: string, origin: string): Promise<{ fileId: string; assetUrl: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const filename = extractFilename(url);

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }), filename);

  const uploadResponse = await fetch(`${origin}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const uploadJson = (await uploadResponse.json().catch(() => ({}))) as any;
  if (!uploadResponse.ok) {
    const err = uploadJson?.errors?.[0]?.message || `${uploadResponse.status} ${uploadResponse.statusText}`;
    throw new Error(`Failed to upload ${url}: ${err}`);
  }

  const fileId = uploadJson?.data?.id as string | undefined;
  if (!fileId) {
    throw new Error(`Upload response missing file id for ${url}`);
  }

  return { fileId, assetUrl: `${origin}/assets/${fileId}` };
}

async function buildAssetMap(token: string, origin: string): Promise<AssetMap> {
  const existing = loadAssetMap();
  const urls = new Set<string>();

  const cmsContent = JSON.parse(
    fs.readFileSync(path.join(outputDir, '11_directus_cms_content.json'), 'utf-8')
  ) as Array<{ content_type: string; value?: string; translations?: Array<{ value?: string }> }>;

  for (const item of cmsContent) {
    if (item.content_type !== 'image') continue;
    if (item.value && supabaseStoragePattern.test(item.value)) urls.add(item.value);
    for (const tr of item.translations || []) {
      if (tr.value && supabaseStoragePattern.test(tr.value)) urls.add(tr.value);
    }
  }

  const newsletters = JSON.parse(
    fs.readFileSync(path.join(outputDir, '04_supabase_cms_newsletters.json'), 'utf-8')
  ) as Array<{ pdf_url?: string | null }>;

  for (const row of newsletters) {
    if (row.pdf_url && supabaseStoragePattern.test(row.pdf_url)) urls.add(row.pdf_url);
  }

  const list = [...urls];
  console.log(`Found ${list.length} Supabase assets to migrate.`);

  for (const url of list) {
    if (existing[url]) continue;
    console.log(`Uploading ${url}`);
    const uploaded = await uploadToDirectus(url, token, origin);
    existing[url] = uploaded;
    saveAssetMap(existing);
  }

  return existing;
}

async function updateCmsContentAssets(token: string, origin: string, map: AssetMap) {
  const response = await fetch(`${origin}/items/cms_content?fields=id,key,value,translations.id,translations.languages_code,translations.value&limit=-1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    const err = json?.errors?.[0]?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Failed to fetch cms_content: ${err}`);
  }

  const items = json?.data || [];
  let updated = 0;

  for (const item of items) {
    let changed = false;
    const payload: any = {};

    if (item.value && map[item.value]) {
      payload.value = map[item.value].assetUrl;
      changed = true;
    }

    if (Array.isArray(item.translations)) {
      const translations = [];
      for (const tr of item.translations) {
        if (tr.value && map[tr.value]) {
          translations.push({ id: tr.id, value: map[tr.value].assetUrl });
          changed = true;
        }
      }
      if (translations.length > 0) payload.translations = translations;
    }

    if (!changed) continue;

    const patchResponse = await fetch(`${origin}/items/cms_content/${item.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const patchJson = (await patchResponse.json().catch(() => ({}))) as any;
    if (!patchResponse.ok) {
      const err = patchJson?.errors?.[0]?.message || `${patchResponse.status} ${patchResponse.statusText}`;
      throw new Error(`Failed to update cms_content ${item.id}: ${err}`);
    }

    updated += 1;
  }

  console.log(`Updated ${updated} cms_content records with Directus asset URLs.`);
}

async function updateNewsletterPdfs(token: string, origin: string, map: AssetMap) {
  const supabaseRows = JSON.parse(
    fs.readFileSync(path.join(outputDir, '04_supabase_cms_newsletters.json'), 'utf-8')
  ) as Array<{ publication_date: string; pdf_url?: string | null }>;

  const byPublicationDate = new Map<string, string>();
  for (const row of supabaseRows) {
    if (!row.pdf_url) continue;
    const pub = new Date(row.publication_date).toISOString();
    if (!byPublicationDate.has(pub)) {
      byPublicationDate.set(pub, row.pdf_url);
    }
  }

  const response = await fetch(`${origin}/items/cms_newsletters?fields=id,publication_date&limit=-1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    const err = json?.errors?.[0]?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Failed to fetch cms_newsletters: ${err}`);
  }

  const items = json?.data || [];
  let updated = 0;

  for (const item of items) {
    const pub = item.publication_date ? new Date(item.publication_date).toISOString() : '';
    const pdfUrl = byPublicationDate.get(pub || '');
    if (!pdfUrl || !map[pdfUrl]) continue;

    const patchResponse = await fetch(`${origin}/items/cms_newsletters/${item.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf_file: map[pdfUrl].fileId }),
    });

    const patchJson = (await patchResponse.json().catch(() => ({}))) as any;
    if (!patchResponse.ok) {
      const err = patchJson?.errors?.[0]?.message || `${patchResponse.status} ${patchResponse.statusText}`;
      throw new Error(`Failed to update cms_newsletters ${item.id}: ${err}`);
    }

    updated += 1;
  }

  console.log(`Updated ${updated} cms_newsletters records with Directus pdf_file.`);
}

async function main() {
  const { token, origin } = await getAccessToken();
  const map = await buildAssetMap(token, origin);
  await updateCmsContentAssets(token, origin, map);
  await updateNewsletterPdfs(token, origin, map);
}

main().catch((error) => {
  console.error('Asset migration failed:', error.message);
  process.exit(1);
});
