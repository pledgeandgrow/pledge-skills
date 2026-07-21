# Flask Development Server

Flask provides a built-in development server for local development. It is not suitable for production use.

## Command Line

The `flask run` CLI command is the recommended way to run the development server.

```bash
$ flask --app hello run --debug
```

- `--app` points to your application
- `--debug` enables debug mode (interactive debugger + reloader)
- Server starts on `http://localhost:5000/`

View available options:
```bash
$ flask run --help
```

### Address Already in Use

If another program is using port 5000, you'll see an `OSError`:

- `OSError: [Errno 98] Address already in use` (Linux)
- `OSError: [WinError 10013] An attempt was made to access a socket...` (Windows)

Solutions:
- Identify and stop the other program
- Use a different port: `flask run --port 5001`

Identify the process using a port:
```bash
# Linux/macOS
$ netstat -nlp | grep 5000
$ lsof -P -i :5000

# Windows
> netstat -ano | findstr 5000
```

**macOS Monterey+**: A service using port 5000 starts automatically (AirPlay Receiver). Disable it in System Settings or use a different port.

### Deferred Errors on Reload

When using the reloader, the server continues running even if you introduce syntax errors. Accessing the site shows the interactive debugger for the error rather than crashing the server.

If a syntax error is present when calling `flask run`, it fails immediately and shows the traceback.

## In Code

The development server can also be started from Python with `Flask.run()`:

```python
if __name__ == "__main__":
    app.run(debug=True)
```

```bash
$ python hello.py
```

Key differences from the CLI command:
- The server will **crash** if there are errors when reloading (unlike the CLI which continues)
- `debug=True` enables debug mode
- Place the call in a `if __name__ == "__main__":` block to avoid interfering with production server imports

## Key Points

- The development server is for development only, not production
- Use `flask run` CLI for the best experience (reloader, debugger)
- Use `app.run()` in code only for quick testing
- Default port is 5000
- Debug mode enables the interactive debugger and auto-reload
