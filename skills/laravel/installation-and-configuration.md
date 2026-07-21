# Installation and Configuration

Getting started with Laravel 13.x — installation, configuration, directory structure, and deployment.

## Meet Laravel

Laravel is a PHP web application framework with expressive, elegant syntax. It provides:
- **Simple, fast routing** engine
- **Powerful dependency injection** container
- **Eloquent ORM** for database operations
- **Queue system** for background jobs
- **Built-in testing** support

### Why Laravel?

- Expressive syntax and developer experience
- Robust, maintainable code
- Full-stack framework (routing, ORM, queues, events, broadcasting, testing)
- Scalable (Octane for high-performance, Vapor for serverless)
- First-party packages (Cashier, Horizon, Telescope, Scout, etc.)
- AI-ready (Boost, AI SDK, MCP support)

## Creating a Laravel Application

### Installing PHP and the Laravel Installer

```bash
# Install Laravel installer via Composer
composer global require laravel/installer

# Ensure Composer's global bin directory is in your PATH
# macOS: ~/.composer/vendor/bin
# Windows: %USERPROFILE%\AppData\Roaming\Composer\vendor\bin

# Create a new Laravel application
laravel new my-app

# Or use Composer directly
composer create-project laravel/laravel my-app
```

### Getting Started Using AI

```bash
# Laravel Boost provides AI-powered development
# Install Boost (requires Laravel 13.x)
composer require laravel/boost --dev

# Or use the installer with AI assistance
laravel new my-app --ai
```

### Creating an Application

```bash
# Basic application
laravel new my-app

# With specific database
laravel new my-app --sqlite
laravel new my-app --mysql
laravel new my-app --pgsql

# With starter kit
laravel new my-app --starter-kit=react
laravel new my-app --starter-kit=vue
laravel new my-app --starter-kit=livewire

# With authentication scaffolding
laravel new my-app --auth

# Without Git initialization
laravel new my-app --no-git

# Force overwrite existing directory
laravel new my-app --force
```

## Installation Using Herd

### Herd on macOS

```bash
# Download Herd from https://herd.laravel.com
# Herd includes PHP, Composer, and Laravel installer

# Create a site via Herd
herd new my-app
```

### Herd on Windows

```bash
# Download Herd for Windows from https://herd.laravel.com/windows
# Includes PHP, Composer, Node.js, and Laravel installer

# Park a directory
herd park ~/Projects

# Link a specific site
cd my-app
herd link
```

## Initial Configuration

### Environment Based Configuration

Laravel uses `.env` files for environment-specific configuration:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

```bash
# Generate application key
php artisan key:generate

# Cache configuration for production
php artisan config:cache

# Clear configuration cache
php artisan config:clear
```

### Databases and Migrations

```bash
# Run migrations
php artisan migrate

# Run with fresh database
php artisan migrate:fresh

# Run with seed data
php artisan migrate:fresh --seed
```

### Directory Configuration

Laravel should be configured with the web root pointing to the `public/` directory:
- **Apache**: Set `DocumentRoot` to `/path/to/my-app/public`
- **Nginx**: Set `root` directive to `/path/to/my-app/public`

## Directory Structure

```
my-app/
├── app/
│   ├── Console/          # Artisan commands
│   ├── Exceptions/       # Exception handlers
│   ├── Http/
│   │   ├── Controllers/  # Controllers
│   │   ├── Middleware/   # Middleware
│   │   └── Kernel.php    # HTTP kernel
│   ├── Models/           # Eloquent models
│   ├── Providers/        # Service providers
│   ├── Services/         # Service classes
│   └── View/             # View components
├── bootstrap/
│   └── app.php           # Application bootstrap
├── config/               # Configuration files
├── database/
│   ├── factories/        # Model factories
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── lang/                 # Localization files
├── public/               # Publicly accessible files
│   └── index.php         # Front controller
├── resources/
│   ├── css/              # CSS files
│   ├── js/               # JavaScript files
│   └── views/            # Blade templates
├── routes/
│   ├── api.php           # API routes
│   ├── channels.php      # Broadcasting channels
│   ├── console.php       # Console routes
│   └── web.php           # Web routes
├── storage/
│   ├── app/              # Application files
│   ├── framework/        # Framework files
│   └── logs/             # Log files
├── tests/                # Test files
├── .env                  # Environment configuration
├── artisan               # Artisan CLI
├── composer.json         # Composer dependencies
└── package.json          # NPM dependencies
```

### Root Directory

