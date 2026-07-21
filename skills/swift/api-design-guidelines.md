# API Design Guidelines

Swift API Design Guidelines from the official Swift.org documentation.

## Fundamentals

- **Clarity at the point of use is your most important goal.** Entities are declared once but used repeatedly. Design APIs to make uses clear and concise. Always examine a use case to ensure it looks clear in context.
- **Clarity is more important than brevity.** Swift code can be compact, but enabling the smallest possible code is a non-goal. Brevity is a side-effect of the strong type system and features that reduce boilerplate.
- **Write a documentation comment for every declaration.** Insights gained by writing documentation can have a profound impact on your design.

### Documentation comments

```swift
/// Returns a "view" of `self` containing the same elements in
/// reverse order.
func reversed() -> ReverseCollection<Self>

/// Inserts `newHead` at the beginning of `self`.
mutating func prepend(_ newHead: Int)

/// Returns a `List` containing `head` followed by the elements
/// of `self`.
func prepending(_ head: Element) -> List

/// Removes and returns the first element of `self` if non-empty;
/// returns `nil` otherwise.
mutating func popFirst() -> Element?

/// Accesses the `index`th element.
subscript(index: Int) -> Element { get set }

/// Creates an instance containing `n` repetitions of `x`.
init(count n: Int, repeatedElement x: Element)

/// A collection that supports equally efficient insertion/removal
/// at any position.
struct List {
    /// The element at the beginning of `self`, or `nil` if self is
    /// empty.
    var first: Element?
}
```

## Naming

### Promote clear usage

- **Include all the words needed to avoid ambiguity** at the use site:

```swift
extension List {
    public mutating func remove(at position: Index) -> Element
}
employees.remove(at: x)  // Clear: removing at position x

// Not:
employees.remove(x)  // Unclear: are we removing x?
```

- **Omit needless words.** Every word should convey salient information:

```swift
// Bad — "Element" repeats type info
public mutating func removeElement(_ member: Element) -> Element?
allViews.removeElement(cancelButton)

// Good
public mutating func remove(_ member: Element) -> Element?
allViews.remove(cancelButton)
```

- **Name variables, parameters, and associated types according to their roles**, not their type constraints:

```swift
// Bad
var string = "Hello"
protocol ViewController { associatedtype ViewType: View }
func restock(from widgetFactory: WidgetFactory)

// Good
var greeting = "Hello"
protocol ViewController { associatedtype ContentView: View }
func restock(from supplier: WidgetFactory)
```

- **Compensate for weak type information** to clarify a parameter's role:

```swift
// Bad — vague at use site
func add(_ observer: NSObject, for keyPath: String)
grid.add(self, for: graphics)

// Good — role nouns clarify
func addObserver(_ observer: NSObject, forKeyPath path: String)
grid.addObserver(self, forKeyPath: graphics)
```

### Strive for fluent usage

- **Prefer method and function names that make use sites form grammatical English phrases:**

```swift
x.insert(y, at: z)         // "insert y at z"
x.subscript(y, in: z)      // "subscript y in z"
```

- **Begin names of methods that manufacture** with "make":

```swift
x.makeIterator()  // Good
```

- **Factory methods** should follow `make` + noun pattern.

- **Side-effectful mutating methods** should read as imperative verb phrases:

```swift
x.sort()                  // Mutating, in-place
x.append(y)               // Mutating
```

- **Non-mutating methods** should read as noun phrases or with "ed"/"ing" suffix:

```swift
x.sorted()                // Non-mutating, returns new
x.appending(y)            // Non-mutating, returns new
```

- **Boolean or non-mutating properties** should read as assertions:

```swift
x.isEmpty
line1.intersects(line2)
```

- **Protocols that describe what something is** should read as nouns:

```swift
Collection
IteratorProtocol
```

- **Protocols that describe a capability** should use "-able", "-ible", or "-ing" suffixes:

```swift
Equatable
Hashable
ExpressibleByStringLiteral
```

### Use terminology well

