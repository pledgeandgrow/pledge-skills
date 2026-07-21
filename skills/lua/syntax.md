# Syntax, Variables, and Statements

## Lexical Conventions

Lua is a free-form language. It ignores spaces and comments between tokens, except as delimiters between two tokens.

### Identifiers (Names)

Identifiers can be any string of:
- Latin letters
- Arabic-Indic digits
- Underscores

Must **not** begin with a digit and must **not** be a reserved word.

Lua is **case-sensitive**: `and` is a reserved word, but `And` and `AND` are valid names.

Convention: avoid names starting with underscore followed by uppercase letters (e.g., `_VERSION`).

### Reserved Keywords

```
and       break     do        else      elseif
end       false     for       function  global
goto      if        in        local     nil
not       or        repeat    return    then
true      until     while
```

Note: `global` is a new reserved word in Lua 5.5.

### Operators and Delimiters

```
+   -   *   /   %   ^   #   &   ~   |   <<  >>  //
==  ~=  <=  >=  <   >   =   (   )   {   }   [   ]
::  ;   :   ,   .   ..  ...
```

### Literal Strings

**Short literal strings** — delimited by single or double quotes:

```lua
'a string'
"another string"
```

Escape sequences:

| Escape | Meaning |
|--------|---------|
| `\a` | Bell |
| `\b` | Backspace |
| `\f` | Form feed |
| `\n` | Newline |
| `\r` | Carriage return |
| `\t` | Horizontal tab |
| `\v` | Vertical tab |
| `\\` | Backslash |
| `\"` | Double quote |
| `\'` | Single quote |
| `\z` | Skip following whitespace (including newlines) |
| `\xXX` | Byte by hexadecimal value (exactly 2 digits) |
| `\ddd` | Byte by decimal value (up to 3 digits) |
| `\u{XXX}` | UTF-8 encoding of Unicode code point |

**Long literal strings** — enclosed by long brackets:

- Level 0: `[[...]]`
- Level 1: `[=[...]=]`
- Level n: `[=...=[...]=...=]`

Long strings can span multiple lines, do not interpret escape sequences, and ignore long brackets of any other level. A newline immediately after the opening long bracket is not included.

```lua
local s = [[
This is a long string
that spans multiple lines.
No escape sequences are interpreted: \n is literal.
]]
```

### Numeric Constants

- Optional fractional part and decimal exponent (`e` or `E`)
- Hexadecimal constants start with `0x` or `0X`
- Hexadecimal constants can have fractional part and binary exponent (`p` or `P`)

```lua
-- Integer constants
3       345     0xff    0xBEBADA

-- Float constants
3.0     3.1416  314.16e-2   0.31416E1
34e1    0x0.1E  0xA23p-4    0X1.921FB54442D18P+1
```

A numeral with a radix point or exponent is a **float**; otherwise, if it fits in an integer, it's an **integer**. A decimal integer that overflows becomes a float. Hexadecimal integers that overflow wrap around.

### Comments

```lua
-- short comment (to end of line)

--[[ long comment
that can span multiple lines ]]

--[==[ long comment at level 2
can contain ]] without ending the comment ]==]
```

---

## Variables

There are three kinds of variables in Lua:

1. **Global variables** — declared with `global` or implicitly (global-by-default outside any `global` declaration)
2. **Local variables** — declared with `local`
3. **Table fields** — accessed via indexing

```lua
var ::= Name
var ::= prefixexp '[' exp ']'
var ::= prefixexp '.' Name
```

- `var.Name` is syntactic sugar for `var["Name"]`
- An access to a global variable `x` is equivalent to `_ENV.x`
- Before the first assignment, a variable's value is `nil`

### Variable Declarations (Lua 5.5)

```lua
-- Local variable
local x = 10
local x, y = 1, 2

-- Global variable (explicit)
global X
global X = 10

-- Global by default (outside any global declaration)
Z = 42
```

---

## Statements

Lua supports: blocks, chunks, assignment, control structures, function calls, variable declarations, to-be-closed variables, and labels.

### Blocks and Chunks

```lua
block ::= {stat}
stat ::= ';'  -- empty statement (does nothing)
```

A **chunk** is the main unit of compilation. A chunk is compiled as a variadic function. Chunks can be stored in files or strings. A chunk can also be precompiled into binary form (via `luac` or `string.dump`). Source and binary forms are interchangeable; Lua auto-detects the type.

```lua
-- A chunk is an anonymous variadic function
-- '...' in a chunk refers to command-line arguments (in standalone mode)
```

