# Value and Reference Types

Understanding value types, reference types, and when to use each in Swift.

## Value types

Value types are copied when they are assigned, passed to a function, or modified. Each instance keeps a unique copy of its data.

```swift
// Structs, enums, and tuples are value types
struct Point {
    var x: Double
    var y: Double
}

var p1 = Point(x: 1, y: 2)
var p2 = p1      // Copy
p2.x = 10
print(p1.x)      // 1 (unchanged)
print(p2.x)      // 10

// Arrays, dictionaries, sets, strings are value types
var array1 = [1, 2, 3]
var array2 = array1
array2.append(4)
print(array1)    // [1, 2, 3] (unchanged)
print(array2)    // [1, 2, 3, 4]
```

## Reference types

Reference types share a single instance. When assigned or passed, a reference to the same instance is used.

```swift
// Classes are reference types
class SharedBox {
    var value: Int
    init(value: Int) { self.value = value }
}

var box1 = SharedBox(value: 1)
var box2 = box1   // Same reference
box2.value = 10
print(box1.value) // 10 (changed — same instance)
print(box2.value) // 10
```

## Key differences

| Aspect | Value types | Reference types |
|--------|------------|-----------------|
| Copy behavior | Copied on assignment | Shared reference |
| Mutability | `var` for mutable, `let` for immutable | `let` only locks reference, not properties |
| Memory | Stack (usually) | Heap |
| Identity | No identity (value equality) | Has identity (===) |
| Inheritance | No inheritance | Supports inheritance |
| `deinit` | No `deinit` | Has `deinit` |
| Multithreading | Safe by default (no shared state) | Needs synchronization |

## Local reasoning

Value types enable **local reasoning** — you can understand a piece of code without looking at the rest of the program. With reference types, any part of the program that holds a reference can mutate the shared state.

```swift
// Value type — easy to reason about
struct Counter {
    private(set) var count = 0
    mutating func increment() { count += 1 }
}
var counter = Counter()
counter.increment()
// counter.count is 1 — no other code can change it

// Reference type — harder to reason about
class SharedCounter {
    var count = 0
    func increment() { count += 1 }
}
let shared = SharedCounter()
// Any code with a reference to `shared` can mutate `count`
```

## Choosing value or reference types

### Use value types when:

1. **Comparing instances with `==` makes sense**
   ```swift
   struct Point: Equatable {
       var x: Double, y: Double
   }
   // Two points are equal if their coordinates match
   ```

2. **You want copies to have independent state**
   ```swift
   // Each copy of a config struct is independent
   struct Config {
       var enabled: Bool
       var timeout: Int
   }
   ```

3. **Properties are themselves value types**
   ```swift
   struct Rectangle {
       var origin: Point    // Value type
       var size: Size       // Value type
   }
   ```

4. **No inheritance is needed**

5. **The type is simple data**

### Use reference types when:

1. **Identity matters more than equality**
   ```swift
   // Two different database connections are never "equal"
   class DatabaseConnection { /* ... */ }
   ```

2. **Shared mutable state is needed**
   ```swift
   // Shared cache accessed from multiple places
   class Cache { /* ... */ }
   ```

3. **Inheritance is needed**
   ```swift
   class Animal { /* ... */ }
   class Dog: Animal { /* ... */ }
   ```

4. **Lifecycle management via `deinit`**
   ```swift
   class FileHandle {
       let fd: Int32
       deinit { close(fd) }
   }
   ```

5. **Objective-C interop is required**

## Composing value types

### Nesting value types

```swift
struct Address {
    var street: String
    var city: String
    var zipCode: String
}

struct Person {
    var name: String
    var age: Int
    var address: Address  // Nested value type
}

var person = Person(
    name: "Alice",
    age: 30,
    address: Address(street: "123 Main St", city: "Springfield", zipCode: "12345")
)
var copy = person
copy.address.street = "456 Oak Ave"
print(person.address.street)  // "123 Main St" (unchanged)
```

### Value types containing reference types

```swift
// Be careful — reference type inside value type breaks value semantics
struct ImageCache {
    var cache: NSCache = NSCache()  // Reference type inside struct

    // Mutations to cache affect all "copies"
    mutating func store(_ image: UIImage, for key: String) {
        cache.setObject(image, forKey: key as NSString)
    }
}
```

## Collections are value types

Swift's `Array`, `Dictionary`, and `Set` are value types with **copy-on-write** optimization:

```swift
var original = [1, 2, 3]
var copy = original  // No copy yet — shares storage

copy.append(4)       // Now a copy is made
print(original)      // [1, 2, 3]
print(copy)          // [1, 2, 3, 4]

// This is efficient — copies are only made when mutation occurs
```

## Copy-on-write

```swift
// String uses copy-on-write
var str1 = "Hello"
var str2 = str1  // Shares storage

str2 += " World"  // Now copies
print(str1)       // "Hello"
print(str2)       // "Hello World"

// Data also uses copy-on-write
var data1 = Data([1, 2, 3])
var data2 = data1  // Shares storage
data2.append(4)    // Now copies
```

## When value types contain reference types

If you need a value type that contains a reference type, you can maintain value semantics by:
1. Using `NSCopying` protocol
2. Implementing `copy()` manually
3. Using a protocol abstraction

```swift
struct Document: Codable {
    var title: String
    var data: Data  // Data is a value type with COW

    // This maintains value semantics because Data is a value type
}

// If you must use a reference type inside a value type:
struct SafeContainer {
    private var _reference: SomeClass

    var value: SomeClass {
        get { _reference }
        set { _reference = newValue.copy() as! SomeClass }  // Defensive copy
    }
}
```

## Best practices

1. **Default to structs** — use value types unless you have a specific reason for reference types
2. **Make value types `Equatable`** when comparison makes sense
3. **Use `let` for immutable value type instances** — prevents accidental mutation
4. **Be aware of reference types inside value types** — they break value semantics
5. **Leverage copy-on-write** — Swift collections are efficient even though they're value types
6. **Use classes for model objects with identity** (e.g., database records with IDs)
7. **Use structs for data transfer objects** (DTOs, configuration, state)
8. **Consider `final class`** if you need reference semantics but not inheritance
9. **Test value semantics** — verify that copies are independent
10. **Document when you mix value and reference types** — make the semantics explicit
