# Persistence

Content covering persistence in Flutter apps.

## SharedPreferences

Key-value storage for simple data:

```yaml
dependencies:
  shared_preferences: ^2.2.0
```

```dart
import 'package:shared_preferences/shared_preferences.dart';

// Write
final prefs = await SharedPreferences.getInstance();
await prefs.setString('token', 'abc123');
await prefs.setInt('count', 42);
await prefs.setBool('isLoggedIn', true);
await prefs.setDouble('score', 95.5);
await prefs.setStringList('items', ['a', 'b', 'c']);

// Read
final token = prefs.getString('token');
final count = prefs.getInt('count') ?? 0;
final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;

// Remove
await prefs.remove('token');
await prefs.clear();
```

## SQLite with sqflite

Relational database for structured data:

```yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.9.0
```

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

Future<Database> openDB() async {
  return openDatabase(
    join(await getDatabasesPath(), 'app.db'),
    onCreate: (db, version) {
      return db.execute(
        'CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, value REAL)',
      );
    },
    version: 1,
  );
}

// Insert
await db.insert('items', {'name': 'Item 1', 'value': 9.99});

// Query
final items = await db.query('items');

// Update
await db.update('items', {'name': 'Updated'}, where: 'id = ?', whereArgs: [1]);

// Delete
await db.delete('items', where: 'id = ?', whereArgs: [1]);
```

## Drift (type-safe SQLite)

Type-safe SQLite with code generation:

```yaml
dependencies:
  drift: ^2.16.0
  sqlite3_flutter_libs: ^0.5.0
dev_dependencies:
  drift_dev: ^2.16.0
  build_runner: ^2.4.0
```

```dart
import 'package:drift/drift.dart';

@DriftDatabase(tables: [Items])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  Future<List<Item>> getItems() => select(items).get();
  Future<int> addItem(ItemsCompanion entry) => into(items).insert(entry);
}
```

## Hive (NoSQL)

Fast key-value and object store:

```yaml
dependencies:
  hive: ^2.2.0
  hive_flutter: ^1.1.0
dev_dependencies:
  hive_generator: ^2.0.0
  build_runner: ^2.4.0
```

```dart
import 'package:hive_flutter/hive_flutter.dart';

@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0) String name;
  @HiveField(1) int age;
}

// Initialize
await Hive.initFlutter();
Hive.registerAdapter(UserAdapter());
await Hive.openBox('users');

// Write
final box = Hive.box('users');
await box.put('user1', User()..name = 'John'..age = 30);

// Read
final user = box.get('user1') as User?;
```

## File storage

Store data in files:

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

Future<void> writeFile(String data) async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File('${dir.path}/data.txt');
  await file.writeAsString(data);
}

Future<String> readFile() async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File('${dir.path}/data.txt');
  return await file.readAsString();
}
```

## path_provider

Get platform-specific file paths:

| Method | Path |
|--------|------|
| `getApplicationDocumentsDirectory()` | App documents |
| `getApplicationSupportDirectory()` | App support |
| `getTemporaryDirectory()` | Cache |
| `getExternalStorageDirectory()` | External storage (Android) |
| `getLibraryDirectory()` | Library (iOS/macOS) |
| `getDownloadsDirectory()` | Downloads (desktop) |

## Choosing a persistence solution

| Solution | Type | Best for |
|----------|------|----------|
| `shared_preferences` | Key-value | Settings, flags, tokens |
| `hive` | NoSQL | Fast local object storage |
| `sqflite` | SQLite | Relational data, complex queries |
| `drift` | SQLite (type-safe) | Type-safe relational data |
| File I/O | Files | Documents, media, large data |
| `cloud_firestore` | Cloud NoSQL | Synced data across devices |
| `isar` | NoSQL | High-performance local DB |

## Best practices

1. Use `SharedPreferences` for simple key-value data
2. Use `Hive` for fast NoSQL local storage
3. Use `drift` for type-safe SQLite
4. Use `path_provider` for platform-correct file paths
5. Encrypt sensitive data before storing
6. Handle migration when schema changes
7. Don't store large data in `SharedPreferences`
8. Use `cloud_firestore` for data that needs to sync
