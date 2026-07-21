# Basic Syntax

## Program Structure

```cpp
// Single-line comment

/*
 Multi-line comment
*/

// Preprocessor directives
#include <iostream>   // system header
#include "myheader.h" // user header

#define PI 3.14159
#define SQUARE(x) ((x) * (x))

// Conditional compilation
#ifdef DEBUG
    #define LOG(x) std::cerr << x << '\n'
#else
    #define LOG(x)
#endif

#if __cplusplus >= 202002L
    // C++20 or later
#endif

// main function — program entry point
int main(int argc, char* argv[]) {
    // argc = argument count
    // argv = argument values (argv[0] = program name)

    std::cout << "Hello, World!\n";
    return 0; // EXIT_SUCCESS
    // return 1; // EXIT_FAILURE
    // return is optional — main returns 0 by default
}

// Alternative signatures
int main() { return 0; }                         // no args
int main(int argc, char** argv) { return 0; }    // char** instead of char*[]
// C++23: int main() -> int (deduced return type not allowed for main)
```

## Translation Units

A translation unit (TU) is a source file after preprocessing (all `#include` directives expanded).

```cpp
// Header file (myheader.h)
#pragma once  // or include guard
#ifndef MYHEADER_H
#define MYHEADER_H

// Declarations (not definitions)
int add(int a, int b);
class MyClass;

// Inline definitions are OK in headers
inline int multiply(int a, int b) { return a * b; }

// Template definitions are OK in headers
template<typename T>
T identity(T x) { return x; }

// constexpr definitions are OK in headers
constexpr int MAX = 100;

#endif // MYHEADER_H

// Source file (myheader.cpp)
#include "myheader.h"

int add(int a, int b) { return a + b; }  // definition
```

## Linkage

```cpp
// External linkage — visible to other TUs (default for functions/variables)
int globalVar;           // external linkage
void func() {}           // external linkage

// Internal linkage — visible only in current TU
static int fileVar;      // internal linkage (deprecated use of static)
namespace { int anonVar; } // anonymous namespace (preferred)

// No linkage — local to scope
void f() {
    int localVar;  // no linkage
}

// Linkage via inline/constexpr — typically inline linkage
inline int g() { return 0; }  // inline linkage, can be in multiple TUs

// extern — declare but don't define (defined elsewhere)
extern int externVar;     // declared here, defined in another TU
extern void externFunc(); // declared here, defined in another TU
```

## Preprocessor

```cpp
// Includes
#include <header>    // system header
#include "header"    // user header (search current dir first)
#include "header.hpp"

// Macros
#define FOO
#define BAR 42
#define BAZ(x) (x * 2)
#define MULTI(x, y) ((x) + (y))

// Variadic macros
#define LOG(...) printf(__VA_ARGS__)
#define LOG(fmt, ...) printf(fmt, ##__VA_ARGS__) // GNU extension: ## removes comma if empty

// Conditional compilation
#ifdef FOO
    // compiled if FOO is defined
#endif

#ifndef FOO
    // compiled if FOO is NOT defined
#endif

#if defined(FOO) && defined(BAR)
    // both defined
#elif defined(FOO)
    // only FOO
#else
    // neither
#endif

// Predefined macros
__FILE__     // current file name
__LINE__     // current line number
__DATE__     // compilation date
__TIME__     // compilation time
__cplusplus  // C++ standard version (e.g., 202400 for C++26)
__func__     // current function name (C++11)
__func__     // same as __FUNCTION__ in most compilers

// #pragma
#pragma once         // include guard (non-standard but widely supported)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-variable"
#pragma GCC diagnostic pop

// #error and #warning
#error "This code requires C++20"
#warning "Deprecated usage"

// #line
#line 100 "custom_file.cpp"  // change reported line/file

// Stringification and token pasting
#define STR(x) #x              // STR(hello) → "hello"
#define XSTR(x) STR(x)         // XSTR(BAR) → "42"
#define CONCAT(a, b) a##b      // CONCAT(foo, bar) → foobar
```

## Namespaces

