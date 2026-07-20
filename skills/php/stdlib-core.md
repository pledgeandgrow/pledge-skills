# Standard Library: Core (Strings, Arrays, Function Handling, Output, Errors)

## String Functions

```php
// Length and case
strlen($str);              // byte length
mb_strlen($str);           // character length (multibyte)
strtolower($str); strtoupper($str);
ucfirst($str); lcfirst($str); ucwords($str);
mb_strtolower($str); mb_strtoupper($str);

// Search
strpos($str, $needle);      // position (false if not found)
strrpos($str, $needle);     // last position
stripos($str, $needle);     // case-insensitive
str_contains($str, $needle); // PHP 8.0+ — bool
str_starts_with($str, $prefix); // PHP 8.0+
str_ends_with($str, $suffix);   // PHP 8.0+
substr_count($str, $needle);

// Extract and replace
substr($str, $start, $length);
str_replace($search, $replace, $str);
str_ireplace($search, $replace, $str); // case-insensitive
substr_replace($str, $replacement, $start);
strtr($str, ['old' => 'new']);

// Split and join
explode(',', $str);          // string -> array
implode(',', $arr);          // array -> string
str_split($str, 1);          // chunk into chars
chunk_split($str, 76, "\r\n");
wordwrap($str, 75, "\n", true);

// Trim and pad
trim($str); ltrim($str); rtrim($str, " \t\n\r\0\x0B");
str_pad($str, 10, " ", STR_PAD_BOTH);
str_repeat($str, 3);

// Format
sprintf("%05d", 42);         // "00042"
printf("%.2f", 3.14159);     // "3.14"
vprintf("%s %s", ['Hello', 'World']);
number_format(1234.56, 2, '.', ','); // "1,234.56"
str_word_count($str);

// Encoding
htmlentities($str, ENT_QUOTES, 'UTF-8');
htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
html_entity_decode($str);
nl2br($str);
addslashes($str); stripslashes($str);
quotemeta($str);

// Hashing (quick — use hash() for more)
md5($str); sha1($str);
crc32($str);

// Misc
strrev($str);                // reverse
str_shuffle($str);
str_word_count($str);
levenshtein($str1, $str2);   // edit distance
similar_text($str1, $str2);  // similarity
soundex($str); metaphone($str);
ord('A'); chr(65);
```

## Multibyte String Functions (mbstring)

```php
mb_internal_encoding('UTF-8');
mb_strlen($str); mb_substr($str, 0, 10);
mb_strpos($str, $needle); mb_strrpos($str, $needle);
mb_strtolower($str); mb_strtoupper($str);
mb_convert_case($str, MB_CASE_TITLE);
mb_convert_encoding($str, 'UTF-8', 'ISO-8859-1');
mb_detect_encoding($str);
mb_substr_count($str, $needle);
mb_str_split($str, 1);
mb_trim($str); mb_ltrim($str); mb_rtrim($str); // PHP 8.4+
```

## Array Functions

