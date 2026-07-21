# Values, Types, Metatables, and Garbage Collection

## Values and Types

Lua is a dynamically typed language. Variables do not have types; only values do. There are no type definitions in the language. All values carry their own type.

All values in Lua are **first-class values** — they can be stored in variables, passed as arguments, and returned as results.

### The Eight Basic Types

| Type | Description | Values |
|------|-------------|--------|
| `nil` | Absence of a useful value | Single value: `nil` |
| `boolean` | Truth values | `false`, `true` |
| `number` | Numeric values | Integers and floats (two subtypes) |
| `string` | Immutable byte sequences | 8-bit clean, can contain `\0` |
| `function` | Functions | Lua functions and C functions |
| `userdata` | Arbitrary C data | Full userdata (managed memory) and light userdata (C pointer) |
| `thread` | Independent execution threads | Used for coroutines |
| `table` | Associative arrays | Sole data-structuring mechanism |

### nil and boolean

- `nil` is different from any other value; it often represents the absence of a useful value
- `false` and `nil` are collectively called **false values** — they make conditions false
- Any other value makes a condition true (including `0` and `""`)
- `false` behaves like a regular value in a table; `nil` in a table represents an absent key

```lua
local t = {}
t[false] = "no"     -- key false is present
t[nil] = "error"    -- ERROR: table index is nil
print(t[false])     --> "no"
print(t[missing])   --> nil (key not present)
```

### number

The type `number` represents both integer and real (floating-point) numbers using two subtypes:

- **integer** — 64-bit by default (configurable to 32-bit via `LUA_32BITS`)
- **float** — double-precision 64-bit by default (configurable to single-precision 32-bit)

Integer overflow wraps around using two's complement arithmetic. Lua converts between subtypes automatically (see Coercions).

```lua
print(3)            --> 3 (integer)
print(3.0)          --> 3.0 (float)
print(3 / 2)        --> 1.5 (float — / always returns float)
print(3 // 2)       --> 1 (integer — floor division)
print(1.0 == 1)     --> true
print(math.type(3)) --> integer
print(math.type(3.0)) --> float
```

### string

- Immutable sequences of bytes
- 8-bit clean — can contain any byte value, including embedded zeros (`\0`)
- Encoding-agnostic — makes no assumptions about content
- Length must fit in a Lua integer

```lua
local s = "hello\0world"
print(#s)           --> 11 (length includes the \0)
print(s:sub(1,5))   --> "hello"
```

### userdata

Allows arbitrary C data to be stored in Lua variables:

- **Full userdata** — object with a block of memory managed by Lua; can have metatables and user values
- **Light userdata** — simply a C pointer value; no individual metatable

Userdata has no predefined operations except assignment and identity test. Operations can be defined via metatables. Userdata cannot be created or modified in Lua — only through the C API.

### thread

Represents independent threads of execution, used to implement coroutines. Lua threads are **not** related to operating-system threads. Lua supports coroutines on all systems, even those without native thread support.

### table

The sole data-structuring mechanism in Lua. Tables implement **associative arrays** — arrays that can have any Lua value as index (except `nil` and `NaN`).

```lua
-- Tables can represent arrays, lists, sets, records, graphs, trees
local array = {10, 20, 30}           -- sequence
local record = {name = "Alice", age = 30}  -- record
local set = {["apple"] = true, ["banana"] = true}  -- set

-- a.name is syntactic sugar for a["name"]
print(record.name)  --> "Alice"
print(record["name"]) --> "Alice"
```

Key characteristics:
- Heterogeneous — can contain values of all types (except `nil`)
- Any key associated with `nil` is not considered part of the table
- Any key not in the table has an associated value `nil`
- Floats with integral values are converted to integers when used as keys: `a[2.0] = true` inserts key `2`
- Tables, functions, threads, and full userdata are **objects** — variables hold references, not copies

```lua
local a = {}
local b = a       -- b references the same table
b[1] = "hello"
print(a[1])       --> "hello" (a and b are the same object)
```

Use `type()` to check the type of any value:

```lua
print(type(42))         --> "number"
print(type("hello"))    --> "string"
print(type({}))         --> "table"
print(type(print))      --> "function"
print(type(nil))        --> "nil"
```

---

## Scopes, Variables, and Environments

### Variable Declarations

Lua 5.5 introduces explicit `global` declarations alongside `local`:

```lua
X = 1          -- Ok, global by default (implicit global *)
do
  global Y     -- voids the implicit initial declaration
  Y = 1        -- Ok, Y declared as global
  -- X = 1     -- ERROR, X not declared (no default)
end
X = 2          -- Ok, global by default again
```

- Outside any `global` declaration, Lua works as **global-by-default**
- Inside any `global` declaration, Lua works **without a default** — all variables must be declared

### Lexical Scoping

