# Package Development and Contracts

Developing Laravel packages, service contracts, and package documentation.

## Package Development

### Package Structure

```
my-package/
├── src/
│   ├── MyPackageServiceProvider.php
│   ├── Facades/
│   │   └── MyPackage.php
│   ├── Commands/
│   │   └── MyCommand.php
│   ├── Models/
│   │   └── MyModel.php
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   └── Services/
│       └── MyService.php
├── config/
│   └── my-package.php
├── database/
│   ├── migrations/
│   └── factories/
├── resources/
│   └── views/
├── routes/
│   ├── web.php
│   └── api.php
├── composer.json
└── README.md
```

### Service Provider

```php
namespace MyPackage;

use Illuminate\Support\ServiceProvider;

class MyPackageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Merge config
        $this->mergeConfigFrom(__DIR__.'/../config/my-package.php', 'my-package');

        // Bind services
        $this->app->singleton(MyService::class, function ($app) {
            return new MyService(config('my-package.api_key'));
        });
    }

    public function boot(): void
    {
        // Publish config
        $this->publishes([
            __DIR__.'/../config/my-package.php' => config_path('my-package.php'),
        ], 'my-package-config');

        // Load migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Load views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'my-package');

        // Publish views
        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/my-package'),
        ], 'my-package-views');

        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');

        // Register commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                MyCommand::class,
            ]);
        }

        // Register middleware
        $this->app['router']->aliasMiddleware('my-package', MyMiddleware::class);

        // Publish assets
        $this->publishes([
            __DIR__.'/../resources/assets' => public_path('vendor/my-package'),
        ], 'my-package-assets');

        // Load translations
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'my-package');

        // Publish migrations
        $this->publishes([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'my-package-migrations');
    }
}
```

### Composer.json

```json
{
    "name": "vendor/my-package",
    "description": "A Laravel package",
    "type": "library",
    "license": "MIT",
    "autoload": {
        "psr-4": {
            "Vendor\\MyPackage\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Vendor\\MyPackage\\MyPackageServiceProvider"
            ],
            "aliases": {
                "MyPackage": "Vendor\\MyPackage\\Facades\\MyPackage"
            }
        }
    },
    "require": {
        "illuminate/support": "^13.0"
    }
}
```

### Package Facades

```php
namespace Vendor\MyPackage\Facades;

use Illuminate\Support\Facades\Facade;

class MyPackage extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'my-package';
    }
}
```

### Package Configuration

```php
// config/my-package.php
return [
    'api_key' => env('MY_PACKAGE_API_KEY', ''),
    'cache_enabled' => true,
    'cache_ttl' => 3600,
    'default_driver' => 'default',
];
```

### Package Commands

```php
namespace Vendor\MyPackage\Commands;

use Illuminate\Console\Command;

class MyCommand extends Command
{
    protected $signature = 'my-package:run {--force}';

    protected $description = 'Run my package command';

    public function handle(): int
    {
        $this->info('Running my package command...');
        return self::SUCCESS;
    }
}
```

### Package Routes

```php
// routes/web.php
use Illuminate\Support\Facades\Route;

Route::get('/my-package', function () {
    return 'My Package';
})->middleware('web');

// routes/api.php
Route::get('/api/my-package', function () {
    return response()->json(['status' => 'ok']);
})->middleware('api');
```

### Discovering Packages

```php
// Package auto-discovery (composer.json)
"extra": {
    "laravel": {
        "providers": [
            "Vendor\\MyPackage\\MyPackageServiceProvider"
        ],
        "aliases": {
            "MyPackage": "Vendor\\MyPackage\\Facades\\MyPackage"
        }
    }
}

// Disable auto-discovery
"extra": {
    "laravel": {
        "dont-discover": [
            "vendor/package-name"
        ]
    }
}
```

### Testing Packages

```php
// tests/TestCase.php
namespace Vendor\MyPackage\Tests;

use Orchestra\Testbench\TestCase as BaseTestCase;
use Vendor\MyPackage\MyPackageServiceProvider;

abstract class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app): array
    {
        return [MyPackageServiceProvider::class];
    }

    protected function getPackageAliases($app): array
    {
        return [
            'MyPackage' => \Vendor\MyPackage\Facades\MyPackage::class,
        ];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('my-package.api_key', 'test-key');
    }
}
```

## Contracts

### What Are Contracts?

Contracts are interfaces that define core framework services. They provide:
- **Loose coupling** — depend on interfaces, not implementations
- **Testability** — easily mock or swap implementations
- **Clarity** — explicit API contract

### Available Contracts

