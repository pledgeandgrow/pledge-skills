# State Management

Content covering state management in Flutter apps.

## What is state management?

State management is the process of tracking and updating the data that a UI needs to render. As apps grow, managing state becomes more complex. Flutter provides several approaches and recommends specific patterns.

## Ephemeral vs app state

- **Ephemeral state** (local/UI state): State contained within a single widget, like `TextEditingController` or `AnimationController`. Use `setState()`.
- **App state** (shared state): State shared across multiple widgets/screens, like user data, cart, preferences. Use a state management solution.

## setState()

For simple, local state:

```dart
class _MyWidgetState extends State<MyWidget> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _count++),
      child: Text('Count: $_count'),
    );
  }
}
```

## Provider (recommended)

The `provider` package is the recommended approach for most apps:

```yaml
dependencies:
  provider: ^6.1.0
```

### ChangeNotifier

```dart
class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}
```

### Providing state

```dart
ChangeNotifierProvider(
  create: (context) => CounterModel(),
  child: MyApp(),
)
```

### Consuming state

```dart
// Using context
final counter = context.watch<CounterModel>();
Text('${counter.count}');

// Using Consumer
Consumer<CounterModel>(
  builder: (context, counter, child) {
    return Text('${counter.count}');
  },
)

// Using Selector (for granular rebuilds)
Selector<CounterModel, int>(
  selector: (context, model) => model.count,
  builder: (context, count, child) {
    return Text('$count');
  },
)

// Using context.read (for actions, no rebuild)
context.read<CounterModel>().increment();
```

### Multi-provider

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => UserModel()),
    ChangeNotifierProvider(create: (_) => CartModel()),
    Provider(create: (_) => ApiService()),
  ],
  child: MyApp(),
)
```

## Riverpod

Riverpod is a compile-safe, type-safe alternative to Provider:

```yaml
dependencies:
  flutter_riverpod: ^2.5.0
```

### Providers

```dart
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);
  void increment() => state++;
}
```

### Consuming

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return ElevatedButton(
      onPressed: ref.read(counterProvider.notifier).increment,
      child: Text('$count'),
    );
  }
}
```

## Bloc / Cubit

Event-driven state management:

```yaml
dependencies:
  flutter_bloc: ^8.1.0
```

### Cubit (simplified)

```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);
  void increment() => emit(state + 1);
}
```

### Bloc

```dart
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<Increment>((event, emit) => emit(state + 1));
    on<Decrement>((event, emit) => emit(state - 1));
  }
}
```

### Using BlocBuilder

```dart
BlocBuilder<CounterBloc, int>(
  builder: (context, count) {
    return Text('$count');
  },
)
```

## ValueNotifier

For simple reactive values without external packages:

```dart
class CounterNotifier extends ValueNotifier<int> {
  CounterNotifier() : super(0);
  void increment() => value++;
}

// Usage
ValueListenableBuilder<int>(
  valueListenable: counterNotifier,
  builder: (context, count, child) {
    return Text('$count');
  },
)
```

## InheritedWidget / InheritedNotifier

The low-level building blocks. `Provider` and others build on top of these:

```dart
class MyInheritedWidget extends InheritedWidget {
  final int count;
  const MyInheritedWidget({super.key, required this.count, required super.child});

  static MyInheritedWidget? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<MyInheritedWidget>();
  }

  @override
  bool updateShouldNotify(MyInheritedWidget oldWidget) => count != oldWidget.count;
}
```

## Choosing a state management solution

| Solution | Complexity | Best for |
|----------|-----------|----------|
| `setState()` | Low | Simple local state |
| `ValueNotifier` | Low | Simple shared state |
| `Provider` | Medium | Most apps (recommended) |
| `Riverpod` | Medium | Type-safe, compile-safe apps |
| `Bloc` / `Cubit` | High | Complex event-driven apps |
| `GetX` | Medium | Rapid prototyping |

## Best practices

1. Start simple with `setState()`, add complexity only when needed
2. Separate business logic from UI
3. Use immutable state where possible
4. Keep state as local as possible
5. Use `Selector` or granular providers to minimize rebuilds
6. Test your state management logic separately from UI
7. Consider the Flutter team's recommended architecture (MVVM) — see [app-architecture.md](app-architecture.md)
