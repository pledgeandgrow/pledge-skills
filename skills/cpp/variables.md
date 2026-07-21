# Variables, Scope, Storage Duration, Qualifiers

## Variable Declaration and Initialization

```cpp
// Copy initialization
int x = 42;
double d = 3.14;

// Direct initialization
int y(42);
int z{42};  // brace initialization (C++11)

// Brace/uniform initialization (C++11) — prevents narrowing
int a{42};        // OK
int b{3.14};      // error: narrowing from double to int
int c = 3.14;     // OK (implicit narrowing, may warn)
double e{42};     // OK (int to double, no narrowing)

// Default initialization
int i;        // indeterminate value (for non-class types)
std::string s; // empty string (class types call default constructor)

// Value initialization (with {})
int j{};      // 0 (value-initialized)
double k{};   // 0.0
int* p{};     // nullptr
std::string t{}; // empty string

// Multiple declarations
int m = 1, n = 2, o = 3;
auto [x, y] = pair; // structured bindings (C++17)
```

## Scope

```cpp
// Block scope
{
    int x = 42;
    // x visible here
}
// x not visible here

// Function scope
void func() {
    int local = 10;  // function scope
}

// Namespace scope
int globalVar = 100;  // global scope
namespace ns {
    int nsVar = 200;  // namespace scope
}

// Class scope
class MyClass {
    int member = 5;  // class scope
    static int staticMember;  // class scope (static)
};
int MyClass::staticMember = 10;  // definition

// Shadowing
int x = 10;
{
    int x = 20;  // shadows outer x
    std::cout << x;  // 20
}
std::cout << x;  // 10

// Structured binding scope (C++17)
{
    auto [a, b] = std::make_pair(1, 2);
    // a, b visible in this block
}
```

## Storage Duration

### Automatic Storage Duration

```cpp
// Stack-allocated, destroyed at end of scope
void func() {
    int x = 42;           // automatic
    std::string s = "hi"; // automatic (destructor called at scope end)
    int arr[10] = {};     // automatic array
}
```

### Static Storage Duration

```cpp
// Global and namespace scope — entire program lifetime
int globalVar = 42;  // static storage, zero-initialized

// Static local — initialized once, persists across calls
int counter() {
    static int count = 0;  // initialized once
    return ++count;
}
// counter() → 1, 2, 3, ...

// Static class member — shared across all instances
class MyClass {
    static int instances;
public:
    MyClass() { ++instances; }
};
int MyClass::instances = 0;  // definition (in .cpp file)

// Thread-local storage (C++11)
thread_local int threadVar = 0;  // each thread has its own copy
```

### Dynamic Storage Duration

```cpp
// Heap-allocated via new, destroyed via delete
int* p = new int(42);       // dynamic
delete p;                    // must manually delete

int* arr = new int[10]();    // dynamic array, zero-initialized
delete[] arr;                // must use delete[]

// Prefer smart pointers!
auto sp = std::make_unique<int>(42);  // automatic cleanup
auto ssp = std::make_shared<int>(42); // shared ownership
```

### Thread-Local Storage Duration

```cpp
thread_local int tlsVar = 0;

void threadFunc() {
    tlsVar = 42;  // each thread has its own tlsVar
    std::cout << tlsVar << '\n';
}

// thread_local with static
struct Counter {
    thread_local static int count;  // each thread has its own count
};
```

## Qualifiers

### `const`

```cpp
// const variable — cannot be modified after initialization
const int x = 42;
// x = 10;  // error: const

// const with pointers
const int* p1 = &x;       // pointer to const int (data is const)
int const* p2 = &x;       // same as above
int* const p3 = &y;       // const pointer to int (pointer is const)
const int* const p4 = &x; // both const

// const member function — doesn't modify object
class MyClass {
    int value;
public:
    int getValue() const { return value; }  // const method
    void setValue(int v) { value = v; }     // non-const method
};

// const object — can only call const methods
const MyClass obj;
obj.getValue();  // OK
// obj.setValue(5);  // error: const object

// const parameters
void func(const std::string& s) {  // pass by const reference (no copy)
    std::cout << s;
}

// const return type
const int& getRef() { return value; }  // returned reference is const
```

### `constexpr` — Compile-Time Constant

```cpp
// constexpr variable — must be initialized at compile time
constexpr int MAX = 1024;
constexpr double PI = 3.14159;

// constexpr function — can be evaluated at compile time
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
constexpr int f5 = factorial(5);  // 120, computed at compile time
int x = factorial(5);  // may be computed at runtime

// constexpr with if (C++17)
constexpr int compute(int n) {
    if (n < 0) return -n;
    return n;
}

// constexpr constructor (C++11)
struct Point {
    int x, y;
    constexpr Point(int x, int y) : x(x), y(y) {}
    constexpr int sum() const { return x + y; }
};
constexpr Point p(1, 2);
constexpr int s = p.sum();  // 3

// constexpr lambda (C++17)
auto square = [](int n) constexpr { return n * n; };
constexpr int sq = square(5);  // 25

// if constexpr (C++17) — compile-time conditional
template<typename T>
void process(T x) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "Integer: " << x;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "Float: " << x;
    } else {
        std::cout << "Other: " << x;
    }
}
```

### `constinit` (C++20) — Compile-Time Initialized, Mutable

```cpp
// constinit — must be initialized at compile time, but can be modified later
constinit int x = 42;  // initialized at compile time
x = 100;               // OK, can modify

// Unlike constexpr, constinit allows mutation
// Unlike const, constinit requires compile-time initialization

// Useful for static variables that need compile-time init but runtime mutation
constinit static int counter = 0;
void increment() { ++counter; }
```

