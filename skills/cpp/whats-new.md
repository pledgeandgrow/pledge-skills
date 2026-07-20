# What's New — C++26 / C++23 / C++20 / C++17 / C++14 / C++11

## C++26 (upcoming)

### Language Features
- **Pack indexing** — `Args...[0]` to access Nth type in pack
- **`std::print` / `std::println`** improvements — more format specifiers
- **`= delete("reason")`** — deleted functions with reason (proposed)
- **Placeholder types with no name** — `auto` and `_` as variable names
- **User-defined `static_assert` messages** — already in C++23
- **`constexpr` cast from `void*`** — more constexpr flexibility
- **`constexpr` placement new** — compile-time dynamic allocation
- **Hazard pointers** and **RCU** in standard library
- **`std::linalg`** — linear algebra algorithms (BLAS-like)
- **`std::execution`** — senders/receivers (structured concurrency)
- **`std::text_encoding`** — runtime text encoding detection
- **`std::is_debugger_present()`** — check if debugger attached
- **`std::format` improvements** — more format specifiers
- **`std::submdspan`** — subview of multidimensional span
- **`std::mdspan`** — multidimensional span (from C++23)
- **`std::flat_map` / `std::flat_set`** — already C++23
- **Reflection** (P2996) — static reflection (proposed, may not make C++26)
- **Pattern matching** (P2688) — `inspect` expression (proposed)
- **Contracts** (P2900) — preconditions, postconditions, assertions (proposed)

```cpp
// Pack indexing (C++26)
template<typename... Args>
using FirstArg = Args...[0];
using SecondArg = Args...[1];

// Placeholder variables
auto _ = 42;  // unnamed variable, can't be referenced

// constexpr placement new
constexpr auto makeArray() {
    std::array<int, 5> arr{};
    new (&arr[0]) int(42);  // constexpr placement new
    return arr;
}
```

### Library Features
```cpp
// std::linalg (C++26)
#include <linalg>
std::linalg::matrix_vector_product(A, x, y);

// std::execution (senders/receivers)
#include <execution>
auto work = std::execution::schedule(scheduler)
    | std::execution::then([]() { return 42; })
    | std::execution::then([](int x) { return x * 2; });
std::this_thread::sync_wait(std::move(work));

// std::text_encoding
#include <text_encoding>
auto enc = std::text_encoding::environment();
enc.name();  // "UTF-8"
enc.mib();   // MIB enum

// Hazard pointers
#include <hazard_pointer>
// RCU
#include <rcu>
```

## C++23

### Language Features
- **`if consteval`** — check if in constant evaluation context
- **`static_assert` with no message** — `static_assert(condition);`
- **`auto(x)` and `auto{x}`** — decay-copy in expression
- **`#elifdef` and `#elifndef`** — preprocessor
- **`std::print` / `std::println`** — formatted output
- **`std::format` improvements** — range formatters
- **Multidimensional subscript** — `a[1, 2]` (operator[])
- **Attributes on lambda expressions**
- **`this` deduction** — deducing this (explicit object parameter)
- **`std::expected`** — error handling without exceptions
- **`std::optional::and_then` / `or_else` / `transform`** — monadic ops
- **`std::ranges::to`** — convert range to container
- **`std::views::stride` / `chunk` / `slide` / `zip` / `enumerate` / `adjacent`**
- **`std::byteswap`** — byte order swap
- **`std::to_underlying`** — enum to integer
- **`std::unreachable`** — mark unreachable code
- **`std::mdspan`** — multidimensional span

```cpp
// if consteval
constexpr int f(int n) {
    if consteval {
        return n * 2;  // compile-time path
    }
    return n + 1;  // runtime path
}

// auto(x) — decay-copy
auto lambda = [x = auto(y)]() { /* x is a copy */ };

// Multidimensional subscript
struct Matrix {
    int data[3][3];
    int& operator[](size_t i, size_t j) { return data[i][j]; }
};
Matrix m;
m[1, 2] = 42;

// Deducing this (explicit object parameter)
struct Widget {
    void func(this Widget& self) { /* self is *this */ }
    void func(this const Widget& self) const { /* const version */ }
    // Recursive lambda
    auto factorial = [](this auto& self, int n) -> int {
        return n <= 1 ? 1 : n * self(n - 1);
    };
};

// std::expected
std::expected<int, std::string> parse(std::string_view s);
auto r = parse("42").value_or(0);

// std::unreachable
[[noreturn]] void fatal() {
    std::unreachable();  // UB if reached, but optimizer assumes it won't
}

// std::println
std::println("Hello, {}!", "World");

// std::ranges::to
auto v = std::views::iota(0, 10) | std::ranges::to<std::vector>();

// std::views::enumerate
for (auto [idx, val] : std::views::enumerate(vec)) { ... }
```

