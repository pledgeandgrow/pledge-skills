# Memory Safety and ARC

Automatic Reference Counting, ownership, and memory safety in Swift.

## Automatic Reference Counting (ARC)

ARC automatically manages memory by tracking references to class instances and deallocating them when no longer needed.

### How ARC works

```swift
class Person {
    let name: String
    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }
    deinit {
        print("\(name) is being deinitialized")
    }
}

var reference1: Person?
var reference2: Person?
var reference3: Person?

reference1 = Person(name: "John Appleseed")  // "John Appleseed is being initialized"
reference2 = reference1
reference3 = reference1

reference1 = nil
reference2 = nil
reference3 = nil  // "John Appleseed is being deinitialized" (last reference removed)
```

### Strong reference cycles

```swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment?
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    var tenant: Person?
    deinit { print("Apartment \(unit) is being deinitialized") }
}

var john: Person?
var unit4A: Apartment?

john = Person(name: "John Appleseed")
unit4A = Apartment(unit: "4A")

john!.apartment = unit4A
unit4A!.tenant = john  // Strong reference cycle!

john = nil
unit4A = nil
// Neither is deallocated — memory leak!
```

### Weak references

```swift
class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    weak var tenant: Person?  // Weak — doesn't keep person alive
    deinit { print("Apartment \(unit) is being deinitialized") }
}

// Now when john is set to nil, Person is deallocated
john = nil  // "John Appleseed is being deinitialized"
// apartment.tenant automatically becomes nil
```

### Unowned references

```swift
class Customer {
    let name: String
    var card: CreditCard?
    init(name: String) { self.name = name }
    deinit { print("\(name) is being deinitialized") }
}

class CreditCard {
    let number: UInt
    unowned let customer: Customer  // Unowned — not optional, doesn't keep alive
    init(number: UInt, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    deinit { print("Card #\(number) is being deinitialized") }
}

var john: Customer?
john = Customer(name: "John Appleseed")
john!.card = CreditCard(number: 1234_5678_9012_3456, customer: john!)
john = nil  // Both are deallocated
```

### Unowned optional references

```swift
class Department {
    var name: String
    var courses: [Course]
    init(name: String) { self.name = name; self.courses = [] }
}

class Course {
    var name: String
    unowned var department: Department
    unowned var nextCourse: Course?
    init(name: String, in department: Department) {
        self.name = name
        self.department = department
    }
}

// unowned optional — the reference can be nil, but if set, won't be nil
// Use when the referenced object has a shorter or equal lifetime
```

### Strong reference cycles with closures

```swift
class HTMLElement {
    let name: String
    let text: String?

    lazy var asHTML: () -> String = {
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }

    init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
    }
    deinit { print("\(name) is being deinitialized") }
}

// This creates a strong reference cycle (closure captures self)
```

### Weak self in closures

```swift
class HTMLElement {
    let name: String
    let text: String?

    lazy var asHTML: () -> String = { [weak self] in
        guard let self = self else { return "" }
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }
    // ...
}
```

### Unowned self in closures

```swift
// Use unowned when self will always outlive the closure
class DataModel {
    var data: [String] = []

    lazy var processor: () -> Void = { [unowned self] in
        // self is guaranteed to be alive
        print("Processing \(self.data.count) items")
    }
}
```

### Capture lists

```swift
// Capture list syntax
{ [weak self, unowned delegate, explicitValue = someValue] in
    // ...
}
```

## Ownership (Swift 5.9+)

### `consume` operator

```swift
// Transfer ownership without copying
func process(_ array: [Int]) {
    // ...
}

var data = [1, 2, 3, 4, 5]
process(consume data)  // data is consumed — can't be used after
// print(data)  // Error: data was consumed
```

### `borrowing` parameters

```swift
// Borrow a value without taking ownership
func printLength(_ array: borrowing [Int]) {
    print("Length: \(array.count)")
}
// Caller retains ownership, array is not copied
```

### `consuming` parameters

```swift
// Take ownership of the parameter
func process(_ array: consuming [Int]) -> [Int] {
    return array.map { $0 * 2 }
}
// Caller gives up ownership
```

### `noncopyable` types (Swift 5.9+)

```swift
// Types that can't be copied — unique ownership
struct FileHandle: ~Copyable {
    private let fd: Int32

    init(fd: Int32) { self.fd = fd }

    deinit {
        close(fd)
    }

    consuming func close() {
        // File is closed and handle is consumed
    }
}

let handle = FileHandle(fd: open("file.txt", O_RDONLY))
// handle can't be copied — only one owner
```

## Memory safety

### Exclusive access to memory

```swift
// Swift enforces exclusive access to mutable memory
var stepSize = 1

func increment(_ number: inout Int) {
    number += stepSize  // Error: conflicting access to stepSize
}

increment(&stepSize)

// Solution: make a copy
func incrementSafe(_ number: inout Int, step: Int) {
    number += step
}
incrementSafe(&stepSize, step: stepSize)
```

### Conflicting access in methods

```swift
struct Player {
    var name: String
    var health: Int
    var energy: Int

    mutating func restoreHealth() {
        // ...
    }

    // Conflicting access
    func shareHealth(with teammate: inout Player) {
        balance(&teammate.health, &health)  // OK — different instances
    }
}

var player = Player(name: "Alice", health: 10, energy: 20)
player.shareHealth(with: &player)  // Error: conflicting access
```

### Conflicting access in closures

```swift
func increment(_ x: inout Int) {
    // ...
}

// A closure captures and mutates a variable
func stepCounter() {
    var stepSize = 1
    func incrementAndPrint() {
        increment(&stepSize)  // Captures stepSize
        print(stepSize)
    }
    incrementAndPrint()
}
```

## Best practices

1. Use `weak` for references that can become nil (delegate pattern)
2. Use `unowned` for references that will never be nil and have equal/shorter lifetime
3. Use `[weak self]` in closures that might create retain cycles
4. Use `[unowned self]` when self is guaranteed to outlive the closure
5. Use `consume` to transfer ownership of large values
6. Use `borrowing` for parameters you only read
7. Use `~Copyable` for resources that must have unique ownership
8. Avoid strong reference cycles between classes
9. Be aware of exclusive access rules with `inout` parameters
10. Use `deinit` for cleanup — it's called before deallocation
