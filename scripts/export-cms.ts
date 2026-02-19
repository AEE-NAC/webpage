/**
 * export-cms.ts
 *
 * Exports CMS content from Supabase to local JSON translation files.
 * Files are saved in temp/translations/ and are human-friendly for offline editing.
 *
 * USAGE:
 *   npm run cms:export                        → export all languages, all keys
 *   npm run cms:export -- --lang fr           → only French
 *   npm run cms:export -- --lang fr,ht        → French + Haitian Creole
 *   npm run cms:export -- --page home         → only keys starting with "home."
 *   npm run cms:export -- --lang fr --page about
 *   npm run cms:export -- --country HT        → country-specific rows only
 *
 * OUTPUT FORMAT (temp/translations/fr.json):
 * {
 *   "_meta": { "language": "fr", "country_code": null, "exported_at": "..." },
 *   "nav.home":        { "value": "Accueil",   "ref": "Home",   "type": "text" },
 *   "home.hero.title": { "value": "...",        "ref": "...",    "type": "text" },
 *   ...
 * }
 *
 * "ref" is always the English (EN global) value — useful as reference while translating.
 * Keys where "value" is empty or missing are the ones that still need translation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// 1. CREDENTIALS  (same resolver as fix-indexing / index-cms)
// ---------------------------------------------------------------------------

const CONF_PATH = path.join(process.cwd(), 'services', 'supabase.conf.ts');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  for (const envFile of ['.env.local', '.env', '.env.development', '.env.production']) {
    const envPath = path.join(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf-8');
    if (!supabaseUrl) {
      const m = content.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)$/m);
      if (m) supabaseUrl = m[1].trim().replace(/^['"]|['"]$/g, '');
    }
    if (!supabaseKey) {
      const s = content.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)$/m);
      const a = content.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)$/m);
      if (s) supabaseKey = s[1].trim().replace(/^['"]|['"]$/g, '');
      else if (a) supabaseKey = a[1].trim().replace(/^['"]|['"]$/g, '');
    }
    if (supabaseUrl && supabaseKey) break;
  }
}

if (!supabaseUrl || !supabaseKey) {
  try {
    if (fs.existsSync(CONF_PATH)) {
      const conf = fs.readFileSync(CONF_PATH, 'utf-8');
      if (!supabaseUrl) {
        const m = conf.match(/:\s*['"]([^'"]*supabase\.co[^'"]*)['"]/);
        if (m) supabaseUrl = m[1];
      }
      if (!supabaseKey) {
        const m = conf.match(/:\s*'(eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*)'/);
        if (m) supabaseKey = m[1];
      }
    }
  } catch { /* ignore */ }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Cannot find Supabase credentials. Add them to .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// 2. CLI ARGS
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const getArg = (flag: string): string | null => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const ALL_LANGS = ['en', 'fr', 'es', 'ht'];
const langArg  = getArg('--lang');
const pageArg  = getArg('--page');
const countryArg = getArg('--country');

const targetLangs: string[] = langArg
  ? langArg.split(',').map(l => l.trim().toLowerCase())
  : ALL_LANGS;

const OUTPUT_DIR = path.join(process.cwd(), 'temp', 'translations');

// ---------------------------------------------------------------------------
// 3. MAIN
// ---------------------------------------------------------------------------

interface DBRow {
  key: string;
  language: string;
  country_code: string | null;
  content_type: string;
  value: string;
}

const exportCMS = async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║              CMS Export — Translation            ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log(`  Languages : ${targetLangs.join(', ')}`);
  if (pageArg)    console.log(`  Page filter: ${pageArg}.*`);
  if (countryArg) console.log(`  Country   : ${countryArg}`);
  console.log('');

  // ── Fetch all rows we need ──────────────────────────────────────────────
  let query = supabase
    .from('cms_content')
    .select('key, language, country_code, content_type, value')
    .in('language', [...targetLangs, 'en']); // always include EN as reference

  if (pageArg) {
    query = query.ilike('key', `${pageArg}.%`);
  }

  if (countryArg) {
    // include both global rows AND country-specific rows
    query = query.or(`country_code.is.null,country_code.eq.${countryArg.toUpperCase()}`);
  } else {
    query = query.is('country_code', null);
  }

  const { data, error } = await query.order('key');

  if (error) {
    console.error('❌  DB error:', error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as DBRow[];
  console.log(`📦  Loaded ${rows.length} row(s) from Supabase.\n`);

  if (rows.length === 0) {
    console.log('⚠️  Nothing to export. Check your filters.');
    process.exit(0);
  }

  // ── Build EN reference map ──────────────────────────────────────────────
  const enRef = new Map<string, string>();
  rows
    .filter(r => r.language === 'en' && !r.country_code)
    .forEach(r => enRef.set(r.key, r.value));

  // ── Group by (language, country_code) ──────────────────────────────────
  const groups = new Map<string, DBRow[]>();

  for (const row of rows) {
    const fileKey = row.country_code
      ? `${row.language}.${row.country_code.toUpperCase()}`
      : row.language;
    if (!groups.has(fileKey)) groups.set(fileKey, []);
    groups.get(fileKey)!.push(row);
  }

  // ── Write files ────────────────────────────────────────────────────────
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let totalFiles = 0;
  let totalKeys  = 0;
  let missingTranslations = 0;

  for (const [fileKey, fileRows] of groups) {
    // Skip writing a pure EN global file if the user only asked for other langs —
    // but always write it when explicitly requested or when exporting all
    const [lang] = fileKey.split('.');
    if (lang === 'en' && !targetLangs.includes('en') && targetLangs.length > 0) continue;

    const filePath = path.join(OUTPUT_DIR, `${fileKey}.json`);

    // Build the payload
    const [fileLang, fileCountry] = fileKey.split('.');

    const payload: Record<string, any> = {
      _meta: {
        language: fileLang,
        country_code: fileCountry ?? null,
        page_filter: pageArg ?? 'all',
        exported_at: new Date().toISOString(),
        total_keys: fileRows.length,
        instructions: [
          'Edit the "value" field with your translation.',
          '"ref" is the English source — do not edit it.',
          '"type" is the content type: text | image | html.',
          'Run `npm run cms:save` to push changes back to Supabase.',
        ],
      },
    };

    let missing = 0;
    for (const row of fileRows) {
      const ref = enRef.get(row.key) ?? '';
      const isEmpty = !row.value || row.value === ref;
      payload[row.key] = {
        value: row.value ?? '',
        ref,
        type: row.content_type,
        ...(isEmpty && fileLang !== 'en' ? { _todo: true } : {}),
      };
      if (isEmpty && fileLang !== 'en') missing++;
    }

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');

    totalFiles++;
    totalKeys += fileRows.length;
    missingTranslations += missing;

    const pct = fileRows.length > 0
      ? Math.round(((fileRows.length - missing) / fileRows.length) * 100)
      : 100;

    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    console.log(`  ✅  ${fileKey}.json  [${bar}] ${pct}%  (${fileRows.length - missing}/${fileRows.length} translated)`);
    if (missing > 0) console.log(`       ⚠️  ${missing} key(s) marked with "_todo: true" need translation`);
  }

  console.log(`\n  📁  Files saved to: ${OUTPUT_DIR}`);
  console.log(`  📊  ${totalFiles} file(s)  •  ${totalKeys} key(s)  •  ${missingTranslations} still need translation`);
  console.log('\n  ℹ️   Edit the "value" fields, then run `npm run cms:save` to push back.\n');
};

exportCMS().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
