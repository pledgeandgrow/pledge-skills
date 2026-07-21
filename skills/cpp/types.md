# Types

## Fundamental Types

### Integer Types

```cpp
// Signed integers
signed char       c = -1;    // at least 8 bits, typically 8
short int         s = -1;    // at least 16 bits
int               i = -1;    // at least 16 bits, typically 32
long int          l = -1L;   // at least 32 bits
long long int    ll = -1LL;  // at least 64 bits

// Unsigned integers
unsigned char      uc = 255;     // 0 to 255
unsigned short     us = 65535;   // 0 to 65535
unsigned int       ui = 0;       // 0 to 4294967295 (32-bit)
unsigned long      ul = 0UL;     // 0 to 4294967295+ (32/64-bit)
unsigned long long ull = 0ULL;   // 0 to 18446744073709551615 (64-bit)

// Shorthand
short       s2 = 0;   // same as short int
long        l2 = 0L;  // same as long int
long long  ll2 = 0LL; // same as long long int
```

### Fixed-Width Integers (`<cstdint>`)

```cpp
#include <cstdint>

int8_t      i8  = 127;          // exactly 8 bits, signed
int16_t     i16 = 32767;        // exactly 16 bits, signed
int32_t     i32 = 2147483647;   // exactly 32 bits, signed
int64_t     i64 = 9223372036854775807LL; // exactly 64 bits, signed

uint8_t     u8  = 255;          // exactly 8 bits, unsigned
uint16_t    u16 = 65535;        // exactly 16 bits, unsigned
uint32_t    u32 = 4294967295U;  // exactly 32 bits, unsigned
uint64_t    u64 = 18446744073709551615ULL; // exactly 64 bits, unsigned

// Fast types (at least N bits, fastest for platform)
int_fast32_t  fast32 = 0;
uint_fast64_t fast64 = 0;

// Least types (at least N bits, smallest possible)
int_least16_t least16 = 0;
uint_least32_t least32 = 0;

// Pointer-sized integers
intptr_t   ptr = reinterpret_cast<intptr_t>(&x);  // holds a pointer
uintptr_t  uptr = 0;                                // unsigned pointer-sized

// Maximum-width integers
intmax_t   imax = 0;   // widest signed integer
uintmax_t  umax = 0;   // widest unsigned integer
```

### Floating-Point Types

```cpp
float       f = 3.14f;      // single precision (typically 32-bit / IEEE 754)
double      d = 3.14;       // double precision (typically 64-bit / IEEE 754)
long double ld = 3.14L;     // extended precision (80-bit x87 or 128-bit)

// Scientific notation
double avogadro = 6.022e23;
double electron = 1.6e-19;

// Hexadecimal floating-point (C++17)
double hexf = 0x1.8p+1;    // 1.5 * 2^1 = 3.0

// Special values
#include <cmath>
double inf  = std::numeric_limits<double>::infinity();
double nan  = std::numeric_limits<double>::quiet_NaN();
double denorm = std::numeric_limits<double>::denorm_min();

// Check special values
std::isinf(x);
std::isnan(x);
std::isnormal(x);
std::isfinite(x);
```

### Boolean and Character Types

```cpp
bool        b = true;       // true or false, typically 1 byte
char        c = 'A';        // character (1 byte), may be signed or unsigned
signed char sc = -1;        // explicitly signed char
unsigned char uc = 255;     // explicitly unsigned char

// Extended character types (C++11)
wchar_t     wc = L'A';      // wide character (2 or 4 bytes, platform-dependent)
char8_t     c8 = u8'A';     // UTF-8 character (C++20, unsigned 8-bit)
char16_t   c16 = u'A';      // UTF-16 character (16-bit)
char32_t   c32 = U'A';      // UTF-32 character (32-bit)

// Character literals
char    a = 'A';            // basic character
char    n = '\n';           // newline escape
char    t = '\t';           // tab escape
char8_t u8c = u8'A';        // UTF-8
char16_t u16c = u'\u00E9';  // UTF-16 (é)
char32_t u32c = U'\U0001F600'; // UTF-32 (😀)
wchar_t  wc2 = L'€';        // wide character
```

### `void`

```cpp
// void — absence of type
void func() { /* no return value */ }

// void* — pointer to unknown type (type-erased)
void* ptr = &x;
int* ip = static_cast<int*>(ptr);

// void as template argument
std::void_t<...>;
```

### `std::nullptr_t`

