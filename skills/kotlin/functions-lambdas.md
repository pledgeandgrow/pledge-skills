# Functions & Lambdas

**Docs:** https://kotlinlang.org/docs/functions.html | https://kotlinlang.org/docs/lambdas.html | https://kotlinlang.org/docs/inline-functions.html

## Function Declaration

```kotlin
// Basic function with explicit return type
fun add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function — body after =, return type inferred
fun square(x: Int) = x * x

// Explicit return type with single expression
fun double(x: Int): Int = x * 2

// Unit return type (no meaningful return) — can be omitted
fun printGreeting(name: String): Unit {
    println("Hello, $name!")
}

// Equivalent — Unit omitted
fun printGreeting2(name: String) {
    println("Hello, $name!")
}
```

## Named Arguments

```kotlin
fun format(name: String, prefix: String = "Mr.", suffix: String = "Jr."): String {
    return "$prefix $name $suffix"
}

// Positional
format("Smith")                              // "Mr. Smith Jr."

// Named — order can change
format(name = "Jones", suffix = "Sr.")       // "Mr. Jones Sr."
format(suffix = "III", prefix = "Dr.", name = "Brown")  // "Dr. Brown III"

// Mixed positional + named (positional must come first)
format("Wilson", suffix = "PhD")             // "Mr. Wilson PhD"
```

## Default Parameter Values

```kotlin
fun greet(name: String, greeting: String = "Hello", punctuation: Char = '!'): String {
    return "$greeting, $name$punctuation"
}

greet("Kotlin")                    // "Hello, Kotlin!"
greet("Kotlin", "Hi")              // "Hi, Kotlin!"
greet("Kotlin", punctuation = '?') // "Hello, Kotlin?"

// Skip middle parameters with named arguments
greet("Kotlin", punctuation = '.') // "Hello, Kotlin."
```

## Vararg Parameters

```kotlin
// vararg allows variable number of arguments
fun sum(vararg numbers: Int): Int {
    return numbers.sum()
}

sum(1, 2, 3)           // 6
sum(1, 2, 3, 4, 5)     // 15
sum()                  // 0

// Only one vararg per function, typically the last parameter
fun join(prefix: String, vararg items: String, suffix: String): String {
    return prefix + items.joinToString() + suffix
}

join("(", "a", "b", "c", suffix = ")")  // "(a, b, c)"

// Spread operator — pass array as vararg
val nums = intArrayOf(1, 2, 3)
sum(*nums)             // 6

// With other collections
val list = listOf(1, 2, 3)
sum(*list.toIntArray()) // 6
```

## Function Types

```kotlin
// Type signatures
() -> Unit                          // no params, no return
(Int) -> Int                        // one Int param, returns Int
(Int, Int) -> Int                   // two Int params, returns Int
(String) -> Boolean                 // String param, returns Boolean
(Int) -> (Int) -> Int               // curried: returns a function

// Named parameters (for documentation)
typealias Transformer = (input: String) -> String

// Function type with receiver
String.() -> Int    // equivalent to (String) -> Int but with 'this' as receiver
```

## Lambda Expressions

```kotlin
// Full syntax
val upper: (String) -> String = { s: String -> s.uppercase() }

// Type inference
val upper2 = { s: String -> s.uppercase() }

// Implicit 'it' parameter (when single parameter)
val upper3: (String) -> String = { it.uppercase() }

// No parameters
val greet: () -> String = { "Hello!" }

// Multiple parameters
val add: (Int, Int) -> Int = { a, b -> a + b }

// Multi-line lambda
val process: (Int) -> String = { num ->
    val doubled = num * 2
    "Result: $doubled"
}
```

## Calling Lambdas

```kotlin
val square: (Int) -> Int = { it * it }

// Direct invocation
square(5)          // 25
square.invoke(5)   // 25

// Assigned to variable
val result = square(10)  // 100
```

## Trailing Lambda Syntax

When the last parameter is a function type, the lambda can be placed outside the parentheses:

```kotlin
// Function with function parameter
fun process(value: Int, transform: (Int) -> Int): Int {
    return transform(value)
}

// Normal call
process(5, { it * 2 })

// Trailing lambda — parentheses omitted when only lambda arg
process(5) { it * 2 }

// Common in stdlib
val list = listOf(1, 2, 3, 4, 5)
list.filter { it > 2 }           // [3, 4, 5]
list.map { it * it }             // [1, 4, 9, 16, 25]
list.forEach { println(it) }
list.reduce { acc, item -> acc + item }  // 15
```

