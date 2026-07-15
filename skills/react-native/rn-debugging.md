# Debugging

---

## Dev Menu

- **iOS Simulator:** Ctrl+Cmd+Z (or Device > Shake)
- **Android Emulator:** Cmd+M (macOS), Ctrl+M (Windows/Linux)
- **ADB:** `adb shell input keyevent 82`

## React Native DevTools

Built-in debugger (similar to browser devtools):
- Select "Open DevTools" in Dev Menu, or press `j` from CLI
- Panels: Console, React Components Inspector, React Profiler
- Welcome panel on first launch

## LogBox

In-app tool displaying warnings/errors:
- Fatal errors: full-screen error with stack trace
- Console errors and warnings: displayed as toasts/log entries

## Performance Monitor

Toggle "Show Perf Monitor" in Dev Menu to see:
- **JS frame rate** (JavaScript thread)
- **UI frame rate** (main thread)

Target: 60 FPS (16.67ms per frame budget).
