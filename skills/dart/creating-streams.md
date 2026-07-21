# Creating Streams in Dart

A stream is a sequence of results. You listen on a stream to get notified of the results (both data and errors) and of the stream shutting down. You can also pause while listening or stop listening to the stream before it is complete.

You can create streams in a few ways:

1. **Transforming existing streams**
2. **Creating a stream from scratch using an `async*` function**
3. **Creating a stream by using a `StreamController`**

## Transforming existing streams

The most common case for creating streams is transforming an existing stream's events:

```dart
/// Splits a stream of consecutive strings into lines.
Stream<String> lines(Stream<String> source) async* {
  // Stores any partial line from the previous chunk.
  var partial = '';

  // Wait until a new chunk is available, then process it.
  await for (final chunk in source) {
    var lines = chunk.split('\n');
    lines[0] = partial + lines[0]; // Prepend partial line.
    partial = lines.removeLast();  // Remove new partial line.

    for (final line in lines) {
      yield line; // Add lines to output stream.
    }
  }

  // Add final partial line to output stream, if any.
  if (partial.isNotEmpty) yield partial;
}
```

### Using Stream transforming methods

For many common transformations, use `Stream`-supplied methods like `map()`, `where()`, `expand()`, and `take()`:

```dart
var counterStream = Stream<int>.periodic(
  const Duration(seconds: 1),
  (x) => x,
).take(15);

// Double the integer in each event.
var doubleCounterStream = counterStream.map((int x) => x * 2);
doubleCounterStream.forEach(print);
```

Chaining transformations:

```dart
counterStream
    .where((int x) => x.isEven) // Retain only even integer events.
    .expand((x) => [x, x])      // Duplicate each event.
    .take(5);                    // Stop after the first five events.
```

### Using StreamTransformer

For more control, use a `StreamTransformer` with `Stream`'s `transform()` method:

```dart
Stream<List<int>> content = File('someFile.txt').openRead();
List<String> lines = await content
    .transform(utf8.decoder)
    .transform(const LineSplitter())
    .toList();
```

## Creating a stream from scratch using async*

Use an `async*` function to create a stream from scratch:

```dart
Stream<int> naturalsTo(int n) async* {
  int k = 0;
  while (k < n) {
    await Future.delayed(const Duration(milliseconds: 500));
    yield k++;
  }
}

// Listen to the stream
await for (var value in naturalsTo(5)) {
  print(value); // 0, 1, 2, 3, 4
}
```

The `async*` function generates a stream. Use `yield` to emit a value and `yield*` to emit all values from another stream.

## Creating a stream using StreamController

A `StreamController` gives you more control over the stream:

```dart
import 'dart:async';

StreamController<String> controller = StreamController<String>();

// Add data to the stream
controller.add('Hello');
controller.add('World');

// Listen to the stream
controller.stream.listen((data) {
  print(data);
});

// Close the stream when done
controller.close();
```

### StreamController with error handling

```dart
var controller = StreamController<int>();

controller.stream.listen(
  (data) => print('Data: $data'),
  onError: (error) => print('Error: $error'),
  onDone: () => print('Done'),
);

controller.add(1);
controller.add(2);
controller.addError('Something went wrong');
controller.add(3);
controller.close();
```

### Broadcast StreamController

By default, streams are single-subscription. Use `broadcast()` for multiple listeners:

```dart
var controller = StreamController<String>.broadcast();

controller.stream.listen((data) => print('Listener 1: $data'));
controller.stream.listen((data) => print('Listener 2: $data'));

controller.add('Hello');
// Both listeners receive the event
controller.close();
```

## Choosing the right approach

| Approach | Use Case |
|----------|----------|
| Transform existing stream | You already have a stream and want to modify its events |
| `async*` function | Creating a stream from scratch with simple logic |
| `StreamController` | Full control over adding events, errors, and closing |
| `StreamTransformer` | Reusable transformations, platform library integrations |

## Important notes

- **Single-subscription streams** can only be listened to once. They hold back events until a listener is present.
- **Broadcast streams** can have multiple listeners. They don't buffer events — if no listener is present when an event is added, the event is lost.
- Always close `StreamController` when done to prevent memory leaks.
- Use `await for` to consume streams sequentially, or `listen()` for more control.
