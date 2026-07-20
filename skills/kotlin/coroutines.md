# Coroutines

**Docs:** https://kotlinlang.org/docs/coroutines-overview.html | https://kotlinlang.org/docs/coroutine-basics.html | https://kotlinlang.org/docs/flows.html | https://kotlinlang.org/docs/channel.md

## Overview

Coroutines are lightweight threads that can suspend (pause) and resume without blocking a thread. They enable asynchronous, non-blocking code in a sequential style.

**Dependency:**
```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    // For Android: kotlinx-coroutines-android
    // For JavaFX: kotlinx-coroutines-javafx
}
```

## Core Concepts

| Concept | Description |
|---------|-------------|
| `suspend` | Marks a function that can pause and resume |
| `CoroutineScope` | Defines the lifecycle and context of coroutines |
| `launch` | Starts a coroutine that doesn't return a result (fire-and-forget) |
| `async` | Starts a coroutine that returns a `Deferred<T>` result |
| `Job` | Tracks a coroutine's lifecycle, enables cancellation |
| `CoroutineDispatcher` | Controls which thread(s) the coroutine runs on |
| `CoroutineContext` | Bundle of Job, Dispatcher, and other elements |

## Suspending Functions

```kotlin
// suspend — can be called only from a coroutine or another suspend function
suspend fun fetchUser(id: String): User {
    delay(500)  // non-blocking delay
    return User(id, "Alice")
}

suspend fun processData(): String {
    val user = fetchUser("123")   // suspends until result ready
    return "Processed: ${user.name}"
}
```

## Coroutine Builders

### launch

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    // launch — fire and forget, returns Job
    val job = launch {
        delay(1000)
        println("Done!")
    }
    job.join()  // wait for completion
}
```

### async

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    // async — returns Deferred<T>
    val deferred = async {
        delay(500)
        42
    }
    val result = deferred.await()  // suspends until result ready
    println(result)  // 42

    // Concurrent execution
    val a = async { computeA() }
    val b = async { computeB() }
    println("${a.await()} + ${b.await()}")  // both run concurrently
}
```

### runBlocking

```kotlin
// runBlocking — bridges blocking code to coroutine world
fun main() = runBlocking {
    // This is a coroutine scope
    delay(1000)
    println("Hello")
}

// With timeout
fun main() = runBlocking {
    withTimeout(3000) {
        repeat(10) { i ->
            delay(500)
            println("Step $i")
        }
    }
}
```

## CoroutineScope

```kotlin
// Custom scope
val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

scope.launch {
    // runs in IO dispatcher
}

scope.cancel()  // cancel all coroutines in scope

// Structured concurrency — child coroutines
fun main() = runBlocking {
    launch {
        delay(1000)
        println("Child 1")
    }
    launch {
        delay(500)
        println("Child 2")
    }
    // Parent waits for all children
}
```

## Dispatchers

```kotlin
// Dispatchers control where coroutines run
launch(Dispatchers.Main) {        // UI thread (Android/JavaFX)
    updateUI()
}

launch(Dispatchers.IO) {          // I/O operations (network, file)
    val data = fetchData()
}

launch(Dispatchers.Default) {     // CPU-intensive work
    val result = heavyComputation()
}

launch(Dispatchers.Unconfined) {  // No specific thread (runs on caller)
    // Not recommended for general use
}

// Custom dispatcher
val myDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()
launch(myDispatcher) { /* ... */ }
```

### Switching Dispatchers

```kotlin
suspend fun fetchAndShow(): String {
    val data = withContext(Dispatchers.IO) {
        // switch to IO thread
        fetchDataFromNetwork()
    }
    // back on original dispatcher
    return data
}
```

## Job Lifecycle

```kotlin
val job = launch {
    // Active -> Completing -> Completed
    // Active -> Cancelling -> Cancelled
}

job.isActive       // true if still running
job.isCompleted    // true if finished (success or cancel)
job.isCancelled    // true if cancelled

job.join()         // suspend until complete
job.cancel()       // request cancellation
job.cancelAndJoin() // cancel and wait
```

