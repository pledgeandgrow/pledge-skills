# Strings

## std::string

```cpp
#include <string>

// Construction
std::string s1;                          // empty
std::string s2("hello");                 // from C-string
std::string s3("hello", 3);              // "hel" (first 3 chars)
std::string s4(5, 'a');                  // "aaaaa"
std::string s5(s2);                      // copy
std::string s6(s2, 1, 3);               // "ell" (substring from pos 1, len 3)
std::string s7({'a', 'b', 'c'});         // "abc" (initializer list)
std::string s8 = "hello";               // copy initialization
std::string s9 = "hello"s;              // UDL (using namespace std::string_literals)

// Capacity
s1.size(); s1.length();                  // number of chars
s1.empty();
s1.capacity();
s1.reserve(100);
s1.resize(10);                           // resize, fill with '\0'
s1.resize(10, 'x');                      // resize, fill with 'x'
s1.shrink_to_fit();
s1.max_size();

// Access
s1[0];                                   // char at index (no bounds check)
s1.at(0);                                // char at index (throws on OOB)
s1.front(); s1.back();
s1.data();                               // C-string (null-terminated since C++11)
s1.c_str();                              // const C-string (null-terminated)

// Iterators
s1.begin(); s1.end();
s1.rbegin(); s1.rend();

// Modifiers
s1 = "hello";
s1.assign("world");
s1.assign(5, 'x');                       // "xxxxx"
s1.assign("hello", 3);                   // "hel"

s1.push_back('!');
s1.append(" world");
s1 += " world";
s1 += '!';

s1.insert(0, ">>");                      // insert at position
s1.insert(s1.end(), 3, '!');
s1.insert(0, "hello", 2);               // insert first 2 chars of "hello"

s1.erase(0, 2);                          // erase 2 chars from pos 0
s1.erase(s1.begin());                    // erase first char
s1.erase(s1.begin(), s1.begin() + 3);    // erase range

s1.replace(0, 2, "XX");                  // replace 2 chars at pos 0 with "XX"
s1.replace(pos, len, "new");

s1.clear();
s1.pop_back();                           // remove last char (C++11)

// Substring
s1.substr(0, 3);                         // first 3 chars
s1.substr(2);                            // from pos 2 to end

// Find
s1.find("lo");                           // position of "lo" (npos if not found)
s1.find('l');
s1.find("lo", 3);                        // search from position 3
s1.rfind("l");                           // search from end
s1.find_first_of("aeiou");              // first vowel
s1.find_last_of("aeiou");
s1.find_first_not_of("aeiou");
s1.find_last_not_of("aeiou");

// Check if found
if (s1.find("lo") != std::string::npos) { /* found */ }

// Compare
s1.compare("hello");                     // <0, 0, >0
s1.compare(0, 3, "hel");                 // compare substring
s1 == "hello";                           // true/false
s1 < "world";                            // lexicographical
s1 <=> "hello";                          // C++20 three-way comparison

// Conversion
std::to_string(42);                      // "42"
std::to_string(3.14);                    // "3.140000"
std::to_wstring(42);                     // L"42"
std::stoi("42");                         // 42 (int)
std::stol("1234567890");                 // long
std::stoll("12345678901234");            // long long
std::stoul("42");                        // unsigned long
std::stoull("42");                       // unsigned long long
std::stof("3.14");                       // float
std::stod("3.14");                       // double
std::stold("3.14");                      // long double

// With position
std::string str = "42abc";
size_t pos;
int n = std::stoi(str, &pos);            // n=42, pos=2
int n2 = std::stoi("  42  ", &pos);      // skips whitespace

// With base
std::stoi("ff", nullptr, 16);            // 255 (hex)
std::stoi("777", nullptr, 8);            // 511 (octal)
std::stoi("1010", nullptr, 2);           // 10 (binary)
```

## std::string_view (C++17)

