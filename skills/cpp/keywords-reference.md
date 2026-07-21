# Keywords, Operators, and Standard Library Reference

## C++ Keywords

```cpp
// C++ keywords (reserved, cannot be used as identifiers)
alignas      constinit   for               private       throw
alignof      continue    friend            protected     true
and          co_await    goto              public        try
and_eq       co_return   if                register      typedef
asm          co_yield    inline            reinterpret   typeid
auto         compl       int              _cast          typename
bitand       concept     mutable           requires      union
bitor        const       namespace         return        unsigned
bool         constexpr   new               short         using
break        const_cast  noexcept          signed        virtual
case         decltype    not               sizeof        void
catch        default     not_eq            static        volatile
char         delete      nullptr           static_assert wchar_t
char8_t      do          operator          static_cast   while
char16_t     double      or                struct        xor
char32_t     dynamic_cast or_eq            switch        xor_eq
class        else        override           template      co_await
enum         export      private            this          co_return
explicit     extern      protected          thread_local  co_yield
false        float

// C++20 keywords
concept      consteval    requires
constinit

// C++23 keywords (contextual)
consteval

// C++26 (proposed)
reflexpr     static_reflection

// Identifiers with special meaning (not keywords, but reserved in context)
final        override    import       module

// Operator alternative tokens (can be used instead of symbols)
and          &&          and_eq       &=
or           ||          or_eq        |=
not          !           not_eq       !=
bitand       &           bitor        |
compl        ~           xor          ^
xor_eq       ^=

// Reserved for future use (C standard)
#            ##          <:           :>          <%          %>
%:           %:%:
```

## Operator Precedence (full table)

```
Precedence  Operator              Description              Associativity
1           ::                    scope resolution         left-to-right
2           a++  a--              postfix inc/dec          left-to-right
            type()  type{}        functional cast
            a()                   function call
            a[]                   subscript
            .  ->                 member access
2           ++a  --a              prefix inc/dec           right-to-left
            +a  -a                unary plus/minus
            !  ~                  logical NOT, bitwise NOT
            (type)                C-style cast
            *a                    dereference
            &a                    address-of
            sizeof                size
            co_await              await
            alignof               alignment
            noexcept              noexcept check
            new  new[]            allocation
            delete  delete[]      deallocation
3           .*  ->*               pointer-to-member         left-to-right
4           *  /  %               arithmetic                left-to-right
5           +  -                  arithmetic                left-to-right
6           <<  >>                shift                     left-to-right
7           <=>                   three-way comparison      left-to-right
8           <  <=  >  >=          comparison                left-to-right
9           ==  !=                equality                  left-to-right
10          &                     bitwise AND               left-to-right
11          ^                     bitwise XOR               left-to-right
12          |                     bitwise OR                left-to-right
13          &&                    logical AND               left-to-right
14          ||                    logical OR                left-to-right
15          =  +=  -=  *=  /=  %= assignment                right-to-left
            <<=  >>=  &=  ^=  |=
16          throw                 throw expression          right-to-left
            co_yield              yield expression
17          ?:                    ternary conditional       right-to-left
18          ,                     comma                     left-to-right
```

## Escape Sequences

```cpp
// Character escape sequences
'\n'    // newline (0x0A)
'\r'    // carriage return (0x0D)
'\t'    // horizontal tab (0x09)
'\v'    // vertical tab (0x0B)
'\f'    // form feed (0x0C)
'\a'    // alert/bell (0x07)
'\b'    // backspace (0x08)
'\0'    // null character (0x00)
'\\'    // backslash
'\''    // single quote
'\"'    // double quote
'\?'    // question mark

// Numeric escapes
'\x41'      // hex — 'A'
'\101'      // octal — 'A'
'\u0041'    // universal char name (16-bit) — 'A'
'\U00000041'// universal char name (32-bit) — 'A'

// String escape sequences (same as char, plus:)
"\x41"      // "A"
"\u00E9"    // "é"
"\U0001F600" // "😀"
```

## Standard Library Headers

### Language support

