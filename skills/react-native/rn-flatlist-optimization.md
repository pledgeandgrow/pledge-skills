# Optimizing FlatList Configuration

Detailed guide on tuning FlatList/VirtualizedList props for performance.

---

## Terms

- **Virtualization:** Only rendering items currently in the viewport, dramatically improving memory and CPU usage.
- **Fill rate:** How many items are rendered vs blank space visible.
- **Window:** The area of rendered items around the viewport.

## Props

### removeClippedSubviews

Default: `false`

If `true`, views outside the viewport are detached from the native view hierarchy.

- **Pros:** Reduces time on main thread, lowers risk of dropped frames
- **Cons:** Can have bugs (missing content on iOS, especially with transforms/absolute positioning). Views are detached, not deallocated — no significant memory savings

### maxToRenderPerBatch

Default: `10`

Controls amount of items rendered per batch (next chunk on every scroll).

- **Pros:** Bigger number = less visual blank areas (higher fill rate)
- **Cons:** More items per batch = longer JS execution, potentially blocking presses

### updateCellsBatchingPeriod

Default: `50` (ms)

Delay in ms between batch renders. Combine with `maxToRenderPerBatch`.

- **Pros:** Render more items less frequently, or fewer items more frequently
- **Cons:** Less frequent batches = blank areas; more frequent = responsiveness issues

### initialNumToRender

Default: `10`

Initial amount of items to render.

- **Pros:** Precise number covering the screen = big initial render boost
- **Cons:** Too low = blank areas on initial render

### windowSize

Default: `21` (10 viewports above, 10 below, 1 in between)

- **Pros:** Bigger = less blank space while scrolling
- **Cons:** Bigger = more memory; smaller = more blank areas

---

## List Items

### Use Basic Components

Avoid a lot of logic and nesting in list items. Create dedicated lightweight components for big lists.

### Use Light Components

Avoid heavy images (use thumbnails). Minimize effects and interactions. Show details on item's detail page.

### Use memo()

```tsx
import {memo} from 'react';
import {View, Text} from 'react-native';

const MyListItem = memo(
  ({title}: {title: string}) => (
    <View>
      <Text>{title}</Text>
    </View>
  ),
  (prevProps, nextProps) => {
    return prevProps.title === nextProps.title;
  },
);

export default MyListItem;
```

The comparison function returns `true` to skip re-render.

### Use Cached Optimized Images

Use community packages like `@d11/react-native-fast-image` for performant cached images. Every image is a new `Image()` instance — faster load = faster JS thread free.

### Use getItemLayout

If all items have the same height (or width for horizontal), providing `getItemLayout` removes async layout calculations:

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Use keyExtractor or key

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
```

Used for caching and as React key for tracking item re-ordering.

### Avoid Anonymous Function on renderItem

Use a cached function reference instead of inline anonymous function:

```tsx
// Bad — creates new function every render
<FlatList renderItem={({item}) => <Text>{item.title}</Text>} />

// Good — stable reference
const renderItem = useCallback(({item}) => <Text>{item.title}</Text>, []);
<FlatList renderItem={renderItem} />
```
