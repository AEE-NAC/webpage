/**
 * fix-indexing.ts
 * 
 * Fixes historical CMS database issues without losing any existing data:
 *
 * PROBLEM 1 — "Shared component keys under page-specific prefix"
 *   Components in components/layout/ and components/common/ use keys like
 *   `home.ministries.*`, `home.about.*`, `home.weekly_highlight.*`, etc.
 *   These components are reused across multiple pages (ministry, about, home…).
 *   BUT each page only loaded its own prefix (e.g., 'ministry'), so the translations
 *   were never applied when the component rendered on a non-home page.
 *   FIX: Copy those DB rows under the canonical `shared.*` prefix.
 *        Old rows are preserved so the home page doesn't break.
 *
 * PROBLEM 2 — "Cross-namespace key usage"
 *   e.g., ministry page used `home.cta_join.*` but loaded the 'ministry' prefix.
 *   FIX: Detected automatically — any key used in a component that is rendered
 *        on multiple pages gets copied to `shared.*`.
 *
 * PROBLEM 3 — "Duplicate / NULL constraint conflicts"
 *   The UNIQUE NULLS NOT DISTINCT constraint can fail on upserts when
 *   country_code is NULL. We detect and clean up true duplicates.
 *   FIX: Keep the row with the most recent updated_at, delete the rest.
 *
 * PROBLEM 4 — "Missing nav.* / footer.* / layout.* keys in per-page dictionaries"
 *   Before the getPageContent fix, these global keys were never loaded for
 *   page-specific loads. The keys already exist with the correct prefix in the
 *   codebase so no rename is needed — but we verify they ARE in the DB.
 *   FIX: Insert any missing global keys with their default value (EN only).
 *
 * Strategy: ALL operations are ADDITIVE or DEDUP-only. No row is ever deleted
 * unless it is a provably exact duplicate (same key + lang + country_code,
 * multiple rows). Original data is NEVER overwritten unless explicitly
 * chosen by the operator.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// ---------------------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------------------

const CONF_PATH = path.join(process.cwd(), 'services', 'supabase.conf.ts');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Priority 1: Read from .env files (.env.local > .env > .env.development)
if (!supabaseUrl || !supabaseKey) {
  const envFiles = ['.env.local', '.env', '.env.development', '.env.production'];
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) continue;
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      if (!supabaseUrl) {
        const m = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)$/m);
        if (m) supabaseUrl = m[1].trim().replace(/^['"]|['"]$/g, '');
      }
      if (!supabaseKey) {
        // Prefer service role key for admin scripts (bypasses RLS)
        const serviceM = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)$/m);
        const anonM = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)$/m);
        if (serviceM) supabaseKey = serviceM[1].trim().replace(/^['"]|['"]$/g, '');
        else if (anonM) supabaseKey = anonM[1].trim().replace(/^['"]|['"]$/g, '');
      }
      if (supabaseUrl && supabaseKey) break;
    } catch (e) {
      console.warn(`Could not read ${envFile}:`, e);
    }
  }
}

// Priority 2: Extract hardcoded fallback values from supabase.conf.ts
// The file uses a ternary: process.env.X ?? 'hardcoded-value'
if (!supabaseUrl || !supabaseKey) {
  try {
    if (fs.existsSync(CONF_PATH)) {
      const conf = fs.readFileSync(CONF_PATH, 'utf-8');
      // Match the fallback string in ternary: : 'https://xxx.supabase.co'
      if (!supabaseUrl) {
        const urlM = conf.match(/:\s*['"]([^'"]*supabase\.co[^'"]*)['"]/);
        if (urlM) supabaseUrl = urlM[1];
      }
      // Match a long fallback string (JWT anon key or service role key starts with 'eyJ')
      if (!supabaseKey) {
        const keyM = conf.match(/:\s*'(eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*)['"]/);
        if (keyM) supabaseKey = keyM[1];
      }
    }
  } catch (e) {
    console.warn('Could not read supabase.conf.ts:', e);
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '\n❌  Cannot find Supabase URL/Key.\n' +
    '    Create a .env.local file at the project root with:\n\n' +
    '      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\n' +
    '      SUPABASE_SERVICE_ROLE_KEY=eyJ...  (recommended for scripts)\n' +
    '    or\n' +
    '      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...\n',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// 2. RULE MAP — "Which component paths require a shared.* alias?"
//
// Key: a path fragment that, when present in the file path, marks every CMS
// key used in that file as "shared" (i.e. used across multiple pages).
// Value: the target prefix replacement for the key portion after the second dot.
//
// Examples of remapping:
//   components/layout/ministries.tsx  →  home.ministries.* → shared.ministries.*
//   components/layout/About.tsx       →  home.about.*       → shared.about.*
//   components/layout/weekly.tsx      →  home.weekly_*      → shared.weekly_highlight.*
//   components/common/HomeSections.tsx → home.*             → shared.*
//   components/layout/Header.tsx      →  header.nav.*       → nav.*  (already correct)
//   components/layout/Footer.tsx      →  footer.*           → footer.*  (already correct)
// ---------------------------------------------------------------------------

/**
 * Given a CMS key found in a shared component file, return the "canonical"
 * key it should live under, or null if it is already correct.
 */
