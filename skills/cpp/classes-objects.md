# Classes and Objects

## Class Definition

```cpp
class Person {
    // Access specifiers
private:        // accessible only within class (default for class)
    std::string name;
    int age;

protected:      // accessible within class and derived classes
    void internalMethod() {}

public:         // accessible from anywhere
    // Constructor
    Person(const std::string& name, int age) 
        : name(name), age(age) {}  // member initializer list

    // Default constructor
    Person() : name("unknown"), age(0) {}

    // Destructor
    ~Person() {
        // cleanup resources
    }

    // Methods
    const std::string& getName() const { return name; }
    int getAge() const { return age; }
    void setAge(int a) { age = a; }
};

// struct — same as class but default access is public
struct Point {
    double x, y;  // public by default
    Point(double x = 0, double y = 0) : x(x), y(y) {}
};
```

## Constructors

```cpp
class Widget {
    std::string name;
    int* data;
    size_t size;

public:
    // Default constructor
    Widget() : name("default"), data(nullptr), size(0) {}

    // Parameterized constructor
    Widget(const std::string& n, size_t s) 
        : name(n), size(s), data(new int[s]()) {}

    // Constructor with initializer_list
    Widget(std::initializer_list<int> init) 
        : name("list"), size(init.size()), data(new int[init.size()]) {
        std::copy(init.begin(), init.end(), data);
    }

    // Delegating constructor (C++11)
    Widget() : Widget("default", 0) {}  // delegates to another constructor
    Widget(const std::string& n) : Widget(n, 10) {}

    // Explicit constructor — prevents implicit conversion
    explicit Widget(int s) : Widget("explicit", s) {}

    // constexpr constructor (C++11)
    constexpr Widget(const char* n, int s) 
        : name(n), data(nullptr), size(s) {}
};

// Construction
Widget w1;                          // default
Widget w2("hello", 5);              // parameterized
Widget w3{1, 2, 3, 4, 5};           // initializer_list
Widget w4 = {"a", "b"};             // initializer_list (implicit)
Widget w5(10);                      // explicit constructor (direct init)
// Widget w6 = 10;                  // error: explicit prevents implicit conversion
auto w7 = Widget(10);               // OK: explicit
```

## Copy and Move Semantics

```cpp
class Buffer {
    char* data;
    size_t size;

public:
    // Constructor
    Buffer(size_t s) : data(new char[s]), size(s) {}

    // Destructor
    ~Buffer() { delete[] data; }

    // Copy constructor
    Buffer(const Buffer& other) 
        : data(new char[other.size]), size(other.size) {
        std::memcpy(data, other.data, size);
    }

    // Copy assignment operator
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {  // self-assignment check
            delete[] data;
            data = new char[other.size];
            size = other.size;
            std::memcpy(data, other.data, size);
        }
        return *this;
    }

    // Move constructor (C++11)
    Buffer(Buffer&& other) noexcept 
        : data(other.data), size(other.size) {
        other.data = nullptr;  // leave source in valid empty state
        other.size = 0;
    }

    // Move assignment operator (C++11)
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};

// Copy
Buffer b1(1024);
Buffer b2 = b1;      // copy constructor
Buffer b3(b1);       // copy constructor
b3 = b2;             // copy assignment

// Move
Buffer b4 = std::move(b1);  // move constructor (b1 is now empty)
b4 = Buffer(512);           // move assignment (temporary moved)
```

### Rule of Zero (C++11, preferred)

```cpp
// Let the compiler handle everything — use RAII types
class GoodBuffer {
    std::vector<char> data;  // handles copy/move/destruction

public:
    GoodBuffer(size_t s) : data(s) {}
    // No need for copy/move/destructor — vector handles it
    // Compiler-generated special members are correct
};
```

### Rule of Three (pre-C++11)