**Ambiguity with open parentheses**: Function calls and assignments can start with an open parenthesis, leading to ambiguity:

```lua
a = b + c
(print or io.write)('done')
-- Could be parsed as: a = b + c(print or io.write)('done')
-- Solution: precede with semicolon
;(print or io.write)('done')
```

Explicit blocks (`do block end`) are useful to control variable scope and to add `return` in the middle of another block.

### Assignment

```lua
stat ::= varlist '=' explist
varlist ::= var {',' var}
explist ::= exp {',' exp}
```

Multiple assignment evaluates all expressions first, then assigns left-to-right:

```lua
local x, y = 1, 2
x, y = y, x          -- swap
local a, b, c = f()   -- f() returns multiple values
```

### Control Structures

#### if-elseif-else

```lua
if exp then block
  {elseif exp then block}
  [else block]
end
```

```lua
if x > 0 then
  print("positive")
elseif x < 0 then
  print("negative")
else
  print("zero")
end
```

#### while

```lua
while exp do block end
```

```lua
local i = 1
while i <= 10 do
  print(i)
  i = i + 1
end
```

#### repeat-until

```lua
repeat block until exp
```

The condition can refer to local variables declared inside the loop block (the inner block extends past `until`).

```lua
repeat
  local line = io.read()
until line == "" or line == nil
```

#### break

Terminates the innermost enclosing `while`, `repeat`, or `for` loop.

#### goto and labels

```lua
stat ::= goto Name
stat ::= label
label ::= '::' Name '::'
```

- A label is visible in the entire block where it is defined, except inside nested functions
- `goto` can jump to any visible label, as long as it does not enter the scope of a variable declaration
- Cannot jump into the scope of a local variable

```lua
for i = 1, 10 do
  for j = 1, 10 do
    if j > 5 then goto skip end
    print(i, j)
  end
  ::skip::
end
```

#### return

```lua
stat ::= return [explist] [';']
```

- Can only be the **last statement** of a block
- Functions can return multiple values
- Use `do return end` idiom to return in the middle of a block

### For Statements

#### Numerical For

```lua
for Name '=' exp ',' exp [',' exp] do block end
```

The control variable is a new **read-only** (const) variable local to the loop body.

```lua
for i = 1, 10 do print(i) end       -- 1 to 10, step 1
for i = 10, 1, -1 do print(i) end   -- 10 to 1, step -1
for i = 0, 1, 0.1 do print(i) end   -- float progression
```

- If both initial value and step are integers, the loop uses integers
- Otherwise, all values are converted to floats
- A step of zero raises an error
- Integer loops never wrap around on overflow; the loop ends instead

#### Generic For

```lua
for namelist in explist do block end
```

Works over **iterator functions**. The `explist` produces four values: iterator function, state, initial control value, and closing value.

```lua
-- Standard iterators
for k, v in pairs(t) do print(k, v) end
for i, v in ipairs(t) do print(i, v) end

-- Custom iterator
local function range(n)
  local i = 0
  return function()
    i = i + 1
    if i <= n then return i end
  end
end
for i in range(5) do print(i) end  -- 1 2 3 4 5
```

The closing value behaves like a to-be-closed variable, useful for resource cleanup when the loop ends.

### Function Calls as Statements

```lua
stat ::= functioncall
```

All returned values are thrown away when a function call is used as a statement.

### Tail Calls

A call of the form `return functioncall` (not in the scope of a to-be-closed variable) is a **tail call**. Lua implements proper tail calls (proper tail recursion): the called function reuses the stack entry of the calling function, so there is no limit on nested tail calls. A tail call erases debug information about the calling function.

These are **not** tail calls:
```lua
return (f(x))       -- results adjusted to 1
return 2 * f(x)     -- result multiplied
return x, f(x)      -- additional results
return x or f(x)    -- results adjusted to 1
```

### To-be-closed Variables

```lua
stat ::= local attdlist {',' attdlist} '=' explist
attdlist ::= Name attlist
attlist ::= {'<' Name '>'}
```

A variable declared with the `<close>` attribute is a **to-be-closed variable**. When it goes out of scope (including normal block termination, break/goto/return, or error), its `__close` metamethod is called.

Key rules:
- The value must have a `__close` metamethod or be a false value (`nil`/`false` are ignored)
- If there was an error, the error object is passed as the second argument to `__close`
- Multiple to-be-closed variables are closed in **reverse order** of declaration
- Errors in closing methods are handled like errors in regular code; other pending closing methods still run
- If a coroutine yields and is never resumed, some variables may never be closed
- If a coroutine ends with an error, it does not unwind its stack (no closing)
- Use `coroutine.close` to close variables manually, or finalizers (`__gc`)
- `coroutine.wrap` closes the coroutine automatically on error

