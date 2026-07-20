# Standard Library: Database Extensions

## PDO (PHP Data Objects) — Recommended

PDO provides a unified interface across multiple database drivers.

### Connection

```php
// MySQL
$pdo = new PDO('mysql:host=localhost;dbname=myapp;charset=utf8mb4', 'user', 'pass', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

// PostgreSQL
$pdo = new PDO('pgsql:host=localhost;dbname=myapp', 'user', 'pass');

// SQLite
$pdo = new PDO('sqlite:/path/to/database.sqlite');
$pdo = new PDO('sqlite::memory:'); // in-memory

// SQL Server
$pdo = new PDO('sqlsrv:Server=localhost;Database=myapp', 'user', 'pass');

// Oracle
$pdo = new PDO('oci:dbname=localhost/XE', 'user', 'pass');

// ODBC
$pdo = new PDO('odbc:DSN=mydsn', 'user', 'pass');
```

### Prepared Statements

```php
// Named parameters
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email AND status = :status');
$stmt->execute(['email' => $email, 'status' => 'active']);
$users = $stmt->fetchAll();

// Positional parameters
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND status = ?');
$stmt->execute([$email, 'active']);
$user = $stmt->fetch();

// Bind types
$stmt = $pdo->prepare('INSERT INTO products (name, price, qty) VALUES (:name, :price, :qty)');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->bindValue(':price', $price, PDO::PARAM_STR);
$stmt->bindValue(':qty', $qty, PDO::PARAM_INT);
$stmt->execute();

// Bind param (by reference)
$stmt = $pdo->prepare('UPDATE users SET name = :name WHERE id = :id');
$stmt->bindParam(':name', $name);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$name = 'Alice'; $id = 1;
$stmt->execute();
```

### Fetching

```php
// Fetch modes
$stmt->fetch(PDO::FETCH_ASSOC);    // associative array
$stmt->fetch(PDO::FETCH_NUM);      // numeric array
$stmt->fetch(PDO::FETCH_BOTH);     // both (default)
$stmt->fetch(PDO::FETCH_OBJ);      // stdClass object
$stmt->fetch(PDO::FETCH_LAZY);     // lazy object
$stmt->fetch(PDO::FETCH_BOUND);    // bound to variables
$stmt->fetch(PDO::FETCH_CLASS);    // into specific class

// Fetch all
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll(PDO::FETCH_COLUMN, 0); // first column only
$rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // [col1 => col2]

// Fetch into class
$stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
$users = $stmt->fetchAll();

// Fetch column
$count = $stmt->fetchColumn(); // first column of first row
```

### Transactions

```php
try {
    $pdo->beginTransaction();
    $pdo->exec('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
    $pdo->exec('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
    $pdo->commit();
} catch (PDOException $e) {
    $pdo->rollBack();
    throw $e;
}
```

### Other Operations

```php
// Last insert ID
$id = $pdo->lastInsertId();

// Row count
$count = $stmt->rowCount();

// Execute direct query
$pdo->exec('DELETE FROM old_records WHERE created_at < "2020-01-01"');

// Quote (avoid — use prepared statements)
$safe = $pdo->quote($userInput);

// Get error info
$error = $stmt->errorInfo(); // [SQLSTATE, code, message]

// Available drivers
$drivers = PDO::getAvailableDrivers();
```

## MySQLi (MySQL Improved)

```php
// Connection
$mysqli = new mysqli('localhost', 'user', 'pass', 'myapp');
$mysqli = new mysqli('p:localhost', 'user', 'pass', 'myapp'); // persistent

if ($mysqli->connect_errno) {
    throw new RuntimeException('Connection failed: ' . $mysqli->connect_error);
}

$mysqli->set_charset('utf8mb4');

// Prepared statements
$stmt = $mysqli->prepare('SELECT id, name, email FROM users WHERE status = ?');
$stmt->bind_param('s', $status);
$status = 'active';
$stmt->execute();
$stmt->bind_result($id, $name, $email);
while ($stmt->fetch()) {
    echo "$id: $name <$email>\n";
}
$stmt->close();

// Insert
$stmt = $mysqli->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
$stmt->bind_param('ss', $name, $email);
$name = 'Alice'; $email = 'alice@example.com';
$stmt->execute();
$newId = $mysqli->insert_id;

// Transactions
$mysqli->begin_transaction();
try {
    $mysqli->query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
    $mysqli->query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
    $mysqli->commit();
} catch (Exception $e) {
    $mysqli->rollback();
}

// Multi-query
$mysqli->multi_query('SELECT 1; SELECT 2;');

// Types: s=string, i=int, d=double, b=blob
```

