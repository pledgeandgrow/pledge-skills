# Operators

## Operator Precedence (highest to lowest)

| Precedence | Operator | Description | Associativity |
|-----------|----------|-------------|---------------|
| 1 | `::` | Scope resolution | Left-to-right |
| 2 | `a++` `a--` `type()` `type{}` `a()` `a[]` `.` `->` `++a` `--a` `+a` `-a` `!` `~` `(T)` `*a` `&a` `sizeof` `co_await` `new` `new[]` `delete` `delete[]` | Postfix/Unary | Right-to-left |
| 3 | `.*` `->*` | Pointer-to-member | Left-to-right |
| 4 | `*` `/` `%` | Multiplicative | Left-to-right |
| 5 | `+` `-` | Additive | Left-to-right |
| 6 | `<<` `>>` | Shift | Left-to-right |
| 7 | `<=>` | Three-way comparison (C++20) | Left-to-right |
| 8 | `<` `<=` `>` `>=` | Relational | Left-to-right |
| 9 | `==` `!=` | Equality | Left-to-right |
| 10 | `&` | Bitwise AND | Left-to-right |
| 11 | `^` | Bitwise XOR | Left-to-right |
| 12 | `\|` | Bitwise OR | Left-to-right |
| 13 | `&&` | Logical AND | Left-to-right |
| 14 | `\|\|` | Logical OR | Left-to-right |
| 15 | `=` `+=` `-=` `*=` `/=` `%=` `<<=` `>>=` `&=` `^=` `\|=` | Assignment | Right-to-left |
| 16 | `?:` | Ternary conditional | Right-to-left |
| 17 | `throw` `co_yield` | | |
| 18 | `,` | Comma | Left-to-right |

## Arithmetic Operators

```cpp
int a = 10, b = 3;

a + b;   // 13  (addition)
a - b;   // 7   (subtraction)
a * b;   // 30  (multiplication)
a / b;   // 3   (integer division, truncates toward zero)
a % b;   // 1   (remainder, sign follows dividend)

// Floating-point division
10.0 / 3.0;  // 3.333...

// Increment/decrement
int x = 5;
x++;  // post-increment: returns 5, then x becomes 6
++x;  // pre-increment: x becomes 7, returns 7
x--;  // post-decrement: returns 7, then x becomes 6
--x;  // pre-decrement: x becomes 5, returns 5

// Unary plus/minus
int y = -x;  // negation
int z = +x;  // no-op (rarely used)
```

## Comparison Operators

```cpp
int a = 10, b = 20;

a == b;  // false (equal)
a != b;  // true  (not equal)
a <  b;  // true  (less than)
a <= b;  // true  (less than or equal)
a >  b;  // false (greater than)
a >= b;  // false (greater than or equal)

// Three-way comparison / spaceship operator (C++20)
auto result = a <=> b;
// result < 0 if a < b
// result == 0 if a == b
// result > 0 if a > b

// std::strong_ordering: less, equal, greater
// std::weak_ordering: less, equivalent, greater
// std::partial_ordering: less, equivalent, greater, unordered

if (a <=> b < 0) std::cout << "a < b";
if (a <=> b == 0) std::cout << "a == b";
if (a <=> b > 0) std::cout << "a > b";
```

## Logical Operators

```cpp
bool a = true, b = false;

a && b;  // false (logical AND, short-circuit)
a || b;  // true  (logical OR, short-circuit)
!a;      // false (logical NOT)

// Short-circuit evaluation
if (ptr != nullptr && ptr->value > 0) { ... }  // safe: ptr->value only if ptr != null
if (ptr == nullptr || ptr->value == 0) { ... } // safe: second check only if ptr != null

// C++23: Logical operator macros for metaprogramming
// std::conjunction, std::disjunction, std::negation (type traits)
```

## Bitwise Operators

