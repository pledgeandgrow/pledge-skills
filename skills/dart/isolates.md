# Isolates

Information on writing isolates in Dart.

## When to use isolates

You should use isolates whenever your application is handling computations that are large enough to temporarily block other computations. The most common example is in Flutter applications, when you need to perform large computations that might otherwise cause the UI to become unresponsive.

Situations where isolates are useful:

- Parsing and decoding exceptionally large JSON blobs
- Processing and compressing photos, audio and video
- Converting audio and video files
- Performing complex searching and filtering on large lists or within file systems
- Performing I/O, such as communicating with a database
- Handling a large volume of network requests

## Isolate.run()

`Isolate.run()` simplifies the steps behind setting up and managing worker isolates:

1. Spawns (starts and creates) an isolate
2. Runs a function on the spawned isolate
3. Captures the result
4. Returns the result to the main isolate
5. Terminates the isolate once work is complete
6. Checks, captures, and throws exceptions and errors back to the main isolate

### Basic usage

```dart
const String filename = 'with_keys.json';

void main() async {
  // Read some data.
  final jsonData = await Isolate.run(_readAndParseJson);

  // Use that data.
  print('Number of JSON keys: ${jsonData.length}');
}

Future<Map<String, dynamic>> _readAndParseJson() async {
  final fileData = await File(filename).readAsString();
  final jsonData = jsonDecode(fileData) as Map<String, dynamic>;
  return jsonData;
}
```

The worker isolate transfers the memory holding the result to the main isolate. It does not copy the data. The worker isolate performs a verification pass to ensure the objects are allowed to be transferred.

The result of `Isolate.run()` is always a `Future`, because code in the main isolate continues to run. Whether the computation is synchronous or asynchronous doesn't impact the main isolate, because it's running concurrently either way.

If you're using Flutter, you can use Flutter's `compute` function instead of `Isolate.run()`.

## Isolate.spawn()

For more complex isolate management, use `Isolate.spawn()`:

```dart
import 'dart:isolate';

void main() async {
  final receivePort = ReceivePort();

  await Isolate.spawn(_isolateEntry, receivePort.sendPort);

  // Wait for the isolate to send a message back
  final message = await receivePort.first;
  print('Received: $message');
}

void _isolateEntry(SendPort sendPort) {
  sendPort.send('Hello from isolate!');
}
```

## ReceivePort and SendPort

`ReceivePort` and `SendPort` enable bidirectional communication between isolates:

```dart
import 'dart:isolate';

void main() async {
  final receivePort = ReceivePort();

  await Isolate.spawn(_worker, receivePort.sendPort);

  // Send a message to the worker
  final sendPort = await receivePort.first as SendPort;
  final responsePort = ReceivePort();
  sendPort.send(['Hello', responsePort.sendPort]);

  // Receive the response
  final response = await responsePort.first;
  print('Response: $response');
}

void _worker(SendPort mainSendPort) {
  final port = ReceivePort();
  mainSendPort.send(port.sendPort);

  for (final message in port) {
    if (message is List) {
      final data = message[0] as String;
      final replyTo = message[1] as SendPort;
      replyTo.send('Processed: $data');
    }
  }
}
```

## Concurrency on the web

Multiple isolates are not supported by Flutter web. For web targets, use `Future` and `Stream`-based concurrency instead. See the [Concurrency](https://dart.dev/language/concurrency) page for more details.

## Best practices

- Use `Isolate.run()` for simple one-shot computations
- Use `Isolate.spawn()` when you need ongoing communication
- Always close `ReceivePort` when done to prevent memory leaks
- Isolates don't share memory — all data is transferred, not shared
- Only transferable objects can be sent between isolates