```lua
local f <close> = assert(io.open("file.txt", "r"))
-- f's __close metamethod is called when the block ends
local content = f:read("a")
-- file is automatically closed here
```

### const Variables

Variables declared with `<const>` cannot be assigned to after initialization:

```lua
local x <const> = 10
-- x = 20  --> error: attempt to assign to const variable
```

### Collective Global Declarations

Lua offers a collective form for declaring globals:

```lua
stat ::= global [attrib] '*'
```

- `global *` — implicitly declares all names not previously declared as read-write globals (this is the default at the start of every chunk)
- `global<const> *` — implicitly declares all undeclared names as read-only globals
- `global none` — no implicit globals; only explicitly declared variables can be used

```lua
global X
global<const> *
print(math.pi)  -- Ok, 'print' and 'math' are read-only
X = 1           -- Ok, declared as read-write
Y = 1           -- Error, Y is read-only
```

The preambular `global *` becomes void inside the scope of any other `global` declaration. For global variables, declarations are **syntactical only** (except for optional initialization) — `_ENV.X = 1` bypasses the declaration system.

```lua
global X <const>, _G
X = 1        -- ERROR
_ENV.X = 1   -- Ok (bypasses syntactical check)
_G.print(X) -- Ok
```

---

## Expressions

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

### Arithmetic Operators

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Float division (always returns float) |
| `//` | Floor division (rounds quotient toward −∞) |
| `%` | Modulo (remainder of floor division) |
| `^` | Exponentiation (always returns float, uses `pow`) |
| `-` (unary) | Negation |

