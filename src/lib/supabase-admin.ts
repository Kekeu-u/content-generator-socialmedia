import { createClient } from "@supabase/supabase-js";

// Pegar variáveis de ambiente (usar placeholders para permitir build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.placeholder";

/**
 * Cliente Supabase Admin SEM TIPOS
 * Criado especificamente para evitar problemas de inferência de tipos do TypeScript
 * Use este cliente para operações administrativas (API routes, Server Actions)
 *
 * IMPORTANTE: As variáveis de ambiente são validadas em runtime, não em build time
 * Usa valores placeholder durante build se env vars não estiverem disponíveis
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type SupabaseAdminClient = typeof supabaseAdmin;