- **app/** — Core application code (models, controllers, services)
- **bootstrap/** — Application bootstrap and autoloading
- **config/** — Configuration options for all framework features
- **database/** — Migrations, factories, and seeders
- **lang/** — Language files for localization
- **public/** — Web server document root (index.php, assets)
- **resources/** — Views, CSS, JS, and language files
- **routes/** — Route definitions for web, API, console, channels
- **storage/** — Compiled views, file uploads, logs, app data
- **tests/** — PHPUnit/Pest test files
- **vendor/** — Composer dependencies (auto-generated)

### App Directory

- **Console/** — Artisan commands and command schedules
- **Exceptions/** — Exception handler and custom exceptions
- **Http/Controllers/** — Controller classes
- **Http/Middleware/** — HTTP middleware
- **Models/** — Eloquent model classes
- **Providers/** — Service providers for binding, event registration
- **Services/** — Service classes for business logic

## Configuration

### Accessing Configuration Values

```php
use Illuminate\Support\Facades\Config;

// Get a configuration value
$value = config('app.timezone');
$default = config('app.timezone', 'UTC');

// Set a configuration value at runtime
Config::set('app.timezone', 'America/New_York');

// Check if a configuration value exists
$exists = Config::has('app.timezone');
```

### Environment Variables

```php
// Access environment variables
$env = env('APP_ENV');
$debug = env('APP_DEBUG', false);

// In config files, use env() to read from .env
'timezone' => env('APP_TIMEZONE', 'UTC'),
```

### Configuration Caching

```bash
# Cache all configuration into a single file
php artisan config:cache

# Clear the configuration cache
php artisan config:clear
```

> **Warning**: After running `config:cache`, the `.env` file is no longer loaded. Use `config()` instead of `env()` in your application code.

### Maintenance Mode

```bash
# Enable maintenance mode
php artisan down

# With a custom message
php artisan down --message="Upgrading to v2!"

# With a retry-after header
phpartisan down --retry=60

# With a specific render page
php artisan down --render="errors::503"

# Bypass maintenance mode with a token
php artisan down --secret="my-secret-token"
# Access via: https://example.com/my-secret-token

# Disable maintenance mode
php artisan up
```

## Frontend

### Vite Integration

Laravel uses Vite for asset bundling by default:

```js
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
```

```blade
<!-- In Blade templates -->
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

### Using Blade with Livewire

```bash
# Install Livewire
composer require livewire/livewire
```

### Using Inertia (React/Vue/Svelte)

```bash
# Create app with Inertia + React
laravel new my-app --starter-kit=react

# Create app with Inertia + Vue
laravel new my-app --starter-kit=vue

# Create app with Inertia + Svelte
laravel new my-app --starter-kit=svelte
```

## Starter Kits

Laravel provides first-party starter kits:
- **Laravel Breeze** — Simple auth scaffolding (Blade, Livewire, Inertia)
- **Laravel Jetstream** — Advanced auth with teams, 2FA, profile management
- **Laravel Starter Kits** — Pre-built with React, Vue, or Livewire

```bash
# Install Breeze
composer require laravel/breeze --dev
php artisan breeze:install

# Choose stack
php artisan breeze:install blade
php artisan breeze:install livewire
php artisan breeze:install react
php artisan breeze:install vue
```

## Deployment

### Server Requirements

- PHP >= 8.3
- Ctype PHP Extension
- cURL PHP Extension
- DOM PHP Extension
- Fileinfo PHP Extension
- Filter PHP Extension
- Hash PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PCRE PHP Extension
- PDO PHP Extension
- Session PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension

### Optimization

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache

# Run all cache commands
php artisan optimize

# Clear all caches
php artisan optimize:clear
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/my-app/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Deployment with Laravel Forge

- Zero-click deployment from Git
- Automatic SSL certificates
- Database management
- Queue worker management
- Server monitoring

### Deployment with Laravel Vapor

- Serverless deployment on AWS Lambda
- Auto-scaling
- CDN integration
- Queue processing via SQS

### Zero Downtime Deployment

```bash
# Using Envoy
composer require laravel/envoy --dev

# Using Deployer
composer require deployer/deployer --dev
dep deploy
```

## IDE Support

- **Laravel IDE Helper** — Generates IDE helper files
- **Laravel Pint** — PHP code style fixer
- **Laravel Lang** — IDE-friendly language file support

```bash
# Install IDE helpers
composer require --dev barryvdh/laravel-ide-helper

# Generate helpers
php artisan ide-helper:generate
php artisan ide-helper:models
php artisan ide-helper:meta
```

## Next Steps

### Laravel as a Full Stack Framework

- Routing, controllers, views (Blade)
- Database (Eloquent, migrations, seeding)
- Authentication (starter kits)
- Background processing (queues, scheduling)
- Real-time events (broadcasting)

### Laravel as an API Backend

- API routing and versioning
- API resources for JSON transformation
- Sanctum for API tokens
- Passport for OAuth2
- Rate limiting and throttling

## Best Practices

1. Use `php artisan config:cache` in production
2. Never use `env()` outside of config files — use `config()` instead
3. Use `php artisan optimize` to cache everything
4. Set `APP_DEBUG=false` in production
5. Use Herd for local development on macOS/Windows
6. Use starter kits for rapid scaffolding
7. Keep `.env` out of version control
8. Use `php artisan key:generate` after cloning
9. Point web root to `public/` directory
10. Use `php artisan down` during maintenance with a secret token
