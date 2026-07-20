# Types

## Type System

PHP has a dynamic type system with optional static type declarations (since PHP 7.0). Types are checked at runtime.

### Type Categories

| Category | Types |
|----------|-------|
| Scalar | `int`, `float`, `string`, `bool` |
| Compound | `array`, `object`, `callable`, `iterable` |
| Special | `null`, `mixed`, `void`, `never`, `resource` |
| Class types | `self`, `parent`, `static`, class names |
| Relative class types | `self`, `parent`, `static` |

## NULL

```php
$x = null;
var_dump($x); // NULL

// is_null() checks if value is null
$isNull = is_null($x);

// Null coalescing
$name = $_GET['name'] ?? 'default';

// Null safe operator (PHP 8.0+)
$country = $user?->address?->country;
```

## Booleans

```php
$flag = true;
$flag = false;

// Truthy values: non-empty strings, non-zero numbers, non-empty arrays, objects
// Falsy values: false, 0, 0.0, "", "0", [], null

// Strict comparison
if ($value === true) { ... }
```

## Integers

```php
$decimal = 42;
$hex = 0x2A;      // 42
$octal = 0o52;    // 42 (PHP 8.0+ explicit octal)
$binary = 0b101010; // 42

// Integer overflow converts to float
$big = PHP_INT_MAX + 1; // float

// Integer division
$quotient = intdiv(7, 2); // 3
$remainder = 7 % 2;       // 1
```

## Floating Point Numbers

```php
$float = 3.14;
$scientific = 1.0e3; // 1000.0
$nan = NAN;
$inf = INF;

// Float comparison (avoid direct equality)
// Use abs($a - $b) < EPSILON instead
```

## Strings

```php
// Single-quoted — no interpolation (except \' and \\)
$s = 'Hello, $name'; // literal $name

// Double-quoted — interpolation
$name = "World";
$s = "Hello, $name";     // Hello, World
$s = "Hello, {$name}!";  // Hello, World!
$s = "Hello, {$obj->name}!";
$s = "Hello, {$arr['name']}!";

// Heredoc (interpolation)
$html = <<<HTML
<div>$content</div>
HTML;

// Nowdoc (no interpolation)
$template = <<<'TPL'
<div>$content</div>
TPL;

// String functions
$len = strlen("hello");           // 5
$upper = strtoupper("hello");     // HELLO
$lower = strtolower("HELLO");     // hello
$pos = strpos("hello world", "world"); // 6
$sub = substr("hello world", 0, 5);    // hello
$replaced = str_replace("world", "PHP", "hello world"); // hello PHP
$trimmed = trim("  hello  ");     // hello
$split = explode(",", "a,b,c");   // ["a", "b", "c"]
$joined = implode(",", ["a", "b", "c"]); // "a,b,c"
```

## Arrays

PHP arrays are ordered maps (hash tables). They can act as lists, maps, stacks, queues, and sets.

```php
// Indexed array
$fruits = ["apple", "banana", "cherry"];

// Associative array
$person = [
    "name" => "Alice",
    "age" => 30,
    "email" => "alice@example.com",
];

// Mixed
$mixed = [
    0 => "first",
    "name" => "Alice",
    1 => "second",
];

// Multi-dimensional
$matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

// Array destructuring (PHP 7.1+)
[$a, $b, $c] = [1, 2, 3];
["name" => $name, "age" => $age] = $person;

// Spread operator (PHP 7.4+ indexed, 8.1+ string keys)
$merged = [...$arr1, ...$arr2];

// Array functions
count($fruits);                    // 3
in_array("apple", $fruits);        // true
array_key_exists("name", $person); // true
array_push($fruits, "date");       // add to end
$last = array_pop($fruits);        // remove from end
$first = array_shift($fruits);     // remove from beginning
array_unshift($fruits, "avocado"); // add to beginning
$reversed = array_reverse($fruits);
$filtered = array_filter($arr, fn($x) => $x > 0);
$mapped = array_map(fn($x) => $x * 2, $arr);
$reduced = array_reduce($arr, fn($carry, $item) => $carry + $item, 0);
$keys = array_keys($person);
$values = array_values($person);
$chunked = array_chunk($arr, 2);
$sliced = array_slice($arr, 1, 2);
$unique = array_unique($arr);
$sorted = sort($arr);              // in-place, indexed
$assocSorted = asort($arr);        // in-place, maintains keys
```

## Objects

```php
$obj = new stdClass();
$obj->name = "Alice";
$obj->age = 30;

// Cast to object
$obj = (object) ["name" => "Alice", "age" => 30];

// instanceof
if ($obj instanceof stdClass) { ... }
```

## Callables

```php
// String callable
$callable = 'strlen';

// Array callable (object method)
$callable = [$object, 'methodName'];
$callable = [ClassName::class, 'staticMethod'];

// Closure
$callable = fn($x) => $x * 2;
$callable = function ($x) { return $x * 2; };

// First-class callable syntax (PHP 8.1+)
$callable = strlen(...);
$callable = $object->method(...);
$callable = ClassName::staticMethod(...);

// Invoking
$result = $callable("hello");

// is_callable
is_callable($callable); // true

// as type declaration
function process(callable $fn): void { ... }
```

## Iterables

```php
// iterable accepts arrays and Traversable objects
function process(iterable $items): void {
    foreach ($items as $item) {
        echo $item;
    }
}

process([1, 2, 3]);
process(new ArrayObject([1, 2, 3]));
process(myGenerator()); // generators are iterable
```

## Type Declarations

```php
// Function parameter types
function add(int $a, int $b): int {
    return $a + $b;
}

// Nullable types
function find(?int $id): ?string { ... }

// Union types (PHP 8.0+)
function process(int|string $id): void { ... }

// Intersection types (PHP 8.1+)
function process(Countable&Iterator $obj): void { ... }

// DNF types (PHP 8.2+)
function process((A&B)|null $obj): void { ... }

// Return types
function getItems(): array { ... }
function process(): void { ... }      // no return value
function loop(): never { ... }        // never returns (exit, throw, infinite loop)
function create(): static { ... }     // returns same class (late static binding)

// Strict mode (per-file)
declare(strict_types=1);

// Coercive mode (default) — attempts type juggling
```

## Type Juggling

```php
// PHP automatically converts types in most contexts
$sum = "10" + 5;       // int(15)
$concat = "10" . 5;    // string("105")
$bool = 0 == "foo";    // true (pre-8.0), false (8.0+)
$bool = 0 === "foo";   // false (always)

// Explicit casting
$int = (int) "42";
$float = (float) "3.14";
$string = (string) 42;
$array = (array) $obj;
$object = (object) ["name" => "Alice"];

// Type checking functions
is_int($x), is_float($x), is_string($x), is_bool($x),
is_array($x), is_object($x), is_null($x), is_callable($x),
is_iterable($x), is_countable($x), is_numeric($x)
```
