# Callable Objects

Learn how to create and use callable objects in Dart.

## Overview

To allow an instance of your Dart class to be called like a function, implement the `call()` method. The `call()` method allows an instance of any class that defines it to emulate a function. This method supports the same functionality as normal functions such as parameters and return types.

## Example

```dart
class WannabeFunction {
  String call(String a, String b, String c) => '$a $b $c!';
}

var wf = WannabeFunction();
var out = wf('Hi', 'there,', 'gang');

void main() => print(out); // Hi there, gang!
```

## Use cases

Callable objects are useful when you want:

- A class that behaves like a function while maintaining state
- To pass an object where a function is expected
- To encapsulate complex logic behind a simple call interface

```dart
class Multiplier {
  final int factor;
  const Multiplier(this.factor);

  int call(int value) => value * factor;
}

void main() {
  const triple = Multiplier(3);
  print(triple(10)); // 30
  print(triple(5));  // 15
}
```

## Using callable objects as parameters

Since callable objects emulate functions, they can be passed where function types are expected:

```dart
void processValues(List<int> values, int Function(int) transformer) {
  for (var v in values) {
    print(transformer(v));
  }
}

void main() {
  const doubler = Multiplier(2);
  processValues([1, 2, 3], doubler); // Prints 2, 4, 6
}
```
