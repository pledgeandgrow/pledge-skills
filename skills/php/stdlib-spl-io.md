# Standard Library: SPL, Reflection, File I/O

## SPL (Standard PHP Library)

### SPL Interfaces

```php
// Traversable — base interface (cannot implement directly)
// Iterator — for custom iteration
// IteratorAggregate — return a Traversable from getIterator()
// ArrayAccess — array-like access on objects
// Countable — count() support
// Serializable — legacy serialization (use __serialize/__unserialize instead)

// OuterIterator — wraps another iterator
interface OuterIterator extends Iterator {
    public function getInnerIterator(): ?Iterator;
}

// RecursiveIterator — for tree structures
interface RecursiveIterator extends Iterator {
    public function hasChildren(): bool;
    public function getChildren(): ?RecursiveIterator;
}

// SeekableIterator — random access
interface SeekableIterator extends Iterator {
    public function seek(int $offset): void;
}

// SplObserver / SplSubject — observer pattern
interface SplSubject {
    public function attach(SplObserver $observer): void;
    public function detach(SplObserver $observer): void;
    public function notify(): void;
}
interface SplObserver {
    public function update(SplSubject $subject): void;
}
```

### SPL Datastructures

```php
// SplDoublyLinkedList — doubly linked list
$list = new SplDoublyLinkedList();
$list->push('a'); $list->push('b'); $list->push('c');
$list->unshift('first');
$list->pop();   // 'c'
$list->shift(); // 'first'
$list->top();   // 'b'
$list->bottom();// 'a'
$list->count();
$list->setIteratorMode(SplDoublyLinkedList::IT_MODE_FIFO);

// SplStack — LIFO (extends SplDoublyLinkedList)
$stack = new SplStack();
$stack->push('a'); $stack->push('b');
$stack->pop(); // 'b'

// SplQueue — FIFO (extends SplDoublyLinkedList)
$queue = new SplQueue();
$queue->enqueue('a'); $queue->enqueue('b');
$queue->dequeue(); // 'a'

// SplHeap — abstract heap
// SplMaxHeap — max heap (extracts max first)
// SplMinHeap — min heap (extracts min first)
$heap = new SplMinHeap();
$heap->insert(5); $heap->insert(1); $heap->insert(3);
echo $heap->extract(); // 1
echo $heap->extract(); // 3

// SplPriorityQueue
$pq = new SplPriorityQueue();
$pq->insert('low', 1);
$pq->insert('high', 10);
$pq->insert('medium', 5);
echo $pq->extract(); // 'high' (highest priority)

// SplFixedArray — fixed-size array (faster than regular array for indexed)
$arr = new SplFixedArray(5);
$arr[0] = 'a'; $arr[1] = 'b';
$arr->setSize(10);
$arr->toArray(); // convert to regular array
SplFixedArray::fromArray([1, 2, 3]);

// ArrayObject — object wrapper for array
$obj = new ArrayObject(['a' => 1, 'b' => 2]);
$obj['c'] = 3;
$obj->append(4);
$obj->count();
$obj->getArrayCopy();
$obj->ksort(); $obj->asort();
$obj->setFlags(ArrayObject::ARRAY_AS_PROPS);
echo $obj->a; // 1

// SplObjectStorage — map with objects as keys
$storage = new SplObjectStorage();
$obj1 = new stdClass();
$obj2 = new stdClass();
$storage->attach($obj1, 'data1');
$storage->attach($obj2, 'data2');
$storage[$obj1] = 'updated';
echo $storage[$obj1]; // 'updated'
$storage->contains($obj1); // true
$storage->detach($obj1);
count($storage);
```

### SPL Iterators

