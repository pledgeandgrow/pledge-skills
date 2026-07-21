# Routing and Controllers

Routing, middleware, CSRF protection, controllers, requests, and responses.

## Routing

### Basic Routing

```php
// routes/web.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

// Closure route
Route::get('/', function () {
    return view('welcome');
});

// Controller route
Route::get('/home', [HomeController::class, 'index']);
```

### Available Router Methods

```php
Route::get($uri, $action);
Route::post($uri, $action);
Route::put($uri, $action);
Route::patch($uri, $action);
Route::delete($uri, $action);
Route::options($uri, $action);

// Multiple HTTP verbs
Route::match(['get', 'post'], '/path', $action);

// All HTTP verbs
Route::any('/path', $action);
```

### The Default Route Files

- **routes/web.php** — Web routes (session state, CSRF protection)
- **routes/api.php** — API routes (stateless, `/api` prefix)
- **routes/console.php** — Console command routes
- **routes/channels.php** — Broadcasting channel routes

### Redirect Routes

```php
Route::redirect('/here', '/there');
Route::redirect('/here', '/there', 301); // Custom status
Route::permanentRedirect('/here', '/there'); // 301 redirect
```

### View Routes

```php
Route::view('/welcome', 'welcome');
Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```

### Listing Your Routes

```bash
# List all registered routes
php artisan route:list

# Filter by name
php artisan route:list --name=user

# Filter by path
php artisan route:list --path=api

# Filter by method
php artisan route:list --method=GET

# Show in JSON format
php artisan route:list --json

# Show middleware
php artisan route:list -v
```

### Route Parameters

#### Required Parameters

```php
Route::get('/user/{id}', function (string $id) {
    return 'User '.$id;
});

// Multiple parameters
Route::get('/posts/{post}/comments/{comment}', function (string $postId, string $commentId) {
    // ...
});
```

#### Optional Parameters

```php
Route::get('/user/{name?}', function (?string $name = 'Guest') {
    return $name;
});
```

#### Regular Expression Constraints

```php
Route::get('/user/{id}', function (string $id) {
    // ...
})->where('id', '[0-9]+');

Route::get('/user/{name}', function (string $name) {
    // ...
})->where('name', '[A-Za-z]+');

// Multiple constraints
Route::get('/user/{id}/{name}', function (string $id, string $name) {
    // ...
})->where(['id' => '[0-9]+', 'name' => '[a-z]+']);

// Global constraints (in RouteServiceProvider)
Route::pattern('id', '[0-9]+');
```

#### Encoded Forward Slashes

```php
// Allow forward slashes in a parameter
Route::get('/search/{search}', function (string $search) {
    // ...
})->where('search', '.*');
```

### Named Routes

```php
Route::get('/user/profile', function () {
    // ...
})->name('profile');

// Generate URL from named route
$url = route('profile');
$url = route('profile', ['id' => 1]);

// Redirect to named route
return redirect()->route('profile');

// Inspect current route
$route = Route::current();
$name = Route::currentRouteName();
$action = Route::currentRouteAction();
```

### Route Groups

```php
// Middleware group
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
});

// Controller group
Route::controller(OrderController::class)->group(function () {
    Route::get('/orders', 'index');
    Route::get('/orders/{id}', 'show');
    Route::post('/orders', 'store');
});

// Subdomain routing
Route::domain('{account}.example.com')->group(function () {
    Route::get('/dashboard', function (string $account) {
        // ...
    });
});

// Route prefix
Route::prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    // /admin/users
});

// Name prefix
Route::name('admin.')->group(function () {
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    // admin.users
});
```

### Route Model Binding

#### Implicit Binding

```php
// Laravel automatically resolves Eloquent models
Route::get('/users/{user}', function (User $user) {
    return $user;
});

// Custom key
Route::get('/posts/{post:slug}', function (Post $post) {
    return $post;
});

// Custom key in model
class Post extends Model
{
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
});
```

#### Implicit Enum Binding

```php
enum Category: string
{
    case Fruits = 'fruits';
    case People = 'people';
}

Route::get('/categories/{category}', function (Category $category) {
    return $category->value;
});
```

#### Explicit Binding

```php
// In RouteServiceProvider::boot()
Route::bind('admin', function (string $value) {
    return Admin::where('email', $value)->firstOrFail();
});
```

#### Customizing the Resolution Logic

```php
// Customize key resolution
Route::get('/users/{user}', function (User $user) {
    return $user;
})->whereNumber('user'); // Only numeric values

// Missing model fallback
Route::get('/users/{user}', function (User $user) {
    return $user;
})->missing(function (Request $request) {
    return Redirect::route('users.index');
});
```

### Fallback Routes

```php
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});
```

### Rate Limiting

```php
// Define rate limiter (in AppServiceProvider::boot())
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Multiple limits
RateLimiter::for('uploads', function (Request $request) {
    return [
        Limit::perMinute(10),
        Limit::perDay(100)->by($request->user()->id),
    ];
});

// Attach to routes
Route::middleware(['throttle:api'])->group(function () {
    Route::get('/data', [DataController::class, 'index']);
});
```

### Form Method Spoofing

```blade
<form action="/posts/1" method="POST">
    @method('PUT')
    @csrf
    <!-- form fields -->
</form>
```

### Route Caching

```bash
# Cache routes (production)
php artisan route:cache

# Clear route cache
php artisan route:clear
```

## Middleware

### Defining Middleware

```bash
php artisan make:middleware EnsureUserIsAdmin
```

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->user()?->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

