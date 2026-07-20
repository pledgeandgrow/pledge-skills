# Getting Started & Installation

## Compilers

### GCC (GNU Compiler Collection)

```bash
# Linux (Ubuntu/Debian)
sudo apt install g++ gcc
sudo apt install g++-14  # specific version

# Linux (Fedora/RHEL)
sudo dnf install gcc-c++

# macOS (via Homebrew)
brew install gcc
g++-14 --version

# Windows (MSYS2)
pacman -S mingw-w64-ucrt-x86_64-gcc

# Check version and C++ standard support
g++ --version
g++ -dM -E -x c++ /dev/null | grep __cplusplus
# Check specific standard
g++ -std=c++26 -dM -E -x c++ /dev/null | grep __cplusplus
```

### Clang (LLVM)

```bash
# Linux (Ubuntu/Debian)
sudo apt install clang
sudo apt install clang-18  # specific version

# macOS (Xcode or Homebrew)
xcode-select --install
brew install llvm@18

# Windows (MSYS2 or LLVM installer)
pacman -S mingw-w64-ucrt-x86_64-clang
# Or download from https://github.com/llvm/llvm-project/releases

clang++ --version
```

### MSVC (Microsoft Visual C++)

```bash
# Install Visual Studio or Build Tools
# https://visualstudio.microsoft.com/downloads/

# Use Developer Command Prompt
cl /std:c++26 /EHsc /O2 hello.cpp

# Check version
cl /Bv
```

## Build Systems

### CMake

```cmake
# CMakeLists.txt — minimum modern project
cmake_minimum_required(VERSION 3.20)
project(myapp CXX)

set(CMAKE_CXX_STANDARD 26)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Default to Release
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# Warnings
add_compile_options(-Wall -Wextra -Wpedantic -Werror)

# Executable
add_executable(myapp src/main.cpp)

# Library
add_library(mylib STATIC src/lib.cpp)
target_include_directories(mylib PUBLIC include)

# Link library
target_link_libraries(myapp PRIVATE mylib)

# Find package
find_package(fmt REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt)

# Tests
enable_testing()
add_executable(test_main tests/test_main.cpp)
target_link_libraries(test_main PRIVATE mylib Catch2::Catch2WithMain)
include(CTest)
include(Catch)
catch_discover_tests(test_main)
```

```bash
# Configure and build
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)

# Run tests
ctest --test-dir build --output-on-failure

# Install
cmake --install build --prefix /usr/local
```

### CMake Presets

```json
{
    "version": 6,
    "cmakeMinimumRequired": { "major": 3, "minor": 21, "patch": 0 },
    "configurePresets": [
        {
            "name": "default",
            "binaryDir": "${sourceDir}/build",
            "cacheVariables": {
                "CMAKE_CXX_STANDARD": "26",
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
        {
            "name": "debug",
            "inherits": "default",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Debug" }
        }
    ],
    "buildPresets": [
        { "name": "default", "configurePreset": "default" },
        { "name": "debug", "configurePreset": "debug" }
    ]
}
```

```bash
cmake --preset default
cmake --build --preset default
```

### Make (manual)

```makefile
CXX := g++
CXXFLAGS := -std=c++26 -Wall -Wextra -Wpedantic -O2
LDFLAGS :=

SRCS := $(wildcard src/*.cpp)
OBJS := $(SRCS:.cpp=.o)
TARGET := myapp

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
```

### Ninja

```bash
# Install Ninja
sudo apt install ninja-build

# Use with CMake
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build build

# Direct ninja build
cat > build.ninja << 'EOF'
cxx = g++
cxxflags = -std=c++26 -O2 -Wall

rule compile
  command = $cxx $cxxflags -c $in -o $out

rule link
  command = $cxx $cxxflags $in -o $out

build main.o: compile src/main.cpp
build myapp: link main.o
EOF
ninja
```

## Package Managers

### vcpkg

```bash
# Install vcpkg
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh

# Install packages
./vcpkg install fmt nlohmann-json boost-asio

# Use with CMake
cmake -B build -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
```

