# Features

## HTTP Authentication

```php
// Basic HTTP authentication
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="Protected"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Authentication required';
    exit;
}

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

// Verify credentials
if (!verifyCredentials($user, $pass)) {
    header('HTTP/1.0 401 Unauthorized');
    exit;
}
```

## Cookies

```php
// Set cookie
setcookie('name', 'value', [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => '.example.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);

// Read cookie
$value = $_COOKIE['name'] ?? null;

// Delete cookie
setcookie('name', '', time() - 3600, '/');
```

## Sessions

```php
// Start session
session_start();

// Store data
$_SESSION['user_id'] = 42;
$_SESSION['username'] = 'alice';

// Read data
$userId = $_SESSION['user_id'] ?? null;

// Remove specific data
unset($_SESSION['flash_message']);

// Destroy session
session_unset();
session_destroy();

// Regenerate ID (after login, privilege change)
session_regenerate_id(true);

// Custom session handler
class MySessionHandler implements SessionHandlerInterface {
    public function open(string $path, string $name): bool { ... }
    public function close(): bool { ... }
    public function read(string $id): string|false { ... }
    public function write(string $id, string $data): bool { ... }
    public function destroy(string $id): bool { ... }
    public function gc(int $max_lifetime): int|false { ... }
}
session_set_save_handler(new MySessionHandler(), true);
```

## File Uploads

```php
// HTML form: <form method="POST" enctype="multipart/form-data">
// <input type="file" name="document">

if ($_FILES['document']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['document']['tmp_name'];
    $originalName = $_FILES['document']['name'];
    $size = $_FILES['document']['size'];
    $mimeType = mime_content_type($tmpName);

    // Validate
    $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!in_array($mimeType, $allowedTypes)) {
        throw new RuntimeException('File type not allowed');
    }

    if ($size > 10 * 1024 * 1024) { // 10MB
        throw new RuntimeException('File too large');
    }

    // Move to permanent location
    $destination = '/uploads/' . uniqid() . '_' . basename($originalName);
    move_uploaded_file($tmpName, $destination);
}

// Multiple file uploads
foreach ($_FILES['documents']['name'] as $i => $name) {
    if ($_FILES['documents']['error'][$i] === UPLOAD_ERR_OK) {
        move_uploaded_file(
            $_FILES['documents']['tmp_name'][$i],
            '/uploads/' . $name
        );
    }
}
```

## Remote Files

```php
// Read from URL (allow_url_fopen must be enabled)
$content = file_get_contents('https://api.example.com/data');

// POST request with stream context
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => json_encode(['name' => 'Alice']),
        'timeout' => 30,
    ],
]);
$response = file_get_contents('https://api.example.com/users', false, $context);

// Prefer cURL for complex HTTP requests (see stdlib-services.md)
```

## Connection Handling

```php
// Ignore user abort (script continues even if client disconnects)
ignore_user_abort(true);
set_time_limit(0);

// Check connection status
if (connection_aborted()) {
    // client disconnected
}

// Register shutdown function
register_shutdown_function(function (): void {
    // runs at script end, even on fatal error
    $error = error_get_last();
    if ($error) {
        log_error($error);
    }
});
```

## Persistent Database Connections

```php
// PDO persistent connection
$pdo = new PDO('mysql:host=localhost;dbname=myapp', 'user', 'pass', [
    PDO::ATTR_PERSISTENT => true,
]);

// mysqli persistent connection
$mysqli = new mysqli('p:localhost', 'user', 'pass', 'myapp');
```

## Command Line (CLI)

```php
// Check if running in CLI
if (PHP_SAPI === 'cli') {
    // CLI-specific code
}

// Read from stdin
$input = file_get_contents('php://stdin');
$line = readline('Enter name: ');

// Write to stdout/stderr
fwrite(STDOUT, "Output\n");
fwrite(STDERR, "Error\n");

// Command line arguments
$options = getopt('f:v::', ['file:', 'verbose', 'output::']);

// Interactive CLI
if (function_exists('readline')) {
    $name = readline('Name: ');
    readline_add_history($name);
}
```

## Garbage Collection

```php
// Enable/disable GC
gc_enable();
gc_disable();

// Force collection
$collected = gc_collect_cycles();

// GC status
$stats = gc_status();
// ['runs' => N, 'collected' => N, 'threshold' => N, ...]

// Memory usage
echo memory_get_usage(true);     // allocated memory
echo memory_get_peak_usage(true); // peak memory
```

## DTrace (Dynamic Tracing)

```php
// PHP can be compiled with DTrace support
// DTrace probes available for function calls, exceptions, etc.
// Useful for performance analysis on Solaris/BSD/macOS
```

## PHP Input/Output Streams

```php
// php://input — raw POST data
$raw = file_get_contents('php://input');

// php://output — write to output buffer
fwrite(fopen('php://output', 'w'), 'Hello');

// php://memory — in-memory stream
$stream = fopen('php://memory', 'r+');
fwrite($stream, 'data');
rewind($stream);
echo fread($stream, 1024);

// php://temp — temporary stream (memory until limit, then file)
$stream = fopen('php://temp/maxmemory:1048576', 'r+'); // 1MB in memory

// php://filter — stream filters
$content = file_get_contents('php://filter/read=string.rot13/resource=file.txt');
```
