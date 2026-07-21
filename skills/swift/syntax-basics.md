# Syntax Basics

The Basics, Basic Operators, and Control Flow in Swift.

## The Basics

### Constants and variables

```swift
// Constants (immutable)
let maximumNumberOfLoginAttempts = 10
let pi = 3.14159

// Variables (mutable)
var currentLoginAttempt = 0
var x = 0.0, y = 0.0, z = 0.0

// Type annotations
var welcomeMessage: String
var red, green, blue: Double

// Multiple declarations on one line
var x = 0.0, y = 0.0, z = 0.0
```

### Naming conventions

- Cannot contain whitespace, mathematical symbols, arrows, private-use Unicode
- Cannot begin with a number
- Can use emoji and most Unicode characters

```swift
let π = 3.14159
let 你好 = "你好世界"
let 🐶🐮 = "dogcow"
```

### Printing

```swift
print("Hello, World!")
print(welcomeMessage)
// String interpolation
print("The current value is \(currentLoginAttempt) out of \(maximumNumberOfLoginAttempts)")
// Multi-line interpolation
print("""
    The current value is \(currentLoginAttempt)
    out of \(maximumNumberOfLoginAttempts)
    """)
```

### Integers

```swift
// Integer types: Int, UInt, Int8, Int16, Int32, Int64, UInt8, UInt16, UInt32, UInt64
let minValue = UInt8.min   // 0
let maxValue = UInt8.max   // 255

// Prefer Int for all uses unless specific size needed
let integer = 42
```

### Floating-point numbers

```swift
// Double: 64-bit, at least 15 decimal digits precision (preferred)
// Float: 32-bit, at least 6 decimal digits precision
let doubleValue: Double = 3.14159265358979
let floatValue: Float = 3.14159
```

### Type safety and type inference

```swift
// Swift is type-safe — compiler checks types at compile time
let meaningOfLife = 42          // Int
let pi = 3.14159                // Double
let anotherPi = 3 + 0.14159     // Double (type inference from context)
```

### Numeric literals

```swift
let decimalInteger = 17
let binaryInteger = 0b10001       // 17 in binary
let octalInteger = 0o21           // 17 in octal
let hexadecimalInteger = 0x11     // 17 in hexadecimal

let decimalDouble = 12.1875
let exponentDouble = 1.21875e1
let hexadecimalDouble = 0xC.3p0

// Readable with underscores
let oneMillion = 1_000_000
let justOverOneMillion = 1_000_000.000_000_1
```

### Type aliases

```swift
typealias AudioSample = UInt16
var maxAmplitudeFound = AudioSample.min
```

### Tuples

```swift
// Group multiple values into a single compound value
let httpError404 = (404, "Not Found")
print("The status code is \(httpError404.0)")
print("The message is \(httpError404.1)")

// Named elements
let http200Status = (statusCode: 200, description: "OK")
print("The status code is \(http200Status.statusCode)")

// Decomposition
let (statusCode, statusMessage) = http200Status
print("The status code is \(statusCode)")
let (justTheStatusCode, _) = http200Status
```

### Optionals

```swift
// Optional: value present or nil
let possibleNumber = "123"
let convertedNumber = Int(possibleNumber)  // Int? (optional Int)

// nil
var serverResponseCode: Int? = 404
serverResponseCode = nil

// Optional binding
if let actualNumber = Int(possibleNumber) {
    print("The number is \(actualNumber)")
}

// Multiple optional bindings
if let number = Int(possibleNumber), number > 0 {
    print("Positive number: \(number)")
}

// Implicitly unwrapped optionals
let assumedString: String! = "An implicitly unwrapped optional"
print(assumedString)  // No need to unwrap

// Optional chaining
let optionalName: String? = "Alice"
let greeting = "Hello, \(optionalName ?? "Anonymous")"
```

### Assertions and preconditions

```swift
// Debug-time checks
let age = -3
assert(age >= 0, "A person's age can't be less than zero.")

// Without message
assert(age >= 0)

// Preconditions — checked in production
precondition(index > 0, "Index must be greater than zero.")

// fatalError — always terminates
fatalError("Unreachable code")
```

