# Keywords

The following table lists the words that the Dart language reserves for its own use. These words can't be used as identifiers unless otherwise noted.

## Reserved Keywords

These keywords cannot be used as identifiers in any context:

| Keyword | Category |
|---------|----------|
| `assert` | Error handling |
| `break` | Loops |
| `case` | Branches |
| `catch` | Error handling |
| `class` | Classes |
| `const` | Variables |
| `continue` | Loops |
| `default` | Branches |
| `do` | Loops |
| `else` | Branches |
| `enum` | Enums |
| `extends` | Inheritance |
| `false` | Built-in types |
| `final` | Variables / Class modifiers |
| `finally` | Error handling |
| `for` | Loops |
| `if` | Branches |
| `in` | Loops |
| `is` | Operators |
| `new` | Classes |
| `null` | Variables |
| `rethrow` | Error handling |
| `return` | Functions |
| `super` | Inheritance |
| `switch` | Branches |
| `this` | Constructors |
| `throw` | Error handling |
| `true` | Built-in types |
| `try` | Error handling |
| `var` | Variables |
| `void` | Built-in types |
| `while` | Loops |
| `with` | Mixins |

## Built-in Identifiers

These can be used as identifiers in most contexts, but not as type names:

| Keyword | Category |
|---------|----------|
| `abstract` | Class modifiers |
| `as` | Operators |
| `covariant` | Type system |
| `dynamic` | Types |
| `export` | Libraries |
| `extension` | Extensions |
| `external` | Functions |
| `factory` | Constructors |
| `Function` | Functions |
| `get` | Methods |
| `hide` | Libraries |
| `implements` | Classes |
| `import` | Libraries |
| `interface` | Class modifiers |
| `library` | Libraries |
| `mixin` | Mixins |
| `operator` | Methods |
| `part` | Libraries |
| `required` | Functions |
| `set` | Methods |
| `show` | Libraries |
| `static` | Classes |
| `typedef` | Typedefs |

## Contextual Keywords

These are only keywords in specific contexts:

| Keyword | Context |
|---------|---------|
| `await` | Inside async functions |
| `yield` | Inside generator functions |
| `sync` | Generator function markers |
| `async` | Async function markers |
| `base` | Class modifiers (Dart 3.0+) |
| `sealed` | Class modifiers (Dart 3.0+) |
| `when` | Pattern guards |
| `of` | Package directives |
| `on` | Error handling / Mixin constraints |
| `late` | Variable declaration |
| `deferred` | Library imports |

## Limited Reserved Words

These can be used as identifiers in most contexts:

| Keyword | Notes |
|---------|-------|
| `type` | Used in extension types (Dart 3.4+) |

## Using Keywords as Identifiers

Even when allowed, using keywords as identifiers can confuse other developers and should be avoided. If you must use a keyword as an identifier, you can sometimes use it with a prefix or suffix.
