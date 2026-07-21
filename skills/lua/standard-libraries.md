# Standard Libraries

Lua 5.5 includes the following standard libraries:

| Library | Description |
|---------|-------------|
| `basic` | Core functions (`print`, `type`, `error`, `pcall`, etc.) |
| `coroutine` | Coroutine manipulation |
| `modules` (`package`) | Module loading and `require` |
| `string` | String manipulation and pattern matching |
| `utf8` | UTF-8 support |
| `table` | Table manipulation |
| `math` | Mathematical functions |
| `io` | Input/output facilities |
| `os` | Operating system facilities |
| `debug` | Debug library |

## Loading Libraries

In C code:
- `luaL_openlibs(L)` — opens all standard libraries
- `luaL_openselectedlibs(L, load, preload)` — opens selected libraries only (Lua 5.5). `load` and `preload` are bitwise-OR masks of these constants:
  - `LUA_GLIBK` — basic library
  - `LUA_LOADLIBK` — package library
  - `LUA_COLIBK` — coroutine library
  - `LUA_STRLIBK` — string library
  - `LUA_UTF8LIBK` — UTF-8 library
  - `LUA_TABLIBK` — table library
  - `LUA_MATHLIBK` — math library
  - `LUA_IOLIBK` — I/O library
  - `LUA_OSLIBK` — OS library
  - `LUA_DBLIBK` — debug library

---

## Basic Functions

### `assert(v [, message])`

Raises an error if `v` is false or nil. Otherwise returns all arguments. `message` defaults to `"assertion failed!"`.

```lua
local f = assert(io.open("file.txt", "r"))
```

### `collectgarbage([opt [, arg]])`

Generic interface to the garbage collector. Options:

| Option | Description |
|--------|-------------|
| `"collect"` | Full GC cycle (default) |
| `"stop"` | Stop automatic GC |
| `"restart"` | Restart automatic GC |
| `"count"` | Memory in use (Kbytes, fractional) |
| `"step"` | Perform a GC step; optional `arg` = step size. Returns `true` if cycle/major collection finished |
| `"isrunning"` | Boolean, whether GC is running |
| `"incremental"` | Change to incremental mode, returns previous mode |
| `"generational"` | Change to generational mode, returns previous mode |
| `"param"` | Get/set GC parameters. Followed by parameter name and optional new value |

`"param"` parameters: `"minormul"`, `"majorminor"`, `"minormajor"`, `"pause"`, `"stepmul"`, `"stepsize"`. New value must be an integer in [0,100000]. Always returns the previous value. This function should not be called by a finalizer.

### `dofile([filename])`

Executes a Lua chunk from a file. Returns all values returned by the chunk. Without arguments, executes stdin.

### `error(message [, level])`

Raises an error. If `message` is a string, error position info is added at the beginning. `level=1` (default) points to where `error` was called; `level=0` adds no position info; `level=2` points to the caller of the function that called `error`.

### `_G`

Global variable holding the global environment. Not used internally by Lua.

### `getmetatable(object)`

Returns the metatable of the given object, or nil. If the metatable has a `__metatable` field, that value is returned instead.

### `ipairs(t)`

Returns three values (an iterator function, the table `t`, and `0`) so that `for i,v in ipairs(t) do body end` iterates over the pairs `(1,t[1])`, `(2,t[2])`, ..., up to the first absent index.

```lua
for i, v in ipairs({10, 20, 30}) do print(i, v) end
-- 1  10
-- 2  20
-- 3  30
```

### `load(chunk [, chunkname [, mode [, env]]])`

Loads a chunk. `chunk` can be a string or a reader function. `mode`: `"t"` (text), `"b"` (binary), `"bt"` (both, default). `env` sets the first upvalue (`_ENV`) of the loaded chunk; defaults to the global environment. Returns the compiled chunk or `fail, err`. Lua does not check consistency of binary chunks — maliciously crafted ones can crash the interpreter.

### `loadfile([filename [, mode [, env]]])`

Like `load` but gets the chunk from file `filename`, or from stdin if no filename given.

### `next(table [, index])`

Allows traversing all fields of a table. Returns the next key-value pair after `index`, or the first pair if `index` is nil.

### `pairs(t)`

If `t` has a `__pairs` metamethod, calls it with `t` as argument and returns its first four results. Otherwise, returns `next`, `t`, `nil`, `nil` — used to iterate over all key-value pairs in a table.

