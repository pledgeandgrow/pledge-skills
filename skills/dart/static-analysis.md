# Static Analysis

Static analysis allows you to find problems before executing a single line of code. It's a powerful tool used to prevent bugs and ensure that code conforms to style guidelines.

## The Analyzer

The Dart analyzer can find:
- Simple typos (e.g., accidental semicolons)
- More subtle problems (e.g., unclosed sinks)
- Type errors
- Style violations
- Potential bugs

```dart
// The analyzer catches this:
void increment() {
  if (count < 10) ;
  count++;
}
// info - Unnecessary empty statement. - empty_statements
```

## analysis_options.yaml

Customize analysis behavior with an `analysis_options.yaml` file at the project root:

```yaml
include: package:lints/recommended.yaml

analyzer:
  exclude:
    - 'build/**'
    - '**/*.g.dart'
    - '**/*.freezed.dart'
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
  errors:
    todo: ignore
    deprecated_member_use: warning
    invalid_annotation_target: ignore
  strong-mode:
    # Deprecated in favor of language: settings

linter:
  rules:
    - avoid_print
    - prefer_const_constructors
    - prefer_final_locals
    - require_trailing_commas
```

## Linter Rules

### Using Presets

```yaml
# Minimal rules
include: package:lints/core.yaml

# Recommended rules
include: package:lints/recommended.yaml

# Flutter rules
include: package:flutter_lints/flutter.yaml
```

### Enabling Individual Rules

```yaml
linter:
  rules:
    - avoid_print
    - avoid_empty_else
    - avoid_relative_lib_imports
    - prefer_const_constructors
    - prefer_final_locals
    - prefer_single_quotes
    - require_trailing_commas
    - sort_child_properties_last
    - unawaited_futures
    - use_key_in_widget_constructors
```

### Disabling Rules

```yaml
analyzer:
  errors:
    avoid_print: ignore
    deprecated_member_use: warning
```

## In-Source Comments

### Ignore a Rule

```dart
// ignore: avoid_print
print('debug message');

// ignore_for_file: avoid_print
// Ignores the rule for the entire file
```

### Ignore Multiple Rules

```dart
// ignore: avoid_print, prefer_const_constructors
print('debug');
```

### Ignore for a Section

```dart
// ignore_for_file: avoid_print
void main() {
  print('Hello');
  print('World');
}
```

## Strict Mode Options

### strict-casts

Ensures that the analyzer reports errors for implicit casts:

```yaml
analyzer:
  language:
    strict-casts: true
```

### strict-inference

Ensures that the analyzer reports errors when it can't infer a type:

```yaml
analyzer:
  language:
    strict-inference: true
```

### strict-raw-types

Ensures that the analyzer reports errors for raw generic types:

```yaml
analyzer:
  language:
    strict-raw-types: true
```

## Common Linter Rules

### Style Rules

| Rule | Description |
|------|-------------|
| `prefer_single_quotes` | Prefer single quotes for strings |
| `prefer_const_constructors` | Prefer const constructors |
| `prefer_final_locals` | Prefer final for local variables |
| `require_trailing_commas` | Require trailing commas |
| `prefer_relative_imports` | Prefer relative imports |
| `avoid_print` | Avoid print() in production code |
| `unawaited_futures` | Await or explicitly ignore futures |

### Error Prevention Rules

| Rule | Description |
|------|-------------|
| `avoid_empty_else` | Avoid empty else blocks |
| `avoid_relative_lib_imports` | Avoid relative imports of files in lib/ |
| `cancel_subscriptions` | Cancel StreamSubscriptions |
| `close_sinks` | Close Sink instances |
| `unawaited_futures` | Don't forget to await futures |
| `use_key_in_widget_constructors` | Use Key in widget constructors |

### Documentation Rules

| Rule | Description |
|------|-------------|
| `public_member_api_docs` | Document public members |
| `comment_references` | Use [] for code references in comments |

## Diagnostic Messages

View all diagnostic messages with explanations:

```bash
dart analyze --diagnostics
```

Or visit [Diagnostic messages](https://dart.dev/tools/diagnostic-messages) online.

## Analyzer Plugins

The analyzer supports plugins for custom lint rules:

```yaml
analyzer:
  plugins:
    - custom_lint
```

## Configuring dart format

```yaml
# In analysis_options.yaml
formatter:
  page_width: 80
```

Or via command line:

```bash
dart format -l 100 .
```

## Running Analysis

```bash
# Analyze the project
dart analyze

# Analyze specific directory
dart analyze lib/

# Treat infos as fatal
dart analyze --fatal-infos

# Treat warnings as fatal
dart analyze --fatal-warnings

# Output as JSON
dart analyze --json
```

## IDE Integration

The analyzer runs automatically in supported IDEs:
- VS Code (Dart extension)
- Android Studio / IntelliJ (Dart plugin)
- Any LSP-capable editor

Issues are highlighted inline with quick-fix suggestions.
