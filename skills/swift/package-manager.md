# Package Manager (SwiftPM)

The Swift Package Manager (SwiftPM) is the official tool for managing Swift packages.

## Creating a package

```bash
# Create a new package
mkdir MyPackage
cd MyPackage
swift package init

# With options
swift package init --type library    # Library package
swift package init --type executable # Executable package
swift package init --type tool       # Command-line tool
```

## Package structure

```
MyPackage/
├── Package.swift          # Package manifest
├── Sources/
│   ├── MyPackage/         # Library target
│   │   └── MyPackage.swift
│   └── MyPackageTool/     # Executable target
│       └── main.swift
├── Tests/
│   └── MyPackageTests/
│       └── MyPackageTests.swift
├── Resources/
│   └── data.json
└── README.md
```

## Package.swift manifest

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "MyPackage",
    platforms: [
        .macOS(.v14),
        .iOS(.v17),
        .tvOS(.v17),
        .watchOS(.v10),
    ],
    products: [
        .library(name: "MyPackage", targets: ["MyPackage"]),
        .executable(name: "mytool", targets: ["MyPackageTool"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.2.0"),
        .package(url: "https://github.com/apple/swift-collections.git", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "MyPackage",
            dependencies: [
                .product(name: "Collections", package: "swift-collections"),
            ],
            resources: [
                .copy("Resources/data.json"),
                .process("Resources/templates"),
            ]
        ),
        .executableTarget(
            name: "MyPackageTool",
            dependencies: [
                "MyPackage",
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
            ]
        ),
        .testTarget(
            name: "MyPackageTests",
            dependencies: ["MyPackage"]
        ),
    ]
)
```

## Dependencies

### Adding dependencies

```swift
dependencies: [
    // Version requirements
    .package(url: "https://github.com/user/repo.git", from: "1.0.0"),    // >= 1.0.0, < 2.0.0
    .package(url: "https://github.com/user/repo.git", "1.0.0"..<"2.0.0"), // Range
    .package(url: "https://github.com/user/repo.git", exact: "1.2.3"),    // Exact version
    .package(url: "https://github.com/user/repo.git", branch: "main"),    // Branch
    .package(url: "https://github.com/user/repo.git", revision: "abc123"), // Specific commit
    .package(path: "../local-package"),                                    // Local path
]
```

### Resolving and updating

```bash
# Resolve dependencies (first time)
swift package resolve

# Update to latest compatible versions
swift package update

# Show dependency tree
swift package show-dependencies

# Show outdated dependencies
swift package show-dependencies --format json
```

## Targets

### Library targets

```swift
.target(
    name: "MyLibrary",
    dependencies: ["OtherTarget"],
    swiftSettings: [
        .define("DEBUG"),
        .enableUpcomingFeature("StrictConcurrency"),
        .swiftLanguageMode(.v6),
    ],
    linkerSettings: [
        .linkedFramework("Foundation"),
    ]
)
```

### Executable targets

```swift
.executableTarget(
    name: "MyCLI",
    dependencies: [
        .product(name: "ArgumentParser", package: "swift-argument-parser"),
    ]
)
```

### Test targets

```swift
.testTarget(
    name: "MyLibraryTests",
    dependencies: ["MyLibrary"],
    resources: [
        .copy("TestData/"),
    ]
)
```

## Resources

```swift
// In target definition
resources: [
    .copy("Resources/data.json"),      // Copy without processing
    .process("Resources/templates/"),  // Process (compress, optimize)
    .copy("Resources/PrivacyInfo.xcprivacy"),
]
```

### Accessing resources in code

```swift
import Foundation

// Bundle.module provides access to package resources
if let url = Bundle.module.url(forResource: "data", withExtension: "json") {
    let data = try Data(contentsOf: url)
}
```

## Plugins (build tools)

```swift
// Package.swift
targets: [
    .plugin(
        name: "MyBuildTool",
        capability: .buildTool()
    ),
    .target(
        name: "MyTarget",
        plugins: ["MyBuildTool"]
    ),
]
```

## Command plugins

```swift
// Plugin that adds swift package commands
targets: [
    .plugin(
        name: "MyCommandPlugin",
        capability: .command(
            intent: .sourceCodeFormatting(),
            permissions: [
                .writeToPackageDirectory(reason: "Format source files"),
            ]
        ),
        dependencies: ["MyBuildTool"]
    ),
]
```

## Common commands

```bash
# Build
swift build                    # Debug
swift build -c release         # Release
swift build --target MyTarget  # Specific target

# Run
swift run                      # Run executable
swift run MyTool arg1 arg2     # With arguments

# Test
swift test                     # Run all tests
swift test --filter MyTests    # Filter tests
swift test --parallel           # Parallel execution
swift test --enable-code-coverage # Coverage

# Edit mode (for development of dependencies)
swift package edit MyDependency
swift package unedit MyDependency

# Generate Xcode project
swift package generate-xcodeproj

# Clean
swift package clean

# Reset (remove all build artifacts)
swift package reset
```

## Binary targets

```swift
targets: [
    .binaryTarget(
        name: "MyBinary",
        path: "MyBinary.xcframework"
    ),
    .binaryTarget(
        name: "RemoteBinary",
        url: "https://example.com/MyBinary.xcframework.zip",
        checksum: "abc123..."
    ),
]
```

## Conditional dependencies

```swift
.target(
    name: "MyTarget",
    dependencies: [
        .target(name: "PlatformSpecific", condition: .when(platforms: [.iOS, .tvOS])),
    ],
    swiftSettings: [
        .define("SUPPORTS_UI", .when(platforms: [.iOS, .tvOS])),
    ]
)
```

## Best practices

1. Use semantic versioning for package releases
2. Pin to major version with `from:` for stability
3. Use local path dependencies for development, switch to URL for release
4. Keep `Package.swift` minimal and well-organized
5. Use `.process()` for resources that can be optimized
6. Use `.copy()` for resources that must be preserved as-is
7. Use `Bundle.module` to access package resources
8. Specify platform requirements explicitly
9. Use plugins for code generation and build tooling
10. Run `swift package update` regularly to stay current