## Cancellation

```kotlin
// Cooperative cancellation — check suspend points
val job = launch {
    repeat(1000) { i ->
        delay(100)  // suspension point — checks for cancellation
        println("Step $i")
    }
}
delay(500)
job.cancelAndJoin()

// Explicit cancellation check
launch {
    for (i in 1..1000) {
        ensureActive()  // throws CancellationException if cancelled
        // or:
        yield()  // suspend and check cancellation
        println(i)
    }
}

// Cancellation with cleanup
launch {
    try {
        // work
    } finally {
        // cleanup — always runs on cancellation
        closeResources()
    }
}

// Non-cancellable cleanup
launch {
    try {
        // work
    } finally {
        withContext(NonCancellable) {
            // this block won't be cancelled
            cleanup()
        }
    }
}
```

## Exception Handling

```kotlin
// Exceptions propagate to parent
launch {
    throw RuntimeException("Failed")
    // parent coroutine is cancelled too
}

// SupervisorJob — children fail independently
val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
scope.launch {
    // if this fails, sibling coroutines continue
}

// CoroutineExceptionHandler
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught: $exception")
}
launch(handler) {
    throw RuntimeException("Error")
}

// async — exceptions stored in Deferred
val deferred = async {
    throw RuntimeException("Async error")
}
try {
    deferred.await()
} catch (e: Exception) {
    println("Caught: $e")
}

// supervisorScope — children fail independently within a scope
suspend fun parallelTasks() = supervisorScope {
    val deferred1 = async { task1() }
    val deferred2 = async { task2() }
    try { deferred1.await() } catch (e: Exception) { println("task1 failed: $e") }
    try { deferred2.await() } catch (e: Exception) { println("task2 failed: $e") }
}
```

## Composing Suspending Functions

```kotlin
// Sequential execution (default)
suspend fun loadAll(): Pair<User, Settings> {
    val user = fetchUser()    // suspends, waits for result
    val settings = fetchSettings()  // then suspends
    return user to settings
}

// Parallel with async — both start concurrently
suspend fun loadAllParallel(): Pair<User, Settings> = coroutineScope {
    val deferredUser = async { fetchUser() }
    val deferredSettings = async { fetchSettings() }
    deferredUser.await() to deferredSettings.await()
}

// Structured concurrency — async in coroutineScope
// If one fails, the other is cancelled automatically
suspend fun loadStructured(): Pair<User, Settings> = coroutineScope {
    val deferredUser = async { fetchUser() }
    val deferredSettings = async { fetchSettings() }
    // If fetchUser throws, fetchSettings is cancelled
    deferredUser.await() to deferredSettings.await()
}

// withContext — switch dispatcher for a block
suspend fun saveToDisk(data: String) = withContext(Dispatchers.IO) {
    File("data.txt").writeText(data)
}
```

## Flow

Flow is a cold asynchronous stream — values are produced on collection.

```kotlin
import kotlinx.coroutines.flow.*

// Create a Flow
fun numbers(): Flow<Int> = flow {
    for (i in 1..5) {
        emit(i)
        delay(100)
    }
}

// Collect
fun main() = runBlocking {
    numbers().collect { value ->
        println(value)
    }
}
// Output: 1, 2, 3, 4, 5
```

### Flow Builders

```kotlin
// flow { } — builder with emit
flow {
    emit(1)
    emit(2)
}

// flowOf — fixed values
flowOf(1, 2, 3)

// asFlow — from collection
listOf(1, 2, 3).asFlow()

// channelFlow — can emit from other contexts
channelFlow {
    send(1)
    send(2)
}

// generate
(1..5).asFlow()
```

### Flow Operators

