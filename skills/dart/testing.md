# Testing

Software testing helps verify that your app is working correctly before you release it.

## Types of Tests

### Unit Tests

Focus on verifying the smallest piece of testable software, such as a function, method, or class. Your test suites should have more unit tests than other kinds of tests.

### Component Tests

Verify that a component (which usually consists of multiple classes) behaves as expected. Called **widget tests** in Flutter. Often requires mock objects.

### Integration and End-to-End Tests

Verify the behavior of an entire app, or a large chunk of an app. Generally runs on a simulated or real device or browser.

## The test Package

```yaml
# pubspec.yaml
dev_dependencies:
  test: ^1.24.0
```

## Writing Tests

### Basic Test

```dart
import 'package:test/test.dart';

void main() {
  test('String.split() splits on delimiter', () {
    var parts = 'harder,better,faster,stronger'.split(',');
    expect(parts, equals(['harder', 'better', 'faster', 'stronger']));
  });
}
```

### Grouping Tests

```dart
void main() {
  group('String', () {
    test('.split() splits on delimiter', () {
      expect('a,b,c'.split(','), equals(['a', 'b', 'c']));
    });

    test('.trim() removes whitespace', () {
      expect('  hello  '.trim(), equals('hello'));
    });
  });
}
```

### Setup and Teardown

```dart
void main() {
  setUp(() {
    // Runs before each test
    initializeDatabase();
  });

  tearDown(() {
    // Runs after each test
    closeDatabase();
  });

  setUpAll(() {
    // Runs once before all tests
  });

  tearDownAll(() {
    // Runs once after all tests
  });

  test('database is initialized', () {
    expect(isDatabaseReady(), isTrue);
  });
}
```

## Matchers

```dart
test('matchers', () {
  expect(10, greaterThan(5));
  expect(5, lessThanOrEqualTo(5));
  expect('hello', startsWith('h'));
  expect('hello', endsWith('o'));
  expect('hello', contains('ell'));
  expect([1, 2, 3], contains(2));
  expect([1, 2, 3], containsAll([1, 2]));
  expect(5, isA<int>());
  expect(null, isNull);
  expect('hello', isNotNull);
  expect([], isEmpty);
  expect([1, 2], isNotEmpty);
  expect(throwsException, throwsA(isA<Exception>()));
});
```

### Custom Matchers

```dart
class StartsWith extends Matcher {
  final String prefix;
  StartsWith(this.prefix);

  @override
  bool matches(item, Map matchState) =>
      item is String && item.startsWith(prefix);

  @override
  Description describe(Description description) =>
      description.add('starts with "$prefix"');
}

test('custom matcher', () {
  expect('hello world', StartsWith('hello'));
});
```

## Asynchronous Tests

```dart
test('async test', () async {
  var result = await fetchValue();
  expect(result, equals(42));
});

test('future completes', () {
  expect(futureValue(), completion(equals(42)));
});

test('stream emits values', () async {
  var stream = countDown(3);
  await expectLater(stream, emitsInOrder([3, 2, 1]));
});
```

## Mocking

### Using mockito

```yaml
dev_dependencies:
  mockito: ^5.4.0
  build_runner: ^2.4.0
```

```dart
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([Cat])
import 'cat_test.mocks.dart';

class Cat {
  String sound() => 'Meow';
  bool eatFood(String food, {bool? hungry}) => true;
}

void main() {
  late MockCat cat;

  setUp(() {
    cat = MockCat();
  });

  test('mock sound', () {
    when(cat.sound()).thenReturn('Purr');
    expect(cat.sound(), 'Purr');
    verify(cat.sound()).called(1);
  });
}
```

### Using mocktail

```yaml
dev_dependencies:
  mocktail: ^1.0.0
```

```dart
import 'package:mocktail/mocktail.dart';

class Cat {
  String sound() => 'Meow';
}

class MockCat extends Mock implements Cat {}

void main() {
  late MockCat cat;

  setUp(() {
    cat = MockCat();
    when(() => cat.sound()).thenReturn('Purr');
  });

  test('mock sound', () {
    expect(cat.sound(), 'Purr');
    verify(() => cat.sound()).called(1);
  });
}
```

## Running Tests

```bash
# Run all tests
dart test

# Run specific test file
dart test test/cat_test.dart

# Run with name filter
dart test --name "sound"

# Run with tags
dart test --tags "unit"
dart test --exclude-tags "slow"

# Run with coverage
dart test --coverage=coverage

# Run in parallel
dart test -j 4
```

## Test File Convention

- Test files go in the `test/` directory
- Test files end with `_test.dart`
- Each test file should test one thing (one class, one function, etc.)

```
my_package/
├── lib/
│   └── utils.dart
├── test/
│   └── utils_test.dart
```

## Tagging Tests

```dart
void main() {
  group('database', () {
    // ...
  }, tags: 'database');

  test('slow test', () {
    // ...
  }, tags: 'slow');
}
```

```bash
dart test --tags database
dart test --exclude-tags slow
```

## Skipping Tests

```dart
test('skipped test', () {
  // ...
}, skip: 'Not implemented yet');

// Skip entire group
group('future feature', () {
  // ...
}, skip: true);
```

## Flutter Testing

For Flutter apps, use `flutter test`:

```bash
flutter test
flutter test test/widget_test.dart
```

### Widget Tests

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart';

void main() {
  testWidgets('Counter increments', (tester) async {
    await tester.pumpWidget(MyApp());

    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

## Integration Tests

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
```

```dart
import 'package:integration_test/integration_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('app loads', (tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.text('Welcome'), findsOneWidget);
  });
}
```

```bash
flutter test integration_test/
```
