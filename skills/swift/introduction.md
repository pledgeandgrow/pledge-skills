# Introduction to Swift

Swift is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns.

## About Swift

Swift is:
- **Safe**: Designed to be safer than C-based languages, eliminating entire classes of unsafe code
- **Fast**: Performance comparable to C and C++
- **Expressive**: Clean syntax with modern language features

## Features

- Inferred types (type inference) for cleaner, less error-prone code
- Modules eliminate headers and provide namespaces
- Automatic memory management (ARC — Automatic Reference Counting)
- No semi-colons required
- Named parameters (from Objective-C) in clean syntax
- Closures unified with function pointers
- Tuples and multiple return values
- Generics
- Fast and concise iteration over ranges or collections
- Structs that support methods, extensions, and protocols
- Functional programming patterns (map, filter, reduce)
- Powerful error handling built-in
- Advanced control flow with `do`, `guard`, `defer`, and `repeat` keywords

## Safety

Swift was designed from the outset to be safer than C-based languages:

- **Variables are always initialized before use**
- **Arrays and integers are checked for overflow**
- **Memory is managed automatically** (ARC)
- **Objects can never be `nil` by default** — trying to make or use a `nil` object is a compile-time error
- **Optionals** (`?`) for nil-safe handling — Swift forces you to safely deal with nil

```swift
var variable = "mutable"
let constant = "immutable"

// Optionals — must be handled safely
var optionalName: String? = "Alice"
if let name = optionalName {
    print("Hello, \(name)")
}
```

## Platform Support

### Apple Platforms
- macOS, iOS, iPadOS, tvOS, watchOS, visionOS
- Full integration with Xcode, SwiftUI, UIKit, AppKit

### Linux
- Official toolchains for Ubuntu, CentOS, Amazon Linux, RHEL, Fedora
- Static Linux SDK for deployment without runtime dependencies

### Windows
- Official toolchain with full support
- Visual Studio integration

### New Platforms
- Android (via Swift SDK)
- WebAssembly (via Swift SDKs)
- Embedded Swift (microcontrollers)

## Installation

### macOS
```bash
# Install via Xcode (App Store) or swift.org toolchain
# Install Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
# Download from swift.org or use swiftly
curl -O https://download.swift.org/swift-6.0-release/ubuntu2204/swift-6.0-RELEASE/swift-6.0-RELEASE-ubuntu22.04.tar.gz
tar xzf swift-6.0-RELEASE-ubuntu22.04.tar.gz
export PATH=$PATH:/path/to/swift/usr/bin

# Or use swiftly (toolchain manager)
curl -O https://download.swift.org/swiftly/linux/swiftly-x86_64.tar.gz
tar xzf swiftly-x86_64.tar.gz
./swiftly init
```

### Windows
```bash
# Download from swift.org or use winget
winget install Swift.Toolchain
```

### Verify installation
```bash
swift --version
swift repl  # Start REPL
```

## Swift Versions

| Version | Release | Key Features |
|---------|---------|-------------|
| Swift 5.9 | 2023 | Macros, C++ interop, `if`/`switch` as expressions |
| Swift 5.10 | 2024 | Improved concurrency, language mode |
| Swift 6.0 | 2024 | Data-race safety by default, `noncopyable` types |

## Hello World

```swift
// hello.swift
print("Hello, World!")

// Run: swift hello.swift
// Or compile: swiftc hello.swift -o hello && ./hello
```

## Official Documentation

- [swift.org/documentation](https://www.swift.org/documentation/) — Documentation hub
- [docs.swift.org](https://docs.swift.org/) — The Swift Programming Language (TSPL)
- [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Swift Standard Library](https://www.swift.org/documentation/standard-library/)
- [Swift Core Libraries](https://www.swift.org/documentation/core-libraries/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift on Server](https://www.swift.org/documentation/server/)
- [C++ Interop](https://www.swift.org/documentation/cxx-interop/)
