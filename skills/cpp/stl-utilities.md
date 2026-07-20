# STL Utilities

## std::pair

```cpp
#include <utility>

// Creation
std::pair<int, std::string> p1(42, "hello");
std::pair p2(42, "hello");  // CTAD (C++17)
auto p3 = std::make_pair(42, "hello");
auto p4 = std::pair{1, 2};

// Access
p1.first;   // 42
p1.second;  // "hello"

// Structured bindings (C++17)
auto [num, str] = p1;
auto& [num2, str2] = p1;  // by reference

// Comparison (lexicographical)
p1 == p2; p1 != p2; p1 < p2; p1 > p2;
auto cmp = p1 <=> p2;  // C++20

// piecewise_construct — construct pair members with tuples
std::pair<Widget, Gadget> pw(std::piecewise_construct,
    std::forward_as_tuple(42),
    std::forward_as_tuple("hello"));

// Swap
p1.swap(p2);
```

## std::tuple

```cpp
#include <tuple>

// Creation
std::tuple<int, double, std::string> t1(1, 2.0, "three");
std::tuple t2(1, 2.0, "three");  // CTAD (C++17)
auto t3 = std::make_tuple(1, 2.0, "three");

// Access by index
std::get<0>(t1);  // 1 (int)
std::get<1>(t1);  // 2.0 (double)
std::get<2>(t1);  // "three" (string)

// Access by type (must be unique)
std::get<int>(t1);     // 1
std::get<double>(t1);  // 2.0

// Structured bindings (C++17)
auto [a, b, c] = t1;

// Size
std::tuple_size_v<decltype(t1)>;  // 3

// Element type
std::tuple_element_t<0, decltype(t1)>;  // int

// Concatenation
auto t4 = std::tuple_cat(t1, t2, std::make_tuple(true));

// Apply function to tuple
std::apply([](int a, double b, std::string c) {
    std::cout << a << b << c;
}, t1);

// make_from_tuple — construct object from tuple
auto w = std::make_from_tuple<Widget>(std::make_tuple(42, "hello"));

// forward_as_tuple — tuple of references (for forwarding)
auto ft = std::forward_as_tuple(42, std::string("hello"));

// tie — tuple of references (for unpacking)
int a; double b; std::string c;
std::tie(a, b, c) = t1;  // unpack tuple

// Ignore
std::tie(a, std::ignore, c) = t1;  // ignore second element

// Comparison
t1 == t2; t1 <=> t2;  // lexicographical (C++20)
```

## std::optional (C++17)

```cpp
#include <optional>

// Creation
std::optional<int> o1;                    // empty (nullopt)
std::optional<int> o2 = std::nullopt;     // empty
std::optional<int> o3 = 42;               // contains 42
std::optional<int> o4{42};                // contains 42
std::optional o5 = 42;                    // CTAD (C++17)
std::optional<int> o6 = std::make_optional(42);

// Check
o1.has_value();  // false
bool b = static_cast<bool>(o3);  // true
if (o3) { /* has value */ }

// Access
*o3;              // 42 (UB if empty)
o3.value();       // 42 (throws std::bad_optional_access if empty)
o3.value_or(0);   // 42 (default if empty)
o3.value_or(0);   // 0 if o3 is empty

// Monadic operations (C++23)
auto result = o3.and_then([](int x) -> std::optional<int> {
    return x * 2;
});  // optional(84)

auto result2 = o3.transform([](int x) { return x * 2; });  // optional(84)

auto result3 = o1.or_else([]() -> std::optional<int> {
    return 0;
});  // optional(0)

// Modify
o3 = 100;        // assign new value
o3.reset();      // destroy value, become empty
o3 = std::nullopt;  // same as reset()
o3.emplace(42);  // construct in place

// Comparison
o3 == 42;        // true (compares with contained value)
o3 == o1;        // false (o3 has value, o1 doesn't)
o3 <=> o1;       // C++20

// Function return
std::optional<int> parse(const std::string& s) {
    if (s.empty()) return std::nullopt;
    return std::stoi(s);
}

auto r = parse("42");
if (r) std::cout << *r;  // 42
std::cout << parse("").value_or(-1);  // -1
```