```cpp
// Define namespace
namespace mylib {
    int var = 42;
    void func() {}
    namespace inner {
        int var2 = 10;
    }
}

// Using declarations
using mylib::var;       // bring var into scope
using mylib::func;      // bring func into scope

// Using directive (brings entire namespace)
using namespace mylib;  // bring all of mylib into scope (avoid in headers)

// Namespace alias
namespace ml = mylib;
namespace irl = mylib::inner;

// Anonymous namespace (internal linkage)
namespace {
    int internalVar = 5;  // only visible in this TU
}

// Inline namespace (C++14) — members are in enclosing namespace
namespace mylib {
    inline namespace v2 {
        void newFunc() {}
    }
    void oldFunc() {}  // still in mylib
}
// mylib::newFunc() and mylib::v2::newFunc() both work

// Nested namespace definition (C++17)
namespace mylib::inner::deep {
    int x = 0;
}
```

## main Function Details

```cpp
#include <cstdlib> // EXIT_SUCCESS, EXIT_FAILURE

// Standard main
int main() {
    return EXIT_SUCCESS;
}

// With command-line arguments
int main(int argc, char* argv[]) {
    for (int i = 0; i < argc; ++i) {
        std::cout << "argv[" << i << "] = " << argv[i] << '\n';
    }
    return 0;
}

// Environment variables
int main() {
    extern char** environ; // POSIX
    // or use getenv()
    char* home = std::getenv("HOME");
    if (home) std::cout << "HOME=" << home << '\n';
}
```

## Attributes

```cpp
// [[noreturn]] — function never returns
[[noreturn]] void fatal() { std::exit(1); }

// [[nodiscard]] — return value should not be discarded
[[nodiscard]] int compute() { return 42; }
// compute(); // warning: ignoring return value

// [[maybe_unused]] — suppress unused warnings
[[maybe_unused]] int x = 42;

// [[deprecated]] — mark as deprecated
[[deprecated("Use newFunc() instead")]]
void oldFunc() {}

// [[deprecated]] without message
[[deprecated]] void oldFunc2() {}

// [[fallthrough]] — intentional switch fallthrough
switch (x) {
    case 1:
        doSomething();
        [[fallthrough]];
    case 2:
        doMore();
        break;
}

// [[likely]] / [[unlikely]] (C++20) — branch prediction hints
if ([[likely]] x > 0) { ... }
if ([[unlikely]] x == 0) { ... }

// [[carries_dependency]] — for optimization across function boundaries
// [[assume(expr)]] (C++23) — assume expression is true (optimization)
[[assume(x > 0)]];

// [[no_unique_address]] — empty member can share address (C++20)
struct Empty {};
struct S {
    Empty e; // may share address with other members
    int x;
};
```

## The `this` Pointer

```cpp
class MyClass {
    int value;
public:
    MyClass(int v) : value(v) {}

    int getValue() const {
        return this->value;  // explicit this
    }

    void setValue(int v) {
        this->value = v;  // this is a pointer to current object
    }

    // Return *this for chaining
    MyClass& add(int x) {
        this->value += x;
        return *this;
    }

    MyClass& multiply(int x) {
        this->value *= x;
        return *this;
    }

    // this in lambda (C++20: explicit this parameter)
    void process() {
        // Capture this
        auto lambda1 = [this]() { return value; };

        // Capture *this by copy (C++17)
        auto lambda2 = [*this]() { return value; };

        // C++23: deducing this (explicit object parameter)
        // void process(this MyClass& self) { self.value; }
    }
};

MyClass obj(10);
obj.add(5).multiply(2);  // chaining: (10+5)*2 = 30

// this is implicitly passed to non-static member functions
// this is a const MyClass* in const member functions
// this is a MyClass* in non-const member functions
// this is an rvalue reference in ref-qualified member functions
```

## Name Lookup

```cpp
// Qualified name lookup — :: explicitly searches a scope
std::vector<int> v;     // qualified: std::vector
::globalFunc();          // qualified: global namespace
MyClass::staticMethod(); // qualified: class scope
ns::func();              // qualified: namespace scope

// Unqualified name lookup — compiler searches scopes outward:
// 1. Current block scope
// 2. Enclosing blocks
// 3. Class scope (for members)
// 4. Base class scopes
// 5. Namespace scope
// 6. Global namespace

// Argument-Dependent Lookup (ADL / Koenig lookup)
namespace ns {
    struct MyType {};
    void func(MyType) { std::cout << "ns::func\n"; }
}

ns::MyType mt;
func(mt);  // finds ns::func via ADL (argument type is in ns)
// Without ADL: ns::func(mt) would be needed

// ADL with operators
std::cout << "hello";  // finds operator<< via ADL (std::ostream is in std)

// ADL with multiple arguments
namespace a { struct A {}; void foo(A, int) {} }
namespace b { struct B {}; void foo(int, B) {} }
a::A objA;
b::B objB;
// foo(objA, objB);  // ambiguous: a::foo(A,int) and b::foo(int,B) both viable

// Suppressing ADL
void helper(int x) { /* ... */ }
std::for_each(v.begin(), v.end(), helper);  // ADL applies
std::for_each(v.begin(), v.end(), [](int x) { helper(x); });  // no ADL

// Two-phase lookup (templates)
template<typename T>
void process(T t) {
    helper(t);  // Phase 1: non-dependent names looked up at definition
    t.method(); // Phase 2: dependent names looked up at instantiation
}
```

