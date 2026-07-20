# Regular Expressions

## std::regex (C++11)

```cpp
#include <regex>

// Regex types
std::regex        re;   // default (ECMAScript)
std::wregex       wre;  // wide char

// Construction
std::regex re1("pattern");
std::regex re2("pattern", std::regex_constants::ECMAScript);
std::regex re3("pattern", std::regex_constants::ECMAScript | std::regex_constants::icase);
std::regex re4("pattern", std::regex_constants::extended);  // POSIX extended
std::regex re5("pattern", std::regex_constants::basic);     // POSIX basic
std::regex re6("pattern", std::regex_constants::awk);
std::regex re7("pattern", std::regex_constants::grep);
std::regex re8("pattern", std::regex_constants::egrep);

// Syntax options (bitmask, can combine with |)
// std::regex_constants::ECMAScript — default, JavaScript-like
// std::regex_constants::basic      — POSIX basic (BRE)
// std::regex_constants::extended   — POSIX extended (ERE)
// std::regex_constants::awk        — awk regex
// std::regex_constants::grep       — grep regex
// std::regex_constants::egrep      — egrep regex
// std::regex_constants::icase      — case-insensitive
// std::regex_constants::nosubs     — no sub-expression captures
// std::regex_constants::optimize   — faster matching, slower construction
// std::regex_constants::multiline  — ^ $ match line boundaries (C++17)
```

## ECMAScript Syntax (default)

```
// Characters
.        — any character except newline
\        — escape next character
\d       — digit [0-9]
\D       — non-digit
\w       — word character [a-zA-Z0-9_]
\W       — non-word character
\s       — whitespace
\S       — non-whitespace
\t       — tab
\n       — newline
\r       — carriage return
\f       — form feed
\v       — vertical tab
\0       — null
\xHH     — hex character
\uHHHH   — unicode character

// Character classes
[abc]    — any of a, b, c
[^abc]   — not a, b, c
[a-z]    — range a to z
[a-zA-Z] — range a to z and A to Z

// Quantifiers
*        — zero or more (greedy)
+        — one or more (greedy)
?        — zero or one (greedy)
{n}      — exactly n
{n,}     — at least n
{n,m}    — between n and m
*?       — zero or more (lazy)
+?       — one or more (lazy)
??       — zero or one (lazy)
{n,m}?   — between n and m (lazy)
*+       — zero or more (possessive, C++17)
++       — one or more (possessive, C++17)

// Anchors
^        — start of string (or line with multiline)
$        — end of string (or line with multiline)
\b       — word boundary
\B       — non-word boundary

// Groups
(...)        — capturing group
(?:...)      — non-capturing group
(?=...)      — lookahead (zero-width)
(?!...)      — negative lookahead
(?<=...)     — lookbehind (zero-width)
(?<!...)     — negative lookbehind
(?<name>...) — named capturing group (C++?)
\1, \2, ...  — backreference
\k<name>     — named backreference

// Alternation
|        — alternation (OR)

// Escape special chars: \ ^ $ . | ? * + ( ) [ ] { }
```

## regex_match — match entire string

```cpp
std::string s = "2024-01-15";
std::regex re("(\\d{4})-(\\d{2})-(\\d{2})");

// Simple match
bool match = std::regex_match(s, re);  // true

// Match with captures
std::smatch matches;
if (std::regex_match(s, matches, re)) {
    matches[0];   // "2024-01-15" (full match)
    matches[1];   // "2024" (first capture group)
    matches[2];   // "01" (second capture group)
    matches[3];   // "15" (third capture group)
    matches.size();  // 4 (full + 3 groups)
}

// Match with string
std::string text = "hello";
std::regex pattern("h.*o");
bool m = std::regex_match(text, pattern);  // true

// Match with C-string
bool m2 = std::regex_match("hello", pattern);

// Match result details
std::smatch m3;
std::regex_match(s, m3, re);
m3[0].str();    // "2024-01-15"
m3[1].str();    // "2024"
m3[2].str();    // "01"
m3[3].str();    // "15"
m3.prefix();    // "" (before match)
m3.suffix();    // "" (after match)
m3.length(0);   // 10 (length of full match)
m3.position(0); // 0 (position of full match)
```

## regex_search — search within string

```cpp
std::string s = "The date is 2024-01-15 and time is 10:30";
std::regex re("(\\d{4})-(\\d{2})-(\\d{2})");

std::smatch matches;
if (std::regex_search(s, matches, re)) {
    matches[0];   // "2024-01-15"
    matches[1];   // "2024"
    matches.prefix();  // "The date is "
    matches.suffix();  // " and time is 10:30"
}

// Iterate over all matches
std::string text = "a1b2c3d4";
std::regex digit_re("\\d");
auto begin = std::sregex_iterator(text.begin(), text.end(), digit_re);
auto end = std::sregex_iterator();
for (auto it = begin; it != end; ++it) {
    std::cout << it->str() << ' ';  // "1 2 3 4"
}

// Iterate with captures
std::string log = "ERROR: file not found\nINFO: started\nWARN: low memory";
std::regex log_re("(\\w+): (.+)");
for (std::sregex_iterator it(log.begin(), log.end(), log_re), end; it != end; ++it) {
    std::cout << "Level: " << (*it)[1] << ", Message: " << (*it)[2] << '\n';
}

// Token iterator — split by delimiter
std::string csv = "a,b,c,d";
std::regex comma(",");
std::sregex_token_iterator it(csv.begin(), csv.end(), comma, -1);
std::sregex_token_iterator end;
for (; it != end; ++it) {
    std::cout << it->str() << ' ';  // "a b c d"
}

// Token iterator — extract matches (not delimiters)
std::string text2 = "hello 123 world 456";
std::regex num_re("\\d+");
std::sregex_token_iterator it2(text2.begin(), text2.end(), num_re, 0);
for (; it2 != end; ++it2) {
    std::cout << it2->str() << ' ';  // "123 456"
}
```

