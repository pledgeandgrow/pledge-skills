# Concurrency

Concurrent programming in Dart refers to both asynchronous APIs, like `Future` and `Stream`, and isolates, which allow you to move processes to separate cores.

All Dart code runs in isolates, starting in the default main isolate, and optionally expanding to whatever subsequent isolates you explicitly create.

## The Event Loop

Dart's runtime model is based on an event loop. The event loop is responsible for executing your program's code, collecting and processing events:

```
while (eventQueue.waitForEvent()) {
  eventQueue.processNextEvent();
}
```

Events can be anything from requests to repaint the UI, to user taps and keystrokes, to I/O from the disk. The event loop processes events in the order they're queued, one at a time.

## Asynchronous APIs

### Future

A `Future` represents a value that will be available at some point in the future:

```dart
Future<String> fetchUserData() async {
  // Simulate network request
  await Future.delayed(Duration(seconds: 2));
  return 'User data';
}

void main() async {
  var data = await fetchUserData();
  print(data);
}
```

### Stream

A `Stream` is a sequence of asynchronous events:

```dart
Stream<int> countDown(int from) async* {
  while (from > 0) {
    await Future.delayed(Duration(seconds: 1));
    yield from--;
  }
}

void main() async {
  await for (final count in countDown(5)) {
    print(count);
  }
}
```

## Isolates

Isolates are Dart's model for parallel execution. Each isolate:
- Has its own memory heap
- Has its own event loop
- Cannot share memory with other isolates
- Communicates via message passing

### When to Use Isolates

- Parsing and decoding exceptionally large JSON blobs
- Processing and compressing photos, audio, and video
- Converting audio and video files
- Complex searching and filtering on large lists
- Performing I/O, such as communicating with a database
- Handling a large volume of network requests

### Isolate.run()

`Isolate.run()` simplifies running code in a separate isolate:

```dart
void main() async {
  final result = await Isolate.run(() {
    // This runs in a separate isolate
    return _heavyComputation();
  });
  print(result);
}

int _heavyComputation() {
  int sum = 0;
  for (int i = 0; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}
```

`Isolate.run()`:
1. Spawns an isolate
2. Runs a function on the spawned isolate
3. Captures the result
4. Returns the result to the main isolate
5. Terminates the isolate once work is complete
6. Checks, captures, and throws exceptions back to the main isolate

### Isolate.spawn()

For more control, use `Isolate.spawn()`:

```dart
void worker(SendPort sendPort) {
  sendPort.send('Hello from worker!');
}

void main() async {
  final receivePort = ReceivePort();
  await Isolate.spawn(worker, receivePort.sendPort);

  receivePort.listen((message) {
    print('Received: $message');
    receivePort.close();
  });
}
```

### ReceivePort and SendPort

- **`ReceivePort`** — A stream that receives messages from other isolates
- **`SendPort`** — A handle that can be passed to other isolates to send messages back

```dart
void main() async {
  final receivePort = ReceivePort();
  final isolate = await Isolate.spawn(
    _worker,
    receivePort.sendPort,
  );

  receivePort.listen((message) {
    print('Main received: $message');
  });
}

void _worker(SendPort sendPort) {
  sendPort.send('Hello from worker');
}
```

### Bidirectional Communication

```dart
void _worker(SendPort mainSendPort) {
  final workerReceivePort = ReceivePort();
  mainSendPort.send(workerReceivePort.sendPort);

  workerReceivePort.listen((message) {
    mainSendPort.send('Processed: $message');
  });
}
```

## Concurrency on the Web

Flutter web and Dart web apps don't support multiple isolates in the same way as native platforms. Web workers provide a similar but separate mechanism. `Isolate.run()` is not supported on Flutter web.

## Zones

Zones provide a way to intercept and customize behavior for async code:

```dart
void main() {
  runZoned(() {
    // All async code in this zone will use the zone's error handler
    Future.error('Something went wrong');
  }, onError: (error, stack) {
    print('Caught: $error');
  });
}
```

## Scheduling

Dart provides several scheduling functions:

```dart
// Schedule a microtask (runs before next event)
scheduleMicrotask(() => print('Microtask'));

// Schedule a task on the event queue
Future(() => print('Event task'));
```

Microtasks always run before event queue tasks.
