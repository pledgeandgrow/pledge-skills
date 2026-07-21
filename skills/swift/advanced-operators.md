# Advanced Operators

Bitwise operators, overflow operators, operator methods, custom operators, and precedence groups.

## Bitwise operators

Bitwise operators manipulate individual bits within integer data types.

### Bitwise NOT (`~`)

```swift
let initialBits: UInt8 = 0b00001111
let invertedBits = ~initialBits  // 0b11110000 (240)
```

### Bitwise AND (`&`)

```swift
let firstSixBits: UInt8 = 0b11111100
let lastSixBits: UInt8  = 0b00111111
let middleFourBits = firstSixBits & lastSixBits  // 0b00111100 (60)
```

### Bitwise OR (`|`)

```swift
let someBits: UInt8 = 0b10110010
let moreBits: UInt8 = 0b01011110
let combinedBits = someBits | moreBits  // 0b11111110 (254)
```

### Bitwise XOR (`^`)

```swift
let firstBits: UInt8 = 0b00010100
let otherBits: UInt8 = 0b00000101
let outputBits = firstBits ^ otherBits  // 0b00010001 (17)
```

### Bitwise left shift (`<<`)

```swift
let shiftBits: UInt8 = 4  // 0b00000100
shiftBits << 1   // 0b00001000 (8)
shiftBits << 2   // 0b00010000 (16)
shiftBits << 5   // 0b10000000 (128)
shiftBits << 6   // 0b00000000 (0 — shifted beyond bounds)
```

### Bitwise right shift (`>>`)

```swift
let unsignedBits: UInt8 = 8  // 0b00001000
unsignedBits >> 2  // 0b00000010 (2)

// Signed integers use arithmetic shift (fills with sign bit)
let signedBits: Int8 = -8  // 0b11111000
signedBits >> 1  // 0b11111100 (-4)
```

## Overflow operators

Swift doesn't allow integer overflow by default — it reports an error. Use overflow operators to opt in.

### Overflow addition (`&+`)

```swift
var unsignedOverflow = UInt8.max  // 255
unsignedOverflow = unsignedOverflow &+ 1  // 0 (wraps around)
```

### Overflow subtraction (`&-`)

```swift
var unsignedOverflow2 = UInt8.min  // 0
unsignedOverflow2 = unsignedOverflow2 &- 1  // 255 (wraps around)
```

### Overflow multiplication (`&*`)

```swift
var signedOverflow = Int8.min  // -128
signedOverflow = signedOverflow &* 2  // 0 (wraps around)
```

### How overflow works

