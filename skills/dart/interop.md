# Interoperability

Dart provides several interop mechanisms for calling code written in other languages.

## C Interop (dart:ffi)

Dart mobile, command-line, and server apps running on the Dart Native platform can use `dart:ffi` to call native C APIs, and to read, write, allocate, and deallocate native memory.

FFI stands for **foreign function interface**.

### Basic Example

```dart
import 'dart:ffi';
import 'dart:io' show Platform;

// Load a dynamic library
final DynamicLibrary lib = Platform.isWindows
    ? DynamicLibrary.open('hello.dll')
    : Platform.isMacOS
        ? DynamicLibrary.open('libhello.dylib')
        : DynamicLibrary.open('libhello.so');

// Look up a function
typedef HelloWorldC = Void Function();
typedef HelloWorldDart = void Function();

final helloWorld = lib.lookupFunction<HelloWorldC, HelloWorldDart>('hello_world');

void main() {
  helloWorld();
}
```

### Working with Structs

```dart
// C struct: struct Point { int x; int y; }
final class Point extends Struct {
  @Int32()
  external int x;

  @Int32()
  external int y;
}

// Use in FFI call
typedef DistanceC = Double Function(Pointer<Point>);
typedef DistanceDart = double Function(Pointer<Point>);

final distance = lib.lookupFunction<DistanceC, DistanceDart>('distance');
```

### Memory Management

```dart
// Allocate native memory
final pointer = calloc.allocate<Int32>(sizeOf<Int32>());
pointer.value = 42;
print(pointer.value);
calloc.free(pointer);
```

### Using package:ffigen

Generate FFI bindings from C headers:

```yaml
# pubspec.yaml
dev_dependencies:
  ffigen: ^11.0.0
```

```yaml
# ffigen.yaml
output: 'lib/generated_bindings.dart'
headers:
  entry-points:
    - 'hello.h'
```

```bash
dart run ffigen
```

### FFI Use Cases

- Calling C libraries (SQLite, libcurl, etc.)
- Accessing system APIs
- High-performance computing
- Game engine integration

## JavaScript Interop (dart:js_interop)

Seamlessly integrate JavaScript libraries and APIs into Dart web apps.

### Getting Started

```dart
import 'dart:js_interop';

// Call a global JS function
@JS('Math.random')
external double random();

void main() {
  print(random());
}
```

### JS Types

```dart
@JS()
library my_interop;

@JS('console')
external void log(String message);

@JS()
class HTMLElement {
  external String get id;
  external set id(String value);
  external void appendChild(HTMLElement child);
}
```

### Using package:web

The modern replacement for `dart:html`:

```dart
import 'package:web/web.dart' as web;

void main() {
  final button = web.document.getElementById('myButton');
  button?.addEventListener('click', (web.Event e) {
    print('Button clicked!');
  }.toJS);
}
```

### JS Interop with Wasm

`dart:js_interop` is the only interop mechanism supported when compiling to WebAssembly. Use it instead of `dart:html`, `dart:js`, or `package:js`.

### Converting Between Dart and JS

```dart
import 'dart:js_interop';

// Dart to JS
var dartList = [1, 2, 3];
var jsArray = dartList.toJS;

// JS to Dart
var back = jsArray.toDart;
```

### Extension Types for JS Interop

```dart
extension type MyJSObject._(JSObject _) implements JSObject {
  external MyJSObject(String name);
  external String get name;
  external void doSomething();
}
```

## Objective-C and Swift Interop

Dart supports calling Objective-C and Swift code on iOS and macOS using `dart:ffi` with platform-specific bindings:

```yaml
dev_dependencies:
  ffigen: ^11.0.0
```

Configure `ffigen` for Objective-C:

```yaml
ffigen:
  output: 'lib/objc_bindings.dart'
  language: objc
  headers:
    entry-points:
      - 'MyFramework/MyClass.h'
```

## Java and Kotlin Interop

Dart supports calling Java and Kotlin code on Android using `jni` package:

```yaml
dependencies:
  jni: ^0.14.0
```

```dart
import 'package:jni/jni.dart';

void main() {
  // Access Java classes
  final system = JSystem.out;
  system.println('Hello from Dart!'.toJString());
}
```

## Interop Summary

| Platform | Language | Mechanism | Library |
|----------|----------|-----------|---------|
| Native (all) | C | FFI | `dart:ffi` |
| iOS/macOS | Objective-C/Swift | FFI + ffigen | `dart:ffi`, `ffigen` |
| Android | Java/Kotlin | JNI | `package:jni` |
| Web | JavaScript | JS Interop | `dart:js_interop`, `package:web` |
| Web (Wasm) | JavaScript | JS Interop only | `dart:js_interop` |

## Migrating from Legacy JS Interop

If you're using older JS interop libraries (`dart:html`, `dart:js`, `package:js`), migrate to `dart:js_interop` and `package:web`:

1. Replace `dart:html` imports with `package:web`
2. Replace `package:js` annotations with `dart:js_interop`
3. Use `external` for JS function declarations
4. Use `.toJS` and `.toDart` for conversions
