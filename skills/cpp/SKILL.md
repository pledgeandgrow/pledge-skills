---
name: cpp-docs
version: "26"
tags:
  - cpp
  - c++
  - language
  - systems-programming
  - stl
  - templates
  - concurrency
  - metaprogramming
description: |
  Comprehensive C++26 reference covering all language features: basic syntax, fundamental types,
  type inference (auto, decltype), variables, storage duration, operators (arithmetic, comparison,
  logical, bitwise, member access, ternary, spaceship), control structures (if, switch, while, for,
  range-for), functions (overloading, default arguments, lambda expressions, constexpr/consteval),
  classes and objects (constructors, destructors, copy/move semantics, RAII, rule of 0/3/5, access
  specifiers, inheritance, virtual functions, polymorphism, abstract classes, interfaces), templates
  (function templates, class templates, variadic templates, concepts, SFINAE), smart pointers
  (unique_ptr, shared_ptr, weak_ptr), raw pointers and references, exceptions (try/catch/throw,
  noexcept, exception hierarchy), STL containers (vector, array, deque, list, map, unordered_map,
  set, stack, queue, span, flat_map), STL algorithms and iterators, ranges, strings (string,
  string_view, to_chars, from_chars), utilities (pair, tuple, optional, variant, any, function),
  concurrency (thread, mutex, condition_variable, future/promise, async, atomic, memory order,
  latch, barrier, semaphore), I/O (iostream, fstream, format, print, filesystem, syncstream,
  stacktrace), chrono (calendar, time zones), numerics (math, complex, random, valarray, bit
  operations), coroutines (co_await, co_yield, generator, task), regular expressions (std::regex),
  modules, metaprogramming (type traits, concepts, CRTP), idioms and patterns (RAII, Pimpl, NVI,
  type erasure, ADL, ODR, design patterns), C compatibility (C headers, C I/O, signals, locale),
  testing (Google Test, Catch2, doctest, benchmarking), keywords and standard library reference,
  and what's new in C++26/23/20/17/14/11.
  Use whenever the user mentions C++, STL, templates, CMake, RAII, smart pointers, lambdas,
  concepts, ranges, coroutines, or needs help with any C++ code, library, or build system.
---

# C++ Expert (C++26)

**Official Documentation:** https://en.cppreference.com/w/

## Quick Reference