## Function References

```kotlin
// :: operator creates a reference to a function
fun isEven(x: Int): Boolean = x % 2 == 0

val predicate: (Int) -> Boolean = ::isEven
val evens = (1..10).filter(::isEven)  // [2, 4, 6, 8, 10]

// Bound method reference (to instance)
class Calculator {
    fun add(a: Int, b: Int) = a + b
}
val calc = Calculator()
val adder: (Int, Int) -> Int = calc::add
adder(3, 4)  // 7

// Constructor reference
data class Person(val name: String)
val factory: (String) -> Person = ::Person
val person = factory("Alice")  // Person(name=Alice)

// Property reference
val prop = Person::name
val nameLen: (Person) -> Int = { it.name.length }
```

## Higher-Order Functions

```kotlin
// Function that takes a function as parameter
fun <T> repeatAction(times: Int, action: (Int) -> T): List<T> {
    return (0 until times).map(action)
}

repeatAction(3) { "Item $it" }  // ["Item 0", "Item 1", "Item 2"]

// Function that returns a function
fun multiplier(factor: Int): (Int) -> Int = { it * factor }

val double = multiplier(2)
val triple = multiplier(3)
double(5)   // 10
triple(5)   // 15

// Composition
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C = { f(g(it)) }

val parseThenDouble = compose({ it * 2 }, String::toInt)
parseThenDouble("21")  // 42
```

### Closures

```kotlin
// Lambdas capture variables from enclosing scope (closures)
var count = 0
val increment = { count++ }  // captures 'count'
increment()
increment()
println(count)  // 2

// Captured variables can be modified (unlike Java)
fun counter(): () -> Int {
    var c = 0
    return { c++; c }  // captures and modifies 'c'
}
val next = counter()
next()  // 1
next()  // 2
```

### Underscore for Unused Variables

```kotlin
// Use _ for unused lambda parameters
val list = listOf(1, 2, 3)
list.forEachIndexed { _, value ->
    println(value)  // index not needed
}

// Multiple unused parameters
map.forEach { _, _ ->
    // neither key nor value used — just counting
}
```

### Destructuring in Lambdas

```kotlin
// Destructure pairs in lambda parameters
val map = mapOf("a" to 1, "b" to 2)
map.forEach { (key, value) ->
    println("$key = $value")
}

// Destructure data class
data class Point(val x: Int, val y: Int)
val points = listOf(Point(1, 2), Point(3, 4))
points.forEach { (x, y) ->
    println("($x, $y)")
}

// Combine with underscore
map.forEach { (key, _) ->
    println(key)
}
```

### Function Literals with Receiver

```kotlin
// Lambda with receiver — 'this' is the receiver inside the lambda
val greet: String.() -> String = { "Hello, $this!" }
"Kotlin".greet()  // "Hello, Kotlin!"

// Useful for DSL builders
fun buildString(action: StringBuilder.() -> Unit): String {
    val sb = StringBuilder()
    sb.action()  // 'this' is sb inside the lambda
    return sb.toString()
}

val result = buildString {
    append("Hello")
    append(", ")
    append("World!")
}  // "Hello, World!"

// Anonymous function with receiver
val concat = fun StringBuilder.(s: String): StringBuilder {
    append(s)
    return this
}
StringBuilder().concat("Hi").toString()  // "Hi"
```

## Inline Functions

```kotlin
// inline — eliminates lambda overhead by inlining at call site
inline fun measureTime(block: () -> Unit): Long {
    val start = System.currentTimeMillis()
    block()
    return System.currentTimeMillis() - start
}

val elapsed = measureTime {
    Thread.sleep(100)
    println("Done")
}

// noinline — prevent inlining of specific lambda
inline fun mixed(inlineBlock: () -> Unit, noinline deferred: () -> Unit) {
    inlineBlock()
    // deferred can be stored/returned (not inlined)
    Runnable(deferred).run()
}

// crossinline — inline but prevent non-local returns
inline fun crossExample(crossinline block: () -> Unit) {
    Runnable { block() }.run()
}
```

## Functional (SAM) Interfaces

**Docs:** https://kotlinlang.org/docs/fun-interfaces.html

