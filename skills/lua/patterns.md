# Patterns

Patterns in Lua are described by regular strings, interpreted by the pattern-matching functions: `string.find`, `string.gmatch`, `string.gsub`, and `string.match`.

Lua patterns are **not** full regular expressions — they are a simpler, lightweight pattern matching system.

---

## Character Classes

| Class | Matches |
|-------|---------|
| `x` (non-magic char) | The character `x` itself |
| `.` | Any character |
| `%a` | All letters |
| `%c` | All control characters |
| `%d` | All digits |
| `%g` | All printable characters except space |
| `%l` | All lowercase letters |
| `%p` | All punctuation characters |
| `%s` | All space characters |
| `%u` | All uppercase letters |
| `%w` | All alphanumeric characters |
| `%x` | All hexadecimal digits |
| `%x` (non-alphanumeric) | The character `x` (escape magic characters) |
| `[set]` | Union of characters in `set` |
| `[^set]` | Complement of `set` |

For all single-letter classes, the **uppercase** version represents the complement (e.g., `%S` = all non-space characters).

Magic characters: `^ $ ( ) % . [ ] * + - ?`

```lua
print(string.match("hello123", "%d+"))    --> "123"
print(string.match("hello", "^%a+$"))     --> "hello"
print(string.gsub("hello", "%a", "*"))    --> "*****  5
print(string.match("  test  ", "^%s*(.-)%s*$"))  --> "test"
```

### Character Sets

```lua
[%w_]   -- alphanumeric plus underscore
[0-7]   -- octal digits
[0-7%l%-]  -- octal digits, lowercase letters, and hyphen
[^%s]   -- any non-space character
```

- Closing bracket `]` as first character in set
- Hyphen `-` as first or last character in set
- Ranges and classes interaction is not defined (e.g., `[%a-z]` has no meaning)

---

## Pattern Items

| Item | Matches |
|------|---------|
| single class | Any single character in the class |
| class `*` | Zero or more characters (longest match) |
| class `+` | One or more characters (longest match) |
| class `-` | Zero or more characters (shortest match) |
| class `?` | Zero or one occurrence |
| `%n` (n: 1–9) | Substring equal to n-th captured string |
| `%bxy` | Balanced match between `x` and `y` |
| `%f[set]` | Frontier pattern: empty string at boundary |

### `*` vs `-` (greedy vs lazy)

```lua
-- Greedy: matches as much as possible
print(string.match("<!-- comment --> more", "<!--.*-->"))  --> "<!-- comment -->"

-- Lazy: matches as little as possible
print(string.match("<!-- comment --> more", "<!--.- -->"))  --> "<!-- comment -->"
```

### Balanced Match `%bxy`

Matches strings that start with `x`, end with `y`, with balanced `x`/`y` pairs:

```lua
print(string.match("(a(b)c)", "%b()"))  --> "(a(b)c)"
print(string.match("[a[b[c]]]", "%b[]")) --> "[a[b[c]]]"
```

### Frontier Pattern `%f[set]`

Matches an empty string at a position where the next character is in `set` and the previous character is not:

```lua
-- Find word boundaries
for word in string.gmatch("hello world", "%f[%a]%w+") do
  print(word)  --> "hello"  "world"
end
```

---

## Pattern

A pattern is a sequence of pattern items.

- `^` at the beginning anchors the match at the start of the subject
- `$` at the end anchors the match at the end of the subject
- At other positions, `^` and `$` are literal characters

```lua
print(string.match("hello", "^h"))    --> "h" (anchored at start)
print(string.match("hello", "o$"))    --> "o" (anchored at end)
print(string.match("hello", "^h.*o$")) --> "hello" (full match)
```

---

## Captures

Sub-patterns enclosed in parentheses are **captures**. When a match succeeds, captured substrings are stored for future use.

Captures are numbered by their opening parenthesis (left to right):

```lua
local date = "2025-07-20"
local y, m, d = string.match(date, "(%d+)-(%d+)-(%d+)")
print(y, m, d)  --> 2025  07  20
```

### Position Capture `()`

