# ESLint — Contribute & Maintain

> How to contribute to ESLint and how the project is maintained.

**Contribute**: [eslint.org/docs/latest/contribute/](https://eslint.org/docs/latest/contribute/)  
**Maintain**: [eslint.org/docs/latest/maintain/](https://eslint.org/docs/latest/maintain/)

## Contribute to ESLint

### Code of Conduct

All contributors must follow the [ESLint Code of Conduct](https://eslint.org/conduct). Key points:
- Be respectful and inclusive
- No harassment or discrimination
- Report violations to the TSC

### AI Usage Policy

ESLint has a specific [AI Usage Policy](https://eslint.org/docs/latest/contribute/ai-policy):
- AI-generated contributions must be reviewed and verified by a human
- Contributors are responsible for AI-generated code quality
- AI tools must not be used to generate bulk contributions
- All AI-assisted contributions must be disclosed

### Report Bugs

1. Search existing issues to avoid duplicates
2. Use the bug report template
3. Include: ESLint version, Node.js version, config file, code sample, expected vs actual behavior
4. Provide a minimal reproduction case

### Propose a New Rule

1. Check if the rule has been proposed before
2. Open a discussion issue with:
   - Rule name and description
   - What problem it solves
   - Examples of valid/invalid code
   - Whether it's auto-fixable
3. Get community feedback before implementing
4. Follow the rule lifecycle: proposal → accepted → implementation → review → merge

### Propose a Rule Change

1. Open an issue describing the change
2. Explain why the change is needed
3. Provide examples of before/after behavior
4. Consider backward compatibility

### Request a Change

1. Open a feature request issue
2. Describe the use case
3. Explain why existing features don't suffice
4. Propose an API if possible

### Architecture

ESLint's architecture consists of:

#### The CLI Object

The entry point for command-line usage:
- Parses command-line arguments
- Creates an `ESLint` instance
- Runs linting
- Formats and outputs results

#### The ESLint Class

The main API class:
- `lintFiles()` — lint files by pattern
- `lintText()` — lint code strings
- `loadFormatter()` — load output formatters
- `outputFixes()` — apply auto-fixes
- Configuration resolution and caching

#### The Linter Object

Low-level linting engine:
- `verify()` — lint code against config
- `verifyAndFix()` — lint and auto-fix
- Manages rules, plugins, and parsers
- Handles inline configuration

#### Rules

Rules are the core building blocks:
- Each rule has `meta` and `create` functions
- Rules receive a `context` object
- Rules return visitor functions for AST traversal
- Rules can report problems, provide fixes, and suggest changes

### Set up a Development Environment

```bash
# Clone the repository
git clone https://github.com/eslint/eslint.git
cd eslint

# Install dependencies
npm install

# Build
npm run build

# Run ESLint on itself
npm run lint
```

### Run the Tests

```bash
# Run all tests
npm test

# Run specific test file
npx mocha tests/lib/rules/no-undef.js

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Work on Issues

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to claim it
3. Create a branch: `git checkout -b fix-issue-123`
4. Make your changes
5. Run tests: `npm test`
6. Run lint: `npm run lint`

### Submit a Pull Request

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Update documentation if needed
7. Follow the PR template
8. Reference the issue number: `Fixes #123`
9. Wait for CI to pass
10. Address review feedback

### Contribute to Core Rules

Core rules follow the same process as custom rules:
- Located in `lib/rules/`
- Tests in `tests/lib/rules/`
- Documentation in `docs/src/rules/`
- Must include `meta.docs` with description
- Must include tests with `RuleTester`
- Must follow the rule deprecation policy

### Governance

ESLint governance structure:
- **TSC (Technical Steering Committee)** — makes technical decisions
- **Reviewers** — review pull requests
- **Committers** — can merge pull requests
- **Triage** — can label and manage issues

### Report a Security Vulnerability

1. Do NOT open a public issue
2. Email: `security@eslint.org`
3. Include: description, reproduction steps, potential impact
4. Follow responsible disclosure
5. Sign the CLA

## Maintain ESLint

### How ESLint is Maintained

#### The ESLint Team

- **TSC Members** — final decision makers
- **Reviewers** — PR reviewers
- **Committers** — can merge PRs
- **Triage Team** — manages issues

#### Organization Structure

- OpenJS Foundation project
- Funded through sponsorships and donations
- Regular team meetings
- Public decision-making process

#### Funding

- GitHub Sponsors
- Open Collective
- Corporate sponsors

#### Joining the Maintainer Team

1. Start by contributing regularly
2. Help with issue triage
3. Review pull requests
4. Be nominated by a TSC member
5. Go through the onboarding process

### Manage Issues

1. Triage new issues within 7 days
2. Apply appropriate labels:
   - `bug`, `enhancement`, `rule`, `documentation`
   - `help wanted`, `good first issue`
   - `repro:yes`, `repro:no`
3. Close invalid issues with explanation
4. Link duplicate issues
5. Update stale issues

### Review Pull Requests

1. Check that CI passes
2. Review code quality and style
3. Verify tests are included
4. Check documentation updates
5. Test the changes locally
6. Provide constructive feedback
7. Approve or request changes
8. Merge when ready

### Manage Releases

1. Follow the release schedule (monthly for minor, as needed for patches)
2. Update `CHANGELOG.md`
3. Update version in `package.json`
4. Create a release tag
5. Publish to npm
6. Update documentation
7. Announce the release

### Working Groups

Working groups focus on specific areas:
- **Rule Working Group** — manages core rules
- **Documentation Working Group** — manages docs
- **Tooling Working Group** — manages build tools and CI

## Best Practices

### For Contributors

- Read the contribution guide before starting
- Start with `good first issue` labels
- Write tests for all changes
- Follow the existing code style
- Keep PRs focused and small
- Update documentation alongside code
- Be responsive to review feedback

### For Plugin/Config Authors

- Follow naming conventions (`eslint-plugin-*`, `eslint-config-*`)
- Include comprehensive tests
- Document all rules and configs
- Support flat config format
- Set `peerDependencies` for ESLint version
- Publish to npm with proper metadata
- Maintain backward compatibility when possible

### For End Users

- Use flat config (`eslint.config.js`)
- Pin ESLint version in `package.json`
- Use `--cache` for faster linting in CI
- Use `--concurrency auto` for large projects
- Integrate with editor for real-time feedback
- Use `lint-staged` for pre-commit checks
- Consider `@stylistic/eslint-plugin` for formatting rules
- Use `eslint-plugin-n` for Node.js-specific rules
