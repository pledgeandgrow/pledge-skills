# Standard Library: Miscellaneous Extensions

## Server-Specific Extensions

### Apache (mod_php)

```php
// Available when running as Apache module
apache_request_headers();  // get all request headers
apache_response_headers(); // get all response headers
getallheaders();           // alias for apache_request_headers()

// Virtual (include another URI)
virtual('/other/page.php');

// apache_child_terminate() — terminate Apache child after request
// apache_setenv() — set Apache subprocess_env variable
// apache_get_modules() — list loaded Apache modules
$modules = apache_get_modules();
```

### LiteSpeed

```php
// LiteSpeed SAPI functions
litespeed_request_headers();
litespeed_response_headers();
litespeed_finish_request(); // flush response to client, continue processing
```

### FastCGI Process Manager (FPM)

```php
// Flush response to client, continue processing in background
fastcgi_finish_request();

// FPM status page (configure in FPM pool):
// pm.status_path = /status
// ping.path = /ping

// FPM configuration (pool config):
// [www]
// listen = /run/php/php8.4-fpm.sock
// pm = dynamic
// pm.max_children = 50
// pm.start_servers = 5
// pm.min_spare_servers = 5
// pm.max_spare_servers = 35
// pm.process_idle_timeout = 10s
// pm.max_requests = 500

// FPM observability (PHP 8.4+):
// fpm_get_status() — get FPM status as array
// fpm_get_listen_address() — get listen address
```

## Search Engine Extensions

### Solr

```php
// Apache Solr client
$client = new SolrClient([
    'hostname' => 'localhost',
    'port' => 8983,
    'path' => '/solr/myapp',
]);

// Create document
$doc = new SolrInputDocument();
$doc->addField('id', '123');
$doc->addField('title', 'Hello World');
$doc->addField('content', 'PHP Solr integration');

// Add document
$client->addDocument($doc);
$client->commit();

// Query
$query = new SolrQuery();
$query->setQuery('title:Hello');
$query->setStart(0);
$query->setRows(10);
$query->addField('id')->addField('title');

$response = $client->query($query);
$results = $response->getResponse();

// Delete
$client->deleteById('123');
$client->commit();

// Key classes:
// SolrClient, SolrQuery, SolrDisMaxQuery, SolrInputDocument
// SolrDocument, SolrDocumentField, SolrObject, SolrParams
// SolrModifiableParams, SolrCollapseFunction
// SolrResponse, SolrQueryResponse, SolrUpdateResponse
// SolrPingResponse, SolrGenericResponse
// SolrException, SolrClientException, SolrServerException
```

## Non-Text MIME Output Extensions

### FDF (Forms Data Format)

```php
// FDF for PDF form data
fdf_open('form.fdf');
fdf_create();
fdf_save($fdf, 'output.fdf');
fdf_set_value($fdf, 'field_name', 'value');
fdf_get_value($fdf, 'field_name');
fdf_close($fdf);
```

### GnuPG (GNU Privacy Guard)

```php
// GPG encryption/decryption
$gpg = new gnupg();

// Import key
$info = $gpg->import($publicKey);

// Encrypt
$encrypted = $gpg->encrypt($data);

// Decrypt (needs private key)
$decrypted = $gpg->decrypt($encrypted);

// Sign
$signed = $gpg->sign($data);

// Verify
$signature = $gpg->verify($signed, false, $info);
```

### wkhtmltox (HTML to PDF/Image)

```php
// Convert HTML to PDF
$converter = new wkhtmltox\PDF\Converter([
    'out' => 'output.pdf',
]);
$object = new wkhtmltox\PDF\Object('<html><body><h1>Hello</h1></body></html>');
$converter->add($object);
$converter->convert();

// Convert HTML to image
$imgConverter = new wkhtmltox\Image\Converter('<html><body>Hello</body></html>');
$imgConverter->setOutputFile('output.png');
$imgConverter->convert();
```

### PS (PostScript)

```php
// Create PostScript documents
$ps = ps_new();
ps_open_file($ps, 'output.ps');
ps_begin_page($ps, 596, 842); // A4
ps_setfont($ps, $font, 12);
ps_show_xy($ps, 'Hello World', 100, 700);
ps_end_page($ps);
ps_close($ps);
ps_delete($ps);
```

### RpmInfo

```php
// Read RPM package info
$info = rpminfo('package.rpm');
// ['Name' => '...', 'Version' => '...', 'Release' => '...', ...]
```

