# Swift Evolution and Contributing

Swift Evolution proposals, contributing to Swift, and community governance.

## Swift Evolution

Swift Evolution is the process for proposing, discussing, and reviewing changes to the Swift language and standard library.

### Proposal process

1. **Pitch**: Initial idea shared on the [Swift Forums](https://forums.swift.org/)
2. **Draft**: Formal proposal document written
3. **Review**: Community and core team review (1-2 weeks)
4. **Decision**: Accepted, rejected, or returned for revision
5. **Implementation**: Implementation in the Swift compiler
6. **Release**: Included in a Swift release

### Proposal types

| Type | Description |
|------|-------------|
| **Language** | Changes to the Swift language |
| **Standard Library** | Changes to the standard library |
| **Package Manager** | Changes to SwiftPM |
| **Compiler** | Changes to the compiler |
| **Tools** | Changes to tooling |

### Proposal statuses

| Status | Meaning |
|--------|---------|
| **Pitch** | Initial idea, not yet formalized |
| **Active Review** | Under community review |
| **Accepted** | Approved for implementation |
| **Accepted with Revisions** | Approved with changes |
| **Rejected** | Not approved |
| **Returned for Revision** | Needs more work |
| **Withdrawn** | Author withdrew |
| **Deferred** | Postponed to future version |
| **Implemented** | Implemented and released |

### Reading proposals

Proposals are hosted on GitHub: [swiftlang/swift-evolution](https://github.com/swiftlang/swift-evolution)

```bash
# Clone the evolution repository
git clone https://github.com/swiftlang/swift-evolution.git

# Browse proposals
ls proposals/
# SE-0001.md, SE-0002.md, ...
```

### Key evolution proposals

| SE | Title | Status |
|----|-------|--------|
| SE-0255 | Opaque return types | Implemented (Swift 5.1) |
| SE-0295 | Opaque result types with generics | Implemented (Swift 5.7) |
| SE-0306 | `Sendable` and `@unchecked Sendable` | Implemented (Swift 5.5) |
| SE-0335 | Existential `any` | Implemented (Swift 5.7) |
| SE-0366 | `consume` operator | Implemented (Swift 5.9) |
| SE-0390 | `noncopyable` types | Implemented (Swift 5.9) |
| SE-0402 | `if`/`switch` as expressions | Implemented (Swift 5.9) |

## Contributing to Swift

### Source code repositories

| Repository | Description |
|-----------|-------------|
| [swiftlang/swift](https://github.com/swiftlang/swift) | Swift compiler and standard library |
| [swiftlang/swift-corelibs](https://github.com/swiftlang/swift-corelibs) | Core libraries (Foundation, Dispatch, XCTest) |
| [swiftlang/swift-package-manager](https://github.com/swiftlang/swift-package-manager) | SwiftPM |
| [swiftlang/swift-syntax](https://github.com/swiftlang/swift-syntax) | Swift syntax tree library |
| [swiftlang/sourcekit-lsp](https://github.com/swiftlang/sourcekit-lsp) | LSP server for Swift |
| [swiftlang/swift-format](https://github.com/swiftlang/swift-format) | Formatter and linter |
| [swiftlang/swift-docc](https://github.com/swiftlang/swift-docc) | Documentation compiler |

### Building Swift from source

```bash
# Clone the main repository
git clone https://github.com/swiftlang/swift.git
cd swift

# Use the build script to fetch dependencies and build
./utils/build-script --release-debug-info --test

# For faster incremental builds
./utils/build-script --release-debug-info \
    --skip-build-benchmarks \
    --skip-test-cmark \
    --build-runtime-with-host-compiler

# Ninja build (recommended)
./utils/build-script --release-debug-info --skip-test-cmark
ninja -C build/Ninja-ReleaseAssert/swift-linux-x86_64 swift-frontend
```

### Cloned repositories

When you clone the main Swift repository, `utils/update_checkout.py` fetches these related repositories:

- **llvm-project**: LLVM compiler infrastructure
- **swift-corelibs-libdispatch**: Dispatch library
- **swift-corelibs-foundation**: Foundation library
- **swift-corelibs-xctest**: XCTest framework
- **swift-integration-tests**: Integration tests
- **swift-xcode-playground-support**: Xcode playground support
- **sourcekit-lsp**: LSP server
- **swift-format**: Code formatter
- **swift-docc**: Documentation compiler
- **swift-docc-symbolkit**: Symbol graph processing
- **swift-syntax**: Syntax tree library
- **indexstore-db**: Index store database
- **cmark**: Markdown parser

### Continuous Integration

Swift uses continuous integration across multiple platforms:

| CI System | Platforms |
|-----------|-----------|
| **Swift CI** (ci.swift.org) | Linux, macOS, Windows |
| **GitHub Actions** | Community PR checks |
| **Buildbot** | Automated builds and tests |

### Source compatibility

The [Source Compatibility Suite](https://www.swift.org/documentation/source-compatibility/) ensures Swift doesn't break existing code:

- Tests against 600+ open-source projects
- Runs on every PR
- Covers libraries, apps, and frameworks

## Community and governance

### Swift project workgroups

| Workgroup | Focus |
|-----------|-------|
| **Core Team** | Language direction and vision |
| **Language Workgroup** | Language evolution proposals |
| **Standard Library Workgroup** | Standard library proposals |
| **Swift on Server Workgroup (SSWG)** | Server ecosystem |
| **C++ Interop Workgroup** | C++ interoperability |
| **Website Workgroup** | Swift.org website |
| **Diversity in Swift** | Inclusion and diversity |

### Swift Forums

The [Swift Forums](https://forums.swift.org/) are the primary venue for:
- Discussing proposals
- Getting help with Swift
- Announcing new packages
- Community discussions

### Contributing guidelines

1. **Start small** — fix a typo, improve documentation, write a test
2. **Read CONTRIBUTING.md** in the relevant repository
3. **File an issue** before starting major work
4. **Write tests** for all changes
5. **Follow the Swift API Design Guidelines**
6. **Sign the Swift License Agreement** for contributions to Apple-hosted repos
7. **Use the Swift Forums** for design discussions
8. **Review proposals** — community feedback is valued

### Monthly Non-Darwin Swift Releases

Swift publishes monthly releases for non-Apple platforms (Linux, Windows):

```bash
# Install a monthly snapshot
curl -O https://download.swift.org/swift-6.0-release/ubuntu2204/swift-6.0-RELEASE/swift-6.0-RELEASE-ubuntu22.04.tar.gz
```

## Best practices

1. Follow Swift Evolution for upcoming language changes
2. Read proposals before adopting new features — understand the rationale
3. Test your code against Swift snapshots for forward compatibility
4. Contribute back — file bugs, write proposals, submit PRs
5. Use the Swift Forums for questions and discussions
6. Keep up with the Swift Blog for major announcements
7. Check the source compatibility dashboard before upgrading
8. Participate in proposal reviews — your feedback matters
9. Use `swift-format` for consistent code style
10. Document your public APIs with DocC
