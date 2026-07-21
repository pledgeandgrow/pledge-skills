# Concurrency

Async/await, Tasks, Actors, Sendable, and complete concurrency checking in Swift.

## Async/await

### Async functions

```swift
func fetchUserID(from server: String) async -> Int {
    if server == "primary" {
        return 97
    }
    return 501
}

// Calling async functions
func fetchUser() async {
    let userID = await fetchUserID(from: "primary")
    print("User ID: \(userID)")
}
```

### Async sequences

```swift
// Conforming to AsyncSequence
struct Counter: AsyncSequence {
    let howHigh: Int

    struct AsyncIterator: AsyncIteratorProtocol {
        let howHigh: Int
        var current = 0

        mutating func next() async -> Int? {
            guard current < howHigh else { return nil }
            current += 1
            return current
        }
    }

    func makeAsyncIterator() -> AsyncIterator {
        return AsyncIterator(howHigh: howHigh)
    }
}

// Using async sequence
for await i in Counter(howHigh: 3) {
    print(i)  // 1, 2, 3
}
```

### Parallel execution with async let

```swift
func fetchImage() async -> UIImage { /* ... */ }
func fetchThumbnail() async -> UIImage { /* ... */ }

async let image = fetchImage()
async let thumbnail = fetchThumbnail()
let (resolvedImage, resolvedThumbnail) = await (image, thumbnail)
```

### Task groups

```swift
let userIDs = await withTaskGroup(of: Int.self) { group in
    for server in ["primary", "secondary", "development"] {
        group.addTask {
            await fetchUserID(from: server)
        }
    }
    var results: [Int] = []
    for await result in group {
        results.append(result)
    }
    return results
}
```

### Throwing task groups

```swift
let images = try await withThrowingTaskGroup(of: UIImage.self) { group in
    for url in imageUrls {
        group.addTask {
            try await fetchImage(from: url)
        }
    }
    var collected: [UIImage] = []
    for try await image in group {
        collected.append(image)
    }
    return collected
}
```

## Tasks

```swift
// Creating a task
let task = Task<Int, Error> {
    try await fetchUserID(from: "primary")
}

// Awaiting the result
do {
    let result = try await task.value
    print("Result: \(result)")
} catch {
    print("Error: \(error)")
}

// Task cancellation
task.cancel()
print("Task cancelled: \(task.isCancelled)")

// Checking for cancellation
let task2 = Task {
    for i in 1...100 {
        try Task.checkCancellation()
        try await Task.sleep(nanoseconds: 1_000_000_000)
        print(i)
    }
}

// Task priority
Task(priority: .high) { /* ... */ }
Task(priority: .low) { /* ... */ }
Task(priority: .userInitiated) { /* ... */ }
Task(priority: .background) { /* ... */ }

// Unstructured tasks
Task.detached(priority: .background) {
    // Not inheriting actor context
    await doWork()
}

// Task.sleep
try await Task.sleep(nanoseconds: 1_000_000_000)  // 1 second
try await Task.sleep(for: .seconds(1))  // Swift 5.9+
```

## Actors

Actors protect their mutable state from data races — only one task accesses their state at a time.

```swift
actor Temperature {
    var degrees: Double

    init(degrees: Double) {
        self.degrees = degrees
    }

    func update(to degrees: Double) {
        self.degrees = degrees
    }

    func convert(to scale: String) -> Double {
        switch scale {
        case "F": return degrees * 9 / 5 + 32
        case "K": return degrees + 273.15
        default: return degrees
        }
    }
}

let temp = Temperature(degrees: 25.0)
await temp.update(to: 30.0)
let fahrenheit = await temp.convert(to: "F")
```

### Actor isolation

```swift
actor BankAccount {
    private var balance: Decimal = 0

    func deposit(_ amount: Decimal) {
        balance += amount
    }

    func withdraw(_ amount: Decimal) throws {
        guard balance >= amount else {
            throw BankError.insufficientFunds
        }
        balance -= amount
    }

    func getBalance() -> Decimal {
        return balance
    }
}

// All access to actor properties must be async
let account = BankAccount()
await account.deposit(100.0)
let balance = await account.getBalance()
```

### nonisolated

