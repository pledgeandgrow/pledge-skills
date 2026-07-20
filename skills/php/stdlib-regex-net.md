# Standard Library: Regex, URL, Streams, Network, Utilities

## PCRE (Perl-Compatible Regular Expressions)

PHP uses PCRE2 (since PHP 7.3) for regex. Patterns are delimited by `/` or other characters.

### Pattern Matching

```php
// preg_match — returns 1 if match, 0 if no match
$found = preg_match('/\d+/', 'abc123def'); // 1
$found = preg_match('/^\d{4}-\d{2}-\d{2}$/', '2024-01-15'); // 1

// With captures
preg_match('/(\w+)@(\w+)\.(\w+)/', 'user@example.com', $matches);
// $matches[0] = 'user@example.com'
// $matches[1] = 'user'
// $matches[2] = 'example'
// $matches[3] = 'com'

// Named captures
preg_match('/(?P<user>\w+)@(?P<domain>\w+\.\w+)/', 'user@example.com', $matches);
echo $matches['user'];   // 'user'
echo $matches['domain']; // 'example.com'

// preg_match_all — find all matches
preg_match_all('/\d+/', 'a1b2c3d4', $matches);
// $matches[0] = ['1', '2', '3', '4']

// With capture groups
preg_match_all('/(\w)(\d)/', 'a1b2c3', $matches);
// $matches[0] = ['a1', 'b2', 'c3']
// $matches[1] = ['a', 'b', 'c']
// $matches[2] = ['1', '2', '3']

// PREG_SET_ORDER — each element is a full match set
preg_match_all('/(\w)(\d)/', 'a1b2c3', $matches, PREG_SET_ORDER);
// $matches[0] = ['a1', 'a', '1']
// $matches[1] = ['b2', 'b', '2']

// PREG_OFFSET_CAPTURE — include string offset
preg_match('/(\d+)/', 'abc123', $matches, PREG_OFFSET_CAPTURE);
// $matches[0] = ['123', 3]
```

### Replacement

```php
// preg_replace — replace all matches
$result = preg_replace('/\d+/', '#', 'a1b2c3'); // 'a#b#c#'

// With backreferences
$result = preg_replace('/(\w+)@(\w+\.\w+)/', '$2/$1', 'user@example.com');
// 'example.com/user'

// Named backreference
$result = preg_replace('/(?P<user>\w+)@(?P<domain>\w+\.\w+)/', '${domain}/${user}', 'user@example.com');

// Callback replacement
$result = preg_replace_callback('/\d+/', function ($m) {
    return $m[0] * 2;
}, 'a1b2c3'); // 'a2b4c6'

// preg_replace_callback_array (PHP 7.0+)
$result = preg_replace_callback_array([
    '/\d+/' => fn($m) => $m[0] * 2,
    '/[a-z]/' => fn($m) => strtoupper($m[0]),
], 'a1b2c3'); // 'A2B4C6'

// Limit replacements
$result = preg_replace('/\d/', 'X', 'a1b2c3d4', 2); // 'aXbXc3d4'

// Subject as array
$results = preg_replace('/\d/', 'X', ['a1', 'b2', 'c3']); // ['aX', 'bX', 'cX']
```

### Splitting

```php
// preg_split — split string by pattern
$parts = preg_split('/[\s,]+/', 'apple, banana, cherry');
// ['apple', 'banana', 'cherry']

// With limit
$parts = preg_split('/-/', 'a-b-c-d-e', 3); // ['a', 'b', 'c-d-e']

// PREG_SPLIT_DELIM_CAPTURE — include delimiters
$parts = preg_split('/([,])/', 'a,b,c', -1, PREG_SPLIT_DELIM_CAPTURE);
// ['a', ',', 'b', ',', 'c']

// PREG_SPLIT_OFFSET_CAPTURE
$parts = preg_split('/,/', 'a,b,c', -1, PREG_SPLIT_OFFSET_CAPTURE);
// [['a', 0], ['b', 2], ['c', 4]]
```

### Other PCRE Functions