### Registering Middleware

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    // Global middleware
    $middleware->append(TrustProxies::class);

    // Middleware aliases
    $middleware->alias([
        'admin' => EnsureUserIsAdmin::class,
        'throttle' => ThrottleRequests::class,
    ]);
})
```

#### Assigning Middleware to Routes

```php
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('admin');

// Multiple middleware
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware(['auth', 'admin']);

// Exclude middleware
Route::get('/public', [PageController::class, 'public'])
    ->withoutMiddleware(['auth']);
```

#### Middleware Groups

```php
$middleware->group('web', [
    \App\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
]);

$middleware->group('api', [
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
]);
```

### Middleware Parameters

```php
class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if (! $request->user()->hasRole($role)) {
            abort(403);
        }
        return $next($request);
    }
}

// Usage
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('role:admin');

// Multiple parameters
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('role:admin,editor');
```

### Terminable Middleware

```php
class LogRequests
{
    public function handle(Request $request, Closure $next): mixed
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Called after response is sent to browser
        Log::info('Request completed', [
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
        ]);
    }
}
```

## CSRF Protection

### Excluding URIs from CSRF Protection

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'webhook/*',
        'api/stripe/*',
    ]);
})
```

### CSRF in Blade Forms

```blade
<form method="POST" action="/profile">
    @csrf
    <!-- form fields -->
</form>
```

### CSRF Tokens in JavaScript

```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

```js
// Axios automatically sends CSRF token
axios.defaults.headers.common['X-CSRF-TOKEN'] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');
```

## Controllers

### Basic Controllers

```bash
php artisan make:controller UserController
php artisan make:controller UserController --resource
php artisan make:controller UserController --api
php artisan make:controller UserController --invokable
```

```php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(15);
        return view('users.index', compact('users'));
    }

    public function show(string $id)
    {
        return User::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        return User::create($validated);
    }
}
```

### Resource Controllers

```php
// Define resource route
Route::resource('users', UserController::class);

// API resource (no create/edit views)
Route::apiResource('users', UserController::class);

// Multiple resources
Route::resources([
    'users' => UserController::class,
    'posts' => PostController::class,
]);

// Partial resources
Route::resource('users', UserController::class)
    ->only(['index', 'show']);

Route::resource('users', UserController::class)
    ->except(['create', 'edit']);
```

### Single Action Controllers

```php
class ShowProfile extends Controller
{
    public function __invoke(string $id)
    {
        return view('profile', ['user' => User::findOrFail($id)]);
    }
}

Route::get('/profile/{id}', ShowProfile::class);
```

### Dependency Injection in Controllers

```php
class UserController extends Controller
{
    // Constructor injection
    public function __construct(
        protected UserRepository $users,
    ) {}

    // Method injection
    public function show(string $id, Request $request)
    {
        return $this->users->find($id);
    }
}
```

## Requests

### Accessing Request Data

```php
use Illuminate\Http\Request;

Route::post('/submit', function (Request $request) {
    // All input
    $all = $request->all();

    // Single input
    $name = $request->input('name');
    $name = $request->input('name', 'default');

    // Query string
    $search = $request->query('search');

    // Dynamic properties
    $name = $request->name;

    // Only specific fields
    $data = $request->only(['name', 'email']);
    $data = $request->except(['password']);

    // Check if input exists
    if ($request->has('name')) { }
    if ($request->filled('name')) { }
    if ($request->missing('name')) { }
});
```

### Request Path and Method

```php
$uri = $request->path();        // e.g., "users/1"
$url = $request->url();         // Full URL without query
$fullUrl = $request->fullUrl(); // Full URL with query
$method = $request->method();   // GET, POST, etc.
$isPost = $request->isMethod('post');
```

### File Uploads

```php
if ($request->hasFile('photo')) {
    $file = $request->file('photo');
    $path = $request->file('photo')->store('photos', 'public');
    // Returns: photos/xyz.jpg
}

// Multiple files
foreach ($request->file('photos') as $file) {
    $file->store('photos', 'public');
}
```

### Request Headers

```php
$value = $request->header('Content-Type');
$bearer = $request->bearerToken();
$ip = $request->ip();
$userAgent = $request->userAgent();
```

## Responses

### Creating Responses

```php
// String/array response
return 'Hello World';
return ['key' => 'value'];

// Response object
return response('Hello', 200)
    ->header('Content-Type', 'text/plain');

// JSON response
return response()->json(['name' => 'Taylor'], 200);

// Redirect
return redirect('/home');
return redirect()->route('home');
return redirect()->back()->withInput();

// View response
return response()->view('hello', ['name' => 'Taylor']);

// Download
return response()->download($pathToFile);
return response()->download($pathToFile, 'name.pdf', $headers);

// Stream download
return response()->streamDownload(function () {
    echo file_get_contents('https://example.com/file');
}, 'file.txt');
```

### Response Macros

```php
// In a service provider
Response::macro('caps', function (string $value) {
    return Response::make(strtoupper($value));
});

// Usage
return response()->caps('hello');
```

## Best Practices

1. Use route model binding instead of manual model lookups
2. Group related routes with `Route::group()`
3. Use resource controllers for CRUD operations
4. Use form requests for validation instead of inline validation
5. Use middleware for cross-cutting concerns
6. Cache routes in production with `route:cache`
7. Use named routes for URL generation
8. Use `throttle` middleware for rate limiting APIs
9. Keep controllers thin — move business logic to services
10. Use method injection for request-specific dependencies
