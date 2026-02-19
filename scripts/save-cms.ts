/**
 * save-cms.ts
 *
 * Reads local translation JSON files (produced by export-cms.ts) and upserts
 * the values back into Supabase, without touching rows that were not modified.
 *
 * USAGE:
 *   npm run cms:save                          → save all files in temp/translations/
 *   npm run cms:save -- --file fr.json        → save a single file
 *   npm run cms:save -- --lang fr             → save all files for French
 *   npm run cms:save -- --lang fr,ht          → save French + Haitian Creole
 *   npm run cms:save -- --dry-run             → preview changes without writing
 *
 * SAFETY RULES:
 *   - Rows where "value" hasn't changed compared to the DB are SKIPPED.
 *   - Rows marked with "_todo: true" and with an empty value are SKIPPED.
 *   - The "_meta" key in the JSON is ignored.
 *   - All changes are shown before confirmation (unless --yes flag is passed).
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// ---------------------------------------------------------------------------
// 1. CREDENTIALS
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
const hasFlag = (flag: string) => args.includes(flag);
const getArg  = (flag: string): string | null => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const fileArg   = getArg('--file');
const langArg   = getArg('--lang');
const isDryRun  = hasFlag('--dry-run');
const autoYes   = hasFlag('--yes');

const TRANSLATIONS_DIR = path.join(process.cwd(), 'temp', 'translations');

// ---------------------------------------------------------------------------
// 3. FILE DISCOVERY
// ---------------------------------------------------------------------------

interface TranslationEntry {
  value: string;
  ref: string;
  type: string;
  _todo?: boolean;
}

interface TranslationFile {
  _meta: {
    language: string;
    country_code: string | null;
    exported_at: string;
  };
  [key: string]: TranslationEntry | any;
}

const discoverFiles = (): string[] => {
  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    console.error(`❌  Translations directory not found: ${TRANSLATIONS_DIR}`);
    console.error('    Run `npm run cms:export` first.');
    process.exit(1);
  }

  if (fileArg) {
    const resolved = path.isAbsolute(fileArg)
      ? fileArg
      : path.join(TRANSLATIONS_DIR, fileArg);
    if (!fs.existsSync(resolved)) {
      console.error(`❌  File not found: ${resolved}`);
      process.exit(1);
    }
    return [resolved];
  }

  const allFiles = fs
    .readdirSync(TRANSLATIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(TRANSLATIONS_DIR, f));

  if (langArg) {
    const targetLangs = langArg.split(',').map(l => l.trim().toLowerCase());
    return allFiles.filter(f => {
      const basename = path.basename(f, '.json'); // e.g. "fr" or "fr.HT"
      const [lang] = basename.split('.');
      return targetLangs.includes(lang);
    });
  }

  return allFiles;
};

// ---------------------------------------------------------------------------
// 4. DIFF COMPUTATION — compare local file vs DB
// ---------------------------------------------------------------------------

interface PendingChange {
  key: string;
  language: string;
  country_code: string | null;
  content_type: string;
  newValue: string;
  oldValue: string | null; // null = row doesn't exist yet in DB
  isNew: boolean;
}

const computeChanges = async (
  filePath: string,
): Promise<PendingChange[]> => {
  const filename = path.basename(filePath, '.json'); // "fr" | "fr.HT"
  const raw: TranslationFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const meta = raw._meta;
  if (!meta?.language) {
    console.warn(`  ⚠️   ${filename}.json: missing _meta.language, skipping.`);
    return [];
  }

  const lang        = meta.language;
  const country     = meta.country_code ?? null;

  // Fetch current DB values for this lang/country
  let dbQuery = supabase
    .from('cms_content')
    .select('key, value, content_type')
    .eq('language', lang);

  if (country) {
    dbQuery = dbQuery.eq('country_code', country);
  } else {
    dbQuery = dbQuery.is('country_code', null);
  }

  const { data: dbRows, error } = await dbQuery;
  if (error) {
    console.error(`  ❌  DB fetch error for ${filename}: ${error.message}`);
    return [];
  }

  const dbMap = new Map<string, { value: string; content_type: string }>();
  (dbRows ?? []).forEach((r: any) => dbMap.set(r.key, r));

  const changes: PendingChange[] = [];

  for (const [key, entry] of Object.entries(raw)) {
    if (key === '_meta') continue;
    if (typeof entry !== 'object' || entry === null) continue;

    const localValue: string = (entry as TranslationEntry).value ?? '';
    const type: string       = (entry as TranslationEntry).type ?? 'text';
    const isTodo: boolean    = !!(entry as TranslationEntry)._todo;

    // Skip empty values that are not yet translated
    if (!localValue.trim() && isTodo) continue;
    // Skip empty values regardless (don't overwrite DB with blank)
    if (!localValue.trim()) continue;

    const dbRow = dbMap.get(key);

    if (!dbRow) {
      // New row — not in DB yet
      changes.push({
        key,
        language: lang,
        country_code: country,
        content_type: type,
        newValue: localValue,
        oldValue: null,
        isNew: true,
      });
    } else if (dbRow.value !== localValue) {
      // Value has changed
      changes.push({
        key,
        language: lang,
        country_code: country,
        content_type: type,
        newValue: localValue,
        oldValue: dbRow.value,
        isNew: false,
      });
    }
    // else: identical → skip
  }

  return changes;
};

// ---------------------------------------------------------------------------
// 5. APPLY CHANGES
// ---------------------------------------------------------------------------

const applyChanges = async (changes: PendingChange[]): Promise<void> => {
  const CHUNK = 50;
  let successCount = 0;
  let errorCount   = 0;

  // Separate new inserts from updates
  const newRows    = changes.filter(c => c.isNew);
  const updateRows = changes.filter(c => !c.isNew);

  // INSERTS
  if (newRows.length > 0) {
    for (let i = 0; i < newRows.length; i += CHUNK) {
      const chunk = newRows.slice(i, i + CHUNK).map(c => ({
        key:          c.key,
        language:     c.language,
        country_code: c.country_code,
        content_type: c.content_type,
        value:        c.newValue,
        created_at:   new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      }));
      const { error } = await supabase.from('cms_content').insert(chunk);
      if (error) {
        console.error(`  ❌  Insert error (chunk ${i}): ${error.message}`);
        errorCount += chunk.length;
      } else {
        successCount += chunk.length;
      }
    }
  }

  // UPDATES — one by one to use the safe upsert pattern (avoid NULL constraint issues)
  for (const change of updateRows) {
    // Find the existing row id first
    let q: any = supabase
      .from('cms_content')
      .select('id')
      .eq('key', change.key)
      .eq('language', change.language);

    if (change.country_code) {
      q = q.eq('country_code', change.country_code);
    } else {
      q = q.is('country_code', null);
    }

    const { data: existing } = await q.maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cms_content')
        .update({
          value:        change.newValue,
          content_type: change.content_type,
          updated_at:   new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error(`  ❌  Update "${change.key}": ${error.message}`);
        errorCount++;
      } else {
        successCount++;
      }
    } else {
      // Race condition — row disappeared, insert instead
      const { error } = await supabase.from('cms_content').insert({
        key:          change.key,
        language:     change.language,
        country_code: change.country_code,
        content_type: change.content_type,
        value:        change.newValue,
        created_at:   new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      });
      if (error) {
        console.error(`  ❌  Fallback insert "${change.key}": ${error.message}`);
        errorCount++;
      } else {
        successCount++;
      }
    }
  }

  console.log(`  ✅  ${successCount} change(s) saved.${errorCount > 0 ? `  ❌  ${errorCount} error(s).` : ''}`);
};

// ---------------------------------------------------------------------------
// 6. MAIN
// ---------------------------------------------------------------------------

const saveCMS = async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║         CMS Save — Push Translations${isDryRun ? ' [DRY RUN]' : ''}${' '.repeat(isDryRun ? 4 : 10)}║`);
  console.log('╚══════════════════════════════════════════════════╝\n');

  const files = discoverFiles();
  console.log(`  Found ${files.length} file(s) to process.\n`);

  if (files.length === 0) {
    console.log('  Nothing to do.');
    process.exit(0);
  }

  const rl = autoYes || isDryRun ? null : readline.createInterface({ input, output });

  let totalNew     = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  const allChanges: { file: string; changes: PendingChange[] }[] = [];

  // ── Compute diffs for all files ──────────────────────────────────────
  for (const file of files) {
    const filename = path.basename(file);
    process.stdout.write(`  🔍  Computing diff for ${filename}…`);
    const changes = await computeChanges(file);
    process.stdout.write(`  ${changes.length} change(s)\n`);
    allChanges.push({ file: filename, changes });
    totalNew     += changes.filter(c => c.isNew).length;
    totalUpdated += changes.filter(c => !c.isNew).length;
  }

  // ── Summary ──────────────────────────────────────────────────────────
  console.log('\n  ┌─────────────────────────────────────────────────┐');
  console.log(`  │  🆕  New rows to insert  : ${String(totalNew).padEnd(20)}│`);
  console.log(`  │  ✏️   Rows to update      : ${String(totalUpdated).padEnd(20)}│`);
  console.log('  └─────────────────────────────────────────────────┘\n');

  if (totalNew + totalUpdated === 0) {
    console.log('  ✅  Database is already up to date. Nothing to save.\n');
    process.exit(0);
  }

  // ── Show detail of changes ───────────────────────────────────────────
  for (const { file, changes } of allChanges) {
    if (changes.length === 0) continue;
    console.log(`\n  📄  ${file}`);

    for (const c of changes) {
      if (c.isNew) {
        const preview = c.newValue.substring(0, 60).replace(/\n/g, ' ');
        console.log(`    🆕  [INSERT] ${c.key}`);
        console.log(`         "${preview}${c.newValue.length > 60 ? '…' : ''}"`);
      } else {
        const oldPrev = (c.oldValue ?? '').substring(0, 50).replace(/\n/g, ' ');
        const newPrev = c.newValue.substring(0, 50).replace(/\n/g, ' ');
        console.log(`    ✏️   [UPDATE] ${c.key}`);
        console.log(`         🔴 old: "${oldPrev}${(c.oldValue ?? '').length > 50 ? '…' : ''}"`);
        console.log(`         🟢 new: "${newPrev}${c.newValue.length > 50 ? '…' : ''}"`);
      }
    }
  }

  if (isDryRun) {
    console.log('\n  🔍  DRY RUN — no changes were written to the database.\n');
    process.exit(0);
  }

  // ── Confirm ───────────────────────────────────────────────────────────
  let confirmed = autoYes;
  if (!confirmed && rl) {
    const ans = await rl.question('\n  Push these changes to Supabase? (y/n): ');
    confirmed = ans.trim().toLowerCase() === 'y';
    rl.close();
  }

  if (!confirmed) {
    console.log('\n  ⏭️   Cancelled. No changes written.\n');
    process.exit(0);
  }

  // ── Apply ─────────────────────────────────────────────────────────────
  console.log('\n  💾  Saving…\n');
  for (const { file, changes } of allChanges) {
    if (changes.length === 0) {
      totalSkipped++;
      continue;
    }
    console.log(`  📄  ${file}`);
    await applyChanges(changes);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║                  Save Complete                   ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Inserted : ${totalNew}`);
  console.log(`  Updated  : ${totalUpdated}`);
  console.log(`  Skipped  : ${totalSkipped} file(s) with no changes\n`);
};

saveCMS().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
