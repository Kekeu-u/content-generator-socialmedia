// Tipos gerados automaticamente do schema do Supabase
// Para gerar tipos automaticamente, use: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_media_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
          status: "draft" | "published" | "archived";
          hashtags: string[] | null;
          prompt_used: string | null;
          model_used: string;
          generation_metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
          status?: "draft" | "published" | "archived";
          hashtags?: string[] | null;
          prompt_used?: string | null;
          model_used?: string;
          generation_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          platform?: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
          status?: "draft" | "published" | "archived";
          hashtags?: string[] | null;
          prompt_used?: string | null;
          model_used?: string;
          generation_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      generated_images: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          prompt: string;
          image_url: string;
          storage_path: string | null;
          width: number | null;
          height: number | null;
          model_used: string;
          generation_metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          prompt: string;
          image_url: string;
          storage_path?: string | null;
          width?: number | null;
          height?: number | null;
          model_used?: string;
          generation_metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string | null;
          prompt?: string;
          image_url?: string;
          storage_path?: string | null;
          width?: number | null;
          height?: number | null;
          model_used?: string;
          generation_metadata?: Json | null;
          created_at?: string;
        };
      };
      prompts_library: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          prompt_text: string;
          category: string | null;
          is_favorite: boolean;
          tags: string[] | null;
          usage_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          prompt_text: string;
          category?: string | null;
          is_favorite?: boolean;
          tags?: string[] | null;
          usage_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          prompt_text?: string;
          category?: string | null;
          is_favorite?: boolean;
          tags?: string[] | null;
          usage_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      generation_history: {
        Row: {
          id: string;
          user_id: string;
          generation_type: "text" | "image";
          prompt: string;
          result: string | null;
          model_used: string;
          tokens_used: number | null;
          generation_time_ms: number | null;
          cost: number | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          generation_type: "text" | "image";
          prompt: string;
          result?: string | null;
          model_used: string;
          tokens_used?: number | null;
          generation_time_ms?: number | null;
          cost?: number | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          generation_type?: "text" | "image";
          prompt?: string;
          result?: string | null;
          model_used?: string;
          tokens_used?: number | null;
          generation_time_ms?: number | null;
          cost?: number | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      usage_statistics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          text_generations_count: number;
          image_generations_count: number;
          total_tokens_used: number;
          total_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          text_generations_count?: number;
          image_generations_count?: number;
          total_tokens_used?: number;
          total_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          text_generations_count?: number;
          image_generations_count?: number;
          total_tokens_used?: number;
          total_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      user_stats_summary: {
        Row: {
          id: string | null;
          email: string | null;
          full_name: string | null;
          total_posts: number | null;
          total_images: number | null;
          total_text_generations: number | null;
          total_image_generations: number | null;
          total_spent: number | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
