# Generics

**Docs:** https://kotlinlang.org/docs/generics.html | https://kotlinlang.org/docs/generics.html#variance

## Generic Functions and Classes

```kotlin
// Generic function
fun <T> identity(value: T): T = value

identity("hello")   // String
identity(42)        // Int

// Generic class
class Box<T>(val value: T)

val stringBox = Box("hello")   // Box<String>
val intBox = Box(42)           // Box<Int>

// Generic interface
interface Repository<T> {
    fun get(id: String): T
    fun save(item: T)
}

// Generic with multiple type parameters
class Pair<K, V>(val key: K, val value: V)

// Generic with constraint
fun <T : Comparable<T>> maxOf(a: T, b: T): T {
    return if (a >= b) a else b
}

maxOf(1, 2)            // 2
maxOf("a", "b")        // "b"
```

## Type Bounds (Constraints)

```kotlin
// Upper bound — T must be Number or subtype
fun <T : Number> sum(numbers: List<T>): Double {
    return numbers.sumOf { it.toDouble() }
}

// Multiple upper bounds — with where clause
fun <T> process(item: T) where T : Comparable<T>, T : Iterable<T> {
    // T must be both Comparable and Iterable
}

// Class with bounds
class SortedList<T : Comparable<T>> {
    private val items = mutableListOf<T>()
    fun add(item: T) { items.add(item); items.sort() }
}

// Nullable bound — T can be nullable
fun <T : Any?> processOrNull(item: T) = item
// Default is Any? (nullable)
fun <T : Any> processNonNull(item: T) = item  // T must be non-null
```

## Variance

### Declaration-Site Variance

```kotlin
// out (covariant) — producer (only returns T, never consumes)
interface Source<out T> {
    fun next(): T
}

val stringSource: Source<String> = ...
val anySource: Source<Any> = stringSource  // OK — covariant

// in (contravariant) — consumer (only consumes T, never returns)
interface Sink<in T> {
    fun put(item: T)
}

val anySink: Sink<Any> = ...
val stringSink: Sink<String> = anySink  // OK — contravariant

// invariant (default) — both produces and consumes
class MutableList<T> {
    fun add(item: T)     // consumes T
    fun get(index: Int): T  // produces T
}
```

### Variance Summary

| Declaration | Meaning | Use When |
|-------------|---------|----------|
| `out T` | Covariant (producer) | Only returns T |
| `in T` | Contravariant (consumer) | Only accepts T |
| `T` | Invariant | Both returns and accepts T |

### PECS Principle

- **P**roducer **E**xtends (Kotlin: `out`) — if you only read from it
- **C**onsumer **S**uper (Kotlin: `in`) — if you only write to it

```kotlin
// Example: Function that copies from source to destination
fun <T> copy(source: Source<out T>, destination: Sink<in T>) {
    while (true) {
        val item = source.next() ?: break
        destination.put(item)
    }
}
```

## Use-Site Variance (Type Projections)

```kotlin
// When you can't change declaration-site variance
class Array<T>(val size: Int) {
    operator fun get(i: Int): T = ...
    operator fun set(i: Int, value: T) { ... }
}

// Projected type — out projection (read-only view)
fun copy(from: Array<out Any>, to: Array<in Any>) {
    for (i in from.indices) {
        to[i] = from[i]
    }
}

// Star projection — type is unknown
fun printSize(list: List<*>) {
    println(list.size)  // OK — doesn't use the type parameter
}

// Star projection with Array
fun fill(array: Array<in Any>, value: Any) {
    for (i in array.indices) {
        array[i] = value
    }
}
```

## Reified Type Parameters

```kotlin
// reified — access type at runtime (requires inline function)
inline fun <reified T> typeOf(): String = T::class.simpleName ?: "Unknown"

typeOf<String>()  // "String"
typeOf<Int>()     // "Int"

// Type-safe filtering
inline fun <reified T> List<*>.filterByType(): List<T> {
    return this.filterIsInstance<T>()
}

val mixed: List<Any> = listOf(1, "two", 3, "four")
val strings = mixed.filterByType<String>()  // ["two", "four"]

// Start activity (Android)
inline fun <reified T : Activity> Context.startActivity() {
    startActivity(Intent(this, T::class.java))
}

// Gson/JSON deserialization
inline fun <reified T> Gson.fromJson(json: String): T = fromJson(json, T::class.java)
```

## Generic Constraints with Where

```kotlin
// Multiple constraints with where clause
fun <T> ensureValid(item: T) where T : Comparable<T>, T : Number {
    require(item >= 0) { "Must be non-negative" }
}

// Class with where
class Processor<T> where T : Runnable, T : AutoCloseable {
    fun process(item: T) {
        item.run()
        item.close()
    }
}
```

## Type Erasure and Workarounds

```kotlin
// Type parameters are erased at runtime
// List<String> and List<Int> are both List at runtime

// Checking generic type
val list = listOf("a", "b")
list is List<*>       // OK
// list is List<String>  // ERROR — type erased

// is check with star projection
if (list is List<*>) {
    val element = list[0]
    // element is Any?
}

// reified to preserve type info
inline fun <reified T> isListOf(list: List<*>): Boolean {
    return list.all { it is T }
}

isListOf<String>(listOf("a", "b"))  // true
isListOf<String>(listOf(1, 2))      // false
```

## Variance in Collections

```kotlin
// Read-only collections are covariant
val strings: List<String> = listOf("a", "b")
val anys: List<Any> = strings  // OK — List is covariant (out)

// Mutable collections are invariant
// val mutableAnys: MutableList<Any> = mutableListOf<String>()  // ERROR

// This is why mutable collections are invariant:
// If allowed, you could add a non-String to a MutableList<String> via MutableList<Any>
```

## Generic Extension Functions

```kotlin
// Extension with generic constraint
fun <T : Number> List<T>.averageValue(): Double {
    return if (isEmpty()) 0.0 else sumOf { it.toDouble() } / size
}

listOf(1, 2, 3).averageValue()        // 2.0
listOf(1.0, 2.0, 3.0).averageValue()  // 2.0

// Reified extension
inline fun <reified T> Any.castOrNull(): T? = this as? T

"hello".castOrNull<String>()  // "hello"
42.castOrNull<String>()       // null
```

## Type Parameter Naming Conventions

```kotlin
// Common conventions:
// T — Type
// E — Element (collections)
// K — Key
// V — Value
// R — Return type
// S, U — Second, third type parameters

class Map<K, V> { ... }
fun <T, R> transform(value: T, mapper: (T) -> R): R = mapper(value)
```

## Definitely Non-Nullable Types

```kotlin
// T & Any — guarantees T is non-nullable even if T has no upper bound
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

// Useful for Java interop where platform types need nullability guarantees
fun <T> handle(value: T & Any): T & Any {
    return value  // guaranteed non-null
}

// With type parameters that have nullable upper bound
class Container<T : Any?> {
    // T could be nullable, but T & Any is definitely non-nullable
    fun process(item: T & Any): T & Any = item
}
```

## Underscore Operator for Type Arguments

```kotlin
// Kotlin 1.7+ — use _ for inferred type arguments
// When the compiler can infer a type argument, use _ as placeholder

// Instead of: fun <K, V> buildMap(builder: ...): Map<K, V>
// You can omit K and let the compiler infer it

// Example with function types
fun <K, V> mapOf(vararg pairs: Pair<K, V>): Map<K, V> = ...

// With underscore (when only some types are inferrable)
val result = buildMap<_, String> {
    put("key", "value")
}
// _ is inferred as String (from key type)

// Useful when you want to specify some type args but let others be inferred
val processor = Processor<_, String>(config)
```
