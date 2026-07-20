# Coroutines

## Overview

Coroutines are functions that can be suspended and resumed. They use `co_await`, `co_yield`, or `co_return`.

```cpp
// Three keywords:
// co_await expr  — suspend until awaitable is ready
// co_yield expr  — suspend and produce a value
// co_return expr — complete coroutine and produce final value

// A function containing any of these is a coroutine.
// Coroutines return a coroutine type (e.g., generator, task).
```

## Promise Type and Coroutine Handle

```cpp
#include <coroutine>

// Every coroutine has a promise_type that controls behavior
// The compiler generates a coroutine frame containing:
// - The promise object
// - Local variables
// - Suspension points

// Coroutine handle — non-owning handle to coroutine frame
std::coroutine_handle<> handle;

// Resume
handle.resume();
// Destroy
handle.destroy();
// Check if done (co_return was reached)
handle.done();
// Get promise
auto& promise = handle.promise();
```

## Generator

```cpp
#include <coroutine>
#include <iostream>

// Simple generator — produces sequence of values
template<typename T>
class Generator {
public:
    struct promise_type {
        T current_value;

        Generator get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(T value) {
            current_value = std::move(value);
            return {};
        }
        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };

    using handle_type = std::coroutine_handle<promise_type>;

    Generator(handle_type h) : handle(h) {}
    ~Generator() { if (handle) handle.destroy(); }
    Generator(const Generator&) = delete;
    Generator& operator=(const Generator&) = delete;
    Generator(Generator&& other) noexcept : handle(other.handle) { other.handle = nullptr; }
    Generator& operator=(Generator&& other) noexcept {
        if (this != &other) {
            if (handle) handle.destroy();
            handle = other.handle;
            other.handle = nullptr;
        }
        return *this;
    }

    // Iterator interface
    struct iterator {
        handle_type handle;
        iterator& operator++() { handle.resume(); return *this; }
        T& operator*() { return handle.promise().current_value; }
        bool operator==(std::default_sentinel_t) const { return handle.done(); }
        bool operator!=(std::default_sentinel_t) const { return !handle.done(); }
    };

    iterator begin() { handle.resume(); return {handle}; }
    std::default_sentinel end() { return {}; }

private:
    handle_type handle;
};

// Usage
Generator<int> naturals(int start = 0) {
    while (true) {
        co_yield start++;
    }
}

Generator<int> range(int from, int to) {
    for (int i = from; i < to; ++i) {
        co_yield i;
    }
    co_return;
}

// Use with range-for
for (auto x : range(0, 10)) {
    std::cout << x << ' ';  // 0 1 2 3 4 5 6 7 8 9
}

// Fibonacci
Generator<int> fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}

// Take first N
for (auto it = fibonacci().begin(); it != std::default_sentinel; ++it) {
    if (*it > 100) break;
    std::cout << *it << ' ';
}
```

## Task (asynchronous coroutine)

```cpp
#include <coroutine>
#include <future>

// Simple task — async coroutine returning a value
template<typename T>
class Task {
public:
    struct promise_type {
        T value;
        std::exception_ptr exception;

        Task get_return_object() {
            return Task{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_value(T v) { value = std::move(v); }
        void unhandled_exception() { exception = std::current_exception(); }
    };

    using handle_type = std::coroutine_handle<promise_type>;

    Task(handle_type h) : handle(h) {}
    ~Task() { if (handle) handle.destroy(); }
    Task(Task&& other) noexcept : handle(other.handle) { other.handle = nullptr; }

    bool await_ready() const { return handle.done(); }
    void await_suspend(std::coroutine_handle<> awaiting) {
        handle.resume();
        if (!handle.done()) {
            // In real implementation, schedule continuation
        }
    }
    T await_resume() {
        if (handle.promise().exception) {
            std::rethrow_exception(handle.promise().exception);
        }
        return std::move(handle.promise().value);
    }

    T get() {
        handle.resume();
        if (handle.promise().exception) {
            std::rethrow_exception(handle.promise().exception);
        }
        return std::move(handle.promise().value);
    }

private:
    handle_type handle;
};

// Usage
Task<int> compute_value() {
    co_return 42;
}

Task<int> computeSum() {
    int a = co_await computeValue();
    int b = co_await computeValue();
    co_return a + b;
}

auto task = computeSum();
std::cout << task.get();  // 84
```