## regex_replace — replace matches

```cpp
std::string s = "hello world";
std::regex re("world");

// Simple replace
std::string result = std::regex_replace(s, re, "C++");
// "hello C++"

// Replace all occurrences
std::string text = "a1b2c3";
std::regex digits("\\d");
std::string noDigits = std::regex_replace(text, digits, "");
// "abc"

// Replace with capture groups ($1, $2, ...)
std::string date = "2024-01-15";
std::regex date_re("(\\d{4})-(\\d{2})-(\\d{2})");
std::string reformatted = std::regex_replace(date, date_re, "$3/$2/$1");
// "15/01/2024"

// Named groups
std::regex named_re("(?<year>\\d{4})-(?<month>\\d{2})");
// Replace: std::regex_replace(s, named_re, "$month/$year");

// Format flags
std::regex_constants::format_default;    // $1, $2 for backreferences
std::regex_constants::format_sed;        // \1, \2 for backreferences
std::regex_constants::format_no_copy;    // only return matched parts
std::regex_constants::format_first_only; // only replace first match

// First only
std::string first = std::regex_replace("a1b2c3", std::regex("\\d"), "X",
    std::regex_constants::format_first_only);
// "aXb2c3"

// No copy — only matched parts
std::string matched = std::regex_replace("a1b2c3", std::regex("\\d"), "[$&]",
    std::regex_constants::format_no_copy);
// "[1][2][3]" (only matched parts, $& is full match)
```

## Match Results

```cpp
std::smatch m;

// Element access
m[0];       // full match (sub_match)
m[1];       // first capture group
m[n];       // nth capture group (0 = full match)
m.size();   // number of captures + 1
m.empty();  // true if no match
m.ready();  // true if results are available

// Sub-match operations
m[0].str();     // string
m[0].length();  // length
m[0].first;     // iterator to start
m[0].second;    // iterator to end
m[0].matched;   // true if this group matched

// Prefix and suffix
m.prefix();   // sub_match before the match
m.suffix();   // sub_match after the match

// Position and length
m.position(0);  // position of full match in string
m.length(0);    // length of full match

// Iterators
m.begin();  // iterator over sub_matches
m.end();

// Format
std::string fmt = m.format("$1 $2");  // format with captures
```

## Common Patterns

```cpp
// Email (simplified)
std::regex email_re(R"((\w+\.?\w*)@(\w+)\.(\w+))");

// URL
std::regex url_re(R"(https?://([\w.-]+)(/[\w./-]*)?)");

// IPv4
std::regex ipv4_re(R"((\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3}))");

// Phone number (US)
std::regex phone_re(R"(\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4}))");

// Date YYYY-MM-DD
std::regex date_re(R"((\d{4})-(\d{2})-(\d{2}))");

// Time HH:MM:SS
std::regex time_re(R"((\d{2}):(\d{2}):(\d{2}))");

// Hex color
std::regex hex_re(R"(#([0-9a-fA-F]{6}))");

// Identifier (variable name)
std::regex ident_re(R"([a-zA-Z_][a-zA-Z0-9_]*)");

// Integer
std::regex int_re(R"(-?\d+)");

// Floating-point
std::regex float_re(R"(-?\d+\.\d+([eE][+-]?\d+)?)");

// Use raw string literal R"(...)" to avoid double backslashes
std::regex re(R"(\d+\.\d+)");  // same as "\\d+\\.\\d+"
```

## Performance Considerations

```cpp
// Compile regex once, reuse many times
std::regex re("\\d+");  // compile once
for (const auto& s : strings) {
    if (std::regex_search(s, re)) { /* ... */ }
}

// Avoid recompiling in loops (slow)
for (const auto& s : strings) {
    std::regex re("\\d+");  // BAD: recompiles every iteration
    if (std::regex_search(s, re)) { /* ... */ }
}

// Use optimize flag for better matching performance
std::regex re("\\d+", std::regex_constants::optimize);

// For simple patterns, consider manual parsing or std::string functions
// std::regex is known to be slow — consider:
// - RE2 (Google's regex library, linear time)
// - PCRE (Perl-compatible, faster)
// - Boost.Regex (often faster than std::regex)
// - CTRE (compile-time regular expressions, C++20)
```

## CTRE (Compile-Time Regular Expressions, C++20)

```cpp
// Third-party library (not standard, but widely used)
// #include <ctre.hpp>

// Compile-time regex — no runtime overhead
// auto m = ctre::match<"pattern">(string);
// auto m = ctre::search<"pattern">(string);

// Example:
// auto m = ctre::match<"(\\d{4})-(\\d{2})-(\\d{2})">("2024-01-15");
// m.get<1>();  // "2024"
// Faster than std::regex, type-safe, compile-time checked
```