```lua
for k, v in pairs({a=1, b=2}) do print(k, v) end
```

### `pcall(f [, arg1, ...])`

Calls function `f` in protected mode. Returns `true, results...` on success or `false, err` on error. Errors caught by `pcall` do not call a message handler.

### `print(...)`

Prints arguments to stdout, separated by tabs, followed by a newline. Uses `tostring` for conversion.

### `rawequal(v1, v2)`

Checks equality without invoking metamethods.

### `rawget(table, index)`

Gets `table[index]` without invoking `__index`.

### `rawlen(v)`

Returns length without invoking `__len`.

### `rawset(table, index, value)`

Sets `table[index] = value` without invoking `__newindex`. Returns `table`.

### `require(modname)`

Loads and returns a module. Uses `package.searchers` to find the module. Caches loaded modules in `package.loaded`. Returns the module value plus a second result: the loader data (indicating how the module was found, e.g., the file path). If the module was already loaded, returns the cached value without a second result.

### `select(index, ...)`

If `index` is a number, returns all arguments after position `index` (negative indexes from the end, -1 = last). If `index` is `"#"`, returns the total count of extra arguments.

```lua
print(select("#", 1, 2, 3))  --> 3
print(select(2, "a", "b", "c"))  --> b  c
```

### `setmetatable(table, metatable)`

Sets the metatable of `table` (nil to remove). If the original metatable has a `__metatable` field, raises an error. Returns `table`. To change metatables of other types, use the debug library.

### `tonumber(e [, base])`

Converts `e` to a number. Without `base`: if `e` is already a number or a string convertible to one, returns it; otherwise returns `fail`. With `base` (2–36): `e` must be a string interpreted as an integer in that base. Returns `fail` if conversion fails.

### `tostring(v)`

Converts `v` to a string. Uses `__tostring` metamethod if present. If no `__tostring`, may use `__name` field in the result. For precise number formatting, use `string.format`.

### `type(v)`

Returns the type name: `"nil"`, `"boolean"`, `"number"`, `"string"`, `"function"`, `"userdata"`, `"thread"`, or `"table"`.

### `_VERSION`

A global variable holding the Lua version string (e.g., `"Lua 5.5"`).

### `warn(msg1, ...)`

Emits a warning with a message composed by concatenating all its arguments (which should be strings). Control messages start with `@`: `"@off"` stops warnings, `"@on"` restarts them. Unknown control messages are ignored.

### `xpcall(f, msgh [, arg1, ...])`

Like `pcall` but with a message handler `msgh` called on error (useful for `debug.traceback`).

---

## Coroutine Manipulation

See `coroutines.md` for full coverage.

Functions: `coroutine.create`, `coroutine.resume`, `coroutine.yield`, `coroutine.status`, `coroutine.wrap`, `coroutine.isyieldable`, `coroutine.running`, `coroutine.close`.

---

## Modules (`package`)

### `require(modname)`

1. Checks `package.loaded[modname]` — returns cached value (without loader data) if present
2. Uses `package.searchers` to find a loader for the module
3. Calls the loader with `modname` and loader data (e.g., file path)
4. Caches the result in `package.loaded[modname]` (defaults to `true` if loader returned nothing)
5. Returns the module value plus loader data as a second result

### `package.config`

