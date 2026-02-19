import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
const CONF_PATH = path.join(process.cwd(), 'services', 'supabase.conf.ts');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Priority 1: Read from .env files
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
        const serviceM = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)$/m);
        const anonM = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)$/m);
        if (serviceM) supabaseKey = serviceM[1].trim().replace(/^['"]|['"]$/g, '');
        else if (anonM) supabaseKey = anonM[1].trim().replace(/^['"]|['"]$/g, '');
      }
      if (supabaseUrl && supabaseKey) break;
    } catch(e) {
      console.warn(`Could not read ${envFile}:`, e);
    }
  }
}

// Priority 2: Extract from supabase.conf.ts
if (!supabaseUrl || !supabaseKey) {
  try {
    if (fs.existsSync(CONF_PATH)) {
        const confContent = fs.readFileSync(CONF_PATH, 'utf-8');
        if (!supabaseUrl) {
          const urlMatch = confContent.match(/:\s*['"]([^'"]*supabase\.co[^'"]*)['"]/);
          if (urlMatch) supabaseUrl = urlMatch[1];
        }
        if (!supabaseKey) {
          const keyMatch = confContent.match(/:\s*'(eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*)'/);
          if (keyMatch) supabaseKey = keyMatch[1];
        }
    }
  } catch(e) { 
    console.warn("Could not read supabase.conf.ts", e); 
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Cannot find Supabase URL/Key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertKeys() {
    console.log("🔍 Scanning for new CMS keys (dry-run/insert only)...");
    
    // 1. Scan Files
    const appFiles = getAllFiles(path.join(process.cwd(), 'app'), ['.tsx', '.ts']);
    const componentFiles = getAllFiles(path.join(process.cwd(), 'components'), ['.tsx', '.ts']);
    const files = [...appFiles, ...componentFiles];
    
    const keysInCode = new Map<string, { key: string, value: string, type: 'text' | 'image' }>();

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        
        // <CMSText k="..." defaultVal="..." />
        const textRegex = /<CMSText\s+[^>]*?k={?(['"`])(.*?)\1}?/gs;
        let match;
        while ((match = textRegex.exec(content)) !== null) {
            const key = match[2];
            const valMatch = content.slice(match.index).match(/defaultVal=(['"])(.*?)\1/);
            const defaultVal = valMatch ? valMatch[2] : "";
            if (key && !key.includes('${') && !keysInCode.has(key)) {
                keysInCode.set(key, { key, value: defaultVal, type: 'text' });
            }
        }

        // cms('key', 'default')
        const funcRegex = /cms\s*\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3\s*\)/gs;
        while ((match = funcRegex.exec(content)) !== null) {
            const key = match[2];
            const defaultVal = match[4];
            if (key && !key.includes('${') && !keysInCode.has(key)) {
                keysInCode.set(key, { key, value: defaultVal, type: 'text' });
            }
        }

        // <CMSImage k="..." defaultSrc="..." />
        const imgRegex = /<CMSImage\s+[^>]*?k=(['"])(.*?)\1[^>]*?defaultSrc=(['"])(.*?)\3/gs;
        while ((match = imgRegex.exec(content)) !== null) {
            const key = match[2];
            const defaultSrc = match[4];
            if (key && !keysInCode.has(key)) {
                keysInCode.set(key, { key, value: defaultSrc, type: 'image' });
            }
        }
    });

    console.log(`✅ Scanned files. Found ${keysInCode.size} keys in code.`);

    // 2. Get existing keys from Supabase
    const { data: existingRows, error } = await supabase
        .from('cms_content')
        .select('key')
        .eq('language', 'en')
        .is('country_code', null);

    if (error) {
        console.error("❌ Error fetching from Supabase:", error.message);
        return;
    }

    const existingKeysSet = new Set(existingRows?.map(r => r.key));
    const keysToInsert: any[] = [];

    for (const [key, item] of keysInCode) {
        if (!existingKeysSet.has(key)) {
            keysToInsert.push({
                key: item.key,
                value: item.value,
                language: 'en',
                content_type: item.type,
                country_code: null,
                updated_at: new Date().toISOString()
            });
        }
    }

    // 3. Insert only new keys
    if (keysToInsert.length > 0) {
        console.log(`🆕 Inserting ${keysToInsert.length} new keys into 'cms_content' (language: en)...`);
        const { error: insertError } = await supabase
            .from('cms_content')
            .insert(keysToInsert);

        if (insertError) {
            console.error("❌ Error during insertion:", insertError.message);
        } else {
            console.log(`✅ Successfully inserted ${keysToInsert.length} new keys!`);
            keysToInsert.forEach(k => console.log(`   + ${k.key}`));
        }
    } else {
        console.log("✨ All keys found in code already exist in the database. Nothing to insert.");
    }

    process.exit(0);
}

function getAllFiles(dirPath: string, extensions: string[]): string[] {
    let files: string[] = [];
    if (!fs.existsSync(dirPath)) return files;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, extensions));
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
            files.push(fullPath);
        }
    }
    return files;
}

insertKeys().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
