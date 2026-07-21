# Networking

Internet network calls in Flutter.

## HTTP package

The `http` package is the standard way to make HTTP requests:

```yaml
dependencies:
  http: ^1.2.0
```

### GET requests

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> fetchUser() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/users/1'),
    headers: {'Authorization': 'Bearer $token'},
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to load user');
  }
}
```

### POST requests

```dart
final response = await http.post(
  Uri.parse('https://api.example.com/users'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'name': 'John', 'email': 'john@example.com'}),
);
```

### Other HTTP methods

```dart
await http.put(uri, body: data);
await http.patch(uri, body: data);
await http.delete(uri);
await http.head(uri);
```

### Multipart requests

```dart
final request = http.MultipartRequest('POST', uri);
request.fields['name'] = 'John';
request.files.add(await http.MultipartFile.fromPath('image', filePath));
final response = await request.send();
```

## dio package

For more advanced HTTP features:

```yaml
dependencies:
  dio: ^5.4.0
```

```dart
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  connectTimeout: const Duration(seconds: 5),
  receiveTimeout: const Duration(seconds: 10),
  headers: {'Authorization': 'Bearer $token'},
));

// GET
final response = await dio.get('/users/1');

// POST
final response = await dio.post('/users', data: {'name': 'John'});

// Download file
await dio.download('https://example.com/file.pdf', '/path/to/file.pdf');
```

### Interceptors

```dart
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    options.headers['Authorization'] = 'Bearer $token';
    return handler.next(options);
  },
  onError: (error, handler) {
    if (error.response?.statusCode == 401) {
      // Refresh token
    }
    return handler.next(error);
  },
));
```

## Using with FutureBuilder

```dart
FutureBuilder<User>(
  future: fetchUser(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    } else if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    } else if (snapshot.hasData) {
      return Text(snapshot.data!.name);
    }
    return const Text('No data');
  },
)
```

## WebSockets

```dart
import 'dart:io';

final socket = await WebSocket.connect('wss://example.com/ws');
socket.listen((data) {
  print('Received: $data');
});
socket.add('Hello server');
await socket.close();
```

## Error handling

```dart
try {
  final response = await http.get(uri);
  if (response.statusCode != 200) {
    throw HttpException('Status ${response.statusCode}');
  }
  return jsonDecode(response.body);
} on SocketException {
  throw Exception('No internet connection');
} on HttpException catch (e) {
  throw Exception('HTTP error: $e');
} on FormatException {
  throw Exception('Bad JSON format');
}
```

## Best practices

1. Always handle errors and loading states
2. Set timeouts to avoid hanging requests
3. Use interceptors for auth tokens and logging
4. Cache responses when possible
5. Use `FutureBuilder` for simple async UI
6. Consider `dio` for complex HTTP needs
7. Use `Stream` for real-time data (WebSockets, SSE)
8. Test with mocked HTTP responses