```cpp
unsigned int a = 0b1100;  // 12
unsigned int b = 0b1010;  // 10

a & b;   // 0b1000 = 8   (bitwise AND)
a | b;   // 0b1110 = 14  (bitwise OR)
a ^ b;   // 0b0110 = 6   (bitwise XOR)
~a;      // 0b...0011    (bitwise NOT, all bits flipped)
a << 2;  // 0b110000 = 48 (left shift, zero-fill)
a >> 2;  // 0b0011 = 3   (right shift, for unsigned: zero-fill)

// Compound bitwise assignment
a &= b;  // a = a & b
a |= b;  // a = a | b
a ^= b;  // a = a ^ b
a <<= 2; // a = a << 2
a >>= 2; // a = a >> 2

// Bit manipulation utilities (C++20)
#include <bit>
std::popcount(0b1011u);    // 3 (count of 1 bits)
std::countl_zero(0b0001u); // 3 (leading zeros)
std::countr_zero(0b1000u); // 3 (trailing zeros)
std::countl_one(0b1110u);  // 3 (leading ones)
std::countr_one(0b0111u);  // 3 (trailing ones)
std::has_single_bit(0b0100u); // true (power of 2)
std::bit_ceil(5u);   // 8  (next power of 2 >= n)
std::bit_floor(5u);  // 4  (previous power of 2 <= n)
std::bit_width(5u);  // 3  (bits needed to represent n)
std::rotl(0b1010u, 2); // rotate left by 2
std::rotr(0b1010u, 2); // rotate right by 2
std::byteswap(0x1234u); // 0x3412 (C++23)

// Endian (C++20)
std::endian::native; // little, big, or mixed
if constexpr (std::endian::native == std::endian::little) { ... }
```

## Assignment Operators

```cpp
int x = 10;

x = 20;     // simple assignment
x += 5;     // x = x + 5 = 25
x -= 3;     // x = x - 3 = 22
x *= 2;     // x = x * 2 = 44
x /= 4;     // x = x / 4 = 11
x %= 3;     // x = x % 3 = 2
x <<= 1;    // x = x << 1 = 4
x >>= 1;    // x = x >> 1 = 2
x &= 0xFF;  // bitwise AND
x |= 0x10;  // bitwise OR
x ^= 0x01;  // bitwise XOR

// Chained assignment
int a, b, c;
a = b = c = 0;  // all set to 0

// Assignment returns reference to left operand
int x = 5;
(x = 10) = 20;  // x = 20
```

## Member Access Operators

```cpp
// Direct member access
struct Point { int x, y; };
Point p{10, 20};
p.x;  // 10
p.y;  // 20

// Pointer member access
Point* ptr = &p;
ptr->x;  // 10 (same as (*ptr).x)
ptr->y;  // 20

// Pointer-to-member access
int Point::*pm = &Point::x;
p.*pm;   // 10 (object .* pointer-to-member)
ptr->*pm; // 10 (pointer ->* pointer-to-member)

void (Point::*pmf)() = &Point::print;
(p.*pmf)();     // call member function via pointer
(ptr->*pmf)();  // same via pointer
```

## Ternary Conditional

```cpp
int x = 10;
int y = (x > 5) ? 100 : 200;  // 100

// Nested (avoid — use if/else or std::max/min)
int z = (x > 5) ? ((x > 10) ? 1 : 2) : 3;

// As expression
std::string result = (x > 0) ? "positive" : "non-positive";

// With throw (C++ doesn't allow throw in ?: directly, but...)
void (x > 0 ? process() : throw std::invalid_argument("negative"));
```

## Comma Operator

```cpp
// Evaluates left, then right, returns right
int x = (1, 2, 3);  // x = 3

// Useful in for-loops
for (int i = 0, j = 10; i < j; ++i, --j) { ... }

// Sequencing
int a = 0;
int b = (a = 1, a + 2);  // a = 1, b = 3
```

## sizeof, alignof, typeid

