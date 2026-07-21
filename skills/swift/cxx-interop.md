# C++ Interoperability

Mixing Swift and C++ — bidirectional interop introduced in Swift 5.9.

## Enabling C++ interoperability

### In SwiftPM

```swift
// Package.swift
.target(
    name: "MyTarget",
    swiftSettings: [
        .interoperabilityMode(.Cxx),  // Enable C++ interop
    ]
)
```

### In Xcode

Build Settings → Swift Compiler - Language → C++ and Objective-C Interoperability → C++

### Command line

```bash
swiftc -cxx-interoperability-mode=default mycode.swift
```

## Importing C++ into Swift

### Creating a Clang module

Create a `module.modulemap` or use SwiftPM's automatic module generation:

```
MyCppLibrary/
├── include/
│   └── MyLibrary.h
├── src/
│   └── MyLibrary.cpp
└── Package.swift (or CMakeLists.txt)
```

### Calling C++ functions

```cpp
// C++ header (MyLibrary.h)
#pragma once
int add(int a, int b);
void printMessage(const char* message);
```

```swift
// Swift
import MyLibrary

let result = add(3, 4)           // 7
printMessage("Hello from Swift") // Calls C++ function
```

### C++ structures and classes

```cpp
// C++
struct Point {
    int x, y;
};

class Rectangle {
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    int area() const { return width * height; }
private:
    int width, height;
};
```

```swift
// Swift — C++ structs/classes are value types by default
let point = Point(x: 3, y: 4)

let rect = Rectangle(w: 10, h: 5)
print(rect.area())  // 50
```

### Constructing C++ types from Swift

```cpp
// C++
class Person {
public:
    Person(std::string name, int age) : name_(name), age_(age) {}
    std::string getName() const { return name_; }
private:
    std::string name_;
    int age_;
};
```

```swift
// Swift
let person = Person(name: "Alice", age: 30)
print(person.getName())  // "Alice"
```

### Accessing data members

```cpp
struct Config {
    int maxConnections;
    bool debug;
    std::string host;
};
```

```swift
var config = Config()
config.maxConnections = 100
config.debug = true
config.host = "localhost"
```

### Calling C++ member functions

```cpp
class Calculator {
public:
    int add(int a, int b) { return a + b; }
    int multiply(int a, int b) const { return a * b; }
    static int square(int x) { return x * x; }
};
```

```swift
let calc = Calculator()
print(calc.add(2, 3))        // 5
print(calc.multiply(4, 5))  // 20
print(Calculator.square(6)) // 36 (static method)
```

### C++ enumerations

```cpp
enum Color {
    Red,
    Green,
    Blue
};

enum class Status {
    Active,
    Inactive,
    Pending
};
```

```swift
let color = Color.Red
let status = Status.Active

switch status {
case .Active: print("Active")
case .Inactive: print("Inactive")
case .Pending: print("Pending")
}
```

### Using C++ type aliases

```cpp
using UserId = int;
typedef std::string Name;
```

```swift
let id: UserId = 42
let name: Name = "Alice"
```

### Using class templates

```cpp
template<typename T>
class Stack {
public:
    void push(T value) { data_.push_back(value); }
    T pop() { T v = data_.back(); data_.pop_back(); return v; }
private:
    std::vector<T> data_;
};
```

```swift
var stack = Stack<Int>()
stack.push(1)
stack.push(2)
print(stack.pop())  // 2
```

## Customizing how C++ maps to Swift

### Renaming C++ APIs in Swift

```cpp
// C++ header
#include <swift/bridging>

struct MyStruct {
    // Renamed in Swift
    SWIFT_NAME("getValue()")
    int get_value() const { return value_; }

    // Mark as property
    SWIFT_NAME("count")
    int getCount() const { return count_; }

private:
    int value_;
    int count_;
};
```

### Mapping getters and setters to computed properties

```cpp
class Temperature {
public:
    SWIFT_COMPUTED_PROPERTY
    double getCelsius() const { return celsius_; }
    void setCelsius(double value) { celsius_ = value; }

private:
    double celsius_;
};
```

```swift
var temp = Temperature()
temp.celsius = 25.0
print(temp.celsius)  // 25.0
```

## Extending C++ types in Swift

```swift
// Extend imported C++ type
extension Rectangle {
    func isSquare() -> Bool {
        return width == height
    }
}

// Conform C++ type to Swift protocol
extension Point: CustomStringConvertible {
    public var description: String {
        return "(\(x), \(y))"
    }
}

// Conform to Equatable
extension Point: Equatable {
    public static func == (lhs: Point, rhs: Point) -> Bool {
        return lhs.x == rhs.x && lhs.y == rhs.y
    }
}
```

## Working with C++ containers

### C++ containers as Swift collections

```cpp
#include <vector>
#include <map>

std::vector<int> getNumbers();
std::map<std::string, int> getScores();
```

```swift
let numbers = getNumbers()
for number in numbers {
    print(number)  // Iterates like a Swift collection
}

// Convert to Swift Array
let swiftArray = Array(numbers)
```

### Converting C++ containers to Swift collections

```swift
let cppVector = getNumbers()
let swiftArray = Array(cppVector)  // [Int]

let cppMap = getScores()
// Convert to Dictionary
var swiftDict: [String: Int] = [:]
for (key, value) in cppMap {
    swiftDict[key] = value
}
```

