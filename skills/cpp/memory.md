# Memory Management

## Smart Pointers

### unique_ptr — exclusive ownership

```cpp
#include <memory>

// Creation
auto p = std::make_unique<int>(42);
auto arr = std::make_unique<int[]>(10);  // array of 10 ints

// Access
*p = 100;
arr[0] = 1;
arr[1] = 2;

// Move ownership (cannot copy)
auto p2 = std::move(p);  // p is now nullptr
if (p) { /* won't execute */ }

// Custom deleter
auto file = std::unique_ptr<FILE, decltype(&fclose)>(
    fopen("data.txt", "r"), &fclose
);

// Custom deleter with lambda
auto deleter = [](FILE* f) { if (f) fclose(f); };
auto file2 = std::unique_ptr<FILE, decltype(deleter)>(
    fopen("data.txt", "r"), deleter
);

// Release (transfer to raw pointer, lose ownership)
FILE* raw = file.release();

// Reset
p2.reset();        // deletes managed object, p2 = nullptr
p2.reset(new int(99));  // deletes old, manages new

// Get raw pointer (doesn't transfer ownership)
int* raw = p2.get();

// unique_ptr with array
auto buf = std::make_unique<char[]>(1024);
buf[0] = 'A';

// unique_ptr in containers
std::vector<std::unique_ptr<Widget>> widgets;
widgets.push_back(std::make_unique<Widget>());
widgets.push_back(std::make_unique<Widget>());
// unique_ptr moved into vector

// unique_ptr with custom type
class Resource {
public:
    Resource() { std::cout << "acquired\n"; }
    ~Resource() { std::cout << "released\n"; }
};
auto r = std::make_unique<Resource>();
// "released" printed when r goes out of scope
```

### shared_ptr — shared ownership

```cpp
// Creation
auto p1 = std::make_shared<int>(42);
auto p2 = p1;  // shared copy, ref count = 2

// Reference count
std::cout << p1.use_count();  // 2

// Control block: contains ref count + weak count + deleter + allocator
// make_shared allocates object + control block in single allocation

// Custom deleter
std::shared_ptr<FILE> file(fopen("data.txt", "r"), fclose);

// Array support (C++17)
auto arr = std::make_shared<int[]>(10);
arr[0] = 42;

// shared_ptr with custom allocator
auto allocator = std::allocator<int>{};
auto p = std::allocate_shared<int>(allocator, 42);

// atomic shared_ptr operations (C++20)
std::atomic<std::shared_ptr<int>> ap = p1;
auto loaded = ap.load();
ap.store(std::make_shared<int>(99));
auto old = ap.exchange(std::make_shared<int>(100));
```

### weak_ptr — non-owning reference to shared_ptr

```cpp
auto shared = std::make_shared<int>(42);
std::weak_ptr<int> weak = shared;

// Check if expired
if (auto locked = weak.lock()) {
    // shared is still alive, locked is a shared_ptr
    std::cout << *locked;
} else {
    // shared was destroyed
}

// use_count
std::cout << weak.use_count();  // number of shared_ptrs

// expired — check if the managed object was deleted
if (weak.expired()) { /* object destroyed */ }

// Common use: break circular references
class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // weak to avoid cycle
    
    ~Node() { std::cout << "Node destroyed\n"; }
};

auto n1 = std::make_shared<Node>();
auto n2 = std::make_shared<Node>();
n1->next = n2;
n2->prev = n1;  // weak_ptr, no cycle
// When n1 and n2 go out of scope, both are properly destroyed

// enable_shared_from_this
class Widget : public std::enable_shared_from_this<Widget> {
public:
    std::shared_ptr<Widget> getPtr() {
        return shared_from_this();  // safe: returns existing shared_ptr
        // return std::shared_ptr<Widget>(this);  // BAD: double delete
    }
};

auto w = std::make_shared<Widget>();
auto w2 = w->getPtr();  // shares ownership with w
```

## Raw Pointers and References

```cpp
// Raw pointer — no ownership semantics
int x = 42;
int* p = &x;  // pointer to x
*p = 100;     // modify x through pointer

// Null pointer
int* np = nullptr;
if (np == nullptr) { /* null */ }

// Pointer arithmetic
int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;
p++;        // points to arr[1] (20)
p += 2;     // points to arr[3] (40)
p - arr;    // 3 (pointer difference)
std::distance(arr, p);  // 3

// Pointers to pointers
int x = 42;
int* p = &x;
int** pp = &p;
**pp = 100;  // modifies x

// References — alias, cannot be null, cannot be reseated
int x = 42;
int& ref = x;  // ref is alias for x
ref = 100;     // modifies x
// int& bad;    // error: must initialize
// ref = y;     // assigns y's value to x, doesn't rebind

// const reference — can bind to rvalues (extends lifetime)
const std::string& s = "hello";  // temporary lifetime extended
const int& r = 42;               // OK

// rvalue reference
int&& rref = 42;
int&& rref2 = std::move(x);

// Dangling pointer — undefined behavior
int* dangling() {
    int local = 42;
    return &local;  // UB: local destroyed after return
}

// Dangling reference
int& danglingRef() {
    int local = 42;
    return local;  // UB
}
```

## new / delete (manual dynamic allocation)

