# Deep Linking

Navigate to routes when the app receives a new URL.

## Overview

Deep links are links that not only open an app, but also take the user to a specific location "deep" inside the app. For example, a deep link from an advertisement for a pair of sneakers might open a shopping app and display the product page for those particular shoes.

Flutter supports deep linking on iOS, Android, and the web. Opening a URL displays that screen in your app.

## Using the Router widget

The `Router` widget (or `go_router` package) handles deep links automatically:

```dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ProductScreen(productId: id);
      },
    ),
  ],
);

MaterialApp.router(routerConfig: router);
```

## Using named routes

Named routes also support deep linking (though not recommended for most apps):

```dart
MaterialApp(
  routes: {
    '/': (context) => const HomeScreen(),
    '/product': (context) => const ProductScreen(),
  },
)
```

## Android setup (App Links)

Add intent filters in `AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity" ...>
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="example.com" />
  </intent-filter>
</activity>
```

### Custom scheme deep links

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" />
</intent-filter>
```

## iOS setup (Universal Links)

1. Create an `apple-app-site-association` file on your domain:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["TEAMID.com.example.app"],
        "components": [
          {
            "/": "/product/*"
          }
        ]
      }
    ]
  }
}
```

2. Host at `https://example.com/.well-known/apple-app-site-association`

3. Add Associated Domains in Xcode:
   - Go to Signing & Capabilities
   - Add `applinks:example.com`

### Custom scheme deep links

Add URL types in `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

## Web

For web apps, deep links work automatically. Route paths are handled the same way as iOS or Android deep links.

By default, web apps read the deep link path from the URL fragment using the pattern `/#/path/to/app/screen`. This can be changed by configuring the URL strategy.

## URL strategies (web)

Use hash or path URL strategies:

```dart
import 'package:flutter_web_plugins/url_strategy.dart';

void main() {
  usePathUrlStrategy();  // Use path-based URLs: /path/to/screen
  runApp(MyApp());
}
```

## Opting out of Flutter's default deep link handler

If you have a custom plugin handling deep links, disable Flutter's default handler:

**iOS (Info.plist):**
```xml
<key>FlutterDeepLinkingEnabled</key>
<false/>
```

**Android (AndroidManifest.xml):**
```xml
<meta-data
  android:name="flutter_deeplinking_enabled"
  android:value="false" />
```

## Behavior when app is running

When using the `Router` widget, your app can replace the current set of pages when a new deep link is opened while the app is running. The `Router` parses the new URL and navigates to the corresponding route.

## Testing deep links

### Android

```bash
adb shell am start -a android.intent.action.VIEW -d "https://example.com/product/123" com.example.app
```

### iOS

```bash
xcrun simctl openurl booted "https://example.com/product/123"
```

## Best practices

1. Use `go_router` for declarative routing with deep linking
2. Set up App Links (Android) and Universal Links (iOS) for production
3. Use `autoVerify="true"` on Android for verified App Links
4. Host the `apple-app-site-association` file with valid SSL
5. Test deep links with `adb` and `xcrun simctl`
6. Handle edge cases: app not installed, invalid routes
7. Use path-based URL strategy for web for cleaner URLs
