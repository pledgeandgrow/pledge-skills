# Namespaces

## Overview

Namespaces provide a way to encapsulate items, avoiding name collisions. They are similar to packages in Java or namespaces in C++.

```php
namespace App\Models;

class User {
    // This class is App\Models\User
}
```

## Definition

```php
// Single namespace per file (recommended)
namespace App\Controllers;

class UserController {
    // App\Controllers\UserController
}

// Multiple namespaces in one file (discouraged)
namespace App\Controllers {
    class UserController {}
}

namespace App\Models {
    class User {}
}
```

## Sub-Namespaces

```php
namespace App\Models\DTO;

class UserDTO {
    // App\Models\DTO\UserDTO
}
```

## Importing / Aliasing

```php
namespace App\Controllers;

// use statement
use App\Models\User;
use App\Models\Order;
use App\Services\UserService;
use App\Services\OrderService as OrderSvc;

// Grouped use
use App\Models\{User, Order, Product};
use App\Services\{UserService, OrderService};

// Function and constant imports (PHP 5.6+)
use function App\Utils\formatDate;
use const App\Config\DB_HOST;

// Using imported classes
$user = new User();
$service = new UserService();
$order = new OrderSvc();
$formatted = formatDate(new DateTime());
```

## Dynamic Access

```php
namespace App\Models;

$class = 'User';
$full = "App\\Models\\$class";
$obj = new $full(); // dynamic class name must be fully qualified

// Using namespace keyword
$obj = new namespace\User(); // App\Models\User (from within App\Models)
```

## Namespace Keyword and __NAMESPACE__

```php
namespace App\Controllers;

echo __NAMESPACE__; // "App\Controllers"

// namespace:: for relative names (within current namespace)
$obj = new namespace\User(); // App\Controllers\User

// In global namespace
namespace {
    echo __NAMESPACE__; // "" (empty)
    $obj = new namespace\DateTime(); // \DateTime
}
```

## Global Space

```php
namespace App\Models;

class User {
    public function getNow(): \DateTime {
        // Leading backslash = global namespace
        return new \DateTime();
    }

    // Without backslash, PHP resolves relative to current namespace
    public function getUtils(): \App\Utils\DateUtils {
        return new \App\Utils\DateUtils();
    }
}
```

## Fallback to Global Functions

```php
namespace App;

// PHP first looks for App\strlen, then falls back to global strlen
$len = strlen("hello"); // uses global strlen (fallback for functions)

// Constants: no fallback (must use \CONST or import)
// Classes: no fallback (must use \ClassName or import)

// Disable fallback (recommended)
// Use fully qualified names or use statements
```

## Name Resolution Rules

```php
namespace App\Controllers;

use App\Models\User;

// Unqualified name (no backslash): User
//   - If imported via use, uses imported class
//   - Otherwise: App\Controllers\User

// Qualified name (has backslash segments): Models\User
//   - App\Models\User

// Fully qualified name (starts with \): \App\Models\User
//   - App\Models\User (exactly as written)
```

## Best Practices

- One namespace per file (PSR-4 standard)
- Match namespace to directory structure (PSR-4)
- Use `use` statements at top of file
- Group `use` statements for readability
- Use fully qualified names for global functions/classes or import them
- Follow PSR-12 coding standard
