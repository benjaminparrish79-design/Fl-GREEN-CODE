import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeSupabase } from "@/lib/supabase";

export default function RootLayout() {
  useEffect(() => {
    initializeSupabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
