# Concurrency

## std::thread and std::jthread

```cpp
#include <thread>
#include <iostream>

// std::thread — basic thread
void func(int x) { std::cout << x; }
std::thread t(func, 42);
t.join();  // wait for completion
// or t.detach();  // let it run independently (dangerous)

// Lambda
std::thread t2([]() { std::cout << "hello from thread"; });
t2.join();

// std::jthread (C++20) — auto-join + stop_token
std::jthread jt([](std::stop_token st) {
    while (!st.stop_requested()) {
        // do work
    }
});
jt.request_stop();  // signal stop
// auto-joins on destruction

// Thread ID
std::thread::id tid = t.get_id();
std::cout << std::this_thread::get_id();

// Hardware concurrency
unsigned int n = std::thread::hardware_concurrency();  // number of CPU threads

// Sleep
std::this_thread::sleep_for(std::chrono::milliseconds(100));
std::this_thread::sleep_until(std::chrono::steady_clock::now() + std::chrono::seconds(1));

// Yield
std::this_thread::yield();  // hint to reschedule

// Thread with return value — use std::async or std::promise
auto future = std::async(std::launch::async, []() { return 42; });
int result = future.get();  // 42

// Multiple threads
std::vector<std::thread> threads;
for (int i = 0; i < 10; ++i) {
    threads.emplace_back([i]() { std::cout << i; });
}
for (auto& t : threads) t.join();
```

## Mutexes

```cpp
#include <mutex>

// std::mutex
std::mutex mtx;
{
    std::lock_guard<std::mutex> lock(mtx);  // RAII lock (C++11)
    // critical section
}  // auto-unlock

// std::unique_lock — movable, can lock/unlock
{
    std::unique_lock<std::mutex> lock(mtx);
    // can unlock/relock
    lock.unlock();
    // do non-critical work
    lock.lock();
    // critical again
}  // auto-unlock if locked

// Deferred locking
std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
// ... later ...
lock.lock();

// Try to lock
std::unique_lock<std::mutex> lock(mtx, std::try_to_lock);
if (lock.owns_lock()) { /* got lock */ }

// Timed locking
std::timed_mutex tmtx;
if (tmtx.try_lock_for(std::chrono::milliseconds(100))) {
    // got lock within 100ms
    tmtx.unlock();
}

// std::recursive_mutex — same thread can lock multiple times
std::recursive_mutex rmtx;
std::lock_guard<std::recursive_mutex> lock(rmtx);
// can lock again in same thread without deadlock

// std::recursive_timed_mutex — recursive + timed

// std::shared_mutex (C++17) — reader-writer lock
std::shared_mutex smtx;
// Multiple readers
{
    std::shared_lock<std::shared_mutex> readLock(smtx);
    // read shared data
}
// Single writer
{
    std::unique_lock<std::shared_mutex> writeLock(smtx);
    // write shared data
}

// std::scoped_lock (C++17) — lock multiple mutexes (deadlock-free)
std::mutex m1, m2;
{
    std::scoped_lock lock(m1, m2);  // locks both, deadlock-free
    // critical section
}

// std::call_once — execute function exactly once
std::once_flag flag;
std::call_once(flag, []() { /* initialize once */ });
```

## Condition Variables

```cpp
#include <condition_variable>
#include <queue>
#include <mutex>

// Producer-consumer pattern
std::queue<int> queue;
std::mutex mtx;
std::condition_variable cv;

// Producer
void produce(int value) {
    {
        std::lock_guard<std::mutex> lock(mtx);
        queue.push(value);
    }
    cv.notify_one();  // wake one waiting consumer
    // cv.notify_all();  // wake all waiting consumers
}

// Consumer
int consume() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, []() { return !queue.empty(); });  // wait with predicate
    int value = queue.front();
    queue.pop();
    return value;
}

// Wait with timeout
std::unique_lock<std::mutex> lock(mtx);
if (cv.wait_for(lock, std::chrono::seconds(5), []() { return !queue.empty(); })) {
    // condition met within 5 seconds
    int value = queue.front();
    queue.pop();
} else {
    // timeout
}

// Wait until time point
cv.wait_until(lock, std::chrono::steady_clock::now() + std::chrono::seconds(5), pred);
```

