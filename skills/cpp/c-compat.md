# C Standard Library Compatibility

## C Headers in C++

```cpp
// C++ provides C headers with 'c' prefix and no '.h' suffix
// <cstdlib> instead of <stdlib.h>
// <cstdio> instead of <stdio.h>
// Names are in std:: namespace (but usually also in global)

#include <cassert>    // assert macro
#include <cctype>     // isalpha, isdigit, etc.
#include <cerrno>     // errno
#include <cfenv>      // floating-point environment
#include <cfloat>     // FLT_MAX, DBL_MAX, etc.
#include <cinttypes>  // PRId64, etc.
#include <climits>    // INT_MAX, etc.
#include <clocale>    // setlocale, lconv
#include <cmath>      // sin, cos, sqrt, etc.
#include <csetjmp>    // setjmp, longjmp
#include <csignal>    // signal, raise
#include <cstdarg>    // va_list, va_start, va_arg, va_end
#include <cstddef>    // size_t, ptrdiff_t, NULL, offsetof
#include <cstdint>    // int64_t, etc.
#include <cstdio>     // printf, scanf, fopen, etc.
#include <cstdlib>    // malloc, free, exit, atoi, etc.
#include <cstring>    // strcpy, strlen, memcpy, etc.
#include <ctime>      // time, clock, localtime, etc.
#include <cuchar>     // char16_t, char32_t, mbrtoc16, etc.
#include <cwchar>     // wchar_t, wprintf, wcscpy, etc.
#include <cwctype>    // iswalpha, iswdigit, etc.

// C++ also provides <stdbool.h>, <stdalign.h>, <stdatomic.h>, <stdnoreturn.h>, <threads.h>
// These are C11/C23 headers, available in C++ for compatibility
```

## C I/O (`<cstdio>`)

```cpp
#include <cstdio>

// stdout, stderr, stdin
std::printf("Hello, %s!\n", "World");
std::fprintf(stderr, "Error: %s\n", msg);
std::sprintf(buffer, "Value: %d", 42);  // unsafe, use snprintf
std::snprintf(buffer, sizeof(buffer), "Value: %d", 42);  // safe

// Format specifiers
// %d — int, %ld — long, %lld — long long
// %u — unsigned, %lu — unsigned long
// %f — double, %lf — double, %Lf — long double
// %s — string (C-string), %c — char
// %x — hex, %o — octal, %p — pointer
// %zu — size_t
// %% — literal %

// Width and precision
std::printf("%10d\n", 42);     // "        42"
std::printf("%-10d|\n", 42);   // "42        |"
std::printf("%010d\n", 42);    // "0000000042"
std::printf("%.2f\n", 3.14159); // "3.14"
std::printf("%10.2f\n", 3.14159); // "      3.14"

// Input
int x;
std::scanf("%d", &x);
std::sscanf("42 hello", "%d %s", &x, buffer);
std::fscanf(file, "%d", &x);

// File operations
FILE* f = std::fopen("file.txt", "r");  // open for reading
std::fclose(f);

// Modes: "r" read, "w" write, "a" append,
//         "rb" read binary, "wb" write binary, "ab" append binary
//         "r+" read+write, "w+" write+read, "a+" append+read

// Read
char buf[256];
std::fgets(buf, sizeof(buf), f);  // read line
int c = std::fgetc(f);             // read char
size_t n = std::fread(buf, 1, sizeof(buf), f);  // read block

// Write
std::fputs("hello\n", f);
std::fputc('A', f);
std::fwrite(data, sizeof(int), count, f);

// File positioning
std::fseek(f, 0, SEEK_SET);  // beginning
std::fseek(f, 10, SEEK_CUR);  // 10 bytes forward
std::fseek(f, -10, SEEK_END); // 10 bytes before end
long pos = std::ftell(f);
std::rewind(f);               // same as fseek(f, 0, SEEK_SET)

// Error handling
if (std::ferror(f)) { /* error */ }
if (std::feof(f)) { /* end of file */ }
std::clearerr(f);
std::perror("Error message");  // print error with errno description

// Temporary files
FILE* tmp = std::tmpfile();  // auto-deleted on close
char* name = std::tmpnam(nullptr);  // generate temp name (unsafe)

// Remove and rename
std::remove("file.txt");
std::rename("old.txt", "new.txt");

// Flush
std::fflush(f);
std::fflush(stdout);
```

## C Memory (`<cstdlib>`)

