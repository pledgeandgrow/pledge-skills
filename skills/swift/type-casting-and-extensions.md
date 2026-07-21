# Type Casting, Nested Types, and Extensions

Type casting, nested types, and extensions in Swift.

## Type casting

### Checking type with `is`

```swift
class MediaItem {
    var name: String
    init(name: String) { self.name = name }
}

class Movie: MediaItem {
    var director: String
    init(name: String, director: String) {
        self.director = director
        super.init(name: name)
    }
}

class Song: MediaItem {
    var artist: String
    init(name: String, artist: String) {
        self.artist = artist
        super.init(name: name)
    }
}

let library: [MediaItem] = [
    Movie(name: "Casablanca", director: "Michael Curtiz"),
    Song(name: "Blue Suede Shoes", artist: "Elvis Presley"),
    Movie(name: "Citizen Kane", director: "Orson Welles"),
    Song(name: "The One and Only", artist: "Chesney Hawkes"),
]

// Checking with is
for item in library {
    if item is Movie {
        print("Movie: \(item.name)")
    } else if item is Song {
        print("Song: \(item.name)")
    }
}
```

### Downcasting with `as?` and `as!`

```swift
// Safe downcast (returns optional)
for item in library {
    if let movie = item as? Movie {
        print("Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("Song: \(song.name), by \(song.artist)")
    }
}

// Force downcast (crashes if wrong type)
let movie = library[0] as! Movie
print(movie.director)
```

### Type casting with Any and AnyObject

```swift
// Any: any type (including functions)
var things: [Any] = []
things.append(0)
things.append(0.0)
things.append(42)
things.append(3.14159)
things.append("hello")
things.append((3.0, 5.0))
things.append(Movie(name: "Ghostbusters", director: "Ivan Reitman"))
things.append({ (name: String) -> String in "Hello, \(name)" })

// Switch with type casting
for thing in things {
    switch thing {
    case 0 as Int:
        print("zero as an Int")
    case 0 as Double:
        print("zero as a Double")
    case let someInt as Int:
        print("an integer value of \(someInt)")
    case let someDouble as Double where someDouble > 0:
        print("a positive double value of \(someDouble)")
    case let someString as String:
        print("a string value of \"\(someString)\"")
    case let (x, y) as (Double, Double):
        print("an (x, y) point at \(x), \(y)")
    case let movie as Movie:
        print("a movie called \(movie.name), dir. \(movie.director)")
    case let stringConverter as (String) -> String:
        print(stringConverter("Michael"))
    default:
        print("something else")
    }
}

// AnyObject: any class type
let someObjects: [AnyObject] = [
    Movie(name: "2001", director: "Stanley Kubrick"),
    Movie(name: "Moon", director: "Duncan Jones"),
    Movie(name: "Alien", director: "Ridley Scott")
]
for object in someObjects {
    let movie = object as! Movie
    print("Movie: \(movie.name), dir. \(movie.director)")
}
```

## Nested types

```swift
struct BlackjackCard {
    // Nested Suit enumeration
    enum Suit: Character {
        case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
    }

    // Nested Rank enumeration
    enum Rank: Int {
        case two = 2, three, four, five, six, seven, eight, nine, ten
        case jack, queen, king, ace

        struct Values {
            let first: Int, second: Int?
        }

        var values: Values {
            switch self {
            case .ace:
                return Values(first: 1, second: 11)
            case .jack, .queen, .king:
                return Values(first: 10, second: nil)
            default:
                return Values(first: self.rawValue, second: nil)
            }
        }
    }

    // BlackjackCard properties and methods
    let rank: Rank
    let suit: Suit
    var description: String {
        return "\(suit.rawValue)\(rank.values.first)"
    }
}

// Referencing nested types
let theAceOfSpades = BlackjackCard(rank: .ace, suit: .spades)
print("theAceOfSpades: \(theAceOfSpades.description)")

// Fully qualified nested type
let heartsSymbol = BlackjackCard.Suit.hearts.rawValue
```

## Extensions

Extensions add new functionality to existing types.

### Computed properties

```swift
extension Double {
    var km: Double { return self * 1_000.0 }
    var m: Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1_000.0 }
    var ft: Double { return self / 3.28084 }
}
let oneInch = 25.4.mm
let threeFeet = 3.ft
let aMarathon = 42.km + 195.m
```

### Initializers

```swift
struct Size {
    var width = 0.0, height = 0.0
}
struct Point {
    var x = 0.0, y = 0.0
}
struct Rect {
    var origin = Point()
    var size = Size()
}

extension Rect {
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
let centerRect = Rect(center: Point(x: 4.0, y: 4.0),
                      size: Size(width: 3.0, height: 3.0))
```

### Methods

```swift
extension Int {
    func repetitions(task: () -> Void) {
        for _ in 0..<self {
            task()
        }
    }
    // Mutating instance method
    mutating func square() {
        self = self * self
    }
}
3.repetitions { print("Hello!") }
var someInt = 3
someInt.square()
```

### Subscripts

```swift
extension Int {
    subscript(digitIndex: Int) -> Int {
        var decimalBase = 10
        for _ in 0..<digitIndex {
            decimalBase *= 10
        }
        return (self / decimalBase) % 10
    }
}
746381295[0]   // 5
746381295[1]   // 9
746381295[2]   // 2
```

### Nested types and protocols

```swift
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

### Conditional conformance

```swift
// Conform to a protocol only when a condition is met
extension Array: TextRepresentable where Element: TextRepresentable {
    var textualDescription: String {
        return "[" + map { $0.textualDescription }.joined(separator: ", ") + "]"
    }
}
```

### Extensions with generics

```swift
extension Stack where Element: Equatable {
    func isTop(_ item: Element) -> Bool {
        guard let topItem = items.last else {
            return false
        }
        return topItem == item
    }
}
```

### Adding extensions to protocol types

```swift
// Protocol extension provides default implementation
extension Collection {
    func summarize() -> String {
        return "Collection with \(count) elements"
    }
}

// All collections now have summarize()
let array = [1, 2, 3]
print(array.summarize())
```

## Best practices

1. Use `is` for type checking, `as?` for safe downcasting
2. Avoid `as!` unless you're certain of the type
3. Use `Any` sparingly — prefer generic constraints
4. Use nested types to keep related types scoped
5. Use extensions to organize code into logical sections
6. Use extensions to conform to protocols (separate from main type definition)
7. Use conditional conformance for protocol adoption with constraints
8. Use protocol extensions for default implementations
9. Avoid extending types with stored properties (not supported — use wrappers)
10. Use extensions to add functionality to framework types
