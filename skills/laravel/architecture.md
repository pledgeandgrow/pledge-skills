# Architecture Concepts

Request lifecycle, service container, service providers, and facades.

## Request Lifecycle

### Lifecycle Overview

1. **Entry Point** — All requests go through `public/index.php`
2. **Bootstrap** — `bootstrap/app.php` creates the application instance
3. **HTTP Kernel** — Handles request through middleware stack
4. **Router** — Dispatches request to route/controller
5. **Response** — Returns response back through middleware stack

### Entry Point (`public/index.php`)

```php
// Loads Composer autoloader
require __DIR__.'/../vendor/autoload.php';

// Bootstraps Laravel and handles the request
$app = require_once __DIR__.'/../bootstrap/app.php';
```

### Bootstrap (`bootstrap/app.php`)

```php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register middleware
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Register exception handling
    })->create();
```

### Service Providers

Service providers are the central place to bootstrap applications:
1. `register()` — Bind things into the service container
2. `boot()` — Perform actions after all providers are registered

### Request Flow

```
Request → index.php → Application → HTTP Kernel
  → Global Middleware → Router → Route/Controller
  → Response → Global Middleware → index.php → Browser
```

## Service Container

The service container is a powerful dependency injection container.

### Zero Configuration Resolution

```php
// Type-hint dependencies in constructors — resolved automatically
class UserController extends Controller
{
    public function __construct(
        protected UserRepository $users,
        protected LoggerInterface $logger,
    ) {}
}
```

### Binding

#### Binding Basics

```php
// In a service provider's register() method
use App\Services\PaymentGateway;
use App\Services\Contracts\Payment;

$this->app->bind(Payment::class, PaymentGateway::class);

// Bind with closure
$this->app->bind(Payment::class, function ($app) {
    return new PaymentGateway(config('services.stripe.key'));
});

// Singleton — same instance every time
$this->app->singleton(Payment::class, function ($app) {
    return new PaymentGateway(config('services.stripe.key'));
});

// Scoped — same instance within a request lifecycle
$this->app->scoped(Calculator::class, function ($app) {
    return new Calculator();
});
```

#### Binding Interfaces to Implementations

```php
// Bind interface to implementation
$this->app->bind(
    App\Contracts\Payment::class,
    App\Services\StripePayment::class
);

// Now type-hinting Payment resolves StripePayment
class OrderController
{
    public function __construct(protected Payment $payment) {}
}
```

#### Contextual Binding

```php
// Different implementations for different consumers
$this->app->when(PhotoController::class)
    ->needs(ImageProcessor::class)
    ->give(GDImageProcessor::class);

$this->app->when(VideoController::class)
    ->needs(ImageProcessor::class)
    ->give(FFmpegImageProcessor::class);
```

#### Contextual Attributes

```php
// Define a contextual attribute
#[Attribute(Attribute::TARGET_PARAMETER)]
class ConfigValue
{
    public function __construct(public string $key) {}
}

// Use in controller
class PaymentController
{
    public function __construct(
        #[ConfigValue('services.stripe.key')] string $apiKey
    ) {}
}
```

#### Binding Primitives

```php
$this->app->when('App\Services\Stripe')
    ->needs('$apiKey')
    ->give(config('services.stripe.key'));
```

#### Binding Typed Variadics

```php
$this->app->when(ReportGenerator::class)
    ->needs('$reports')
    ->give([
        SalesReport::class,
        InventoryReport::class,
        FinancialReport::class,
    ]);
```

#### Tagging

```php
$this->app->tag([
    SalesReport::class,
    InventoryReport::class,
], 'reports');

// Resolve all tagged
$this->app->bind(ReportAggregator::class, function ($app) {
    return new ReportAggregator($app->tagged('reports'));
});
```

#### Extending Bindings

```php
$this->app->extend(Payment::class, function ($payment, $app) {
    $payment->setLogger($app->make(LoggerInterface::class));
    return $payment;
});
```

### Resolving

#### The make Method

```php
// Resolve from container
$instance = $this->app->make(Payment::class);

// With parameters
$instance = $this->app->makeWith(Payment::class, ['key' => 'sk_test_xxx']);
```

#### Automatic Injection

```php
// Automatic resolution via type-hints
class UserController
{
    public function __construct(
        protected UserRepository $users, // Auto-resolved
    ) {}
}

// Method injection
Route::get('/users', function (UserRepository $users) {
    return $users->all();
});
```

### Method Invocation and Injection

```php
use Illuminate\Support\Facades\App;

// Call method with auto-injected dependencies
$result = App::call([$controller, 'index']);

// With additional parameters
$result = App::call([$controller, 'show'], ['id' => 1]);

// With closure
$result = App::call(function (UserRepository $users, $id) {
    return $users->find($id);
}, ['id' => 1]);
```

### Container Events