```swift
actor Counter {
    private var count = 0

    nonisolated let id: UUID  // Accessible without await

    init() {
        self.id = UUID()
    }

    func increment() {
        count += 1
    }

    nonisolated func description() -> String {
        return "Counter \(id)"
    }
}

let counter = Counter()
print(counter.id)  // No await needed
print(counter.description())  // No await needed
await counter.increment()  // await needed
```

### Global actors

```swift
@MainActor
class ViewModel: ObservableObject {
    @Published var data: [String] = []

    func fetchData() async {
        // Runs on main actor
        data = await fetchFromNetwork()
    }
}

// MainActor for UI updates
@MainActor
func updateUI() {
    // Guaranteed to run on main thread
}

// Calling from non-main context
Task { @MainActor in
    await updateUI()
}
```

## Sendable

`Sendable` marks types that are safe to pass across concurrency boundaries.

```swift
// Sendable struct (value type with Sendable properties)
struct User: Sendable {
    let id: Int
    let name: String
}

// Sendable enum
enum Status: Sendable {
    case active
    case inactive
}

// Actor types are implicitly Sendable
actor BankAccount { /* ... */ }

// Classes can be Sendable if final and all properties are immutable
final class ImmutableUser: Sendable {
    let id: Int
    let name: String
    init(id: Int, name: String) {
        self.id = id
        self.name = name
    }
}

// @unchecked Sendable — when you guarantee thread safety manually
class ThreadSafeCounter: @unchecked Sendable {
    private var count = 0
    private let lock = NSLock()

    func increment() {
        lock.lock()
        count += 1
        lock.unlock()
    }
}
```

## Async/Await with existing APIs

### Bridging completion handlers

```swift
// Existing completion handler API
func fetchImage(from url: String, completion: @escaping (UIImage?, Error?) -> Void) {
    // ...
}

// Wrapping with withCheckedContinuation
func fetchImage(from url: String) async throws -> UIImage {
    try await withCheckedThrowingContinuation { continuation in
        fetchImage(from: url) { image, error in
            if let image = image {
                continuation.resume(returning: image)
            } else if let error = error {
                continuation.resume(throwing: error)
            } else {
                continuation.resume(throwing: URLError(.unknown))
            }
        }
    }
}

// Non-throwing version
func fetchValue() async -> Int {
    await withCheckedContinuation { continuation in
        getValue { value in
            continuation.resume(returning: value)
        }
    }
}
```

## Enabling Complete Concurrency Checking

### Swift 6 language mode

```swift
// In Package.swift
swiftSettings: [
    .swiftLanguageMode(.v6)
]

// Or enable complete concurrency checking (Swift 5.x)
swiftSettings: [
    .enableUpcomingFeature("StrictConcurrency")
]
```

### Data race safety

```swift
// Swift 6 enforces data race safety at compile time
// Mutable shared state must be protected by an actor or use synchronization

// Before (data race in Swift 6):
class Counter {
    var count = 0  // Error in Swift 6: not Sendable
}

// After (actor):
actor Counter {
    var count = 0
    func increment() { count += 1 }
}

// Or use nonisolated(unsafe) with care
class Counter {
    nonisolated(unsafe) var count = 0
}
```

## Structured concurrency patterns

```swift
// Fan-out: parallel tasks
func fetchAllData() async -> [Data] {
    await withTaskGroup(of: Data.self) { group in
        for url in urls {
            group.addTask { await fetch(from: url) }
        }
        var results: [Data] = []
        for await data in group {
            results.append(data)
        }
        return results
    }
}

// Race: first to complete
func fetchFromFastest() async -> Data {
    await withTaskGroup(of: Data?.self) { group in
        group.addTask { try? await fetch(from: "server1") }
        group.addTask { try? await fetch(from: "server2") }
        for await result in group {
            if let data = result {
                group.cancelAll()
                return data
            }
        }
        return Data()
    }
}
```

## Best practices

1. Use `async/await` for all new asynchronous code
2. Use actors to protect shared mutable state
3. Mark types as `Sendable` when safe to share across tasks
4. Use `@MainActor` for UI-related code
5. Use task groups for structured parallel work
6. Use `async let` for simple parallel execution
7. Use `withCheckedContinuation` to bridge completion handlers
8. Prefer structured concurrency (task groups) over unstructured (Task)
9. Handle task cancellation with `Task.checkCancellation()`
10. Enable Swift 6 mode for complete data race safety
