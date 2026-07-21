# Laravel Packages

First-party Laravel packages: Cashier, Dusk, Envoy, Fortify, Folio, Horizon, Octane, Passport, Pennant, Pint, Precognition, Prompts, Pulse, Reverb, Sail, Sanctum, Scout, Socialite, Telescope, Valet, and more.

## Cashier (Stripe)

### Installation

```bash
composer require laravel/cashier
```

### Setup

```php
// User model
use Laravel\Cashier\Billable;

class User extends Model
{
    use Billable;
}
```

```bash
# Run migrations (creates subscriptions, subscription_items, transactions tables)
php artisan migrate
```

### Subscriptions

```php
// Create subscription
$subscription = $user->newSubscription('default', 'price_monthly')
    ->trialDays(14)
    ->create($paymentMethod);

// Swap plan
$subscription->swap('price_yearly');

// Cancel
$subscription->cancel();      // At period end
$subscription->cancelNow();   // Immediately

// Resume cancelled
$subscription->resume();

// Check subscription
$user->subscribed('default');
$user->onTrial();
$user->onPlan('price_monthly');
```

### Single Charges

```php
// Charge
$user->charge(1000); // $10.00

// Charge with invoice
$user->charge(1000, [
    'description' => 'One-time purchase',
]);

// Invoice
$invoice = $user->invoiceFor('Product', 1000);
```

### Customer Portal

```php
// Redirect to Stripe portal
return $user->redirectToBillingPortal();
return $user->redirectToBillingPortal(route('home'));
```

## Cashier (Paddle)

```bash
composer require laravel/cashier-paddle
```

```php
use Laravel\Paddle\Billable;

class User extends Model
{
    use Billable;
}

// Create subscription
$subscription = $user->newSubscription('default', 'price_monthly')->create();

// Checkout
$checkout = $user->subscribe('default', 'price_monthly')
    ->returnTo(route('home'))
    ->create();
```

## Dusk

Browser testing package (covered in testing.md).

```bash
composer require laravel/dusk --dev
php artisan dusk:install
php artisan dusk
```

## Envoy

SSH task runner for deployment.

```bash
composer require laravel/envoy --dev
```

```blade
{{-- Envoy.blade.php --}}
@servers(['web' => ['user@server1', 'user@server2']])

@task('deploy', ['on' => 'web'])
    cd /var/www/my-app
    git pull origin main
    composer install --no-dev --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan queue:restart
@endtask

@story('deploy-all', ['deploy'])
    deploy
@endstory
```

```bash
envoy run deploy
envoy run deploy-all
```

## Fortify

Headless authentication backend.

```bash
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

## Folio

File-based routing for Laravel.

```bash
composer require laravel/folio
php artisan folio:install
```

```
resources/views/pages/
├── index.blade.php          → /
├── about.blade.php          → /about
├── users/
│   ├── index.blade.php      → /users
│   └── [id].blade.php       → /users/{id}
```

```blade
{{-- resources/views/pages/users/[id].blade.php --}}
@php
    $user = App\Models\User::findOrFail($id);
@endphp

<h1>{{ $user->name }}</h1>
```

## Horizon

Queue monitoring dashboard for Redis.

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan horizon
```

```php
// config/horizon.php
'supervisor-1' => [
    'connection' => 'redis',
    'queue' => ['default'],
    'maxProcesses' => 3,
    'maxTries' => 3,
    'maxTime' => 0,
],
```

```bash
# Start Horizon
php artisan horizon

# Stop Horizon
php artisan horizon:terminate

# Dashboard available at /horizon
```

## Mix (Legacy Asset Bundling)

```bash
composer require laravel/mix --dev
```

```js
// webpack.mix.js
const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .version();
```

> **Note**: Vite is the recommended asset bundler for Laravel 13.x. Mix is legacy.

## Octane

High-performance application server for Laravel.

```bash
composer require laravel/octane
php artisan octane:install
```

```bash
# Start Octane with FrankenPHP
php artisan octane:start --server=frankenphp

# Start with Swoole
php artisan octane:start --server=swoole

# Start with RoadRunner
php artisan octane:start --server=roadrunner

# Watch for changes
php artisan octane:start --watch
```

```php
// config/octane.php
'servers' => [
    'frankenphp' => [
        'host' => '0.0.0.0',
        'port' => 8000,
        'max_requests' => 1000,
    ],
],
```

### Octane Considerations

- Application stays in memory between requests
- Use `Octane::tick()` for periodic tasks
- Flush state between requests (configured automatically)
- Be careful with static variables and singletons

