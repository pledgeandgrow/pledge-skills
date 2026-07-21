# Access Control

Access control restricts access to parts of your code from code in other source files and modules.

## Modules and Source Files

- **Module**: A single unit of code distribution (a framework or application built and shipped as a single unit). Use `import` to use a module.
- **Source file**: A single Swift source code file within a module.

## Access Levels

Swift provides five access levels, from lowest to highest:

| Level | Description | Scope |
|-------|-------------|-------|
| `private` | Restricted to enclosing declaration | Same file, same scope |
| `fileprivate` | Restricted to source file | Same file |
| `internal` | Restricted to module | Same module (default) |
| `public` | Visible to other modules | Any module that imports |
| `open` | Public + subclassable/overridable | Any module (classes only) |

### Default access

```swift
// Default is internal
struct SomeStruct {
    var someProperty = 42  // internal by default
}
```

### private

```swift
class SomeClass {
    private var privateProperty = 42

    private func privateMethod() {
        // Only accessible within this class (same file)
    }

    func publicMethod() {
        privateMethod()  // OK — same scope
        print(privateProperty)  // OK
    }
}

// Extension in same file can access private members
extension SomeClass {
    func extensionMethod() {
        print(privateProperty)  // OK — same file, same type
    }
}
```

### fileprivate

```swift
struct SomeStruct {
    fileprivate var fileProperty = 42

    fileprivate func fileMethod() {
        // Accessible anywhere in the same source file
    }
}

// Same file — can access fileprivate
let instance = SomeStruct()
print(instance.fileProperty)  // OK — same file
```

### internal

```swift
// No keyword needed — internal is the default
struct InternalStruct {
    var value: Int  // internal by default
}

// Explicit internal
internal struct ExplicitInternal {
    internal var property: String
}
```

### public

```swift
public struct PublicStruct {
    public var publicProperty: Int
    public func publicMethod() { }

    // Non-public members stay internal
    var internalProperty: String  // internal, not public
}

// Public class — but methods need explicit public
public class PublicClass {
    public init() { }

    public func publicMethod() { }

    func internalMethod() { }  // internal, not public
}
```

### open

```swift
// open — can be subclassed and overridden from other modules
open class OpenClass {
    public init() { }

    open func canBeOverridden() { }

    public func cannotBeOverridden() { }
}

// In another module:
class Subclass: OpenClass {
    override func canBeOverridden() { }  // OK — open
    // override func cannotBeOverridden() { }  // Error — public, not open
}
```

## Guiding Principle of Access Levels

- A **public** variable cannot have a type that is **internal** or **private** (the type must be at least as accessible as the variable)
- A function with higher access cannot have parameters with lower access

```swift
// Error: public function cannot take internal parameter type
// public func process(_ value: InternalType) { }

// OK: public function with public parameter type
public func process(_ value: PublicType) { }
```

## Default Member Access

```swift
// Public struct — members are internal by default
public struct Counter {
    var count = 0  // internal, not public
    func increment() { count += 1 }  // internal
}

// To make members public, mark them explicitly
public struct PublicCounter {
    public var count = 0
    public func increment() { count += 1 }
    public init() {}
}
```

## Access Levels for Tuple Types

```swift
// Tuple access level is the most restrictive of its members
// A tuple of (internal, public) is internal
```

## Access Levels for Function Types

```swift
// Function type access is the minimum of parameter and return types
internal func internalFunction() -> PublicType { /* ... */ }
// This function's type is internal (minimum of internal and public)
```

## Enumeration Types

```swift
// Enum cases have the same access level as the enum
public enum CompassPoint {
    case north, south, east, west  // All public
}

// Enum raw values must be at least as accessible
public enum Status: Int {
    case active = 1  // Int is public — OK
}
```

## Subclassing

```swift
public class BaseClass {
    public func baseMethod() {}
}

// Subclass cannot be more accessible than superclass
// public class SubClass: BaseClass {}  // OK — same level
// internal class SubClass: BaseClass {}  // OK — lower level

// Override with same or higher access
public class SubClass: BaseClass {
    override public func baseMethod() {
        super.baseMethod()
    }
}
```

## Constants, Variables, Properties, and Subscripts

```swift
// A public property cannot have a private type
// private struct PrivateType {}
// public var publicVar: PrivateType  // Error

// Getter and setter can have different access levels
public struct TrackedValue {
    private(set) var internalValue: Int = 0  // get=public, set=private

    public var value: Int {
        get { internalValue }
        set { internalValue = newValue }
    }
}
```

### Read-only public, private setter

```swift
public struct Counter {
    public private(set) var count = 0  // Read publicly, write privately

    public mutating func increment() {
        count += 1
    }
}

let counter = Counter()
print(counter.count)  // OK — public getter
// counter.count = 5  // Error — private setter
```

## Initializers

```swift
public class PublicClass {
    public var name: String

    // Required public initializer
    public required init(name: String) {
        self.name = name
    }

    // Convenience initializer
    public convenience init() {
        self.init(name: "Default")
    }
}

// A public initializer must accept parameters at least as accessible
```

## Protocols

```swift
// Protocol access level applies to all requirements
public protocol PublicProtocol {
    var requirement: String { get }
    func methodRequirement()
}

// Conforming type must be at least as accessible as protocol
public class PublicClass: PublicProtocol {
    public var requirement: String = ""
    public func methodRequirement() {}
}
```

## Extensions

```swift
// Extension access level
public extension Int {
    var doubled: Int { self * 2 }
}

// Private extension — all members are private
private extension String {
    var reversed_: String { String(reversed()) }
}

// Add protocol conformance with extension
extension SomeType: SomeProtocol {
    // Members are internal by default (or match the type's access)
}
```

## Type Aliases

```swift
// Type alias access cannot be higher than the aliased type
public typealias PublicAlias = PublicType  // OK
// public typealias PublicAlias = InternalType  // Error
internal typealias InternalAlias = InternalType  // OK
```

## Access Control in Practice

### Library API design

```swift
// Public API surface
public struct User {
    public let id: UUID
    public let name: String
    public let email: String

    // Internal initializer — only library can create
    internal init(id: UUID, name: String, email: String) {
        self.id = id
        self.name = name
        self.email = email
    }
}

// Public facade, private implementation
public struct UserService {
    private let client: APIClient  // Private implementation detail
    private let cache: [UUID: User] = [:]

    public init(client: APIClient) {
        self.client = client
    }

    public func getUser(id: UUID) async throws -> User {
        // Implementation hidden
    }
}
```

### Testing access

```swift
// Use internal for testable code
// Use @testable import to access internal members in tests

// In tests:
// @testable import MyModule
// Now internal members are accessible
```

## Best practices

1. Use `internal` (default) for most code — only mark things `public` when needed
2. Use `private` for implementation details within a type
3. Use `fileprivate` when multiple types in the same file need shared access
4. Use `public` for API surface of a library/framework
5. Use `open` only when you want to allow subclassing/overriding from other modules
6. Use `public private(set)` for read-only public properties with internal mutation
7. Keep public API minimal — expose only what consumers need
8. Use `@testable import` in tests to access internal members
9. A public type's members are not automatically public — mark them explicitly
10. Don't use `open` unless you specifically design for subclassing
