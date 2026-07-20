# Composer, PIE, and Package Management

## Composer

Composer is the de facto dependency manager for PHP. It manages project dependencies, autoloading, and scripts.

### Installation

```bash
# Download Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Or via package manager
# macOS: brew install composer
# Ubuntu/Debian: apt install composer
# Windows: download composer-setup.exe

# Verify
composer --version
```

### composer.json

```json
{
    "name": "acme/myapp",
    "type": "project",
    "license": "MIT",
    "description": "My awesome PHP application",
    "require": {
        "php": ">=8.3",
        "monolog/monolog": "^3.0",
        "symfony/console": "^7.0",
        "doctrine/orm": "^3.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0",
        "squizlabs/php_codesniffer": "^3.0",
        "phpstan/phpstan": "^1.0"
    },
    "autoload": {
        "psr-4": {
            "Acme\\MyApp\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Acme\\MyApp\\Tests\\": "tests/"
        }
    },
    "scripts": {
        "test": "phpunit",
        "lint": "phpcs src/",
        "analyse": "phpstan analyse src/",
        "post-install-cmd": "Acme\\MyApp\\Installer::postInstall"
    },
    "config": {
        "platform": {
            "php": "8.3"
        },
        "optimize-autoloader": true,
        "preferred-install": "dist"
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

### Basic Commands

```bash
# Initialize project
composer init

# Install dependencies
composer install
composer install --no-dev
composer install --optimize-autoloader

# Add dependency
composer require monolog/monolog
composer require monolog/monolog:^3.0
composer require --dev phpunit/phpunit

# Update dependencies
composer update
composer update monolog/monolog
composer update --with-dependencies

# Remove dependency
composer remove monolog/monolog

# Create project from package
composer create-project laravel/laravel myapp
composer create-project symfony/skeleton myapp

# Dump autoloader
composer dump-autoload
composer dump-autoload --optimize

# Show installed packages
composer show
composer show monolog/monolog
composer show --tree

# Check for outdated packages
composer outdated
composer outdated --direct

# Audit for security vulnerabilities
composer audit

# Validate composer.json
composer validate

# Check platform requirements
composer check-platform-reqs
```

### Autoloading

```php
// PSR-4 (recommended)
// "autoload": { "psr-4": { "Acme\\": "src/" } }
// src/MyClass.php -> Acme\MyClass

// PSR-0 (deprecated)
// "autoload": { "psr-0": { "Acme_": "src/" } }

// Classmap
// "autoload": { "classmap": ["src/", "lib/"] }

// Files (always loaded)
// "autoload": { "files": ["src/functions.php"] }

// After adding autoload config, regenerate:
// composer dump-autoload

// In your application entry point:
require __DIR__ . '/vendor/autoload.php';
```

### Version Constraints

```
1.0.0       — exact version
>=1.0       — minimum version
>=1.0 <2.0  — range
^1.0        — compatible (>=1.0.0 <2.0.0)
^1.2.3      — compatible (>=1.2.3 <2.0.0)
~1.2        — ~1.2 = >=1.2.0 <2.0.0
~1.2.3      — ~1.2.3 = >=1.2.3 <1.3.0
*           — any version
dev-main    — development branch
1.0.0@dev   — dev version
```

### Scripts

```json
{
    "scripts": {
        "test": "phpunit",
        "test:unit": "phpunit --testsuite unit",
        "lint": "phpcs",
        "fix": "phpcbf",
        "analyse": "phpstan analyse",
        "post-install-cmd": "@cache:clear",
        "post-update-cmd": "@cache:clear",
        "cache:clear": "rm -rf var/cache/*"
    }
}
```

```bash
composer test
composer lint
composer analyse
composer run-script test
```

### Composer Plugins

```bash
# Install a plugin
composer require composer/installers

# Common plugins:
# composer/installers — custom install paths for frameworks
# hirak/prestissimo — parallel downloads (legacy)
# bamarni/composer-bin-plugin — isolated bin installations
# composer-require-checker — verify no implicit dependencies
```

## PIE (PHP Installer for Extensions)

PIE is a tool for installing PHP extensions from Packagist/PECL-style packages.

```bash
# Install PIE
composer global require php/pie

# Install an extension
pie install ext-redis
pie install ext-xdebug

# List installed extensions
pie list

# Uninstall
pie uninstall ext-redis
```

## PECL (PHP Extension Community Library)

```bash
# List available extensions
pecl search redis

# Install extension
pecl install redis
pecl install xdebug

# Install specific version
pecl install redis-5.3.7

# Uninstall
pecl uninstall redis

# List installed
pecl list

# After installing, enable in php.ini:
// extension=redis
```

## Manual Extension Management

```bash
# List compiled-in (and loaded) extensions
php -m

# List all loaded modules with details
php --ri redis

# Check if extension is loaded
php -r 'echo extension_loaded("redis") ? "yes" : "no";'

# Enable extension in php.ini
# extension=redis.so  (Linux)
// extension=redis.dll (Windows)
```

## Best Practices

- Always commit `composer.json` and `composer.lock`
- Run `composer install` (not `update`) in production — uses lock file
- Use `--optimize-autoloader` in production for faster autoloading
- Pin PHP version in `config.platform.php`
- Use `composer audit` in CI for security checks
- Keep dependencies updated regularly
- Use `require-dev` for development-only tools
- Prefer `^` (caret) for version constraints in libraries
- Use `~` (tilde) for more conservative patch-level updates
- Run `composer validate` before committing
