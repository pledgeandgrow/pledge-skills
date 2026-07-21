# Adding Interactivity to Your Flutter App

How to implement a stateful widget that responds to taps and user input.

## Stateful widgets

A `StatefulWidget` is a widget that can change state. When state changes, call `setState()` to trigger a rebuild:

```dart
class FavoriteWidget extends StatefulWidget {
  const FavoriteWidget({super.key});

  @override
  State<FavoriteWidget> createState() => _FavoriteWidgetState();
}

class _FavoriteWidgetState extends State<FavoriteWidget> {
  bool _isFavorited = false;
  int _favoriteCount = 41;

  void _toggleFavorite() {
    setState(() {
      if (_isFavorited) {
        _favoriteCount -= 1;
        _isFavorited = false;
      } else {
        _favoriteCount += 1;
        _isFavorited = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton(
          icon: _isFavorited
              ? const Icon(Icons.star)
              : const Icon(Icons.star_border),
              color: Colors.red[500],
          onPressed: _toggleFavorite,
        ),
        Text('$_favoriteCount'),
      ],
    );
  }
}
```

## Managing state

There are several approaches to managing state in Flutter:

### Widget-level state

Use `setState()` for simple, local state within a single widget:

```dart
setState(() {
  _counter++;
});
```

### Parent-child state

Lift state up to a common parent and pass it down:

```dart
class ParentWidget extends StatefulWidget {
  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  bool _active = false;

  void _handleTap(bool newValue) {
    setState(() => _active = newValue);
  }

  @override
  Widget build(BuildContext context) {
    return ChildWidget(active: _active, onTap: _handleTap);
  }
}
```

### App-level state

For state shared across the app, use:
- **Provider** — Simple, recommended for most apps
- **Riverpod** — Type-safe, compile-safe state management
- **Bloc** — Event-driven state management
- **GetX** — Lightweight state management and navigation

See [state-management.md](state-management.md) for more details.

## Gestures and taps

### InkWell

`InkWell` provides Material Design ripple effect on tap:

```dart
InkWell(
  onTap: () {
    print('Tapped!');
  },
  child: Container(
    padding: const EdgeInsets.all(12),
    child: const Text('Tap me'),
  ),
)
```

### GestureDetector

`GestureDetector` provides more gesture types without ripple:

```dart
GestureDetector(
  onTap: () {},
  onDoubleTap: () {},
  onLongPress: () {},
  onHorizontalDragUpdate: (details) {},
  child: Container(width: 100, height: 100, color: Colors.blue),
)
```

### Dismissible

`Dismissible` allows swipe-to-dismiss:

```dart
Dismissible(
  key: Key(item.id),
  onDismissed: (direction) {
    setState(() => items.remove(item));
  },
  background: Container(color: Colors.red),
  child: ListTile(title: Text(item.title)),
)
```

## Form input

### TextField

```dart
TextField(
  decoration: InputDecoration(
    border: OutlineInputBorder(),
    labelText: 'Enter your name',
  ),
  onChanged: (value) {
    print('Current value: $value');
  },
)
```

### TextFormField with validation

```dart
TextFormField(
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter some text';
    }
    return null;
  },
)
```

### Form widget

```dart
Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(validator: (value) => value!.isEmpty ? 'Required' : null),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            // Process data
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)
```

## Interactive widgets summary

| Widget | Purpose |
|--------|---------|
| `StatefulWidget` | Stateful widget with `setState()` |
| `GestureDetector` | Detect taps, drags, long presses |
| `InkWell` | Material ripple + tap detection |
| `Dismissible` | Swipe to dismiss |
| `Draggable` / `DragTarget` | Drag and drop |
| `TextField` / `TextFormField` | Text input |
| `Checkbox` / `Switch` / `Radio` | Selection controls |
| `Slider` / `RangeSlider` | Value selection |
| `DropdownButton` | Dropdown menu |
