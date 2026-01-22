import { supabase } from "@/services/supabase.conf";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const type = searchParams.get('type') || 'tree'; // 'tree' or 'list'

  try {
    let query = supabase.from('cms_content').select('key, value, language, country_code, content_type');

    if (search) {
      // Search in key OR in value
      query = query.or(`key.ilike.%${search}%,value.ilike.%${search}%`);
    }

    const { data: rawData, error } = await query;

    if (error) throw error;

    // Type 1: Simple list (good for searching specific values)
    if (type === 'list' && search) {
      return NextResponse.json({ data: rawData });
    }

    // Type 2: Hierarchical Tree (Page -> Section -> Keys) checking what exists
    // We aggregate keys to determine structure
    const tree: Record<string, any> = {};

    rawData?.forEach((item:any) => {
      // Expecting key format: page.section.element (e.g., home.hero.title)
      const parts = item.key.split('.');
      
      // If key format matches strict convention
      if (parts.length >= 2) {
        const page = parts[0];
        const section = parts[1];
        const keyName = parts.slice(2).join('.') || 'root'; // Handle deeper nesting or short keys
        
        if (!tree[page]) tree[page] = {};
        if (!tree[page][section]) tree[page][section] = [];
        
        // Add unique key to the section list
        const existingEntry = tree[page][section].find((k: any) => k.key === keyName);
        if (!existingEntry) {
            tree[page][section].push({
                key: keyName,
                full_key: item.key,
                available_langs: [item.language], // simplistic for preview
                has_regional_override: !!item.country_code
            });
        } else {
             if (!existingEntry.available_langs.includes(item.language)) {
                 existingEntry.available_langs.push(item.language);
             }
             if (item.country_code) existingEntry.has_regional_override = true;
        }
      }
    });

    return NextResponse.json({ structure: tree });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