- If both operands are integers, the result is an integer (except `/` and `^`)
- Otherwise, operands are converted to floats and the result is a float
- Integer overflow wraps around (two's complement)
- String library coerces strings to numbers in arithmetic operations

### Bitwise Operators

| Operator | Description |
|----------|-------------|
| `&` | Bitwise AND |
| `\|` | Bitwise OR |
| `~` (binary) | Bitwise XOR |
| `~` (unary) | Bitwise NOT |
| `<<` | Left shift |
| `>>` | Right shift |

- All bitwise operations convert operands to integers and produce an integer
- Shifts fill vacant bits with zeros
- Negative displacements shift in the opposite direction
- Displacements ≥ integer bit width result in zero

### Coercions and Conversions

- Bitwise operators always convert float operands to integers
- Exponentiation and float division convert integer operands to floats
- Other arithmetic with mixed int/float converts the integer to float
- String concatenation accepts numbers (converts to string)
- Integer→float: never fails (uses nearest representable value)
- Float→integer: succeeds only if float has exact integral value in range
- String→number: follows Lua lexer rules; accepts leading/trailing whitespace and sign
- `"1"==1` is `false` — equality does not coerce strings to numbers
- Number→string uses an unspecified human-readable format; use `string.format` for control

### Relational Operators

| Operator | Description |
|----------|-------------|
| `==` | Equality |
| `~=` | Inequality (negation of `==`) |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less or equal |
| `>=` | Greater or equal |

- Always result in `false` or `true`
- `==` compares by type first; different types are never equal
- Strings equal if same byte content; numbers equal if same mathematical value
- Tables, userdata, threads compared by reference; functions equal only to themselves
- `__eq` metamethod for tables/userdata (when not primitively equal)
- Order operators: numbers by mathematical value, strings by current locale
- `a > b` translates to `b < a`; `a >= b` translates to `b <= a`
- NaN is neither less than, equal to, nor greater than any value (including itself)

### Logical Operators

| Operator | Description |
|----------|-------------|
| `and` | Returns first argument if false/nil, otherwise second |
| `or` | Returns first argument if not false/nil, otherwise second |
| `not` | Always returns `false` or `true` |

Both `and` and `or` use short-circuit evaluation.

```lua
10 or 20       --> 10
nil or "a"     --> "a"
nil and 10     --> nil
false and nil  --> false
false or nil   --> nil
10 and 20      --> 20
```

### Concatenation

The `..` operator concatenates strings. If both operands are strings or numbers, numbers are converted to strings. Otherwise, the `__concat` metamethod is called.

### The Length Operator

The unary `#` operator:

- On strings: returns the number of bytes
- On tables: returns a **border** — a non-negative integer where `(t[border] ~= nil) and (t[border+1] == nil)`
- A table with exactly one border is a **sequence**; `#t` returns that border
- A table with holes (non-sequence) may return any of its borders
- Guaranteed worst time O(log n) where n is the largest integer key
- `__len` metamethod can override behavior for non-string values

### Operator Precedence

From **lower** to **higher** priority:

```
or
and
<   >   <=   >=   ~=   ==
|
~
&
<<   >>
..
+   -
*   /   //   %
unary operators (not  #  -  ~)
^
```

- `..` (concatenation) and `^` (exponentiation) are **right associative**
- All other binary operators are **left associative**

### Table Constructors

```
tableconstructor ::= '{' [fieldlist] '}'
fieldlist ::= field {fieldsep field} [fieldsep]
field ::= '[' exp ']' '=' exp | Name '=' exp | exp
fieldsep ::= ',' | ';'
```

- `[exp1] = exp2` — explicit key
- `name = exp` — equivalent to `["name"] = exp`
- `exp` — equivalent to `[i] = exp` with consecutive integers starting at 1
- Trailing separator allowed (for machine-generated code)
- If the last field is a multires expression, all its values enter the list

```lua
a = {[f(1)] = g; "x", "y"; x = 1, f(x), [30] = 23; 45}
-- t[f(1)] = g, t[1] = "x", t[2] = "y", t.x = 1, t[3] = f(x), t[30] = 23, t[4] = 45
```

### Function Calls

```
functioncall ::= prefixexp args
functioncall ::= prefixexp ':' Name args
args ::= '(' [explist] ')' | tableconstructor | LiteralString
```

- `v:name(args)` is sugar for `v.name(v, args)` (v evaluated only once)
- `f{fields}` is sugar for `f({fields})`
- `f'string'` is sugar for `f('string')`
- If `prefixexp` is not a function, the `__call` metamethod is invoked

**Tail calls**: `return functioncall` (not in scope of a to-be-closed variable) is a proper tail call — reuses the calling function's stack entry. Erases debug information about the caller.

Not tail calls:
```lua
return (f(x))       -- results adjusted to 1
return 2 * f(x)     -- result multiplied
return x, f(x)      -- additional results
return x or f(x)    -- results adjusted to 1
```

### Function Definitions

```
functiondef ::= function funcbody
funcbody ::= '(' [parlist] ')' block end
parlist ::= namelist [',' varargparam] | varargparam
varargparam ::= '...' [Name]
```

Syntactic sugar:
- `function f() body end` → `f = function() body end`
- `function t.a.b.c.f() body end` → `t.a.b.c.f = function() body end`
- `local function f() body end` → `local f; f = function() body end` (allows recursion)
- `global function f() body end` → `global f; global f = function() body end` (initialization check)
- `function t.a.b.c:f(params) body end` → `t.a.b.c.f = function(self, params) body end`

**Named varargs** (Lua 5.5): `function f(...args)` creates a read-only local variable `args` referring to the vararg table. `args.n` gives the count of extra arguments; `args[1]`, `args[2]`, etc. give the values. If unnamed, `...` is a vararg expression accessing the same data.

```lua
function g(a, b, ...args)
  print(args.n)      -- number of extra arguments
  print(args[1])     -- first extra argument
  print(...)         -- also works (vararg expression)
end
g(3, 4, 5, 8)        -- a=3, b=4, args = {5, 8, n=2}
```

A function definition is an executable expression — the function is **instantiated** (closed) when the definition executes. System-dependent limit on return values (guaranteed at least 1000).

### Lists of Expressions, Multiple Results, and Adjustment

**Multires expressions** (function calls and vararg expressions) can produce multiple values.

When a multires expression is the **last element** of an expression list, all its results enter the list. When it's **not last** or in a single-expression context, it's adjusted to one result. Parentheses force adjustment to one result.

Places that expect expression lists:
- `return e1, e2, e3`
- `{e1, e2, e3}` (table constructor)
- `foo(e1, e2, e3)` (function arguments)
- `a, b, c = e1, e2, e3` (multiple assignment)
- `local/global a, b, c = e1, e2, e3` (declaration)
- `for k in e1, e2, e3 do ... end` (generic for — exactly 4 values)

Adjustment rules: extra values discarded; missing values filled with `nil`.

```lua
print(x, f())    -- prints x and all results from f()
print(x, (f()))  -- prints x and first result from f() only
print(f(), x)    -- prints first result from f() and x
local x = ...    -- x gets first vararg argument
x, y = ...       -- x gets first, y gets second vararg argument
return x, ...    -- returns x and all vararg arguments
{...}            -- creates list with all vararg arguments
{f(), 5}         -- creates list with first result from f() and 5
```
