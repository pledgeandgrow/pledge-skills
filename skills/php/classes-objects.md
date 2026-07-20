# Classes and Objects

## Basics

```php
class Point {
    public function __construct(
        public float $x,
        public float $y,
    ) {}

    public function distance(Point $other): float {
        return sqrt(($this->x - $other->x) ** 2 + ($this->y - $other->y) ** 2);
    }
}

$p1 = new Point(0, 0);
$p2 = new Point(3, 4);
echo $p1->distance($p2); // 5
```

## Constructor Property Promotion (PHP 8.0+)

```php
class User {
    public function __construct(
        public readonly int $id,
        public readonly string $email,
        public string $name = 'Anonymous',
        private ?DateTimeImmutable $createdAt = null,
    ) {}
}

// Equivalent to writing out all properties + constructor assignment
```

## Properties

```php
class Product {
    public string $name = 'Untitled';
    protected int $price = 0;
    private ?string $internalNote = null;

    // Typed properties (PHP 7.4+)
    public readonly string $sku; // PHP 8.1+ (readonly on non-promoted)
}

// Static properties
class Counter {
    public static int $count = 0;

    public function __construct() {
        self::$count++;
    }
}
```

## Property Hooks (PHP 8.4+)

Property hooks allow computed properties without explicit getter/setter methods.

```php
class User {
    public string $name = '';

    public string $displayName {
        get => $this->name ?: 'Anonymous';
        set => $this->name = trim($value);
    }

    // Read-only hook
    public int $doubledCount {
        get => $this->count * 2;
    }

    // Write-only hook
    public string $normalizedEmail {
        set => strtolower(trim($value));
    }

    // By-reference hook
    public array $items {
        &get => $this->internalItems;
    }
}
```

## Class Constants

```php
class Config {
    public const MAX_CONNECTIONS = 100;
    protected const INTERNAL_KEY = 'secret';
    private const PRIVATE_KEY = 'private-secret';

    // Type constants (PHP 8.3+)
    public const string API_URL = 'https://api.example.com';
    public const int TIMEOUT = 30;
    public const array ENDPOINTS = ['users', 'posts'];
}
```

## Autoloading

```php
// PSR-4 autoloading via Composer
// composer.json:
// {
//   "autoload": {
//     "psr-4": { "App\\": "src/" }
//   }
// }

// Manual autoloading
spl_autoload_register(function (string $class): void {
    $file = str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

// Using class
$user = new App\Models\User(); // auto-loads src/Models/User.php
```

## Constructors and Destructors

```php
class Logger {
    private $handle;

    public function __construct(string $filename) {
        $this->handle = fopen($filename, 'a');
    }

    public function __destruct() {
        if ($this->handle) {
            fclose($this->handle);
        }
    }

    // PHP 8.0+ constructor in abstract class
    // Old style (pre-8.0)
    public function log(string $message): void {
        fwrite($this->handle, $message . PHP_EOL);
    }
}

// New in constructor (PHP 8.4+)
class MyClass {
    public function __construct(
        public Foo $foo = new Foo(), // new in attribute defaults
    ) {}
}
```

## Visibility

```php
class Example {
    public $publicVar;       // accessible anywhere
    protected $protectedVar; // accessible in class and subclasses
    private $privateVar;     // accessible only in this class

    public function publicMethod(): void {}
    protected function protectedMethod(): void {}
    private function privateMethod(): void {}
}
```

## Inheritance

```php
class Animal {
    public function __construct(
        protected string $name,
    ) {}

    public function speak(): string {
        return "{$this->name} makes a sound";
    }
}

class Dog extends Animal {
    public function speak(): string {
        return "{$this->name} barks";
    }

    // Call parent method
    public function parentSpeak(): string {
        return parent::speak();
    }
}
```

## Scope Resolution Operator (::)

```php
class Counter {
    public static int $count = 0;
    public const MAX = 100;

    public static function increment(): void {
        self::$count++;
        echo self::MAX;
    }
}

// Accessing static members
Counter::$count;
Counter::MAX;
Counter::increment();

// parent:: — parent class
// self:: — current class
// static:: — late static binding (resolved at runtime)
```

## Static Keyword

```php
class Math {
    public static function square(int $n): int {
        return $n * $n;
    }

    public static int $instanceCount = 0;
}

echo Math::square(5); // 25
echo Math::$instanceCount;

// Static in inheritance (late static binding)
class Base {
    public static function create(): static {
        return new static(); // creates instance of called class
    }
}

class Derived extends Base {}

$obj = Derived::create(); // Derived instance, not Base
```

## Abstract Classes

```php
abstract class Shape {
    abstract public function area(): float;

    public function describe(): string {
        return get_class($this) . " with area " . $this->area();
    }
}

class Circle extends Shape {
    public function __construct(private float $radius) {}

    public function area(): float {
        return M_PI * $this->radius ** 2;
    }
}

class Rectangle extends Shape {
    public function __construct(
        private float $width,
        private float $height,
    ) {}

    public function area(): float {
        return $this->width * $this->height;
    }
}
```

## Interfaces

```php
interface Comparable {
    public function compareTo(object $other): int;
}

interface Stringable {
    public function __toString(): string;
}

class Money implements Comparable, Stringable {
    public function __construct(private int $cents) {}

    public function compareTo(object $other): int {
        assert($other instanceof Money);
        return $this->cents <=> $other->cents;
    }

    public function __toString(): string {
        return '$' . number_format($this->cents / 100, 2);
    }
}
```

