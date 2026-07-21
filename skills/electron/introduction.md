# Electron Introduction

## What is Electron?

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into its binary, Electron allows you to maintain one JavaScript codebase and create cross-platform apps that work on Windows, macOS, and Linux — no native development experience required.

## Why Electron?

### Why Choose Web Technologies

Web technologies (HTML, CSS, JavaScript, WebAssembly) are the best choice for building user interfaces — both for consumer and mission-critical business applications. Notable examples:
- NASA's Mission Control
- Bloomberg Terminal ($25,000/user/year)
- McDonald's ordering kiosks
- SpaceX Dragon 2 space capsule

Key advantages:
- **Versatility**: Can build anything from simple tools to complex applications
- **Reliability**: Mature, well-tested technologies
- **Interoperability**: Works across platforms and integrates with existing web ecosystems
- **Ubiquity**: Web developers can transfer their skills directly

### Why Choose Electron

Electron combines Chromium, Node.js, and the ability to write custom native code into one framework. Three main reasons:

1. **Enterprise-grade**: Used by Slack, Discord, VS Code, Figma, and thousands of companies
2. **Mature**: Active development since 2013, backed by the OpenJS Foundation
3. **Stability, security, performance**:
   - Bundles latest Chromium, V8, and Node.js directly with the app binary
   - **Why bundle?**: OS-provided web views are limited by the oldest OS version you support. Bundling gives you control over stability fixes, security patches, and performance improvements without waiting for OS updates
   - **Why bundle Chromium and Node.js?**: Chromium is the best cross-platform rendering stack. Node.js uses V8 (Chromium's JS engine), allowing both to work together. Native code is always accessible via Node.js native addons
4. **Developer experience**: Excellent tooling, documentation, Electron Fiddle for prototyping

### When to Choose Something Else

- **Resource-constrained environments/IoT**: Very limited memory/CPU (smart watches, embedded devices)
- **Small disk footprint**: Electron apps are typically 80-100MB zipped
- **OS UI frameworks**: If you want mostly native OS components (WinUI, SwiftUI, AppKit)
- **Games and real-time graphics**: Use Unity, Unreal Engine, or DirectX/OpenGL
- **Embedding lightweight websites**: Use OS-provided web views or ultralight for primarily native apps

## Electron Fiddle

[Electron Fiddle](https://www.electronjs.org/fiddle) is a sandbox app for experimenting with Electron's APIs and prototyping features. Key features:
- Pre-built examples from documentation
- "Open in Fiddle" buttons throughout the docs
- No copy-pasting required — loads examples directly
- Great learning tool for Electron APIs

## Documentation Structure

- **Tutorial**: End-to-end guide on creating and publishing an Electron application
- **Processes in Electron**: In-depth reference on Electron processes
- **Best Practices**: Performance and security checklists
- **Examples**: Quick references for common features (dark mode, notifications, etc.)
- **Development**: Miscellaneous development guides (accessibility, native modules)
- **Distribution**: How to distribute your app (Electron Forge, code signing, updates)
- **Testing And Debugging**: Debugging, automated testing (WebDriver, Playwright)
- **References**: Breaking changes, fuses, API structure
- **Contributing**: Compiling Electron and making contributions

## Getting Help

- [Community Discord server](https://discord.gg/electronjs) for development advice
- [GitHub issue tracker](https://github.com/electron/electron/issues) for bug reports
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron) for Q&A
