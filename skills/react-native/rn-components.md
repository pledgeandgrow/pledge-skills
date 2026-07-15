# React Native Core Components

Complete reference for React Native's built-in Core Components.

---

## Basic Components

### View

The most fundamental component for building a UI. Maps to `ViewGroup` (Android), `UIView` (iOS), `<div>` (web).

```tsx
import {View} from 'react-native';

<View style={{flex: 1, backgroundColor: 'white'}}>
  <Text>Content inside View</Text>
</View>
```

Key props: `style`, `onLayout`, `pointerEvents`, `hitSlop`, `removeClippedSubviews`, `testID`, `nativeID`, `accessibilityLabel`, `accessible`

### Text

Component for displaying text. Maps to `TextView` (Android), `UITextView` (iOS), `<p>` (web).

```tsx
import {Text} from 'react-native';

<Text style={{fontSize: 16, color: '#333'}}>
  Hello, World!
</Text>
```

Key props: `numberOfLines`, `ellipsizeMode`, `onPress`, `selectable`, `adjustsFontSizeToFit`, `minimumFontScale`

**Nested Text:** Text components can be nested to create rich text:
```tsx
<Text style={{color: 'black'}}>
  This is <Text style={{fontWeight: 'bold'}}>bold</Text> text.
</Text>
```

### Image

Component for displaying images. Maps to `ImageView` (Android), `UIImageView` (iOS), `<img>` (web).

```tsx
import {Image} from 'react-native';

<Image
  source={{uri: 'https://example.com/image.png'}}
  style={{width: 200, height: 200}}
  resizeMode="cover"
/>
```

Key props: `source`, `defaultSource`, `resizeMode` (`cover`, `contain`, `stretch`, `repeat`, `center`), `onLoad`, `onError`, `blurRadius`, `fadeDuration` (Android)

Local images:
```tsx
<Image source={require('./my-image.png')} />
```

### TextInput

Component for inputting text via keyboard. Maps to `EditText` (Android), `UITextField` (iOS), `<input>` (web).

```tsx
import {TextInput, useState} from 'react-native';

const [value, setValue] = useState('');

<TextInput
  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
  value={value}
  onChangeText={setValue}
  placeholder="Enter text..."
  onSubmitEditing={() => console.log('submitted')}
/>
```

Key props: `value`, `defaultValue`, `onChangeText`, `onSubmitEditing`, `placeholder`, `placeholderTextColor`, `keyboardType` (`default`, `numeric`, `email-address`, `phone-pad`), `secureTextEntry`, `multiline`, `numberOfLines`, `maxLength`, `autoFocus`, `returnKeyType`, `blurOnSubmit`

### Pressable

Wrapper component that detects various stages of press interactions on any of its children.

```tsx
import {Pressable, Text} from 'react-native';

<Pressable
  onPress={() => console.log('pressed')}
  onLongPress={() => console.log('long pressed')}
  hitSlop={20}
  style={({pressed}) => ({
    backgroundColor: pressed ? '#ddd' : '#fff',
    padding: 10,
  })}
>
  <Text>Press me</Text>
</Pressable>
```

**Press lifecycle:**
1. `onPressIn` — press activated
2. `onPressOut` — press deactivated
3. Either `onPress` (quick release) or `onLongPress` (held > 500ms)

Key props:
- `onPress`, `onPressIn`, `onPressOut`, `onPressMove`, `onLongPress`
- `disabled`, `hitSlop`, `pressRetentionOffset`, `delayLongPress`
- `style` — accepts function `({pressed: boolean}) => ViewStyle`
- `children` — accepts function `({pressed: boolean}) => ReactNode`
- `android_ripple` (Android only) — RippleConfig for ripple effect
- `onHoverIn`, `onHoverOut` — for hover/mouse interactions

### ScrollView

Generic scrolling container that can host multiple components and views.

```tsx
import {ScrollView, View, Text} from 'react-native';

<ScrollView
  horizontal={false}
  showsVerticalScrollIndicator={true}
  contentContainerStyle={{padding: 20}}
>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</ScrollView>
```

Key props: `horizontal`, `showsHorizontalScrollIndicator`, `showsVerticalScrollIndicator`, `contentContainerStyle`, `keyboardShouldPersistTaps`, `scrollEnabled`, `pagingEnabled`, `refreshControl`, `stickyHeaderIndices`, `nestedScrollEnabled` (Android)

### StyleSheet

Abstraction layer similar to CSS stylesheets.

```tsx
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

// Methods:
StyleSheet.create(styles)        // identity function, provides type checking
StyleSheet.compose(style1, style2) // combines two styles, style2 overrides style1
StyleSheet.flatten([style1, style2]) // flattens array of styles into one object
StyleSheet.absoluteFill           // {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}
StyleSheet.hairlineWidth          // thinnest line on platform (1px on web, 0.5px on iOS)
```

---

## User Interface Components

### Button

Basic button component with platform-native appearance.

```tsx
import {Button} from 'react-native';

<Button
  title="Press me"
  color="#841584"
  onPress={() => console.log('pressed')}
  disabled={false}
  accessibilityLabel="Press me button"
/>
```

### Switch

Toggle switch component.

```tsx
import {Switch} from 'react-native';

const [isEnabled, setIsEnabled] = useState(false);

<Switch
  trackColor={{false: '#767577', true: '#81b0ff'}}
  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
  ios_backgroundColor="#3e3e3e"
  onValueChange={setIsEnabled}
  value={isEnabled}
/>
```

