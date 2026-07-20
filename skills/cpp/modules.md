# Modules

## Overview

Modules (C++20) replace header files for better compilation speed, isolation, and dependency management.

```cpp
// Traditional #include — text inclusion, slow compilation, ODR issues
#include <iostream>

// Modules — compiled once, imported as needed
import std;  // C++26: import entire standard library
```

## Module Interface Unit

```cpp
// math.cppm (module interface unit) — .cppm or .ixx extension
export module math;

// Exported declarations — visible to importers
export int add(int a, int b) { return a + b; }
export int subtract(int a, int b) { return a - b; }

// Non-exported — module-internal only
int helper(int x) { return x * 2; }

export int compute(int x) { return helper(x); }  // uses internal helper
```

## Module Implementation Unit

```cpp
// math_impl.cpp (module implementation unit)
module math;  // note: no 'export'

int internalFunc(int x) {
    return x + 1;
}
```

## Importing Modules

```cpp
// main.cpp
import math;
import std;  // C++26: standard library module

int main() {
    std::cout << add(2, 3);      // OK: exported
    std::cout << subtract(5, 2); // OK: exported
    // helper(42);               // error: not exported
}
```

## Module Partitions

```cpp
// Partition interface unit
// math.core.cppm
export module math:core;

export int multiply(int a, int b) { return a * b; }
export int divide(int a, int b) { return a / b; }

// Partition implementation unit
// math.core.impl.cpp
module math:core;

int coreHelper(int x) { return x; }

// Primary module interface — imports partitions
// math.cppm
export module math;
export import :core;  // re-export partition

export int add(int a, int b) { return a + b; }
```

## Header Units

```cpp
// Import header as module (C++20)
import <iostream>;     // import header as header unit
import <vector>;

// Works with existing headers without modifying them
// Compiled to BMI (Binary Module Interface) once

// Global module fragment — for including headers in modules
module;
#include <iostream>
#include <vector>
export module mymodule;

export void func() {
    std::cout << "hello";
    std::vector<int> v;
}
```

## Module Visibility Rules

```cpp
// Names declared in module are not visible to importers unless exported
export module mymod;

// Exported — visible
export int x = 42;
export void func();

// Not exported — module-internal
int y = 10;
void internalFunc();

// Exported namespace
export namespace mylib {
    int value = 100;
    void doSomething();
}

// Re-export
export import other_module;  // re-export all from other module
```

## Build System Integration

### CMake with Modules

```cmake
# CMake 3.28+ has native module support
cmake_minimum_required(VERSION 3.28)
project(moduledemo CXX)

set(CMAKE_CXX_STANDARD 26)
set(CMAKE_CXX_SCAN_FOR_MODULES ON)

add_executable(myapp main.cpp)
target_sources(myapp
    PUBLIC
    FILE_SET CXX_MODULES FILES
    math.cppm
    math.core.cppm
)
```

### Manual Compilation (GCC)

```bash
# Compile module interface
g++ -std=c++26 -c math.cppm -o math.gcm  # generates BMI (gcm)

# Compile main with module
g++ -std=c++26 -fmodules -fmodule-math=math.gcm main.cpp -o myapp
```

### Manual Compilation (Clang)

```bash
# Compile module interface
clang++ -std=c++26 --precompile math.cppm -o math.pcm

# Compile to object
clang++ -std=c++26 -c math.pcm -o math.o

# Compile main
clang++ -std=c++26 -fmodule-file=math.pcm main.cpp math.o -o myapp
```

### Manual Compilation (MSVC)

```bash
# Compile module interface
cl /std:c++26 /c /interface /TP math.cppm  # generates math.ifc

# Compile main
cl /std:c++26 /reference math.ifc main.cpp
```

## Standard Library Module (C++26)

```cpp
// C++26: import entire standard library as module
import std;  // all of std in one module

// Or import specific parts
import std.io;       // iostream, format, print
import std.containers; // vector, map, etc.
import std.algorithm;
import std.threading;
import std.numerics;
import std.ranges;
```

## Benefits of Modules

- **Faster compilation** — modules compiled once, not re-parsed
- **Better isolation** — no macro leakage, no ODR issues
- **Explicit dependencies** — import clearly states what's needed
- **No header guards** — no `#pragma once` or `#ifndef` needed
- **No include order issues** — modules are order-independent
- **Better error messages** — compiler has semantic information
