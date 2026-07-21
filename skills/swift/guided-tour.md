# A Swift Tour (Guided Tour)

A quick tour of Swift's key features, based on the official "A Swift Tour" from The Swift Programming Language.

## Simple values

### Variables and constants

```swift
var myVariable = 42          // Mutable
myVariable = 50
let myConstant = 42          // Immutable (constant)
```

### Type inference and explicit types

```swift
let implicitInteger = 70
let implicitDouble = 70.0
let explicitDouble: Double = 70
let explicitFloat: Float = 4

// Type annotation required when no initial value
let explicitString: String
explicitString = "Hello"
```

### String interpolation

```swift
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
let multiLine = """
    I said \(appleSummary)
    and \(fruitSummary)
    """
```

### Arrays and dictionaries

```swift
var fruits = ["strawberries", "lime", "tangerine"]
fruits.append("blueberry")
fruits[1] = "grape"

var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
occupations["Kaylee"] = "Engineer"

// Empty collections
let emptyArray: [String] = []
let emptyArray2 = [String]()
let emptyDictionary: [String: Float] = [:]
let emptyDictionary2 = [String: Float]()
```

## Control flow

```swift
let individualScores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in individualScores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore += 1
    }
}
print(teamScore)  // 11

// Optional binding
var optionalString: String? = "Hello"
print(optionalString == nil)  // false

var optionalName: String? = "Alice"
var greeting = "Hello!"
if let name = optionalName {
    greeting = "Hello, \(name)"
}

// Default value with ??
let nickName: String? = nil
let fullName: String = "John Appleseed"
let informalGreeting = "Hi \(nickName ?? fullName)"

// Switch with ranges and tuples
let vegetable = "red pepper"
switch vegetable {
case "celery":
    print("Add some raisins")
case "cucumber", "watercress":
    print("That would make a good tea sandwich")
case let x where x.hasSuffix("pepper"):
    print("Is it a spicy \(x)?")
default:
    print("Everything tastes good in soup.")
}

// For-in with tuples (dictionaries)
let interestingNumbers = [
    "Prime": [2, 3, 5, 7, 11, 13],
    "Fibonacci": [1, 1, 2, 3, 5, 8],
    "Square": [1, 4, 9, 16, 25],
]
var largest = 0
var largestKind: String = ""
for (kind, numbers) in interestingNumbers {
    for number in numbers {
        if number > largest {
            largest = number
            largestKind = kind
        }
    }
}
print("\(largestKind): \(largest)")

// While loops
var n = 2
while n < 100 {
    n *= 2
}
print(n)  // 128

var m = 2
repeat {
    m *= 2
} while m < 100
print(m)  // 128

// Ranges
var total = 0
for i in 0..<4 {  // 0, 1, 2, 3
    total += i
}
for i in 0...4 {  // 0, 1, 2, 3, 4
    total += i
}
```

## Functions and closures

```swift
// Function with parameters and return
func greet(person: String, day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet(person: "Bob", day: "Tuesday")

// Argument labels and parameter names
func greet(_ person: String, on day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet("John", on: "Friday")

// Tuple return
func calculateStatistics(scores: [Int]) -> (min: Int, max: Int, sum: Int) {
    var min = scores[0]
    var max = scores[0]
    var sum = 0
    for score in scores {
        if score > max { max = score }
        if score < min { min = score }
        sum += score
    }
    return (min, max, sum)
}
let statistics = calculateStatistics(scores: [5, 3, 100, 3, 9])
print(statistics.sum)   // 120
print(statistics.2)     // 120 (tuple index)

// Variadic parameters
func sumOf(numbers: Int...) -> Int {
    var sum = 0
    for number in numbers {
        sum += number
    }
    return sum
}
sumOf(numbers: 42, 597, 12)

// Nested functions
func returnFifteen() -> Int {
    var y = 10
    func add() {
        y += 5
    }
    add()
    return y
}

// Functions as return values
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return 1 + number
    }
    return addOne
}
let increment = makeIncrementer()
increment(7)

// Functions as parameters
func hasAnyMatches(list: [Int], condition: (Int) -> Bool) -> Bool {
    for item in list {
        if condition(item) {
            return true
        }
    }
    return false
}
func lessThanTen(number: Int) -> Bool {
    return number < 10
}
var numbers = [20, 19, 7, 12]
hasAnyMatches(list: numbers, condition: lessThanTen)

// Closures
numbers.map({ (number: Int) -> Int in
    let result = 3 * number
    return result
})

// Simplified closure syntax
let mappedNumbers = numbers.map { number in 3 * number }
print(mappedNumbers)  // [60, 57, 21, 36]

// Sorted with closure
let sortedNumbers = numbers.sorted { $0 > $1 }
print(sortedNumbers)  // [20, 19, 12, 7]
```

## Objects and classes

