# The C API

The C API is the interface between Lua and C code. It allows C programs to create Lua states, execute Lua code, read/write Lua variables, register C functions, and manipulate Lua values on a stack.

---

## The Stack

All communication between C and Lua uses an abstract **stack**. C code pushes values onto the stack, and Lua code reads them from there (and vice versa).

- Stack indices: positive (1 = bottom) or negative (−1 = top)
- `lua_pushnil`, `lua_pushboolean`, `lua_pushinteger`, `lua_pushnumber`, `lua_pushstring`, `lua_pushlstring`, `lua_pushcfunction`, `lua_pushcclosure`, `lua_pushlightuserdata`, `lua_pushglobaltable`, `lua_pushvalue`, `lua_pushfstring`, `lua_pushvfstring`, `lua_pushliteral`, `lua_pushexternalstring`
- `lua_pop(L, n)` — pops n elements
- `lua_gettop(L)` — returns number of elements
- `lua_settop(L, index)` — sets stack size
- `lua_copy(L, from, to)` — copies element
- `lua_insert(L, index)` — inserts element at position
- `lua_remove(L, index)` — removes element
- `lua_replace(L, index)` — replaces element
- `lua_rotate(L, index, n)` — rotates elements

### Stack Size

- `lua_checkstack(L, n)` — ensures n extra stack slots
- `LUA_MINSTACK` — minimum guaranteed stack size (20)

### Valid and Acceptable Indices

- **Valid index**: refers to a value on the stack (pseudocounts for registry)
- **Acceptable index**: valid index or 0 (used for optional arguments)
- `lua_absindex(L, idx)` — converts negative to positive index

### Pointers to Strings

`lua_tolstring` returns pointers to strings. These pointers are valid until the string is garbage collected. `lua_pushexternalstring` pushes an external string without copying.

---

## C Closures

When a C function is pushed with upvalues (`lua_pushcclosure`), it becomes a **C closure**. Upvalues are accessed via `lua_upvalueindex(n)`.

```c
static int counter(lua_State *L) {
    int count = (int)lua_tointeger(L, lua_upvalueindex(1));
    count++;
    lua_pushinteger(L, count);
    lua_copy(L, -1, lua_upvalueindex(1));
    return 1;  /* number of results */
}

/* Create the closure with initial count = 0 */
lua_pushinteger(L, 0);
lua_pushcclosure(L, counter, 1);  /* 1 upvalue */
lua_setglobal(L, "counter");
```

---

## Registry

The **registry** is a pre-defined table accessible from C, used to store values that must persist across C function calls.

- Accessed with the pseudo-index `LUA_REGISTRYINDEX`
- `lua_ref(L, t)` / `luaL_ref` — create a reference in a table
- `luaL_unref` — release a reference
- Special entries:
  - `LUA_RIDX_GLOBALS` — the global environment
  - `LUA_RIDX_MAINTHREAD` — the main thread
  - `LUA_LOADED_TABLE` — loaded modules
  - `LUA_PRELOAD_TABLE` — preload functions

---

## Error Handling in C

### `lua_pcall(L, nargs, nresults, msgh)`

Calls a function in protected mode. Returns `LUA_OK` on success or an error code on failure.

### `lua_call(L, nargs, nresults)`

Calls a function unprotected. Errors propagate via `longjmp`.

### Status Codes

| Code | Description |
|------|-------------|
| `LUA_OK` | Success |
| `LUA_ERRRUN` | Runtime error |
| `LUA_ERRMEM` | Memory allocation error |
| `LUA_ERRERR` | Error in message handler |
| `LUA_ERRSYNTAX` | Syntax error during `lua_load` |
| `LUA_ERRFILE` | File error in `luaL_loadfile` |
| `LUA_YIELD` | Coroutine yielded |

### Error Functions

- `lua_error(L)` — raises an error with the value on top of the stack
- `lua_atpanic(L, panicf)` — sets a panic function for unprotected errors

---

## Handling Yields in C

When a C function is called inside a coroutine that yields, Lua uses **continuation functions** (`lua_KFunction`):

- `lua_callk(L, nargs, nresults, ctx, k)` — call with continuation
- `lua_pcallk(L, nargs, nresults, msgh, ctx, k)` — protected call with continuation
- `lua_yieldk(L, nresults, ctx, k)` — yield with continuation

The continuation `k` is called when the coroutine is resumed after a yield, allowing the C function to resume its work.

