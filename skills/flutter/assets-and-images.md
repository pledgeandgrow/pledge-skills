# Adding Assets and Images

How to use images and other assets in your Flutter app.

## Declaring assets

Add assets to your `pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/images/logo.png
    - assets/images/
    - assets/icons/
```

- Individual files: list each file path
- Directories: list the directory path to include all files in it
- Subdirectories are NOT included when listing a directory — list them separately

## Loading images

### Image.asset

```dart
Image.asset('assets/images/logo.png')

// With properties
Image.asset(
  'assets/images/logo.png',
  width: 100,
  height: 100,
  fit: BoxFit.cover,
  alignment: Alignment.center,
)
```

### Image.network

```dart
Image.network('https://example.com/image.jpg')
```

### AssetImage (for custom widgets)

```dart
const Image(image: AssetImage('assets/images/logo.png'))
```

## Resolution-aware assets

Flutter supports resolution-aware image assets. Place variants in subdirectories:

```
assets/images/
  2.0x/logo.png
  3.0x/logo.png
  logo.png
```

Flutter automatically selects the appropriate resolution based on the device pixel ratio.

## Loading other asset types

### Load text files

```dart
import 'package:flutter/services.dart';

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/data/config.json');
}
```

### Load binary data

```dart
Future<ByteData> loadBinary() async {
  return await rootBundle.load('assets/data/data.bin');
}
```

## Fonts

### Declaring fonts

```yaml
flutter:
  fonts:
    - family: Raleway
      fonts:
        - asset: assets/fonts/Raleway-Regular.ttf
        - asset: assets/fonts/Raleway-Italic.ttf
          style: italic
    - family: Roboto Mono
      fonts:
        - asset: assets/fonts/RobotoMono-Regular.ttf
        - asset: assets/fonts/RobotoMono-Bold.ttf
          weight: 700
```

### Using fonts

```dart
Text(
  'Hello',
  style: TextStyle(fontFamily: 'Raleway'),
)

// Or in theme
ThemeData(
  textTheme: const TextTheme(
    bodyLarge: TextStyle(fontFamily: 'Raleway'),
  ),
)
```

## Icons

### Material icons

```dart
Icon(Icons.star)
Icon(Icons.favorite, color: Colors.red, size: 30)
```

### Custom icons

```dart
Image.asset('assets/icons/custom.png', width: 24, height: 24)
```

### Font-based icons (IconFont)

Use a font file with icon glyphs:

```yaml
flutter:
  fonts:
    - family: MyIcons
      fonts:
        - asset: assets/fonts/MyIcons.ttf
```

```dart
Icon(
  IconData(0xe800, fontFamily: 'MyIcons'),
)
```

## Platform-specific assets

### Android

Place launcher icons in `android/app/src/main/res/`:
- `mipmap-mdpi/` (48x48)
- `mipmap-hdpi/` (72x72)
- `mipmap-xhdpi/` (96x96)
- `mipmap-xxhdpi/` (144x144)
- `mipmap-xxxhdpi/` (192x192)

### iOS

Place app icons in `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

Use the `flutter_launcher_icons` package to automate:

```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.14.0

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/icon.png"
```

## Asset bundling tips

- Use `.png` for images with transparency, `.jpg` for photos
- Compress images before bundling
- Use `.webp` for smaller file sizes
- Consider using `cached_network_image` for remote images with caching
- Use `svg` files with `flutter_svg` package for vector graphics
