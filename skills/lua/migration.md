# Incompatibilities and Complete Syntax

## Incompatibilities with the Previous Version (Lua 5.4 → 5.5)

### Incompatibilities in the Language

- **`global` is a reserved word** — cannot be used as a regular name
- **Control variable in `for` loops is read-only** — declare a local with the same name in the loop body if you need to modify it
- **`__call` metamethod chains** — at most 15 objects in a chain of `__call` metamethods
- **`nil` as error object** — replaced by a string message in errors

### Incompatibilities in the Libraries

- **Garbage collection parameters** — no longer set with `"incremental"` and `"generational"` options; use the new `"param"` option. Some parameters themselves changed.

### Incompatibilities in the API

- **`lua_call` maximum results** — `nresults` maximum is 250. Use `LUA_MULTRET` and adjust the stack if more are needed.
- **`lua_newstate` third parameter** — a seed for the hashing of strings.
- **`lua_resetthread` deprecated** — equivalent to `lua_closethread` with `from` being NULL.
- **`lua_setcstacklimit` deprecated** — calls to it can simply be removed.
- **`lua_dump` changes** — different stack handling during writer calls; calls writer one extra time to signal end of dump.
- **GC parameters** — not set with `LUA_GCINC` and `LUA_GCGEN`; use `LUA_GCPARAM` instead.
- **`lua_pushvfstring`** — now reports errors instead of raising them.

---

## New Features in Lua 5.5

- **`global` declarations** — explicit global variable declarations with `global` keyword
- **Named varargs** — `function f(...args)` creates a named vararg table
- **`table.create(nseq, nrec)`** — pre-allocate table with array and hash slots
- **`luaL_openselectedlibs`** — selectively open standard libraries
- **`lua_pushexternalstring`** — push external string without copying
- **`lua_numbertocstring`** — convert number to C string
- **GC `"param"` option** — unified GC parameter setting
- **Read-only control variables** in `for` loops

---

## Complete Syntax of Lua

```
chunk ::= block

block ::= {stat} [retstat]

stat ::= ';' |
         varlist '=' explist |
         functioncall |
         label |
         break |
         goto Name |
         do block end |
         while exp do block end |
         repeat block until exp |
         if exp then block {elseif exp then block} [else block] end |
         for Name '=' exp ',' exp [',' exp] do block end |
         for namelist in explist do block end |
         function funcname funcbody |
         local function Name funcbody |
         global function Name funcbody |
         local attnamelist ['=' explist] |
         global attnamelist ['=' explist] |
         global [attrib] '*'

attnamelist ::= [attrib] Name [attrib] {',' Name [attrib]}

attrib ::= '<' Name '>'

retstat ::= return [explist] [';']

label ::= '::' Name '::'

funcname ::= Name {'.' Name} [':' Name]

varlist ::= var {',' var}

var ::= Name | prefixexp '[' exp ']' | prefixexp '.' Name

namelist ::= Name {',' Name}

explist ::= exp {',' exp}

exp ::= nil | false | true | Numeral | LiteralString |
        '...' | functiondef | prefixexp | tableconstructor |
        exp binop exp | unop exp

prefixexp ::= var | functioncall | '(' exp ')'

functioncall ::= prefixexp args | prefixexp ':' Name args

args ::= '(' [explist] ')' | tableconstructor | LiteralString

functiondef ::= function funcbody

funcbody ::= '(' [parlist] ')' block end

parlist ::= namelist [',' varargparam] | varargparam

varargparam ::= '...' [Name]

tableconstructor ::= '{' [fieldlist] '}'

fieldlist ::= field {fieldsep field} [fieldsep]

field ::= '[' exp ']' '=' exp | Name '=' exp | exp

fieldsep ::= ',' | ';'

binop ::= '+' | '-' | '*' | '/' | '//' | '^' | '%' |
          '&' | '~' | '|' | '>>' | '<<' | '..' |
          '<' | '<=' | '>' | '>=' | '==' | '~=' |
          and | or

unop ::= '-' | not | '#' | '~'
```

**Named vararg parameter**: `varargparam ::= '...' [Name]` — when a name is given (e.g., `function f(...args)`), `args` is a local table containing the vararg arguments. An actual vararg table is not created if the function only uses `args` in indexing expressions (`args[i]`, `#args`, `args.n`) — these are translated to direct vararg access.
