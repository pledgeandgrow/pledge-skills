# Java Interoperability

**Docs:** https://kotlinlang.org/docs/java-interop.html | https://kotlinlang.org/docs/java-to-kotlin-idioms-strings.html | https://kotlinlang.org/docs/java-to-kotlin-collections-guide.html | https://kotlinlang.org/docs/java-to-kotlin-nullability-guide.html

## Calling Java from Kotlin

```kotlin
// Java class
// public class JavaUtils {
//     public static String greet(String name) { return "Hello, " + name; }
//     public int compute(int x, int y) { return x + y; }
// }

// Kotlin usage — seamless
val greeting = JavaUtils.greet("Kotlin")
val result = JavaUtils().compute(3, 4)
```

### Getters and Setters

```kotlin
// Java:
// public class Person {
//     public String getName() { return name; }
//     public void setName(String name) { this.name = name; }
//     public boolean isActive() { return active; }
// }

// Kotlin — accessed as properties
val person = Person()
val name = person.name       // calls getName()
person.name = "Alice"        // calls setName()
val active = person.isActive // calls isActive()
```

### Void and Unit

```kotlin
// Java void methods return Unit in Kotlin
// public void doSomething() { ... }
javaObj.doSomething()  // returns Unit
```

### Escaping Java Identifiers

```kotlin
// Java keywords that are not Kotlin keywords
// If Java method is named "is" or "in"
javaObj.`is`()
javaObj.`in`()
```

## Calling Kotlin from Java

```kotlin
// Kotlin file
// File: Utils.kt
fun topLevelFunction(x: Int): Int = x * 2

// Java — accessed via UtilsKt class
// int result = UtilsKt.topLevelFunction(5);

// @JvmName — customize the generated class name
@file:JvmName("MathUtils")
fun multiply(a: Int, b: Int): Int = a * b
// Java: MathUtils.multiply(2, 3)
```

### @JvmStatic

```kotlin
class Logger {
    companion object {
        @JvmStatic
        fun log(message: String) {
            println(message)
        }
    }
}
// Java: Logger.log("message")  // instead of Logger.Companion.log()
```

### @JvmField

```kotlin
class Config {
    companion object {
        @JvmField
        val MAX_CONNECTIONS = 100
    }
}
// Java: Config.MAX_CONNECTIONS  // direct field access, no getter

// Also on properties
class User(@JvmField val name: String)
```

### @JvmOverloads

```kotlin
// Generate overloaded methods for default parameters
@JvmOverloads
fun configure(host: String, port: Int = 8080, timeout: Int = 5000): Config {
    return Config(host, port, timeout)
}
// Java sees:
// configure(String host)
// configure(String host, int port)
// configure(String host, int port, int timeout)
```

### @Throws

```kotlin
// Declare checked exceptions for Java callers
@Throws(IOException::class)
fun readFile(path: String): String {
    return File(path).readText()
}
// Java: try { readFile("file.txt"); } catch (IOException e) { ... }
```

## Collection Interop

```kotlin
// Java collections are mutable in Kotlin
// Java: List<String> -> Kotlin: MutableList<String!>

// Kotlin read-only -> Java mutable (unsafe but works)
val kotlinList: List<String> = listOf("a", "b", "c")
javaMethod(kotlinList)  // Java sees List<String>

// Convert between types
val javaList = ArrayList<String>(kotlinList)  // Java ArrayList
val backToKotlin = javaList.toList()           // Kotlin read-only

// Mutable to Java
val mutable = mutableListOf(1, 2, 3)
javaMethod(mutable)  // Java can modify it
```

### Collection Mapping

| Kotlin | Java |
|--------|------|
| `List<T>` | `List<? extends T>` |
| `MutableList<T>` | `List<T>` |
| `Set<T>` | `Set<? extends T>` |
| `MutableSet<T>` | `Set<T>` |
| `Map<K, V>` | `Map<K, ? extends V>` |
| `MutableMap<K, V>` | `Map<K, V>` |

## Nullability (Platform Types)

```kotlin
// Java return types have unknown nullability — platform type (String!)
val fromJava: String = javaObj.getName()  // may be null at runtime!
val safe: String? = javaObj.getName()     // treat as nullable

// JSpecify (Kotlin 2.x) — improved null safety
// @Nullable String -> String?
// @NonNull String -> String
// Unannotated -> depends on JSpecify mode

// Always handle Java return values explicitly
val name: String? = javaObj.getName() ?: "Unknown"
```

## Key Differences: Java vs Kotlin

### Strings

```kotlin
// Java: String concatenation
// String result = "Hello, " + name + "!";

// Kotlin: String templates
val result = "Hello, $name!"

// Java: String.equals()
// if (str1.equals(str2)) { ... }

// Kotlin: == (structural equality)
if (str1 == str2) { ... }

// Java: StringBuilder
// StringBuilder sb = new StringBuilder();

// Kotlin: buildString
val result = buildString {
    append("Hello")
    append(", ")
    append("World")
}
```

### Collections

```kotlin
// Java: new ArrayList<>()
// List<String> list = new ArrayList<>();

// Kotlin: mutableListOf()
val list = mutableListOf<String>()

// Java: Collections.unmodifiableList(list)
// Kotlin: list.toList() (read-only view)

// Java: stream().filter().map().collect()
// Kotlin: list.filter { }.map { }
```

