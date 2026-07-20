# Basics & Syntax

**Docs:** https://kotlinlang.org/docs/basic-syntax.html | https://kotlinlang.org/docs/numbers.html | https://kotlinlang.org/docs/strings.html | https://kotlinlang.org/docs/control-flow.html | https://kotlinlang.org/docs/ranges.html

## Variables

```kotlin
// Read-only (immutable) — assigned once, cannot be reassigned
val count = 10
val name: String = "Kotlin"

// Mutable — can be reassigned
var counter = 0
counter = 1

// Declare without initialization (must specify type)
val message: String
message = "Hello"

// Top-level variables
val PI = 3.14159
var debugMode = true

fun main() {
    println("$PI, $debugMode")
}
```

### Best Practice

Prefer `val` over `var` by default. Only use `var` when you genuinely need mutability.

## Integer Types

| Type | Size (bits) | Min | Max |
|------|-------------|-----|-----|
| `Byte` | 8 | -128 | 127 |
| `Short` | 16 | -32768 | 32767 |
| `Int` | 32 | -2^31 | 2^31-1 |
| `Long` | 64 | -2^63 | 2^63-1 |

```kotlin
val one = 1           // Int
val threeBillion = 3000000000  // Long (exceeds Int range)
val oneLong = 1L      // Long (explicit suffix)
val oneByte: Byte = 1 // Byte (explicit type)

// Underscores in numeric literals for readability
val socialSecurity = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

## Unsigned Integer Types

| Type | Size | Range |
|------|------|-------|
| `UByte` | 8 | 0..255 |
| `UShort` | 16 | 0..65535 |
| `UInt` | 32 | 0..2^32-1 |
| `ULong` | 64 | 0..2^64-1 |

```kotlin
val uByte: UByte = 1u
val uInt: UInt = 1u
val uLong: ULong = 1uL

// Unsigned arrays
val uIntArray = uintArrayOf(1u, 2u, 3u)
```

## Floating-Point Types

| Type | Size | Precision |
|------|------|-----------|
| `Float` | 32 | ~6-7 decimal digits |
| `Double` | 64 | ~15-16 decimal digits |

```kotlin
val e = 2.71828          // Double
val pi = 3.14f           // Float (f suffix)
val exp = 1.0e10         // Double (scientific notation)

// Conversions
val intVal = 5
val doubleVal = intVal.toDouble()
val floatVal = intVal.toFloat()
```

## Boolean Type

```kotlin
val isActive = true
val isDone = false

// Lazy evaluation (short-circuit)
val result = check() && process()  // process() only if check() is true
val alt = check() || process()     // process() only if check() is false

// Boolean operations
val both = a && b
val either = a || b
val negated = !a

// Infix functions (eager evaluation — both operands always evaluated)
val andResult = a and b       // same as && but no short-circuit
val orResult = a or b         // same as || but no short-circuit
val xorResult = a xor b       // true if operands differ

// Nullable Boolean
val nullableBool: Boolean? = null
if (nullableBool == true) { /* safe null-aware check */ }

// Operator precedence (highest to lowest):
// !  >  xor  >  &&  >  ||
val expr = true || false && false  // true (&& evaluated first)
val expr2 = (true || false) && false  // false (explicit grouping)
```

## Character Type

```kotlin
val letter = 'A'
val digit = '1'
val tab = '\t'
val unicode = '\u0041'  // 'A'

// Character operations
'9'.digitToInt()       // 9
'A'.code               // 65
Char(65)               // 'A'
'a' in 'a'..'z'        // true

// Nullable character
val nullableChar: Char? = null

// Unicode — Basic Multilingual Plane (BMP)
val greek = '\u0394'   // Δ
val emoji = '😀'       // supplementary character (surrogate pair)

// Escape sequences
// \t  tab    \n  newline   \r  carriage return
// \'  quote  \"  double quote  \\  backslash
// \$  dollar  \uXXXX  Unicode character

// Character arithmetic
val c = 'A'
(c + 1)                 // 'B'
('z' - 'a')             // 25
('a'..'z').toList()     // [a, b, c, ..., z]

// Character conversion
'5'.digitToIntOrNull()  // 5 (null if not a digit)
'A'.digitToInt(16)      // 10 (hex digit)
'3'.digitToIntOrNull()  // 3
Char(97)                // 'a'
val upper = 'a'.uppercaseChar()  // 'A'
val lower = 'A'.lowercaseChar()  // 'a'

// Character comparison
'a' < 'b'               // true
'0' <= '9'              // true
'0'.isDigit()           // true
'A'.isLetter()          // true
'A'.isUpperCase()       // true
' '.isWhitespace()      // true
```

## String Type

```kotlin
// String literal
val s = "Hello, World!"