## co_await

```cpp
// Awaitable — object that defines await_ready, await_suspend, await_resume

// Suspend never (always ready)
struct NeverSuspend {
    bool await_ready() noexcept { return true; }
    void await_suspend(std::coroutine_handle<>) noexcept {}
    void await_resume() noexcept {}
};

// Suspend always
struct AlwaysSuspend {
    bool await_ready() noexcept { return false; }
    void await_suspend(std::coroutine_handle<>) noexcept {}
    void await_resume() noexcept {}
};

// Suspend and resume on thread
struct ResumeOnThread {
    std::thread::id thread_id;
    bool await_ready() noexcept { return false; }
    void await_suspend(std::coroutine_handle<> h) noexcept {
        std::thread([h]() { h.resume(); }).detach();
    }
    void await_resume() noexcept {}
};

// Custom awaitable with value
template<typename T>
struct Awaiter {
    T value;
    bool await_ready() noexcept { return true; }
    void await_suspend(std::coroutine_handle<>) noexcept {}
    T await_resume() { return std::move(value); }
};

// co_await expression
auto result = co_await Awaiter<int>{42};
```

## Suspend Points

```cpp
// std::suspend_always — always suspend
// std::suspend_never — never suspend

// initial_suspend — called at coroutine start
// final_suspend — called at coroutine end (before destruction)

// Example: lazy generator (suspend at start)
struct promise_type {
    std::suspend_always initial_suspend() { return {}; }  // lazy
    std::suspend_always final_suspend() noexcept { return {}; }
    // ...
};

// Example: eager coroutine (start immediately)
struct promise_type {
    std::suspend_never initial_suspend() { return {}; }  // eager
    std::suspend_always final_suspend() noexcept { return {}; }
    // ...
};
```

## Symmetric Transfer (avoid stack overflow)

```cpp
// For recursive coroutines, use symmetric transfer to avoid stack overflow

struct promise_type {
    // ...
    auto await_suspend(std::coroutine_handle<> h) {
        // Instead of h.resume() (which grows stack),
        // symmetric transfer returns handle to resume without growing stack
        return other_handle;  // resume other coroutine directly
    }
};

// In generator
Generator<int> chained() {
    co_yield 1;
    co_yield 2;
    auto inner = range(10, 15);
    for (auto x : inner) {
        co_yield x;  // yield from inner
    }
}
```

## Practical: Async HTTP-like Task

```cpp
// Simplified async task with event loop
class EventLoop {
    std::queue<std::coroutine_handle<>> ready;
public:
    void schedule(std::coroutine_handle<> h) { ready.push(h); }
    void run() {
        while (!ready.empty()) {
            auto h = ready.front();
            ready.pop();
            h.resume();
        }
    }
};

EventLoop loop;

struct YieldToLoop {
    bool await_ready() noexcept { return false; }
    void await_suspend(std::coroutine_handle<> h) { loop.schedule(h); }
    void await_resume() noexcept {}
};

Task<int> asyncWork() {
    int sum = 0;
    for (int i = 0; i < 5; ++i) {
        co_await YieldToLoop{};  // yield to event loop
        sum += i;
    }
    co_return sum;
}

// Run
auto task = asyncWork();
loop.schedule(task.handle);
loop.run();
std::cout << task.get();  // 10 (0+1+2+3+4)
```

## C++23: std::generator (proposed, not in standard yet)

```cpp
// C++23 std::generator is not yet in all implementations
// Use the custom Generator above or check compiler support
// C++26: std::generator may be available in <generator>
```
