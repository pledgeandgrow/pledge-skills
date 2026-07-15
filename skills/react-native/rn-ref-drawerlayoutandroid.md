# DrawerLayoutAndroid Component Reference (Android only)

React component that wraps the platform `DrawerLayout` (Android only). The Drawer (typically used for navigation) is rendered with `renderNavigationView` and direct children are the main view.

---

## Props

| Prop | Type | Description |
|------|------|-------------|
| `drawerBackgroundColor` | `color` | Background color of the drawer (default: white). Use rgba for opacity |
| `drawerLockMode` | `'unlocked' \| 'locked-closed' \| 'locked-open'` | Lock mode of the drawer |
| `drawerPosition` | `'left' \| 'right'` | Side of screen from which drawer slides in (default: `left`) |
| `drawerWidth` | `number` | Width of the drawer view |
| `keyboardDismissMode` | `'none' \| 'on-drag'` | Whether keyboard is dismissed on drag |
| `onDrawerClose` | `() => void` | Called when navigation view has been closed |
| `onDrawerOpen` | `() => void` | Called when navigation view has been opened |
| `onDrawerSlide` | `(event) => void` | Called on interaction with navigation view |
| `onDrawerStateChanged` | `(state: 'idle' \| 'dragging' \| 'settling') => void` | Called when drawer state changes |
| `renderNavigationView` | `() => ReactElement` | **Required.** The navigation view rendered to the side |
| `statusBarBackgroundColor` | `color` | Background color of status bar (API 21+) |

> Inherits all View Props.

## Methods (via ref)

```tsx
const drawerRef = useRef(null);

drawerRef.current?.openDrawer();
drawerRef.current?.closeDrawer();
```

## Usage

```tsx
import {DrawerLayoutAndroid, Text, View} from 'react-native';

const drawer = useRef(null);

const navigationView = (
  <View style={{flex: 1, backgroundColor: '#fff'}}>
    <Text style={{padding: 20, fontSize: 16}}>Navigation Menu</Text>
  </View>
);

<DrawerLayoutAndroid
  ref={drawer}
  drawerWidth={300}
  drawerPosition="left"
  renderNavigationView={() => navigationView}
  onDrawerOpen={() => console.log('Drawer opened')}
  onDrawerClose={() => console.log('Drawer closed')}>
  <View style={{flex: 1, alignItems: 'center'}}>
    <Text onPress={() => drawer.current?.openDrawer()}>Open Drawer</Text>
  </View>
</DrawerLayoutAndroid>
```
