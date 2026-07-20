# Idioms & Best Practices

**Docs:** https://kotlinlang.org/docs/idioms.html | https://kotlinlang.org/docs/coding-conventions.html | https://kotlinlang.org/docs/kotlin-tips.html | https://kotlinlang.org/docs/keyword-reference.html

## Keywords and Operators Reference

**Docs:** https://kotlinlang.org/docs/keyword-reference.html

### Hard Keywords (cannot be used as identifiers)

```
as       as?      break    class    continue
do       else     false    for      fun
if       in       !in      interface is
!is      null     object   package  return
super    this     throw    true     try
typealias typeof  val      var      when
while
```

### Soft Keywords (act as keywords in specific contexts, can be identifiers elsewhere)

```
by       catch    constructor delegate dynamic
field    file     final    get      import
init     param    property receiver set
setparam value    where
```

### Modifier Keywords

```
abstract actual   annotation companion const
crossinline data   enum    final    infix
inline  internal  lateinit open     operator
out     override  private protected public
reified sealed   suspend tailrec  vararg
value
```

### Special Identifiers

```kotlin
// Can be used as regular identifiers in Kotlin
field   // in property accessors — refers to backing field
value   // in property setters — the new value
```

### Operators and Special Symbols

| Symbol | Meaning |
|--------|---------|
| `+` `-` `*` `/` `%` | Arithmetic |
| `=` | Assignment |
| `+=` `-=` `*=` `/=` `%=` | Augmented assignment |
| `++` `--` | Increment / decrement |
| `&&` `\|\|` `!` | Logical AND / OR / NOT |
| `==` `!=` | Equality (structural) |
| `===` `!==` | Referential equality |
| `<` `>` `<=` `>=` | Comparison |
| `..` `..<` | Range (inclusive / exclusive) |
| `?:` | Elvis operator |
| `::` | Member / function reference |
| `?.` `!!` | Safe call / not-null assertion |
| `->` | Lambda arrow / when branch / function type |
| `@` | Annotation / label |
| `..` | Range |
| `,` | Separator |
| `_` | Unused variable / underscore type arg |
| `?` | Nullable type marker |
| `as` `as?` | Cast / safe cast |
| `in` `!in` | Contains / not contains |
| `is` `!is` | Type check / negated type check |
| `fun` | Function declaration |
| `object` | Object declaration / expression |
| `typealias` | Type alias |

## Data Classes (DTOs)

```kotlin
// Instead of Java POJOs with boilerplate
data class User(val id: Long, val name: String, val email: String)

// Automatically gets: equals, hashCode, toString, copy, componentN
```

## Filtering Collections

```kotlin
val positives = list.filter { it > 0 }

// Instead of Java stream().filter().collect()
val names = people.filter { it.age > 18 }.map { it.name }
```

## String Interpolation

```kotlin
val name = "Kotlin"
println("Hello, $name!")
println("Length: ${name.length}")

// Instead of Java: "Hello, " + name + "!"
```

## Single-Expression Functions

```kotlin
fun square(x: Int) = x * x

// Instead of:
// fun square(x: Int): Int { return x * x }
```

## Default Parameters

```kotlin
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

// Instead of method overloading in Java
```

## Named Arguments

```kotlin
// Improves readability for boolean parameters
sendEmail(to = "user@mail.com", subject = "Welcome", html = true)

// Instead of: sendEmail("user@mail.com", "Welcome", true) — unclear
```

## Elvis Operator for Defaults

```kotlin
val name = inputName ?: "Unknown"

// Instead of:
// val name = if (inputName != null) inputName else "Unknown"
```

## Safe Calls Chain

```kotlin
val city = user?.address?.city ?: "Unknown"

// Instead of nested null checks
```

## when for Branching

```kotlin
val result = when (status) {
    200 -> "OK"
    404 -> "Not Found"
    500 -> "Server Error"
    else -> "Unknown"
}

// Instead of switch-case with breaks
```

