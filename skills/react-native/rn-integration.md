# Integration with Existing Apps

React Native can be added to existing native Android/iOS apps.

---

## Key Concepts

- React Native code lives in a subdirectory of the native project
- NPM dependencies managed separately
- Native code registers a React Native root view

## Android Integration

1. Set up directory structure (e.g., `rn/` inside Android project)
2. Install NPM dependencies in `rn/`
3. Configure `settings.gradle` and `app/build.gradle` to include React Native
4. Add `ReactNativeHost` in Application class
5. Create `index.js` and `App.tsx` entry points

## iOS Integration

1. Install CocoaPods dependencies
2. Configure Podfile to include React Native pods
3. Run `pod install`
4. Add React Native view controller in Swift/Objective-C

## Passing Initial Props

```tsx
// App.tsx
import {Text} from 'react-native';

export default function App({initialProps}: {initialProps?: {name?: string}}) {
  return <Text>Hello {initialProps?.name}</Text>;
}
```

Pass `initialProperties` from native code when creating the React Native root view.
