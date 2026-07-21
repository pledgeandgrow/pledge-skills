# Optionals and Error Handling

Optionals, optional chaining, and error handling in Swift.

## Optionals

### Declaration and usage

```swift
// Optional types
var serverResponseCode: Int? = 404
serverResponseCode = nil

var surveyAnswer: String?  // Automatically nil

// Optional from function
let possibleNumber = "123"
let convertedNumber = Int(possibleNumber)  // Int? = Optional(123)

let invalidNumber = "hello"
let invalidConversion = Int(invalidNumber)  // Int? = nil
```

### Optional binding

```swift
// if let
if let actualNumber = Int(possibleNumber) {
    print("The string \"\(possibleNumber)\" has an integer value of \(actualNumber)")
} else {
    print("The string \"\(possibleNumber)\" could not be converted to an integer")
}

// Multiple optional bindings
if let number = Int(possibleNumber), number > 0 {
    print("Positive: \(number)")
}

// Binding multiple optionals
let userAge: Int? = 25
let userName: String? = "Alice"
if let age = userAge, let name = userName {
    print("\(name) is \(age) years old")
}

// guard let for early exit
func greet(person: [String: String]) {
    guard let name = person["name"] else {
        return
    }
    print("Hello \(name)")
}
```

### Implicitly unwrapped optionals

```swift
let assumedString: String! = "An implicitly unwrapped optional string"
print(assumedString)  // No need to unwrap

// Still can be nil
let possibleString: String! = nil
// print(possibleString)  // Runtime error if accessed when nil

// Can still use optional binding
if let definiteString = assumedString {
    print(definiteString)
}
```

### Nil-coalescing operator

```swift
let defaultColorName = "red"
var userDefinedColorName: String?
let colorName = userDefinedColorName ?? defaultColorName  // "red"
```

### Optional chaining

```swift
// Property access
let john = Person()
if let roomCount = john.residence?.numberOfRooms {
    print("Has \(roomCount) rooms")
}

// Method call
john.residence?.printNumberOfRooms()

// Subscript
if let firstRoom = john.residence?[0].name {
    print(firstRoom)
}

// Multiple levels
let street = john.residence?.address?.streetName

// Optional chaining on optional methods
let upper = john.residence?.address?.buildingIdentifier()?.uppercased()
```

### Optional pattern matching

```swift
let someValue: Int? = 42

// if case .some
if case .some(let value) = someValue {
    print("Got \(value)")
}

// if case let
if case let value? = someValue {
    print("Got \(value)")
}

// In switch
switch someValue {
case .some(let value):
    print("Value is \(value)")
case .none:
    print("No value")
}
```

### Map and flatMap on optionals

```swift
let possibleNumber: Int? = 42

// map transforms the wrapped value
let doubled = possibleNumber.map { $0 * 2 }  // Optional(84)

// flatMap prevents double-wrapping
let transformed: Int? = 5
let result = transformed.flatMap { n in
    n > 0 ? Optional(n * 2) : nil
}  // Optional(10)
```

## Error handling

### Representing errors

```swift
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}
throw VendingMachineError.insufficientFunds(coinsNeeded: 5)
```

### Throwing functions

```swift
struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0

    func vend(itemNamed name: String) throws {
        guard let item = inventory[name] else {
            throw VendingMachineError.invalidSelection
        }
        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }
        guard item.price <= coinsDeposited else {
            throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
        }
        coinsDeposited -= item.price
        inventory[name] = (Item(price: item.price, count: item.count - 1))
        print("Dispensing \(name)")
    }
}
```

### Handling errors with do-catch

```swift
let favoriteSnacks = [
    "Alice": "Chips",
    "Bob": "Licorice",
    "Eve": "Pretzels",
]
func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    try vendingMachine.vend(itemNamed: snackName)
}

let machine = VendingMachine()
do {
    try buyFavoriteSnack(person: "Alice", vendingMachine: machine)
} catch VendingMachineError.invalidSelection {
    print("Invalid Selection.")
} catch VendingMachineError.outOfStock {
    print("Out of Stock.")
} catch VendingMachineError.insufficientFunds(let coinsNeeded) {
    print("Insufficient funds. Please insert an additional \(coinsNeeded) coins.")
} catch {
    print("Unexpected error: \(error).")
}
```

### Converting errors to optional values

```swift
// try? — returns nil on error
let x = try? someThrowingFunction()  // Optional result

let y: Int?
do {
    y = try someThrowingFunction()
} catch {
    y = nil
}

// try! — crashes on error (use only when you're certain)
let z = try! someThrowingFunction()  // Force unwrap
```

### Specifying cleanup actions with defer

```swift
func processFile(filename: String) throws {
    if exists(filename) {
        let file = open(filename)
        defer {
            close(file)
        }
        while let line = try file.readline() {
            // Work with the file.
        }
        // close(file) is called here, at end of scope
    }
}

// Multiple defer statements (LIFO order)
func test() {
    defer { print("First defer") }
    defer { print("Second defer") }
    defer { print("Third defer") }
    print("Function body")
}
// Output:
// Function body
// Third defer
// Second defer
// First defer
```

### Error propagation

```swift
// A throwing function can propagate errors
func fetchImage(from url: String) throws -> UIImage {
    // ...
    throw NetworkError.timeout
}

// Propagating through multiple layers
func loadImage(for user: User) throws -> UIImage {
    let url = try getUserAvatarURL(user)
    let image = try fetchImage(from: url)
    return image
}
```

### Custom error types

```swift
// Conforming to LocalizedError for localized descriptions
struct NetworkError: LocalizedError {
    let statusCode: Int
    var errorDescription: String? {
        return "Network error with status code \(statusCode)"
    }
}

// Conforming to Error
struct ValidationError: Error {
    let field: String
    let message: String
}
throw ValidationError(field: "email", message: "Invalid email format")
```

### Result type

```swift
// Using Result for error handling without throw
enum NetworkError: Error {
    case timeout
    case invalidURL
    case noData
}

func fetchData(from url: String) -> Result<Data, NetworkError> {
    // ...
    return .success(data)
    // or
    return .failure(.timeout)
}

// Using Result
switch fetchData(from: "https://example.com") {
case .success(let data):
    print("Got data: \(data.count) bytes")
case .failure(let error):
    print("Error: \(error)")
}

// Result with try
let result = Result { try someThrowingFunction() }
```

## Best practices

1. Use optionals for values that might be absent (not errors)
2. Use error handling for recoverable failures
3. Use `if let` and `guard let` for optional binding
4. Use `try?` when you want to ignore errors (convert to nil)
5. Use `try!` only when you're certain it won't throw
6. Use `defer` for cleanup that must happen regardless of error
7. Prefer specific error cases over generic ones
8. Use associated values in error enums for context
9. Consider `Result` for async APIs that can't use `throws`
10. Document which errors a function can throw
