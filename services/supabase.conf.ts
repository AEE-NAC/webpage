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

    // We process items to ensure the most specific version wins.
    // Order of specificity:
    // 1. Lang matches AND Country matches
    // 2. Lang matches AND Country is null
    // 3. Lang is 'en' (Fallback)

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

  async upsertContent(content: Partial<CMSContentItem>) {
    // @ts-ignore - Supabase type inference can be tricky with partial inserts on upsert
    const { data, error } = await supabase
      .from('cms_content')
      .upsert(content as any, { onConflict: 'key, language, country_code' })
      .select()
      .single();
    
    return { data, error };
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
