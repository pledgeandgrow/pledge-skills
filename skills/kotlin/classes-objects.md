# Classes & Objects

**Docs:** https://kotlinlang.org/docs/classes.html | https://kotlinlang.org/docs/inheritance.html | https://kotlinlang.org/docs/interfaces.html | https://kotlinlang.org/docs/data-classes.html | https://kotlinlang.org/docs/sealed-classes.html | https://kotlinlang.org/docs/object-declarations.html

## Class Declaration

```kotlin
// Basic class with primary constructor and properties
class Person(val name: String, var age: Int)

// With class body
class Person(val name: String, var age: Int) {
    fun greet() = "Hi, I'm $name"
}

// Create instance — no 'new' keyword
val person = Person("Alice", 30)
person.name  // "Alice"
person.age   // 30
person.greet()  // "Hi, I'm Alice"
```

## Constructors

### Primary Constructor

```kotlin
// Primary constructor in class header
class User(val name: String, val email: String)

// With initializer block (init)
class User(name: String, email: String) {
    val name: String
    val email: String

    init {
        // Validation
        require(name.isNotBlank()) { "Name cannot be blank" }
        require(email.contains("@")) { "Invalid email" }
        this.name = name.trim()
        this.email = email.lowercase()
    }
}

// init blocks can access primary constructor parameters
class Person(fullName: String) {
    val firstName = fullName.substringBefore(" ")
    val lastName = fullName.substringAfter(" ", "")

    init {
        println("Created: $firstName $lastName")
    }
}
```

### Secondary Constructors

```kotlin
class User(val name: String, val email: String) {
    // Secondary constructor must delegate to primary
    constructor(name: String) : this(name, "$name@example.com")

    constructor() : this("Unknown", "unknown@example.com")
}

User("Alice", "alice@mail.com")  // primary
User("Bob")                      // secondary -> email: "bob@example.com"
User()                           // secondary -> name: "Unknown"
```

### Default Values in Constructor

```kotlin
class Server(
    val host: String = "localhost",
    val port: Int = 8080,
    val secure: Boolean = false
)

Server()                              // localhost:8080, not secure
Server("example.com")                 // example.com:8080
Server(port = 443, secure = true)     // localhost:443, secure
```

## Properties

```kotlin
class Person(name: String) {
    // Read-only property
    val name: String = name

    // Mutable property
    var age: Int = 0

    // Computed property (getter only)
    val isAdult: Boolean
        get() = age >= 18

    // Custom getter and setter
    var email: String = ""
        get() = field  // 'field' refers to backing field
        set(value) {
            field = value.lowercase().trim()
        }

    // Late-initialized property (must be var, non-null)
    lateinit var service: UserService

    // Lazy property (initialized on first access)
    val database by lazy {
        connectToDatabase()
    }
}
```

### Property Modifiers

```kotlin
class Example {
    // Visible but not settable from outside
    var count: Int = 0
        private set

    // Const (compile-time, must be primitive or String)
    companion object {
        const val MAX_SIZE = 100
    }

    // Top-level constant
    // const val VERSION = "2.0"  // at file level
}
```

### Explicit Backing Fields

```kotlin
// Explicit backing field — expose read-only externally, mutable internally
class ShoppingCart {
    val items: List<String> get() = _items
    private val _items = mutableListOf<String>()

    // Using explicit backing field syntax (Kotlin 2.0+)
    // The backing field is inferred from the initializer
    // val products: List<String> = mutableListOf()
    //     // compiler smart-casts to MutableList<String> inside the class
    //     // but exposes List<String> externally

    fun add(item: String) {
        _items.add(item)  // mutable access internally
    }

    fun remove(item: String) {
        _items.remove(item)
    }
}

// Limitations of explicit backing fields:
// - Must be val (read-only)
// - Cannot have custom getter
// - Cannot be open
// - Cannot be delegated
// - Cannot be compile-time constant
// - Backing field type must be subtype of property type
// - Backing field must have private visibility
```

