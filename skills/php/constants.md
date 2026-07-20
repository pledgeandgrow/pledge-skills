# Constants

## Syntax

Constants are identifiers for simple values that cannot change during execution. Constants are case-sensitive (by convention, always uppercase).

### define()

```php
define("MAX_USERS", 100);
define("API_URL", "https://api.example.com");
define("CONFIG", ["host" => "localhost", "port" => 3306]); // arrays since PHP 7.0

echo MAX_USERS; // 100
```

### const keyword

```php
const MAX_USERS = 100;
const API_URL = "https://api.example.com";

// In classes
class Config {
    const MAX_USERS = 100;
    public const API_URL = "https://api.example.com"; // PHP 7.1+
    protected const INTERNAL = "secret"; // PHP 7.1+
    private const PRIVATE_KEY = "key";   // PHP 7.1+
}

echo Config::MAX_USERS;
echo Config::API_URL;
```

### Enum cases as constants (PHP 8.1+)

```php
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
}

echo Status::Active->value; // 'active'
```

## Predefined Constants

```php
// PHP core constants
PHP_EOL;          // End of line character
PHP_INT_MAX;      // Maximum integer value
PHP_INT_MIN;      // Minimum integer value
PHP_FLOAT_MAX;    // Maximum float value
PHP_FLOAT_EPSILON;
PHP_VERSION;      // Current PHP version
PHP_OS;           // Operating system
PHP_OS_FAMILY;    // OS family (Linux, Windows, Darwin, BSD, Solaris, Unknown)
PHP_SAPI;         // Server API (e.g., 'cli', 'fpm-fcgi')
PHP_BINARY;       // PHP binary path
DIRECTORY_SEPARATOR; // OS path separator
PATH_SEPARATOR;   // Path separator (: or ;)

// Error reporting constants
E_ERROR; E_WARNING; E_NOTICE; E_DEPRECATED;
E_PARSE; E_STRICT; E_CORE_ERROR; E_CORE_WARNING;
E_COMPILE_ERROR; E_COMPILE_WARNING;
E_USER_ERROR; E_USER_WARNING; E_USER_NOTICE; E_USER_DEPRECATED;
E_ALL;

// Math constants
M_PI; M_E; M_SQRT2; M_LN2; M_LN10; M_LOG2E; M_LOG10E;
```

## Magic Constants

Magic constants change depending on context. They are not actually constants (they are resolved at compile time).

| Constant | Description |
|----------|-------------|
| `__LINE__` | Current line number |
| `__FILE__` | Full path and filename |
| `__DIR__` | Directory of the file |
| `__FUNCTION__` | Function name |
| `__CLASS__` | Class name (with namespace) |
| `__METHOD__` | Class method name |
| `__NAMESPACE__` | Current namespace |
| `__TRAIT__` | Trait name (PHP 5.4+) |
| `ClassName::class` | Fully qualified class name |

```php
echo __FILE__;        // /var/www/app/index.php
echo __DIR__;         // /var/www/app
echo __NAMESPACE__;   // App\Controllers
echo __CLASS__;       // App\Controllers\UserController
echo __METHOD__;      // App\Controllers\UserController::index
echo __FUNCTION__;    // index

// ClassName::class — fully qualified name
echo UserController::class; // App\Controllers\UserController
```

## Constant Functions

```php
// constant() — get constant value by name string
$value = constant("MAX_USERS");

// defined() — check if constant is defined
if (defined("MAX_USERS")) { ... }

// get_defined_constants() — get all defined constants
$all = get_defined_constants(true); // categorized
```
