# DSLs, Scope Functions & Extensions

**Docs:** https://kotlinlang.org/docs/scope-functions.html | https://kotlinlang.org/docs/extensions.html | https://kotlinlang.org/docs/type-safe-builders.html | https://kotlinlang.org/docs/delegated-properties.html

## Extension Functions

```kotlin
// Add functionality to existing classes without inheritance
fun String.removeVowels(): String = filter { it.lowercase() !in "aeiou" }

"Hello World".removeVowels()  // "Hll Wrld"

// Extension on collections
fun <T> List<T>.secondOrNull(): T? = if (size >= 2) get(1) else null

listOf(1, 2, 3).secondOrNull()  // 2
listOf(1).secondOrNull()        // null

// Extension with default parameter
fun String.truncate(maxLength: Int = 50, suffix: String = "..."): String {
    return if (length <= maxLength) this else take(maxLength) + suffix
}

"Very long text".truncate(5)  // "Very ..."
```

## Extension Properties

```kotlin
val String.isEmail: Boolean
    get() = matches(Regex("^[\\w.-]+@[\\w.-]+\\.\\w+$"))

"test@example.com".isEmail  // true

val Int.isEven: Boolean
    get() = this % 2 == 0

4.isEven  // true
5.isEven  // false
```

## Nullable Receiver Extensions

```kotlin
// Extension on nullable type — safe without explicit null check
fun String?.orEmpty(): String = this ?: ""

null.orEmpty()        // ""
"hello".orEmpty()     // "hello"

// Useful for chained operations
fun String?.trimmedOrEmpty(): String = this?.trim() ?: ""

"  hello  ".trimmedOrEmpty()  // "hello"
null.trimmedOrEmpty()         // ""
```

## Companion Object Extensions

```kotlin
class MyClass {
    companion object {
        fun create() = MyClass()
    }
}

// Extension on companion object
fun MyClass.Companion.fromJSON(json: String): MyClass {
    return MyClass()  // parse json...
}

// Usage
MyClass.create()
MyClass.fromJSON("{}")

// Extension factory methods via companion
fun MyClass.Companion.special(): MyClass {
    val instance = MyClass()
    // configure specially
    return instance
}

MyClass.special()
```

## Extensions as Members

```kotlin
// Declaring extensions inside a class — the extension has two receivers
class Host(val host: String) {
    // Member extension — "Host" is the dispatch receiver, "String" is the extension receiver
    fun String.greet(): String {
        return "Hello from $this at $host"
    }

    fun show() {
        "World".greet()  // "Hello from World at $host"
    }
}

val h = Host("example.com")
h.show()

// Overriding member extensions — NOT supported
// Extensions are resolved statically, not virtually
```

## Extension Resolution and Scope

```kotlin
// Extensions are resolved at compile time (static dispatch)
open class Base
class Derived : Base()

fun Base.foo() = "base"
fun Derived.foo() = "derived"

val obj: Base = Derived()
obj.foo()  // "base" — resolved by compile-time type

// Extensions can be scoped (package-level vs local)
// Package-level extension — visible everywhere it's imported
fun String.globalExt() = "global"

// Local extension — visible only within the block
fun process(s: String) {
    fun String.localExt() = "local"
    println(s.localExt())  // "local"
}

// Extensions don't modify the class — they're resolved via import
// If two packages define the same extension, import the one you need
```

## Scope Functions

| Function | Receiver | Return | Use Case |
|----------|----------|--------|----------|
| `let` | `it` | lambda result | Null checks, transformations |
| `run` | `this` | lambda result | Grouping calls, computation |
| `with` | `this` | lambda result | Operating on same object |
| `apply` | `this` | object itself | Configuration, builders |
| `also` | `it` | object itself | Side effects, logging |

### let

```kotlin
// let — transform or null-safety
val name = "Kotlin"
val length = name.let { it.length }  // 6

// Null safety
val nullable: String? = "hello"
nullable?.let {
    println("Length: ${it.length}")
}

// Map in chains
listOf(1, 2, 3)
    .map { it * 2 }
    .let { println("Result: $it") }
```