```kotlin
// fun interface — single abstract method interface, enables SAM conversion
fun interface ClickHandler {
    fun onClick(target: String): Boolean
}

// SAM conversion — pass lambda instead of explicit implementation
fun register(handler: ClickHandler) { /* ... */ }

// Without SAM conversion (verbose)
register(object : ClickHandler {
    override fun onClick(target: String): Boolean {
        return target.isNotEmpty()
    }
})

// With SAM conversion (concise)
register { it.isNotEmpty() }

// Can have multiple non-abstract members
fun interface Processor {
    fun process(input: String): String  // single abstract method

    // Non-abstract members
    fun processTwice(input: String): String = process(process(input))
    fun default(): String = process("")
}

// Constructor reference to functional interface
fun interface Printer {
    fun print(value: String)
}

val printerRef: (String) -> Unit = ::Printer  // callable reference to constructor

// fun interface vs type alias
// Type alias: typealias Handler = (String) -> Boolean — no new type
// fun interface: creates a distinct type, can have extensions and extra members
// Use fun interface when you need a named type with contracts beyond a plain function
```

## Type Aliases

**Docs:** https://kotlinlang.org/docs/type-aliases.html

```kotlin
// Shorten long generic types
typealias StringMap = Map<String, String>
typealias IntPredicate = (Int) -> Boolean

// Function type aliases
typealias Handler<T> = (T) -> Unit
typealias Validator<T> = (T) -> Boolean

// Usage
val isEven: IntPredicate = { it % 2 == 0 }
fun process(items: List<String>, handler: Handler<String>) { /* ... */ }

// Nested type aliases (inside classes)
class Container<T> {
    // Cannot capture outer type parameter T
    typealias Items = List<String>  // OK — doesn't use T
    // typealias Items = List<T>    // ERROR — captures T from outer class

    // Fix: declare type parameter directly
    typealias Items2<X> = List<X>
}

// Type aliases don't create new types — they're transparent
typealias Predicate<T> = (T) -> Boolean
val p: Predicate<Int> = { it > 0 }
val f: (Int) -> Boolean = p  // OK — same type at runtime

// Type alias for inner/nested classes
class Outer {
    class Nested
}
typealias OuterNested = Outer.Nested
```

## Reified Type Parameters

```kotlin
// reified — access type at runtime (requires inline)
inline fun <reified T> typeOf(): String = T::class.simpleName ?: "Unknown"

typeOf<String>()  // "String"
typeOf<Int>()     // "Int"

// Type-safe filtering
inline fun <reified T> List<*>.filterByType(): List<T> {
    return this.filterIsInstance<T>()
}

val mixed: List<Any> = listOf(1, "two", 3, "four")
val strings = mixed.filterByType<String>()  // ["two", "four"]
val ints = mixed.filterByType<Int>()        // [1, 3]
```

## Local Functions

```kotlin
fun processOrder(orderId: String): String {
    // Local function — visible only within processOrder
    fun validate(id: String): Boolean {
        return id.isNotBlank() && id.length == 10
    }

    if (!validate(orderId)) return "Invalid order"

    fun format(id: String): String {
        return "ORDER-$id"
    }

    return format(orderId)
}
```

## Tail Recursive Functions

```kotlin
// tailrec — optimizes recursion to loop (no stack overflow)
tailrec fun factorial(n: Long, acc: Long = 1): Long {
    return if (n <= 1) acc else factorial(n - 1, acc * n)
}

factorial(5)   // 120
factorial(20)  // 2432902008176640000

// Must call itself as last operation (tail position)
tailrec fun sumTo(n: Int, acc: Int = 0): Int {
    return if (n == 0) acc else sumTo(n - 1, acc + n)
}

sumTo(100)  // 5050
```

## Infix Functions

```kotlin
// Member infix function
class StringBuilder {
    infix fun add(text: String) { append(text) }
}

val sb = StringBuilder()
sb add "Hello"  // instead of sb.add("Hello")

// Extension infix function
infix fun Int.times(str: String): String = str.repeat(this)

3 times "ab"    // "ababab"
5 times "x"     // "xxxxx"

// Standard library infix functions
val map = mapOf("key" to "value")    // 'to' is infix
val pair = "left" to "right"
1 in 1..10       // 'in' is infix
```

## Operator Functions

