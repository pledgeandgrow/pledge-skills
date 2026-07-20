# References Explained

## What References Are

References in PHP are not pointers — they are aliases. Two variable names point to the same underlying value container.

## Assigning by Reference

```php
$a = 10;
$b = &$a; // $b and $a point to same value

$b = 20;
echo $a; // 20

unset($b); // only unsets the alias, $a still exists
echo $a;   // 20
```

## Passing by Reference

```php
function increment(int &$value): void {
    $value++;
}

$num = 5;
increment($num);
echo $num; // 6

// Array elements by reference
function modify(array &$arr): void {
    $arr['modified'] = true;
}

$data = ['name' => 'Alice'];
modify($data);
// $data now has 'modified' => true
```

## Returning by Reference

```php
function &getReference(): array {
    static $data = ['count' => 0];
    return $data;
}

$ref = &getReference();
$ref['count'] = 10;
echo getReference()['count']; // 10
```

## References in foreach

```php
$items = [1, 2, 3];

// Modify original array
foreach ($items as &$item) {
    $item *= 2;
}
unset($item); // break reference after loop

print_r($items); // [2, 4, 6]

// Without unset, $item still references last element
// Common bug source — always unset after reference foreach
```

## References and Arrays

```php
// Array elements are NOT references by default
$a = [1, 2, 3];
$b = $a;       // copy
$b[0] = 99;
echo $a[0];    // 1 (unaffected)

// With reference
$a = [1, 2, 3];
$b = &$a;
$b[0] = 99;
echo $a[0];    // 99 (same array)
```

## References and Objects

```php
// Objects are passed by handle (not reference, but similar effect)
$obj = new stdClass();
$obj->name = 'Alice';

$copy = $obj;       // copies the handle, not the object
$copy->name = 'Bob';
echo $obj->name;    // 'Bob' (same object)

// True reference
$ref = &$obj;
$ref = null;
// Now $obj is also null (both point to same variable)

// clone for actual copy
$obj1 = new stdClass();
$obj1->name = 'Alice';
$obj2 = clone $obj1;
$obj2->name = 'Bob';
echo $obj1->name;   // 'Alice' (independent)
```

## Reference Counting

PHP uses reference counting for memory management. When a value's reference count reaches 0, it is freed.

```php
$a = new stdClass();  // refcount = 1
$b = $a;              // refcount = 2 (same object, two handles)
$c = &$a;             // $a and $c are references, refcount split
unset($a);            // $c still alive
unset($b);            // object still alive via $c
unset($c);            // refcount = 0, object destroyed

// Circular references (not caught by refcounting)
$a = new stdClass();
$b = new stdClass();
$a->ref = $b;
$b->ref = $a;
unset($a, $b); // collected by garbage collector (GC)
```

## Common Pitfalls

- **foreach by reference** — always `unset($item)` after the loop
- **Objects vs references** — objects pass by handle, not by reference; use `clone` for copies
- **References are not pointers** — they are aliases, not memory addresses
- **Avoid unnecessary references** — they make code harder to reason about
- **GC and circular references** — use `gc_collect_cycles()` if needed