```php
use Laravel\Octane\Facades\Octane;

// Concurrent tasks
[$users, $posts] = Octane::concurrently([
    fn () => User::all(),
    fn () => Post::all(),
]);

// Tick (periodic timer — Swoole only)
Octane::tick('my-tick', fn () => doSomething(), 1000);
```

## Passport

OAuth2 server implementation.

```bash
composer require laravel/passport
php artisan migrate
php artisan passport:install
```

```php
// User model
use Laravel\Passport\HasApiTokens;

class User extends Model
{
    use HasApiTokens;
}
```

```php
// config/auth.php
'api' => [
    'driver' => 'passport',
    'provider' => 'users',
],
```

```php
// Routes
Route::post('/oauth/token', '\Laravel\Passport\Http\Controllers\AccessTokenController@issueToken');

// Or use Passport::routes() in AuthServiceProvider
```

### Client Credentials Grant

```php
// Create a client
php artisan passport:client --client

// Use in middleware
Route::middleware(['client'])->group(function () {
    Route::get('/api/data', [DataController::class, 'index']);
});
```

## Pennant

Feature flags for Laravel.

```bash
composer require laravel/pennant
php artisan migrate
```

```php
// Define features
use Laravel\Pennant\Feature;

Feature::define('new-dashboard', fn (User $user) => $user->isEarlyAccess());

// Class-based
Feature::define(NewDashboard::class);

class NewDashboard
{
    public function __invoke(User $user): bool
    {
        return $user->isEarlyAccess();
    }
}

// Check feature
if (Feature::active('new-dashboard')) { }
if (Feature::inactive('new-dashboard')) { }

// For specific user
if (Feature::for($user)->active('new-dashboard')) { }

// In Blade
@feature('new-dashboard')
    <div>New Dashboard</div>
@endfeature

// Activate/deactivate
Feature::for($user)->activate('new-dashboard');
Feature::for($user)->deactivate('new-dashboard');

// Memory feature (resets after request)
Feature::define('beta-feature', false);
Feature::for($user)->activate('beta-feature');
```

## Pint

PHP code style fixer (based on PHP CS Fixer).

```bash
composer require laravel/pint --dev
```

```bash
# Format files
./vendor/bin/pint

# Check only (CI mode)
./vendor/bin/pint --test

# Format specific files
./vendor/bin/pint app/Models/User.php

# With verbose output
./vendor/bin/pint -v
```

```php
// pint.json
{
    "preset": "laravel",
    "rules": {
        "simplified_null_return": true,
        "braces_position": {
            "functions_opening_brace": "same_line",
            "anonymous_functions_opening_brace": "same_line"
        }
    }
}
```

## Precognition

Live form validation for Laravel.

```bash
composer require laravel/precognition
```

```php
// Controller
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ];
    }
}

// Route with precognition
Route::post('/posts', function (StorePostRequest $request) {
    return Post::create($request->validated());
})->middleware(['precognition']);
```

```blade
<form method="POST" action="/posts" x-data x-on:submit.prevent="$precognition.submit">
    @csrf
    <input type="text" name="title" x-model="title"
           x-on:change="$precognition.validate('title')">
    <div x-show="$precognition.validating('title')">Validating...</div>
    <div x-show="$precognition.invalid('title')" x-text="$precognition.errors.title"></div>

    <button type="submit">Submit</button>
</form>
```

## Prompts

Beautiful CLI prompts for PHP.

```bash
composer require laravel/prompts
```

```php
use function Laravel\Prompts\{text, password, confirm, select, multiselect, info, warning, error, note, table, spin, progress, pause, suggest, search, textarea};

// Text input
$name = text('What is your name?', 'John Doe');

// Password
$pass = password('Enter your password');

// Confirm
$confirm = confirm('Do you want to continue?', default: true);

// Select
$role = select('Select your role', ['admin', 'editor', 'user']);

// Multi-select
$roles = multiselect('Select roles', ['admin', 'editor', 'user']);

// Suggest
$name = suggest('What is your name?', ['John', 'Jane', 'Bob']);

// Search
$user = search('Search users', fn ($value) => User::where('name', 'like', "%{$value}%")->get());

// Textarea
$bio = textarea('Tell us about yourself');

// Spin
$result = spin(fn () => processApiCall(), 'Fetching data...');

// Progress
progress('Processing items', $items, function ($item) {
    processItem($item);
});

// Info/warning/error
info('Success!');
warning('Warning!');
error('Error!');

// Table
table(['Name', 'Email'], [
    ['John', 'john@example.com'],
    ['Jane', 'jane@example.com'],
]);

// Pause
pause('Press ENTER to continue.');
```

## Pulse

Application performance monitoring.

```bash
composer require laravel/pulse
php artisan pulse:install
php artisan migrate
```

```bash
# Start Pulse (captures metrics)
php artisan pulse:work

# Dashboard available at /pulse
```