```cpp
// nullptr_t — type of nullptr (C++11)
std::nullptr_t np = nullptr;
void func(int* p) {}
void func(std::nullptr_t) {}
func(nullptr); // calls nullptr_t overload
```

## Literals

```cpp
// Integer literals
42;          // decimal
042;         // octal (leading 0) → 34 decimal
0x2A;        // hexadecimal (leading 0x) → 42 decimal
0b101010;    // binary (leading 0b, C++14) → 42 decimal

// Integer literal suffixes
42U;         // unsigned int
42L;         // long
42LL;        // long long (C++11)
42ULL;       // unsigned long long (C++11)
0xFFULL;     // unsigned long long hex

// Digit separators (C++14)
1'000'000;       // 1000000
0xFF'FF'FF'FF;   // 0xFFFFFFFF
0b1010'1010;     // 170

// Floating-point literals
3.14;        // double
3.14f;       // float
3.14L;       // long double
3e2;         // 300.0 (exponent)
3.14e-2;     // 0.0314
0x1.8p1;     // hex float (C++17): 1.5 * 2^1 = 3.0

// Character literals
'A';         // char (int value 65)
'\n';        // newline (10)
'\t';        // tab (9)
'\0';        // null character
'\x41';      // hex escape → 'A'
'\101';      // octal escape → 'A'
u8'A';       // char (C++20, UTF-8)
u'A';        // char16_t (UTF-16)
U'A';        // char32_t (UTF-32)
L'A';        // wchar_t

// String literals
"hello";         // const char[6]
L"hello";        // const wchar_t[6]
u8"hello";       // const char[6] (C++20: const char8_t[6] in C++17)
u"hello";        // const char16_t[6]
U"hello";        // const char32_t[6]

// Raw string literals (C++11)
R"(hello)";              // "hello" (no escape processing)
R"("quoted")";           // "\"quoted\"" (quotes inside)
R"(
multi
line
)";                      // multi-line string

// Raw string with custom delimiter
R"DELIM(raw "string" here)DELIM";  // delimiter: DELIM

// String literal concatenation
"hello " "world";    // "hello world" (adjacent literals)
"line 1\n"
"line 2\n";          // multi-line string

// Boolean literals
true;    // bool, value 1
false;   // bool, value 0

// Pointer literal
nullptr;  // std::nullptr_t, null pointer (C++11)

// User-defined literals (UDL)
42_km;    // calls operator""_km(42)
3.14_rad; // calls operator""_rad(3.14)
"hello"_s; // calls operator""_s("hello", 5)

// Standard library UDLs
using namespace std::string_literals;
"hello"s;    // std::string

using namespace std::chrono_literals;
1h; 30min; 15s; 100ms;  // chrono durations

using namespace std::complex_literals;
3.0 + 4.0i;  // std::complex<double>

// Literal type deduction
auto a = 42;       // int
auto b = 42U;      // unsigned int
auto c = 42.0;     // double
auto d = 42.0f;    // float
auto e = 'A';      // char
auto f = "hello";  // const char*
auto g = "hello"s; // std::string
```

## Type Inference

### `auto`

```cpp
// Basic type deduction
auto x = 42;          // int
auto y = 3.14;        // double
auto z = 'A';         // char
auto s = "hello";     // const char*
auto b = true;        // bool

// With references and cv-qualifiers
int& ref = x;
auto a1 = ref;        // int (reference dropped, cv dropped)
auto& a2 = ref;       // int& (reference preserved)
const auto& a3 = ref; // const int& (const + reference)

auto* p = &x;         // int* (pointer)
auto p2 = &x;         // int* (same)

// auto with arrays
int arr[5] = {1,2,3,4,5};
auto a4 = arr;        // int* (array decays)
auto& a5 = arr;       // int(&)[5] (reference to array)

// auto with function return
auto result = func(); // deduced from return type

// Trailing return type (C++11)
auto f(int x) -> int { return x * 2; }

// Return type deduction (C++14)
auto g(int x) { return x * 2; }  // return type deduced as int

// auto in range-for
for (auto& elem : container) { ... }
for (const auto& elem : container) { ... }

// auto in lambda parameters (C++14)
auto lambda = [](auto x, auto y) { return x + y; };

// auto in structured bindings (C++17)
auto [a, b, c] = tuple;
```

### `decltype`