```cpp
// sizeof — size in bytes
sizeof(int);        // 4
sizeof(double);     // 8
sizeof(int[10]);    // 40
sizeof(std::string); // implementation-defined

// sizeof with expression (no evaluation)
int x = 42;
sizeof(x);          // 4 (x not evaluated)
sizeof(x + 1LL);    // 8 (result type is long long)

// sizeof with type
sizeof(int);        // 4

// sizeof... — pack size (C++11)
template<typename... Args>
void print(Args... args) {
    std::cout << sizeof...(Args) << " args\n";
    std::cout << sizeof...(args) << " args\n";
}

// alignof — alignment requirement (C++11)
alignof(int);       // 4
alignof(double);    // 8
alignof(char);      // 1

// alignas — specify alignment (C++11)
alignas(16) int x;  // x is 16-byte aligned
alignas(64) char buffer[256]; // cache-line aligned

// typeid — runtime type information
#include <typeinfo>
typeid(x).name();   // mangled type name
typeid(x) == typeid(y); // compare types
typeid(*ptr).name(); // dynamic type (requires RTTI and polymorphic type)
```

## Operator Overloading

```cpp
class Vector {
public:
    double x, y;

    Vector(double x = 0, double y = 0) : x(x), y(y) {}

    // Arithmetic
    Vector operator+(const Vector& o) const { return {x + o.x, y + o.y}; }
    Vector operator-(const Vector& o) const { return {x - o.x, y - o.y}; }
    Vector operator*(double s) const { return {x * s, y * s}; }
    Vector operator/(double s) const { return {x / s, y / s}; }
    Vector operator-() const { return {-x, -y}; }  // unary negation

    // Compound assignment
    Vector& operator+=(const Vector& o) { x += o.x; y += o.y; return *this; }
    Vector& operator-=(const Vector& o) { x -= o.x; y -= o.y; return *this; }

    // Comparison
    bool operator==(const Vector& o) const { return x == o.x && y == o.y; }
    bool operator!=(const Vector& o) const { return !(*this == o); }

    // Three-way comparison (C++20) — generates all comparison operators
    auto operator<=>(const Vector&) const = default;

    // Subscript
    double& operator[](int i) { return i == 0 ? x : y; }
    const double& operator[](int i) const { return i == 0 ? x : y; }

    // Function call
    double operator()(double t) const { return x * t + y * (1 - t); }

    // Stream output
    friend std::ostream& operator<<(std::ostream& os, const Vector& v) {
        return os << "(" << v.x << ", " << v.y << ")";
    }

    // Stream input
    friend std::istream& operator>>(std::istream& is, Vector& v) {
        return is >> v.x >> v.y;
    }
};

// Free-function operators (for symmetric conversions)
Vector operator*(double s, const Vector& v) { return v * s; }
```

### Spaceship Operator and Defaulted Comparisons (C++20)

```cpp
struct Person {
    std::string name;
    int age;

    // Default all 6 comparison operators
    auto operator<=>(const Person&) const = default;

    // Custom comparison (only need <=>)
    auto operator<=>(const Person& o) const {
        if (auto cmp = name <=> o.name; cmp != 0) return cmp;
        return age <=> o.age;
    }
    // == and != are NOT automatically generated from custom <=>
    // Need to also define == or use:
    bool operator==(const Person& o) const = default;
};

// Mixed-type comparison
struct IntWrapper {
    int value;
    auto operator<=>(const IntWrapper&) const = default;
    auto operator<=>(int other) const { return value <=> other; }
    bool operator==(int other) const { return value == other; }
};
```

### Overloadable vs Non-Overloadable Operators

```
Overloadable:  + - * / % ^ & | ~ ! = < > += -= *= /= %=
               ^= &= |= << >> >>= <<= == != <= >= <=>
               && || ++ -- , ->* -> ( ) [ ] new delete
               ""_suffix (user-defined literals)

NOT overloadable: :: . .* ?: sizeof alignof typeid
```
