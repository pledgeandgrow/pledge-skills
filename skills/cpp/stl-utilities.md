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

// Compile-time variant introspection
std::variant_size_v<decltype(v2)>;  // 2 (number of alternatives)
std::variant_alternative_t<0, decltype(v2)>;  // int (type at index 0)
std::variant_alternative_t<1, decltype(v2)>;  // double (type at index 1)

// variant_npos — invalid state after exception during emplace
v2 = std::variant<int, double>(std::monostate{});
// If emplace throws, variant becomes valueless_by_exception
v2.valueless_by_exception();  // true if in invalid state
v2.index();  // variant_npos (-1) if valueless

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

## std::bind_front (C++20) and std::bind_back (C++23)

```cpp
#include <functional>

// std::bind_front — bind leading arguments (simpler than std::bind)
auto add = [](int a, int b, int c) { return a + b + c; };

auto f1 = std::bind_front(add, 1);       // bind first arg
f1(2, 3);  // add(1, 2, 3) = 6

auto f2 = std::bind_front(add, 1, 2);    // bind first two args
f2(3);     // add(1, 2, 3) = 6

// Bind member function with object
struct Calc {
    int add(int a, int b) const { return a + b; }
};
Calc calc;
auto f3 = std::bind_front(&Calc::add, &calc);
f3(2, 3);  // calc.add(2, 3) = 5

// std::bind_back (C++23) — bind trailing arguments
auto div = [](int a, int b) { return a / b; };
auto half = std::bind_back(div, 2);
half(10);  // div(10, 2) = 5

// bind_front vs std::bind:
// - bind_front is simpler, no placeholders needed
// - bind_front preserves noexcept, const, ref-qualifiers
// - std::bind is more flexible (reorder args with _1, _2)
// - Prefer bind_front or lambdas over std::bind
```

## std::move_only_function (C++23)

```cpp
#include <functional>  // C++23

// std::move_only_function — like std::function but move-only callables
// Can store lambdas with move-only captures (e.g., unique_ptr)

std::unique_ptr<int> up = std::make_unique<int>(42);

// std::function cannot hold this — it requires CopyConstructible
// std::function<void()> f = [up = std::move(up)] { /* ... */ };  // error!

// std::move_only_function can:
std::move_only_function<void()> f = [up = std::move(up)] {
    std::cout << "value: " << *up << '\n';
};
f();  // OK

// Move-only function pointer
std::move_only_function<int(int)> op =
    [state = std::make_unique<int>(0)](int x) mutable {
        *state += x;
        return *state;
    };
op(5);   // 5
op(10);  // 15

// Differences from std::function:
// - Move-only (not copyable)
// - Can store move-only callables
// - Same type erasure, same call syntax
// - Slightly less overhead (no copy support needed)

// std::function_ref (C++26) — non-owning reference to callable
// Lightweight: no allocation, no type erasure overhead
// Like std::function but only borrows the callable — does not own it
// Must ensure the callable outlives the function_ref

void callback(std::function_ref<int(int)> cb) {
    cb(42);
}

// Usage — no heap allocation, very efficient
auto lambda = [](int x) { return x * 2; };
callback(lambda);  // 84

// With member function
struct Adder {
    int add(int x) const { return x + 10; }
};
Adder adder;
callback(std::bind_front(&Adder::add, &adder));  // 52

// function_ref vs std::function vs move_only_function:
// std::function:        owns callable, copyable, may allocate
// move_only_function:   owns callable, move-only, may allocate
// function_ref:         borrows callable, copyable, no allocation
// Use function_ref for parameters — like passing a function pointer
// but works with any callable (lambdas, bind expressions, etc.)
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

## std::hash

```cpp
#include <functional>

// std::hash — hash function for use with unordered containers
std::hash<int> hashInt;
std::hash<std::string> hashStr;
std::hash<double> hashDouble;

size_t h1 = hashInt(42);
size_t h2 = hashStr("hello");
size_t h3 = hashDouble(3.14);

// Built-in hash specializations
// All arithmetic types, pointers, error_code, error_condition
// std::string, std::wstring, std::u16string, std::u32string, std::u8string
// std::string_view, std::wstring_view, etc.
// std::unique_ptr, std::shared_ptr
// std::optional<T>, std::variant<Ts...>
// std::tuple<Ts...>, std::pair<T1, T2>
// std::bitset, std::vector<bool>
// enum types (C++14)

// Custom hash for user-defined type
struct Person {
    std::string name;
    int age;
    
    bool operator==(const Person& o) const {
        return name == o.name && age == o.age;
    }
};

struct PersonHash {
    size_t operator()(const Person& p) const {
        return std::hash<std::string>{}(p.name) ^
              (std::hash<int>{}(p.age) << 1);
    }
};

std::unordered_map<Person, std::string, PersonHash> map;

// Custom hash via specialization (alternative)
namespace std {
    template<>
    struct hash<Person> {
        size_t operator()(const Person& p) const {
            return hash<string>{}(p.name) ^ (hash<int>{}(p.age) << 1);
        }
    };
}
// Now std::unordered_map<Person, T> works without explicit hash parameter

// Hash combination pattern (boost-style)
template<typename... Ts>
size_t hashCombine(const Ts&... args) {
    size_t seed = 0;
    ((seed ^= std::hash<Ts>{}(args) + 0x9e3779b9 + (seed << 6) + (seed >> 2)), ...);
    return seed;
}

// Hash for pair (if not automatically available)
struct PairHash {
    template<typename T1, typename T2>
    size_t operator()(const std::pair<T1, T2>& p) const {
        return hashCombine(p.first, p.second);
    }
};
```

## std::reference_wrapper

```cpp
#include <functional>

