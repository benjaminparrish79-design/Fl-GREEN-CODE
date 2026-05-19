import { ScrollView, Text, View, SafeAreaView, Switch } from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ gap: 24 }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#11181C" }}>
              Settings
            </Text>
          </View>

          {/* Appearance Section */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 16 }}>
              Appearance
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: "#687076" }}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </View>

          {/* Notifications Section */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 16 }}>
              Notifications
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: "#687076" }}>Enable Notifications</Text>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>
          </View>

          {/* About Section */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 12 }}>
              About
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", marginBottom: 8 }}>
              FL Green Guard v1.0.0
            </Text>
            <Text style={{ fontSize: 12, color: "#9BA1A6", marginBottom: 12 }}>
              Environmental Conservation for Florida
            </Text>
            <Text style={{ fontSize: 12, color: "#9BA1A6", marginBottom: 4 }}>
              Developer: Benjamin Parrish
            </Text>
            <Text style={{ fontSize: 12, color: "#9BA1A6" }}>
              Emerald Coast Dynamics Inc
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
