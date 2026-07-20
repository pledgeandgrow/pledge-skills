# Predefined Variables, Exceptions, Interfaces, and Attributes

## Predefined Variables (Superglobals)

Superglobals are always accessible in any scope.

### $_SERVER

```php
$_SERVER['PHP_SELF'];        // current script path
$_SERVER['REQUEST_METHOD'];  // GET, POST, etc.
$_SERVER['REQUEST_URI'];     // URI after domain
$_SERVER['HTTP_HOST'];       // host header
$_SERVER['HTTP_USER_AGENT']; // browser UA
$_SERVER['REMOTE_ADDR'];     // client IP
$_SERVER['SERVER_NAME'];     // server name
$_SERVER['SERVER_PORT'];     // server port
$_SERVER['HTTPS'];           // HTTPS on/off
$_SERVER['DOCUMENT_ROOT'];   // document root
$_SERVER['SCRIPT_FILENAME']; // full script path
$_SERVER['QUERY_STRING'];    // query string
```

### $_GET, $_POST, $_REQUEST

```php
// URL parameters: ?name=Alice&age=30
$name = $_GET['name'] ?? null;
$age = (int)($_GET['age'] ?? 0);

// POST form data
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// $_REQUEST = $_GET + $_POST + $_COOKIE (avoid — ambiguous)
```

### $_SESSION

```php
session_start();

$_SESSION['user_id'] = 42;
$_SESSION['flash_message'] = 'Saved successfully';

$userId = $_SESSION['user_id'] ?? null;

// Destroy session
session_unset();
session_destroy();
```

### $_COOKIE

```php
// Read cookies
$theme = $_COOKIE['theme'] ?? 'light';

// Set cookies (via header)
setcookie('theme', 'dark', time() + 86400, '/', '', true, true);
```

### $_FILES

```php
if (isset($_FILES['upload'])) {
    $file = $_FILES['upload'];
    // $file['name']     — original filename
    // $file['type']     — MIME type (unreliable, client-provided)
    // $file['tmp_name'] — temporary path
    // $file['error']    — error code (UPLOAD_ERR_OK = 0)
    // $file['size']     — file size in bytes

    if ($file['error'] === UPLOAD_ERR_OK) {
        move_uploaded_file($file['tmp_name'], '/uploads/' . $file['name']);
    }
}
```

### $_ENV

```php
$dbHost = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
```

### $GLOBALS

```php
$count = 0;

function increment(): void {
    $GLOBALS['count']++;
}
```

### $argc and $argv (CLI)

```php
// CLI: php script.php arg1 arg2
echo $argc;        // 3 (includes script name)
print_r($argv);    // ['script.php', 'arg1', 'arg2']
```

## Predefined Exceptions

### Core Exception Hierarchy

```
Exception
├── ErrorException
├── InvalidArgumentException
├── BadFunctionCallException
│   └── BadMethodCallException
├── DomainException
├── LengthException
├── LogicException
├── OutOfBoundsException
├── OutOfRangeException
├── OverflowException
├── RangeException
├── RuntimeException
│   ├── UnexpectedValueException
│   └── JsonException
├── PDOException
├── ReflectionException
├── DateException (PHP 8.3+)
│   ├── DateInvalidOperationException
│   ├── DateInvalidTimeZoneException
│   ├── DateMalformedIntervalStringException
│   ├── DateMalformedPeriodStringException
│   └── DateMalformedStringException
└── Random\RandomException (PHP 8.2+)
```

### Error Hierarchy (Throwable)

```
Error
├── ArithmeticError
│   └── DivisionByZeroError
├── AssertionError
├── ParseError
├── TypeError
│   ├── ArgumentCountError
│   └── ValueError
├── UnhandledMatchError
├── FiberError
├── DateError (PHP 8.3+)
│   ├── DateObjectError
│   └── DateRangeError
└── Random\RandomError (PHP 8.2+)
```

## Predefined Interfaces and Classes

### Traversable

Base interface for all traversable objects. Cannot be implemented directly — use `Iterator` or `IteratorAggregate`.

### Iterator

```php
interface Iterator extends Traversable {
    public function current(): mixed;
    public function key(): mixed;
    public function next(): void;
    public function rewind(): void;
    public function valid(): bool;
}
```

### IteratorAggregate

```php
interface IteratorAggregate extends Traversable {
    public function getIterator(): Traversable;
}

// Simpler than Iterator — return a Generator or array
class Collection implements IteratorAggregate {
    public function __construct(private array $items) {}

    public function getIterator(): Generator {
        yield from $this->items;
    }
}
```

### ArrayAccess

```php
interface ArrayAccess {
    public function offsetExists(mixed $offset): bool;
    public function offsetGet(mixed $offset): mixed;
    public function offsetSet(mixed $offset, mixed $value): void;
    public function offsetUnset(mixed $offset): void;
}

class TypedArray implements ArrayAccess {
    private array $data = [];

    public function offsetExists($offset): bool {
        return isset($this->data[$offset]);
    }

    public function offsetGet($offset): mixed {
        return $this->data[$offset] ?? null;
    }

    public function offsetSet($offset, $value): void {
        $this->data[$offset] = $value;
    }

    public function offsetUnset($offset): void {
        unset($this->data[$offset]);
    }
}
```

### Countable

```php
interface Countable {
    public function count(): int;
}

class Collection implements Countable {
    public function __construct(private array $items) {}

    public function count(): int {
        return count($this->items);
    }
}

$col = new Collection([1, 2, 3]);
echo count($col); // 3
```

### Stringable

```php
// Automatically implemented when __toString() is defined (PHP 8.0+)
class User {
    public function __toString(): string {
        return $this->name;
    }
}

$user = new User();
echo is_a($user, Stringable::class); // true
```

### Throwable

```php
interface Throwable {
    public function getMessage(): string;
    public function getCode(): int;
    public function getFile(): string;
    public function getLine(): int;
    public function getTrace(): array;
    public function getTraceAsString(): string;
    public function getPrevious(): ?Throwable;
    public function __toString(): string;
}
```

### Closure

```php
// Represents anonymous functions
$closure = function (int $x): int { return $x * 2; };

// Binding
$bound = Closure::bind($closure, $object);
$bound = $closure->bindTo($object);

// Call with explicit this
$result = $closure->call($object, 42);

// fromCallable
$fn = Closure::fromCallable('strlen');
```

### Generator

See `generators.md` for full reference.

### Fiber

See `fibers.md` for full reference.

### WeakReference (PHP 7.4+)

```php
$obj = new stdClass();
$ref = WeakReference::create($obj);

echo $ref->get() === $obj; // true

unset($obj);
echo $ref->get(); // null (doesn't prevent GC)
```

### WeakMap (PHP 8.0+)

```php
$map = new WeakMap();
$obj = new stdClass();

$map[$obj] = 'metadata';

echo $map[$obj]; // 'metadata'

unset($obj);
echo count($map); // 0 (entry removed when object destroyed)
```

### stdClass

Generic empty class for dynamic properties.

```php
$obj = new stdClass();
$obj->name = 'Alice';
$obj->age = 30;

// Or cast from array
$obj = (object) ['name' => 'Alice', 'age' => 30];
```

### SensitiveParameterValue (PHP 8.2+)

```php
function login(string $user, #[SensitiveParameter] string $pass): void {
    // In stack traces, $pass shows as SensitiveParameterValue object
    // preventing accidental exposure of secrets
}
```

## Predefined Attributes

See `attributes.md` for `#[Deprecated]`, `#[Override]`, `#[NoDiscard]`, `#[AllowDynamicProperties]`, `#[SensitiveParameter]`.
