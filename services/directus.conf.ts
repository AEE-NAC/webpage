import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  createItem,
  updateItem,
  deleteItem,
} from '@directus/sdk';
import type { CMSContentItem, CMSPopover, CMSWeeklyWord, CMSNewsletter } from './types';
import { SupportedLanguage } from '@/context/adapt';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';
const isServer = typeof window === 'undefined';
const adminUsername = isServer ? process.env.ADMIN_USERNAME || '' : '';
const adminPassword = isServer ? process.env.ADMIN_PASSWORD || '' : '';
let runtimeDirectusToken = directusToken;

function normalizeLangCode(lang: string): string {
  const map: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    es: 'es-ES',
    ht: 'ht-HT',
  };

  return map[lang] || lang;
}

// Types pour les collections Directus avec traductions intégrées
interface DirectusCMSContent {
  id: string;
  key: string;
  content_type: 'text' | 'image' | 'html';
  status?: 'draft' | 'published' | 'archived';
  value?: string;
  date_created?: string;
  date_updated?: string;
  translations: Array<{
    id: string;
    languages_code: string;
    value?: string;
  }>;
}

interface DirectusCMSPopover {
  id: string;
  name: string;
  is_active?: boolean;
  component_type?: 'modal' | 'banner';
  target_pages?: any;
  image?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  status?: 'draft' | 'published' | 'archived';
  translations: Array<{
    id: string;
    languages_code: string;
    title?: string;
    body?: string;
    cta_text?: string;
    cta_url?: string;
  }>;
}

interface DirectusCMSWeeklyWord {
  id: string;
  start_date?: string;
  end_date?: string;
  image?: string | null;
  status?: 'draft' | 'published' | 'archived';
  translations: Array<{
    id: string;
    languages_code: string;
    title?: string;
    content?: string;
    author_name?: string;
    author_role?: string;
  }>;
}

interface DirectusCMSNewsletter {
  id: string;
  publication_date?: string;
  pdf_file?: string | null;
  translations: Array<{
    id: string;
    languages_code: string;
    title?: string;
  }>;
}

interface DirectusSchema {
  cms_content: DirectusCMSContent[];
  cms_popovers: DirectusCMSPopover[];
  cms_weekly_words: DirectusCMSWeeklyWord[];
  cms_newsletters: DirectusCMSNewsletter[];
}

type DirectusRequest = <T>(query: any) => Promise<T>;

function buildClient(token?: string) {
  let client = createDirectus<DirectusSchema>(directusUrl).with(rest());
  if (token) {
    client = client.with(staticToken(token));
  }
  return client;
}

export const directus = buildClient(directusToken);

const dReadItems: any = readItems;
const dReadItem: any = readItem;
const dCreateItem: any = createItem;
const dUpdateItem: any = updateItem;
const dDeleteItem: any = deleteItem;

function isAuthError(error: any): boolean {
  const message = String(error?.message || '');
  const nested = String(error?.errors?.[0]?.message || '');
  const status = error?.response?.status;
  return (
    status === 401 ||
    message.toLowerCase().includes('invalid user credentials') ||
    nested.toLowerCase().includes('invalid user credentials')
  );
}

async function loginAdmin(): Promise<string | null> {
  if (!isServer || !adminUsername || !adminPassword) return null;

  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminUsername, password: adminPassword }),
  });

  const json = (await response.json().catch(() => ({}))) as any;
  const accessToken = json?.data?.access_token as string | undefined;
  if (!response.ok || !accessToken) {
    return null;
  }

  return accessToken;
}

async function requestDirectus<T>(query: any): Promise<T> {
  const client = buildClient(runtimeDirectusToken);

  try {
    return await client.request<T>(query);
  } catch (error) {
    if (!isServer || !isAuthError(error)) {
      throw error;
    }

    const refreshed = await loginAdmin();
    if (!refreshed) {
      throw error;
    }

    runtimeDirectusToken = refreshed;
    const retryClient = buildClient(runtimeDirectusToken);
    return await retryClient.request<T>(query);
  }
}

/**
 * CMS Service for Directus
 * Supports i18n with translation fallback chain
 */
