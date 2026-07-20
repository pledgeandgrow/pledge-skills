---
name: kotlin-docs
version: "2.4.0"
tags:
  - kotlin
  - jvm
  - multiplatform
  - coroutines
  - null-safety
  - functional
  - oop
  - android
  - backend
description: |
  Comprehensive Kotlin 2.4.0 reference covering all language features: variables, basic types,
  strings, control flow, functions, lambdas, classes, objects, inheritance, interfaces, data classes,
  sealed classes, generics, collections, sequences, null safety, coroutines (suspend, launch, async,
  Flow, StateFlow, channels), DSLs, extension functions, scope functions, delegation, reflection,
  annotations, exceptions, type casts, equality, Kotlin Multiplatform (KMP), serialization, Java
  interoperability, testing, Gradle/Maven build tools, idiomatic patterns, and what's new in 2.4.0.
  Use whenever the user mentions Kotlin, coroutines, null safety, data classes, KMP,
  kotlinx.serialization, reflection, annotations, exceptions, or needs help with any Kotlin code,
  build configuration, or library usage.
---

# Kotlin Expert (v2.4.0)

**Official Documentation:** https://kotlinlang.org/docs/home.html

## Quick Reference

| Topic | File |
|-------|------|
| Variables, basic types, strings, control flow, ranges, when | `basics-syntax.md` |
| Functions, named args, defaults, lambdas, function types, inline | `functions-lambdas.md` |
| Classes, constructors, properties, inheritance, interfaces, data/sealed/enum classes, objects | `classes-objects.md` |
| List, Set, Map, sequences, collection operations, functional API | `collections.md` |
| Nullable types, safe calls, Elvis, smart casts, not-null assertion | `null-safety.md` |
| Suspending functions, launch, async, Flow, StateFlow, channels, dispatchers | `coroutines.md` |
| Variance, reified type parameters, star projections, type bounds | `generics.md` |
| DSLs, type-safe builders, scope functions, extension functions, delegation | `dsl-builders.md` |
| Kotlin Multiplatform (KMP), expect/actual, platform-specific code, sharing logic | `multiplatform.md` |
| @Serializable, JSON, ProtoBuf, polymorphism, custom serializers | `serialization.md` |
| Java interop, migration guides, Kotlin/Java differences, JSpecify | `java-interop.md` |
| JUnit 5, assertions, parameterized tests, coroutine testing, mocking | `testing.md` |
| Gradle, Kotlin Gradle Plugin, Maven, compiler options, KSP | `build-tools.md` |
| Idiomatic Kotlin patterns, coding conventions, best practices | `idioms-best-practices.md` |
| Kotlin 2.4.0 features, language changes, stdlib additions, migration | `whats-new.md` |
| Reflection, KClass, callable references, property/constructor references | `reflection.md` |
| Exceptions, try-catch-finally, precondition functions, Nothing type, custom exceptions | `exceptions.md` |
| Annotations, use-site targets, @Target, @Retention, @Repeatable, Java annotations | `annotations.md` |
| Type checks (is/!is), smart casts, as/as?, structural vs referential equality, floating-point | `type-casts-equality.md` |

## Core Philosophy

Kotlin is a **modern, concise, multiplatform** programming language that is fully interoperable with Java. Key principles:

1. **Conciseness** — reduce boilerplate with data classes, type inference, smart casts
2. **Safety** — null safety at compile time, no NPEs by default, immutable by default (`val`)
3. **Interoperability** — seamless Java interop, usable on JVM, JS, Native, Wasm
4. **Tooling** — first-class IDE support (IntelliJ IDEA), excellent compiler diagnostics
5. **Multiplatform** — share business logic across iOS, Android, web, backend, desktop
6. **Coroutines** — structured concurrency with lightweight threads (suspending functions)
7. **DSL-friendly** — extension functions, infix, lambda receivers enable type-safe DSLs

## Hello World

```kotlin
fun main() {
    println("Hello, World!")
}

// With command-line args
fun main(args: Array<String>) {
    println("Args: ${args.joinToString()}")
}
```

## Variables

```kotlin
val readOnly = "immutable"   // val — read-only, assigned once
var mutable = "changeable"   // var — mutable, can be reassigned

// Type inference — type is automatically detected
val count = 42               // Int
val pi = 3.14                // Double
val name = "Kotlin"          // String

// Explicit type
val score: Int = 100
val temp: Float = 24.5f
```

## Basic Types Quick Reference