```php
// Custom recorders
use Laravel\Pulse\Facades\Pulse;

Pulse::record('custom_metric', 'key', 100);
Pulse::value('custom_value', 'some_value');
```

## Reverb

First-party WebSocket server for Laravel.

```bash
composer require laravel/reverb
php artisan reverb:install
```

```bash
# Start Reverb server
php artisan reverb:start

# With custom port
php artisan reverb:start --port=8080

# With SSL
php artisan reverb:start --host=0.0.0.0 --port=8443 --tls
```

```env
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=
REVERB_PORT=8080
REVERB_SCHEME=http
```

## Sail

Docker development environment for Laravel.

```bash
composer require laravel/sail --dev
php artisan sail:install
php artisan sail:add redis
php artisan sail:add meilisearch
php artisan sail:add selenium

# Start Sail
./vendor/bin/sail up -d

# Stop Sail
./vendor/bin/sail down

# Artisan via Sail
./vendor/bin/sail artisan migrate

# Composer via Sail
./vendor/bin/sail composer require package/name

# npm via Sail
./vendor/bin/sail npm run dev

# Tests via Sail
./vendor/bin/sail test
```

### Sail Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'

# Then use
sail up -d
sail artisan migrate
sail test
```

## Sanctum

API token authentication.

```bash
composer require laravel/sanctum
php artisan migrate
```

```php
// config/auth.php
'api' => [
    'driver' => 'sanctum',
    'provider' => 'users',
],
```

```php
// User model
use Laravel\Sanctum\HasApiTokens;

class User extends Model
{
    use HasApiTokens;
}

// Create token
$token = $user->createToken('token-name', ['read', 'write']);
$plainTextToken = $token->plainTextToken;

// Use token
$response = $this->withHeader('Authorization', 'Bearer ' . $token)
    ->get('/api/user');

// Check abilities
if ($user->tokenCan('read')) { }

// Revoke tokens
$user->tokens()->delete();          // All
$user->currentAccessToken()->delete(); // Current
```

### SPA Authentication

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),

// Ensure session driver and CSRF in SPA
// Frontend sends credentials: 'include'
```

## Scout

Full-text search (covered in http-localization-search.md).

```bash
composer require laravel/scout
```

## Socialite

OAuth authentication with social providers.

```bash
composer require laravel/socialite
```

```php
// config/services.php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI'),
],
```

```php
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // $user->getId()
    // $user->getNickname()
    // $user->getName()
    // $user->getEmail()
    // $user->getAvatar()
    // $user->token
    // $user->refreshToken
    // $user->expiresIn
});
```

### Available Providers

- GitHub, Google, Facebook, Twitter, LinkedIn, GitLab, Bitbucket
- Custom providers available via community packages

## Telescope

Debug assistant for Laravel.

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

```bash
# Dashboard available at /telescope

# Run Telescope
php artisan telescope

# Clear Telescope data
php artisan telescope:clear

# Prune old data
php artisan telescope:prune
```

```php
// config/telescope.php
'enabled' => env('TELESCOPE_ENABLED', true),

'watchers' => [
    Watchers\CacheWatcher::class => true,
    Watchers\CommandWatcher::class => true,
    Watchers\EventWatcher::class => true,
    Watchers\ExceptionWatcher::class => true,
    Watchers\JobWatcher::class => true,
    Watchers\LogWatcher::class => true,
    Watchers\MailWatcher::class => true,
    Watchers\ModelWatcher::class => true,
    Watchers\QueryWatcher::class => true,
    Watchers\RedisWatcher::class => true,
    Watchers\RequestWatcher::class => true,
    Watchers\ScheduleWatcher::class => true,
],
```

## Valet

Development environment for macOS.

```bash
composer global require laravel/valet
valet install

# Park a directory
cd ~/Sites
valet park

# Link a specific site
cd my-app
valet link

# Secure with TLS
valet secure

# Open in browser
valet open

# Share (ngrok)
valet share
```

## Homestead

Vagrant-based development environment (legacy).

```bash
composer require laravel/homestead --dev
php artisan vendor:publish --provider="Laravel\Homestead\HomesteadServiceProvider"
```

## Best Practices

1. Use Sanctum for API token authentication (simpler than Passport)
2. Use Passport only when you need full OAuth2 server
3. Use Horizon for Redis queue monitoring in production
4. Use Telescope in development for debugging
5. Use Pulse for production performance monitoring
6. Use Pint for consistent code formatting
7. Use Pennant for feature flags and gradual rollouts
8. Use Reverb for first-party WebSocket server
9. Use Octane for high-performance applications ( FrankenPHP/Swoole)
10. Use Sail for consistent Docker development environments
