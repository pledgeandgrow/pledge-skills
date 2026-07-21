# Scrolling

Overview of Flutter's scrolling support.

## Basic scrolling widgets

Many Flutter widgets support scrolling out of the box:

- `SingleChildScrollView` — Automatically scrolls its child when necessary
- `ListView` — Scrollable list of children
- `GridView` — Scrollable grid of children

```dart
SingleChildScrollView(
  child: Column(
    children: items.map((e) => Text(e)).toList(),
  ),
)
```

## Building items on demand

For long or infinite lists, use `.builder` constructors to build items as they scroll into view:

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index]));
  },
)

GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 3,
  ),
  itemCount: items.length,
  itemBuilder: (context, index) {
    return Card(child: Center(child: Text('Item $index')));
  },
)
```

## Specialized scrolling widgets

### DraggableScrollableSheet

A bottom sheet that grows and shrinks as the user drags:

```dart
DraggableScrollableSheet(
  initialChildSize: 0.3,
  minChildSize: 0.2,
  maxChildSize: 0.9,
  builder: (context, scrollController) {
    return Container(
      color: Colors.white,
      child: ListView.builder(
        controller: scrollController,
        itemCount: 25,
        itemBuilder: (context, index) => ListTile(title: Text('Item $index')),
      ),
    );
  },
)
```

### ListWheelScrollView

Turns the scrollable area into a wheel (like iOS date picker):

```dart
ListWheelScrollView(
  itemExtent: 50,
  children: items.map((e) => ListTile(title: Text(e))).toList(),
  onSelectedItemChanged: (index) {
    print('Selected: $index');
  },
)
```

### PageView

Scrollable page-like views:

```dart
PageView(
  children: [
    Page1(),
    Page2(),
    Page3(),
  ],
)

// With builder
PageView.builder(
  itemCount: 10,
  itemBuilder: (context, index) => MyPage(index: index),
)
```

## Slivers

Slivers provide fine-grained control over scrolling behavior. A sliver is a piece of the scrollable area. Use `CustomScrollView` to compose slivers:

```dart
CustomScrollView(
  slivers: [
    SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: const Text('Sliver App Bar'),
        background: Image.network('https://example.com/header.jpg'),
      ),
    ),
    SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) => ListTile(title: Text('Item $index')),
        childCount: 50,
      ),
    ),
    SliverGrid(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
      ),
      delegate: SliverChildBuilderDelegate(
        (context, index) => Card(child: Center(child: Text('$index'))),
        childCount: 30,
      ),
    ),
  ],
)
```

### Common sliver widgets

| Sliver | Description |
|--------|-------------|
| `SliverList` | Scrollable list |
| `SliverGrid` | Scrollable grid |
| `SliverToBoxAdapter` | Wrap a single box widget |
| `SliverAppBar` | App bar that can expand/collapse |
| `SliverPersistentHeader` | Custom persistent header |
| `SliverPadding` | Add padding around slivers |
| `SliverFillRemaining` | Fill remaining space |
| `SliverFixedExtentList` | List with fixed item extent |

## ScrollController

Control scrolling programmatically:

```dart
final controller = ScrollController();

ListView.builder(
  controller: controller,
  itemCount: 100,
  itemBuilder: (context, index) => ListTile(title: Text('Item $index')),
)

// Scroll to position
controller.animateTo(
  500,
  duration: const Duration(milliseconds: 500),
  curve: Curves.easeInOut,
)

// Jump to position
controller.jumpTo(500);
```

## Scroll physics

| Physics | Platform | Behavior |
|---------|----------|----------|
| `BouncingScrollPhysics` | iOS | Bounces at edges |
| `ClampingScrollPhysics` | Android | Clamps at edges with glow |
| `AlwaysScrollableScrollPhysics` | Both | Always allows scrolling |
| `NeverScrollableScrollPhysics` | Both | Disables scrolling |

```dart
ListView(
  physics: const BouncingScrollPhysics(),
  children: [...],
)
```

## NestedScrollView

For nested scrolling (e.g., app bar + tab bar + list):

```dart
NestedScrollView(
  headerSliverBuilder: (context, innerBoxIsScrolled) {
    return [
      SliverAppBar(
        expandedHeight: 200,
        pinned: true,
        title: const Text('Nested Scroll'),
      ),
    ];
  },
  body: TabBarView(
    children: [
      ListView.builder(itemBuilder: (context, index) => ListTile(title: Text('Tab 1: $index'))),
      ListView.builder(itemBuilder: (context, index) => ListTile(title: Text('Tab 2: $index'))),
    ],
  ),
)
```

## Best practices

1. Use `ListView.builder` for lists with more than ~10 items
2. Use `SliverList` with `CustomScrollView` for complex scrolling layouts
3. Set `itemExtent` for fixed-height items to improve performance
4. Use `ScrollController` for programmatic scrolling
5. Choose appropriate `ScrollPhysics` for your platform
6. Use `NestedScrollView` for collapsing app bar + tab bar patterns
7. Dispose `ScrollController` in `dispose()`