```cpp
#include <string_view>

// Non-owning view of string data — lightweight, fast
std::string_view sv1 = "hello";          // from C-string
std::string_view sv2 = std::string("hello");  // from string (careful with lifetime!)
std::string_view sv3("hello world", 5);  // "hello" (first 5 chars)
std::string_view sv4 = sv1;              // copy (cheap)

// Same interface as string (read-only)
sv1.size(); sv1.length();
sv1.empty();
sv1[0]; sv1.at(0);
sv1.front(); sv1.back();
sv1.data();
sv1.begin(); sv1.end();

// Substring (returns string_view, no copy)
sv1.substr(0, 3);                        // "hel" (view, no allocation)
sv1.remove_prefix(2);                    // "llo" (modifies in place)
sv1.remove_suffix(2);                    // "l" (modifies in place)

// Find
sv1.find("lo");
sv1.rfind("l");
sv1.find_first_of("aeiou");
sv1.find_last_of("aeiou");

// Compare
sv1.compare("hello");
sv1 == "hello";                          // true
sv1 <=> "hello";                         // C++20

// Conversion to string
std::string s(sv1);                      // explicit conversion (copy)

// Function parameter — use string_view for read-only string params
void print(std::string_view s) {         // accepts string, C-string, string_view
    std::cout << s;
}
print("hello");                          // C-string
print(std::string("hello"));             // std::string
print(std::string_view("hello", 3));     // string_view

// WARNING: string_view doesn't own data — beware dangling views
std::string_view badView() {
    std::string temp = "hello";
    return temp;                         // UB: temp destroyed, view dangles
}
```

## C-String Functions

```cpp
#include <cstring>

const char* s = "hello";
size_t len = std::strlen(s);             // 5

// Copy
char dst[10];
std::strcpy(dst, s);                     // copy including '\0'
std::strncpy(dst, s, 5);                 // copy at most 5 chars (may not null-terminate)

// Concatenate
std::strcat(dst, " world");
std::strncat(dst, " world", 5);

// Compare
std::strcmp(s, "hello");                 // 0 (equal)
std::strncmp(s, "hel", 3);               // 0 (first 3 equal)
std::strcasecmp(s, "HELLO");             // 0 (case-insensitive, POSIX)

// Search
std::strchr(s, 'l');                     // pointer to first 'l'
std::strrchr(s, 'l');                     // pointer to last 'l'
std::strstr(s, "ell");                   // pointer to "ell"
std::strpbrk(s, "lo");                   // first char in "lo"

// Tokenize (thread-unsafe, avoid)
char buf[] = "a,b,c,d";
char* token = std::strtok(buf, ",");
while (token) {
    std::cout << token << ' ';
    token = std::strtok(nullptr, ",");
}

// Memory operations
std::memcpy(dst, src, n);                // copy n bytes (non-overlapping)
std::memmove(dst, src, n);               // copy n bytes (handles overlapping)
std::memset(dst, 0, n);                  // set n bytes to value
std::memcmp(a, b, n);                    // compare n bytes
```

## Character Classification

```cpp
#include <cctype>

// Classification (returns int, non-zero = true)
std::isalpha('a');                       // true
std::isdigit('5');                       // true
std::isalnum('a');                       // true (alpha or digit)
std::isspace(' ');                       // true
std::isupper('A');                       // true
std::islower('a');                       // true
std::ispunct('.');                       // true
std::isprint('a');                       // true (printable)
std::isgraph('a');                       // true (printable, non-space)
std::iscntrl('\n');                      // true (control char)
std::isxdigit('F');                      // true (hex digit)
std::isblank(' ');                       // true (space or tab)

// Conversion
std::toupper('a');                       // 'A'
std::tolower('A');                       // 'a'

// C++ locale-aware versions
#include <locale>
std::locale loc;
std::isalpha('a', loc);
std::toupper('a', loc);
std::tolower('A', loc);

// Range-based (C++20 ranges)
std::string s = "Hello";
std::ranges::transform(s, s.begin(), [](unsigned char c) { return std::tolower(c); });
```