| Topic | File |
|-------|------|
| Installation, compilers (GCC, Clang, MSVC), build systems (CMake, Make), compiler flags, tooling | `getting-started.md` |
| Basic syntax, comments, main function, preprocessor directives, translation units, linkage | `basics-syntax.md` |
| Fundamental types, type modifiers, type inference (auto, decltype), type conversion, narrowing | `types.md` |
| Variables, scope, storage duration, qualifiers (const, constexpr, constinit, volatile, mutable), references | `variables.md` |
| Operators (arithmetic, comparison, logical, bitwise, member access, ternary, spaceship), operator overloading | `operators.md` |
| Control structures (if/else, switch, while, do-while, for, range-for, break, continue, goto) | `control-structures.md` |
| Functions, overloading, default arguments, lambda expressions, constexpr/consteval/constinit, function pointers | `functions.md` |
| Classes, constructors, destructors, copy/move semantics, RAII, rule of 0/3/5, access specifiers, inheritance, virtual functions, polymorphism, abstract classes, friend, nested classes | `classes-objects.md` |
| Function templates, class templates, variadic templates, template specialization, CTAD, concepts | `templates.md` |
| Smart pointers (unique_ptr, shared_ptr, weak_ptr), raw pointers, references, new/delete, allocators, PMR | `memory.md` |
| Exceptions (try/catch/throw, noexcept, exception hierarchy, RAII and exceptions, error codes) | `exceptions.md` |
| STL containers (vector, array, deque, list, forward_list, map, multimap, unordered_map, set, stack, queue, priority_queue, span, flat_map) | `stl-containers.md` |
| STL algorithms (sort, find, transform, accumulate, partition, etc.), iterators, ranges, views | `stl-algorithms.md` |
| Strings (string, string_view, char_traits, C strings, formatting) | `stl-strings.md` |
| Utilities (pair, tuple, optional, variant, any, function, bind, reference_wrapper, source_location) | `stl-utilities.md` |
| Concurrency (thread, jthread, mutex, lock_guard, unique_lock, shared_mutex, condition_variable, future/promise, async, latch, barrier, counting_semaphore, atomic, memory order, stop_token) | `concurrency.md` |
| I/O (iostream, fstream, stringstream, format, print, println, file system) | `io.md` |
| Chrono (duration, time_point, clock, calendar, time zone, formatting) | `chrono.md` |
| Numerics (complex, random, valarray, ratio, numeric limits, math functions, special math) | `numerics.md` |
| Coroutines (co_await, co_yield, co_return, task, generator, promise_type) | `coroutines.md` |
| Regular expressions (std::regex, regex_match, regex_search, regex_replace, ECMAScript syntax, iterators) | `stl-regex.md` |
| Modules (export, import, module interface, module partition, header units), headers | `modules.md` |
| Metaprogramming (type traits, constexpr, consteval, concepts, SFINAE, fold expressions, compile-time programming) | `metaprogramming.md` |
| Idioms and patterns (RAII, Rule of 0/3/5, CRTP, Pimpl, NVI, type erasure, copy-and-swap, value categories, ODR, ADL, design patterns) | `idioms-patterns.md` |
| C standard library compatibility (C headers, C I/O, C memory, C strings, signals, assertions, errno, locale, wide chars) | `c-compat.md` |
| Testing and benchmarking (Google Test, Catch2, doctest, Google Benchmark, mocks, fuzzing, CMake integration) | `testing.md` |
| Keywords, operators, escape sequences, standard library headers, predefined macros, attributes, integer type ranks | `keywords-reference.md` |
| Advanced topics (contracts, named requirements, freestanding, SIMD, reflection, evaluation order, debugging, safe reclamation, inplace_vector, hive) | `advanced-topics.md` |
| C++26/23/20/17/14/11 new features and migration | `whats-new.md` |

## Core Philosophy

C++ is a **compiled, statically typed, multi-paradigm** language designed for systems programming and performance-critical applications. Key principles:

1. **Zero-Overhead Abstraction** — "What you don't use, you don't pay for; what you do use, you couldn't write better by hand"
2. **RAII** — Resource Acquisition Is Initialization — resources are tied to object lifetimes
3. **Value Semantics** — objects are copied/moved by default; use references for indirection
4. **Compile-Time Computation** — templates, constexpr, concepts — move work to compile time
5. **Deterministic Destruction** — destructors run at scope exit, no GC pauses
6. **Backward Compatibility** — C++ maintains C compatibility; legacy code still compiles

## Hello World

```cpp
#include <print>

int main() {
    std::print("Hello, World!\n");
}
```

## Hello World (C++20 with iostream)

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!\n";
}
```

## Build and Run

```bash
# GCC
g++ -std=c++26 -O2 -Wall -Wextra -o hello hello.cpp
./hello

# Clang
clang++ -std=c++26 -O2 -Wall -Wextra -o hello hello.cpp
./hello

# MSVC (Developer Command Prompt)
cl /std:c++26 /EHsc /O2 hello.cpp
hello.exe
```

## Project Creation (CMake)

```bash
mkdir myproject && cd myproject
cat > CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.20)
project(myapp CXX)
set(CMAKE_CXX_STANDARD 26)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
add_executable(myapp src/main.cpp)
target_compile_options(myapp PRIVATE -Wall -Wextra -Wpedantic -O2)
EOF
mkdir src && cat > src/main.cpp << 'EOF'
#include <print>
int main() { std::print("Hello, {}!\n", "World"); }
EOF
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
./build/myapp
```
