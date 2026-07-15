# Testing

---

## Why Test

- Catch mistakes and verify code works
- Ensure code continues to work after refactors/dependency upgrades
- Failing test that exposes a bug is the best way to fix it
- Tests serve as documentation for new team members
- Less manual QA, more automation

## Static Analysis (built-in)

- **ESLint** — linting (catches common errors, style issues)
- **TypeScript** — type checking (ensures correct types)

## Writing Testable Code

- Separate business logic from React components
- Write modular code in small units
- State/data fetching should be independent of components
- Theoretically: components only render, logic works without React

## Test Types

| Type | Description | Tools |
|------|-------------|-------|
| **Unit Tests** | Test individual functions/classes. Fast to write and run. Mock dependencies. | Jest |
| **Integration Tests** | Combine real units and test cooperation. Less mocking than unit tests. | Jest |
| **Component Tests** | Test React component rendering and interactions. JS-only (no native code). | React Native Testing Library |
| **E2E Tests** | Test on device/emulator from user perspective. Highest confidence, slowest. | Detox, Appium, Maestro |

## Unit Test Example

```tsx
import {sum} from '../src/utils';

test('sum adds two numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## Component Test Example

```tsx
import {render, fireEvent} from '@testing-library/react-native';
import MyButton from '../src/MyButton';

test('button calls onPress', () => {
  const onPress = jest.fn();
  const {getByText} = render(<MyButton title="Press" onPress={onPress} />);
  fireEvent.press(getByText('Press'));
  expect(onPress).toHaveBeenCalled();
});
```

## E2E Testing

- Build app in release configuration
- Test from user perspective (tap buttons, type text, assert visibility)
- Highest confidence but slower and more prone to flakiness
- Cover vital flows: authentication, core functionality, payments
- **Detox** — tailored for React Native
- **Appium** — cross-platform mobile testing
- **Maestro** — UI-driven mobile testing

## Jest Watch Mode

```bash
npx jest --watch  # runs tests related to files you're editing
```
