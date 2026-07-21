# Functions and Closures

Functions, parameters, return types, and closures in Swift.

## Function definitions

```swift
// Basic function
func greet(person: String) -> String {
    return "Hello, \(person)!"
}
print(greet(person: "Anna"))

// Multiple parameters
func greet(person: String, alreadyGreeted: Bool) -> String {
    if alreadyGreeted {
        return greet(person: person)
    } else {
        return "Hello, \(person)!"
    }
}

// No parameters
func printHello() {
    print("Hello, World!")
}

// No return value
func greetAgain(person: String) {
    print("Hello again, \(person)!")
}

// Multiple return values (tuples)
func minMax(array: [Int]) -> (min: Int, max: Int) {
    var currentMin = array[0]
    var currentMax = array[0]
    for value in array[1..<array.count] {
        if value < currentMin { currentMin = value }
        if value > currentMax { currentMax = value }
    }
    return (currentMin, currentMax)
}
let bounds = minMax(array: [8, -6, 2, 109, 3, 71])
print("min is \(bounds.min) and max is \(bounds.max)")

// Optional tuple return
func minMax(array: [Int]) -> (min: Int, max: Int)? {
    if array.isEmpty { return nil }
    // ...
    return (currentMin, currentMax)
}
if let bounds = minMax(array: [8, -6, 2, 109, 3, 71]) {
    print("min is \(bounds.min) and max is \(bounds.max)")
}
```

## Argument labels and parameter names

```swift
// Argument label and parameter name
func greet(person: String, from hometown: String) -> String {
    return "Hello \(person)! Glad you could visit from \(hometown)."
}
print(greet(person: "Bill", from: "Cupertino"))

// Omit argument label (_)
func greet(_ person: String) -> String {
    return "Hello, \(person)!"
}
print(greet("Dave"))

// Default parameter values
func someFunction(parameterWithoutDefault: Int, parameterWithDefault: Int = 12) {
    // ...
}
someFunction(parameterWithoutDefault: 3, parameterWithDefault: 6)
someFunction(parameterWithoutDefault: 3)  // Uses default 12

// Variadic parameters
func arithmeticMean(_ numbers: Double...) -> Double {
    var total: Double = 0
    for number in numbers {
        total += number
    }
    return total / Double(numbers.count)
}
arithmeticMean(1, 2, 3, 4, 5)  // 3.0
arithmeticMean(3, 8.25, 18.75)  // 10.0

// In-out parameters
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}
var someInt = 3
var anotherInt = 107
swapTwoInts(&someInt, &anotherInt)
print("someInt is now \(someInt), anotherInt is now \(anotherInt)")
```

## Function types

```swift
// Function type: (Int, Int) -> Int
func addTwoInts(_ a: Int, _ b: Int) -> Int {
    return a + b
}
func multiplyTwoInts(_ a: Int, _ b: Int) -> Int {
    return a * b
}

// Using function types
var mathFunction: (Int, Int) -> Int = addTwoInts
print("Result: \(mathFunction(2, 3))")  // 5
mathFunction = multiplyTwoInts
print("Result: \(mathFunction(2, 3))")  // 6

// Function as parameter
func printMathResult(_ mathFunction: (Int, Int) -> Int, _ a: Int, _ b: Int) {
    print("Result: \(mathFunction(a, b))")
}
printMathResult(addTwoInts, 3, 5)

// Function as return type
func stepForward(_ input: Int) -> Int { return input + 1 }
func stepBackward(_ input: Int) -> Int { return input - 1 }
func chooseStepFunction(backward: Bool) -> (Int) -> Int {
    return backward ? stepBackward : stepForward
}
```

## Nested functions

```swift
func chooseStepFunction(backward: Bool) -> (Int) -> Int {
    func stepForward(input: Int) -> Int { return input + 1 }
    func stepBackward(input: Int) -> Int { return input - 1 }
    return backward ? stepBackward : stepForward
}
let currentValue = -4
let moveNearerToZero = chooseStepFunction(backward: currentValue > 0)
```

## Closures

Closures are self-contained blocks of functionality that can be passed around.

### Closure expression syntax