### XLSWriter (Excel)

```php
// Write Excel files
$config = ['path' => './output/'];
$excel = new Vtiful\Kernel\Excel($config);

$file = $excel->fileName('report.xlsx')
    ->header(['Name', 'Email', 'Age'])
    ->data([
        ['Alice', 'alice@example.com', 30],
        ['Bob', 'bob@example.com', 25],
    ])
    ->output();

// With formatting
$format = new Vtiful\Kernel\Format($excel);
$boldFormat = $format->bold()->toResource();
```

## Authentication Services

### Radius

```php
// RADIUS authentication
$radius = radius_auth_open();
radius_add_server($radius, 'radius.example.com', 1812, 'secret', 5, 3);

radius_create_request($radius, RADIUS_ACCESS_REQUEST);
radius_put_attr($radius, RADIUS_USER_NAME, 'alice');
radius_put_attr($radius, RADIUS_USER_PASSWORD, 'password');

$result = radius_send_request($radius);
// RADIUS_ACCESS_ACCEPT, RADIUS_ACCESS_REJECT, RADIUS_ACCESS_CHALLENGE
```

## Other Basic Extensions

### GeoIP

```php
// IP geolocation
$record = geoip_record_by_name('8.8.8.8');
// ['country_code' => 'US', 'country_name' => 'United States', 'city' => '...', ...]

$country = geoip_country_code_by_name('8.8.8.8'); // 'US'
$org = geoip_org_by_name('8.8.8.8'); // 'Google LLC'
```

### FANN (Fast Artificial Neural Network)

```php
// Neural networks
$ann = fann_create_standard(3, 2, 3, 1);
fann_train_on_file($ann, 'training.data', 1000, 10, 0.001);
$output = fann_run($ann, [0.5, 0.8]);
fann_save($ann, 'network.net');
fann_destroy($ann);
```

### Igbinary

```php
// Compact binary serialization (faster, smaller than serialize())
$binary = igbinary_serialize($data);
$data = igbinary_unserialize($binary);

// Use with sessions:
// session.serialize_handler = igbinary
// Use with APCu:
// apc.serializer = igbinary
```

### Lua / LuaSandbox

```php
// Lua embedding
$lua = new Lua();
$lua->eval('print("Hello from Lua")');
$result = $lua->call('my_function', [1, 2, 3]);
$lua->assign('php_var', $value);

// LuaSandbox (restricted execution)
$sandbox = new LuaSandbox();
$sandbox->loadString('return 1 + 2')->call();
$sandbox->setMemoryLimit(50 * 1024 * 1024);
$sandbox->setCPULimit(10);
```

### JSON (additional details)

```php
// JSON path (PHP 8.4+ — json_validate, etc.)
json_validate('{"valid": true}'); // true
json_validate('{invalid}'); // false

// JSON with flags
json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
json_decode($json, associative: true, depth: 512, flags: JSON_THROW_ON_ERROR);
```

### CommonMark

```php
// CommonMark markdown parsing
$html = CommonMark\Render\HTML::renderString('# Hello World');
$parser = new CommonMark\Parser();
$document = $parser->parse('# Hello');
```

## Other Services

### Event (libevent)

```php
// Event-driven I/O (like Node.js event loop)
$base = new EventBase();

// Timer event
$timer = Event::timer($base, function () use (&$timer) {
    echo "Timer fired\n";
    $timer->del(); // stop after first fire
});
$timer->add(2.0); // 2 seconds

// Signal event
$signal = Event::signal($base, SIGINT, function () {
    echo "Caught SIGINT\n";
});
$signal->add();

// I/O event
$event = new Event($base, $fd, Event::READ | Event::WRITE, function ($fd, $what) {
    // handle read/write
});
$event->add();

$base->loop();
```

### Yar (Yet Another RPC)

```php
// Yar RPC server
class API {
    public function add($a, $b) { return $a + $b; }
    public function greet($name) { return "Hello, $name"; }
}
$server = new Yar_Server(new API());
$server->handle();

// Yar RPC client
$client = new Yar_Client('http://example.com/api.php');
$result = $client->add(1, 2); // 3
$result = $client->greet('Alice'); // "Hello, Alice"

// Concurrent calls
Yar_Concurrent_Client::call('http://example.com/api.php', 'add', [1, 2], function ($retval) {
    echo "Result: $retval\n";
});
```

