# Metaprogramming

## Type Traits

```cpp
#include <type_traits>

// Primary type categories
std::is_void_v<T>;              // true if T is void
std::is_null_pointer_v<T>;      // true if T is nullptr_t
std::is_integral_v<T>;          // int, char, bool, long, etc.
std::is_floating_point_v<T>;    // float, double, long double
std::is_array_v<T>;             // T[] or T[N]
std::is_pointer_v<T>;           // T*
std::is_lvalue_reference_v<T>;  // T&
std::is_rvalue_reference_v<T>;  // T&&
std::is_member_object_pointer_v<T>;
std::is_member_function_pointer_v<T>;
std::is_enum_v<T>;
std::is_union_v<T>;
std::is_class_v<T>;
std::is_function_v<T>;

// Composite type categories
std::is_reference_v<T>;         // T& or T&&
std::is_arithmetic_v<T>;        // integral or floating_point
std::is_fundamental_v<T>;       // arithmetic, void, or nullptr_t
std::is_object_v<T>;            // not function, reference, or void
std::is_compound_v<T>;          // not fundamental
std::is_member_pointer_v<T>;    // member object or function pointer
std::is_scalar_v<T>;            // arithmetic, enum, pointer, member_ptr, nullptr_t

// Type properties
std::is_const_v<T>;             // top-level const
std::is_volatile_v<T>;
std::is_signed_v<T>;
std::is_unsigned_v<T>;
std::is_trivial_v<T>;
std::is_trivially_copyable_v<T>;
std::is_standard_layout_v<T>;
std::is_pod_v<T>;               // deprecated C++20
std::is_empty_v<T>;             // empty class (no data members)
std::is_polymorphic_v<T>;       // has virtual function
std::is_abstract_v<T>;          // has pure virtual function
std::is_final_v<T>;             // marked final (C++14)
std::is_aggregate_v<T>;         // aggregate (C++17)
std::is_literal_type_v<T>;      // deprecated C++17, removed C++20

// Type relationships
std::is_same_v<T, U>;           // T and U are same type
std::is_base_of_v<Base, Derived>;
std::is_convertible_v<From, To>;
std::is_virtual_base_of_v<Base, Derived>;

// Type modifications (produce new type via ::type)
std::remove_const_t<T>;         // remove top-level const
std::remove_volatile_t<T>;
std::remove_cv_t<T>;            // remove const and volatile
std::add_const_t<T>;
std::add_volatile_t<T>;
std::add_cv_t<T>;

std::remove_pointer_t<T>;
std::add_pointer_t<T>;
std::remove_reference_t<T>;
std::add_lvalue_reference_t<T>;
std::add_rvalue_reference_t<T>;

std::remove_extent_t<T>;        // remove one array dimension
std::remove_all_extents_t<T>;   // remove all array dimensions
std::decay_t<T>;                // array-to-pointer, function-to-pointer, remove cv/ref

std::make_signed_t<T>;
std::make_unsigned_t<T>;

// Common type
std::common_type_t<T, U>;       // common type for T and U
std::common_reference_t<T, U>;  // common reference (C++20)

// Operations (C++11/14/17/20)
std::is_constructible_v<T, Args...>;
std::is_trivially_constructible_v<T, Args...>;
std::is_nothrow_constructible_v<T, Args...>;
std::is_default_constructible_v<T>;
std::is_copy_constructible_v<T>;
std::is_move_constructible_v<T>;
std::is_assignable_v<T, U>;
std::is_copy_assignable_v<T>;
std::is_move_assignable_v<T>;
std::is_trivially_copyable_v<T>;
std::is_trivially_destructible_v<T>;
std::is_nothrow_destructible_v<T>;
std::has_virtual_destructor_v<T>;

// Swappable (C++17)
std::is_swappable_v<T>;
std::is_nothrow_swappable_v<T>;

// Invocation (C++11/17)
std::is_invocable_v<F, Args...>;
std::is_invocable_r_v<R, F, Args...>;
std::is_nothrow_invocable_v<F, Args...>;

// Result of invocation
std::invoke_result_t<F, Args...>;  // return type of F(Args...)
```

## Type Traits Usage

```cpp
// SFINAE with type traits
template<typename T,
         typename = std::enable_if_t<std::is_integral_v<T>>>
T factorial(T n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// if constexpr (C++17, preferred)
template<typename T>
void process(T x) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "Integral: " << x;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "Float: " << x;
    } else if constexpr (std::is_pointer_v<T>) {
        std::cout << "Pointer: " << *x;
    } else {
        std::cout << "Other: " << x;
    }
}

// static_assert
static_assert(std::is_integral_v<int>);  // passes
static_assert(std::is_same_v<std::remove_const_t<const int>, int>);

// Conditional type
std::conditional_t<condition, TypeIfTrue, TypeIfFalse>;
// Example: choose type based on size
using int_type = std::conditional_t<sizeof(void*) == 8, int64_t, int32_t>;

// void_t (C++17) — for SFINAE detection
template<typename, typename = void>
struct has_size : std::false_type {};

template<typename T>
struct has_size<T, std::void_t<decltype(std::declval<T>().size())>>
    : std::true_type {};

// Usage
static_assert(has_size<std::vector<int>>::value);  // true
static_assert(!has_size<int>::value);              // true
```