```
<cstddef>       — size_t, ptrdiff_t, nullptr_t, offsetof, NULL
<limits>        — numeric_limits
<climits>       — INT_MAX, CHAR_BIT, etc.
<cfloat>        — FLT_MAX, DBL_EPSILON, etc.
<cstdint>       — int8_t, int16_t, int32_t, int64_t, uintmax_t, etc.
<version>       — implementation version info (C++20)
<concepts>      — concepts (C++20)
<compare>       — comparison categories (C++20)
<coroutine>     — coroutine support (C++20)
<initializer_list> — initializer_list
<typeinfo>      — type_info, bad_cast, bad_typeid
<type_traits>   — type traits (C++11)
<source_location> — source_location (C++20)
<exception>     — exception, bad_exception, terminate_handler
<stdexcept>     — logic_error, runtime_error, etc.
<cassert>       — assert macro
<cerrno>        — errno
<sys/stat>      — file status (POSIX)
<cfenv>         — floating-point environment
<csetjmp>       — setjmp, longjmp (avoid in C++)
<csignal>       — signal handling
<cstdarg>       — variadic arguments (C-style)
<cstdlib>       — exit, abort, getenv, system, etc.
<ctime>         — time, clock, etc.
<bitset>        — bitset container
<utility>       — pair, move, forward, swap, etc.
<tuple>         — tuple
<memory>        — unique_ptr, shared_ptr, weak_ptr, allocator, etc.
<functional>    — function, bind, hash, reference_wrapper, etc.
<typeindex>     — type_index (C++11)
<iterator>      — iterator traits, back_inserter, etc.
<ranges>        — ranges and views (C++20)
<ratio>         — compile-time rational numbers
```

### Containers

```
<array>         — std::array (C++11)
<vector>        — std::vector
<deque>         — std::deque
<list>          — std::list
<forward_list>  — std::forward_list (C++11)
<map>           — std::map, std::multimap
<set>           — std::set, std::multiset
<unordered_map> — std::unordered_map, std::unordered_multimap (C++11)
<unordered_set> — std::unordered_set, std::unordered_multiset (C++11)
<stack>         — std::stack
<queue>         — std::queue, std::priority_queue
<span>          — std::span (C++20)
<flat_map>      — std::flat_map (C++23)
<flat_set>      — std::flat_set (C++23)
<mdspan>        — std::mdspan (C++23)
```

### Algorithms and iterators

```
<algorithm>     — sort, find, transform, etc.
<numeric>       — accumulate, reduce, gcd, lcm, etc.
<execution>     — parallel execution policies (C++17)
```

### Strings

```
<string>        — std::string, std::wstring, std::u16string, std::u32string, std::u8string
<string_view>   — std::string_view (C++17)
<cstring>       — C string functions
<cwchar>        — wide string functions
<cwctype>       — wide character classification
<cuchar>        — char16_t, char32_t conversion
<charconv>      — std::to_chars, std::from_chars (C++17)
<format>        — std::format (C++20)
<print>         — std::print, std::println (C++23)
<spanstream>    — std::spanstream, std::ispanstream, std::ospanstream (C++23)
<stdfloat>      — std::float16_t, std::float32_t, std::float64_t, std::float128_t, std::bfloat16_t (C++23)
<regex>         — std::regex (C++11)
```

### I/O

```
<iostream>      — std::cin, std::cout, std::cerr, std::clog
<istream>       — std::istream
<ostream>       — std::ostream
<fstream>       — std::ifstream, std::ofstream, std::fstream
<sstream>       — std::istringstream, std::ostringstream, std::stringstream
<syncstream>    — std::osyncstream (C++20)
<iomanip>       — setw, setprecision, etc.
<ios>           — std::ios_base
<streambuf>     — std::streambuf
<cstdio>        — C I/O (printf, scanf, fopen, etc.)
<filesystem>    — std::filesystem (C++17)
```

### Numerics