## Basic Operators

### Assignment

```swift
let b = 10
var a = 5
a = b  // a is now 10

// Tuple assignment
let (x, y) = (1, 2)

// Does not return a value (prevents = vs == errors)
if x = y {  // Error: x = y doesn't return a value
}
```

### Arithmetic

```swift
1 + 2       // 3
5 - 3       // 2
2 * 3       // 6
10.0 / 2.5  // 4.0
"hello " + "world"  // "hello world" (string concatenation)

// Remainder
9 % 4       // 1
-9 % 4      // -1
9 % -4      // 1

// Unary minus
let three = 3
let minusThree = -three       // -3
let plusThree = -minusThree   // 3
```

### Compound assignment

```swift
var a = 1
a += 2   // a = 3
a -= 1   // a = 2
a *= 3   // a = 6
a /= 2   // a = 3
a %= 2   // a = 1
```

### Comparison

```swift
1 == 1   // true
2 != 1   // true
2 > 1    // true
1 < 2    // true
1 >= 1   // true
2 <= 1   // false

// Tuple comparison (up to 6 elements)
(1, "zebra") < (2, "apple")   // true
(3, "apple") < (3, "bird")    // true
```

### Ternary conditional

```swift
let contentHeight = 40
let hasHeader = true
let rowHeight = contentHeight + (hasHeader ? 50 : 20)  // 90
```

### Nil-coalescing

```swift
let defaultColorName = "red"
var userDefinedColorName: String?
let colorName = userDefinedColorName ?? defaultColorName  // "red"
```

### Ranges

```swift
// Closed range (includes upper bound)
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}

// Half-open range (excludes upper bound)
let names = ["Anna", "Alex", "Brian", "Jack"]
for i in 0..<names.count {
    print("Person \(i + 1) is called \(names[i])")
}

// One-sided ranges
for name in names[2...] {
    print(name)  // Brian, Jack
}
for name in names[...2] {
    print(name)  // Anna, Alex, Brian
}
for name in names[..<2] {
    print(name)  // Anna, Alex
}
```

### Logical

```swift
let enteredDoorCode = true
let passedRetinaScan = false
let hasDoorKey = false
let knowsOverridePassword = true

// AND
if enteredDoorCode && passedRetinaScan {
    print("Welcome")
}

// OR
if hasDoorKey || knowsOverridePassword {
    print("Welcome")
}

// NOT
if !hasDoorKey {
    print("You need a key")
}

// Combining
if (enteredDoorCode && passedRetinaScan) || hasDoorKey || knowsOverridePassword {
    print("Welcome!")
}
```

## Control Flow

### For-in loops

```swift
// Ranges
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}

// Collections
let names = ["Anna", "Alex", "Brian", "Jack"]
for name in names {
    print("Hello, \(name)!")
}

// Dictionaries
let numberOfLegs = ["spider": 8, "ant": 6, "cat": 4]
for (animalName, legCount) in numberOfLegs {
    print("\(animalName)s have \(legCount) legs")
}

// Stride
for index in stride(from: 0, to: 10, by: 2) {
    print(index)  // 0, 2, 4, 6, 8
}
for index in stride(from: 0, through: 10, by: 2) {
    print(index)  // 0, 2, 4, 6, 8, 10
}

// Wildcard (ignore loop variable)
let base = 3
let power = 10
var answer = 1
for _ in 1...power {
    answer *= base
}
```

### While loops

```swift
// while
var i = 0
while i < 3 {
    print(i)
    i += 1
}

// repeat-while (like do-while)
var j = 0
repeat {
    print(j)
    j += 1
} while j < 3
```

### Conditional statements

