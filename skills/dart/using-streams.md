# Asynchronous Programming: Using Streams

Learn how to consume single-subscriber and broadcast streams.

## Overview

- Streams provide an asynchronous sequence of data
- Data sequences include user-generated events and data read from files
- You can process a stream using either `await for` or `listen()` from the Stream API
- Streams provide a way to respond to errors
- There are two kinds of streams: single subscription or broadcast

A stream is a sequence of asynchronous events. It is like an asynchronous `Iterable` — where, instead of getting the next event when you ask for it, the stream tells you that there is an event when it is ready.

## Consuming streams with await for

The asynchronous for loop (`await for`) iterates over the events of a stream like a `for` loop iterates over an `Iterable`:

```dart
Future<int> sumStream(Stream<int> stream) async {
  var sum = 0;
  await for (final value in stream) {
    sum += value;
  }
  return sum;
}
```

When the loop body ends, the function is paused until the next event arrives or the stream is done. The function must be marked with `async`.

```dart
Future<int> sumStream(Stream<int> stream) async {
  var sum = 0;
  await for (final value in stream) {
    sum += value;
  }
  return sum;
}

Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    yield i;
  }
}

void main() async {
  var stream = countStream(10);
  var sum = await sumStream(stream);
  print(sum); // 55
}
```

## Consuming streams with listen()

Use `listen()` for more control over stream processing:

```dart
Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    yield i;
  }
}

void main() {
  final subscription = countStream(5).listen(
    (data) => print('Data: $data'),
    onError: (error) => print('Error: $error'),
    onDone: () => print('Done'),
  );

  // You can pause, resume, and cancel
  // subscription.pause();
  // subscription.resume();
  // subscription.cancel();
}
```

## Error handling

Streams can emit errors. Handle them with `await for` using try-catch:

```dart
Future<void> main() async {
  try {
    await for (final event in errorStream) {
      print('Event: $event');
    }
  } catch (e) {
    print('Error: $e');
  }
}
```

Or with `listen()`:

```dart
stream.listen(
  (data) => print('Data: $data'),
  onError: (error) => print('Error: $error'),
  onDone: () => print('Done'),
);
```

## Stream types

### Single-subscription streams

- Can only be listened to once
- Hold back events until a listener is present
- Used for reading files, HTTP requests, etc.

### Broadcast streams

- Can have multiple listeners
- Don't buffer events — if no listener is present, events are lost
- Created with `StreamController.broadcast()` or `stream.asBroadcastStream()`

```dart
var broadcastStream = stream.asBroadcastStream();
broadcastStream.listen((event) => print('Listener 1: $event'));
broadcastStream.listen((event) => print('Listener 2: $event'));
```

## Common Stream methods

| Method | Description |
|--------|-------------|
| `listen()` | Subscribe to the stream |
| `first` / `last` | Get the first/last event as a Future |
| `length` | Get the number of events |
| `isEmpty` | Check if the stream has no events |
| `toList()` | Collect all events into a list |
| `toSet()` | Collect all events into a set |
| `forEach()` | Apply a function to each event |
| `map()` | Transform each event |
| `where()` | Filter events |
| `take()` | Take first N events |
| `skip()` | Skip first N events |
| `distinct()` | Skip duplicate events |
| `timeout()` | Add a timeout |
| `debounce()` | Debounce events (via rxdart) |