## Future, Promise, Async

```cpp
#include <future>

// std::async — simplest way to run async task
auto future = std::async(std::launch::async, []() { return 42; });
int result = future.get();  // 42 (blocks until ready)

// std::launch::async — run on new thread
// std::launch::deferred — run on get() (lazy)
// std::launch::async | std::launch::deferred — implementation chooses (default)

auto f1 = std::async(std::launch::async, []() { return 1; });
auto f2 = std::async(std::launch::async, []() { return 2; });
auto f3 = std::async(std::launch::async, []() { return 3; });
int sum = f1.get() + f2.get() + f3.get();  // 6

// std::promise — set value for future
std::promise<int> promise;
std::future<int> fut = promise.get_future();
std::thread t([&promise]() {
    // do work
    promise.set_value(42);  // fulfill promise
    // promise.set_exception(std::make_exception_ptr(std::runtime_error("error")));
});
t.join();
int r = fut.get();  // 42

// std::shared_future — multiple consumers
std::promise<int> p;
std::shared_future<int> sf = p.get_future().share();
std::thread t1([sf]() { std::cout << sf.get(); });
std::thread t2([sf]() { std::cout << sf.get(); });
p.set_value(42);
t1.join(); t2.join();

// Future status
auto f = std::async(std::launch::async, []() { 
    std::this_thread::sleep_for(std::chrono::seconds(1)); 
    return 42; 
});
auto status = f.wait_for(std::chrono::milliseconds(100));
if (status == std::future_status::ready) { /* done */ }
else if (status == std::future_status::timeout) { /* not done yet */ }
else if (status == std::future_status::deferred) { /* not started */ }

// Wait
f.wait();  // block until ready
f.wait_for(std::chrono::seconds(5));  // wait up to 5 seconds
f.wait_until(std::chrono::steady_clock::now() + std::chrono::seconds(5));

// std::packaged_task — wrap callable as future-producing task
std::packaged_task<int(int)> task([](int x) { return x * 2; });
std::future<int> fut2 = task.get_future();
std::thread t2(std::move(task), 21);
t2.join();
int r2 = fut2.get();  // 42

// packaged_task vs std::async:
// - async: creates thread for you, eager or lazy
// - packaged_task: you control thread creation, task is move-only
// - promise: you set value manually, more flexible
// - All three produce std::future
```

## Atomic

```cpp
#include <atomic>

// Basic atomic types
std::atomic<int> counter{0};
std::atomic<bool> flag{false};
std::atomic<size_t> size{0};

// Operations
counter.store(42);                    // atomically store
int v = counter.load();               // atomically load
int old = counter.exchange(99);       // store 99, return old value

// Fetch and modify
counter.fetch_add(1);                 // atomic add, return old
counter.fetch_sub(1);                 // atomic sub, return old
counter.fetch_or(0xFF);               // atomic OR, return old
counter.fetch_and(0xFF);              // atomic AND, return old
counter.fetch_xor(0xFF);              // atomic XOR, return old

// Operator shortcuts
counter++;  // atomic increment
counter--;  // atomic decrement
counter += 5;
counter -= 3;
counter |= 0x10;
counter &= 0xFF;

// Compare-exchange (CAS)
int expected = 42;
bool success = counter.compare_exchange_strong(expected, 100);
// if counter == 42: set to 100, return true
// else: set expected = counter, return false

// Weak CAS (may spuriously fail)
bool success2 = counter.compare_exchange_weak(expected, 100);

// Atomic flag (spinlock)
std::atomic_flag spinlock = ATOMIC_FLAG_INIT;
while (spinlock.test_and_set(std::memory_order_acquire));  // lock
// critical section
spinlock.clear(std::memory_order_release);  // unlock

// C++20: atomic_flag::test
bool locked = spinlock.test();  // check without setting

// C++20: atomic_ref — atomic operations on non-atomic data
int x = 0;
std::atomic_ref<int> atomicX(x);
atomicX.store(42);
// x is now 42

// C++20: std::atomic<float/double>
std::atomic<double> af{0.0};
af.fetch_add(3.14);  // C++20

// C++20: wait/notify
std::atomic<int> signal{0};
// Thread 1: wait
signal.wait(0);  // blocks until signal != 0
// Thread 2: notify
signal.store(1);
signal.notify_one();  // wake one waiting thread
signal.notify_all();  // wake all waiting threads

// Atomic shared_ptr (C++20)
std::atomic<std::shared_ptr<Widget>> atomicPtr;
auto p = std::make_shared<Widget>();
atomicPtr.store(p);
auto loaded = atomicPtr.load();
```