```php
// ArrayIterator — iterate over array
$iter = new ArrayIterator([1, 2, 3]);
foreach ($iter as $value) { echo $value; }

// LimitIterator — slice an iterator
$iter = new LimitIterator(new ArrayIterator([1,2,3,4,5]), 1, 2); // offset=1, count=2
foreach ($iter as $v) { echo $v; } // 2, 3

// IteratorIterator — outer iterator wrapper
$iter = new IteratorIterator(new ArrayObject([1, 2, 3]));

// FilterIterator — abstract, implement accept()
class EvenFilter extends FilterIterator {
    public function accept(): bool {
        return $this->current() % 2 === 0;
    }
}
$iter = new EvenFilter(new ArrayIterator([1, 2, 3, 4, 5]));

// CallbackFilterIterator (PHP 5.4+)
$iter = new CallbackFilterIterator(
    new ArrayIterator([1, 2, 3, 4, 5]),
    fn($value) => $value % 2 === 0
);

// RecursiveArrayIterator / RecursiveIteratorIterator
$arr = ['a' => [1, 2], 'b' => [3, 4]];
$iter = new RecursiveIteratorIterator(
    new RecursiveArrayIterator($arr),
    RecursiveIteratorIterator::LEAVES_ONLY
);
foreach ($iter as $leaf) { echo $leaf; } // 1, 2, 3, 4

// RegexIterator
$iter = new RegexIterator(
    new ArrayIterator(['apple', 'banana', 'cherry']),
    '/^a/',
    RegexIterator::MATCH
);

// GlobIterator
$iter = new GlobIterator('/path/*.txt');
foreach ($iter as $file) {
    echo $file->getFilename();
}

// DirectoryIterator
foreach (new DirectoryIterator('/path/to/dir') as $file) {
    if ($file->isDot()) continue;
    echo $file->getFilename();
}

// RecursiveDirectoryIterator
$iter = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator('/path'),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach ($iter as $file) {
    echo $file->getPathname();
}

// AppendIterator — chain multiple iterators
$append = new AppendIterator();
$append->append(new ArrayIterator([1, 2]));
$append->append(new ArrayIterator([3, 4]));

// MultipleIterator — iterate in parallel
$multi = new MultipleIterator();
$multi->attachIterator(new ArrayIterator(['a', 'b']));
$multi->attachIterator(new ArrayIterator([1, 2]));
foreach ($multi as [$letter, $number]) {
    echo "$letter=$number\n"; // a=1, b=2
}

// NoRewindIterator — prevents rewind
// InfiniteIterator — infinitely loops
// EmptyIterator — yields nothing
```

### SPL Exceptions

```php
// LogicException family (compile-time errors)
LogicException
BadFunctionCallException
BadMethodCallException
DomainException
InvalidArgumentException
LengthException
OutOfRangeException

// RuntimeException family (runtime errors)
RuntimeException
OutOfBoundsException
OverflowException
RangeException
UnderflowException
UnexpectedValueException
```

### SPL Functions

```php
// Class info
spl_classes(); // all SPL classes
class_implements($class); // interfaces implemented
class_parents($class);    // parent classes
class_uses($class);       // traits used

// Object info
is_subclass_of($obj, $class);
is_a($obj, $class);

// Autoload
spl_autoload_register(fn($class) => require "src/$class.php");
spl_autoload_unregister($fn);
spl_autoload_functions();
spl_autoload_call($class);
spl_autoload_extensions('.php');
```

## Reflection

```php
// ReflectionClass
$ref = new ReflectionClass(User::class);
$ref->getName();           // 'User'
$ref->getShortName();      // 'User' (without namespace)
$ref->getNamespaceName();  // 'App\Models'
$ref->isAbstract(); $ref->isFinal(); $ref->isInterface(); $ref->isTrait();
$ref->isInstantiable(); $ref->isCloneable();
$ref->getConstructor();
$ref->getMethods();        // ReflectionMethod[]
$ref->getMethod('getName');
$ref->getProperties();     // ReflectionProperty[]
$ref->getProperty('name');
$ref->getConstants();
$ref->getConstant('MAX');
$ref->getDefaultProperties();
$ref->getStaticProperties();
$ref->getInterfaceNames();
$ref->getParentClass();
$ref->getTraits();
$ref->getAttributes();     // ReflectionAttribute[]
$ref->newInstance(args...);
$ref->newInstanceWithoutConstructor();
$ref->newLazyGhost(callable $initializer); // PHP 8.4+

// ReflectionMethod
$m = new ReflectionMethod(User::class, 'getName');
$m->isPublic(); $m->isProtected(); $m->isPrivate();
$m->isStatic(); $m->isAbstract(); $m->isFinal();
$m->getParameters();       // ReflectionParameter[]
$m->getReturnType();       // ReflectionType
$m->getNumberOfParameters();
$m->getNumberOfRequiredParameters();
$m->invoke($object, args...);
$m->invoke(null, args...); // static

// ReflectionProperty
$p = new ReflectionProperty(User::class, 'name');
$p->isPublic(); $p->isProtected(); $p->isPrivate();
$p->isStatic(); $p->isReadOnly(); $p->isDefault();
$p->getValue($object);
$p->setValue($object, 'new value');
$p->setAccessible(true); // PHP < 8.1 (auto-accessible in 8.1+)
$p->getAttributes();

// ReflectionParameter
$param = new ReflectionParameter([User::class, '__construct'], 0);
$param->getName();
$param->getType();         // ReflectionType
$param->hasType();
$param->isOptional();
$param->isDefaultValueAvailable();
$param->getDefaultValue();
$param->allowsNull();
$param->isVariadic();
$param->getAttributes();

// ReflectionType / ReflectionNamedType / ReflectionUnionType / ReflectionIntersectionType
$type = $param->getType();
if ($type instanceof ReflectionNamedType) {
    echo $type->getName();    // 'int', 'string', etc.
    echo $type->allowsNull(); // bool
    echo $type->isBuiltin();  // true for int/string/etc.
}
if ($type instanceof ReflectionUnionType) {
    foreach ($type->getTypes() as $subType) { ... }
}

// ReflectionFunction
$f = new ReflectionFunction('strlen');
$f->getName(); $f->getParameters(); $f->getReturnType();
$f->getClosure();

// ReflectionExtension
$ext = new ReflectionExtension('pdo');
$ext->getName(); $ext->getVersion(); $ext->getFunctions();

// ReflectionEnum (PHP 8.1+)
$enumRef = new ReflectionEnum(Status::class);
$enumRef->getCases(); // ReflectionEnumUnitCase[] or ReflectionEnumBackedCase[]
$enumRef->isBacked();
$enumRef->getBackingType();

// ReflectionAttribute (PHP 8.0+)
$attrs = $ref->getAttributes(Route::class);
foreach ($attrs as $attr) {
    echo $attr->getName();      // 'Route'
    $instance = $attr->newInstance(); // instantiate the attribute
    echo $attr->getTarget();    // target bitmask
    echo $attr->isRepeated();   // bool
}

// ReflectionFiber (PHP 8.1+)
$fiberRef = new ReflectionFiber($fiber);
$fiberRef->getCallable();
$fiberRef->getExecutingFile();
$fiberRef->getExecutingLine();
```