## std::variant (C++17)

```cpp
#include <variant>

// Creation
std::variant<int, double, std::string> v1;
std::variant<int, double, std::string> v2 = 42;
std::variant<int, double, std::string> v3 = 3.14;
std::variant<int, double, std::string> v4 = "hello";

// Check current type
v1.index();  // 0 (default-constructed first alternative)
v2.index();  // 0 (int)
v3.index();  // 1 (double)

// Holds alternative
std::holds_alternative<int>(v2);    // true
std::holds_alternative<double>(v2); // false

// Access
std::get<int>(v2);     // 42 (throws std::bad_variant_access if wrong)
std::get<0>(v2);       // 42 (by index)
std::get_if<int>(&v2); // pointer to int (nullptr if wrong)
std::get_if<0>(&v2);   // pointer to int

// Visit — apply function to current alternative
std::visit([](auto&& arg) {
    std::cout << arg;
}, v2);

// Visit with multiple variants
std::variant<int, double> a = 1, b = 2.0;
std::visit([](auto x, auto y) {
    std::cout << x + y;
}, a, b);

// Visit with overloaded lambda (C++17)
auto visitor = std::overloaded {
    [](int x) { std::cout << "int: " << x; },
    [](double x) { std::cout << "double: " << x; },
    [](const std::string& s) { std::cout << "string: " << s; },
};
std::visit(visitor, v2);

// Modify
v2 = 3.14;     // change to double
v2 = "hello";  // change to string
v2.emplace<int>(100);

// monostate — for empty variant alternative
std::variant<std::monostate, int, double> v5;  // default = monostate

// Comparison
v2 == v3;  // compares current alternatives
v2 <=> v3; // C++20
```

## std::any (C++17)

```cpp
#include <any>

// Creation
std::any a1;                          // empty
std::any a2 = 42;                     // contains int
std::any a3 = 3.14;                   // contains double
std::any a4 = std::string("hello");   // contains string

// Check
a1.has_value();  // false
a2.has_value();  // true
a2.type();       // typeid(int)

// Access
std::any_cast<int>(a2);   // 42 (throws std::bad_any_cast if wrong type)
std::any_cast<int>(a2);   // 42
auto* ptr = std::any_cast<int>(&a2);  // pointer (nullptr if wrong)

// Modify
a2 = 3.14;    // change type to double
a2.reset();   // clear
a2.emplace<std::string>("hello");  // construct in place

// Make any
auto a5 = std::make_any<int>(42);
auto a6 = std::make_any<std::string>(5, 'x');  // "xxxxx"
```

## std::function

```cpp
#include <functional>

// Type-erased callable
std::function<int(int, int)> op = [](int a, int b) { return a + b; };
op(2, 3);  // 5

// Can hold any callable
op = std::plus<int>();    // function object
op(2, 3);  // 5

int (*fp)(int, int) = [](int a, int b) { return a * b; };
op = fp;
op(2, 3);  // 6

// Member function
struct Calc {
    int add(int a, int b) { return a + b; }
};
Calc calc;
op = std::bind(&Calc::add, &calc, std::placeholders::_1, std::placeholders::_2);
op(2, 3);  // 5

// Check if empty
std::function<void()> f;
if (!f) { /* empty */ }
f = nullptr;  // clear

// Prefer lambdas / auto over std::function for performance
// std::function has overhead (type erasure, possible heap allocation)
```

## std::bind and Placeholders

