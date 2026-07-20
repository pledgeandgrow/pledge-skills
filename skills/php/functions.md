# Functions

## User-Defined Functions

```php
function add(int $a, int $b): int {
    return $a + $b;
}

// Function names are case-insensitive
add(1, 2);
ADD(1, 2); // same function
```

## Function Parameters and Arguments

### By value (default)

```php
function modify(int $x): void {
    $x = 10; // doesn't affect original
}
```

### By reference

```php
function modify(int &$x): void {
    $x = 10; // modifies original
}

$value = 5;
modify($value);
echo $value; // 10
```

### Default parameters

```php
function greet(string $name, string $greeting = "Hello"): string {
    return "$greeting, $name!";
}

greet("Alice");              // "Hello, Alice!"
greet("Alice", "Hi");        // "Hi, Alice!"
```

### Named arguments (PHP 8.0+)

```php
function createUser(string $name, int $age, string $role = "user", bool $active = true): array {
    return compact('name', 'age', 'role', 'active');
}

// Named arguments — order doesn't matter
createUser(name: "Alice", age: 30);
createUser(age: 30, name: "Alice");
createUser(name: "Bob", age: 25, active: false);

// Mixing positional and named
createUser("Alice", 30, role: "admin");
```

### Variadic parameters

```php
function sum(int ...$numbers): int {
    return array_sum($numbers);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15

// Spread operator when calling
$nums = [1, 2, 3];
sum(...$nums); // 6
```

### First-class callable syntax (PHP 8.1+)

```php
// Create Closure from any callable
$fn = strlen(...);
$fn = $obj->method(...);
$fn = ClassName::staticMethod(...);

// Equivalent to Closure::fromCallable()
$fn = Closure::fromCallable('strlen');
```

## Returning Values

```php
function divide(float $a, float $b): float {
    if ($b === 0.0) {
        throw new DivisionByZeroError("Cannot divide by zero");
    }
    return $a / $b;
}

// Return type declarations
function getItems(): array { ... }
function getName(): string { ... }
function find(int $id): ?User { ... }     // nullable
function process(): void { ... }          // no return
function loop(): never { die(); }         // never returns

// Return by reference
function &getReference(): array {
    static $data = [];
    return $data;
}

// Multiple return values (via array destructuring)
function getUserInfo(): array {
    return ["Alice", 30, "alice@example.com"];
}
[$name, $age, $email] = getUserInfo();
```

## Variable Functions

```php
function foo(): void { echo "foo"; }

$func = "foo";
$func(); // calls foo()

// With object methods
$method = "bar";
$obj->$method(); // calls $obj->bar()

// With static methods
$method = "baz";
ClassName::$method(); // calls ClassName::baz()
```

## Anonymous Functions (Closures)

```php
// Anonymous function
$multiply = function (int $a, int $b): int {
    return $a * $b;
};

// Capture by value (default)
$x = 10;
$add = function (int $n) use ($x): int {
    return $n + $x;
};

// Capture by reference
$counter = 0;
$increment = function () use (&$counter): void {
    $counter++;
};

// Closure::fromCallable()
$fn = Closure::fromCallable('strlen');
$fn = Closure::fromCallable([$obj, 'method']);
```

## Arrow Functions (PHP 7.4+)

Arrow functions are concise closures that automatically capture by value.

```php
// Arrow function
$square = fn(int $x): int => $x * $x;

// With captured variables (auto-capture by value)
$multiplier = 3;
$multiply = fn(int $x): int => $x * $multiplier;

// Nested arrow functions
$curry = fn(int $a) => fn(int $b) => $a + $b;
$add5 = $curry(5);
echo $add5(3); // 8

// In array functions
$filtered = array_filter($arr, fn($x) => $x > 0);
$mapped = array_map(fn($x) => $x * 2, $arr);
$reduced = array_reduce($arr, fn($carry, $item) => $carry + $item, 0);
```

## Internal (Built-in) Functions

PHP has thousands of built-in functions organized into extensions.

```php
// String functions
strlen(), strpos(), substr(), str_replace(), trim(), explode(), implode()
strtolower(), strtoupper(), ucfirst(), lcfirst(), str_pad(), str_repeat()

// Array functions
count(), array_push(), array_pop(), array_shift(), array_unshift()
array_map(), array_filter(), array_reduce(), array_merge(), array_slice()
sort(), rsort(), asort(), arsort(), usort(), uasort(), uksort()
in_array(), array_search(), array_key_exists(), array_keys(), array_values()

// Math functions
abs(), ceil(), floor(), round(), max(), min(), sqrt(), pow(), log(), exp()
rand(), mt_rand(), random_int(), random_bytes()

// Type functions
is_int(), is_float(), is_string(), is_bool(), is_array(), is_object()
is_null(), is_callable(), is_iterable(), is_countable(), is_numeric()
gettype(), settype(), intval(), floatval(), strval(), boolval()

// See stdlib-*.md files for comprehensive extension reference
```