```swift
class Shape {
    var name: String
    var numberOfSides = 0
    var simpleDescription: String {
        return "A shape with \(numberOfSides) sides."
    }

    init(name: String) {
        self.name = name
    }

    func simpleDescriptionMethod() -> String {
        return "A shape with \(numberOfSides) sides."
    }
}

var shape = Shape(name: "Square")
shape.numberOfSides = 4
print(shape.simpleDescription)

// Subclassing
class Square: Shape {
    var sideLength: Double

    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
        numberOfSides = 4
    }

    func area() -> Double {
        return sideLength * sideLength
    }

    override func simpleDescriptionMethod() -> String {
        return "A square with sides of length \(sideLength)."
    }
}
let test = Square(sideLength: 5.2, name: "my test square")
test.area()
test.simpleDescriptionMethod()
```

## Enumerations and structures

```swift
// Enumerations with raw values
enum Rank: Int {
    case ace = 1
    case two, three, four, five, six, seven, eight, nine, ten
    case jack, queen, king

    func simpleDescription() -> String {
        switch self {
        case .ace: return "ace"
        case .jack: return "jack"
        case .queen: return "queen"
        case .king: return "king"
        default: return String(self.rawValue)
        }
    }
}
let ace = Rank.ace
let aceRawValue = ace.rawValue

// Enumerations with associated values
enum ServerResponse {
    case result(String, String)
    case failure(String)
}

let success = ServerResponse.result("6:00 am", "8:09 pm")
let failure = ServerResponse.failure("Out of cheese.")

switch success {
case let .result(sunrise, sunset):
    print("Sunrise is at \(sunrise) and sunset is at \(sunset).")
case let .failure(message):
    print("Failure... \(message)")
}

// Structures (value types)
struct Card {
    var rank: Rank
    var suit: Suit
    func simpleDescription() -> String {
        return "The \(rank.simpleDescription()) of \(suit.simpleDescription())"
    }
}
let threeOfSpades = Card(rank: .three, suit: .spades)
```

## Protocols and extensions

```swift
// Protocol
protocol ExampleProtocol {
    var simpleDescription: String { get }
    mutating func adjust()
}

// Conforming types
class SimpleClass: ExampleProtocol {
    var simpleDescription: String = "A very simple class."
    func adjust() {
        simpleDescription += " Now 100% adjusted."
    }
}

struct SimpleStructure: ExampleProtocol {
    var simpleDescription: String = "A simple structure"
    mutating func adjust() {
        simpleDescription += " (adjusted)"
    }
}

// Extension
extension Int: ExampleProtocol {
    var simpleDescription: String {
        return "The number \(self)"
    }
    mutating func adjust() {
        self += 42
    }
}
print(7.simpleDescription)  // "The number 7"
```

## Error handling

```swift
enum PrinterError: Error {
    case outOfPaper
    case noToner
    case onFire
}

func send(job: Int, toPrinter printerName: String) throws -> String {
    if printerName == "Never Has Toner" {
        throw PrinterError.noToner
    }
    if printerName == "Toner Town" {
        throw PrinterError.onFire
    }
    return "Job sent"
}

// do-catch
do {
    let printerResponse = try send(job: 1040, toPrinter: "Bi Sheng")
    print(printerResponse)
} catch {
    print(error)
}

// Multiple catches
do {
    let printerResponse = try send(job: 1440, toPrinter: "Never Has Toner")
    print(printerResponse)
} catch PrinterError.onFire {
    print("I'll just put this over here, with the rest of the fire.")
} catch let printerError as PrinterError {
    print("Printer error: \(printerError).")
} catch {
    print(error)
}

// try? and try!
let printerSuccess = try? send(job: 1884, toPrinter: "Mergenthaler")
let printerFailure = try? send(job: 1885, toPrinter: "Never Has Toner")
```

## Generics

```swift
func makeArray<Item>(repeating item: Item, numberOfTimes: Int) -> [Item] {
    var result: [Item] = []
    for _ in 0..<numberOfTimes {
        result.append(item)
    }
    return result
}
makeArray(repeating: "knock", numberOfTimes: 4)

// Generic types
enum OptionalValue<Wrapped> {
    case none
    case some(Wrapped)
}
var possibleInteger: OptionalValue<Int> = .none
possibleInteger = .some(100)

// Generic with constraints
func anyCommonElements<T: Sequence, U: Sequence>(_ lhs: T, _ rhs: U) -> Bool
    where T.Element == U.Element, T.Element: Equatable
{
    for lhsItem in lhs {
        for rhsItem in rhs {
            if lhsItem == rhsItem {
                return true
            }
        }
    }
    return false
}
anyCommonElements([1, 2, 3], [3])
```

## Concurrency (async/await)

```swift
// Async functions
func fetchUserID(from server: String) async -> Int {
    if server == "primary" {
        return 97
    }
    return 501
}

// Async let for concurrent execution
async let userID = fetchUserID(from: "secondary")
let primaryUserID = await fetchUserID(from: "primary")
let secondaryUserID = await userID

// Task groups
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

// Actors for safe concurrent access
actor ServerConnection {
    var serverName: String

    init(serverName: String) {
        self.serverName = serverName
    }

    func changeServer(newName: String) {
        serverName = newName
    }
}

let connection = ServerConnection(serverName: "primary")
await connection.changeServer(newName: "secondary")
```
