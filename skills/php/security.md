# Security

## General Considerations

- Never trust user input — validate and sanitize everything
- Use prepared statements for database queries
- Escape output to prevent XSS
- Use `password_hash()` / `password_verify()` for passwords
- Keep PHP and extensions updated
- Disable `display_errors` in production
- Use HTTPS everywhere
- Set appropriate `session.cookie_secure`, `session.cookie_httponly`, `session.cookie_samesite`

## Session Security

```php
// Secure session configuration (php.ini or ini_set)
ini_set('session.cookie_secure', '1');       // HTTPS only
ini_set('session.cookie_httponly', '1');     // no JavaScript access
ini_set('session.cookie_samesite', 'Strict'); // or 'Lax'
ini_set('session.use_strict_mode', '1');     // reject uninitialized session IDs
ini_set('session.use_only_cookies', '1');    // don't use URL-based session IDs

// Regenerate session ID after login
session_regenerate_id(true);

// Set session lifetime
ini_set('session.gc_maxlifetime', 3600); // 1 hour
```

## Filesystem Security

```php
// Never trust filenames from user input
$filename = basename($_GET['file']); // strip path components

// Validate against whitelist
$allowedFiles = ['about.txt', 'contact.txt'];
if (!in_array($filename, $allowedFiles)) {
    throw new InvalidArgumentException('Invalid file');
}

// Null byte injection (PHP 5.3+ strips null bytes, but still validate)
$file = str_replace("\0", '', $userInput);

// Use realpath to prevent directory traversal
$realPath = realpath($baseDir . '/' . $filename);
if ($realPath === false || !str_starts_with($realPath, $baseDir)) {
    throw new InvalidArgumentException('Path traversal detected');
}
```

## Database Security

### SQL Injection Prevention

```php
// BAD — vulnerable to SQL injection
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";

// GOOD — prepared statements with PDO
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
$user = $stmt->fetch();

// GOOD — positional placeholders
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND status = ?');
$stmt->execute([$_POST['email'], 'active']);

// GOOD — mysqli
$stmt = $mysqli->prepare('SELECT * FROM users WHERE email = ?');
$stmt->bind_param('s', $_POST['email']);
$stmt->execute();
```

### Encrypted Storage

```php
// Encrypt sensitive data at rest
$encrypted = openssl_encrypt($data, 'aes-256-gcm', $key, 0, $iv, $tag);
$decrypted = openssl_decrypt($encrypted, 'aes-256-gcm', $key, 0, $iv, $tag);
```

## Error Reporting

```php
// Development
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

// Production
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ini_set('display_errors', '0'); // don't show errors to users
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/php_errors.log');
```

## User Submitted Data

```php
// Filter input
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);
$int = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
$float = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT);

// Sanitize input
$string = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);

// Custom filter
$options = [
    'options' => [
        'min_range' => 1,
        'max_range' => 120,
    ],
];
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT, $options);

// Filter array
$filtered = filter_var_array($_POST, [
    'name' => FILTER_SANITIZE_SPECIAL_CHARS,
    'email' => FILTER_VALIDATE_EMAIL,
    'age' => ['filter' => FILTER_VALIDATE_INT, 'options' => ['min_range' => 1]],
]);
```

## XSS Prevention

```php
// Escape output
echo htmlspecialchars($userInput, ENT_QUOTES | ENT_HTML5, 'UTF-8');

// Content Security Policy header
header("Content-Security-Policy: default-src 'self'; script-src 'self'");

// X-Frame-Options
header('X-Frame-Options: DENY');

// X-Content-Type-Options
header('X-Content-Type-Options: nosniff');
```

## Password Hashing

```php
// Hash password (uses bcrypt or argon2i by default)
$hash = password_hash('mypassword', PASSWORD_DEFAULT);
$hash = password_hash('mypassword', PASSWORD_BCRYPT, ['cost' => 12]);
$hash = password_hash('mypassword', PASSWORD_ARGON2ID);

// Verify password
if (password_verify($inputPassword, $storedHash)) {
    // valid password
}

// Check if hash needs rehash (e.g., cost parameter increased)
if (password_needs_rehash($storedHash, PASSWORD_DEFAULT)) {
    $newHash = password_hash($inputPassword, PASSWORD_DEFAULT);
    // update stored hash
}

// Get info about hash
$info = password_get_info($hash);
```

## CSRF Prevention

```php
// Generate CSRF token
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// In form
echo '<input type="hidden" name="csrf_token" value="' . $_SESSION['csrf_token'] . '">';

// Verify
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
    throw new RuntimeException('CSRF token mismatch');
}
```

## Hiding PHP

```php
// In php.ini
// expose_php = Off           — hide X-Powered-By header
// session.name = custom      — custom session cookie name

// Use .htaccess to hide .php extension
// RewriteEngine On
// RewriteCond %{REQUEST_FILENAME}.php -f
// RewriteRule ^(.*)$ $1.php [L]
```

## Keeping Current

- Update PHP to latest stable version regularly
- Update Composer dependencies: `composer update`
- Monitor security advisories: `composer audit`
- Use `roave/security-advisories` package to prevent vulnerable packages
- Subscribe to PHP security mailing list
