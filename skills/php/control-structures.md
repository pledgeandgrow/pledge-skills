# Control Structures

## if / else / elseif

```php
if ($x > 0) {
    echo "positive";
} elseif ($x < 0) {
    echo "negative";
} else {
    echo "zero";
}

// Alternative syntax (useful in HTML templates)
if ($x > 0):
    echo "positive";
elseif ($x < 0):
    echo "negative";
else:
    echo "zero";
endif;
```

## while / do-while

```php
while ($condition) {
    // ...
}

// Alternative syntax
while ($condition):
    // ...
endwhile;

// do-while (executes at least once)
do {
    // ...
} while ($condition);
```

## for

```php
for ($i = 0; $i < 10; $i++) {
    echo $i;
}

// Alternative syntax
for ($i = 0; $i < 10; $i++):
    echo $i;
endfor;

// Multiple expressions
for ($i = 0, $j = 10; $i < $j; $i++, $j--) {
    echo "$i $j\n";
}
```

## foreach

```php
// Values only
foreach ($items as $item) {
    echo $item;
}

// Key and value
foreach ($items as $key => $value) {
    echo "$key: $value\n";
}

// By reference (modify original array)
foreach ($items as &$item) {
    $item *= 2;
}
unset($item); // break the reference

// Alternative syntax
foreach ($items as $item):
    echo $item;
endforeach;

// Destructuring in foreach (PHP 7.1+)
foreach ($users as ["name" => $name, "age" => $age]) {
    echo "$name is $age years old\n";
}
```

## break and continue

```php
// break — exit loop
for ($i = 0; $i < 10; $i++) {
    if ($i == 5) break;
    echo $i;
}

// break with level
for ($i = 0; $i < 10; $i++) {
    for ($j = 0; $j < 10; $j++) {
        if ($j == 5) break 2; // break out of both loops
    }
}

// continue — skip to next iteration
for ($i = 0; $i < 10; $i++) {
    if ($i % 2 == 0) continue;
    echo $i; // only odd numbers
}

// continue with level
for ($i = 0; $i < 3; $i++) {
    for ($j = 0; $j < 3; $j++) {
        if ($j == 1) continue 2; // skip to next $i iteration
    }
}
```

## switch

```php
switch ($status) {
    case 200:
    case 201:
        echo "Success";
        break;
    case 404:
        echo "Not Found";
        break;
    case 500:
        echo "Server Error";
        break;
    default:
        echo "Unknown";
}

// Alternative syntax
switch ($status):
    case 200:
        echo "Success";
        break;
    default:
        echo "Unknown";
endswitch;

// Match expression (PHP 8.0+) — preferred over switch
$result = match($status) {
    200, 201 => "Success",
    404 => "Not Found",
    500 => "Server Error",
    default => "Unknown",
};
```

## match (PHP 8.0+)

`match` is an expression that returns a value. It uses strict comparison (`===`) and must be exhaustive (or have a `default`).

```php
// Basic match
$result = match($status) {
    200 => 'OK',
    404 => 'Not Found',
    500 => 'Server Error',
    default => 'Unknown',
};

// Multiple values per arm
$result = match($statusCode) {
    200, 201, 204 => 'Success',
    301, 302 => 'Redirect',
    404 => 'Not Found',
    default => 'Error',
};

// No default — throws UnhandledMatchError if no match
$result = match($x) {
    1 => 'one',
    2 => 'two',
}; // throws if $x is not 1 or 2

// Match with conditions (PHP 8.0+)
$result = match(true) {
    $age < 18 => 'minor',
    $age < 65 => 'adult',
    default => 'senior',
};

// Match with expressions
$result = match($type) {
    'json' => json_encode($data),
    'xml' => $this->toXml($data),
    'csv' => $this->toCsv($data),
    default => throw new InvalidArgumentException("Unknown type: $type"),
};
```

## declare

```php
// strict_types — enforce strict type checking
declare(strict_types=1);

// ticks — register tick functions
declare(ticks=1);
register_tick_function('myTickFunction');

// encoding
declare(encoding='UTF-8');

// Multiple directives
declare(strict_types=1, ticks=1);

// Block-scoped declare
declare(strict_types=1):
    // strict mode for this block
enddeclare;
```

## return

```php
function add(int $a, int $b): int {
    return $a + $b;
}

// Return from included file
return ['config' => 'value'];

// In arrow functions
$fn = fn(int $x): int => $x * 2;
```

## require / include

```php
// require — fatal error (E_ERROR) if file not found
require 'config.php';

// require_once — include only once
require_once 'config.php';

// include — warning (E_WARNING) if file not found
include 'optional.php';

// include_once — include only once
include_once 'optional.php';

// Return value from included file
$config = require 'config.php'; // if config.php returns a value
```

## goto

```php
// Jump to a label within the same function
for ($i = 0; $i < 10; $i++) {
    for ($j = 0; $j < 10; $j++) {
        if ($found) {
            goto end;
        }
    }
}
end:
echo "Done";

// Cannot jump into loops or switch statements
// Cannot jump out of functions
```
