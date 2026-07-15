# Platform-Specific APIs: ToastAndroid, PermissionsAndroid, ActionSheetIOS

---

## ToastAndroid (Android)

Show toast notifications.

### Methods

```tsx
ToastAndroid.show('Message', ToastAndroid.SHORT);
ToastAndroid.show('Message', ToastAndroid.LONG);

ToastAndroid.showWithGravity('Message', ToastAndroid.SHORT, ToastAndroid.TOP);
ToastAndroid.showWithGravity('Message', ToastAndroid.LONG, ToastAndroid.CENTER);
ToastAndroid.showWithGravity('Message', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

ToastAndroid.showWithGravityAndOffset(
  'Message', ToastAndroid.LONG, ToastAndroid.TOP, 200, 0
);
```

### Constants

| Constant | Value |
|----------|-------|
| `SHORT` | `0` |
| `LONG` | `1` |
| `TOP` | `3` |
| `BOTTOM` | `1` |
| `CENTER` | `2` |

---

## PermissionsAndroid (Android)

Request Android runtime permissions.

### Common Permissions

```tsx
PermissionsAndroid.PERMISSIONS.CAMERA
PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
PermissionsAndroid.PERMISSIONS.READ_CONTACTS
PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
PermissionsAndroid.PERMISSIONS.CALL_PHONE
PermissionsAndroid.PERMISSIONS.READ_SMS
PermissionsAndroid.PERMISSIONS.SEND_SMS
PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
```

### Methods

```tsx
// Request single permission
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  {
    title: 'Camera Permission',
    message: 'App needs camera access',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  }
);
// granted === PermissionsAndroid.RESULTS.GRANTED

// Request multiple permissions
const results = await PermissionsAndroid.requestMultiple([
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
]);
// results: { 'android.permission.CAMERA': 'granted', ... }

// Check permission
const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
```

### Result Values

| Result | Description |
|--------|-------------|
| `GRANTED` | Permission granted |
| `DENIED` | Permission denied (can ask again) |
| `NEVER_ASK_AGAIN` | Denied with "never ask again" |

---

## ActionSheetIOS (iOS)

Show iOS action sheets and share sheets.

### Methods

```tsx
// Show action sheet
ActionSheetIOS.showActionSheetWithOptions(
  {
    options: ['Option 1', 'Option 2', 'Cancel'],
    cancelButtonIndex: 2,
    destructiveButtonIndex: 1,
    title: 'Choose an option',
    message: 'Select one',
  },
  buttonIndex => {
    console.log('Selected:', buttonIndex);
  }
);

// Show share sheet
ActionSheetIOS.showShareActionSheetWithOptions(
  {
    message: 'Share this text',
    url: 'https://example.com',
  },
  error => console.error(error),
  success => console.log('Shared:', success)
);
```