## Formatting (C++20 `std::format`, C++23 `std::print`)

```cpp
#include <format>   // C++20
#include <print>    // C++23

// std::format — Python-style formatting
std::string s = std::format("Hello, {}!", "World");
std::string s2 = std::format("{}, {}!", "Hello", "World");
std::string s3 = std::format("{1}, {0}!", "World", "Hello");

// Format specifiers
std::format("{:d}", 42);                 // "42" (decimal)
std::format("{:x}", 255);                // "ff" (hex lowercase)
std::format("{:X}", 255);                // "FF" (hex uppercase)
std::format("{:o}", 8);                  // "10" (octal)
std::format("{:b}", 10);                 // "1010" (binary)
std::format("{:f}", 3.14);               // "3.140000" (fixed)
std::format("{:e}", 3.14);               // "3.140000e+00" (scientific)
std::format("{:g}", 3.14);               // "3.14" (general)
std::format("{:s}", "hello");            // "hello" (string)
std::format("{:c}", 65);                 // "A" (char)

// Width and fill
std::format("{:10}", 42);                // "        42" (right-aligned, width 10)
std::format("{:<10}", 42);               // "42        " (left-aligned)
std::format("{:^10}", 42);               // "    42    " (centered)
std::format("{:0>10}", 42);              // "0000000042" (zero-fill, right)
std::format("{:*^10}", 42);              // "****42****" (star-fill, center)

// Precision
std::format("{:.2f}", 3.14159);          // "3.14"
std::format("{:.5}", 3.14159);           // "3.1416" (general, 5 sig digits)
std::format("{:10.2f}", 3.14159);        // "      3.14"

// Sign
std::format("{:+d}", 42);                // "+42" (always show sign)
std::format("{: d}", 42);                // " 42" (space for positive)
std::format("{:-d}", 42);                // "42" (default, no sign for positive)

// Alternate form
std::format("{:#x}", 255);               // "0xff" (hex with 0x)
std::format("{:#o}", 8);                 // "010" (octal with 0)
std::format("{:#b}", 10);                // "0b1010" (binary with 0b)

// Custom formatter
struct Point { int x, y; };

template<>
struct std::formatter<Point> {
    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }
    auto format(const Point& p, std::format_context& ctx) const {
        return std::format_to(ctx.out(), "({}, {})", p.x, p.y);
    }
};

std::format("{}", Point{10, 20});        // "(10, 20)"

// std::print / std::println (C++23)
std::print("Hello, {}!\n", "World");
std::println("Hello, {}!", "World");     // adds newline
std::println("{:.2f}", 3.14159);         // "3.14\n"

// Print to file
std::print(std::cerr, "Error: {}\n", msg);
std::println(std::cout, "Value: {}", x);

// format_to — output to iterator
std::string buf;
std::format_to(std::back_inserter(buf), "{} + {} = {}", 1, 2, 3);

// format_to_n — limited output
std::format_to_n(std::back_inserter(buf), 10, "{}", 12345);

// vformat — runtime format string
std::string fmt = "{}, {}!";
std::string s4 = std::vformat(fmt, std::make_format_args("Hello", "World"));
```

## Wide Strings and Character Sets

```cpp
#include <string>
#include <codecvt>  // deprecated C++17, removed C++26

// Wide string
std::wstring ws = L"hello";
std::u16string u16s = u"hello";
std::u32string u32s = U"hello";
std::u8string u8s = u8"hello";  // C++20

// UTF-8 string (C++20)
std::u8string utf8 = u8"Hello, 世界";
std::string_view sv = u8"hello";  // char8_t (C++20)

// Conversions (use ICU or platform APIs for production)
// C++26: std::text_encoding, std::codecvt alternatives
// For now, use third-party libraries like ICU or utfcpp
```