## Memory Order

```cpp
// std::memory_order_relaxed — no ordering, only atomicity
// Use for counters where order doesn't matter
counter.fetch_add(1, std::memory_order_relaxed);

// std::memory_order_acquire — no reads/writes can be reordered before this load
// Use for reading a flag that guards data
int v = flag.load(std::memory_order_acquire);
// all reads/writes after this cannot be reordered before the load

// std::memory_order_release — no reads/writes can be reordered after this store
// Use for writing a flag that guards data
flag.store(1, std::memory_order_release);
// all reads/writes before this cannot be reordered after the store

// std::memory_order_acq_rel — both acquire and release (for read-modify-write)
counter.fetch_add(1, std::memory_order_acq_rel);

// std::memory_order_seq_cst — sequentially consistent (default, strongest)
// Global total order of all operations
counter.store(42, std::memory_order_seq_cst);

// Acquire-release pattern (producer-consumer)
std::atomic<bool> ready{false};
int data = 0;

// Producer thread
data = 42;
ready.store(true, std::memory_order_release);

// Consumer thread
while (!ready.load(std::memory_order_acquire));
assert(data == 42);  // guaranteed to see data=42
```

## Synchronization Primitives (C++20)

```cpp
#include <latch>
#include <barrier>
#include <semaphore>
#include <stop_token>

// std::latch — one-time countdown
std::latch work_done(5);  // 5 threads
// Each thread:
work_done.count_down();  // decrement
// Main thread:
work_done.wait();  // block until count reaches 0
// or:
work_done.arrive_and_wait();  // decrement and wait

// std::barrier — reusable countdown
std::barrier sync_point(5, []() noexcept {
    // called when all threads arrive (completion function)
    std::cout << "Phase complete\n";
});
// Each thread:
sync_point.arrive_and_wait();  // wait for all, then continue
// Can arrive without waiting:
sync_point.arrive(1);  // decrement by 1, don't wait

// std::counting_semaphore — counting semaphore
std::counting_semaphore<3> sem(3);  // max 3, initial 3
sem.acquire();  // decrement (block if 0)
// critical section (max 3 concurrent)
sem.release();  // increment

// std::binary_semaphore — counting_semaphore<1>
std::binary_semaphore bsem(0);
bsem.release();  // signal
bsem.acquire();  // wait for signal

// stop_token / stop_source / stop_callback (C++20)
std::stop_source ss;
std::stop_token st = ss.get_token();

// Register callback
std::stop_callback cb(st, []() {
    std::cout << "Stop requested\n";
});

// Request stop
ss.request_stop();
bool stopped = st.stop_requested();  // true

// jthread with stop_token
std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) {
        // do work
    }
});
// request_stop() called automatically in jthread destructor
```

## Thread-Safe Data Structures