```cpp
#include <functional>

using namespace std::placeholders;

// Bind
auto add = [](int a, int b, int c) { return a + b + c; };
auto f1 = std::bind(add, 1, _1, _2);
f1(2, 3);  // add(1, 2, 3) = 6

auto f2 = std::bind(add, _1, _1, _2);
f2(10, 20);  // add(10, 10, 20) = 40

// Bind member function
struct Calc {
    int add(int a, int b) { return a + b; }
};
Calc calc;
auto f3 = std::bind(&Calc::add, &calc, _1, _2);
f3(2, 3);  // 5

// Bind member variable
struct Point { int x, y; };
Point p{10, 20};
auto f4 = std::bind(&Point::x, _1);
f4(p);  // 10

// Prefer lambdas over std::bind (clearer, sometimes more efficient)
auto f5 = [&calc](int a, int b) { return calc.add(a, b); };
```

## Utility Functions

```cpp
#include <utility>

// move
int x = 42;
int&& r = std::move(x);  // cast to rvalue reference
// x is now in moved-from state (valid but unspecified)

// forward
template<typename T>
void wrapper(T&& arg) {
    target(std::forward<T>(arg));  // perfect forwarding
}

// move_if_noexcept
template<typename T>
void safeMove(T& src) {
    auto dst = std::move_if_noexcept(src);  // move if noexcept, else copy
}

// swap
int a = 1, b = 2;
std::swap(a, b);  // a=2, b=1

// exchange
int old = std::exchange(a, 100);  // old=2, a=100

// declval
template<typename T>
using ReturnType = decltype(std::declval<T>().foo());  // get return type without constructing

// as_const
const auto& cref = std::as_const(x);  // const reference to x

// to_underlying (C++23)
enum class Color { Red, Green, Blue };
int r = std::to_underlying(Color::Red);  // 0

// cmp_equal, cmp_less, etc. (C++20) — safe comparison between signed/unsigned
std::cmp_equal(-1, 0xFFFFFFFFu);  // false (no sign-conversion UB)
std::cmp_less(-1, 1u);            // true

// in_range (C++20)
std::in_range<int>(42u);    // true
std::in_range<int>(-1u);    // false
```

## source_location (C++20)

```cpp
#include <source_location>

void log(const std::string& msg, 
         const std::source_location& loc = std::source_location::current()) {
    std::cout << loc.file_name() << ':' << loc.line() 
              << " [" << loc.function_name() << "] " << msg << '\n';
}

log("Hello");  // prints: file.cpp:42 [main] Hello
```

## compare_three_way and friends

```cpp
#include <compare>

// Three-way comparison
std::compare_three_way{}(1, 2);  // std::strong_ordering::less

// Comparison function objects
std::less<>{}(1, 2);        // true
std::less_equal<>{}(2, 2);  // true
std::greater<>{}(3, 2);     // true
std::greater_equal<>{}(2, 2); // true
std::equal_to<>{}(2, 2);    // true
std::not_equal_to<>{}(1, 2); // true

// Arithmetic function objects
std::plus<>{}(1, 2);        // 3
std::minus<>{}(3, 1);       // 2
std::multiplies<>{}(2, 3);  // 6
std::divides<>{}(6, 2);     // 3
std::modulus<>{}(7, 3);     // 1
std::negate<>{}(5);         // -5

// Logical
std::logical_and<>{}(true, false);  // false
std::logical_or<>{}(true, false);   // true
std::logical_not<>{}(true);         // false

// Bitwise
std::bit_and<>{}(0b1100, 0b1010);  // 0b1000
std::bit_or<>{}(0b1100, 0b1010);   // 0b1110
std::bit_xor<>{}(0b1100, 0b1010);  // 0b0110
std::bit_not<>{}(0b1100);          // ...11110011
```

## byte (C++17)

```cpp
#include <cstddef>

std::byte b{42};
b |= std::byte{0x0F};
b &= std::byte{0xF0};
b ^= std::byte{0xFF};
b <<= 2;
b >>= 2;
std::to_integer<int>(b);  // convert to integer

// Type-safe byte operations
std::byte data[4] = {std::byte{0xDE}, std::byte{0xAD}, std::byte{0xBE}, std::byte{0xEF}};
```
