import { SupportedLanguage } from "@/context/adapt";

export type ContentType = 'text' | 'image' | 'html';

export interface CMSContentItem {
  id: string;
  key: string;
  language: SupportedLanguage;
  country_code?: string | null;
  content_type: ContentType;
  value: string;
}

export interface CMSPopover {
  id: string;
  name: string;
  is_active: boolean; // Status
  start_at: string | null; // ISO Date
  end_at: string | null; // ISO Date
  frequency_hours: number; // 0 = always, 24 = once a day
  
  language: SupportedLanguage;
  country_code?: string | null;
  
  type: 'template' | 'custom_html'; // Content Source
  component_type: 'modal' | 'banner'; // Display Style
  
  target_pages: string[]; // ['/', '/contact'] or ['*']
  
  title?: string;
  body?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  raw_html?: string;
}

export interface CMSWeeklyWord {
  id: string;
  language: SupportedLanguage;
  country_code?: string | null;
  title: string;
  content?: string;
  image_url?: string;
  author_name?: string;
  author_role?: string;
  start_date: string; // ISO
  end_date: string; // ISO
}

export interface CMSNewsletter {
  id: string;
  language: SupportedLanguage;
  country_code?: string | null;
  title: string;
  publication_date: string; // ISO
  pdf_url: string;
}

// The Dictionary structure used by the frontend components
export type CMSDictionary = {
  [key: string]: string; 
};

export interface CMSContextState {
  dictionary: CMSDictionary;
  isLoading: boolean;
  locale: SupportedLanguage;
}
