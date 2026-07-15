# VirtualizedList Component Reference

Base implementation for the more convenient `FlatList` and `SectionList` components. Use only if you need more flexibility than `FlatList` provides, e.g., for use with immutable data instead of plain arrays.

---

## Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `any[]` | Array of items |
| `getItem` | `(data, index) => item` | Function to extract item from data |
| `getItemCount` | `(data) => number` | Function to get total item count |
| `renderItem` | `(info) => JSX.Element` | Render function for each item |

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `CellRendererComponent` | `ReactComponent` | Custom cell renderer wrapper |
| `ItemSeparatorComponent` | `ReactComponent` | Rendered between items |
| `ListEmptyComponent` | `ReactComponent \| ReactElement` | When list is empty |
| `ListItemComponent` | `ReactComponent \| ReactElement` | Render each item (alternative to renderItem) |
| `ListFooterComponent` | `ReactComponent \| ReactElement` | At bottom of list |
| `ListFooterComponentStyle` | `ViewStyle` | Footer style |
| `ListHeaderComponent` | `ReactComponent \| ReactElement` | At top of list |
| `ListHeaderComponentStyle` | `ViewStyle` | Header style |
| `debug` | `boolean` | Enable logging |
| `extraData` | `any` | Marker to trigger re-render |
| `getItemLayout` | `(data, index) => {length, offset, index}` | Skip measurement for fixed-size items |
| `horizontal` | `boolean` | Horizontal layout |
| `initialNumToRender` | `number` | Initial batch size (default: 10) |
| `initialScrollIndex` | `number` | Start at index (requires getItemLayout) |
| `inverted` | `boolean` | Reverse scroll direction |
| `keyExtractor` | `(item, index) => string` | Unique key for each item |
| `maxToRenderPerBatch` | `number` | Items per batch (default: 10) |
| `onEndReached` | `(info) => void` | Called when end reached |
| `onEndReachedThreshold` | `number` | Threshold for onEndReached |
| `onStartReached` | `(info) => void` | Called when start reached |
| `onStartReachedThreshold` | `number` | Threshold for onStartReached |
| `onRefresh` | `() => void` | Pull-to-refresh handler |
| `onScrollToIndexFailed` | `(info) => void` | Called when scrollToIndex fails |
| `onViewableItemsChanged` | `(info) => void` | Viewable items changed |
| `persistentScrollbar` | `boolean` | Persistent scrollbar (Android) |
| `progressViewOffset` | `number` | Progress view offset (Android) |
| `refreshControl` | `ReactElement` | RefreshControl component |
| `refreshing` | `boolean` | Whether refreshing |
| `removeClippedSubviews` | `boolean` | Detach off-screen views |
| `renderScrollComponent` | `(props) => ReactElement` | Custom scroll component |
| `viewabilityConfig` | `ViewabilityConfig` | Viewability threshold config |
| `viewabilityConfigCallbackPairs` | `array` | Multiple viewability configs |
| `updateCellsBatchingPeriod` | `number` | Delay between batches (ms, default: 50) |
| `windowSize` | `number` | Render window in viewport heights (default: 21) |

> Inherits all ScrollView Props.

## Methods (via ref)

```tsx
const listRef = useRef(null);

listRef.current?.scrollToIndex({index: 0, animated: true});
listRef.current?.scrollToItem({item: myItem, animated: true});
listRef.current?.scrollToOffset({offset: 0, animated: true});
listRef.current?.scrollToEnd({animated: true});
listRef.current?.flashScrollIndicators();
listRef.current?.getScrollResponder();
listRef.current?.getScrollableNode();
listRef.current?.getScrollRef();
```

## Usage

```tsx
import {VirtualizedList} from 'react-native';

const data = []; // your immutable data

<VirtualizedList
  data={data}
  getItemCount={(data) => data.length}
  getItem={(data, index) => data[index]}
  renderItem={({item}) => <Text>{item.key}</Text>}
  keyExtractor={(item) => item.key}
/>
```
