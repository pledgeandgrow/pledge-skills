# Metro Bundler & Upgrading

---

## Metro Bundler

React Native uses [Metro](https://metrobundler.dev/) to build JavaScript code and assets.

### Configuring Metro

Configuration in `metro.config.js` — can export either:
- **Object** (recommended): merged on top of Metro's internal defaults
- **Function**: called with defaults, returns final config

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

> Always extend `@react-native/metro-config` or `@expo/metro-config` — they contain essential defaults.

### Common Config Options

```js
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: true,
          experimentalImportSupport: false,
        },
      };
    },
  },
  resolver: {
    assetExts: ['png', 'jpg', 'gif'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx'],
  },
  server: {
    port: 8081,
  },
};
```

### Metro Features

- **Fast Refresh:** Hot-reloads components on save without losing state
- **Tree shaking:** Removes dead code in production builds
- **Code splitting:** Inline requires for lazy loading
- **Asset bundling:** Images, fonts, and other assets

---

## Upgrading React Native

### Expo Projects

```bash
npx expo install --fix
```

### React Native Projects (Upgrade Helper)

1. Go to [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
2. Select from/to versions
3. **Upgrade dependencies:**

```bash
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

4. **Upgrade project files:** Manually apply diffs from Upgrade Helper for non-`package.json` files (iOS/Android native files, configs)
5. Rebuild: `npm run ios` / `npm run android`

### Troubleshooting Upgrades

- Run `npx react-native clean` to clear caches
- iOS: `cd ios && pod install`
- Android: `cd android && ./gradlew clean`
- Metro cache: `npm start -- --reset-cache`
