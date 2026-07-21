# Control Flow

Dart provides several ways to control the flow of your code: loops, branches, and error handling.

## Loops

### For Loops

```dart
var message = StringBuffer('Dart is fun');
for (var i = 0; i < 5; i++) {
  message.write('!');
}
```

Closures inside Dart's for loops capture the value of the index. This avoids a common pitfall found in JavaScript:

```dart
var callbacks = [];
for (var i = 0; i < 2; i++) {
  callbacks.add(() => print(i));
}

for (final c in callbacks) {
  c(); // Prints 0, then 1 (not 2, 2 like JavaScript)
}
```

### For-In Loops

Iterate over an `Iterable` (like `List` or `Set`):

```dart
for (var candidate in candidates) {
  candidate.interview();
}
```

Use patterns in for-in loops:

```dart
for (final Candidate(:name, :yearsExperience) in candidates) {
  print('$name has $yearsExperience of experience.');
}
```

### forEach

```dart
var collection = [1, 2, 3];
collection.forEach(print); // 1 2 3
```

### While Loops

```dart
while (!isDone()) {
  doSomething();
}
```

### Do-While Loops

```dart
do {
  printLine();
} while (!atEndOfPage());
```

### Break and Continue

Use `break` to stop looping:

```dart
while (true) {
  if (shutDownRequested()) break;
  processIncomingRequests();
}
```

Use `continue` to skip to the next loop iteration:

```dart
for (int i = 0; i < candidates.length; i++) {
  var candidate = candidates[i];
  if (candidate.yearsExperience < 5) continue;
  candidate.interview();
}
```

### Labels

Use labels with `break` and `continue` to control nested loops:

```dart
outerLoop:
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 5; j++) {
    if (i * j >= 6) {
      print('Breaking out at i=$i, j=$j');
      break outerLoop;
    }
  }
}
```

## Branches

### If Statements

```dart
if (isRaining()) {
  you.bringRainCoat();
} else if (isSnowing()) {
  you.wearJacket();
} else {
  car.putTopDown();
}
```

### If-Case Statements

```dart
if (pair case [int x, int y]) {
  return Point(x, y);
} else {
  throw FormatException('Invalid coordinates.');
}
```

### Switch Statements

```dart
switch (command) {
  case 'OPEN':
    open();
    break;
  case 'CLOSE':
    close();
    break;
  default:
    print('Unknown command');
}
```

Switch cases can fall through (empty case bodies fall through to the next case). You can use `continue` with a label to jump to another case:

```dart
switch (command) {
  case 'CLOSE':
    close();
    continue closeAll;
  closeAll:
  case 'CLOSE_ALL':
    closeAll();
    break;
}
```

### Switch Expressions

Switch expressions produce a value and use `=>` for each case:

```dart
var value = switch (color) {
  Color.red => 'red',
  Color.green => 'green',
  Color.blue => 'blue',
};
```

### Exhaustiveness

Switch expressions must be exhaustive — all possible cases must be handled. Sealed types help ensure exhaustiveness:

```dart
sealed class Shape {}
class Square extends Shape {}
class Circle extends Shape {}

double area(Shape s) => switch (s) {
  Square(side: var s) => s * s,
  Circle(radius: var r) => 3.14 * r * r,
};
```

## Error Handling

### Throw

```dart
throw FormatException('Expected at least 1 section');
throw 'Out of llamas!'; // Can throw any non-null object
```

Because throwing an exception is an expression, you can throw in `=>` functions:

```dart
void distanceTo(Point other) => throw UnimplementedError();
```

### Catch

Use `try`/`catch` to handle exceptions:

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  buyMoreLlamas();
} on Exception catch (e) {
  print('Unknown exception: $e');
} catch (e, s) {
  print('Exception details:\n $e');
  print('Stack trace:\n $s');
}
```

### Finally

The `finally` clause executes after any `try`/`catch` clauses:

```dart
try {
  breedMoreLlamas();
} finally {
  cleanLlamaStalls();
}
```

### Rethrow

Use `rethrow` to propagate an exception:

```dart
try {
  breedMoreLlamas();
} catch (e) {
  print('Error: $e');
  rethrow;
}
```

### Exception and Error Types

- **`Exception`** — runtime errors that should be caught
- **`Error`** — programming errors that should not be caught (bugs)
- All Dart exceptions are unchecked — methods don't declare which exceptions they throw
- You can throw any non-null object, not just `Exception` and `Error` objects

### Custom Exceptions

```dart
class FooException implements Exception {
  final String message;
  FooException(this.message);

  @override
  String toString() => 'FooException: $message';
}
```
