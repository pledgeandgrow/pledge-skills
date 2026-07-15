# Testing

Astro supports unit/integration testing with Vitest and end-to-end testing with Playwright, Cypress, and NightwatchJS.

---

## Unit and Integration Tests

### Vitest

Astro works with Vitest out of the box:

```bash
npm install -D vitest
```

```ts
// vitest.config.ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Vitest options
  },
});
```

### Testing Components

```ts
import { expect, test } from 'vitest';
import { experimental_AstroContainer as Container } from 'astro/container';

test('Card renders title', async () => {
  const result = await Container.render(Card, {
    props: { title: 'Hello' },
  });
  expect(result).toContain('Hello');
});
```

### Testing with `experimental_AstroContainer`

```ts
import { experimental_AstroContainer as Container } from 'astro/container';
import MyComponent from '../src/components/MyComponent.astro';

test('MyComponent renders correctly', async () => {
  const html = await Container.render(MyComponent, {
    props: { message: 'World' },
    slots: {
      default: '<p>Slot content</p>',
    },
  });
  expect(html).toContain('World');
  expect(html).toContain('Slot content');
});
```

### Testing Endpoints

```ts
import { expect, test } from 'vitest';
import { GET } from '../src/pages/api/health.ts';

test('health endpoint returns 200', async () => {
  const response = await GET({
    request: new Request('http://localhost/api/health'),
    url: new URL('http://localhost/api/health'),
    params: {},
    props: {},
  } as any);
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('ok');
});
```

### Running Tests

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch"
  }
}
```

```bash
npm test
npm run test:run
```

---

## End-to-End Tests

### Playwright

```bash
npm install -D @playwright/test
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

```ts
// tests/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My Site/);
  await expect(page.locator('h1')).toHaveText('Welcome');
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/about"]');
  await expect(page).toHaveURL('/about');
});
```

```bash
npx playwright test
npx playwright test --headed
npx playwright test --ui
```

### Cypress

```bash
npm install -D cypress
```

```ts
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',
    supportFile: false,
  },
});
```

```ts
// cypress/e2e/home.cy.ts
describe('Home page', () => {
  it('loads successfully', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Welcome');
  });

  it('navigates to about', () => {
    cy.visit('/');
    cy.get('a[href="/about"]').click();
    cy.url().should('include', '/about');
  });
});
```

```bash
npx cypress open
npx cypress run
```

### NightwatchJS

```bash
npm install -D nightwatch
```

```js
// nightwatch.conf.js
module.exports = {
  src_folders: ['tests'],
  webdriver: {
    start_process: true,
    server_path: '',
  },
  test_settings: {
    default: {
      launch_url: 'http://localhost:4321',
    },
  },
};
```

```js
// tests/home.js
module.exports = {
  'Home page loads': (browser) => {
    browser
      .url('http://localhost:4321')
      .assert.titleContains('My Site')
      .assert.containsText('h1', 'Welcome')
      .end();
  },
};
```

```bash
npx nightwatch
```

---

## Testing Checklist

- [ ] Unit tests for utility functions
- [ ] Component render tests with Astro Container
- [ ] API endpoint tests
- [ ] E2E tests for critical user flows
- [ ] Navigation tests between pages
- [ ] Form submission tests
- [ ] View transition tests (if using SPA mode)
