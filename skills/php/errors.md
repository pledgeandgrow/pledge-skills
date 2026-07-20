# Errors

## Introduction

PHP reports errors, warnings, and notices for common coding and runtime problems. Since PHP 7.0, many fatal errors are thrown as `Error` objects (implementing `Throwable`), making them catchable.

## Error Levels

| Constant | Description | Fatal? |
|----------|-------------|--------|
| `E_ERROR` | Runtime fatal error | Yes |
| `E_WARNING` | Runtime warning | No |
| `E_PARSE` | Compile-time parse error | Yes |
| `E_NOTICE` | Runtime notice | No |
| `E_CORE_ERROR` | PHP startup fatal error | Yes |
| `E_CORE_WARNING` | PHP startup warning | No |
| `E_COMPILE_ERROR` | Zend compile fatal error | Yes |
| `E_COMPILE_WARNING` | Zend compile warning | No |
| `E_USER_ERROR` | User-triggered error | Yes |
| `E_USER_WARNING` | User-triggered warning | No |
| `E_USER_NOTICE` | User-triggered notice | No |
| `E_USER_DEPRECATED` | User-triggered deprecation | No |
| `E_STRICT` | Suggest code changes (removed in PHP 8.0) | No |
| `E_RECOVERABLE_ERROR` | Catchable fatal error | Yes* |
| `E_DEPRECATED` | Deprecated feature warning | No |
| `E_ALL` | All errors | - |

## Error Handling

### error_reporting

```php
// Set error reporting level
error_reporting(E_ALL);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
error_reporting(E_ERROR | E_WARNING | E_PARSE);

// In php.ini
// error_reporting = E_ALL
// display_errors = On (development) / Off (production)
// log_errors = On
// error_log = /var/log/php_errors.log
```

### Custom error handler

```php
set_error_handler(function (int $errno, string $errstr, string $errfile, int $errline): bool {
    if (!(error_reporting() & $errno)) {
        return false; // error not in reporting level
    }

    $level = match($errno) {
        E_WARNING, E_USER_WARNING => 'Warning',
        E_NOTICE, E_USER_NOTICE => 'Notice',
        E_DEPRECATED, E_USER_DEPRECATED => 'Deprecated',
        default => 'Error',
    };

    error_log("[$level] $errstr in $errfile:$errline");
    return true; // prevent default handler
});

// Restore previous handler
restore_error_handler();
```

### Error to Exception conversion

```php
set_error_handler(function (int $errno, string $errstr, string $errfile, int $errline): bool {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});
```

## Error Class Hierarchy (PHP 7+)

```
Throwable
├── Error
│   ├── ArithmeticError
│   │   └── DivisionByZeroError
│   ├── AssertionError
│   ├── ParseError
│   ├── TypeError
│   │   ├── ArgumentCountError
│   │   └── ValueError (PHP 8.0+)
│   ├── UnhandledMatchError (PHP 8.0+)
│   ├── FiberError (PHP 8.1+)
│   └── DateError (PHP 8.3+)
│       ├── DateObjectError
│       ├── DateRangeError
│       └── ...
└── Exception
    └── (see exceptions.md)
```

## Triggering Errors

```php
// trigger_error — for user-level errors
trigger_error("Custom error message", E_USER_WARNING);
trigger_error("Deprecated function called", E_USER_DEPRECATED);

// In production code, prefer throwing exceptions instead
```

## Best Practices

- Set `error_reporting = E_ALL` in development
- Set `display_errors = Off` and `log_errors = On` in production
- Use a custom error handler to convert errors to exceptions
- Use `declare(strict_types=1)` to catch type mismatches early
- Never suppress errors with `@` — use proper error handling
- Log all errors to a file or monitoring service
