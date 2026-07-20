# Enumerations

## Overview

Enums (PHP 8.1+) are a special kind of class that represents a fixed set of named values. They are type-safe, immutable, and cannot be instantiated with `new`.

## Basic Enums (Pure Enums)

```php
enum Suit {
    case Hearts;
    case Diamonds;
    case Clubs;
    case Spades;
}

function deal(Suit $suit): void {
    echo "Dealing $suit->name\n";
}

deal(Suit::Hearts); // "Dealing Hearts"

// Properties
echo Suit::Hearts->name; // "Hearts"

// All cases
$suits = Suit::cases(); // [Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades]
```

## Backed Enums

Backed enums have a scalar value (int or string) associated with each case.

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';
}

enum Priority: int {
    case Low = 1;
    case Medium = 2;
    case High = 3;
}

// Accessing backed value
echo Status::Active->value; // "active"
echo Priority::High->value; // 3

// From value
$status = Status::from('active'); // Status::Active
$priority = Priority::from(3);    // Priority::High

// tryFrom (returns null instead of throwing)
$status = Status::tryFrom('unknown'); // null
$status = Status::tryFrom('active');  // Status::Active
```

## Methods

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';

    public function label(): string {
        return match($this) {
            Status::Active => 'Active',
            Status::Inactive => 'Inactive',
            Status::Pending => 'Pending',
        };
    }

    public function color(): string {
        return match($this) {
            Status::Active => 'green',
            Status::Inactive => 'gray',
            Status::Pending => 'yellow',
        };
    }

    public function isActive(): bool {
        return $this === Status::Active;
    }
}

echo Status::Active->label();  // "Active"
echo Status::Pending->color(); // "yellow"
Status::Active->isActive();     // true
```

## Static Methods

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';

    public static function fromString(string $value): ?self {
        return self::tryFrom($value);
    }

    public static function activeCases(): array {
        return array_filter(self::cases(), fn($s) => $s->isActive());
    }
}
```

## Constants

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';

    // Regular constants
    public const DEFAULT = 'active';

    // Enum cases in constant expressions (PHP 8.2+)
    public const DEFAULT_CASE = self::Active;
}
```

## Traits

```php
trait HasLabel {
    abstract public function label(): string;

    public function upperLabel(): string {
        return strtoupper($this->label());
    }
}

enum Status: string {
    use HasLabel;

    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string {
        return ucfirst($this->value);
    }
}

echo Status::Active->upperLabel(); // "ACTIVE"
```

## Enum Values in Constant Expressions (PHP 8.2+)

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
}

class Config {
    // Enum cases can be used in constant expressions
    public const DEFAULT_STATUS = Status::Active;

    // In attributes
    #[Route(path: '/users', method: Status::Active)]
    public function index(): void {}
}

// In match arms
$result = match($status) {
    Status::Active => 'ok',
    Status::Inactive => 'off',
};
```

## Value Listing

```php
// All cases
$cases = Status::cases();

// Filter cases
$activeCases = array_filter(
    Status::cases(),
    fn(Status $s) => $s->isActive()
);

// Map to values
$values = array_map(fn(Status $s) => $s->value, Status::cases());
// ['active', 'inactive', 'pending']
```

## Serialization

```php
$status = Status::Active;

// serialize/unserialize
$serialized = serialize($status);
$restored = unserialize($serialized); // Status::Active

// jsonSerialize (enums implement JsonSerializable)
json_encode($status); // "\"active\"" (backed value)

// var_export
$exported = var_export($status, true);
```

## Differences from Objects

- Enums **cannot** be instantiated with `new`
- Enums **cannot** have public properties (only methods, constants, cases)
- Enums **cannot** be cloned
- Enums **cannot** be serialized with `__sleep`/`__wakeup`
- Enums are **final** — cannot be extended
- Enums **can** implement interfaces
- Enums **can** use traits
- Enum cases are **singleton** instances — same identity

## Interfaces

```php
interface HasColor {
    public function color(): string;
}

enum Status implements HasColor {
    case Active;
    case Inactive;

    public function color(): string {
        return match($this) {
            Status::Active => 'green',
            Status::Inactive => 'gray',
        };
    }
}
```