```php
// preg_grep — filter array by pattern
$filtered = preg_grep('/^\d+$/', ['123', 'abc', '456', 'def']);
// [0 => '123', 2 => '456']

// PREG_GREP_INVERT — non-matching
$filtered = preg_grep('/^\d+$/', ['123', 'abc'], PREG_GREP_INVERT);
// [1 => 'abc']

// preg_quote — escape regex special chars
$safe = preg_quote('price: $50.00 (each)'); // 'price:\ \$50\.00\ \(each\)'
$safe = preg_quote('path/to/file', '/'); // escape delimiter too: 'path\/to\/file'

// preg_last_error — get last PCRE error code
preg_match('/invalid(/', 'test');
echo preg_last_error(); // PREG_ERROR (or specific error)
echo preg_last_error_msg(); // PHP 8.0+ — error message string

// Error constants
PREG_NO_ERROR; PREG_INTERNAL_ERROR; PREG_BACKTRACK_LIMIT_ERROR;
PREG_RECURSION_LIMIT_ERROR; PREG_BAD_UTF8_ERROR; PREG_BAD_UTF8_OFFSET_ERROR;
PREG_JIT_STACKLIMIT_ERROR;
```

### Pattern Modifiers

| Modifier | Description |
|----------|-------------|
| `i` | Case-insensitive |
| `m` | Multiline (`^`/`$` match line boundaries) |
| `s` | Dotall (`.` matches newlines) |
| `x` | Extended (whitespace ignored, allow comments) |
| `u` | UTF-8 mode |
| `U` | Ungreedy (invert greediness) |
| `A` | Anchor at start only |
| `D` | `$` matches end only (not before newline) |
| `S` | Optimize pattern |
| `J` | Allow duplicate subpattern names |

```php
// Examples
preg_match('/hello/i', 'HELLO');           // 1 (case-insensitive)
preg_match('/^line/m', "line1\nline2");    // 1 (multiline)
preg_match('/./s', "\n");                  // 1 (dotall)
preg_match('/
    \d+    # match digits
    \s*    # optional whitespace
    \w+    # match word
/x', '123 hello');                          // 1 (extended)
```

### Character Classes

```php
// POSIX-like (use Unicode-safe alternatives)
\d  // digit          [0-9]
\D  // non-digit
\w  // word char      [a-zA-Z0-9_]
\W  // non-word
\s  // whitespace     [ \t\r\n\f\v]
\S  // non-whitespace
\b  // word boundary
\B  // non-word boundary

// Unicode properties (with /u modifier)
\p{L}   // any letter
\p{N}   // any number
\p{Lu}  // uppercase letter
\p{Ll}  // lowercase letter
\P{L}   // not a letter
```

## URL Functions

```php
// parse_url — parse URL into components
$parts = parse_url('https://user:pass@example.com:8080/path?query=1#fragment');
// [
//   'scheme'   => 'https',
//   'host'     => 'example.com',
//   'port'     => 8080,
//   'user'     => 'user',
//   'pass'     => 'pass',
//   'path'     => '/path',
//   'query'    => 'query=1',
//   'fragment' => 'fragment',
// ]

// Specific component
$host = parse_url($url, PHP_URL_HOST);
$scheme = parse_url($url, PHP_URL_SCHEME);
$query = parse_url($url, PHP_URL_QUERY);

// http_build_query — build query string
$query = http_build_query(['name' => 'Alice', 'age' => 30, 'hobbies' => ['reading', 'coding']]);
// 'name=Alice&age=30&hobbies%5B0%5D=reading&hobbies%5B1%5D=coding'

// With custom separator and encoding
$query = http_build_query($data, '&', '&', PHP_QUERY_RFC3986);

// parse_str — parse query string (use with caution)
parse_str('name=Alice&age=30', $output);
// $output = ['name' => 'Alice', 'age' => 30]

// URL encoding/decoding
$encoded = urlencode('hello world & foo'); // 'hello+world+%26+foo'
$decoded = urldecode('hello+world+%26+foo'); // 'hello world & foo'

// RFC 3986 encoding (raw)
$encoded = rawurlencode('hello world & foo'); // 'hello%20world%20%26%20foo'
$decoded = rawurldecode('hello%20world%20%26%20foo');

// Base URL
$base = basename('/path/to/file.php');  // 'file.php'
$dir  = dirname('/path/to/file.php');   // '/path/to'

// get_headers — fetch HTTP response headers
$headers = get_headers('https://example.com');
// [0 => 'HTTP/1.0 200 OK', 1 => 'Content-Type: text/html', ...]

// get_meta_tags — extract meta tags from HTML
$tags = get_meta_tags('https://example.com');
// ['description' => '...', 'keywords' => '...', ...]
```

## Stream Functions

