# Prisma Platform — Console, Management API, Compute & Query Insights

## Prisma Console

The [Console](https://console.prisma.io) is the web interface to manage and configure projects that use Prisma products:

- **Query Insights**: Inspect slow queries, connect Prisma calls to SQL, and apply focused fixes
- **Prisma Postgres**: A managed PostgreSQL database optimized for Prisma ORM
- **Prisma Compute**: Runs your app next to your Prisma Postgres database (Public Beta)

### Getting Started

1. **Create account**: Go to `console.prisma.io/login`, sign in with GitHub
2. **Set up workspace**: Default workspace created automatically; create more for different teams
3. **Create project**: Navigate to workspace → Create Project → enter name → Create
4. **Create resource**: For Prisma Postgres, click Create Database, select region. For Accelerate, click Create Environment.
5. **Generate connection string**: Navigate to resource → Connection Strings tab → Create Connection String → copy and store securely
6. **Use in app**: Add to `.env` file

### Core Concepts

| Concept | Description |
|---------|-------------|
| **User account** | Personal account to manage workspaces and projects |
| **Workspaces** | Team-level container; billing is managed here |
| **Projects** | Application-level container within a workspace; one Prisma schema per project |
| **Branches** | For Compute projects: isolated infrastructure per Git branch |
| **Resources** | Actual services or databases within a project (databases, environments, apps) |

Hierarchy: `workspace → project → branch → { apps, databases }`

### Database Metrics

Monitor database performance in the Console:

- Average response size
- Average query duration
- Total egress
- Total operations
- Cache utilization

The **Connections** section shows: Hint (URL structure), Static IP status, Products enabled, and Action (disable/remove).

### Feature Maturity

| Stage | Meaning |
|-------|---------|
| **Early Access** | Cutting edge, may evolve, API surface won't change drastically |
| **Preview** | Refined from EA, close to production-ready, no invite needed |
| **Public Beta** | Open to all, core model stable, details may change before GA |

### Support

| Plan | Response time |
|------|---------------|
| Community | Discord |
| Standard | 2 business days, Mon-Fri 9am-5pm CET |
| Premium | 1 business hour, Mon-Fri 9am-5pm CET |
| Dedicated | Dedicated contact person |

To delete account: email `support@prisma.io`, disable all resources first.

---

## Management API

Programmatically manage Prisma Postgres databases, projects, and workspaces.

### Base URL

```
https://api.prisma.io/v1
```

Interactive [OpenAPI 3.1 spec](https://api.prisma.io/v1/swagger-editor) available.

### Authentication

Two methods:

#### Service Tokens

Simple bearer tokens for server-to-server integrations. Create in Console → Settings → Service Tokens → New Service Token.

```bash
curl -X GET "https://api.prisma.io/v1/workspaces" \
  -H "Authorization: Bearer your-service-token"
```

> Service tokens never expire. Manage carefully.

#### OAuth 2.0

For user-facing applications. Uses PKCE (S256).

**Endpoints**:

| Endpoint | URL |
|----------|-----|
| Authorization | `https://auth.prisma.io/authorize` |
| Token | `https://auth.prisma.io/token` |
| Discovery | `https://auth.prisma.io/.well-known/oauth-authorization-server` |

**Scopes**: `workspace:admin` (full access), `offline_access` (refresh tokens)

**Token lifetimes**: Access tokens 1 hour, refresh tokens 90 days

**Flow**:
1. Redirect user to `https://auth.prisma.io/authorize` with `client_id`, `redirect_uri`, `response_type=code`, `scope`
2. Receive authorization code at callback URL
3. Exchange code for access token at `https://auth.prisma.io/token`
4. Use access token in `Authorization: Bearer` header
5. Refresh tokens with `grant_type=refresh_token`

> Refresh tokens use single-use rotation with replay attack detection.

### SDK (`@prisma/management-api-sdk`)

TypeScript SDK with built-in OAuth and automatic token refresh.

```bash
npm install @prisma/management-api-sdk
```

#### Basic Usage (with service token)

```typescript
import { createManagementApiClient } from "@prisma/management-api-sdk";

const client = createManagementApiClient({
  token: "your-access-token",
});

// List workspaces
const { data: workspaces, error } = await client.GET("/v1/workspaces");

// Get a specific project
const { data: project } = await client.GET("/v1/projects/{id}", {
  params: { path: { id: "project-id" } },
});

// Create a new project
const { data: newProject } = await client.POST("/v1/workspaces/{workspaceId}/projects", {
  params: { path: { workspaceId: "workspace-id" } },
  body: { name: "My New Project" },
});

// Create a new database
const { data: newDatabase } = await client.POST("/v1/projects/{projectId}/databases", {
  params: { path: { projectId: "project-id" } },
  body: { name: "my-new-db-instance", region: "us-east-1", isDefault: true },
});

// Delete a database
const { error: deleteError } = await client.DELETE("/v1/databases/{databaseId}", {
  params: { path: { databaseId: "database-id" } },
});
```

#### Customizing the Client

```typescript
const client = createManagementApiClient({
  token: "your-access-token",
  baseUrl: "https://api.example.com",
  headers: { "X-Custom-Header": "value" },
});
```

#### OAuth Authentication Flow

```typescript
import { createManagementApiSdk, type TokenStorage } from "@prisma/management-api-sdk";

const tokenStorage: TokenStorage = {
  async getTokens() {
    const stored = localStorage.getItem("prisma-tokens");
    return stored ? JSON.parse(stored) : null;
  },
  async setTokens(tokens) {
    localStorage.setItem("prisma-tokens", JSON.stringify(tokens));
  },
  async clearTokens() {
    localStorage.removeItem("prisma-tokens");
  },
};

const api = createManagementApiSdk({
  clientId: "your-oauth-client-id",
  redirectUri: "https://your-app.com/auth/callback",
  tokenStorage,
});

// Initiate login
const { url, state, verifier } = await api.getLoginUrl({
  scope: "workspace:admin offline_access",
});
sessionStorage.setItem("oauth-state", state);
sessionStorage.setItem("oauth-verifier", verifier);
window.location.href = url;

// Handle callback
await api.handleCallback({
  callbackUrl: window.location.href,
  verifier: sessionStorage.getItem("oauth-verifier"),
  expectedState: sessionStorage.getItem("oauth-state"),
});

// Make API calls via api.client (same methods as basic usage)
// Logout
await api.logout();
```

#### Token Storage Interface

```typescript
interface TokenStorage {
  getTokens(): Promise<Tokens | null>;
  setTokens(tokens: Tokens): Promise<void>;
  clearTokens(): Promise<void>;
}

type Tokens = {
  workspaceId: string;
  accessToken: string;
  refreshToken?: string;
};
```

### Using API Clients (Postman, Insomnia, Yaak)

Download the Postman collection from Prisma docs for pre-configured OAuth2 auth. Compatible with Postman, Yaak, Insomnia.

**Postman**: Create OAuth2 app with redirect URI `https://oauth.pstmn.io/v1/callback`, configure OAuth 2.0 in Authorization tab.

**Insomnia**: Redirect URI `https://app.insomnia.rest/oauth/redirect`, configure OAuth 2.0 in Auth tab.

**Yaak**: Redirect URI `https://devnull.yaak.app/callback`, configure OAuth 2.0 in Auth tab.

---

## Prisma Compute (Public Beta)

TypeScript app hosting built to run alongside Prisma Postgres. Deploy with the `@prisma/cli` beta package.

### The Model

- A **project** groups one product or codebase
- A **branch** maps to a Git branch, gets isolated app, env vars, and deployments
- An **app** is an HTTP service with multiple **deployments**

Each branch owns its own app, URL, and environment variables. Production = default Git branch (e.g., `main`). Every other branch = preview.

### Getting Started with `@prisma/cli`

**Prerequisites**: Node.js 22.12+ (or Bun), Prisma Data Platform account

```bash
# Sign in
npx @prisma/cli@latest auth login

# Deploy
npx @prisma/cli@latest app deploy

# Stream logs
npx @prisma/cli@latest app logs

# Open in browser
npx @prisma/cli@latest app open
```

**Shorter command**: Install locally and add script:

```json
{ "scripts": { "deploy": "prisma-cli app deploy" } }
```

**Link existing project**:

```bash
npx @prisma/cli@latest project link my-app
npx @prisma/cli@latest project show
npx @prisma/cli@latest project list
```

### Supported Frameworks

`nextjs`, `nuxt`, `astro`, `hono`, `nestjs`, `tanstack-start`, `custom`, `bun`

> Next.js apps should set `output: "standalone"` in `next.config.ts`.

```bash
npx @prisma/cli@latest app deploy --framework nextjs
npx @prisma/cli@latest app deploy --framework hono --entry src/index.ts
npx @prisma/cli@latest app deploy --framework bun --entry src/server.ts
```

### Deploy to Production

First deployment auto-promoted to production. After that:

```bash
npx @prisma/cli@latest app deploy --prod
npx @prisma/cli@latest app deploy --prod --yes  # CI
```

Without `--prod`, fails with `PROD_DEPLOY_REQUIRES_FLAG`. Without `--yes` in non-interactive, fails with `CONFIRMATION_REQUIRED`.

Preview deploys never need `--prod`.

### Automation and CI

```bash
PRISMA_SERVICE_TOKEN=... npx @prisma/cli@latest app deploy \
  --project my-app \
  --app web \
  --branch feature/search \
  --json \
  --no-interactive
```

### Agent Skills

```bash
npx skills add prisma/skills --skill prisma-compute
```

### Structured Output (`--json`)

Every result is an envelope with `ok` flag. On failure: `error.code`, `error.fix`, `nextSteps`.

| Code | Meaning |
|------|---------|
| `PROJECT_SETUP_REQUIRED` | No project resolved. Pass `--project` or `--create-project`. |
| `APP_AMBIGUOUS` | More than one app matched. Pass `--app <name>`. |
| `PROD_DEPLOY_REQUIRES_FLAG` | Production deploy missing `--prod`. |
| `CONFIRMATION_REQUIRED` | `--prod` deploy can't prompt. Pass `--prod --yes`. |
| `FEATURE_UNAVAILABLE` | Platform can't serve this yet. |

### Branching

Branches are isolated environments mapping to Git branches.

- **Production branch**: first branch, usually `main`, protected and durable
- **Preview branches**: every other branch, disposable

**CLI branch resolution**: `--branch <name>` → active Git branch → `main`

```bash
npx @prisma/cli@latest app deploy --branch feature/search
npx @prisma/cli@latest branch list
```

Branches created automatically on deploy or from GitHub events. Deleting a Git branch tears down the matching platform branch (except production/default).

### Deployments

```bash
# Build locally
npx @prisma/cli@latest app build

# Inspect
npx @prisma/cli@latest app show --app web
npx @prisma/cli@latest app open --app web
npx @prisma/cli@latest app list-deploys --app web
npx @prisma/cli@latest app show-deploy dep_123

# Logs
npx @prisma/cli@latest app logs --app web
npx @prisma/cli@latest app logs --app web --deployment dep_123

# Promote
npx @prisma/cli@latest app promote dep_123 --app web

# Roll back
npx @prisma/cli@latest app rollback --app web
npx @prisma/cli@latest app rollback --app web --to dep_123

# Remove
npx @prisma/cli@latest app remove --app web
```

### Environment Variables

Three layers: production, preview, branch overrides.

```bash
# Set
npx @prisma/cli@latest project env add DATABASE_URL=postgresql://example --role production
npx @prisma/cli@latest project env add DATABASE_URL=postgresql://preview --role preview
npx @prisma/cli@latest project env add FEATURE_FLAG=enabled --branch feature/search

# Import from dotenv
npx @prisma/cli@latest project env add --file .env.production --role production

# List (keys only, never values)
npx @prisma/cli@latest project env list --role production
npx @prisma/cli@latest project env list --branch feature/search

# Update
npx @prisma/cli@latest project env update DATABASE_URL=postgresql://new --role production

# Remove
npx @prisma/cli@latest project env remove DATABASE_URL --role preview
```

> Values are write-only: encrypted at rest, never returned by any surface. Keep your own copy in a secret manager.

**Rules**: Keys match `[A-Z_][A-Z0-9_]*`, up to 256 chars. Values non-empty, up to 8 KB. Production variables can't be branch-scoped.

### Configuration (`prisma.compute.ts`)

Optional committed file declaring what you deploy:

```typescript
import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    framework: "hono",
    entry: "src/index.ts",
    httpPort: 8080,
  },
});
```

**App fields**: `name`, `region`, `root`, `framework`, `entry`, `httpPort`, `env`, `build`

**Regions**: `us-east-1` (default), `us-west-1`, `eu-west-3`, `eu-central-1`, `ap-northeast-1`, `ap-southeast-1`

**Monorepo** with multiple apps:

```typescript
export default defineComputeConfig({
  apps: {
    api: { root: "apps/api", framework: "hono", entry: "src/index.ts" },
    web: { root: "apps/web", framework: "nextjs" },
  },
});
```

Deploy all: `app deploy`. Deploy one: `app deploy api`.

Config values are deploy defaults; explicit flags always win.

### GitHub Integration

```bash
npx @prisma/cli@latest git connect
npx @prisma/cli@latest git connect https://github.com/acme/shop
npx @prisma/cli@latest git disconnect
```

Events: branch created → creates platform branch; push → builds commit; branch deleted → tears down branch (except production/default).

GitHub is the only supported provider. One repository per project.

### Domains

Custom domains for production apps only. CNAME-based.

```bash
npx @prisma/cli@latest app domain add shop.acme.com --app web
npx @prisma/cli@latest app domain wait shop.acme.com --app web
npx @prisma/cli@latest app domain show shop.acme.com --app web
npx @prisma/cli@latest app domain retry shop.acme.com --app web
npx @prisma/cli@latest app domain remove shop.acme.com --app web
```

**States**: `pending_dns` → `provisioning_tls` → `active` | `failed`

**Limits**: Production-only, CNAME records only, up to 3 domains per app, no wildcards.

### Keeping Instances Awake

`@prisma/compute` provides two primitives for bounded background work:

```typescript
import { waitUntil, KeepAwakeGuard } from "@prisma/compute";

// waitUntil — keeps instance awake until promise settles
waitUntil(processInBackground(req), {
  signal: AbortSignal.timeout(30_000),
});

// KeepAwakeGuard — keeps instance awake until released
using guard = new KeepAwakeGuard();
await fetchAllRecords();
await transformData();
await writeResults();
// guard auto-released at scope exit via `using`
```

> These only prevent scaling to zero. They don't make work durable, retry failures, or guarantee continuity through restarts.

### Image Transformations

Bun ships `Bun.Image` natively on Compute. Build image transformation routes:

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/images/*", async (c) => {
  const path = c.req.path.replace(/^\/images\//, "");
  const source = await fetch(new URL(path, "https://assets.example.com/"));
  const input = await source.arrayBuffer();

  const width = Number.parseInt(c.req.query("w") ?? "", 10);
  const quality = Number.parseInt(c.req.query("q") ?? "80", 10);
  const format = c.req.query("format") ?? "jpeg";

  let image = new Bun.Image(input, { maxPixels: 4096 * 4096, autoOrient: true });
  if (width) image = image.resize(width, undefined, { fit: "inside", withoutEnlargement: true });
  if (format === "webp") image = image.webp({ quality });
  else image = image.jpeg({ quality, progressive: true });

  const body = await image.blob();
  return new Response(body, {
    headers: { "Cache-Control": "public, max-age=31536000, immutable", "Content-Type": body.type, "Vary": "Accept" },
  });
});

export default app;
```

### CLI Reference — Complete

**Command groups**: `auth`, `init`, `project`, `project env`, `git`, `branch`, `database`, `app`, `build`, `agent`, `version`

| Group | Commands |
|-------|----------|
| `auth` | `login`, `logout`, `whoami` |
| `init` | Scaffold `prisma.compute.ts` |
| `project` | `list`, `show`, `create <name>`, `link [id-or-name]` |
| `project env` | `add`, `update`, `list`, `remove` |
| `branch` | `list` |
| `database` | `list`, `show`, `create`, `usage`, `restore`, `remove`, `backup list`, `connection list/create/rotate/remove` |
| `git` | `connect [url]`, `disconnect` |
| `app` | `build`, `deploy`, `show`, `open`, `logs`, `list-deploys`, `show-deploy`, `promote`, `rollback`, `remove` |
| `app domain` | `add`, `show`, `wait`, `retry`, `remove` |
| `build` | `logs <buildId>` |
| `agent` | `install`, `update`, `status` |
| `version` | Show build and environment |

**Global flags**: `--json`, `-y`/`--yes`, `-q`/`--quiet`, `-v`/`--verbose`, `--trace`, `--interactive`/`--no-interactive`, `--color`/`--no-color`, `--version`

**Environment variables**: `PRISMA_SERVICE_TOKEN`, `PRISMA_PROJECT_ID`, `PRISMA_APP_ID`

**Error codes** (grouped):

- **General**: `AUTH_REQUIRED`, `CONFIRMATION_REQUIRED`, `USAGE_ERROR`, `FEATURE_UNAVAILABLE`
- **Projects/apps**: `PROJECT_SETUP_REQUIRED`, `PROJECT_NOT_FOUND`, `APP_AMBIGUOUS`, `FRAMEWORK_NOT_DETECTED`
- **Deployments**: `PROD_DEPLOY_REQUIRES_FLAG`, `BUILD_FAILED`, `DEPLOY_FAILED`, `DEPLOYMENT_NOT_FOUND`, `NO_PREVIOUS_DEPLOYMENT`
- **Env vars**: `ENV_VARIABLE_ALREADY_EXISTS`, `ENV_VARIABLE_NOT_FOUND`, `ENV_BRANCH_SCOPE_IS_PRODUCTION`
- **Domains**: `BRANCH_NOT_DEPLOYABLE`, `DOMAIN_ALREADY_REGISTERED`, `DOMAIN_DNS_NOT_CONFIGURED`, `DOMAIN_VERIFICATION_FAILED`, `DOMAIN_VERIFICATION_TIMEOUT`, `DOMAIN_QUOTA_EXCEEDED`, `DOMAIN_RETRY_NOT_ELIGIBLE`
- **GitHub**: `REPO_NOT_CONNECTED`, `REPO_ALREADY_CONNECTED`, `REPO_INSTALLATION_REQUIRED`, `REPO_PROVIDER_UNSUPPORTED`

### Known Limitations

- Package is `@prisma/cli`, executable is `prisma-cli` (not `prisma`)
- No `schema` or `migrate` command in beta
- Env var values are write-only, never returned
- GitHub only, one repo per project
- Custom domains production-only, up to 3 per app
- No multi-region deployments; each app in one region
- No cron scheduling, persistent filesystem, or edge runtimes
- WebSocket servers not supported in Public Beta
- Not recommended for mission-critical production workloads
- Free during public beta

### FAQ Highlights

- **Why `prisma-cli` not `prisma`?** Avoids shadowing Prisma ORM binary
- **Does `git connect` deploy?** No, it wires up automation for future events
- **How to rotate a secret?** `project env update` then `app deploy --prod --yes`
- **Does changing a variable redeploy?** No, redeploy to apply
- **Need Prisma Postgres for Compute?** No, but they work well together
- **Is Compute free?** Yes, during public beta

---

## Query Insights

Built into Prisma Postgres at no extra cost. Inspect slow queries, connect Prisma calls to SQL, apply focused fixes.

### Dashboard

- Average latency and queries per second charts
- Grouped query list with latency, executions, reads, last seen, SQL statement shape
- Filter by table, sort by importance

### Query Detail

- Full SQL statement
- AI-generated analysis explaining performance issues
- Copyable prompt for editor or AI coding assistant

### Prisma ORM Attribution

Trace full chain from app code to generated SQL:

```bash
npm install @prisma/sqlcommenter-query-insights
```

```typescript
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { prismaQueryInsights } from "@prisma/sqlcommenter-query-insights";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({
  adapter,
  comments: [prismaQueryInsights()],
});
```

### Typical Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| N+1 queries | High query count per request | Nested reads, batching, joins |
| Missing indexes | High reads vs rows returned | Add index for filter pattern |
| Over-fetching | Wide rows, large payloads | Use `select` for fewer fields |
| Offset pagination | Reads grow on deeper pages | Switch to cursor pagination |
| Large nested reads | High reads + large payloads | Limit fields, depth, or split queries |
| Repeated queries | Same statement shape runs often | Cache or reuse results |

### Workflow

1. Open Query Insights, scan charts
2. Sort/filter query list to find expensive statement
3. Open query detail
4. Read AI analysis, inspect SQL
5. Copy suggested prompt to editor
6. Review and apply change
7. Re-run workload and compare

---

## Sources

- https://www.prisma.io/docs/console
- https://www.prisma.io/docs/console/getting-started
- https://www.prisma.io/docs/console/concepts
- https://www.prisma.io/docs/console/features/metrics
- https://www.prisma.io/docs/console/more/feature-maturity
- https://www.prisma.io/docs/console/more/support
- https://www.prisma.io/docs/management-api
- https://www.prisma.io/docs/management-api/authentication
- https://www.prisma.io/docs/management-api/sdk
- https://www.prisma.io/docs/management-api/api-clients
- https://www.prisma.io/docs/compute
- https://www.prisma.io/docs/compute/getting-started
- https://www.prisma.io/docs/compute/branching
- https://www.prisma.io/docs/compute/deployments
- https://www.prisma.io/docs/compute/environment-variables
- https://www.prisma.io/docs/compute/configuration
- https://www.prisma.io/docs/compute/github
- https://www.prisma.io/docs/compute/domains
- https://www.prisma.io/docs/compute/cli-reference
- https://www.prisma.io/docs/compute/limitations
- https://www.prisma.io/docs/compute/faq
- https://www.prisma.io/docs/compute/image-transformations
- https://www.prisma.io/docs/compute/keeping-instances-awake
- https://www.prisma.io/docs/query-insights
