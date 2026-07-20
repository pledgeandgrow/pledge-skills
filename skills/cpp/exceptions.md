# Exceptions

## Basic Exception Handling

```cpp
#include <stdexcept>

// throw
void divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("Division by zero");
    }
    std::cout << a / b;
}

// try / catch
try {
    divide(10, 0);
} catch (const std::runtime_error& e) {
    std::cerr << "Error: " << e.what() << '\n';
} catch (const std::exception& e) {
    std::cerr << "Exception: " << e.what() << '\n';
} catch (...) {
    std::cerr << "Unknown exception\n";
}

// Catch by reference (avoid slicing)
try {
    throw std::runtime_error("error");
} catch (const std::exception& e) {  // const reference — no slicing
    std::cout << e.what();
}

// Multiple catch types
try {
    riskyOperation();
} catch (const std::bad_alloc& e) {
    std::cerr << "Memory error: " << e.what();
} catch (const std::out_of_range& e) {
    std::cerr << "Range error: " << e.what();
} catch (const std::exception& e) {
    std::cerr << "Other error: " << e.what();
}
```

## noexcept

```cpp
// noexcept — function does not throw
void safeFunction() noexcept {
    // if this throws, std::terminate is called
}

// noexcept(expr) — conditional noexcept
template<typename T>
void swap(T& a, T& b) noexcept(std::is_nothrow_move_constructible_v<T> &&
                                std::is_nothrow_move_assignable_v<T>) {
    T tmp = std::move(a);
    a = std::move(b);
    b = std::move(tmp);
}

// noexcept as operator — check if expression is noexcept
static_assert(noexcept(safeFunction()));  // true
bool isSafe = noexcept(2 + 3);  // true

// noexcept is part of function type (C++17)
// void (*fp)() noexcept = &safeFunction;  // C++17
```

## Standard Exception Hierarchy

```
std::exception
├── std::logic_error
│   ├── std::invalid_argument
│   ├── std::domain_error
│   ├── std::length_error
│   ├── std::out_of_range
│   └── std::future_error (C++11)
├── std::runtime_error
│   ├── std::overflow_error
│   ├── std::underflow_error
│   ├── std::range_error
│   ├── std::regex_error (C++11)
│   ├── std::system_error (C++11)
│   │   └── std::ios_base::failure (since C++11)
│   ├── std::format_error (C++20)
│   ├── std::bad_optional_access (C++17)
│   ├── std::bad_variant_access (C++17)
│   ├── std::bad_any_access (C++17)
│   └── std::bad_expected_access (C++23)
├── std::bad_typeid
├── std::bad_cast
│   └── std::bad_any_cast
├── std::bad_alloc
│   ├── std::bad_array_new_length
│   └── std::bad_weak_ptr
├── std::bad_exception
├── std::bad_function_call (C++11)
└── std::bad_variant_access (C++17)
```

```cpp
#include <stdexcept>

// Throwing standard exceptions
throw std::invalid_argument("bad argument");
throw std::out_of_range("index out of range");
throw std::runtime_error("runtime error");
throw std::overflow_error("overflow");
throw std::underflow_error("underflow");
throw std::length_error("length exceeded");
throw std::domain_error("domain error");
throw std::range_error("range error");

// bad_alloc
try {
    int* p = new int[1000000000000];  // huge allocation
} catch (const std::bad_alloc& e) {
    std::cerr << "Allocation failed: " << e.what();
}

// bad_cast
try {
    Base& b = derived;
    OtherType& o = dynamic_cast<OtherType&>(b);  // throws if wrong type
} catch (const std::bad_cast& e) {
    std::cerr << "Bad cast: " << e.what();
}

// bad_typeid
try {
    Base& b = *ptr;
    const std::type_info& ti = typeid(b);  // throws if ptr is null
} catch (const std::bad_typeid& e) {
    std::cerr << "Bad typeid: " << e.what();
}
```

## Custom Exceptions

```cpp
// Custom exception derived from std::exception
class FileError : public std::exception {
    std::string message;
public:
    explicit FileError(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override {
        return message.c_str();
    }
};

// Derived from std::runtime_error
class NetworkError : public std::runtime_error {
    int errorCode;
public:
    NetworkError(const std::string& msg, int code)
        : std::runtime_error(msg), errorCode(code) {}
    int code() const noexcept { return errorCode; }
};

// Usage
try {
    throw NetworkError("Connection refused", 61);
} catch (const NetworkError& e) {
    std::cerr << e.what() << " (code: " << e.code() << ")";
}
```