---

## List Views

### FlatList

Performant scrollable list — only renders items currently showing on screen.

```tsx
import {FlatList, View, Text} from 'react-native';

const data = [
  {id: '1', title: 'Item 1'},
  {id: '2', title: 'Item 2'},
  {id: '3', title: 'Item 3'},
];

<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={({item}) => <Text>{item.title}</Text>}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

Key props: `data`, `renderItem`, `keyExtractor`, `getItemLayout`, `horizontal`, `numColumns`, `onEndReached`, `onEndReachedThreshold`, `refreshControl`, `ListHeaderComponent`, `ListFooterComponent`, `ItemSeparatorComponent`, `removeClippedSubviews`, `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`

**Performance tip:** Use `getItemLayout` to skip measurement of rendered items for faster scrolling.

### SectionList

Performant scrollable list with section headers.

```tsx
import {SectionList, Text} from 'react-native';

const sections = [
  {
    title: 'Section 1',
    data: ['Item 1', 'Item 2'],
  },
  {
    title: 'Section 2',
    data: ['Item 3', 'Item 4'],
  },
];

<SectionList
  sections={sections}
  keyExtractor={(item, index) => item + index}
  renderItem={({item}) => <Text>{item}</Text>}
  renderSectionHeader={({section: {title}}) => <Text>{title}</Text>}
/>
```

---

## Other Components

### ActivityIndicator

Circular loading indicator.

```tsx
<ActivityIndicator size="large" color="#0000ff" />
```

### Alert

Alert dialog with title and message.

```tsx
Alert.alert(
  'Title',
  'Message text',
  [
    {text: 'Cancel', onPress: () => console.log('Cancel')},
    {text: 'OK', onPress: () => console.log('OK')},
  ]
);
```

### KeyboardAvoidingView

View that moves out of the way of the virtual keyboard automatically.

```tsx
import {KeyboardAvoidingView, Platform} from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{flex: 1}}
>
  <TextInput placeholder="Type here..." />
</KeyboardAvoidingView>
```

### Modal

Simple way to present content above an enclosing view.

```tsx
<Modal
  visible={isVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIsVisible(false)}
>
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Modal content</Text>
  </View>
</Modal>
```

### StatusBar

Control the app status bar.

```tsx
<StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
```

### RefreshControl

Used inside ScrollView to add pull-to-refresh functionality.

```tsx
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      colors={['#ff0000']} // Android
      tintColor="#ff0000"  // iOS
    />
  }
>
  {/* content */}
</ScrollView>
```

### Linking

General interface to interact with incoming and outgoing app links.

```tsx
import {Linking} from 'react-native';

// Open URL
await Linking.openURL('https://example.com');

// Check if app can open URL
const canOpen = await Linking.canOpenURL('https://example.com');

// Open settings
await Linking.openSettings();
```

### Dimensions

Interface for getting device dimensions.

```tsx
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const screen = Dimensions.get('screen');

// Listen to changes
Dimensions.addEventListener('change', ({window, screen}) => {
  console.log(window.width, window.height);
});
```

### PixelRatio

Access to the device pixel density.

```tsx
import {PixelRatio} from 'react-native';

const ratio = PixelRatio.get();           // 1, 2, or 3
const fontScale = PixelRatio.getFontScale();
const pixelSize = PixelRatio.getPixelSizeForLayoutSize(200);
```

---

## Platform-Specific Components

### Android Only

| Component | Description |
|-----------|-------------|
| `BackHandler` | Detect hardware back button press |
| `DrawerLayoutAndroid` | Drawer layout |
| `PermissionsAndroid` | Android runtime permissions |
| `ToastAndroid` | Toast notifications |

### iOS Only

| Component | Description |
|-----------|-------------|
| `ActionSheetIOS` | iOS action sheet |

---

## Touchable Components (Legacy)

`Pressable` is the recommended component for press interactions. These legacy
components are still available but `Pressable` is preferred for new code.

| Component | Feedback | Use Case |
|-----------|----------|----------|
| `TouchableHighlight` | Darkens background | Button/link on web |
| `TouchableOpacity` | Reduces opacity | See-through press feedback |
| `TouchableNativeFeedback` | Ripple effect (Android only) | Android native feel |
| `TouchableWithoutFeedback` | No visual feedback | Tap without feedback |

All Touchable components support `onPress`, `onLongPress`, `onPressIn`, `onPressOut`,
and `disabled` props.

```tsx
import {TouchableOpacity, Text} from 'react-native';

<TouchableOpacity onPress={() => console.log('pressed')} activeOpacity={0.7}>
  <Text>Press me</Text>
</TouchableOpacity>
```

---

## Handling Touches Summary

- **Basic button:** Use `<Button>` for platform-native appearance
- **Custom pressable:** Use `<Pressable>` (recommended) with `style={({pressed}) => ...}`
- **Scrolling/swiping:** Use `<ScrollView>` or `<FlatList>`
- **Long press:** `onLongPress` prop on any Touchable or Pressable (500ms default, customize with `delayLongPress`)
- **Hit area:** `hitSlop` expands touch area beyond visual bounds
- **Press retention:** `pressRetentionOffset` keeps press active when finger moves slightly outside
