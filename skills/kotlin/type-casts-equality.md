# Type Casts & Equality

**Docs:** https://kotlinlang.org/docs/typecasts.html | https://kotlinlang.org/docs/equality.html

## Type Checks: is and !is

```kotlin
// is — checks if an object is an instance of a type
val obj: Any = "hello"
if (obj is String) {
    println(obj.length)  // smart cast to String
}

// !is — checks if an object is NOT an instance
if (obj !is String) {
    println("Not a string")
}

// In when expressions
fun describe(x: Any): String = when (x) {
    is String -> "String of length ${x.length}"
    is Int -> "Integer: $x"
    is List<*> -> "List of size ${x.size}"
    else -> "Unknown"
}
```

## Smart Casts

```kotlin
// After is check, compiler automatically casts
fun process(x: Any) {
    if (x is String) {
        // x is smart-cast to String
        println(x.uppercase())  // String method available
        println(x.length)       // no explicit cast needed
    }
}

// Smart cast after !is
fun process(x: Any) {
    if (x !is String) return
    // x is smart-cast to String here
    println(x.length)
}

// Smart cast in when
fun handle(x: Any) {
    when (x) {
        is String -> println(x.length)    // smart cast
        is Int -> println(x * 2)          // smart cast
        is List<*> -> println(x.size)     // smart cast
    }
}

// Smart cast with logical operators
if (x is String && x.length > 5) {
    println(x.uppercase())  // smart cast in both conditions
}

if (x is String || x is Int) {
    // x is NOT smart cast here (only one branch may be true)
}

// Smart cast with nullable
val str: String? = "hello"
if (str != null) {
    println(str.length)  // smart cast to String (non-null)
}
```

### Smart Cast Prerequisites

```kotlin
// Smart cast works on:
// - Local var/val
// - val properties (not open, no custom getter)
// - Safe (immutable) captured values

// Smart cast does NOT work on:
// - var properties (could change between check and use)
// - open val properties (could be overridden)
// - Properties with custom getters
// - Properties delegated to other classes

class Example {
    var mutableProp: Any = "hello"
    open val openProp: Any = "world"

    fun test() {
        if (mutableProp is String) {
            // println(mutableProp.length)  // ERROR — mutable, could change
            val str = mutableProp as String  // explicit cast needed
            println(str.length)
        }

        if (openProp is String) {
            // println(openProp.length)  // ERROR — open, could be overridden
        }
    }
}

// Smart cast works on local variables
fun localExample() {
    var x: Any = "hello"
    if (x is String) {
        println(x.length)  // OK — local var, compiler tracks
    }
}
```

## Type Casts: as and as?

```kotlin
// as — unsafe cast (throws ClassCastException if wrong type)
val obj: Any = "hello"
val str: String = obj as String  // OK

val obj2: Any = 42
// val str2: String = obj2 as String  // ClassCastException

// as? — safe cast (returns null if wrong type)
val safeStr: String? = obj2 as? String  // null (no exception)
val safeStr2: String? = obj as? String  // "hello"

// Safe cast with Elvis
val str3: String = (obj as? String) ?: "default"

// Common pattern: safe cast in when
fun process(x: Any): String = when (x) {
    is String -> x  // smart cast, no explicit cast needed
    else -> x.toString()
}
```

### Upcasting and Downcasting

```kotlin
open class Animal
class Dog : Animal()
class Cat : Animal()

// Upcasting — implicit, always safe
val animal: Animal = Dog()  // implicit upcast

// Downcasting — explicit, may fail
val dog: Dog = animal as Dog  // OK if animal is actually Dog
// val dog2: Dog = animal as Cat  // ClassCastException

// Safe downcast
val safeDog: Dog? = animal as? Dog  // null if not Dog
```

## Intersection Types in Smart Casts

```kotlin
// When multiple is checks combine
interface Named { val name: String }
interface Aged { val age: Int }

class Person(override val name: String, override val age: Int) : Named, Aged

fun process(obj: Any) {
    if (obj is Named && obj is Aged) {
        // obj is smart-cast to intersection: Named & Aged
        println("${obj.name} is ${obj.age}")
    }
}
```

## Equality

### Structural Equality (==)

```kotlin
// == checks structural equality (calls equals())
// Same as Java's .equals()

val a = "hello"
val b = "hello"
a == b  // true — same content

val list1 = listOf(1, 2, 3)
val list2 = listOf(1, 2, 3)
list1 == list2  // true — same elements

// Data classes — auto-generated equals() compares properties
data class User(val id: Long, val name: String)
val u1 = User(1, "Alice")
val u2 = User(1, "Alice")
u1 == u2  // true — same id and name

// != is the negation
u1 != u2  // false
```

### Referential Equality (===)

```kotlin
// === checks referential equality (same object in memory)
// Same as Java's ==

val a = User(1, "Alice")
val b = User(1, "Alice")
a === b  // false — different objects
a !== b  // true

val c = a
a === c  // true — same reference

// For primitive types (Int, etc.), === may behave like ==
// due to caching, but don't rely on this
val x = 127
val y = 127
x === y  // may be true (cached) — implementation dependent

// Strings — interned constants
val s1 = "hello"
val s2 = "hello"
s1 === s2  // true — string pool

val s3 = "hel" + "lo"
s1 === s3  // may be true (compile-time constant folding)
```

### Floating-Point Equality

```kotlin
// NaN is equal to itself (unlike IEEE 754)
val nan = Double.NaN
nan == nan  // true in Kotlin (false in Java)
nan === nan  // true

// -0.0 vs 0.0
val negZero = -0.0
val posZero = 0.0
negZero == posZero  // true
negZero === posZero  // true
// But they differ in operations:
1.0 / negZero  // -Infinity
1.0 / posZero  // Infinity
```

## Array Equality

```kotlin
// Content equality — same elements in same order
val arr1 = intArrayOf(1, 2, 3)
val arr2 = intArrayOf(1, 2, 3)

arr1 == arr2       // false — referential equality (arrays don't override equals)
arr1.contentEquals(arr2)  // true — content comparison

// Nested arrays
val nested1 = arrayOf(intArrayOf(1, 2), intArrayOf(3, 4))
val nested2 = arrayOf(intArrayOf(1, 2), intArrayOf(3, 4))
nested1.contentDeepEquals(nested2)  // true — deep content comparison

// List vs Array
val list = listOf(1, 2, 3)
val array = intArrayOf(1, 2, 3)
list == array.toList()  // true
```

## Custom Equality

```kotlin
// Override equals() in regular classes
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false
        return x == other.x && y == other.y
    }

    override fun hashCode(): Int {
        return 31 * x + y
    }
}

// Data classes auto-generate equals() and hashCode()
data class DataPoint(val x: Int, val y: Int)
// equals() compares x and y, hashCode() computed from x and y
```

## Nothing Type in Casts

```kotlin
// as to Nothing throws if the value is not Nothing (always)
val x: Any = "hello"
// x as Nothing  // throws ClassCastException

// Useful in type inference
fun <T> castOrThrow(value: Any?): T {
    return value as T  // unchecked cast, may throw at runtime
}

// Safe version
inline fun <reified T> safeCast(value: Any?): T? = value as? T
```
