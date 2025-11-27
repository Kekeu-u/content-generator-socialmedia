import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Pegar variáveis de ambiente (não validar no import time para permitir build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Cliente Supabase para uso no cliente (browser)
 * Usa a ANON KEY para operações autenticadas via RLS
 *
 * IMPORTANTE: As variáveis de ambiente são validadas em runtime, não em build time
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Cliente Supabase para uso no servidor (Server Components, API Routes)
 * Usa a SERVICE ROLE KEY para operações privilegiadas
 * ATENÇÃO: Nunca expor no cliente!
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Tipo helper para retorno de dados tipados
 */
export type SupabaseClient = typeof supabase;