### Best practices for C++ containers

1. Convert to Swift collections when you need Swift collection APIs
2. Iterate C++ containers directly when possible (they support `for-in`)
3. Avoid large copies — use references when available
4. Be aware that C++ containers are value types in Swift by default

## Mapping C++ types to Swift reference types

### Immortal reference types

```cpp
// C++ types that live forever (no destructor)
struct GlobalConfig {
    static GlobalConfig& instance() { static GlobalConfig c; return c; }
    int value;
};
```

### Shared reference types

```cpp
// SWIFT_SHARED_REF macro for reference-counted types
#include <swift/bridging>

class SWIFT_SHARED_REF(SharedResource) Resource {
public:
    Resource() : refCount_(1) {}
    void addRef() { refCount_++; }
    void release() { if (--refCount_ == 0) delete this; }

    void use() { /* ... */ }

private:
    int refCount_;
};
```

```swift
let resource = Resource()  // Managed by Swift ARC
resource.use()
// Automatically released when Swift reference count drops to 0
```

### Unsafe reference types

```cpp
// SWIFT_UNSAFE_REF — no automatic memory management
class SWIFT_UNSAFE_REF(UnsafeHandle) Handle {
public:
    void process();
};
```

```swift
let handle = UnsafeHandle()  // Manual lifetime management
handle.process()
// Not managed by ARC — must ensure C++ keeps it alive
```

## Using C++ standard library from Swift

### std::string

```cpp
#include <string>
std::string getName();
void setName(const std::string& name);
```

```swift
let name = getName()  // Returns Swift String
setName("Alice")      // Swift String converted to std::string
```

### std::optional

```cpp
#include <optional>
std::optional<int> findValue(const std::string& key);
```

```swift
if let value = findValue(key: "test") {
    print("Found: \(value)")
}
```

### std::function

```cpp
#include <functional>
void setCallback(std::function<void(int)> callback);
```

```swift
setCallback { value in
    print("Callback called with \(value)")
}
```

## Accessing Swift APIs from C++

### Calling Swift functions from C++

```swift
// Swift
@_cdecl("swift_function")
public func swift_function(x: Int32) -> Int32 {
    return x * 2
}
```

```cpp
// C++
extern "C" int32_t swift_function(int32_t x);

int result = swift_function(21);  // 42
```

### Using Swift structures in C++

```swift
// Swift — automatically exposed to C++ when in same module
public struct Vector3 {
    public var x, y, z: Double
    public init(x: Double, y: Double, z: Double) {
        self.x = x; self.y = y; self.z = z
    }
}
```

```cpp
// C++
Vector3 vec = Vector3(1.0, 2.0, 3.0);
std::cout << vec.x << std::endl;
```

### Using Swift classes in C++

```swift
public class SwiftClass {
    public init() {}
    public func doSomething() -> Int { return 42 }
}
```

```cpp
// C++
SwiftClass* obj = new SwiftClass();
int result = obj->doSomething();
delete obj;
```

### Using Swift enumerations in C++

```swift
public enum Status {
    case active
    case inactive
}
```

```cpp
// C++
Status s = Status::active;
```

### Using Swift String in C++

```swift
public func processString(_ s: String) -> String {
    return "Processed: \(s)"
}
```

```cpp
// C++
#include <swift/string.hpp>
swift::String result = processString("hello");
std::string cppResult = result;  // Convert to std::string
```

### Using Swift Array in C++

```swift
public func getNumbers() -> [Int] {
    return [1, 2, 3, 4, 5]
}
```

```cpp
// C++
#include <swift/array.hpp>
swift::Array<int> numbers = getNumbers();
for (int n : numbers) {
    std::cout << n << std::endl;
}
```

### Using Swift Optional in C++

```swift
public func findUser(id: Int) -> User? {
    // ...
}
```

```cpp
// C++
#include <swift/optional.hpp>
swift::Optional<User> user = findUser(42);
if (user.hasValue()) {
    User u = user.value();
    // ...
}
```

## Appendix: Customization macros

| Macro | Purpose |
|-------|---------|
| `SWIFT_NAME(name)` | Rename in Swift |
| `SWIFT_COMPUTED_PROPERTY` | Map getter/setter to property |
| `SWIFT_SHARED_REF(type)` | Reference-counted type |
| `SWIFT_UNSAFE_REF(type)` | Unsafe reference type |
| `SWIFT_IMMORTAL_REF(type)` | Immortal reference type |
| `SWIFT_RETURNS_INDEPENDENT_VALUE` | Independent lifetime |
| `SWIFT_RETURNS_DEPENDENT_VALUE` | Dependent lifetime |

## Best practices

1. Enable C++ interop with `.interoperabilityMode(.Cxx)` in SwiftPM
2. Use `SWIFT_NAME` to make C++ APIs more Swift-like
3. Use `SWIFT_COMPUTED_PROPERTY` for getter/setter pairs
4. Extend C++ types in Swift to add protocol conformance
5. Convert C++ containers to Swift collections when you need full Swift APIs
6. Use `SWIFT_SHARED_REF` for reference-counted C++ types
7. Use `@_cdecl` to expose Swift functions to C++
8. Be aware of value vs reference semantics when importing C++ types
9. Test mixed-language code thoroughly — interop is still evolving
10. Check the [C++ interop status page](https://www.swift.org/documentation/cxx-interop/status) for supported features
