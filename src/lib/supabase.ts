import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Pegar variáveis de ambiente (usar placeholders para permitir build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder";

/**
 * Cliente Supabase para uso no cliente (browser)
 * Usa a ANON KEY para operações autenticadas via RLS
 *
 * IMPORTANTE: As variáveis de ambiente são validadas em runtime, não em build time
 * Usa valores placeholder durante build se env vars não estiverem disponíveis
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Tipo helper para retorno de dados tipados
 */
export type SupabaseClient = typeof supabase;