## Process Control (Additional)

### Eio (Async I/O)

```php
// Async I/O operations (libeio)
eio_init();
eio_read('file.txt', 1024, 0, EIO_PRI_DEFAULT, function ($data, $result) {
    echo $data;
});
eio_write('output.txt', 'content', strlen('content'), 0, EIO_PRI_DEFAULT, function () {
    echo "Written\n";
});
eio_event_loop();
```

### Ev (libev)

```php
// High-performance event loop
$loop = EvLoop::defaultLoop();

$timer = EvTimer::create(2, 0, function () {
    echo "Timer\n";
});

$io = EvIo::create(STDIN, Ev::READ, function () {
    echo "Input ready\n";
});

$loop->run();
```

### Expect

```php
// Interactive process control
$stream = expect_popen('ssh user@host');
expect_expectl($stream, [
    [['password:'], 'password', 'my_password'],
    [['$ '], 'shell', 'ls -la'],
]);
```

## Human Language (Additional)

### Enchant (Spell Check)

```php
$broker = enchant_broker_init();
$dict = enchant_broker_request_dict($broker, 'en_US');
enchant_dict_check($dict, 'hello'); // true
enchant_dict_suggest($dict, 'helol'); // ['hello']
enchant_broker_free($broker);
```

### Gender (Name Gender Detection)

```php
$gender = new Gender\Gender();
$result = $gender->get('Alice', Gender\Gender::ENGLISH);
// Gender\Gender::IS_FEMALE
```

## Variable and Type Related (Additional)

### Quickhash

```php
// High-performance hash sets and maps
$set = new QuickHashIntSet(1024);
$set->add(42);
$set->contains(42); // true
$set->delete(42);

$hash = new QuickHashIntHash(1024);
$hash->add(42, 'value');
$hash->get(42); // 'value'

$stringHash = new QuickHashStringIntHash(1024);
$stringHash->add('key', 123);
$stringHash->get('key'); // 123
```

## Database Extensions (Additional)

### dBase

```php
// dBase database files
$db = dbase_open('data.dbf', 0); // read
$db = dbase_open('data.dbf', 2); // read/write
dbase_add_record($db, ['Alice', 30, 'alice@example.com']);
dbase_get_record($db, 1);
dbase_replace_record($db, $record, 1);
dbase_delete_record($db, 1);
dbase_pack($db); // remove deleted records
dbase_close($db);
```

### Firebird/InterBase

```php
// Firebird database
$conn = ibase_connect('localhost:/path/to/database.fdb', 'user', 'pass');
$query = ibase_query($conn, 'SELECT * FROM users');
while ($row = ibase_fetch_object($query)) {
    echo $row->NAME;
}
ibase_close($conn);

// Service functions
$svc = ibase_service_attach('localhost', 'user', 'pass');
ibase_backup($svc, '/path/to/db.fdb', '/path/to/backup.fbk');
ibase_restore($svc, '/path/to/backup.fbk', '/path/to/newdb.fdb');
ibase_service_detach($svc);
```

### CUBRID

```php
// CUBRID database
$conn = cubrid_connect('localhost', 33000, 'mydb', 'user', 'pass');
$result = cubrid_query('SELECT * FROM users');
while ($row = cubrid_fetch_assoc($result)) {
    print_r($row);
}
cubrid_close($conn);
```

### IBM DB2

```php
// IBM DB2
$conn = db2_connect('SAMPLE', 'user', 'pass');
$stmt = db2_prepare($conn, 'SELECT * FROM employees WHERE dept = ?');
db2_execute($stmt, ['IT']);
while ($row = db2_fetch_assoc($stmt)) {
    print_r($row);
}
db2_close($conn);
```

## Affecting PHP's Behaviour (Additional)

### Componere

```php
// Runtime class composition
use Componere\Definition;
use Componere\Method;

$def = new Definition(MyClass::class);
$def->addMethod('newMethod', new Method(function () {
    return 'dynamic';
}));
$def->register();
```

### Operator Overloading (PECL extension)

```php
// Operator overloading for objects (PECL operator)
class Vector {
    public function __construct(public float $x, public float $y) {}

    // With operator extension:
    // public function __add(Vector $other): Vector { ... }
    // public function __sub(Vector $other): Vector { ... }
    // public function __mul(float $scalar): Vector { ... }
}
```
