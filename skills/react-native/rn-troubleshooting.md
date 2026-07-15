# Troubleshooting

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 8081 already in use | Kill process: `lsof -i :8081` then `kill -9 <PID>` |
| NPM locking error | Delete `node_modules` and `package-lock.json`, run `npm install` |
| Missing React libraries | Run `npm install` in project root |
| `spawnSync ./gradlew EACCES` | Run `chmod +x android/gradlew` |
| Android ENOSPC error | Increase file watcher limit: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf` |
| Shell command unresponsive | Increase Java heap size in `android/gradle.properties` |

### Port Already in Use (8081)

```bash
# Find process on port 8081
sudo lsof -i :8081          # macOS/Linux
# Windows: use Resource Monitor

# Kill the process
kill -9 <PID>

# Or use a different port
npm start -- --port=8088
```

### NPM Locking Error (EACCES)

```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### Missing Libraries for React (iOS Manual Setup)

Ensure all relevant dependencies are linked in Xcode → Linked Frameworks and Binaries. If using CocoaPods:

```ruby
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText', 'RCTImage', 'RCTNetwork', 'RCTWebSocket',
]
```

Then `pod install` and use the `.xcworkspace` file.

### ShellCommandUnresponsiveException (Android)

```bash
adb kill-server
adb start-server
```

### ENOSPC Error (Linux)

File watcher limit reached. Increase it:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### spawnSync EACCES (Gradle)

Make gradlew executable:

```bash
chmod +x android/gradlew
```

---

## React Native Upgrade

Use the [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to see changes between versions.

### Troubleshooting Upgrades

- Run `npx react-native clean` to clear caches
- iOS: `cd ios && pod install`
- Android: `cd android && ./gradlew clean`
- Metro cache: `npm start -- --reset-cache`