```swift
// Sorted with closure
let names = ["Chris", "Alex", "Ewa", "Barry", "Anna"]
let reversed = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})

// Inferring type from context
let reversed2 = names.sorted(by: { s1, s2 in return s1 > s2 })

// Implicit returns from single-expression closures
let reversed3 = names.sorted(by: { s1, s2 in s1 > s2 })

// Shorthand argument names
let reversed4 = names.sorted(by: { $0 > $1 })

// Operator methods
let reversed5 = names.sorted(by: >)
```

### Trailing closures

```swift
// Trailing closure syntax (when closure is last argument)
let reversed = names.sorted { $0 > $1 }

// Multiple trailing closures (Swift 5.3+)
func loadPicture(from server: String, completion: (Picture) -> Void, onFailure: (Error) -> Void) {
    // ...
}
loadPicture(from: "server.com") { picture in
    print("Loaded: \(picture)")
} onFailure: { error in
    print("Error: \(error)")
}
```

### Capturing values

```swift
// Closures capture surrounding state
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let incrementByTen = makeIncrementer(forIncrement: 10)
incrementByTen()  // 10
incrementByTen()  // 20
incrementByTen()  // 30

let incrementBySeven = makeIncrementer(forIncrement: 7)
incrementBySeven()  // 7
incrementByTen()  // 40 (separate captured state)
```

### Closures are reference types

```swift
let alsoIncrementByTen = incrementByTen
alsoIncrementByTen()  // 50
incrementByTen()      // 60 (same captured state)
```

### Escaping closures

```swift
// @escaping — closure stored and called later
var completionHandlers: [() -> Void] = []
func someFunctionWithEscapingClosure(completionHandler: @escaping () -> Void) {
    completionHandlers.append(completionHandler)
}

// Non-escaping (default) — called within function
func someFunctionWithNonescapingClosure(closure: () -> Void) {
    closure()
}
```

### Autoclosures

```swift
// @autoclosure — automatically wraps expression in closure
func serve(customer customerProvider: @autoclosure () -> String) {
    print("Now serving \(customerProvider())!")
}
serve(customer: "Alice")  // No need to pass closure

// @autoclosure @escaping
var customerProviders: [() -> String] = []
func collectCustomerProviders(_ customerProvider: @autoclosure @escaping () -> String) {
    customerProviders.append(customerProvider)
}
collectCustomerProviders("Alice")
```

## Higher-order functions

```swift
let numbers = [1, 2, 3, 4, 5]

// map
let doubled = numbers.map { $0 * 2 }  // [2, 4, 6, 8, 10]
let strings = numbers.map { String($0) }  // ["1", "2", "3", "4", "5"]

// filter
let evens = numbers.filter { $0 % 2 == 0 }  // [2, 4]

// reduce
let sum = numbers.reduce(0) { $0 + $1 }  // 15
let sum2 = numbers.reduce(0, +)  // 15
let product = numbers.reduce(1) { $0 * $1 }  // 120

// compactMap (filters nil)
let possibleNumbers = ["1", "2", "three", "4"]
let ints = possibleNumbers.compactMap { Int($0) }  // [1, 2, 4]

// flatMap
let nested = [[1, 2], [3, 4], [5, 6]]
let flat = nested.flatMap { $0 }  // [1, 2, 3, 4, 5, 6]

// forEach
numbers.forEach { print($0) }

// sorted
let sorted = numbers.sorted { $0 > $1 }
let sortedAsc = numbers.sorted()

// contains
let hasEven = numbers.contains { $0 % 2 == 0 }  // true

// allSatisfy
let allPositive = numbers.allSatisfy { $0 > 0 }  // true

// first(where:)
let firstEven = numbers.first(where: { $0 % 2 == 0 })  // Optional(2)
```

## Best practices

1. Use descriptive argument labels — clarity at call site is paramount
2. Use trailing closure syntax when the closure is the last argument
3. Use shorthand argument names (`$0`, `$1`) for short closures
4. Use `@escaping` only when the closure needs to outlive the function
5. Use `@autoclosure` sparingly — it hides that a closure is being used
6. Prefer `filter`, `map`, `reduce` over manual loops for transformations
7. Use `compactMap` to filter out nil values
8. Remember closures capture by reference (reference type)
9. Use `[weak self]` in escaping closures to avoid retain cycles
10. Keep closures short — extract to named functions if complex
