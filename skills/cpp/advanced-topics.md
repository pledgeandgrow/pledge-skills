# Advanced Topics — Contracts, Named Requirements, Freestanding, SIMD, Reflection

## Contracts (C++26)

```cpp
// Contracts (P2900) — preconditions, postconditions, assertions
// Compile-time and runtime checking of function requirements

// Assertion — checked at runtime (in debug builds)
void process(int* p)
    [[assert: p != nullptr]]
{
    *p = 42;
}

// Precondition — checked on function entry
void divide(int a, int b)
    [[pre: b != 0]]
{
    return a / b;
}

// Postcondition — checked on function exit
int abs_val(int x)
    [[post r: r >= 0]]
{
    return x < 0 ? -x : x;
}

// Multiple contracts
void copy_array(const int* src, int* dst, size_t n)
    [[pre: src != nullptr]]
    [[pre: dst != nullptr]]
    [[pre: n > 0]]
    [[post: __same(dst, src)]]  // no aliasing (proposed)
{
    for (size_t i = 0; i < n; ++i) {
        dst[i] = src[i];
    }
}

// Contract with message
void set_age(int age)
    [[pre: age >= 0 && age <= 150, "age must be 0-150"]]
{
    // ...
}

// Violation handling
// Default: calls std::terminate()
// Can be customized: std::set_contract_violation_handler()
// Build levels:
//   -O0: contracts off (no checking)
//   -O1: audit contracts checked
//   -O2: enforce contracts checked (always on)
//   -O3: contracts off (optimized away)

// GCC flag: -fcontracts
// MSVC flag: /contracts
// Contract violation levels: ignore, observe, enforce
```

## Named Requirements

```cpp
// Named requirements — concepts before concepts (pre-C++20)
// Template parameters must satisfy these requirements
// C++20 concepts replace most named requirements

// Common named requirements:

// - DefaultConstructible: T{} or T() works
// - MoveConstructible: T(T&&) works
// - CopyConstructible: T(const T&) works
// - MoveAssignable: T& operator=(T&&) works
// - CopyAssignable: T& operator=(const T&) works
// - Destructible: ~T() works, no exceptions
// - EqualityComparable: == and != work
// - LessThanComparable: <, >, <=, >= work
// - Swappable: swap(a, b) works (via std::swap or ADL)
// - Hashable: std::hash<T> specialization exists

// Iterator requirements:
// - InputIterator: can read once, forward only
// - OutputIterator: can write once, forward only
// - ForwardIterator: can read/write multiple times, forward only
// - BidirectionalIterator: ForwardIterator + can go backward
// - RandomAccessIterator: BidirectionalIterator + random access
// - ContiguousIterator: RandomAccessIterator + contiguous memory

// Container requirements:
// - Container: has begin/end, size, empty, etc.
// - SequenceContainer: front, back, insert at position
// - AssociativeContainer: keyed lookup
// - ReversibleContainer: has rbegin/rend
// - AllocatorAwareContainer: uses allocator

// Range requirements (C++20):
// - Range: has begin() and end()
// - InputRange: Range with InputIterator
// - ForwardRange: Range with ForwardIterator
// - BidirectionalRange: Range with BidirectionalIterator
// - RandomAccessRange: Range with RandomAccessIterator
// - ContiguousRange: Range with ContiguousIterator
// - CommonRange: Range where begin() and end() have same type
// - View: Range with O(1) copy/move
// - SizedRange: Range with O(1) size()

// Callable requirements:
// - Callable: f(args...) works
// - Predicate: f(args...) returns bool
// - StrictWeakOrder: f(a, b) is a strict weak ordering

// Type requirements:
// - LiteralType: can be used in constexpr (pre-C++20)
// - TriviallyCopyable: memcpy-safe
// - StandardLayout: C-compatible layout
// - PODType: trivial + standard-layout (deprecated C++20)

// Modern equivalent: concepts (C++20)
#include <concepts>

// Named requirement → Concept mapping:
// DefaultConstructible → std::default_initializable
// MoveConstructible    → std::movable
// CopyConstructible    → std::copyable
// EqualityComparable   → std::equality_comparable
// InputIterator        → std::input_iterator
// ForwardIterator      → std::forward_iterator
// RandomAccessIterator → std::random_access_iterator
// Predicate            → std::predicate
// StrictWeakOrder      → std::strict_weak_order

// Checking named requirements with type traits
static_assert(std::is_default_constructible_v<int>);
static_assert(std::is_copy_constructible_v<std::string>);
static_assert(std::is_move_assignable_v<std::vector<int>>);
static_assert(std::is_trivially_copyable_v<int>);
```

