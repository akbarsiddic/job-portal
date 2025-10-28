import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or Key is missing");
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};
