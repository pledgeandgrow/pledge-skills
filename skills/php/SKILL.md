---
name: php-docs
version: "8.5"
tags:
  - php
  - language
  - web
  - backend
  - scripting
  - oop
  - composer
  - pdo
description: |
  Comprehensive PHP 8.5 reference covering all language features: basic syntax, types (null, bool, int, float, string, array, object, callable, iterable, mixed, void, never), variables, constants, expressions, operators (arithmetic, assignment, bitwise, comparison, error control, execution, logical, string, array, type, functional), control structures (if, else, elseif, while, do-while, for, foreach, switch, match, declare, return, require, include, goto), functions (user-defined, parameters, arguments, returning values, variable functions, anonymous, arrow functions, first-class callable syntax), classes and objects (properties, property hooks, constants, autoloading, constructors, destructors, visibility, inheritance, static, abstract, interfaces, traits, anonymous classes, overloading, iteration, magic methods, final, cloning, late static bindings, serialization, covariance/contravariance, lazy objects), namespaces, enumerations (basic, backed, methods, traits, listing, serialization), errors, exceptions (try/catch/finally, extending, multiple catch types), fibers, generators, attributes, references, predefined variables/exceptions/interfaces/classes/attributes, security (sessions, filesystem, database, SQL injection, error reporting, user data), features (HTTP auth, cookies, sessions, file uploads, remote files, CLI, garbage collection), standard library extensions (strings, arrays, date/time, math, BCMath, GMP, hash, OpenSSL, password hashing, sodium, JSON, cURL, DOM, SimpleXML, XMLReader, XMLWriter, XSL, PDO, MySQL, PostgreSQL, SQLite3, MongoDB, Redis, SPL, reflection, fileinfo, filesystem, directories, compression, Phar, Zip, Zlib, Bzip2, intl, iconv, mbstring, gettext, GD, ImageMagick, Exif, PCNTL, POSIX, FFI, OPcache, output control, error handling, function handling, session handling, filter, ctype, FTP, IMAP, mail, SOAP, OAuth, XML-RPC, Solr, search engine, process control, program execution, readline), Composer/PIE package management, and migration guides (PHP 8.5, 8.4, 8.3, 8.2, 8.1, 8.0, 7.x).
  Use whenever the user mentions PHP, Composer, PDO, Laravel, Symfony, PHP CLI, PHP-FPM, or needs help with any PHP code, extension, or library usage.
---

# PHP Expert (8.5)

**Official Documentation:** https://www.php.net/manual/en/

## Quick Reference