### run

```kotlin
// run — execute block and return result
val result = "hello".run {
    length + uppercase().length
}  // 10

// Useful for computation
val config = run {
    val env = System.getenv()
    Config(env["HOST"] ?: "localhost", env["PORT"]?.toIntOrNull() ?: 8080)
}
```

### with

```kotlin
// with — operate on same object (not an extension)
val sb = StringBuilder()
with(sb) {
    append("Hello")
    append(", ")
    append("World")
}
println(sb.toString())  // "Hello, World"

// With data class
val person = Person("Alice", 30)
with(person) {
    println(name)
    println(age)
}
```

### apply

```kotlin
// apply — configure object and return it
val dialog = Dialog().apply {
    setTitle("Warning")
    setMessage("Are you sure?")
    setCancelable(false)
}

// With builders
val list = mutableListOf<Int>().apply {
    add(1)
    add(2)
    add(3)
}

// With configuration
val server = Server().apply {
    host = "localhost"
    port = 8080
    timeout = 5000
}
```

### also

```kotlin
// also — side effect, returns original object
val person = Person("Alice", 30).also {
    println("Created: $it")
}

// Logging in chains
listOf(1, 2, 3)
    .also { println("Before filter: $it") }
    .filter { it > 1 }
    .also { println("After filter: $it") }
    .map { it * 2 }
    .also { println("After map: $it") }
```

### Choosing Scope Functions

```kotlin
// Null check -> let
nullable?.let { process(it) }

// Configure object -> apply
val obj = MyClass().apply { configure() }

// Side effect -> also
val result = compute().also { log(it) }

// Group operations -> with / run
with(obj) { op1(); op2(); op3() }
```

### takeIf and takeUnless

```kotlin
// takeIf — returns receiver if predicate is true, else null
val email: String? = input.takeIf { it.contains("@") }

// takeUnless — returns receiver if predicate is false, else null
val nonNull: String? = input.takeUnless { it.isBlank() }

// Useful for filtering and chaining
val file = File("data.txt")
    .takeIf { it.exists() }
    ?.readText()
    ?.takeIf { it.isNotEmpty() }

// In when expressions
fun classify(x: Int) = when {
    x.takeIf { it > 0 } != null -> "positive"
    x.takeIf { it < 0 } != null -> "negative"
    else -> "zero"
}

// With let for null-safe processing
str.takeIf { it.isNotBlank() }
    ?.let { process(it) }
```

## Type-Safe Builders (DSLs)

```kotlin
// HTML builder example
@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
class HTML {
    var lang: String = "en"
    private val children = mutableListOf<HTMLElement>()

    fun head(block: HEAD.() -> Unit) {
        children.add(HEAD().apply(block))
    }

    fun body(block: BODY.() -> Unit) {
        children.add(BODY().apply(block))
    }

    override fun toString() = "<html lang=\"$lang\">${children.joinToString("")}</html>"
}

@HtmlTagMarker
class HEAD {
    var title: String = ""
    override fun toString() = "<head><title>$title</title></head>"
}

@HtmlTagMarker
class BODY {
    private val elements = mutableListOf<String>()
    var text: String = ""

    fun p(block: () -> String) {
        elements.add("<p>${block()}</p>")
    }

    override fun toString() = "<body>$text${elements.joinToString("")}</body>"
}

interface HTMLElement

// Usage — DSL style
fun html(block: HTML.() -> Unit): HTML = HTML().apply(block)

val doc = html {
    lang = "en"
    head {
        title = "My Page"
    }
    body {
        text = "Hello"
        p { "Paragraph 1" }
        p { "Paragraph 2" }
    }
}
```

## @DslMarker (Preventing Scope Leakage)