```php
// Stream contexts
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nAuthorization: Bearer $token\r\n",
        'content' => json_encode($data),
        'timeout' => 30,
        'ignore_errors' => true,
        'follow_location' => true,
        'max_redirects' => 5,
        'protocol_version' => 1.1,
        'user_agent' => 'MyApp/1.0',
    ],
    'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'cafile' => '/etc/ssl/certs/ca-certificates.crt',
        'allow_self_signed' => false,
    ],
    'ftp' => [
        'overwrite' => true,
        'resume_pos' => 0,
    ],
]);

// Use context with file operations
$content = file_get_contents('https://api.example.com/data', false, $context);
$handle = fopen('https://example.com/stream', 'r', false, $context);

// Stream context get/set params
$params = stream_context_get_params($context);
$options = stream_context_get_options($context);
stream_context_set_option($context, 'http', 'method', 'PUT');

// Stream filters
$handle = fopen('php://temp', 'r+');
stream_filter_append($handle, 'string.rot13');
stream_filter_append($handle, 'string.toupper');
stream_filter_append($handle, 'string.strip_tags');
stream_filter_append($handle, 'convert.iconv.UTF-8.ASCII//TRANSLIT');
stream_filter_append($handle, 'zlib.deflate', STREAM_FILTER_WRITE, ['level' => 9]);
stream_filter_append($handle, 'zlib.inflate', STREAM_FILTER_READ);

// Stream wrappers
stream_wrapper_register('myproto', MyStreamWrapper::class);
stream_wrapper_unregister('http');
stream_wrapper_restore('http');
$wrappers = stream_get_wrappers();
$transports = stream_get_transports();
$filters = stream_get_filters();

// Stream metadata
$meta = stream_get_meta_data($handle);
// ['timed_out' => bool, 'blocked' => bool, 'eof' => bool, 'uri' => string, 'stream_type' => string, ...]

// Stream selection (like select())
$read = [$handle1, $handle2];
$write = [];
$except = [];
$changed = stream_select($read, $write, $except, 5); // 5 sec timeout

// Copy stream
$copied = stream_copy_to_stream($source, $dest, $maxLength, $offset);

// Get contents
$contents = stream_get_contents($handle);
$contents = stream_get_contents($handle, 1024, 0); // 1024 bytes from offset 0

// Stream socket
$socket = stream_socket_server('tcp://0.0.0.0:8080', $errno, $errstr);
$client = stream_socket_accept($socket, 30);
fwrite($client, "HTTP/1.1 200 OK\r\n\r\nHello");
fclose($client);
fclose($socket);

// Stream socket client
$socket = stream_socket_client('tcp://example.com:443', $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context);

// Stream resolver
$ips = stream_get_contents(stream_socket_client('ssl://dns.google:443', $errno, $errstr, 30));
```

### Built-in Stream Wrappers

| Wrapper | Description |
|---------|-------------|
| `php://stdin` | Standard input |
| `php://stdout` | Standard output |
| `php://stderr` | Standard error |
| `php://input` | Raw POST data (read-only) |
| `php://output` | Output buffer (write-only) |
| `php://memory` | In-memory stream |
| `php://temp` | Temp stream (memory → file after limit) |
| `php://filter` | Stream filter wrapper |
| `file://` | Local filesystem |
| `http://` | HTTP |
| `https://` | HTTPS |
| `ftp://` | FTP |
| `ftps://` | FTPS |
| `compress.zlib://` | Gzip |
| `compress.bzip2://` | Bzip2 |
| `phar://` | Phar archive |
| `data://` | Data URI |
| `glob://` | Glob pattern |
| `ssh2://` | SSH2 (if extension loaded) |

## Network Functions