```cpp
#include <cstdlib>

// malloc / free — C-style allocation (avoid in C++, use new/delete or smart pointers)
void* p = std::malloc(100);     // allocate 100 bytes
std::free(p);                    // free

void* p2 = std::calloc(10, sizeof(int));  // allocate + zero
void* p3 = std::realloc(p2, 200);         // resize (may move)

// aligned_alloc (C++17)
void* p4 = std::aligned_alloc(64, 1024);  // 64-byte aligned, 1024 bytes
std::free(p4);

// exit / abort / atexit
std::exit(0);       // exit with code 0 (calls atexit handlers, destructors of static objects)
std::exit(EXIT_FAILURE);  // exit with error
std::_Exit(0);     // immediate exit (no cleanup) (C++11)
std::abort();      // abnormal termination (no cleanup, raises SIGABRT)
std::atexit([]() { std::cout << "cleanup\n"; });  // register exit handler
std::at_quick_exit([]() { /* ... */ });  // C++11

// quick_exit — exit without full cleanup (C++11)
std::quick_exit(0);

// getenv
const char* home = std::getenv("HOME");
if (home) { std::cout << home; }

// system — execute command
int status = std::system("ls -la");

// String to number
std::atoi("42");          // 42 (int)
std::atol("1234567890");  // long
std::atoll("12345678901234");  // long long
std::atof("3.14");        // double
std::strtod("3.14abc", &endptr);  // 3.14, endptr points to "abc"
std::strtol("42abc", &endptr, 10);  // 42, base 10
std::strtoul("ff", nullptr, 16);    // 255, base 16
std::strtoll("123", nullptr, 10);   // long long
std::strtoull("123", nullptr, 10);  // unsigned long long

// Number to string (C-style)
char buf[20];
std::sprintf(buf, "%d", 42);

// abs / labs / llabs
std::abs(-5);    // int
std::labs(-5L);  // long
std::llabs(-5LL); // long long

// div / ldiv / lldiv
std::div_t r = std::div(17, 5);  // r.quot=3, r.rem=2

// rand / srand (avoid — use <random> instead)
std::srand(std::time(nullptr));
int r2 = std::rand();
int r3 = std::rand() % 100;  // 0-99 (poor quality)

// qsort / bsearch (C-style, avoid — use std::sort, std::binary_search)
int arr[] = {5, 2, 8, 1, 9, 3};
std::qsort(arr, 6, sizeof(int), [](const void* a, const void* b) {
    return *(int*)a - *(int*)b;
});
int key = 5;
int* found = (int*)std::bsearch(&key, arr, 6, sizeof(int),
    [](const void* a, const void* b) { return *(int*)a - *(int*)b; });
```

## C String Functions (`<cstring>`)

```cpp
#include <cstring>

// Length
size_t len = std::strlen("hello");  // 5

// Copy
char dst[10];
std::strcpy(dst, "hello");    // copy (unsafe if too long)
std::strncpy(dst, "hello", 5); // copy at most 5 chars (may not null-terminate)
std::strncpy(dst, "hello", sizeof(dst) - 1);
dst[sizeof(dst) - 1] = '\0';  // ensure null-termination

// Concatenate
std::strcat(dst, " world");    // append (unsafe)
std::strncat(dst, " world", 5); // append at most 5 chars

// Compare
std::strcmp("hello", "hello");  // 0 (equal)
std::strncmp("hello", "hell", 4); // 0 (first 4 chars equal)
std::strcasecmp("HELLO", "hello"); // 0 (case-insensitive, POSIX)

// Search
std::strchr("hello", 'l');   // pointer to first 'l'
std::strrchr("hello", 'l');  // pointer to last 'l'
std::strstr("hello world", "world"); // pointer to "world"
std::strpbrk("hello", "lo"); // pointer to first 'l' or 'o'
std::strspn("hello", "hel");  // 4 (length of initial chars in set)
std::strcspn("hello", "o");   // 4 (length of initial chars NOT in set)

// Tokenize (thread-unsafe, avoid)
char buf[] = "a,b,c,d";
char* token = std::strtok(buf, ",");
while (token) {
    std::cout << token << ' ';
    token = std::strtok(nullptr, ",");
}

// Memory operations
std::memcpy(dst, src, n);     // copy n bytes (non-overlapping)
std::memmove(dst, src, n);    // copy n bytes (handles overlapping)
std::memset(dst, 0, n);       // set n bytes to value
std::memcmp(a, b, n);         // compare n bytes
std::memchr(s, 'x', n);       // find first 'x' in n bytes

// Error string
std::strerror(2);  // "No such file or directory" (POSIX)
```

## C Date/Time (`<ctime>`)