A string describing compile-time configurations for packages. Five lines:
1. Directory separator (`\` on Windows, `/` elsewhere)
2. Path template separator (`;`)
3. Substitution mark in templates (`?`)
4. Executable directory replacement (`!`, Windows)
5. Mark to ignore text after it when building `luaopen_` function name (`-`)

### `package.path` / `package.cpath`

Semicolon-separated templates for finding Lua modules / C modules. `?` is replaced with the module name (with dots converted to slashes). `;;` in the environment variable is replaced by the default path. Initialized from `LUA_PATH_5_5` / `LUA_PATH` (or `LUA_CPATH_5_5` / `LUA_CPATH`), or a default path from `luaconf.h`.

### `package.loaded`

Table of already-loaded modules, indexed by module name. Stored in the C registry under `LUA_LOADED_TABLE`. This variable is only a reference to the real table; assignments to it do not change the table used by `require`.

### `package.preload`

Table of loader functions, indexed by module name. Checked first by `require`. Stored in the C registry under `LUA_PRELOAD_TABLE`.

### `package.searchers`

A sequence of searcher functions used by `require`. Each searcher receives the module name and returns a loader function plus loader data, or a string explaining why it failed:

1. **Preload searcher** — looks in `package.preload`. Returns `":preload:"` as loader data.
2. **Lua path searcher** — searches `package.path` using `package.searchpath`. Loader data is the file path.
3. **C path searcher** — searches `package.cpath`. The C function name is `"luaopen_"` concatenated with the module name (dots → underscores, hyphen suffix removed). E.g., `a.b.c-v2.1` → `luaopen_a_b_c`.
4. **All-in-one searcher** — searches for the root module's C library, then looks for the submodule's open function. E.g., requiring `a.b.c` searches for a library for `a`, then calls `luaopen_a_b_c`.

Searchers should raise no errors and have no side effects in Lua.

### `package.searchpath(name, path [, sep [, rep]])`

Searches for `name` in `path`. For each template, replaces `?` with a copy of `name` where `sep` (default `.`) is replaced by `rep` (default directory separator). Returns the first file that can be opened, or `fail` plus an error message listing all files tried.

### `package.loadlib(libname, funcname)`

Dynamically links the host program with C library `libname`. If `funcname` is `"*"`, only links the library. Otherwise, looks for function `funcname` and returns it as a C function. Low-level — bypasses the module system. Not available on ISO C platforms. Inherently insecure.

### Module Pattern (Lua 5.5)

```lua
-- mymodule.lua
local M = {}

function M.greet(name)
  return "Hello, " .. name
end

return M

-- usage
local mymod = require("mymodule")
print(mymod.greet("World"))
```

---

## String Manipulation

### Basic Functions

| Function | Description |
|----------|-------------|
| `string.len(s)` | Length of string |
| `string.upper(s)` | Uppercase |
| `string.lower(s)` | Lowercase |
| `string.reverse(s)` | Reversed string |
| `string.rep(s, n [, sep])` | Repeat `n` times with optional separator |
| `string.sub(s, i [, j])` | Substring (1-indexed, negative from end) |
| `string.byte(s [, i [, j]])` | Byte value(s) |
| `string.char(...)` | String from byte values |
| `string.format(fmt, ...)` | Formatted string (C `printf`-style) |
| `string.dump(f [, strip])` | Binary representation of function |
| `string.find(s, pattern [, init [, plain]])` | Find pattern |
| `string.match(s, pattern [, init])` | Match pattern |
| `string.gmatch(s, pattern [, init])` | Iterator over all matches |
| `string.gsub(s, pattern, repl [, n])` | Global substitution |
| `string.pack(fmt, v1, v2, ...)` | Pack values into binary string |
| `string.packsize(fmt)` | Size of packed result |
| `string.unpack(fmt, s [, pos])` | Unpack values from binary string |

### String Methods (via metatable)

Strings have a metatable set by the string library, enabling method syntax:

```lua
local s = "Hello World"
print(s:upper())       --> "HELLO WORLD"
print(s:len())         --> 11
print(s:sub(1, 5))     --> "Hello"
print(s:find("World")) --> 7  11
print(s:gsub("o", "0")) --> "Hell0 W0rld  2
```

### `string.format` Format Strings

Conversion specifiers: `%d`, `%i`, `%o`, `%u`, `%x`, `%X`, `%f`, `%g`, `%e`, `%E`, `%a`, `%A`, `%c`, `%s`, `%q`, `%p`, `%%`.

- Flags: `-`, `+`, `#`, `0`, ` ` (space)
- Width and precision limited to two digits
- `%q` — formats booleans, nil, numbers, and strings as valid Lua source code. Floats are written in hexadecimal to preserve full precision. Strings are quoted with escape sequences. Does not support modifiers.
- `%p` — formats the pointer from `lua_topointer`; gives a unique string identifier for tables, userdata, threads, strings, and functions. For other values, results in a string representing `NULL`.
- `%a`/`%A` — hexadecimal floats (may not support modifiers with C89 compilers)
- `%s` — converts non-string arguments via `tostring` rules

```lua
print(string.format("%d + %d = %d", 1, 2, 3))     --> "1 + 2 = 3"
print(string.format("%.2f", 3.14159))              --> "3.14"
print(string.format("%q", 'a "quote" inside'))     --> '"a \"quote\" inside"'
print(string.format("%x", 255))                    --> "ff"
print(string.format("%p", {}))                     --> "0x..." (pointer address)
```

See `patterns.md` for pattern matching details.

---

## UTF-8 Support

| Function | Description |
|----------|-------------|
| `utf8.char(...)` | String from code points |
| `utf8.charpattern` | Pattern `[\0-\x7F\xC2-\xFD][\x80-\xBF]*` matching exactly one UTF-8 byte sequence |
| `utf8.codepoint(s [, i [, j [, lax]]])` | Code point(s) from positions i to j (default i=1, j=i) |
| `utf8.codes(s [, lax])` | Iterator over code points (raises error on invalid sequence) |
| `utf8.len(s [, i [, j [, lax]]])` | Number of UTF-8 code points from i to j (default i=1, j=-1). Returns fail + position of first invalid byte |
| `utf8.offset(s, n [, i])` | Returns start and end byte positions of n-th code point from position i |

- `lax` parameter (when available) lifts Unicode checks, accepting values up to 0x7FFFFFFF
- `utf8.offset(s, 0, i)` returns start/end of the character containing byte i
- `utf8.offset(s, -n)` gets n-th character from end of string

```lua
local s = "héllo"
print(utf8.len(s))           --> 5
for i, c in utf8.codes(s) do
  print(i, c)                -- byte position and code point
end
print(utf8.char(0x48, 0x65, 0x6C, 0x6C, 0x6F))  --> "hello"
```

---

## Table Manipulation

| Function | Description |
|----------|-------------|
| `table.concat(list [, sep [, i [, j]]])` | Concatenate table elements into string |
| `table.create(nseq [, nrec])` | Pre-allocate table (Lua 5.5) |
| `table.insert(list, [pos,] value)` | Insert element |
| `table.move(a1, f, e, t [, a2])` | Move elements between tables. Returns destination table `a2` (default `a1`) |
| `table.pack(...)` | Pack arguments into a table with `n` field |
| `table.remove(list [, pos])` | Remove and return element at `pos` (default `#list`). `pos` can also be 0 when `#list` is 0, or `#list + 1` |
| `table.sort(list [, comp])` | Sort in place. Not stable — equal elements may change relative order |
| `table.unpack(list [, i [, j]])` | Unpack table into multiple values |

```lua
local t = {3, 1, 4, 1, 5, 9, 2, 6}
table.sort(t)
print(table.concat(t, ", "))  --> "1, 1, 2, 3, 4, 5, 6, 9"

table.insert(t, 1, 0)  -- insert 0 at position 1
table.remove(t, #t)     -- remove last element

-- Pre-allocation (Lua 5.5)
local big = table.create(1000, 500)  -- 1000 array slots, 500 hash slots
```

---

## Mathematical Functions

| Function | Description |
|----------|-------------|
| `math.abs(x)` | Absolute value |
| `math.acos(x)` / `math.asin(x)` | Inverse cosine/sine |
| `math.atan(y [, x])` | Arc tangent |
| `math.ceil(x)` | Ceiling |
| `math.cos(x)` / `math.sin(x)` / `math.tan(x)` | Trigonometric |
| `math.deg(x)` / `math.rad(x)` | Degrees/radians conversion |
| `math.exp(x)` | e^x |
| `math.floor(x)` | Floor |
| `math.fmod(x, y)` | Floating-point remainder |
| `math.frexp(x)` | Split into mantissa and exponent |
| `math.ldexp(m, e)` | m × 2^e |
| `math.log(x [, base])` | Logarithm (natural by default) |
| `math.max(x, ...)` / `math.min(x, ...)` | Maximum/minimum |
| `math.modf(x)` | Integer and fractional parts. Second result is always a float |
| `math.random([m [, n]])` | Random float [0,1), or integer in [m,n]. `math.random(n)` = `math.random(1,n)`. `math.random(0)` = all bits random. Uses xoshiro256** |
| `math.randomseed([x [, y]])` | Set random seed. Default for `y` is zero. No args = weak randomness. Returns the two seed components used |
| `math.sqrt(x)` | Square root |
| `math.tointeger(x)` | Convert to integer if possible |
| `math.type(x)` | `"integer"`, `"float"`, or fail if not a number |
| `math.ult(m, n)` | Unsigned less-than |

Constants: `math.pi`, `math.huge`, `math.maxinteger`, `math.mininteger`. `math.ceil`, `math.floor`, and `math.modf` return an integer when the result fits in the integer range, or a float otherwise.

```lua
print(math.pi)           --> 3.1415926535898
print(math.huge)         --> inf
print(math.maxinteger)   --> 9223372036854775807
print(math.type(3))      --> integer
print(math.type(3.0))    --> float
print(math.random(1, 6)) --> random integer 1–6
```

---

## Input and Output Facilities

### File Operations

| Function | Description |
|----------|-------------|
| `io.open(filename [, mode])` | Open file, returns file handle |
| `io.close([file])` | Close file |
| `io.read(...)` | Read from default input |
| `io.write(...)` | Write to default output |
| `io.lines([filename, ...])` | Iterator over lines. Returns iterator, two nil placeholders, and file handle. Closes file on loop end, error, or break |
| `io.flush()` | Flush default output |
| `io.input([file])` | Get/set default input |
| `io.output([file])` | Get/set default output |
| `io.popen(prog [, mode])` | Open pipe to process (`"r"` default or `"w"`) |
| `io.tmpfile()` | Open temporary file (auto-removed on program end) |
| `io.type(obj)` | `"file"`, `"closed file"`, or fail |

### File Open Modes

| Mode | Description |
|------|-------------|
| `"r"` | Read mode (default) |
| `"w"` | Write mode |
| `"a"` | Append mode |
| `"r+"` | Update mode, preserves data |
| `"w+"` | Update mode, erases data |
| `"a+"` | Append update mode, writing at end only |

Append `"b"` for binary mode on some systems.

### File Methods

| Method | Description |
|--------|-------------|
| `file:close()` | Close file. For `io.popen` handles, returns same values as `os.execute` |
| `file:flush()` | Flush buffer |
| `file:lines(...)` | Iterator over lines (does not close file) |
| `file:read(...)` | Read from file |
| `file:seek([whence [, offset]])` | Get/set file position (`"set"`, `"cur"` (default), `"end"`). Returns position in bytes, or `fail, errmsg` |
| `file:setvbuf(mode [, size])` | Set buffering mode (`"no"`, `"full"`, `"line"`) |
| `file:write(...)` | Write to file. Returns `file` on success, or `fail, errmsg, errcode, nbytes` on error |

### Read Formats

- `"n"` — read a numeral (integer or float), returning `fail` if no valid numeral
- `"a"` — read entire file from current position; returns empty string at EOF (never fails)
- `"l"` — read next line without newline (default); returns `fail` at EOF
- `"L"` — read next line with newline; returns `fail` at EOF
- number — read up to that many bytes; returns `fail` at EOF (0 returns `""` or `fail` at EOF)

```lua
-- Read entire file
local f = assert(io.open("data.txt", "r"))
local content = f:read("a")
f:close()

-- Read line by line
for line in io.lines("data.txt") do
  print(line)
end

-- Write to file
local f = assert(io.open("output.txt", "w"))
f:write("Hello\n")
f:close()
```

---

## Operating System Facilities

| Function | Description |
|----------|-------------|
| `os.clock()` | CPU time used by program |
| `os.date([format [, time]])` | Format date/time. `"!"` prefix → UTC. `"*t"` → table with `year`, `month` (1–12), `day` (1–31), `hour` (0–23), `min` (0–59), `sec` (0–61, leap seconds), `wday` (weekday 1–7, Sunday=1), `yday` (day of year 1–366), `isdst` (boolean, may be absent). Default: `"%c"` |
| `os.difftime(t2, t1)` | Time difference |
| `os.execute([command])` | Execute shell command. Returns `true` or `fail`, then `"exit"`/`"signal"` + status code. Without command, returns boolean for shell availability |
| `os.exit([code [, close]])` | Exit program. `code`: `true`→EXIT_SUCCESS, `false`→EXIT_FAILURE, number→that status. `close=true` closes Lua state |
| `os.getenv(varname)` | Environment variable value, or fail if not defined |
| `os.remove(filename)` | Remove file (or empty directory on POSIX). Returns true, or `fail, errmsg, errcode` |
| `os.rename(oldname, newname)` | Rename file. Returns true, or `fail, errmsg, errcode` |
| `os.setlocale(locale [, category])` | Set locale. Categories: `"all"` (default), `"collate"`, `"ctype"`, `"monetary"`, `"numeric"`, `"time"`. `locale=nil` returns current locale. Empty string → native locale. `"C"` → standard C locale. Returns new locale name or fail |
| `os.time([table])` | Current time (epoch seconds) or time from table. Table fields: `year`, `month`, `day` (required), `hour` (default 12), `min` (default 0), `sec` (default 0), `isdst` (default nil). Other fields ignored. Values need not be in valid ranges (e.g., `sec=-10` means 10s before). When called with a table, normalizes all `os.date` fields to valid ranges |
| `os.tmpname()` | Temporary file name. On POSIX, also creates the file to avoid security risks. Must be explicitly opened and removed. Prefer `io.tmpfile` for auto-removal |

```lua
print(os.date("%Y-%m-%d %H:%M:%S"))  --> "2025-07-20 22:15:00"
print(os.time())                      --> epoch seconds
print(os.getenv("HOME"))              --> home directory
```

---

## The Debug Library

The debug library provides access to Lua's internal state. Use with caution.

| Function | Description |
|----------|-------------|
| `debug.debug()` | Interactive debug mode |
| `debug.getinfo([thread,] f [, what])` | Function info |
| `debug.getlocal([thread,] f, local)` | Returns name and value of local variable at index `local` of function at level `f`. Negative indices refer to vararg arguments. If `f` is a function, returns only parameter names. Returns fail if no variable with that index. Raises error if level out of range |
| `debug.setlocal([thread,] level, local, value)` | Set local variable. Returns variable name, or fail if no variable with that index. Raises error if level out of range |
| `debug.getupvalue(f, up)` | Returns name and value of upvalue at index `up` of function `f`. Returns fail if no upvalue with that index |
| `debug.setupvalue(f, up, value)` | Set upvalue at index `up` of function `f`. Returns upvalue name, or fail if no upvalue with that index |
| `debug.getuservalue(u, n)` | Returns n-th user value of userdata `u` plus boolean (false if userdata does not have that value) |
| `debug.setuservalue(udata, value, n)` | Set n-th user value of full userdata `udata`. Returns `udata`, or fail if userdata does not have that value |
| `debug.sethook([thread,] hook, mask [, count])` | Set hook function |
| `debug.gethook([thread])` | Get current hook: returns hook function, mask, count. Returns fail if no active hook |
| `debug.getmetatable(value)` | Get metatable (bypasses `__metatable`) |
| `debug.setmetatable(value, table)` | Set metatable for any value (can be nil). Returns `value` |
| `debug.getregistry()` | Get the C registry |
| `debug.traceback([thread,] [message [, level]])` | Returns string with traceback. If `message` is not string/nil, returns it unchanged. `level` defaults to 1 |
| `debug.upvalueid(f, n)` | Unique ID for upvalue |
| `debug.upvaluejoin(f1, n1, f2, n2)` | Share upvalue between closures |

### Hook Masks

- `"c"` — call events
- `"r"` — return events
- `"l"` — line events
- `"c"` with count — count events

Hook events receive a string parameter: `"call"`, `"tail call"`, `"return"`, `"line"`, `"count"`. For line events, the hook also gets the line number as second parameter. Inside a hook, call `debug.getinfo(2)` for info about the running function.

### `debug.getinfo` `what` Options

| Option | Fields filled |
|--------|---------------|
| `"n"` | `name`, `namewhat` |
| `"S"` | `source`, `srclen`, `short_src`, `linedefined`, `lastlinedefined`, `what` |
| `"l"` | `currentline` |
| `"u"` | `nups`, `nparams`, `isvararg` |
| `"t"` | `istailcall`, `extraargs` |
| `"r"` | `ftransfer`, `ntransfer` |
| `"f"` | `func` (the function itself) |
| `"L"` | `activelines` (table of valid lines) |

Default: all except `L`. Level 0 = `getinfo` itself, level 1 = caller.

```lua
-- Trace all function calls
debug.sethook(function(event, line)
  local info = debug.getinfo(2, "nS")
  print(event, info.name, info.source, line)
end, "cr")

-- Get a stack traceback
print(debug.traceback("Error occurred:", 1))
```