```c
static int myfunc(lua_State *L) {
    /* ... do something ... */
    return lua_yieldk(L, 0, 0, myfunc_k);
}

static int myfunc_k(lua_State *L, int status, lua_KContext ctx) {
    /* Called when coroutine is resumed after yield */
    /* ... continue work ... */
    return 0;
}
```

---

## Key C API Types

| Type | Description |
|------|-------------|
| `lua_State` | Lua interpreter state |
| `lua_Integer` | Integer type (64-bit by default) |
| `lua_Number` | Floating-point type (double by default) |
| `lua_Unsigned` | Unsigned integer |
| `lua_CFunction` | C function: `int (*)(lua_State *L)` |
| `lua_KFunction` | Continuation function |
| `lua_KContext` | Continuation context (integer or pointer) |
| `lua_Alloc` | Memory allocator function |
| `lua_Reader` | Chunk reader function |
| `lua_Writer` | Chunk writer function |
| `lua_Hook` | Debug hook function |
| `lua_WarnFunction` | Warning handler function |
| `lua_Debug` | Debug information structure |

---

## Key C API Functions (Selected)

### State Management

```c
lua_State *lua_newstate(lua_Alloc f, void *ud, unsigned int seed);
void lua_close(lua_State *L);
lua_State *lua_newthread(lua_State *L);
int lua_closethread(lua_State *L, lua_State *from);
int lua_status(lua_State *L);
int lua_resetthread(lua_State *L);  /* deprecated in 5.5 */
const lua_Number *lua_version(lua_State *L);
```

### Stack Operations

```c
int lua_gettop(lua_State *L);
void lua_settop(lua_State *L, int idx);
void lua_pushvalue(lua_State *L, int idx);
void lua_rotate(lua_State *L, int idx, int n);
void lua_copy(lua_State *L, int fromidx, int toidx);
void lua_insert(lua_State *L, int idx);   /* move top element to idx */
void lua_remove(lua_State *L, int idx);   /* remove element at idx, shift down */
void lua_replace(lua_State *L, int idx);  /* replace element at idx with top, pop */
void lua_pop(lua_State *L, int n);        /* macro: lua_settop(L, -(n)-1) */
int lua_absindex(lua_State *L, int idx);
int lua_checkstack(lua_State *L, int n);
```

### Loading and Calling Functions

```c
int lua_load(lua_State *L, lua_Reader reader, void *data,
             const char *chunkname, const char *mode);
/* Loads a chunk. Returns LUA_OK, LUA_ERRSYNTAX, or LUA_ERRMEM.
   mode: "t" (text), "b" (binary), "bt" (both, default) */

void lua_call(lua_State *L, int nargs, int nresults);
/* Unprotected call. nresults or LUA_MULTRET. Max nresults = 250. */

int lua_pcall(lua_State *L, int nargs, int nresults, int msgh);
/* Protected call. msgh = message handler stack index (0 = none).
   Returns LUA_OK or error code. Max nresults = 250. */
```

### Coroutines (Thread Functions)

```c
int lua_resume(lua_State *L, lua_State *from, int nargs);
/* Resume coroutine. Returns LUA_OK, LUA_YIELD, or error code. */

int lua_resumek(lua_State *L, lua_State *from, int nargs,
                lua_KContext ctx, lua_KFunction k);
/* Resume with continuation function. */

int lua_yield(lua_State *L, int nresults);
/* Yield from coroutine. Macro for lua_yieldk with NULL continuation. */

int lua_yieldk(lua_State *L, int nresults, lua_KContext ctx, lua_KFunction k);
/* Yield with continuation. nresults values on stack become resume return values. */
```

### Push Functions

```c
void lua_pushnil(lua_State *L);
void lua_pushboolean(lua_State *L, int b);
void lua_pushinteger(lua_State *L, lua_Integer n);
void lua_pushnumber(lua_State *L, lua_Number n);
void lua_pushlstring(lua_State *L, const char *s, size_t len);
void lua_pushstring(lua_State *L, const char *s);
void lua_pushexternalstring(lua_State *L, const char *s, size_t len, lua_Alloc falloc, void *ud);  /* external buffer, optional free function */
void lua_pushcclosure(lua_State *L, lua_CFunction fn, int n);
void lua_pushcfunction(lua_State *L, lua_CFunction fn);
void lua_pushlightuserdata(lua_State *L, void *p);
void lua_pushglobaltable(lua_State *L);
const char *lua_pushfstring(lua_State *L, const char *fmt, ...);
const char *lua_pushvfstring(lua_State *L, const char *fmt, va_list argp);
```

