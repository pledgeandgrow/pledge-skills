# Coroutines

Lua supports **coroutines**, also called collaborative (or cooperative) multithreading. A coroutine represents an independent thread of execution. Unlike threads in multithreaded systems, a coroutine only suspends its execution by explicitly calling a yield function.

## Coroutine Lifecycle

```
created → suspended → running → (normal) → suspended/dead
```

| State | Description |
|-------|-------------|
| `suspended` | Not running, can be resumed |
| `running` | Currently executing |
| `normal` | Running but has resumed another coroutine |
| `dead` | Has finished or terminated with an error |

## Creating Coroutines

### `coroutine.create(f)`

Creates a new coroutine with function `f` as its main function. Returns a coroutine (thread) object. Does **not** start execution.

```lua
local co = coroutine.create(function(a, b)
  print("co-body", a, b)
  local r = coroutine.yield(a + b)
  print("resumed with", r)
  return b, "end"
end)
```

### `coroutine.wrap(f)`

Creates a coroutine and returns a function that, when called, resumes the coroutine. Unlike `coroutine.create`, it does not return the thread object — it returns a function that propagates errors directly.

```lua
local f = coroutine.wrap(function(a, b)
  coroutine.yield(a + b)
  return a * b
end)

print(f(3, 4))  --> 7  (first yield)
print(f(10))    --> 12 (return value)
```

## Resuming and Yielding

### `coroutine.resume(co, ...)`

Starts or resumes a coroutine. Extra arguments are passed to the coroutine's main function (on first resume) or returned by `coroutine.yield` (on subsequent resumes).

Returns:
- `true, ...` — on normal yield or return (values are yield/return values)
- `false, err` — on error (coroutine does not unwind its stack)

```lua
local co = coroutine.create(function(a, b)
  local r = coroutine.yield(a + b)
  return r * 2
end)

print(coroutine.resume(co, 3, 4))  --> true  7
print(coroutine.resume(co, 10))    --> true  20
```

### `coroutine.yield(...)`

Suspends the coroutine. Values passed to `yield` are returned by the corresponding `coroutine.resume`. When the coroutine is resumed again, `yield` returns the extra arguments passed to `resume`.

```lua
local co = coroutine.create(function()
  local x = coroutine.yield("first")
  print("got:", x)  -- "got: second"
  coroutine.yield("third")
end)

print(coroutine.resume(co))        --> true  first
print(coroutine.resume(co, "second"))  --> true  third
```

## Other Coroutine Functions

### `coroutine.status(co)`

Returns the current state: `"suspended"`, `"running"`, `"normal"`, or `"dead"`.

### `coroutine.running()`

Returns the currently running coroutine plus a boolean that is `true` when the running coroutine is the main one.

### `coroutine.isyieldable([co])`

Returns `true` when the coroutine `co` can yield. The default for `co` is the running coroutine. A coroutine is yieldable if it is not the main thread and it is not inside a non-yieldable C function.

### `coroutine.close(co)`

Closes coroutine `co`, running all its pending to-be-closed variables and putting the coroutine in a dead state. The default for `co` is the running coroutine. The given coroutine must be dead, suspended, or be the running coroutine. For the running coroutine, this function does not return — the resume that (re)started the coroutine returns. For other coroutines, returns `true` on success or `false` plus the error object on failure.

## Complete Example

```lua
function foo(a)
  print("foo", a)
  return coroutine.yield(2 * a)
end

co = coroutine.create(function(a, b)
  print("co-body", a, b)
  local r = foo(a + 1)
  print("co-body", r)
  local r, s = coroutine.yield(a + b, a - b)
  print("co-body", r, s)
  return b, "end"
end)

print("main", coroutine.resume(co, 1, 10))
print("main", coroutine.resume(co, "r"))
print("main", coroutine.resume(co, "x", "y"))
print("main", coroutine.resume(co, "x", "y"))
```

Output:

```
co-body 1 10
foo 2
main    true    4
co-body r
main    true    11  -9
co-body x y
main    true    10  end
main    false   cannot resume dead coroutine
```

## Generator Pattern

Coroutines are excellent for implementing generators:

```lua
local function fibonacci()
  local a, b = 0, 1
  return function()
    a, b = b, a + b
    return a
  end
end

-- Or as a coroutine:
local function fib_gen()
  local a, b = 0, 1
  while true do
    a, b = b, a + b
    coroutine.yield(a)
  end
end

local co = coroutine.create(fib_gen)
for i = 1, 10 do
  print(coroutine.resume(co))  -- 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
end
```

## Producer-Consumer Pattern

```lua
local function producer()
  for i = 1, 5 do
    coroutine.yield("item " .. i)
  end
end

local function consumer()
  local prod = coroutine.wrap(producer)
  for item in prod do
    print("consumed:", item)
  end
end

consumer()
-- consumed: item 1
-- consumed: item 2
-- consumed: item 3
-- consumed: item 4
-- consumed: item 5
```

## Coroutines via the C API

Coroutines can also be created and manipulated through the C API:

- `lua_newthread` — create a new coroutine
- `lua_resume` — resume a coroutine
- `lua_yield` / `lua_yieldk` — yield from a coroutine
- `lua_status` — check coroutine status

## Key Properties

- Coroutines are **collaborative** — they yield voluntarily, not preempted
- A coroutine's stack is **not unwound** on error, allowing post-mortem debugging
- `coroutine.wrap` propagates errors to the caller (unlike `coroutine.resume` which returns `false, err`)
- Coroutines work on all systems, even those without native thread support
- Lua coroutines are not related to OS threads