## C++20

### Language Features
- **Concepts** — `template<std::integral T>`, `requires` clause
- **Ranges** — `std::views::filter`, `transform`, `take`, `drop`, etc.
- **Coroutines** — `co_await`, `co_yield`, `co_return`
- **Modules** — `export module`, `import`
- **Three-way comparison** — `<=>` (spaceship operator)
- **Designated initializers** — `{.field = value}`
- **`constinit`** — compile-time initialized, mutable
- **`consteval`** — must evaluate at compile time
- **`std::format`** — Python-style formatting
- **`std::span`** — non-owning view of contiguous data
- **`std::jthread`** — auto-joining thread with stop_token
- **`std::source_location`** — file/line/function info
- **`std::numbers`** — math constants (pi, e, etc.)
- **`std::bit`** — bit operations (popcount, rotl, etc.)
- **`std::endian`** — endianness detection
- **Calendar and time zones** — `std::chrono` calendar
- **`std::syncbuf`** — synchronized output
- **`std::atomic_ref`** — atomic operations on non-atomic data
- **`std::atomic<shared_ptr>`** — atomic smart pointer
- **`std::counting_semaphore`** — counting semaphore
- **`std::latch` / `std::barrier`** — synchronization primitives
- **`std::stop_token` / `stop_source` / `stop_callback`** — cancellation
- **`std::ranges` algorithms** — range-based algorithms
- **CTAD improvements** — more deduction guides
- **`consteval` lambda** — compile-time lambda
- **`constexpr` dynamic_cast** — compile-time polymorphism
- **`constexpr` string and vector** — compile-time containers
- **`std::is_constant_evaluated()`** — check constant evaluation (deprecated C++23, use `if consteval`)
- **`char8_t`** — UTF-8 character type
- **`std::u8string`** — UTF-8 string
- **Class template argument deduction for alias templates**
- **`using enum`** — bring enum values into scope

```cpp
// Concepts
template<std::integral T>
T gcd(T a, T b) { while (b) { T t = b; b = a % b; a = t; } return a; }

// Ranges
auto evens = vec | std::views::filter([](int x) { return x % 2 == 0; })
                 | std::views::transform([](int x) { return x * x; });

// Coroutines
Generator<int> naturals() { int n = 0; while (true) co_yield n++; }

// Spaceship
auto operator<=>(const MyClass&) const = default;

// Designated initializers
Config c{.port = 8080, .host = "localhost"};

// std::format
std::format("Hello, {}! You are {}.", "Alice", 30);

// std::span
void process(std::span<int> data);
process(vector);
process(array);
process(rawArray);
```

## C++17

### Language Features
- **Structured bindings** — `auto [a, b] = pair;`
- **`if constexpr`** — compile-time conditional
- **`if`/`switch` with initializer** — `if (auto x = f(); x > 0)`
- **Fold expressions** — `(args + ...)`, `(... + args)`
- **Class template argument deduction (CTAD)** — `std::pair p(1, 2.0);`
- **`std::optional`** — maybe-a-value
- **`std::variant`** — type-safe union
- **`std::any`** — type-erased container
- **`std::string_view`** — non-owning string view
- **`std::filesystem`** — file system operations
- **`std::parallel` algorithms** — `std::execution::par`
- **`std::invoke`** — uniform call syntax
- **`std::apply`** — call function with tuple args
- **`std::byte`** — type-safe byte
- **`inline` variables** — `inline int x = 42;` in header
- **`constexpr` if** — compile-time branching
- **`constexpr` lambdas** — `auto f = [](int x) constexpr { return x; };`
- **Hexadecimal floating-point literals** — `0x1.8p+1`
- **UTF-8 character literals** — `u8'x'`
- **`__has_include`** — preprocessor check
- **Namespace in nested form** — `namespace A::B::C {}`
- **Template argument deduction for constructors**

```cpp
// Structured bindings
auto [key, value] = *map.begin();

// if constexpr
template<typename T>
void process(T x) {
    if constexpr (std::is_integral_v<T>) { /* int path */ }
    else { /* other path */ }
}

// Fold expressions
template<typename... Args>
auto sum(Args... args) { return (args + ... + 0); }

// std::optional
std::optional<int> find(const std::vector<int>& v, int target);

// std::variant
std::variant<int, double, std::string> v = 42;
std::visit(visitor, v);

// std::string_view
void print(std::string_view s);  // accepts string, C-string, etc.
```

