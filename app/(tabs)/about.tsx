import { ScrollView, Text, View, SafeAreaView } from "react-native";

export default function AboutScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ gap: 24 }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#11181C" }}>
              About FL Green Guard
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 12 }}>
              Our Mission
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", lineHeight: 21 }}>
              FL Green Guard is dedicated to protecting and preserving Florida's unique ecosystems.
              We provide tools and resources for environmental monitoring, data collection, and
              community engagement.
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 12 }}>
              Key Features
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", lineHeight: 21 }}>
              • Real-time environmental monitoring{"\n"}
              • Data analytics and reporting{"\n"}
              • Community collaboration tools{"\n"}
              • Conservation tracking{"\n"}
              • Educational resources
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 12 }}>
              Developer
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", marginBottom: 8 }}>Benjamin Parrish</Text>
            <Text style={{ fontSize: 14, color: "#687076" }}>Emerald Coast Dynamics Inc</Text>
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#11181C", marginBottom: 12 }}>
              Version
            </Text>
            <Text style={{ fontSize: 14, color: "#687076" }}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