```kotlin
// Overloadable operators
data class Vector2(val x: Double, val y: Double) {
    operator fun plus(other: Vector2) = Vector2(x + other.x, y + other.y)
    operator fun minus(other: Vector2) = Vector2(x - other.x, y - other.y)
    operator fun times(scalar: Double) = Vector2(x * scalar, y * scalar)
    operator fun unaryMinus() = Vector2(-x, -y)
    operator fun get(index: Int): Double = when (index) {
        0 -> x
        1 -> y
        else -> throw IndexOutOfBoundsException()
    }
    operator fun component1() = x
    operator fun component2() = y
}

val v1 = Vector2(1.0, 2.0)
val v2 = Vector2(3.0, 4.0)

v1 + v2          // Vector2(4.0, 6.0)
v1 - v2          // Vector2(-2.0, -2.0)
v1 * 2.0         // Vector2(2.0, 4.0)
-v1              // Vector2(-1.0, -2.0)
v1[0]            // 1.0
val (x, y) = v1  // destructuring — x=1.0, y=2.0
```

### Operator Reference

| Operator | Function |
|----------|----------|
| `+` | `plus` |
| `-` | `minus` |
| `*` | `times` |
| `/` | `div` |
| `%` | `rem` |
| `..` | `rangeTo` |
| `..<` | `rangeUntil` |
| `in` | `contains` |
| `[]` | `get` / `set` |
| `()` | `invoke` |
| `+=` | `plusAssign` |
| `-=` | `minusAssign` |
| `==` | `equals` |
| `>` `<` `>=` `<=` | `compareTo` |
| `-` (unary) | `unaryMinus` |
| `+` (unary) | `unaryPlus` |
| `!` | `not` |
| `++` | `inc` |
| `--` | `dec` |

## Suspend Functions

```kotlin
// suspend — can pause and resume, only callable from coroutine context
suspend fun fetchUser(id: String): User {
    delay(500)  // non-blocking suspend
    return User(id)
}

// suspend lambdas
val fetch: suspend (String) -> User = { id ->
    delay(100)
    User(id)
}
```

## Extension Functions

```kotlin
// Extend a class with new functionality
fun String.removeWhitespace(): String = replace("\\s".toRegex(), "")

"Hello World".removeWhitespace()  // "HelloWorld"

// Extension on nullable type
fun String?.orDefault(default: String): String = this ?: default

null.orDefault("N/A")  // "N/A"
"Value".orDefault("N/A")  // "Value"

// Extension properties
val String.isNumeric: Boolean
    get() = this.all { it.isDigit() }

"12345".isNumeric  // true
"12a45".isNumeric  // false
```

See `dsl-builders.md` for more on extension functions, scope functions, and DSL construction.

## Non-Local Returns and Labeled Returns

```kotlin
// Non-local return from inline function lambda
fun hasZero(nums: List<Int>): Boolean {
    nums.forEach {
        if (it == 0) return true  // returns from hasZero, not just forEach
    }
    return false
}

// This works because forEach is inline — the lambda is inlined into the caller

// Labeled return — returns from the lambda, not the enclosing function
list.forEach lit@{
    if (it == 0) return@lit  // skips this element, continues forEach
    println(it)
}

// Implicit label (same name as function)
list.forEach {
    if (it == 0) return@forEach  // skips this element
    println(it)
}

// Anonymous function — return returns from the anon function, not outer
list.forEach(fun(x: Int) {
    if (x == 0) return  // returns from anonymous function only
    println(x)
})

// Labeled break/continue in loops
loop@ for (i in 1..5) {
    for (j in 1..5) {
        if (i * j > 10) break@loop  // breaks outer loop
        println("$i * $j = ${i * j}")
    }
}

outer@ for (i in 1..3) {
    for (j in 1..3) {
        if (j == 2) continue@outer  // skips to next iteration of outer loop
        println("$i, $j")
    }
}

// Simulating break in forEach with run
run breaker@{
    list.forEach {
        if (it == 0) return@breaker  // exits the run block
        println(it)
    }
}
```

## Inline Properties

```kotlin
// Inline properties — backing field access is inlined
inline val <T> List<T>.lastIndex: Int
    get() = size - 1

// Inline setter
inline var <T> MutableList<T>.first: T
    get() = this[0]
    set(value) { this[0] = value }

// Restrictions:
// - Cannot have a backing field
// - Cannot access private members (they'd be inaccessible at call site)
// - Only for top-level or member properties (not local)
```
