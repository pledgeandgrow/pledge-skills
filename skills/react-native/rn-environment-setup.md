# Environment Setup & Running on Device

---

## Prerequisites

- JavaScript fundamentals
- React basics (components, props, state, hooks)
- Android/iOS development knowledge helpful but not required

## Environment Setup

### macOS (for iOS + Android)

```bash
brew install node        # Node 22.11.0+
brew install watchman    # File watcher for fast refresh
brew install --cask zulu@17  # JDK 17
# Set JAVA_HOME in ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

### iOS
- Install Xcode + Command Line Tools
- Install CocoaPods: `brew install cocoapods`

### Android
- Install Android Studio + Android SDK
- Configure ANDROID_HOME environment variable

### Create New Project

```bash
npx @react-native-community/cli@latest init MyApp
# or with Expo:
npx create-expo-app MyApp
```

### Running the App

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
```

---

## Running on Device

### Android Devices

1. **Enable USB Debugging:** Settings → Developer options → USB debugging
2. **Plug in via USB**
3. **Run:** `npm run android` (or `yarn android --mode release`)

### Connecting to Development Server

**Method 1: adb reverse (recommended)**

```bash
adb reverse tcp:8081 tcp:8081
```

**Method 2: Connect via Wi-Fi**

1. Open dev menu (shake device or `adb shell input keyevent 82`)
2. Go to Dev Settings → Debug server host & port for device
3. Enter your computer's IP:8081
4. Reload the app

### iOS Devices

1. **Plug in via USB**
2. **Configure code signing:** Open Xcode → select project → Signing & Capabilities → select team
3. **Build and Run:** `npm run ios -- --device` or from Xcode

### Connecting to Development Server (iOS)

- Ensure device and computer on same Wi-Fi network
- Metro bundler should auto-detect the device

### Building for Production

**Android:**
```bash
npx react-native build-android --mode=release
```

**iOS:**
```bash
npm run ios -- --mode Release
# or build archive from Xcode
```

---

## Dev Menu Access

- **iOS Simulator:** Ctrl+Cmd+Z (or Device > Shake)
- **Android Emulator:** Cmd+M (macOS) or Ctrl+M (Windows/Linux)
- **ADB:** `adb shell input keyevent 82`

---

## How to Use These Docs

- Interactive examples available in the docs
- Developer Notes highlight platform-specific considerations
- Code examples use TypeScript by default
- Formatting: `inline code` for props/functions, blocks for examples