```cpp
// If you define any of: destructor, copy constructor, copy assignment
// You probably need all three
class OldClass {
    resource* ptr;
public:
    OldClass() : ptr(acquire()) {}
    ~OldClass() { release(ptr); }
    OldClass(const OldClass& o) : ptr(clone(o.ptr)) {}
    OldClass& operator=(const OldClass& o) {
        if (this != &o) {
            release(ptr);
            ptr = clone(o.ptr);
        }
        return *this;
    }
};
```

### Rule of Five (C++11)

```cpp
// If you define any special member, define all five
class ModernClass {
    resource* ptr;
public:
    ModernClass() : ptr(acquire()) {}
    ~ModernClass() { release(ptr); }
    ModernClass(const ModernClass& o) : ptr(clone(o.ptr)) {}
    ModernClass& operator=(const ModernClass& o) {
        if (this != &o) { release(ptr); ptr = clone(o.ptr); }
        return *this;
    }
    ModernClass(ModernClass&& o) noexcept : ptr(o.ptr) { o.ptr = nullptr; }
    ModernClass& operator=(ModernClass&& o) noexcept {
        if (this != &o) { release(ptr); ptr = o.ptr; o.ptr = nullptr; }
        return *this;
    }
};
```

## RAII (Resource Acquisition Is Initialization)

```cpp
// RAII — resources are acquired in constructors, released in destructors
// Scope exit guarantees cleanup (even on exceptions)

class FileGuard {
    FILE* file;
public:
    explicit FileGuard(const char* path) : file(fopen(path, "r")) {
        if (!file) throw std::runtime_error("Cannot open file");
    }
    ~FileGuard() { if (file) fclose(file); }
    
    // Delete copy (file handle is unique)
    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;
    
    // Allow move
    FileGuard(FileGuard&& o) noexcept : file(o.file) { o.file = nullptr; }
    
    FILE* get() const { return file; }
};

// Usage — cleanup automatic at scope exit
{
    FileGuard f("data.txt");
    // use f.get()
}  // fclose called automatically

// Standard RAII types: unique_ptr, shared_ptr, lock_guard, unique_lock, etc.
```

## Inheritance

```cpp
class Animal {
protected:
    std::string name;

public:
    Animal(const std::string& n) : name(n) {}
    virtual ~Animal() = default;  // virtual destructor for polymorphic base

    virtual void speak() const {  // virtual — can be overridden
        std::cout << name << " makes a sound\n";
    }

    virtual void move() = 0;  // pure virtual — must be overridden (abstract class)
};

class Dog : public Animal {  // public inheritance
public:
    Dog(const std::string& n) : Animal(n) {}

    void speak() const override {  // override (C++11)
        std::cout << name << " says Woof\n";
    }

    void move() override {
        std::cout << name << " runs\n";
    }
};

class Cat : public Animal {
public:
    Cat(const std::string& n) : Animal(n) {}

    void speak() const override {
        std::cout << name << " says Meow\n";
    }

    void move() override {
        std::cout << name << " walks\n";
    }
};

// Polymorphism
Animal* a = new Dog("Rex");
a->speak();  // "Rex says Woof" (virtual dispatch)
a->move();   // "Rex runs"
delete a;

// Final class — cannot be inherited
class FinalDog final : public Animal { ... };
// class SuperDog : public FinalDog {};  // error: final

// Final method — cannot be overridden
class Base {
public:
    virtual void func() final;  // cannot be overridden in derived
};
```

### Multiple Inheritance

```cpp
class Drawable {
public:
    virtual void draw() const = 0;
    virtual ~Drawable() = default;
};

class Serializable {
public:
    virtual void serialize(std::ostream& os) const = 0;
    virtual ~Serializable() = default;
};

class Shape : public Drawable, public Serializable {
    double area;
public:
    Shape(double a) : area(a) {}
    void draw() const override { std::cout << "Drawing shape\n"; }
    void serialize(std::ostream& os) const override { os << area; }
};

// Virtual inheritance (to solve diamond problem)
class Base { public: int value; };
class A : virtual public Base {};
class B : virtual public Base {};
class C : public A, public B {
public:
    // Only one Base subobject (shared)
    void set(int v) { value = v; }  // not ambiguous
};
```

