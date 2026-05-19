# FL Green Guard - Mobile App

Environmental Conservation Mobile Application for Florida

## About

FL Green Guard is a native mobile application designed to support environmental monitoring and conservation efforts in Florida. The app provides tools for tracking environmental data, analyzing conservation metrics, and engaging with the community.

## Developer Information

**Developer**: Benjamin Parrish  
**Company**: Emerald Coast Dynamics Inc

## Features

- 🌿 Real-time environmental monitoring
- 📊 Data analytics and reporting
- 🌍 Community collaboration tools
- 📱 Cross-platform mobile support (iOS & Android)
- 🔐 Secure Supabase backend integration
- 🔄 Real-time data synchronization

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: React Native Native styling
- **Navigation**: Expo Router
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on Web
pnpm web
```

## Environment Variables

Create a `.env.local` file with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://gpfbgllazvxykxoqgopz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Building APK for Android

```bash
# Build APK
pnpm build

# Or use EAS Build
eas build --platform android
```

## Project Structure

```
app/
  (tabs)/
    _layout.tsx     # Tab navigation layout
    index.tsx       # Home screen
    about.tsx       # About screen
    settings.tsx    # Settings screen
  _layout.tsx       # Root layout and providers
lib/
  supabase.ts       # Supabase client configuration
assets/
  images/           # App icons and images
```

## App Screens

### Home Screen
- Welcome message and app branding
- Supabase connection status
- Feature highlights
- Call-to-action button

### About Screen
- App mission and description
- Key features list
- Developer and company information
- Version information

### Settings Screen
- Dark mode toggle
- Notification preferences
- About section with developer credits
- Company information

## Supabase Integration

The app connects to Supabase for:
- Authentication
- Real-time data synchronization
- Cloud storage
- Edge functions for backend logic

## Building and Deployment

### Local Testing

```bash
# Start Expo dev server
pnpm dev

# Scan QR code with Expo Go app on your phone
# Or use Android/iOS emulator
```

### Production Build

```bash
# Build APK for Android
eas build --platform android

# Build IPA for iOS
eas build --platform ios
```

## License

All rights reserved © Emerald Coast Dynamics Inc

## Contact

For questions or support, please contact:

**Benjamin Parrish**  
**Emerald Coast Dynamics Inc**

---

**Version**: 1.0.0  
**Last Updated**: May 2026