```php
// Listen for binding events
$this->app->resolving(Payment::class, function ($payment, $app) {
    // Called when Payment is resolved
});

// Listen for all resolutions
$this->app->resolving(function ($object, $app) {
    // Called for every resolved object
});
```

#### Rebinding

```php
// Re-execute a callback when a binding is changed
$this->app->rebinding('config', function ($app, $config) {
    $app->make('some-service')->updateConfig($config);
});
```

### PSR-11

```php
// Laravel's container is PSR-11 compatible
use Psr\Container\ContainerInterface;

$container = app(ContainerInterface::class);
$service = $container->get(Payment::class);
```

## Service Providers

Service providers are the central place to bootstrap application services.

### Writing Service Providers

```bash
# Generate a service provider
php artisan make:provider PaymentServiceProvider
```

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    // Register bindings in the container
    public function register(): void
    {
        $this->app->singleton(Payment::class, function ($app) {
            return new StripePayment(config('services.stripe.key'));
        });
    }

    // Boot services after all providers registered
    public function boot(): void
    {
        // Load routes, publish config, register commands, etc.
        $this->loadRoutesFrom(__DIR__.'/../../routes/payments.php');
        $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'payments');
    }
}
```

### Registering Providers

```php
// bootstrap/app.php
->withProviders([
    App\Providers\PaymentServiceProvider::class,
    App\Providers\HorizonServiceProvider::class,
])
```

### Deferred Providers

```php
// Defer loading until the service is actually needed
class PaymentServiceProvider extends ServiceProvider
{
    protected array $defer = true;

    public function provides(): array
    {
        return [Payment::class];
    }
}
```

## Facades

Facades provide a static-like interface to services in the container.

### Available Facades

| Facade | Class | Service Container Binding |
|--------|-------|------------------------|
| `App` | `Illuminate\Foundation\Application` | `app` |
| `Artisan` | `Illuminate\Contracts\Console\Kernel` | `artisan` |
| `Auth` | `Illuminate\Auth\AuthManager` | `auth` |
| `Blade` | `Illuminate\View\Compilers\BladeCompiler` | `blade.compiler` |
| `Cache` | `Illuminate\Cache\CacheManager` | `cache` |
| `Config` | `Illuminate\Config\Repository` | `config` |
| `DB` | `Illuminate\Database\DatabaseManager` | `db` |
| `Event` | `Illuminate\Events\Dispatcher` | `events` |
| `File` | `Illuminate\Filesystem\Filesystem` | `files` |
| `Hash` | `Illuminate\Hashing\HashManager` | `hash` |
| `Log` | `Illuminate\Log\LogManager` | `log` |
| `Mail` | `Illuminate\Mail\Mailer` | `mailer` |
| `Queue` | `Illuminate\Queue\QueueManager` | `queue` |
| `Route` | `Illuminate\Routing\Router` | `route` |
| `Schema` | `Illuminate\Database\Schema\Builder` | `db.schema` |
| `Session` | `Illuminate\Session\SessionManager` | `session` |
| `Storage` | `Illuminate\Filesystem\FilesystemManager` | `filesystem` |
| `URL` | `Illuminate\Routing\UrlGenerator` | `url` |
| `Validator` | `Illuminate\Validation\Factory` | `validator` |
| `View` | `Illuminate\View\Factory` | `view` |

### Using Facades

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Cache usage
Cache::put('key', 'value', 3600);
$value = Cache::get('key', 'default');

// Database usage
$users = DB::table('users')->where('active', 1)->get();

// Logging
Log::info('User logged in', ['user_id' => $id]);
```

### Facade Class Aliases

```php
// Use facade aliases in config/app.php
'aliases' => [
    'Cache' => Illuminate\Support\Facades\Cache::class,
    'DB' => Illuminate\Support\Facades\DB::class,
],
```

### Real-Time Facades

```php
// Prefix any class with "Facades\" to use it as a facade
use Facades\App\Services\Payment;

Payment::charge(100);
// Equivalent to: app(App\Services\Payment::class)->charge(100);
```

### Facade Mocking in Tests

```php
use Illuminate\Support\Facades\Cache;

public function test_cache(): void
{
    Cache::shouldReceive('get')
        ->once()
        ->with('key')
        ->andReturn('value');

    $this->assertEquals('value', Cache::get('key'));
}
```

## Best Practices

1. Use constructor injection over service location
2. Bind interfaces to implementations for testability
3. Use contextual binding when different classes need different implementations
4. Keep `register()` lightweight — do heavy work in `boot()`
5. Use deferred providers for services not always needed
6. Prefer facades for brevity in simple cases, DI for complex ones
7. Use real-time facades sparingly — they can make testing harder
8. Tag related services for batch resolution
9. Use `App::call()` for method injection in non-controller contexts
10. Cache config in production with `config:cache`
