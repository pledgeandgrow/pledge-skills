# Strings and Characters

String and Character types in Swift — Unicode-safe, value type, with rich API.

## String literals

```swift
let someString = "Some string literal value"

// Multi-line string literals
let quotation = """
    The White Rabbit put on his spectacles.
    "Where shall I begin, please your Majesty?" he asked.
    "Begin at the beginning," the King said gravely, "and go on
    till you come to the end; then stop."
    """

// Line breaks and indentation
let softQuoted = """
    This string doesn't have a line break
    """

// Escaping
let escaped = "A \\ B"           // A \ B
let tab = "A\tB"                  // A    B
let newline = "A\nB"              // A (newline) B
let unicode = "\u{1F600}"         // 😀
```

## Initializing empty strings

```swift
var emptyString = ""
var anotherEmptyString = String()

// Check if empty
if emptyString.isEmpty {
    print("Nothing to see here")
}
```

## String mutability

```swift
var variableString = "Horse"
variableString += " and carriage"  // "Horse and carriage"

let constantString = "Highlander"
// constantString += " and another Highlander"  // Error: constant
```

## Strings are value types

```swift
// Strings are copied when passed or assigned
var original = "Hello"
var copy = original
copy += " World"
print(original)  // "Hello" (unchanged)
print(copy)      // "Hello World"
```

## Characters

```swift
for character in "Dog!🐶" {
    print(character)
}
// D, o, g, !, 🐶

let catCharacters: [Character] = ["C", "a", "t", "!", "🐱"]
let catString = String(catCharacters)
print(catString)  // "Cat!🐱"
```

## Concatenation

```swift
let string1 = "hello"
let string2 = " there"
var welcome = string1 + string2  // "hello there"

// Append
var instruction = "look over"
instruction += string2  // "look over there"

// Append character
let exclamationMark: Character = "!"
welcome.append(exclamationMark)  // "hello there!"
```

## String interpolation

```swift
let multiplier = 3
let message = "\(multiplier) times 2.5 is \(Double(multiplier) * 2.5)"
// "3 times 2.5 is 7.5"

// Multi-line interpolation
let multiLine = """
    \(multiplier) times 2.5
    is \(Double(multiplier) * 2.5)
    """

// Extended string delimiters (Swift 5+)
// Use # to include literal \( in interpolation
let result = #"The result is \(#"interpolated")"#
```

## Unicode

```swift
// Unicode scalar values
let dollarSign = "\u{24}"        // $
let blackHeart = "\u{2665}"       // ♥
let sparklingHeart = "\u{1F496}"  // 💖

// Counting characters
let unusualMenagerie = "Koala 🐨, Snail 🐌, Penguin 🐧, Dromedary 🐪"
print("unusualMenagerie has \(unusualMenagerie.count) characters")
// 40 characters

// String indices (not integer-indexed)
let greeting = "Guten Tag!"
greeting[greeting.startIndex]         // G
greeting[greeting.index(before: greeting.endIndex)]  // !
greeting[greeting.index(after: greeting.startIndex)]  // u
let index = greeting.index(greeting.startIndex, offsetBy: 7)
greeting[index]  // a

// Inserting
var welcome = "hello"
welcome.insert("!", at: welcome.endIndex)  // "hello!"
welcome.insert(contentsOf: " there", at: welcome.index(before: welcome.endIndex))
// "hello there!"

// Removing
welcome.remove(at: welcome.index(before: welcome.endIndex))
// "hello there"

// Substrings
let greeting = "Hello, world!"
let index = greeting.firstIndex(of: ",") ?? greeting.endIndex
let beginning = greeting[..<index]  // "Hello"
let newString = String(beginning)   // Convert Substring to String
```

## Substrings

```swift
// Substrings share memory with original string (performance)
let greeting = "Hello, world!"
if let commaIndex = greeting.firstIndex(of: ",") {
    let substring = greeting[..<commaIndex]  // Substring
    let newString = String(substring)  // String (creates new storage)
}
```

## Comparing strings

```swift
// String equality
let quotation = "We're a lot alike, you and I."
let sameQuotation = "We're a lot alike, you and I."
if quotation == sameQuotation {
    print("These strings are equal")
}

// Prefix and suffix
let romeoAndJuliet = """
    Two households, both alike in dignity
    """
if romeoAndJuliet.hasPrefix("Two") {
    print("Starts with Two")
}
if romeoAndJuliet.hasSuffix("dignity") {
    print("Ends with dignity")
}
```

## Unicode scalar properties

```swift
let character: Character = "é"
print(character.isLetter)      // true
print(character.isNumber)      // false
print(character.isUppercase)   // false
print(character.isLowercase)   // true
print(character.isWhitespace)  // false
print(character.isPunctuation) // false

// Unicode scalar view
for scalar in "café".unicodeScalars {
    print("\(scalar) ", terminator: "")
}
// c a f é
```

## Common string methods

```swift
let str = "Hello, World!"

// Properties
str.count                          // 13
str.isEmpty                        // false
str.hasPrefix("Hello")             // true
str.hasSuffix("World!")            // true
str.lowercased()                   // "hello, world!"
str.uppercased()                   // "HELLO, WORLD!"
str.trimmingCharacters(in: .whitespaces)  // Remove whitespace

// Splitting
let parts = "a,b,c".split(separator: ",")  // ["a", "b", "c"]
let parts2 = "a,b,,c".split(separator: ",", omittingEmptySubsequences: false)

// Replacing
let replaced = "Hello World".replacingOccurrences(of: "World", with: "Swift")

// Contains
"Hello".contains("ell")           // true
"Hello".contains("xyz")           // false

// First/last index
let firstIndex = "Hello".firstIndex(of: "l")  // Index of first 'l'
let lastIndex = "Hello".lastIndex(of: "l")    // Index of last 'l'
```

## String indexing best practices

```swift
// Don't use integer indexing — use String methods
// Bad: str[0]  (not valid in Swift)
// Good:
let first = str.first              // Character?
let last = str.last                // Character?
let index = str.firstIndex(of: "o")  // String.Index?

// Safe subscripting
if let index = str.firstIndex(of: "o") {
    let char = str[index]
}
```

## Multi-line string best practices

```swift
// Use """ for multi-line text
let html = """
    <html>
        <body>
            <h1>\(title)</h1>
        </body>
    </html>
    """

// Raw strings with # delimiters
let rawString = #"This contains \n literal characters"#
let rawMultiLine = #"""
    Multi-line raw string
    with \(interpolation) disabled
    """#
```
