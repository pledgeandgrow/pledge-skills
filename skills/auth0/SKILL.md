---
name: auth0-docs
version: "latest"
tags:
  - auth0
  - authentication
  - authorization
  - identity
  - oauth
  - oauth2
  - oidc
  - openid-connect
  - saml
  - jwt
  - sso
  - single-sign-on
  - mfa
  - multi-factor-authentication
  - passwordless
  - social-login
  - enterprise-sso
  - rbac
  - role-based-access-control
  - tokens
  - access-token
  - id-token
  - refresh-token
  - security
  - breached-passwords
  - attack-protection
  - actions
  - rules
  - hooks
  - universal-login
  - custom-domains
  - organizations
  - b2b
  - user-management
  - user-metadata
  - tenant
  - management-api
  - authentication-api
  - sdk
  - cli
  - terraform
  - deployment
  - monitoring
  - logs
  - log-streams
  - compliance
  - gdpr
  - hipaa
  - soc2
  - ai-agents
  - mcp-server
  - ciba
  - pkce
  - mtls
  - token-exchange
  - sessions
  - cookies
  - branding
  - localization
description: |
  Auth0 — identity platform: auth flows, Universal Login, SSO, identity providers, MFA, RBAC, Actions, tokens.
---

# Auth0 Skill

> **Auth0** — Identity platform for authentication, authorization, and user management.
> **Version**: Latest | **Docs**: [auth0.com/docs](https://auth0.com/docs)

## Quick Reference

| Topic | File | Sections |
|-------|------|----------|
| Getting Started | `getting-started.md` | Overview, identity fundamentals, quickstarts, configure Auth0, auth flows, architecture |
| Authentication | `authentication.md` | Universal Login, passwordless, identity providers (social/enterprise/database), protocols (OAuth 2.0, OIDC, SAML), custom token exchange, sessions, cookies |
| Customize & Secure | `customize-secure.md` | Branding, login pages, custom domains, emails, Actions, Rules, Hooks, Forms, tokens (ID/Access/Refresh/JWT), MFA, attack protection, compliance |
| Manage & Deploy | `manage-deploy.md` | User accounts, metadata, migration, search, organizations, RBAC, APIs, SDKs, CLI, Terraform, deployment, monitoring, logs, AI |

## Core Concepts

- **Tenant**: Auth0 account with unique domain (`yourtenant.auth0.com`)
- **Application**: Client app (SPA, Web, Native, M2M) registered with Auth0
- **API**: Protected resource server with scopes
- **Connection**: Identity source (database, social, enterprise, passwordless)
- **Universal Login**: Auth0-hosted authentication pages (recommended)
- **Token**: Credential after authentication (ID Token, Access Token, Refresh Token)
- **Action**: Custom Node.js code executed during auth flows (replaces Rules/Hooks)
- **Organization**: B2B customer grouping with per-org connections and branding
- **Scope**: Permission granted to a client app (e.g., `read:items`)

## Authentication Flows

| Flow | Use Case |
|------|----------|
| Authorization Code Flow | Server-side web apps |
| Authorization Code Flow with PKCE | SPAs, mobile apps |
| Client Credentials Flow | Machine-to-machine |
| Device Authorization Flow | Input-constrained devices |
| Resource Owner Password Flow | Highly-trusted apps (not recommended) |
| Implicit Flow with Form Post | Legacy SPAs (deprecated) |
| Hybrid Flow | Need ID token immediately + code exchange |
| CIBA | Backchannel-initiated authentication |
| Custom Token Exchange (RFC 8693) | Token swapping, delegation |

## Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /authorize` | Authorization endpoint (user login) |
| `POST /oauth/token` | Token endpoint (exchange code, get tokens) |
| `GET /userinfo` | Get user profile with Access Token |
| `GET /.well-known/openid-configuration` | OIDC discovery document |
| `GET /.well-known/jwks.json` | JSON Web Key Set for JWT verification |
| `GET /v2/logout` | Logout endpoint |
| `POST /dbconnections/change_password` | Password reset |
| `POST /oauth/revoke` | Revoke refresh token |
| `GET /api/v2/*` | Management API |
| `POST /api/v2/myaccount/*` | My Account API (user self-service) |

## SDKs

| Platform | SDK |
|----------|-----|
| React | `@auth0/auth0-react` |
| Angular | `@auth0/auth0-angular` |
| Vue | `@auth0/auth0-vue` |
| Next.js | `@auth0/nextjs-auth0` |
| Express | `express-openid-connect` |
| iOS/Swift | `Auth0.swift` |
| Android | `auth0-android` |
| React Native | `react-native-auth0` |
| Flutter | `auth0_flutter` |
| ASP.NET Core | `Auth0.AspNetCore` |
| Java/Spring | `auth0-spring-security` |
| Node.js (Management) | `auth0` |
| Python (Management) | `auth0-python` |
| Lock (widget) | `@auth0/lock` |
| SPA JS | `@auth0/auth0-spa-js` |

## CLI Commands

```bash
auth0 login                                    # Authenticate
auth0 apps create --name "App" --type spa      # Create app
auth0 apps list                                # List apps
auth0 apis create --name "API" --identifier .. # Create API
auth0 users create --connection "..."          # Create user
auth0 users search --query "email:.."          # Search users
auth0 logs list                                # View logs
auth0 logs tail                                # Tail logs
auth0 tenants list                             # List tenants
auth0 test login --client <id>                 # Test login flow
```

## Terraform

```hcl
provider "auth0" {
  domain        = "yourtenant.auth0.com"
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

resource "auth0_client" "app" {
  name     = "My App"
  app_type = "spa"
  callbacks = ["https://myapp.com/callback"]
}
```

## Official Documentation Links

### Get Started
- [Auth0 Docs Home](https://auth0.com/docs)
- [Quickstarts](https://auth0.com/docs/quickstarts)
- [Auth0 Overview](https://auth0.com/docs/get-started/auth0-overview)
- [Identity Fundamentals](https://auth0.com/docs/get-started/identity-fundamentals)
- [Introduction to Auth0](https://auth0.com/docs/get-started/identity-fundamentals/introduction-to-auth0)
- [IAM](https://auth0.com/docs/get-started/identity-fundamentals/identity-and-access-management)
- [AuthN vs AuthZ](https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization)
- [Dashboard](https://auth0.com/docs/get-started/auth0-overview/dashboard)
- [Create Tenants](https://auth0.com/docs/get-started/auth0-overview/create-tenants)
- [Create Applications](https://auth0.com/docs/get-started/auth0-overview/create-applications)
- [Applications in Auth0](https://auth0.com/docs/get-started/auth0-overview/applications-in-auth0)
- [Register APIs](https://auth0.com/docs/get-started/auth0-overview/set-up-apis)
- [Auth0 Teams](https://auth0.com/docs/get-started/auth0-teams)
- [Dashboard Profile](https://auth0.com/docs/get-started/dashboard-profile)
- [Tenant Settings](https://auth0.com/docs/get-started/tenant-settings)
- [Manage Dashboard Access](https://auth0.com/docs/get-started/manage-dashboard-access)
- [Client Credentials Exchange](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-exchange)
- [Auth Flows](https://auth0.com/docs/get-started/authentication-and-authorization-flow)
- [Which OAuth 2.0 Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use)
- [Authorization Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)
- [PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce)
- [Client Credentials](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)
- [Device Authorization](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow)
- [Resource Owner Password](https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow)
- [CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow)
- [Implicit Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/implicit-flow-with-form-post)
- [Hybrid Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/hybrid-flow)
- [Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt)
- [mTLS](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-mtls)
- [RAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-rar)
- [PAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-par)
- [JAR](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-jar)

### Authenticate
- [Login](https://auth0.com/docs/authenticate/login)
- [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Universal Login vs Classic](https://auth0.com/docs/authenticate/login/universal-login-vs-classic-login)
- [Universal Experience](https://auth0.com/docs/authenticate/login/universal-experience)
- [Logout](https://auth0.com/docs/authenticate/login/logout)
- [Single Sign-On](https://auth0.com/docs/authenticate/single-sign-on)
- [Passwordless](https://auth0.com/docs/authenticate/passwordless)
- [Passwordless with Universal Login](https://auth0.com/docs/authenticate/passwordless/passwordless-with-universal-login)
- [Identity Providers](https://auth0.com/docs/authenticate/identity-providers)
- [Social Identity Providers](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)
- [Enterprise Connections](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections)
- [Database Connections](https://auth0.com/docs/authenticate/identity-providers/database-connections)
- [Connection Settings Best Practices](https://auth0.com/docs/authenticate/connection-settings-best-practices)
- [Self-Service Enterprise Configuration](https://auth0.com/docs/authenticate/enterprise-connections/self-service-enterprise-configuration)
- [Connection Profile](https://auth0.com/docs/authenticate/enterprise-connections/connection-profile)
- [User Attribute Profile](https://auth0.com/docs/authenticate/enterprise-connections/user-attribute-profile)
- [Passkey Authentication](https://auth0.com/docs/authenticate/database-connections/passkeys)
- [Protocols](https://auth0.com/docs/authenticate/protocols)
- [OAuth 2.0](https://auth0.com/docs/authenticate/protocols/oauth)
- [OIDC](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol)
- [SAML](https://auth0.com/docs/authenticate/protocols/saml)
- [SAML Configuration](https://auth0.com/docs/authenticate/protocols/saml/saml-configuration)
- [WS-Federation](https://auth0.com/docs/authenticate/protocols/ws-fed)
- [LDAP](https://auth0.com/docs/authenticate/protocols/ldap-protocol)
- [SCIM](https://auth0.com/docs/authenticate/protocols/scim)
- [Custom Token Exchange](https://auth0.com/docs/authenticate/custom-token-exchange)
- [CTE Use Cases](https://auth0.com/docs/authenticate/custom-token-exchange/cte-example-use-cases)
- [CTE Configuration](https://auth0.com/docs/authenticate/custom-token-exchange/configure-custom-token-exchange)
- [CTE Attack Protection](https://auth0.com/docs/authenticate/custom-token-exchange/cte-attack-protection)

### Manage Users
- [User Accounts](https://auth0.com/docs/manage-users/user-accounts)
- [User Profile Structure](https://auth0.com/docs/manage-users/user-accounts/user-profile-structure)
- [Metadata](https://auth0.com/docs/manage-users/user-accounts/metadata)
- [Account Linking](https://auth0.com/docs/manage-users/user-accounts/user-account-linking)
- [Link User Accounts](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/link-user-accounts)
- [Password Reset](https://auth0.com/docs/manage-users/user-accounts/password-reset)
- [User Migration](https://auth0.com/docs/manage-users/user-migration)
- [Automatic Migration](https://auth0.com/docs/manage-users/user-migration/automatic-migration)
- [Bulk Import](https://auth0.com/docs/manage-users/user-migration/bulk-user-imports)
- [User Search](https://auth0.com/docs/manage-users/user-search)
- [Search Best Practices](https://auth0.com/docs/manage-users/user-search/user-search-best-practices)
- [Organizations](https://auth0.com/docs/manage-users/organizations)
- [Organizations Overview](https://auth0.com/docs/manage-users/organizations/organizations-overview)
- [Create First Organization](https://auth0.com/docs/manage-users/organizations/create-first-organization)
- [Configure Organizations](https://auth0.com/docs/manage-users/organizations/configure-organizations)
- [Custom Development](https://auth0.com/docs/manage-users/organizations/custom-development)
- [M2M Organizations](https://auth0.com/docs/manage-users/organizations/organizations-for-m2m-applications)
- [Using Tokens](https://auth0.com/docs/manage-users/organizations/using-tokens)
- [Access Control](https://auth0.com/docs/manage-users/access-control)
- [RBAC](https://auth0.com/docs/manage-users/access-control/rbac)
- [Authorization Policies](https://auth0.com/docs/manage-users/access-control/authorization-policies)
- [Rules for Authorization Policies](https://auth0.com/docs/manage-users/access-control/rules-for-authorization-policies)
- [Configure Core RBAC](https://auth0.com/docs/manage-users/access-control/configure-core-rbac)
- [Sample Use Cases: RBAC](https://auth0.com/docs/manage-users/access-control/sample-use-cases-role-based-access-control)
- [Sample Use Cases: Actions with AuthZ](https://auth0.com/docs/manage-users/access-control/sample-use-cases-actions-with-authorization)
- [Sample Use Cases: Rules with AuthZ](https://auth0.com/docs/manage-users/access-control/sample-use-cases-rules-with-authorization)
- [Core vs Extension](https://auth0.com/docs/manage-users/access-control/authorization-core-vs-authorization-extension)
- [Sessions](https://auth0.com/docs/manage-users/sessions)
- [Cookies](https://auth0.com/docs/manage-users/cookies)
- [SPA Cookie Auth](https://auth0.com/docs/manage-users/cookies/spa-authenticate-with-cookies)
- [My Account API](https://auth0.com/docs/manage-users/my-account-api)
- [My Organization API](https://auth0.com/docs/manage-users/my-organization-api)

### Customize
- [Customize Login Pages](https://auth0.com/docs/customize/login-pages)
- [Custom Domains](https://auth0.com/docs/customize/custom-domains)
- [Customize Emails](https://auth0.com/docs/customize/email/customize-email-templates)
- [Customize SMS/Voice](https://auth0.com/docs/customize/customize-sms-or-voice-messages)
- [Internationalization](https://auth0.com/docs/customize/internationalization-and-localization)
- [Experiment Center](https://auth0.com/docs/customize/experiment-center)
- [Actions](https://auth0.com/docs/customize/actions)
- [Actions Triggers](https://auth0.com/docs/customize/actions/triggers)
- [Manage Versions](https://auth0.com/docs/customize/actions/manage-versions)
- [Forms](https://auth0.com/docs/customize/forms)
- [Events](https://auth0.com/docs/customize/events)
- [Rules](https://auth0.com/docs/customize/rules)
- [Hooks](https://auth0.com/docs/customize/hooks)
- [Extensions](https://auth0.com/docs/customize/extensions)
- [Integrations](https://auth0.com/docs/customize/integrations)
- [Log Streams](https://auth0.com/docs/customize/log-streams)
- [Auth0 Marketplace](https://marketplace.auth0.com/)

### Secure
- [Application Credentials](https://auth0.com/docs/secure/application-credentials)
- [Attack Protection](https://auth0.com/docs/secure/attack-protection)
- [Continuous Session Protection](https://auth0.com/docs/secure/continuous-session-protection)
- [Highly Regulated Identity](https://auth0.com/docs/secure/highly-regulated-identity)
- [Transactional Authorization](https://auth0.com/docs/secure/highly-regulated-identity/transactional-authorization-with-authorization-code-flow)
- [Customer Managed Keys](https://auth0.com/docs/secure/highly-regulated-identity/customer-managed-keys)
- [MFA](https://auth0.com/docs/secure/multi-factor-authentication)
- [MFA Factors](https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors)
- [Enable MFA](https://auth0.com/docs/secure/multi-factor-authentication/enable-mfa)
- [Customize MFA](https://auth0.com/docs/secure/multi-factor-authentication/customize-mfa)
- [Auth0 Guardian](https://auth0.com/docs/secure/multi-factor-authentication/auth0-guardian)
- [Security Center](https://auth0.com/docs/secure/security-center)
- [Security Guidance](https://auth0.com/docs/secure/security-guidance)
- [Sender Constraining](https://auth0.com/docs/secure/sender-constraining)
- [Configure Sender Constraining](https://auth0.com/docs/secure/sender-constraining/configure-sender-constraining)
- [Tokens](https://auth0.com/docs/secure/tokens)
- [ID Tokens](https://auth0.com/docs/secure/tokens/id-tokens)
- [Validate ID Tokens](https://auth0.com/docs/secure/tokens/id-tokens/validate-id-tokens)
- [Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens)
- [Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens)
- [JWT](https://auth0.com/docs/secure/tokens/json-web-tokens)
- [JWT Structure](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
- [Create Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)
- [Token Best Practices](https://auth0.com/docs/secure/tokens/token-best-practices)
- [Token Storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage)
- [Data Security](https://auth0.com/docs/secure/security-guidance/data-security)
- [JWE](https://auth0.com/docs/secure/tokens/access-tokens/json-web-encryption)
- [On-Behalf-Of Token Exchange](https://auth0.com/docs/secure/call-apis-on-users-behalf/on-behalf-of-token-exchange)
- [Cross App Access](https://auth0.com/docs/secure/call-apis-on-users-behalf/cross-app-access)
- [Token Vault](https://auth0.com/docs/secure/call-apis-on-users-behalf/token-vault)
- [Tenant ACL](https://auth0.com/docs/secure/tenant-access-control-list)
- [Data Privacy and Compliance](https://auth0.com/docs/secure/data-privacy-and-compliance)

### Deploy & Monitor
- [Deployment Options](https://auth0.com/docs/deploy-monitor/deployment-options)
- [Private Cloud](https://auth0.com/docs/deploy-monitor/private-cloud-deployments)
- [Pre-Deployment Checks](https://auth0.com/docs/deploy-monitor/pre-deployment-checks)
- [Deployment Checklist](https://auth0.com/docs/deploy-monitor/deploy-checklist)
- [Deploy CLI](https://auth0.com/docs/deploy-monitor/cli)
- [Auth0 CLI](https://auth0.com/docs/deploy-monitor/auth0-cli)
- [Terraform Provider](https://auth0.com/docs/deploy-monitor/auth0-terraform-provider)
- [Deployment Best Practices](https://auth0.com/docs/deploy-monitor/deployment-best-practices)
- [Monitor](https://auth0.com/docs/deploy-monitor/monitor)
- [Logs](https://auth0.com/docs/deploy-monitor/logs)
- [Metric Streams](https://auth0.com/docs/deploy-monitor/metric-streams)

### APIs & SDKs
- [Auth0 APIs](https://auth0.com/docs/api)
- [Authentication API](https://auth0.com/docs/api/authentication)
- [Management API](https://auth0.com/docs/api/management/v2)
- [My Account API](https://auth0.com/docs/api/myaccount)
- [My Organization API](https://auth0.com/docs/api/myorganization)
- [Self-Service Profiles](https://auth0.com/docs/api/management/v2/self-service-profiles)
- [Flows](https://auth0.com/docs/api/management/v2/flows)
- [Event Streams](https://auth0.com/docs/api/management/v2/event-streams)
- [Prompts](https://auth0.com/docs/api/management/v2/prompts)
- [Experimentation](https://auth0.com/docs/api/management/v2/experimentation)
- [Risk Assessments](https://auth0.com/docs/api/management/v2/risk-assessments)
- [Supplemental Signals](https://auth0.com/docs/api/management/v2/supplemental-signals)
- [Verifiable Credentials](https://auth0.com/docs/api/management/v2/verifiable-credentials)
- [Rate Limit Policies](https://auth0.com/docs/api/management/v2/rate-limit-policies)
- [Network ACLs](https://auth0.com/docs/api/management/v2/network-acls)
- [Device Credentials](https://auth0.com/docs/api/management/v2/device-credentials)
- [Grants](https://auth0.com/docs/api/management/v2/grants)
- [Groups](https://auth0.com/docs/api/management/v2/groups)
- [Branding Theme](https://auth0.com/docs/api/management/v2/branding-theme)
- [Email Provider](https://auth0.com/docs/api/management/v2/emails/email-provider)
- [Custom Signing Keys](https://auth0.com/docs/api/management/v2/keys/custom-signing-keys)
- [Signing Key](https://auth0.com/docs/api/management/v2/keys/signing-key)
- [Custom Domains API](https://auth0.com/docs/api/management/v2/custom-domains-api)
- [Hooks API](https://auth0.com/docs/api/management/v2/hooks-api)
- [Tenant Settings API](https://auth0.com/docs/api/management/v2/tenant-settings-api)
- [Actions Modules](https://auth0.com/docs/api/management/v2/actions/actions-modules)
- [Action Versions](https://auth0.com/docs/api/management/v2/actions/action-versions)
- [Action Execution](https://auth0.com/docs/api/management/v2/actions/action-execution)
- [SOC2](https://auth0.com/docs/secure/data-privacy-and-compliance/soc2)
- [Auth0 Data Privacy and Compliance](https://auth0.com/docs/secure/auth0-data-privacy-and-compliance)
- [SDK Libraries](https://auth0.com/docs/libraries)
- [auth0.js](https://auth0.com/docs/libraries/auth0js)
- [Lock](https://auth0.com/docs/libraries/lock)
- [ACUL JS SDK](https://auth0.com/docs/libraries/acul/js-sdk)
- [ACUL React SDK](https://auth0.com/docs/libraries/acul/react-sdk)

### Auth0 AI
- [Auth0 AI](https://auth0.com/docs/ai)
- [Auth0 for AI Agents](https://auth0.com/docs/get-started/auth0-for-ai-agents)
- [MCP Server](https://auth0.com/docs/customize/integrations/ai-tools/auth0-mcp-server)
- [Build with AI Tools](https://auth0.com/docs/get-started/build-with-ai-tools)
- [Agent Experience Score](https://auth0.com/docs/get-started/auth0-agent-experience)
- [Agent Skills](https://github.com/auth0/agent-skills)

### Platform
- [Platform / Troubleshoot](https://auth0.com/docs/troubleshoot)
- [Customer Support](https://auth0.com/docs/troubleshoot/customer-support)
- [Update Billing](https://auth0.com/docs/troubleshoot/update-billing-information)
- [Manage Subscriptions](https://auth0.com/docs/troubleshoot/manage-subscriptions)
- [Delete or Reset Tenant](https://auth0.com/docs/troubleshoot/delete-or-reset-tenant)
- [Export Data](https://auth0.com/docs/troubleshoot/export-data)
- [Monitor Subscription Usage](https://auth0.com/docs/troubleshoot/monitor-subscription-usage)
- [Reset Account Passwords](https://auth0.com/docs/troubleshoot/reset-account-passwords)
- [Operational Policies](https://auth0.com/docs/troubleshoot/operational-policies)
- [Product Lifecycle](https://auth0.com/docs/troubleshoot/product-lifecycle)
- [Past Migrations](https://auth0.com/docs/troubleshoot/past-migrations)
- [Changelog](https://auth0.com/changelog)
- [Community](https://community.auth0.com)
- [Auth0 Blog](https://auth0.com/blog)
- [Developer Hub](https://developer.auth0.com)
- [Code Samples](https://developer.auth0.com/resources)
- [Auth0 Security](https://auth0.com/security)
- [Auth0 Pricing](https://auth0.com/pricing)