### Nullability

```kotlin
// Java: Optional<String>
// if (optional.isPresent()) { optional.get() }

// Kotlin: String?
val value: String? = getValue()
value?.let { /* non-null */ }

// Java: if (str != null) { str.length() }
// Kotlin: smart cast
if (str != null) {
    str.length  // smart cast to non-null
}

// Java: Objects.requireNonNull(obj)
// Kotlin: obj!! or requireNotNull(obj)
```

### Classes

```kotlin
// Java: POJO with getters/setters/equals/hashCode/toString
// public class User { ... 50+ lines of boilerplate ... }

// Kotlin: data class
data class User(val id: Long, val name: String, val email: String)

// Java: singleton pattern
// public class Singleton { private static Singleton instance; ... }

// Kotlin: object
object Singleton {
    fun doSomething() { ... }
}

// Java: static methods
// public class Utils { public static int add(int a, int b) { ... } }

// Kotlin: top-level functions or companion object
fun add(a: Int, b: Int): Int = a + b
// or
class Utils {
    companion object {
        fun add(a: Int, b: Int): Int = a + b
    }
}
```

### Control Flow

```kotlin
// Java: switch statement
// switch (x) { case 1: ... break; default: ... }

// Kotlin: when expression
val result = when (x) {
    1 -> "one"
    else -> "other"
}

// Java: ternary operator
// String s = condition ? "yes" : "no";

// Kotlin: if expression
val s = if (condition) "yes" else "no"
```

## JSpecify Support (Kotlin 2.x)

```kotlin
// JSpecify provides type-use nullability annotations for Java
// Enable in gradle.properties:
// kotlin.jSpecify.enabled=true

// Java with JSpecify:
// public @Nullable String getName() { ... }
// public @NonNull String getRequired() { ... }

// Kotlin sees:
val name: String? = javaObj.getName()       // @Nullable -> String?
val required: String = javaObj.getRequired() // @NonNull -> String

// Generic type nullability
// Java: List<@Nullable String>
// Kotlin: List<String?>
```

## Migration Strategies

### File-by-File

1. Start with leaf classes (no dependencies on other Java files)
2. Use `Convert Java File to Kotlin File` in IntelliJ IDEA
3. Fix nullability issues after conversion
4. Gradually convert dependent files

### Mixed Project

```kotlin
// Kotlin and Java can coexist in the same project
// build.gradle.kts
sourceSets {
    main {
        java.srcDirs("src/main/java", "src/main/kotlin")
    }
}

// Kotlin can call Java and vice versa
// No special configuration needed
```

### Common Pitfalls

```kotlin
// 1. Platform types — always annotate nullability
val name: String? = javaObj.getName()  // safe

// 2. Checked exceptions — use @Throws for Java callers
@Throws(IOException::class)
fun readFile(path: String): String = File(path).readText()

// 3. Default parameters — use @JvmOverloads for Java callers
@JvmOverloads
fun configure(host: String = "localhost", port: Int = 8080) { ... }

// 4. Static access — use @JvmStatic or @JvmField
companion object {
    @JvmStatic fun create() = MyClass()
    @JvmField val VERSION = "1.0"
}

// 5. Lambda interop — SAM conversion
// Java interface: interface Callback { void onClick(int id); }
// Kotlin:
javaObj.setCallback { id -> println("Clicked: $id") }  // SAM conversion
```

### Java Object Methods

```kotlin
// getClass() — use ::class.java
val obj = JavaClass()
val javaClass = obj::class.java  // equivalent to obj.getClass()

// clone() — implement Cloneable, call super.clone()
class MyCloneable : Cloneable {
    override fun clone(): MyCloneable {
        return super.clone() as MyCloneable
    }
}

// finalize() — use @Throws and override
class Resource {
    @Throws(Throwable::class)
    protected fun finalize() {
        // cleanup code
    }
}

// wait()/notify() — available on java.lang.Object
// Use synchronized blocks for inter-thread communication
val lock = java.lang.Object()
synchronized(lock) {
    lock.wait()
    lock.notify()
}
```

### Using JNI with Kotlin

```kotlin
// external function declaration — same as Java native methods
external fun nativeMethod(input: String): Int

// Load native library in companion object
class NativeLib {
    companion object {
        init {
            System.loadLibrary("mynativelib")
        }
    }

    external fun process(data: ByteArray): ByteArray
}
```

### Using Lombok-generated Declarations in Kotlin

```kotlin
// If a Java class uses Lombok @Getter/@Setter/@Data,
// Kotlin can access them as properties (via synthetic property references)

// Java: @Data class User { private String name; private int age; }
// Kotlin:
val user = User()
user.name  // calls getName()
user.age   // calls getAge()
user.name = "Alice"  // calls setName()

// Lombok @Builder — call as a regular function
// Java: User.builder().name("Alice").age(30).build();
// Kotlin:
val built = User.builder().name("Alice").age(30).build()

// Note: configure kotlin compiler plugin for better Lombok support
// See build-tools.md > Compiler Plugins > Lombok
```