### Backing Properties

```kotlin
// Backing property pattern — use when explicit backing fields don't fit
// (e.g., when you need a custom getter)
class UserDirectory {
    // Private backing property (convention: underscore prefix)
    private val _users = mutableListOf<User>()

    // Public read-only property with custom logic
    val users: List<User>
        get() = _users.sortedBy { it.name }

    fun addUser(user: User) {
        _users.add(user)
    }
}

// Convention: name backing properties with leading underscore
// See coding conventions: https://kotlinlang.org/docs/coding-conventions.html
```

## Inheritance

```kotlin
// Classes are final by default — use 'open' to allow inheritance
open class Animal(val name: String) {
    open fun sound(): String = "Some sound"

    open val legs: Int = 4
}

class Dog(name: String) : Animal(name) {
    override fun sound(): String = "Woof"
    override val legs: Int = 4
}

class Cat(name: String) : Animal(name) {
    override fun sound(): String = "Meow"
    final override val legs: Int = 4  // prevent further override
}

// Calling super
class Puppy(name: String) : Dog(name) {
    override fun sound(): String {
        val parent = super.sound()  // "Woof"
        return "$parent (puppy)"
    }
}
```

## Interfaces

```kotlin
interface Clickable {
    fun click()
    fun show() = println("Showing")  // default implementation
}

interface Focusable {
    fun setFocus(focused: Boolean)
    fun show() = println("Focusable show")  // default implementation
}

// Implement multiple interfaces
class Button : Clickable, Focusable {
    override fun click() = println("Clicked")
    override fun setFocus(focused: Boolean) = println("Focus: $focused")

    // Resolve conflict — must override when multiple defaults
    override fun show() {
        super<Clickable>.show()  // call specific interface default
        super<Focusable>.show()
    }
}
```

### Interface Properties

```kotlin
interface Named {
    val name: String          // must be overridden
    val displayName: String   // can have default
        get() = name
}

class File(val path: String) : Named {
    override val name: String = path.substringAfterLast("/")
}
```

## Abstract Classes

```kotlin
abstract class Shape {
    abstract fun area(): Double
    abstract fun perimeter(): Double

    // Non-abstract method
    fun describe(): String = "Area: ${area()}, Perimeter: ${perimeter()}"
}

class Circle(val radius: Double) : Shape() {
    override fun area() = Math.PI * radius * radius
    override fun perimeter() = 2 * Math.PI * radius
}

class Rectangle(val width: Double, val height: Double) : Shape() {
    override fun area() = width * height
    override fun perimeter() = 2 * (width + height)
}
```

## Data Classes

```kotlin
// Automatically generates: equals, hashCode, toString, copy, componentN
data class User(val id: Long, val name: String, val email: String)

val user = User(1, "Alice", "alice@mail.com")

// toString — readable output
println(user)  // User(id=1, name=Alice, email=alice@mail.com)

// equals — structural comparison
val user2 = User(1, "Alice", "alice@mail.com")
user == user2  // true

// copy — create copy with modified properties
val updated = user.copy(email = "alice@newmail.com")
// User(id=1, name=Alice, email=alice@newmail.com)

// Destructuring — componentN functions
val (id, name, email) = user
println("$id, $name, $email")  // 1, Alice, alice@mail.com
```

### Data Class Restrictions

- Must have at least one primary constructor parameter
- All primary constructor parameters must be `val` or `var`
- Cannot be `abstract`, `open`, `sealed`, or `inner`
- Auto-generated functions only use primary constructor properties

### Properties in Class Body

```kotlin
// Properties in body are NOT included in equals/hashCode/toString/copy
data class User(val id: Long, val name: String) {
    var lastLogin: Long = 0  // excluded from generated methods
    val isActive: Boolean get() = lastLogin > 0  // excluded
}

val u1 = User(1, "Alice")
val u2 = User(1, "Alice")
u1.lastLogin = 1000
u2.lastLogin = 2000
u1 == u2  // true — body properties not compared
```

