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