## Freestanding and Hosted Implementations

```cpp
// Freestanding: no OS, no dynamic allocation, no exceptions
// Used in: kernels, embedded, firmware, real-time systems

// Hosted: full standard library, OS, dynamic allocation, exceptions
// Normal applications

// Freestanding includes (always available):
// <cstddef>     — size_t, ptrdiff_t, nullptr_t, offsetof, max_align_t
// <cfloat>      — FLT_MAX, DBL_EPSILON, etc.
// <climits>     — INT_MAX, CHAR_BIT, etc.
// <cstdint>     — int8_t, int16_t, int32_t, int64_t, etc.
// <limits>      — std::numeric_limits
// <version>     — feature test macros
// <exception>   — std::exception, std::terminate
// <initializer_list>
// <concepts>    — concepts (C++20)
// <coroutine>   — coroutine support (C++20)
// <type_traits> — type traits (C++11)
// <atomic>      — atomic operations (C++11)
// <compare>     — comparison categories (C++20)
// <iterator>    — iterator support (partial)
// <ranges>      — ranges (partial, C++20)
// <utility>     — move, forward, swap, pair (partial)
// <tuple>       — tuple (partial)
// <array>       — std::array (C++26: freestanding)
// <span>        — std::span (C++26: freestanding)
// <string_view> — std::string_view (C++26: freestanding)
// <expected>    — std::expected (C++26: freestanding)
// <optional>    — std::optional (C++26: freestanding)
// <variant>     — std::variant (C++26: freestanding)

// NOT available in freestanding:
// <iostream>    — needs OS I/O
// <fstream>     — needs file system
// <vector>      — needs dynamic allocation (C++26: some freestanding)
// <map>, <set>  — needs dynamic allocation
// <thread>      — needs OS threads
// <mutex>       — needs OS synchronization
// <filesystem>  — needs file system
// <chrono>      — needs OS clock (partial freestanding in C++26)
// <random>      — needs entropy source (partial)

// Compile as freestanding:
// GCC/Clang: -ffreestanding
// MSVC: (no direct equivalent, use /kernel)

// Freestanding main() — no standard main required
// Entry point is implementation-defined
// Can use: extern "C" void _start() { ... }

// C++26: more containers become freestanding (vector, string with allocator)
```

## Data-Parallel Types / SIMD (C++26)