## Fileinfo Extension

```php
// Get MIME type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file('example.pdf'); // 'application/pdf'

// Procedural
$mime = mime_content_type('example.pdf');

// Get full info
$finfo = new finfo(FILEINFO_NONE);
echo $finfo->file('example.txt');

// From string
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->buffer(file_get_contents('unknown.dat'));

// Constants
FILEINFO_MIME_TYPE; FILEINFO_MIME_ENCODING;
FILEINFO_MIME; FILEINFO_NONE;
FILEINFO_EXTENSION; // guess file extension
```

## Filesystem Functions

```php
// File operations
file_exists($path);
is_file($path); is_dir($path); is_link($path);
is_readable($path); is_writable($path); is_executable($path);
filesize($path); filemtime($path); fileatime($path); filectime($path);
fileperms($path); fileowner($path); filegroup($path);
filetype($path); // 'file', 'dir', 'link', etc.

// Read/write
file_get_contents($path);
file_put_contents($path, $data);
file_put_contents($path, $data, FILE_APPEND | LOCK_EX);
fopen($path, 'r'); // modes: r, r+, w, w+, a, a+, x, x+, c, c+
fread($handle, $length);
fwrite($handle, $data);
fgets($handle); // read line
fgetc($handle); // read char
ftruncate($handle, $size);
fflush($handle);
fclose($handle);
fpassthru($handle); // output + close
file($path); // read lines into array

// CSV
$handle = fopen('data.csv', 'r');
while (($row = fgetcsv($handle)) !== false) {
    print_r($row);
}
fclose($handle);

$handle = fopen('output.csv', 'w');
fputcsv($handle, ['name', 'email']);
fputcsv($handle, ['Alice', 'alice@example.com']);
fclose($handle);

// Copy / rename / delete
copy($source, $dest);
rename($old, $new);
unlink($path); // delete file

// Permissions
chmod($path, 0644);
chown($path, 'user');
chgrp($path, 'group');
touch($path); // create or update mtime
clearstatcache(); // clear file stat cache

// Paths
realpath($path);   // resolve symlinks + relative
dirname($path);    // parent directory
basename($path);   // filename
pathinfo($path);   // ['dirname', 'basename', 'extension', 'filename']
tempnam($dir, $prefix); // create temp file
sys_get_temp_dir();

// Disk
disk_free_space($path); disk_total_space($path);

// Locking
flock($handle, LOCK_EX); // exclusive lock
flock($handle, LOCK_SH); // shared lock
flock($handle, LOCK_UN); // release
```

## Directory Functions

```php
// Open and read directory
$dir = opendir('/path/to/dir');
while (($entry = readdir($dir)) !== false) {
    if ($entry === '.' || $entry === '..') continue;
    echo $entry;
}
closedir($dir);

// scandir — read into array
$entries = scandir('/path/to/dir');
$entries = scandir('/path/to/dir', SCANDIR_SORT_DESCENDING);

// glob — pattern match
$files = glob('/path/*.txt');
$files = glob('/path/*.{txt,md}', GLOB_BRACE);

// Create / remove directories
mkdir('/path/to/new/dir');
mkdir('/path/to/new/dir', 0755, true); // recursive
rmdir('/path/to/dir'); // must be empty

// Directory class
$dir = dir('/path/to/dir');
while ($entry = $dir->read()) {
    echo $entry;
}
$dir->close();

// Recursive directory iterator
$iter = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator('/path', RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach ($iter as $file) {
    echo $file->getPathname();
}
```
