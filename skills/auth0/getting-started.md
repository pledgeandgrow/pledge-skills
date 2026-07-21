# Auth0 — Getting Started

> **Version**: Latest | **Source**: [auth0.com/docs](https://auth0.com/docs)

## What is Auth0

Auth0 is an easy-to-implement, adaptable, and scalable authentication and authorization platform. It provides identity infrastructure for web, mobile, legacy, and AI applications, supporting OAuth 2.0, OpenID Connect, SAML, and custom protocols.

### Core Capabilities

- **Authentication**: Universal Login, embedded login, passwordless, social, enterprise
- **Authorization**: RBAC, authorization policies, fine-grained authorization (FGA)
- **User Management**: Profiles, metadata, organizations, user migration, search
- **Security**: MFA, attack protection, breached passwords, token management
- **Extensibility**: Actions, rules, hooks, forms, custom domains, branding
- **AI**: Auth0 for AI Agents, MCP server, agent skills, AI tools

### Architecture

Auth0 is a cloud-hosted identity platform (with private cloud options) that sits between your applications and identity providers:

```
[User] → [Your App] → [Auth0 Tenant] → [Identity Provider]
                         ↓
                    [Your API] ← [Access Token]
```

**Key components**:
- **Tenant**: Top-level Auth0 account, identified by a domain (e.g., `mytenant.us.auth0.com`)
- **Applications**: Registered client apps (SPA, Regular Web App, Native/Mobile, Machine-to-Machine)
- **APIs**: Protected resource servers registered with Auth0
- **Connections**: Identity sources (database, social, enterprise, passwordless)
- **Universal Login**: Auth0-hosted authentication pages

**Source**: [Auth0 Overview](https://auth0.com/docs/get-started/auth0-overview)

## Identity Fundamentals

### Authentication vs. Authorization

- **Authentication (AuthN)**: Verifying *who* a user is (login, MFA, passwordless)
- **Authorization (AuthZ)**: Determining *what* a user can access (RBAC, scopes, policies)

### Identity and Access Management (IAM)

IAM encompasses the frameworks, policies, and technologies that manage digital identities and their access to resources. Auth0 provides IAM as a service (CIAM — Customer Identity and Access Management).

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Tenant** | Auth0 account with unique domain |
| **Application** | Client app registered with Auth0 (SPA, Web, Native, M2M) |
| **API** | Protected resource server |
| **Connection** | Identity source (database, social, enterprise, passwordless) |
| **Universal Login** | Auth0-hosted login pages |
| **Token** | Credential issued after authentication (ID, Access, Refresh) |
| **Scope** | Permission granted to a client app |
| **Action** | Custom Node.js code executed during auth flows |
| **Organization** | B2B customer/partner grouping with per-org connections |

**Source**: [Identity Fundamentals](https://auth0.com/docs/get-started/identity-fundamentals) | [Introduction to Auth0](https://auth0.com/docs/get-started/identity-fundamentals/introduction-to-auth0) | [IAM](https://auth0.com/docs/get-started/identity-fundamentals/identity-and-access-management) | [AuthN vs AuthZ](https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization)

## Quickstarts

### Application Types

| Type | Examples | Recommended Flow |
|------|----------|-----------------|
| **Single Page App (SPA)** | React, Angular, Vue, Svelte | Authorization Code Flow with PKCE |
| **Regular Web App** | Next.js, Express, Django, Spring | Authorization Code Flow |
| **Native/Mobile App** | iOS, Android, React Native, Flutter | Authorization Code Flow with PKCE |
| **Backend/API** | REST APIs, GraphQL | Client Credentials Flow |
| **Machine-to-Machine** | Services, daemons, cron jobs | Client Credentials Flow |

### Available Quickstarts

- **React**: `@auth0/auth0-react` SDK
- **Angular**: `@auth0/auth0-angular` SDK
- **Next.js**: `@auth0/nextjs-auth0` SDK
- **Vue**: `@auth0/auth0-vue` SDK
- **iOS/Swift**: `Auth0.swift` SDK
- **Android**: `auth0-android` SDK
- **Node.js/Express**: `express-openid-connect` SDK
- **Java/Spring**: `auth0-spring-security` SDK
- **.NET/ASP.NET Core**: `Auth0.AspNetCore` SDK
- **Python/Django**: `authlib` / `django-auth0` SDK
- **Go**: `golang.org/x/oauth2` + Auth0 endpoints
- **Agent Skills**: AI agent integration quickstart

**Source**: [Quickstarts](https://auth0.com/docs/quickstarts) | [Agent Skills](https://auth0.com/docs/quickstart/agent-skills)

## Configure Auth0

### Dashboard

The Auth0 Dashboard ([manage.auth0.com](https://manage.auth0.com)) is the primary management interface:

- **Applications**: Register and configure client apps
- **APIs**: Register protected APIs, define scopes
- **Connections**: Enable identity providers (social, enterprise, database, passwordless)
- **Universal Login**: Customize login/consent pages
- **Actions**: Manage custom auth logic
- **User Management**: Search, create, block, delete users
- **Organizations**: Manage B2B organizations
- **Branding**: Custom domains, emails, logos, colors
- **Logs**: View auth events and errors
- **Settings**: Tenant configuration, flags, advanced

### Tenants

- Each tenant has a unique domain: `yourtenant.us.auth0.com` (US), `.eu.auth0.com` (EU), `.au.auth0.com` (AU)
- Multiple tenants can be managed under one account
- Tenant settings: supported logins, connection settings, API authorization settings
- Environments: Development, Staging, Production tenants

### Applications

| Setting | Description |
|---------|-------------|
| **Application Type** | SPA, Regular Web, Native, M2M |
| **Client ID** | Public identifier for the app |
| **Client Secret** | Secret for confidential clients (web, M2M) |
| **Allowed Callback URLs** | URLs Auth0 can redirect to after login |
| **Allowed Logout URLs** | URLs Auth0 can redirect to after logout |
| **Allowed Web Origins** | Origins allowed for CORS (SPAs) |
| **Grant Types** | OAuth 2.0 grant types enabled |
| **Token Endpoint Auth Method** | How the client authenticates to the token endpoint |

### Register APIs

1. Go to Dashboard → APIs → Create API
2. Set **Identifier** (audience) — used as the `audience` parameter in auth requests
3. Define **Scopes** (permissions)
4. Enable **RBAC** if needed
5. Configure **Token Settings** (expiration, signing algorithm)

```javascript
// Example: API scopes
{
  "read:items": "Read items",
  "write:items": "Write items",
  "delete:items": "Delete items",
  "admin": "Full access"
}
```

### Auth0 Teams

- Multiple team members can collaborate on a tenant
- Roles: Owner, Admin, Deployer, Viewer
- Team members authenticate via their own Auth0 accounts
- SSO for dashboard access available on Enterprise plans

**Source**: [Auth0 Teams](https://auth0.com/docs/get-started/auth0-teams) | [Dashboard Profile](https://auth0.com/docs/get-started/dashboard-profile) | [Tenant Settings](https://auth0.com/docs/get-started/tenant-settings) | [Manage Dashboard Access](https://auth0.com/docs/get-started/manage-dashboard-access)

**Source**: [Dashboard](https://auth0.com/docs/get-started/auth0-overview/dashboard) | [Create Tenants](https://auth0.com/docs/get-started/auth0-overview/create-tenants) | [Create Applications](https://auth0.com/docs/get-started/auth0-overview/create-applications) | [Applications in Auth0](https://auth0.com/docs/get-started/auth0-overview/applications-in-auth0) | [Register APIs](https://auth0.com/docs/get-started/auth0-overview/set-up-apis)

## Authentication and Authorization Flows

### Which Flow Should I Use?

| Application Type | Recommended Flow |
|-----------------|-----------------|
| Server-side Web App | Authorization Code Flow |
| SPA | Authorization Code Flow with PKCE |
| Mobile/Native | Authorization Code Flow with PKCE |
| Machine-to-Machine | Client Credentials Flow |
| Highly-trusted app | Resource Owner Password Flow |
| Input-constrained device | Device Authorization Flow |
| Backchannel-initiated | CIBA Flow |

### Authorization Code Flow

Server-side web apps exchange an authorization code for tokens:

```
User → Browser → /authorize → Auth0 Login → Redirect with code
                                                    ↓
App Server → /oauth/token (code + client_secret) → Access Token + ID Token
```

```
GET https://yourtenant.auth0.com/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourapp.com/callback&
  scope=openid profile email&
  state=xyz&
  audience=YOUR_API_IDENTIFIER
```

### Authorization Code Flow with PKCE

For SPAs and mobile apps that cannot securely store a client secret:

```
1. App generates code_verifier (random string) and code_challenge (SHA256 hash)
2. /authorize?response_type=code&code_challenge=...&code_challenge_method=S256
3. Auth0 redirects back with code
4. App exchanges code + code_verifier at /oauth/token
```

### Authorization Code Flow with Enhanced Privacy

- **RAR** (Rich Authorization Requests): Detailed authorization data
- **PAR** (Pushed Authorization Requests): Push auth request to AS, get request_uri
- **JAR** (JWT-Secured Authorization Requests): Signed auth request as JWT
- **JWE** (JSON Web Encryption): Encrypt access tokens

### Implicit Flow with Form Post

> **Deprecated**: Use Authorization Code Flow with PKCE instead.

Returns tokens directly in the redirect (no code exchange). Was used by SPAs before PKCE was widely supported.

### Hybrid Flow

Returns both code and tokens. Useful when you need an ID token immediately but also want to exchange the code for an access token server-side.

### Client Credentials Flow

Machine-to-machine authentication (no user involved):

```http
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "audience": "YOUR_API_IDENTIFIER"
}
```

### Device Authorization Flow

For input-constrained devices (TVs, IoT):

```
1. Device requests /oauth/device/code → gets device_code + user_code + verification_uri
2. User visits verification_uri on another device, enters user_code
3. Device polls /oauth/token until user authorizes → gets Access Token
```

### Resource Owner Password Flow

> **Not recommended**: User enters credentials directly in the app. Only for highly-trusted apps.

```http
POST /oauth/token
{
  "grant_type": "password",
  "username": "user@example.com",
  "password": "secret",
  "client_id": "YOUR_CLIENT_ID",
  "audience": "YOUR_API_IDENTIFIER",
  "scope": "openid profile email"
}
```

### Client-Initiated Backchannel Authentication (CIBA)

Backchannel flow where a device initiates auth without user interaction on that device:

```
1. Client sends auth request to /backchannel/authenticate → gets auth_req_id
2. User approves on a separate device (e.g., mobile push)
3. Client polls /oauth/token with auth_req_id → gets tokens
```

### Custom Token Exchange

RFC 8693 token exchange — swap one token for another (e.g., exchange an external IdP token for Auth0 tokens):

```
POST /oauth/token
{
  "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token": "EXTERNAL_TOKEN",
  "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "audience": "YOUR_API_IDENTIFIER"
}
```

### Private Key JWT

Client authenticates using a signed JWT assertion instead of a client secret:

```http
POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  "client_assertion": "SIGNED_JWT",
  "client_id": "YOUR_CLIENT_ID"
}
```

### Mutual TLS (mTLS)

Client authenticates using X.509 certificates. Optionally binds access tokens to the client's certificate (sender constraining).

**Source**: [Authentication and Authorization Flows](https://auth0.com/docs/get-started/authentication-and-authorization-flow) | [Which OAuth 2.0 Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use) | [Authorization Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow) | [PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce) | [Client Credentials](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow) | [Device Authorization](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow) | [Resource Owner Password](https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow) | [CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow) | [Custom Token Exchange](https://auth0.com/docs/authenticate/custom-token-exchange) | [Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt) | [mTLS](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-mtls) | [RAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-rar) | [PAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-par) | [JAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-jar)

## Architecture Scenarios

### Typical Setup

1. **Register your app** in Auth0 Dashboard
2. **Register your API** with scopes
3. **Configure connections** (database, social, enterprise)
4. **Enable Universal Login** for hosted login pages
5. **Install SDK** in your app
6. **Configure callback/logout URLs**
7. **Implement login/logout** using SDK
8. **Protect your API** by validating Access Tokens

### SPA + API Architecture

```
[Browser SPA] → login → [Auth0 Universal Login]
                 ↓                    ↓
            Access Token      [Auth0 Tenant]
                 ↓
            [Your API] → validate JWT → respond
```

### B2B SaaS Architecture

```
[Customer A Admin] → [Auth0 Organization A] → [Your App]
[Customer B Admin] → [Auth0 Organization B] → [Your App]
                         ↓
                    [Your API]
```

### M2M Architecture

```
[Service A] → client_credentials → [Auth0] → Access Token → [Service B API]
```

**Source**: [Architecture Scenarios](https://auth0.com/docs/get-started/identity-fundamentals) | [Auth0 Overview](https://auth0.com/docs/get-started/auth0-overview) | [Client Credentials Exchange](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-exchange) | [Architecture Scenarios](https://auth0.com/docs/get-started/architecture-scenarios) | [Business to Employees](https://auth0.com/docs/get-started/architecture-scenarios/business-to-employees) | [Business to Business](https://auth0.com/docs/get-started/architecture-scenarios/business-to-business) | [Business to Consumer](https://auth0.com/docs/get-started/architecture-scenarios/business-to-consumer) | [Multiple Organization Architecture](https://auth0.com/docs/get-started/architecture-scenarios/multiple-organization-architecture) | [Introduction to IAM](https://auth0.com/docs/get-started/identity-fundamentals/introduction-to-identity-and-access-management) | [Custom Token Exchange Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/custom-token-exchange-flow)

## Contributing and Community

- **Community**: [community.auth0.com](https://community.auth0.com)
- **Blog**: [auth0.com/blog](https://auth0.com/blog)
- **Changelog**: [auth0.com/changelog](https://auth0.com/changelog)
- **Developer Hub**: [developer.auth0.com](https://developer.auth0.com)
- **Code Samples**: [developer.auth0.com/resources](https://developer.auth0.com/resources)
- **GitHub**: [github.com/auth0](https://github.com/auth0)

**Source**: [Auth0 Docs](https://auth0.com/docs) | [Platform](https://auth0.com/docs/troubleshoot) | [Service Status](https://auth0.com/docs/deploy-monitor/monitor/service-status) | [Change Log](https://auth0.com/docs/deploy-monitor/monitor/change-log) | [Rate Limits](https://auth0.com/docs/deploy-monitor/monitor/rate-limits)
