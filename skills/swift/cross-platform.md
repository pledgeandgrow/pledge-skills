# Cross-Platform Development

Swift on Linux, Windows, Android, WebAssembly, and embedded platforms.

## Static Linux SDK

The Static Linux SDK lets you build Swift applications with static linking, producing self-contained binaries.

### Static vs dynamic linking

| Aspect | Static | Dynamic |
|--------|--------|---------|
| Binary size | Larger (includes all libs) | Smaller (shared libs) |
| Deployment | Self-contained | Requires runtime libs |
| Start-up | Faster | Slightly slower |
| Updates | Requires rebuild | Update shared lib |
| Memory | Higher (no sharing) | Lower (shared libs) |

### Installing the SDK

```bash
# Install the static Linux SDK
swift sdk install \
    https://download.swift.org/swift-6.0-static-linux-repo/swift-6.0-RELEASE-static-sdk/swift-6.0-RELEASE-static-sdk-linux.tar.gz

# Verify installation
swift sdk list
```

### Building with the static SDK

```bash
# Build a statically linked program
swift build --swift-sdk x86_64-swift-linux-musl -c release

# Cross-compile from macOS to Linux
swift build --swift-sdk x86_64-swift-linux-musl -c release

# For ARM64 Linux
swift build --swift-sdk aarch64-swift-linux-musl -c release
```

### Package dependencies

```swift
// Package.swift — specify platform-specific dependencies
targets: [
    .target(
        name: "MyApp",
        dependencies: [
            .target(name: "LinuxOnly", condition: .when(platforms: [.linux])),
        ]
    ),
    .target(name: "LinuxOnly", dependencies: [])
]
```

## Swift SDK for Android

### Getting started

```bash
# Install the Swift SDK for Android
swift sdk install \
    https://download.swift.org/swift-6.0-android-repo/swift-6.0-RELEASE-android-sdk.tar.gz

# Verify
swift sdk list
```

### Building for Android

```bash
# Build for Android (arm64)
swift build --swift-sdk aarch64-swift-android -c release

# Build for Android (x86_64)
swift build --swift-sdk x86_64-swift-android -c release
```

### Hello World on Android

```swift
// Sources/HelloAndroid/main.swift
import Foundation

print("Hello from Swift on Android!")

// Android-specific APIs via JNI
// Use Swift/Java interop for Android framework access
```

### Android project integration

1. Build Swift code as a shared library
2. Package into Android APK
3. Call from Kotlin/Java via JNI

```bash
# Build as shared library
swiftc -emit-library -target aarch64-swift-android \
    -sdk $ANDROID_NDK/toolchains/llvm/prebuilt/darwin-x86_64/sysroot \
    Sources/HelloAndroid/main.swift -o libhello.so
```

## Swift SDKs for WebAssembly

### Installation

```bash
# Install WebAssembly SDK
swift sdk install \
    https://download.swift.org/swift-6.0-wasm-repo/swift-6.0-RELEASE-wasm-sdk.tar.gz
```

### Building and running

```bash
# Build for WebAssembly
swift build --swift-sdk wasm32-unknown-none-wasm -c release

# Run with a Wasm runtime (e.g., wasmtime)
wasmtime .build/wasm32-unknown-none-wasm/release/MyApp.wasm

# Or in a browser using wasm-interp or a JS wrapper
```

### Embedded Swift support

WebAssembly supports Embedded Swift — a subset of Swift for constrained environments:

```swift
// Embedded Swift: no Foundation, no dynamic allocation
// Works on bare-metal and WebAssembly

@_cdecl("main")
func main() -> Int32 {
    // Minimal Swift code
    return 0
}
```

### Editor configuration

#### Visual Studio Code

```json
// .vscode/settings.json
{
    "swift.swiftSDK": "wasm32-unknown-none-wasm",
    "swift.buildPath": ".build/wasm32-unknown-none-wasm"
}
```

## Swift on Windows

### Installation

```powershell
# Install via winget
winget install Swift.Toolchain

# Or download from swift.org
# Requires Visual Studio C++ build tools
```

### Building on Windows

```powershell
# Build package
swift build -c release

# Run
swift run

# Test
swift test
```

### Windows-specific considerations

```swift
#if os(Windows)
import WinSDK
// Use Windows APIs
#endif

// Platform-conditional code
func getTempDir() -> String {
    #if os(Linux) || os(Android)
    return "/tmp"
    #elseif os(Windows)
    return NSTemporaryDirectory()
    #elseif os(macOS) || os(iOS)
    return NSTemporaryDirectory()
    #endif
}
```

## Platform conditional compilation

```swift
// OS checks
#if os(macOS)
    // macOS only
#endif
#if os(Linux)
    // Linux only
#endif
#if os(Windows)
    // Windows only
#endif
#if os(iOS)
    // iOS only
#endif
#if os(Android)
    // Android only
#endif
#if os(WASI)
    // WebAssembly only
#endif

// Architecture checks
#if arch(x86_64)
    // x86_64
#endif
#if arch(arm64)
    // ARM64
#endif
#if arch(wasm32)
    // WebAssembly 32-bit
#endif

// Combined
#if os(macOS) && arch(arm64)
    // Apple Silicon
#endif

// Swift version
#if swift(>=6.0)
    // Swift 6+
#endif

// Compiler
#if compiler(>=6.0)
    // Swift 6 compiler
#endif

// Can import
#if canImport(Foundation)
    import Foundation
#endif
#if canImport(UIKit)
    import UIKit
#endif
#if canImport(WinSDK)
    import WinSDK
#endif
```

## Embedded Swift

Embedded Swift is a subset of Swift for resource-constrained environments (microcontrollers, bare-metal).

### Features

- No runtime dependencies (no Foundation, no Swift runtime)
- No dynamic allocation (no classes, no closures with captures)
- No reflection
- Works with C interop
- Supports structs, enums, generics, protocols

```swift
// Embedded Swift example for a microcontroller
@_cdecl("main")
func main() -> Int32 {
    var led = false
    while true {
        led.toggle()
        delay(500)  // C function
    }
    return 0
}

struct Sensor {
    let pin: Int32

    func read() -> Int32 {
        return analogRead(pin)  // C function
    }
}
```

## Best practices

1. Use `#if os()` for platform-specific code — keep it isolated
2. Use `#if canImport()` for optional framework dependencies
3. Use the static Linux SDK for self-contained Linux binaries
4. Use Swift SDKs for cross-compilation to Android and WebAssembly
5. Test on all target platforms in CI
6. Use platform-conditional dependencies in `Package.swift`
7. Avoid hardcoding paths — use `FileManager` and `Bundle`
8. Use Embedded Swift for microcontrollers and bare-metal targets
9. Keep platform-specific code in separate files or targets
10. Document platform requirements clearly
