# Basic Syntax

## PHP Tags

PHP code is embedded within `<?php ?>` tags. The closing tag is optional (and recommended to omit) for files containing only PHP.

```php
<?php
echo "Hello, World!";
```

### Short echo tag

```php
<p><?= $variable ?></p>
<!-- Equivalent to: -->
<p><?php echo $variable; ?></p>
```

### Short tags (discouraged)

`<? ?>` — requires `short_open_tag` ini setting. Not recommended for portability.

## Escaping from HTML

PHP parses only code within PHP tags. Everything outside is output as-is.

```php
<?php if ($condition): ?>
    <p>Condition is true</p>
<?php else: ?>
    <p>Condition is false</p>
<?php endif; ?>
```

### Advanced escaping with heredoc/nowdoc

```php
<?php
$html = <<<HTML
<div class="container">
    <h1>$title</h1>
    <p>{$content}</p>
</div>
HTML;

// Nowdoc (no interpolation) — PHP 7.3+ flexible heredoc/nowdoc
$template = <<<'TEMPLATE'
<div class="container">
    <h1>$title</h1>
</div>
TEMPLATE;
```

## Instruction Separation

Each statement ends with a semicolon `;`. The closing `?>` tag implies a semicolon.

```php
<?php
echo "Statement 1";
echo "Statement 2";

// Last statement before closing tag doesn't need semicolon
echo "No semicolon needed" ?>
```

## Comments

```php
<?php
// Single-line comment
# Single-line comment (shell style)

/*
Multi-line
comment
*/

/**
 * Docblock comment
 * @param string $name
 * @return string
 */
function greet(string $name): string {
    return "Hello, $name";
}
```

## File Inclusion

```php
// require — fatal error if file not found
require 'config.php';
require_once 'config.php'; // only includes once

// include — warning if file not found, continues execution
include 'optional.php';
include_once 'optional.php';

// Best practice: use require_once for critical files
// Use autoload (Composer) instead of manual includes
```