```cpp
// Thread-safe queue
template<typename T>
class ThreadSafeQueue {
    std::queue<T> queue;
    std::mutex mtx;
    std::condition_variable cv;

public:
    void push(T value) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            queue.push(std::move(value));
        }
        cv.notify_one();
    }

    bool tryPop(T& value) {
        std::lock_guard<std::mutex> lock(mtx);
        if (queue.empty()) return false;
        value = std::move(queue.front());
        queue.pop();
        return true;
    }

    void waitAndPop(T& value) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return !queue.empty(); });
        value = std::move(queue.front());
        queue.pop();
    }
};

// Thread-safe counter
class AtomicCounter {
    std::atomic<int> count{0};
public:
    void increment() { count.fetch_add(1, std::memory_order_relaxed); }
    int get() const { return count.load(std::memory_order_relaxed); }
};
```

## Parallel Algorithms (C++17)

```cpp
#include <execution>
#include <algorithm>
#include <numeric>

std::vector<int> v(1'000'000);
std::iota(v.begin(), v.end(), 0);

// Parallel sort
std::sort(std::execution::par, v.begin(), v.end());

// Parallel transform
std::vector<int> result(v.size());
std::transform(std::execution::par, v.begin(), v.end(), result.begin(),
    [](int x) { return x * x; });

// Parallel reduce
int sum = std::reduce(std::execution::par, v.begin(), v.end(), 0);

// Parallel for_each
std::for_each(std::execution::par, v.begin(), v.end(), [](int& x) { x *= 2; });

// Parallel fill
std::fill(std::execution::par, v.begin(), v.end(), 0);
```

## Senders and Receivers (`<execution>`, C++26)

```cpp
#include <execution>  // C++26 — senders/receivers (P2300)
// Note: also includes parallel algorithm execution policies (C++17)

// Senders/receivers — structured concurrency framework
// Composable, lazy, cancellable async operations

// Basic pipeline with pipe syntax
auto work = std::execution::schedule(scheduler)
    | std::execution::then([]() { return 42; })
    | std::execution::then([](int x) { return x * 2; });

// Start and wait for result
auto [result] = std::this_thread::sync_wait(std::move(work));
// result == 84

// Error handling
auto work2 = std::execution::schedule(scheduler)
    | std::execution::then([]() -> int { throw std::runtime_error("fail"); })
    | std::execution::upon_error([](std::exception_ptr e) {
        try { std::rethrow_exception(e); }
        catch (const std::exception& ex) {
            std::cerr << "Error: " << ex.what() << '\n';
            return -1;
        }
    });

// When_all — run multiple senders concurrently
auto [a, b, c] = std::this_thread::sync_wait(
    std::execution::when_all(
        std::execution::schedule(s1) | std::execution::then([] { return 1; }),
        std::execution::schedule(s2) | std::execution::then([] { return 2; }),
        std::execution::schedule(s3) | std::execution::then([] { return 3; })
    )
);
// a=1, b=2, c=3

// Transfer — switch scheduler mid-pipeline
auto work3 = std::execution::schedule(cpu_scheduler)
    | std::execution::then([]() { return compute(); })
    | std::execution::transfer(gpu_scheduler)  // switch to GPU
    | std::execution::then([](auto data) { return gpu_process(data); });

// Start detached (fire and forget)
std::execution::start_detached(
    std::execution::schedule(scheduler)
    | std::execution::then([]() { std::cout << "async\n"; })
);

// Custom sender — compose lower-level operations
// Senders: describe work to be done (lazy)
// Receivers: consume results (set_value, set_error, set_stopped)
// Schedulers: create senders for execution contexts

// Key concepts:
// - Lazy: work doesn't start until receiver is connected and started
// - Composable: pipe operator | chains operations
// - Cancellable: stop_token integration
// - Structured: clear ownership and lifecycle
// - Heterogeneous: CPU, GPU, network, I/O schedulers

// vs std::async:
// - std::async: eager, limited, no cancellation
// - senders/receivers: lazy, composable, cancellable, heterogeneous
```