```
<cmath>         — math functions (sin, cos, sqrt, etc.)
<complex>       — std::complex
<valarray>      — std::valarray
<random>        — random number generation (C++11)
<numeric>       — accumulate, reduce, gcd, lcm, etc.
<numbers>       — math constants (C++20)
<bit>           — bit operations (C++20)
<ratio>         — compile-time rational numbers
<cinttypes>     — format specifiers for fixed-width types
```

### Time

```
<chrono>        — duration, time_point, clocks, calendar (C++11, expanded C++20)
<ctime>         — C time functions
```

### Concurrency

```
<thread>        — std::thread, std::jthread (C++20)
<mutex>         — std::mutex, std::lock_guard, std::unique_lock, etc.
<shared_mutex>  — std::shared_mutex, std::shared_lock (C++17)
<atomic>        — std::atomic, std::atomic_ref (C++20)
<condition_variable> — std::condition_variable
<future>        — std::future, std::promise, std::async, std::packaged_task
<latch>         — std::latch (C++20)
<barrier>       — std::barrier (C++20)
<semaphore>     — std::counting_semaphore, std::binary_semaphore (C++20)
<stop_token>    — std::stop_token, std::stop_source, std::stop_callback (C++20)
```

### Utilities

```
<utility>       — pair, move, forward, swap, exchange, declval, etc.
<tuple>         — tuple, make_tuple, apply, etc.
<optional>      — std::optional (C++17)
<variant>       — std::variant (C++17)
<any>           — std::any (C++17)
<bitset>        — std::bitset
<function>      — std::function
<memory>        — smart pointers, allocators
<scoped_allocator> — std::scoped_allocator_adaptor
<type_traits>   — type traits
<typeindex>     — std::type_index
<source_location> — std::source_location (C++20)
<compare>       — comparison categories (C++20)
<concepts>      — concepts (C++20)
<coroutine>     — coroutine support (C++20)
<expected>      — std::expected (C++23)
<generator>     — std::generator (C++23/26)
<charconv>      — std::to_chars, std::from_chars (C++17)
<format>        — std::format (C++20)
<print>         — std::print, std::println (C++23)
<spanstream>    — std::spanstream (C++23)
<stdfloat>      — std::float16_t, std::bfloat16_t, etc. (C++23)
<text_encoding> — std::text_encoding (C++26)
<debugging>     — std::is_debugger_present (C++26)
<linalg>        — linear algebra (C++26)
<execution>     — senders/receivers (C++26)
<hazard_pointer> — hazard pointers (C++26)
<rcu>           — RCU (C++26)
<syncstream>    — std::osyncstream (C++20)
<mdspan>        — std::mdspan (C++23)
<flat_map>      — std::flat_map, std::flat_set (C++23)
```

### Localization

```
<locale>        — std::locale, std::ctype, std::numpunct, std::collate, etc.
<clocale>       — setlocale, localeconv
<codecvt>       — deprecated C++17, removed C++26
```

### Error handling

```
<exception>     — std::exception, std::terminate, etc.
<stdexcept>     — std::runtime_error, std::logic_error, etc.
<system_error>  — std::error_code, std::system_error (C++11)
<cerrno>        — errno
<stacktrace>    — std::stacktrace, std::stacktrace_entry (C++23)
```

### C compatibility

```
<cassert>       <cctype>      <cerrno>     <cfenv>
<cfloat>        <cinttypes>   <climits>    <clocale>
<cmath>         <csetjmp>     <csignal>    <cstdarg>
<cstddef>       <cstdint>     <cstdio>     <cstdlib>
<cstring>       <ctime>       <cuchar>     <cwchar>
<cwctype>       <stdbool.h>   <stdalign.h> <stdatomic.h>
<stdbit.h>      <stdckdint.h> <stdnoreturn.h> <threads.h>
```

## Predefined Macros

