# Testing & Debugging

Content covering testing and debugging Flutter apps.

## Testing overview

Flutter supports three types of tests:

1. **Unit tests** — Test individual functions, classes, or logic
2. **Widget tests** — Test individual widgets in isolation
3. **Integration tests** — Test the full app on a real device or emulator

## Unit tests

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mocktail: ^1.0.0
```

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Calculator', () {
    test('adds two numbers', () {
      expect(add(2, 3), 5);
    });

    test('handles negative numbers', () {
      expect(add(-1, -1), -2);
    });
  });
}

int add(int a, int b) => a + b;
```

### Mocking with mocktail

```dart
import 'package:mocktail/mocktail.dart';

class MockRepository extends Mock implements ItemRepository {}

void main() {
  late MockRepository mockRepo;
  late HomeViewModel viewModel;

  setUp(() {
    mockRepo = MockRepository();
    viewModel = HomeViewModel(mockRepo);
    registerFallbackValue(Item(name: 'fallback'));
  });

  test('loadItems fetches from repository', () async {
    when(() => mockRepo.getItems()).thenAnswer((_) async => [Item(name: 'Test')]);
    await viewModel.loadItems();
    expect(viewModel.items, hasLength(1));
    verify(() => mockRepo.getItems()).called(1);
  });
}
```

## Widget tests

```dart
testWidgets('Counter increments smoke test', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: CounterWidget()));

  expect(find.text('Count: 0'), findsOneWidget);
  expect(find.text('Count: 1'), findsNothing);

  await tester.tap(find.byType(ElevatedButton));
  await tester.pump();

  expect(find.text('Count: 0'), findsNothing);
  expect(find.text('Count: 1'), findsOneWidget);
});
```

### Common widget test matchers

```dart
expect(find.text('Hello'), findsOneWidget);
expect(find.text('Hello'), findsNWidgets(2));
expect(find.text('Hello'), findsNothing);
expect(find.byType(Text), findsWidgets);
expect(find.byIcon(Icons.star), findsOneWidget);
expect(find.byKey(const Key('my-key')), findsOneWidget);
expect(find.textContaining('Hello'), findsOneWidget);
```

### Pumping and settling

```dart
await tester.pump();          // Trigger one frame
await tester.pumpAndSettle(); // Pump until no more frames scheduled
await tester.pump(Duration(milliseconds: 300));  // Pump specific duration
```

### Testing async widgets

```dart
testWidgets('FutureBuilder displays data', (tester) async {
  await tester.pumpWidget(MaterialApp(home: MyWidget()));
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
  await tester.pumpAndSettle();
  expect(find.text('Loaded data'), findsOneWidget);
});
```

## Integration tests

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
```

```dart
import 'package:integration_test/integration_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App loads and navigates', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsOneWidget);

    await tester.tap(find.text('Details'));
    await tester.pumpAndSettle();

    expect(find.text('Detail Page'), findsOneWidget);
  });
}
```

### Running integration tests

```bash
# On a device/emulator
flutter test integration_test/app_test.dart

# On a specific device
flutter test integration_test/app_test.dart -d <device_id>
```

## Build modes

| Mode | Command | Use case |
|------|---------|----------|
| Debug | `flutter run` | Development, hot reload |
| Profile | `flutter run --profile` | Performance profiling |
| Release | `flutter run --release` | Production testing |

## Debugging

### DevTools

Launch DevTools:

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

Or use the embedded DevTools in VS Code / Android Studio.

DevTools features:
- **Inspector** — Widget tree inspector
- **Performance** — Frame rendering timeline
- **Memory** — Memory profiling
- **Network** — Network traffic
- **Logging** — Console logs
- **CPU Profiler** — CPU sampling

### Debugging from code

```dart
import 'dart:developer' as developer;

// Log with level
developer.log('Debug message', name: 'my.app.category');

// Breakpoint
debugger();  // Pauses execution in debugger

// Print
debugPrint('Detailed debug info');
```

### Flutter inspector

```dart
// Enable inspector
debugPaintSizeEnabled = true;
debugPaintBaselinesEnabled = true;
debugPaintPointersEnabled = true;
debugPaintLayerBordersEnabled = true;
debugRepaintRainbowEnabled = true;
```

### Common Flutter errors

- **RenderFlex overflow** — A Row/Column child overflows. Use `Expanded` or `SingleChildScrollView`.
- **setState() called after dispose()** — Check `mounted` before calling `setState()`.
- **Build called during build** — Don't call `setState()` in `build()`.
- **Looking up a deactivated widget's ancestor** — Use `if (!context.mounted) return;` after async gaps.
- **"!dirty" is not a valid value** — Usually a typo in a widget property.

### Handling errors

```dart
void main() {
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    // Send to error reporting service
  };

  runZonedGuarded(() {
    runApp(MyApp());
  }, (error, stack) {
    // Handle async errors
  });
}
```

## Testing plugins

Test plugins using platform channel mocking:

```dart
TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
    .setMockMethodCallHandler(channel, (call) async {
  if (call.method == 'getBatteryLevel') {
    return 80;
  }
  return null;
});
```

## Best practices

1. Write tests alongside features, not after
2. Aim for high coverage on business logic
3. Use mocktail for mocking dependencies
4. Test edge cases and error states
5. Run `flutter test` in CI
6. Use integration tests for critical user flows
7. Test on multiple platforms
8. Use `flutter analyze` for static analysis
9. Profile with DevTools before release
10. Set up error reporting in production
