# Fast Refresh

Enabled by default — near-instant feedback for component changes. Toggle "Enable Fast Refresh" in Dev Menu.

---

## How It Works

- **Component-only module edited** → re-render that component only (styles, rendering logic, event handlers, effects all update)
- **Module with non-component exports edited** → re-run that module AND all modules importing it
- **File imported outside React tree** → falls back to full reload

## Error Resilience

- Syntax errors: redbox appears, module prevented from running. Fix and save → auto-recover
- Runtime errors during init: session continues after fix
- Runtime errors in component: React remounts with updated code
- Error boundaries retry rendering on next edit after redbox

## Limitations

- Local state NOT preserved for class components (only function components + Hooks)
- State reset if module has exports beyond React component
- State reset for HOC results that are class components (e.g., `createNavigationContainer(MyScreen)`)

## Tips

- `// @refresh reset` — force remount on every edit (useful for mount-only animations)
- Fast Refresh preserves React local state in function components by default
- Separate non-React exports into their own files to maintain Fast Refresh