Lua is lexically scoped. The scope of a variable declaration begins at the first statement after the declaration and lasts until the last non-void statement of the innermost block that includes the declaration.

```lua
global print, x
x = 10           -- global variable
do
  local x = x    -- new 'x', with value 10
  print(x)       --> 10
  x = x + 1
  do
    local x = x + 1  -- another 'x'
    print(x)     --> 12
  end
  print(x)       --> 11
end
print(x)         --> 10 (the global one)
```

In `local x = x`, the new `x` being declared is not in scope yet, so the `x` on the right-hand side refers to the outside variable.

### Upvalues and Closures

Local variables can be freely accessed by functions defined inside their scope. A local variable used by an inner function is called an **upvalue** (or external local variable).

```lua
local x = 20
for i = 1, 10 do
  local y = 0
  a[i] = function () y = y + 1; return x + y end
end
```

Each iteration creates a new closure with its own `y`, but all share the same `x`.

### _ENV and Environments

Any reference to a global variable `var` is syntactically translated to `_ENV.var`. Every chunk is compiled in the scope of an external local variable named `_ENV`.

- `_ENV` is a regular name — you can define variables with that name
- Any table used as the value of `_ENV` is called an **environment**
- The **global environment** is kept at a special index in the C registry
- `_G` is initialized with the global environment (but `_G` is never used internally)

```lua
-- Loading a chunk with a custom environment
local env = {print = print, x = 10}
local f = load("print(x)", "chunk", "t", env)
f()  --> 10
```

---

## Error Handling

Lua provides error handling through:

- `error(message)` — raises an error with a message
- `pcall(f, ...)` — calls function in protected mode, returns `true, results` or `false, err`
- `xpcall(f, handler, ...)` — like `pcall` but with a message handler
- `assert(v, message)` — raises error if `v` is false or nil

```lua
local ok, err = pcall(function()
  error("something went wrong")
end)
print(ok)  --> false
print(err) --> "something went wrong"
```

When an error occurs, Lua does not unwind the stack, allowing inspection via the debug API.

---

## Metatables and Metamethods

Every value in Lua can have a **metatable** — an ordinary Lua table that defines the behavior of the original value under certain events.

- Query with `getmetatable(value)`
- Set with `setmetatable(table, metatable)` (tables only from Lua; other types require the debug library)
- Tables and full userdata have **individual** metatables
- All other types share **one metatable per type**

### Metamethod Reference

| Key | Event | Description |
|-----|-------|-------------|
| `__add` | `+` | Addition |
| `__sub` | `-` | Subtraction |
| `__mul` | `*` | Multiplication |
| `__div` | `/` | Float division |
| `__mod` | `%` | Modulo |
| `__pow` | `^` | Exponentiation |
| `__unm` | unary `-` | Negation |
| `__idiv` | `//` | Floor division |
| `__band` | `&` | Bitwise AND |
| `__bor` | `\|` | Bitwise OR |
| `__bxor` | `~` (binary) | Bitwise XOR |
| `__bnot` | `~` (unary) | Bitwise NOT |
| `__shl` | `<<` | Left shift |
| `__shr` | `>>` | Right shift |
| `__concat` | `..` | Concatenation |
| `__len` | `#` | Length |
| `__eq` | `==` | Equality (tables/userdata only) |
| `__lt` | `<` | Less than |
| `__le` | `<=` | Less or equal |
| `__index` | `table[key]` | Indexing access (function or table) |
| `__newindex` | `table[key] = value` | Indexing assignment |
| `__call` | `func(args)` | Call operation |
| `__gc` | GC finalize | Garbage-collection finalizer |
| `__close` | to-be-closed | Closing a to-be-closed variable |
| `__mode` | weak tables | `"k"`, `"v"`, `"kv"` |
| `__name` | type name | Used by `tostring` and in error messages |
| `__pairs` | `pairs()` | Custom iteration |
| `__tostring` | `tostring()` | String representation |
| `__metatable` | metatable protection | Hides/protects metatable |

### __index and __newindex

```lua
-- __index: called when key is not present
local defaults = {x = 0, y = 0}
local obj = setmetatable({}, {__index = defaults})
print(obj.x)  --> 0 (from defaults)

-- __newindex: called when assigning to absent key
local readonly = setmetatable({}, {
  __newindex = function(t, k, v)
    error("attempt to set new field " .. k)
  end
})
-- readonly.new = 1  --> error

-- __index can be a table (chained lookup) or a function
local proto = {greet = function(self) return "hi" end}
local obj2 = setmetatable({}, {__index = proto})
obj2:greet()  --> "hi"
```

### __call

```lua
local f = setmetatable({}, {
  __call = function(self, ...)
    print("called with", ...)
  end
})
f(1, 2, 3)  --> "called with  1  2  3"
```

### Object-Oriented Programming Pattern

