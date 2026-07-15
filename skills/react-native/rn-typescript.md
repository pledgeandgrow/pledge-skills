# TypeScript in React Native

---

## Getting Started

New projects use TypeScript by default. Babel transforms TS during bundling; `tsc` is for type-checking only.

## Adding to Existing Project

```bash
npm install -D typescript @react-native/typescript-config @types/jest @types/react @types/react-test-renderer
```

```json
// tsconfig.json
{ "extends": "@react-native/typescript-config" }
```

Rename `.js` files to `.tsx`. Keep `index.js` as JS entrypoint. Run `npx tsc` to type-check.

## JavaScript Instead of TypeScript

Use `.jsx` extension for plain JS files — not type-checked. JS and TS modules can import each other.

## TypeScript + React Native Example

```tsx
import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

function Hello({name, baseEnthusiasmLevel = 0}: Props) {
  const [enthusiasmLevel, setEnthusiasmLevel] = useState(baseEnthusiasmLevel);

  const getExclamationMarks = (numChars: number) =>
    numChars > 0 ? Array(numChars + 1).join('!') : '';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello {name} {getExclamationMarks(enthusiasmLevel)}
      </Text>
      <Button
        title="Increase"
        onPress={() => setEnthusiasmLevel(enthusiasmLevel + 1)}
        color="blue"
      />
    </View>
  );
}
```

---

## Custom Path Aliases

### 1. Configure tsconfig.json

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"],
      "tests": ["tests/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

### 2. Install babel-plugin-module-resolver

```bash
npm install --save-dev babel-plugin-module-resolver
```

### 3. Configure babel.config.js

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
        }
      }
    ]
  ]
};
```

---

## Strict TypeScript API (Opt In)

Preview of the future stable JavaScript API for React Native. Opt in via `tsconfig.json`:

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "customConditions": ["react-native-strict-api"]
  }
}
```

### Breaking Changes

**Removal of `*Static` types:** Use the non-Static alias instead.

```tsx
// Before
import {Linking, LinkingStatic} from 'react-native';
function foo(linking: LinkingStatic) {}

// After
import {Linking} from 'react-native';
function foo(linking: Linking) {}
```

Affected: `AlertStatic`, `ActionSheetIOSStatic`, `ToastAndroidStatic`, `InteractionManagerStatic`, `UIManagerStatic`, `PlatformStatic`, `SectionListStatic`, `PixelRatioStatic`, `AppStateStatic`, `AccessibilityInfoStatic`, `BackHandlerStatic`, `DevMenuStatic`, `ClipboardStatic`, `PermissionsAndroidStatic`, `ShareStatic`, `DevSettingsStatic`, `I18nManagerStatic`, `EasingStatic`, `PanResponderStatic`, `NativeModulesStatic`, `LogBoxStatic`, `SettingsStatic`, `VibrationStatic`, etc.

**Core components now function components:**
View, Image, TextInput, Modal, Text, TouchableWithoutFeedback, Switch, ActivityIndicator, Button, SafeAreaView — use `React.ComponentRef<typeof View>` for refs:

```tsx
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

**Other changes:**
- `Animated` types are now non-generic with generic `interpolate` method
- `Animated.LegacyRef` removed
- Optional props typed as `type | undefined`
- Deprecated types and leftover component props removed (e.g., `lineBreakMode` on Text, `scrollWithoutAnimationTo` on ScrollView)
