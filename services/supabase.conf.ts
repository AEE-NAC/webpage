import { createClient } from '@supabase/supabase-js';
import { Database } from './types_db'; 
import { CMSContentItem, CMSPopover } from './types';

const supabaseUrl = 'https://pfijkpxlsbyepxhwjsep.supabase.co';
const supabaseKey = 'sb_publishable_x3M92O40t4wvnrpoTlGTcw_0YpuIuw9';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Advanced CMS Service
 * Handles fetching content with cascading fallbacks:
 * 1. Specific Region + Language (e.g., 'fr' + 'BE')
 * 2. General Language (e.g., 'fr')
 * 3. Default Language (fallback)
 */
export const CMSService = {
  
  /**
   * Fetches all content keys starting with a specific prefix (e.g., "home.")
   * merges them into a single dictionary object.
   */
  async getPageContent(
    prefix: string, 
    lang: string, 
    countryCode?: string
  ): Promise<Record<string, string>> {
    
    // Fetch all potentially relevant rows for this namespace
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .ilike('key', `${prefix}%`)
      .in('language', [lang, 'en']); // Fetch current lang AND english fallback

    if (error || !data) {
      console.error('CMS Fetch Error:', error);
      return {};
    }

    const items = data as CMSContentItem[];
    const dictionary: Record<string, string> = {};

    // Helper to calculate score
    const getScore = (item: CMSContentItem) => {
      if (item.language === lang && item.country_code === countryCode) return 3;
      if (item.language === lang && !item.country_code) return 2;
      if (item.language === 'en') return 1;
      return 0;
    };

    // Group by key and pick winner
    const groupedByKey = items.reduce((acc, item) => {
      if (!acc[item.key]) acc[item.key] = item;
      else {
        if (getScore(item) > getScore(acc[item.key])) {
          acc[item.key] = item;
        }
      }
      return acc;
    }, {} as Record<string, CMSContentItem>);

    // Flatten to simple dictionary { "home.title": "Value" }
    Object.values(groupedByKey).forEach(item => {
      dictionary[item.key] = item.value;
    });

    return dictionary;
  },

  /**
   * Smart Upsert: Manual check to avoid duplicate rows on NULL constraint issues.
   */
  async upsertContent(content: Partial<CMSContentItem>) {
    if (!content.key || !content.language) {
        return { data: null, error: { message: 'Missing key or language' } };
    }

    // 1. Check if row exists specifically for this targeting
    // We cast query to 'any' to avoid rigid type narrowing issues with conditional chaining
    let query: any = supabase
        .from('cms_content')
        .select('id')
        .eq('key', content.key)
        .eq('language', content.language);

    if (content.country_code) {
        query = query.eq('country_code', content.country_code);
    } else {
        query = query.is('country_code', null);
    }

    const { data: existing } = await query.maybeSingle();

    let result;
    if (existing) {
        // 2. Update existing
        // Fix: Cast the query builder to 'any' to bypass 'never' type inference error on update
        result = await (supabase.from('cms_content') as any)
            .update({ 
                value: content.value, 
                content_type: content.content_type || 'text',
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();
    } else {
        // 3. Insert new
        result = await (supabase.from('cms_content') as any)
            .insert({
                key: content.key,
                language: content.language,
                country_code: content.country_code || null,
                content_type: content.content_type || 'text',
                value: content.value
            })
            .select()
            .single();
    }
    
    return { data: result.data, error: result.error };
  },

  /**
   * Checks for active popovers for the current context
   */
  async getActivePopover(lang: string, countryCode?: string): Promise<CMSPopover | null> {
    const now = new Date().toISOString();
    
    // We fetch candidates
    const { data } = await supabase
      .from('cms_popovers')
      .select('*')
      .eq('is_active', true)
      .lte('start_at', now)
      .or(`end_at.is.null,end_at.gte.${now}`)
      .in('language', [lang, 'en']);

    if (!data || data.length === 0) return null;

    // Filter using TS for precise country match logic similar to content
    const match = (data as any[]).find(p => 
      (p.language === lang && p.country_code === countryCode) || // Exact
      (p.language === lang && !p.country_code) // Lang generic
    );

    return match || data[0] as CMSPopover; // Return specific or first found
  }
};
