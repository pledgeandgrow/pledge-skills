# Standard Library: Services, Process Control, Network

## PCNTL (Process Control)

```php
// Fork a child process
$pid = pcntl_fork();
if ($pid === -1) {
    throw new RuntimeException('Could not fork');
} elseif ($pid === 0) {
    // Child process
    echo "Child PID: " . getmypid() . "\n";
    exit(0);
} else {
    // Parent process
    echo "Parent PID: " . getmypid() . ", Child PID: $pid\n";
    pcntl_wait($status); // wait for child
    echo "Child exited with status: $status\n";
}

// Signal handling
pcntl_async_signals(true); // PHP 7.1+ — async signal handling
pcntl_signal(SIGTERM, function (int $signo) {
    echo "Received SIGTERM, shutting down...\n";
    exit(0);
});
pcntl_signal(SIGINT, function (int $signo) {
    echo "Received SIGINT (Ctrl+C)\n";
    exit(0);
});
pcntl_signal(SIGHUP, function (int $signo) {
    echo "Received SIGHUP, reloading config...\n";
    // reload configuration
});

// Signal dispatch (without async)
pcntl_signal_dispatch();

// Alarm
pcntl_alarm(30); // send SIGALRM after 30 seconds
pcntl_alarm(0);  // cancel alarm

// Set process priority
pcntl_setpriority(0); // 0 = normal, higher = lower priority
$priority = pcntl_getpriority(getmypid());

// Wait for child
$pid = pcntl_wait($status, WNOHANG); // non-blocking
$pid = pcntl_waitpid($childPid, $status, WUNTRACED);

// Check exit status
if (pcntl_wifexited($status)) {
    $exitCode = pcntl_wexitstatus($status);
}
if (pcntl_wifsignaled($status)) {
    $signal = pcntl_wtermsig($status);
}

// Execute program
pcntl_exec('/path/to/program', ['arg1', 'arg2'], ['ENV_VAR' => 'value']);

// QoS (PHP 8.4+)
Pcntl\QosClass::fromValue(Pcntl\QosClass::Background);
```

## POSIX

```php
// Process info
posix_getpid();       // current process ID
posix_getppid();      // parent process ID
posix_getuid();       // user ID
posix_geteuid();      // effective user ID
posix_getgid();       // group ID
posix_getegid();      // effective group ID

// User info
$user = posix_getpwuid(posix_getuid());
// ['name', 'passwd', 'uid', 'gid', 'gecos', 'dir', 'shell']

$group = posix_getgrgid(posix_getgid());
// ['name', 'passwd', 'gid', 'members']

// Set IDs
posix_setuid($uid);
posix_seteuid($uid);
posix_setgid($gid);
posix_setegid($gid);

// Process groups
posix_setsid(); // create new session
posix_setpgid($pid, $pgid);

// Signals
posix_kill($pid, SIGTERM);

// Terminal
posix_isatty(STDOUT);
posix_ttyname(STDOUT);

// Errors
$errno = posix_get_last_error();
echo posix_strerror($errno);

// Resource limits
$limits = posix_getrlimit();
posix_setrlimit(POSIX_RLIMIT_NOFILE, 1024, 4096);
```

## Program Execution

```php
// system — execute + display output
system('ls -la');

// exec — execute + return last line
exec('ls -la', $output, $returnCode);
// $output = array of lines
// $returnCode = exit status

// passthru — execute + raw output
passthru('cat file.bin');

// shell_exec — execute + return full output as string
$output = shell_exec('ls -la');

// Backticks (same as shell_exec)
$output = `ls -la`;

// escapeshellarg — escape argument
$safeArg = escapeshellarg($userInput);
system("grep $safeArg /var/log/syslog");

// escapeshellcmd — escape command
$safeCmd = escapeshellcmd($userInput);

// proc_open — full control
$proc = proc_open(
    ['grep', '-i', 'error'],
    [
        0 => ['pipe', 'r'], // stdin
        1 => ['pipe', 'w'], // stdout
        2 => ['pipe', 'w'], // stderr
    ],
    $pipes
);
fwrite($pipes[0], "some log text\n");
fclose($pipes[0]);
$output = stream_get_contents($pipes[1]);
fclose($pipes[1]);
fclose($pipes[2]);
$status = proc_close($proc);

// proc_open with command string
$proc = proc_open('grep error', $descriptors, $pipes, $cwd, $env);
```

## FFI (Foreign Function Interface)

