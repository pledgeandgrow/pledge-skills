# Expressions, Operators, and Functions

## Basic Expressions

```
exp ::= prefixexp
exp ::= nil | false | true
exp ::= Numeral
exp ::= LiteralString
exp ::= functiondef
exp ::= tableconstructor
exp ::= '...'
exp ::= exp binop exp
exp ::= unop exp

prefixexp ::= var | functioncall | '(' exp ')'
```

Vararg expressions (`...`) can only be used inside a variadic function.

---

## Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `3 + 4` → `7` |
| `-` | Subtraction | `10 - 3` → `7` |
| `*` | Multiplication | `3 * 4` → `12` |
| `/` | Float division (always returns float) | `7 / 2` → `3.5` |
| `//` | Floor division | `7 // 2` → `3`, `-7 // 2` → `-4` |
| `%` | Modulo (floor division remainder) | `7 % 3` → `1`, `-7 % 3` → `2` |
| `^` | Exponentiation (always returns float) | `2 ^ 10` → `1024.0` |
| `-` (unary) | Negation | `-5` → `-5` |

Rules:
- If both operands are integers (except for `/` and `^`), the operation is performed over integers and the result is an integer
- Otherwise, operands are converted to floats and the result is a float
- `/` and `^` always convert operands to floats and return floats
- Integer overflow wraps around (two's complement)
- `//` rounds the quotient towards minus infinity
- `%` is defined as the remainder of floor division: `a % b == a - floor(a/b) * b`

```lua
print(7 / 2)    --> 3.5
print(7 // 2)   --> 3
print(-7 // 2)  --> -4
print(7 % 3)    --> 1
print(-7 % 3)   --> 2
print(2 ^ 0.5)  --> 1.4142135623731
```

---

## Bitwise Operators

| Operator | Description |
|----------|-------------|
| `&` | Bitwise AND |
| `\|` | Bitwise OR |
| `~` (binary) | Bitwise XOR |
| `~` (unary) | Bitwise NOT |
| `<<` | Left shift |
| `>>` | Right shift |

- All bitwise operations convert operands to integers, operate on all bits, and result in an integer
- Shifts fill vacant bits with zeros
- Negative displacements shift in the opposite direction
- Displacements >= bit width result in zero

```lua
print(0xFF & 0x0F)   --> 15
print(0xFF | 0x100)  --> 511
print(0xFF ~ 0x0F)   --> 240
print(~0)            --> -1 (all bits set, two's complement)
print(1 << 8)        --> 256
print(256 >> 4)      --> 16
```

---

## Coercions and Conversions

- Strings converted to numbers in arithmetic operations (string library handles this)
- Numbers converted to strings in concatenation
- `tonumber(e, base)` — explicit conversion
- `tostring(v)` — explicit string conversion (uses `__tostring` metamethod)

```lua
print("10" + 5)      --> 15 (string "10" coerced to number)
print(10 .. "")      --> "10" (number coerced to string)
print(tonumber("0xFF", 16))  --> 255
print(tonumber("101", 2))    --> 5
```

---

## Relational Operators

| Operator | Description |
|----------|-------------|
| `==` | Equality |
| `~=` | Inequality |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less or equal |
| `>=` | Greater or equal |

- Always result in `false` or `true`
- `==` first compares types; different types → `false`
- Numbers equal if they denote the same mathematical value (regardless of subtype)
- Strings equal if same byte content
- Tables, userdata, threads compared by **reference**
- No coercion: `"0" == 0` → `false`
- `NaN` is neither less than, equal to, nor greater than any value (including itself)
- `a > b` is translated to `b < a`; `a >= b` to `b <= a`
- `__eq` metamethod only for tables/userdata; `__lt` and `__le` for non-number/non-string

---

## Logical Operators

| Operator | Description |
|----------|-------------|
| `and` | Conjunction (short-circuit) |
| `or` | Disjunction (short-circuit) |
| `not` | Negation (always returns boolean) |

- `false` and `nil` are false; everything else is true
- `not` always returns `true` or `false`
- `and` returns first argument if false/nil; otherwise returns second argument
- `or` returns first argument if not false/nil; otherwise returns second argument

```lua
print(10 or 20)       --> 10
print(10 or error())  --> 10 (short-circuit, error() not called)
print(nil or "a")     --> "a"
print(nil and 10)     --> nil
print(false and nil)  --> false
print(false or nil)   --> nil
print(10 and 20)      --> 20

-- Common idiom: default value
local x = maybe_nil or "default"

-- Common idiom: ternary-like
local result = condition and value_if_true or value_if_false
```

---

## Concatenation

The concatenation operator `..` joins strings. If both operands are strings or numbers, numbers are converted to strings. Otherwise, the `__concat` metamethod is called.

```lua
print("Hello" .. " " .. "World")  --> "Hello World"
print("Number: " .. 42)           --> "Number: 42"
print(1 .. 2 .. 3)                --> "123"
```

---

## The Length Operator

The length operator `#`:

- **Strings**: returns number of bytes
- **Tables**: returns a **border** — a non-negative integer where `t[border] ~= nil` and `t[border+1] == nil`
- A table with exactly one border is a **sequence**; `#t` returns its length
- A table with holes (nil gaps) may return any of its borders
- The `__len` metamethod can override behavior for non-string values
- Worst-case time: O(log n)

```lua
print(#"hello")        --> 5
print(#{10,20,30})    --> 3
print(#{10,20,nil,40}) --> 2 or 4 (undefined for non-sequences)
```

---

## Operator Precedence

From **lower** to **higher** priority:

```
or
and
<   >   <=  >=  ~=  ==
|
~
&
<<  >>
..
+   -
*   /   //  %
unary operators (not  #  -  ~)
^
```

- `..` (concatenation) and `^` (exponentiation) are **right associative**
- All other binary operators are **left associative**
- Use parentheses to override precedence

---

## Table Constructors

```lua
tableconstructor ::= '{' [fieldlist] '}'
fieldlist ::= field {fieldsep field} [fieldsep]
field ::= '[' exp ']' '=' exp | Name '=' exp | exp
fieldsep ::= ',' | ';'
```

```lua
local empty = {}
local seq = {10, 20, 30}              -- t[1]=10, t[2]=20, t[3]=30
local record = {name = "Alice", age = 30}  -- t["name"]="Alice", t["age"]=30
local mixed = {[1] = "a", [2] = "b", x = 1}
local with_exp = {f(1), g(2); x = 1, [30] = 23}

-- Last field can be a multires expression
local function multi() return 100, 200 end
local t = {1, 2, multi()}  -- t[1]=1, t[2]=2, t[3]=100, t[4]=200
```

- `name = exp` is equivalent to `["name"] = exp`
- `exp` fields get consecutive integer keys starting at 1
- Other field formats don't affect the integer counting
- Trailing separator allowed (for machine-generated code)

---

## Function Calls

```lua
functioncall ::= prefixexp args
functioncall ::= prefixexp ':' Name args
args ::= '(' [explist] ')'
args ::= tableconstructor
args ::= LiteralString
```

- `f:method(args)` is syntactic sugar for `f.method(f, args)` — adds implicit `self`
- `f"string"` is sugar for `f("string")`
- `f{table}` is sugar for `f({table})`

```lua
print "hello"           -- same as print("hello")
print {1, 2, 3}         -- same as print({1, 2, 3})
obj:method()            -- same as obj.method(obj)
```

---

## Function Definitions

```lua
functiondef ::= function funcbody
funcbody ::= '(' [parlist] ')' block end

-- Syntactic sugar
stat ::= function funcname funcbody
stat ::= local function Name funcbody
stat ::= global function Name funcbody
funcname ::= Name {'.' Name} [':' Name]
```

```lua
-- Basic function
function f() body end
-- translates to: f = function() body end

-- Local function (supports recursion)
local function f() body end
-- translates to: local f; f = function() body end

-- Global function (Lua 5.5 — raises error if already defined)
global function f() body end
-- translates to: global f; global f = function() body end

-- Method definition (adds implicit self)
function t.a.b.c:f(params) body end
-- translates to: t.a.b.c.f = function(self, params) body end
```

### Parameters

```lua
parlist ::= namelist [',' varargparam] | varargparam
varargparam ::= '...' [Name]
```

- Parameters act as local variables initialized with argument values
- Arguments are adjusted to parameter count (extra args discarded, missing args → nil)
- Variadic function: `...` at end of parameter list collects extra arguments
- In Lua 5.5, vararg can have an optional **name**: `function f(...args)` creates a read-only `args` table with values at indices 1..n and `n` = count

```lua
function f(a, b) end        -- fixed parameters
function g(a, b, ...) end   -- variadic

-- Lua 5.5 named vararg
function h(a, ...args)
  print(args.n)             -- number of extra arguments
  print(args[1])            -- first extra argument
end
```

Argument-to-parameter mapping:

```lua
function f(a, b) end
function g(a, b, ...) end
function r() return 1, 2, 3 end

f(3)         -- a=3, b=nil
f(3, 4)      -- a=3, b=4
f(3, 4, 5)   -- a=3, b=4 (5 discarded)
f(r(), 10)   -- a=1, b=10
f(r())       -- a=1, b=2 (3 discarded)

g(3, 4, 5, 8)  -- a=3, b=4, vararg={5, 8, n=2}
g(5, r())      -- a=5, b=1, vararg={2, 3, n=2}
```

### Closures

A function definition is an executable expression whose value has type `function`. When Lua executes the definition, the function is **instantiated** (closed) — this instance is a **closure**.

Closures capture upvalues (external local variables) from their lexical scope:

```lua
local function counter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end

local c = counter()
print(c())  --> 1
print(c())  --> 2
print(c())  --> 3
```

---

## Lists of Expressions, Multiple Results, and Adjustment

- A function call can return multiple values
- `...` (vararg expression) produces a list of values
- In an expression list, the **last** expression can produce multiple values; all others are adjusted to one value

```lua
local function f() return 1, 2, 3 end

-- Multiple results in different contexts:
print(f())        --> 1  2  3  (last arg, all results)
print(f(), 10)    --> 1  10   (not last, adjusted to 1)
local a, b, c = f()  -- a=1, b=2, c=3
local a, b = f(), 10  -- a=1, b=10 (f adjusted to 1 value)
local t = {f()}   -- t = {1, 2, 3}
local t = {f(), 10}  -- t = {1, 10} (f adjusted to 1 value)
```

Parentheses adjust an expression to exactly one value:

```lua
print((f()))  --> 1  (parentheses force single value)
```