## Access Specifiers

```cpp
class MyClass {
private:        // only this class (and friends)
    int privateVar;

protected:      // this class and derived classes
    int protectedVar;

public:         // anyone
    int publicVar;
};

// Inheritance access
class Pub : public Base {};     // public members stay public
class Prot : protected Base {}; // public members become protected
class Priv : private Base {};   // public members become private (default for class)

// struct inheritance defaults to public
struct S : Base {};  // same as public Base
```

## Static Members

```cpp
class Counter {
    static int count;  // declaration
    int id;

public:
    Counter() : id(++count) {}
    
    static int getCount() { return count; }  // static method
    static inline int max = 100;  // static inline member (C++17)
};

int Counter::count = 0;  // definition (in .cpp)
// C++17: inline static — can define in header
// static inline int Counter::count = 0;  // in class definition

// Usage
Counter c1, c2, c3;
std::cout << Counter::getCount();  // 3
std::cout << Counter::max;         // 100
```

## Friend

```cpp
class Account {
    double balance;
    
    friend void audit(const Account&);  // friend function
    friend class Bank;                   // friend class

public:
    Account(double b) : balance(b) {}
};

void audit(const Account& a) {
    std::cout << a.balance;  // can access private members
}

class Bank {
public:
    void printBalance(const Account& a) {
        std::cout << a.balance;  // can access private members
    }
};

// Friend function defined inside class (C++11)
class Logger {
    int level;
public:
    Logger(int l) : level(l) {}
    
    friend std::ostream& operator<<(std::ostream& os, const Logger& l) {
        return os << "Logger(" << l.level << ")";  // can access private
    }
};
```

## Nested Classes

```cpp
class Outer {
    int outerVar;

public:
    class Inner {
    public:
        void func(Outer& o) {
            // C++11: Inner can access Outer's private members
            o.outerVar = 42;
        }
    };

    Inner inner;
};

// Usage
Outer o;
Outer::Inner inner;
inner.func(o);
```

## Aggregate Types and PODs

```cpp
// Aggregate (C++20 expanded definition)
struct Point {
    double x, y;
};

Point p{10.0, 20.0};  // aggregate initialization
Point p2 = {10.0, 20.0};

// C++20: aggregate with using-declaration and user-declared constructors
struct Base { int a; };
struct Derived : Base { int b; };
Derived d{{1}, 2};  // {1} for Base, 2 for b

// C++17: aggregate with base classes
struct A { int a; };
struct B : A { int b; };
B b{{1}, 2};  // base first, then members

// POD (Plain Old Data) — standard-layout + trivial
static_assert(std::is_pod_v<Point>);  // true (pre-C++20)
// C++20: is_pod deprecated — use is_standard_layout + is_trivial separately
static_assert(std::is_standard_layout_v<Point>);
static_assert(std::is_trivial_v<Point>);
```

## Designated Initializers (C++20)

```cpp
struct Config {
    int port = 80;
    std::string host = "localhost";
    bool verbose = false;
    int timeout = 30;
};

Config c{
    .port = 8080,
    .host = "example.com",
    .verbose = true,
    // .timeout = 30  // omitted → uses default
};

// Must be in declaration order
// Config c{.verbose = true, .port = 8080};  // error: wrong order
```

## User-Defined Literals

```cpp
// User-defined literal (UDL)
constexpr long double operator""_km(long double x) { return x * 1000.0L; }
constexpr long double operator""_m(long double x) { return x; }
constexpr long double operator""_cm(long double x) { return x / 100.0L; }

auto distance = 5.0_km;   // 5000.0
auto d2 = 100.0_m;        // 100.0
auto d3 = 50.0_cm;        // 0.5

// String literal
std::string operator""_s(const char* str, size_t len) {
    return std::string(str, len);
}
auto s = "hello"_s;  // std::string("hello")

// Standard library UDLs
using namespace std::string_literals;
auto s2 = "hello"s;  // std::string

using namespace std::chrono_literals;
auto dur = 1h + 30min + 15s;  // std::chrono::duration

using namespace std::complex_literals;
auto z = 3.0 + 4.0i;  // std::complex<double>
```