```cpp
#include <ctime>

// Current time
std::time_t now = std::time(nullptr);  // current time as time_t
std::time_t now2;
std::time(&now2);

// Clock
std::clock_t c = std::clock();  // processor time
double cpu_seconds = (double)c / CLOCKS_PER_SEC;

// Convert
std::tm* local = std::localtime(&now);  // local time (thread-unsafe)
std::tm* utc = std::gmtime(&now);       // UTC time (thread-unsafe)
// Thread-safe versions: localtime_r, gmtime_r (POSIX)

// tm structure
local->tm_year;   // years since 1900
local->tm_mon;    // months since January (0-11)
local->tm_mday;   // day of month (1-31)
local->tm_hour;   // hour (0-23)
local->tm_min;    // minute (0-59)
local->tm_sec;    // second (0-60, 60 for leap second)
local->tm_wday;   // day since Sunday (0-6)
local->tm_yday;   // day since January 1 (0-365)
local->tm_isdst;  // daylight saving flag

// Format
char buf[100];
std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", local);
// "2024-01-15 10:30:45"

// Format specifiers
// %Y — year (4 digits), %y — year (2 digits)
// %m — month (01-12), %d — day (01-31)
// %H — hour (00-23), %I — hour (01-12), %M — minute (00-59), %S — second (00-60)
// %p — AM/PM, %A — weekday name, %a — abbreviated weekday
// %B — month name, %b — abbreviated month
// %j — day of year (001-366), %w — weekday (0-6, Sunday=0)
// %U — week number (Sunday first), %W — week number (Monday first)
// %Z — timezone name, %z — timezone offset (+0100)
// %c — locale date/time, %x — locale date, %X — locale time
// %D — %m/%d/%y, %F — %Y-%m-%d, %T — %H:%M:%S, %R — %H:%M

// Parse
std::tm tm{};
std::istringstream("2024-01-15 10:30:45") >> std::get_time(&tm, "%Y-%m-%d %H:%M:%S");
std::time_t t = std::mktime(&tm);  // convert tm to time_t

// Convert time_t to string
char* s = std::ctime(&now);  // "Mon Jan 15 10:30:45 2024\n"
char* s2 = std::asctime(local);  // same format

// Diff
std::time_t t1 = std::time(nullptr);
// ... do work ...
std::time_t t2 = std::time(nullptr);
double diff = std::difftime(t2, t1);  // seconds

// timespec (C++17)
std::timespec ts;
std::timespec_get(&ts, TIME_UTC);  // high-resolution time
ts.tv_sec;   // seconds
ts.tv_nsec;  // nanoseconds
```

## C Signal Handling (`<csignal>`)

```cpp
#include <csignal>

// Signal handler
void handler(int sig) {
    std::cout << "Signal " << sig << " received\n";
}

// Register handler
std::signal(SIGINT, handler);   // Ctrl+C
std::signal(SIGTERM, handler);  // termination request
std::signal(SIGSEGV, handler);  // segmentation fault
std::signal(SIGABRT, handler);  // abort
std::signal(SIGFPE, handler);   // floating-point exception
std::signal(SIGILL, handler);   // illegal instruction

// Ignore signal
std::signal(SIGINT, SIG_IGN);  // ignore Ctrl+C

// Default handler
std::signal(SIGINT, SIG_DFL);  // restore default

// Raise signal
std::raise(SIGTERM);  // send SIGTERM to self

// Signal numbers
// SIGABRT — abnormal termination (abort)
// SIGFPE — floating-point exception (divide by zero, overflow)
// SIGILL — illegal instruction
// SIGINT — interactive attention (Ctrl+C)
// SIGSEGV — invalid memory access (segfault)
// SIGTERM — termination request

// C++ signal-safe operations in handler:
// Only async-signal-safe functions can be called
// Avoid: malloc, new, std::cout, std::printf, most stdlib functions
// Safe: write(), _exit(), signal(), std::atomic operations

// sig_atomic_t — safe integer in signal handler
volatile std::sig_atomic_t flag = 0;
void handler2(int) { flag = 1; }
// In main: while (!flag) { /* wait */ }
```

## C Assertions (`<cassert>`)

```cpp
#include <cassert>

// assert — checked in debug, removed in release (NDEBUG)
assert(x > 0);  // aborts if x <= 0 (when NDEBUG not defined)
assert(ptr != nullptr && "pointer must not be null");

// Disable assertions
// #define NDEBUG  // before including cassert, or compile with -DNDEBUG
// assert(x > 0);  // no-op

// static_assert — compile-time assertion (C++11, always checked)
static_assert(sizeof(int) == 4, "int must be 4 bytes");
static_assert(sizeof(int) == 4);  // C++17: no message required

// C++26: contracts (proposed)
// [[assert: x > 0]]
// [[pre: ptr != nullptr]]
// [[post r: r >= 0]]
```