## Ranges

```kotlin
for (i in 1..100) { /* ... */ }
if (x in 0..10) { /* ... */ }

// Instead of: for (int i = 1; i <= 100; i++)
```

## Read-Only Collections

```kotlin
val list: List<String> = listOf("a", "b", "c")  // immutable
val map: Map<String, Int> = mapOf("a" to 1)     // immutable

// Prefer val + immutable collections
```

## apply for Configuration

```kotlin
val dialog = AlertDialog().apply {
    setTitle("Warning")
    setMessage("Are you sure?")
    setPositiveButton("OK") { _, _ -> confirm() }
}

// Instead of repeated dialog.setX() calls
```

## let for Null Safety

```kotlin
nullable?.let { value ->
    process(value)
}

// Instead of:
// if (nullable != null) { process(nullable) }
```

## also for Side Effects

```kotlin
val user = createUser().also {
    log("Created user: $it")
    metrics.increment("users")
}

// Keeps the original reference while adding side effects
```

## takeIf / takeUnless

```kotlin
val email = input.takeIf { it.contains("@") }
val safeInput = input.takeUnless { it.isBlank() }

// Instead of:
// val email = if (input.contains("@")) input else null
```

## buildList / buildMap

```kotlin
val list = buildList {
    add(1)
    addAll(existingItems)
    add(5)
}

val map = buildMap {
    put("a", 1)
    put("b", 2)
}
```

## Sealed Classes for State

```kotlin
sealed class UiState {
    object Loading : UiState()
    data class Success(val data: List<Item>) : UiState()
    data class Error(val message: String) : UiState()
}

// Exhaustive when — compiler enforces all cases
fun render(state: UiState) = when (state) {
    is UiState.Loading -> showLoading()
    is UiState.Success -> showData(state.data)
    is UiState.Error -> showError(state.message)
}
```

## Extension Functions for Utility

```kotlin
// Instead of static utility classes
fun String.isValidEmail(): Boolean = matches(emailRegex)
fun Int.toRoman(): String { /* ... */ }

// Usage
"test@mail.com".isValidEmail()
2024.toRoman()
```

## Inline Value Classes for Type Safety

```kotlin
@JvmInline
value class UserId(val value: Long)
@JvmInline
value class Email(val value: String)

fun sendEmail(userId: UserId, email: Email) { /* ... */ }

// Prevents mixing up parameters at compile time
// No runtime overhead (erased to underlying type)
```

## Coding Conventions

### Naming

```kotlin
// Classes and interfaces: PascalCase
class MyClass
interface MyInterface

// Functions and variables: camelCase
fun doSomething() {}
val userName = "Alice"

// Constants: SCREAMING_SNAKE_CASE
const val MAX_RETRIES = 3
companion object {
    const val DEFAULT_TIMEOUT = 5000L
}

// Generic type parameters: single capital letter
class Box<T>
fun <T> identity(value: T): T
```

### Property vs Function

```kotlin
// Use property when:
// - No computation cost
// - Returns same result for same state
val isEmpty: Boolean get() = size == 0

// Use function when:
// - Has computation cost
// - May return different results
fun computeHash(): Int { /* ... */ }
```

### Default Values

```kotlin
// Prefer default parameters over overloading
fun configure(
    host: String = "localhost",
    port: Int = 8080,
    timeout: Long = 5000
)
```

### When to Use let

```kotlin
// Good — null safety
nullable?.let { process(it) }

// Avoid — just for scoping (use run or direct call)
// str.let { println(it) }  — unnecessary, just println(str)
```

### Prefer val over var

```kotlin
// Good
val result = compute()

// Avoid (unless truly needed)
var result = compute()
```

### Use Standard Library Functions

```kotlin
// Instead of manual loops
val sum = numbers.sum()
val max = numbers.maxOrNull()
val sorted = numbers.sorted()
val grouped = items.groupBy { it.category }

// Instead of manual string building
val csv = items.joinToString(",") { it.name }

// Instead of manual mapping
val map = items.associateBy { it.id }
```

