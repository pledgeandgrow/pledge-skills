# Standard Library and Core Libraries

Swift Standard Library, Core Libraries (Foundation, Dispatch, XCTest, Swift Testing).

## Standard Library

The Swift Standard Library provides fundamental types (String, Int, Double, Array, Dictionary, Set, Optional), protocols (Equatable, Hashable, Comparable, Collection), and global functions.

### Core types

```swift
// Strings
let str = "Hello"
str.count
str.uppercased()
str.lowercased()
str.contains("ell")

// Numbers
let int: Int = 42
let double: Double = 3.14
let float: Float = 3.14
let bool: Bool = true

// Collections
let array: [Int] = [1, 2, 3]
let dict: [String: Int] = ["a": 1]
let set: Set<Int> = [1, 2, 3]

// Optionals
let optional: Int? = 42
let value = optional ?? 0
```

### Key protocols

```swift
// Equatable — equality comparison
struct Point: Equatable {
    let x: Double
    let y: Double
    static func == (lhs: Point, rhs: Point) -> Bool {
        return lhs.x == rhs.x && lhs.y == rhs.y
    }
}

// Hashable — usable as dictionary/set key
struct User: Hashable {
    let id: Int
    let name: String
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// Comparable — ordering
struct Version: Comparable {
    let major: Int
    let minor: Int
    static func < (lhs: Version, rhs: Version) -> Bool {
        if lhs.major != rhs.major { return lhs.major < rhs.major }
        return lhs.minor < rhs.minor
    }
}

// CustomStringConvertible — string representation
struct Person: CustomStringConvertible {
    let name: String
    var description: String { return "Person(\(name))" }
}

// Error — error handling
enum MyError: Error { case somethingWrong }
```

### Collection protocols hierarchy

```
Sequence
  └── Collection
       ├── BidirectionalCollection
       │    └── RandomAccessCollection
       ├── MutableCollection
       └── RangeReplaceableCollection
```

### Common standard library types

```swift
// Range types
let closedRange = 1...5      // ClosedRange<Int>
let halfOpenRange = 1..<5    // Range<Int>
let oneSided = 5...           // PartialRangeFrom<Int>

// Result
let result: Result<Int, Error> = .success(42)
switch result {
case .success(let value): print(value)
case .failure(let error): print(error)
}

# Optional<Int>.none
# Optional<Int>.some(42)

// KeyValuePairs (ordered, no hashing)
let pairs: KeyValuePairs = ["a": 1, "b": 2, "c": 3]

# Slice<Array>
let slice = array[1..<3]
```

### Standard Library Preview Package