```cpp
// decltype — deduce type of expression
int x = 42;
decltype(x) y = 10;       // int
decltype(x + 0.0) z = 0;  // double (result of int + double)

int& ref = x;
decltype(ref) r = x;      // int& (reference preserved)
decltype((x)) r2 = x;     // int& (parenthesized → reference)
decltype(x) v = x;        // int  (not parenthesized → value)

// decltype(auto) — preserve references and cv-qualifiers (C++14)
decltype(auto) da = x;    // int
decltype(auto) dr = (x);  // int&

// In function return
decltype(auto) f() { static int x = 42; return (x); } // returns int&

// With templates
template<typename T, typename U>
auto add(T t, U u) -> decltype(t + u) { return t + u; }
```

## Type Conversion

### Implicit Conversions

```cpp
// Numeric promotions (safe, no data loss)
int i = 42;
double d = i;     // int → double (promotion)
long l = i;       // int → long (promotion)

// Numeric conversions (may lose data)
double d2 = 3.99;
int i2 = d2;      // 3 (truncation, not rounding)
long long ll = 9223372036854775807LL;
int i3 = ll;      // undefined behavior if overflow

// Array-to-pointer decay
int arr[5] = {1,2,3,4,5};
int* p = arr;     // array decays to pointer

// Function-to-pointer decay
void func() {}
auto fp = func;   // void(*)()

// Boolean conversion
bool b1 = 42;     // true (non-zero)
bool b2 = 0;      // false
bool b3 = 3.14;   // true (non-zero)
bool b4 = nullptr; // false

// Pointer conversion
int* p = nullptr; // null pointer
void* vp = p;     // any pointer → void*
// int* pi = vp;  // error: need explicit cast
```

### Explicit Conversions (Casts)

```cpp
// static_cast — compile-time checked conversion
double d = 3.14;
int i = static_cast<int>(d);      // 3
void* vp = &i;
int* ip = static_cast<int*>(vp);  // void* → int*
char c = static_cast<char>(65);   // 'A'

// Base to derived (safe if actually is that type)
Base* b = new Derived();
Derived* d = static_cast<Derived*>(b);

// const_cast — add/remove const/volatile
const int ci = 42;
int* pi = const_cast<int*>(&ci);  // remove const (UB if modified)
const int* pci = &i;
int* pi2 = const_cast<int*>(pci);

// reinterpret_cast — bit-level reinterpretation
int x = 42;
long addr = reinterpret_cast<long>(&x); // pointer → integer
int* ptr = reinterpret_cast<int*>(addr); // integer → pointer

// Function pointer conversion
typedef void(*FuncPtr)(int);
FuncPtr fp = reinterpret_cast<FuncPtr>(0x1000); // dangerous!

// dynamic_cast — runtime checked polymorphic cast
Base* b = new Derived();
Derived* d = dynamic_cast<Derived*>(b); // OK if b is actually Derived
if (d) { /* safe to use d */ }

// Reference dynamic_cast — throws on failure
Derived& dr = dynamic_cast<Derived&>(*b); // throws std::bad_cast if not Derived

// C-style cast (avoid — tries const_cast, static_cast, reinterpret_cast in order)
int i2 = (int)d;  // don't use
```

### User-Defined Conversions

```cpp
class Distance {
    double meters;
public:
    Distance(double m) : meters(m) {}
    
    // Conversion operator
    operator double() const { return meters; }
    
    // Explicit conversion (C++11) — prevents implicit conversion
    explicit operator int() const { return static_cast<int>(meters); }
};

Distance d(5.5);
double m = d;        // implicit: calls operator double()
int i = d;           // error: explicit
int i2 = static_cast<int>(d); // OK: explicit cast

// if (d) ... // error: no implicit bool conversion
// if (static_cast<bool>(d)) ... // OK
```

## Numeric Limits

```cpp
#include <limits>

// std::numeric_limits — type-safe limits
std::numeric_limits<int>::max();         // 2147483647
std::numeric_limits<int>::min();         // -2147483648
std::numeric_limits<int>::lowest();      // -2147483648
std::numeric_limits<unsigned>::max();    // 4294967295
std::numeric_limits<double>::max();      // 1.79769e+308
std::numeric_limits<double>::min();      // 2.22507e-308 (smallest positive)
std::numeric_limits<double>::lowest();   // -1.79769e+308
std::numeric_limits<double>::epsilon();  // 2.22045e-16
std::numeric_limits<double>::infinity(); // inf
std::numeric_limits<double>::quiet_NaN(); // nan
std::numeric_limits<double>::digits10;   // 15 (decimal digits of precision)
std::numeric_limits<double>::is_integer; // false
std::numeric_limits<double>::is_signed;  // true
std::numeric_limits<double>::has_infinity; // true

// C-style limits (deprecated)
#include <climits>
INT_MAX, INT_MIN, UINT_MAX, LONG_MAX, LLONG_MAX;
#include <cfloat>
FLT_MAX, DBL_MAX, DBL_EPSILON;
```

