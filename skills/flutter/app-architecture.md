# Architecting Flutter Apps

Learn how to structure Flutter apps for maintainability, scalability, and testability.

## Why architecture matters

Good app architecture provides:
- **Maintainability** — Easier to modify, update, and fix issues
- **Scalability** — More developers can contribute with minimal conflicts
- **Testability** — Simpler classes with well-defined inputs/outputs
- **Lower cognitive load** — New developers become productive faster
- **Better user experience** — Features ship faster with fewer bugs

## Common architectural principles

1. **Separation of concerns** — UI, business logic, and data access are separate
2. **Single responsibility** — Each class has one reason to change
3. **Dependency inversion** — Depend on abstractions, not concretions
4. **Unidirectional data flow** — Data flows in one direction, making it predictable
5. **Immutability** — Immutable state is easier to reason about

## Flutter team's recommended architecture

The Flutter team recommends an **MVVM (Model-View-ViewModel)** architecture:

```
┌──────────────────────────────────────────────────┐
│                     View (UI)                     │
│  Widgets, StatefulWidget, StatelessWidget         │
├──────────────────────────────────────────────────┤
│                  ViewModel                        │
│  Business logic, state management (ChangeNotifier)│
├──────────────────────────────────────────────────┤
│                  Repository                       │
│  Data access, API calls, caching                  │
├──────────────────────────────────────────────────┤
│                  Services                         │
│  HTTP client, database, auth, etc.                │
└──────────────────────────────────────────────────┘
```

### View layer

The View layer consists of widgets. It observes the ViewModel and rebuilds when state changes:

```dart
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final viewModel = context.watch<HomeViewModel>();
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: ListView.builder(
        itemCount: viewModel.items.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(viewModel.items[index].name),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: viewModel.addItem,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### ViewModel layer

The ViewModel contains business logic and state. It extends `ChangeNotifier`:

```dart
class HomeViewModel extends ChangeNotifier {
  final Repository _repository;

  HomeViewModel(this._repository);

  List<Item> _items = [];
  List<Item> get items => _items;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<void> loadItems() async {
    _isLoading = true;
    notifyListeners();
    _items = await _repository.getItems();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addItem() async {
    final item = Item(name: 'New Item');
    await _repository.addItem(item);
    _items.add(item);
    notifyListeners();
  }
}
```

### Repository layer

The Repository abstracts data sources:

```dart
abstract class ItemRepository {
  Future<List<Item>> getItems();
  Future<void> addItem(Item item);
}

class ItemRepositoryImpl implements ItemRepository {
  final ApiClient _apiClient;

  ItemRepositoryImpl(this._apiClient);

  @override
  Future<List<Item>> getItems() async {
    final json = await _apiClient.get('/items');
    return json.map((e) => Item.fromJson(e)).toList();
  }

  @override
  Future<void> addItem(Item item) async {
    await _apiClient.post('/items', item.toJson());
  }
}
```

## Dependency injection

### Manual DI with Provider

```dart
MultiProvider(
  providers: [
    Provider<ApiClient>(create: (_) => ApiClient()),
    ProxyProvider<ApiClient, ItemRepository>(
      create: (_) => throw UnimplementedError(),
      update: (_, apiClient, __) => ItemRepositoryImpl(apiClient),
    ),
    ChangeNotifierProxyProvider<ItemRepository, HomeViewModel>(
      create: (_) => throw UnimplementedError(),
      update: (_, repo, __) => HomeViewModel(repo),
    ),
  ],
  child: MyApp(),
)
```

### get_it (service locator)

```yaml
dependencies:
  get_it: ^7.6.0
```

```dart
final getIt = GetIt.instance;

void setupDependencies() {
  getIt.registerSingleton<ApiClient>(ApiClient());
  getIt.registerFactory<ItemRepository>(() => ItemRepositoryImpl(getIt<ApiClient>()));
  getIt.registerFactory<HomeViewModel>(() => HomeViewModel(getIt<ItemRepository>()));
}
```

### injectable (code-generated DI)

```yaml
dependencies:
  injectable: ^2.3.0
dev_dependencies:
  injectable_generator: ^2.4.0
```

## Common design patterns

### Repository pattern

Abstract data sources behind a common interface. Allows swapping implementations (e.g., API vs local cache).

### Singleton pattern

Use sparingly. Prefer DI over singletons.

### Factory pattern

Create objects without specifying the exact class:

```dart
abstract class NotificationFactory {
  Notification create(NotificationType type);
}
```

### Observer pattern

`ChangeNotifier`, `Stream`, `ValueNotifier` are all observer patterns.

### Command pattern

Encapsulate actions as objects:

```dart
class AddItemCommand {
  final ItemRepository _repository;
  AddItemCommand(this._repository);

  Future<void> execute(Item item) async {
    await _repository.addItem(item);
  }
}
```

## Best practices

1. Keep widgets dumb — they should only render state
2. ViewModels should not import Flutter widgets
3. Use repositories to abstract data sources
4. Inject dependencies, don't hardcode them
5. Make state immutable where possible
6. Handle loading, error, and success states
7. Test ViewModels independently of UI
8. Use `ProxyProvider` or `get_it` for DI
9. Keep business logic out of `build()` methods
10. Consider using `Result<T>` or `Either<Error, T>` for error handling