```php
// Load C library and call functions
$ffi = FFI::cdef(
    "int printf(const char *format, ...);",
    "libc.so.6"
);
$ffi->printf("Hello %s!\n", "FFI");

// Load from header file
$ffi = FFI::load('header.h');

// Preload (php.ini: ffi.preload=header.h)
$ffi = FFI::scope('my_scope');

// C struct
$ffi = FFI::cdef("struct Point { int x; int y; };");
$point = $ffi->new('struct Point');
$point->x = 10;
$point->y = 20;

// C array
$arr = $ffi->new('int[10]');
for ($i = 0; $i < 10; $i++) {
    $arr[$i] = $i * 2;
}

// FFI\CData — C data handle
// FFI\CType — C type handle
// FFI\Exception — FFI errors
```

## OPcache

```php
// Check if OPcache is available
if (function_exists('opcache_get_status')) {
    $status = opcache_get_status(false);
    // ['opcache_enabled' => true, 'memory_usage' => [...], 'statistics' => [...]]
}

// Compile scripts
opcache_compile_file('large_file.php');

// Invalidate cache
opcache_invalidate('cached_file.php', true); // force=true

// Reset cache
opcache_reset();

// Configuration (php.ini)
// opcache.enable=1
// opcache.enable_cli=1
// opcache.memory_consumption=128
// opcache.max_accelerated_files=10000
// opcache.validate_timestamps=0 (production)
// opcache.preload=/path/preload.php
// opcache.preload_user=www-data
```

## Session Handling

```php
// Start/resume session
session_start();

// Configuration
ini_set('session.save_handler', 'files'); // files, redis, memcached, custom
ini_set('session.save_path', '/var/lib/php/sessions');
ini_set('session.gc_maxlifetime', 3600);
ini_set('session.cookie_lifetime', 0);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.name', 'SESSIONID');

// Custom session handler
class RedisSessionHandler implements SessionHandlerInterface {
    public function open(string $savePath, string $sessionName): bool { ... }
    public function close(): bool { ... }
    public function read(string $sessionId): string|false { ... }
    public function write(string $sessionId, string $data): bool { ... }
    public function destroy(string $sessionId): bool { ... }
    public function gc(int $maxlifetime): int|false { ... }
}
session_set_save_handler(new RedisSessionHandler(), true);
session_start();

// Session upload progress
// php.ini: session.upload_progress.enabled=1
// $_SESSION['upload_progress_<name>']
```

## Filter (Data Filtering)

```php
// Filter single variable
$email = filter_var('test@example.com', FILTER_VALIDATE_EMAIL);
$int = filter_var('42', FILTER_VALIDATE_INT);
$url = filter_var('https://example.com', FILTER_VALIDATE_URL);
$ip = filter_var('192.168.1.1', FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);

// Sanitize
$clean = filter_var($dirty, FILTER_SANITIZE_SPECIAL_CHARS);
$int = filter_var($input, FILTER_SANITIZE_NUMBER_INT);
$float = filter_var($input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

// Filter input
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 120],
]);

// Filter array
$filtered = filter_var_array($_POST, [
    'name' => FILTER_SANITIZE_SPECIAL_CHARS,
    'email' => FILTER_VALIDATE_EMAIL,
    'age' => ['filter' => FILTER_VALIDATE_INT, 'options' => ['min_range' => 1]],
    'website' => FILTER_VALIDATE_URL,
]);

// Filter input array
$filtered = filter_input_array(INPUT_POST, [
    'emails' => ['filter' => FILTER_VALIDATE_EMAIL, 'flags' => FILTER_REQUIRE_ARRAY],
]);

// Filter list (PHP 8.0+)
$emails = filter_list(); // available filter names
```

## Ctype (Character Type Checking)

```php
ctype_alnum($str);  // alphanumeric
ctype_alpha($str);  // alphabetic
ctype_digit($str);  // numeric (0-9)
ctype_lower($str);  // lowercase
ctype_upper($str);  // uppercase
ctype_space($str);  // whitespace
ctype_punct($str);  // punctuation
ctype_print($str);  // printable
ctype_graph($str);  // printable except space
ctype_xdigit($str); // hexadecimal digits
ctype_cntrl($str);  // control characters
```

## FTP