`lua_pushfstring` conversion specifiers: `%%` (literal `%`), `%s` (string), `%f` (`lua_Number`), `%I` (`lua_Integer`), `%p` (pointer), `%d` (int), `%c` (int as byte), `%U` (unsigned long as UTF-8).

### Get Functions

```c
int lua_toboolean(lua_State *L, int idx);
lua_Integer lua_tointegerx(lua_State *L, int idx, int *isnum);
lua_Integer lua_tointeger(lua_State *L, int idx);
lua_Number lua_tonumberx(lua_State *L, int idx, int *isnum);
lua_Number lua_tonumber(lua_State *L, int idx);
const char *lua_tolstring(lua_State *L, int idx, size_t *len);
const char *lua_tostring(lua_State *L, int idx);
void *lua_touserdata(lua_State *L, int idx);
lua_State *lua_tothread(lua_State *L, int idx);
const void *lua_topointer(lua_State *L, int idx);
lua_CFunction lua_tocfunction(lua_State *L, int idx);
```

### Type Checks

```c
int lua_type(lua_State *L, int idx);
const char *lua_typename(lua_State *L, int tp);
int lua_isnil(lua_State *L, int idx);
int lua_isboolean(lua_State *L, int idx);
int lua_isnumber(lua_State *L, int idx);
int lua_isstring(lua_State *L, int idx);
int lua_isinteger(lua_State *L, int idx);
int lua_isfunction(lua_State *L, int idx);
int lua_istable(lua_State *L, int idx);
int lua_isthread(lua_State *L, int idx);
int lua_isuserdata(lua_State *L, int idx);
int lua_islightuserdata(lua_State *L, int idx);
int lua_iscfunction(lua_State *L, int idx);
int lua_isnone(lua_State *L, int idx);       /* index not valid */
int lua_isnoneornil(lua_State *L, int idx);  /* not valid or nil */
```

### Arithmetic and Comparison

```c
void lua_arith(lua_State *L, int op);  /* perform arithmetic op on top 2 values */
int lua_compare(lua_State *L, int idx1, int idx2, int op);  /* compare without metamethods */
void lua_len(lua_State *L, int idx);  /* # operator with metamethods */
```

Arithmetic ops: `LUA_OPADD`, `LUA_OPSUB`, `LUA_OPMUL`, `LUA_OPDIV`, `LUA_OPIDIV`, `LUA_OPMOD`, `LUA_OPPOW`, `LUA_OPUNM`, `LUA_OPBNOT`, `LUA_OPBAND`, `LUA_OPBOR`, `LUA_OPBXOR`, `LUA_OPSHL`, `LUA_OPSHR`.

Comparison ops: `LUA_OPEQ`, `LUA_OPLT`, `LUA_OPLE`.

### Userdata

```c
void *lua_newuserdatauv(lua_State *L, size_t sz, int nuvalue);  /* create full userdata with nuvalue user values */
```

### Miscellaneous State Functions

```c
void *lua_getextraspace(lua_State *L);  /* per-state raw memory (default: sizeof(void*)) */
lua_Alloc lua_getallocf(lua_State *L, void **ud);  /* get current allocator */
void lua_setallocf(lua_State *L, lua_Alloc f, void *ud);  /* set allocator */
void lua_xmove(lua_State *from, lua_State *to, int n);  /* move n values between threads */
```

### Table Operations

```c
void lua_createtable(lua_State *L, int narr, int nrec);
void lua_newtable(lua_State *L);
int lua_gettable(lua_State *L, int idx);
int lua_getfield(lua_State *L, int idx, const char *k);
int lua_geti(lua_State *L, int idx, lua_Integer n);
int lua_getglobal(lua_State *L, const char *name);
void lua_settable(lua_State *L, int idx);
void lua_setfield(lua_State *L, int idx, const char *k);
void lua_seti(lua_State *L, int idx, lua_Integer n);
void lua_setglobal(lua_State *L, const char *name);
int lua_next(lua_State *L, int idx);
```

### Metatables

```c
int lua_getmetatable(lua_State *L, int objindex);
void lua_setmetatable(lua_State *L, int objindex);
```

### Raw Operations

