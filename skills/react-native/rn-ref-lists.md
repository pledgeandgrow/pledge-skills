# FlatList & SectionList Component Reference

---

## FlatList

Performant interface for rendering flat lists. Inherits VirtualizedList props.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of items to render |
| `renderItem` | `(info) => JSX.Element` | Render function for each item |

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `keyExtractor` | `(item, index) => string` | Unique key for each item (default: `item.key` or `item.id`) |
| `horizontal` | `boolean` | Horizontal layout |
| `numColumns` | `number` | Number of columns (only with `horizontal={false}`) |
| `inverted` | `boolean` | Reverse scroll direction |
| `columnWrapperStyle` | `StyleProp` | Style for multi-item rows |
| `extraData` | `any` | Marker to trigger re-render |
| `getItemLayout` | `(data, index) => {length, offset, index}` | Skip measurement for fixed-size items |
| `initialNumToRender` | `number` | Initial batch size (default: 10) |
| `initialScrollIndex` | `number` | Start at index (requires `getItemLayout`) |
| `maxToRenderPerBatch` | `number` | Items per batch (default: 10) |
| `updateCellsBatchingPeriod` | `number` | Delay between batches (ms, default: 50) |
| `windowSize` | `number` | Render window in viewport heights (default: 21) |
| `removeClippedSubviews` | `boolean` | Detach off-screen views |

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| `ItemSeparatorComponent` | `ReactComponent \| ReactElement` | Between items (not top/bottom) |
| `ListEmptyComponent` | `ReactComponent \| ReactElement` | When list is empty |
| `ListHeaderComponent` | `ReactComponent \| ReactElement` | At top of list |
| `ListFooterComponent` | `ReactComponent \| ReactElement` | At bottom of list |
| `ListHeaderComponentStyle` | `ViewStyle` | Header style |
| `ListFooterComponentStyle` | `ViewStyle` | Footer style |

### Refresh Props

| Prop | Type | Description |
|------|------|-------------|
| `onRefresh` | `() => void` | Pull-to-refresh handler |
| `refreshing` | `boolean` | Whether refreshing |
| `progressViewOffset` | `number` | Android refresh indicator offset |

### Viewability Props

| Prop | Type | Description |
|------|------|-------------|
| `viewabilityConfig` | `ViewabilityConfig` | Viewability threshold config |
| `onViewableItemsChanged` | `(info) => void` | Viewable items changed |
| `viewabilityConfigCallbackPairs` | `array` | Multiple viewability configs |

### Methods (via ref)

```tsx
const listRef = useRef<FlatList>(null);

listRef.current?.scrollToIndex({index: 0, animated: true});
listRef.current?.scrollToItem({item: myItem, animated: true});
listRef.current?.scrollToOffset({offset: 0, animated: true});
listRef.current?.scrollToEnd({animated: true});
listRef.current?.flashScrollIndicators();
listRef.current?.getScrollResponder();
listRef.current?.getNativeScrollRef();
listRef.current?.getScrollableNode();
```

### renderItem Signature

```tsx
renderItem({
  item: ItemT,
  index: number,
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
  }
}): JSX.Element;
```

### getItemLayout Example

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

---

## SectionList

Like FlatList but for sectioned lists. Inherits VirtualizedList props.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `sections` | `Section[]` | Array of `{data: T[], title?: string, key?: string}` |
| `renderItem` | `(info) => JSX.Element` | Render function for items |

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `renderSectionHeader` | `(info) => JSX.Element` | Section header renderer |
| `renderSectionFooter` | `(info) => JSX.Element` | Section footer renderer |
| `keyExtractor` | `(item, index) => string` | Unique key for items |
| `stickySectionHeadersEnabled` | `boolean` | Sticky section headers (default: `true`) |
| `ItemSeparatorComponent` | `ReactComponent` | Between items |
| `SectionSeparatorComponent` | `ReactComponent` | Between sections |
| `ListEmptyComponent` | `ReactComponent` | Empty list |
| `ListHeaderComponent` | `ReactComponent` | Top of list |
| `ListFooterComponent` | `ReactComponent` | Bottom of list |
| `extraData` | `any` | Re-render trigger |
| `initialNumToRender` | `number` | Initial batch |
| `invertStickyHeaders` | `boolean` | Sticky headers at bottom |
| `onRefresh` | `() => void` | Pull-to-refresh |
| `refreshing` | `boolean` | Refreshing state |
