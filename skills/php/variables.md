# Variables

## Basics

PHP variables start with `$` followed by the variable name. Names are case-sensitive and follow `^[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*$`.

```php
$name = "Alice";
$age = 30;
$_private = "internal";
$中文 = "unicode names allowed";
```

## Predefined Variables

| Variable | Description |
|----------|-------------|
| `$GLOBALS` | References all variables in global scope |
| `$_SERVER` | Server and execution environment info |
| `$_GET` | HTTP GET variables |
| `$_POST` | HTTP POST variables |
| `$_FILES` | HTTP File Upload variables |
| `$_REQUEST` | `$_GET` + `$_POST` + `$_COOKIE` |
| `$_SESSION` | Session variables |
| `$_ENV` | Environment variables |
| `$_COOKIE` | HTTP Cookies |
| `$argc` | Number of arguments passed to script |
| `$argv` | Array of arguments passed to script |

```php
// Accessing superglobals
$name = $_POST['name'] ?? 'default';
$ip = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
```

## Variable Scope

### Global scope

Variables defined outside functions are not accessible inside functions.

```php
$counter = 0;

function increment(): void {
    global $counter; // import from global scope
    $counter++;
}

// Better: use $GLOBALS
function increment2(): void {
    $GLOBALS['counter']++;
}
```

### Function scope

Variables inside functions are local by default.

```php
function test(): void {
    $local = "only visible here";
}
```

### Static variables

Preserve value between function calls.

```php
function counter(): int {
    static $count = 0;
    return ++$count;
}

echo counter(); // 1
echo counter(); // 2
echo counter(); // 3
```

## Variable Variables

```php
$name = "foo";
$$name = "bar";     // creates $foo = "bar"
echo $foo;          // bar

// With arrays
${$name . "_id"} = 42; // creates $foo_id = 42
```

## Variables From External Sources

```php
// GET parameters
$id = $_GET['id'] ?? null;

// POST data
$email = $_POST['email'] ?? '';

// Cookies
$theme = $_COOKIE['theme'] ?? 'light';

// File uploads
if (isset($_FILES['avatar'])) {
    $file = $_FILES['avatar'];
    $tmpPath = $file['tmp_name'];
    $name = $file['name'];
    $size = $file['size'];
    $error = $file['error'];
    move_uploaded_file($tmpPath, "/uploads/$name");
}

// Environment variables
$dbHost = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
```

## Destructuring

```php
// List destructuring
[$a, $b, $c] = [1, 2, 3];
[$a, , $c] = [1, 2, 3]; // skip elements

// Associative destructuring (PHP 7.1+)
["name" => $name, "age" => $age] = $person;

// Nested destructuring
[[$a, $b], [$c, $d]] = [[1, 2], [3, 4]];

// With list() (legacy)
list($a, $b, $c) = [1, 2, 3];
```

## isset, unset, empty

```php
// isset — check if variable is set and not null
if (isset($name)) { ... }
if (isset($arr['key'])) { ... }
if (isset($a, $b, $c)) { ... } // all must be set

// unset — destroy a variable
unset($name);
unset($arr['key']);
unset($a, $b, $c);

// empty — check if variable is empty (falsy)
if (empty($name)) { ... }
// true for: 0, "0", "", null, false, [], []
```
