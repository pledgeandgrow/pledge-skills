# Prettier — Getting Started

## Install

First, install Prettier locally:

```bash
npm install --save-dev --save-exact prettier
```

Pin an exact version — even a patch release can result in slightly different formatting.

Then, create an empty config file to let editors and other tools know you are using Prettier:

```bash
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
```

Next, create a `.prettierignore` file to let the Prettier CLI and editors know which files to not format:

```bash
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

Prettier will follow rules specified in `.gitignore` if it exists in the same directory from which it is run.

Now, format all files with Prettier:

```bash
npx prettier . --write
```

You can format specific directories or files:

```bash
prettier --write app/
prettier --write app/components/Button.js
prettier --write "app/**/*.test.js"
```

If you have a CI setup, run the following to make sure everyone runs Prettier:

```bash
npx prettier . --check
```

### Set up your editor

Formatting from the command line is a good way to get started, but you get the most from Prettier by running it from your editor, either via a keyboard shortcut or automatically whenever you save a file.

See Editor Integration for how to set up your editor. If your editor does not support Prettier, you can run Prettier with a file watcher.

Don't skip the regular local install! Editor plugins will pick up your local version of Prettier, making sure you use the correct version in every project.

### ESLint (and other linters)

If you use ESLint, install `eslint-config-prettier` to make ESLint and Prettier play nice with each other. It turns off all ESLint rules that are unnecessary or might conflict with Prettier.

```bash
npm install --save-dev eslint-config-prettier
```

There's a similar config for Stylelint: `stylelint-config-prettier`.

### Git hooks

Many people like to run Prettier as a pre-commit hook. Install husky and lint-staged:

```bash
npm install --save-dev husky lint-staged
npx husky init
node --eval "fs.writeFileSync('.husky/pre-commit','npx lint-staged\n')"
```

Add the following to your `package.json`:

```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

If you use ESLint, make sure lint-staged runs it before Prettier, not after.

### Summary

To summarize:

1. Install an exact version of Prettier locally in your project
2. Add a `.prettierrc` to let your editor know you are using Prettier
3. Add a `.prettierignore` to let your editor know which files not to touch
4. Run `prettier --check .` in CI to make sure your project stays formatted
5. Run Prettier from your editor for the best experience
6. Use `eslint-config-prettier` to make Prettier and ESLint play nice together
7. Set up a pre-commit hook to make sure every commit is formatted

