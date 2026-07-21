# Lua Standalone Interpreter

Although Lua is designed as an extension language, the standard distribution includes a standalone interpreter called `lua`. It includes all standard libraries.

## Usage

```
lua [options] [script [args]]
```

## Options

| Option | Description |
|--------|-------------|
| `-e stat` | Execute string `stat` |
| `-i` | Enter interactive mode after running script |
| `-l mod` | `require` mod and assign result to global `mod` |
| `-l g=mod` | `require` mod and assign result to global `g` |
| `-v` | Print version information |
| `-E` | Ignore environment variables |
| `-W` | Turn warnings on |
| `--` | Stop handling options |
| `-` | Execute stdin as a file and stop handling options |

Options `-e`, `-l`, and `-W` are handled in the order they appear.

```bash
$ lua -e 'a=1' -llib1 script.lua
```

This sets `a` to 1, requires library `lib1`, then runs `script.lua`.

## Default Behavior

- No arguments and stdin is a terminal: behaves as `lua -v -i`
- No arguments and stdin is not a terminal: behaves as `lua -`
- Without `-E`: checks `LUA_INIT_5_5` (or `LUA_INIT`) environment variable

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LUA_INIT_5_5` | Versioned init (checked first) |
| `LUA_INIT` | Fallback init |
| `LUA_PATH_5_5` | Versioned Lua module path |
| `LUA_PATH` | Fallback Lua module path |
| `LUA_CPATH_5_5` | Versioned C module path |
| `LUA_CPATH` | Fallback C module path |

If `LUA_INIT` content starts with `@`, it's treated as a filename to execute. Otherwise, the content is executed as a Lua string.

With `-E`, all environment variables are ignored. Default paths from `luaconf.h` are used.

## The `arg` Table

Before running any code, `lua` collects command-line arguments in a global table called `arg`:

- Script name → index 0
- First argument after script → index 1
- Arguments before the script → negative indices

```bash
$ lua -la b.lua t1 t2
```

Results in:

```lua
arg = { [-2] = "lua", [-1] = "-la", [0] = "b.lua", [1] = "t1", [2] = "t2" }
```

If there is no script, the interpreter name goes to index 0:

```bash
$ lua -e "print(arg[1])"
-- prints "-e"
```

The script is called with arguments `arg[1]` through `arg[#arg]`. Like all chunks, the script is compiled as a variadic function.

## Interactive Mode

In interactive mode, Lua:
1. Prompts and waits for a line
2. Tries to interpret the line as an expression — if successful, prints its value
3. Otherwise, interprets the line as a chunk
4. Issues a different prompt for incomplete chunks

```lua
> x = 20          -- global 'x'
> local x = 10; print(x)
--> warning: locals do not survive across lines in interactive mode
--> 10
> print(x)        -- back to global 'x'
--> 20
> do              -- incomplete chunk
>> local x = 10; print(x)
>> print(x)
>> end            -- chunk completed
--> 10
--> 10
```

Each complete line is read as a new chunk — local variables do not outlive lines. The interpreter warns if a line starts with `local`.

### Custom Prompts

- `_PROMPT` — if this global variable contains a string, its value is used as the prompt
- `_PROMPT2` — if this global variable contains a string, its value is used as the secondary prompt (for incomplete statements)

### Error Handling

In case of unprotected errors in the script, the interpreter reports the error to stderr:
- If the error object has a `__tostring` metamethod, it is called to produce the message
- Otherwise, the error object is converted to a string and a stack traceback is appended
- Warnings (when on) are printed to stderr

### Cleanup on Exit

When finishing normally, the interpreter closes its main Lua state (`lua_close`). The script can avoid this by calling `os.exit` to terminate immediately.

### The `-E` Option and `LUA_NOENV`

With `-E`, Lua does not consult any environment variables. `package.path` and `package.cpath` are set to default paths from `luaconf.h`. The interpreter sets the registry field `"LUA_NOENV"` to a true value to signal this to libraries.

## Running Lua Scripts

### Shebang line (Unix)

```lua
#!/usr/bin/env lua
print("Hello from script!")
```

### Executing from stdin

```bash
$ echo "print(42)" | lua -
$ lua - << 'EOF'
local x = 10
print(x * 2)
EOF
```

### Inline execution

```bash
$ lua -e 'print(math.pi)'
3.1415926535898
```