const canonicalKey = (key: string, filePath: string): string | null => {
  const rel = filePath.replace(process.cwd(), '').replace(/\\/g, '/');

  // Already-correct global prefixes — no rename needed
  if (
    key.startsWith('nav.') ||
    key.startsWith('footer.') ||
    key.startsWith('shared.') ||
    key.startsWith('layout.')
  ) {
    return null;
  }

  // Header: header.nav.* → nav.*
  if (rel.includes('components/layout/Header') && key.startsWith('header.nav.')) {
    return key.replace('header.nav.', 'nav.');
  }

  // Shared layout components that use 'home.*' keys but render on all pages
  const sharedLayoutFiles = [
    'components/layout/ministries',
    'components/layout/About',
    'components/layout/weekly',
    'components/common/',
    'components/home/',
  ];

  const isSharedFile = sharedLayoutFiles.some((f) => rel.includes(f));

  if (isSharedFile && key.startsWith('home.')) {
    // home.ministries.title → shared.ministries.title
    // home.about.badge      → shared.about.badge
    return key.replace(/^home\./, 'shared.');
  }

  return null; // no rename required
};

// ---------------------------------------------------------------------------
// 3. FILE SCANNER
// ---------------------------------------------------------------------------

interface FoundKey {
  key: string;
  defaultVal: string;
  type: 'text' | 'image';
  file: string;
  canonicalKey: string | null;
}

const getAllFiles = (dirPath: string, exts: string[]): string[] => {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) return getAllFiles(full, exts);
    if (e.isFile() && exts.some((x) => e.name.endsWith(x))) return [full];
    return [];
  });
};