## Undefined Behavior and the As-If Rule

```cpp
// As-if rule: compiler can transform code arbitrarily
// as long as observable behavior is preserved
// Observable behavior: volatile reads/writes, I/O, program exit

// Undefined Behavior (UB) — no guarantees, anything can happen
// Common UB examples:

// 1. Reading uninitialized variable
int x;
std::cout << x;  // UB: indeterminate value

// 2. Signed integer overflow
int a = INT_MAX;
a + 1;  // UB: signed overflow (use unsigned for wrapping)

// 3. Null pointer dereference
int* p = nullptr;
*p;  // UB

// 4. Out-of-bounds array access
int arr[5];
arr[10];  // UB

// 5. Use after free
int* q = new int(42);
delete q;
*q;  // UB: use after free

// 6. Double free
int* r = new int(42);
delete r;
delete r;  // UB

// 7. Invalid pointer arithmetic
int arr2[3];
int* ptr = arr2 + 3;  // OK: one-past-end
// ptr = arr2 + 4;    // UB: beyond one-past-end
// *(arr2 + 3);       // UB: dereferencing one-past-end

// 8. Division by zero
int z = 0;
// int result = 42 / z;  // UB

// 9. Violating strict aliasing
int* ip = reinterpret_cast<int*>(new double[1]);
*ip = 42;  // UB: accessing double memory as int

// 10. Infinite loop without side effects (C++26: made well-defined if constexpr)
// while (true) {}  // UB (pre-C++26): no observable behavior

// Implementation-Defined Behavior — compiler chooses, must document
sizeof(int);  // typically 4, but implementation-defined

// Unspecified Behavior — compiler can choose, not required to document
// Order of evaluation of function arguments (except C++17 changes)

// Detecting UB: sanitizers
// -fsanitize=address    — AddressSanitizer (memory errors)
// -fsanitize=undefined  — UBSan (undefined behavior)
// -fsanitize=memory     — MemorySanitizer (uninitialized reads)
// -fsanitize=thread     — ThreadSanitizer (data races)
```

## Memory Model (C++11)

```cpp
// C++ memory model — defines how memory accesses are observed
// across multiple threads

// 1. Atomic operations — guaranteed visible across threads
std::atomic<int> counter{0};
counter.fetch_add(1);  // atomic, visible to all threads

// 2. Sequential consistency (default) — total order of all operations
// All threads see same order of atomic operations
// Most expensive, most intuitive

// 3. Happens-before relationship
// A happens-before B: A's effects are visible to B
// - Sequenced-before: within a thread, statement order
// - Synchronizes-with: atomic operation creates ordering
// - Transitive: if A→B and B→C, then A→C

// 4. Data race — two threads access same memory, at least one writes,
//    no synchronization → UB
int shared = 0;
// Thread 1: shared = 42;       // data race!
// Thread 2: std::cout << shared; // UB

// 5. Memory order choices
// relaxed: no ordering, only atomicity (fastest)
// acquire: no reads/writes can be reordered before this load
// release: no reads/writes can be reordered after this store
// acq_rel: both acquire and release
// seq_cst: total global order (default, safest)

// 6. Fences — explicit memory barriers
std::atomic_thread_fence(std::memory_order_release);
// ... writes to shared data ...
std::atomic_store_explicit(&flag, 1, std::memory_order_relaxed);
```

## Character Sets and Encodings

