# What's New in Kotlin 2.4.0

**Docs:** https://kotlinlang.org/docs/whatsnew24.html

## Language Features

### Stable Features

Several previously experimental features are now stable in Kotlin 2.4.0:

- **Collection literals** — `[1, 2, 3]` syntax for lists
- **Explicit context arguments** for context parameters
- **Improved compile-time constants**
- **Improved unused result checks** for higher-order functions

### Collection Literals

```kotlin
// List literal
val list = [1, 2, 3]  // List<Int>

// Can be used in annotations
@Example([1, 2, 3])
```

### No More Deprecation Warnings on Last Import Segments

```kotlin
// Previously warned about unused last segment
import kotlin.collections.listOf  // no warning for 'listOf'
```

### Context Parameters

```kotlin
// Explicit context arguments
context(logger: Logger)
fun process(data: String) {
    logger.info("Processing: $data")
}

// Usage
with(myLogger) {
    process("input")
}
```

### @IntroducedAt Annotation

```kotlin
// Generate version-based overloads for optional parameters
// Helps maintain binary compatibility across versions
@IntroducedAt(version = "2.4")
fun configure(option: String = "default") { /* ... */ }
```

## Standard Library

### Stable UUID API

```kotlin
import kotlin.uuid.Uuid

// Create UUID
val id = Uuid.random()
val namedUuid = Uuid("550e8400-e29b-41d4-a716-446655440000")

// Properties
id.toString()  // "550e8400-e29b-41d4-a716-446655440000"
```

### Sorted Order Checking

```kotlin
// New API for checking sorted order
val list = listOf(1, 2, 3, 4, 5)
list.isSorted()  // true
list.isSortedDescending()  // false
```

### Unsigned Integer to BigInteger

```kotlin
// JVM: Convert unsigned integers to BigInteger
val uInt = 100u
val bigInt = uInt.toBigInteger()
```

### Map Fallback Functions

```kotlin
// Distinguish null values from missing keys
val map: Map<String, String?> = mapOf("a" to null, "b" to "value")

// getOrNull — distinguishes missing key from null value (Kotlin 2.4.0+)
map.getOrNull("a")  // null (key exists, value is null)
map.getOrNull("c")  // null (key missing)
// Use getValue() to throw on missing, or getOrDefault() for fallback
```

## Kotlin/JVM

### Java 26 Support

```kotlin
// Compile to Java 26 target
kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_26)
    }
}
```

### Annotations in Metadata

Annotations in metadata are now enabled by default, improving tooling and reflection support.

## Kotlin/Native

### Default Concurrent Marking in GC

The garbage collector now uses concurrent marking by default, reducing pause times.

### Swift Export (Alpha)

```kotlin
// Improved Swift interop
kotlin {
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    // Swift export — generate Swift framework
    // Experimental in 2.4.0
}
```

### LLVM 21

Kotlin/Native now uses LLVM 21, improving compilation performance and platform support.

### Xcode 26.4 Support

Full support for Xcode 26.4 toolchain.

## Kotlin/Wasm

### Incremental Compilation

Incremental compilation is now enabled by default for Kotlin/Wasm, significantly improving build times.

### WebAssembly Component Model

```kotlin
// Support for WebAssembly Component Model
// Enables interoperability with other Wasm components
```

### Chrome DevTools Integration

Improved display of internal variables in Chrome DevTools for better debugging.

## Kotlin/JS

### Value Class Export

```kotlin
@JvmInline
value class UserId(val value: Long)

// Now exported to JavaScript/TypeScript as a distinct type
```

### TypeScript Export Improvements

- Type variance preserved when exporting to TypeScript
- Improved interface export to JavaScript/TypeScript
- Lifted restrictions on exporting interfaces

## Gradle

### Minimum AGP Version

Minimum Android Gradle Plugin version bumped to 8.5.2.

### Consistent Module Names

Module names are now consistent across all platforms (JVM, Native, JS, Wasm).

### Problems API

Compiler messages are now written to Gradle's Problems API for Kotlin/JVM, improving IDE integration.

## Maven

### Automatic Java/JVM Target Alignment

```xml
<!-- Automatic alignment between Java and JVM target versions -->
<configuration>
    <jvmTarget>17</jvmTarget>
    <!-- Java compiler target automatically aligned -->
</configuration>
```

### Maven Toolchains Support

Full support for Maven Toolchains, allowing automatic JDK selection.

## Compiler

### Consistent Inlining

Consistent intra-module function inlining during klib compilation across all platforms.

### Partial Library Linkage

Consistent partial library linkage across Kotlin compilers, improving compilation speed.

## Compose Compiler

### Consistent Incremental Compilation

Improved incremental compilation for internal declarations.

### Feature Flag Deprecations

Legacy feature flags have been deprecated in favor of the new configuration system.

## Breaking Changes

```kotlin
// Check migration guide for breaking changes from 2.3.x to 2.4.0
// https://kotlinlang.org/docs/whatsnew24.html#breaking-changes-and-deprecations
```

## Migration

### Update to Kotlin 2.4.0

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.0"
}

// settings.gradle.kts
pluginManagement {
    plugins {
        kotlin("jvm") version "2.4.0"
    }
}
```

### Compatibility

- **Minimum Java**: JDK 8 (JVM target), JDK 17+ recommended for compilation
- **Gradle**: 7.6.3+ (8.x recommended)
- **Android**: AGP 8.5.2+
- **Xcode**: 26.4+
- **LLVM**: 21

### K2 Compiler

Kotlin 2.0+ uses the K2 compiler by default. K2 provides:
- Faster compilation
- Better error messages
- Smarter type inference
- No migration needed for most projects

### Kotlin 2.0 Key Features

**K2 Smart Cast Improvements:**
- Smart casts work on local var after null check
- Smart casts from safe call results
- Smart casts on properties in same module
- Smart casts on lambda captures

**Kotlin/JVM:**
- Lambda generation via `invokedynamic` (no wrapper class needed)
- `kotlinx-metadata-jvm` library is Stable

**Kotlin/Native:**
- GC performance monitoring with signposts on Apple platforms
- Objective-C method conflict resolution
- Explicitly added stdlib and platform dependencies

**Kotlin/Wasm:**
- Production builds optimized with Binaryen by default
- Named exports support (`@JsExport`)
- Unsigned primitive types in `@JsExport` functions
- TypeScript declaration file generation
- JavaScript exception catching support
- `withWasm()` split into `wasmJs()` and `wasmWasi()`

**Kotlin/JS:**
- New compilation target
- Suspend functions as ES2015 generators
- Arguments to `main()` function support
- Per-file compilation support
- Type-safe plain JavaScript objects
- npm package manager support

**Standard Library:**
- `Uuid` class (Stable)
- `enumEntries<T>()` replaces `enumValues<T>()` (more efficient)
- `AutoCloseable` interface (Stable)
- `String.toCharArray(destination)` common function
- `AbstractMutableList.modCount` and `removeRange` common

**Gradle:**
- New Gradle DSL for compiler options in multiplatform
- New Compose compiler Gradle plugin
- New attribute to distinguish JVM and Android-published libraries
- Improved CInteropProcess dependency handling
- Kotlin/Native compiler downloaded when needed

**Compiler Plugins:**
- K2 support for all compiler plugins
- Experimental Power-assert compiler plugin