```kotlin
// Without @DslMarker — inner blocks can accidentally access outer receivers
// With @DslMarker — only the innermost receiver is accessible

@DslMarker
annotation class MyDsl

@MyDsl
class Outer {
    fun inner(block: Inner.() -> Unit) { /* ... */ }
    fun outerMethod() { /* ... */ }
}

@MyDsl
class Inner {
    fun innerMethod() { /* ... */ }
}

// With @DslMarker, inside Inner block you CANNOT call outerMethod()
// This prevents accidental access to outer scope
```

## Lambda with Receiver

```kotlin
// Function type with receiver: String.() -> Int
// Inside the lambda, 'this' is the receiver (String)

val length: String.() -> Int = { this.length }
"hello".length()  // 5

// Standard library example: buildString
val result = buildString {
    append("Hello")
    append(", ")
    append("World")
}  // "Hello, World"

// buildString signature:
// public inline fun buildString(builderAction: StringBuilder.() -> Unit): String

// Custom builder with receiver
fun <T> T.applyIf(condition: Boolean, block: T.() -> T): T {
    return if (condition) block() else this
}

val config = Config().applyIf(enableFeature) {
    feature = true
    this
}
```

## Infix Functions for DSLs

```kotlin
// Infix enables natural DSL syntax
infix fun <T> T.into(list: MutableList<T>): MutableList<T> {
    list.add(this)
    return list
}

val result = mutableListOf<Int>()
1 into result
2 into result
3 into result
// result = [1, 2, 3]

// 'to' for pairs
val map = mapOf(
    "key1" to "value1",
    "key2" to "value2"
)
```

## Property Delegation

### Standard Delegates

```kotlin
import kotlin.properties.Delegates
import kotlin.lazy

class Config {
    // lazy — initialized on first access, thread-safe by default
    val database by lazy {
        Database.connect()
    }

    // observable — notified on change
    var count by Delegates.observable(0) { _, old, new ->
        println("count: $old -> $new")
    }

    // vetoable — can reject changes
    var age by Delegates.vetoable(0) { _, old, new ->
        new in 0..150  // only accept valid ages
    }

    // notNull — throws if accessed before set
    var name: String by Delegates.notNull()
}
```

### Custom Property Delegate

```kotlin
import kotlin.reflect.KProperty

class TrimmedDelegate(initialValue: String) {
    private var value = initialValue.trim()

    operator fun getValue(thisRef: Any?, property: KProperty<*>): String = value

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        this.value = value.trim()
    }
}

class User {
    var name: String by TrimmedDelegate("  Alice  ")
}

val user = User()
println(user.name)  // "Alice" (trimmed)
user.name = "  Bob  "
println(user.name)  // "Bob" (trimmed)
```

### Map-Backed Properties

```kotlin
class Config(map: Map<String, Any?>) {
    val host: String by map
    val port: Int by map
    val debug: Boolean by map
}

val config = Config(
    mapOf(
        "host" to "localhost",
        "port" to 8080,
        "debug" to true
    )
)

config.host   // "localhost"
config.port   // 8080
config.debug  // true

// Mutable version
class MutableConfig {
    private val map = mutableMapOf<String, Any?>()
    var host: String by map
    var port: Int by map
}
```

## Delegated Properties with Provider

```kotlin
// Providing a delegate — custom logic for delegate creation
interface ReadOnlyProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
}

interface ReadWriteProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
    operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}

// Using standard library delegates
class AppSettings {
    var theme: String by Delegates.observable("light") { _, _, new ->
        savePreference("theme", new)
    }
}

// Property delegate provider
fun <T> provider(initial: T): ReadWriteProperty<Any?, T> =
    object : ReadWriteProperty<Any?, T> {
        var value = initial
        override fun getValue(thisRef: Any?, property: KProperty<*>) = value
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
            this.value = value
        }
    }
```

### Local Delegated Properties

