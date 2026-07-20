# What's New & Migration Guide

## PHP 8.5 (Upcoming)

### New Features

- **Property hooks** improvements and refinements
- **`#[Deprecated]` attribute** — marks functions/methods as deprecated with custom message
- **`#[NoDiscard]` attribute** — warns when return value is ignored
- **New classes and interfaces** — see migration85.new-classes
- **New functions** — see migration85.new-functions
- **New global constants** — see migration85.constants

### Migration

- Review backward incompatible changes: https://www.php.net/manual/en/migration85.incompatible.php
- Check deprecated features: https://www.php.net/manual/en/migration85.deprecated.php
- Test on staging before production upgrade

## PHP 8.4

### New Features

- **Property hooks** — computed properties with `get`/`set` syntax
  ```php
  class User {
      public string $displayName {
          get => $this->name ?: 'Anonymous';
          set => $this->name = trim($value);
      }
  }
  ```
- **Asymmetric visibility** — `public private(set)` visibility
  ```php
  class Product {
      public private(set) int $price;
  }
  ```
- **`new` in attribute defaults** — `new Foo()` in parameter defaults
  ```php
  class MyClass {
      public function __construct(
          public Foo $foo = new Foo(),
      ) {}
  }
  ```
- **`#[Deprecated]` attribute**
- **`#[NoDiscard]` attribute**
- **`mb_trim`, `mb_ltrim`, `mb_rtrim`** functions
- **`BcMath\Number`** object for BCMath
- **`Dom\HTMLDocument`** — modern HTML5 parser
- **Lazy objects** — `ReflectionClass::newLazyGhost()`
- **`array_find`, `array_find_key`, `array_any`, `array_all`** functions
- **RoundingMode enum** for `round()`
- **New `print` is an expression** — returns `1`

### Migration

- Review: https://www.php.net/manual/en/migration84.php
- Backward incompatible changes: https://www.php.net/manual/en/migration84.incompatible.php
- Deprecated features: https://www.php.net/manual/en/migration84.deprecated.php
- Removed extensions: https://www.php.net/manual/en/migration84.removed-extensions.php

## PHP 8.3

### New Features

- **Typed class constants**
  ```php
  class Config {
      public const string API_URL = 'https://api.example.com';
      public const int TIMEOUT = 30;
      public const array ENDPOINTS = ['users', 'posts'];
  }
  ```
- **`#[Override]` attribute** — validates method overrides parent
  ```php
  class Derived extends Base {
      #[Override]
      public function process(): void {}
  }
  ```
- **`json_validate()`** function — validate JSON string without decoding
- **`Randomizer::getBytesFromString()`** — random string from charset
- **`Randomizer::getFloat()` / `nextFloat()`** — random floats
- **Dynamic class constant fetch** — `$class::{$name}`
  ```php
  $name = 'MAX_USERS';
  echo Config::{$name};
  ```
- **`DateInterval::createFromDateString()`** — proper ISO 8601 support
- **`gc_status()` improvements** — more detailed GC info
- **`WeakMap` now supports all countable operations**

### Migration

- Review: https://www.php.net/manual/en/migration83.php
- Backward incompatible changes: https://www.php.net/manual/en/migration83.incompatible.php
- Deprecated features: https://www.php.net/manual/en/migration83.deprecated.php

## PHP 8.2

### New Features

- **Readonly classes**
  ```php
  readonly class Point {
      public function __construct(
          public float $x,
          public float $y,
      ) {}
  }
  ```
- **DNF types** (Disjunctive Normal Form)
  ```php
  function process((A&B)|null $obj): void {}
  ```
- **`null`, `false`, `true` as standalone types**
  ```php
  function alwaysTrue(): true { return true; }
  function alwaysNull(): null { return null; }
  ```
- **`Random` extension** — new object-oriented random number generator
  ```php
  use Random\Randomizer;
  $randomizer = new Randomizer();
  $randomizer->shuffleBytes($string);
  $randomizer->shuffleArray($array);
  ```
- **`#[SensitiveParameter]` attribute** — redacts in stack traces
- **`#[AllowDynamicProperties]` attribute** — opt-in for dynamic properties
- **Constants in traits**
- **`${var}` string interpolation deprecated** — use `{$var}` instead

### Migration