### Conan

```bash
# Install Conan
pip install conan

# conanfile.txt
[requires]
fmt/10.2.1
nlohmann_json/3.11.3

[generators]
CMakeDeps
CMakeToolchain

# Install
conan install . --output-folder=build --build=missing

# Use with CMake
cmake -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
```

### FetchContent (CMake built-in)

```cmake
include(FetchContent)

FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG 10.2.1
)
FetchContent_MakeAvailable(fmt)

target_link_libraries(myapp PRIVATE fmt::fmt)
```

## Compiler Flags

### Common Flags (GCC/Clang)

| Flag | Description |
|------|-------------|
| `-std=c++26` | Set C++ standard |
| `-O0/1/2/3/s` | Optimization level |
| `-Wall -Wextra -Wpedantic` | Enable warnings |
| `-Werror` | Treat warnings as errors |
| `-g` | Debug symbols |
| `-fsanitize=address` | AddressSanitizer (memory errors) |
| `-fsanitize=undefined` | UndefinedBehaviorSanitizer |
| `-fsanitize=thread` | ThreadSanitizer |
| `-fsanitize=leak` | LeakSanitizer |
| `-fcoroutines` | Enable coroutines (pre-C++20) |
| `-fmodules` | Enable modules |
| `-pthread` | Enable threading |
| `-I/path` | Include path |
| `-L/path` | Library path |
| `-lname` | Link library |
| `-DNAME=value` | Define preprocessor macro |
| `-E` | Preprocess only |
| `-S` | Compile to assembly |
| `-c` | Compile to object file |
| `-MMD -MP` | Generate dependency files |
| `-flto` | Link-time optimization |
| `-march=native` | Target native CPU |
| `-pipe` | Use pipes instead of temp files |
| `-ffile-prefix-map` | Remap debug paths |

### MSVC Flags

| Flag | Description |
|------|-------------|
| `/std:c++26` | Set C++ standard |
| `/O2` | Optimize for speed |
| `/Od` | Disable optimization |
| `/W4` | Warning level 4 |
| `/WX` | Treat warnings as errors |
| `/EHsc` | Exception handling model |
| `/Zi` | Debug info |
| `/MD` / `/MT` | Multi-threaded DLL/static CRT |
| `/fsanitize=address` | AddressSanitizer |
| `/permissive-` | Strict standards conformance |
| `/utf-8` | UTF-8 source and execution charset |

## Debugging

```bash
# Compile with debug info
g++ -std=c++26 -g -O0 -fsanitize=address,undefined -o debug hello.cpp

# GDB
gdb ./debug
(gdb) break main
(gdb) run
(gdb) next
(gdb) step
(gdb) print variable
(gdb) backtrace
(gdb) quit

# LLDB
lldb ./debug
(lldb) breakpoint set --name main
(lldb) run
(lldb) next
(lldb) step
(lldb) frame variable
(lldb) bt
```

## Static Analysis

```bash
# Clang-Tidy
clang-tidy --checks='-*,modernize-*,performance-*,readability-*' hello.cpp -- -std=c++26

# cppcheck
cppcheck --enable=all --std=c++26 --suppress=missingIncludeSystem src/

# Clang Static Analyzer
scan-build g++ -std=c++26 hello.cpp

# Include-What-You-Use
iwyu --std=c++26 hello.cpp
```

## Sanitizers

```bash
# AddressSanitizer — memory errors (buffer overflow, use-after-free, etc.)
g++ -fsanitize=address -g -o test test.cpp

# UndefinedBehaviorSanitizer — undefined behavior
g++ -fsanitize=undefined -g -o test test.cpp

# ThreadSanitizer — data races
g++ -fsanitize=thread -g -o test test.cpp

# MemorySanitizer — uninitialized memory (Clang only)
clang++ -fsanitize=memory -g -o test test.cpp

# LeakSanitizer — memory leaks (part of ASan)
g++ -fsanitize=address -fsanitize=leak -g -o test test.cpp

# Combined
g++ -fsanitize=address,undefined -g -o test test.cpp
```
