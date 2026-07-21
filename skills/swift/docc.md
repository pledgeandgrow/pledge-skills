# DocC Documentation

Swift DocC — Apple's documentation authoring and publishing tool for Swift.

## Overview

DocC is a documentation compiler that lets you write rich documentation for Swift packages and frameworks. It supports:
- API reference documentation from source code comments
- Tutorial-style articles with step-by-step instructions
- Rich Markdown with images, code samples, and interactive elements
- Web-based documentation site generation

## Writing documentation comments

### Symbol documentation

```swift
/// A type that represents a temperature value.
///
/// Use `Temperature` to work with temperature values in different
/// scales (Celsius, Fahrenheit, Kelvin).
///
/// ```swift
/// let temp = Temperature(celsius: 25)
/// print(temp.fahrenheit) // 77.0
/// ```
public struct Temperature: Sendable {
    /// The temperature in degrees Celsius.
    public let celsius: Double

    /// Creates a new temperature from a Celsius value.
    /// - Parameter celsius: The temperature in degrees Celsius.
    public init(celsius: Double) {
        self.celsius = celsius
    }

    /// The temperature in degrees Fahrenheit.
    public var fahrenheit: Double {
        celsius * 9 / 5 + 32
    }

    /// The temperature in Kelvin.
    public var kelvin: Double {
        celsius + 273.15
    }

    /// Returns a new temperature by adding two temperatures.
    /// - Parameters:
    ///   - lhs: The first temperature.
    ///   - rhs: The second temperature.
    /// - Returns: The sum of the two temperatures.
    public static func + (lhs: Temperature, rhs: Temperature) -> Temperature {
        Temperature(celsius: lhs.celsius + rhs.celsius)
    }
}
```

### Documentation directives

```swift
/// A collection of weather data.
///
/// Use this type to collect and analyze weather readings.
///
/// - Note: This type is thread-safe.
///
/// - Warning: Do not use for real-time safety-critical applications.
///
/// - Important: Always call ``finish()`` when done.
///
/// - Tip: Use ``WeatherStation/subscribe(to:)`` for live updates.
///
/// - Experiment: Try combining multiple stations for better accuracy.
public struct WeatherData { /* ... */ }
```

### Linking to symbols

```swift
/// Processes a ``Temperature`` reading.
///
/// Use this method with ``Temperature/fahrenheit`` to get
/// the value in Fahrenheit. See also ``convert(to:)``.
///
/// - Parameter temperature: The ``Temperature`` to process.
/// - Returns: The processed value.
func process(_ temperature: Temperature) -> Double { /* ... */ }
```

## Articles

Create standalone articles in a `Articles/` or `Documentation/` directory:

```markdown
# Getting Started with MyLibrary

## Overview

MyLibrary provides tools for weather analysis.

## Import the library

```swift
import MyLibrary
```

## Create a temperature

```swift
let temp = Temperature(celsius: 25)
print(temp.fahrenheit)
```
```

## Tutorials

Create interactive tutorials with `Tutorial` files:

```swift
// Tutorials/MyTutorial.tutorial
@Tutorial(time: 20 minutes, projectFiles: "MyProject.zip") {
    @Intro(title: "Getting Started") {
        This tutorial teaches you how to use MyLibrary.
    }

    @Section(title: "Creating a Temperature") {
        @Steps {
            @Step("Import the library") {
                ```swift
                import MyLibrary
                ```
            }
            @Step("Create a temperature value") {
                ```swift
                let temp = Temperature(celsius: 25)
                ```
            }
        }
    }
}
```

## Documentation extensions

Extend documentation for types you don't own:

```swift
// Extensions/String.md
# ``String``

## Overview

Extensions to String for working with temperature data.

## Topics

### Temperature formatting

- ``formatTemperature(_:)``
```

## Topics groups

Organize documentation into groups:

```swift
/// # Topics
///
/// ## Creating a Temperature
/// - ``init(celsius:)``
/// - ``init(fahrenheit:)``
/// - ``init(kelvin:)``
///
/// ## Converting
/// - ``fahrenheit``
/// - ``kelvin``
/// - ``celsius``
///
/// ## Comparing
/// - ``<(_:_:)``
/// - ``==(_:_:)``
```

## Building documentation

### Command line

```bash
# Build documentation for a package
swift package generate-documentation

# Output to specific directory
swift package generate-documentation --output-path ./docs

# Preview documentation
swift package preview-documentation
```

### Xcode

1. Product → Build Documentation (⌃⌘D)
2. Documentation browser opens in Xcode

### Hosting documentation

```bash
# Generate static site
swift package generate-documentation --output-path ./docs \
    --hosting-base-path MyPackage

# Deploy to GitHub Pages
# Copy contents of ./docs to gh-pages branch
```

## DocC catalog structure

```
Sources/
└── MyPackage/
    ├── MyPackage.swift
    └── Documentation.docc/
        ├── MyPackage.md          # Package overview
        ├── Temperature.md        # Extension for Temperature
        ├── Articles/
        │   ├── GettingStarted.md
        │   └── AdvancedUsage.md
        ├── Tutorials/
        │   └── MyTutorial.tutorial
        ├── Resources/
        │   ├── diagram.png
        │   └── video.mov
        └── Tutorial\ Resources/
            └── MyProject.zip
```

## Supported Markdown features

- Standard Markdown (headings, lists, links, emphasis)
- Code blocks with syntax highlighting
- Images and videos
- Tables
- Block quotes
- Symbol links: ``SymbolName``
- Cross-references: ``ModuleName/SymbolName``
- Directive blocks: `@Note`, `@Warning`, `@Tip`, `@Important`

## Best practices

1. Write documentation comments for every public API
2. Start with a summary — one sentence describing the entity
3. Include code examples in documentation
4. Use `Topics` groups to organize related symbols
5. Link to related symbols using ``SymbolName`` syntax
6. Use `@Note`, `@Warning`, `@Tip` for callout information
7. Write tutorials for onboarding new users
8. Keep documentation up to date with code changes
9. Use DocC extensions to document types from other modules
10. Generate and host documentation as part of CI/CD
