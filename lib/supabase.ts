import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://gpfbgllazvxykxoqgopz.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZmJnbGxhenZ4eWt4b3Fnb3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NDU2MDEsImV4cCI6MjA4ODQyMTYwMX0.eaWUaDU04WUgTIV2vim7ZwGgnpGoCGi_xsP4HmpKwkE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeSupabase = async () => {
  try {
    // Test connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase initialization error:", error);
    } else {
      console.log("Supabase initialized successfully");
    }
  } catch (err) {
    console.error("Failed to initialize Supabase:", err);
  }
};
