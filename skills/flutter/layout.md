# Layouts in Flutter

Learn how Flutter's layout mechanism works and how to build your app's layout.

## Widgets are the core

Flutter widgets are built using a modern framework that takes inspiration from React. The central idea is that you build your UI out of widgets. Widgets describe what their view should look like given their current configuration and state. When a widget's state changes, the widget rebuilds its description, which the framework diffs against the previous description to determine the minimal changes needed in the underlying render tree.

## Core layout widgets

### Container

`Container` is a convenience widget that combines common painting, positioning, and sizing widgets:

```dart
Container({
  this.alignment,
  this.padding,
  this.color,
  this.decoration,
  this.foregroundDecoration,
  this.width,
  this.height,
  this.constraints,
  this.margin,
  this.transform,
  this.child,
})
```

### Row and Column

`Row` and `Column` are the most common layout widgets. They arrange children horizontally and vertically:

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Text('Row 1'),
    Text('Row 2'),
    Text('Row 3'),
  ],
)
```

### Expanded and Flexible

`Expanded` forces a child to fill available space. `Flexible` allows a child to be flexible without forcing it to fill all space:

```dart
Row(
  children: [
    Expanded(child: Text('Takes all remaining space')),
    Text('Fixed width'),
  ],
)
```

### Stack

`Stack` positions children relative to the edges of the box. Useful for overlapping widgets:

```dart
Stack(
  children: [
    Container(color: Colors.red, width: 100, height: 100),
    Positioned(
      bottom: 10, right: 10,
      child: Icon(Icons.star),
    ),
  ],
)
```

### ListView

`ListView` is the most commonly used scrolling widget:

```dart
ListView(
  children: <Widget>[
    ListTile(leading: Icon(Icons.map), title: Text('Map')),
    ListTile(leading: Icon(Icons.photo), title: Text('Album')),
  ],
)

// For large lists, use the builder constructor:
ListView.builder(
  itemCount: 1000,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)
```

### GridView

```dart
GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 3,
  ),
  itemCount: 300,
  itemBuilder: (context, index) {
    return Card(child: Center(child: Text('Item $index')));
  },
)
```

## Understanding constraints

Flutter's layout system is based on constraints. The key rule is:

> **Constraints flow down. Sizes flow up. Parents set positions.**

1. A parent passes constraints down to a child
2. The child determines its size within those constraints
3. The parent positions the child

### Constraint types

- **Tight constraints**: Exact size (e.g., `BoxConstraints.tight(Size(100, 100))`)
- **Loose constraints**: Maximum size but can be smaller (e.g., `BoxConstraints.loose(Size(200, 200))`)
- **Unbounded constraints**: No maximum in one or both dimensions (e.g., inside a `ListView`)

### Common constraint issues

- **Unbounded height in Column/Row**: Use `Expanded` or `Flexible` or wrap in a `SingleChildScrollView`
- **Infinite size**: A widget inside a scrollable needs bounded constraints
- **Overflow**: The child is bigger than the parent — use `Expanded`, `Flexible`, or `SingleChildScrollView`

## LayoutBuilder

`LayoutBuilder` lets you build widgets based on the parent's constraints, enabling responsive design:

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return _buildWideLayout();
    } else {
      return _buildNarrowLayout();
    }
  },
)
```

## MediaQuery

`MediaQuery` provides information about the current app environment:

```dart
final size = MediaQuery.of(context).size;
final orientation = MediaQuery.of(context).orientation;
final padding = MediaQuery.of(context).padding;
final textScaleFactor = MediaQuery.of(context).textScaler;
```

## Key layout widgets summary

| Widget | Purpose |
|--------|---------|
| `Container` | Padding, margin, border, color, size |
| `Row` / `Column` | Horizontal / vertical arrangement |
| `Expanded` / `Flexible` | Fill or share available space |
| `Stack` / `Positioned` | Overlapping widgets |
| `ListView` | Scrollable list |
| `GridView` | Scrollable grid |
| `Wrap` | Wrap children to next line |
| `Padding` | Add padding around child |
| `Center` / `Align` | Center or align child |
| `SizedBox` | Fixed size or gap |
| `AspectRatio` | Size to aspect ratio |
| `IntrinsicHeight` / `IntrinsicWidth` | Size to children's intrinsic size |
| `LayoutBuilder` | Build based on parent constraints |