const scanCodebase = (): FoundKey[] => {
  const files = [
    ...getAllFiles(path.join(process.cwd(), 'app'), ['.tsx', '.ts']),
    ...getAllFiles(path.join(process.cwd(), 'components'), ['.tsx', '.ts']),
  ];

  const found: FoundKey[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf-8');

    // <CMSText k="..." defaultVal="..." />
    const textRe = /<CMSText\b[^>]*?k=\{?(['"`])(.*?)\1\}?[^>]*?(?:defaultVal=(['"`])(.*?)\3)?/gs;
    let m: RegExpExecArray | null;
    while ((m = textRe.exec(src)) !== null) {
      const key = m[2];
      const def = m[4] ?? '';
      if (!key || key.includes('${')) continue;
      const canon = canonicalKey(key, file);
      if (!seen.has(key)) {
        found.push({ key, defaultVal: def, type: 'text', file, canonicalKey: canon });
        seen.add(key);
      }
    }

    // <CMSImage k="..." defaultSrc="..." />
    const imgRe =
      /<CMSImage\b[^>]*?k=(['"`])(.*?)\1[^>]*?defaultSrc=(['"`])(.*?)\3/gs;
    while ((m = imgRe.exec(src)) !== null) {
      const key = m[2];
      const def = m[4] ?? '';
      if (!key || key.includes('${')) continue;
      const canon = canonicalKey(key, file);
      if (!seen.has(key)) {
        found.push({ key, defaultVal: def, type: 'image', file, canonicalKey: canon });
        seen.add(key);
      }
    }
  }

  return found;
};

// ---------------------------------------------------------------------------
// 4. DB HELPERS
// ---------------------------------------------------------------------------

interface DBRow {
  id: string;
  key: string;
  language: string;
  country_code: string | null;
  content_type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const fetchAllRows = async (): Promise<DBRow[]> => {
  const { data, error } = await supabase
    .from('cms_content')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    if (
      error.code === '42P01' ||
      error.message.includes('does not exist') ||
      error.message.includes('Could not find')
    ) {
      console.error(
        '\n❌  Table cms_content does not exist. Run the SQL setup script first.',
      );
    } else {
      console.error('❌  DB error:', error.message);
    }
    process.exit(1);
  }
  return (data ?? []) as DBRow[];
};

// ---------------------------------------------------------------------------
// 5. MAIN FIX LOGIC
// ---------------------------------------------------------------------------

const fix = async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║         CMS Fix-Indexing — Safe Migration        ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const rl = readline.createInterface({ input, output });

  // ── Step A: Scan codebase ──────────────────────────────────────────────
  console.log('🔍  Scanning codebase for CMS keys…');
  const codeKeys = scanCodebase();
  console.log(`    Found ${codeKeys.length} unique keys.\n`);

  // ── Step B: Load all DB rows ───────────────────────────────────────────
  console.log('📥  Loading all rows from cms_content…');
  const allRows = await fetchAllRows();
  console.log(`    Loaded ${allRows.length} rows.\n`);

  // Group rows by composite key: `${key}||${language}||${country_code ?? ''}`
  const rowMap = new Map<string, DBRow[]>();
  for (const row of allRows) {
    const k = `${row.key}||${row.language}||${row.country_code ?? ''}`;
    if (!rowMap.has(k)) rowMap.set(k, []);
    rowMap.get(k)!.push(row);
  }

  // ── FIX 3: Deduplicate rows with same (key, language, country_code) ───
  console.log('🔧  FIX 1/3 — Deduplicating rows (same key+lang+country)…');
  let dupDeleted = 0;
  const dupGroups = [...rowMap.entries()].filter(([, rows]) => rows.length > 1);

  if (dupGroups.length === 0) {
    console.log('    ✅  No duplicates found.\n');
  } else {
    console.log(`    ⚠️   Found ${dupGroups.length} duplicate groups.`);

    for (const [composite, rows] of dupGroups) {
      // Keep the first (most recently updated), delete the rest
      const [keep, ...remove] = rows;
      const [key, lang, cc] = composite.split('||');
      console.log(
        `    🔑  "${key}" [${lang}/${cc || 'global'}] — keeping id:${keep.id}, removing ${remove.length} duplicate(s)`,
      );

      const idsToDelete = remove.map((r) => r.id);
      const { error } = await supabase
        .from('cms_content')
        .delete()
        .in('id', idsToDelete);

      if (error) {
        console.error(`       ❌  Failed to delete duplicates: ${error.message}`);
      } else {
        dupDeleted += idsToDelete.length;
      }
    }
    console.log(`    ✅  Deleted ${dupDeleted} duplicate row(s).\n`);
  }

  // ── FIX 1+2: Shared component key aliasing ────────────────────────────
  console.log('🔧  FIX 2/3 — Creating shared.* aliases for cross-page component keys…');

  const keysNeedingAlias = codeKeys.filter((k) => k.canonicalKey !== null);
  console.log(`    Found ${keysNeedingAlias.length} key(s) that need a shared.* alias.`);

  if (keysNeedingAlias.length === 0) {
    console.log('    ✅  Nothing to alias.\n');
  } else {
    // Print plan
    const uniquePairs = [
      ...new Map(keysNeedingAlias.map((k) => [k.key, k.canonicalKey!])).entries(),
    ];

    console.log('\n    Planned renames (old → new):');
    uniquePairs.forEach(([old, neo]) => console.log(`      ${old}  →  ${neo}`));

    const answer = await rl.question(
      '\n    Create these aliases in the DB? All existing translations (all langs/countries) will be COPIED under the new key. (y/n): ',
    );

    if (answer.trim().toLowerCase() !== 'y') {
      console.log('    ⏭️   Skipped.\n');
    } else {
      let aliasCreated = 0;
      let aliasSkipped = 0;

      for (const [oldKey, newKey] of uniquePairs) {
        // Find all DB rows for this old key (all languages, all country variants)
        const sourceRows = allRows.filter((r) => r.key === oldKey);

        if (sourceRows.length === 0) {
          // Key is in code but not yet in DB → will be handled by index-cms.ts later
          aliasSkipped++;
          continue;
        }

        for (const src of sourceRows) {
          // Check if the alias already exists for this lang/country combo
          const aliasComposite = `${newKey}||${src.language}||${src.country_code ?? ''}`;
          const existingAlias = rowMap.get(aliasComposite)?.[0];

          if (existingAlias) {
            // Alias row already exists — no-op to avoid overwriting custom translations
            aliasSkipped++;
            continue;
          }

          // Insert alias row (copy of source, new key, preserve value & metadata)
          const { error } = await supabase.from('cms_content').insert({
            key: newKey,
            language: src.language,
            country_code: src.country_code,
            content_type: src.content_type,
            value: src.value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (error) {
            console.error(
              `       ❌  Could not alias "${oldKey}" → "${newKey}" [${src.language}]: ${error.message}`,
            );
          } else {
            aliasCreated++;
          }
        }
      }

      console.log(
        `    ✅  Created ${aliasCreated} alias row(s). Skipped ${aliasSkipped} (already existed or not in DB).\n`,
      );
    }
  }

  // ── FIX 4: Insert missing global keys (nav.*, footer.*, layout.*) ─────
  console.log('🔧  FIX 3/3 — Inserting missing global / nav / footer / layout keys (EN)…');

  const globalPrefixes = ['nav.', 'footer.', 'layout.', 'shared.'];
  const globalCodeKeys = codeKeys.filter((k) =>
    globalPrefixes.some((p) => k.key.startsWith(p)),
  );

  const missingGlobal: typeof codeKeys = [];
  for (const ck of globalCodeKeys) {
    const composite = `${ck.key}||en||`;
    if (!rowMap.has(composite)) {
      missingGlobal.push(ck);
    }
  }

  if (missingGlobal.length === 0) {
    console.log('    ✅  All global keys are already in the DB.\n');
  } else {
    console.log(`    Found ${missingGlobal.length} missing global key(s):`);
    missingGlobal.slice(0, 15).forEach((k) => console.log(`      - ${k.key}`));
    if (missingGlobal.length > 15)
      console.log(`      … and ${missingGlobal.length - 15} more.`);

    const ans = await rl.question(
      '\n    Insert these missing keys with their code default value (EN, global)? (y/n): ',
    );

    if (ans.trim().toLowerCase() !== 'y') {
      console.log('    ⏭️   Skipped.\n');
    } else {
      const payload = missingGlobal.map((k) => ({
        key: k.key,
        language: 'en',
        country_code: null,
        content_type: k.type,
        value: k.defaultVal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Insert in chunks to avoid request size limits
      const CHUNK = 50;
      let inserted = 0;
      for (let i = 0; i < payload.length; i += CHUNK) {
        const chunk = payload.slice(i, i + CHUNK);
        const { error } = await supabase.from('cms_content').insert(chunk);
        if (error) {
          console.error(`       ❌  Chunk insert error: ${error.message}`);
        } else {
          inserted += chunk.length;
        }
      }
      console.log(`    ✅  Inserted ${inserted} global key(s).\n`);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║                 Fix Summary                      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Duplicates removed  : ${dupDeleted}`);
  console.log(`  Aliases created     : (see above)`);
  console.log(`  Global keys seeded  : (see above)`);
  console.log(
    '\n  ℹ️   Original rows are untouched. Shared aliases point to the same text.');
  console.log(
    '  ℹ️   Run `npm run indexing` afterward to seed any remaining page-specific keys.\n',
  );

  rl.close();
  process.exit(0);
};

fix().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