```php
// Connect
$ftp = ftp_connect('ftp.example.com', 21, 30);
ftp_login($ftp, 'user', 'pass');
ftp_pasv($ftp, true); // passive mode

// Upload/download
ftp_put($ftp, 'remote.txt', 'local.txt', FTP_ASCII);
ftp_get($ftp, 'local.txt', 'remote.txt', FTP_ASCII);
ftp_nb_put($ftp, 'remote.txt', 'local.txt', FTP_ASCII); // non-blocking

// File operations
ftp_nlist($ftp, '/path');
ftp_size($ftp, 'file.txt');
ftp_mdtm($ftp, 'file.txt'); // modification time
ftp_rename($ftp, 'old.txt', 'new.txt');
ftp_delete($ftp, 'file.txt');
ftp_mkdir($ftp, 'newdir');
ftp_rmdir($ftp, 'dir');

// OOP (FTP\Connection since PHP 8.1+)
$conn = new FTP\Connection('ftp.example.com');
$conn->login('user', 'pass');
$conn->pasv(true);

ftp_close($ftp);
```

## IMAP

```php
// Connect
$imap = imap_open('{imap.example.com:993/imap/ssl}INBOX', 'user', 'pass');

// List mailboxes
$mailboxes = imap_list($imap, '{imap.example.com:993/imap/ssl}', '*');

// Fetch emails
$emails = imap_search($imap, 'ALL');
foreach ($emails as $emailId) {
    $header = imap_headerinfo($imap, $emailId);
    $body = imap_body($imap, $emailId);
    $structure = imap_fetchstructure($imap, $emailId);
}

// Send mail via IMAP
imap_mail('to@example.com', 'Subject', 'Body', 'From: from@example.com');

// OOP (IMAP\Connection since PHP 8.1+)
$conn = new IMAP\Connection('{imap.example.com:993/imap/ssl}INBOX', 'user', 'pass');

imap_close($imap);
```

## Mail

```php
// Simple mail
mail('to@example.com', 'Subject', 'Message body', 'From: from@example.com');

// HTML mail
$to = 'to@example.com';
$subject = 'Test HTML Email';
$message = '<html><body><h1>Hello</h1></body></html>';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: from@example.com',
];
mail($to, $subject, $message, implode("\r\n", $headers));

// With attachments — use a library (e.g., PHPMailer, Symfony Mailer)
```

## SOAP

```php
// Client
$client = new SoapClient('https://example.com/api?wsdl', [
    'trace' => true,
    'exceptions' => true,
    'cache_wsdl' => WSDL_CACHE_BOTH,
]);

$result = $client->GetUser(['userId' => 123]);
echo $result->GetUserResult->Name;

// Server
class MyService {
    public function GetUser($params) {
        return ['Name' => 'Alice', 'Email' => 'alice@example.com'];
    }
}
$server = new SoapServer('service.wsdl');
$server->setClass(MyService::class);
$server->handle();

// SoapClient/SoapServer classes
// SoapFault, SoapHeader, SoapParam, SoapVar
```

## OAuth

```php
// OAuth client
$oauth = new OAuth('consumer_key', 'consumer_secret', OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_AUTHORIZATION);
$oauth->setToken('access_token', 'access_token_secret');
$oauth->fetch('https://api.example.com/resource');
$response = $oauth->getLastResponse();
$info = $oauth->getLastResponseInfo();

// Get request token
$requestToken = $oauth->getRequestToken('https://api.example.com/request_token');
$authorizeUrl = $oauth->getAuthorizeUrl($requestToken['oauth_token']);

// Get access token
$accessToken = $oauth->getAccessToken('https://api.example.com/access_token');
```

## APCu (User Cache)

```php
// Store
apcu_store('key', 'value', 3600); // TTL 1 hour
apcu_store(['key1' => 'val1', 'key2' => 'val2']);

// Fetch
$value = apcu_fetch('key');
$found = false;
$value = apcu_fetch('key', $found); // $found = true/false
$values = apcu_fetch(['key1', 'key2']); // array

// Delete
apcu_delete('key');
apcu_delete(['key1', 'key2']);

// Check
apcu_exists('key');

// Increment/decrement
apcu_inc('counter');
apcu_inc('counter', 2);
apcu_dec('counter', 1);

// Cache info
$info = apcu_cache_info(true); // limited
$info = apcu_cache_info(false); // full

// APCUIterator
$iter = new APCUIterator('/^my_prefix_.*/');
foreach ($iter as $item) {
    echo $item['key'] . ': ' . $item['value'];
}

// Clear cache
apcu_clear_cache();
```

## Readline (GNU Readline)

```php
// Read line
$line = readline('Enter command: ');

// History
readline_add_history($line);
readline_read_history('/path/to/history');
readline_write_history('/path/to/history');
readline_clear_history();

// Completion
readline_completion_function(function ($input) {
    $commands = ['start', 'stop', 'status', 'help'];
    return array_filter($commands, fn($c) => str_starts_with($c, $input));
});

// Info
readline_info();
```
