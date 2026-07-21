# Firebase Integration

How to use Firebase and Firestore with Flutter.

## Overview

Firebase is a Backend-as-a-Service (BaaS) app development platform that provides hosted backend services such as a realtime database, cloud storage, authentication, crash reporting, machine learning, remote configuration, and hosting for your static files.

## Getting started

### Add Firebase to your Flutter app

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Install the FlutterFire CLI:

```bash
dart pub global activate flutterfire_cli
```

3. Configure Firebase for your Flutter app:

```bash
flutterfire configure
```

This generates `lib/firebase_options.dart` with platform-specific configuration.

4. Add dependencies:

```yaml
dependencies:
  firebase_core: ^3.0.0
  cloud_firestore: ^5.0.0
  firebase_auth: ^5.0.0
  firebase_storage: ^12.0.0
  cloud_functions: ^5.0.0
  firebase_messaging: ^15.0.0
  firebase_analytics: ^11.0.0
  firebase_crashlytics: ^4.0.0
```

5. Initialize Firebase:

```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}
```

## Firestore

### Write data

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

// Add a document with auto ID
await FirebaseFirestore.instance.collection('users').add({
  'name': 'John',
  'age': 30,
  'created_at': Timestamp.now(),
});

// Set a document with specific ID
await FirebaseFirestore.instance.doc('users/john123').set({
  'name': 'John',
  'age': 30,
});

// Update a document
await FirebaseFirestore.instance.doc('users/john123').update({
  'age': 31,
});

// Delete a document
await FirebaseFirestore.instance.doc('users/john123').delete();
```

### Read data (one-time)

```dart
final snapshot = await FirebaseFirestore.instance.collection('users').get();
for (var doc in snapshot.docs) {
  print('${doc.id}: ${doc.data()}');
}
```

### Read data (real-time stream)

```dart
StreamBuilder<QuerySnapshot>(
  stream: FirebaseFirestore.instance.collection('users').snapshots(),
  builder: (context, snapshot) {
    if (snapshot.hasError) return Text('Error: ${snapshot.error}');
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    return ListView(
      children: snapshot.data!.docs.map((doc) {
        return ListTile(title: Text(doc['name']));
      }).toList(),
    );
  },
)
```

### Queries

```dart
// Filter
final query = await FirebaseFirestore.instance
    .collection('users')
    .where('age', isGreaterThanOrEqualTo: 18)
    .limit(10)
    .get();

// Order by
final ordered = await FirebaseFirestore.instance
    .collection('users')
    .orderBy('name')
    .get();

// Composite query
final composite = await FirebaseFirestore.instance
    .collection('users')
    .where('age', isGreaterThanOrEqualTo: 18)
    .where('isActive', isEqualTo: true)
    .orderBy('age', descending: true)
    .limit(20)
    .get();
```

### Transactions

```dart
await FirebaseFirestore.instance.runTransaction((transaction) async {
  final snapshot = await transaction.get(docRef);
  final newCount = (snapshot['count'] ?? 0) + 1;
  transaction.update(docRef, {'count': newCount});
});
```

### Batch writes

```dart
final batch = FirebaseFirestore.instance.batch();
batch.set(doc1Ref, {'name': 'User 1'});
batch.set(doc2Ref, {'name': 'User 2'});
await batch.commit();
```

## Firebase Auth

```dart
import 'package:firebase_auth/firebase_auth.dart';

// Sign up
await FirebaseAuth.instance.createUserWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password',
);

// Sign in
await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password',
);

// Sign out
await FirebaseAuth.instance.signOut();

// Current user
final user = FirebaseAuth.instance.currentUser;

// Auth state stream
StreamBuilder<User?>(
  stream: FirebaseAuth.instance.authStateChanges(),
  builder: (context, snapshot) {
    if (snapshot.hasData) return HomeScreen();
    return LoginScreen();
  },
)
```

## Firebase Storage

```dart
import 'package:firebase_storage/firebase_storage.dart';

// Upload file
final ref = FirebaseStorage.instance.ref('uploads/image.jpg');
await ref.putFile(File(imagePath));

// Get download URL
final url = await ref.getDownloadURL();

// Download file
final file = File(localPath);
await ref.writeToFile(file);
```

## Cloud Functions

```dart
import 'package:cloud_functions/cloud_functions.dart';

final result = await FirebaseFunctions.instance
    .httpsCallable('myFunction')
    .call({'param': 'value'});
print(result.data);
```

## Firebase Messaging (Push Notifications)

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

// Get token
final token = await FirebaseMessaging.instance.getToken();

// Listen to foreground messages
FirebaseMessaging.onMessage.listen((message) {
  print('Foreground message: ${message.notification?.title}');
});

// Listen to background messages
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Background message: ${message.messageId}');
}
FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
```

## Firebase hosting for web

Use Firebase Hosting to deploy your Flutter web app:

```bash
flutter build web --release
firebase init hosting
firebase deploy
```

## Best practices

1. Use FlutterFire CLI for initial setup
2. Use Firestore security rules to protect data
3. Use offline persistence for Firestore (enabled by default)
4. Handle auth state changes with `StreamBuilder`
5. Use transactions for atomic operations
6. Use batch writes for bulk operations
7. Structure Firestore data for your queries (not the other way around)
8. Use Cloud Functions for server-side logic
9. Set up Crashlytics for error reporting in production
10. Use Analytics to track user engagement
