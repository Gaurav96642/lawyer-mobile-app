
# Mobile App Setup with Capacitor

This guide will help you set up and build the LawyersAnywhere mobile app using Capacitor for both iOS and Android.

## Prerequisites

- Node.js and npm installed
- For iOS: macOS with Xcode installed (version 12+)
- For Android: Android Studio installed with SDK tools

## Initial Setup

After cloning the repo, install dependencies:

```bash
npm install
```

## Building the Mobile App

You can use the provided build script to compile the web app and sync it with Capacitor:

```bash
node capacitor-build.js
```

Or manually:

```bash
# Build the web app
npm run build

# Sync with Capacitor
npx cap sync
```

## Platform-Specific Setup

### iOS

1. Open the iOS project in Xcode:
```bash
npx cap open ios
```

2. Configure your app signing in Xcode:
   - Select the project root in the Project Navigator
   - In the "Signing & Capabilities" tab, select your team and adjust bundle identifier if needed

3. Build and run on a device or simulator:
```bash
npx cap run ios
```

### Android

1. Open the Android project in Android Studio:
```bash
npx cap open android
```

2. Configure your app settings in Android Studio:
   - Update the application ID in `build.gradle` if needed
   - Configure signing for release builds

3. Build and run on a device or emulator:
```bash
npx cap run android
```

## Native Capabilities

This app has the following native capabilities:

- Push notifications (requires server-side setup)
- Splash screen
- Safe area handling for notched devices

## Push Notification Setup

### iOS

1. Create an Apple Developer account and register your app
2. Create an APNs key or certificate
3. Configure your backend to send notifications through APNs

### Android

1. Create a Firebase project for your app
2. Add the `google-services.json` file to the Android project
3. Configure your backend to send notifications through FCM

## Building for Production

### Android

1. Generate a signed APK/AAB in Android Studio:
   - Build > Generate Signed Bundle/APK
   - Follow the wizard to create or select your keystore

2. Alternatively, use the CLI:
```bash
cd android
./gradlew bundleRelease
```

### iOS

1. Archive your app in Xcode:
   - Product > Archive
   - Follow the distribution workflow

## Continuous Integration/Deployment

Consider setting up CI/CD with:
- Fastlane for iOS and Android
- GitHub Actions for automated builds
- App Center for distribution to testers

## Troubleshooting

If you encounter any issues:

1. Make sure Capacitor is properly synced:
```bash
npx cap sync
```

2. For iOS-specific issues, try:
```bash
npx cap update ios
```

3. For Android-specific issues, try:
```bash
npx cap update android
```