export const createCMSService = (request: DirectusRequest, baseUrl: string = directusUrl) => ({
  
  /**
   * Fetch page content with i18n fallback chain
   * Priority: lang+country > lang > fr+country > fr > en
   */
  async getPageContent(
    prefix: string,
    lang: string,
    countryCode?: string,
    extraPrefixes: string[] = []
  ): Promise<Record<string, string>> {
    const envLabel = isServer ? '[SERVER]' : '[CLIENT]';
    const normalizedLang = normalizeLangCode(lang);
    
    console.info(
      `${envLabel} [CMS Directus] getPageContent: prefix="${prefix}", lang="${lang}", region="${countryCode || 'N/A'}"`
    );

    const allPrefixes = [
      prefix,
      'shared.',
      'nav.',
      'footer.',
      'layout.',
      'header.',
      'home.',
      ...extraPrefixes
    ].filter(Boolean);

    try {
      // Directus query: récupérer tous les cms_content
      // On va filtrer côté client car Directus a une syntaxe de filtre complexe
      const query = dReadItems('cms_content', {
        fields: [
          'id',
          'key',
          'content_type',
          'status',
          'translations.id',
          'translations.languages_code',
          'translations.value'
        ],
        limit: -1, // No limit
      });

      const items = await request<DirectusCMSContent[]>(query);

      if (!Array.isArray(items)) {
        console.warn(`${envLabel} [CMS Directus] No items found for prefixes:`, allPrefixes);
        return {};
      }

      // Filtrer les items selon les prefixes
      const filteredItems = items.filter(item =>
        allPrefixes.some(p => item.key.startsWith(p)) && item.status !== 'archived'
      );

      console.info(`${envLabel} [CMS Directus] Loaded ${filteredItems.length} items out of ${items.length} total`);

      const dictionary: Record<string, string> = {};

      // Priority chain: lang+country (4) > lang (3) > fr (2) > en (1)
      const getScore = (langCode: string): number => {
        if (langCode === normalizedLang) return 3;
        if (langCode === 'fr-FR' || langCode === 'fr') return 2;
        if (langCode === 'en-US' || langCode === 'en') return 1;
        return 0;
      };

      // Pour chaque clé, trouver la meilleure traduction
      filteredItems.forEach((item) => {
        if (!item.translations || item.translations.length === 0) {
          return;
        }

        // Chercher la traduction avec le meilleur score
        let bestTranslation = item.translations[0];
        let bestScore = getScore(bestTranslation.languages_code);

        for (const trans of item.translations) {
          const score = getScore(trans.languages_code);
          if (score > bestScore) {
            bestScore = score;
            bestTranslation = trans;
          }
        }

        if (bestTranslation.value) {
          dictionary[item.key] = bestTranslation.value;
        }
      });

      console.info(`${envLabel} [CMS Directus] Dictionary built: ${Object.keys(dictionary).length} keys`);
      return dictionary;

    } catch (error) {
      console.error(`${envLabel} [CMS Directus] Error:`, error);
      return {};
    }
  },

  /**
   * Upsert content via Directus
   */
  async upsertContent(content: Partial<CMSContentItem>) {
    if (!content.key || !content.language) {
      return { data: null, error: { message: 'Missing key or language' } };
    }

    try {
      // Vérifier si l'item existe
      const existingItems = await request<DirectusCMSContent[]>(
        dReadItems('cms_content', {
          fields: ['id', 'key', 'translations.languages_code'],
          limit: 1,
        })
      );

      const existing = Array.isArray(existingItems) 
        ? existingItems.find(item => item.key === content.key)
        : null;

      if (existing) {
        // Update translation dans l'item existant
        const itemId = existing.id;
        
        const result = await request(
          dUpdateItem('cms_content', itemId, {
            translations: [
              {
                languages_code: content.language,
                value: content.value
              }
            ]
          })
        );
        return { data: result, error: null };
      } else {
        // Créer un nouvel item
        const result = await request(
          dCreateItem('cms_content', {
            key: content.key,
            content_type: content.content_type || 'text',
            status: 'published',
            translations: [
              {
                languages_code: content.language,
                value: content.value
              }
            ]
          })
        );
        return { data: result, error: null };
      }
    } catch (error: any) {
      console.error('[Directus] Upsert error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get active popovers
   */
  async getActivePopovers(lang: string, countryCode?: string): Promise<CMSPopover[]> {
    try {
      const normalizedLang = normalizeLangCode(lang);
      const now = new Date().toISOString();
      const items = await request<DirectusCMSPopover[]>(
        dReadItems('cms_popovers', {
          fields: [
            'id',
            'name',
            'is_active',
            'component_type',
            'target_pages',
            'start_at',
            'end_at',
            'image',
            'status',
            'translations.languages_code',
            'translations.title',
            'translations.body',
            'translations.cta_text',
            'translations.cta_url'
          ],
          limit: -1,
        })
      );

      if (!Array.isArray(items)) return [];

      // Filtrer les popovers actifs
      const activeItems = items.filter(p => {
        if (p.status === 'archived' || !p.is_active) return false;
        if (p.start_at && new Date(p.start_at) > new Date(now)) return false;
        if (p.end_at && new Date(p.end_at) < new Date(now)) return false;
        return true;
      });

      return activeItems.map(p => {
        const trans = p.translations?.find((t: any) => t.languages_code === normalizedLang) ||
                     p.translations?.find((t: any) => t.languages_code === 'fr-FR') ||
                     p.translations?.find((t: any) => t.languages_code === 'en-US') ||
                     p.translations?.[0];
        return {
          id: p.id || '',
          name: p.name || '',
          is_active: p.is_active || false,
          component_type: (p.component_type || 'modal') as 'modal' | 'banner',
          target_pages: p.target_pages || ['*'],
          image_url: p.image ? `${baseUrl}/assets/${p.image}` : undefined,
          title: trans?.title,
          body: trans?.body,
          cta_text: trans?.cta_text,
          cta_url: trans?.cta_url,
          start_at: p.start_at,
          end_at: p.end_at,
          type: 'template',
          frequency_hours: 0,
          language: lang as SupportedLanguage,
          country_code: countryCode,
          raw_html: undefined
        } as CMSPopover;
      });
    } catch (error) {
      console.error('[Directus] getActivePopovers error:', error);
      return [];
    }
  },

  /**
   * Get weekly words
   */
  async getWeeklyWords(lang: string = 'en', countryCode?: string): Promise<CMSWeeklyWord[]> {
    try {
      const normalizedLang = normalizeLangCode(lang);
      const items = await request<DirectusCMSWeeklyWord[]>(
        dReadItems('cms_weekly_words', {
          fields: [
            'id',
            'start_date',
            'end_date',
            'image',
            'status',
            'translations.languages_code',
            'translations.title',
            'translations.content',
            'translations.author_name',
            'translations.author_role'
          ],
          sort: ['-start_date'],
          limit: -1,
        })
      );

      if (!Array.isArray(items)) return [];

      // Filtrer les non-archivés
      const activeItems = items.filter(w => w.status !== 'archived');

      return activeItems.map(w => {
        const trans = w.translations?.find((t: any) => t.languages_code === normalizedLang) ||
                     w.translations?.find((t: any) => t.languages_code === 'fr-FR') ||
                     w.translations?.find((t: any) => t.languages_code === 'en-US') ||
                     w.translations?.[0];
        return {
          id: w.id || '',
          language: lang as SupportedLanguage,
          country_code: countryCode,
          start_date: w.start_date || '',
          end_date: w.end_date || '',
          image_url: w.image ? `${baseUrl}/assets/${w.image}` : undefined,
          title: trans?.title || '',
          content: trans?.content || '',
          author_name: trans?.author_name,
          author_role: trans?.author_role,
        } as CMSWeeklyWord;
      });
    } catch (error) {
      console.error('[Directus] getWeeklyWords error:', error);
      return [];
    }
  },

  /**
   * Get newsletters
   */
  async getNewsletters(lang: string = 'en', country?: string): Promise<CMSNewsletter[]> {
    try {
      const normalizedLang = normalizeLangCode(lang);
      const items = await request<DirectusCMSNewsletter[]>(
        dReadItems('cms_newsletters', {
          fields: [
            'id',
            'publication_date',
            'pdf_file',
            'translations.languages_code',
            'translations.title'
          ],
          sort: ['-publication_date'],
          limit: -1,
        })
      );

      if (!Array.isArray(items)) return [];

      return items.map(n => {
        const trans = n.translations?.find((t: any) => t.languages_code === normalizedLang) ||
                     n.translations?.find((t: any) => t.languages_code === 'fr-FR') ||
                     n.translations?.find((t: any) => t.languages_code === 'en-US') ||
                     n.translations?.[0];
        return {
          id: n.id || '',
          language: lang as SupportedLanguage,
          country_code: country,
          publication_date: n.publication_date || '',
          pdf_url: n.pdf_file ? `${baseUrl}/assets/${n.pdf_file}` : '',
          title: trans?.title || '',
        } as CMSNewsletter;
      });
    } catch (error) {
      console.error('[Directus] getNewsletters error:', error);
      return [];
    }
  },

  /**
   * Get asset URL with optional transformations
   */
  getAssetUrl(fileId: string, options?: { width?: number; format?: 'webp' | 'jpg' | 'png' }): string {
    let url = `${baseUrl}/assets/${fileId}`;
    const params = [];
    
    if (options?.width) params.push(`width=${options.width}`);
    if (options?.format) params.push(`format=${options.format}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return url;
  },

  /**
   * Get all popovers (admin view)
   */
  async getPopoversList(): Promise<CMSPopover[]> {
    try {
      const items = await request<DirectusCMSPopover[]>(
        dReadItems('cms_popovers', {
          fields: [
            'id',
            'name',
            'is_active',
            'component_type',
            'target_pages',
            'start_at',
            'end_at',
            'image',
            'status',
            'translations.languages_code',
            'translations.title',
            'translations.body',
            'translations.cta_text',
            'translations.cta_url'
          ],
          sort: ['-date_created'],
          limit: -1,
        })
      );

      if (!Array.isArray(items)) return [];

      return items.map(p => {
        const trans = p.translations?.[0];
        return {
          id: p.id,
          name: p.name,
          is_active: p.is_active || false,
          component_type: p.component_type as 'modal' | 'banner',
          target_pages: p.target_pages || [],
          image_url: p.image ? `${baseUrl}/assets/${p.image}` : undefined,
          title: trans?.title,
          body: trans?.body,
          cta_text: trans?.cta_text,
          cta_url: trans?.cta_url,
          start_at: p.start_at,
          end_at: p.end_at,
          language: 'en' as any,
          country_code: null,
          type: 'template' as any,
          frequency_hours: 0,
          raw_html: undefined,
        } as CMSPopover;
      });
    } catch (error) {
      console.error('[Directus] getPopoversList error:', error);
      return [];
    }
  },

  /**
   * Upsert popover
   */
  async upsertPopover(popover: Partial<CMSPopover>) {
    try {
      if (popover.id) {
        // Update
        const result = await request(
          dUpdateItem('cms_popovers', popover.id, {
            name: popover.name,
            is_active: popover.is_active,
            component_type: popover.component_type,
            target_pages: popover.target_pages,
            start_at: popover.start_at,
            end_at: popover.end_at,
            status: 'published',
            translations: [
              {
                languages_code: popover.language || 'en-US',
                title: popover.title,
                body: popover.body,
                cta_text: popover.cta_text,
                cta_url: popover.cta_url,
              }
            ]
          })
        );
        return { data: result, error: null };
      } else {
        // Insert
        const result = await request(
          dCreateItem('cms_popovers', {
            name: popover.name,
            is_active: popover.is_active || false,
            component_type: popover.component_type || 'modal',
            target_pages: popover.target_pages || [],
            start_at: popover.start_at,
            end_at: popover.end_at,
            status: 'published',
            translations: [
              {
                languages_code: popover.language || 'en-US',
                title: popover.title,
                body: popover.body,
                cta_text: popover.cta_text,
                cta_url: popover.cta_url,
              }
            ]
          })
        );
        return { data: result, error: null };
      }
    } catch (error: any) {
      console.error('[Directus] upsertPopover error:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete popover
   */
  async deletePopover(id: string) {
    try {
      const result = await request(
        dDeleteItem('cms_popovers', id)
      );
      return { data: result, error: null };
    } catch (error: any) {
      console.error('[Directus] deletePopover error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get weekly word by ID
   */
  async getWeeklyWordById(id: string, lang: string = 'fr'): Promise<CMSWeeklyWord | null> {
    try {
      const item = await request<DirectusCMSWeeklyWord>(
        dReadItem('cms_weekly_words', id, {
          fields: [
            'id',
            'start_date',
            'end_date',
            'image',
            'status',
            'translations.languages_code',
            'translations.title',
            'translations.content',
            'translations.author_name',
            'translations.author_role'
          ]
        })
      );

      if (!item) return null;

      const normalizedLang = normalizeLangCode(lang);
      const trans = item.translations?.find((t: any) => t.languages_code === normalizedLang) ||
                   item.translations?.find((t: any) => t.languages_code === 'fr-FR') ||
                   item.translations?.find((t: any) => t.languages_code === 'en-US') ||
                   item.translations?.[0];

      return {
        id: item.id || '',
        language: normalizedLang as SupportedLanguage,
        start_date: item.start_date || new Date().toISOString(),
        end_date: item.end_date || new Date().toISOString(),
        image_url: item.image ? `${baseUrl}/assets/${item.image}` : undefined,
        title: trans?.title || '',
        content: trans?.content || '',
        author_name: trans?.author_name,
        author_role: trans?.author_role,
      } as CMSWeeklyWord;
    } catch (error) {
      console.error('[Directus] getWeeklyWordById error:', error);
      return null;
    }
  },

  /**
   * Upsert weekly word
   */
  async upsertWeeklyWord(item: Partial<CMSWeeklyWord>) {
    try {
      if (item.id) {
        // Update
        const result = await request(
          dUpdateItem('cms_weekly_words', item.id, {
            start_date: item.start_date,
            end_date: item.end_date,
            status: 'published',
            translations: [
              {
                languages_code: item.language || 'en-US',
                title: item.title,
                content: item.content,
                author_name: item.author_name,
                author_role: item.author_role,
              }
            ]
          })
        );
        return { data: result, error: null };
      } else {
        // Insert
        const result = await request(
          dCreateItem('cms_weekly_words', {
            start_date: item.start_date,
            end_date: item.end_date,
            status: 'published',
            translations: [
              {
                languages_code: item.language || 'en-US',
                title: item.title,
                content: item.content,
                author_name: item.author_name,
                author_role: item.author_role,
              }
            ]
          })
        );
        return { data: result, error: null };
      }
    } catch (error: any) {
      console.error('[Directus] upsertWeeklyWord error:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete weekly word
   */
  async deleteWeeklyWord(id: string) {
    try {
      const result = await request(
        dDeleteItem('cms_weekly_words', id)
      );
      return { data: result, error: null };
    } catch (error: any) {
      console.error('[Directus] deleteWeeklyWord error:', error);
      return { data: null, error };
    }
  },

  /**
   * Upsert newsletter
   */
  async upsertNewsletter(item: Partial<CMSNewsletter>) {
    try {
      if (item.id) {
        // Update
        const result = await request(
          dUpdateItem('cms_newsletters', item.id, {
            publication_date: item.publication_date,
            translations: [
              {
                languages_code: item.language || 'en-US',
                title: item.title,
              }
            ]
          })
        );
        return { data: result, error: null };
      } else {
        // Insert
        const result = await request(
          dCreateItem('cms_newsletters', {
            publication_date: item.publication_date,
            translations: [
              {
                languages_code: item.language || 'en-US',
                title: item.title,
              }
            ]
          })
        );
        return { data: result, error: null };
      }
    } catch (error: any) {
      console.error('[Directus] upsertNewsletter error:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete newsletter
   */
  async deleteNewsletter(id: string) {
    try {
      const result = await request(
        dDeleteItem('cms_newsletters', id)
      );
      return { data: result, error: null };
    } catch (error: any) {
      console.error('[Directus] deleteNewsletter error:', error);
      return { data: null, error };
    }
  }
});

export const CMSService = createCMSService(requestDirectus, directusUrl);