The empty capture `()` captures the current position in the string (a number):

```lua
print(string.match("flaaap", "()aa()"))  --> 3  5
```

### Backreferences `%n`

`%n` in a pattern matches the n-th captured string:

```lua
-- Match repeated words
print(string.match("hello hello", "(%w+)%s+%1"))  --> "hello hello"
```

---

## Replacement Strings in `string.gsub`

The `repl` argument can be:

1. **String** — `%0` or whole match, `%1`–`%9` for captures, `%%` for literal `%`
2. **Table** — looked up with the first capture (or whole match)
3. **Function** — called with all captures (or whole match)

```lua
-- String replacement
print(string.gsub("hello", "l", "L"))         --> "heLLo  2
print(string.gsub("2025-07-20", "(%d+)", "[%1]")) --> "[2025]-[07]-[20]  3

-- Table replacement
print(string.gsub("cat dog", "%w+", {cat="meow", dog="woof"}))  --> "meow woof  2

-- Function replacement
print(string.gsub("hello", "%w", function(c) return c:upper() end))  --> "HELLO  5
```

---

## Multiple Matches

`string.gsub` and `string.gmatch` match multiple occurrences. A new match must end at least one byte after the previous match's end — the pattern engine never accepts an empty string immediately after another match. In `string.gmatch`, a caret `^` at the start of a pattern does not work as an anchor, as this would prevent the iteration.

```lua
-- gmatch iterates over all matches
for word in string.gmatch("the quick brown fox", "%w+") do
  print(word)  --> the  quick  brown  fox
end

-- Empty matches are allowed but not consecutively
string.gsub("abc", "()a*()", print)  --> 1 2  /  3 3  /  4 4
```

---

## Common Pattern Recipes

```lua
-- Trim whitespace
local function trim(s)
  return s:match("^%s*(.-)%s*$")
end

-- Split string
local function split(s, sep)
  local pattern = "([^" .. sep .. "]+)"
  local result = {}
  for part in s:gmatch(pattern) do
    table.insert(result, part)
  end
  return result
end

-- Extract key=value pairs
local function parse_kv(s)
  local t = {}
  for k, v in s:gmatch("(%w+)=(%w+)") do
    t[k] = v
  end
  return t
end

-- Validate email (simplified)
local function is_email(s)
  return s:match("^[%w%.]+@[%w%.]+%.%w+$") ~= nil
end

-- URL decode
local function url_decode(s)
  s = s:gsub("+", " ")
  s = s:gsub("%%(%x%x)", function(h) return string.char(tonumber(h, 16)) end)
  return s
end
```

---

## Format Strings for Pack and Unpack

`string.pack` and `string.unpack` use format strings for binary data:

| Format | Description |
|--------|-------------|
| `b` | signed byte |
| `B` | unsigned byte |
| `h` | signed short |
| `H` | unsigned short |
| `i[n]` | signed int (n bytes, default native size) |
| `I[n]` | unsigned int (n bytes, default native size) |
| `l` | signed long |
| `L` | unsigned long |
| `j` | lua_Integer |
| `J` | lua_Unsigned |
| `T` | size_t (native size) |
| `f` | float |
| `d` | double |
| `n` | lua_Number |
| `cn` | fixed-size string with n bytes |
| `s[n]` | string preceded by length (n bytes, default size_t) |
| `z` | zero-terminated string |
| `x` | padding byte |
| `X` / `Xop` | skip to alignment |
| `<` / `>` / `=` | little-endian / big-endian / native |
| `!` / `!n` | alignment |
| ` ` (space) | ignored |

- `[n]` means an optional integral numeral (1–16 for `!n`, `sn`, `in`, `In`)
- Default format starts as `!1=` (no alignment, native endianness)
- All integral options check overflows
- Padding is zero-filled by `string.pack`, ignored by `string.unpack`
- `c` and `z` are not aligned; `s` follows the alignment of its length prefix

```lua
local s = string.pack("i4i4", 100, 200)
local a, b = string.unpack("i4i4", s)
print(a, b)  --> 100  200
```