```c
int lua_rawequal(lua_State *L, int idx1, int idx2);
int lua_rawget(lua_State *L, int idx);
int lua_rawgeti(lua_State *L, int idx, lua_Integer n);
int lua_rawgetp(lua_State *L, int idx, const void *p);
void lua_rawset(lua_State *L, int idx);
void lua_rawseti(lua_State *L, int idx, lua_Integer n);
void lua_rawsetp(lua_State *L, int idx, const void *p);
lua_Unsigned lua_rawlen(lua_State *L, int idx);
```

### Garbage Collection

```c
int lua_gc(lua_State *L, int what, ...);
```

Options: `LUA_GCSTOP`, `LUA_GCRESTART`, `LUA_GCCOLLECT`, `LUA_GCCOUNT`, `LUA_GCCOUNTB`, `LUA_GCSTEP`, `LUA_GCISRUNNING`, `LUA_GCINC`, `LUA_GCGEN`, `LUA_GCPARAM`.

`LUA_GCPARAM` takes `(int param, int val)` — if `val` is -1, only returns current value. Parameters: `LUA_GCPMINORMUL`, `LUA_GCPMAJORMINOR`, `LUA_GCPMINORMAJOR`, `LUA_GCPPAUSE`, `LUA_GCPSTEPMUL`, `LUA_GCPSTEPSIZE`.

### String and Number Conversion

```c
size_t lua_stringtonumber(lua_State *L, const char *s);  /* pushes number, returns 0 on failure */
int lua_numbertocstring(lua_Number n, char *buff);  /* Lua 5.5: convert number to C string */
const char *lua_tolstring(lua_State *L, int idx, size_t *len);  /* also converts numbers to strings */
```

### Concatenation and Dump

```c
void lua_concat(lua_State *L, int n);  /* concatenate n values, following Lua semantics */
int lua_dump(lua_State *L, lua_Writer writer, void *data, int strip);  /* binary dump of function */
```

### Warnings

```c
typedef void (*lua_WarnFunction)(void *ud, const char *msg, int tocont);
void lua_setwarnf(lua_State *L, lua_WarnFunction f, void *ud);
void lua_warning(lua_State *L, const char *msg, int tocont);
```

### User Values

```c
int lua_getiuservalue(lua_State *L, int idx, int n);
int lua_setiuservalue(lua_State *L, int idx, int n);
```

### To-Be-Closed Variables

```c
int lua_toclose(lua_State *L, int idx);
```

---

## The Auxiliary Library

The auxiliary library (`lauxlib`) provides higher-level convenience functions over the C API.

### State Creation

```c
lua_State *luaL_newstate(void);
void luaL_openlibs(lua_State *L);
void luaL_openselectedlibs(lua_State *L, int load, int preload);  /* Lua 5.5 */
/* load: bitmask of libraries to load; preload: bitmask to preload via package.preload.
   Mask constants (bitwise OR): LUA_GLIBK, LUA_LOADLIBK, LUA_COLIBK, LUA_STRLIBK,
   LUA_UTF8LIBK, LUA_TABLIBK, LUA_MATHLIBK, LUA_IOLIBK, LUA_OSLIBK, LUA_DBLIBK */
```

### Argument Checking

```c
void luaL_checktype(lua_State *L, int arg, int t);
void luaL_checkany(lua_State *L, int arg);
lua_Integer luaL_checkinteger(lua_State *L, int arg);
lua_Integer luaL_optinteger(lua_State *L, int arg, lua_Integer d);
lua_Number luaL_checknumber(lua_State *L, int arg);
lua_Number luaL_optnumber(lua_State *L, int arg, lua_Number d);
const char *luaL_checklstring(lua_State *L, int arg, size_t *l);
const char *luaL_optlstring(lua_State *L, int arg, const char *d, size_t *l);
const char *luaL_checkstring(lua_State *L, int arg);
const char *luaL_optstring(lua_State *L, int arg, const char *d);
void luaL_checkstack(lua_State *L, int sz, const char *msg);
void luaL_argcheck(lua_State *L, int cond, int arg, const char *extramsg);
void luaL_argerror(lua_State *L, int arg, const char *extramsg);
void luaL_argexpected(lua_State *L, int cond, int arg, const char *tname);
int luaL_checkoption(lua_State *L, int arg, const char *def, const char *const lst[]);
```

### Loading Chunks