```php
// DNS
$ip = gethostbyname('example.com');        // '93.184.216.34'
$hostname = gethostbyaddr('93.184.216.34'); // 'example.com'
$records = dns_get_record('example.com', DNS_A | DNS_MX | DNS_TXT);
$mx = getmxrr('example.com', $mxhosts);     // MX records

// Check DNS
$exists = checkdnsrr('example.com', 'A');   // true if A record exists
$exists = checkdnsrr('example.com', 'MX');

// Ping (no native ping, but can check connectivity)
$connected = @fsockopen('example.com', 80, $errno, $errstr, 5);

// IP functions
$long = ip2long('192.168.1.1');      // 3232235777
$ip = long2ip(3232235777);           // '192.168.1.1'
$valid = filter_var('192.168.1.1', FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
$valid = filter_var('::1', FILTER_VALIDATE_IP, FILTER_FLAG_IPV6);
$private = filter_var('192.168.1.1', FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);

// inet_pton / inet_ntop (binary IP)
$packed = inet_pton('192.168.1.1');
$ip = inet_ntop($packed);

// Headers (if running as web server module)
$headers = getallheaders(); // all HTTP request headers
$hasHeader = isset($_SERVER['HTTP_X_REQUESTED_WITH']);

// Setcookie
setcookie('name', 'value', [
    'expires' => time() + 3600,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);

// HTTP response code
http_response_code(200);
http_response_code(404);
$code = http_response_code();

// Headers
header('Content-Type: application/json');
header('X-Custom-Header: value');
header_remove('X-Custom-Header');
header_remove(); // remove all
$headers_list = headers_list();
$headers_sent = headers_sent(); // check if headers already sent
```

## Variable Handling and Debugging

```php
// Output variable info
var_dump($variable);     // detailed type and value info
print_r($variable);      // human-readable (arrays/objects)
var_export($variable, true); // valid PHP code representation

// Serialize
$serialized = serialize($object);
$unserialized = unserialize($serialized, ['allowed_classes' => [User::class]]);
// Options: allowed_classes => true (all), false (none), or array of class names

// Debug
debug_zval_dump($variable);  // internal refcount info
debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT); // call stack
debug_print_backtrace();     // print call stack

// Memory
echo memory_get_usage();       // current memory
echo memory_get_usage(true);   // allocated memory
echo memory_get_peak_usage();  // peak memory
echo memory_get_peak_usage(true);

// Type info
gettype($variable);  // 'integer', 'string', 'array', 'object', 'NULL', etc.
get_debug_type($variable);  // PHP 8.0+ — better type names: 'int', 'string', 'ClassName'
settype($variable, 'integer'); // change type in place

// Empty / isset
empty($variable);   // true if not set or falsy
isset($variable);   // true if set and not null

// intval / floatval / strval / boolval
$int = intval('42', 10);    // 42 (base 10)
$int = intval('0x2A', 16);  // 42 (base 16)
$float = floatval('3.14');
$string = strval(42);
$bool = boolval('false');   // true (non-empty string)
```

## PHP Info and Configuration

```php
// PHP info
phpinfo();           // full HTML info page
phpinfo(INFO_MODULES); // specific section only
phpversion();         // '8.4.0'
phpversion('redis');  // extension version

// Extensions
$loaded = extension_loaded('pdo_mysql');
$extensions = get_loaded_extensions();
$functions = get_extension_funcs('redis');

// Constants
$constants = get_defined_constants(true); // categorized
$classes = get_defined_classes();
$functions = get_defined_functions();
$interfaces = get_declared_interfaces();
$traits = get_declared_traits();

// Include path
$paths = get_include_path();
set_include_path('/usr/share/php:/usr/share/pear');
restore_include_path();

// PHP binary and paths
echo PHP_BINARY;        // '/usr/bin/php'
echo PHP_BINDIR;        // '/usr/bin'
echo PHP_LIBDIR;        // '/usr/lib/php'
echo PHP_CONFIG_FILE_PATH; // '/etc/php/8.4'
echo PHP_EXTENSION_DIR; // '/usr/lib/php/20240924'

// SAPI
echo PHP_SAPI;          // 'cli', 'fpm-fcgi', 'apache2handler'
echo php_sapi_name();   // same

// Zend info
echo ZEND_MODULE_API_NO;
echo ZEND_DEBUG;
echo ZEND_THREAD_SAFE;

// Runtime
echo PHP_INT_MAX;
echo PHP_INT_SIZE;    // 8 (bytes = 64-bit)
echo PHP_FLOAT_DIG;   // 15

// ini
$all = ini_get_all(null, false); // all config
$value = ini_get('memory_limit');
ini_set('memory_limit', '512M');
ini_restore('memory_limit');

// set_time_limit
set_time_limit(30); // 30 seconds (0 = unlimited)

// phpcredits
phpcredits(CREDITS_ALL);
```

## Taint (Deprecated)

```php
// Taint extension (PECL) — track tainted (user-input) data
// taint_enable() — enable taint tracking
// untaint($variable) — mark as safe
// is_tainted($variable) — check if tainted
// Deprecated in favor of proper input validation
```