| Category | Types | Example |
|----------|-------|---------|
| Integers | `Byte`, `Short`, `Int`, `Long` | `val year: Int = 2025` |
| Unsigned | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u` |
| Float | `Float`, `Double` | `val price: Double = 19.99` |
| Boolean | `Boolean` | `val ok: Boolean = true` |
| Character | `Char` | `val sep: Char = ','` |
| String | `String` | `val msg: String = "Hi"` |
| Array | `Array<T>` | `val arr = arrayOf(1, 2, 3)` |

## Operators

| Operator | Description |
|----------|-------------|
| `+` `-` `*` `/` `%` | Arithmetic |
| `+=` `-=` `*=` `/=` `%=` | Augmented assignment |
| `++` `--` | Increment / decrement |
| `&&` `\|\|` `!` | Boolean AND, OR, NOT |
| `==` `!=` `===` `!==` | Equality (structural), identity (referential) |
| `<` `>` `<=` `>=` | Comparison |
| `..` `..<` | Range (inclusive, exclusive) |
| `in` `!in` | Membership / range check |
| `?.` `?:` `!!` | Safe call, Elvis, not-null assertion |
| `as` `as?` | Cast, safe cast |
| `is` `!is` | Type check |

## Control Flow Quick Reference

```kotlin
// if as expression — no ternary operator needed
val max = if (a > b) a else b

// when — replaces switch
val desc = when (x) {
    0 -> "zero"
    1, 2, 3 -> "small"
    in 4..10 -> "medium"
    else -> "large"
}

// for loop with range
for (i in 1..5) print(i)       // 12345
for (i in 1..<5) print(i)      // 1234
for (i in 5 downTo 1) print(i) // 54321
for (i in 1..10 step 2) print(i) // 13579

// while
while (condition) { /* ... */ }
do { /* ... */ } while (condition)
```

## Functions Quick Reference

```kotlin
// Basic function
fun add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
fun square(x: Int) = x * x

// Default parameters
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

// Named arguments (order can change)
greet(greeting = "Hi", name = "Kotlin")

// Vararg
fun sum(vararg nums: Int) = nums.sum()

// Lambda expression
val upper: (String) -> String = { s -> s.uppercase() }
// or with implicit 'it'
val upper2: (String) -> String = { it.uppercase() }

// Trailing lambda
list.filter { it > 0 }
```

## Classes Quick Reference

```kotlin
// Basic class with primary constructor
class Person(val name: String, var age: Int)

// Data class — auto-generates equals, hashCode, toString, copy, componentN
data class User(val id: Long, val name: String, val email: String)

// Enum class
enum class Color { RED, GREEN, BLUE }

// Sealed class — restricted hierarchy
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val message: String) : Result()
}

// Object declaration — singleton
object Database {
    fun connect() { /* ... */ }
}

// Companion object — static-like members
class Factory {
    companion object {
        fun create() = Factory()
    }
}
```

## Coroutines Quick Reference

```kotlin
import kotlinx.coroutines.*

// Launch a coroutine
suspend fun fetchData(): String {
    delay(1000)
    return "Data"
}

// runBlocking — bridge blocking to suspend
fun main() = runBlocking {
    val result = fetchData()
    println(result)
}

// launch — fire and forget
GlobalScope.launch {
    repeat(5) { i ->
        delay(500)
        println("Tick $i")
    }
}

// async — returns a value
val deferred = CoroutineScope(Dispatchers.IO).async {
    fetchData()
}
val data = deferred.await()
```

## Installation & Setup

```bash
# Install via SDKMAN! (Linux/macOS)
sdk install kotlin

# Install via Homebrew (macOS)
brew install kotlin

# Windows: download from https://kotlinlang.org/docs/command-line.html
# Or use winget:
winget install JetBrains.Kotlin

# Verify
kotlinc -version
```

## Build & Run

```bash
# Compile and run a script
kotlinc main.kt -include-runtime -d main.jar
java -jar main.jar

# Kotlin script (.kts)
kotlinc -script script.kts

# With Gradle (Kotlin DSL)
gradle build
gradle run

# With Maven
mvn compile
mvn exec:java -Dexec.mainClass="MainKt"
```

## Project Creation

```bash
# Gradle project (Kotlin DSL)
gradle init --type kotlin-application

# Maven project
mvn archetype:generate -DarchetypeArtifactId=kotlin-archetype-jvm

# IntelliJ IDEA: New Project > Kotlin
```