// Multi-line string (raw string)
val text = """
    |Line 1
    |Line 2
    |Line 3
""".trimMargin()

// Without margin prefix
val raw = """
    Multi
    line
    text
""".trimIndent()

// String templates — $ for variables, ${} for expressions
val name = "Kotlin"
val greeting = "Hello, $name!"
val length = "Length: ${name.length}"

// Nullable values in string templates
val nullableName: String? = null
println("Name: ${nullableName ?: "Unknown"}")  // "Name: Unknown"

// Multi-dollar string interpolation (Kotlin 1.8+)
// Use ${'$'} to escape $ in strings
val price = "Cost: ${'$'}100"  // "Cost: $100"

// Multi-line string templates
val multiline = """
    |Hello, $name!
    |Length: ${name.length}
""".trimMargin()

// Escaping
val escaped = "Tab:\tNewline:\nQuote:\""
```

### String Operations

```kotlin
val str = "Hello, Kotlin!"

// Access characters
str[0]                    // 'H'
str.first()               // 'H'
str.last()                // '!'

// Substring
str.substring(0, 5)       // "Hello"
str.substring(7)          // "Kotlin!"

// Iteration
for (ch in str) print(ch)

// Comparison
"a" == "a"                // true (structural equality)
"a" === "a"               // may be false (referential)

// Common functions
str.length                // 14
str.uppercase()           // "HELLO, KOTLIN!"
str.lowercase()           // "hello, kotlin!"
str.reversed()            // "!niltloK ,olleH"
str.trim()                // remove whitespace
str.split(", ")           // ["Hello", "Kotlin!"]
str.replace("Kotlin", "World")  // "Hello, World!"
str.startsWith("Hello")   // true
str.endsWith("!")         // true
str.contains("Kotlin")    // true
str.isBlank()             // false
str.isEmpty()             // false
str.toIntOrNull()         // null if not a number
str.padStart(20, '*')     // "******Hello, Kotlin!"
str.padEnd(20, '*')       // "Hello, Kotlin!******"
```

### StringBuilder

```kotlin
val sb = StringBuilder()
sb.append("Hello")
sb.append(", ")
sb.append("World")
sb.toString()  // "Hello, World"
```

## Control Flow

### If Expression

```kotlin
// Statement
if (x > 0) {
    println("positive")
} else if (x < 0) {
    println("negative")
} else {
    println("zero")
}

// Expression — no ternary operator needed
val max = if (a > b) a else b

// Multi-line if expression
val result = if (condition) {
    computeValue()
} else {
    defaultValue
}
```

### When Expression

```kotlin
// With subject
val desc = when (x) {
    0 -> "zero"
    1, 2, 3 -> "small"
    in 4..10 -> "medium"
    in 11..100 -> "large"
    else -> "huge"
}

// Without subject (boolean conditions)
val status = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    else -> "F"
}

// With type checks
fun describe(obj: Any): String = when (obj) {
    is String -> "String of length ${obj.length}"
    is Int -> "Integer: $obj"
    is List<*> -> "List of size ${obj.size}"
    else -> "Unknown"
}

// With enum (exhaustive — no else needed if all cases covered)
enum class State { LOADING, SUCCESS, ERROR }
fun handle(state: State) = when (state) {
    State.LOADING -> "Loading..."
    State.SUCCESS -> "Done!"
    State.ERROR -> "Failed!"
}

// As statement (no return value)
when (direction) {
    "up" -> moveUp()
    "down" -> moveDown()
    else -> { /* no-op */ }
}

// Guard conditions (Kotlin 2.1+) — additional condition after primary match
fun classify(num: Int): String = when (num) {
    0 -> "zero"
    in 1..100 if num % 2 == 0 -> "small even"
    in 1..100 if num % 2 != 0 -> "small odd"
    in 101..1000 -> "large"
    else -> "huge"
}

// Guard with else if
fun check(x: Int) = when (x) {
    in 0..10 if x > 5 -> "6-10"
    in 0..10 -> "0-5"
    else -> "out of range"
}

// Multiple guard conditions with && or ||
fun validate(input: String) = when (input.length) {
    in 1..100 if (input.startsWith("http") && input.contains("://")) -> "URL"
    in 1..100 if input.contains("@") -> "email-like"
    else -> "unknown"
}
```

### For Loops

```kotlin
// Range
for (i in 1..5) print("$i ")       // 1 2 3 4 5
for (i in 1..<5) print("$i ")      // 1 2 3 4
for (i in 5 downTo 1) print("$i ") // 5 4 3 2 1
for (i in 1..10 step 2) print("$i ") // 1 3 5 7 9
for (i in 10 downTo 1 step 2) print("$i ") // 10 8 6 4 2