## Traits

```php
trait Timestampable {
    public ?DateTimeImmutable $createdAt = null;
    public ?DateTimeImmutable $updatedAt = null;

    public function touch(): void {
        $this->updatedAt = new DateTimeImmutable();
        if ($this->createdAt === null) {
            $this->createdAt = $this->updatedAt;
        }
    }
}

trait SoftDeletable {
    public ?DateTimeImmutable $deletedAt = null;

    public function delete(): void {
        $this->deletedAt = new DateTimeImmutable();
    }

    public function isDeleted(): bool {
        return $this->deletedAt !== null;
    }
}

class Article {
    use Timestampable, SoftDeletable;

    public function __construct(
        public readonly string $title,
    ) {}
}

// Trait conflict resolution
trait A {
    public function hello(): string { return "A"; }
}
trait B {
    public function hello(): string { return "B"; }
}

class C {
    use A, B {
        A::hello insteadof B;
        B::hello as helloFromB;
    }
}
```

## Anonymous Classes

```php
$obj = new class("Alice") {
    public function __construct(public string $name) {}

    public function greet(): string {
        return "Hello, {$this->name}!";
    }
};

echo $obj->greet(); // Hello, Alice!

// Useful for testing, mocks, one-off implementations
$logger = new class implements LoggerInterface {
    public function log(string $message): void {
        // do nothing (null logger)
    }
};
```

## Overloading (Magic Methods)

```php
class Container {
    private array $data = [];

    // Property overloading
    public function __get(string $name): mixed {
        return $this->data[$name] ?? null;
    }

    public function __set(string $name, mixed $value): void {
        $this->data[$name] = $value;
    }

    public function __isset(string $name): bool {
        return isset($this->data[$name]);
    }

    public function __unset(string $name): void {
        unset($this->data[$name]);
    }

    // Method overloading
    public function __call(string $name, array $arguments): mixed {
        // for non-existent methods
    }

    public static function __callStatic(string $name, array $arguments): mixed {
        // for non-existent static methods
    }

    // String conversion
    public function __toString(): string {
        return json_encode($this->data);
    }

    // Debug info
    public function __debugInfo(): ?array {
        return ['data' => $this->data];
    }

    // Invocation (make object callable)
    public function __invoke(...$args): mixed {
        return $this->__call('default', $args);
    }

    // Serialization
    public function __serialize(): array {
        return ['data' => $this->data];
    }

    public function __unserialize(array $data): void {
        $this->data = $data['data'];
    }

    // Clone
    public function __clone(): void {
        // deep copy properties
    }

    // Sleep/Wakeup (legacy serialization)
    public function __sleep(): array {
        return ['data'];
    }

    public function __wakeup(): void {
        // restore connections, etc.
    }

    // Var export (PHP 8.1+)
    public static function __set_state(array $properties): object {
        $obj = new self();
        $obj->data = $properties['data'];
        return $obj;
    }
}
```

## Final Keyword

```php
final class ImmutableValue {
    // Cannot be extended
}

class Base {
    final public function criticalMethod(): void {
        // Cannot be overridden
    }
}
```

## Cloning

```php
class Order {
    public function __construct(
        public string $id,
        public array $items = [],
    ) {}

    public function __clone(): void {
        $this->id = uniqid('order_');
        // $items is shallow copied by default
        // Deep copy if needed:
        $this->items = array_map(fn($item) => clone $item, $this->items);
    }
}

$order = new Order('order_1', [$item1, $item2]);
$copy = clone $order; // triggers __clone()
```

## Late Static Binding

```php
class Base {
    public static function create(): static {
        return new static(); // late static binding
    }

    public static function getClassName(): string {
        return static::class; // resolved at runtime
    }
}

class Derived extends Base {}

$obj = Derived::create(); // Derived instance
echo Derived::getClassName(); // "Derived"
```

## Serialization

```php
// serialize / unserialize
$data = serialize($object);
$restored = unserialize($data);

// __serialize / __unserialize (PHP 7.4+)
class Model {
    public function __serialize(): array {
        return ['id' => $this->id, 'data' => $this->data];
    }

    public function __unserialize(array $data): void {
        $this->id = $data['id'];
        $this->data = $data['data'];
    }
}

// JSON serialization
class User implements JsonSerializable {
    public function jsonSerialize(): array {
        return ['id' => $this->id, 'name' => $this->name];
    }
}

json_encode($user); // uses jsonSerialize()
```

## Covariance and Contravariance

```php
// Covariance: subclass can return a more specific type
class Animal {}
class Cat extends Animal {}

class AnimalShelter {
    public function getAnimal(): Animal { return new Animal(); }
}

class CatShelter extends AnimalShelter {
    public function getAnimal(): Cat { return new Cat(); } // covariant return
}

// Contravariance: subclass can accept a more general type
class AnimalFood {}
class CatFood extends AnimalFood {}

class AnimalFeeder {
    public function feed(CatFood $food): void {} // accepts specific
}

class CatFeeder extends AnimalFeeder {
    public function feed(AnimalFood $food): void {} // contravariant parameter
}
```

## Lazy Objects (PHP 8.4+)

```php
// Lazy objects defer initialization until first property access
$reflector = new ReflectionClass(User::class);

$user = $reflector->newLazyGhost(function (User $obj) {
    // Initialize $obj from database
    $data = fetchUserFromDatabase();
    $obj->__construct($data['id'], $data['name']);
});

// Initialization happens on first property access
echo $user->name; // triggers initialization
```
