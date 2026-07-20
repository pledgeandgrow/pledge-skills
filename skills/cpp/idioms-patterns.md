# Idioms, Patterns, and Best Practices

## Value Categories

```cpp
// Every C++ expression has a type and a value category

// Primary categories:
// - lvalue: has identity, can't be moved from (e.g., named variable, *ptr, arr[i])
// - prvalue: no identity, can be moved from (e.g., 42, x+1,临时对象)
// - xvalue: has identity, can be moved from (e.g., std::move(x), r.value())
//
// Composite categories:
// - glvalue = lvalue | xvalue (has identity)
// - rvalue  = prvalue | xvalue (can be moved from)

int x = 42;          // x is lvalue, 42 is prvalue
int& lref = x;       // lref is lvalue reference
int&& rref = 42;     // rref is lvalue (named rvalue reference is lvalue!)
int y = std::move(x);// std::move(x) is xvalue, y is lvalue

// decltype behavior:
decltype(x);         // int (lvalue → type as-is)
decltype((x));       // int& (lvalue → reference)
decltype(std::move(x)); // int&& (xvalue → rvalue reference)
decltype(42);        // int (prvalue → type as-is)
```

## ODR (One Definition Rule)

```cpp
// One Definition Rule: each entity must have exactly one definition in the program

// 1. One per translation unit (TU)
// 2. One across all TUs (for external linkage)

// Violations:
// - Non-inline function defined in header included by multiple TUs
// - Non-inline variable defined in header

// Solutions:
// a) Put definitions in .cpp files, declarations in headers
// b) Use inline (C++17: inline variables)
// c) Use anonymous namespace (internal linkage)

// OK: inline function in header
inline int square(int x) { return x * x; }

// OK: inline variable in header (C++17)
inline int globalCounter = 0;
inline constexpr double PI = 3.14159;

// OK: anonymous namespace (internal linkage)
namespace {
    int helperVar = 42;
    void helperFunc() {}
}

// OK: static (internal linkage)
static int fileLocal = 10;

// OK: template (implicitly inline)
template<typename T>
T add(T a, T b) { return a + b; }
```

## ADL (Argument-Dependent Lookup)

```cpp
// ADL: compiler searches namespaces of argument types for function names
namespace MyLib {
    struct Widget { int value; };
    
    void doSomething(const Widget& w) {
        std::cout << w.value;
    }
}

MyLib::Widget w{42};
doSomething(w);  // Found via ADL — no need for MyLib::doSomething

// ADL with operators (this is how operator<< works for std::cout)
namespace MyLib {
    std::ostream& operator<<(std::ostream& os, const Widget& w) {
        return os << w.value;
    }
}
std::cout << w;  // Found via ADL on both std::ostream and MyLib::Widget

// ADL with std::swap
namespace MyLib {
    struct Container {
        int data[10];
        
        friend void swap(Container& a, Container& b) noexcept {
            std::swap(a.data, b.data);
        }
    };
}
MyLib::Container a, b;
using std::swap;
swap(a, b);  // ADL finds MyLib::swap, falls back to std::swap

// Suppress ADL with qualified name
MyLib::doSomething(w);  // no ADL, explicit qualification
::doSomething(w);       // no ADL, global scope
```

## SFINAE and `if constexpr`

```cpp
// See templates.md and metaprogramming.md for full details

// SFINAE (pre-C++20)
template<typename T,
         typename = std::enable_if_t<std::is_integral_v<T>>>
T factorial(T n) { return n <= 1 ? 1 : n * factorial(n - 1); }

// if constexpr (C++17, preferred)
template<typename T>
void process(T x) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "int: " << x;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "float: " << x;
    } else {
        std::cout << "other: " << x;
    }
}

// Concepts (C++20, best)
template<std::integral T>
T factorial(T n) { return n <= 1 ? 1 : n * factorial(n - 1); }
```

## RAII (Resource Acquisition Is Initialization)