// Collection
val list = listOf("a", "b", "c")
for (item in list) println(item)
for ((index, item) in list.withIndex()) {
    println("$index: $item")
}

// Map
val map = mapOf("a" to 1, "b" to 2)
for ((key, value) in map) {
    println("$key = $value")
}

// While
var i = 0
while (i < 5) {
    print("$i ")
    i++
}

// Do-while
do {
    print("$i ")
    i--
} while (i > 0)
```

### Break and Continue

```kotlin
// Break — exit loop
for (i in 1..10) {
    if (i == 5) break
    print("$i ")  // 1 2 3 4
}

// Continue — skip iteration
for (i in 1..10) {
    if (i % 2 == 0) continue
    print("$i ")  // 1 3 5 7 9
}

// Labeled break/continue
loop@ for (i in 1..3) {
    for (j in 1..3) {
        if (i == 2 && j == 2) break@loop
        println("i=$i, j=$j")
    }
}

// Return from lambda
list.forEach {
    if (it == 0) return@forEach
    println(it)
}
```

## Ranges and Progressions

```kotlin
// Closed range (inclusive)
val range = 1..10          // 1, 2, 3, ..., 10
val chars = 'a'..'z'       // a, b, c, ..., z

// Open-ended range (exclusive) — Kotlin 1.25+
val halfOpen = 1..<10      // 1, 2, 3, ..., 9

// Downward range
val countdown = 10 downTo 1  // 10, 9, 8, ..., 1

// Step
val evens = 2..10 step 2   // 2, 4, 6, 8, 10
val odds = 10 downTo 1 step 2  // 10, 8, 6, 4, 2

// Range checks
5 in 1..10                 // true
5 !in 1..3                 // true
'x' in 'a'..'z'            // true

// Range operations
val r = 1..10
r.first                    // 1
r.last                     // 10
r.step(3)                  // 1, 4, 7, 10
r.reversed()               // 10..1

// CharRange, LongRange — same syntax
val longRange = 1L..100L

// Progression types: IntProgression, LongProgression, CharProgression
// Properties: first, last, step
val prog = (1..10 step 2)
prog.first   // 1
prog.last    // 9  (calculated: max value ≤ 10 where (last-first) % step == 0)
prog.step    // 2

// Progressions implement Iterable<N> — usable with collection functions
(1..10 step 2).map { it * it }.filter { it > 10 }  // [25, 49, 81]
```

## Comments

```kotlin
// Single-line comment

/* Multi-line
   comment */

/* Nested /* comments */ are allowed */

/** KDoc — documentation comment
 * @param name The name to greet
 * @return A greeting string
 */
fun greet(name: String): String = "Hello, $name"
```

## Type Conversion

```kotlin
// Explicit conversions (no implicit widening in Kotlin)
val i: Int = 100
val l: Long = i.toLong()
val d: Double = l.toDouble()
val f: Float = d.toFloat()
val b: Byte = i.toByte()
val s: Short = i.toShort()

// String to number (safe)
val parsed = "42".toInt()         // 42
val safe = "abc".toIntOrNull()    // null
val withRadix = "FF".toInt(16)    // 255

// Number to string
val str = 42.toString()           // "42"
val hex = 255.toString(16)        // "ff"
val binary = 5.toString(2)        // "101"

// Data overflow — wraps around (no exception thrown)
val maxInt = Int.MAX_VALUE       // 2147483647
val overflow = maxInt + 1        // -2147483648 (wraps to MIN_VALUE)

// Detect overflow with safe functions
val safeAdd = maxInt.addExact(1)  // throws ArithmeticException on overflow
val safeMul = maxInt.multiplyExact(2)  // throws on overflow

// Narrowing conversions — precision loss
val bigLong = 100_000_000_000L
val narrowed = bigLong.toInt()   // 1215752192 (truncated — precision lost)
// Always check range before narrowing
val safeNarrow = if (bigLong in Int.MIN_VALUE..Int.MAX_VALUE) bigLong.toInt() else null

// Boxing and caching on JVM
val a: Int = 127
val b: Int = 127
println(a === b)  // true — cached (Integer cache -128..127)

val c: Int = 128
val d: Int = 128
println(c === d)  // false — not cached, different boxed objects
println(c == d)   // true  — structural equality
```

## Arrays

```kotlin
// Create
val nums = arrayOf(1, 2, 3, 4, 5)
val mixed = arrayOf(1, "two", 3.0)  // Array<Any>
val empty = emptyArray<Int>()