## Unions

```cpp
// Union — all members share the same memory location
union Data {
    int i;
    float f;
    char s[4];
};

Data d;
d.i = 42;
std::cout << d.i;  // 42
d.f = 3.14f;
// d.i is now undefined (only one member active at a time)
std::cout << d.f;  // 3.14

// Anonymous union — members are directly accessible
struct Variant {
    union {
        int i;
        float f;
    };
    enum Type { INT, FLOAT } type;
};

Variant v;
v.type = Variant::INT;
v.i = 42;

// Union with non-trivial members (C++11 — requires explicit destructor)
union StringUnion {
    int i;
    std::string s;  // non-trivial destructor

    StringUnion() : i(0) {}
    ~StringUnion() {}  // must handle s's destructor manually
};

StringUnion su;
new (&su.s) std::string("hello");
std::cout << su.s;
su.s.~basic_string();  // explicit destructor

// std::variant is preferred over unions in modern C++
std::variant<int, float, std::string> v2 = 42;
```

## Bit Fields

```cpp
// Bit fields — specify exact number of bits for a member
struct Flags {
    unsigned int a : 1;    // 1 bit  (0-1)
    unsigned int b : 3;    // 3 bits (0-7)
    unsigned int c : 4;    // 4 bits (0-15)
    unsigned int   : 0;    // alignment: next field starts at next word
    unsigned int d : 8;    // 8 bits (0-255)
};

Flags f;
f.a = 1;
f.b = 5;
f.c = 10;
f.d = 200;
// sizeof(Flags) is typically 4 or 8 bytes depending on packing

// Practical: hardware register layout
struct UARTRegister {
    volatile uint32_t data       : 8;
    volatile uint32_t parity     : 1;
    volatile uint32_t stop_bits  : 2;
    volatile uint32_t            : 5;  // reserved
    volatile uint32_t enable     : 1;
    volatile uint32_t interrupt  : 1;
    volatile uint32_t            : 14; // padding to 32 bits
};

// Bit fields and bit manipulation
struct Color {
    unsigned r : 8;  // red
    unsigned g : 8;  // green
    unsigned b : 8;  // blue
    unsigned a : 8;  // alpha
};

Color c{255, 128, 0, 255};
// Cannot take address of bit field: &c.r is illegal
```

## Enumerations

