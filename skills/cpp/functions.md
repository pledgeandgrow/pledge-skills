# Functions

## Function Declaration and Definition

```cpp
// Declaration (prototype) — in header
int add(int a, int b);
void print(const std::string& s);

// Definition — in source file
int add(int a, int b) {
    return a + b;
}

void print(const std::string& s) {
    std::cout << s << '\n';
}

// Default arguments — in declaration only
void log(const std::string& msg, int level = 0, bool timestamp = true);
// log("hello");              // level=0, timestamp=true
// log("hello", 2);           // timestamp=true
// log("hello", 2, false);    // all explicit

// Forward declaration with default in header
// Must not repeat defaults in definition
void log(const std::string& msg, int level = 0, bool timestamp = true) {
    // implementation
}
```

## Function Overloading

```cpp
void print(int x) { std::cout << "int: " << x; }
void print(double x) { std::cout << "double: " << x; }
void print(const std::string& s) { std::cout << "string: " << s; }
void print(const char* s) { std::cout << "C-string: " << s; }
void print(int x, int y) { std::cout << x << ", " << y; }

print(42);           // print(int)
print(3.14);         // print(double)
print("hello");      // print(const char*) — exact match preferred
print(std::string("hello")); // print(const string&)

// Ambiguity — error
// void print(long x);
// print(42);  // error: ambiguous (int → long vs int → double)

// Overload resolution order:
// 1. Exact match
// 2. Promotion
// 3. Standard conversion
// 4. User-defined conversion
// 5. Variadic
```

## Pass-by-Value, Reference, Pointer

```cpp
// By value — copy made, modifications don't affect caller
void byValue(int x) { x = 10; }

// By lvalue reference — can modify caller's variable
void byRef(int& x) { x = 10; }

// By const reference — no copy, can't modify (preferred for large types)
void byConstRef(const std::string& s) { std::cout << s; }

// By rvalue reference — for move semantics
void byRvalue(std::string&& s) { std::string moved = std::move(s); }

// By pointer
void byPtr(int* p) { *p = 10; }
void byPtrConst(const int* p) { std::cout << *p; }  // can't modify *p
void byPtrToPtr(int** pp) { **pp = 10; }

// Universal/forwarding reference (template only)
template<typename T>
void forward(T&& arg) {
    target(std::forward<T>(arg));
}
```

## Inline Functions

```cpp
// inline — hint to inline (compiler may ignore)
inline int square(int x) { return x * x; }

// Member functions defined in class are implicitly inline
struct Point {
    int x, y;
    int sum() const { return x + y; }  // implicitly inline
};

// inline variable (C++17) — avoid ODR issues in headers
inline int globalCounter = 0;
inline constexpr double PI = 3.14159;
```

## constexpr / consteval Functions

```cpp
// constexpr — may be evaluated at compile time
constexpr int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

constexpr int f5 = factorial(5);  // 120, compile-time
int n = 5;
int fn = factorial(n);  // runtime (n is not constexpr)

// consteval — MUST be evaluated at compile time (C++20)
consteval int square(int n) { return n * n; }
constexpr int sq = square(5);  // OK: compile-time
// int x = square(n);  // error: n is not constant

// consteval with immediate function context
consteval int double_it(int n) { return n * 2; }
consteval int compute() { return double_it(21); }  // OK: both consteval

// constexpr with if constexpr
constexpr int abs_val(int n) {
    if constexpr (true) {
        return n < 0 ? -n : n;
    }
}

// constexpr recursive (depth limited by compiler, typically 512)
constexpr int fib(int n) {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
}
constexpr int f10 = fib(10);  // 55

// constexpr with local variables (C++14+)
constexpr int sum_to(int n) {
    int sum = 0;
    for (int i = 1; i <= n; ++i) sum += i;
    return sum;
}
constexpr int s100 = sum_to(100);  // 5050
```

## Lambda Expressions

```cpp
// Basic lambda
auto add = [](int a, int b) { return a + b; };
int result = add(2, 3);  // 5

// With captures
int x = 10;
auto captureByValue = [x](int y) { return x + y; };        // capture x by value
auto captureByRef = [&x](int y) { return x + y; };         // capture x by reference
auto captureAllByValue = [=](int y) { return x + y; };     // capture all by value
auto captureAllByRef = [&](int y) { return x + y; };       // capture all by reference
auto mixed = [=, &x](int y) { return x + y; };             // all by value, x by ref
auto mixed2 = [&, x](int y) { return x + y; };             // all by ref, x by value

// With explicit return type
auto divide = [](double a, double b) -> double { return a / b; };

// With mutable (can modify by-value captures)
int counter = 0;
auto increment = [counter]() mutable { return ++counter; };
// counter in lambda is a copy, original not modified

// With parameters
auto multiply = [](int a, int b) { return a * b; };

// Generic lambda (C++14) — auto parameters
auto genericAdd = [](auto a, auto b) { return a + b; };
genericAdd(1, 2);       // 3
genericAdd(1.0, 2.0);   // 3.0
genericAdd(std::string("a"), std::string("b")); // "ab"

// Template lambda (C++20) — explicit template parameters
auto templateAdd = []<typename T>(T a, T b) { return a + b; };
auto templateAdd2 = []<typename T, typename U>(T a, U b) { return a + b; };

// Lambda with std::function
#include <functional>
std::function<int(int, int)> op = [](int a, int b) { return a + b; };

// Lambda as callback
std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });  // descending
std::sort(v.begin(), v.end(), std::less<>());  // ascending (default)

// Lambda with std::ranges (C++20)
auto evens = v | std::views::filter([](int n) { return n % 2 == 0; });
auto squares = v | std::views::transform([](int n) { return n * n; });

// Recursive lambda (via std::function)
std::function<int(int)> fib = [&](int n) -> int {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
};

// Recursive lambda (C++23: deducing this)
auto factorial = [](this auto& self, int n) -> int {
    return n <= 1 ? 1 : n * self(n - 1);
};

// Immediately invoked lambda expression (IIFE)
int x = [](int a, int b) { return a + b; }(3, 4);  // x = 7

// Lambda with init capture (C++14)
auto withInit = [sum = 0](int n) mutable { sum += n; return sum; };

// Lambda with init capture and move
auto withMove = [p = std::make_unique<int>(42)]() { return *p; };

// Lambda as comparison function for set
std::set<int, decltype([](int a, int b) { return a > b; })> descSet;

// Stateless lambda (no captures) — convertible to function pointer
int (*fp)(int, int) = [](int a, int b) { return a + b; };

// constexpr lambda (C++17)
constexpr auto square = [](int n) constexpr { return n * n; };
constexpr int sq = square(5);  // 25

// consteval lambda (C++20)
consteval auto cube = [](int n) { return n * n * n; };
constexpr int c = cube(3);  // 27
```

