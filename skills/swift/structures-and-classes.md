# Structures and Classes

Structures, classes, properties, methods, subscripts, and value vs reference types.

## Structures

```swift
struct Resolution {
    var width = 0
    var height = 0
}

let someResolution = Resolution()
let vga = Resolution(width: 640, height: 480)

// Memberwise initializer (auto-generated for structs)
let hd = Resolution(width: 1920, height: 1080)
```

## Classes

```swift
class VideoMode {
    var resolution = Resolution()
    var interlaced = false
    var frameRate = 0.0
    var name: String?
}

let someVideoMode = VideoMode()
someVideoMode.resolution.width = 1280
someVideoMode.interlaced = true
someVideoMode.name = "1080i"
someVideoMode.frameRate = 30.0
```

## Value vs reference types

### Structures and enumerations are value types

```swift
let hd = Resolution(width: 1920, height: 1080)
var cinema = hd
cinema.width = 2048
print("cinema is now \(cinema.width) pixels wide")  // 2048
print("hd is still \(hd.width) pixels wide")         // 1920 (unchanged)
```

### Classes are reference types

```swift
let tenEighty = VideoMode()
tenEighty.resolution = hd
tenEighty.interlaced = true
tenEighty.name = "1080i"
tenEighty.frameRate = 25.0

let alsoTenEighty = tenEighty
alsoTenEighty.frameRate = 30.0
print("The frameRate property of tenEighty is now \(tenEighty.frameRate)")  // 30.0
```

### Identity operators

```swift
if tenEighty === alsoTenEighty {
    print("tenEighty and alsoTenEighty refer to the same VideoMode instance.")
}
```

## Choosing between structs and classes

### When to use structs (value types):
- Comparing instances with `==` makes sense
- You want copies to have independent state
- Properties are themselves value types
- No inheritance needed
- Default behavior (copy on write) is desired

### When to use classes (reference types):
- Comparing identity (same instance) matters
- Shared mutable state is needed
- Inheritance is needed
- Objective-C interoperability
- Lifecycle management via `deinit`

## Properties

### Stored properties

```swift
struct FixedLengthRange {
    var firstValue: Int
    let length: Int  // Constant stored property
}
var rangeOfThreeItems = FixedLengthRange(firstValue: 0, length: 3)
rangeOfThreeItems.firstValue = 6

// Lazy stored properties
class DataImporter {
    var filename = "data.txt"
}
class DataManager {
    lazy var importer = DataImporter()
    var data: [String] = []
}
let manager = DataManager()
manager.data.append("Some data")
// importer not yet created
manager.importer.filename  // Now created
```

### Computed properties

```swift
struct Point {
    var x = 0.0, y = 0.0
}
struct Size {
    var width = 0.0, height = 0.0
}
struct Rect {
    var origin = Point()
    var size = Size()
    var center: Point {
        get {
            let centerX = origin.x + (size.width / 2)
            let centerY = origin.y + (size.height / 2)
            return Point(x: centerX, y: centerY)
        }
        set(newCenter) {
            origin.x = newCenter.x - (size.width / 2)
            origin.y = newCenter.y - (size.height / 2)
        }
    }
}

// Shorthand setter (newValue)
struct AlternativeRect {
    var center: Point {
        get { /* ... */ }
        set {  // newValue is implicit
            origin.x = newValue.x - (size.width / 2)
        }
    }
}

// Read-only computed property
struct Cuboid {
    var width = 0.0, height = 0.0, depth = 0.0
    var volume: Double {
        return width * height * depth
    }
}
```

### Property observers

```swift
class StepCounter {
    var totalSteps: Int = 0 {
        willSet(newTotalSteps) {
            print("About to set totalSteps to \(newTotalSteps)")
        }
        didSet {
            if totalSteps > oldValue {
                print("Added \(totalSteps - oldValue) steps")
            }
        }
    }
}
let stepCounter = StepCounter()
stepCounter.totalSteps = 200  // Triggers willSet and didSet
```

### Property wrappers

```swift
@propertyWrapper
struct TwelveOrLess {
    private var number: Int
    init() { self.number = 0 }
    var wrappedValue: Int {
        get { return number }
        set { number = min(newValue, 12) }
    }
}

struct SmallRectangle {
    @TwelveOrLess var height: Int
    @TwelveOrLess var width: Int
}
var rectangle = SmallRectangle()
rectangle.height = 10
print(rectangle.height)  // 10
rectangle.height = 24
print(rectangle.height)  // 12 (clamped)
```

