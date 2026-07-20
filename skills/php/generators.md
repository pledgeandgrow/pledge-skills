# Generators

## Overview

Generators provide an easy way to implement iterators without needing to build a class that implements the `Iterator` interface. They use the `yield` keyword to return values one at a time, pausing execution between each value.

## Generator Syntax

```php
function simpleGenerator(): Generator {
    yield 1;
    yield 2;
    yield 3;
}

foreach (simpleGenerator() as $value) {
    echo $value; // 1, 2, 3
}
```

## Yielding Key-Value Pairs

```php
function keyValueGenerator(): Generator {
    yield 'a' => 1;
    yield 'b' => 2;
    yield 'c' => 3;
}

foreach (keyValueGenerator() as $key => $value) {
    echo "$key=$value\n"; // a=1, b=2, c=3
}
```

## yield from (Delegating Generators)

```php
function inner(): Generator {
    yield 1;
    yield 2;
}

function outer(): Generator {
    yield 0;
    yield from inner();
    yield from [3, 4];
    yield from new ArrayIterator([5, 6]);
    yield 7;
}

foreach (outer() as $value) {
    echo $value; // 0, 1, 2, 3, 4, 5, 6, 7
}
```

## Sending Values to Generators

```php
function accumulator(): Generator {
    $total = 0;
    while (true) {
        $value = yield $total;
        $total += $value;
    }
}

$gen = accumulator();
$gen->send(10); // 10
$gen->send(20); // 30
$gen->send(5);  // 35
```

## Returning Values from Generators

```php
function rangeGen(int $start, int $end): Generator {
    for ($i = $start; $i <= $end; $i++) {
        yield $i;
    }
    return $end - $start + 1; // count
}

$gen = rangeGen(1, 5);
foreach ($gen as $value) {
    echo $value; // 1, 2, 3, 4, 5
}
echo $gen->getReturn(); // 5 (count)
```

## Throwing into Generators

```php
function safeGen(): Generator {
    try {
        yield 1;
        yield 2;
    } catch (Exception $e) {
        echo "Caught: {$e->getMessage()}\n";
        yield 3;
    }
}

$gen = safeGen();
$gen->current(); // 1
$gen->next();    // 2
$gen->throw(new Exception("Oops")); // "Caught: Oops", then 3
```

## Generator Methods

```php
$gen = simpleGenerator();

$gen->current();     // current value
$gen->key();         // current key
$gen->next();        // advance
$gen->rewind();      // rewind to start (only before first yield)
$gen->valid();       // check if more values
$gen->send($value);  // send value to generator, get next yield
$gen->throw($e);     // throw exception into generator
$gen->getReturn();   // return value after generator completes
```

## Practical Examples

### Reading large files line by line

```php
function readLines(string $filename): Generator {
    $handle = fopen($filename, 'r');
    if (!$handle) return;
    try {
        while (($line = fgets($handle)) !== false) {
            yield rtrim($line);
        }
    } finally {
        fclose($handle);
    }
}

foreach (readLines('large_file.txt') as $lineNumber => $line) {
    echo "$lineNumber: $line\n";
}
```

### Infinite sequences

```php
function fibonacci(): Generator {
    [$a, $b] = [0, 1];
    while (true) {
        yield $a;
        [$a, $b] = [$b, $a + $b];
    }
}

$fib = fibonacci();
foreach ($fib as $n) {
    if ($n > 1000) break;
    echo $n . ' ';
}
// 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

### Pipeline processing

```php
function numbers(int $max): Generator {
    for ($i = 1; $i <= $max; $i++) yield $i;
}

function filter(Generator $gen, callable $fn): Generator {
    foreach ($gen as $value) {
        if ($fn($value)) yield $value;
    }
}

function map(Generator $gen, callable $fn): Generator {
    foreach ($gen as $value) {
        yield $fn($value);
    }
}

$result = map(filter(numbers(100), fn($n) => $n % 2 === 0), fn($n) => $n * $n);
foreach ($result as $value) {
    echo $value . ' '; // 4, 16, 36, 64, ...
}
```

## Comparing Generators with Iterator Objects

| Feature | Generator | Iterator Class |
|---------|-----------|----------------|
| Boilerplate | Minimal (just `yield`) | Must implement 5 methods |
| State | Automatic (paused/resumed) | Manual |
| Memory | Lazy — one item at a time | Depends on implementation |
| Bidirectional | `send()`, `throw()` | Not built-in |
| Return value | `getReturn()` | N/A |

Generators are preferred for simple iteration. Use `Iterator` classes when you need more control or reusable iteration logic.
