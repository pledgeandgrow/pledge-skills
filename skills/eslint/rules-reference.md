# ESLint — Rules Reference

> ESLint has hundreds of built-in rules organized into categories. Rules can have fixes (automatic), suggestions (manual), or neither.

**Full Rules Reference**: [eslint.org/docs/latest/rules/](https://eslint.org/docs/latest/rules/)

## Rule Categories

### Possible Problems

These rules relate to possible logic errors in code:

| Rule | Description | Fix | Suggestions |
|------|-------------|-----|-------------|
| `array-callback-return` | Enforce return statements in callbacks of array methods | — | — |
| `constructor-super` | Require `super()` calls in constructors | — | — |
| `for-direction` | Enforce for loop update clause moving counter in right direction | — | — |
| `getter-return` | Enforce return statements in getters | — | — |
| `no-async-promise-executor` | Disallow async function as Promise executor | — | — |
| `no-await-in-loop` | Disallow `await` inside of loops | — | — |
| `no-class-assign` | Disallow reassigning class members | — | — |
| `no-compare-neg-zero` | Disallow comparing against -0 | Fix | — |
| `no-cond-assign` | Disallow assignment in conditional expressions | — | — |
| `no-const-assign` | Disallow reassigning const variables | — | — |
| `no-constant-binary-expression` | Disallow expressions where operation doesn't affect value | — | — |
| `no-constant-condition` | Disallow constant expressions in conditions | — | — |
| `no-constructor-return` | Disallow returning value from constructor | — | — |
| `no-control-regex` | Disallow control characters in regex | — | — |
| `no-debugger` | Disallow the use of `debugger` | — | — |
| `no-dupe-args` | Disallow duplicate arguments in function definitions | — | — |
| `no-dupe-class-members` | Disallow duplicate class members | — | — |
| `no-dupe-else-if` | Disallow duplicate conditions in if-else-if chains | — | — |
| `no-dupe-keys` | Disallow duplicate keys in object literals | — | — |
| `no-duplicate-case` | Disallow duplicate case labels | — | — |
| `no-duplicate-imports` | Disallow duplicate module imports | — | — |
| `no-empty-character-class` | Disallow empty character classes in regex | — | — |
| `no-empty-pattern` | Disallow empty destructuring patterns | — | — |
| `no-ex-assign` | Disallow reassigning exceptions in catch clauses | — | — |
| `no-fallthrough` | Disallow fallthrough of case statements | — | — |
| `no-func-assign` | Disallow reassigning function declarations | — | — |
| `no-import-assign` | Disallow assigning to imported bindings | — | — |
| `no-inner-declarations` | Disallow variable/function declarations in nested blocks | — | — |
| `no-invalid-regexp` | Disallow invalid regex strings in RegExp constructors | — | — |
| `no-irregular-whitespace` | Disallow irregular whitespace | — | — |
| `no-loss-of-precision` | Disallow number literals that lose precision | — | — |
| `no-misleading-comparison` | Disallow misleading comparisons | — | — |
| `no-new-native-nonconstructor` | Disallow `new` with native non-constructors | — | — |
| `no-new-wrappers` | Disallow `new` with `String`, `Number`, `Boolean` | — | — |
| `no-obj-calls` | Disallow calling global object properties as functions | — | — |
| `no-prototype-builtins` | Disallow calling `Object.prototype` methods directly | — | — |
| `no-self-assign` | Disallow self-assignment | Fix | — |
| `no-self-compare` | Disallow comparing a variable to itself | — | — |
| `no-setter-return` | Disallow returning from setters | — | — |
| `no-sparse-arrays` | Disallow sparse arrays | — | — |
| `no-template-curly-in-string` | Disallow template literal placeholders in strings | — | — |
| `no-this-before-super` | Disallow `this`/`super` before `super()` | — | — |
| `no-unsafe-finally` | Disallow control flow in `finally` blocks | — | — |
| `no-unsafe-negation` | Disallow negation of left operand in binary expressions | Fix | — |
| `no-unsafe-optional-chaining` | Disallow unsafe optional chaining | — | — |
| `no-unused-private-class-members` | Disallow unused private class members | — | — |
| `no-unused-vars` | Disallow unused variables | Fix | Suggestions |
| `no-use-before-define` | Disallow use of variables before definition | — | — |
| `no-useless-assignment` | Disallow useless assignments | — | — |
| `no-useless-backreference` | Disallow useless backreferences in regex | — | — |
| `no-useless-catch` | Disallow useless `catch` clauses | — | — |
| `no-useless-escape` | Disallow unnecessary escape characters | Fix | — |
| `no-useless-reach` | Disallow unreachable code | — | — |
| `no-with` | Disallow `with` statements | — | — |
| `require-yield` | Require `yield` in generator functions | — | — |
| `use-isnan` | Require `isNaN()` for NaN checks | Fix | — |
| `valid-typeof` | Enforce valid `typeof` comparisons | Fix | — |

### Suggestions

These rules suggest alternate ways of doing things:

| Rule | Description | Status |
|------|-------------|--------|
| `accessor-pairs` | Enforce getter/setter pairs in objects and classes | — |
| `arrow-body-style` | Require braces around arrow function bodies | Frozen |
| `block-scoped-var` | Enforce use of variables within scope | — |
| `camelcase` | Enforce camelcase naming convention | Frozen |
| `capitalized-comments` | Enforce/disallow capitalization of first letter of comments | Frozen |
| `class-methods-use-this` | Enforce class methods utilize `this` | — |
| `complexity` | Enforce maximum cyclomatic complexity | — |
| `consistent-return` | Require return statements to always/never specify values | — |
| `consistent-this` | Enforce consistent naming for `this` capture | Frozen |
| `curly` | Enforce consistent brace style for control statements | Frozen |
| `default-case` | Require default cases in switch statements | — |
| `default-case-last` | Enforce default clauses to be last | — |
| `default-param-last` | Enforce default parameters to be last | Frozen |
| `dot-notation` | Enforce dot notation whenever possible | Frozen |
| `eqeqeq` | Require `===` and `!==` | — |
| `func-name-matching` | Require function names to match variable/property name | Frozen |
| `func-names` | Require/disallow named function expressions | — |
| `func-style` | Enforce function declarations or expressions | Frozen |
| `grouped-accessor-pairs` | Require grouped accessor pairs | — |
| `guard-for-in` | Require `if` in `for-in` loops | — |
| `id-denylist` | Disallow specified identifiers | Frozen |
| `id-length` | Enforce min/max identifier lengths | Frozen |
| `id-match` | Require identifiers to match a regex | Frozen |
| `init-declarations` | Require/disallow initialization in variable declarations | Frozen |
| `logical-assignment-operators` | Require/disallow logical assignment shorthand | Frozen |
| `max-classes-per-file` | Enforce max classes per file | — |
| `max-depth` | Enforce max block nesting depth | — |
| `max-lines` | Enforce max lines per file | — |
| `max-lines-per-function` | Enforce max lines per function | — |
| `max-nested-callbacks` | Enforce max nested callbacks | — |
| `max-params` | Enforce max function parameters | — |
| `max-statements` | Enforce max statements in function | — |
| `multiline-comment-style` | Enforce multiline comment style | Frozen |
| `new-cap` | Require `new` for constructors | Frozen |
| `no-alert` | Disallow `alert`, `confirm`, `prompt` | — |
| `no-array-constructor` | Disallow `Array` constructor | — |
| `no-bitwise` | Disallow bitwise operators | — |
| `no-caller` | Disallow `arguments.caller`/`arguments.callee` | — |
| `no-case-declarations` | Disallow lexical declarations in case clauses | — |
| `no-confusing-arrow` | Disallow confusing arrow functions | Frozen |
| `no-console` | Disallow `console` | — |
| `no-continue` | Disallow `continue` | — |
| `no-delete-var` | Disallow deleting variables | — |
| `no-div-regex` | Disallow division operators at start of regex | — |
| `no-dupe-keys` | Disallow duplicate keys | — |
| `no-duplicate-imports` | Disallow duplicate imports | — |
| `no-else-return` | Disallow `else` after `return` | — |
| `no-empty` | Disallow empty block statements | — |
| `no-empty-function` | Disallow empty functions | — |
| `no-eq-null` | Disallow `== null` | — |
| `no-eval` | Disallow `eval` | — |
| `no-extend-native` | Disallow extending native objects | — |
| `no-extra-bind` | Disallow unnecessary `.bind()` | — |
| `no-extra-boolean-cast` | Disallow unnecessary boolean casts | — |
| `no-extra-label` | Disallow unnecessary labels | — |
| `no-floating-decimal` | Disallow leading/trailing decimals | Frozen |
| `no-global-assign` | Disallow global object assignment | — |
| `no-implicit-coercion` | Disallow shorthand type conversions | Frozen |
| `no-implicit-globals` | Disallow implicit globals | — |
| `no-implied-eval` | Disallow `setTimeout`/`setInterval` with string arg | — |
| `no-inline-comments` | Disallow inline comments | Frozen |
| `no-invalid-this` | Disallow `this` outside class/method | — |
| `no-iterator` | Disallow `__iterator__` | — |
| `no-label-var` | Disallow labels with variable name | — |
| `no-labels` | Disallow labeled statements | — |
| `no-lone-blocks` | Disallow unnecessary blocks | — |
| `no-loop-func` | Disallow functions in loops | — |
| `no-magic-numbers` | Disallow magic numbers | Frozen |
| `no-multi-assign` | Disallow chained assignment | Frozen |
| `no-multi-str` | Disallow multiline strings | — |
| `no-negated-condition` | Disallow negated conditions | Frozen |
| `no-nested-ternary` | Disallow nested ternary expressions | Frozen |
| `no-new` | Disallow `new` for side effects | — |
| `no-new-func` | Disallow `new Function()` | — |
| `no-new-object` | Disallow `Object` constructor | — |
| `no-new-wrappers` | Disallow `new` with wrapper objects | — |
| `no-nonoctal-decimal-escape` | Disallow `\8`/`\9` escape | — |
| `no-octal` | Disallow octal literals | — |
| `no-octal-escape` | Disallow octal escapes | — |
| `no-param-reassign` | Disallow reassigning function parameters | — |
| `no-plusplus` | Disallow `++`/`--` | Frozen |
| `no-proto` | Disallow `__proto__` | — |
| `no-redeclare` | Disallow variable redeclaration | — |
| `no-regex-spaces` | Disallow multiple spaces in regex | — |
| `no-restricted-exports` | Disallow specified names in exports | — |
| `no-restricted-globals` | Disallow specified global variables | — |
| `no-restricted-imports` | Disallow specified modules | — |
| `no-restricted-properties` | Disallow specified object properties | — |
| `no-restricted-syntax` | Disallow specified syntax | — |
| `no-return-assign` | Disallow assignment in `return` | — |
| `no-return-await` | Disallow `return await` | — |
| `no-script-url` | Disallow `javascript:` URLs | — |
| `no-sequences` | Disallow comma sequences | — |
| `no-shadow` | Disallow variable shadowing | — |
| `no-shadow-restricted-names` | Disallow shadowing of restricted names | — |
| `no-ternary` | Disallow ternary operators | Frozen |
| `no-throw-literal` | Disallow throwing non-Error objects | — |
| `no-undef-init` | Disallow `undefined` initialization | Frozen |
| `no-undefined` | Disallow `undefined` | Frozen |
| `no-underscore-dangle` | Disallow dangling underscores | Frozen |
| `no-unmodified-loop-condition` | Disallow unmodified loop conditions | — |
| `no-unneeded-ternary` | Disallow unnecessary ternary | Frozen |
| `no-unreachable-loop` | Disallow loops with no iteration | — |
| `no-unsanitized` | Disallow unsafe HTML/method usage | — |
| `no-unused-expressions` | Disallow unused expressions | — |
| `no-unused-labels` | Disallow unused labels | — |
| `no-useless-call` | Disallow unnecessary `.call()`/`.apply()` | — |
| `no-useless-catch` | Disallow useless catch | — |
| `no-useless-computed-key` | Disallow unnecessary computed keys | Frozen |
| `no-useless-concat` | Disallow unnecessary concatenation | — |
| `no-useless-constructor` | Disallow unnecessary constructors | — |
| `no-useless-rename` | Disallow unnecessary renaming | Frozen |
| `no-useless-return` | Disallow useless return | — |
| `no-var` | Disallow `var` | — |
| `no-void` | Disallow `void` operator | Frozen |
| `no-warning-comments` | Disallow warning comments | Frozen |
| `no-with` | Disallow `with` | — |
| `object-shorthand` | Require object shorthand | Frozen |
| `one-var` | Enforce variables per declaration | Frozen |
| `one-var-declaration-per-line` | Require one var per line | Frozen |
| `operator-assignment` | Require operator shorthand | Frozen |
| `prefer-arrow-callback` | Require arrow callbacks | Frozen |
| `prefer-const` | Require `const` for never-reassigned | — |
| `prefer-destructuring` | Require destructuring | Frozen |
| `prefer-exponentiation-operator` | Require `**` over `Math.pow` | Frozen |
| `prefer-named-capture-group` | Require named capture groups | Frozen |
| `prefer-numeric-literals` | Require numeric literals | Frozen |
| `prefer-object-has-own` | Require `Object.hasOwn()` | — |
| `prefer-object-spread` | Require object spread over `Object.assign` | Frozen |
| `prefer-promise-reject-errors` | Require Error objects in rejects | — |
| `prefer-regex-literals` | Require regex literals | Frozen |
| `prefer-rest-params` | Require `...args` over `arguments` | Frozen |
| `prefer-spread` | Require spread over `.apply()` | Frozen |
| `prefer-template` | Require template literals | Frozen |
| `quote-props` | Require consistent quoted props | Frozen |
| `quotes` | Enforce consistent quotes | Frozen |
| `radix` | Require radix in `parseInt` | Frozen |
| `require-await` | Require `await` in async functions | — |
| `require-unicode-regexp` | Require `u` flag in regex | Frozen |
| `require-yield` | Require `yield` in generators | — |
| `sort-imports` | Enforce sorted imports | Frozen |
| `sort-keys` | Enforce sorted object keys | Frozen |
| `sort-vars` | Enforce sorted variables | Frozen |
| `spaced-comment` | Enforce spacing in comments | Frozen |
| `strict` | Require/disallow strict mode | — |
| `symbol-description` | Require symbol descriptions | Frozen |
| `unicode-bom` | Require/disallow BOM | — |
| `use-isnan` | Require `isNaN()` | — |
| `valid-typeof` | Enforce valid `typeof` | — |
| `vars-on-top` | Require vars at top of scope | Frozen |
| `yoda` | Disallow Yoda conditions | Frozen |

### Layout & Formatting

These rules relate to code layout and formatting (most are deprecated and moved to `@stylistic/eslint-plugin`):

Key non-deprecated layout rules:
- `unicode-bom` — Require/disallow BOM

### Deprecated Rules

Deprecated rules have been moved to external packages:
- **Stylistic rules** → [@stylistic/eslint-plugin](https://eslint.style) (e.g. `semi`, `indent`, `comma-dangle`, `quotes`, `arrow-parens`, `brace-style`, etc.)
- **Node.js rules** → [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) (e.g. `callback-return`, `global-require`, `handle-callback-err`, etc.)

### Removed Rules

Rules that have been completely removed from ESLint.

## Rule Metadata Indicators

- **Fix** — rule can auto-fix problems (`--fix`)
- **Suggestions** — rule provides suggestions (manual apply)
- **Extends** — rule is included in `js/recommended` config
- **Frozen** — rule won't be changed (no new features)
- **Deprecated** — rule is deprecated, use external package instead

## Configuring Rules

```js
// In eslint.config.js
{
  rules: {
    // Severity only
    "no-console": "off",
    "eqeqeq": "warn",
    "no-debugger": "error",

    // With options
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "no-unused-vars": ["warn", { "args": "none", "vars": "all" }],
    "max-lines": ["warn", { "max": 300, "skipBlankLines": true }],
    "complexity": ["warn", { "max": 10 }],
  },
}
```

```js
// Inline configuration comments
/* eslint eqeqeq: "off" */
/* eslint semi: ["error", "always"] */
/* eslint-disable no-console */
/* eslint-enable no-console */
/* eslint-disable-next-line no-unused-vars */
// eslint-disable-line no-unused-vars
```
