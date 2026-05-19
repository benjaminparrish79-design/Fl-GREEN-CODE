import { ScrollView, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("_supabase_migrations").select("count");
      setIsConnected(!error);
    } catch (err) {
      setIsConnected(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ gap: 32 }}>
          {/* Hero Section */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 36, fontWeight: "bold", color: "#11181C" }}>
              FL Green Guard
            </Text>
            <Text style={{ fontSize: 16, color: "#687076", textAlign: "center" }}>
              Environmental Conservation for Florida
            </Text>
          </View>

          {/* Status Card */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#11181C", marginBottom: 8 }}>
              {isConnected ? "✓ Connected" : "✗ Disconnected"}
            </Text>
            <Text style={{ fontSize: 14, color: "#687076" }}>
              {isConnected
                ? "Successfully connected to Supabase"
                : "Unable to connect to Supabase"}
            </Text>
          </View>

          {/* Feature Cards */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#11181C", marginBottom: 8 }}>
              🌿 Track & Monitor
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", lineHeight: 21 }}>
              Monitor environmental data and track conservation efforts in real-time.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#11181C", marginBottom: 8 }}>
              📊 Data Analytics
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", lineHeight: 21 }}>
              View detailed analytics and insights about environmental conditions.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#11181C", marginBottom: 8 }}>
              🌍 Community Impact
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", lineHeight: 21 }}>
              Join the community and make a difference in Florida's environment.
            </Text>
          </View>

          {/* Action Button */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#0a7ea4",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 16 }}>
                Start Protecting
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
