# Fibers

## Overview

Fibers (PHP 8.1+) represent full-stack, interruptible functions. They can be suspended from anywhere in the call stack, pausing execution until resumed. Unlike stack-less Generators, each Fiber has its own call stack.

## Basic Usage

```php
$fiber = new Fiber(function (): void {
    $value = Fiber::suspend('fiber');
    echo "Value used to resume: {$value}\n";
});

$value = $fiber->start();
echo "Value from fiber suspending: {$value}\n";

$fiber->resume('test');
// Output:
// Value from fiber suspending: fiber
// Value used to resume: test
```

## Fiber Lifecycle

1. **Created** — `new Fiber(callable)` — not yet started
2. **Started** — `$fiber->start(...$args)` — begins execution
3. **Suspended** — `Fiber::suspend($value)` — pauses, returns value to caller
4. **Resumed** — `$fiber->resume($value)` — continues, value returned from `suspend()`
5. **Terminated** — fiber function returns or throws
6. **Dead** — `$fiber->isTerminated()` returns true

## Fiber Methods

```php
$fiber = new Fiber(fn() => Fiber::suspend('hello'));

// Start the fiber
$startValue = $fiber->start();

// Check status
$fiber->isStarted();     // bool — has started
$fiber->isRunning();     // bool — currently running
$fiber->isSuspended();   // bool — paused
$fiber->isTerminated();  // bool — finished

// Resume with value
$fiber->resume('world');

// Resume by throwing exception into fiber
$fiber->throw(new Exception("Error in fiber"));

// Get return value (after termination)
$fiber->getReturn();
```

## Fiber::suspend()

```php
// Suspend the currently running fiber
$value = Fiber::suspend('data');

// Returns the value passed to resume()
// If called outside a fiber, throws FiberError
```

## Passing Data

```php
$fiber = new Fiber(function (string $initial): void {
    echo "Started with: {$initial}\n";

    $first = Fiber::suspend('first suspend');
    echo "Resumed with: {$first}\n";

    $second = Fiber::suspend('second suspend');
    echo "Resumed with: {$second}\n";
});

$fiber->start('initial arg');
$fiber->resume('first resume');
$fiber->resume('second resume');

// Output:
// Started with: initial arg
// Resumed with: first resume
// Resumed with: second resume
```

## Exception Handling

```php
$fiber = new Fiber(function (): void {
    try {
        Fiber::suspend('waiting');
    } catch (Exception $e) {
        echo "Caught in fiber: {$e->getMessage()}\n";
    }
});

$fiber->start();
$fiber->throw(new Exception("Injected error"));
// Output: Caught in fiber: Injected error
```

## Use Cases

- **Asynchronous I/O** — cooperative multitasking for async frameworks
- **Coroutines** — pause/resume long-running tasks
- **Event loops** — building async runtimes (e.g., Revolt event loop)
- **Interruptible computations** — yield control periodically

## Fibers vs Generators

| Feature | Fiber | Generator |
|---------|-------|-----------|
| Call stack | Full stack | Stack-less |
| Suspend from | Anywhere in call stack | Only at `yield` |
| Return type change | No (function return type stays same) | Must return `Generator` |
| Nested suspension | Yes — deeply nested calls | No — only in generator function |
| Use in `array_map` etc. | Yes | No (unless using `yield`) |
| Overhead | Higher (full stack) | Lower |

## Important Notes

- Prior to PHP 8.4.0, switching fibers during object destructor execution was not allowed
- Fibers are **not** threads — they are cooperative, single-threaded
- A fiber must be started before it can be resumed or thrown into
- `Fiber::suspend()` outside a fiber throws `FiberError`
- Each fiber has its own call stack, allocated on creation
