# Annotations

**Docs:** https://kotlinlang.org/docs/annotations.html

## Declaration

```kotlin
// Basic annotation declaration
annotation class MyAnnotation

// With constructor parameters
annotation class SerialName(val value: String)

// With multiple parameters
annotation class Route(
    val path: String,
    val method: String = "GET",
    val authenticated: Boolean = true
)
```

## Usage

```kotlin
@MyAnnotation
class MyClass {
    @MyAnnotation
    fun myFunction() {}

    @MyAnnotation
    val myProperty: String = ""
}

// With parameters
@SerialName("user_id")
val userId: Long = 0

@Route("/users", method = "POST")
fun createUser() { /* ... */ }

// Multiple annotations on same target
@SerialName("email")
@MyAnnotation
val email: String = ""
```

## Annotation Use-Site Targets

```kotlin
// When annotation could apply to multiple targets, specify explicitly
class Example {
    @property:MyAnnotation      // on the property
    val a: String = ""

    @field:MyAnnotation         // on the backing field
    val b: String = ""

    @get:MyAnnotation           // on the getter
    val c: String = ""

    @set:MyAnnotation           // on the setter
    var d: String = ""

    @param:MyAnnotation         // on the constructor parameter
    constructor(val e: String)

    @setparam:MyAnnotation      // on the setter parameter
    var f: String = ""
}

// Common use case: JPA/Jackson annotations
class User(
    @param:JsonProperty("user_id")
    @get:JsonProperty("user_id")
    val userId: Long
)
```

### Default Use-Site Targets

When no target is specified, Kotlin uses the first applicable target in this order:
1. `param` (constructor parameter)
2. `property` (property itself)
3. `field` (backing field)

## @SerialInfo (Custom Meta-Annotations)

```kotlin
@SerialInfo
annotation class MinLength(val value: Int)

@Serializable
data class Password(
    @MinLength(8) val value: String
)
```

## @Target

```kotlin
// Restrict where annotation can be used
@Target(AnnotationTarget.CLASS)
annotation class ClassOnly

@Target(AnnotationTarget.FUNCTION)
annotation class FuncOnly

@Target(AnnotationTarget.PROPERTY)
annotation class PropOnly

@Target(
    AnnotationTarget.CLASS,
    AnnotationTarget.FUNCTION,
    AnnotationTarget.PROPERTY,
    AnnotationTarget.VALUE_PARAMETER
)
annotation class MultiTarget

// Available targets:
// CLASS, ANNOTATION_CLASS, PROPERTY, FIELD, LOCAL_VARIABLE,
// VALUE_PARAMETER, CONSTRUCTOR, FUNCTION, PROPERTY_GETTER,
// PROPERTY_SETTER, TYPEALIAS, EXPRESSION, FILE, TYPE, TYPE_PARAMETER
```

## @Retention

```kotlin
// When annotation is available
@Retention(AnnotationRetention.SOURCE)   // discarded at compile time
annotation class SourceOnly

@Retention(AnnotationRetention.BINARY)   // stored in bytecode, not visible via reflection
annotation class BinaryOnly

@Retention(AnnotationRetention.RUNTIME)  // stored in bytecode, visible via reflection (default)
annotation class RuntimeVisible
```

## @Repeatable

```kotlin
// Allow multiple annotations of same type on one target
@Repeatable
@Target(AnnotationTarget.FUNCTION)
annotation class Tag(val value: String)

@Tag("kotlin")
@Tag("tutorial")
@Tag("advanced")
fun taggedFunction() { /* ... */ }
```

## @MustBeDocumented

```kotlin
// Include annotation in KDoc/Dokka output
@MustBeDocumented
annotation class ApiStatus(val stable: Boolean)

@ApiStatus(true)
class PublicApi { /* ... */ }
```

## Java Annotations

```kotlin
// Using Java annotations from Kotlin
import java.lang.annotation.*

// Apply Java annotation
@Deprecated("Use newFunction instead")
fun oldFunction() { /* ... */ }

// Java annotations with @Target(ElementType.TYPE_USE)
// Kotlin supports TYPE_USE targets
@Suppress("UNCHECKED_CAST")
val list = emptyList<String>() as List<Int>

// Arrays as annotation parameters (Java)
@java.lang.SuppressWarnings(value = ["unused", "unchecked"])
fun javaAnnotated() { /* ... */ }
```

