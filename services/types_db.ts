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
          title: string | null
          body: string | null
          image_url: string | null
          cta_text: string | null
          cta_url: string | null
          raw_html: string | null
          created_at: string
        }
      }
    }
  }
}
