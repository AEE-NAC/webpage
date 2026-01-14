export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cms_content: {
        Row: {
          id: string
          key: string
          language: string
          country_code: string | null
          content_type: 'text' | 'image' | 'html'
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          language: string
          country_code?: string | null
          content_type?: 'text' | 'image' | 'html'
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          language?: string
          country_code?: string | null
          content_type?: 'text' | 'image' | 'html'
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      cms_popovers: {
        Row: {
          id: string
          name: string
          is_active: boolean
          start_at: string | null
          end_at: string | null
          frequency_hours: number
          language: string
          country_code: string | null
          type: 'template' | 'custom_html'
          component_type: 'modal' | 'banner'
          target_pages: string[]
          title: string | null
          body: string | null
          image_url: string | null
          cta_text: string | null
          cta_url: string | null
          raw_html: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean
          start_at?: string | null
          end_at?: string | null
          frequency_hours?: number
          language: string
          country_code?: string | null
          type?: 'template' | 'custom_html'
          component_type?: 'modal' | 'banner'
          target_pages?: string[]
          title?: string | null
          body?: string | null
          image_url?: string | null
          cta_text?: string | null
          cta_url?: string | null
          raw_html?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_active?: boolean
          start_at?: string | null
          end_at?: string | null
          frequency_hours?: number
          language?: string
          country_code?: string | null
          type?: 'template' | 'custom_html'
          component_type?: 'modal' | 'banner'
          target_pages?: string[]
          title?: string | null
          body?: string | null
          image_url?: string | null
          cta_text?: string | null
          cta_url?: string | null
          raw_html?: string | null
          created_at?: string
        }
      }
      cms_weekly_words: {
        Row: {
          id: string
          language: string
          title: string
          content: string | null
          image_url: string | null
          author_name: string | null
          author_role: string | null
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          language: string
          title: string
          content?: string | null
          image_url?: string | null
          author_name?: string | null
          author_role?: string | null
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          language?: string
          title?: string
          content?: string | null
          image_url?: string | null
          author_name?: string | null
          author_role?: string | null
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      cms_newsletters: {
        Row: {
          id: string
          language: string
          title: string
          publication_date: string
          pdf_url: string
          created_at: string
        }
        Insert: {
          id?: string
          language: string
          title: string
          publication_date: string
          pdf_url: string
          created_at?: string
        }
        Update: {
          id?: string
          language?: string
          title?: string
          publication_date?: string
          pdf_url?: string
          created_at?: string
        }
      }
    }
  }
}