| Contract | Facade | Description |
|----------|--------|-------------|
| `Illuminate\Contracts\Cache\Repository` | `Cache` | Cache operations |
| `Illuminate\Contracts\Cache\Factory` | `Cache` | Cache factory |
| `Illuminate\Contracts\Config\Repository` | `Config` | Configuration |
| `Illuminate\Contracts\Console\Kernel` | `Artisan` | Artisan console |
| `Illuminate\Contracts\Container\Container` | `App` | DI container |
| `Illuminate\Contracts\Cookie\Factory` | `Cookie` | Cookie factory |
| `Illuminate\Contracts\Database\ModelBinding` | — | Model binding |
| `Illuminate\Contracts\Encryption\Encrypter` | `Crypt` | Encryption |
| `Illuminate\Contracts\Events\Dispatcher` | `Event` | Event dispatcher |
| `Illuminate\Contracts\Filesystem\Factory` | `Storage` | Filesystem factory |
| `Illuminate\Contracts\Filesystem\Filesystem` | `Storage` | Filesystem |
| `Illuminate\Contracts\Foundation\Application` | `App` | Application |
| `Illuminate\Contracts\Hashing\Hasher` | `Hash` | Hashing |
| `Illuminate\Contracts\Http\Kernel` | — | HTTP kernel |
| `Illuminate\Contracts\Log\Log` | `Log` | Logging |
| `Illuminate\Contracts\Mail\Mailer` | `Mail` | Mailer |
| `Illuminate\Contracts\Notifications\Dispatcher` | `Notification` | Notifications |
| `Illuminate\Contracts\Queue\Factory` | `Queue` | Queue factory |
| `Illuminate\Contracts\Queue\Queue` | `Queue` | Queue |
| `Illuminate\Contracts\Redis\Factory` | `Redis` | Redis factory |
| `Illuminate\Contracts\Routing\Registrar` | `Route` | Route registrar |
| `Illuminate\Contracts\Routing\ResponseFactory` | `Response` | Response factory |
| `Illuminate\Contracts\Routing\UrlGenerator` | `URL` | URL generator |
| `Illuminate\Contracts\Session\Session` | `Session` | Session |
| `Illuminate\Contracts\Support\Arrayable` | — | Arrayable |
| `Illuminate\Contracts\Support\Jsonable` | — | Jsonable |
| `Illuminate\Contracts\Support\Responsable` | — | Responsable |
| `Illuminate\Contracts\Translation\Translator` | `Lang` | Translator |
| `Illuminate\Contracts\Validation\Factory` | `Validator` | Validator factory |
| `Illuminate\Contracts\Validation\Validator` | — | Validator |
| `Illuminate\Contracts\View\Factory` | `View` | View factory |
| `Illuminate\Contracts\Auth\Factory` | `Auth` | Auth factory |
| `Illuminate\Contracts\Auth\Guard` | `Auth` | Auth guard |
| `Illuminate\Contracts\Auth\StatefulGuard` | `Auth` | Stateful guard |
| `Illuminate\Contracts\Auth\UserProvider` | — | User provider |

### Using Contracts

```php
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Contracts\Events\Dispatcher as EventDispatcher;
use Illuminate\Contracts\Log\Log as Logger;

class OrderService
{
    public function __construct(
        protected Cache $cache,
        protected EventDispatcher $events,
        protected Logger $logger,
    ) {}

    public function process(Order $order): void
    {
        $this->logger->info('Processing order', ['id' => $order->id]);
        $this->cache->put("order:{$order->id}", $order, 3600);
        $this->events->dispatch(new OrderProcessed($order));
    }
}
```

### Contract vs Facade

```php
// Using facade (simpler, but more coupled)
class OrderService
{
    public function process(Order $order): void
    {
        Cache::put("order:{$order->id}", $order, 3600);
        Event::dispatch(new OrderProcessed($order));
    }
}

// Using contract (more testable, less coupled)
class OrderService
{
    public function __construct(
        protected CacheRepository $cache,
        protected Dispatcher $events,
    ) {}

    public function process(Order $order): void
    {
        $this->cache->put("order:{$order->id}", $order, 3600);
        $this->events->dispatch(new OrderProcessed($order));
    }
}
```

## Best Practices

1. Use auto-discovery in `composer.json` for automatic package registration
2. Publish config files so users can customize package behavior
3. Use `mergeConfigFrom()` for default config values
4. Use `Orchestra Testbench` for package testing
5. Use contracts for loose coupling in reusable code
6. Use facades for convenience in application-specific code
7. Load migrations, views, and routes in the service provider's `boot()` method
8. Group publishes with tags for selective publishing
9. Register console commands only when running in console
10. Use `loadViewsFrom()` with a package namespace to avoid conflicts