The [Swift Standard Library Preview Package](https://github.com/swiftlang/swift-standard-library-preview) provides early access to new APIs being considered for the standard library.

```swift
// In Package.swift
.package(url: "https://github.com/swiftlang/swift-standard-library-preview.git", branch: "main")
```

## Foundation

Foundation provides essential data types, utilities, and OS services.

### Data and Date

```swift
import Foundation

// Data
let data = Data([0x48, 0x65, 0x6C, 0x6C, 0x6F])
let string = String(data: data, encoding: .utf8)

// Date
let now = Date()
let tomorrow = now.addingTimeInterval(86400)
let formatter = DateFormatter()
formatter.dateFormat = "yyyy-MM-dd"
formatter.string(from: now)

// DateComponents
var components = DateComponents()
components.year = 2024
components.month = 1
components.day = 15
let calendar = Calendar.current
let date = calendar.date(from: components)

// ISO8601
let isoString = ISO8601DateFormatter().string(from: now)
```

### URL and URLRequest

```swift
import Foundation

let url = URL(string: "https://example.com/api")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = try? JSONSerialization.data(withJSONObject: ["key": "value"])
```

### JSON

```swift
import Foundation

// JSONEncoder / JSONDecoder
struct User: Codable {
    let name: String
    let age: Int
}

// Encode
let user = User(name: "Alice", age: 30)
let jsonData = try JSONEncoder().encode(user)
let jsonString = String(data: jsonData, encoding: .utf8)

// Decode
let decoded = try JSONDecoder().decode(User.self, from: jsonData)

// Custom date decoding
let decoder = JSONDecoder()
decoder.dateDecodingStrategy = .iso8601

// Custom key decoding
decoder.keyDecodingStrategy = .convertFromSnakeCase
```

### ProcessInfo and Bundle

```swift
import Foundation

// Environment
let env = ProcessInfo.processInfo.environment
let args = ProcessInfo.processInfo.arguments

// Bundle
let bundle = Bundle.main
let version = bundle.infoDictionary?["CFBundleShortVersionString"]
let resourcePath = bundle.path(forResource: "config", ofType: "json")
```

### NotificationCenter

```swift
import Foundation

// Post notification
NotificationCenter.default.post(name: .init("MyNotification"), object: nil)

// Observe
let observer = NotificationCenter.default.addObserver(
    forName: .init("MyNotification"),
    object: nil,
    queue: .main
) { notification in
    print("Received: \(notification)")
}

// Remove
NotificationCenter.default.removeObserver(observer)
```

### FileManager

```swift
import Foundation

let fm = FileManager.default

// Paths
let documents = fm.urls(for: .documentDirectory, in: .userDomainMask)[0]
let tempDir = fm.temporaryDirectory

// Create directory
try fm.createDirectory(at: documents.appendingPathComponent("MyFolder"), withIntermediateDirectories: true)

// List directory
let contents = try fm.contentsOfDirectory(atPath: documents.path)

// File exists
let exists = fm.fileExists(atPath: documents.path)

// Read/write
let fileURL = documents.appendingPathComponent("test.txt")
try "Hello".write(to: fileURL, atomically: true, encoding: .utf8)
let content = try String(contentsOf: fileURL, encoding: .utf8)
```

## Dispatch (GCD)

```swift
import Foundation

// DispatchQueue
DispatchQueue.main.async {
    // Main thread
}

DispatchQueue.global(qos: .userInitiated).async {
    // Background work
    DispatchQueue.main.async {
        // Back to main
    }
}

// DispatchGroup
let group = DispatchGroup()
for i in 0..<5 {
    group.enter()
    DispatchQueue.global().async {
        // Work
        group.leave()
    }
}
group.notify(queue: .main) {
    print("All done")
}

// DispatchSemaphore
let semaphore = DispatchSemaphore(value: 3)
semaphore.wait()
// Work
semaphore.signal()

// DispatchOnce (deprecated — use static let)
// Use lazy static instead
```

## XCTest

```swift
import XCTest

class MyTests: XCTestCase {
    func testAddition() {
        XCTAssertEqual(1 + 1, 2)
    }

    func testOptional() {
        let value: Int? = 42
        XCTAssertNotNil(value)
        XCTAssertEqual(value, 42)
    }

    func testThrows() throws {
        let result = try someFunction()
        XCTAssertEqual(result, expected)
    }

    func testAsync() async throws {
        let result = await fetchAsync()
        XCTAssertEqual(result, expected)
    }

    // setUp / tearDown
    override func setUp() {
        // Before each test
    }

    override func tearDown() {
        // After each test
    }
}
```

## Swift Testing (new framework)

```swift
import Testing

@Suite struct MyTests {
    @Test func addition() {
        #expect(1 + 1 == 2)
    }

    @Test func optionalValue() {
        let value: Int? = 42
        #expect(value != nil)
        #expect(value == 42)
    }

    @Test func asyncTest() async {
        let result = await fetchAsync()
        #expect(result == expected)
    }

    @Test(arguments: [1, 2, 3])
    func parameterized(n: Int) {
        #expect(n > 0)
    }
}
```

## Best practices

1. Use `Codable` for JSON encoding/decoding — prefer over manual parsing
2. Use `Date` and `DateFormatter` for date handling — never use raw timestamps
3. Use `URL` instead of raw strings for URLs
4. Use `Data` for binary data
5. Use `FileManager` for file system operations
6. Use `DispatchQueue` for GCD — prefer async/await for new code
7. Use `NotificationCenter` for decoupled communication
8. Prefer Swift Testing (`@Test`, `#expect`) for new test code
9. Use `Codable` with custom strategies for API integration
10. Use `ProcessInfo` for environment-specific behavior
