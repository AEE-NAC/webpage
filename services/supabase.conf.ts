import { createClient } from '@supabase/supabase-js';
import { Database } from './types_db'; 
import { CMSContentItem, CMSPopover, CMSWeeklyWord, CMSNewsletter } from './types';

const supabaseUrl = 'https://pfijkpxlsbyepxhwjsep.supabase.co';
const supabaseKey = 'sb_publishable_x3M92O40t4wvnrpoTlGTcw_0YpuIuw9';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

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
    console.info(`[CMS Service] getPageContent: Chargement (prefix: "${prefix}", lang: "${lang}", region: "${countryCode || 'N/A'}")`);
    
    // Fetch all potentially relevant rows for this namespace
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .ilike('key', `${prefix}%`)
      .in('language', [lang, 'en']); // Fetch current lang AND english fallback

    if (error) {
      console.error(`[CMS Service] getPageContent ERROR:`, error.message);
      return {};
    }

    if (!data) {
      console.warn(`[CMS Service] getPageContent: Aucune donnée trouvée pour "${prefix}"`);
      return {};
    }

    console.info(`[CMS Service] getPageContent: ${data.length} entrées brutes récupérées.`);

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
            } as any)
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
            } as any)
            .select()
            .single();
    }
    
    return { data: result.data, error: result.error };
  },

  /**
   * --- POPOVERS & BANNERS ---
   */

  async getPopoversList(): Promise<CMSPopover[]> {
      const { data, error } = await supabase
        .from('cms_popovers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if(error) { 
        // Improved logging to catch table-does-not-exist errors
        console.error("Supabase Error (getPopoversList):", JSON.stringify(error, null, 2)); 
        return []; 
      }
      return (data || []) as CMSPopover[];
  },

  async upsertPopover(popover: Partial<CMSPopover>) {
      // Clean undefined to null for SQL
      const dataToSave = {
          ...popover,
          country_code: popover.country_code || null,
      };

      if (popover.id) {
          return await (supabase.from('cms_popovers') as any).update(dataToSave).eq('id', popover.id);
      } else {
          return await (supabase.from('cms_popovers') as any).insert(dataToSave);
      }
  },

  async deletePopover(id: string) {
      return await supabase.from('cms_popovers').delete().eq('id', id);
  },

  /**
   * --- WEEKLY WORDS ---
   */
  async getWeeklyWords(lang?: string): Promise<CMSWeeklyWord[]> {
    console.log(`[Supabase Query] getWeeklyWords(lang: ${lang || 'all'})`);
    let query = supabase.from('cms_weekly_words').select('*').order('start_date', { ascending: false });
    if (lang) query = query.eq('language', lang);
    const { data, error } = await query;
    if (error) console.error(`[Supabase Error] getWeeklyWords:`, error.message);
    return (data as CMSWeeklyWord[]) || [];
  },

  async getWeeklyWordById(id: string) {
      const { data, error } = await supabase.from('cms_weekly_words').select('*').eq('id', id).single();
      if(error) return null;
      return data as CMSWeeklyWord;
  },

  async upsertWeeklyWord(item: Partial<CMSWeeklyWord>) {
      if (item.id) {
          return await (supabase.from('cms_weekly_words') as any).update(item).eq('id', item.id);
      } else {
          return await (supabase.from('cms_weekly_words') as any).insert(item);
      }
  },

  async deleteWeeklyWord(id: string) {
      return await supabase.from('cms_weekly_words').delete().eq('id', id);
  },

  /**
   * --- NEWSLETTERS ---
   */
  async getNewsletters(lang?: string, country?: string): Promise<CMSNewsletter[]> {
    console.log(`[Supabase Query] getNewsletters(lang: ${lang || 'all'}, country: ${country || 'all'})`);
    let query = supabase.from('cms_newsletters').select('*').order('publication_date', { ascending: false });
    if (lang) query = query.eq('language', lang);
    if (country) query = query.eq('country_code', country);
    const { data, error } = await query;
    if (error) console.error(`[Supabase Error] getNewsletters:`, error.message);
    return (data as CMSNewsletter[]) || [];
  },

  async upsertNewsletter(item: Partial<CMSNewsletter>) {
      if (item.id) {
          return await (supabase.from('cms_newsletters') as any).update(item).eq('id', item.id);
      } else {
          return await (supabase.from('cms_newsletters') as any).insert(item);
      }
  },

  async deleteNewsletter(id: string) {
      return await supabase.from('cms_newsletters').delete().eq('id', id);
  },

  /**
   * Fetches ACTIVE popovers/banners for the current context.
   * Filtering by 'target_pages' is better done on the client to avoid cache fragmentation via URL parameters.
   */
  async getActivePopovers(lang: string, countryCode?: string): Promise<CMSPopover[]> {
    const now = new Date().toISOString();
    
    // Fetch candidates active by time
    const { data } = await supabase
      .from('cms_popovers')
      .select('*')
      .eq('is_active', true)
      .lte('start_at', now)
      .or(`end_at.is.null,end_at.gte.${now}`)
      .in('language', [lang, 'en']); // Language match or global

    if (!data || data.length === 0) return [];

    // Filter by specific language priority
    // For Popovers we might want multiple active (e.g. a Banner AND a Modal)
    // But we probably don't want 2 banners.
    
    return (data as CMSPopover[]).filter(p => {
        // Strict country check if popover has one
        if (p.country_code && p.country_code !== countryCode) return false;
        return true;
    });
  }
};