## Meta-Annotations

```kotlin
// Build custom meta-annotations
@Target(AnnotationTarget.ANNOTATION_CLASS)
annotation class Synchronized

@Synchronized
@Target(AnnotationTarget.FUNCTION)
annotation class ThreadSafe

@ThreadSafe
fun safeFunction() { /* ... */ }
```

## File Annotations

```kotlin
// At the top of a file, before package declaration
@file:JvmName("StringUtils")
@file:Suppress("unused")

package com.example.utils

fun toTitleCase(s: String): String { /* ... */ }
```

## Common Standard Library Annotations

```kotlin
// @Deprecated — mark as deprecated
@Deprecated("Use newFunction()", ReplaceWith("newFunction()"))
fun oldFunction() { /* ... */ }

// @ReplaceWith — provide migration replacement
@Deprecated("Use process()", ReplaceWith("process(data)"))
fun handle(data: String) { /* ... */ }

// @Suppress — suppress compiler warnings
@Suppress("UNUSED_PARAMETER", "UNCHECKED_CAST")
fun unchecked(): List<String> = listOf(1, 2, 3) as List<String>

// @OptIn — opt into experimental API
@OptIn(ExperimentalStdlibApi::class)
fun useExperimental() { /* ... */ }

// @RequiresOptIn — mark API as requiring opt-in
@RequiresOptIn
annotation class ExperimentalApi

@ExperimentalApi
fun experimentalFunction() { /* ... */ }

// @JvmStatic, @JvmField, @JvmOverloads, @JvmName — Java interop
// (see java-interop.md)

// @DslMarker — restrict DSL scope access
// (see dsl-builders.md)

// @Serializable — kotlinx.serialization
// (see serialization.md)
```

## Reading Annotations at Runtime

```kotlin
// Requires RUNTIME retention
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Table(val name: String)

@Table("users")
class User

// Read annotations via reflection
val tableAnn = User::class.findAnnotation<Table>()
println(tableAnn?.name)  // "users"

// Check if annotation is present
val hasTable = User::class.hasAnnotation<Table>()

// All annotations
User::class.annotations.forEach { println(it) }
```

## Opt-in Requirements

**Docs:** https://kotlinlang.org/docs/opt-in-requirements.html

### Declaring Opt-in Required API

```kotlin
// Mark an annotation as a marker for opt-in requirement
@RequiresOptIn
annotation class ExperimentalApi

// Apply to API elements that require opt-in
@ExperimentalApi
class ExperimentalClass { /* ... */ }

@ExperimentalApi
fun experimentalFunction() { /* ... */ }

@ExperimentalApi
val experimentalProperty: Int = 42
```

### Opting In to Use API

```kotlin
// 1. Local opt-in — single usage
@OptIn(ExperimentalApi::class)
fun useExperimental() {
    val obj = ExperimentalClass()
    experimentalFunction()
}

// 2. File-level opt-in — entire file
@file:OptIn(ExperimentalApi::class)

package com.example

fun useEverywhere() {
    val obj = ExperimentalClass()
}

// 3. Module-level opt-in — gradle.properties
// kotlin.experimental.optIn=com.example.ExperimentalApi

// 4. Opt-in to inherit from a class
@OptIn(ExperimentalApi::class)
class MyImpl : ExperimentalClass() { /* ... */ }
```

### Requiring Opt-in to Extend API

```kotlin
@RequiresOptIn
annotation class UnstableApi

// Require opt-in to both use AND extend
@UnstableApi
open class UnstableBaseClass {
    open fun baseMethod() { /* ... */ }
}

// Must opt-in to subclass
@OptIn(UnstableApi::class)
class Stable : UnstableBaseClass() {
    override fun baseMethod() { /* ... */ }
}
```

### Pre-stable API Convention

```kotlin
// Kotlin stdlib uses these markers:
@RequiresOptIn(level = RequiresOptIn.Level.WARNING)
annotation class ExperimentalStdlibApi

@RequiresOptIn(level = RequiresOptIn.Level.ERROR)
annotation class DelicateCoroutinesApi

// Levels:
// ERROR   — using without opt-in is a compilation error
// WARNING — using without opt-in produces a warning
```
