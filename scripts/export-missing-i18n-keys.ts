/**
 * export-missing-i18n-keys.ts
 *
 * Scans all CMS keys in Supabase and reports which ones are missing a translation
 * in one or more of the 4 supported languages (en, fr, es, ht).
 *
 * A translation is considered MISSING when:
 *   - The row doesn't exist at all for that language, OR
 *   - The row exists but the value is empty / null
 *
 * USAGE:
 *   npm run cms:missing                     → all keys, all languages
 *   npm run cms:missing -- --page about     → only keys starting with "about."
 *   npm run cms:missing -- --lang fr,ht     → only report gaps in fr and ht
 *
 * OUTPUT FILE:
 *   temp/missing-i18n.json
 *
 * OUTPUT FORMAT:
 * {
 *   "_meta": { "exported_at": "...", "total_missing": 42, ... },
 *   "nav.home": {
 *     "ref":       "Home",
 *     "type":      "text",
 *     "missing":   ["ht", "es"],
 *     "available": { "en": "Home", "fr": "Accueil" }
 *   },
 *   ...
 * }
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// 1. CREDENTIALS (same resolver used across all CMS scripts)
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

const ALL_LANGS = ['en', 'fr', 'es', 'ht'];

const args = process.argv.slice(2);
const getArg = (flag: string): string | null => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const pageArg = getArg('--page');
const langArg = getArg('--lang');

// Languages to check for gaps (default = all 4)
const targetLangs: string[] = langArg
  ? langArg.split(',').map(l => l.trim().toLowerCase()).filter(l => ALL_LANGS.includes(l))
  : ALL_LANGS;

const OUTPUT_DIR  = path.join(process.cwd(), 'temp');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'missing-i18n.json');

// ---------------------------------------------------------------------------
// 3. TYPES
// ---------------------------------------------------------------------------

interface DBRow {
  key: string;
  language: string;
  content_type: string;
  value: string;
}

interface MissingEntry {
  ref: string;
  type: string;
  missing: string[];
  available: Record<string, string>;
}

// ---------------------------------------------------------------------------
// 4. MAIN
// ---------------------------------------------------------------------------

const run = async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║        CMS — Missing i18n Keys Report            ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log(`  Languages checked : ${targetLangs.join(', ')}`);
  if (pageArg) console.log(`  Page filter       : ${pageArg}.*`);
  console.log('');

  // ── Fetch all global rows for the target languages ──────────────────────
  let query = supabase
    .from('cms_content')
    .select('key, language, content_type, value')
    .in('language', targetLangs)
    .is('country_code', null);

  if (pageArg) {
    query = query.ilike('key', `${pageArg}.%`);
  }

  const { data, error } = await query.order('key');

  if (error) {
    console.error('❌  DB error:', error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as DBRow[];
  console.log(`📦  Loaded ${rows.length} row(s) from Supabase.\n`);

  // ── Build a nested map: key → lang → { value, type } ───────────────────
  const keyMap = new Map<string, { langs: Map<string, string>; type: string }>();

  for (const row of rows) {
    if (!keyMap.has(row.key)) {
      keyMap.set(row.key, { langs: new Map(), type: row.content_type });
    }
    keyMap.get(row.key)!.langs.set(row.language, row.value ?? '');
  }

  // ── Find all keys that exist in at least one language ───────────────────
  // (keys that don't exist anywhere at all are invisible here — that's intentional,
  //  use `npm run cms:insert-keys` to seed new keys first)

  const missingKeys: Record<string, MissingEntry> = {};
  let totalMissingEntries = 0;

  // Sort keys alphabetically for a readable output
  const sortedKeys = [...keyMap.keys()].sort();

  for (const key of sortedKeys) {
    const { langs, type } = keyMap.get(key)!;

    const missing: string[] = [];
    const available: Record<string, string> = {};

    for (const lang of targetLangs) {
      const val = langs.get(lang);
      if (!val || val.trim() === '') {
        missing.push(lang);
      } else {
        available[lang] = val;
      }
    }

    // Only record keys that are actually missing in at least one target language
    if (missing.length > 0) {
      const ref = available['en'] ?? available[Object.keys(available)[0]] ?? '';
      missingKeys[key] = { ref, type, missing, available };
      totalMissingEntries += missing.length;
    }
  }

  // ── Build stats by language ──────────────────────────────────────────────
  const statsByLang: Record<string, number> = {};
  for (const lang of targetLangs) statsByLang[lang] = 0;

  for (const entry of Object.values(missingKeys)) {
    for (const lang of entry.missing) statsByLang[lang] = (statsByLang[lang] ?? 0) + 1;
  }

  // ── Build stats by page prefix ───────────────────────────────────────────
  const statsByPage: Record<string, number> = {};
  for (const key of Object.keys(missingKeys)) {
    const prefix = key.split('.')[0];
    statsByPage[prefix] = (statsByPage[prefix] ?? 0) + 1;
  }

  // ── Assemble output ──────────────────────────────────────────────────────
  const output: Record<string, any> = {
    _meta: {
      exported_at: new Date().toISOString(),
      languages_checked: targetLangs,
      page_filter: pageArg ?? 'all',
      total_keys_with_gaps: Object.keys(missingKeys).length,
      total_missing_entries: totalMissingEntries,
      missing_by_language: statsByLang,
      missing_by_page: statsByPage,
      instructions: [
        'Each key lists the languages where the translation is absent or empty.',
        '"ref" is the reference value (usually English).',
        '"available" shows translations that already exist.',
        'Use `npm run cms:export -- --lang <code>` to get an editable file per language,',
        'then `npm run cms:save` to push the translations back to Supabase.',
      ],
    },
    ...missingKeys,
  };

  // ── Write file ────────────────────────────────────────────────────────────
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

  // ── Console report ────────────────────────────────────────────────────────
  console.log('  Missing translations by language:');
  for (const [lang, count] of Object.entries(statsByLang)) {
    const bar = '█'.repeat(Math.min(count, 40));
    console.log(`    ${lang.padEnd(4)} │ ${bar} ${count}`);
  }

  console.log('\n  Missing translations by page:');
  const sortedPages = Object.entries(statsByPage).sort((a, b) => b[1] - a[1]);
  for (const [page, count] of sortedPages) {
    console.log(`    ${page.padEnd(20)} ${count} key(s)`);
  }

  console.log(`\n  📄  Report saved to: temp/missing-i18n.json`);
  console.log(`  📊  ${Object.keys(missingKeys).length} key(s) have gaps  •  ${totalMissingEntries} missing translation(s) total\n`);
};

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
