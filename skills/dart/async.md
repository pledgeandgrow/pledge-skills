# Asynchronous Programming

Dart libraries are full of functions that return `Future` or `Stream` objects. These functions are asynchronous: they return after setting up a possibly time-consuming operation, without waiting for it to complete.

The `async` and `await` keywords support asynchronous programming, letting you write asynchronous code that looks similar to synchronous code.

## Futures

A `Future` represents a value that will be available at some point in the future. You can think of it as a "promise" of a value.

### Creating Futures

```dart
// Immediate completion
Future<int> getValue() async => 42;

// Delayed completion
Future<String> fetchWithDelay() async {
  await Future.delayed(Duration(seconds: 1));
  return 'Done!';
}
```

### Handling Futures

Using `await`:

```dart
Future<void> main() async {
  var value = await getValue();
  print(value);
}
```

Using `.then()`:

```dart
getValue().then((value) {
  print(value);
});
```

### Error Handling

```dart
Future<void> main() async {
  try {
    var data = await fetchUserData();
    print(data);
  } catch (e) {
    print('Error: $e');
  }
}
```

### Future Methods

```dart
// Wait for all futures to complete
final results = await Future.wait([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);

// Wait for first future to complete
final result = await Future.any([
  fetchFromPrimary(),
  fetchFromBackup(),
]);

// Transform a future's result
final length = await fetchString().then((s) => s.length);

// Handle errors
fetchData().catchError((e) => print('Error: $e'));

// Run code when complete (success or failure)
fetchData().whenComplete(() => print('Done'));
```

## async and await

Use `async` to mark a function as asynchronous, and `await` to wait for a `Future` to complete:

```dart
Future<String> createOrderMessage() async {
  var order = await fetchUserOrder();
  return 'Your order is: $order';
}

Future<String> fetchUserOrder() async =>
    // Simulate a network request
    await Future.delayed(Duration(seconds: 2), () => 'Large Latte');
```

### async* (Async Generators)

Use `async*` to create a `Stream`:

```dart
Stream<int> countDown(int from) async* {
  while (from > 0) {
    await Future.delayed(Duration(seconds: 1));
    yield from--;
  }
}
```

## Streams

A `Stream` is a sequence of asynchronous events. Think of it as an asynchronous `Iterable`.

### Listening to Streams

```dart
void main() async {
  final stream = countDown(5);

  // Using await for
  await for (final count in stream) {
    print(count);
  }

  // Using listen
  stream.listen(
    (count) => print(count),
    onError: (e) => print('Error: $e'),
    onDone: () => print('Done'),
  );
}
```

### Stream Methods

```dart
// Get first element
final first = await stream.first;

// Get last element
final last = await stream.last;

// Check if empty
final isEmpty = await stream.isEmpty;

// Get all elements as a list
final all = await stream.toList();

// Transform elements
stream.map((e) => e * 2).listen(print);

// Filter elements
stream.where((e) => e > 0).listen(print);

// Take first N elements
stream.take(3).listen(print);

// Skip first N elements
stream.skip(2).listen(print);
```

### StreamController

Create your own streams with `StreamController`:

```dart
final controller = StreamController<int>();

controller.stream.listen((event) {
  print('Received: $event');
});

controller.add(1);
controller.add(2);
controller.add(3);

await controller.close();
```

### Broadcast Streams

By default, streams are single-subscription. Use `.asBroadcastStream()` or `StreamController.broadcast()` for multiple listeners:

```dart
final broadcastStream = stream.asBroadcastStream();

broadcastStream.listen((e) => print('Listener 1: $e'));
broadcastStream.listen((e) => print('Listener 2: $e'));
```

## Zones

Zones provide an execution context that can intercept async operations:

```dart
runZoned(() {
  // Code here runs in a new zone
  Future(() => print('In zone'));
}, onError: (e, s) {
  print('Zone caught: $e');
});
```

## Best Practices

- Prefer `async`/`await` over `.then()` chains
- Always handle errors with `try`/`catch` or `catchError`
- Close `StreamController` and `StreamSubscription` when done
- Use `unawaited()` for fire-and-forget futures to suppress linter warnings
- Avoid creating unnecessary futures — synchronous code is faster

## Common Async Patterns

### Parallel Execution

```dart
final results = await Future.wait([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);
```

### Sequential Execution

```dart
final user = await fetchUser();
final posts = await fetchPosts(user.id);
final comments = await fetchComments(posts.first.id);
```

### Timeout

```dart
try {
  final result = await fetchWithTimeout().timeout(Duration(seconds: 5));
} on TimeoutException {
  print('Request timed out');
}
```

### Completer

```dart
final completer = Completer<String>();

// Somewhere else
completer.complete('Result');

// Waiting
final result = await completer.future;
```
