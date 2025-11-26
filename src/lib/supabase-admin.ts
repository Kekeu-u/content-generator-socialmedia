import { createClient } from "@supabase/supabase-js";

// Pegar variáveis de ambiente (não validar no import time para permitir build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Cliente Supabase Admin SEM TIPOS
 * Criado especificamente para evitar problemas de inferência de tipos do TypeScript
 * Use este cliente para operações administrativas (API routes, Server Actions)
 *
 * IMPORTANTE: As variáveis de ambiente são validadas em runtime, não em build time
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type SupabaseAdminClient = typeof supabaseAdmin;