```kotlin
// Delegate works for local variables too
fun process(input: String) {
    val trimmed by lazy { input.trim() }
    val normalized by Delegates.observable(trimmed) { _, _, new ->
        println("Changed to: $new")
    }
    // trimmed computed only on first access
    // normalized triggers callback on reassignment
}

// Local lazy — useful for expensive computations
fun compute() {
    val result by lazy { expensiveComputation() }
    if (condition) {
        println(result)  // computed here
    }
    // result not computed if condition was false
}
```

### Delegating to Another Property

```kotlin
class MyClass {
    @Deprecated("Use newName instead")
    var oldName: String by this::newName

    var newName: String = "initial"
}

// oldName reads/writes are forwarded to newName
val obj = MyClass()
obj.oldName = "updated"
println(obj.newName)  // "updated"

// Useful for renaming properties while maintaining backward compatibility
```

### Property Delegate Requirements

```kotlin
// ReadOnlyProperty<T> — for val delegates
// ReadWriteProperty<T> — for var delegates

// provideDelegate operator — intercept delegate creation
fun <T> myDelegate(initial: T): ReadWriteProperty<Any?, T> {
    return object : ReadWriteProperty<Any?, T> {
        var value = initial
        override fun getValue(thisRef: Any?, property: KProperty<*>) = value
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
            this.value = value
        }
    }
}

// provideDelegate — called at property initialization, not on each get/set
operator fun <T> myDelegate(initial: T).provideDelegate(
    thisRef: Any?,
    property: KProperty<*>
): ReadWriteProperty<Any?, T> {
    // Validate property name, check context, etc.
    return this
}
```

## Extension Function Resolution

```kotlin
// Member functions always win over extension functions
class Foo {
    fun bar() = "member"
}

fun Foo.bar() = "extension"

Foo().bar()  // "member" — member always wins

// Extensions are resolved statically (not virtual)
open class Base
class Derived : Base()

fun Base.foo() = "base"
fun Derived.foo() = "derived"

val obj: Base = Derived()
obj.foo()  // "base" — extension resolved by compile-time type

// Nullable receiver vs non-null: non-null wins
fun String.extension() = "non-null"
fun String?.extension() = "nullable"

"hello".extension()  // "non-null"
```

## This Expressions (Qualified and Implicit)

**Docs:** https://kotlinlang.org/docs/this-expressions.html

```kotlin
// this refers to the current receiver
class MyClass {
    val value = 42

    fun showThis() {
        println(this)        // MyClass instance
        println(this.value)  // 42
    }
}

// In extension functions — this is the receiver
fun String.shout(): String {
    return this.uppercase()  // this is the String
}

// Qualified this — access outer scope's this
class Outer {
    val outerValue = 10

    inner class Inner {
        val innerValue = 20

        fun showBoth() {
            println(this)           // Inner instance
            println(this@Outer)     // Outer instance
            println(innerValue)     // 20
            println(outerValue)     // 10 (implicit this@Outer)
            println(this@Outer.outerValue)  // 10 (explicit)
        }
    }
}

// Qualified this in lambda with receiver
class Builder {
    fun add(s: String) = this
}

fun build(action: Builder.() -> Unit): Builder {
    return Builder().apply(action)
}

// In a lambda with receiver, this is the receiver
build {
    this.add("a")   // this is Builder
    add("b")        // implicit this.add("b")
}

// Nested lambda receivers — use labels to disambiguate
fun nestedExample() {
    val sb = StringBuilder()
    with(sb) {
        append("outer")
        with("inner") {
            // this is String "inner"
            // this@with is StringBuilder
            this@with.append(this)  // appends "inner" to sb
        }
    }
}

// Implicit this — member vs extension
class Container {
    fun process() = "member"
}

fun Container.process() = "extension"

fun Container.test() {
    // this.process() calls member (members always win)
    // but if a closer-scope function shadows it:
    process()  // calls member process()
}

// this in companion object
class Foo {
    companion object {
        val value = 100

        fun show() {
            println(this)          // Companion object
            println(this@Foo)      // ERROR — no enclosing Foo instance
            println(value)         // 100
        }
    }
}
```