```php
// Counting
count($arr); sizeof($arr); // same
count($arr, COUNT_RECURSIVE);

// Search
in_array($value, $arr); in_array($value, $arr, true); // strict
array_search($value, $arr); // returns key or false
array_key_exists($key, $arr);
key_exists($key, $arr); // alias

// Keys and values
array_keys($arr); array_values($arr);
array_flip($arr); // swap keys and values
array_unique($arr);
array_column($arr, 'column_key', 'index_key');
array_combine($keys, $values);

// Merge and slice
array_merge($arr1, $arr2);
array_merge_recursive($arr1, $arr2);
array_replace($arr1, $arr2);
array_slice($arr, $offset, $length);
array_splice($arr, $offset, $length, $replacement);
array_chunk($arr, $size);
array_pad($arr, $size, $value);

// Diff and intersect
array_diff($arr1, $arr2); // values in arr1 not in arr2
array_diff_key($arr1, $arr2);
array_diff_assoc($arr1, $arr2);
array_intersect($arr1, $arr2);
array_intersect_key($arr1, $arr2);
array_intersect_assoc($arr1, $arr2);

// Stack/queue operations
array_push($arr, $value); array_pop($arr);
array_unshift($arr, $value); array_shift($arr);

// Functional
array_map(fn($x) => $x * 2, $arr);
array_map(fn($x, $y) => $x + $y, $arr1, $arr2);
array_filter($arr, fn($x) => $x > 0);
array_filter($arr, fn($x) => $x > 0, ARRAY_FILTER_USE_BOTH);
array_reduce($arr, fn($carry, $item) => $carry + $item, 0);
array_walk($arr, fn(&$value, $key) => $value *= 2);

// Sorting (see array.sorting.php for full reference)
sort($arr); rsort($arr);           // reindex
asort($arr); arsort($arr);         // maintain keys
ksort($arr); krsort($arr);         // sort by keys
usort($arr, fn($a, $b) => $a <=> $b);
uasort($arr, fn($a, $b) => $a <=> $b);
uksort($arr, fn($a, $b) => $a <=> $b);
array_multisort($arr1, SORT_ASC, $arr2, SORT_DESC);
shuffle($arr);

// Misc
array_fill($start, $count, $value);
array_fill_keys($keys, $value);
range(1, 10); range(0, 100, 10); // [0, 10, 20, ..., 100]
array_sum($arr); array_product($arr);
array_reverse($arr);
array_rand($arr, $num);
compact('var1', 'var2'); extract($arr);
array_is_list($arr); // PHP 8.1+ — check if array is a list
```

## Array Sorting (PHP 8.3+ RoundingMode-style enums)

```php
// Sort flags
SORT_REGULAR, SORT_NUMERIC, SORT_STRING, SORT_ASC, SORT_DESC
SORT_FLAG_CASE, SORT_NATURAL, SORT_LOCALE_STRING

// Natural sort
natsort($arr); natcasesort($arr);

// Stable sort (PHP 8.0+ — all sorts are stable)
```

## Function Handling

```php
// Check if callable
is_callable($fn); is_callable([$obj, 'method']);

// Call user function
call_user_func($fn, $arg1, $arg2);
call_user_func_array($fn, [$arg1, $arg2]);
$fn(...$args); // spread operator — preferred

// Function existence
function_exists('my_function');
method_exists($obj, 'method');
method_exists(ClassName::class, 'method');

// Get function info
$ref = new ReflectionFunction('strlen');
$ref->getName(); $ref->getParameters(); $ref->getReturnType();

// Register function (rarely needed)
// Use anonymous functions / closures instead

// Get defined functions
$functions = get_defined_functions();
// $functions['internal'] — built-in
// $functions['user']    — user-defined
```

## Output Control (Output Buffering)

```php
// Start output buffer
ob_start();
echo "This is buffered";

// Get and clean
$content = ob_get_clean(); // get content and end buffer
$content = ob_get_contents(); // get content, keep buffer
ob_end_clean(); // discard and end
ob_end_flush(); // output and end
ob_flush(); // flush buffer to next layer

// Callback with ob_start
ob_start(function (string $buffer): string {
    return str_replace('foo', 'bar', $buffer);
});

// Flush levels
ob_start(); // level 1
ob_start(); // level 2
ob_end_flush(); // back to level 1
ob_end_flush(); // back to 0

// Check buffer status
ob_get_level(); // current nesting level
ob_get_status(); // buffer info
```

## Error Handling Functions

```php
// Set error handler
set_error_handler(callable $handler, int $error_levels = E_ALL);

// Set exception handler
set_exception_handler(callable $handler);

// Restore
restore_error_handler();
restore_exception_handler();

// Trigger error
trigger_error('message', E_USER_WARNING);
user_error('message', E_USER_WARNING); // alias

// Error configuration
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', '/path/to/error.log');

// Get last error
$error = error_get_last();

// Clear last error
error_clear_last();

// Debug backtrace
debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT);
debug_print_backtrace();
```
