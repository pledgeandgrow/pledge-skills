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
