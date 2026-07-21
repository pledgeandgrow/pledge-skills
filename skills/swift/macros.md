# Macros

Macros in Swift 5.9+ — compile-time code generation for reducing boilerplate.

## Overview

Macros generate code at compile time, letting you automate repetitive patterns and reduce boilerplate. Unlike functions (called at runtime), macros expand during compilation, producing new Swift code that's added to your project.

### How macros work

1. **Compile-time expansion**: The compiler calls the macro implementation to generate code
2. **Type checking before and after**: The compiler type-checks both the macro call and the expanded code
3. **External tools**: Macro implementations are separate programs (compiler plugins) that run during compilation

### Macros vs functions

| Aspect | Macros | Functions |
|-------|--------|-----------|
| When | Compile time | Runtime |
| Input | Source code AST | Values |
| Output | New Swift code | Return value |
| Overhead | Zero runtime cost | Function call overhead |
| Visibility | Can access type info | Only parameter values |

## Freestanding macros

Freestanding macros appear at the call site, prefixed with `#`.

### `#function`

```swift
func logMessage(_ message: String) {
    print("\(#function): \(message)")
}

logMessage("Hello")  // Prints "logMessage(_:): Hello"
```

### `#file`, `#line`, `#column`

```swift
func debugInfo() {
    print("\(#file):\(#line):\(#column)")
}
```

### `#filePath` vs `#file`

```swift
// #filePath — full path (default in older Swift)
// #file — file name only (preferred for privacy)
print(#file)       // "MyFile.swift"
print(#filePath)   // "/Users/me/projects/MyFile.swift"
```

### Custom freestanding macros

```swift
// Using a freestanding macro (from SwiftSyntax/MacroExamples)
let result = #stringify(x + y)
// Expands to: (x + y, "x + y") — returns value and its string representation

// Common built-in freestanding macros
#sourceLocation()  // Current source location
#externalMacro(module: "MyMacros", type: "MyMacro")  // Reference external macro
```

### `#expect` and `#require` (Swift Testing)

```swift
import Testing

@Test func testAddition() {
    #expect(1 + 1 == 2)
    #require(someOptional != nil)
}
```

## Attached macros

Attached macros modify the declaration they're attached to, prefixed with `@`.

### `@Observable` (Observation framework)

```swift
import Observation

@Observable
class ViewModel {
    var name: String = ""
    var age: Int = 0
    var isLoading: Bool = false
}

// The macro generates:
// - Registration of properties for observation
// - Storage backing
// - Change tracking
// You just write plain properties — the macro does the rest
```

### `@Model` (SwiftData)

```swift
import SwiftData

@Model
class Task {
    var title: String
    var isCompleted: Bool
    var createdAt: Date

    init(title: String) {
        self.title = title
        self.isCompleted = false
        self.createdAt = Date()
    }
}

// The macro generates:
// - Persistent model schema
// - Property persistence
// - Relationship management
```

### `@MemberwiseInit`

```swift
@MemberwiseInit
struct Point {
    var x: Double
    var y: Double
    var label: String = "origin"
}

// The macro generates a memberwise initializer:
// init(x: Double, y: Double, label: String = "origin")
```

### `@DictionaryStorage`

```swift
@DictionaryStorage
struct Settings {
    var theme: String = "light"
    var fontSize: Int = 14
    var notifications: Bool = true
}

// The macro generates storage backed by a dictionary
// Useful for dynamic property storage
```

## Writing custom macros

### Macro declaration

A macro has two parts:
1. **Macro declaration** — the interface (in a library)
2. **Macro implementation** — the code generation logic (in a compiler plugin)

### Declaring a macro

```swift
// Macro declaration (public API)
public macro stringify<T>(_ value: T) -> (T, String)
```

### Implementing a macro

Macro implementations use the SwiftSyntax library to manipulate the AST:

```swift
// Macro implementation (in a compiler plugin)
import SwiftSyntax
import SwiftSyntaxMacros

public struct StringifyMacro: ExpressionMacro {
    public static func expansion(
        of node: some FreestandingMacroExpansionSyntax,
        in context: some MacroExpansionContext
    ) -> ExprSyntax {
        guard let argument = node.argumentList.first?.expression else {
            throw MacroError.syntax
        }
        return "(\(argument), \(literal: argument.description))"
    }
}
```

### Freestanding macro implementation

```swift
import SwiftSyntax
import SwiftSyntaxMacros

public struct MyMacro: DeclarationMacro {
    public static func expansion(
        of node: some FreestandingMacroExpansionSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // Generate declarations
        return ["var generatedValue = 42"]
    }
}
```

### Attached macro implementation