### Error Handling

```kotlin
// Use Result for recoverable errors
fun parseUser(json: String): Result<User> = runCatching {
    Json.decodeFromString<User>(json)
}

// Use sealed class for domain errors
sealed class ApiError {
    data class Network(val cause: Throwable) : ApiError()
    data class Server(val code: Int) : ApiError()
    data class Parse(val message: String) : ApiError()
}

// Use require/check for preconditions
fun process(age: Int) {
    require(age >= 0) { "Age must be non-negative" }
    check(isInitialized) { "Not initialized" }
}
```

### Destructuring

```kotlin
// Good — clear and concise
val (name, age) = person
for ((key, value) in map) { /* ... */ }

// Good in lambda
map.mapValues { (key, value) -> transform(key, value) }
```

### Use TODO() for Incomplete Code

```kotlin
fun complexAlgorithm(): Int {
    return TODO("Implement algorithm")
    // Throws NotImplementedError with message
}
```

### Trailing Commas

```kotlin
// Allowed and recommended for multi-line declarations
class Person(
    val name: String,
    val age: Int,
    val email: String,
)

fun configure(
    host: String = "localhost",
    port: Int = 8080,
    timeout: Long = 5000,
)
```

### Expression Body Functions

```kotlin
// Good for simple functions
fun square(x: Int) = x * x
fun isEmpty() = list.isEmpty()

// Use block body for complex logic
fun process(data: String): Result {
    val parsed = parse(data)
    val validated = validate(parsed)
    return transform(validated)
}
```

### Avoid !! (Not-Null Assertion)

```kotlin
// Bad — can crash at runtime
val name = user!!.name

// Good — handle null explicitly
val name = user?.name ?: "Unknown"
val name = requireNotNull(user?.name) { "User name required" }
```

### Prefer Immutability

```kotlin
// Good — immutable data class + copy
data class User(val name: String, val age: Int)
val updated = user.copy(age = 31)

// Avoid — mutable properties everywhere
// class User(var name: String, var age: Int)
```

### Source Code Organization

```kotlin
// File name: PascalCase.kt (if single class) or camelCase.kt (if functions)
// Directory structure follows package structure

// File organization order:
// 1. File-level annotations (@file:)
// 2. Package statement
// 3. Imports
// 4. Top-level functions and properties
// 5. Classes/interfaces (one per file for large classes)

// Class layout order:
// 1. Property declarations and initializer blocks
// 2. Secondary constructors
// 3. Methods
// 4. Companion object

// Interface implementation layout:
// Place overriding members close to the declaration they override
```

### Modifier Order

```kotlin
// Correct order: public/protected/private/internal, open/abstract/final, override, suspend
//                fun, class, object, val, var
abstract suspend fun processData()

private open override fun onEvent() {}

internal const val MAX_SIZE = 100
```

### Documentation Comments (KDoc)

```kotlin
/**
 * Calculates the sum of two integers.
 *
 * @param a The first integer.
 * @param b The second integer.
 * @return The sum of [a] and [b].
 * @throws IllegalArgumentException If either parameter is negative.
 * @sample com.example.Sample.sumExample
 * @since 1.0
 * @author Jane Doe
 */
fun sum(a: Int, b: Int): Int {
    require(a >= 0 && b >= 0)
    return a + b
}

// KDoc supports Markdown syntax and linking to symbols with []
// Link to: [className], [functionName], [property.name]
```

### Avoid Redundant Constructs

```kotlin
// No semicolons needed
val x = 1  // not: val x = 1;

// No Unit return type needed
fun doSomething() { }  // not: fun doSomething(): Unit { }

// String templates instead of concatenation
val msg = "Hello, $name!"  // not: "Hello, " + name + "!"

// Use expression body for simple functions
fun double(x: Int) = x * 2  // not: fun double(x: Int): Int { return x * 2 }
```
