# Functions

Dart is a true object-oriented language, so even functions are objects and have a type, `Function`. This means functions can be assigned to variables or passed as arguments to other functions.

## Defining Functions

```dart
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
```

For functions with a single expression, use shorthand syntax:

```dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

The `=> expr` syntax is shorthand for `{ return expr; }`.

## Parameters

A function can have any number of required positional parameters, followed by named parameters or optional positional parameters (but not both).

### Named Parameters

Named parameters are optional unless marked `required`:

```dart
void enableFlags({bool? bold, bool? hidden}) {
  // ...
}

enableFlags(bold: true, hidden: false);
```

Required named parameters:

```dart
void scrollTo({required int x, required int y}) {
  // ...
}
scrollTo(x: 3, y: 4);
```

### Optional Positional Parameters

Wrapping parameters in square brackets makes them optional positional:

```dart
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

say('Bob', 'Howdy'); // Bob says Howdy
say('Bob', 'Howdy', 'smoke signal'); // Bob says Howdy with a smoke signal
```

### Default Values

```dart
void enableFlags({bool bold = false, bool hidden = false}) {
  // ...
}

String say(String from, String msg, [String device = 'carrier pigeon']) {
  // ...
}
```

Default values can be expressions:

```dart
void doStuff({List<int> list = const [1, 2, 3]}) {
  print(list);
}
```

## The main() Function

Every app requires a top-level `main()` function:

```dart
void main() {
  print('Hello, World!');
}

void main(List<String> arguments) {
  print(arguments);
}
```

## Functions as First-Class Objects

Pass a function as a parameter:

```dart
void printElement(int element) {
  print(element);
}

var list = [1, 2, 3];
list.forEach(printElement);
```

Assign a function to a variable:

```dart
var loudify = (msg) => '!!! ${msg.toUpperCase()} !!!';
print(loudify('hello'));
```

## Anonymous Functions

Anonymous functions (lambdas/closures) have no name:

```dart
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
  print('${list.indexOf(item)}: $item');
});
```

Shorthand for single-expression functions:

```dart
list.forEach((item) => print('${list.indexOf(item)}: $item'));
```

## Lexical Closures

A closure is a function object that has access to variables in its lexical scope, even when the function is used outside of its original scope:

```dart
Function makeAdder(int added) {
  return (int i) => added + i;
}

var add2 = makeAdder(2);
var add4 = makeAdder(4);

print(add2(3)); // 5
print(add4(3)); // 7
```

## Returning Functions

Functions can return functions:

```dart
typedef IntFunction = int Function(int);

IntFunction multiplier(int factor) {
  return (int x) => x * factor;
}

var times3 = multiplier(3);
print(times3(4)); // 12
```

## Testing Functions for Equality

```dart
void foo() {}

void main() {
  print(foo == foo); // true
}
```

## Return Values

All functions return a value. If no return value is specified, `null` is returned implicitly (for non-void functions):

```dart
foo() {} // Returns null
```

## Generators

Dart supports synchronous and asynchronous generators.

### Synchronous Generator

Use `sync*` and `yield`:

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

### Asynchronous Generator

Use `async*` and `yield`:

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```

### yield*

Use `yield*` to yield values from another generator:

```dart
Iterable<int> recNaturals(int n) sync* {
  if (n > 0) {
    yield n;
    yield* recNaturals(n - 1);
  }
}
```

## Callable Objects

To allow a Dart class to be called like a function, implement the `call()` method:

```dart
class WannabeFunction {
  call(String a, String b, String c) => '$a $b $c!';
}

var wf = WannabeFunction();
var out = wf('Hi', 'there', 'guy');
```

## Async Functions

See `async.md` for details on `async`, `await`, `Future`, and `Stream`.