## RAII and Exceptions

```cpp
// RAII ensures cleanup even when exceptions are thrown
void processData() {
    std::lock_guard<std::mutex> lock(mtx);  // locked
    std::vector<int> data = loadData();     // may throw
    process(data);                          // may throw
}  // lock released automatically (even if exception thrown)

// Without RAII — resource leaks on exception
void badProcess() {
    mtx.lock();
    auto data = loadData();  // if this throws, mutex never unlocked!
    process(data);
    mtx.unlock();
}

// Stack unwinding — destructors called for all objects in scope
void func() {
    Widget w1;           // constructed
    Widget w2;           // constructed
    throw std::runtime_error("error");
    // w2.~Widget() called (stack unwinding)
    // w1.~Widget() called (stack unwinding)
}
```

## Exception Safety Guarantees

```cpp
// 1. No-throw guarantee (strongest) — noexcept
void swap(int& a, int& b) noexcept {
    int tmp = a; a = b; b = tmp;
}

// 2. Strong exception safety — commit or rollback
template<typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& value) {
        data.push_back(value);  // strong: if push_back throws, stack unchanged
    }
    
    T pop() {
        if (data.empty()) throw std::out_of_range("empty");
        T result = std::move(data.back());  // move (noexcept if T move is noexcept)
        data.pop_back();                     // noexcept
        return result;                       // NRVO or move
    }
};

// 3. Basic exception safety — no leaks, object in valid state
void basicSafe(std::vector<int>& v) {
    v.push_back(42);  // may throw, but v is still valid
}

// 4. No exception safety — leaks or corruption possible (avoid!)
void noSafety(int* p) {
    *p = 42;  // if p is null, UB (not an exception, but crash)
}
```

## std::expected (C++23) — Error Without Exceptions

```cpp
#include <expected>

// Return success or error without exceptions
std::expected<int, std::string> parse(const std::string& s) {
    try {
        return std::stoi(s);
    } catch (const std::invalid_argument&) {
        return std::unexpected("Not a number");
    }
}

auto result = parse("42");
if (result.has_value()) {
    std::cout << *result;  // 42
} else {
    std::cout << result.error();  // "Not a number"
}

// or_else, transform, and_then (monadic operations)
auto r = parse("42")
    .and_then([](int x) -> std::expected<int, std::string> {
        return x * 2;
    })
    .transform([](int x) { return std::to_string(x); });

// value_or
int n = parse("abc").value_or(0);  // 0

// Check
result.has_value();  // bool
result.has_error();  // bool (C++26 proposed)
*result;             // get value (UB if no value)
result.value();      // get value or throw
result.error();      // get error
```

## std::error_code and std::system_error

```cpp
#include <system_error>

// std::error_code
std::error_code ec = std::make_error_code(std::errc::permission_denied);
if (ec) {  // truthy if error
    std::cout << ec.value() << ": " << ec.message();
}

// std::system_error
throw std::system_error(ec, "Cannot open file");

// Custom error codes
enum class MyError {
    NotFound = 1,
    Invalid = 2,
};

namespace std {
    template<>
    struct is_error_code_enum<MyError> : true_type {};
}

std::error_code make_error_code(MyError e) {
    static const std::error_category& cat = []() -> std::error_category& {
        static struct : std::error_category {
            const char* name() const noexcept override { return "myerror"; }
            std::string message(int ev) const override {
                switch (static_cast<MyError>(ev)) {
                    case MyError::NotFound: return "Not found";
                    case MyError::Invalid: return "Invalid";
                    default: return "Unknown";
                }
            }
        } category;
        return category;
    }();
    return {static_cast<int>(e), cat};
}

// Usage
throw std::system_error(make_error_code(MyError::NotFound), "Resource missing");
```

## Exception Handling Best Practices

```cpp
// 1. Throw by value, catch by reference
try {
    throw std::runtime_error("error");  // throw by value
} catch (const std::exception& e) {     // catch by const reference
    // ...
}

// 2. Don't throw in destructors (may cause std::terminate)
class Bad {
    ~Bad() {
        if (error) throw std::runtime_error("error in destructor");  // BAD
    }
};

// 3. Don't catch what you can't handle
// Let exceptions propagate to code that can handle them

// 4. Use RAII for resource management
// 5. Prefer noexcept for move operations
// 6. Use std::expected for expected errors (not exceptional ones)
// 7. Don't use exceptions for control flow
// 8. Catch specific types first, then base types
// 9. Use [[nodiscard]] on functions that return expected/optional
```