```kotlin
// map — transform
flowOf(1, 2, 3).map { it * 2 }  // 2, 4, 6

// filter
flowOf(1, 2, 3, 4).filter { it > 2 }  // 3, 4

// transform — can emit multiple values
flowOf(1, 2, 3).transform { value ->
    emit(value)
    emit(value * 10)
}  // 1, 10, 2, 20, 3, 30

// take
flowOf(1, 2, 3, 4, 5).take(3)  // 1, 2, 3

// drop
flowOf(1, 2, 3, 4, 5).drop(2)  // 3, 4, 5

// debounce
flow {
    emit(1); delay(100)
    emit(2); delay(200)
    emit(3)
}.debounce(150)  // 2, 3

// distinctUntilChanged
flowOf(1, 1, 2, 2, 3, 1).distinctUntilChanged()  // 1, 2, 3, 1

// flatMapConcat / flatMapMerge / flatMapLatest
flowOf(1, 2, 3).flatMapConcat { flowOf(it, it * 10) }
// 1, 10, 2, 20, 3, 30

// combine — merge two flows
val a = flowOf(1, 2, 3)
val b = flowOf("a", "b", "c")
a.combine(b) { num, str -> "$num$str" }  // "3a", "3b", "3c" (latest values)

// zip — pair values
a.zip(b) { num, str -> "$num$str" }  // "1a", "2b", "3c"

// onEach — side effect
flowOf(1, 2, 3).onEach { println("Emitting $it") }

// onStart / onCompletion / onEmpty
flowOf(1, 2, 3)
    .onStart { println("Starting") }
    .onCompletion { println("Done") }
    .collect { println(it) }
```

### Terminal Flow Operators

```kotlin
// collect — consume
flow.collect { value -> println(value) }

// toList — collect to list
val list = flow.toList()

// first / firstOrNull
val first = flow.first()
val firstMatch = flow.first { it > 2 }

// single / singleOrNull
val single = flow.single()  // exactly one element

// fold
val sum = flow.fold(0) { acc, v -> acc + v }

// reduce
val sum = flow.reduce { acc, v -> acc + v }

// count
val count = flow.count()

// launchIn — collect in a scope (returns Job)
flow.onEach { println(it) }.launchIn(scope)
```

### Flow Error Handling

```kotlin
// retry
flow {
    emit(1)
    throw RuntimeException()
}.retry(3) { e ->
    println("Retrying after: $e")
    true  // retry
}

// catch — catch upstream errors only
flow {
    emit(1)
    throw RuntimeException("Failed")
}.catch { e ->
    emit(-1)  // fallback value
}.collect { println(it) }
// Output: 1, -1
```

### Flow Conflation

```kotlin
// conflate — keep only latest value
flow {
    repeat(10) { emit(it); delay(50) }
}.conflate()
  .collect { value -> delay(100); println(value) }
// Skips intermediate values if collector is slow

// buffer — allow emitter and collector to run concurrently
flow {
    for (i in 1..5) { emit(i); delay(50) }
}.buffer()
  .collect { delay(100); println(it) }
```

## StateFlow

```kotlin
import kotlinx.coroutines.flow.*

// StateFlow — hot, state-holder flow (always has a value)
val state = MutableStateFlow(0)

// Update
state.value = 1
state.update { it + 1 }

// Collect
fun main() = runBlocking {
    state.collect { value ->
        println("State: $value")
    }
}

// In ViewModel (Android)
class MyViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val data = fetchData()
                _uiState.value = UiState.Success(data)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}
```

## SharedFlow

```kotlin
// SharedFlow — hot, broadcast flow (events)
val events = MutableSharedFlow<String>()

// Emit (suspend)
suspend fun emitEvent() {
    events.emit("Click")
}

// TryEmit (non-suspend)
events.tryEmit("Click")

// Collect (multiple collectors receive all events)
fun main() = runBlocking {
    events.onEach { println("Event: $it") }.launchIn(this)
    delay(100)
    events.emit("Hello")
}

// Configure replay (buffer)
val shared = MutableSharedFlow<Int>(replay = 3)  // keep last 3 for new collectors
```

## Channels

