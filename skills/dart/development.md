# Development

Dart supports multiple platforms: native (mobile, desktop, server), web, and WebAssembly.

## Server and Command-Line Apps

### Frameworks

- **Serverpod** — A scalable app server with code generation, auth, real-time, databases, and caching
- **Dart Frog** — A fast, minimalistic backend framework for Dart
- **Shelf** — A lightweight HTTP server middleware system

### Simple HTTP Server (Shelf)

```dart
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;

Response _echoRequest(Request request) {
  return Response.ok('Request for "${request.url}"');
}

void main() async {
  var handler = const Pipeline().addHandler(_echoRequest);
  var server = await io.serve(handler, 'localhost', 8080);
  print('Serving at http://${server.address.host}:${server.port}');
}
```

### Google Cloud

Dart can deploy to Google Cloud Run. Use the `shelf` package for HTTP servers:

```bash
# Build and deploy
dart compile exe bin/server.dart -o server
gcloud run deploy --source . --region us-central1
```

### Cloud Functions for Firebase

Write Cloud Functions using Dart:

```dart
import 'package:firebase_functions/firebase_functions.dart';

void main() {
  FirebaseFunctions.onCall('hello', (request) async {
    return {'message': 'Hello, ${request.data['name']}!'};
  });
}
```

## Web Apps

### JavaScript Compilation

```bash
# Compile to JavaScript
dart compile js -o main.js web/main.dart

# With webdev
webdev build
webdev serve
```

### WebAssembly (Wasm) Compilation

Dart can compile to WebAssembly with Garbage Collection (WasmGC):

```bash
dart compile wasm web/main.dart
```

#### Wasm Restrictions

1. Targets WasmGC — not all browsers supported
2. Output targets JavaScript environments (browsers), not standard Wasm runtimes
3. Only Dart's next-gen JS interop mechanism is supported
4. No `dart:html`, `dart:js` — use `dart:js_interop` and `package:web` instead

#### Wasm-Ready Packages

A package is "wasm-ready" if it doesn't import non-Wasm compliant libraries. Check with the `wasm-ready` filter on [pub.dev](https://pub.dev).

### package:web

The modern way to interact with the browser:

```dart
import 'package:web/web.dart';

void main() {
  document.getElementById('output')?.text = 'Hello from Dart!';
}
```

## JSON Serialization

### Manual Serialization

```dart
class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'] as String,
      age: json['age'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'age': age,
  };
}
```

### Using json_serializable (Code Generation)

```yaml
dependencies:
  json_annotation: ^4.9.0

dev_dependencies:
  build_runner: ^2.4.0
  json_serializable: ^6.8.0
```

```dart
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  String name;
  int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

Generate code:

```bash
dart run build_runner build
dart run build_runner watch  # Watch mode
```

### Using dart_mappable

An alternative to `json_serializable` that doesn't require code generation for basic use cases.

## Native Apps (Flutter)

Flutter uses Dart for building native mobile, desktop, and web apps:

```bash
# Install Flutter (includes Dart SDK)
# Create a Flutter project
flutter create my_app
cd my_app
flutter run
```

## Development Workflow

### Creating a Project

```bash
# Console app
dart create my_app

# With specific template
dart create -t console-full my_app
dart create -t package my_package
dart create -t server-shelf my_server
```

### Running

```bash
dart run bin/main.dart
dart run  # Uses bin/main.dart by default
```

### Compiling

```bash
# AOT snapshot (native executable)
dart compile exe bin/main.dart -o my_app

# JIT snapshot (faster startup, needs Dart VM)
dart compile jit-snapshot bin/main.dart

# Kernel snapshot
dart compile kernel bin/main.dart

# JavaScript
dart compile js web/main.dart -o main.js

# WebAssembly
dart compile wasm web/main.dart
```
