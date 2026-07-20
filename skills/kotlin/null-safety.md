# Null Safety

**Docs:** https://kotlinlang.org/docs/null-safety.html

## Nullable Types

```kotlin
// Non-nullable — cannot hold null
val name: String = "Kotlin"
// name = null  // COMPILE ERROR

// Nullable — explicitly marked with ?
val nullable: String? = null
val maybeNull: String? = "value"

// Nullable cannot be used as non-nullable without checks
val length = nullable.length  // COMPILE ERROR
```

## Checking for Null

```kotlin
val maybeString: String? = "Hello"

// Explicit null check
if (maybeString != null) {
    // Smart cast — compiler knows it's non-null here
    println(maybeString.length)  // OK
}

// if-null check with else
if (maybeString == null) {
    println("Was null")
} else {
    println(maybeString.length)  // smart cast
}
```

## Safe Call Operator `?.`

```kotlin
val name: String? = null

// Safe call — returns null if receiver is null
val length: Int? = name?.length  // null

// Chaining safe calls
class Person(val address: Address?)
class Address(val city: String?)

val person: Person? = Person(Address(null))
val city: String? = person?.address?.city  // null — no error

// Safe call with method
val upper: String? = name?.uppercase()  // null
```

## Elvis Operator `?:`

```kotlin
val name: String? = null

// Provide default if null
val length: Int = name?.length ?: 0  // 0

// With expression
val displayName: String = name ?: "Unknown"  // "Unknown"

// With function call
val result = name?.let { process(it) } ?: defaultValue()

// Elvis with throw
val required: String = name ?: throw IllegalArgumentException("Name required")

// Elvis with return
fun process(data: String?): Int {
    val safe = data ?: return -1
    return safe.length
}
```

## Not-Null Assertion `!!`

```kotlin
val name: String? = "Kotlin"
val forced: String = name!!  // throws NPE if null

// Dangerous — prefer safe alternatives
// val crash: String = null!!  // throws NullPointerException

// Use only when you're certain it's not null
// and null indicates a programming error
```

## Smart Casts

```kotlin
// Smart cast after null check
fun describe(text: String?): String {
    if (text != null) {
        return text.uppercase()  // smart cast to String
    }
    return "null"
}

// Smart cast with when
fun process(obj: Any): String = when (obj) {
    is String -> obj.uppercase()       // smart cast to String
    is Int -> obj.toString()           // smart cast to Int
    is List<*> -> obj.size.toString()  // smart cast to List
    else -> "unknown"
}

// Smart cast with is
fun handle(x: Any) {
    if (x is String) {
        println(x.length)  // smart cast — x is String here
    }
}

// Safe cast with as?
val str: String? = obj as? String  // null if not String
```

## let for Null Handling

```kotlin
val name: String? = "Kotlin"

// let — execute block only if non-null
name?.let {
    println("Name is $it, length ${it.length}")
}

// null case not handled
val maybeName: String? = null
maybeName?.let { println(it) }  // not executed

// With default
val result = name?.let { transform(it) } ?: "default"
```

## Nullable Receiver Extensions

```kotlin
// Extension on nullable type
fun String?.isNullOrBlank(): Boolean = this == null || this.isBlank()

// This? in extension
fun String?.repeatOrEmpty(times: Int): String {
    return if (this == null) "" else this.repeat(times)
}

null.repeatOrEmpty(3)  // ""
"ab".repeatOrEmpty(3)  // "ababab"
```

## Platform Types (Java Interop)

```kotlin
// Java methods returning String have unknown nullability — platform type
// val fromJava: String = JavaClass.getName()  // may be null at runtime

// Always handle Java return values explicitly
val safe: String? = JavaClass.getName()  // treat as nullable
val safe2: String = JavaClass.getName() ?: ""  // provide default

// @Nullable / @NotNull annotations improve interop
// JSpecify support in Kotlin 2.x for better null safety
```

## Common Patterns

### Safe Navigation

```kotlin
data class User(val profile: Profile?)
data class Profile(val email: String?)

fun getEmail(user: User?): String {
    return user?.profile?.email ?: "no-email"
}
```

### Null-Coalescing Chain

```kotlin
// Try multiple sources, fall back to default
val name = primaryName ?: secondaryName ?: fallbackName ?: "Unknown"
```

### Filter Not Null

```kotlin
val list: List<String?> = listOf("a", null, "b", null, "c")
val nonNull: List<String> = list.filterNotNull()  // ["a", "b", "c"]

// mapNotNull — transform and filter nulls
val lengths = list.mapNotNull { it?.length }  // [1, 1, 1]

// firstOrNull / lastOrNull
val first = list.firstOrNull { it != null }  // "a"
```

### Nullable in Collections

```kotlin
// List with nullable elements
val withNulls: List<String?> = listOf("a", null, "b")

// Map with nullable values
val map: Map<String, String?> = mapOf("a" to "1", "b" to null)

// getValue vs getOrNull vs []
map.getValue("a")   // "1" — throws if key missing
map["a"]            // "1" — null if key missing
map.getOrNull("b")  // null — Kotlin 2.4.0+ (distinguishes missing key from null value)
```

### Null Safety with Contracts

```kotlin
// requireNotNull — throws if null
fun process(data: String?): String {
    val safe = requireNotNull(data) { "data must not be null" }
    return safe.uppercase()  // smart cast to non-null
}

// checkNotNull — throws IllegalStateException
fun useState(state: State?): State {
    val safe = checkNotNull(state) { "State not initialized" }
    return safe
}
```

## Strict vs Platform Nullability

```kotlin
// Kotlin strict nullability
val kotlinNullable: String? = null  // compile-time checked

// Java platform type (unknown nullability)
// val javaResult = JavaApi.getName()  // String! (platform type)

// JSpecify (Kotlin 2.x) — improved Java nullability
// @Nullable String -> String?
// @NonNull String -> String
// Unannotated -> treated based on JSpecify mode
```