```cpp
__cplusplus        // C++ standard version (e.g., 202302L for C++23)
__FILE__           // current file name
__LINE__           // current line number
__func__           // current function name (C++11)
__DATE__           // compilation date ("Jul 20 2026")
__TIME__           // compilation time ("20:01:00")
__STDC_HOSTED__    // 1 if hosted, 0 if freestanding
__STDCPP_DEFAULT_NEW_ALIGNMENT__ // default alignment for new (C++17)

// Compiler-specific
__GNUC__           // GCC
__clang__          // Clang
_MSC_VER           // MSVC
__cpp_consteval    // 201811L if consteval supported
__cpp_concepts     // 201907L if concepts supported
__cpp_coroutines   // 201902L if coroutines supported
__cpp_modules      // 201907L if modules supported
__cpp_ranges       // 201911L if ranges supported
__cpp_impl_three_way_comparison // 201907L if <=> supported

// Feature test macros (C++20)
__has_include(<header>)  // 1 if header exists
__has_cpp_attribute(attr) // 1 if attribute supported

// Check C++ standard
#if __cplusplus >= 202302L
    // C++23 or later
#elif __cplusplus >= 202002L
    // C++20
#elif __cplusplus >= 201703L
    // C++17
#elif __cplusplus >= 201402L
    // C++14
#elif __cplusplus >= 201103L
    // C++11
#endif
```

## Attributes

```cpp
[[noreturn]]        // function never returns (calls exit, throw, etc.)
[[deprecated]]      // deprecated, compiler warning
[[deprecated("use newFunc() instead")]]
[[fallthrough]]     // intentional switch fallthrough
[[nodiscard]]       // return value should not be discarded
[[nodiscard("reason")]]  // C++20
[[maybe_unused]]    // suppress unused warning
[[carries_dependency]] // optimize atomics
[[likely]]          // branch likely (C++20)
[[unlikely]]        // branch unlikely (C++20)
[[no_unique_address]] // empty member can share address (C++20)
[[assume(expr)]]    // assume expression is true (C++23)

// Usage
[[noreturn]] void fatal() { std::exit(1); }

[[deprecated("Use newAPI()")]]
void oldAPI() {}

switch (x) {
case 1:
    doA();
    [[fallthrough]];
case 2:
    doB();
    break;
}

[[nodiscard]] int compute() { return 42; }
// compute();  // warning: return value discarded

if [[likely]] (x > 0) { ... }
if (x > 0) [[likely]] { ... }

struct Empty {};
struct Widget {
    [[no_unique_address]] Empty e;  // e may share address with Widget
    int value;
};

// C++23: assume
void f(int x) {
    [[assume(x > 0)]];
    // compiler can optimize assuming x > 0
}
```

## Integer Type Ranks

```
Type              Width (typical)  Min Value           Max Value
bool              1 bit            false               true
char              8 bits           -128 / 0            127 / 255
signed char       8 bits           -128                127
unsigned char     8 bits           0                   255
char8_t           8 bits           0                   255 (C++20)
char16_t          16 bits          0                   65535
char32_t          32 bits          0                   4294967295
wchar_t           16/32 bits       implementation-defined
short             16 bits          -32768              32767
unsigned short    16 bits          0                   65535
int               16/32 bits       -32768/-2147483648  32767/2147483647
unsigned int      16/32 bits       0                   65535/4294967295
long              32/64 bits       -2147483648         2147483647
unsigned long     32/64 bits       0                   4294967295
long long         64 bits          -9223372036854775808 9223372036854775807
unsigned long long 64 bits        0                   18446744073709551615
float             32 bits         ~1.2e-38            ~3.4e38
double            64 bits         ~2.2e-308           ~1.8e308
long double       80/128 bits     ~3.4e-4932          ~1.2e4932

// Fixed-width types (C++11, <cstdint>)
int8_t            8 bits signed
uint8_t           8 bits unsigned
int16_t           16 bits signed
uint16_t          16 bits unsigned
int32_t           32 bits signed
uint32_t          32 bits unsigned
int64_t           64 bits signed
uint64_t          64 bits unsigned
intmax_t          maximum width signed
uintmax_t         maximum width unsigned
intptr_t          pointer-sized signed
uintptr_t         pointer-sized unsigned
size_t            unsigned (from <cstddef>)
ptrdiff_t         signed (from <cstddef>)
```