### Standard Data Classes

```kotlin
// Pair — built-in 2-tuple
val pair = "key" to "value"  // Pair<String, String>
val (k, v) = pair  // destructuring

// Triple — built-in 3-tuple
val triple = Triple(1, "two", 3.0)
val (a, b, c) = triple

// Pair and Triple are data classes
// with component1(), component2(), (component3())
```

## Sealed Classes

```kotlin
// Restricted class hierarchies — all subclasses known at compile time
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val cause: Throwable? = null) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Exhaustive when — compiler knows all cases
fun handleResult(result: Result<String>): String = when (result) {
    is Result.Success -> "Got: ${result.data}"
    is Result.Error -> "Error: ${result.message}"
    Result.Loading -> "Loading..."
}  // no else needed — all cases covered

// Sealed interfaces (Kotlin 1.5+)
sealed interface Event {
    data class Click(val x: Int, val y: Int) : Event
    data class Scroll(val delta: Int) : Event
    object Idle : Event
}

// Sealed class rules:
// - All subclasses must be in the same module (same compilation unit)
// - In KMP: subclasses can be in different source sets within same module
// - Constructors are protected by default
// - Can be abstract but cannot be instantiated directly
// - Subclasses can be data classes, objects, or regular classes

// Sealed interface use cases:
// - Restricted interface implementations
// - Can be implemented by enums, classes, objects, or other sealed types
// - Exhaustive when works with sealed interfaces too

// State management pattern
sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}
```

## Enum Classes

```kotlin
enum class Direction {
    NORTH, SOUTH, EAST, WEST
}

// With properties and methods
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF);

    fun isWarm() = this == RED
}

Color.RED.rgb      // 0xFF0000
Color.RED.isWarm() // true
Color.RED.name     // "RED"
Color.RED.ordinal  // 0

// Iterate
for (color in Color.entries) println(color)

// Value of
val color = Color.valueOf("RED")  // Color.RED

// With abstract methods
enum class Planet(val gravity: Double) {
    EARTH(9.81) { override fun describe() = "Home" },
    MARS(3.71) { override fun describe() = "Red planet" },
    JUPITER(24.79) { override fun describe() = "Gas giant" };

    abstract fun describe(): String
}

// Enum constants in when
fun handle(dir: Direction) = when (dir) {
    Direction.NORTH -> "Up"
    Direction.SOUTH -> "Down"
    Direction.EAST -> "Right"
    Direction.WEST -> "Left"
}

// entries (Kotlin 1.9+) vs values() (legacy)
val allColors = Color.entries     // List<Color> — efficient, returns same list
val allColorsArr = Color.values() // Array<Color> — creates new array each call

// Generic enum access via reified functions
inline fun <reified T : Enum<T>> printAll() {
    enumValues<T>().forEach { println(it) }      // legacy — creates new array
    enumEntries<T>().forEach { println(it) }     // preferred — returns same list
}

// enumValueOf — generic valueOf
inline fun <reified T : Enum<T>> safeValueOf(name: String): T? =
    try { enumValueOf<T>(name) } catch (e: IllegalArgumentException) { null }

// Enum implementing interface
interface Printable { fun print(): String }

enum class Shape : Printable {
    CIRCLE { override fun print() = "○" },
    SQUARE { override fun print() = "□" },
    TRIANGLE { override fun print() = "△" };
}

// Enum constants with anonymous classes (override base methods)
enum class HttpStatus(val code: Int) {
    OK(200) {
        override fun isSuccess() = true
        override fun description() = "Success"
    },
    NOT_FOUND(404) {
        override fun isSuccess() = false
        override fun description() = "Not Found"
    },
    SERVER_ERROR(500) {
        override fun isSuccess() = false
        override fun description() = "Internal Server Error"
    };

    abstract fun isSuccess(): Boolean
    abstract fun description(): String
}

// Enum implements Comparable by default (natural order = declaration order)
HttpStatus.OK < HttpStatus.NOT_FOUND  // true (ordinal 0 < 1)

// valueOf throws if name not found
// Color.valueOf("PURPLE")  // IllegalArgumentException
```

