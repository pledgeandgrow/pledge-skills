# Protocols and Generics

Protocols, generics, opaque types, and boxed types in Swift.

## Protocols

### Protocol definition

```swift
protocol SomeProtocol {
    var mustBeSettable: Int { get set }
    var doesNotNeedToBeSettable: Int { get }
}

protocol AnotherProtocol: SomeProtocol {
    static var someTypeProperty: Int { get }
    func someTypeMethod()
}

// Property requirements
protocol FullyNamed {
    var fullName: String { get }
}

struct Person: FullyNamed {
    var fullName: String
}
let john = Person(fullName: "John Appleseed")

class Starship: FullyNamed {
    var prefix: String?
    var name: String
    init(name: String, prefix: String? = nil) {
        self.name = name
        self.prefix = prefix
    }
    var fullName: String {
        return (prefix != nil ? prefix! + " " : "") + name
    }
}
```

### Method requirements

```swift
protocol RandomNumberGenerator {
    func random() -> Double
}

class LinearCongruentialGenerator: RandomNumberGenerator {
    var lastRandom = 42.0
    let m = 139968.0
    let a = 3877.0
    let c = 29573.0
    func random() -> Double {
        lastRandom = ((lastRandom * a + c) % m)
        return lastRandom / m
    }
}
```

### Mutating method requirements

```swift
protocol Togglable {
    mutating func toggle()
}

enum OnOffSwitch: Togglable {
    case off, on
    mutating func toggle() {
        switch self {
        case .off: self = .on
        case .on: self = .off
        }
    }
}
var lightSwitch = OnOffSwitch.off
lightSwitch.toggle()  // .on
```

### Initializer requirements

```swift
protocol SomeProtocol {
    init(someParameter: Int)
}

class SomeClass: SomeProtocol {
    required init(someParameter: Int) {
        // initializer implementation
    }
}
```

### Protocols as types

```swift
class Dice {
    let sides: Int
    let generator: RandomNumberGenerator
    init(sides: Int, generator: RandomNumberGenerator) {
        self.sides = sides
        self.generator = generator
    }
    func roll() -> Int {
        return Int(generator.random() * Double(sides)) + 1
    }
}
let d6 = Dice(sides: 6, generator: LinearCongruentialGenerator())
```

### Protocol inheritance

```swift
protocol PrettyTextRepresentable: TextRepresentable {
    var prettyTextualDescription: String { get }
}
```

### Protocol composition

```swift
// & operator for composing protocols
func celebrate<Name: Named, Birthday: Born>(for name: Name, on birthday: Birthday) {
    // ...
}

// Protocol composition type
typealias NamedAndAged = Named & Aged

// Using in function parameters
func wishHappyBirthday(to celebrator: Named & Aged) {
    print("Happy birthday, \(celebrator.name), you're \(celebrator.age)!")
}
```

### Checking protocol conformance

```swift
if let objectWithArea = object as? HasArea {
    print("Area is \(objectWithArea.area)")
} else {
    print("Something that doesn't have an area")
}
```

### Optional protocol requirements

```swift
@objc protocol CounterDataSource {
    func increment(forCount count: Int) -> Int
    @objc optional func fixedIncrement() -> Int
}
```

### Protocol extensions

```swift
// Default implementation
extension RandomNumberGenerator {
    func randomBool() -> Bool {
        return random() > 0.5
    }
}

// All conforming types get randomBool()
let generator = LinearCongruentialGenerator()
print("Random boolean: \(generator.randomBool())")

// Adding constraints to protocol extensions
extension Collection where Element: Equatable {
    func allEqual() -> Bool {
        if let firstElem = first {
            return !dropFirst().contains { $0 != firstElem }
        }
        return true
    }
}
```

## Generics

### Generic functions

```swift
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}
var someInt = 3
var anotherInt = 107
swapTwoValues(&someInt, &anotherInt)

var someString = "hello"
var anotherString = "world"
swapTwoValues(&someString, &anotherString)
```

### Generic types

```swift
struct Stack<Element> {
    var items: [Element] = []
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
}
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
let topItem = stackOfStrings.pop()

// Extending a generic type
extension Stack {
    var topItem: Element? {
        return items.last
    }
}
```

### Type constraints

```swift
// Type constraint: T must conform to Equatable
func findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
let doubleIndex = findIndex(of: 9.3, in: [3.14159, 0.1, 0.25])
let stringIndex = findIndex(of: "Andrea", in: ["Mike", "Malcolm", "Andrea"])
```

### Associated types

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}

struct Stack<Element>: Container {
    var items: [Element] = []
    mutating func push(_ item: Element) { items.append(item) }
    mutating func pop() -> Element { return items.removeLast() }

    // Conforming to Container
    typealias Item = Element  // Can be inferred
    mutating func append(_ item: Element) { push(item) }
    var count: Int { return items.count }
    subscript(i: Int) -> Element { return items[i] }
}
```

### Generic where clauses

```swift
func allItemsMatch<C1: Container, C2: Container>(
    _ someContainer: C1, _ anotherContainer: C2
) -> Bool where C1.Item == C2.Item, C1.Item: Equatable {

    if someContainer.count != anotherContainer.count {
        return false
    }
    for i in 0..<someContainer.count {
        if someContainer[i] != anotherContainer[i] {
            return false
        }
    }
    return true
}
```

### Generic subscripts

```swift
struct Matrix<Element> {
    subscript(row: Int, column: Int) -> Element where Element: Numeric {
        get { /* ... */ }
        set { /* ... */ }
    }
}
```

## Opaque types

```swift
// `some` — returns a specific type (hidden from caller)
func makeProtocolContainer<T: Equatable>(item: T) -> some Equatable {
    return [item]
}

// The caller knows it's Equatable but not the exact type
let container = makeProtocolContainer(item: 42)
// container is "some Equatable" — concrete type hidden

// Opaque return types preserve identity
func makeInt() -> some Equatable { return 5 }
func makeString() -> some Equatable { return "hello" }
// These return different opaque types

// Opaque types in protocols
protocol Shape {
    associatedtype Body: Shape
    var body: Body { get }
}

struct ContentView: Shape {
    var body: some Shape {
        return Circle()
    }
}
```

## Boxed types

```swift
// `any` — existential type (type-erased, dynamic dispatch)
// Swift 5.7+ syntax for existential types
protocol Animal {
    func makeSound() -> String
}

struct Dog: Animal {
    func makeSound() -> String { "Woof" }
}

struct Cat: Animal {
    func makeSound() -> String { "Meow" }
}

// any Animal — can hold any Animal type
let animals: [any Animal] = [Dog(), Cat()]
for animal in animals {
    print(animal.makeSound())
}

// some Animal — specific but hidden type
let pet: some Animal = Dog()
print(pet.makeSound())

// Difference:
// some — compile-time known, zero-cost abstraction
// any — runtime dispatch, type-erased, small performance cost
```

## Best practices

1. Use protocols to define interfaces and enable polymorphism
2. Use protocol extensions for default implementations
3. Use protocol composition (`&`) instead of deep inheritance hierarchies
4. Use associated types for flexible protocol design
5. Use generics for type-safe reusable code
6. Prefer `some` over `any` for return types (better performance)
7. Use `any` only when you need to store heterogeneous types
8. Use `where` clauses to add constraints to extensions and functions
9. Conform to protocols via extensions for cleaner organization
10. Use `@objc optional` for optional protocol methods (rarely needed)