| Topic | File |
|-------|------|
| Installation (Linux, macOS, Windows, Docker), php.ini config, web server setup, SAPI types | `getting-started.md` |
| PHP tags, escaping HTML, instruction separation, comments | `basics-syntax.md` |
| Types (null, bool, int, float, string, array, object, callable, iterable, mixed, void, never, resource), type declarations, type juggling | `types.md` |
| Variables, scope, predefined variables, variable variables, external sources | `variables.md` |
| Constants, define(), const, magic constants, predefined constants | `constants.md` |
| Operators (arithmetic, assignment, bitwise, comparison, error control, execution, logical, string, array, type, functional), precedence | `operators.md` |
| Control structures (if, else, elseif, while, do-while, for, foreach, switch, match, declare, return, require, include, goto) | `control-structures.md` |
| Functions, parameters, arguments, returning values, anonymous, arrow, first-class callable | `functions.md` |
| Classes, objects, properties, property hooks, constants, autoloading, constructors, visibility, inheritance, static, abstract, interfaces, traits, anonymous classes, overloading, magic methods, final, cloning, late static bindings, serialization, covariance/contravariance, lazy objects | `classes-objects.md` |
| Namespaces, sub-namespaces, importing/aliasing, global space, name resolution | `namespaces.md` |
| Enumerations (basic, backed, methods, static methods, constants, traits, listing, serialization) | `enums.md` |
| Errors, error levels, error handling, error reporting | `errors.md` |
| Exceptions, try/catch/finally, extending exceptions, multiple catch types, global handler | `exceptions.md` |
| Generators, yield, yield from, Generator class, comparison with Iterator | `generators.md` |
| Fibers, Fiber class, suspend/resume/throw, full-stack interruptible functions | `fibers.md` |
| Attributes, syntax, declaring attribute classes, reading with Reflection | `attributes.md` |
| References, reference counting, passing by reference, returning references | `references.md` |
| Predefined variables ($_SERVER, $_GET, $_POST, $_SESSION, $_ENV, $GLOBALS), predefined exceptions, predefined interfaces/classes, predefined attributes | `predefined.md` |
| Security (sessions, filesystem, database, SQL injection, error reporting, user data, hiding PHP, keeping current) | `security.md` |
| Features (HTTP auth, cookies, sessions, file uploads, remote files, connection handling, persistent DB connections, CLI, garbage collection, DTrace) | `features.md` |
| Standard library: strings, arrays, arrays sorting, function handling, output control, error handling | `stdlib-core.md` |
| Standard library: date/time (DateTime, DateTimeImmutable, DateTimeZone, DateInterval, DatePeriod), calendar, HRTime | `stdlib-date.md` |
| Standard library: math, BCMath, GMP, statistics, RoundingMode enum | `stdlib-math.md` |
| Standard library: hash, OpenSSL, password hashing, sodium, Rnp, Xpass | `stdlib-crypto.md` |
| Standard library: JSON, SimdJSON, cURL, DOM, SimpleXML, XMLReader, XMLWriter, XSL, XML-RPC | `stdlib-xml-json.md` |
| Standard library: PDO, MySQL (mysqli), PostgreSQL, SQLite3, MongoDB, OCI8, ODBC, DBA, SQLSRV | `stdlib-database.md` |
| Standard library: SPL (datastructures, iterators, exceptions, functions), reflection, fileinfo, filesystem, directories | `stdlib-spl-io.md` |
| Standard library: compression (Phar, Zip, Zlib, Bzip2, Rar, LZF), intl, iconv, mbstring, gettext, GD, ImageMagick, Exif | `stdlib-extended.md` |
| Standard library: PCNTL, POSIX, program execution, FFI, OPcache, session, filter, ctype, FTP, IMAP, mail, SOAP, OAuth, readline, APCu | `stdlib-services.md` |
| Standard library: server-specific (Apache, LiteSpeed, FPM), Solr, FDF, GnuPG, wkhtmltox, PS, XLSWriter, Radius, GeoIP, FANN, Igbinary, Lua, CommonMark, Event, Yar, Eio, Ev, Expect, Enchant, Gender, Quickhash, dBase, Firebird, CUBRID, IBM DB2, Componere | `stdlib-misc.md` |
| Composer, PIE, PECL, autoloading, dependency management, packaging | `composer.md` |
| PHP 8.5 new features, 8.4/8.3/8.2/8.1/8.0 migration, deprecated features, backward incompatible changes | `whats-new.md` |

## Core Philosophy

PHP is a **widely-used, dynamically typed, general-purpose** scripting language especially suited for web development. Key principles:

1. **Server-Side Scripting** — PHP code is executed on the server, generating HTML sent to the client
2. **Dynamic Typing** — types are determined at runtime, with type juggling and optional type declarations
3. **Embedded** — PHP can be embedded directly into HTML using `<?php ?>` tags
4. **Multi-Paradigm** — procedural, object-oriented, and functional styles all supported
5. **Cross-Platform** — runs on all major operating systems (Linux, macOS, Windows)
6. **Rich Extension System** — hundreds of built-in extensions for databases, crypto, XML, images, networking
7. **Composer** — modern dependency manager and package ecosystem
8. **JIT Compiler** — since PHP 8.0, a JIT compiler is available for improved performance

## Hello World

```php
<?php
echo "Hello, World!\n";

// With command-line args
echo "Args: " . implode(', ', array_slice($argv, 1)) . "\n";
```

## Variables

```php
// Dynamic typing — no declaration needed
$x = 42;        // int
$x = "hello";   // now string — variables can change type
$x = [1, 2, 3]; // now array

// Multiple assignment
$a = $b = $c = 0;

// Swap
[$a, $b] = [$b, $a];

// Destructuring
[$first, ...$rest] = [1, 2, 3, 4]; // $first=1, $rest=[2,3,4]
```

## Built-in Types Quick Reference

