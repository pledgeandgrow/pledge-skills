# Control Structures

## if / else

```cpp
// Basic if
if (x > 0) {
    std::cout << "positive";
}

// if-else
if (x > 0) {
    std::cout << "positive";
} else {
    std::cout << "non-positive";
}

// if-else if-else
if (x > 100) {
    std::cout << "large";
} else if (x > 10) {
    std::cout << "medium";
} else if (x > 0) {
    std::cout << "small";
} else {
    std::cout << "zero or negative";
}

// if with initializer (C++17)
if (auto it = map.find(key); it != map.end()) {
    std::cout << it->second;
} else {
    std::cout << "not found";
}

// if constexpr (C++17) — compile-time conditional
template<typename T>
void print(T value) {
    if constexpr (std::is_same_v<T, int>) {
        std::cout << "int: " << value;
    } else if constexpr (std::is_same_v<T, double>) {
        std::cout << "double: " << value;
    } else {
        std::cout << "other: " << value;
    }
}

// if consteval (C++23) — check if in constant evaluation context
consteval int f() { return 42; }
constexpr int g(int n) {
    if consteval {
        return f();  // OK: constant evaluation context
    }
    return n;  // runtime path
}
```

## switch

```cpp
// Basic switch
switch (x) {
    case 1:
        std::cout << "one";
        break;
    case 2:
        std::cout << "two";
        break;
    case 3:
        std::cout << "three";
        break;
    default:
        std::cout << "other";
        break;
}

// Fallthrough (use [[fallthrough]] to suppress warning)
switch (x) {
    case 0:
        doInit();
        [[fallthrough]];
    case 1:
        doWork();
        break;
    default:
        break;
}

// Switch with initializer (C++17)
switch (auto status = getStatus(); status) {
    case Status::OK:   std::cout << "OK"; break;
    case Status::Error: std::cout << "Error"; break;
}

// Switch on enum
enum class Color { Red, Green, Blue };
switch (color) {
    using enum Color;  // C++20: bring enum values into scope
    case Red:   std::cout << "red"; break;
    case Green: std::cout << "green"; break;
    case Blue:  std::cout << "blue"; break;
}

// Switch with range (C++26: pattern matching not yet, but can use if)
// C++26: break? with value (not standard yet)
```

## while / do-while

```cpp
// while loop
while (condition) {
    // body
}

int i = 0;
while (i < 10) {
    std::cout << i++;
}

// do-while — body executes at least once
do {
    // body
} while (condition);

int n = 5;
do {
    std::cout << n--;
} while (n > 0);

// Infinite loop with break
while (true) {
    if (shouldStop()) break;
    process();
}
```

## for / range-for

```cpp
// Traditional for loop
for (int i = 0; i < 10; ++i) {
    std::cout << i;
}

// Multiple variables
for (int i = 0, j = 10; i < j; ++i, --j) {
    std::cout << i << ":" << j;
}

// Infinite for
for (;;) {
    if (done()) break;
}

// Range-based for (C++11)
std::vector<int> v = {1, 2, 3, 4, 5};
for (int x : v) {           // by value (copy)
    std::cout << x;
}
for (int& x : v) {          // by reference (can modify)
    x *= 2;
}
for (const int& x : v) {    // by const reference (no copy, read-only)
    std::cout << x;
}
for (auto x : v) {          // auto by value
    std::cout << x;
}
for (auto& x : v) {         // auto by reference
    x *= 2;
}
for (const auto& x : v) {   // auto by const reference (most common)
    std::cout << x;
}

// Range-for with initializer (C++20)
for (std::vector v = getData(); auto& x : v) {
    std::cout << x;
}

// Range-for over array
int arr[] = {1, 2, 3, 4, 5};
for (auto x : arr) { std::cout << x; }

// Range-for over initializer_list
for (auto x : {1, 2, 3, 4, 5}) { std::cout << x; }

// Range-for over string
std::string s = "hello";
for (auto ch : s) { std::cout << ch; }

// Range-for over map
std::map<std::string, int> m = {{"a", 1}, {"b", 2}};
for (const auto& [key, value] : m) {  // structured bindings (C++17)
    std::cout << key << ":" << value;
}

// Range-for with views (C++20)
#include <ranges>
for (auto x : v | std::views::filter([](int n) { return n % 2 == 0; })
                | std::views::transform([](int n) { return n * n; })) {
    std::cout << x;  // squares of even numbers
}
```

## break / continue / goto

```cpp
// break — exit nearest loop or switch
for (int i = 0; i < 100; ++i) {
    if (i == 42) break;  // exit loop
    std::cout << i;
}

// continue — skip to next iteration
for (int i = 0; i < 10; ++i) {
    if (i % 2 == 0) continue;  // skip even numbers
    std::cout << i;  // 1, 3, 5, 7, 9
}

// break in nested loops (no labeled break in C++ — use flag or function)
bool found = false;
for (int i = 0; i < n && !found; ++i) {
    for (int j = 0; j < m && !found; ++j) {
        if (matrix[i][j] == target) {
            found = true;
            break;
        }
    }
}

// goto — generally avoid, but useful for cleanup
void func() {
    resource* r1 = acquire();
    if (!r1) goto cleanup;
    
    resource* r2 = acquire();
    if (!r2) goto cleanup_r1;
    
    // use resources
    release(r2);
cleanup_r1:
    release(r1);
cleanup:
    return;
}

// goto cannot jump over variable initializations
// goto label; int x = 42; label: // error
// But:
goto label; // OK if x is not used between goto and label
label:
int x = 42;
```

## return

```cpp
// Return value
int add(int a, int b) { return a + b; }

// Return by reference
int& at(std::vector<int>& v, size_t i) { return v[i]; }

// Return void
void print(int x) { std::cout << x; return; }  // return optional

// Return with NRVO (Named Return Value Optimization)
std::string makeString() {
    std::string result = "hello";
    return result;  // NRVO: no copy
}

// Return with URVO (Unnamed Return Value Optimization)
std::string makeString() {
    return std::string("hello");  // URVO: no copy
}

// Return by auto (C++14)
auto divide(double a, double b) { return a / b; }  // return type deduced as double

// Return decltype(auto) (C++14) — preserves references
decltype(auto) getRef(int& x) { return (x); }  // returns int&

// Return with [[nodiscard]]
[[nodiscard]] int compute() { return 42; }
// compute(); // warning: return value discarded

// Multiple return values
auto divmod(int a, int b) {
    struct Result { int quotient; int remainder; };
    return Result{a / b, a % b};
}
auto [q, r] = divmod(17, 5);  // q=3, r=2

// Via std::tuple
#include <tuple>
std::tuple<int, int> divmod2(int a, int b) {
    return {a / b, a % b};
}
```

## Exception Handling in Control Flow

```cpp
try {
    riskyOperation();
} catch (const std::runtime_error& e) {
    std::cerr << "Runtime error: " << e.what();
} catch (const std::exception& e) {
    std::cerr << "Exception: " << e.what();
} catch (...) {
    std::cerr << "Unknown exception";
}

// throw as expression
int x = condition ? value : throw std::invalid_argument("bad condition");
```
