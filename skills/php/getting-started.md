# Getting Started & Installation

## What is PHP?

PHP (recursive acronym: "PHP: Hypertext Preprocessor") is a widely-used, open-source, general-purpose scripting language especially suited for web development. It's embedded into HTML, executed on the server, and generates HTML output.

## Installation

### Linux (Ubuntu/Debian)

```bash
# Install PHP with common extensions
sudo apt install php8.4 php8.4-cli php8.4-fpm php8.4-mysql php8.4-xml php8.4-curl php8.4-gd php8.4-mbstring php8.4-zip php8.4-intl php8.4-bcmath php8.4-redis

# Install additional extensions
sudo apt install php8.4-pgsql php8.4-sqlite3 php8.4-mongodb php8.4-imagick php8.4-gmp php8.4-opcache

# Enable OPcache
sudo phpenmod opcache

# Restart web server / FPM
sudo systemctl restart php8.4-fpm
sudo systemctl restart nginx
sudo systemctl restart apache2
```

### Linux (Remi Repository — RHEL/Fedora/CentOS)

```bash
# Enable Remi repository
sudo dnf install dnf-plugins-core
sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-9.rpm
sudo dnf module reset php
sudo dnf module install php:remi-8.4

sudo dnf install php php-cli php-fpm php-mysqlnd php-xml php-curl php-gd php-mbstring php-zip php-intl php-bcmath php-opcache php-pecl-redis5
```

### macOS

```bash
# Via Homebrew
brew install php
brew install php@8.4

# With extensions
brew install php@8.4-gd php@8.4-intl

# Via MacPorts
sudo port install php84 php84-mysql php84-curl php84-gd php84-mbstring
```

### Windows

```bash
# Download from windows.php.net
# Extract to C:\php
# Add C:\php to PATH

# Enable extensions in php.ini:
# extension_dir = "ext"
// extension=pdo_mysql
// extension=curl
// extension=gd
// extension=mbstring
// extension=openssl
// extension=fileinfo
// extension=zip
// extension=intl
```

### Docker

```dockerfile
# Dockerfile
FROM php:8.4-fpm

# Install extensions
RUN docker-php-ext-install pdo_mysql mysqli mbstring opcache

# PECL extensions
RUN pecl install redis && docker-php-ext-enable redis
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader
```

```yaml
# docker-compose.yml
services:
  php:
    image: php:8.4-fpm
    volumes:
      - ./:/var/www/html
    ports:
      - "9000:9000"
  nginx:
    image: nginx:alpine
    volumes:
      - ./:/var/www/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "8080:80"
    depends_on:
      - php
```

## Configuration (php.ini)

### Key Settings

```ini
; Error handling
error_reporting = E_ALL
display_errors = On          ; Off in production
log_errors = On
error_log = /var/log/php_errors.log

; Performance
memory_limit = 256M
max_execution_time = 30
max_input_time = 60
post_max_size = 50M
upload_max_filesize = 50M

; OPcache
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0  ; 0 in production, 1 in development

; Sessions
session.save_handler = files
session.save_path = "/var/lib/php/sessions"
session.gc_maxlifetime = 1440
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = Strict
session.use_strict_mode = 1

; Paths
include_path = ".:/usr/share/php"
extension_dir = "/usr/lib/php/modules"

; Charset
default_charset = "UTF-8"
mbstring.internal_encoding = "UTF-8"
```

### Configuration Locations

```bash
# Find loaded php.ini
php --ini
php -i | grep "php.ini"

# Apache module: php.ini in Apache conf dir
# FPM: php.ini in PHP config dir
# CLI: php.ini in PHP config dir

# Scan directory for additional .ini files
php -i | grep "Scan this dir"
ls /etc/php/8.4/conf.d/
```

### Runtime Configuration

```php
// Change at runtime
ini_set('memory_limit', '512M');
ini_set('display_errors', '0');
ini_set('error_log', '/path/to/error.log');

// Get current value
$value = ini_get('memory_limit');

// Get all
$all = ini_get_all();

// Restore
ini_restore('memory_limit');
```

## Web Server Configuration

### Nginx + PHP-FPM

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### Apache + mod_php

```apache
# httpd.conf or .htaccess
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>

DirectoryIndex index.php index.html

# Enable mod_rewrite
LoadModule rewrite_module modules/mod_rewrite.so
```

### Apache + PHP-FPM (mod_proxy_fcgi)

```apache
<FilesMatch \.php$>
    SetHandler "proxy:fcgi://127.0.0.1:9000"
</FilesMatch>
```

## Built-in Development Server

```bash
# Start dev server
php -S localhost:8000

# With document root
php -S localhost:8000 -t public/

# With router script
php -S localhost:8000 -t public/ public/index.php

# With SSL (PHP 7.3+)
# Generate cert: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
php -S localhost:8000 -t public/ -S ssl://localhost:8443
```

## Checking Installation

```bash
# Version
php -v

# Loaded extensions
php -m

# PHP info
php -i

# Check specific extension
php -r 'echo extension_loaded("pdo_mysql") ? "yes" : "no";'

# Check specific config
php -i | grep "opcache"

# Run REPL
php -a

# Run script
php script.php

# Lint
php -l script.php

# Syntax check + info
php --ri pdo_mysql
```

## SAPI (Server API) Types

| SAPI | Description |
|------|-------------|
| `cli` | Command Line Interface |
| `fpm-fcgi` | FastCGI Process Manager (Nginx, Apache+mod_proxy_fcgi) |
| `apache2handler` | Apache module (mod_php) |
| `cgi-fcgi` | CGI/FastCGI |
| `embed` | Embedded in C applications |
| `litespeed` | LiteSpeed Web Server |

```php
// Check SAPI
echo PHP_SAPI;         // 'cli', 'fpm-fcgi', 'apache2handler', etc.
echo php_sapi_name();  // same

if (PHP_SAPI === 'cli') {
    // CLI-only code
}
```
