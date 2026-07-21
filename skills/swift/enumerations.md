# Enumerations

Enumerations in Swift — first-class types with associated values, raw values, and methods.

## Enumeration syntax

```swift
enum CompassPoint {
    case north
    case south
    case east
    case west
}

// Multiple cases on one line
enum Planet {
    case mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
}

// Using enum values
var directionToHead = CompassPoint.west
directionToHead = .east
```

## Matching enumeration values with switch

```swift
directionToHead = .south
switch directionToHead {
case .north:
    print("Lots of planets have a north")
case .south:
    print("Watch out for penguins")
case .east:
    print("Where the sun rises")
case .west:
    print("Where the sky is blue")
}

// Single case
let somePlanet = Planet.earth
switch somePlanet {
case .earth:
    print("Mostly harmless")
default:
    print("Not a safe place for humans")
}
```

## Iterating over enumeration cases

```swift
// CaseIterable protocol
enum Beverage: CaseIterable {
    case coffee, tea, juice
}
let allCases = Beverage.allCases
print("There are \(allCases.count) beverages")
for beverage in allCases {
    print(beverage)
}
```

## Associated values

```swift
// Different types of associated values per case
enum Barcode {
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

var productBarcode = Barcode.upc(8, 85909, 51226, 3)
productBarcode = .qrCode("ABCDEFGHIJKLMNOP")

// Extracting associated values
switch productBarcode {
case .upc(let numberSystem, let manufacturer, let product, let check):
    print("UPC: \(numberSystem), \(manufacturer), \(product), \(check)")
case .qrCode(let productCode):
    print("QR code: \(productCode).")
}

// All values as let or var
switch productBarcode {
case let .upc(numberSystem, manufacturer, product, check):
    print("UPC: \(numberSystem), \(manufacturer), \(product), \(check)")
case let .qrCode(productCode):
    print("QR code: \(productCode).")
}
```

## Raw values

```swift
// Raw values must be same type for all cases
enum ASCIIControlCharacter: Character {
    case tab = "\t"
    case lineFeed = "\n"
    case carriageReturn = "\r"
}

// Integer raw values auto-increment
enum Planet: Int {
    case mercury = 1, venus, earth, mars, jupiter, saturn, uranus, neptune
}
let earthsOrder = Planet.earth.rawValue  // 3

// String raw values default to case name
enum CompassPoint: String {
    case north, south, east, west
}
let sunsetDirection = CompassPoint.west.rawValue  // "west"

// Initialize from raw value (returns optional)
let possiblePlanet = Planet(rawValue: 3)  // Optional(Planet.earth)
let positionToFind = 11
if let somePlanet = Planet(rawValue: positionToFind) {
    switch somePlanet {
    case .earth:
        print("Mostly harmless")
    default:
        print("Not a safe place for humans")
    }
} else {
    print("There isn't a planet at position \(positionToFind)")
}
```

## Recursive enumerations (indirect)

```swift
// indirect enum — can have cases that reference the enum itself
indirect enum ArithmeticExpression {
    case number(Int)
    case addition(ArithmeticExpression, ArithmeticExpression)
    case multiplication(ArithmeticExpression, ArithmeticExpression)
}

// Or mark individual cases as indirect
enum ArithmeticExpression2 {
    case number(Int)
    indirect case addition(ArithmeticExpression2, ArithmeticExpression2)
    indirect case multiplication(ArithmeticExpression2, ArithmeticExpression2)
}

let five = ArithmeticExpression.number(5)
let four = ArithmeticExpression.number(4)
let sum = ArithmeticExpression.addition(five, four)
let product = ArithmeticExpression.multiplication(sum, ArithmeticExpression.number(2))

// Evaluating recursively
func evaluate(_ expression: ArithmeticExpression) -> Int {
    switch expression {
    case let .number(value):
        return value
    case let .addition(left, right):
        return evaluate(left) + evaluate(right)
    case let .multiplication(left, right):
        return evaluate(left) * evaluate(right)
    }
}
print(evaluate(product))  // (5 + 4) * 2 = 18
```

## Enum methods and properties

```swift
enum CompassPoint: CaseIterable {
    case north, south, east, west

    var description: String {
        switch self {
        case .north: return "North"
        case .south: return "South"
        case .east: return "East"
        case .west: return "West"
        }
    }

    var opposite: CompassPoint {
        switch self {
        case .north: return .south
        case .south: return .north
        case .east: return .west
        case .west: return .east
        }
    }

    static var allDirections: [CompassPoint] {
        return allCases
    }
}

let direction = CompassPoint.north
print(direction.description)  // "North"
print(direction.opposite)     // .south
```

## Enum with computed properties and methods

```swift
enum Device {
    case iPad, iPhone, tvOS, watchOS, mac

    var name: String {
        switch self {
        case .iPad: return "iPad"
        case .iPhone: return "iPhone"
        case .tvOS: return "Apple TV"
        case .watchOS: return "Apple Watch"
        case .mac: return "Mac"
        }
    }

    var supportsCellular: Bool {
        switch self {
        case .iPad, .iPhone: return true
        default: return false
        }
    }

    func introduce() -> String {
        return "This is a \(name)"
    }
}

let device = Device.iPhone
print(device.introduce())  // "This is a iPhone"
print(device.supportsCellular)  // true
```

## Pattern matching with enums

```swift
enum Result<Value, Error: Swift.Error> {
    case success(Value)
    case failure(Error)
}

// If case
let result: Result<Int, Error> = .success(42)
if case .success(let value) = result {
    print("Got value: \(value)")
}

// Guard case
func process(_ result: Result<Int, Error>) {
    guard case .success(let value) = result else {
        print("Failed")
        return
    }
    print("Success: \(value)")
}

// For case
let results: [Result<Int, Error>] = [.success(1), .success(2), .failure(MyError())]
for case .success(let value) in results {
    print("Value: \(value)")
}
```

## Best practices

1. Use enums for fixed sets of related values
2. Use associated values when cases need different payload types
3. Use raw values when cases map to persistent values
4. Conform to `CaseIterable` when you need to iterate all cases
5. Use `indirect` for recursive data structures (trees, linked lists)
6. Add computed properties and methods to keep enum logic encapsulated
7. Use pattern matching (`if case`, `guard case`) for single-case checks
8. Prefer enums over strings for type safety
9. Use `String` raw values for easy serialization
10. Keep enums exhaustive — switch statements must cover all cases