```swift
import SwiftSyntax
import SwiftSyntaxMacros

public struct MemberwiseInitMacro: MemberMacro {
    public static func expansion(
        of node: AttributeSyntax,
        providingMembersOf declaration: some DeclGroupSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // Generate an initializer from stored properties
        // ...
        return [initSyntax]
    }
}
```

### Macro types

| Protocol | Description |
|----------|-------------|
| `ExpressionMacro` | Freestanding, returns an expression |
| `DeclarationMacro` | Freestanding, returns declarations |
| `AccessorMacro` | Attached, adds accessors to properties |
| `MemberAttributeMacro` | Attached, adds attributes to members |
| `MemberMacro` | Attached, adds new members to a type |
| `PeerMacro` | Attached, creates peer declarations |
| `CodeItemMacro` | Freestanding, generates code items |

### Macro plugin target

```swift
// Package.swift
.target(
    name: "MyMacroMacros",
    dependencies: [
        .product(name: "SwiftSyntax", package: "swift-syntax"),
        .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
        .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
    ]
),

// Macro library target
.target(
    name: "MyMacros",
    dependencies: [
        "MyMacroMacros",
        .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
    ],
    swiftSettings: [
        .enableUpcomingFeature("BareSlashRegexLiterals"),
    ]
),

// Macro plugin registration
.executableTarget(
    name: "MyMacroMacros",
    dependencies: [
        .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
    ]
)
```

### Registering macros in a plugin

```swift
// In the macro implementation target
import SwiftCompilerPlugin

@main
struct MyMacroPlugin: CompilerPlugin {
    let providingMacros: [Macro.Type] = [
        StringifyMacro.self,
        MemberwiseInitMacro.self,
    ]
}
```

### Exporting macros

```swift
// In the macro library target
@freestanding(expression)
public macro stringify<T>(_ value: T) -> (T, String) =
    #externalMacro(module: "MyMacroMacros", type: "StringifyMacro")

@attached(member, names: named(init))
public macro MemberwiseInit() =
    #externalMacro(module: "MyMacroMacros", type: "MemberwiseInitMacro")
```

## Using macros in a project

### Package.swift setup

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "MyApp",
    dependencies: [
        .package(url: "https://github.com/swiftlang/swift-syntax.git", from: "600.0.0"),
    ],
    targets: [
        // Macro implementations (compiler plugin)
        .executableTarget(
            name: "MyMacrosImpl",
            dependencies: [
                .product(name: "SwiftSyntax", package: "swift-syntax"),
                .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
                .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
            ]
        ),
        // Macro declarations (public API)
        .target(
            name: "MyMacros",
            dependencies: [
                "MyMacrosImpl",
                .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
            ]
        ),
        // Consumer
        .target(
            name: "MyApp",
            dependencies: ["MyMacros"]
        ),
    ]
)
```

## Debugging macros

### Viewing macro expansions

```bash
# Expand macros and print the result
swift build -Xfrontend -dump-macro-expansions

# In Xcode:
# Product > Perform Action > Expand Macros
```

### Common issues

1. **Macro not found**: Ensure the macro module is imported
2. **Plugin not running**: Check that the plugin target is an executable
3. **Type errors in expansion**: The expanded code must type-check
4. **Circular dependencies**: Macro implementation can't depend on consumer

## Built-in macros in Swift

| Macro | Type | Description |
|-------|------|-------------|
| `#function` | Freestanding | Current function name |
| `#file` | Freestanding | Source file name |
| `#filePath` | Freestanding | Full source file path |
| `#line` | Freestanding | Line number |
| `#column` | Freestanding | Column number |
| `#sourceLocation` | Freestanding | Full source location |
| `#externalMacro` | Freestanding | Reference external macro impl |
| `#expect` | Freestanding | Swift Testing assertion |
| `#require` | Freestanding | Swift Testing requirement |
| `@Observable` | Attached | Observation framework |
| `@Model` | Attached | SwiftData model |
| `@Test` | Attached | Swift Testing test case |
| `@Suite` | Attached | Swift Testing test suite |

## Best practices

1. Use macros to eliminate boilerplate, not to add magic
2. Keep macro-generated code simple and readable when expanded
3. Document what a macro generates — users need to understand the output
4. Test macro expansion with `-dump-macro-expansions`
5. Use `@Observable` instead of `ObservableObject` + `@Published` (macOS 14+)
6. Use `@Model` for SwiftData persistence
7. Prefer built-in macros over custom ones when possible
8. Ensure macro implementations handle edge cases (optional properties, access control)
9. Macro implementation targets must be executable (compiler plugins)
10. Use `#externalMacro` to connect declarations to implementations
