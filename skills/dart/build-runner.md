# build_runner

A tool for building, testing, and running Dart code.

## Overview

The `build_runner` package provides general-purpose commands for generating files, including testing the generated files or serving both source and generated files.

If you're a web developer, use the `webdev` tool to build and serve web apps.

The `build_runner` commands work with **builders** — packages that use the Dart build system to generate output files from input files. For example, the `json_serializable` and `built_value_generator` packages define builders that generate Dart code.

Although the Dart build system is a good alternative to reflection (which has performance issues) and macros (which Dart's compilers don't support), it can do more than just read and write Dart code. For example, the `sass_builder` package implements a builder that generates `.css` files from `.scss` and `.sass` files.

## Setup

Add `build_runner` as a dev dependency:

```yaml
dev_dependencies:
  # ...
  build_runner: ^2.15.0
  build_test: ^3.5.15
```

Then run:

```bash
$ dart pub get
```

## Commands

### build

Performs a one-time build:

```bash
$ dart run build_runner build
```

### watch

Launches a build server that watches for edits to input files. Responds to changes by performing incremental rebuilds:

```bash
$ dart run build_runner watch
```

### serve

Runs a development server. Instead of directly using this command, you can use `webdev serve`, which has convenient default behavior:

```bash
$ dart run build_runner serve
```

### test

Runs tests:

```bash
$ dart run build_runner test
```

## Common builders

- **`json_serializable`** — Generates JSON serialization code
- **`built_value_generator`** — Generates value classes
- **`freezed`** — Generates union/sealed classes
- **`riverpod_generator`** — Generates Riverpod providers
- **`drift_dev`** — Generates drift database code
- **`sass_builder`** — Generates CSS from SCSS/SASS

## Using with json_serializable

Example `build.yaml` configuration:

```yaml
targets:
  $default:
    builders:
      json_serializable:
        options:
          explicit_to_json: true
          field_rename: snake
```

Run the build:

```bash
$ dart run build_runner build --delete-conflicting-outputs
```

## Tips

- Use `--delete-conflicting-outputs` to automatically delete conflicting outputs
- Use `watch` during development for incremental rebuilds
- Add generated files to `.gitignore` (typically `*.g.dart`) or commit them depending on your workflow
- Run `dart run build_runner build --delete-conflicting-outputs` after adding new dependencies