```cpp
// Unscoped enum (C-style) — values leak into enclosing scope
enum Color { Red, Green, Blue };
Color c = Red;  // no scope qualifier needed
int x = Red;    // implicit conversion to int (can be surprising)

// Scoped enum (C++11) — values are scoped
enum class Color2 { Red, Green, Blue };
Color2 c2 = Color2::Red;  // must qualify
// int x2 = Color2::Red;  // error: no implicit conversion
int x2 = static_cast<int>(Color2::Red);  // explicit cast required

// Specify underlying type
enum class Status : uint8_t {
    Ok = 0,
    Error = 1,
    Pending = 2,
    Timeout = 255
};
// sizeof(Status) == 1

enum class Flags : unsigned int {
    None = 0,
    Read = 1,
    Write = 2,
    Execute = 4
};

// Bitwise operations on enums (need operator overloads or C++23)
Flags f1 = Flags::Read | Flags::Write;  // needs operator| defined
// C++23: std::to_underlying
int val = std::to_underlying(Flags::Read);  // 1

// using enum (C++20) — bring enum values into scope
enum class Direction { Up, Down, Left, Right };
void move(Direction d) {
    using enum Direction;
    switch (d) {
        case Up:    break;
        case Down:  break;
        case Left:  break;
        case Right: break;
    }
}

// Enum with custom values
enum class HttpStatus : int {
    OK = 200,
    NotFound = 404,
    InternalError = 500
};

// Enum to string (common pattern)
enum class Fruit { Apple, Banana, Cherry };

constexpr std::string_view fruitToString(Fruit f) {
    switch (f) {
        case Fruit::Apple:  return "Apple";
        case Fruit::Banana: return "Banana";
        case Fruit::Cherry: return "Cherry";
    }
    return "Unknown";
}

// String to enum (C++26: reflection may automate this)
constexpr std::optional<Fruit> stringToFruit(std::string_view s) {
    if (s == "Apple")  return Fruit::Apple;
    if (s == "Banana") return Fruit::Banana;
    if (s == "Cherry") return Fruit::Cherry;
    return std::nullopt;
}

// Iterate over enum values
for (int i = 0; i <= static_cast<int>(Fruit::Cherry); ++i) {
    auto f = static_cast<Fruit>(i);
    std::cout << fruitToString(f) << '\n';
}

// I/O for scoped enums
std::ostream& operator<<(std::ostream& os, Fruit f) {
    return os << fruitToString(f);
}
std::cout << Fruit::Apple;  // "Apple"

// Enum as template parameter
template<Fruit F>
struct FruitInfo {
    static constexpr std::string_view name = fruitToString(F);
};

// std::is_scoped_enum (C++23)
static_assert(std::is_scoped_enum_v<Fruit>);  // true
static_assert(!std::is_scoped_enum_v<Color>); // false (unscoped)
```

## std::initializer_list

```cpp
#include <initializer_list>

// initializer_list — lightweight proxy for brace-enclosed list
std::initializer_list<int> il = {1, 2, 3, 4, 5};
il.size();   // 5
il.begin();  // pointer to first element
il.end();    // pointer past last element

// Iterate
for (auto x : il) { std::cout << x; }

// Constructor taking initializer_list
class Vector {
public:
    Vector(std::initializer_list<int> init) {
        data.reserve(init.size());
        for (auto x : init) data.push_back(x);
    }
private:
    std::vector<int> data;
};

Vector v = {1, 2, 3, 4, 5};
Vector v2{1, 2, 3};  // direct list init

// initializer_list takes priority over other constructors in list init
class Widget {
public:
    Widget(int a, int b) { std::cout << "two ints"; }
    Widget(std::initializer_list<int> il) { std::cout << "init list"; }
};

Widget w1(1, 2);   // "two ints" (direct init, not list init)
Widget w2{1, 2};   // "init list" (list init prefers initializer_list)
Widget w3 = {1, 2}; // "init list" (copy list init)

// Empty braces call default constructor, not empty initializer_list
Widget w4{};  // default constructor (not initializer_list with 0 elements)

// initializer_list of pairs
std::map<std::string, int> m = {
    {"one", 1},
    {"two", 2},
    {"three", 3}
};

// Nested initializer_list
class Matrix {
public:
    Matrix(std::initializer_list<std::initializer_list<int>> rows) {
        for (auto row : rows) {
            for (auto val : row) { std::cout << val << ' '; }
            std::cout << '\n';
        }
    }
};

Matrix mat = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
```

## Type Classification: POD, Standard-Layout, Trivial