```cpp
#include <simd>  // C++26 (P1928)

// std::simd — data-parallel types for SIMD vectorization
// Portable abstraction over hardware SIMD (SSE, AVX, NEON, SVE, etc.)

// Basic SIMD type
std::simd<int, 4> v1{1, 2, 3, 4};      // 4 ints packed
std::simd<int, 4> v2{10, 20, 30, 40};

// Element access
v1[0];  // 1
v1.get(1);  // 2

// Vectorized arithmetic — operates on all elements simultaneously
auto v3 = v1 + v2;   // {11, 22, 33, 44}
auto v4 = v1 * v2;   // {10, 40, 90, 160}
auto v5 = v1 - v2;   // {-9, -18, -27, -36}

// Comparison — returns simd_mask
auto mask = v1 < v3;  // {true, true, true, true} (mask)

// Load from / store to array
int arr[4] = {1, 2, 3, 4};
std::simd<int, 4> v6;
v6.copy_from(arr, std::element_aligned);
v6.copy_to(arr, std::element_aligned);

// Width
std::simd<int, 4>::size();  // 4
std::simd<int>::size();     // hardware-native width (e.g., 8 for AVX2)

// Native SIMD width
using native_simd = std::simd<float>;
native_simd::size();  // e.g., 8 (AVX2) or 4 (SSE) or 4 (NEON)

// Fixed vs native
std::simd<float, 8> fixed_simd;   // exactly 8 floats
std::simd<float> native_simd2;    // hardware-native width

// Reduction
std::simd<int, 4> v7{1, 2, 3, 4};
int sum = std::reduce(v7);        // 10
int product = std::reduce(v7, std::multiplies<>{});  // 24

// Mathematical operations
std::simd<float, 4> fv{1.0f, 4.0f, 9.0f, 16.0f};
auto sqrt_v = std::sqrt(fv);      // {1.0, 2.0, 3.0, 4.0}

// Use case: image processing, audio DSP, scientific computing
// Portable: compiler maps to best available SIMD instructions
```

## Reflection (C++26, P2996 — proposed)

```cpp
// Static reflection — inspect types and code at compile time
// Based on P2996 (proposed for C++26)

#include <meta>  // proposed

// Get type info as a meta::info value
constexpr auto type_info = ^^int;  // reflect int type
constexpr auto class_info = ^^std::string;

// Type name
std::meta::name_of(^^int);  // "int"
std::meta::name_of(^^std::string);  // "basic_string"

// Check properties
std::meta::is_type(^^int);           // true
std::meta::is_class(^^std::string);  // true
std::meta::is_enum(^^Color);         // true

// Enumerate members of a class
constexpr auto members = std::meta::members_of(^^MyClass);
for (auto member : members) {
    std::meta::name_of(member);  // member name
    std::meta::is_function(member);
    std::meta::is_data_member(member);
}

// Enumerate enumerators
constexpr auto enumerators = std::meta::enumerators_of(^^Color);
for (auto e : enumerators) {
    std::meta::name_of(e);   // "Red", "Green", "Blue"
    std::meta::value_of(e);  // 0, 1, 2
}

// Enum to string using reflection
template<typename E>
constexpr std::string enum_to_string(E value) {
    for (auto e : std::meta::enumerators_of(^^E)) {
        if (std::meta::value_of(e) == value) {
            return std::meta::name_of(e);
        }
    }
    return "Unknown";
}

// String to enum using reflection
template<typename E>
constexpr std::optional<E> string_to_enum(std::string_view s) {
    for (auto e : std::meta::enumerators_of(^^E)) {
        if (std::meta::name_of(e) == s) {
            return std::meta::value_of(e);
        }
    }
    return std::nullopt;
}

// Reflect on function signatures
constexpr auto func_info = ^^my_function;
std::meta::return_type_of(func_info);
std::meta::parameters_of(func_info);

// Generate code from reflection (splicing)
// [: ... :] — splice reflected entity back into code
template<typename T>
void print_members() {
    template for (auto member : std::meta::nonstatic_data_members_of(^^T)) {
        std::cout << std::meta::name_of(member) << ": "
                  << obj.[:member:] << '\n';
    }
}

// Note: reflection syntax is still being finalized
// Check compiler support: __cpp_reflection (proposed)
```

## Evaluation Order and Sequence Points