## Object Declarations (Singletons)

```kotlin
// Singleton — only one instance
object Database {
    private val data = mutableMapOf<String, Any>()

    fun put(key: String, value: Any) {
        data[key] = value
    }

    fun get(key: String): Any? = data[key]
}

Database.put("user", "Alice")
Database.get("user")  // "Alice"
```

## Companion Objects

```kotlin
class Logger {
    companion object {
        const val LEVEL_DEBUG = 0
        const val LEVEL_INFO = 1

        fun create(): Logger = Logger()

        private var instanceCount = 0
        fun instanceCount() = instanceCount
    }

    fun log(message: String) {
        println("[LOG] $message")
    }
}

// Access static-like members
Logger.LEVEL_INFO       // 1
Logger.create()         // Logger instance
Logger.instanceCount()  // 0

// Companion object can implement interface
interface Factory<T> {
    fun create(): T
}

class Product {
    companion object : Factory<Product> {
        override fun create() = Product()
    }
}

Product.create()  // Product instance
```

## Object Expressions (Anonymous)

```kotlin
// Anonymous object — like Java anonymous class
val runnable = object : Runnable {
    override fun run() {
        println("Running")
    }
}

// Can extend multiple interfaces
val handler = object : Clickable, Focusable {
    override fun click() = println("Clicked")
    override fun setFocus(focused: Boolean) = println("Focused: $focused")
}

// Object without supertype
val adHoc = object {
    val x = 10
    val y = 20
    fun sum() = x + y
}
adHoc.sum()  // 30
```

## Nested and Inner Classes

```kotlin
// Nested class (static by default — no reference to outer)
class Outer {
    val outerProp = "outer"

    class Nested {
        fun greet() = "Hello from nested"
        // Cannot access outerProp — no implicit reference
    }
}

Outer.Nested().greet()  // "Hello from nested"

// Inner class — has reference to outer instance
class Outer2 {
    val outerProp = "outer"

    inner class Inner {
        fun accessOuter() = outerProp  // can access outer members
        fun outerRef() = this@Outer2
    }
}

val outer = Outer2()
outer.Inner().accessOuter()  // "outer"

// Nested interfaces — all combinations possible
class Container {
    interface Builder {
        fun build(): Container
    }
}

interface Repository {
    interface Factory {
        fun create(): Repository
    }
    // Interface nested in interface
    interface Query { fun execute(): Result }
}

// Anonymous inner class via object expression
val runnable = object : Runnable {
    override fun run() { println("Running") }
}

// Anonymous Java SAM interface via lambda
val callable: java.util.concurrent.Callable<String> = Callable { "result" }
```

## Delegation

### Class Delegation

```kotlin
interface Repository {
    fun getById(id: Int): String
    fun getAll(): List<String>
}

class SqlRepository : Repository {
    override fun getById(id: Int) = "SQL item $id"
    override fun getAll() = listOf("item1", "item2")
}

// Delegate implementation to another object
class CachedRepository(private val source: Repository) : Repository by source {
    private val cache = mutableMapOf<Int, String>()

    override fun getById(id: Int): String {
        return cache.getOrPut(id) { source.getById(id) }
    }
}

val repo = CachedRepository(SqlRepository())
repo.getById(1)  // "SQL item 1" (cached after first call)
```

### Property Delegation

```kotlin
import kotlin.properties.Delegates

class Config {
    // Lazy — initialized on first access
    val heavyValue by lazy { computeExpensiveValue() }

    // Observable — called on change
    var count by Delegates.observable(0) { _, old, new ->
        println("Changed: $old -> $new")
    }

    // Vetoable — can reject changes
    var score by Delegates.vetoable(0) { _, old, new ->
        new in 0..100  // only accept 0-100
    }

    // Map-backed properties
    private val props = mapOf("name" to "Kotlin", "version" to "2.4.0")
    val name by props
    val version by props
}
```

