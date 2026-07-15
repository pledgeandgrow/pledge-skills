# Publishing

---

## Publishing to Google Play Store (Android)

1. **Generate upload key:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Set up Gradle variables** — place keystore in `android/app/`, add to `~/.gradle/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

3. **Add signing config** to `android/app/build.gradle`:
```groovy
signingConfigs {
  release {
    if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
      storeFile file(MYAPP_UPLOAD_STORE_FILE)
      storePassword MYAPP_UPLOAD_STORE_PASSWORD
      keyAlias MYAPP_UPLOAD_KEY_ALIAS
      keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
  }
}
buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

4. **Generate release AAB:**
```bash
npx react-native build-android --mode=release
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Publishing to Apple App Store (iOS)

1. **Configure release scheme** — Xcode → Product → Scheme → Edit Scheme → Run → Build Configuration → Release
2. **Build for release:**
```bash
npm run ios -- --mode="Release"
# or
yarn ios --mode Release
```
3. **Archive** — Xcode → Product → Archive (set device to "Any iOS Device (arm64)")
4. **Distribute** — Click "Distribute App" → App Store Connect → Upload
5. **Submit** — In App Store Connect, fill info, select build, submit for review

**Pro tip:** Skip JS bundling in Debug for faster device builds:
```bash
# In Xcode Build Phase "Bundle React Native code and images"
if [ "${CONFIGURATION}" == "Debug" ]; then export SKIP_BUNDLING=true; fi
```

---

## App Extensions (iOS)

App extensions let you provide custom functionality outside your main app (e.g., Today widgets, Share extensions).

### Memory Considerations

- Extensions load outside regular app sandbox
- Multiple extensions may load simultaneously
- **Strict memory limits** — much lower than the main app
- Today widget: ~48MB limit
- Other extensions: even lower
- **Always test on real device** — Simulator may not enforce memory limits
- Extensions that work in Simulator may fail to load on actual devices