### `volatile`

```cpp
// volatile — tells compiler not to optimize reads/writes
volatile int hardwareReg = 0;  // may change externally (e.g., hardware)

// Prevents caching in register
while (hardwareReg != 0xFF) {
    // compiler won't optimize this loop
}

// volatile pointer
volatile int* vp = &hardwareReg;
int* volatile pv = &x;          // pointer itself is volatile
volatile int* volatile vpv = &hardwareReg; // both

// Note: volatile is deprecated for many uses in C++20+
// Use std::atomic for thread-safe access instead
```

### `mutable` — Allow Modification of Class Member in const Method

```cpp
class Cache {
    mutable int accessCount = 0;  // can be modified in const methods
    std::string data;
public:
    const std::string& getData() const {
        ++accessCount;  // OK: mutable
        return data;
    }
    int getAccessCount() const { return accessCount; }
};
```

## References

```cpp
// lvalue reference
int x = 42;
int& ref = x;   // ref is an alias for x
ref = 10;       // modifies x
std::cout << x; // 10

// const lvalue reference — can bind to rvalues (extends lifetime)
const int& cref = 42;    // OK: temporary lifetime extended
const std::string& sref = "hello"; // OK

// rvalue reference (C++11) — binds to rvalues (temporaries)
int&& rref = 42;          // OK: binds to rvalue
int&& rref2 = std::move(x); // converts lvalue to rvalue
// int&& bad = x;          // error: can't bind lvalue to rvalue ref

// Universal/forwarding reference (in template contexts)
template<typename T>
void func(T&& arg) {  // forwarding reference (not rvalue ref in template)
    other(std::forward<T>(arg));  // perfect forwarding
}

// Dangling reference — undefined behavior
int& badRef() {
    int local = 42;
    return local;  // UB: local destroyed after return
}

// Reference to array
int arr[5] = {1,2,3,4,5};
int (&arrRef)[5] = arr;

// Reference to function
void f() {}
void (&funcRef)() = f;
funcRef();  // calls f
```

## Structured Bindings (C++17)

```cpp
// Arrays
int arr[3] = {1, 2, 3};
auto [a, b, c] = arr;

// Pair
std::pair<int, std::string> p = {42, "hello"};
auto [num, str] = p;

// Tuple
std::tuple<int, double, std::string> t = {1, 2.0, "three"};
auto [i, d, s] = t;

// Map iteration
std::map<std::string, int> m = {{"a", 1}, {"b", 2}};
for (const auto& [key, value] : m) {
    std::cout << key << ": " << value << '\n';
}

// Struct
struct Point { int x, y; };
Point pt{10, 20};
auto& [px, py] = pt;  // by reference
px = 100;  // modifies pt.x
```

## Initialization (Detailed)

```cpp
// Default initialization — no initializer, value is indeterminate (for non-class types)
int x;          // indeterminate value (UB to read)
std::string s;  // default-constructed (empty string)
std::vector<int> v;  // default-constructed (empty)

// Value initialization — zero-initialized or default-constructed
int x2{};           // 0
int* p{};           // nullptr
std::string s2{};   // empty string
std::vector<int> v2{};  // empty

// Zero initialization — sets to zero
int x3 = 0;         // zero-init
int x4{};            // zero-init (value-init for scalar)
static int x5;       // zero-init (static storage duration)
T();                 // zero-init then default-construct

// Copy initialization — copy from another value
int a = 42;
int b = a;
std::string s3 = "hello";
auto c = 3.14;

// Direct initialization — construct directly (no copy)
int d(42);
std::string s4("hello");
std::vector<int> v3(10, 42);  // 10 elements of 42

// List initialization (C++11) — brace-enclosed
int e{42};
std::string s5{"hello"};
std::vector<int> v4{1, 2, 3, 4, 5};
// Narrowing conversions prevented:
// int x{3.14};  // error: narrowing from double to int

// Aggregate initialization — for aggregates (arrays, simple structs)
struct Point { int x, y; };
Point p1{10, 20};
Point p2 = {10, 20};  // copy-list-init
int arr[]{1, 2, 3, 4, 5};

// Designated initializers (C++20)
struct Config { int port; bool verbose; std::string host; };
Config cfg{.port = 8080, .host = "localhost", .verbose = true};
// Must be in declaration order

// Constant initialization — compile-time initialization
constexpr int ci = 42;
constinit int gi = 100;  // C++20: compile-time initialized, mutable

// Reference initialization
int val = 42;
int& ref = val;           // lvalue reference
const int& cref = 42;     // const ref to temporary (extends lifetime)
int&& rref = std::move(val);  // rvalue reference

// Initialization order
// 1. Static/thread-local: constant init → zero init → dynamic init
// 2. Members: in declaration order (not initializer list order!)
// 3. Base classes before members
// 4. Virtual base classes before non-virtual bases

// Member initializer list
class Widget {
    int a, b, c;
public:
    Widget() : a(1), b(2), c(3) {}  // init in declaration order (a, b, c)
    // Widget() : b(2), a(1), c(3) {}  // warning: order mismatch
};

// Delegating constructor
class Foo {
public:
    Foo() : Foo(42) {}        // delegate to Foo(int)
    Foo(int x) : Foo(x, 0) {} // delegate to Foo(int, int)
    Foo(int x, int y) : a(x), b(y) {}
private:
    int a, b;
};

// Inheriting constructor (C++11)
struct Derived : Base {
    using Base::Base;  // inherit all Base constructors
};
```