## C++14

### Language Features
- **Generic lambdas** — `auto f = [](auto x) { return x; };`
- **Return type deduction** — `auto f() { return 42; }`
- **`decltype(auto)`** — preserve references in return type
- **Variable templates** — `template<typename T> constexpr T pi = T(3.14);`
- **`constexpr` improvements** — loops, local variables, if/switch
- **Binary literals** — `0b1010'1100`
- **Digit separators** — `1'000'000`
- **`std::make_unique`** — safe unique_ptr creation
- **`std::shared_timed_mutex`** — shared mutex (renamed in C++17)
- **`std::integer_sequence`** — compile-time integer sequence
- **`std::exchange`** — replace and return old value
- **`std::quoted`** — quoted string I/O
- **`std::mismatch` / `std::equal`** with 4 iterators

```cpp
// Generic lambda
auto add = [](auto a, auto b) { return a + b; };

// Return type deduction
auto divide(double a, double b) { return a / b; }

// Binary literals with digit separators
int mask = 0b1010'1100;
int million = 1'000'000;

// Variable template
template<typename T>
constexpr T pi = T(3.14159265358979);
double dp = pi<double>;
float fp = pi<float>;
```

## C++11

### Language Features
- **`auto`** — type inference
- **`decltype`** — deduce type from expression
- **Range-based for** — `for (auto x : container)`
- **Lambda expressions** — `[](int x) { return x; }`
- **Move semantics** — `std::move`, rvalue references `&&`
- **Smart pointers** — `std::unique_ptr`, `std::shared_ptr`, `std::weak_ptr`
- **`nullptr`** — type-safe null pointer
- **`constexpr`** — compile-time constant expressions
- **Variadic templates** — `template<typename... Args>`
- **Initializer lists** — `std::vector v{1, 2, 3};`
- **Uniform initialization** — `int x{42};`
- **Type aliases** — `using IntVec = std::vector<int>;`
- **`enum class`** — scoped enumerations
- **`final` and `override`** — virtual function control
- **`= default` and `= delete`** — explicit special member control
- **`noexcept`** — exception specification
- **`static_assert`** — compile-time assertion
- **Attributes** — `[[noreturn]]`, `[[deprecated]]`, `[[carries_dependency]]`
- **Trailing return types** — `auto f() -> int`
- **Inheriting constructors** — `using Base::Base;`
- **Delegating constructors** — `Foo() : Foo(42) {}`
- **Thread-local storage** — `thread_local int x;`
- **`std::thread`** — native threads
- **`std::mutex` / `std::lock_guard`** — mutex and RAII lock
- **`std::condition_variable`** — condition variable
- **`std::future` / `std::promise` / `std::async`** — async
- **`std::atomic`** — atomic operations
- **`std::chrono`** — duration and time point
- **`std::tuple`** — tuple type
- **`std::array`** — fixed-size array
- **`std::unordered_map` / `unordered_set`** — hash containers
- **`std::function`** — type-erased callable
- **`std::bind`** — partial application
- **`std::regex`** — regular expressions
- **`std::random`** — random number generation
- **`std::type_traits`** — type traits
- **`std::initializer_list`** — initializer list type
- **User-defined literals** — `operator""_km`
- **Explicit conversion operators** — `explicit operator bool()`
- **Defaulted/deleted functions**
- **Right angle brackets** — `vector<vector<int>>` (no space needed)
- **Raw string literals** — `R"(raw string)"`
- **Unicode literals** — `u"UTF-16"`, `U"UTF-32"`, `u8"UTF-8"`

```cpp
// auto
auto x = 42;  // int

// Lambda
auto add = [](int a, int b) { return a + b; };

// Move semantics
std::string s = "hello";
std::string moved = std::move(s);  // s is now empty

// Smart pointers
auto p = std::make_unique<int>(42);
auto sp = std::make_shared<int>(42);

// nullptr
int* p = nullptr;

// Range-based for
for (const auto& x : vec) { std::cout << x; }

// enum class
enum class Color { Red, Green, Blue };
Color c = Color::Red;

// override / final
struct Derived : Base {
    void func() override final;
};

// = default / = delete
struct Widget {
    Widget() = default;
    Widget(const Widget&) = delete;
};

// static_assert
static_assert(sizeof(int) == 4, "int must be 4 bytes");

// Variadic templates
template<typename... Args>
void print(Args... args) { /* ... */ }
```