## C Error Handling (`<cerrno>`)

```cpp
#include <cerrno>
#include <cstring>  // for strerror

// errno — set by C library functions on error
errno = 0;  // clear before call
FILE* f = std::fopen("nonexistent.txt", "r");
if (!f) {
    std::cout << "Error " << errno << ": " << std::strerror(errno);
    // "Error 2: No such file or directory"
}

// Common errno values
// EPERM — operation not permitted
// ENOENT — no such file or directory
// EACCES — permission denied
// EEXIST — file exists
// EINVAL — invalid argument
// ENOMEM — not enough memory
// ERANGE — result too large
// EDOM — domain error (math)
```

## C Floating-Point Environment (`<cfenv>`)

```cpp
#include <cfenv>

// Rounding mode
std::fesetround(FE_DOWNWARD);    // toward -infinity (floor)
std::fesetround(FE_UPWARD);      // toward +infinity (ceil)
std::fesetround(FE_TONEAREST);   // nearest (default)
std::fesetround(FE_TOWARDZERO);  // toward zero (trunc)

int mode = std::fegetround();

// Floating-point exceptions
std::feclearexcept(FE_ALL_EXCEPT);
// ... do computation ...
if (std::fetestexcept(FE_DIVBYZERO)) { /* division by zero occurred */ }
if (std::fetestexcept(FE_OVERFLOW)) { /* overflow occurred */ }
if (std::fetestexcept(FE_INVALID)) { /* invalid operation */ }
if (std::fetestexcept(FE_UNDERFLOW)) { /* underflow */ }
if (std::fetestexcept(FE_INEXACT)) { /* inexact result */ }

// Raise
std::feraiseexcept(FE_DIVBYZERO);
```

## C Localization (`<clocale>`)

```cpp
#include <clocale>

// Set locale
std::setlocale(LC_ALL, "");           // system default locale
std::setlocale(LC_ALL, "en_US.UTF-8");
std::setlocale(LC_NUMERIC, "de_DE");  // number formatting only
std::setlocale(LC_TIME, "fr_FR");     // time formatting only

// Locale categories
// LC_ALL — all
// LC_COLLATE — string comparison
// LC_CTYPE — character classification
// LC_MONETARY — monetary formatting
// LC_NUMERIC — number formatting
// LC_TIME — time formatting

// lconv — locale formatting info
std::lconv* lc = std::localeconv();
lc->decimal_point;     // "." or ","
lc->thousands_sep;     // "," or "." or " "
lc->currency_symbol;   // "$" or "€"
lc->int_curr_symbol;   // "USD "
```

## C Wide Characters (`<cwchar>`, `<cwctype>`)

```cpp
#include <cwchar>
#include <cwctype>

// Wide character types
wchar_t wc = L'A';
wchar_t* ws = L"hello";

// Wide string functions (parallel to <cstring>)
std::wcslen(ws);                    // length
std::wcscpy(dst, src);             // copy
std::wcscat(dst, src);             // concatenate
std::wcscmp(s1, s2);               // compare
std::wcschr(ws, L'l');             // find char
std::wcsstr(ws, L"ell");           // find substring

// Wide I/O
std::wprintf(L"Hello, %ls!\n", ws);
std::wscanf(L"%ls", buf);

// Wide character classification (<cwctype>)
std::iswalpha(L'a');   // true
std::iswdigit(L'5');   // true
std::iswspace(L' ');   // true
std::iswupper(L'A');   // true
std::iswlower(L'a');   // true
std::towupper(L'a');   // L'A'
std::towlower(L'A');   // L'a'

// Multibyte conversion
std::mbstowcs(wbuf, "hello", 10);  // multibyte to wide
std::wcstombs(buf, L"hello", 10);  // wide to multibyte
```

## C Variable Arguments (`<cstdarg>`)

```cpp
#include <cstdarg>

// C-style variadic function (type-unsafe, prefer variadic templates)
int sum(int count, ...) {
    va_list args;
    va_start(args, count);
    int total = 0;
    for (int i = 0; i < count; ++i) {
        total += va_arg(args, int);
    }
    va_end(args);
    return total;
}

sum(3, 1, 2, 3);  // 6

// va_copy (C++11)
void log_args(int count, ...) {
    va_list args;
    va_start(args, count);
    va_list copy;
    va_copy(copy, args);  // copy for second pass
    // use args
    va_end(args);
    // use copy
    va_end(copy);
}

// Prefer C++ variadic templates over cstdarg
template<typename... Args>
auto sum_cpp(Args... args) { return (args + ... + 0); }
```