```cpp
// C++17: evaluation order guarantees (some changes from C++14)

// C++17 rules:
// 1. Postfix expressions: left-to-right (function calls, member access)
// 2. Assignment: right-to-left (right side evaluated before left)
// 3. Shift: left-to-right
// 4. Operands of && and ||: left-to-right with short-circuit

// Function call: arguments evaluated in unspecified order (pre-C++17)
// C++17: function call: callee evaluated before arguments

// Still unspecified (even in C++17):
// - Order of evaluation of function arguments
// - Order of evaluation of subexpressions of && and || (except short-circuit)
// - Order of evaluation of operands of +, *, /, etc.

// Unspecified behavior examples:
int i = 0;
std::cout << i << " " << ++i;  // C++17: left-to-right for <<, but i and ++i order unspecified
// Output could be "0 1" or "1 1" (unspecified)

// Undefined behavior — unsequenced modifications
int x = 0;
int result = x++ + x++;  // UB: two modifications of x unsequenced
int result2 = ++x + ++x; // UB: same

// C++17: assignment is right-to-left
int a[2] = {0, 0};
int i = 0;
a[i] = i++;  // C++17: i++ evaluated first (right side), then a[i]
// But still: a[1] = 0 or a[0] = 0? (i++ returns 0, i becomes 1)
// C++17: a[1] = 0 (right side i++ → 0, then left side a[1])

// Sequenced (well-defined):
int j = 0;
int k = (j = 1, j + 2);  // comma operator sequences: j=1, then j+2 → k=3

// Safe patterns:
// 1. Don't modify same variable twice in one expression
// 2. Don't read and write same variable in one expression (unless sequenced)
// 3. Use separate statements for clarity

// Sequence points (C-style term, replaced by "sequenced-before" in C++11+):
// - ; (end of full expression)
// - &&, || (short-circuit operators)
// - , (comma operator)
// - ?: (ternary — condition before branches)
// - function call boundary (all args evaluated before body)
// - return (all side effects before caller continues)
```

## Debugging Support (C++26)

```cpp
#include <debugging>  // C++26

// std::is_debugger_present — check if running under debugger
if (std::is_debugger_present()) {
    std::cout << "Running under debugger\n";
} else {
    std::cout << "Running standalone\n";
}

// Practical: conditional breakpoints in code
void critical_section() {
    if (std::is_debugger_present()) {
        // Extra logging when debugging
        std::cerr << "Entering critical section\n";
    }
    // ...
}

// Break into debugger (platform-specific, not standardized)
// GCC/Clang: __builtin_trap() or std::abort()
// MSVC: __debugbreak()
// Portable:
#if defined(_MSC_VER)
    #define BREAKPOINT __debugbreak()
#elif defined(__GNUC__) || defined(__clang__)
    #define BREAKPOINT __builtin_trap()
#else
    #define BREAKPOINT std::abort()
#endif
```

## Safe Reclamation (C++26)

```cpp
// Hazard pointers (C++26)
#include <hazard_pointer>

// Hazard pointer — safe memory reclamation for lock-free data structures
// Protects a pointer from being reclaimed while being accessed

std::hazard_pointer hp = std::make_hazard_pointer();

// Protect a pointer
hp.protect(ptr);
// ptr is now safe — won't be reclaimed by concurrent reclamation
// ... use ptr safely ...
hp.release_protection();  // unprotect

// Use case: lock-free stack, queue, linked list
// Without hazard pointers: ABA problem, use-after-free
// With hazard pointers: safe reclamation without global pause

// RCU (Read-Copy-Update) (C++26)
#include <rcu>

// RCU — deferred reclamation for read-heavy concurrent data
// Readers don't synchronize with writers
// Writers copy, update, and defer reclaim of old version

// RCU read-side critical section
{
    std::rcu_reader reader;
    // Access RCU-protected data safely
    auto* data = rcu_protected_ptr.load(std::memory_order_acquire);
    use(data);
}  // reader exits — grace period starts after all readers finish

// RCU write-side
auto* old = rcu_protected_ptr.exchange(new_data, std::memory_order_release);
std::rcu_retire(old);  // retire old data — reclaimed after grace period

// Use case: read-heavy concurrent structures (e.g., read-mostly hash map)
// Readers: zero overhead (no atomics on read path in fast case)
// Writers: copy + atomic swap + deferred free
```
