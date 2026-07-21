# Auth0 — Manage Users & Deploy

> **Version**: Latest | **Source**: [auth0.com/docs/manage-users](https://auth0.com/docs/manage-users) | [auth0.com/docs/deploy-monitor](https://auth0.com/docs/deploy-monitor) | [auth0.com/docs/api](https://auth0.com/docs/api) | [auth0.com/docs/libraries](https://auth0.com/docs/libraries)

## User Accounts

### User Profiles

Every Auth0 user has a profile with:

| Field | Description |
|-------|-------------|
| `user_id` | Unique identifier (e.g., `auth0|123456`) |
| `email` | Email address |
| `email_verified` | Boolean |
| `name` | Display name |
| `nickname` | Nickname |
| `picture` | Avatar URL |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |
| `last_login` | Last login timestamp |
| `logins_count` | Total login count |
| `identities` | Array of linked identities |
| `user_metadata` | App-writable custom data (user can modify) |
| `app_metadata` | App-writable custom data (user cannot modify) |
| `phone_number` | Phone (passwordless) |

### User Metadata vs. App Metadata

| Aspect | `user_metadata` | `app_metadata` |
|--------|-----------------|----------------|
| **Who can write** | App, user (via Management API) | App only |
| **Included in tokens** | Yes (ID token) | Yes (ID token, if configured) |
| **Use case** | Preferences, profile data | Roles, permissions, flags |
| **Size limit** | 500 KB | 500 KB |

```javascript
// Set metadata via Management API
await management.users.updateAppMetadata({ id: 'auth0|123' }, {
  role: 'admin',
  plan: 'enterprise'
});
```

### User Account Linking

Link multiple identities (e.g., email/password + Google) to a single user:

```javascript
// Link accounts via Management API
await management.users.link({ id: primaryUserId }, {
  user_id: secondaryUserId,
  connection_id: secondaryConnectionId
});
```

### Blocking and Deleting Users

- **Block**: Prevent login, keep user record
- **Delete**: Permanently remove user
- **Bulk operations**: Via Management API

### Password Management

- **Password Reset**: Trigger via `/dbconnections/change_password` or Dashboard
- **Password Policy**: Configurable (min length, complexity, history)
- **Password Hash**: Auth0 uses bcrypt (cost factor 10+)
- **Breached Password Check**: Automatic on login/signup

**Source**: [User Accounts](https://auth0.com/docs/manage-users/user-accounts) | [User Profile](https://auth0.com/docs/manage-users/user-accounts/user-profile-structure) | [Metadata](https://auth0.com/docs/manage-users/user-accounts/metadata) | [Account Linking](https://auth0.com/docs/manage-users/user-accounts/user-account-linking) | [Link User Accounts](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/link-user-accounts) | [Password Reset](https://auth0.com/docs/manage-users/user-accounts/password-reset)

## User Migration

### Automatic Migration (Lazy Migration)

Migrate users from legacy system to Auth0 on first login:

```javascript
// Custom Database Action: Login script
exports.onExecutePostLogin = async (event, api) => {
  const { email, password } = event.request.body;
  // Validate against legacy DB
  const user = await legacyDb.validateUser(email, password);
  if (!user) return api.access.deny('Invalid credentials');
  // Set user metadata for migration
  api.user.setAppMetadata('migrated', true);
};
```

### Bulk Migration

Import users in bulk via Management API:

```http
POST /api/v2/jobs/users-imports
Content-Type: multipart/form-data

file: users.csv
```

CSV format: `email, password, name, nickname, user_metadata, app_metadata`

**Source**: [User Migration](https://auth0.com/docs/manage-users/user-migration) | [Automatic Migration](https://auth0.com/docs/manage-users/user-migration/automatic-migration) | [Bulk Import](https://auth0.com/docs/manage-users/user-migration/bulk-user-imports)

## User Search

- **Dashboard Search**: Basic search in User Management
- **Management API Search**: `GET /api/v2/users?q=email:"user@example.com"`
- **Search Engine**: Auth0 uses Elasticsearch
- **Searchable Fields**: `user_id`, `email`, `name`, `nickname`, `app_metadata`, `user_metadata`
- **Best Practices**: Use exact match, avoid broad queries, paginate results

```http
GET /api/v2/users?q=email:"user@example.com"&search_engine=v3
```

**Source**: [User Search](https://auth0.com/docs/manage-users/user-search) | [Search Best Practices](https://auth0.com/docs/manage-users/user-search/user-search-best-practices)

## Organizations

Organizations enable B2B SaaS with per-customer configuration:

### Key Features

- **Members**: Users belonging to an organization
- **Connections**: Per-organization identity provider connections
- **Branding**: Per-organization branding (logo, colors, support URL)
- **Roles**: Per-organization role assignments
- **Invitations**: Invite users to join an organization
- **M2M Access**: Machine-to-machine access for organization APIs

### Create Organization

```http
POST /api/v2/organizations
{
  "name": "acme-corp",
  "display_name": "Acme Corporation",
  "branding": {
    "logo_url": "https://acme.com/logo.png",
    "colors": { "primary": "#FF0000" }
  }
}
```

### Organization-Enabled Connections

```http
POST /api/v2/organizations/{org_id}/enabled_connections
{
  "connection_id": "con_abc123",
  "assign_membership_on_login": true
}
```

### Organization Roles

```http
POST /api/v2/organizations/{org_id}/members/{user_id}/roles
{
  "roles": ["rol_abc123"]
}
```

### Invitations

```http
POST /api/v2/organizations/{org_id}/invitations
{
  "inviter": { "name": "Admin" },
  "invitee": { "email": "user@acme.com" },
  "connection_id": "con_abc123"
}
```

### Token Customization

```javascript
// Action: Add organization to token
exports.onExecutePostLogin = async (event, api) => {
  if (event.organization) {
    api.accessToken.setCustomClaim('org_id', event.organization.id);
    api.accessToken.setCustomClaim('org_name', event.organization.name);
  }
};
```

**Source**: [Organizations](https://auth0.com/docs/manage-users/organizations) | [Organizations Overview](https://auth0.com/docs/manage-users/organizations/organizations-overview) | [Create First Organization](https://auth0.com/docs/manage-users/organizations/create-first-organization) | [Configure Organizations](https://auth0.com/docs/manage-users/organizations/configure-organizations) | [Custom Development](https://auth0.com/docs/manage-users/organizations/custom-development) | [M2M Organizations](https://auth0.com/docs/manage-users/organizations/organizations-for-m2m-applications) | [Using Tokens](https://auth0.com/docs/manage-users/organizations/using-tokens)

## Access Control

### Role-Based Access Control (RBAC)

- **Roles**: Named sets of permissions
- **Permissions**: Scopes associated with APIs
- **Users → Roles → Permissions**: Users assigned roles, roles have permissions

```http
# Create role
POST /api/v2/roles
{ "name": "admin", "description": "Administrator" }

# Assign permissions to role
POST /api/v2/roles/{role_id}/permissions
{ "permissions": [{ "resource_server_identifier": "api-id", "permission_name": "read:items" }] }

# Assign role to user
POST /api/v2/roles/{role_id}/users
{ "users": ["auth0|123456"] }
```

### Authorization Policies

Define custom authorization logic:

- **Step-up authentication**: Require MFA for sensitive operations
- **Context-based access**: IP, time, device-based rules
- **Custom claims**: Inject authorization decisions into tokens

### Authorization Core vs. Extension

| Feature | Core RBAC | Authorization Extension |
|---------|-----------|------------------------|
| **Status** | Current | Legacy (deprecated) |
| **Management** | Dashboard + API | Extension UI |
| **Features** | Roles, permissions | Roles, groups, permissions |
| **Recommendation** | Use this | Migrate to Core |

**Source**: [Access Control](https://auth0.com/docs/manage-users/access-control) | [RBAC](https://auth0.com/docs/manage-users/access-control/rbac) | [Authorization Policies](https://auth0.com/docs/manage-users/access-control/authorization-policies) | [Rules for Authorization Policies](https://auth0.com/docs/manage-users/access-control/rules-for-authorization-policies) | [Configure Core RBAC](https://auth0.com/docs/manage-users/access-control/configure-core-rbac) | [Core vs Extension](https://auth0.com/docs/manage-users/access-control/authorization-core-vs-authorization-extension) | [Sample Use Cases: RBAC](https://auth0.com/docs/manage-users/access-control/sample-use-cases-role-based-access-control) | [Sample Use Cases: Actions with Authorization](https://auth0.com/docs/manage-users/access-control/sample-use-cases-actions-with-authorization) | [Sample Use Cases: Rules with Authorization](https://auth0.com/docs/manage-users/access-control/sample-use-cases-rules-with-authorization)

## My Account API

Allows end-users to manage their own MFA factors:

- List authentication methods
- Add/remove MFA factors
- Update authentication method details
- Requires user's Access Token (not Management API token)

```http
GET /api/v2/myaccount/authentication-methods
Authorization: Bearer USER_ACCESS_TOKEN
```

## My Organization API

Allows organization members to manage their organization:

- Organization details (name, branding)
- Identity providers and SCIM provisioning
- Domains and Home Realm Discovery
- Embeddable UI components

**Source**: [My Account API](https://auth0.com/docs/manage-users/my-account-api) | [My Organization API](https://auth0.com/docs/manage-users/my-organization-api)

## Auth0 APIs

### Authentication API

The Authentication API (`/oauth/token`, `/authorize`, `/userinfo`, etc.) handles:

- User authentication (login, signup, passwordless)
- Token issuance (Authorization Code, Client Credentials, etc.)
- Token refresh and revocation
- User profile retrieval
- MFA challenge/verification

**Base URL**: `https://yourtenant.auth0.com`

### Management API

The Management API (`/api/v2/`) handles:

- User management (CRUD, search, metadata, blocking)
- Application and API configuration
- Connection management
- Organization management
- Role and permission management
- Log retrieval
- Actions, Rules, Hooks management
- Email template configuration
- Tenant settings

**Base URL**: `https://yourtenant.auth0.com/api/v2/`

**Authentication**: Requires Management API Access Token (obtained via Client Credentials flow with `audience=https://yourtenant.auth0.com/api/v2/`)

```http
# Get Management API token
POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "audience": "https://yourtenant.auth0.com/api/v2/"
}
```

### Pagination

Management API uses cursor-based or page-based pagination:

```http
GET /api/v2/users?page=0&per_page=50&include_totals=true
```

**Source**: [Auth0 APIs](https://auth0.com/docs/api) | [Authentication API](https://auth0.com/docs/api/authentication) | [Management API](https://auth0.com/docs/api/management/v2) | [My Account API](https://auth0.com/docs/api/myaccount) | [My Organization API](https://auth0.com/docs/api/myorganization) | [Self-Service Profiles](https://auth0.com/docs/api/management/v2/self-service-profiles) | [Flows](https://auth0.com/docs/api/management/v2/flows) | [Flows Vault Connections](https://auth0.com/docs/api/management/v2/flows/get-flows-vault-connections)

## SDK Libraries

### SPA SDKs

| SDK | Package | Platform |
|-----|---------|----------|
| **React** | `@auth0/auth0-react` | React |
| **Angular** | `@auth0/auth0-angular` | Angular |
| **Vue** | `@auth0/auth0-vue` | Vue 3 |
| **SPA JS** | `@auth0/auth0-spa-js` | Vanilla JS |

```javascript
// React SDK example
import { Auth0Provider } from '@auth0/auth0-react';

<Auth0Provider
  domain="yourtenant.auth0.com"
  clientId="YOUR_CLIENT_ID"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "YOUR_API_IDENTIFIER",
    scope: "openid profile email read:items"
  }}
>
  <App />
</Auth0Provider>
```

### Regular Web App SDKs

| SDK | Package | Platform |
|-----|---------|----------|
| **Next.js** | `@auth0/nextjs-auth0` | Next.js |
| **Express** | `express-openid-connect` | Node.js/Express |
| **ASP.NET Core** | `Auth0.AspNetCore` | .NET |
| **Java Spring** | `auth0-spring-security` | Java/Spring |
| **Python** | `authlib` / custom | Python/Django/Flask |
| **Go** | `golang.org/x/oauth2` | Go |

```javascript
// Next.js SDK example
import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth({
  signup: async (req, res) => {
    await handleLogin(req, res, {
      authorizationParams: { screen_hint: 'signup' }
    });
  }
});
```

### Backend/API SDKs

| SDK | Package | Platform |
|-----|---------|----------|
| **Node.js** | `express-jwt` + `jwks-rsa` | Node.js |
| **ASP.NET Core** | `JwtBearer` middleware | .NET |
| **Java** | `java-jwt` + `jwks-rsa` | Java |
| **Python** | `PyJWT` + `cryptography` | Python |

```javascript
// Express API validation
const { expressjwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://yourtenant.auth0.com/.well-known/jwks.json`
  }),
  audience: 'YOUR_API_IDENTIFIER',
  issuer: `https://yourtenant.auth0.com/`,
  algorithms: ['RS256']
});

app.get('/api/items', checkJwt, (req, res) => {
  res.json({ items: [] });
});
```

### Native/Mobile SDKs

| SDK | Package | Platform |
|-----|---------|----------|
| **iOS/Swift** | `Auth0.swift` | iOS |
| **Android** | `auth0-android` | Android |
| **React Native** | `react-native-auth0` | React Native |
| **Flutter** | `auth0_flutter` | Flutter |

### Management API SDKs

| SDK | Package | Platform |
|-----|---------|----------|
| **Node.js** | `auth0` | Node.js |
| **Python** | `auth0-python` | Python |
| **Java** | `auth0-java` | Java |
| **.NET** | `Auth0.ManagementApi` | .NET |

```javascript
// Node.js Management SDK
const { ManagementClient } = require('auth0');
const management = new ManagementClient({
  domain: 'yourtenant.auth0.com',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  scope: 'read:users update:users'
});

const users = await management.users.getAll();
```

### Lock SDK

Auth0 Lock is a embeddable login widget:

```html
<script src="https://cdn.auth0.com/js/lock/12/lock.min.js"></script>
<script>
  var lock = new Auth0Lock('CLIENT_ID', 'TENANT.auth0.com', {
    auth: {
      redirectUrl: 'https://yourapp.com/callback',
      responseType: 'code',
      params: { scope: 'openid profile email' }
    }
  });
  lock.show();
</script>
```

### ACUL SDKs (Advanced Customization for Universal Login)

| SDK | Package | Description |
|-----|---------|-------------|
| **ACUL JS SDK** | `@auth0/auth0-acul-js` | JavaScript SDK for custom Universal Login pages |
| **ACUL React SDK** | `@auth0/auth0-acul-react` | React components and hooks for Universal Login |

**Source**: [SDK Libraries](https://auth0.com/docs/libraries) | [auth0.js](https://auth0.com/docs/libraries/auth0js) | [Lock](https://auth0.com/docs/libraries/lock) | [ACUL JS](https://auth0.com/docs/libraries/acul/js-sdk) | [ACUL React](https://auth0.com/docs/libraries/acul/react-sdk) | [Next.js SDK](https://auth0.com/docs/libraries/nextjs-sdk) | [Express SDK](https://auth0.com/docs/libraries/express-sdk) | [.NET SDK](https://auth0.com/docs/libraries/dotnet-sdk) | [Spring SDK](https://auth0.com/docs/libraries/spring-sdk) | [Python SDK](https://auth0.com/docs/libraries/python-sdk) | [Go SDK](https://auth0.com/docs/libraries/go-sdk) | [iOS SDK](https://auth0.com/docs/libraries/ios-sdk) | [Android SDK](https://auth0.com/docs/libraries/android-sdk) | [Flutter SDK](https://auth0.com/docs/libraries/flutter-sdk) | [SPA JS](https://auth0.com/docs/libraries/auth0-spa-js) | [JS SDK](https://auth0.com/docs/libraries/js-sdk) | [React SDK](https://auth0.com/docs/libraries/react-sdk) | [Management API: Branding Theme](https://auth0.com/docs/api/management/v2/branding) | [Management API: Phone Provider](https://auth0.com/docs/api/management/v2/phone-provider) | [Management API: Email Provider](https://auth0.com/docs/api/management/v2/emails) | [Management API: Custom Signing Keys](https://auth0.com/docs/api/management/v2/keys) | [Management API: Resource Servers](https://auth0.com/docs/api/management/v2/resource-servers) | [Management API: Client Grants](https://auth0.com/docs/api/management/v2/client-grants) | [Management API: Clients](https://auth0.com/docs/api/management/v2/clients) | [Management API: Credentials](https://auth0.com/docs/api/management/v2/credentials) | [Management API: Rotate Secret](https://auth0.com/docs/api/management/v2/clients/rotate-secret) | [Management API: Connection Keys](https://auth0.com/docs/api/management/v2/connections/connection-keys) | [Management API: SCIM Configuration](https://auth0.com/docs/api/management/v2/scim-configuration) | [Management API: SCIM Token](https://auth0.com/docs/api/management/v2/scim-token) | [Management API: Synchronized Groups](https://auth0.com/docs/api/management/v2/synchronized-groups) | [Management API: Directory Provisioning](https://auth0.com/docs/api/management/v2/directory-provisioning) | [Management API: Custom Domains](https://auth0.com/docs/api/management/v2/custom-domains) | [Management API: Hooks](https://auth0.com/docs/api/management/v2/hooks) | [Management API: User Exports](https://auth0.com/docs/api/management/v2/jobs/user-exports) | [Management API: User Imports](https://auth0.com/docs/api/management/v2/jobs/user-imports) | [Management API: Verification Email](https://auth0.com/docs/api/management/v2/jobs/verification-email) | [Management API: Guardian](https://auth0.com/docs/api/management/v2/guardian) | [Management API: Enrollments](https://auth0.com/docs/api/management/v2/guardian/enrollments) | [Management API: Factors](https://auth0.com/docs/api/management/v2/guardian/factors) | [Management API: SMS Templates](https://auth0.com/docs/api/management/v2/guardian/sms-templates) | [Management API: Twilio](https://auth0.com/docs/api/management/v2/guardian/twilio) | [Management API: SNS](https://auth0.com/docs/api/management/v2/guardian/sns) | [Management API: APNs](https://auth0.com/docs/api/management/v2/guardian/apns) | [Management API: FCM](https://auth0.com/docs/api/management/v2/guardian/fcm) | [Management API: Duo](https://auth0.com/docs/api/management/v2/guardian/duo) | [Management API: Roles](https://auth0.com/docs/api/management/v2/roles) | [Management API: Role Permissions](https://auth0.com/docs/api/management/v2/roles/role-permission) | [Management API: Role Users](https://auth0.com/docs/api/management/v2/roles/role-user) | [Management API: Rules Configs](https://auth0.com/docs/api/management/v2/rules-configs) | [Management API: Tickets](https://auth0.com/docs/api/management/v2/tickets) | [Management API: Password Change](https://auth0.com/docs/api/management/v2/tickets/password-change) | [Management API: Email Verification](https://auth0.com/docs/api/management/v2/tickets/email-verification) | [Management API: Token Exchange Profiles](https://auth0.com/docs/api/management/v2/token-exchange-profiles) | [Management API: User Blocks](https://auth0.com/docs/api/management/v2/user-blocks) | [Management API: Users by Email](https://auth0.com/docs/api/management/v2/users-by-email) | [Management API: Authentication Methods](https://auth0.com/docs/api/management/v2/authentication-methods) | [Management API: Authenticators](https://auth0.com/docs/api/management/v2/authenticators) | [Management API: Permissions](https://auth0.com/docs/api/management/v2/permissions) | [Management API: User Identity](https://auth0.com/docs/api/management/v2/user-identity) | [Management API: User Roles](https://auth0.com/docs/api/management/v2/user-roles) | [Management API: Connected Accounts](https://auth0.com/docs/api/management/v2/connected-accounts) | [Management API: Recovery Code](https://auth0.com/docs/api/management/v2/recovery-code) | [Management API: Effective Permissions](https://auth0.com/docs/api/management/v2/effective-permissions) | [Management API: Effective Roles](https://auth0.com/docs/api/management/v2/effective-roles) | [Management API: User Groups](https://auth0.com/docs/api/management/v2/user-groups) | [Management API: User Organizations](https://auth0.com/docs/api/management/v2/user-organizations) | [Management API: Revoke Access](https://auth0.com/docs/api/management/v2/revoke-access) | [Management API: Stats](https://auth0.com/docs/api/management/v2/stats) | [Management API: Active Users](https://auth0.com/docs/api/management/v2/stats/active-users) | [Management API: Daily Stats](https://auth0.com/docs/api/management/v2/stats/daily-stats) | [Management API: Tenant Settings](https://auth0.com/docs/api/management/v2/tenant-settings) | [Management API: Actions Modules](https://auth0.com/docs/api/management/v2/actions/modules) | [Management API: Action Versions](https://auth0.com/docs/api/management/v2/actions/versions) | [Management API: Action Execution](https://auth0.com/docs/api/management/v2/actions/execution) | [Management API: Test Action](https://auth0.com/docs/api/management/v2/actions/test-action) | [Management API: Deploy Action](https://auth0.com/docs/api/management/v2/actions/deploy-action) | [Management API: Rollback Action](https://auth0.com/docs/api/management/v2/actions/rollback-action) | [Prompts: Rendering](https://auth0.com/docs/api/management/v2/prompts/rendering) | [Prompts: Custom Text](https://auth0.com/docs/api/management/v2/prompts/custom-text) | [Prompts: Partials](https://auth0.com/docs/api/management/v2/prompts/partials)

## Deployment

### Deployment Options

| Option | Description |
|--------|-------------|
| **Public Cloud (SaaS)** | Auth0-hosted, shared infrastructure |
| **Private Cloud** | Dedicated infrastructure (Enterprise) |
| **Self-hosted** | Not available — Auth0 is cloud-only |

### Deploy CLI Tool

Migrate Auth0 configuration between tenants:

```bash
# Install
npm install -g auth0-deploy-cli

# Export configuration
a0deploy export -c config.json -o output/

# Import configuration
a0deploy import -c config.json -i input/
```

**Configuration file** (`config.json`):
```json
{
  "AUTH0_DOMAIN": "yourtenant.auth0.com",
  "AUTH0_CLIENT_ID": "YOUR_CLIENT_ID",
  "AUTH0_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
  "AUTH0_ALLOW_DELETE": false
}
```

### Auth0 CLI

Command-line tool for managing Auth0 resources:

```bash
# Install
brew install auth0-cli  # macOS
# or: scoop install auth0  # Windows
# or: download from GitHub releases

# Authenticate
auth0 login

# Manage applications
auth0 apps create --name "My App" --type spa
auth0 apps list
auth0 apps show <app-id>

# Manage APIs
auth0 apis create --name "My API" --identifier "https://api.myapp.com"
auth0 apis list

# Manage users
auth0 users create --connection "Username-Password-Authentication"
auth0 users search --query "email:user@example.com"

# Manage tenant settings
auth0 tenants list
auth0 tenants use <tenant>

# Test login flow
auth0 test login --client <client-id>

# Logs
auth0 logs list
auth0 logs tail
```

### Auth0 Terraform Provider

Infrastructure-as-code for Auth0:

```hcl
terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 1.0"
    }
  }
}

provider "auth0" {
  domain        = "yourtenant.auth0.com"
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

# Create application
resource "auth0_client" "my_app" {
  name     = "My SPA App"
  app_type = "spa"
  callbacks = ["https://myapp.com/callback"]
}

# Create API
resource "auth0_resource_server" "my_api" {
  name       = "My API"
  identifier = "https://api.myapp.com"
  scopes {
    name = "read:items"
    description = "Read items"
  }
}

# Create connection
resource "auth0_connection" "google" {
  name     = "google-oauth2"
  strategy = "google-oauth2"
}
```

### Deployment Checklist

- [ ] Configure allowed callback/logout URLs for production
- [ ] Set up custom domain
- [ ] Configure email provider
- [ ] Enable attack protection features
- [ ] Set up MFA policies
- [ ] Configure token expiration settings
- [ ] Set up log streams
- [ ] Test all auth flows
- [ ] Configure rate limits
- [ ] Set up monitoring alerts
- [ ] Export configuration for backup
- [ ] Review user roles and permissions

### Deployment Best Practices

- Use separate tenants for dev/staging/production
- Use Deploy CLI or Terraform for config management
- Never hardcode secrets — use environment variables
- Test configuration imports in dev first
- Use Actions (not Rules) for custom logic
- Enable breach password detection in production
- Set up log streaming for audit trail

**Source**: [Deployment](https://auth0.com/docs/deploy-monitor) | [Deployment Options](https://auth0.com/docs/deploy-monitor/deployment-options) | [Private Cloud on AWS](https://auth0.com/docs/deploy-monitor/deployment-options/private-cloud-deployments/private-cloud-on-aws) | [Private Cloud on Azure](https://auth0.com/docs/deploy-monitor/deployment-options/private-cloud-deployments/private-cloud-on-azure) | [Private Cloud Add-on Features](https://auth0.com/docs/deploy-monitor/deployment-options/private-cloud-deployments/private-cloud-add-on-features) | [Deploy CLI](https://auth0.com/docs/deploy-monitor/cli) | [Auth0 Deploy CLI](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli) | [Authenticate with Tenant](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/authenticate-with-your-tenant) | [Resource Config Formats](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/available-resource-configuration-formats) | [Configure Deploy CLI](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/configure-the-deploy-cli) | [Exclude Resources](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/exclude-resources-from-management) | [Multi-env Workflows](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/incorporate-into-multi-environment-workflows) | [Keyword Replacement](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/keyword-replacement) | [Resource-specific Docs](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/resource-specific-documentation) | [Use as CLI](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/use-as-a-cli) | [Use as Node Module](https://auth0.com/docs/deploy-monitor/cli/auth0-deploy-cli/use-deploy-cli-as-a-node-module) | [Auth0 CLI](https://auth0.com/docs/deploy-monitor/auth0-cli) | [Terraform Provider](https://auth0.com/docs/deploy-monitor/auth0-terraform-provider) | [Deployment Checklist](https://auth0.com/docs/deploy-monitor/deploy-checklist) | [Best Practices](https://auth0.com/docs/deploy-monitor/deployment-best-practices)

## Monitoring

### Monitor

- **Service Status**: [status.auth0.com](https://status.auth0.com)
- **Uptime**: 99.99% SLA on Enterprise
- **Real-time Metrics**: Login success/failure rates, latency
- **Anomaly Detection**: Unusual auth patterns

### Logs

Auth0 logs all authentication and management events:

| Log Type | Description |
|----------|-------------|
| `s` | Success Login |
| `seacft` | Success Exchange (Authorization Code for Access Token) |
| `f` | Failed Login |
| `w` | Warning during login |
| `feacft` | Failed Exchange |
| `fp` | Failed Login (incorrect password) |
| `fco` | Failed by CORS |
| `fmft` | Failed MFA |
| `fu` | Failed Login (invalid email/username) |
| `fde` | Failed Delegation |
| `sd` | Success Delegation |
| `sapi` | API Operation (Management API) |
| `fapi` | Failed API Operation |
| `du` | Delete User |
| `fu` | Failed Login (invalid email/username) |
| `sv` | Success Verification Email |
| `fv` | Failed Verification Email |
| `scpr` | Success Change Password Request |
| `fcpr` | Failed Change Password Request |
| `sc` | Success Change Password |
| `fc` | Failed Change Password |

```http
GET /api/v2/logs?page=0&per_page=50&sort=date:-1
```

### Metric Streams

Stream real-time metrics to external monitoring:

- **Amazon CloudWatch**: AWS monitoring
- **Datadog**: Infrastructure monitoring
- **HTTP Webhook**: Custom endpoint

**Source**: [Monitoring](https://auth0.com/docs/deploy-monitor/monitor) | [Logs](https://auth0.com/docs/deploy-monitor/logs) | [Log Data Retention](https://auth0.com/docs/deploy-monitor/logs/log-data-retention) | [Filter Log Events](https://auth0.com/docs/deploy-monitor/logs/filter-log-events) | [Log Type Codes](https://auth0.com/docs/deploy-monitor/logs/log-type-codes) | [Metric Streams](https://auth0.com/docs/deploy-monitor/metric-streams)

## Auth0 AI

### Auth0 for AI Agents

Authentication and authorization for AI agents:

- **Agent Authentication**: OAuth 2.0 for AI agents
- **Agent Authorization**: Scopes and permissions for agent actions
- **Token Vault**: Secure token storage for agent API access
- **Fine-Grained Authorization**: Per-resource access control

### Auth0 MCP Server

Model Context Protocol server for Auth0 integration with AI coding tools:

- Exposes Auth0 Management API to AI agents
- Enables AI agents to manage Auth0 configuration
- [Documentation](https://auth0.com/docs/customize/integrations/ai-tools/auth0-mcp-server)

### Auth0 Agent Skills

Pre-built skills for AI coding agents (Claude Code, etc.) to integrate Auth0:

- [github.com/auth0/agent-skills](https://github.com/auth0/agent-skills)

### Build with AI Tools

Resources for integrating Auth0 with AI development tools:

- MCP server setup
- Agent Skills installation
- AI agent authentication patterns
- Agent Experience Score

**Source**: [Auth0 AI](https://auth0.com/docs/ai) | [Auth0 for AI Agents](https://auth0.com/docs/get-started/auth0-for-ai-agents) | [MCP Server](https://auth0.com/docs/customize/integrations/ai-tools/auth0-mcp-server) | [Build with AI Tools](https://auth0.com/docs/get-started/build-with-ai-tools) | [Agent Experience](https://auth0.com/docs/get-started/auth0-agent-experience)

## Platform

### Customer Support

- **Free**: Community support
- **Essential**: Email support
- **Professional**: Priority email + chat
- **Enterprise**: Dedicated support + SLA

### Product Lifecycle

- **Beta**: Feature in testing, may change
- **GA**: General availability, stable
- **Deprecated**: End-of-life announced
- **End of Life**: No longer supported

### Operational Policies

- **Rate Limits**: Per-plan limits on API calls and logins
- **Tenant Deletion**: Auto-deletion for inactive free tenants
- **Data Export**: Export all data before deletion
- **Subscription Management**: Upgrade/downgrade via Dashboard

**Source**: [Platform](https://auth0.com/docs/troubleshoot) | [Customer Support](https://auth0.com/docs/troubleshoot/customer-support) | [Update Billing](https://auth0.com/docs/troubleshoot/update-billing-information) | [Manage Subscriptions](https://auth0.com/docs/troubleshoot/manage-subscriptions) | [Delete or Reset Tenant](https://auth0.com/docs/troubleshoot/delete-or-reset-tenant) | [Export Data](https://auth0.com/docs/troubleshoot/export-data) | [Monitor Subscription Usage](https://auth0.com/docs/troubleshoot/monitor-subscription-usage) | [Reset Account Passwords](https://auth0.com/docs/troubleshoot/reset-account-passwords) | [Product Lifecycle](https://auth0.com/docs/troubleshoot/product-lifecycle) | [Past Migrations](https://auth0.com/docs/troubleshoot/past-migrations) | [Operational Policies](https://auth0.com/docs/troubleshoot/operational-policies) | [Changelog](https://auth0.com/changelog)
