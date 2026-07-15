# Navigation (React Navigation)

---

## Installation

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

## Static API (recommended)

```tsx
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {title: 'Welcome'},
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

## Navigation Usage

```tsx
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <Button
      title="Go to profile"
      onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
    />
  );
}

function ProfileScreen({route}) {
  return <Text>This is {route.params.name}'s profile</Text>;
}
```

`createNativeStackNavigator` uses native APIs: `UINavigationController` on iOS,
`Fragment` on Android — same performance as native apps.

Other navigator types: tabs (`createBottomTabNavigator`), drawer (`createDrawerNavigator`).