```cpp
#include <type_traits>

// POD (Plain Old Data) — deprecated C++20, use standard-layout + trivial instead
// A POD type is both trivial and standard-layout

// Trivial type:
// - Trivial default constructor, copy constructor, move constructor
// - Trivial copy/move assignment operators
// - Trivial destructor
// - No virtual functions, no virtual base classes

// Standard-layout type:
// - No virtual functions, no virtual base classes
// - All non-static data members have same access control
// - No non-standard-layout non-static data members
// - No reference members
// - Same class as first non-static data member (no diamond)

struct Point { int x; int y; };  // POD, trivial, standard-layout
static_assert(std::is_trivial_v<Point>);
static_assert(std::is_standard_layout_v<Point>);
static_assert(std::is_pod_v<Point>);  // deprecated C++20

struct NonTrivial {
    std::string s;  // std::string has non-trivial destructor
    // Not trivial, not POD
};
static_assert(!std::is_trivial_v<NonTrivial>);

struct NonStandardLayout {
private:
    int a;
public:
    int b;  // different access control → not standard-layout
};
static_assert(!std::is_standard_layout_v<NonStandardLayout>);

// Practical implications:
// - memcpy is safe for trivially copyable types
// - C-compatible layout for standard-layout types
// - Can interact with C APIs
static_assert(std::is_trivially_copyable_v<Point>);
std::memcpy(&dst, &src, sizeof(Point));  // safe for trivially copyable

// Aggregate — array or class with:
// - No private/protected non-static data members
// - No user-declared constructors (C++14) / no user-provided constructors (C++17)
// - No virtual, no private/protected base classes
// - No virtual functions
struct Aggregate {
    int a;
    double b;
    std::string c;
};
Aggregate ag{1, 2.0, "hello"};  // aggregate initialization

// C++17: aggregate with base classes
struct Base { int x; };
struct Derived : Base { int y; };
Derived d{{1}, 2};  // base then derived members

// C++20: no user-declared constructors allowed for aggregate
// C++17: no user-provided constructors (explicitly defaulted is OK)
```

## Empty Base Optimization (EBO)

```cpp
// EBO — empty base class takes no space in derived class
// Empty class: no non-static data members, no virtual functions

struct Empty {};

// Without EBO: sizeof would be at least 2 (two empty objects)
struct WithoutEBO {
    Empty e;
    int x;
};
// sizeof(WithoutEBO) may be 8 (padding after Empty)

// With EBO: empty base shares address with derived
struct WithEBO : Empty {
    int x;
};
// sizeof(WithEBO) may be 4 (Empty shares address)

// EBO is required for:
// - Empty base classes that are not most-derived
// - No padding between base and first member

// EBO is NOT applied when:
// - Base is the first non-static data member (same type)
// - Multiple bases of same empty type (must have distinct addresses)
struct A {};
struct B : A {};
struct C : A, B {};  // two A subobjects — EBO can't apply to both

// Common use: empty comparators, empty allocators, empty policies
template<typename Compare = std::less<int>>
struct SortedSet : Compare {
    // Compare is empty (stateless) — EBO saves space
    int data[100];
};
// sizeof(SortedSet<>) ≈ sizeof(int[100]) — comparator is free

// [[no_unique_address]] (C++20) — like EBO for members
struct WithNoUniqueAddress {
    [[no_unique_address]] Empty e;
    int x;
};
// sizeof(WithNoUniqueAddress) may be 4 — e shares address with x
```

## Elaborated Type Specifiers

```cpp
// Elaborated type specifier — class/struct/union/enum keyword + name
class MyClass obj;       // elaborated: class keyword
struct Point pt;         // elaborated: struct keyword
union MyUnion u;         // elaborated: union keyword
enum Color c;            // elaborated: enum keyword

// Use cases:
// 1. Forward declaration usage
class Forward;  // forward declaration
class Forward* ptr;  // elaborated (redundant but valid)

// 2. Resolving name hiding
class Thread {};       // a class named Thread
void func() {
    int Thread = 42;   // hides class Thread
    // Thread t;       // error: Thread is an int
    class Thread t;    // OK: elaborated type specifier
}

// 3. Declaring a class in a friend declaration
class A {
    friend class B;    // B is a class (forward-declared if not yet seen)
};

// 4. Inheriting from a base with the same name as a member
struct Base {};
struct Derived : Base {
    int Base;  // member named Base (hides base class)
    // OK: Base is both a base class and a member name
};
```

## Injected Class Names

