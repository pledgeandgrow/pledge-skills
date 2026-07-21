# Serialization

Content covering serialization in Flutter apps.

## Manual JSON serialization

Use `dart:convert` for simple cases:

```dart
import 'dart:convert';

class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(name: json['name'] as String, age: json['age'] as int);
  }

  Map<String, dynamic> toJson() => {'name': name, 'age': age};
}

// Deserialize
final json = jsonDecode(response.body) as Map<String, dynamic>;
final user = User.fromJson(json);

// Serialize
final jsonStr = jsonEncode(user.toJson());
```

## json_serializable (code generation)

For complex models, use code generation:

```yaml
dependencies:
  json_annotation: ^4.8.0
dev_dependencies:
  json_serializable: ^6.7.0
  build_runner: ^2.4.0
```

### Model definition

```dart
import 'package:json_annotation/json_annotation.dart';
part 'user.g.dart';

@JsonSerializable()
class User {
  final String name;
  final int age;
  @JsonKey(name: 'created_at') DateTime createdAt;
  @JsonKey(defaultValue: false) bool isActive;
  @JsonKey(includeIfNull: false) String? nickname;

  User({
    required this.name,
    required this.age,
    required this.createdAt,
    this.isActive = false,
    this.nickname,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

### Generate code

```bash
dart run build_runner build --delete-conflicting-outputs

# Watch mode
dart run build_runner watch
```

### JsonKey options

| Option | Description |
|--------|-------------|
| `name` | Custom JSON key name |
| `defaultValue` | Default value if null |
| `includeIfNull` | Include null fields in JSON |
| `required` | Field is required |
| `fromJson` | Custom deserialization function |
| `toJson` | Custom serialization function |

## Nested objects

```dart
@JsonSerializable()
class Order {
  final String id;
  final User user;  // Nested object
  final List<Item> items;  // List of nested objects

  Order({required this.id, required this.user, required this.items});

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);
}
```

## freezed (immutable models)

For immutable models with union types:

```yaml
dependencies:
  freezed_annotation: ^2.4.0
dev_dependencies:
  freezed: ^2.5.0
```

```dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String name,
    required int age,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

## Enum serialization

```dart
enum Status {
  @JsonValue('pending') pending,
  @JsonValue('active') active,
  @JsonValue('completed') completed,
}
```

## Generic serialization

```dart
@Serializable()
class ApiResponse<T> {
  final T data;
  final String status;
}
```

## Best practices

1. Use `json_serializable` for models with more than 3-4 fields
2. Use `freezed` for immutable models with union types
3. Always handle null safety in `fromJson`
4. Use `@JsonKey` for custom field names
5. Run `build_runner` after model changes
6. Keep models simple and focused
7. Consider `@JsonSerializable(fieldRename: FieldRename.snake)` for snake_case APIs
