# Data & Backend

Content covering data and backend development in Flutter apps.

## Networking

### HTTP package

```yaml
dependencies:
  http: ^1.2.0
```

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> fetchData() async {
  final response = await http.get(Uri.parse('https://api.example.com/data'));

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}
```

### dio package

For more advanced HTTP features (interceptors, cancellation, etc.):

```yaml
dependencies:
  dio: ^5.4.0
```

```dart
final dio = Dio();
final response = await dio.get('https://api.example.com/data');
```

### Using with FutureBuilder

```dart
FutureBuilder<Map<String, dynamic>>(
  future: fetchData(),
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return Text(snapshot.data!['title']);
    } else if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    return const CircularProgressIndicator();
  },
)
```

## Google APIs

Use Google API packages from pub.dev:

- `googleapis` — Google API client library
- `google_sign_in` — Google authentication
- `firebase_core` — Firebase initialization
- `cloud_firestore` — Firestore database
- `firebase_auth` — Firebase authentication
- `firebase_storage` — Firebase storage
- `firebase_messaging` — Push notifications

## Serialization

### JSON serialization with dart:convert

```dart
import 'dart:convert';

// Encode
final json = jsonEncode({'name': 'John', 'age': 30});

// Decode
final data = jsonDecode('{"name": "John", "age": 30}') as Map<String, dynamic>;
```

### json_serializable (code generation)

```yaml
dependencies:
  json_annotation: ^4.8.0
dev_dependencies:
  json_serializable: ^6.7.0
  build_runner: ^2.4.0
```

```dart
import 'package:json_annotation/json_annotation.dart';
part 'user.g.dart';

@JsonSerializable()
class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

Generate code:

```bash
dart run build_runner build --delete-conflicting-outputs
```

## Firebase

### Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add `firebase_core` and configure platform-specific settings
3. Initialize Firebase:

```dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}
```

### Firestore

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

// Add data
await FirebaseFirestore.instance.collection('users').add({
  'name': 'John',
  'age': 30,
});

// Read data (one-time)
final snapshot = await FirebaseFirestore.instance.collection('users').get();
for (var doc in snapshot.docs) {
  print(doc.data());
}

// Stream data (real-time)
StreamBuilder<QuerySnapshot>(
  stream: FirebaseFirestore.instance.collection('users').snapshots(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) return const CircularProgressIndicator();
    return ListView(
      children: snapshot.data!.docs.map((doc) => Text(doc['name'])).toList(),
    );
  },
)
```

### Firebase Auth

```dart
import 'package:firebase_auth/firebase_auth.dart';

// Sign in
final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password',
);

// Sign up
await FirebaseAuth.instance.createUserWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password',
);

// Listen to auth state
StreamBuilder<User?>(
  stream: FirebaseAuth.instance.authStateChanges(),
  builder: (context, snapshot) {
    if (snapshot.hasData) return const HomeScreen();
    return const LoginScreen();
  },
)
```

## Persistence

### SharedPreferences (key-value storage)

```yaml
dependencies:
  shared_preferences: ^2.2.0
```

```dart
final prefs = await SharedPreferences.getInstance();
await prefs.setString('token', 'abc123');
final token = prefs.getString('token');
```

### SQLite (sqflite)

```yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.9.0
```

```dart
final db = await openDatabase(
  join(await getDatabasesPath(), 'app.db'),
  onCreate: (db, version) {
    return db.execute('CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT)');
  },
  version: 1,
);

await db.insert('items', {'name': 'Item 1'});
final items = await db.query('items');
```

### Hive (NoSQL)

```yaml
dependencies:
  hive: ^2.2.0
  hive_flutter: ^1.1.0
```

### Drift (type-safe SQLite)

```yaml
dependencies:
  drift: ^2.16.0
  sqlite3_flutter_libs: ^0.5.0
```

### File storage

```dart
import 'dart:io';
import 'path_provider/path_provider.dart';

final dir = await getApplicationDocumentsDirectory();
final file = File('${dir.path}/data.txt');
await file.writeAsString('Hello');
final content = await file.readAsString();
```

## Choosing a persistence solution

| Solution | Type | Best for |
|----------|------|----------|
| `shared_preferences` | Key-value | Simple settings, flags |
| `hive` | NoSQL | Fast local storage |
| `sqflite` / `drift` | SQLite | Relational data |
| `cloud_firestore` | Cloud NoSQL | Synced data |
| File I/O | Files | Documents, media |
| `path_provider` | File paths | Getting storage locations |