```cpp
// RAII: tie resource lifecycle to object lifetime
// Constructor acquires, destructor releases
// Scope exit guarantees cleanup (even on exceptions)

class FileGuard {
    FILE* file;
public:
    explicit FileGuard(const char* path) : file(fopen(path, "r")) {
        if (!file) throw std::runtime_error("Cannot open file");
    }
    ~FileGuard() { if (file) fclose(file); }
    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;
    FileGuard(FileGuard&& o) noexcept : file(o.file) { o.file = nullptr; }
    operator FILE*() const { return file; }
};

// Standard RAII types
std::unique_ptr<T>    // heap memory
std::shared_ptr<T>    // shared heap memory
std::lock_guard<M>    // mutex lock
std::unique_lock<M>   // movable mutex lock
std::scoped_lock<M...>// multiple mutexes
std::fstream          // file handle
std::vector<T>        // dynamic array
std::string           // dynamic string
```

## Rule of Zero / Three / Five

```cpp
// Rule of Zero (preferred): let compiler handle everything
class Good {
    std::vector<int> data;
    std::string name;
public:
    Good() = default;
    // No copy/move/destructor needed — members handle it
};

// Rule of Three: if you define any of destructor, copy ctor, copy assign — define all three
class Old {
    int* data;
public:
    Old() : data(new int[10]) {}
    ~Old() { delete[] data; }
    Old(const Old& o) : data(new int[10]) { std::copy(o.data, o.data+10, data); }
    Old& operator=(const Old& o) {
        if (this != &o) {
            delete[] data;
            data = new int[10];
            std::copy(o.data, o.data+10, data);
        }
        return *this;
    }
};

// Rule of Five: Rule of Three + move ctor + move assign
class Modern {
    int* data;
public:
    Modern() : data(new int[10]) {}
    ~Modern() { delete[] data; }
    Modern(const Modern& o) : data(new int[10]) { std::copy(o.data, o.data+10, data); }
    Modern& operator=(const Modern& o) {
        if (this != &o) {
            delete[] data;
            data = new int[10];
            std::copy(o.data, o.data+10, data);
        }
        return *this;
    }
    Modern(Modern&& o) noexcept : data(o.data) { o.data = nullptr; }
    Modern& operator=(Modern&& o) noexcept {
        if (this != &o) {
            delete[] data;
            data = o.data;
            o.data = nullptr;
        }
        return *this;
    }
};
```

## Copy-and-Swap Idiom

```cpp
class Buffer {
    char* data;
    size_t size;
public:
    Buffer(size_t s) : data(new char[s]), size(s) {}
    ~Buffer() { delete[] data; }
    Buffer(const Buffer& o) : data(new char[o.size]), size(o.size) {
        std::memcpy(data, o.data, size);
    }
    
    // Strong exception safety via copy-and-swap
    Buffer& operator=(Buffer other) noexcept {  // by value (copy or move)
        swap(*this, other);
        return *this;
    }
    
    Buffer(Buffer&& o) noexcept : data(o.data), size(o.size) {
        o.data = nullptr; o.size = 0;
    }
    
    friend void swap(Buffer& a, Buffer& b) noexcept {
        using std::swap;
        swap(a.data, b.data);
        swap(a.size, b.size);
    }
};
```

## CRTP (Curiously Recurring Template Pattern)

```cpp
// Static polymorphism — no virtual dispatch overhead
template<typename Derived>
class ShapeBase {
public:
    double area() const {
        return static_cast<const Derived*>(this)->areaImpl();
    }
    void draw() const {
        static_cast<const Derived*>(this)->drawImpl();
    }
};

class Circle : public ShapeBase<Circle> {
    double r;
public:
    Circle(double r) : r(r) {}
    double areaImpl() const { return 3.14159 * r * r; }
    void drawImpl() const { std::cout << "Circle"; }
};

class Square : public ShapeBase<Square> {
    double side;
public:
    Square(double s) : side(s) {}
    double areaImpl() const { return side * side; }
    void drawImpl() const { std::cout << "Square"; }
};

// Mixin pattern via CRTP
template<typename Derived>
class Comparable {
public:
    bool operator==(const Derived& other) const {
        return static_cast<const Derived*>(this)->compareImpl(other) == 0;
    }
    bool operator!=(const Derived& other) const {
        return !(*this == other);
    }
    bool operator<(const Derived& other) const {
        return static_cast<const Derived*>(this)->compareImpl(other) < 0;
    }
};
```