// Primitive arrays (no boxing)
val ints = intArrayOf(1, 2, 3)
val doubles = doubleArrayOf(1.0, 2.0, 3.0)
val bools = booleanArrayOf(true, false)

// Size-based
val zeros = IntArray(5)           // [0, 0, 0, 0, 0]
val initialized = IntArray(5) { it * 2 }  // [0, 2, 4, 6, 8]

// Access
nums[0]                  // 1
nums.last()              // 5
nums.size                // 5

// Modify (if mutable)
val mutable = mutableListOf(1, 2, 3).toMutableList()
// arrays are always mutable in size but fixed in length
val arr = arrayOf(1, 2, 3)
arr[0] = 10

// Iterate
for (num in nums) println(num)
nums.forEach { println(it) }

// Transform
nums.map { it * 2 }           // [2, 4, 6, 8, 10]
nums.filter { it > 2 }        // [3, 4, 5]
nums.reduce { a, b -> a + b } // 15
nums.sum()                     // 15
nums.sorted()                  // [1, 2, 3, 4, 5]
nums.reversedArray()           // [5, 4, 3, 2, 1]
nums.contains(3)               // true
3 in nums                      // true
```

## Standard I/O

```kotlin
// Print
print("no newline")
println("with newline")

// Read input
val line = readln()              // String (throws if EOF)
val lineOrNull = readlnOrNull()  // String? (null if EOF)

// Read and convert
val num = readln().toInt()
val safeNum = readlnOrNull()?.toIntOrNull()

// Read multiple values
val (a, b) = readln().split(" ").let { it[0].toInt() to it[1].toInt() }

// Read multiline input until EOF
val allInput = generateSequence(::readlnOrNull).joinToString("\n")

// Java Scanner (alternative)
import java.util.Scanner
val scanner = Scanner(System.`in`)
val n = scanner.nextInt()
```

## Bitwise Operations

```kotlin
// Kotlin uses infix functions (no operators for bitwise)
val a = 0b1100  // 12
val b = 0b1010  // 10

a and b   // 0b1000 = 8
a or b    // 0b1110 = 14
a xor b   // 0b0110 = 6
a.inv()   // bitwise NOT (inverts all bits)

// Shift operations
a shl 2   // shift left  = 48 (0b110000)
a shr 2   // shift right (signed) = 3
a ushr 2  // unsigned shift right = 3

// Bit count
val bits = a.countOneBits()  // 2
val zeros = a.countLeadingZeroBits()
val trailing = a.countTrailingZeroBits()

// Rotate
a.rotateLeft(2)
a.rotateRight(2)

// Converting to/from binary string
val binStr = 12.toString(2)   // "1100"
val fromBin = "1100".toInt(2) // 12
```

## Packages and Imports

```kotlin
// Package declaration (top of file)
package com.example.utils

// Import single entity
import com.example.models.User

// Import entire package
import com.example.models.*

// Import with alias (resolve name clashes)
import com.example.models.User as UserModel

// Import companion object members
import com.example.Factory.create

// Default imports (automatically available)
// kotlin.*, kotlin.collections.*, kotlin.io.*, kotlin.ranges.*
// kotlin.sequences.*, kotlin.text.*

// What you can import:
// - Classes, objects, interfaces, enums
// - Top-level functions and properties
// - Extension functions and properties
// - Companion object members
```

## Code Organization

```kotlin
// File: User.kt
package com.example.models

// Top-level declarations
val DEFAULT_NAME = "Anonymous"

fun createUser(name: String = DEFAULT_NAME) = User(name)

class User(val name: String)

// File: Extensions.kt (same package)
package com.example.models

// Extension function in same package
fun User.greet() = "Hello, I'm $name"
```

## UUID (Kotlin 2.0+)

**Docs:** https://kotlinlang.org/docs/uuids.html

```kotlin
import kotlin.uuid.Uuid

// Generate random UUID
val id = Uuid.random()
println(id)  // e.g. "550e8400-e29b-41d4-a716-446655440000"

// Parse from string
val parsed = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")
val safeParsed = "invalid".toUuidOrNull()  // null if invalid

// Convert to string
val str = id.toString()
val hex = id.toHexString()

// Compare UUIDs
val a = Uuid.random()
val b = Uuid.random()
a == b           // false (structural equality)
a < b            // Comparable — natural ordering

// Binary representation
val bytes = id.toByteArray()          // 16 bytes
val fromBytes = Uuid.fromByteArray(bytes)

// Nil UUID (all zeros)
val nil = Uuid.NIL

// Use with Java APIs
val javaUuid: java.util.UUID = id.toJavaUuid()
val kotlinUuid: Uuid = Uuid.fromJavaUuid(javaUuid)
```