## Function Pointers

```cpp
// Function pointer
int (*fp)(int, int) = &add;
int result = fp(2, 3);  // 5
int result2 = (*fp)(2, 3);  // same

// Using type alias
using BinaryOp = int(*)(int, int);
BinaryOp op = &add;
op(2, 3);

// Function pointer as parameter
void apply(int* arr, int n, int (*transform)(int)) {
    for (int i = 0; i < n; ++i) arr[i] = transform(arr[i]);
}

// Member function pointer
struct Calculator {
    int add(int a, int b) { return a + b; }
    int multiply(int a, int b) { return a * b; }
};

int (Calculator::*mfp)(int, int) = &Calculator::add;
Calculator calc;
int r = (calc.*mfp)(2, 3);  // 5

Calculator* ptr = &calc;
int r2 = (ptr->*mfp)(2, 3);  // 5

// Array of function pointers
int (*ops[])(int, int) = {&add, &multiply};
ops[0](2, 3);  // 5
ops[1](2, 3);  // 6
```

## std::function

```cpp
#include <functional>

// std::function — type-erased callable
std::function<int(int, int)> op;

op = [](int a, int b) { return a + b; };
op(2, 3);  // 5

op = std::plus<int>();
op(2, 3);  // 5

op = &add;
op(2, 3);  // 5

// Member function binding
Calculator calc;
op = std::bind(&Calculator::add, &calc, std::placeholders::_1, std::placeholders::_2);
op(2, 3);  // 5

// Check if empty
if (op) { op(2, 3); }

// std::function with void return
std::function<void(int)> printer = [](int x) { std::cout << x; };

// Prefer lambdas or auto over std::function for performance
// std::function has overhead (heap allocation, virtual dispatch)
```

## Variadic Functions (C-style and Variadic Templates)

```cpp
// C-style variadic (type-unsafe, avoid)
#include <cstdarg>
int sum(int count, ...) {
    va_list args;
    va_start(args, count);
    int total = 0;
    for (int i = 0; i < count; ++i) {
        total += va_arg(args, int);
    }
    va_end(args);
    return total;
}
sum(3, 1, 2, 3);  // 6

// Variadic templates (type-safe, preferred)
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);  // fold expression (C++17)
}
sum(1, 2, 3);           // 6
sum(1, 2, 3, 4, 5);     // 15

// Fold expressions (C++17)
(args + ...);           // (arg1 + (arg2 + (arg3 + arg4)))  right fold
(... + args);           // (((arg1 + arg2) + arg3) + arg4)  left fold
(args + ... + 0);       // (arg1 + (arg2 + (arg3 + (arg4 + 0))))  right fold with init
(0 + ... + args);       // ((((0 + arg1) + arg2) + arg3) + arg4)  left fold with init

// Print all arguments
template<typename... Args>
void print(Args... args) {
    ((std::cout << args << ' '), ...);  // comma fold
}
print(1, "hello", 3.14);  // "1 hello 3.14 "

// Variadic with pack expansion
template<typename... Args>
void forward(Args&&... args) {
    target(std::forward<Args>(args)...);
}

// sizeof... — count pack elements
template<typename... Args>
constexpr size_t count() { return sizeof...(Args); }
count<int, double, char>();  // 3
```

## Coroutines (co_await, co_yield, co_return)

```cpp
#include <coroutine>

// Coroutine — function containing co_await, co_yield, or co_return
// See coroutines.md for full details

// Simple generator
generator<int> naturals() {
    int n = 1;
    while (true) {
        co_yield n++;
    }
}

// Task coroutine
task<int> compute() {
    int a = co_await async_read();
    int b = co_await async_read();
    co_return a + b;
}
```

## Default Arguments and Placeholder

```cpp
// Default arguments
void func(int a, int b = 0, double c = 1.0, const std::string& d = "default");

// Using std::placeholders with std::bind
using namespace std::placeholders;
auto f = std::bind(func, _1, 42, _2, "custom");
f(10, 2.0);  // func(10, 42, 2.0, "custom")
```