## Type Erasure

```cpp
// Type erasure: hide concrete type behind common interface
// std::function, std::any, std::shared_ptr<void> are examples

// Custom type-erased function
class Task {
    struct Concept {
        virtual ~Concept() = default;
        virtual void execute() = 0;
    };
    
    template<typename F>
    struct Model : Concept {
        F func;
        Model(F f) : func(std::move(f)) {}
        void execute() override { func(); }
    };
    
    std::unique_ptr<Concept> impl;

public:
    template<typename F>
    Task(F f) : impl(std::make_unique<Model<F>>(std::move(f))) {}
    
    void execute() { impl->execute(); }
};

// Usage
Task t1 = [] { std::cout << "hello"; };
Task t2 = [] { std::cout << "world"; };
t1.execute();
t2.execute();
```

## Pimpl (Pointer to Implementation)

```cpp
// Widget.h — public interface, no implementation details
class Widget {
    class Impl;
    std::unique_ptr<Impl> pimpl;
public:
    Widget();
    ~Widget();  // must define in .cpp where Impl is complete
    Widget(Widget&&) noexcept;
    Widget& operator=(Widget&&) noexcept;
    
    void doSomething();
    int getValue() const;
};

// Widget.cpp — implementation
#include "Widget.h"
#include <vector>
#include <string>

class Widget::Impl {
    std::vector<int> data;
    std::string name;
public:
    void doSomething() { /* ... */ }
    int getValue() const { return data.size(); }
};

Widget::Widget() : pimpl(std::make_unique<Impl>()) {}
Widget::~Widget() = default;
Widget::Widget(Widget&&) noexcept = default;
Widget& Widget::operator=(Widget&&) noexcept = default;

void Widget::doSomething() { pimpl->doSomething(); }
int Widget::getValue() const { return pimpl->getValue(); }

// Benefits:
// - Faster compilation (implementation changes don't trigger recompilation of users)
// - Hide private details from header
// - Reduce include dependencies
```

## NVI (Non-Virtual Interface)

```cpp
// NVI: public non-virtual methods call private virtual methods
class Animal {
public:
    // Public — non-virtual, defines the algorithm structure
    void makeSound() {
        prepare();
        doMakeSound();  // virtual — customization point
        finish();
    }
    
    virtual ~Animal() = default;

private:
    void prepare() { std::cout << "[preparing] "; }
    void finish() { std::cout << " [done]\n"; }
    
    // Private virtual — derived classes customize behavior
    virtual void doMakeSound() = 0;
};

class Dog : public Animal {
private:
    void doMakeSound() override { std::cout << "Woof"; }
};
```

## Tag Dispatch

```cpp
// Tag dispatch: select overload based on iterator category
template<typename Iter>
void sortImpl(Iter first, Iter last, std::random_access_iterator_tag) {
    std::sort(first, last);  // efficient for random access
}

template<typename Iter>
void sortImpl(Iter first, Iter last, std::forward_iterator_tag) {
    // different algorithm for forward iterators
    std::vector<typename std::iterator_traits<Iter>::value_type> v(first, last);
    std::sort(v.begin(), v.end());
    std::copy(v.begin(), v.end(), first);
}

template<typename Iter>
void sort(Iter first, Iter last) {
    sortImpl(first, last, typename std::iterator_traits<Iter>::iterator_category{});
}
```

## Expression Templates

