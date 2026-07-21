# Futures and Error Handling

Everything you wanted to know about handling errors and exceptions when writing asynchronous code.

## Overview

The Dart language has native asynchrony support with `async`, `await`, and `try-catch`. However, some code — especially older code — might still use `Future` methods such as `then()`, `catchError()`, and `whenComplete()`.

If your code uses `async`/`await` with `try-catch`, you don't need this page. This page helps you avoid common pitfalls when using the `Future` API directly.

## The Future API

Functions that use the Future API register callbacks that handle the value (or the error) that completes a Future:

```dart
myFunc().then(processValue).catchError(handleError);
```

The registered callbacks fire based on the following rules:

- `then()`'s callback fires if the Future completes with a value
- `catchError()`'s callback fires if the Future completes with an error

If `myFunc()`'s Future completes with a value, `then()`'s callback fires. If no new error is produced within `then()`, `catchError()`'s callback does not fire. If `myFunc()` completes with an error, `then()`'s callback does not fire, and `catchError()`'s callback does.

## Chaining then() and catchError()

Chained `then()` and `catchError()` invocations are the rough equivalent of try-catch blocks:

```dart
myFunc()
  .then((value) {
    doSomethingWith(value);
    throw Exception('Some arbitrary error');
  })
  .catchError(handleError);
```

If `myFunc()`'s Future completes with a value, `then()`'s callback fires. If code within `then()` throws, `then()`'s Future completes with an error, which is handled by `catchError()`.

If `myFunc()`'s Future completes with an error, `then()`'s Future completes with that error, also handled by `catchError()`.

## Common pitfalls

### catchError doesn't handle errors from then's callback

Actually, it does. `catchError()` handles errors from both the original Future and from `then()`'s callback.

### Async functions and the Future API

Prefer `async`/`await` with `try-catch` over `then()`/`catchError()`:

```dart
// Preferred: async/await
Future<void> doSomething() async {
  try {
    final value = await myFunc();
    doSomethingWith(value);
  } catch (e) {
    handleError(e);
  }
}

// Legacy: Future API
Future<void> doSomething() {
  return myFunc()
    .then(doSomethingWith)
    .catchError(handleError);
}
```

## whenComplete()

`whenComplete()` is the equivalent of `finally`:

```dart
myFunc()
  .then(processValue)
  .catchError(handleError)
  .whenComplete(() {
    // Always runs, regardless of success or error
    cleanup();
  });
```

## Testing the optional onError parameter

`then()` has an optional `onError` parameter that can handle errors:

```dart
myFunc().then(
  (value) { /* handle value */ },
  onError: (error) { /* handle error */ },
);
```

However, using `catchError()` is generally preferred for error handling.