## C Standard Library Headers Summary

```
<cassert>      — assert macro
<cctype>       — character classification (isalpha, tolower, etc.)
<cerrno>       — errno and error codes
<cfenv>        — floating-point environment (rounding, exceptions)
<cfloat>       — FLT_MAX, DBL_EPSILON, etc.
<cinttypes>    — PRId64, PRIu64, etc. (format specifiers for fixed-width types)
<climits>      — INT_MAX, CHAR_BIT, etc.
<clocale>      — setlocale, localeconv
<cmath>        — math functions (sin, cos, sqrt, pow, etc.)
<csetjmp>      — setjmp, longjmp (avoid in C++, use exceptions)
<csignal>      — signal, raise
<cstdarg>      — va_list, va_start, va_arg, va_end
<cstddef>      — size_t, ptrdiff_t, nullptr_t, offsetof, NULL
<cstdint>      — int8_t, int16_t, int32_t, int64_t, etc.
<cstdio>       — printf, scanf, fopen, fclose, etc.
<cstdlib>      — malloc, free, exit, atoi, rand, qsort, etc.
<cstring>      — strcpy, strlen, memcpy, memcmp, etc.
<ctime>        — time, clock, localtime, strftime, etc.
<cuchar>       — char16_t, char32_t, mbrtoc16, c16rtomb
<cwchar>       — wchar_t, wprintf, wcscpy, etc.
<cwctype>      — iswalpha, iswdigit, towupper, etc.
```

## C++ Localization (`<locale>`)

```cpp
#include <locale>

// std::locale — C++ locale (more powerful than C's setlocale)
std::locale loc;                    // default (classic "C" locale)
std::locale globalLoc("");          // system global locale
std::locale french("fr_FR.UTF-8");  // specific locale
std::locale::global(globalLoc);     // set global locale

// Classic locale (always "C")
std::locale::classic();

// Named locales
std::locale loc1("en_US.UTF-8");
std::locale loc2("de_DE.UTF-8");
std::locale loc3("ja_JP.UTF-8");

// Combine locales (facet-by-facet)
std::locale combined(std::locale("en_US.UTF-8"),
                     std::locale("de_DE.UTF-8"), std::locale::ctype);
// English locale with German character classification

// Use locale with streams
std::cout.imbue(std::locale("en_US.UTF-8"));
std::cout << 1234567.89;  // "1,234,567.89" (locale-specific formatting)

// Use with string
std::locale loc4;
bool isAlpha = std::isalpha('a', loc4);  // locale-aware character classification
char upper = std::toupper('a', loc4);

// Facets — specialized locale components
// std::ctype<char> — character classification
// std::ctype<wchar_t> — wide character classification
// std::numpunct<char> — numeric punctuation (thousands_sep, decimal_point)
// std::moneypunct<char> — monetary punctuation
// std::time_put<char> — time/date formatting
// std::collate<char> — string collation (sorting)
// std::messages<char> — message retrieval (i18n)
// std::codecvt<char, char, mbstate_t> — character conversion (deprecated C++17)

// Access facet
auto& facet = std::use_facet<std::numpunct<char>>(loc);
facet.decimal_point();    // '.' or ','
facet.thousands_sep();    // ',' or '.' or ' '
facet.grouping();         // grouping pattern

// Collate — locale-aware string comparison
auto& coll = std::use_facet<std::collate<char>>(loc);
bool before = coll.compare("apple", "apple+5", "banana", "banana+6") < 0;
std::string hash = coll.transform("hello", "hello+5");  // for sorting

// ctype — character classification
auto& ct = std::use_facet<std::ctype<char>>(loc);
ct.is('a', std::ctype_base::alpha);  // true if 'a' is alpha in this locale
ct.toupper('a');  // 'A'
ct.tolower('A');  // 'a'
const char* range = ct.is(s.begin(), s.end(), std::ctype_base::digit);

// time_put — format time
auto& tp = std::use_facet<std::time_put<char>>(loc);
std::tm t = {};
t.tm_year = 2024 - 1900; t.tm_mon = 0; t.tm_mday = 15;
std::ostringstream os;
os.imbue(loc);
std::use_facet<std::time_put<char>>(loc).put(os, os, ' ', &t, 'F');
// "2024-01-15" (locale-specific date format)

// Custom facet
class UpperCaseFacet : public std::ctype<char> {
public:
    char do_widen(char c) const override {
        return std::toupper(static_cast<unsigned char>(c));
    }
};
std::locale upperLoc(std::locale(), new UpperCaseFacet);
```
