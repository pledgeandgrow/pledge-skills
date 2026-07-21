# Accessibility and Internationalization

Information on Flutter's accessibility support and internationalization features.

## Accessibility

Flutter supports accessibility features built into the platform, including:
- Screen readers (TalkBack on Android, VoiceOver on iOS)
- Large text
- High contrast
- Switch access
- Semantic descriptions

### Semantics widget

The `Semantics` widget provides accessibility information to the framework:

```dart
Semantics(
  label: 'Favorite button',
  button: true,
  enabled: true,
  child: GestureDetector(
    onTap: _toggleFavorite,
    child: Icon(_isFavorited ? Icons.star : Icons.star_border),
  ),
)
```

### MergeSemantics

Combine semantics of multiple widgets into one:

```dart
MergeSemantics(
  child: Row(
    children: [
      Icon(Icons.star),
      Text('41 favorites'),
    ],
  ),
)
```

### ExcludeSemantics

Remove semantics from a subtree:

```dart
ExcludeSemantics(
  child: Image.asset('assets/decorative.png'),
)
```

### SemanticsConfiguration

For custom rendering objects, use `SemanticsConfiguration`:

```dart
@override
void describeSemanticsConfiguration(SemanticsConfiguration config) {
  super.describeSemanticsConfiguration(config);
  config.label = 'Custom widget';
  config.isButton = true;
}
```

### Large fonts and text scaling

Flutter respects the system text scale setting. Use `MediaQuery.textScalerOf` to get the current text scale:

```dart
final textScaler = MediaQuery.textScalerOf(context);
```

### High contrast

Flutter supports high contrast mode on iOS and Android:

```dart
final isHighContrast = MediaQuery.highContrastOf(context);
```

## Internationalization (i18n)

### Setup

Add `flutter_localizations` and `intl` to `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: any
```

### Configure MaterialApp

```dart
MaterialApp(
  localizationsDelegates: const [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  supportedLocales: const [
    Locale('en'),
    Locale('es'),
    Locale('fr'),
    Locale('de'),
  ],
)
```

### ARB files

Use `.arb` files for translations:

`lib/l10n/app_en.arb`:
```json
{
  "@@locale": "en",
  "helloWorld": "Hello World!",
  "@helloWorld": {
    "description": "The conventional hello world message"
  },
  "greeting": "Hello, {name}!",
  "@greeting": {
    "placeholders": {
      "name": {
        "type": "String"
      }
    }
  }
}
```

`lib/l10n/app_es.arb`:
```json
{
  "@@locale": "es",
  "helloWorld": "¡Hola Mundo!",
  "greeting": "¡Hola, {name}!"
}
```

### l10n.yaml configuration

```yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
```

### Using translations

```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

Text(AppLocalizations.of(context)!.helloWorld)
Text(AppLocalizations.of(context)!.greeting('John'))
```

### Generate localization files

```bash
flutter gen-l10n
```

## Date and number formatting

Use the `intl` package:

```dart
import 'package:intl/intl.dart';

// Date formatting
final dateFormat = DateFormat.yMMMd('es');
print(dateFormat.format(DateTime.now())); // 21 jul. 2026

// Number formatting
final numberFormat = NumberFormat.currency(locale: 'es', symbol: '€');
print(numberFormat.format(1234.56)); // 1.234,56 €
```

## RTL (Right-to-Left) support

Flutter automatically handles RTL for locales that require it. Use `Directionality` or `TextDirection`:

```dart
Directionality(
  textDirection: TextDirection.rtl,
  child: Text('مرحبا'),
)
```

Widgets that support RTL automatically:
- `Row` / `Column` — reversed in RTL
- `Padding` — `paddingStart` / `paddingEnd`
- `Text` — automatically aligned
- `Icon` — use `matchTextDirection: true` for directional icons

## Best practices

1. Always provide `Semantics` labels for interactive elements
2. Test with screen readers enabled
3. Support multiple locales from the start
4. Use `intl` for date/number formatting
5. Test RTL layouts
6. Ensure touch targets are at least 48x48 dp
7. Don't rely on color alone to convey information
8. Test with large text settings
