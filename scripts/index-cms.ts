import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// --- Configuration ---
// Note: We extract these from your codebase or ENV. 
const CONF_PATH = path.join(process.cwd(), 'services', 'supabase.conf.ts');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseKey) {
  // Fallback: Try to read from file
  try {
    if (fs.existsSync(CONF_PATH)) {
        const confContent = fs.readFileSync(CONF_PATH, 'utf-8');
        const urlMatch = confContent.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
        const keyMatch = confContent.match(/supabaseKey\s*=\s*['"]([^'"]+)['"]/);
        if(urlMatch) supabaseUrl = urlMatch[1];
        if(keyMatch) supabaseKey = keyMatch[1];
    }
  } catch(e) { 
    console.warn("Could not read supabase.conf.ts", e); 
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Could not find Supabase URL/Key. Please check .env or services/supabase.conf.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- SQL for Table Creation (Helper) ---
const CREATE_TABLE_SQL = `
-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR IF TABLES ARE MISSING --

CREATE TABLE IF NOT EXISTS public.cms_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key text NOT NULL,
    language text NOT NULL,
    country_code text,
    content_type text DEFAULT 'text',
    value text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT cms_content_unique_key UNIQUE (key, language, country_code)
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.cms_content FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON public.cms_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON public.cms_content FOR UPDATE USING (true);
`;

// --- Logic ---

async function indexCMS() {
    console.log("🔍 Scanning app/ directory for CMS Content...");
    
    // 1. Scan Files
    const files = getAllFiles(path.join(process.cwd(), 'app'), ['.tsx', '.ts']);
    const keysFound = new Map<string, { key: string, value: string, type: 'text' | 'image' }>();

    let count = 0;
    
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Match <CMSText ... />
        const textRegex = /<CMSText\s+[^>]*?k=(['"])(.*?)\1[^>]*?defaultVal=(['"])(.*?)\3/gs;
        let match;
        while ((match = textRegex.exec(content)) !== null) {
            const key = match[2];
            const defaultVal = match[4];
            if (key && !keysFound.has(key)) {
                keysFound.set(key, { key, value: defaultVal, type: 'text' });
                count++;
            }
        }

        // Match <CMSImage ... />
        const imgRegex = /<CMSImage\s+[^>]*?k=(['"])(.*?)\1[^>]*?defaultSrc=(['"])(.*?)\3/gs;
        while ((match = imgRegex.exec(content)) !== null) {
            const key = match[2];
            const defaultSrc = match[4];
            if (key && !keysFound.has(key)) {
                keysFound.set(key, { key, value: defaultSrc, type: 'image' });
                count++;
            }
        }
    });

    console.log(`✅ Found ${count} unique keys in codebase.`);

    if (keysFound.size === 0) {
        console.log("No keys to index.");
        return;
    }

    console.log("📥 Fetching existing content from Supabase...");

    // 2. Fetch Existing (English Global Only)
    const { data: existingRows, error: checkError } = await supabase
        .from('cms_content')
        .select('key, value, content_type')
        .eq('language', 'en')
        .is('country_code', null);

    if (checkError) {
        const isMissingTable = 
            checkError.code === '42P01' || 
            checkError.message.includes('Could not find the table') || 
            checkError.message.includes('does not exist');

        if (isMissingTable) {
            console.error("\n❌ ERROR: Database table 'cms_content' does not exist.");
            console.log("\n⚠️  PLEASE RUN THIS SQL IN THE SUPABASE DASHBOARD -> SQL EDITOR:");
            console.log("\n" + "=".repeat(50));
            console.log(CREATE_TABLE_SQL);
            console.log("=".repeat(50) + "\n");
        } else {
            console.error("❌ Connection Error:", checkError.message);
        }
        return;
    }

    // 3. Compare Code vs Database
    const existingMap = new Map(existingRows?.map((r: any) => [r.key, r]));
    const newKeys: any[] = [];
    const changedKeys: any[] = [];

    for (const [key, item] of keysFound) {
        const existing = existingMap.get(key);
        
        const payload = {
            key: item.key,
            value: item.value,
            language: 'en',
            content_type: item.type,
            country_code: null,
            updated_at: new Date().toISOString()
        };

        if (!existing) {
            newKeys.push(payload);
        } else if (existing.value !== item.value) {
            changedKeys.push({
                ...payload,
                old_value: existing.value
            });
        }
    }

    // 4. Insert New Keys
    if (newKeys.length > 0) {
        console.log(`🆕 Inserting ${newKeys.length} new keys...`);
        const { error: insertError } = await supabase.from('cms_content').insert(newKeys);
        if (insertError) console.error("   ❌ Error inserting new keys:", insertError.message);
        else console.log("   ✅ New keys inserted.");
    } else {
        console.log("✅ No new keys to insert.");
    }

    // 5. Interact for Changed Keys
    if (changedKeys.length > 0) {
        console.log(`\n⚠️  Found ${changedKeys.length} keys where code default differs from database.`);
        console.log("   (Usually happens when you update text in code, but the DB has an old version)");

        const rl = readline.createInterface({ input, output });
        let mode: 'ask' | 'overwrite_all' | 'skip_all' = 'ask';

        for (const item of changedKeys) {
            if (mode === 'skip_all') break;

            let shouldUpdate = false;

            if (mode === 'overwrite_all') {
                shouldUpdate = true;
            } else {
                console.log(`\n🔑 Key: ${item.key}`);
                console.log(`   🔴 DB Value:   "${item.old_value.substring(0, 100).replace(/\n/g, ' ')}${item.old_value.length > 100 ? '...' : ''}"`);
                console.log(`   🟢 Code Value: "${item.value.substring(0, 100).replace(/\n/g, ' ')}${item.value.length > 100 ? '...' : ''}"`);
                
                const answer = await rl.question('   Update DB with Code value? (y/n/a=yes-to-all/s=skip-all): ');
                const ans = answer.trim().toLowerCase();

                if (ans === 'a') {
                    mode = 'overwrite_all';
                    shouldUpdate = true;
                } else if (ans === 's') {
                    mode = 'skip_all';
                    shouldUpdate = false;
                } else if (ans === 'y' || ans === 'yes') {
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                const { error: updateError } = await supabase
                    .from('cms_content')
                    .update({ 
                        value: item.value, 
                        content_type: item.content_type,
                        updated_at: new Date().toISOString()
                    })
                    .eq('key', item.key)
                    .eq('language', 'en')
                    .is('country_code', null);

                if (updateError) console.error(`   ❌ Failed to update ${item.key}:`, updateError.message);
                else if (mode === 'ask') console.log(`   ✅ Updated.`);
            }
        }
        
        if (mode === 'overwrite_all') console.log("   ✅ All items updated.");
        rl.close();
    } else {
        console.log("✅ No conflicts found (DB matches Code).");
    }
}

// Recursive file scanner
function getAllFiles(dirPath: string, extensions: string[], arrayOfFiles: string[] = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, extensions, arrayOfFiles);
        } else {
            if (extensions.some(ext => file.endsWith(ext))) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

indexCMS();