```cpp
// Injected class name — the class name is available inside its own definition
class MyClass {
    // Inside MyClass, "MyClass" refers to the class itself
    MyClass* next;       // self-referential pointer
    MyClass(const MyClass&);  // copy constructor

    // In templates, injected name is different from template name
    // (template name requires template arguments, injected name doesn't)
};

// Template injected class name
template<typename T>
class Template {
    // "Template" here means Template<T> (injected)
    Template* ptr;       // same as Template<T>*
    Template(const Template&);  // same as Template<T>(const Template<T>&)
};

// Outside the class, you need Template<int>, not just Template
// Template<int>* p;  // OK
// Template* p;       // error (outside class)

// Injected class name in constructor
class Widget {
    Widget();  // "Widget" is the injected class name
    // No return type, even though "Widget" is a type elsewhere
};
```

## Converting Constructors and `explicit`

```cpp
// Converting constructor — can be used for implicit conversions
class String {
public:
    String(const char* s);  // converting constructor (no explicit)
    String(int n, char c);  // converting constructor
};

// Implicit conversion via constructor
String s1 = "hello";  // implicit: const char* → String
String s2 = String(5, 'x');  // direct

void func(String s);
func("hello");  // implicit conversion: const char* → String

// explicit — prevents implicit conversions
class ExplicitString {
public:
    explicit ExplicitString(const char* s);
};

// ExplicitString es = "hello";  // error: explicit constructor
ExplicitString es("hello");      // OK: direct initialization
ExplicitString es2 = ExplicitString("hello");  // OK: explicit conversion

// C++11: explicit conversion operators
class Bool {
    bool value;
public:
    explicit operator bool() const { return value; }
};
Bool b;
// if (b) {}  // OK: explicit conversion in boolean context
// bool x = b;  // error: explicit conversion not allowed here

// C++20: explicit(bool) — conditional explicitness
template<typename T>
class Wrapper {
public:
    explicit(!std::is_convertible_v<T, int>)
    Wrapper(T v) : value(v) {}
private:
    T value;
};
// explicit if T is not convertible to int
```

## Copy Elision (RVO/NRVO)

```cpp
// Copy elision — compiler skips copy/move when returning by value
// C++17: guaranteed copy elision for prvalues (mandatory)

// URVO (Unnamed Return Value Optimization) — returning a prvalue
std::string makeString() {
    return std::string("hello");  // C++17: no copy (guaranteed)
    // return "hello";            // C++17: no copy (guaranteed)
}
std::string s = makeString();  // constructed in place

// NRVO (Named Return Value Optimization) — returning a named local
std::string makeString2() {
    std::string result = "hello";
    // ... modify result ...
    return result;  // NRVO: may be elided (not mandatory)
}
// NRVO is not guaranteed, but most compilers do it

// C++17: guaranteed elision for:
// - return of a prvalue (URVO)
// - initialization from a prvalue: T x = T(args);
// - returning a braced-init-list

// C++17: NOT guaranteed for:
// - NRVO (named local variable)
// - Returning a function parameter by value
// - Returning a member by value

// When NRVO is not applied, move constructor is used (not copy)
std::string makeString3(std::string param) {
    return param;  // move (not copy) if NRVO not applied
    // return std::move(param);  // actually WORSE: inhibits NRVO
}

// Don't use std::move on return of local variables — it prevents NRVO!
std::string makeString4() {
    std::string result = "hello";
    return std::move(result);  // BAD: inhibits NRVO, forces move
    // return result;          // GOOD: NRVO or move
}

// Constructor elision
struct A {
    A() { std::cout << "default\n"; }
    A(const A&) { std::cout << "copy\n"; }
    A(A&&) { std::cout << "move\n"; }
};

A makeA() {
    return A();  // C++17: only "default" printed (no move/copy)
}

A a = makeA();  // only "default" — guaranteed elision

// Practical impact:
// - Safe to return large objects by value
// - No need for output parameters or smart pointer returns
// - Factory functions are efficient
```
