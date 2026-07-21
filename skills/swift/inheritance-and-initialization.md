# Inheritance and Initialization

Inheritance, initialization, deinitialization, and optional chaining in Swift.

## Inheritance

```swift
class Vehicle {
    var currentSpeed = 0.0
    var description: String {
        return "traveling at \(currentSpeed) miles per hour"
    }
    func makeNoise() {
        // do nothing - vehicle doesn't necessarily make noise
    }
}

class Bicycle: Vehicle {
    var hasBasket = false
}

class Tandem: Bicycle {
    var currentNumberOfPassengers = 0
}

class Train: Vehicle {
    override func makeNoise() {
        print("Choo Choo")
    }
}

class Car: Vehicle {
    var gear = 1
    override var description: String {
        return super.description + " in gear \(gear)"
    }
}

// Overriding property observers
class AutomaticCar: Car {
    override var currentSpeed: Double {
        didSet {
            gear = Int(currentSpeed / 10.0) + 1
        }
    }
}
```

### Preventing overrides

```swift
class FinalClass {
    final func cannotBeOverridden() {}
}

// final class — cannot be subclassed
final class CannotBeSubclassed {}

// final var — cannot be overridden
```

## Initialization

### Default initializers

```swift
struct Fahrenheit {
    var temperature: Double
    init() {
        temperature = 32.0
    }
}

// Default property values
struct Fahrenheit2 {
    var temperature = 32.0
}
```

### Custom initializers

```swift
struct Celsius {
    var temperatureInCelsius: Double

    init(fromFahrenheit fahrenheit: Double) {
        temperatureInCelsius = (fahrenheit - 32.0) / 1.8
    }

    init(fromKelvin kelvin: Double) {
        temperatureInCelsius = kelvin - 273.15
    }
}
let boilingPointOfWater = Celsius(fromFahrenheit: 212.0)
let freezingPointOfWater = Celsius(fromKelvin: 273.15)
```

### Parameter names and argument labels

```swift
struct Color {
    let red, green, blue: Double

    init(red: Double, green: Double, blue: Double) {
        self.red = red
        self.green = green
        self.blue = blue
    }

    init(white: Double) {
        red = white
        green = white
        blue = white
    }
}
let magenta = Color(red: 1.0, green: 0.0, blue: 1.0)
let halfGray = Color(white: 0.5)

// Omitting argument labels
struct Celsius {
    var temperatureInCelsius: Double
    init(_ celsius: Double) {
        temperatureInCelsius = celsius
    }
}
let bodyTemperature = Celsius(37.0)
```

### Optional property types

```swift
class SurveyQuestion {
    var text: String
    var response: String?
    init(text: String) {
        self.text = text
    }
    func ask() {
        print(text)
    }
}
```

### Default initializers for structs

```swift
struct Size {
    var width = 0.0
    var height = 0.0
}
let twoByTwo = Size(width: 2.0, height: 2.0)  // Memberwise initializer
```

### Initializer delegation for value types

```swift
struct Rect {
    var origin = Point()
    var size = Size()
    init() {}
    init(origin: Point, size: Size) {
        self.origin = origin
        self.size = size
    }
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
```

### Designated and convenience initializers

```swift
class Person {
    var name: String
    var age: Int

    // Designated initializer
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }

    // Convenience initializer
    convenience init(name: String) {
        self.init(name: name, age: 0)
    }
}

class Student: Person {
    var school: String

    // Designated initializer
    init(name: String, age: Int, school: String) {
        self.school = school
        super.init(name: name, age: age)
    }

    // Convenience initializer
    convenience init(name: String, school: String) {
        self.init(name: name, age: 18, school: school)
    }
}
```

### Failable initializers

```swift
struct Animal {
    let species: String
    init?(species: String) {
        if species.isEmpty { return nil }
        self.species = species
    }
}
let someCreature = Animal(species: "Giraffe")
if let giraffe = someCreature {
    print("Animal initialized: \(giraffe.species)")
}

// Enum failable
enum TemperatureUnit {
    case kelvin, celsius, fahrenheit
    init?(symbol: Character) {
        switch symbol {
        case "K": self = .kelvin
        case "C": self = .celsius
        case "F": self = .fahrenheit
        default: return nil
        }
    }
}

// Required initializers
class SomeClass {
    required init() {
        // initializer implementation
    }
}
class SomeSubclass: SomeClass {
    required init() {
        // subclass implementation
    }
}
```

### Setting constant properties during initialization

```swift
class SurveyQuestion {
    let text: String  // Constant
    var response: String?
    init(text: String) {
        self.text = text  // Can set constant property in init
    }
}
```

## Deinitialization

```swift
class Bank {
    static var coinsInBank = 10_000
    static func distribute(coins numberOfCoinsRequested: Int) -> Int {
        let numberOfCoinsToVend = min(numberOfCoinsRequested, coinsInBank)
        coinsInBank -= numberOfCoinsToVend
        return numberOfCoinsToVend
    }
    static func receive(coins: Int) {
        coinsInBank += coins
    }
}

class Player {
    var coinsInPurse: Int
    init(coins: Int) {
        coinsInPurse = Bank.distribute(coins: coins)
    }
    func win(coins: Int) {
        coinsInPurse += Bank.distribute(coins: coins)
    }
    deinit {
        Bank.receive(coins: coinsInPurse)
    }
}

// Deinit is called automatically when instance is deallocated
// No parentheses needed: deinit { ... }
```

## Optional chaining

```swift
class Person {
    var residence: Residence?
}

class Residence {
    var rooms: [Room] = []
    var numberOfRooms: Int {
        return rooms.count
    }
    subscript(i: Int) -> Room {
        get { return rooms[i] }
        set { rooms[i] = newValue }
    }
    func printNumberOfRooms() {
        print("The number of rooms is \(numberOfRooms)")
    }
    var address: Address?
}

class Room {
    let name: String
    init(name: String) { self.name = name }
}

class Address {
    var buildingName: String?
    var buildingNumber: String?
    var streetName: String?
    func buildingIdentifier() -> String? {
        if let buildingNumber = buildingNumber, let streetName = streetName {
            return "\(buildingNumber) \(streetName)"
        } else if buildingName != nil {
            return buildingName
        } else {
            return nil
        }
    }
}

// Optional chaining
let john = Person()
if let roomCount = john.residence?.numberOfRooms {
    print("John's residence has \(roomCount) rooms")
} else {
    print("Unable to retrieve the number of rooms")
}

// Multiple levels of chaining
let someAddress = john.residence?.address?.streetName

// Calling methods through optional chaining
john.residence?.printNumberOfRooms()

// Subscripts through optional chaining
if let firstRoomName = john.residence?[0].name {
    print("The first room name is \(firstRoomName)")
}
```

## Best practices

1. Always call super.init() after setting subclass properties
2. Use designated initializers as the primary init path
3. Use convenience initializers for common defaults
4. Use failable initializers when init can fail
5. Use `required init` when all subclasses must implement an initializer
6. Clean up resources in `deinit` (file handles, observers, etc.)
7. Use optional chaining (`?`) for safe access to optional properties/methods
8. Use optional chaining with subscripts: `array?[0]`
9. Remember optional chaining returns an optional (even if property is non-optional)
10. Use `if let` with optional chaining to unwrap the result