## Destructuring Declarations

```kotlin
// For data classes
data class Point(val x: Int, val y: Int)
val (x, y) = Point(10, 20)
println("$x, $y")  // 10, 20

// For pairs
val (key, value) = "key" to "value"

// In loops
for ((index, value) in list.withIndex()) {
    println("$index: $value")
}

// In map iteration
for ((key, value) in map) {
    println("$key = $value")
}

// Underscore for unused components
val (_, email) = getUser()

// In lambda parameters
map.mapValues { (key, value) -> "$key: $value" }
```

## Visibility Modifiers

| Modifier | Top-level | Member |
|----------|-----------|--------|
| `public` (default) | Visible everywhere | Visible everywhere |
| `private` | Visible in same file | Visible in same class |
| `protected` | N/A | Visible in same class + subclasses |
| `internal` | Visible in same module | Visible in same module |

```kotlin
internal class InternalService {
    private val secret = "private"
    protected val shared = "protected"
    internal val moduleVisible = "internal"
    public val everyone = "public"
}

// Private constructor — restrict instantiation
class Secret private constructor(val key: String) {
    companion object {
        fun create(key: String): Secret {
            require(key.length == 32) { "Key must be 32 chars" }
            return Secret(key)
        }
    }
}

// Sealed class constructors are protected by default
sealed class Result {
    class Success(val data: String) : Result()
    class Error(val message: String) : Result()
}

// Outer class cannot see private members of inner classes
class Outer {
    inner class Inner {
        private val hidden = "secret"
    }
    // Cannot access Inner().hidden — outer can't see inner's private
}

// Modules (for internal visibility):
// - IntelliJ IDEA module
// - Maven project
// - Gradle source set (test can access internal of main)
// - Kotlin/Native compilation target

// Local declarations cannot have visibility modifiers
fun example() {
    // private val x = 1  // ERROR — local vars can't have visibility
    val x = 1  // OK
}
```

## Inline Value Classes

```kotlin
// Value class — wraps a single value, no runtime overhead (no allocation)
@JvmInline
value class UserId(val value: Long)

@JvmInline
value class Email(val value: String) {
    // Can have members
    val domain get() = value.substringAfter("@")
    fun isValid() = value.contains("@")
}

// Usage — type-safe without boxing overhead
fun findUser(id: UserId) = User(id)
findUser(UserId(123L))

// Value classes vs type aliases
// Type alias: typealias UserId = Long  — no type safety (Long and UserId interchangeable)
// Value class: distinct type, compiler prevents mixing

// Value class with generic (since Kotlin 1.9.20)
@JvmInline
value class Box<T>(val value: T)

// Restrictions:
// - Must have exactly one val parameter in primary constructor
// - Cannot be abstract, open, sealed, or inner
// - Can implement interfaces (with limitations)
// - Underlying type cannot be nullable

// Implementing interface
interface Printable {
    fun print(): String
}

@JvmInline
value class Name(val value: String) : Printable {
    override fun print() = "Name: $value"
}
```

## Data Objects

```kotlin
// data object — like data class but for singleton objects
// Auto-generates toString(), equals(), hashCode()
data object AppConfig {
    const val VERSION = "2.4.0"
    val isDebug = false
}

// toString() is generated
println(AppConfig)  // AppConfig (not the default object toString)

// equals/hashCode compare by identity (same as regular object)
AppConfig === AppConfig  // true

// Useful for sealed hierarchies
sealed class ApiResult {
    data object Loading : ApiResult()
    data object Empty : ApiResult()
    data class Success(val data: String) : ApiResult()
    data class Error(val message: String) : ApiResult()
}

// In when expressions — clean toString for debugging
fun handle(result: ApiResult) = when (result) {
    ApiResult.Loading -> "Loading..."
    ApiResult.Empty -> "No data"
    is ApiResult.Success -> "Got: ${result.data}"
    is ApiResult.Error -> "Error: ${result.message}"
}
```