## Concepts as Metaprogramming (C++20)

```cpp
// Concepts replace many type traits use cases
template<std::integral T>
T factorial(T n) { return n <= 1 ? 1 : n * factorial(n - 1); }

// Requires clause
template<typename T>
requires std::movable<T> && std::copyable<T>
class Container { /* ... */ };

// Concept with requires expression
template<typename T>
concept Iterable = requires(T t) {
    { t.begin() } -> std::input_or_output_iterator;
    { t.end() } -> std::sentinel_for<decltype(t.begin())>;
};

// Nested requirements
template<typename T>
concept NumericContainer = requires(T t) {
    typename T::value_type;
    requires std::numeric<typename T::value_type>;
    { t.size() } -> std::same_as<size_t>;
};
```

## Compile-Time Computation

```cpp
// constexpr — may be evaluated at compile time
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
constexpr int f5 = factorial(5);  // 120, compile-time

// consteval — must be evaluated at compile time (C++20)
consteval int square(int n) { return n * n; }
constexpr int sq = square(5);  // 25, compile-time
// int x = square(n);  // error: n not constant

// consteval with immediate context
consteval int double_it(int n) { return n * 2; }
consteval int compute() { return double_it(21); }  // OK

// Compile-time string operations (C++26: constexpr string)
constexpr bool is_palindrome(std::string_view s) {
    for (size_t i = 0; i < s.size() / 2; ++i) {
        if (s[i] != s[s.size() - 1 - i]) return false;
    }
    return true;
}
static_assert(is_palindrome("racecar"));  // true
static_assert(!is_palindrome("hello"));   // true
```

## Fold Expressions (C++17)

```cpp
// See templates.md for full details
(args + ...);           // right fold
(... + args);           // left fold
(args + ... + 0);       // right fold with init
(0 + ... + args);       // left fold with init

// Compile-time: check all types
template<typename... Ts>
constexpr bool allIntegral = (std::is_integral_v<Ts> && ...);

static_assert(allIntegral<int, long, char>);  // true
static_assert(!allIntegral<int, double>);      // true
```

## Compile-Time Type Generation

```cpp
// Type at compile time based on condition
template<bool IsFloat>
using ValueType = std::conditional_t<IsFloat, double, int>;

template<bool IsFloat>
struct Calculator {
    ValueType<IsFloat> value;
    ValueType<IsFloat> add(ValueType<IsFloat> a, ValueType<IsFloat> b) {
        return a + b;
    }
};

Calculator<true> floatCalc;   // value is double
Calculator<false> intCalc;    // value is int

// Generate type list
template<typename... Ts>
struct TypeList {};

template<typename List, typename T>
struct PushFront;

template<typename... Ts, typename T>
struct PushFront<TypeList<Ts...>, T> {
    using type = TypeList<T, Ts...>;
};

// Type at index
template<typename List, size_t Index>
struct At;

template<typename Head, typename... Tail>
struct At<TypeList<Head, Tail...>, 0> {
    using type = Head;
};

template<typename Head, typename... Tail, size_t Index>
struct At<TypeList<Head, Tail...>, Index> {
    using type = typename At<TypeList<Tail...>, Index - 1>::type;
};

// Usage
using Types = TypeList<int, double, char, float>;
using Second = typename At<Types, 1>::type;  // double
static_assert(std::is_same_v<Second, double>);
```

## Compile-Time Reflection (Limited)

```cpp
// C++26: static_reflection (proposed)
// Currently limited — use type traits and macros

// Enum to string (C++26: std::format for enums, or use __PRETTY_FUNCTION__)
template<typename E>
constexpr std::string_view enumName() {
    // GCC/Clang: __PRETTY_FUNCTION__
    // MSVC: __FUNCSIG__
    // Parse to extract enum value name
}

// C++20: source_location for compile-time info
#include <source_location>
auto loc = std::source_location::current();
loc.file_name(); loc.line(); loc.function_name();
```

## Common Metaprogramming Patterns

```cpp
// CRTP (Curiously Recurring Template Pattern)
template<typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};

class Concrete : public Base<Concrete> {
public:
    void implementation() { std::cout << "Concrete"; }
};

// Mixin
template<typename... Mixins>
class Composed : public Mixins... {
public:
    using Mixins::operator()...;  // inherit all operator()
};

// Tag dispatch
template<typename Iter>
void sortHelper(Iter first, Iter last, std::random_access_iterator_tag) {
    std::sort(first, last);  // use std::sort for random access
}

template<typename Iter>
void sortHelper(Iter first, Iter last, std::forward_iterator_tag) {
    // use different algorithm for forward iterators
}

template<typename Iter>
void sort(Iter first, Iter last) {
    sortHelper(first, last, typename std::iterator_traits<Iter>::iterator_category{});
}

// Detection idiom (C++17)
template<typename T, typename = void>
struct has_serialize : std::false_type {};

template<typename T>
struct has_serialize<T, std::void_t<decltype(
    std::declval<const T&>().serialize(std::declval<std::ostream&>())
)>> : std::true_type {};

template<typename T>
constexpr bool has_serialize_v = has_serialize<T>::value;
```