- Review: https://www.php.net/manual/en/migration82.php
- Backward incompatible changes: https://www.php.net/manual/en/migration82.incompatible.php
- Deprecated features: https://www.php.net/manual/en/migration82.deprecated.php
- **Dynamic properties deprecated** — use `#[AllowDynamicProperties]` or typed properties

## PHP 8.1

### New Features

- **Enums**
  ```php
  enum Status: string {
      case Active = 'active';
      case Inactive = 'inactive';
  }
  ```
- **Fibers** — full-stack interruptible functions
- **First-class callable syntax** — `strlen(...)`
- **Intersection types** — `Countable&Iterator`
- **`never` return type** — function never returns
- **`readonly` properties**
  ```php
  class User {
      public readonly int $id;
  }
  ```
- **`new` in initializers** — `new Foo()` as default parameter
- **Array destructuring with string keys** — `["name" => $name] = $arr`
- **`readonly` properties**
- **`enum_exists()` function**
- **`fsync()` / `fdatasync()` functions**
- **`array_is_list()` function**
- **`MySQLi` retry on connection failure**

### Migration

- Review: https://www.php.net/manual/en/migration81.php
- Backward incompatible changes: https://www.php.net/manual/en/migration81.incompatible.php
- Deprecated features: https://www.php.net/manual/en/migration81.deprecated.php

## PHP 8.0

### New Features

- **Named arguments**
  ```php
  createUser(name: 'Alice', age: 30);
  ```
- **Match expression**
  ```php
  $result = match($status) {
      200 => 'OK',
      404 => 'Not Found',
      default => 'Unknown',
  };
  ```
- **Constructor property promotion**
  ```php
  class User {
      public function __construct(
          public readonly int $id,
          public string $name,
      ) {}
  }
  ```
- **Union types** — `int|string`
- **`mixed` type** — accepts any value
- **`throw` as expression** — `$x ?? throw new Exception()`
- **Nullsafe operator** — `$user?->address?->country`
- **`str_contains()`, `str_starts_with()`, `str_ends_with()`**
- **JIT compiler** — Just-In-Time compilation for performance
- **Attributes** — `#[Attribute]`
- **`WeakMap` class**
- **`Stringable` interface** — auto-implemented with `__toString()`
- **`::class` on objects** — `$obj::class`
- **`catch` without variable** — `catch (Exception)`
- **Multiple catch types** — `catch (A | B $e)`

### Migration

- Review: https://www.php.net/manual/en/migration80.php
- Backward incompatible changes: https://www.php.net/manual/en/migration80.incompatible.php
- Deprecated features: https://www.php.net/manual/en/migration80.deprecated.php
- **Major changes from PHP 7** — many backward incompatible changes

## PHP 7.x Migration (Legacy)

### PHP 7.4

- Typed properties (`public int $x`)
- Arrow functions (`fn($x) => $x * 2`)
- Spread operator in arrays (`[...$arr1, ...$arr2]`)
- Null coalescing assignment (`$x ??= 'default'`)
- Numeric string separator (`1_000_000`)

### PHP 7.3

- Flexible heredoc/nowdoc syntax
- `JSON_THROW_ON_ERROR` flag
- `array_key_first()` / `array_key_last()`
- `hrtime()` function

### PHP 7.2

- Object type hint
- Parameter type widening (contravariance)
- HashContext class
- `sodium` extension bundled

### PHP 7.1

- Nullable types (`?int`)
- Void return type
- Class constant visibility
- Iterable type
- Multi-catch (`catch (A | B $e)`)
- Square bracket destructuring (`[$a, $b] = $arr`)

### PHP 7.0

- Scalar type hints (`int`, `string`, `float`, `bool`)
- Return type declarations
- `??` null coalescing
- `<=>` spaceship operator
- Anonymous classes
- `Closure::call()`
- Group use declarations
- `intdiv()` function
- `Throwable` interface (Error + Exception)

## Migration Best Practices

1. **Read the migration guide** for each version
2. **Run `php -l`** on all files to check for syntax errors
3. **Use `phpcs` with PHPCompatibility** ruleset
4. **Run test suite** on new PHP version
5. **Check deprecated features** and update code
6. **Review backward incompatible changes** carefully
7. **Update Composer dependencies** — `composer update`
8. **Run `composer audit`** for security
9. **Test in staging** before production
10. **Monitor error logs** after upgrade
