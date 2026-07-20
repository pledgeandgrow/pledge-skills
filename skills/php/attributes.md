# Attributes

## Overview

Attributes (PHP 8.0+) provide structured metadata for classes, methods, properties, parameters, constants, and functions. They replace doc-comment annotations with a proper, typed mechanism.

## Syntax

```php
// Basic attribute
#[Attribute]
class MyAttr {
    public function __construct(
        public readonly string $name,
        public readonly ?string $description = null,
    ) {}
}

// Applying attributes
#[MyAttr('users', description: 'User controller')]
class UserController {
    #[MyAttr('index')]
    public function index(): void {}

    #[MyAttr('create')]
    public function create(
        #[MyAttr('required')] string $name,
        #[MyAttr('optional')] ?int $age = null,
    ): void {}
}
```

## Declaring Attribute Classes

```php
// Mark a class as an attribute
#[Attribute]
class Route {
    public function __construct(
        public readonly string $path,
        public readonly string $method = 'GET',
    ) {}
}

// Restrict attribute targets
#[Attribute(Attribute::TARGET_METHOD)]
class RouteMethod {
    public function __construct(public readonly string $path) {}
}

// Available targets:
// Attribute::TARGET_CLASS
// Attribute::TARGET_FUNCTION
// Attribute::TARGET_METHOD
// Attribute::TARGET_PROPERTY
// Attribute::TARGET_CLASS_CONSTANT
// Attribute::TARGET_PARAMETER
// Attribute::TARGET_ALL

// Repeatability
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Middleware {
    public function __construct(public readonly string $class) {}
}
```

## Multiple Attributes

```php
#[Route('/users', 'GET')]
#[Middleware('auth')]
#[Middleware('throttle:60')]
public function list(): void {}
```

## Reading Attributes with Reflection

```php
// Class-level attributes
$reflector = new ReflectionClass(UserController::class);
foreach ($reflector->getAttributes() as $attr) {
    echo $attr->getName(); // "MyAttr"
    $instance = $attr->newInstance(); // instantiated attribute
    echo $instance->name;
}

// Method-level attributes
$method = new ReflectionMethod(UserController::class, 'index');
foreach ($method->getAttributes() as $attr) {
    $instance = $attr->newInstance();
    echo $instance->name;
}

// Filter by attribute class
$attributes = $method->getAttributes(Route::class);
foreach ($attributes as $attr) {
    $route = $attr->newInstance();
    echo $route->path;
}

// Property attributes
$prop = new ReflectionProperty(User::class, 'name');
$prop->getAttributes();

// Parameter attributes
$param = new ReflectionParameter([UserController::class, 'create'], 'name');
$param->getAttributes();

// Constant attributes
$const = new ReflectionClassConstant(MyClass::class, 'MY_CONST');
$const->getAttributes();
```

## Practical Example: Routing

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Route {
    public function __construct(
        public readonly string $path,
        public readonly string $method = 'GET',
    ) {}
}

class UserController {
    #[Route('/users', 'GET')]
    public function list(): void {}

    #[Route('/users/{id}', 'GET')]
    public function show(int $id): void {}

    #[Route('/users', 'POST')]
    public function create(): void {}
}

// Discover routes via reflection
$reflector = new ReflectionClass(UserController::class);
foreach ($reflector->getMethods() as $method) {
    foreach ($method->getAttributes(Route::class) as $attr) {
        $route = $attr->newInstance();
        echo "{$route->method} {$route->path} -> {$method->getName()}\n";
    }
}
```

## Predefined Attributes

| Attribute | Description |
|-----------|-------------|
| `#[Deprecated]` | Marks element as deprecated (PHP 8.4+) |
| `#[Override]` | Marks method as overriding parent (PHP 8.3+) |
| `#[NoDiscard]` | Warns if return value is ignored (PHP 8.4+) |
| `#[AllowDynamicProperties]` | Allows dynamic properties on class (PHP 8.2+) |
| `#[SensitiveParameter]` | Hides parameter value in stack traces (PHP 8.2+) |

```php
// Override attribute (PHP 8.3+)
class Base {
    public function process(): void {}
}
class Derived extends Base {
    #[Override]
    public function process(): void {} // validates parent has this method
}

// SensitiveParameter (PHP 8.2+)
function login(
    string $username,
    #[SensitiveParameter] string $password,
): void {
    // $password will be redacted in stack traces
}

// Deprecated (PHP 8.4+)
#[Deprecated("Use newFunction() instead")]
function oldFunction(): void {}
```
