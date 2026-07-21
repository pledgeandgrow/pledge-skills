# Ionic CLI

> **Source:** https://ionicframework.com/docs/cli

The Ionic CLI is the command-line tool for developing Ionic apps. Built with TypeScript and Node.js.

---

## Installation

```bash
npm install -g @ionic/cli
```

Requires Node.js (latest LTS recommended). Supports Node 10.3+.

---

## Help

```bash
# General help
ionic --help

# Command-specific help
ionic <command> --help

# Subcommand help
ionic <command> <subcommand> --help
```

Some commands (like `ionic serve`) have context-sensitive help depending on project type (React vs Angular vs Vue).

---

## Core Commands

### ionic start

Create a new Ionic project.

```bash
ionic start [name] [template] [options]
```

**Templates:**
- `blank` — Single page blank app
- `tabs` — Tab-based navigation app
- `sidemenu` — Side menu navigation app
- `list` — List-based app

**Options:**
- `--type <type>` — Project type: `angular`, `react`, `vue`, `vue-standalone`
- `--no-deps` — Skip dependency installation
- `--no-git` — Skip git initialization

```bash
# Angular tabs app
ionic start myApp tabs --type angular

# React blank app
ionic start myApp blank --type react

# Vue sidemenu app
ionic start myApp sidemenu --type vue
```

### ionic serve

Start a local dev server.

```bash
ionic serve [options]
```

**Options:**
- `--port <port>` — Port to use (default: 8100)
- `--livereload` — Enable live reload (default: true)
- `--external` — Expose on all network interfaces
- `--lab` — Open Ionic Lab (side-by-side iOS/Android preview)

```bash
ionic serve --port 3000
ionic serve --lab
```

### ionic build

Build the web app for production.

```bash
ionic build [options]
```

**Options:**
- `--prod` — Production build
- `--engine <engine>` — Build engine: `browser`, `cordova`, `capacitor`

```bash
ionic build --prod
```

### ionic generate

Generate pages, components, directives, etc. (Angular only)

```bash
ionic generate [type] [name]
# or
ionic g [type] [name]
```

**Types:**
- `page` — Page component
- `component` — Standalone component
- `directive` — Custom directive
- `service` — Service class
- `module` — NgModule
- `guard` — Route guard
- `pipe` — Custom pipe

```bash
ionic g page UserDetail
ionic g component UserProfile
```

### ionic capacitor

Capacitor integration commands.

```bash
# Add native platform
ionic capacitor add
ionic capacitor add ios
ionic capacitor add android

# Copy web build to native project
ionic capacitor copy
ionic capacitor copy ios
ionic capacitor copy android

# Open native IDE
ionic capacitor open
ionic capacitor open ios    # Opens Xcode
ionic capacitor open android # Opens Android Studio

# Sync (copy + update native plugins)
ionic capacitor sync
ionic capacitor sync ios

# Run on native platform
ionic capacitor run
ionic capacitor run ios
ionic capacitor run android
```

### ionic cordova

Cordova integration commands (legacy).

```bash
ionic cordova build <platform>
ionic cordova run <platform>
ionic cordova emulate <platform>
ionic cordova plugin add <plugin>
```

---

## Configuration

### Global Config

Global config is stored in `~/.ionic/config.json`.

### Project Config

Project-level config is in `ionic.config.json` in the project root.

```json
{
  "name": "myApp",
  "integrations": {
    "capacitor": {}
  },
  "type": "angular"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `IONIC_CONFIG_DIRECTORY` | Override config directory (default: `~/.ionic`) |
| `IONIC_HTTP_PROXY` | HTTP proxy for CLI requests |
| `IONIC_TOKEN` | Appflow authentication token |
| `IONIC_EMAIL` | Appflow account email |
| `IONIC_PASSWORD` | Appflow account password |

---

## Troubleshooting

- **Check CLI version:** `ionic --version` (CLI version ≠ Framework version)
- **Update CLI:** `npm install -g @ionic/cli@latest`
- **Debug output:** `ionic <command> --verbose`
- **Proxy issues:** See [Using a Proxy](https://ionicframework.com/docs/cli/using-a-proxy)
- **Config reset:** Delete `~/.ionic` directory (loses all config including sessions)

---

## Ionic Lab

Ionic Lab is a desktop app for running Ionic apps side-by-side with iOS and Android previews. Accessible via:

```bash
ionic serve --lab
```

---

## Appflow

Ionic Appflow is a paid service for continuous integration, live deployments, and app publishing. Features:

- **Ionic Build** — Automated native builds in the cloud
- **Ionic Deploy** — Live app updates without app store releases
- **Ionic Package** — Binary builds for iOS and Android
- **Ionic Monitor** — Runtime error monitoring

```bash
# Link project to Appflow
ionic link --pro-id <app-id>

# Deploy a live update
ionic deploy build
```

---

## Project Structure

```
src/
├── app/              # App code (pages, components, services)
├── assets/           # Static assets (images, fonts)
├── environments/     # Environment config
├── theme/            # Theme variables and CSS
├── global.scss       # Global styles
├── index.html        # HTML entry point
├── main.ts           # App bootstrap
└── polyfills.ts      # Polyfills
```

### Generating Features (Angular)

```bash
# Interactive prompt
ionic generate

# Direct command
ionic g page "User Detail"
ionic g component "UserProfile"
ionic g service "UserService"

# Nested paths
ionic g component "portfolio/intro/About Me"
```

The CLI uses the underlying framework tooling (Angular CLI for `@ionic/angular`). After creating files, it also updates router configuration automatically.
