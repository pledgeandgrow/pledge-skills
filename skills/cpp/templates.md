# Templates

## Function Templates

```cpp
// Basic function template
template<typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

max(3, 7);        // int — T=int
max(3.14, 2.71);  // double — T=double
max<int>(3, 7);   // explicit T=int

// Multiple type parameters
template<typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {  // trailing return type (C++11)
    return a + b;
}
// C++14: auto return type deduction
template<typename T, typename U>
auto add2(T a, U b) { return a + b; }

// Non-type template parameter
template<int N>
int multiply(int x) { return x * N; }
multiply<5>(10);  // 50

// Template with non-type auto (C++17)
template<auto N>
void print() { std::cout << N; }
print<42>();   // int
print<'A'>();  // char

// Template with pointer/reference non-type parameter
template<int* P>
void set(int v) { *P = v; }
int x;
set<&x>(42);
```

## Class Templates

```cpp
template<typename T, size_t N>
class Array {
    T data[N];
public:
    T& operator[](size_t i) { return data[i]; }
    const T& operator[](size_t i) const { return data[i]; }
    constexpr size_t size() const { return N; }
};

Array<int, 10> arr;
arr[0] = 42;

// Template with default arguments
template<typename T = int, size_t N = 10>
class Buffer {
    T data[N];
public:
    T& at(size_t i) { return data[i]; }
};

Buffer<> b;          // uses defaults: int, 10
Buffer<double> b2;   // double, 10
Buffer<double, 100> b3;

// Class template with methods defined outside
template<typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& value);
    T pop();
    bool empty() const;
};

template<typename T>
void Stack<T>::push(const T& value) {
    data.push_back(value);
}

template<typename T>
T Stack<T>::pop() {
    T value = std::move(data.back());
    data.pop_back();
    return value;
}

template<typename T>
bool Stack<T>::empty() const {
    return data.empty();
}
```

## Template Specialization

```cpp
// Primary template
template<typename T>
struct TypeName {
    static std::string get() { return "unknown"; }
};

// Full specialization
template<>
struct TypeName<int> {
    static std::string get() { return "int"; }
};

template<>
struct TypeName<double> {
    static std::string get() { return "double"; }
};

template<>
struct TypeName<std::string> {
    static std::string get() { return "string"; }
};

TypeName<int>::get();          // "int"
TypeName<double>::get();       // "double"
TypeName<char>::get();         // "unknown"

// Partial specialization (class templates only)
template<typename T>
struct TypeName<T*> {
    static std::string get() { return "pointer"; }
};

template<typename T, size_t N>
struct TypeName<T[N]> {
    static std::string get() { return "array"; }
};

TypeName<int*>::get();         // "pointer"
TypeName<int[10]>::get();      // "array"

// Function template — no partial specialization, use overloading
template<typename T>
void process(T x) { std::cout << "generic"; }

void process(int x) { std::cout << "int"; }  // overload, not specialization
process(42);  // "int" (overload preferred over template)
```

## Variadic Templates

```cpp
// Variadic template pack
template<typename... Args>
void print(Args... args) {
    ((std::cout << args << ' '), ...);  // fold expression (C++17)
}

print(1, "hello", 3.14);  // "1 hello 3.14 "

// Recursive pack expansion (pre-C++17)
template<typename T>
void print(T arg) {
    std::cout << arg << '\n';
}

template<typename T, typename... Rest>
void print(T first, Rest... rest) {
    std::cout << first << ' ';
    print(rest...);  // recurse
}

// Variadic class template
template<typename... Ts>
struct Tuple {};

template<typename T, typename... Ts>
struct Tuple<T, Ts...> : Tuple<Ts...> {
    T value;
    Tuple(T v, Ts... rest) : Tuple<Ts...>(rest...), value(v) {}
};

// std::tuple is the standard way
auto t = std::make_tuple(1, "hello", 3.14);

// Pack indexing (C++26)
template<typename... Args>
using FirstArg = Args...[0];  // first type in pack

// Pack expansion in different contexts
template<typename... Bases>
struct Derived : Bases... {
    using Bases::operator()...;  // using pack expansion (C++17)
};

// Lambda with variadic pack
auto make_tuple = []<typename... Ts>(Ts... args) {
    return std::tuple<Ts...>(std::move(args)...);
};
```

## Fold Expressions (C++17)

