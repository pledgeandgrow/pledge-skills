# Navigation and Routing

Overview of Flutter's navigation and routing features.

## Navigator

The `Navigator` widget displays screens as a stack using platform-appropriate transition animations. Navigate to a new screen with `push()` and go back with `pop()`:

```dart
// Push a new screen
Navigator.of(context).push(
  MaterialPageRoute<void>(
    builder: (context) => const SecondScreen(),
  ),
);

// Pop back
Navigator.of(context).pop();
```

### MaterialPageRoute

`MaterialPageRoute` is a subclass of `Route` that specifies Material Design transition animations:

```dart
MaterialPageRoute(
  builder: (context) => const DetailScreen(),
  settings: const RouteSettings(name: '/detail'),
)
```

### CupertinoPageRoute

For iOS-style transitions:

```dart
CupertinoPageRoute(
  builder: (context) => const DetailScreen(),
)
```

## Named routes

```dart
MaterialApp(
  routes: {
    '/': (context) => const HomeScreen(),
    '/second': (context) => const SecondScreen(),
  },
)

// Navigate with named route
Navigator.pushNamed(context, '/second');
```

> Named routes are not recommended for most applications. Use `go_router` or `Navigator` with `MaterialPageRoute` instead.

## Passing data between screens

### Forward

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailScreen(item: item),
  ),
);
```

### Return data

```dart
// In DetailScreen
Navigator.pop(context, result);

// In calling screen
final result = await Navigator.push(context, ...);
```

## go_router (recommended)

The `go_router` package is the recommended declarative routing solution:

```dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/detail/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailScreen(id: id);
      },
    ),
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/tab1',
          builder: (context, state) => const Tab1Screen(),
        ),
      ],
    ),
  ],
);

MaterialApp.router(routerConfig: router);
```

### go_router navigation

```dart
context.go('/detail/123');      // Replace stack
context.push('/detail/123');     // Push onto stack
context.pop();                   // Pop back
```

## Router (declarative navigation)

For apps with deep linking and web URL sync, use the `Router` widget:

```dart
MaterialApp.router(
  routerDelegate: MyRouterDelegate(),
  routeInformationParser: MyRouteInformationParser(),
)
```

## Deep linking

To configure your Android or iOS application to handle deep links:

### Android

Add intent filters in `AndroidManifest.xml`:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

### iOS

Add associated domains in `Info.plist` or Xcode capabilities.

### Web

URLs are automatically synced with the address bar when using `Router` or `go_router`.

## Nested navigation

Use `IndexedStack` or `ShellRoute` (with `go_router`) for nested navigation patterns like bottom tab bars:

```dart
IndexedStack(
  index: _currentIndex,
  children: [
    Navigator(onGenerateRoute: _buildHomeRoutes),
    Navigator(onGenerateRoute: _buildSearchRoutes),
    Navigator(onGenerateRoute: _buildProfileRoutes),
  ],
)
```

## Navigation patterns

| Pattern | Use case |
|---------|----------|
| `Navigator.push` / `pop` | Simple stack navigation |
| Named routes | Simple apps with few routes |
| `go_router` | Recommended for most apps |
| `Router` (declarative) | Complex deep linking, web URL sync |
| `IndexedStack` | Bottom tab navigation |
| `PageView` | Swipeable pages |
