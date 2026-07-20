# Operators

## Operator Precedence

Operators are listed from highest to lowest precedence. Associativity determines order for same-precedence operators.

| Associativity | Operators |
|---------------|-----------|
| n/a | `clone` `new` |
| right | `**` |
| n/a | `!` `+` `-` `~` `(int)` `(float)` `(string)` `(array)` `(object)` `(bool)` |
| left | `*` `/` `%` |
| left | `+` `-` `.` |
| left | `<<` `>>` |
| left | `<` `<=` `>` `>=` |
| n/a | `==` `!=` `===` `!==` `<=>` |
| left | `&` |
| left | `^` |
| left | `\|` |
| left | `&&` |
| left | `\|\|` |
| right | `??` |
| left | `?:` |
| right | `=` `+=` `-=` `*=` `/=` `%=` `**=` `.=` `&=` `\|=` `^=` `<<=` `>>=` `??=` |
| n/a | `and` |
| n/a | `xor` |
| n/a | `or` |

## Arithmetic Operators

```php
$a + $b;    // addition
$a - $b;    // subtraction
$a * $b;    // multiplication
$a / $b;    // division (returns float if not evenly divisible)
$a % $b;    // modulo (result has sign of dividend)
$a ** $b;   // exponentiation

intdiv($a, $b); // integer division
$fmod = fmod($a, $b); // float modulo
```

## Increment and Decrement

```php
++$a;  // pre-increment — returns incremented value
$a++;  // post-increment — returns original value
--$a;  // pre-decrement
$a--;  // post-decrement
```

## Assignment Operators

```php
$a = 42;
$a += 10;   // $a = $a + 10
$a -= 5;    // $a = $a - 5
$a *= 2;    // $a = $a * 2
$a /= 3;    // $a = $a / 3
$a %= 4;    // $a = $a % 4
$a **= 2;   // $a = $a ** 2
$a .= "x";  // string concatenation
$a &= 0xFF; // bitwise AND
$a |= 0x10; // bitwise OR
$a ^= 0x0F; // bitwise XOR
$a <<= 2;   // left shift
$a >>= 1;   // right shift
$a ??= "default"; // null coalescing assignment (PHP 7.4+)
```

## Bitwise Operators

```php
$a & $b;   // AND
$a | $b;   // OR
$a ^ $b;   // XOR
~$a;       // NOT
$a << $b;  // left shift
$a >> $b;  // right shift
```

## Comparison Operators

```php
$a == $b;    // equal (loose, type juggling)
$a === $b;   // identical (strict, same type and value)
$a != $b;    // not equal
$a <> $b;    // not equal (alternative)
$a !== $b;   // not identical
$a < $b;     // less than
$a <= $b;    // less than or equal
$a > $b;     // greater than
$a >= $b;    // greater than or equal
$a <=> $b;   // spaceship: -1, 0, or 1 (PHP 7.0+)
```

### Strict vs Loose Comparison

```php
// Loose (==) — type juggling
0 == "0"      // true
"1" == 1      // true
null == false // true
"abc" == 0    // false (PHP 8.0+, was true pre-8.0)

// Strict (===) — no type juggling
0 === "0"      // false
"1" === 1      // false
null === false // false
```

## Error Control Operator

```php
// @ suppresses error messages for the expression
$result = @file_get_contents("nonexistent.txt");
if ($result === false) {
    // handle error
}

// Not recommended — use proper error handling instead
```

## Execution Operator

```php
// Backticks execute shell command (same as shell_exec())
$output = `ls -la`;
$output = shell_exec('ls -la');
```

## Logical Operators

```php
$a && $b;  // and (short-circuit)
$a || $b;  // or (short-circuit)
!$a;       // not
$a and $b; // and (lower precedence than =)
$a or $b;  // or (lower precedence than =)
$a xor $b; // xor (exclusive or)
```

## String Operators

```php
$a . $b;   // concatenation
$a .= $b;  // concatenation assignment
```

## Array Operators

```php
$a + $b;      // union (keys from $a take precedence)
$a == $b;     // equal (same key/value pairs)
$a === $b;    // identical (same key/value pairs, same order, same types)
$a != $b;     // not equal
$a <> $b;     // not equal
$a !== $b;    // not identical
```

## Type Operator

```php
$a instanceof MyClass;       // check if object is instance of class
$a instanceof MyInterface;   // check if object implements interface
$a instanceof MyTrait;       // check if object uses trait (PHP 8.0+)
$a instanceof $className;    // with variable
$a instanceof $namespaced;   // with namespaced class
```

## Functional Operators

```php
// First-class callable syntax (PHP 8.1+)
$fn = strlen(...);
$fn = $obj->method(...);
$fn = MyClass::staticMethod(...);

// Nullsafe operator (PHP 8.0+)
$country = $user?->getAddress()?->getCountry();
// Returns null if any part in chain is null
```

## Ternary and Null Coalescing

```php
// Ternary
$result = $condition ? "yes" : "no";

// Shorthand ternary (elvis operator)
$result = $value ?: "default"; // if $value is truthy, use it; else "default"

// Null coalescing (PHP 7.0+)
$name = $_GET['name'] ?? "default";

// Null coalescing assignment (PHP 7.4+)
$config['timeout'] ??= 30;

// Chaining null coalescing
$name = $_GET['name'] ?? $_POST['name'] ?? "default";
```