## Type Aliases

```cpp
// typedef (C-style)
typedef unsigned long ulong;
typedef int (*FuncPtr)(int, int);

// using (C++11, preferred)
using ulong = unsigned long;
using FuncPtr = int(*)(int, int);
using StringList = std::vector<std::string>;

// Template alias (C++11)
template<typename T>
using Vec = std::vector<T>;

Vec<int> v;  // std::vector<int>
Vec<std::string> vs; // std::vector<std::string>

// Alias with allocator
template<typename T>
using VecAlloc = std::vector<T, std::allocator<T>>;
```

## RTTI (Run-Time Type Information)

```cpp
#include <typeinfo>

// typeid — get type_info for an expression
// For polymorphic types: returns dynamic type (actual type at runtime)
// For non-polymorphic types: returns static type (compile-time type)

struct Base { virtual ~Base() = default; };
struct Derived : Base { void foo() {} };

Base* b = new Derived;

// type_info — non-copyable, returned by typeid
const std::type_info& ti = typeid(*b);
ti.name();       // mangled name (implementation-defined, e.g., "7Derived")
ti.hash_code();  // hash value (same type → same hash within program)
ti.before(typeid(Derived));  // ordering (for sorting, not intuitive)

// Type comparison
if (typeid(*b) == typeid(Derived)) {
    std::cout << "b is actually a Derived\n";
}

// Compare with type_info
bool sameType = (typeid(int) == typeid(42));  // true

// type_index — wrapper for type_info usable as key in containers (C++11)
#include <typeindex>
std::unordered_map<std::type_index, std::string> typeNames;
typeNames[std::type_index(typeid(int))] = "int";
typeNames[std::type_index(typeid(double))] = "double";
typeNames[std::type_index(typeid(std::string))] = "string";

// Demangling (GCC/Clang)
#include <cxxabi.h>
int status;
const char* demangled = abi::__cxa_demangle(typeid(*b).name(), nullptr, nullptr, &status);
if (status == 0) {
    std::cout << demangled;  // "Derived"
    free(demangled);
}

// RTTI requires polymorphic type (at least one virtual function)
struct NonPoly { int x; };
NonPoly np;
// typeid(np) gives static type (NonPoly), not dynamic
// dynamic_cast on NonPoly* is compile error

// Disabling RTTI: -fno-rtti (GCC/Clang), /GR- (MSVC)
// typeid still works but only for static types
```

## Usual Arithmetic Conversions

```cpp
// When binary operators are applied to operands of different types,
// implicit conversions bring them to a common type.

// Rules (in order of priority):
// 1. If either is long double, both → long double
// 2. If either is double, both → double
// 3. If either is float, both → float
// 4. Integer promotions (see below)
// 5. If both are same type after promotion, done
// 6. If both are signed or both unsigned: lesser → greater
// 7. If unsigned is >= rank of signed: signed → unsigned
// 8. If signed can represent all unsigned values: unsigned → signed
// 9. Otherwise: both → unsigned version of signed type

// Integer promotions (small types → int):
// char, signed char, unsigned char, char8_t, char16_t → int (or unsigned int)
// char32_t → unsigned int (or larger)
// short, unsigned short → int (or unsigned int)

// Examples:
int i = 1;
double d = 2.0;
auto r1 = i + d;     // double (rule 2: int → double)

float f = 1.0f;
auto r2 = f + d;     // double (rule 2: float → double)

unsigned u = 10;
long l = 20;
auto r3 = u + l;     // long or unsigned long (depends on sizes)

int si = -1;
unsigned ui = 1;
auto r4 = si + ui;   // unsigned int! (-1 → huge number, classic bug)
// r4 == 4294967295 on 32-bit int — classic signed/unsigned bug

// Avoiding the signed/unsigned bug:
auto r5 = static_cast<long>(si) + static_cast<long>(ui);  // 0 (long)

// Comparison pitfall
std::vector<int> v;
for (int i = 0; i < v.size(); ++i) {  // warning: signed/unsigned mismatch
    // i is int, v.size() is size_t (unsigned)
    // if i < 0, comparison may be wrong
}
// Fix: use size_t
for (size_t i = 0; i < v.size(); ++i) { }
// Or: use range-for
for (auto& elem : v) { }
// Or: use std::ssize (C++20)
for (int i = 0; i < std::ssize(v); ++i) { }
```