## PostgreSQL (pg_connect)

```php
// Connection
$conn = pg_connect("host=localhost dbname=myapp user=user password=pass");
$conn = pg_pconnect("host=localhost dbname=myapp user=user password=pass"); // persistent

// Query
$result = pg_query($conn, 'SELECT * FROM users WHERE active = true');
while ($row = pg_fetch_assoc($result)) {
    print_r($row);
}

// Prepared statements
$result = pg_prepare($conn, 'my_query', 'SELECT * FROM users WHERE email = $1');
$result = pg_execute($conn, 'my_query', ['alice@example.com']);

// Insert with returning
$result = pg_query($conn, "INSERT INTO users (name) VALUES ('Alice') RETURNING id");
$newId = pg_fetch_result($result, 0, 'id');

// Transactions
pg_query($conn, 'BEGIN');
pg_query($conn, 'COMMIT');
pg_query($conn, 'ROLLBACK');

// Escape (use prepared statements instead)
$safe = pg_escape_string($conn, $userInput);

// Copy
pg_copy_from($conn, 'users', $data, ',');
pg_copy_to($conn, 'users');
```

## SQLite3

```php
$db = new SQLite3('database.sqlite');
$db = new SQLite3(':memory:'); // in-memory

$db->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');

$stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
$stmt->bindValue(':id', 1, SQLITE3_INTEGER);
$result = $stmt->execute();
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    print_r($row);
}

$db->exec("INSERT INTO users (name) VALUES ('Alice')");
echo $db->lastInsertRowID();

$db->close();
```

## MongoDB

```php
// MongoDB extension (uses MongoDB driver)
$manager = new MongoDB\Driver\Manager('mongodb://localhost:27017');

// Insert
$bulk = new MongoDB\Driver\BulkWrite();
$bulk->insert(['name' => 'Alice', 'age' => 30]);
$bulk->insert(['name' => 'Bob', 'age' => 25]);
$manager->executeBulkWrite('myapp.users', $bulk);

// Query
$query = new MongoDB\Driver\Query(['age' => ['$gt' => 20]], ['sort' => ['age' => 1]]);
$cursor = $manager->executeQuery('myapp.users', $query);
foreach ($cursor as $document) {
    print_r($document);
}

// Update
$bulk = new MongoDB\Driver\BulkWrite();
$bulk->update(['name' => 'Alice'], ['$set' => ['age' => 31]]);
$manager->executeBulkWrite('myapp.users', $bulk);

// Delete
$bulk = new MongoDB\Driver\BulkWrite();
$bulk->delete(['name' => 'Bob']);
$manager->executeBulkWrite('myapp.users', $bulk);
```

## OCI8 (Oracle)

```php
$conn = oci_connect('user', 'pass', 'localhost/XE');
$conn = oci_pconnect('user', 'pass', 'localhost/XE'); // persistent

$stmt = oci_parse($conn, 'SELECT * FROM users WHERE id = :id');
oci_bind_by_name($stmt, ':id', $id);
oci_execute($stmt);
while ($row = oci_fetch_assoc($stmt)) {
    print_r($row);
}
oci_close($conn);
```

## ODBC

```php
$conn = odbc_connect('DSN=mydsn;UID=user;PWD=pass', '', '');
$result = odbc_exec($conn, 'SELECT * FROM users');
while ($row = odbc_fetch_array($result)) {
    print_r($row);
}
odbc_close($conn);
```

## DBA (Database Abstraction — dbm-style)

```php
$db = dba_open('data.db', 'c', 'db4'); // create/read/write
dba_insert('key1', 'value1', $db);
echo dba_fetch('key1', $db); // 'value1'
dba_replace('key1', 'new_value', $db);
dba_delete('key1', $db);

// Iterate
$key = dba_firstkey($db);
while ($key !== false) {
    echo "$key: " . dba_fetch($key, $db) . "\n";
    $key = dba_nextkey($db);
}
dba_close($db);
```

## SQLSRV (Microsoft SQL Server)

```php
$conn = sqlsrv_connect('localhost', ['Database' => 'myapp', 'UID' => 'user', 'PWD' => 'pass']);

$stmt = sqlsrv_query($conn, 'SELECT * FROM users WHERE id = ?', [1]);
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    print_r($row);
}
sqlsrv_close($conn);
```