```cpp
// Expression templates: delay evaluation for efficient expression evaluation
// Used by Eigen, Blaze, etc. for matrix operations

template<typename L, typename R>
class VecAdd {
    const L& lhs;
    const R& rhs;
public:
    VecAdd(const L& l, const R& r) : lhs(l), rhs(r) {}
    double operator[](size_t i) const { return lhs[i] + rhs[i]; }
    size_t size() const { return lhs.size(); }
};

class Vec {
    std::vector<double> data;
public:
    Vec(std::initializer_list<double> init) : data(init) {}
    double operator[](size_t i) const { return data[i]; }
    double& operator[](size_t i) { return data[i]; }
    size_t size() const { return data.size(); }
    
    template<typename R>
    Vec& operator=(const R& rhs) {
        for (size_t i = 0; i < size(); ++i)
            data[i] = rhs[i];
        return *this;
    }
};

template<typename L, typename R>
VecAdd<L, R> operator+(const L& l, const R& r) {
    return VecAdd<L, R>(l, r);
}

// Usage: c = a + b + a;  // single loop, no temporaries
```

## Common Design Patterns in C++

```cpp
// Singleton (Meyers' Singleton, thread-safe in C++11+)
class Singleton {
public:
    static Singleton& instance() {
        static Singleton inst;  // thread-safe initialization
        return inst;
    }
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
private:
    Singleton() = default;
};

// Observer
class Subject;
class Observer {
public:
    virtual ~Observer() = default;
    virtual void update(Subject* s) = 0;
};

class Subject {
    std::vector<Observer*> observers;
public:
    void attach(Observer* o) { observers.push_back(o); }
    void detach(Observer* o) { observers.erase(std::remove(observers.begin(), observers.end(), o), observers.end()); }
    void notify() { for (auto o : observers) o->update(this); }
};

// Factory
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() = 0;
};

class Dog : public Animal { void speak() override { std::cout << "Woof"; } };
class Cat : public Animal { void speak() override { std::cout << "Meow"; } };

std::unique_ptr<Animal> createAnimal(const std::string& type) {
    if (type == "dog") return std::make_unique<Dog>();
    if (type == "cat") return std::make_unique<Cat>();
    throw std::invalid_argument("Unknown animal");
}

// Strategy (with lambdas)
template<typename Strategy>
class Sorter {
    Strategy strategy;
public:
    Sorter(Strategy s) : strategy(std::move(s)) {}
    void sort(std::vector<int>& v) { strategy(v); }
};

auto sorter = Sorter([](std::vector<int>& v) { std::sort(v.begin(), v.end()); });

// Builder (fluent interface)
class StringBuilder {
    std::string str;
public:
    StringBuilder& append(const std::string& s) { str += s; return *this; }
    StringBuilder& appendLine(const std::string& s) { str += s + "\n"; return *this; }
    StringBuilder& appendInt(int n) { str += std::to_string(n); return *this; }
    std::string build() { return std::move(str); }
};

auto result = StringBuilder()
    .append("Hello, ")
    .append("World!")
    .appendLine("")
    .appendInt(42)
    .build();
```

## Best Practices Summary

```cpp
// 1. Prefer RAII over manual resource management
// 2. Use smart pointers (unique_ptr, shared_ptr) over raw new/delete
// 3. Follow Rule of Zero when possible
// 4. Use const correctness everywhere
// 5. Use noexcept for move operations and destructors
// 6. Prefer pass-by-const-reference for large objects
// 7. Use std::string_view for read-only string parameters
// 8. Use std::span for contiguous data parameters
// 9. Prefer range-based algorithms (std::ranges) over iterator pairs
// 10. Use concepts instead of SFINAE (C++20)
// 11. Use if constexpr instead of tag dispatch when possible
// 12. Prefer std::expected/optional over exceptions for expected failures
// 13. Use std::format/println over printf/iostream for formatted output
// 14. Mark single-argument constructors explicit
// 15. Use [[nodiscard]], [[deprecated]], [[fallthrough]], [[maybe_unused]] attributes
// 16. Prefer strong types (enum class, struct wrappers) over raw ints
// 17. Use structured bindings for multi-return values
// 18. Use std::filesystem over platform-specific APIs
// 19. Use std::chrono over C time functions
// 20. Use <random> over rand()
```
