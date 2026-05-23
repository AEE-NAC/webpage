#!/usr/bin/env npx tsx
/**
 * Robust migration script: Supabase CMS -> Directus CMS
 *
 * Features:
 * - Exports source tables from Supabase
 * - Verifies Directus schemas before import
 * - Converts row-based multilingual data to translation arrays
 * - Handles required type/date conversions
 * - Imports in idempotent mode (skips existing by unique business key)
 * - Writes a migration report to temp/migration-export
 *
 * Usage:
 *   npx tsx scripts/migrate-supabase-to-directus.ts --all
 *   npx tsx scripts/migrate-supabase-to-directus.ts --export
 *   npx tsx scripts/migrate-supabase-to-directus.ts --import
 *   npx tsx scripts/migrate-supabase-to-directus.ts --all --dry-run
 *   npx tsx scripts/migrate-supabase-to-directus.ts --all --strict-schema
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

import { loadEnv } from './load-env';

loadEnv();

type JsonObject = Record<string, unknown>;

type SupabaseCMSContent = {
  id: string;
  key: string;
  language: string;
  country_code?: string | null;
  content_type: 'text' | 'image' | 'html' | string;
  value: string;
};

type SupabaseCMSPopover = {
  id: string;
  name: string;
  is_active?: boolean;
  start_at?: string | null;
  end_at?: string | null;
  frequency_hours?: number;
  language: string;
  country_code?: string | null;
  type?: 'template' | 'custom_html' | string;
  component_type?: 'modal' | 'banner' | string;
  target_pages?: string[] | null;
  title?: string | null;
  body?: string | null;
  image_url?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  raw_html?: string | null;
};

type SupabaseCMSWeeklyWord = {
  id: string;
  language: string;
  country_code?: string | null;
  title: string;
  content?: string | null;
  image_url?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  start_date: string;
  end_date: string;
};

type SupabaseCMSNewsletter = {
  id: string;
  language: string;
  country_code?: string | null;
  title: string;
  publication_date: string;
  pdf_url?: string | null;
};

type DirectusCMSContentPayload = {
  key: string;
  content_type: 'text' | 'image' | 'html';
  status: 'published' | 'draft';
  value?: string;
  translations: Array<{ languages_code: string; value: string }>;
};

type DirectusCMSPopoverPayload = {
  name: string;
  is_active: boolean;
  component_type: 'modal' | 'banner';
  target_pages: string[];
  start_at?: string | null;
  end_at?: string | null;
  status: 'published' | 'draft';
  translations: Array<{
    languages_code: string;
    title?: string;
    body?: string;
    cta_text?: string;
    cta_url?: string;
  }>;
};

type DirectusCMSWeeklyWordPayload = {
  start_date: string;
  end_date: string;
  status: 'published' | 'draft';
  translations: Array<{
    languages_code: string;
    title: string;
    content?: string;
    author_name?: string;
    author_role?: string;
  }>;
};

type DirectusCMSNewsletterPayload = {
  publication_date: string;
  status: 'published' | 'draft';
  translations: Array<{
    languages_code: string;
    title: string;
  }>;
};

type ExportData = {
  cmsContent: SupabaseCMSContent[];
  cmsPopovers: SupabaseCMSPopover[];
  cmsWeekly: SupabaseCMSWeeklyWord[];
  cmsNewsletters: SupabaseCMSNewsletter[];
};

type TransformedData = {
  cmsContent: DirectusCMSContentPayload[];
  cmsPopovers: DirectusCMSPopoverPayload[];
  cmsWeekly: DirectusCMSWeeklyWordPayload[];
  cmsNewsletters: DirectusCMSNewsletterPayload[];
  droppedRows: {
    countryScopedContent: number;
    countryScopedPopovers: number;
    countryScopedWeekly: number;
    countryScopedNewsletters: number;
    invalidKeys: number;
  };
};

type SchemaCheckResult = {
  collection: string;
  ok: boolean;
  missing: string[];
  found: string[];
};

type MigrationReport = {
  startedAt: string;
  finishedAt?: string;
  mode: string[];
  dryRun: boolean;
  strictSchema: boolean;
  schemaChecks: SchemaCheckResult[];
  exported: Record<string, number>;
  transformed: Record<string, number>;
  droppedRows: TransformedData['droppedRows'];
  importStats: Record<string, { created: number; skipped: number; failed: number }>;
  errors: string[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';
const adminUsername = process.env.ADMIN_USERNAME || '';
const adminPassword = process.env.ADMIN_PASSWORD || '';

const directusApi = `${new URL(directusUrl).origin}`;
const outputDir = path.join(process.cwd(), 'temp/migration-export');
const supabase = createClient(supabaseUrl, supabaseKey);
let runtimeDirectusToken = directusToken;

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const shouldExport = args.has('--export') || args.has('--all');
  const shouldImport = args.has('--import') || args.has('--all');
  const dryRun = args.has('--dry-run');
  const strictSchema = args.has('--strict-schema');

  return { shouldExport, shouldImport, dryRun, strictSchema, args: [...args] };
}

function ensureEnv(needsDirectus: boolean) {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!directusUrl) missing.push('NEXT_PUBLIC_DIRECTUS_URL');
  if (needsDirectus && !directusToken && !(adminUsername && adminPassword)) {
    missing.push('NEXT_PUBLIC_DIRECTUS_TOKEN or ADMIN_USERNAME/ADMIN_PASSWORD');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

function ensureOutputDir() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
}

function normalizeLangCode(lang: string): string {
  const map: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    es: 'es-ES',
    ht: 'ht-HT',
  };
  return map[lang] || lang;
}

function coerceContentType(value: string): 'text' | 'image' | 'html' {
  if (value === 'text' || value === 'image' || value === 'html') return value;
  return 'text';
}

function toIsoOrNull(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function toIsoOrNow(value?: string | null): string {
  const iso = toIsoOrNull(value);
  return iso || new Date().toISOString();
}

function isValidCmsKey(key: string): boolean {
  return /^[a-z0-9_.-]+$/i.test(key);
}

async function directusRequest<T = any>(
  method: 'GET' | 'POST',
  endpoint: string,
  body?: JsonObject,
  allowRetry = true
): Promise<T> {
  const response = await fetch(`${directusApi}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${runtimeDirectusToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json().catch(() => ({}))) as any;

  if (!response.ok) {
    const err = json?.errors?.[0]?.message || `${response.status} ${response.statusText}`;
    const isAuthError = response.status === 401 || String(err).toLowerCase().includes('invalid user credentials');

    if (allowRetry && isAuthError && adminUsername && adminPassword) {
      const loginResponse = await fetch(`${directusApi}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUsername, password: adminPassword }),
      });

      const loginJson = (await loginResponse.json().catch(() => ({}))) as any;
      const accessToken = loginJson?.data?.access_token as string | undefined;

      if (loginResponse.ok && accessToken) {
        runtimeDirectusToken = accessToken;
        return directusRequest<T>(method, endpoint, body, false);
      }
    }

    throw new Error(err);
  }

  return json as T;
}

async function fetchCollectionFields(collection: string): Promise<string[]> {
  const data = await directusRequest<{ data: Array<{ field: string }> }>('GET', `/fields/${collection}`);
  return (data.data || []).map((f) => f.field);
}

async function verifyDirectusSchema(strictSchema: boolean): Promise<SchemaCheckResult[]> {
  const expected: Record<string, string[]> = {
    cms_content: ['key', 'content_type', 'translations'],
    cms_popovers: ['name', 'is_active', 'component_type', 'target_pages', 'translations'],
    cms_weekly_words: ['start_date', 'end_date', 'translations'],
    cms_newsletters: ['publication_date', 'translations'],
  };

  const checks: SchemaCheckResult[] = [];

  for (const [collection, requiredFields] of Object.entries(expected)) {
    try {
      const found = await fetchCollectionFields(collection);
      const missing = requiredFields.filter((f) => !found.includes(f));
      const ok = missing.length === 0;
      checks.push({ collection, ok, missing, found });
    } catch (e: any) {
      checks.push({
        collection,
        ok: false,
        missing: requiredFields,
        found: [],
      });
      if (strictSchema) {
        throw new Error(`Schema check failed for ${collection}: ${e.message}`);
      }
    }
  }

  if (strictSchema) {
    const failed = checks.filter((c) => !c.ok);
    if (failed.length > 0) {
      const details = failed.map((f) => `${f.collection}: missing [${f.missing.join(', ')}]`).join('; ');
      throw new Error(`Strict schema verification failed: ${details}`);
    }
  }

  return checks;
}

async function exportFromSupabase(): Promise<ExportData> {
  console.log('Exporting source data from Supabase...');

  const [contentResult, popoversResult, weeklyResult, newslettersResult] = await Promise.all([
    supabase.from('cms_content').select('*'),
    supabase.from('cms_popovers').select('*'),
    supabase.from('cms_weekly_words').select('*'),
    supabase.from('cms_newsletters').select('*'),
  ]);

  if (contentResult.error) throw contentResult.error;
  if (popoversResult.error) throw popoversResult.error;
  if (weeklyResult.error) throw weeklyResult.error;
  if (newslettersResult.error) throw newslettersResult.error;

  const data: ExportData = {
    cmsContent: (contentResult.data || []) as SupabaseCMSContent[],
    cmsPopovers: (popoversResult.data || []) as SupabaseCMSPopover[],
    cmsWeekly: (weeklyResult.data || []) as SupabaseCMSWeeklyWord[],
    cmsNewsletters: (newslettersResult.data || []) as SupabaseCMSNewsletter[],
  };

  fs.writeFileSync(path.join(outputDir, '01_supabase_cms_content.json'), JSON.stringify(data.cmsContent, null, 2));
  fs.writeFileSync(path.join(outputDir, '02_supabase_cms_popovers.json'), JSON.stringify(data.cmsPopovers, null, 2));
  fs.writeFileSync(path.join(outputDir, '03_supabase_cms_weekly.json'), JSON.stringify(data.cmsWeekly, null, 2));
  fs.writeFileSync(path.join(outputDir, '04_supabase_cms_newsletters.json'), JSON.stringify(data.cmsNewsletters, null, 2));

  console.log(`Export complete: content=${data.cmsContent.length}, popovers=${data.cmsPopovers.length}, weekly=${data.cmsWeekly.length}, newsletters=${data.cmsNewsletters.length}`);

  return data;
}

function transformData(source: ExportData): TransformedData {
  const droppedRows = {
    countryScopedContent: 0,
    countryScopedPopovers: 0,
    countryScopedWeekly: 0,
    countryScopedNewsletters: 0,
    invalidKeys: 0,
  };

  const contentGroups = new Map<string, SupabaseCMSContent[]>();
  for (const row of source.cmsContent) {
    if (!isValidCmsKey(row.key)) {
      droppedRows.invalidKeys += 1;
      continue;
    }
    if (row.country_code) droppedRows.countryScopedContent += 1;
    const key = `${row.key}::${coerceContentType(row.content_type)}`;
    const list = contentGroups.get(key) || [];
    list.push(row);
    contentGroups.set(key, list);
  }

  const cmsContent: DirectusCMSContentPayload[] = [];
  for (const [groupKey, rows] of contentGroups.entries()) {
    const [key, contentType] = groupKey.split('::');
    const byLang = new Map<string, SupabaseCMSContent>();

    for (const row of rows) {
      const lang = normalizeLangCode(row.language);
      const previous = byLang.get(lang);
      if (!previous) {
        byLang.set(lang, row);
      } else {
        const prevIsCountry = Boolean(previous.country_code);
        const currentIsCountry = Boolean(row.country_code);
        if (prevIsCountry && !currentIsCountry) byLang.set(lang, row);
      }
    }

    const translations = [...byLang.entries()]
      .filter(([, row]) => (row.value || '').trim().length > 0)
      .map(([lang, row]) => ({ languages_code: lang, value: row.value }));

    if (translations.length === 0) continue;

    cmsContent.push({
      key,
      content_type: coerceContentType(contentType),
      status: 'published',
      value: translations[0].value,
      translations,
    });
  }

  const popoverGroups = new Map<string, SupabaseCMSPopover[]>();
  for (const row of source.cmsPopovers) {
    if (row.country_code) droppedRows.countryScopedPopovers += 1;
    const k = [row.name, row.component_type || 'modal', row.start_at || '', row.end_at || ''].join('::');
    const list = popoverGroups.get(k) || [];
    list.push(row);
    popoverGroups.set(k, list);
  }

  const cmsPopovers: DirectusCMSPopoverPayload[] = [];
  for (const rows of popoverGroups.values()) {
    const first = rows[0];
    const byLang = new Map<string, SupabaseCMSPopover>();

    for (const row of rows) {
      const lang = normalizeLangCode(row.language);
      const previous = byLang.get(lang);
      if (!previous) {
        byLang.set(lang, row);
      } else {
        const prevIsCountry = Boolean(previous.country_code);
        const currentIsCountry = Boolean(row.country_code);
        if (prevIsCountry && !currentIsCountry) byLang.set(lang, row);
      }
    }

    const translations = [...byLang.entries()].map(([lang, row]) => ({
      languages_code: lang,
      title: row.title || undefined,
      body: row.body || undefined,
      cta_text: row.cta_text || undefined,
      cta_url: row.cta_url || undefined,
    }));

    cmsPopovers.push({
      name: first.name,
      is_active: Boolean(first.is_active),
      component_type: first.component_type === 'banner' ? 'banner' : 'modal',
      target_pages: Array.isArray(first.target_pages) && first.target_pages.length > 0 ? first.target_pages : ['*'],
      start_at: toIsoOrNull(first.start_at),
      end_at: toIsoOrNull(first.end_at),
      status: 'published',
      translations,
    });
  }

  const weeklyGroups = new Map<string, SupabaseCMSWeeklyWord[]>();
  for (const row of source.cmsWeekly) {
    if (row.country_code) droppedRows.countryScopedWeekly += 1;
    const k = `${toIsoOrNow(row.start_date)}::${toIsoOrNow(row.end_date)}`;
    const list = weeklyGroups.get(k) || [];
    list.push(row);
    weeklyGroups.set(k, list);
  }

  const cmsWeekly: DirectusCMSWeeklyWordPayload[] = [];
  for (const [groupKey, rows] of weeklyGroups.entries()) {
    const [start_date, end_date] = groupKey.split('::');
    const byLang = new Map<string, SupabaseCMSWeeklyWord>();

    for (const row of rows) {
      const lang = normalizeLangCode(row.language);
      const previous = byLang.get(lang);
      if (!previous) {
        byLang.set(lang, row);
      } else {
        const prevIsCountry = Boolean(previous.country_code);
        const currentIsCountry = Boolean(row.country_code);
        if (prevIsCountry && !currentIsCountry) byLang.set(lang, row);
      }
    }

    const translations = [...byLang.entries()]
      .filter(([, row]) => (row.title || '').trim().length > 0)
      .map(([lang, row]) => ({
        languages_code: lang,
        title: row.title,
        content: row.content || undefined,
        author_name: row.author_name || undefined,
        author_role: row.author_role || undefined,
      }));

    if (translations.length === 0) continue;

    cmsWeekly.push({
      start_date,
      end_date,
      status: 'published',
      translations,
    });
  }

  const newsletterGroups = new Map<string, SupabaseCMSNewsletter[]>();
  for (const row of source.cmsNewsletters) {
    if (row.country_code) droppedRows.countryScopedNewsletters += 1;
    const pub = toIsoOrNow(row.publication_date);
    const k = `${pub}`;
    const list = newsletterGroups.get(k) || [];
    list.push(row);
    newsletterGroups.set(k, list);
  }

  const cmsNewsletters: DirectusCMSNewsletterPayload[] = [];
  for (const [publication_date, rows] of newsletterGroups.entries()) {
    const byLang = new Map<string, SupabaseCMSNewsletter>();

    for (const row of rows) {
      const lang = normalizeLangCode(row.language);
      const previous = byLang.get(lang);
      if (!previous) {
        byLang.set(lang, row);
      } else {
        const prevIsCountry = Boolean(previous.country_code);
        const currentIsCountry = Boolean(row.country_code);
        if (prevIsCountry && !currentIsCountry) byLang.set(lang, row);
      }
    }

    const translations = [...byLang.entries()]
      .filter(([, row]) => (row.title || '').trim().length > 0)
      .map(([lang, row]) => ({ languages_code: lang, title: row.title }));

    if (translations.length === 0) continue;

    cmsNewsletters.push({
      publication_date,
      status: 'published',
      translations,
    });
  }

  fs.writeFileSync(path.join(outputDir, '11_directus_cms_content.json'), JSON.stringify(cmsContent, null, 2));
  fs.writeFileSync(path.join(outputDir, '12_directus_cms_popovers.json'), JSON.stringify(cmsPopovers, null, 2));
  fs.writeFileSync(path.join(outputDir, '13_directus_cms_weekly.json'), JSON.stringify(cmsWeekly, null, 2));
  fs.writeFileSync(path.join(outputDir, '14_directus_cms_newsletters.json'), JSON.stringify(cmsNewsletters, null, 2));

  return { cmsContent, cmsPopovers, cmsWeekly, cmsNewsletters, droppedRows };
}

async function findExistingByFilter(collection: string, filter: JsonObject): Promise<any | null> {
  const query = encodeURIComponent(JSON.stringify(filter));
  const fields = encodeURIComponent('id');
  const data = await directusRequest<{ data: any[] }>(
    'GET',
    `/items/${collection}?filter=${query}&fields=${fields}&limit=1`
  );
  return data?.data?.[0] || null;
}

async function importCollection(
  collection: string,
  items: JsonObject[],
  uniqueFilterBuilder: (item: JsonObject) => JsonObject,
  dryRun: boolean,
  report: MigrationReport
) {
  const stats = { created: 0, skipped: 0, failed: 0 };
  const total = items.length;
  console.log(`Importing ${collection} (${total} items)...`);
  let processed = 0;

  for (const item of items) {
    processed += 1;
    try {
      const filter = uniqueFilterBuilder(item);
      const existing = await findExistingByFilter(collection, filter);
      if (existing) {
        stats.skipped += 1;
        continue;
      }

      if (dryRun) {
        stats.created += 1;
        continue;
      }

      await directusRequest('POST', `/items/${collection}`, item);
      stats.created += 1;
    } catch (e: any) {
      const label =
        (item as any).key ||
        (item as any).name ||
        (item as any).publication_date ||
        (item as any).start_date ||
        'unknown';
      stats.failed += 1;
      report.errors.push(`${collection} (${label}): ${e.message}`);
    }

    if (processed % 25 === 0 || processed === total) {
      console.log(`- ${collection}: processed ${processed}/${total}`);
    }
  }

  report.importStats[collection] = stats;
}

function loadExportFromDisk(): ExportData {
  return {
    cmsContent: JSON.parse(fs.readFileSync(path.join(outputDir, '01_supabase_cms_content.json'), 'utf-8')),
    cmsPopovers: JSON.parse(fs.readFileSync(path.join(outputDir, '02_supabase_cms_popovers.json'), 'utf-8')),
    cmsWeekly: JSON.parse(fs.readFileSync(path.join(outputDir, '03_supabase_cms_weekly.json'), 'utf-8')),
    cmsNewsletters: JSON.parse(fs.readFileSync(path.join(outputDir, '04_supabase_cms_newsletters.json'), 'utf-8')),
  };
}

async function main() {
  const { shouldExport, shouldImport, dryRun, strictSchema, args } = parseArgs();

  console.log('============================================================');
  console.log('Supabase -> Directus CMS Data Migration');
  console.log('============================================================');

  if (!shouldExport && !shouldImport) {
    console.log('Usage: npx tsx scripts/migrate-supabase-to-directus.ts [--export] [--import] [--all] [--dry-run] [--strict-schema]');
    process.exit(0);
  }

  ensureEnv(shouldImport);
  ensureOutputDir();

  const report: MigrationReport = {
    startedAt: new Date().toISOString(),
    mode: args,
    dryRun,
    strictSchema,
    schemaChecks: [],
    exported: {},
    transformed: {},
    droppedRows: {
      countryScopedContent: 0,
      countryScopedPopovers: 0,
      countryScopedWeekly: 0,
      countryScopedNewsletters: 0,
      invalidKeys: 0,
    },
    importStats: {},
    errors: [],
  };

  try {
    if (shouldImport) {
      report.schemaChecks = await verifyDirectusSchema(strictSchema);
    }

    let exported: ExportData;
    if (shouldExport) {
      exported = await exportFromSupabase();
    } else {
      exported = loadExportFromDisk();
      console.log('Loaded previously exported Supabase files.');
    }

    report.exported = {
      cms_content: exported.cmsContent.length,
      cms_popovers: exported.cmsPopovers.length,
      cms_weekly_words: exported.cmsWeekly.length,
      cms_newsletters: exported.cmsNewsletters.length,
    };

    const transformed = transformData(exported);

    report.transformed = {
      cms_content: transformed.cmsContent.length,
      cms_popovers: transformed.cmsPopovers.length,
      cms_weekly_words: transformed.cmsWeekly.length,
      cms_newsletters: transformed.cmsNewsletters.length,
    };
    report.droppedRows = transformed.droppedRows;

    console.log('Transformation summary:');
    console.log(`- cms_content: ${report.exported.cms_content} -> ${report.transformed.cms_content}`);
    console.log(`- cms_popovers: ${report.exported.cms_popovers} -> ${report.transformed.cms_popovers}`);
    console.log(`- cms_weekly_words: ${report.exported.cms_weekly_words} -> ${report.transformed.cms_weekly_words}`);
    console.log(`- cms_newsletters: ${report.exported.cms_newsletters} -> ${report.transformed.cms_newsletters}`);

    if (shouldImport) {
      console.log(dryRun ? 'Dry-run import mode enabled.' : 'Importing into Directus...');

      await importCollection(
        'cms_content',
        transformed.cmsContent as unknown as JsonObject[],
        (item) => ({ key: { _eq: String(item.key || '') } }),
        dryRun,
        report
      );

      await importCollection(
        'cms_popovers',
        transformed.cmsPopovers as unknown as JsonObject[],
        (item) => ({ name: { _eq: String(item.name || '') } }),
        dryRun,
        report
      );

      await importCollection(
        'cms_weekly_words',
        transformed.cmsWeekly as unknown as JsonObject[],
        (item) => ({
          _and: [
            { start_date: { _eq: String(item.start_date || '') } },
            { end_date: { _eq: String(item.end_date || '') } },
          ],
        }),
        dryRun,
        report
      );

      await importCollection(
        'cms_newsletters',
        transformed.cmsNewsletters as unknown as JsonObject[],
        (item) => ({ publication_date: { _eq: String(item.publication_date || '') } }),
        dryRun,
        report
      );
    }

    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(outputDir, '99_migration_report.json'), JSON.stringify(report, null, 2));

    console.log('Import stats:');
    for (const [collection, stats] of Object.entries(report.importStats)) {
      console.log(`- ${collection}: created=${stats.created}, skipped=${stats.skipped}, failed=${stats.failed}`);
    }

    if (report.errors.length > 0) {
      console.log(`Migration finished with ${report.errors.length} non-fatal errors.`);
      console.log(`See ${path.join(outputDir, '99_migration_report.json')} for details.`);
    } else {
      console.log('Migration finished successfully without errors.');
    }
  } catch (e: any) {
    report.errors.push(e.message);
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(outputDir, '99_migration_report.json'), JSON.stringify(report, null, 2));
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

main();