// std::reference_wrapper — copyable, assignable wrapper around reference
// Useful for storing references in containers (which can't hold raw references)

int x = 42;
std::reference_wrapper<int> ref(x);
ref.get() = 10;  // x is now 10
int& r = ref;    // implicit conversion to reference
ref() = 20;      // operator() — x is now 20

// Store references in container
int a = 1, b = 2, c = 3;
std::vector<std::reference_wrapper<int>> refs = {a, b, c};
refs[0].get() = 10;  // a is now 10

// std::ref / std::cref — create reference_wrapper
auto rw = std::ref(x);   // std::reference_wrapper<int>
auto crw = std::cref(x); // std::reference_wrapper<const int>

// Use with std::bind
void func(int& x) { x *= 2; }
int val = 5;
auto bound = std::bind(func, std::ref(val));
bound();  // val is now 10
// Without std::ref, bind would copy val

// Use with std::thread
void increment(int& x) { ++x; }
int counter = 0;
std::thread t(increment, std::ref(counter));
t.join();
// counter is now 1

// Use with algorithms
std::vector<int> v = {3, 1, 4, 1, 5};
std::sort(v.begin(), v.end(), std::ref(customComparator));

// reference_wrapper is assignable (unlike raw references)
int y = 100;
ref = y;  // ref now wraps y (not x)
```

## std::bitset

```cpp
#include <bitset>

// Fixed-size bit array — size known at compile time
std::bitset<8> b1;            // 00000000
std::bitset<8> b2(0xFF);      // 11111111
std::bitset<8> b3("10101010"); // 10101010
std::bitset<16> b4(0xABCD);   // 1010101111001101

// Bit operations
b1.set(3);        // 00001000 — set bit 3
b1.set();         // 11111111 — set all bits
b1.reset(1);      // 11111101 — clear bit 1
b1.reset();       // 00000000 — clear all
b1.flip(2);       // 00000100 — toggle bit 2
b1.flip();        // 11111011 — toggle all

// Test
b1.test(2);       // true if bit 2 is set
b1.all();         // true if all bits set
b1.any();         // true if any bit set
b1.none();        // true if no bits set
b1.count();       // number of set bits

// Access
b1[0];            // bit 0 (proxy reference)
b1.size();        // 8

// Conversions
b1.to_string();   // "11111011"
b1.to_ulong();    // unsigned long
b1.to_ullong();   // unsigned long long

// Bitwise operations
std::bitset<8> a("1100");
std::bitset<8> b("1010");
auto c1 = a & b;  // 1000
auto c2 = a | b;  // 1110
auto c3 = a ^ b;  // 0110
auto c4 = ~a;     // 0011
auto c5 = a << 2; // 110000
auto c6 = a >> 1; // 0110

// I/O
std::cout << b1;  // prints bit string
std::cin >> b1;   // reads bit string
```

## std::not_fn (C++17)

```cpp
#include <functional>

// std::not_fn — negates a callable
auto is_even = [](int x) { return x % 2 == 0; };
auto is_odd = std::not_fn(is_even);
is_odd(3);  // true
is_odd(4);  // false

// With standard function objects
auto not_less = std::not_fn(std::less<int>());
not_less(3, 2);  // true (not (3 < 2))

// With member function
struct Validator {
    bool is_valid(int x) const { return x > 0; }
};
Validator v;
auto is_invalid = std::not_fn(&Validator::is_valid);
is_invalid(v, -1);  // true

// Replaces deprecated std::not1, std::not2, std::unary_negate, std::binary_negate
```

## std::mem_fn (C++11)

```cpp
#include <functional>

// std::mem_fn — creates callable from member function/variable pointer
struct Widget {
    int value = 42;
    int getValue() const { return value; }
    void setValue(int v) { value = v; }
};

Widget w;
auto getter = std::mem_fn(&Widget::getValue);
getter(w);  // 42

auto setter = std::mem_fn(&Widget::setValue);
setter(w, 100);  // w.value = 100

// Member variable
auto val = std::mem_fn(&Widget::value);
val(w);  // 100

// With containers
std::vector<Widget> widgets = {Widget{1}, Widget{2}, Widget{3}};
std::ranges::transform(widgets, dst.begin(), std::mem_fn(&Widget::getValue));

// std::mem_fn vs std::bind:
// - mem_fn is simpler for single member access
// - bind allows binding specific arguments
// - Prefer lambdas or mem_fn over bind
```

## std::out_ptr / std::inout_ptr (C++23)

```cpp
#include <memory>

// std::out_ptr — get raw pointer from smart pointer for C-style APIs
// Common pattern: C API returns pointer via out-parameter

// Old way (C API: int* result)
std::unique_ptr<int> up;
int* raw = nullptr;
c_api_create(&raw);          // C API allocates
up.reset(raw);               // transfer ownership

// C++23 way
std::unique_ptr<int, decltype(&c_api_free)> up(nullptr, c_api_free);
c_api_create(std::out_ptr(up));  // directly into unique_ptr
// on success: up holds the pointer
// on failure: up remains null

// std::inout_ptr — for APIs that take pointer-to-pointer (may modify)
std::unique_ptr<FILE, decltype(&fclose)> fp(nullptr, &fclose);
c_api_reopen(std::inout_ptr(fp), "file.txt");

// Difference:
// - out_ptr: assumes input is null, releases old value first
// - inout_ptr: passes existing pointer, may reallocate
// - Both handle the smart pointer deleter correctly
// - Both work with unique_ptr, shared_ptr
```