- **Unsigned**: Wrap around to 0 or max
- **Signed**: Wrap around between min and max (two's complement)

## Precedence and associativity

```swift
// Operator precedence determines order of evaluation
2 + 3 * 4  // 14 (not 20) — * has higher precedence than +

// Associativity determines grouping of same-precedence operators
2 - 3 + 4  // (2 - 3) + 4 = 3 — left-associative
```

## Operator methods

Classes and structures can provide their own implementations of existing operators.

### Equatable (`==`, `!=`)

```swift
struct Vector2D: Equatable {
    let x: Double
    let y: Double

    static func == (lhs: Vector2D, rhs: Vector2D) -> Bool {
        return lhs.x == rhs.x && lhs.y == rhs.y
    }
}

let v1 = Vector2D(x: 1.0, y: 2.0)
let v2 = Vector2D(x: 1.0, y: 2.0)
v1 == v2  // true
v1 != v2  // false
```

### Arithmetic operators (`+`, `-`, `*`)

```swift
struct Vector2D {
    var x = 0.0, y = 0.0
}

extension Vector2D {
    static func + (left: Vector2D, right: Vector2D) -> Vector2D {
        return Vector2D(x: left.x + right.x, y: left.y + right.y)
    }

    static func - (left: Vector2D, right: Vector2D) -> Vector2D {
        return Vector2D(x: left.x - right.x, y: left.y - right.y)
    }

    static func * (left: Vector2D, right: Double) -> Vector2D {
        return Vector2D(x: left.x * right, y: left.y * right)
    }
}

let v1 = Vector2D(x: 2.0, y: 3.0)
let v2 = Vector2D(x: 1.0, y: 4.0)
v1 + v2  // Vector2D(x: 3.0, y: 7.0)
v1 - v2  // Vector2D(x: 1.0, y: -1.0)
v1 * 3.0  // Vector2D(x: 6.0, y: 9.0)
```

### Compound assignment operators (`+=`, `-=`)

```swift
extension Vector2D {
    static func += (left: inout Vector2D, right: Vector2D) {
        left = left + right
    }

    static func -= (left: inout Vector2D, right: Vector2D) {
        left = left - right
    }
}

var original = Vector2D(x: 1.0, y: 2.0)
let vectorToAdd = Vector2D(x: 3.0, y: 4.0)
original += vectorToAdd  // Vector2D(x: 4.0, y: 6.0)
```

### Equatable auto-synthesis

```swift
// Swift auto-synthesizes Equatable for structs with Equatable members
struct Point: Equatable {
    let x: Double
    let y: Double
}
// == is automatically provided

// Same for enums without associated values
enum Direction: Equatable {
    case north, south, east, west
}
```

### Comparable (`<`, `>`, `<=`, `>=`)

```swift
struct Date: Comparable {
    let year: Int
    let month: Int
    let day: Int

    static func < (lhs: Date, rhs: Date) -> Bool {
        if lhs.year != rhs.year { return lhs.year < rhs.year }
        if lhs.month != rhs.month { return lhs.month < rhs.month }
        return lhs.day < rhs.day
    }

    static func == (lhs: Date, rhs: Date) -> Bool {
        return lhs.year == rhs.year && lhs.month == rhs.month && lhs.day == rhs.day
    }
}

let date1 = Date(year: 2024, month: 1, day: 15)
let date2 = Date(year: 2024, month: 6, day: 1)
date1 < date2  // true
date1 <= date2  // true
date1 > date2  // false
date1 >= date2  // false
```

### Custom string conversion

```swift
// Convertible to String via CustomStringConvertible
struct Vector2D: CustomStringConvertible {
    var x = 0.0, y = 0.0
    var description: String {
        return "(\(x), \(y))"
    }
}
let v = Vector2D(x: 1.0, y: 2.0)
print(v)  // "(1.0, 2.0)"
```

## Custom operators

```swift
// Define a new operator
prefix operator +++

extension Vector2D {
    static prefix func +++ (vector: inout Vector2D) -> Vector2D {
        vector += vector
        return vector
    }
}

var toBeDoubled = Vector2D(x: 1.0, y: 4.0)
let afterDoubling = +++toBeDoubled  // Vector2D(x: 2.0, y: 8.0)

// Infix custom operator
infix operator +-: AdditionPrecedence

extension Vector2D {
    static func +- (left: Vector2D, right: Vector2D) -> Vector2D {
        return Vector2D(x: left.x + right.x, y: left.y - right.y)
    }
}

let firstVector = Vector2D(x: 1.0, y: 2.0)
let secondVector = Vector2D(x: 3.0, y: 4.0)
firstVector +- secondVector  // Vector2D(x: 4.0, y: -2.0)
```

## Precedence groups

```swift
// Define a custom precedence group
precedencegroup PowerPrecedence {
    associativity: right        // right-associative (like exponentiation)
    higherThan: MultiplicationPrecedence
    lowerThan: BitwiseShiftPrecedence
}

// Use the precedence group
infix operator **: PowerPrecedence

extension Int {
    static func ** (left: Int, right: Int) -> Int {
        return Int(pow(Double(left), Double(right)))
    }
}

2 ** 3 ** 2  // 2 ** (3 ** 2) = 2 ** 9 = 512 (right-associative)
2 ** 3 * 4   // (2 ** 3) * 4 = 8 * 4 = 32 (PowerPrecedence > MultiplicationPrecedence)
```

### Built-in precedence groups (highest to lowest)

```
BitwiseShiftPrecedence    <<, >>
MultiplicationPrecedence  *, /, %
AdditionPrecedence        +, -, +-, etc.
RangeFormationPrecedence  ..<, ...
CastingPrecedence         is, as, as?, as!
RangeFormationPrecedence
NilCoalescingPrecedence   ??
ComparisonPrecedence      <, >, <=, >=, ==, !=
LogicalConjunctionPrecedence  &&, &
LogicalDisjunctionPrecedence  ||, |
TernaryPrecedence         ? :
AssignmentPrecedence      =, +=, -=, *=, /=, %=, &=, |=, ^=, <<=, >>=
```

## Result builders

Result builders (formerly function builders) let you create DSL-like syntax.

```swift
@resultBuilder
struct StringBuilder {
    static func buildBlock(_ components: String...) -> String {
        return components.joined(separator: "\n")
    }

    static func buildOptional(_ component: String?) -> String {
        return component ?? ""
    }

    static func buildEither(first: String) -> String {
        return first
    }

    static func buildEither(second: String) -> String {
        return second
    }

    static func buildArray(_ components: [String]) -> String {
        return components.joined(separator: "\n")
    }
}

func buildHTML(@StringBuilder content: () -> String) -> String {
    return "<html>\n\(content())\n</html>"
}

let html = buildHTML {
    "<head><title>Hello</title></head>"
    "<body>"
    "<h1>Welcome</h1>"
    "</body>"
}
```

## Best practices

1. Use bitwise operators for flags and low-level bit manipulation
2. Use overflow operators (`&+`, `&-`, `&*`) only when you intentionally want wrapping
3. Conform to `Equatable` for value types — auto-synthesis is available
4. Conform to `Comparable` when natural ordering makes sense
5. Implement custom operators sparingly — clarity is more important than brevity
6. Always specify a precedence group for custom infix operators
7. Document custom operators clearly — they can reduce readability
8. Use `CustomStringConvertible` for debug-friendly string representations
9. Use result builders for DSL-like APIs (HTML generators, UI layouts)
10. Keep operator implementations simple and well-tested
