import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "FL Green Guard",
  slug: "fl-green-guard",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "space.manus.flgreenguard",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0a7ea4",
      foregroundImage: "./assets/images/android-icon-foreground.png",
    },
    package: "space.manus.flgreenguard",
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