```cpp
// C++ source character set:
// - Basic source character set: ASCII (a-z, A-Z, 0-9, punctuation, whitespace)
// - Universal character names: \uXXXX (C++11), \UXXXXXXXX

// Execution character set:
// - Determined by implementation, typically ASCII or UTF-8
// - Can be changed with compiler flags

// C++20: char8_t — UTF-8 character type
char8_t c = u8'A';       // UTF-8 character
std::u8string s = u8"hello";  // UTF-8 string

// C++11: char16_t and char32_t
char16_t c16 = u'A';     // UTF-16
char32_t c32 = U'A';     // UTF-32
std::u16string s16 = u"hello";
std::u32string s32 = U"hello";

// wchar_t — wide character (platform-dependent: 2 bytes Windows, 4 bytes Linux)
wchar_t wc = L'A';
std::wstring ws = L"hello";

// C++23: std::text_encoding — runtime encoding detection
#include <text_encoding>
auto enc = std::text_encoding::environment();
enc.name();  // e.g., "UTF-8"
enc.mib();   // MIB enum value

// Compiler flags for encoding:
// GCC/Clang: -fexec-charset=UTF-8 -finput-charset=UTF-8
// MSVC: /utf-8 (sets both source and execution charset)
// GCC/Clang: -fwide-exec-charset=UTF-16

// Unicode in source code (C++11 universal character names)
// Can use Unicode directly in identifiers and string literals
// auto café = "café"s;  // UCN in identifier (if supported)
```

## Phases of Translation

```cpp
// C++ compilation phases (simplified):
//
// Phase 1: Physical source file characters mapped to basic source character set
//          (e.g., trigraphs, though removed in C++17)
//
// Phase 2: Line splicing — backslash-newline removed, lines joined
//          (continuation lines)
//
// Phase 3: Comments replaced with single space
//          Source decomposed into preprocessing tokens
//          String literals concatenated (adjacent literals)
//
// Phase 4: Preprocessing — #include, #define, #if, etc. executed
//          Macros expanded
//          #pragma directives processed
//          Result: preprocessed translation unit
//
// Phase 5: Character set mapping (source → execution character set)
//          String/char literals encoded in execution character set
//
// Phase 6: Adjacent string literals concatenated
//          "hello" "world" → "helloworld"
//
// Phase 7: Compilation — tokens parsed, syntax checked
//          Template instantiation
//          Object code generated
//
// Phase 8: Linking — object files + libraries → executable
//          External references resolved
//          One Definition Rule (ODR) checked across TUs
//
// Phase 9: Dynamic initialization of non-local variables
//          (static/thread-local objects)
//
// Phase 10: main() called
//           Program execution begins

// Practical implications:
// - Macros operate on tokens, not text (Phase 4)
// - String concatenation happens after preprocessing (Phase 6)
// - Templates are instantiated in Phase 7
// - ODR violations may not be caught until link time (Phase 8)
```

## Inline Assembly

```cpp
// asm declaration — embed assembly code in C++
// Syntax is implementation-defined

// GCC/Clang: extended asm syntax
asm("nop");  // single instruction

// Multiple instructions
asm volatile (
    "movl $42, %%eax\n\t"
    "movl %%eax, %0\n\t"
    : "=r"(result)        // output
    :                      // no input
    : "%eax"               // clobbered registers
);

// Input and output operands
int a = 10, b = 20, sum;
asm volatile (
    "addl %1, %0"
    : "=r"(sum)            // output: sum = result
    : "r"(a), "0"(b)       // inputs: a, b (same register as output)
);

// Memory clobber — tells compiler memory may change
asm volatile ("" ::: "memory");  // compiler barrier

// MSVC: __asm block
#if defined(_MSC_VER)
__asm {
    mov eax, 42
    mov result, eax
}
#endif

// Use cases:
// - Accessing special CPU instructions (cpuid, rdtsc)
// - Atomic operations (lock prefix)
// - Performance-critical inner loops
// - Hardware-specific operations

// Prefer compiler intrinsics over inline asm when possible
// __builtin_expect (GCC/Clang) — branch prediction
// __builtin_unreachable() — mark unreachable code
// _mm_add_epi32 (SSE intrinsics) — SIMD operations
```

## Language Linkage

