import { createClient } from "@supabase/supabase-js";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const supabaseAdmin = () =>
  createClient(mustGet("SUPABASE_URL"), mustGet("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });

export const supabasePublic = () =>
  createClient(mustGet("SUPABASE_URL"), mustGet("SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });