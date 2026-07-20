# Exceptions

## Basic try/catch/finally

```php
try {
    $result = riskyOperation();
} catch (SpecificException $e) {
    // handle specific exception
    echo $e->getMessage();
} catch (AnotherException $e) {
    // handle another exception
} catch (Exception $e) {
    // catch-all for any Exception
} finally {
    // always executes, even if exception is thrown or return is used
    cleanup();
}
```

## Multiple Catch Types (PHP 8.0+)

```php
try {
    // ...
} catch (NetworkException | TimeoutException $e) {
    // handle multiple exception types in one catch
    echo $e->getMessage();
}
```

## Optional Catch Variable (PHP 8.0+)

```php
try {
    // ...
} catch (SpecificException) {
    // variable not needed if we don't use the exception object
    log("Specific exception occurred");
}
```

## throw as Expression (PHP 8.0+)

```php
// throw is now an expression, usable in any expression context
$value = $input ?? throw new InvalidArgumentException("Input required");

// In arrow functions
$getValue = fn() => throw new RuntimeException("No value");

// In match
$result = match($status) {
    200 => $data,
    default => throw new RuntimeException("Unexpected status: $status"),
};

// In ternary
$result = $nullable ?? throw new Exception("null");
```

## Extending Exceptions

```php
class ValidationException extends Exception {
    public function __construct(
        string $message,
        public readonly array $errors = [],
        int $code = 0,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
}

class UserNotFoundException extends Exception {
    public function __construct(int $userId) {
        parent::__construct("User with ID $userId not found");
    }
}
```

## Exception Hierarchy

```
Throwable
├── Error (see errors.md)
└── Exception
    ├── RuntimeException
    │   ├── OutOfBoundsException
    │   ├── OutOfRangeException
    │   ├── OverflowException
    │   ├── UnderflowException
    │   ├── UnexpectedValueException
    │   └── JsonException
    ├── LogicException
    │   ├── BadFunctionCallException
    │   ├── BadMethodCallException
    │   ├── DomainException
    │   ├── InvalidArgumentException
    │   └── LengthException
    ├── PDOException
    ├── DateException (PHP 8.3+)
    ├── ReflectionException
    └── ... (extension-specific)
```

## Global Exception Handler

```php
set_exception_handler(function (Throwable $e): void {
    error_log("Uncaught " . get_class($e) . ": " . $e->getMessage());
    error_log("File: " . $e->getFile() . ":" . $e->getLine());
    error_log("Stack trace:\n" . $e->getTraceAsString());

    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, "Fatal error: " . $e->getMessage() . "\n");
    } else {
        http_response_code(500);
        echo "Internal Server Error";
    }
});
```

## Exception Bubbling

```php
function processOrder(int $orderId): void {
    try {
        $order = fetchOrder($orderId); // may throw DBException
        validateOrder($order);         // may throw ValidationException
    } catch (ValidationException $e) {
        // Handle validation, re-throw others
        log("Validation failed: " . $e->getMessage());
        throw $e; // re-throw to caller
    }
    // DBException bubbles up to caller
}
```

## Exception Chaining

```php
try {
    $db->query("SELECT * FROM users");
} catch (PDOException $e) {
    // Chain exceptions — original is accessible via getPrevious()
    throw new DatabaseException("Failed to fetch users", 0, $e);
}

// Access previous
$previous = $exception->getPrevious();
```

## Throwable Interface

Both `Error` and `Exception` implement `Throwable`. You can catch both:

```php
try {
    // ...
} catch (Throwable $e) {
    // catches both Errors and Exceptions
    echo $e->getMessage();
}
```

## Exception Methods

```php
$e->getMessage();      // exception message
$e->getCode();         // exception code
$e->getFile();         // file where exception was thrown
$e->getLine();         // line where exception was thrown
$e->getPrevious();     // previous exception (chained)
$e->getTrace();        // array of backtrace
$e->getTraceAsString(); // formatted backtrace string
```

## Best Practices

- Throw exceptions for exceptional conditions, not for normal flow control
- Create specific exception classes for your domain
- Always catch the most specific exception first
- Use `finally` for cleanup (closing resources)
- Don't catch exceptions you can't handle — let them bubble up
- Log exceptions with stack traces
- Convert errors to exceptions with `set_error_handler`
- Use `throw` as expression for concise validation
- Set a global exception handler as a safety net
