/**
 * fix-missing.ts
 *
 * Reads temp/fixed-missing.json and upserts every translation it contains
 * into Supabase cms_content.
 *
 * INPUT FORMAT (temp/fixed-missing.json):
 * {
 *   "nav.home": {
 *     "fr": "Accueil",
 *     "ht": "Akèy",
 *     "es": "Inicio"
 *   },
 *   "about.hero.title": {
 *     "ht": "Misyon Nou"
 *   },
 *   ...
 * }
 *
 * USAGE:
 *   npm run cms:fix-missing                  → upsert all entries
 *   npm run cms:fix-missing -- --dry-run     → preview without writing
 *   npm run cms:fix-missing -- --yes         → skip confirmation prompt
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// ---------------------------------------------------------------------------
// 1. CREDENTIALS (same resolver as all other CMS scripts)
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

const args    = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const autoYes  = args.includes('--yes');

const INPUT_FILE = path.join(process.cwd(), 'temp', 'fixed-missing.json');

// ---------------------------------------------------------------------------
// 3. MAIN
// ---------------------------------------------------------------------------

const run = async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║          CMS — Apply Missing Translations        ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  if (isDryRun) console.log('  ⚠️   DRY-RUN mode — nothing will be written.\n');

  // ── Load input file ────────────────────────────────────────────────────
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌  Input file not found: ${INPUT_FILE}`);
    console.error('    Create temp/fixed-missing.json with the translations to apply.');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(INPUT_FILE, 'utf-8')
    .replace(/^\uFEFF/, '') // strip BOM if present
    .trim();

  if (!fileContent) {
    console.error('❌  fixed-missing.json is empty.');
    process.exit(1);
  }

  let raw: Record<string, Record<string, string>>;
  try {
    raw = JSON.parse(fileContent);
  } catch (e: any) {
    console.error('❌  Failed to parse fixed-missing.json:', e.message);
    console.error('    Make sure the file contains valid JSON.');
    process.exit(1);
  }

  // ── Collect (key, lang, value) triples ────────────────────────────────
  interface Entry { key: string; language: string; value: string }
  const entries: Entry[] = [];

  for (const [key, langs] of Object.entries(raw)) {
    if (key === '_meta') continue; // skip meta block if present
    for (const [lang, value] of Object.entries(langs)) {
      if (!value || typeof value !== 'string' || value.trim() === '') continue;
      entries.push({ key, language: lang, value: value.trim() });
    }
  }

  if (entries.length === 0) {
    console.log('⚠️   No non-empty translations found in fixed-missing.json. Nothing to do.');
    process.exit(0);
  }

  console.log(`📦  Found ${entries.length} translation(s) across ${Object.keys(raw).length} key(s).\n`);

  // ── Fetch existing rows to get content_type & detect overwrites ────────
  const allKeys = [...new Set(entries.map(e => e.key))];
  const allLangs = [...new Set(entries.map(e => e.language))];

  const { data: existingRows, error: fetchError } = await supabase
    .from('cms_content')
    .select('key, language, value, content_type')
    .in('key', allKeys)
    .in('language', [...allLangs, 'en']) // include EN to resolve content_type fallback
    .is('country_code', null);

  if (fetchError) {
    console.error('❌  DB error while fetching existing rows:', fetchError.message);
    process.exit(1);
  }

  // Build lookup maps
  // existing[key][lang] = { value, content_type }
  const existing = new Map<string, Map<string, { value: string; content_type: string }>>();
  for (const row of existingRows ?? []) {
    if (!existing.has(row.key)) existing.set(row.key, new Map());
    existing.get(row.key)!.set(row.language, { value: row.value ?? '', content_type: row.content_type });
  }

  // Resolve content_type for a key: prefer EN row, then any available lang, then 'text'
  const resolveType = (key: string): string => {
    const langMap = existing.get(key);
    if (!langMap) return 'text';
    return (
      langMap.get('en')?.content_type ??
      [...langMap.values()][0]?.content_type ??
      'text'
    );
  };

  // ── Preview changes ────────────────────────────────────────────────────
  type Action = 'INSERT' | 'UPDATE' | 'SKIP';
  interface Change {
    key: string;
    language: string;
    value: string;
    content_type: string;
    action: Action;
    oldValue?: string;
  }

  const changes: Change[] = [];

  for (const { key, language, value } of entries) {
    const existing_lang = existing.get(key)?.get(language);
    const content_type  = resolveType(key);

    if (existing_lang) {
      if (existing_lang.value === value) {
        // Identical — skip
        changes.push({ key, language, value, content_type, action: 'SKIP' });
      } else {
        changes.push({ key, language, value, content_type, action: 'UPDATE', oldValue: existing_lang.value });
      }
    } else {
      changes.push({ key, language, value, content_type, action: 'INSERT' });
    }
  }

  const inserts = changes.filter(c => c.action === 'INSERT');
  const updates = changes.filter(c => c.action === 'UPDATE');
  const skipped = changes.filter(c => c.action === 'SKIP');

  console.log(`  🆕  Inserts : ${inserts.length}`);
  console.log(`  ✏️   Updates : ${updates.length}`);
  console.log(`  ⏭️   Skipped : ${skipped.length} (already identical)\n`);

  if (inserts.length + updates.length === 0) {
    console.log('✨  All translations already match the database. Nothing to write.\n');
    process.exit(0);
  }

  // Print detail
  const toWrite = [...inserts, ...updates];
  const MAX_PREVIEW = 60;
  console.log('  Changes to apply:');
  for (const c of toWrite.slice(0, MAX_PREVIEW)) {
    const tag   = c.action === 'INSERT' ? '🆕' : '✏️ ';
    const short = c.value.length > 80 ? c.value.slice(0, 77) + '…' : c.value;
    console.log(`  ${tag} [${c.language}] ${c.key}`);
    if (c.action === 'UPDATE') {
      const oldShort = (c.oldValue ?? '').length > 60 ? (c.oldValue ?? '').slice(0, 57) + '…' : c.oldValue;
      console.log(`       was : ${oldShort}`);
    }
    console.log(`       now : ${short}`);
  }
  if (toWrite.length > MAX_PREVIEW) {
    console.log(`  … and ${toWrite.length - MAX_PREVIEW} more.\n`);
  }

  if (isDryRun) {
    console.log('\n  [dry-run] No changes written.\n');
    process.exit(0);
  }

  // ── Confirm ────────────────────────────────────────────────────────────
  if (!autoYes) {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(`\n  Apply ${toWrite.length} change(s) to Supabase? [y/N] `);
    rl.close();
    if (answer.trim().toLowerCase() !== 'y') {
      console.log('\n  Aborted.\n');
      process.exit(0);
    }
  }

  // ── Upsert in batches of 100 ───────────────────────────────────────────
  const BATCH = 100;
  const rows = toWrite.map(c => ({
    key: c.key,
    language: c.language,
    value: c.value,
    content_type: c.content_type,
    country_code: null,
    updated_at: new Date().toISOString(),
  }));

  let saved = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from('cms_content')
      .upsert(batch, { onConflict: 'key,language,country_code' });

    if (error) {
      console.error(`\n❌  Upsert error (batch ${i / BATCH + 1}):`, error.message);
      process.exit(1);
    }
    saved += batch.length;
    process.stdout.write(`\r  💾  Saved ${saved}/${rows.length}…`);
  }

  console.log(`\n\n  ✅  Done! ${inserts.length} inserted, ${updates.length} updated.\n`);
};

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
