# Views, Blade, and Frontend

Views, Blade templates, asset bundling, URL generation, and session management.

## Views

### Creating and Returning Views

```php
// Return a view
return view('welcome');
return view('users.index', ['users' => $users]);

// Share data with all views
View::share('key', 'value');

// Check if a view exists
if (view()->exists('emails.customer')) {
    // ...
}

// First view that exists
return view()->first([
    'custom.template',
    'default.template',
], $data);
```

### View Composers

```php
// In a service provider
View::composer('profile', function (View $view) {
    $view->with('count', User::count());
});

// Multiple views
View::composer(['profile', 'dashboard'], function (View $view) {
    $view->with('count', User::count());
});

// All views
View::composer('*', function (View $view) {
    $view->with('settings', Settings::first());
});

// Class-based composers
View::composer('profile', ProfileComposer::class);

class ProfileComposer
{
    public function compose(View $view): void
    {
        $view->with('count', User::count());
    }
}
```

### View Creators

```php
// View creators run immediately (before view is rendered)
View::creator('profile', function (View $view) {
    $view->with('count', User::count());
});
```

## Blade Templates

### Displaying Data

```blade
Hello, {{ $name }}.

{{-- HTML entity encoding is automatic --}}
{{ $user->bio }}

{{-- Double curly braces --}}
{{ $value }}
```

### Blade and JavaScript Frameworks

```blade
{{-- Use @ to escape Blade directives --}}
@{{ javascriptVariable }}

{{-- Verbatim blocks --}}
@verbatim
    <div>{{ javascriptVariable }}</div>
@endverbatim
```

### Blade Directives

#### If Statements

```blade
@if ($users->isNotEmpty())
    User count: {{ $users->count() }}
@elseif ($users->isEmpty())
    No users found.
@else
    Loading...
@endif

@unless (auth()->check())
    Please log in.
@endunless

@isset($records)
    Records exist.
@endisset

@empty($records)
    No records.
@endempty

@auth
    Welcome, {{ auth()->user()->name }}.
@endauth

@guest
    Please log in.
@endguest

@can('update', $post)
    <a href="/posts/{{ $post->id }}/edit">Edit</a>
@endcan
```

#### Switch Statements

```blade
@switch($type)
    @case('admin')
        Admin user
        @break
    @case('editor')
        Editor user
        @break
    @default
        Regular user
@endswitch
```

#### Loops

```blade
@for ($i = 0; $i < 10; $i++)
    Item {{ $i }}
@endfor

@foreach ($users as $user)
    {{ $user->name }}
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <li>No users</li>
@endforelse

@while (true)
    {{-- Be careful with infinite loops --}}
@endwhile
```

#### The Loop Variable

```blade
@foreach ($users as $user)
    @if ($loop->first)
        First item
    @endif

    @if ($loop->last)
        Last item
    @endif

    {{ $loop->index }}        {{-- 0-based --}}
    {{ $loop->iteration }}    {{-- 1-based --}}
    {{ $loop->count }}        {{-- Total items --}}
    {{ $loop->remaining }}    {{-- Remaining items --}}
    {{ $loop->even }}         {{-- Boolean --}}
    {{ $loop->odd }}           {{-- Boolean --}}
    {{ $loop->depth }}         {{-- Nesting depth --}}
    {{ $loop->parent->iteration ?? null }} {{-- Parent loop --}}
@endforeach
```

#### Conditional Classes

```blade
<span @class(['font-bold', 'text-red' => $hasError])>
    {{ $message }}
</span>
```

#### Including Subviews

```blade
@include('partials.header')
@include('partials.header', ['title' => 'Custom Title'])

@includeIf('partials.header')
@includeWhen($showHeader, 'partials.header')
@includeFirst(['custom.header', 'partials.header'])
```

#### Raw PHP

```blade
@php
    $counter = 0;
@endphp

@php($counter = 0)
```

#### Comments

```blade
{{-- This comment will not appear in the rendered HTML --}}
```

### Components

#### Creating Components

```bash
php artisan make:component Alert
php artisan make:component Alert --inline
php artisan make:component Forms/Input
```

#### Rendering Components

```blade
{{-- Tag syntax --}}
<x-alert />

{{-- With attributes --}}
<x-alert type="error" :message="$message" />

{{-- Self-closing --}}
<x-user-avatar :user="$user" />

{{-- Inline content --}}
<x-button>
    Click me
</x-button>
```

#### Passing Data to Components

```php
namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public ?string $message = null,
    ) {}

    public function render(): string
    {
        return view('components.alert');
    }
}
```

#### Component Attributes

```blade
{{-- In component template --}}
<div {{ $attributes }}>
    {{ $message }}
</div>

{{-- Merge attributes with defaults --}}
<div {{ $attributes->merge(['class' => 'alert']) }}>

{{-- Class merging --}}
<div {{ $attributes->class(['p-4', 'bg-red' => $type === 'error']) }}>

{{-- Attribute bags --}}
@props(['type' => 'info'])
<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }}>
    {{ $slot }}
</div>
```

#### Slots

```blade
{{-- Default slot --}}
<x-card>
    Content here
</x-card>

{{-- Named slots --}}
<x-card>
    <x-slot:title>
        Card Title
    </x-slot:title>
    Card content
</x-card>

{{-- In component --}}
<div>
    <h2>{{ $title }}</h2>
    <div>{{ $slot }}</div>
</div>
```

### Building Layouts

#### Layouts Using Components