```cpp
// Language linkage — how names are linked across translation units
// Default: C++ linkage (name mangling applied)

// C linkage — no name mangling, compatible with C
extern "C" {
    void c_function(int);
    int c_variable;
}

// Single declaration with C linkage
extern "C" void another_c_func(double);

// C++ linkage (default)
void cpp_function(int);  // mangled name: _Z13cpp_functioni

// Mixing C and C++
// header.h (C-compatible):
#ifdef __cplusplus
extern "C" {
#endif

void c_api_init(void);
int c_api_process(int data);

#ifdef __cplusplus
}
#endif

// C++ source calling C:
extern "C" {
#include "header.h"
}

// C source calling C++ (must use C linkage wrapper):
extern "C" void cpp_wrapper(int x) {
    // C++ code here, callable from C
    std::cout << "x = " << x << '\n';
}

// Other language linkages (implementation-defined):
// extern "Fortran" void f_subroutine();
// extern "Pascal" int p_func();
// Most compilers only support "C" and "C++"
```

## Name Mangling

```cpp
// Name mangling — encoding type information into symbol names
// Enables function overloading and type-safe linking

// Example (GCC/Clang Itanium ABI):
// void foo(int)        → _Z3fooi
// void foo(double)     → _Z3food
// void foo(int, int)   → _Z3fooii
// int bar(const char*) → _Z3barPKc
// namespace ns { void baz(); } → _ZN2ns3bazEv

// Demangling:
// GCC/Clang: abi::__cxa_demangle() or c++filt command
// MSVC: undname.exe or __unDName()

// View mangled names:
// nm -C lib.a  (demangled)
// nm lib.a     (mangled)

// extern "C" disables mangling — for C compatibility

// Type info in mangling:
// i = int, d = double, c = char, b = bool, v = void
// P = pointer, R = reference, K = const
// N...E = nested name (namespace/class)
// T_ = first template argument, S_ = substitution

// Practical impact:
// - Linker errors show mangled names — use c++filt to decode
// - ABI compatibility: different compilers mangle differently
// - Cannot link C++ object files from different compilers
// - extern "C" for cross-language interop
```

## Static Initialization Order Fiasco (SIOF)

```cpp
// SIOF — undefined behavior when static objects in different TUs
// depend on each other during initialization

// file1.cpp
extern int b;
int a = b + 1;  // depends on b — order undefined!

// file2.cpp
extern int a;
int b = a + 1;  // depends on a — order undefined!

// If file1 initializes first: a = (b=0) + 1 = 1, then b = 1 + 1 = 2
// If file2 initializes first: b = (a=0) + 1 = 1, then a = 1 + 1 = 2
// Result is implementation-defined — SIOF!

// Solutions:

// 1. Construct on first use (lazy initialization)
int& getA() {
    static int a = 42;  // initialized on first call
    return a;
}
int& getB() {
    static int b = getA() + 1;  // safe: getA() called first
    return b;
}

// 2. Use constexpr (initialized at compile time)
constexpr int a = 42;
constexpr int b = a + 1;  // 43, compile-time

// 3. Avoid cross-TU static dependencies
// Keep related statics in same TU

// 4. Use the Schwarz/Nifty Counter idiom (advanced)
// Static guard object ensures initialization order

// Dynamic initialization order:
// 1. Constant initialization (compile-time, always first)
// 2. Zero initialization (for static storage duration)
// 3. Dynamic initialization (runtime, order is TU-dependent)
//    - Within a TU: definition order (top to bottom)
//    - Across TUs: unspecified order

// Destruction: reverse order of construction (within a TU)
// Across TUs: reverse of construction completion order
```

## Translation-Unit-Local (C++20)

```cpp
// TU-local — entities that cannot be used outside their translation unit
// C++20 formalized this concept (replaces "internal linkage" for some cases)

// TU-local entities:
// - Functions and variables with internal linkage (static, anonymous namespace)
// - Functions and variables that are not exported (in modules)
// - Types defined within anonymous namespaces

// Making things TU-local:
static int counter = 0;  // internal linkage (TU-local)

namespace {
    int internal_var = 42;  // anonymous namespace (TU-local)
    void internal_func() {}  // TU-local
}

// C++20 modules: non-exported declarations are TU-local
module my_module;
int hidden = 42;  // TU-local (not exported)
export int visible = 10;  // exported (not TU-local)

// TU-local in module units:
export module my_module;
int internal_helper() { return 42; }  // TU-local
export int public_func() { return internal_helper(); }  // OK: uses TU-local

// Cannot expose TU-local through exported API:
// export int& get_internal() { return hidden; }  // error: exposes TU-local

// Why TU-local matters:
// - Prevents ODR violations across TUs
// - Enables better optimization (compiler knows no external reference)
// - Module interface units: non-exported = TU-local
// - Module implementation units: everything is TU-local
```
