# Tools — The Dioxus CLI

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tools/](https://dioxuslabs.com/learn/0.7/guides/tools/)

## Installing the CLI

**Prebuilt binary (recommended):**

```bash
cargo binstall dioxus-cli
```

**From source:**

```bash
cargo install dioxus-cli
```

**Or via the install script:**

```bash
curl -sSL https://dioxus.dev/install.sh | bash
```

## Commands

Verify installation and view all commands:

```bash
dx --help
```

```
Dioxus: build web, desktop, and mobile apps with a single codebase

Usage: dx [OPTIONS] <COMMAND>

Commands:
  new         Create a new Dioxus project
  serve       Build, watch, and serve the project
  bundle      Bundle the Dioxus app into a shippable object
  build       Build the Dioxus project and all of its assets
  run         Run the project without any hotreloading
  init        Init a new project for Dioxus in the current directory
  doctor      Diagnose installed tools and system configuration
  print       Print project information in a structured format
  translate   Translate a source file into Dioxus code
  fmt         Automatically format RSX
  check       Check the project for any issues
  config      Dioxus config file controls
  self-update Update the Dioxus CLI to the latest version
  tools       Run a dioxus build tool (build-assets, hotpatch, etc)
  components  Manage components from the dioxus-component registry
  help        Print this message or the help of the given subcommand(s)

Options:
  --verbose          Use verbose output
  --trace            Use trace output
  --json-output      Output logs in JSON format
  -h, --help         Print help
  -V, --version      Print version

Logging Options:
  --log-to-file <LOG_TO_FILE>   Write all logs to a file

Manifest Options:
  --locked    Assert that Cargo.lock will remain unchanged
  --offline   Run without accessing the network
  --frozen    Equivalent to specifying both --locked and --offline
```

## Creating a Project

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tools/creating](https://dioxuslabs.com/learn/0.7/guides/tools/creating)

```bash
# Create a new project in a new directory
dx new my-app

# Initialize a project in the current directory
dx init
```

The CLI scaffolds a Dioxus project with:
- `Cargo.toml` with Dioxus dependencies
- `Dioxus.toml` configuration file
- `src/main.rs` with a basic component
- `assets/` directory for static files

### Project Templates

`dx new` supports different templates:
- **Default:** A basic web app with hot-reload
- **Fullstack:** Server + client with server functions
- **Desktop:** Desktop app with WebView

### Running the Dev Server

```bash
# Start dev server with hot-reload
dx serve

# Serve for desktop
dx serve --desktop

# Serve for mobile
dx serve --mobile

# Specify a custom port
dx serve --port 8080
```

## Translating HTML

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tools/translate](https://dioxuslabs.com/learn/0.7/guides/tools/translate)

Convert HTML files into RSX code:

```bash
dx translate input.html -o output.rs
```

This is useful for converting existing HTML designs into Dioxus components. The translator handles:
- HTML elements and attributes
- Text content
- Basic structure conversion to RSX syntax

## Configuring a Project

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tools/configure](https://dioxuslabs.com/learn/0.7/guides/tools/configure)

### Dioxus.toml Configuration

The `Dioxus.toml` file controls project configuration:

```toml
[application]
name = "my-app"

[web.app]
base_path = ""

[bundle]
resources = ["main.css", "header.svg", "**/*.png"]
```

### Key Configuration Sections

- **`[application]`** — App name and general settings
- **`[web.app]`** — Web-specific settings (base_path for GitHub Pages, etc.)
- **`[bundle]`** — Bundle resources (files to include in the final bundle)

### Config Commands

```bash
# View current configuration
dx config get

# Set a configuration value
dx config set <key> <value>
```

## Formatting RSX

Automatically format RSX code:

```bash
dx fmt
```

## Checking the Project

Check for common issues:

```bash
dx check
```

## Doctor

Diagnose installed tools and system configuration:

```bash
dx doctor
```

This helps identify missing toolchains and tools required for cross-platform development.

## Self-Update

Update the Dioxus CLI:

```bash
dx self-update
```