**Source**: [Install](https://prettier.io/docs/install)

---

## Ignoring Code

### Ignoring Files: .prettierignore

To exclude files from formatting, create a `.prettierignore` file in the root of your project. It uses [gitignore syntax](https://git-scm.com/docs/gitignore).

Example:

```
# Ignore artifacts:
build
coverage
# Ignore all HTML files:
**/*.html
```

By default Prettier ignores files in version control directories (`.git`, `.jj`, `.sl`, `.svn`, `.hg`) and `node_modules` (unless `--with-node-modules` is specified). Prettier will also follow rules in `.gitignore` if it exists.

### JavaScript

A `// prettier-ignore` comment will exclude the next node in the abstract syntax tree from formatting.

```javascript
// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
);
```

### JSX

```jsx
<div>
  {/* prettier-ignore */}
  <span ugly format='' />
</div>
```

### HTML

```html
<!-- prettier-ignore -->
<div class="x" >hello world</div >

<!-- prettier-ignore-attribute -->
<div (mousedown)=" onStart ( ) " (mouseup)=" onEnd ( ) "></div>

<!-- prettier-ignore-attribute (mouseup) -->
<div (mousedown)="onStart()" (mouseup)=" onEnd ( ) "></div>
```

### CSS

```css
/* prettier-ignore */
.my ugly rule {}
```

### Markdown

```markdown
<!-- prettier-ignore -->
Do not format this
```

#### Range Ignore (Markdown)

In Markdown, you can use `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->` to ignore a range of lines.

### YAML

```yaml
# prettier-ignore
key : value
hello: world
```

### GraphQL

```graphql
{
  # prettier-ignore
  addReaction(input:{superLongInputFieldName:"MDU6SXNzdWUyMzEzOTE1NTE=",content:HOORAY}) {
    reaction {content}
  }
}
```

### Handlebars

```handlebars
{{! prettier-ignore }}
<div> "hello! my parent was ignored" </div>
```

### Command Line File Patterns

For one-off commands, negative patterns can exclude files without adding them to `.prettierignore`:

```bash
prettier . "!**/*.{js,jsx,vue}" --write
```

**Source**: [Ignoring Code](https://prettier.io/docs/ignore)

---

## Editor Integration

To get the most out of Prettier, it's recommended to run it from your editor.

### Visual Studio Code

Install `prettier-vscode` from the extension sidebar — it's called "Prettier - Code formatter." See the [repository](https://github.com/prettier/prettier-vscode) for configuration and shortcuts.

To toggle the formatter on and off, install `vscode-status-bar-format-toggle`.

### Emacs

Use `prettier-emacs`, `prettier.el`, or [Apheleia](https://github.com/raxod502/apheleia) (supports multiple code formatters including Prettier).

### Vim

`vim-prettier` is a Prettier-specific Vim plugin. `Neoformat`, `ALE`, and `coc-prettier` are multi-language Vim linter/formatter plugins that support Prettier.

### Helix

A formatter can be specified in your [Helix language configuration](https://docs.helix-editor.com/languages.html), which will take precedence over any language servers.

### Sublime Text

Support is available through Package Control and the [JsPrettier](https://packagecontrol.io/packages/JsPrettier) plug-in.

### JetBrains WebStorm, PHPStorm, PyCharm...

WebStorm comes with built-in support for Prettier. For other JetBrains IDEs (IntelliJ IDEA, PhpStorm, PyCharm), install the [Prettier plugin](https://plugins.jetbrains.com/plugin/10456-prettier) from Preferences / Settings | Plugins.

**Usage:**

- Use **Reformat with Prettier** action (`Opt+Shift+Cmd+P` on macOS or `Alt+Shift+Ctrl+P` on Windows/Linux) to format selected code, a file, or a directory.
- Configure WebStorm to run Prettier on save (`Cmd+S`/`Ctrl+S`) or as the default formatter (`Opt+Cmd+L`/`Ctrl+Alt+L`) in Preferences / Settings | Languages & Frameworks | JavaScript | Prettier.

By default, WebStorm applies formatting to all `.js`, `.ts`, `.jsx`, and `.tsx` files you've edited. Customize with [glob patterns](https://github.com/isaacs/node-glob) for other file types or specific directories.

See [WebStorm online help](https://www.jetbrains.com/help/webstorm/prettier.html) for more.

**Source**: [WebStorm Setup](https://prettier.io/docs/webstorm)

### Vim Setup

#### vim-prettier

See the [vim-prettier](https://github.com/prettier/vim-prettier) readme for installation and usage instructions.

#### Neoformat

Install with a plugin manager like [vim-plug](https://github.com/junegunn/vim-plug):

```vim
Plug 'sbdchd/neoformat'
```

To use a project-local Prettier version:

```vim
let g:neoformat_try_node_exe = 1
```

Run `:Neoformat` or `:Neoformat prettier` in a supported file. Format on save:

```vim
autocmd BufWritePre *.js Neoformat
```

Format on more events (TextChanged, InsertLeave):

```vim
autocmd BufWritePre,TextChanged,InsertLeave *.js Neoformat
```

Options in `.vimrc`:

```vim
autocmd FileType javascript setlocal formatprg=prettier\ --single-quote\ --trailing-comma\ es5
let g:neoformat_try_formatprg = 1
```

#### ALE

Requires Vim 8 or Neovim. Install with vim-plug:

```vim
Plug 'dense-analysis/ale'
```

Enable the Prettier fixer:

```vim
let g:ale_fixers = {
\ 'javascript': ['prettier'],
\ 'css': ['prettier'],
\}
```

Run `:ALEFix` to format. Format on save:

```vim
let g:ale_fix_on_save = 1
```

To only run explicitly configured linters:

```vim
let g:ale_linters_explicit = 1
```

Options in `.vimrc`:

```vim
let g:ale_javascript_prettier_options = '--single-quote --trailing-comma all'
```

#### coc-prettier

Install coc.nvim and coc-prettier:

```vim
Plug 'neoclide/coc.nvim', {'branch': 'release'}
```

```vim
:CocInstall coc-prettier
```

Setup Prettier command:

```vim
command! -nargs=0 Prettier :call CocAction('runCommand', 'prettier.formatFile')
```

Format on save in `coc-settings.json`:

```json
{
  "coc.preferences.formatOnSaveFiletypes": ["css", "markdown"]
}
```

#### Running manually

Create a custom key binding (e.g. `gp`):

```vim
nnoremap gp :silent %!prettier --stdin-filepath %<CR>
```

Note: syntax errors will replace the whole buffer with an error message (press `u` to undo). Cursor position is not preserved.

**Source**: [Vim Setup](https://prettier.io/docs/vim)

### Visual Studio

Install the [JavaScript Prettier extension](https://github.com/madskristensen/JavaScriptPrettier).

### Espresso

Install the [espresso-prettier](https://github.com/eablokker/espresso-prettier) plugin.

**Source**: [Editor Integration](https://prettier.io/docs/editors)

---

## Watching For Changes

You can have Prettier watch for changes from the command line by using [onchange](https://www.npmjs.com/package/onchange):

```bash
npx onchange "**/*" -- npx prettier --write --ignore-unknown {{changed}}
```

Or add the following to your `package.json`:

```json
{
  "scripts": {
    "prettier-watch": "onchange \"**/*\" -- prettier --write --ignore-unknown {{changed}}"
  }
}
```

**Source**: [Watching For Changes](https://prettier.io/docs/watching-files)