```lua
local Account = {}
Account.__index = Account

function Account.new(balance)
  local self = setmetatable({}, Account)
  self.balance = balance or 0
  return self
end

function Account:deposit(amount)
  self.balance = self.balance + amount
end

function Account:withdraw(amount)
  if amount > self.balance then
    error("insufficient funds")
  end
  self.balance = self.balance - amount
end

local acc = Account.new(100)
acc:deposit(50)
acc:withdraw(30)
print(acc.balance)  --> 120
```

---

## Garbage Collection

Lua performs automatic memory management using a **generational garbage collector** (with incremental mode also available).

### Incremental Garbage Collection

In incremental mode, each GC cycle performs a mark-and-sweep collection in small steps interleaved with the program's execution. Three parameters control cycles:

| Parameter | Description |
|-----------|-------------|
| `pause` | How long the collector waits before starting a new cycle. 200 = wait for memory to double. ≤100 = don't wait. |
| `stepmul` | How much work each step does. n = n% units of work per word allocated. 0 = unlimited (stop-the-world). |
| `stepsize` | How many bytes the interpreter allocates between steps. |

### Generational Garbage Collection

In generational mode, the collector does frequent **minor collections** (traversing only recently created objects). If bytes exceed a limit, it shifts to a **major collection** (traversing all objects). Three parameters:

| Parameter | Description |
|-----------|-------------|
| `minormul` | Frequency of minor collections. x = minor collection when bytes grow x% larger than after last major. |
| `minormajor` | Shift to major collections. x = major collection when old bytes grow x% larger than after previous major. 0 = no major collections. |
| `majorminor` | Shift back to minor. x = shift back after major collects at least x% of bytes from last cycle. 0 = immediate shift back. |

### Controlling GC

Use `collectgarbage` in Lua or `lua_gc` in C. Options:

- `"collect"` — full GC cycle (default)
- `"stop"` / `"restart"` — stop/restart automatic GC
- `"count"` — memory in use (Kbytes, fractional)
- `"step"` — perform a GC step
- `"isrunning"` — boolean, whether GC is running
- `"incremental"` / `"generational"` — change GC mode, returns previous mode
- `"param"` — get/set GC parameters (`minormul`, `majorminor`, `minormajor`, `pause`, `stepmul`, `stepsize`)

### GC Metamethods — Finalizers (`__gc`)

When a table or full userdata with a `__gc` metamethod is collected, Lua calls the metamethod (finalizer) before collecting the object.

Key rules:
- An object is marked for finalization when its metatable is set **and** the metatable has a `__gc` field at that time
- If you set a metatable without `__gc` and later add `__gc`, the object will **not** be marked
- Finalizers are called in **reverse order** of marking (last marked = first finalized)
- The object is **resurrected** during finalization (accessible to the finalizer)
- If the finalizer stores the object globally, resurrection is permanent
- Finalizers **cannot yield** nor run the garbage collector
- Errors in finalizers generate warnings, not propagated errors
- When closing a state (`lua_close`), all finalizers are called in reverse marking order

```lua
local resource = setmetatable({}, {
  __gc = function(self)
    print("cleaning up resource")
  end
})
resource = nil
collectgarbage()  --> "cleaning up resource"
```

### Weak Tables

A **weak table** is one whose elements are weak references — ignored by the garbage collector. The `__mode` metatable field controls weakness:

- `"k"` — weak keys
- `"v"` — weak values
- `"kv"` — both weak keys and values

If either the key or value is collected, the whole pair is removed from the table.

**Ephemeron table**: A table with weak keys and strong values (`"k"`). In an ephemeron table, a value is considered reachable only if its key is reachable. If the only reference to a key comes through its value, the pair is removed.

Notes:
- Only objects with explicit construction (tables, userdata, threads, functions) are removed from weak tables
- Numbers, light C functions, and strings are **not** removed from weak tables (strings behave like values)
- Changes to weakness take effect only at the next collect cycle
- Resurrected objects are removed from weak values before running finalizers, but from weak keys only in the next cycle

```lua
-- Weak-key table: allows key objects to be collected
local cache = setmetatable({}, {__mode = "k"})
local key = {}
cache[key] = "data"
key = nil
collectgarbage()
-- cache may no longer contain the entry

-- Ephemeron table (weak keys, strong values)
local ephemeron = setmetatable({}, {__mode = "k"})
```

---

## Warnings

Lua offers a system of warnings via the `warn` function. Unlike errors, warnings do not interfere with program execution. They typically generate a message to the user, though this behavior can be adapted from C via `lua_setwarnf`.

```lua
warn("this is a warning")  -- prints a warning message
```

---

## Coroutines

Lua supports **coroutines** (collaborative multithreading). A coroutine represents an independent thread of execution that only suspends by explicitly calling `yield`.

See `coroutines.md` for full coverage.