```c
int luaL_loadfile(lua_State *L, const char *filename);
int luaL_loadfilex(lua_State *L, const char *filename, const char *mode);
int luaL_loadbuffer(lua_State *L, const char *buff, size_t sz, const char *name);
int luaL_loadbufferx(lua_State *L, const char *buff, size_t sz, const char *name, const char *mode);
int luaL_loadstring(lua_State *L, const char *s);
int luaL_dostring(lua_State *L, const char *s);  /* macro: load + pcall */
int luaL_dofile(lua_State *L, const char *filename);  /* macro: load + pcall */
```

### Module Registration

```c
void luaL_newlib(lua_State *L, const luaL_Reg *reg);
void luaL_newlibtable(lua_State *L, const luaL_Reg *reg);
void luaL_setfuncs(lua_State *L, const luaL_Reg *reg, int nup);
void luaL_requiref(lua_State *L, const char *modname, lua_CFunction openf, int glb);

typedef struct luaL_Reg {
  const char *name;
  lua_CFunction func;
} luaL_Reg;
```

### Metatables

```c
int luaL_newmetatable(lua_State *L, const char *tname);
void luaL_setmetatable(lua_State *L, const char *tname);
void *luaL_checkudata(lua_State *L, int ud, const char *tname);
void *luaL_testudata(lua_State *L, int ud, const char *tname);
int luaL_getmetafield(lua_State *L, int obj, const char *e);
int luaL_getmetatable(lua_State *L, const char *tname);  /* push metatable from registry by name */
int luaL_callmeta(lua_State *L, int obj, const char *e);
```

### Buffers

```c
typedef luaL_Buffer;
void luaL_buffinit(lua_State *L, luaL_Buffer *B);
char *luaL_prepbuffer(luaL_Buffer *B);
char *luaL_prepbuffsize(luaL_Buffer *B, size_t sz);
void luaL_addlstring(luaL_Buffer *B, const char *s, size_t l);
void luaL_addstring(luaL_Buffer *B, const char *s);
void luaL_addvalue(luaL_Buffer *B);
void luaL_addchar(luaL_Buffer *B, char c);
void luaL_addsize(luaL_Buffer *B, size_t s);
void luaL_pushresult(luaL_Buffer *B);
void luaL_pushresultsize(luaL_Buffer *B, size_t sz);
char *luaL_buffinitsize(lua_State *L, luaL_Buffer *B, size_t sz);  /* equiv: buffinit + prepbuffsize */
size_t luaL_bufflen(luaL_Buffer *B);
char *luaL_buffaddr(luaL_Buffer *B);
```

### Error Functions

```c
int luaL_error(lua_State *L, const char *fmt, ...);
int luaL_typeerror(lua_State *L, int arg, const char *tname);
const char *luaL_typename(lua_State *L, int idx);
int luaL_fileresult(lua_State *L, int stat, const char *fname);
int luaL_execresult(lua_State *L, int stat);
void luaL_where(lua_State *L, int level);
const char *luaL_traceback(lua_State *L, lua_State *L1, const char *msg, int level);
```

### References

```c
int luaL_ref(lua_State *L, int t);     /* create reference in table at t */
void luaL_unref(lua_State *L, int t, int ref);  /* release reference */
/* Constants: LUA_NOREF, LUA_REFNIL */
```

### String Conversion

```c
const char *luaL_tolstring(lua_State *L, int idx, size_t *len);  /* __tostring aware */
void luaL_pushfail(lua_State *L);  /* pushes false (fail value) */
```

### Miscellaneous

```c
void luaL_checkversion(lua_State *L);  /* verify version compatibility */
const char *luaL_gsub(lua_State *L, const char *s, const char *p, const char *r);  /* global substitution */
void luaL_addgsub(luaL_Buffer *B, const char *s, const char *p, const char *r);  /* buffer substitution */
lua_Integer luaL_len(lua_State *L, int idx);  /* # operator equivalent */
void luaL_buffsub(luaL_Buffer *B, int n);  /* remove n bytes from buffer */
unsigned int luaL_makeseed(lua_State *L);  /* weak randomness for seeding */
int luaL_getsubtable(lua_State *L, int idx, const char *fname);  /* ensure t[fname] is a table */
void *luaL_alloc(void *ud, void *ptr, size_t osize, size_t nsize);  /* standard allocator (realloc/free) */
```

### File Streams

```c
typedef struct luaL_Stream {
  FILE *f;
  lua_CFunction closef;
} luaL_Stream;
/* File handles are full userdata with metatable LUA_FILEHANDLE */
```

---

## The Debug Interface

The debug interface provides functions to inspect and manipulate the runtime stack, local variables, upvalues, and hooks.

