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
  frequency_hours: number;
  type: 'template' | 'custom_html';
  title?: string;
  body?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  raw_html?: string;
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