### Type properties

```swift
struct SomeStructure {
    static var storedTypeProperty = "Some value."
    static var computedTypeProperty: Int { return 1 }
}
enum SomeEnumeration {
    static var storedTypeProperty = "Some value."
    static var computedTypeProperty: Int { return 6 }
}
class SomeClass {
    static var computedTypeProperty: Int { return 27 }
    class var overrideableComputedTypeProperty: Int { return 107 }
}

// Accessing type properties
print(SomeStructure.storedTypeProperty)  // "Some value."
SomeStructure.storedTypeProperty = "Another value."
```

## Methods

### Instance methods

```swift
class Counter {
    var count = 0
    func increment() {
        count += 1
    }
    func increment(by amount: Int) {
        count += amount
    }
    func reset() {
        count = 0
    }
}
let counter = Counter()
counter.increment()
counter.increment(by: 5)
counter.reset()
```

### The self property

```swift
struct Point {
    var x = 0.0, y = 0.0
    func isToTheRightOf(x: Double) -> Bool {
        return self.x > x
    }
}
```

### Mutating methods (structs and enums)

```swift
struct Point {
    var x = 0.0, y = 0.0
    mutating func moveBy(x deltaX: Double, y deltaY: Double) {
        x += deltaX
        y += deltaY
    }
}
var somePoint = Point(x: 1.0, y: 1.0)
somePoint.moveBy(x: 2.0, y: 3.0)

// Mutating can assign to self
struct Point {
    var x = 0.0, y = 0.0
    mutating func moveBy(x deltaX: Double, y deltaY: Double) {
        self = Point(x: x + deltaX, y: y + deltaY)
    }
}

// Enum mutating
enum TriStateSwitch {
    case off, low, high
    mutating func next() {
        switch self {
        case .off: self = .low
        case .low: self = .high
        case .high: self = .off
        }
    }
}
var ovenLight = TriStateSwitch.low
ovenLight.next()  // .high
```

### Type methods

```swift
class SomeClass {
    static func someTypeMethod() {
        // type method implementation
    }
}
SomeClass.someTypeMethod()

// Level tracker with type method
struct LevelTracker {
    static var highestUnlockedLevel = 1
    var currentLevel = 1

    static func unlock(_ level: Int) {
        if level > highestUnlockedLevel {
            highestUnlockedLevel = level
        }
    }
    static func isUnlocked(_ level: Int) -> Bool {
        return level <= highestUnlockedLevel
    }
    @discardableResult
    mutating func advance(to level: Int) -> Bool {
        if LevelTracker.isUnlocked(level) {
            currentLevel = level
            return true
        } else {
            return false
        }
    }
}
```

## Subscripts

```swift
// Basic subscript
struct TimesTable {
    let multiplier: Int
    subscript(index: Int) -> Int {
        return multiplier * index
    }
}
let threeTimesTable = TimesTable(multiplier: 3)
print(threeTimesTable[6])  // 18

// Subscript with get/set
struct Matrix {
    let rows: Int, columns: Int
    var grid: [Double]
    init(rows: Int, columns: Int) {
        self.rows = rows
        self.columns = columns
        grid = Array(repeating: 0.0, count: rows * columns)
    }
    subscript(row: Int, column: Int) -> Double {
        get {
            return grid[(row * columns) + column]
        }
        set {
            grid[(row * columns) + column] = newValue
        }
    }
}
var matrix = Matrix(rows: 2, columns: 2)
matrix[0, 1] = 1.5
matrix[1, 0] = 3.2

// Type subscripts
enum Planet: Int {
    case mercury = 1, venus, earth, mars, jupiter, saturn, uranus, neptune
    static subscript(naturalIndex: Int) -> Planet? {
        return Planet(rawValue: naturalIndex)
    }
}
let mars = Planet[naturalIndex: 4]  // Optional(Planet.mars)
```

## Best practices

1. Prefer structs over classes by default
2. Use classes when you need reference semantics or inheritance
3. Make structs immutable when possible (use `let`)
4. Use `mutating` keyword for methods that modify struct/enum state
5. Use computed properties for derived values
6. Use property observers for side effects on property changes
7. Use lazy properties for expensive initialization
8. Use property wrappers for reusable property logic
9. Document complexity of computed properties that aren't O(1)
10. Use `static` for type properties/methods, `class` for overridable ones
