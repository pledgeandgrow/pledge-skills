# Collection Types

Arrays, Sets, and Dictionaries in Swift.

## Arrays

### Creation

```swift
// Array literal
var someInts: [Int] = []
var threeDoubles = [Double](repeating: 0.0, count: 3)
var anotherThreeDoubles = Array(repeating: 2.5, count: 3)

// From literal
var shoppingList: [String] = ["Eggs", "Milk"]
var shoppingList2 = ["Eggs", "Milk"]  // Type inferred

// Empty array
var emptyArray = [String]()
var emptyArray2: [String] = []
```

### Accessing and modifying

```swift
var shoppingList = ["Eggs", "Milk"]

// Count
print("The list contains \(shoppingList.count) items")

// isEmpty
if shoppingList.isEmpty {
    print("The list is empty")
}

// Append
shoppingList.append("Flour")
shoppingList += ["Baking Powder"]
shoppingList += ["Chocolate Spread", "Cheese", "Butter"]

// Subscript
var firstItem = shoppingList[0]
shoppingList[0] = "Six eggs"

// Range subscript
shoppingList[4...6] = ["Bananas", "Apples"]

// Insert
shoppingList.insert("Maple Syrup", at: 0)

// Remove
let mapleSyrup = shoppingList.remove(at: 0)
let apples = shoppingList.removeLast()

// Iterate
for item in shoppingList {
    print(item)
}

// Iterate with index
for (index, value) in shoppingList.enumerated() {
    print("Item \(index): \(value)")
}
```

## Sets

### Creation

```swift
// Empty set
var letters = Set<Character>()
var favoriteGenres: Set<String> = ["Rock", "Classical", "Hip hop"]
var favoriteGenres2: Set = ["Rock", "Classical", "Hip hop"]  // Type inferred
```

### Accessing and modifying

```swift
var favoriteGenres: Set = ["Rock", "Classical", "Hip hop"]

// Count
print("I have \(favoriteGenres.count) favorite music genres.")

// isEmpty
if favoriteGenres.isEmpty {
    print("No favorites")
}

// Insert
favoriteGenres.insert("Jazz")

// Remove
if let removed = favoriteGenres.remove("Rock") {
    print("\(removed) removed")
} else {
    print("Not found")
}

// Contains
if favoriteGenres.contains("Funk") {
    print("Funk is in the set")
}

// Iterate
for genre in favoriteGenres {
    print("\(genre)")
}

// Sorted iterate
for genre in favoriteGenres.sorted() {
    print("\(genre)")
}
```

### Set operations

```swift
let oddDigits: Set = [1, 3, 5, 7, 9]
let evenDigits: Set = [0, 2, 4, 6, 8]
let primeDigits: Set = [2, 3, 5, 7]

// Union (A ∪ B)
oddDigits.union(evenDigits).sorted()  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Intersection (A ∩ B)
oddDigits.intersection(evenDigits).sorted()  // []

// Subtracting (A - B)
oddDigits.subtracting(primeDigits).sorted()  // [1, 9]

// Symmetric difference (A △ B — in either but not both)
oddDigits.symmetricDifference(primeDigits).sorted()  // [1, 2, 9]

// Membership tests
let houseAnimals: Set = ["🐶", "🐱"]
let farmAnimals: Set = ["🐮", "🐔", "🐑", "🐶", "🐱"]
let cityAnimals: Set = ["🐦", "🐭"]

houseAnimals.isSubset(of: farmAnimals)      // true
farmAnimals.isSuperset(of: houseAnimals)    // true
farmAnimals.isDisjoint(with: cityAnimals)   // true
```

## Dictionaries

### Creation

```swift
// Dictionary literal
var namesOfIntegers: [Int: String] = [:]
var airports: [String: String] = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]
var airports2 = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]  // Type inferred

// Empty dictionary
var emptyDict = [String: String]()
var emptyDict2: [String: String] = [:]
```

### Accessing and modifying

```swift
var airports = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]

// Count
print("The dictionary contains \(airports.count) items")

// Add/update
airports["LHR"] = "London Heathrow"
airports["LHR"] = "London Heathrow International"

// updateValue returns old value
let oldValue = airports.updateValue("Dublin Airport", forKey: "DUB")

// Remove
airports["APL"] = "Apple International"
airports["APL"] = nil  // Remove by setting to nil

// removeValue returns removed value
if let removedValue = airports.removeValue(forKey: "DUB") {
    print("Removed \(removedValue)")
}

// Access with subscript (returns optional)
if let airportName = airports["YYZ"] {
    print("Airport name: \(airportName)")
}

// Iterate
for (airportCode, airportName) in airports {
    print("\(airportCode): \(airportName)")
}

// Keys and values
for airportCode in airports.keys {
    print("Airport code: \(airportCode)")
}
for airportName in airports.values {
    print("Airport name: \(airportName)")
}

// Convert to array
let airportCodes = [String](airports.keys)
let airportNames = [String](airports.values)
```

## Collection protocols

```swift
// Sequence — anything you can iterate
// Collection — Sequence with indexed access
// BidirectionalCollection — can traverse backward
// RandomAccessCollection — can jump to any index in O(1)
// MutableCollection — can replace elements
// RangeReplaceableCollection — can insert/remove

// Using with generics
func process<C: Collection>(_ collection: C) where C.Element: Equatable {
    for element in collection {
        print(element)
    }
}
```

## Best practices

1. Use arrays for ordered collections
2. Use sets when order doesn't matter and uniqueness is needed
3. Use dictionaries for key-value lookups
4. Prefer `isEmpty` over `count == 0`
5. Use `first`/`last` instead of subscripting when possible
6. Use `contains` instead of manual iteration
7. Use `filter`, `map`, `reduce` for functional transformations
8. Remember arrays, sets, and dictionaries are value types (copied on assignment)
9. Use `enumerated()` when you need index + value
10. Use `sorted()` for deterministic iteration of sets