### `lua_Debug` Structure

```c
typedef struct lua_Debug {
  int event;
  const char *name;        /* (n) function name */
  const char *namewhat;    /* (n) "global", "local", "upvalue", "field", "" */
  const char *what;        /* (S) "Lua", "C", "main" */
  const char *source;      /* (S) source of the chunk */
  size_t srclen;           /* (S) length of source */
  int currentline;         /* (l) current line, -1 if unknown */
  int linedefined;         /* (S) first line of function */
  int lastlinedefined;     /* (S) last line of function */
  unsigned char nups;      /* (u) number of upvalues */
  unsigned char nparams;   /* (u) number of parameters */
  char isvararg;           /* (u) true if variadic */
  unsigned char extraargs; /* (t) extra args from __call chain */
  char istailcall;         /* (t) true if tail call */
  int ftransfer;           /* (r) first transferred value index */
  int ntransfer;           /* (r) number of transferred values */
  char short_src[LUA_IDSIZE]; /* (S) printable source */
} lua_Debug;
```

### Debug Functions

```c
int lua_getstack(lua_State *L, int level, lua_Debug *ar);  /* fill activation record */
int lua_getinfo(lua_State *L, const char *what, lua_Debug *ar);  /* fill fields by option */
const char *lua_getlocal(lua_State *L, const lua_Debug *ar, int n);  /* get local var */
const char *lua_setlocal(lua_State *L, const lua_Debug *ar, int n);  /* set local var */
const char *lua_getupvalue(lua_State *L, int funcindex, int n);  /* get upvalue */
const char *lua_setupvalue(lua_State *L, int funcindex, int n);  /* set upvalue */
void *lua_upvalueid(lua_State *L, int funcindex, int n);  /* unique upvalue id */
void lua_upvaluejoin(lua_State *L, int fidx1, int n1, int fidx2, int n2);  /* share upvalue */
```

### `lua_getinfo` Options

| Option | Fills / Pushes |
|--------|----------------|
| `'f'` | Pushes the running function |
| `'l'` | `currentline` |
| `'n'` | `name`, `namewhat` |
| `'r'` | `ftransfer`, `ntransfer` |
| `'S'` | `source`, `srclen`, `short_src`, `linedefined`, `lastlinedefined`, `what` |
| `'t'` | `istailcall`, `extraargs` |
| `'u'` | `nups`, `nparams`, `isvararg` |
| `'L'` | Pushes table of active lines (breakpoints) |

Prefix `what` with `'>'` to inspect a function on top of the stack instead of an activation record.

### Hooks

```c
typedef void (*lua_Hook)(lua_State *L, lua_Debug *ar);
void lua_sethook(lua_State *L, lua_Hook f, int mask, int count);
lua_Hook lua_gethook(lua_State *L);
int lua_gethookmask(lua_State *L);
int lua_gethookcount(lua_State *L);
```

Hook masks: `LUA_MASKCALL`, `LUA_MASKRET`, `LUA_MASKLINE`, `LUA_MASKCOUNT`. Hook events: `LUA_HOOKCALL`, `LUA_HOOKRET`, `LUA_HOOKTAILCALL`, `LUA_HOOKLINE`, `LUA_HOOKCOUNT`.

Key rules:
- Hooks are disabled while a hook is running (no recursive hooks)
- Hook functions cannot have continuations (no `lua_yieldk`, `lua_pcallk`, `lua_callk` with non-null `k`)
- Only count and line events can yield; must yield with `nresults = 0`
- Line events only occur while executing Lua functions
- For tail calls, there is no corresponding return event

---

## Minimal C Embedding Example

```c
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

int main(void) {
    lua_State *L = luaL_newstate();
    luaL_openlibs(L);

    if (luaL_dostring(L, "print('Hello from Lua!')") != LUA_OK) {
        fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    }

    lua_close(L);
    return 0;
}
```

## Registering C Functions

```c
static int my_sum(lua_State *L) {
    lua_Integer a = luaL_checkinteger(L, 1);
    lua_Integer b = luaL_checkinteger(L, 2);
    lua_pushinteger(L, a + b);
    return 1;
}

static const luaL_Reg mylib[] = {
    {"sum", my_sum},
    {NULL, NULL}
};

int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib);
    return 1;
}
```

```lua
-- Usage from Lua
local mylib = require("mylib")
print(mylib.sum(3, 4))  --> 7
```