```cpp
// Unary right fold: (pack op ...)
(args + ...);       // arg1 + (arg2 + (arg3 + arg4))
(args && ...);      // arg1 && (arg2 && (arg3 && arg4))
(args || ...);      // arg1 || (arg2 || (arg3 || arg4))

// Unary left fold: (... op pack)
(... + args);       // ((arg1 + arg2) + arg3) + arg4
(... << args);      // ((arg1 << arg2) << arg3) << arg4  — useful for streaming

// Binary right fold: (pack op ... op init)
(args + ... + 0);   // arg1 + (arg2 + (arg3 + (arg4 + 0)))
(args && ... && true);  // all true

// Binary left fold: (init op ... op pack)
(0 + ... + args);   // (((0 + arg1) + arg2) + arg3) + arg4
(true && ... && args);  // all true

// Practical examples
template<typename... Args>
auto sum(Args... args) { return (args + ... + 0); }

template<typename... Args>
auto allTrue(Args... args) { return (args && ... && true); }

template<typename... Args>
void printAll(Args... args) { (std::cout << ... << args) << '\n'; }

template<typename... Args>
bool allSame(Args... args) { return ((args == first) && ...); }
```

## CTAD (Class Template Argument Deduction, C++17)

```cpp
// Deduction guide
template<typename T, typename Alloc = std::allocator<T>>
class Vector {
public:
    Vector(size_t n, const T& val) {}
    Vector(std::initializer_list<T> init) {}
};

// Implicit CTAD
Vector v1(10, 5);              // Vector<int>
Vector v2{1, 2, 3, 4};        // Vector<int>

// Explicit deduction guide
template<typename T>
Vector(size_t, T) -> Vector<T>;

Vector v3(10, 3.14);           // Vector<double>

// std::pair / std::tuple CTAD
std::pair p(1, "hello");       // pair<int, const char*>
std::tuple t(1, 2.0, "three"); // tuple<int, double, const char*>

// std::vector CTAD
std::vector v{1, 2, 3};        // vector<int>
std::vector v2{std::pair{1, "a"}, {2, "b"}};  // vector<pair<int, const char*>>

// std::array CTAD (C++17)
std::array arr{1, 2, 3, 4, 5};  // array<int, 5>

// std::optional CTAD
std::optional opt = 42;  // optional<int>

// std::function CTAD
std::function f = [](int x) { return x * 2; };  // function<int(int)>
```

## Concepts (C++20)

```cpp
#include <concepts>

// Built-in concepts
template<std::integral T>
T gcd(T a, T b) {  // T must be an integral type
    while (b != 0) { T t = b; b = a % b; a = t; }
    return a;
}

template<std::floating_point T>
T square(T x) { return x * x; }

template<typename T>
requires std::sortable<T>
void sortIt(T& container) { std::sort(container.begin(), container.end()); }

// Custom concept
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

template<Addable T>
T sum(std::vector<T> v) {
    T result = T{};
    for (auto& x : v) result = result + x;
    return result;
}

// Multi-requirement concept
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<typename T>
concept Hashable = requires(T a) {
    { std::hash<T>{}(a) } -> std::convertible_to<std::size_t>;
};

// Concept with multiple constraints
template<typename T>
concept Container = requires(T c) {
    typename T::value_type;
    typename T::iterator;
    typename T::const_iterator;
    { c.begin() } -> std::same_as<typename T::iterator>;
    { c.end() } -> std::same_as<typename T::iterator>;
    { c.size() } -> std::convertible_to<std::size_t>;
};

// Using concepts in templates
// requires clause
template<typename T>
requires Container<T> && Addable<typename T::value_type>
auto sumAll(const T& c) {
    typename T::value_type total{};
    for (const auto& x : c) total = total + x;
    return total;
}

// Inline concept in template parameter
template<Container C>
void process(C& c) { /* ... */ }

// Abbreviated function template (C++20)
void process2(std::integral auto x) { /* x is integral */ }
auto add3(std::integral auto a, std::integral auto b) { return a + b; }

// Concept in class template
template<typename T>
requires std::movable<T> && std::copyable<T>
class Container2 { /* ... */ };

// Requires expression in if constexpr
template<typename T>
void process(T x) {
    if constexpr (requires { x.size(); }) {
        std::cout << "Has size: " << x.size();
    }
}

// Standard concepts (from <concepts>)
// std::integral, std::signed_integral, std::unsigned_integral
// std::floating_point
// std::assignable_from, std::swappable, std::swappable_with
// std::destructible, std::constructible_from, std::default_initializable
// std::movable, std::copyable, std::semiregular, std::regular
// std::same_as, std::derived_from, std::convertible_to, std::common_with
// std::boolean, std::totally_ordered, std::equality_comparable
// std::invocable, std::regular_invocable, std::predicate
// std::range, std::input_range, std::forward_range, std::bidirectional_range
// std::random_access_range, std::contiguous_range
// std::sortable, std::mergeable, std::permutable
// std::input_iterator, std::forward_iterator, std::bidirectional_iterator
// std::random_access_iterator, std::contiguous_iterator
// std::incrementable, std::weakly_incrementable
```