```cpp
// Single object
int* p = new int(42);
delete p;

// Array
int* arr = new int[10]();  // zero-initialized
delete[] arr;

// Placement new — construct in pre-allocated memory
#include <new>
char buffer[sizeof(Widget)];
Widget* w = new (buffer) Widget(42);  // construct in buffer
w->~Widget();  // must manually call destructor (no delete)

// nothrow new
int* p = new (std::nothrow) int[1000000000];
if (p == nullptr) { /* allocation failed */ }
// Regular new throws std::bad_alloc on failure

// Operator new overloading
class MyClass {
public:
    static void* operator new(size_t size) {
        void* p = std::malloc(size);
        if (!p) throw std::bad_alloc();
        return p;
    }
    static void operator delete(void* p) noexcept {
        std::free(p);
    }
    // Array variants
    static void* operator new[](size_t size) { return operator new(size); }
    static void operator delete[](void* p) noexcept { operator delete(p); }
};

// Aligned allocation
auto p = static_cast<Widget*>(::operator new(sizeof(Widget), std::align_val_t{64}));
::operator delete(p, std::align_val_t{64});
```

## Allocators

```cpp
#include <memory>

// Standard allocator (default)
std::allocator<int> alloc;
int* p = alloc.allocate(10);
alloc.deallocate(p, 10);

// Polymorphic allocator (PMR) — C++17
#include <memory_resource>

// Monotonic buffer — single allocation, no deallocation until end
char buffer[1024];
std::pmr::monotonic_buffer_resource mbr(buffer, sizeof(buffer));
std::pmr::polymorphic_allocator<int> pa(&mbr);

// PMR vector — uses monotonic buffer
std::pmr::vector<int> v({1, 2, 3}, &mbr);

// Pool allocator — fast small allocations
std::pmr::pool_options opts{.max_blocks_per_chunk = 100, .largest_required_pool_block = 256};
std::pmr::synchronized_pool_resource pool(opts);

// PMR string
std::pmr::string s = "hello";  // uses pool allocator

// Container with custom allocator
std::vector<int, std::pmr::polymorphic_allocator<int>> v2({1, 2, 3}, &pool);

// PMR resource hierarchy:
// std::pmr::monotonic_buffer_resource — no individual deallocations
// std::pmr::pool_resource — pool of fixed-size blocks
// std::pmr::synchronized_pool_resource — thread-safe pool
// std::pmr::unsynchronized_pool_resource — non-thread-safe pool
// std::pmr::get_default_resource() — default resource
// std::pmr::set_default_resource(r) — set default
```

## Memory Layout and Alignment

```cpp
// alignas / alignof
struct alignas(16) AlignedStruct {
    int x;
    double y;
};

static_assert(alignof(AlignedStruct) == 16);
static_assert(sizeof(AlignedStruct) == 16);  // padded to alignment

// aligned_alloc (C++17)
void* p = ::operator new(64, std::align_val_t{64});
::operator delete(p, std::align_val_t{64});

// std::aligned_storage (deprecated C++23)
// Use alignas instead
template<typename T, size_t N>
struct AlignedBuffer {
    alignas(T) unsigned char data[sizeof(T) * N];
};

// std::start_lifetime_as (C++23)
// Implicitly create objects in buffer
```

## Memory Order and Atomics (see concurrency.md for full details)

```cpp
#include <atomic>

std::atomic<int> counter{0};

// Relaxed — no ordering, just atomicity
counter.fetch_add(1, std::memory_order_relaxed);

// Acquire — no reads/writes can be reordered before this load
int v = counter.load(std::memory_order_acquire);

// Release — no reads/writes can be reordered after this store
counter.store(42, std::memory_order_release);

// Sequentially consistent — global total order
counter.fetch_add(1, std::memory_order_seq_cst);  // default
```

## Common Patterns

```cpp
// Pimpl (Pointer to Implementation) — hide implementation details
// Widget.h
class Widget {
    class Impl;
    std::unique_ptr<Impl> pimpl;
public:
    Widget();
    ~Widget();  // must define in .cpp (where Impl is complete)
    Widget(Widget&&) noexcept;
    Widget& operator=(Widget&&) noexcept;
    void doSomething();
};

// Widget.cpp
class Widget::Impl {
public:
    void doSomething() { /* ... */ }
};
Widget::Widget() : pimpl(std::make_unique<Impl>()) {}
Widget::~Widget() = default;
Widget::Widget(Widget&&) noexcept = default;
Widget& Widget::operator=(Widget&&) noexcept = default;
void Widget::doSomething() { pimpl->doSomething(); }

// Factory pattern with unique_ptr
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() = 0;
};

class Dog : public Animal {
public:
    void speak() override { std::cout << "Woof\n"; }
};

class Cat : public Animal {
public:
    void speak() override { std::cout << "Meow\n"; }
};

std::unique_ptr<Animal> createAnimal(const std::string& type) {
    if (type == "dog") return std::make_unique<Dog>();
    if (type == "cat") return std::make_unique<Cat>();
    throw std::invalid_argument("Unknown animal type");
}

// Custom deleter for C API
auto openFile(const char* path) {
    return std::unique_ptr<FILE, decltype(&fclose)>(fopen(path, "r"), fclose);
}
```
