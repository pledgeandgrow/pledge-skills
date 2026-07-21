# Security

Authentication, authorization, email verification, encryption, hashing, and password reset.

## Authentication

### Authentication Quickstart

```bash
# Install a starter kit (includes auth)
laravel new my-app --starter-kit=react
# Or
composer require laravel/breeze --dev
php artisan breeze:install
```

### Retrieving the Authenticated User

```php
use Illuminate\Support\Facades\Auth;

$user = Auth::user();
$id = Auth::id();

// Via request
$user = $request->user();

// Check if authenticated
if (Auth::check()) { }
if (auth()->check()) { }

// Via middleware (route)
Route::get('/profile', function () {
    $user = auth()->user();
})->middleware('auth');
```

### Protecting Routes

```php
// Via middleware
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
});

// In controller constructor
class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
}
```

### Manually Authenticating Users

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended('dashboard');
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ])->onlyInput('email');
}

// Attempt with additional conditions
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1])) {
    // ...
}

// Attempt with remember me
if (Auth::attempt($credentials, $request->boolean('remember'))) {
    // ...
}

// Login specific user
Auth::login($user);
Auth::login($user, true); // Remember

// Login using ID
Auth::loginUsingId(1);
Auth::loginUsingId(1, true);

// Once (no session)
if (Auth::once($credentials)) {
    // ...
}
```

### Remembering Users

```php
// In migration — ensure remember_token column exists
$table->rememberToken();

// Attempt with remember
Auth::attempt($credentials, true);

// Via cookie
Auth::viaRemember();
```

### Other Authentication Methods

```php
// Authenticate by ID
Auth::loginUsingId(1);

// Authenticate user instance
Auth::login($user);

// Log out
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

### HTTP Basic Authentication

```php
// Route middleware
Route::get('/api/profile', function () {
    return auth()->user();
})->middleware('auth.basic');

// Stateless HTTP Basic (API tokens)
Route::get('/api/token', function () {
    return auth()->user();
})->middleware('auth.basic.once');
```

### Logging Out

```php
// Logout current device
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

// Logout other devices
Auth::logoutOtherDevices($request->password);
```

### Password Confirmation

```php
// Routes
Route::get('/confirm-password', [PasswordController::class, 'confirm']);
Route::post('/confirm-password', [PasswordController::class, 'store']);

// Protect routes requiring confirmed password
Route::middleware(['auth', 'password.confirm'])->group(function () {
    Route::get('/settings', [SettingsController::class, 'index']);
});
```

### Adding Custom Guards

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],
```

```php
// Using custom guard
Auth::guard('admin')->attempt($credentials);
auth()->guard('admin')->user();
```

### Adding Custom User Providers

```php
// config/auth.php
'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'custom' => [
        'driver' => 'custom-provider',
        'model' => App\Models\CustomUser::class,
    ],
],
```

### Authentication Events

```php
// Listen for auth events
Event::listen(\Illuminate\Auth\Events\Login::class, function ($event) {
    // User logged in
});

Event::listen(\Illuminate\Auth\Events\Logout::class, function ($event) {
    // User logged out
});

Event::listen(\Illuminate\Auth\Events\Registered::class, function ($event) {
    // New user registered
});
```

## Authorization

### Gates

```php
// In AppServiceProvider::boot()
use Illuminate\Support\Facades\Gate;

Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});

// Using gates
if (Gate::allows('update-post', $post)) {
    // ...
}

if (Gate::denies('update-post', $post)) {
    // ...
}

if ($user->can('update-post', $post)) {
    // ...
}

// Authorize or throw 403
Gate::authorize('update-post', $post);
```

### Policies

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Post $post): bool { return true; }
    public function create(User $user): bool { return true; }
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
    public function restore(User $user, Post $post): bool { /* ... */ }
    public function forceDelete(User $user, Post $post): bool { /* ... */ }
}
```

```php
// Register policy (automatic for model-policy naming convention)
// In AuthServiceProvider
protected $policies = [
    Post::class => PostPolicy::class,
];

// Using policies
if ($user->can('update', $post)) { }
Gate::authorize('update', $post);

// In controller
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);
    // ...
}

// In Blade
@can('update', $post)
    <a href="/posts/{{ $post->id }}/edit">Edit</a>
@endcan

// In middleware
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');
```

### Roles and Permissions

```php
// Using gates for roles
Gate::before(function (User $user, string $ability) {
    if ($user->hasRole('super-admin')) {
        return true;
    }
});

// Resource policies
Gate::resource('posts', PostPolicy::class);
// Defines: view, create, update, delete
```

### Policy Filters

```php
// Policy methods that return true automatically
class PostPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        return null; // Fall through to specific method
    }
}
```

## Email Verification

### Setup

```php
// Model must implement MustVerifyEmail
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Model implements MustVerifyEmail
{
    // ...
}
```

### Routes

```php
// In routes/web.php
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
```

### Protecting Routes

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

## Encryption

```php
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString('Hello World');
$encrypted = Crypt::encrypt(['key' => 'value']);

// Decrypt
$decrypted = Crypt::decryptString($encrypted);
$decrypted = Crypt::decrypt($encrypted);
```

### Encrypting Model Attributes

```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'ssn' => 'encrypted',
            'settings' => 'encrypted:array',
            'config' => 'encrypted:collection',
        ];
    }
}
```

## Hashing

```php
use Illuminate\Support\Facades\Hash;

// Hash a password
$hashed = Hash::make('plain-text');
$hashed = Hash::make('plain-text', ['rounds' => 12]);

// Check against hash
if (Hash::check('plain-text', $hashed)) {
    // Password matches
}

// Check if needs rehash
if (Hash::needsRehash($hashed)) {
    $hashed = Hash::make('plain-text');
}

// Using bcrypt directly
$hashed = bcrypt('plain-text');
```

### Configuring Hash Drivers

```env
HASH_DRIVER=bcrypt
# Or: argon2i, argon2id
```

## Password Reset

### Setup

```bash
# Database table (included in default migration)
php artisan migrate
```

### Routes

```php
// Forgot password
Route::get('/forgot-password', [PasswordResetLinkController::class, 'create']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

// Reset password
Route::get('/reset-password/{token}', [NewPasswordController::class, 'create']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
```

### Sending Reset Links

```php
use Illuminate\Support\Facades\Password;

$status = Password::sendResetLink(['email' => $request->email]);

if ($status === Password::RESET_LINK_SENT) {
    return back()->with(['status' => __($status)]);
}

return back()->withErrors(['email' => __($status)]);
```

### Resetting Passwords

```php
$status = Password::reset(
    $request->only('email', 'password', 'password_confirmation', 'token'),
    function ($user, $password) {
        $user->forceFill([
            'password' => Hash::make($password),
        ])->setRememberToken(Str::random(60));
        $user->save();
    }
);
```

### Customization

```php
// Custom reset broker
Password::broker('admins')->sendResetLink($credentials);

// In config/auth.php
'passwords' => [
    'users' => [
        'provider' => 'users',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
    ],
],
```

## Best Practices

1. Use starter kits for authentication scaffolding
2. Always regenerate session after login to prevent fixation
3. Use `password.confirm` middleware for sensitive actions
4. Use policies for model-specific authorization logic
5. Use gates for general authorization rules
6. Implement `MustVerifyEmail` for user accounts
7. Use `Hash::make()` for passwords — never store plain text
8. Use encrypted casts for sensitive model attributes
9. Use `throttle` middleware on login and password reset routes
10. Use `Auth::logoutOtherDevices()` for "logout everywhere" functionality