## SFINAE (Substitution Failure Is Not An Error)

```cpp
// SFINAE with enable_if (pre-C++20, prefer concepts)
#include <type_traits>

template<typename T, 
         typename = std::enable_if_t<std::is_integral_v<T>>>
T factorial(T n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// SFINAE with void_t
template<typename, typename = void>
struct has_size : std::false_type {};

template<typename T>
struct has_size<T, std::void_t<decltype(std::declval<T>().size())>> 
    : std::true_type {};

// C++17: if constexpr replaces most SFINAE
template<typename T>
void process(T x) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "Integral: " << x;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "Float: " << x;
    }
}

// C++20: concepts replace SFINAE
template<std::integral T>
T factorial2(T n) { return n <= 1 ? 1 : n * factorial2(n - 1); }
```

## Template Metaprogramming

```cpp
// Compile-time factorial
template<int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template<>
struct Factorial<0> {
    static constexpr int value = 1;
};

constexpr int f5 = Factorial<5>::value;  // 120

// Compile-time Fibonacci
template<int N>
struct Fib {
    static constexpr int value = Fib<N-1>::value + Fib<N-2>::value;
};

template<> struct Fib<0> { static constexpr int value = 0; };
template<> struct Fib<1> { static constexpr int value = 1; };

constexpr int fib10 = Fib<10>::value;  // 55

// Type list
template<typename... Ts>
struct TypeList {};

// Get size
template<typename List>
struct Size;

template<typename... Ts>
struct Size<TypeList<Ts...>> {
    static constexpr size_t value = sizeof...(Ts);
};

constexpr auto sz = Size<TypeList<int, double, char>>::value;  // 3
```

## Variable Templates (C++14)

```cpp
// Variable template — parameterized variable
template<typename T>
constexpr T pi = T(3.14159265358979);

// Usage
double dpi = pi<double>;       // 3.14159265358979
float fpi = pi<float>;         // 3.14159...
int ipi = pi<int>;             // 3

// With non-type parameters
template<typename T, int N>
constexpr T power_of_2 = T(1) << N;

auto p8 = power_of_2<int, 8>;    // 256
auto p16 = power_of_2<long, 16>; // 65536

// Variable template with concept (C++20)
template<std::floating_point T>
constexpr T epsilon = std::numeric_limits<T>::epsilon();

auto deps = epsilon<double>;  // 2.22045e-16
auto feps = epsilon<float>;   // 1.19209e-07

// Variable template specialization
template<typename T>
constexpr bool is_integral_v = false;

template<>
constexpr bool is_integral_v<int> = true;

template<>
constexpr bool is_integral_v<long> = true;

// This is how std::is_integral_v etc. are implemented
```

## Class Member Templates

```cpp
// Member function template
class Container {
public:
    template<typename T>
    void add(const T& value) {
        data.push_back(std::to_string(value));
    }
private:
    std::vector<std::string> data;
};

// Template constructor (enables conversion from any container)
class Vector {
    T* data;
    size_t size;
public:
    // Template constructor — not a copy constructor
    template<typename U>
    Vector(const Vector<U>& other) {
        // Convert element by element
    }

    // Template assignment — not a copy assignment
    template<typename U>
    Vector& operator=(const Vector<U>& other) {
        return *this;
    }
};
```

## `template for` (C++26)

```cpp
// C++26: expansion statement (template for)
// Iterates over a pack at compile time

void print_all(auto... args) {
    template for (auto arg : args) {
        std::cout << arg << ' ';
    }
    // Equivalent to:
    // ((std::cout << args << ' '), ...);
}

// With types
template<typename... Ts>
void process_types() {
    template for (constexpr auto info : {^^Ts...}) {
        // Reflection-based iteration over types
        std::cout << std::meta::name_of(info) << '\n';
    }
}

// Practical: iterate over tuple elements
template<typename... Ts>
void print_tuple(const std::tuple<Ts...>& t) {
    template for (auto& elem : t) {
        std::cout << elem << ' ';
    }
}

// Note: syntax is still being finalized (P1306R3)
// Check: __cpp_expansion_statements (proposed)
```