```blade
{{-- resources/views/components/layout.blade.php --}}
<html>
    <head>
        <title>{{ $title ?? 'Laravel' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>

{{-- Using the layout --}}
<x-layout>
    <x-slot:title>Home Page</x-slot:title>
    <h1>Welcome!</h1>
</x-layout>
```

#### Layouts Using Template Inheritance

```blade
{{-- resources/views/layouts/app.blade.php --}}
<html>
    <body>
        @yield('content')
    </body>
</html>

{{-- Using the layout --}}
@extends('layouts.app')

@section('content')
    <h1>Welcome!</h1>
@endsection
```

### Forms

```blade
<form method="POST" action="/profile">
    @csrf
    @method('PUT')

    <label for="name">Name</label>
    <input type="text" name="name" id="name" value="{{ old('name') }}">

    @error('name')
        <div class="error">{{ $message }}</div>
    @enderror

    <button type="submit">Save</button>
</form>
```

### Stacks

```blade
{{-- In layout --}}
<head>
    @stack('scripts')
</head>

{{-- In any template --}}
@push('scripts')
    <script src="/custom.js"></script>
@endpush

@prepend('scripts')
    <script src="/first.js"></script>
@endprepend
```

### Service Injection

```blade
@inject('metrics', 'App\Services\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}
</div>
```

### Rendering Blade Fragments

```blade
<div>
    <div id="stats">
        {{ $user->posts_count }} posts
    </div>
</div>

{{-- Render only a fragment --}}
@fragment('stats')
    {{ $user->posts_count }} posts
@endfragment
```

### Extending Blade

```php
// Custom directive
Blade::directive('datetime', function (string $expression) {
    return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
});

// Custom if statement
Blade::if('admin', function () {
    return auth()->check() && auth()->user()->isAdmin();
});

// Usage: @admin ... @endadmin
```

## Asset Bundling (Vite)

### Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // For React

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
```

### Loading Assets in Blade

```blade
{{-- Load CSS/JS --}}
@vite(['resources/css/app.css', 'resources/js/app.js'])

{{-- In head --}}
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

### Custom Entry Points

```js
// vite.config.js
laravel({
    input: {
        'app': 'resources/js/app.js',
        'admin': 'resources/js/admin.js',
    },
})
```

```blade
@vite('resources/js/app.js')
@vite('resources/js/admin.js', 'build') // Custom build directory
```

### Running Vite

```bash
# Development (hot module replacement)
npm run dev

# Production build
npm run build
```

### Vite with Blade Components

```blade
{{-- Image assets --}}
<img src="{{ Vite::asset('resources/images/logo.png') }}" alt="Logo">
```

## URL Generation

### Basic URL Generation

```php
use Illuminate\Support\Facades\URL;

// Basic URLs
$url = URL::to('/profile');
$url = URL::to('/profile', ['id' => 1]);
$secureUrl = URL::secure('/profile');

// Named route URLs
$url = route('profile');
$url = route('profile', ['id' => 1]);
$url = route('profile', ['id' => 1], false); // Relative

// Signed URLs (for secure routes)
$url = URL::signedRoute('unsubscribe', ['user' => 1]);
$temporaryUrl = URL::temporarySignedRoute('unsubscribe', now()->addMinutes(30), ['user' => 1]);

// Controller action URLs
$url = action([UserController::class, 'index']);
$url = action([UserController::class, 'show'], ['id' => 1]);
```

### Default Values

```php
// In a service provider
URL::defaults(['locale' => app()->getLocale()]);

// Force scheme
URL::forceScheme('https');
URL::forceRootUrl('https://example.com');
```

## Session

### Configuration

```env
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
```

### Using the Session

```php
use Illuminate\Http\Request;

Route::get('/session', function (Request $request) {
    // Store data
    $request->session()->put('key', 'value');
    session(['key' => 'value']);

    // Retrieve data
    $value = $request->session()->get('key');
    $value = $request->session()->get('key', 'default');
    $value = session('key');

    // Check existence
    if ($request->session()->has('key')) { }
    if ($request->session()->exists('key')) { }
    if ($request->session()->missing('key')) { }

    // Remove data
    $request->session()->forget('key');
    $request->session()->flush();

    // Regenerate session ID
    $request->session()->regenerate();
    $request->session()->invalidate();

    // Flash data (only for next request)
    $request->session()->flash('status', 'Task completed!');
    $request->session()->reflash(); // Keep all flash data
    $request->session()->keep(['status', 'error']); // Keep specific
});
```

### Flash Data in Views

```blade
@if (session('status'))
    <div class="alert">
        {{ session('status') }}
    </div>
@endif
```

### Session Drivers

| Driver | Description |
|--------|-------------|
| `file` | Store in `storage/framework/sessions` |
| `cookie` | Store in encrypted cookies |
| `database` | Store in database table |
| `redis` | Store in Redis |
| `memcached` | Store in Memcached |
| `array` | In-memory (testing only) |

## Best Practices

1. Use component-based layouts over template inheritance
2. Use `@class` directive for conditional CSS classes
3. Use `@stack`/`@push` for page-specific scripts/styles
4. Use Vite for asset bundling — avoid Mix for new projects
5. Use signed routes for secure, time-limited URLs
6. Use `session()->flash()` for one-time status messages
7. Use view composers for data shared across multiple views
8. Keep Blade templates clean — move complex logic to PHP classes
9. Use `@error` directive for form validation error display
10. Use `old()` helper to repopulate form fields after validation errors
