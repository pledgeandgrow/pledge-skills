# Exceptions & Error Handling

**Docs:** https://kotlinlang.org/docs/exceptions.html

## Throwing Exceptions

```kotlin
// Throw an exception
throw IllegalArgumentException("Invalid argument")

// Throw in an expression
val percentage = if (number in 0..100) number else throw IllegalArgumentException("Must be 0-100")

// Throw with cause
throw IllegalStateException("System in invalid state", cause)
```

## Precondition Functions

```kotlin
// require — throws IllegalArgumentException (for input validation)
fun process(age: Int) {
    require(age >= 0) { "Age must be non-negative" }
    require(age <= 150) { "Age must be realistic" }
}

// check — throws IllegalStateException (for state validation)
fun process() {
    check(isInitialized) { "System not initialized" }
    check(connection.isOpen) { "Connection must be open" }
}

// requireNotNull — throws IllegalArgumentException
fun process(data: String?): String {
    val safe = requireNotNull(data) { "Data must not be null" }
    return safe.uppercase()  // smart cast to non-null
}

// checkNotNull — throws IllegalStateException
fun process(state: State?): State {
    val safe = checkNotNull(state) { "State must be initialized" }
    return safe
}

// error — throws IllegalStateException with message
fun handle(value: Any): String = when (value) {
    is String -> value
    is Int -> value.toString()
    else -> error("Unsupported type: ${value::class}")
}
```

## Try-Catch-Finally

```kotlin
// Basic try-catch
try {
    riskyOperation()
} catch (e: IOException) {
    println("IO error: ${e.message}")
}

// Multiple catch blocks
try {
    parseAndProcess(input)
} catch (e: NumberFormatException) {
    println("Invalid number format")
} catch (e: IllegalArgumentException) {
    println("Invalid argument")
} catch (e: Exception) {
    println("Unexpected error: ${e.message}")
}

// With finally
try {
    openResource()
    useResource()
} catch (e: Exception) {
    handleError(e)
} finally {
    // Always executes (even if return or throw in try/catch)
    closeResource()
}

// try is an expression
val result: String = try {
    riskyOperation()
} catch (e: Exception) {
    "fallback"
}

// Nothing type from throw
val value = try {
    compute()
} catch (e: Exception) {
    throw RuntimeException("Failed", e)  // returns Nothing
}
```

## Custom Exceptions

```kotlin
// Custom exception class
class ValidationException(message: String, val field: String) : Exception(message)

// With cause
class DatabaseException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)

// Sealed exception hierarchy
sealed class AppError(message: String) : Exception(message)
class NotFoundError(val resource: String) : AppError("Not found: $resource")
class UnauthorizedError(val userId: String) : AppError("Unauthorized: $userId")
class ValidationError(val field: String, val reason: String) : AppError("Invalid $field: $reason")

// Usage
fun findUser(id: String): User {
    return repository.findById(id)
        ?: throw NotFoundError("user:$id")
}

// Catching specific custom exceptions
try {
    findUser("123")
} catch (e: NotFoundError) {
    println("Missing: ${e.resource}")
} catch (e: AppError) {
    println("App error: ${e.message}")
}
```

## The Nothing Type

```kotlin
// Nothing — a type that has no instances, represents "never returns"
// Functions that always throw return Nothing

fun fail(message: String): Nothing {
    throw IllegalStateException(message)
}

fun infiniteLoop(): Nothing {
    while (true) { /* ... */ }
}

// Nothing is a subtype of all types
// This enables using fail() in expressions
val name: String = maybeName ?: fail("Name required")
// If fail() returns Nothing, it's assignable to any type

// TODO() returns Nothing
fun notImplemented(): String = TODO("Implement this")

// return, break, continue also have type Nothing
val result = when (x) {
    1 -> "one"
    2 -> "two"
    else -> throw IllegalArgumentException("Unknown")  // Nothing
}
```

## Exception Hierarchy

```
Throwable
├── Error (should not be caught)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
├── Exception
│   ├── RuntimeException
│   │   ├── NullPointerException
│   │   ├── IllegalArgumentException
│   │   │   └── NumberFormatException
│   │   ├── IllegalStateException
│   │   ├── IndexOutOfBoundsException
│   │   │   └── ArrayIndexOutOfBoundsException
│   │   ├── ClassCastException
│   │   ├── UnsupportedOperationException
│   │   └── ArithmeticException
│   ├── IOException
│   │   ├── FileNotFoundException
│   │   └── ...
│   └── ...
```

## Try as Expression

```kotlin
// try-catch returns a value
val number: Int = try {
    "42".toInt()
} catch (e: NumberFormatException) {
    0
}

// In when branches
val result = when {
    input.isEmpty() -> 0
    else -> try {
        input.toInt()
    } catch (e: NumberFormatException) {
        -1
    }
}
```

## Resource Management (use)

```kotlin
// use — auto-close resource (like Java try-with-resources)
File("data.txt").bufferedReader().use { reader ->
    val content = reader.readText()
    println(content)
}  // reader.close() called automatically

// use returns the lambda result
val content = File("data.txt").bufferedReader().use { it.readText() }

// Works with any Closeable/AutoCloseable
connection.use { conn ->
    conn.executeQuery("SELECT * FROM users")
}
```

## Exception Interoperability

### Java Interop

```kotlin
// Kotlin doesn't have checked exceptions
// Java checked exceptions can be caught but aren't enforced

// @Throws — declare for Java callers
@Throws(IOException::class)
fun readFile(path: String): String {
    return File(path).readText()
}
// Java: try { readFile("file.txt"); } catch (IOException e) { ... }

// Catching Java checked exceptions
try {
    javaMethod()
} catch (e: java.io.IOException) {
    // OK — can catch even though not declared
}
```

### Swift/Objective-C Interop

```kotlin
// Kotlin exceptions are mapped to NSError in Swift
// @Throws annotation specifies which exceptions map to NSError

@Throws(MyException::class)
fun riskyOperation() {
    throw MyException("Something went wrong")
}
// Swift: do { try riskyOperation() } catch { ... }
```

## Best Practices

```kotlin
// 1. Use precondition functions for validation
fun process(data: String) {
    require(data.isNotBlank()) { "Data cannot be blank" }
    require(data.length <= 100) { "Data too long" }
}

// 2. Use specific exception types
throw IllegalArgumentException("...")  // not just Exception("...")

// 3. Don't catch Throwable or Error
// Bad: catch (e: Throwable) — catches OutOfMemoryError
// Good: catch (e: Exception)

// 4. Use sealed exception hierarchies for domain errors
sealed class DomainError : Exception()
class NotFoundError : DomainError()
class ValidationError : DomainError()

// 5. Use use() for resource management
resource.use { /* ... */ }

// 6. Prefer Result for recoverable errors
fun parseUser(json: String): Result<User> = runCatching {
    Json.decodeFromString<User>(json)
}

// 7. Don't ignore exceptions
// Bad: catch (e: Exception) { } — swallows error
// Good: catch (e: Exception) { logger.error("Failed", e) }
```
