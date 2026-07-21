# Prettier — Technical Details & Enterprise

## Technical Details

Prettier's printer is a fork of recast's printer with its algorithm replaced by the one described by Wadler in "[A prettier printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)".

### How it works

The printer takes an AST and returns an intermediate representation (IR) of the output, then uses that to generate a string. The advantage is that the printer can "measure" the IR and see if the output is going to fit on a line, and break if not.

Most of the logic of printing an AST involves generating an abstract representation of the output involving certain commands. For example, `["(", line, arg, line, ")"]` would represent a concatenation of opening parens, an argument, and closing parens. If that doesn't fit on one line, the printer can break where `line` is specified.

### Doc Explorer

The [Playground](https://prettier.io/playground) has a special mode for exploring how Prettier's intermediate representation is printed. Open the sidebar (the "Show options" button) and set the parser option to the special value `doc-explorer`.

More details can be found in [commands.md](https://github.com/prettier/prettier/blob/main/commands.md).

**Source**: [Technical Details](https://prettier.io/docs/technical-details)

---

## For Enterprise

Prettier is available as part of the Tidelift Subscription — a managed open source subscription for application dependencies.

### What's included

- **Security updates**: Tidelift's security response team coordinates patches for new breaking security vulnerabilities and alerts immediately through a private channel.
- **Licensing verification and indemnification**: Tidelift verifies license information for easy policy enforcement and adds intellectual property indemnification. You get a 100% up-to-date bill of materials for your dependencies.
- **Maintenance and code improvement**: Tidelift ensures the software you rely on keeps working. Managed dependencies are actively maintained and additional maintainers are recruited where required.
- **Package selection and version guidance**: Help choosing the best open source packages and guidance through updates.
- **Roadmap input**: Take a seat at the table with the creators behind the software you use.
- **Tooling and cloud integration**: Tidelift works with GitHub, GitLab, BitBucket, and more. Supports every cloud platform.

[Learn more](https://tidelift.com/subscription/pkg/npm-prettier) | [Request a demo](https://tidelift.com/subscription/request-a-demo)

**Source**: [For Enterprise](https://prettier.io/docs/for-enterprise)
