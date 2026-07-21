# Core Libraries

Dart has a rich set of core libraries that provide essentials for many everyday programming tasks.

## Overview

| Library | Description |
|---------|-------------|
| `dart:core` | Built-in types, collections, and other core functionality. Automatically imported. |
| `dart:async` | Support for asynchronous programming with `Future` and `Stream`. |
| `dart:math` | Mathematical constants and functions, plus a random number generator. |
| `dart:convert` | Encoders and decoders for converting between data representations (JSON, UTF-8). |
| `dart:io` | I/O for programs using the Dart VM (Flutter apps, servers, CLI scripts). |
| `dart:js_interop` | APIs for interop with the web platform. |
| `dart:collection` | Advanced collection classes and utilities. |
| `dart:typed_data` | Efficiently typed arrays of fixed-size numeric data. |
| `dart:isolate` | Isolates for parallel execution. |
| `dart:ffi` | Foreign Function Interface for calling C libraries. |

## dart:core

The `dart:core` library is automatically imported into every Dart program.

### print()

```dart
print('Hello, World!');
print(anObject);
print('I drink $tea.');
```

### Numbers

```dart
// String -> int/double
assert(int.parse('42') == 42);
assert(double.parse('0.50') == 0.5);

// num.parse creates int or double
assert(num.parse('42') is int);
assert(num.parse('0.50') is double);

// With radix
assert(int.parse('42', radix: 16) == 66);

// Convert to string
assert(42.toString() == '42');
assert(123.456.toStringAsFixed(2) == '123.46');
assert(123.456.toStringAsPrecision(2) == '1.2e+2');
```

### Strings

```dart
// Search within strings
var s = 'Never odd or even';

// Check substring
assert(s.contains('odd'));

// Check prefix/suffix
assert(s.startsWith('Never'));
assert(s.endsWith('even'));

// Find position
assert(s.indexOf('odd') == 6);

// Split
var parts = 'progressive,web,app'.split(',');
assert(parts.length == 3);

// Get substring
assert('Never odd or even'.substring(6, 9) == 'odd');
```

### Regular Expressions

```dart
var regExp = RegExp(r'(\w+)');
var text = 'Parse my string.';

// Find first match
var firstMatch = regExp.firstMatch(text);
print(firstMatch?.group(0)); // 'Parse'

// All matches
for (var match in regExp.allMatches(text)) {
  print(match.group(0));
}
```

### Collections

See `collections.md` for detailed coverage of `List`, `Set`, and `Map`.

### DateTime

```dart
var now = DateTime.now();
var birthday = DateTime(1990, 5, 15);
var parsed = DateTime.parse('2024-01-15');

// Duration
var diff = now.difference(birthday);
print(diff.inDays);
```

### Uri

```dart
var uri = Uri.parse('https://example.com/api?query=test');
print(uri.host);      // 'example.com'
print(uri.path);      // '/api'
print(uri.queryParameters['query']); // 'test'
```

## dart:async

Support for asynchronous programming. See `async.md` for detailed coverage.

### Future and Stream

```dart
import 'dart:async';

Future<int> fetchValue() async => 42;

Stream<int> count(int n) async* {
  for (int i = 0; i < n; i++) {
    yield i;
  }
}
```

### Timer

```dart
Timer(Duration(seconds: 3), () => print('Timer fired'));

Timer.periodic(Duration(seconds: 1), (timer) {
  print('Tick ${timer.tick}');
  if (timer.tick >= 5) timer.cancel();
});
```

## dart:math

```dart
import 'dart:math' as math;

// Constants
print(math.pi);    // 3.141592653589793
print(math.e);     // 2.718281828459045

// Functions
assert(math.max(1, 100) == 100);
assert(math.min(1, 100) == 1);
assert(math.sqrt(9) == 3.0);

// Trigonometry
var degrees = 45;
var radians = degrees * (math.pi / 180);
print(math.sin(radians));

// Random
var random = math.Random();
print(random.nextInt(10));      // 0-9
print(random.nextDouble());     // 0.0 - 1.0
print(random.nextBool());       // true or false
```

## dart:convert

### JSON

```dart
import 'dart:convert';

// Encode
var json = jsonEncode({
  'name': 'Alice',
  'age': 30,
});
print(json); // {"name":"Alice","age":30}

// Decode
var decoded = jsonDecode('{"name":"Alice","age":30}');
print(decoded['name']); // Alice
```

### UTF-8

```dart
// Encode string to UTF-8 bytes
var bytes = utf8.encode('Hello');
print(bytes); // [72, 101, 108, 108, 111]

// Decode UTF-8 bytes to string
var string = utf8.decode(bytes);
print(string); // Hello
```

### Base64

```dart
// Encode
var encoded = base64Encode([0, 1, 2, 3]);
print(encoded); // 'AAECAw=='

// Decode
var decoded = base64Decode('AAECAw==');
print(decoded); // [0, 1, 2, 3]
```

### LineSplitter

```dart
var lines = const LineSplitter().convert('Hello\nWorld\nDart');
print(lines); // [Hello, World, Dart]
```

## dart:io

For programs running on the Dart VM (not web):

### Reading and Writing Files

```dart
import 'dart:io';

// Write to file
var file = File('output.txt');
file.writeAsStringSync('Hello, World!');

// Read from file
var contents = file.readAsStringSync();
print(contents);

// Async read
var asyncContents = await file.readAsString();
```

### HTTP Client

```dart
import 'dart:io';

var client = HttpClient();
var request = await client.getUrl(Uri.parse('https://example.com'));
var response = await request.close();
var body = await response.transform(utf8.decoder).join();
print(body);
client.close();
```

### Process

```dart
// Run a process
var result = await Process.run('ls', ['-l']);
print(result.stdout);

// Exit
exit(0);
```

### stdin/stdout/stderr

```dart
stdout.write('Enter your name: ');
var name = stdin.readLineSync();
stdout.writeln('Hello, $name!');
```

## dart:collection

Advanced collection utilities:

```dart
import 'dart:collection';

// Queue
var queue = Queue<int>();
queue.add(1);
queue.add(2);
queue.addFirst(0);
queue.removeFirst();

// LinkedHashMap (maintains insertion order)
var map = LinkedHashMap<String, int>();

// ListQueue (default Queue implementation)
var listQueue = ListQueue<int>();
```

## dart:typed_data

```dart
import 'dart:typed_data';

// Fixed-size typed lists
var bytes = Uint8List(4);
bytes[0] = 255;

var floats = Float32List(3);
floats[0] = 1.5;

var ints = Int64List(2);
ints[0] = 9223372036854775807;
```

## Platform Availability

| Library | Native (VM) | Web |
|---------|-------------|-----|
| `dart:core` | Yes | Yes |
| `dart:async` | Yes | Yes |
| `dart:math` | Yes | Yes |
| `dart:convert` | Yes | Yes |
| `dart:io` | Yes | No |
| `dart:js_interop` | No | Yes |
| `dart:isolate` | Yes | Limited |
| `dart:ffi` | Yes | No |
| `dart:typed_data` | Yes | Yes |
| `dart:collection` | Yes | Yes |
