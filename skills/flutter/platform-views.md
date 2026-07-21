# Platform Views

Hosting native platform views in your Flutter app.

## Overview

Platform Views allow you to embed native platform UI components (Android Views, iOS UIViews, macOS NSViews) directly within your Flutter widget tree. This is useful for integrating maps, web views, camera previews, and other native UI components.

## AndroidView

Embed an Android `View` in Flutter:

```dart
class NativeMapView extends StatelessWidget {
  const NativeMapView({super.key});

  @override
  Widget build(BuildContext context) {
    return AndroidView(
      viewType: 'native-map-view',
      creationParams: {
        'center': [37.7749, -122.4194],
        'zoom': 12,
      },
      creationParamsCodec: const StandardMessageCodec(),
      onPlatformViewCreated: (viewId) {
        print('Platform view created: $viewId');
      },
    );
  }
}
```

### Android side

```kotlin
class NativeMapViewFactory : PlatformViewFactory(StandardMessageCodec.INSTANCE) {
  override fun create(context: Context, viewId: Int, args: Any?): PlatformView {
    val params = args as Map<String, Any>
    return NativeMapView(context, viewId, params)
  }
}

class NativeMapView(context: Context, viewId: Int, params: Map<String, Any>) : PlatformView {
  private val mapView: MapView = MapView(context)

    init {
        // Configure map view with params
    }

    override fun getView(): View = mapView

    override fun dispose() {
        mapView.onDestroy()
    }
}
```

### Register the view

```kotlin
override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    flutterEngine.platformViewRegistry
        .registerViewFactory("native-map-view", NativeMapViewFactory())
}
```

## UiKitView

Embed an iOS `UIView` in Flutter:

```dart
class NativeMapView extends StatelessWidget {
  const NativeMapView({super.key});

  @override
  Widget build(BuildContext context) {
    return UiKitView(
      viewType: 'native-map-view',
      creationParams: {
        'center': [37.7749, -122.4194],
      },
      creationParamsCodec: const StandardMessageCodec(),
    );
  }
}
```

### iOS side

```swift
class NativeMapViewFactory: NSObject, FlutterPlatformViewFactory {
    func create(withFrame frame: CGRect, viewIdentifier viewId: Int64, args args: Any?) -> FlutterPlatformView {
        return NativeMapView(frame: frame, viewId: viewId, args: args)
    }
}

class NativeMapView: NSObject, FlutterPlatformView {
    private let mapView: MKMapView

    init(frame: CGRect, viewId: Int64, args: Any?) {
        mapView = MKMapView(frame: frame)
        super.init()
        // Configure map
    }

    func view() -> UIView { return mapView }
}
```

### Register the view

```swift
let registry = controller.platformViewRegistry
registry.register("native-map-view", withFactory: NativeMapViewFactory())
```

## PlatformViewLink (macOS)

Embed a macOS `NSView` in Flutter:

```dart
PlatformViewLink(
  viewType: 'native-mac-view',
  surfaceFactory: (context, controller) {
    return PlatformViewSurface(
      controller: controller,
      hitTestBehavior: PlatformViewHitTestBehavior.opaque,
    );
  },
  onCreatePlatformView: (params) {
    return PlatformViewSurface(
      controller: params.controller,
      hitTestBehavior: PlatformViewHitTestBehavior.opaque,
    );
  },
)
```

## Hybrid composition

Flutter supports two composition modes for platform views:

1. **Virtual display** (default on older Android) — Renders the native view to a texture. No touch events from the native view.
2. **Hybrid composition** (default on Android 23+) — Composites the native view on top of Flutter. Full touch support.

Enable hybrid composition:

```dart
AndroidView(
  viewType: 'native-view',
  hybridComposition: true,  // Use hybrid composition
  ...
)
```

## Performance considerations

Platform views can impact performance:
- Hybrid composition adds an extra GPU context switch
- Virtual display doesn't support touch events on native views
- Avoid using many platform views simultaneously
- Use `Texture` widget for video/camera for better performance

## Common use cases

- **Web views** — `webview_flutter` package
- **Maps** — `google_maps_flutter` package
- **Camera** — `camera` package (uses Texture)
- **Native ads** — `google_mobile_ads` package

## Best practices

1. Prefer Flutter widgets over platform views when possible
2. Use `Texture` for video/camera instead of platform views
3. Minimize the number of platform views on screen
4. Test performance on low-end devices
5. Use hybrid composition for interactive native views
6. Dispose platform views properly