- **Don't surprise experts** — use terms with established meaning.
- **Avoid obscure terms** — if a common word works, use it.
- **Embrace established precedents** — don't invent new terms for well-known concepts.

## Conventions

### General conventions

- **Document the complexity** of any computed property that is not O(1):

```swift
/// O(n) — must traverse the entire collection
var count: Int { /* ... */ }
```

- **Prefer methods and properties to free functions.** Use free functions only:
  - When there's no obvious `self`: `min(x, y, z)`
  - When the function is an unconstrained generic: `print(x)`
  - When function syntax is part of the domain: `sin(x)`

- **Follow case conventions.** Types and protocols are `UpperCamelCase`. Everything else is `lowerCamelCase`.

```swift
// Acronyms commonly all-upper in English: uniformly up- or down-cased
var utf8Bytes: [UTF8.CodeUnit]
var isRepresentableAsASCII = true
var userSMTPServer: SecureSMTPServer

// Other acronyms treated as ordinary words:
var radarDetector: RadarScanner
var enjoysScubaDiving = true
```

- **Methods can share a base name** when they share the same meaning or operate in distinct domains:

```swift
extension Shape {
    func contains(_ other: Point) -> Bool { ... }
    func contains(_ other: Shape) -> Bool { ... }
    func contains(_ other: LineSegment) -> Bool { ... }
}

extension Collection where Element: Equatable {
    func contains(_ sought: Element) -> Bool { ... }
}
```

- **Avoid overloading on return type** — it causes ambiguities with type inference.

- Choose good parameter names: `value`, `newValue`, `self`, etc.

### Parameters

```swift
// Use weakly-typed parameters when the use is "obvious"
func merge(_ other: Set<Element>) -> Set<Element>

// When the role is unclear, add a noun before the weakly-typed parameter
func addObserver(_ observer: NSObject, forKeyPath path: String)

// Label unused parameters with _ to suppress warnings
func move(from start: Point, to end: Point)
```

### Argument labels

```swift
func move(from start: Point, to end: Point)
x.move(from: x, to: y)

// Omit all labels when arguments can't be usefully distinguished
min(number1, number2)
zip(sequence1, sequence2)

// In value-preserving type conversions, omit first argument label
extension String {
    init(_ x: BigInt, radix: Int = 10)
}
text += String(veryLargeNumber)
text += String(veryLargeNumber, radix: 16)

// In narrowing type conversions, use a label that describes the narrowing
extension UInt32 {
    init(_ value: Int16)              // Widening — no label
    init(truncating source: UInt64)   // Narrowing — label
    init(saturating valueToApproximate: UInt64)  // Narrowing — label
}

// When first argument forms part of a prepositional phrase, give it a label
x.removeBoxes(havingLength: 12)

// When first two arguments form a single abstraction, begin label after preposition
a.moveTo(x: b, y: c)
a.fadeFrom(red: b, green: c, blue: d)

// When first argument forms part of a grammatical phrase, omit its label
x.addSubview(y)
view.dismiss(animated: false)  // "dismiss" + "animated" reads well

// Label arguments with default values
let text = words.split(maxSplits: 12)
```

### Special instructions

- **Labeling closure parameters** — closure parameters should be labeled at the use site for clarity.
- **Type inference** — avoid types that are ambiguous without explicit context.
- Use `#filePath` instead of `#file` for privacy and space efficiency.

## Best practices

1. Always read the use site — declarations alone are insufficient
2. Write documentation comments before finalizing API design
3. Use `ed`/`ing` suffixes for non-mutating variants of mutating methods
4. Name protocols as nouns (what) or with `-able`/`-ible`/`-ing` (capability)
5. Omit argument labels only when the meaning is obvious at the use site
6. Prefer methods over free functions when there's an obvious `self`
7. Document non-O(1) complexity for computed properties
8. Avoid overloading on return type alone
9. Use established terminology correctly — don't surprise domain experts
10. Clarity > brevity — Swift's brevity comes from the type system, not terse naming
