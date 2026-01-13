import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

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
-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR --

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

-- Policy to allow public read (Adjust as needed)
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.cms_content FOR SELECT USING (true);
-- Policy for inserting (in real app, restrict this!)
CREATE POLICY "Public Insert" ON public.cms_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON public.cms_content FOR UPDATE USING (true);

CREATE TABLE IF NOT EXISTS public.cms_popovers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT false,
    start_at timestamptz,
    end_at timestamptz,
    frequency_hours int DEFAULT 24,
    language text NOT NULL,
    country_code text,
    type text DEFAULT 'template',
    title text,
    body text,
    image_url text,
    cta_text text,
    cta_url text,
    raw_html text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cms_popovers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Popovers" ON public.cms_popovers FOR SELECT USING (true);
`;

// --- Logic ---

async function indexCMS() {
    console.log("🔍 Scanning app/ directory for CMS Content...");
    
    // 1. Scan Files
    const files = getAllFiles(path.join(process.cwd(), 'app'), ['.tsx', '.ts']);
    const keysFound = new Map<string, { key: string, defaultVal: string }>();

    let count = 0;
    
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const regex = /<CMSText\s+[^>]*?k=(['"])(.*?)\1[^>]*?defaultVal=(['"])(.*?)\3/gs;
        
        let match;
        while ((match = regex.exec(content)) !== null) {
            const key = match[2];
            const defaultVal = match[4];
            
            if (key && !keysFound.has(key)) {
                keysFound.set(key, { key, defaultVal });
                count++;
            }
        }
    });

    console.log(`✅ Found ${count} unique keys in codebase.`);

    if (keysFound.size === 0) {
        console.log("No keys to index.");
        return;
    }

    console.log("🚀 Syncing with Supabase...");

    const upsertPayload = Array.from(keysFound.values()).map(item => ({
        key: item.key,
        value: item.defaultVal,
        language: 'en', // Default base language for indexing
        content_type: 'text',
        updated_at: new Date().toISOString()
    }));

    // Check connection/table existence
    const { error: checkError } = await supabase.from('cms_content').select('id').limit(1);

    if (checkError) {
        // Fix for specific error message matching
        const isMissingTable = 
            checkError.code === '42P01' || 
            checkError.message.includes('Could not find the table') || 
            checkError.message.includes('does not exist');

        if (isMissingTable) {
            console.error("\n❌ ERROR: Database table 'cms_content' does not exist.");
            console.log("   Automatic table creation is not possible via the public client API.");
            console.log("\n⚠️  PLEASE RUN THIS SQL IN THE SUPABASE DASHBOARD -> SQL EDITOR:");
            console.log("\n" + "=".repeat(50));
            console.log(CREATE_TABLE_SQL);
            console.log("=".repeat(50) + "\n");
        } else {
            console.error("❌ Connection Error:", checkError.message);
        }
        return;
    }

    // Perform Upsert
    const { data, error } = await supabase
        .from('cms_content')
        .upsert(upsertPayload, { onConflict: 'key, language, country_code' })
        .select();

    if (error) {
        console.error("❌ Indexing Failed:", error.message);
    } else {
        console.log(`✨ Successfully indexed/updated ${data?.length || 0} keys in 'cms_content'.`);
        console.log(`   Language: 'en' (Base)`);
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
