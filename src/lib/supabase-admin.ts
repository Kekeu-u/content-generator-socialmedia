import { createClient } from "@supabase/supabase-js";

// Validar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

/**
 * Cliente Supabase Admin SEM TIPOS
 * Criado especificamente para evitar problemas de inferência de tipos do TypeScript
 * Use este cliente para operações administrativas (API routes, Server Actions)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type SupabaseAdminClient = typeof supabaseAdmin;