```swift
// if-else
let temperatureInFahrenheit = 90
if temperatureInFahrenheit <= 32 {
    print("It's freezing")
} else if temperatureInFahrenheit >= 86 {
    print("It's hot")
} else {
    print("It's comfortable")
}

// if let (optional binding)
if let constantName = someOptional {
    print("\(constantName)")
}

// Guard (early exit)
func greet(person: [String: String]) {
    guard let name = person["name"] else {
        return
    }
    print("Hello \(name)")

    guard let location = person["location"] else {
        print("I hope the weather is nice")
        return
    }
    print("I hope the weather is nice in \(location)")
}

// if case (single case pattern matching)
let someCharacter: Character = "z"
if case "z" = someCharacter {
    print("It's z")
}
```

### Switch

```swift
let someCharacter: Character = "z"
switch someCharacter {
case "a":
    print("The first letter")
case "z":
    print("The last letter")
default:
    print("Some other character")
}

// No implicit fallthrough (no break needed)
// Multiple values
let anotherCharacter: Character = "a"
switch anotherCharacter {
case "a", "A":
    print("The letter A")
default:
    print("Not the letter A")
}

// Interval matching
let approximateCount = 62
switch approximateCount {
case 0:
    print("no")
case 1..<5:
    print("a few")
case 5..<12:
    print("several")
case 12..<100:
    print("dozens of")
default:
    print("a lot of")
}

// Tuples and wildcards
let somePoint = (1, 1)
switch somePoint {
case (0, 0):
    print("\(somePoint) is at the origin")
case (_, 0):
    print("\(somePoint) is on the x-axis")
case (0, _):
    print("\(somePoint) is on the y-axis")
case (-2...2, -2...2):
    print("\(somePoint) is inside the box")
default:
    print("\(somePoint) is outside of the box")
}

// Value bindings
let anotherPoint = (2, 0)
switch anotherPoint {
case (let x, 0):
    print("on the x-axis with an x value of \(x)")
case (0, let y):
    print("on the y-axis with a y value of \(y)")
case let (x, y):
    print("somewhere else at (\(x), \(y))")
}

// Where clauses
let yetAnotherPoint = (1, -1)
switch yetAnotherPoint {
case let (x, y) where x == y:
    print("(\(x), \(y)) is on the line x == y")
case let (x, y) where x == -y:
    print("(\(x), \(y)) is on the line x == -y")
case let (x, y):
    print("(\(x), \(y)) is just some arbitrary point")
}

// Compound cases with bindings
let point = (1, 2)
switch point {
case let (x, y) where x == 1, let (x, y) where y == 2:
    print("x is 1 or y is 2")
default:
    break
}
```

### Control transfer statements

```swift
// continue — skip rest of current iteration
for i in 1...10 {
    if i % 2 == 0 { continue }
    print(i)  // 1, 3, 5, 7, 9
}

// break — exit loop/switch
for i in 1...10 {
    if i > 5 { break }
    print(i)  // 1, 2, 3, 4, 5
}

// Labeled statements
gameLoop: for square in 0..<25 {
    for diceRoll in rollDice() {
        if square + diceRoll == 25 {
            print("Won!")
            break gameLoop
        }
    }
}

// fallthrough — explicit fallthrough in switch
let integerToDescribe = 5
switch integerToDescribe {
case 2, 3, 5, 7, 11, 13, 17, 19:
    description = "A prime number"
    fallthrough
default:
    description += ", and also an integer."
}

// return, throw
func process(_ value: Int) throws -> Int {
    if value < 0 { throw SomeError.negative }
    return value * 2
}
```

### Early exit with guard

```swift
func processPerson(person: [String: String]) {
    guard let name = person["name"] else {
        print("Name is required")
        return
    }
    // 'name' is available here as non-optional
    print("Hello, \(name)")
}
```

### Labeled statements

```swift
outerLoop: for row in 0..<5 {
    for col in 0..<5 {
        if row == col { continue outerLoop }
        print("(\(row), \(col))")
    }
}
```

### if and switch as expressions (Swift 5.9+)

```swift
// if as expression
let score = 85
let grade = if score >= 90 { "A" } else if score >= 80 { "B" } else { "C" }

// switch as expression
let day = "Monday"
let isWeekend = switch day {
    case "Saturday", "Sunday": true
    default: false
}
```