| Category | Types | Example |
|----------|-------|---------|
| Scalar | `int`, `float`, `string`, `bool` | `$x = 42;` |
| Compound | `array`, `object`, `callable`, `iterable` | `$arr = [1, 2];` |
| Special | `null`, `mixed`, `void`, `never`, `resource` | `$x = null;` |
| Class types | `self`, `parent`, `static`, class names | `function f(): static` |

## Operators

| Operator | Description |
|----------|-------------|
| `+` `-` `*` `/` `%` `**` | Arithmetic |
| `+=` `-=` `*=` `/=` `%=` `**=` `.`= | Augmented assignment |
| `==` `===` `!=` `!==` `<` `>` `<=` `>=` `<=>` | Comparison |
| `&&` `\|\|` `!` `and` `or` `xor` | Logical |
| `&` `\|` `^` `~` `<<` `>>` | Bitwise |
| `.` | String concatenation |
| `??` `?:` | Null coalescing, ternary |
| `instanceof` | Type check |
| `++` `--` | Increment/decrement |

## Control Flow Quick Reference

```php
// if/elseif/else
if ($x > 0) {
    echo "positive";
} elseif ($x < 0) {
    echo "negative";
} else {
    echo "zero";
}

// Ternary
$status = $x >= 0 ? "ok" : "error";

// Null coalescing
$name = $_GET['name'] ?? 'default';

// match (PHP 8.0+)
$result = match($status) {
    200, 300 => 'success',
    400 => 'not found',
    500 => 'server error',
    default => 'unknown',
};

// foreach
foreach ($items as $key => $value) {
    echo "$key: $value\n";
}

// for
for ($i = 0; $i < 10; $i++) {
    echo $i;
}

// while
while ($condition) {
    do_something();
}

// do-while
do {
    do_something();
} while ($condition);
```

## Functions Quick Reference

```php
// Basic function
function add(int $a, int $b): int {
    return $a + $b;
}

// Default parameters
function greet(string $name, string $greeting = "Hello"): string {
    return "$greeting, $name!";
}

// Variadic + named arguments (PHP 8.0+)
function func(...$args): void {
    print_r($args);
}

func(name: "Alice", age: 30); // named args

// Arrow function (PHP 7.4+)
$square = fn(int $x): int => $x * $x;

// First-class callable syntax (PHP 8.1+)
$callable = strlen(...);
$callable = Closure::fromCallable('strlen');

// Anonymous function / Closure
$multiply = function (int $a, int $b): int {
    return $a * $b;
};
```

## Classes Quick Reference

```php
// Basic class
class Dog {
    public function __construct(
        public readonly string $name,  // constructor property promotion (PHP 8.0+)
    ) {}

    public function bark(): string {
        return "{$this->name} says woof!";
    }
}

// Enum (PHP 8.1+)
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string {
        return ucfirst($this->value);
    }
}

// Interface + Trait
interface Repository {
    public function find(int $id): ?object;
}

trait Timestampable {
    public ?DateTimeImmutable $createdAt = null;
    public ?DateTimeImmutable $updatedAt = null;
}

class User implements Repository {
    use Timestampable;

    public function __construct(
        public readonly int $id,
        public readonly string $email,
    ) {}

    public function find(int $id): ?object {
        // implementation
        return null;
    }
}

// Property hooks (PHP 8.4+)
class Account {
    private string $name = '';

    public string $displayName {
        get => $this->name ?: 'Anonymous';
        set => $this->name = trim($value);
    }
}
```

## Installation & Setup

```bash
# Check version
php --version

# Built-in development server
php -S localhost:8000

# Run a script
php script.php

# Built-in REPL
php -a

# Composer (package manager)
composer init
composer install
composer require vendor/package
composer update

# Create project from package
composer create-project laravel/laravel myapp
```

## Project Creation

```bash
# Simple project
mkdir myproject && cd myproject
composer init --name="acme/myproject" --type="library" --license="MIT"

# With autoloading (PSR-4)
# composer.json:
# {
#   "autoload": {
#     "psr-4": { "Acme\\": "src/" }
#   }
# }
composer dump-autoload

# Laravel project
composer create-project laravel/laravel myapp
cd myapp
php artisan serve

# Symfony project
composer create-project symfony/skeleton myapp
cd myapp
php -S localhost:8000 -t public
```