```kotlin
import kotlinx.coroutines.channels.*

// Channel — for passing values between coroutines
val channel = Channel<Int>()

launch {
    for (i in 1..5) {
        channel.send(i)
    }
    channel.close()
}

launch {
    for (value in channel) {
        println(value)
    }
}

// Channel types
val rendezvous = Channel<Int>()              // RendezvousChannel (no buffer)
val buffered = Channel<Int>(10)              // buffered with capacity 10
val unlimited = Channel<Int>(Channel.UNLIMITED)
val conflated = Channel<Int>(Channel.CONFLATED)  // keep latest only

// Produce
fun numbers() = produce {
    for (i in 1..5) send(i)
}

fun main() = runBlocking {
    numbers().consumeEach { println(it) }
}
```

## Structured Concurrency

```kotlin
// Parent-child relationship — children inherit context
fun main() = runBlocking {
    // Parent
    launch {
        // Child 1
        launch {
            delay(1000)
            println("Child 1 done")
        }
        // Child 2
        launch {
            delay(500)
            println("Child 2 done")
        }
    }
    // Parent waits for all children to complete
    println("All done")
}

// Cancellation propagates from parent to children
// Exceptions propagate from children to parent (unless SupervisorJob)
```

## withContext

```kotlin
// Switch dispatcher temporarily
suspend fun saveData(data: String) {
    withContext(Dispatchers.IO) {
        // runs on IO thread
        file.writeText(data)
    }
    // back on original dispatcher
}

// withContext returns result
suspend fun compute(): Int = withContext(Dispatchers.Default) {
    heavyComputation()
}
```

## select (Racing)

```kotlin
import kotlinx.coroutines.selects.*

// Select first result from multiple sources
suspend fun fetchFastest(): String {
    val result = select<String> {
        async { fetchFromCache() }.onAwait { "cache: $it" }
        async { fetchFromNetwork() }.onAwait { "network: $it" }
    }
    return result
}
```

## Coroutine Testing

```kotlin
// kotlinx-coroutines-test
dependencies {
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")
}

// runTest — runs coroutines in test without real delays
@Test
fun testFetch() = runTest {
    val result = fetchUser("123")
    assertEquals("Alice", result.name)
}

// Control virtual time
@Test
fun testWithTimeout() = runTest {
    withTimeout(1000) {
        delay(500)
        // no real delay — virtual time
    }
}

// Turbine for Flow testing
@Test
fun testFlow() = runTest {
    flowOf(1, 2, 3).test {
        assertEquals(1, awaitItem())
        assertEquals(2, awaitItem())
        assertEquals(3, awaitItem())
        awaitComplete()
    }
}
```

## Shared Mutable State and Concurrency

**Docs:** https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html

```kotlin
import kotlinx.coroutines.sync.*
import java.util.concurrent.atomic.*

// Problem: race conditions with shared mutable state
var counter = 0
suspend fun unsafeIncrement() {
    repeat(1000) {
        counter++  // NOT thread-safe
    }
}

// Solution 1: Mutex (coroutine-friendly lock)
val mutex = Mutex()
var safeCounter = 0
suspend fun safeIncrement() {
    repeat(1000) {
        mutex.withLock {
            safeCounter++
        }
    }
}

// Solution 2: AtomicInteger / AtomicReference
val atomicCounter = AtomicInteger(0)
suspend fun atomicIncrement() {
    repeat(1000) {
        atomicCounter.incrementAndGet()
    }
}

// Solution 3: Confine to single thread (single-thread dispatcher)
val singleThreadCtx = newSingleThreadContext("counter")
// All coroutines in this context run on the same thread — no races

// Solution 4: Channel/Flow for actor-like pattern
suspend fun counterActor() = actor<Int> {
    var count = 0
    channel.consumeEach { delta ->
        count += delta
    }
}

// Mutex — manual lock/unlock (prefer withLock)
val m = Mutex()
m.lock()
try {
    // critical section
} finally {
    m.unlock()
}

// withLock — auto lock/unlock (preferred)
m.withLock {
    // critical section
}
```
