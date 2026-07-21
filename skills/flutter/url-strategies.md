# URL Strategies (Web)

Configuring the URL strategy on the web.

## Overview

Flutter web apps support two URL strategies:
- **Hash strategy** (default) — URLs use `#/path` (e.g., `example.com/#/product/123`)
- **Path strategy** — URLs use clean paths (e.g., `example.com/product/123`)

## Hash strategy (default)

The default URL strategy uses the hash fragment:

```
https://example.com/#/product/123
```

- Works without server configuration
- Compatible with any static file server
- Not as clean-looking
- May affect SEO

## Path strategy

Use clean paths without the hash:

```
https://example.com/product/123
```

Enable path strategy:

```dart
import 'package:flutter_web_plugins/url_strategy.dart';

void main() {
  usePathUrlStrategy();
  runApp(MyApp());
}
```

### Server configuration for path strategy

The server must redirect all routes to `index.html`:

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache (.htaccess)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

#### Firebase Hosting (firebase.json)

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### GitHub Pages

GitHub Pages doesn't support server-side redirects. Use the hash strategy for GitHub Pages deployments.

## Base href

When deploying to a subdirectory, set the base href:

```bash
flutter build web --base-href "/myapp/"
```

This ensures assets are loaded from the correct path.

## go_router and URL strategy

`go_router` works with both strategies. The URL strategy affects how routes appear in the browser address bar:

```dart
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:go_router/go_router.dart';

void main() {
  usePathUrlStrategy();  // Clean URLs

  final router = GoRouter(
    routes: [
      GoRoute(path: '/', builder: (_, __) => HomeScreen()),
      GoRoute(path: '/product/:id', builder: (_, state) {
        return ProductScreen(id: state.pathParameters['id']!);
      }),
    ],
  );

  runApp(MaterialApp.router(routerConfig: router));
}
```

## Choosing a strategy

| Strategy | Pros | Cons |
|----------|------|------|
| Hash | No server config, works anywhere | Less clean URLs, SEO impact |
| Path | Clean URLs, better SEO | Requires server rewrite rules |

## Best practices

1. Use path strategy for production web apps
2. Configure server redirects for path strategy
3. Use hash strategy for static hosting without rewrite support
4. Set `--base-href` when deploying to subdirectories
5. Test deep links in both strategies
