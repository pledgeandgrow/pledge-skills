# Auth0 — Authentication

> **Version**: Latest | **Source**: [auth0.com/docs/authenticate](https://auth0.com/docs/authenticate)

## Login

### Universal Login

Auth0's recommended approach — Auth0 hosts the login pages, handling all auth flows:

- **New Universal Login**: Modern, customizable, supports passwordless, social, enterprise
- **Classic Universal Login**: Legacy hosted login with Lock widget
- **Custom Login Pages**: Full HTML/CSS/JS control within Auth0-hosted domain

**Benefits**:
- No need to handle credentials in your app
- Automatic security updates
- SSO across all your apps
- Supports all connection types
- Customizable branding and localization

### Embedded Login

Login widget embedded directly in your app (using `auth0.js` or Lock):

- Less recommended — credentials pass through your app
- More complex CORS setup
- No SSO benefits across apps

### Login Flow Configuration

| Setting | Description |
|---------|-------------|
| **Default Login Connection** | Which connection is used by default |
| **Login Mode** | `redirect` (Universal) or `overlay` (embedded) |
| **Prompt Types** | `login`, `consent`, `select_account`, `create` |
| **Connection Display** | Show/hide specific connections on login page |

### Logout

```
GET https://yourtenant.auth0.com/v2/logout?
  client_id=YOUR_CLIENT_ID&
  returnTo=https://yourapp.com/logout-callback
```

Configure **Allowed Logout URLs** in application settings.

### SSO (Single Sign-On)

- **Auth0 SSO**: Users log in once to Auth0, then access all connected apps without re-authenticating
- **SAML SSO**: Federated SSO with enterprise IdPs (AD, Azure AD, Google Workspace, etc.)
- **OIDC SSO**: OpenID Connect-based SSO
- **SSO Session**: Auth0 maintains a session independent of individual app sessions

**Source**: [Login](https://auth0.com/docs/authenticate/login) | [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login) | [Universal Login vs Classic](https://auth0.com/docs/authenticate/login/universal-login-vs-classic-login) | [Universal Experience](https://auth0.com/docs/authenticate/login/universal-experience) | [Logout](https://auth0.com/docs/authenticate/login/logout) | [SSO](https://auth0.com/docs/authenticate/single-sign-on)

## Passwordless

Passwordless authentication replaces passwords with one-time codes or magic links:

### Email Connection

- **Magic Link**: User enters email → receives email with link → click to authenticate
- **OTP**: User enters email → receives 6-digit code → enters code to authenticate

```javascript
// Using auth0.js for passwordless
var auth0 = new auth0.WebAuth({
  domain: 'yourtenant.auth0.com',
  clientID: 'YOUR_CLIENT_ID'
});

auth0.passwordlessStart({
  connection: 'email',
  send: 'link', // or 'code'
  email: 'user@example.com'
}, function(err, res) { /* ... */ });
```

### SMS Connection

- User enters phone number → receives OTP via SMS → enters code to authenticate

### Passwordless with Universal Login

Configure passwordless connections in Dashboard → Connections → Passwordless. The Universal Login page automatically adapts.

**Source**: [Passwordless](https://auth0.com/docs/authenticate/passwordless) | [Passwordless with Universal Login](https://auth0.com/docs/authenticate/passwordless/passwordless-with-universal-login)

## Identity Providers

### Social Identity Providers

Auth0 supports 30+ social connections out of the box:

| Provider | Connection Type |
|----------|----------------|
| Google | OAuth 2.0 |
| Facebook | OAuth 2.0 |
| Apple | OAuth 2.0 |
| X (Twitter) | OAuth 2.0 |
| GitHub | OAuth 2.0 |
| LinkedIn | OAuth 2.0 |
| Microsoft | OAuth 2.0 |
| Amazon | OAuth 2.0 |
| Discord | OAuth 2.0 |
| Slack | OAuth 2.0 |
| Spotify | OAuth 2.0 |
| Salesforce | OAuth 2.0 |

**Configuration**: Dashboard → Connections → Social → Create Connection → Select provider → Configure Client ID/Secret

### Enterprise Connections

| Protocol | Providers |
|----------|-----------|
| **SAML** | Active Directory, ADFS, Azure AD, Google Workspace, Okta, OneLogin, PingFederate, Shibboleth |
| **OIDC** | Azure AD, Google Workspace, Okta, Keycloak, generic OIDC providers |
| **LDAP** | Active Directory via LDAP gateway, LDAP server |
| **AD** | Active Directory via AD Connector |

**Enterprise connection features**:
- JIT (Just-in-Time) provisioning
- SCIM provisioning (Enterprise plans)
- Home Realm Discovery (HRD)
- IdP-initiated SSO
- SAML attribute mapping
- Connection-specific roles and mappings

### Database Connections

- **Auth0 Database**: Auth0 stores user credentials (bcrypt-hashed passwords)
- **Custom Database**: Auth0 delegates to your existing database via custom Action scripts

**Custom database scripts**:
- `Login`: Validate credentials against your DB
- `Get User`: Retrieve user profile
- `Create`: Register new user
- `Verify`: Email verification
- `Change Password`: Password reset
- `Delete`: Remove user

### Connection Settings Best Practices

- Use **Custom Database** for migration without changing user passwords
- Enable **Disable Sign Ups** for enterprise connections (users managed externally)
- Configure **Connection-specific domains** for HRD
- Set **Attribute mapping** for enterprise connections
- Use **Connection roles** for organization-specific access

**Source**: [Identity Providers](https://auth0.com/docs/authenticate/identity-providers) | [Social](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers) | [Enterprise](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections) | [Database](https://auth0.com/docs/authenticate/identity-providers/database-connections) | [Connection Settings](https://auth0.com/docs/authenticate/connection-settings-best-practices) | [Self-Service Enterprise Configuration](https://auth0.com/docs/authenticate/enterprise-connections/self-service-enterprise-configuration) | [Connection Profile](https://auth0.com/docs/authenticate/enterprise-connections/connection-profile) | [User Attribute Profile](https://auth0.com/docs/authenticate/enterprise-connections/user-attribute-profile) | [Passkey Authentication](https://auth0.com/docs/authenticate/database-connections/passkeys)

## Protocols

### OAuth 2.0

OAuth 2.0 (RFC 6749) is the authorization framework Auth0 implements:

**Roles**:
- **Resource Owner**: End user
- **Resource Server**: Your API
- **Client**: Your application
- **Authorization Server**: Auth0

**Endpoints**:
- `/authorize`: Authorization endpoint — user authenticates, app gets code or token
- `/oauth/token`: Token endpoint — exchange code for tokens, or get tokens directly
- `/userinfo`: OIDC endpoint — get user profile with Access Token
- `/.well-known/openid-configuration`: Discovery document
- `/.well-known/jwks.json`: JSON Web Key Set for token verification

**Parameters**:
- `response_type`: `code`, `token`, `id_token`, or combinations
- `response_mode`: `query`, `fragment`, `form_post`, `web_message`
- `client_id`: Application's client ID
- `redirect_uri`: Where to redirect after auth
- `scope`: Space-separated permissions (e.g., `openid profile email`)
- `state`: CSRF protection token
- `audience`: API identifier for Access Token
- `connection`: Specific connection to use
- `prompt`: `none`, `login`, `consent`, `select_account`

### OpenID Connect (OIDC)

OIDC is an identity layer on top of OAuth 2.0:

- **ID Token**: JWT containing user identity claims
- **UserInfo Endpoint**: Get user profile with Access Token
- **Scopes**: `openid`, `profile`, `email`, `address`, `phone`
- **Claims**: Standard claims (sub, name, email, picture, etc.)
- **Discovery**: `/.well-known/openid-configuration`
- **JWKS**: `/.well-known/jwks.json` for signature verification

### SAML 2.0

SAML (Security Assertion Markup Language) for enterprise SSO:

- **SAML Request**: App sends AuthnRequest to IdP
- **SAML Response**: IdP sends assertion with user attributes
- **Bindings**: HTTP Redirect, HTTP POST, HTTP Artifact
- **NameID**: User identifier in SAML assertion
- **Attributes**: Custom attributes mapped from IdP

**Auth0 as SAML IdP** (SAML Identity Provider feature):
- Auth0 can act as a SAML IdP for apps that only support SAML
- Configure SAML2 Web App in Dashboard

### WS-Federation

- Legacy protocol supported for backward compatibility
- Used primarily with older Microsoft applications

**Source**: [Protocols](https://auth0.com/docs/authenticate/protocols) | [OAuth 2.0](https://auth0.com/docs/authenticate/protocols/oauth) | [OIDC](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol) | [SAML](https://auth0.com/docs/authenticate/protocols/saml) | [SAML Configuration](https://auth0.com/docs/authenticate/protocols/saml/saml-configuration) | [WS-Federation](https://auth0.com/docs/authenticate/protocols/ws-fed) | [LDAP](https://auth0.com/docs/authenticate/protocols/ldap-protocol) | [SCIM](https://auth0.com/docs/authenticate/protocols/scim)

## Custom Token Exchange

RFC 8693 token exchange — swap external tokens for Auth0 tokens:

### Use Cases

- Exchange social IdP token for Auth0 session
- Exchange enterprise IdP token for API access token
- Cross-tenant token exchange
- Token delegation (app-to-app on behalf of user)

### Configuration

1. Configure Custom Token Exchange Profile in Dashboard
2. Define token mapping rules
3. Set audience and scopes
4. Use `/oauth/token` with `grant_type=urn:ietf:params:oauth:grant-type:token-exchange`

**Source**: [Custom Token Exchange](https://auth0.com/docs/authenticate/custom-token-exchange) | [CTE Use Cases](https://auth0.com/docs/authenticate/custom-token-exchange/cte-example-use-cases) | [CTE Configuration](https://auth0.com/docs/authenticate/custom-token-exchange/configure-custom-token-exchange) | [CTE Attack Protection](https://auth0.com/docs/authenticate/custom-token-exchange/cte-attack-protection)

## Sessions

### Auth0 Session

- Created after successful authentication
- Stored as a cookie on the Auth0 domain (`auth0.com` or custom domain)
- Enables SSO across applications
- Configurable lifetime in tenant settings

### Application Session

- App-level session (e.g., Express session, JWT in browser)
- Independent of Auth0 session
- App validates ID/Access tokens to maintain session

### Session Management

| Setting | Description |
|---------|-------------|
| **Session Lifetime** | How long the Auth0 session lasts (default: 168 hours) |
| **Idle Session Lifetime** | Session expires after inactivity (default: 72 hours) |
| **Session Cookie Management** | `persistent` or `non-persistent` |
| **Require Session Cookie** | Force session cookie for token issuance |

### Continuous Session Protection

- Detects session hijacking attempts
- Monitors session integrity
- Can require re-authentication for sensitive operations

**Source**: [Sessions](https://auth0.com/docs/manage-users/sessions) | [Cookies](https://auth0.com/docs/manage-users/cookies) | [Continuous Session Protection](https://auth0.com/docs/secure/continuous-session-protection)

## Cookies

Auth0 uses cookies for:

- **Auth0 Session**: `auth0` cookie on Auth0 domain
- **Application Session**: App-set cookies (e.g., `appSession`)
- **CSRF Protection**: `auth0_compat`, `did_compat`
- **SPA Authentication**: `auth0.is.authenticated` cookie

### SameSite Attribute

| Cookie Type | SameSite | Secure |
|-------------|----------|--------|
| Auth0 session | `None` | Yes (HTTPS) |
| App session | Configurable | Recommended |
| CSRF tokens | `Lax` | Yes |

### SPA Cookie Authentication

SPAs can use cookies instead of storing tokens in memory/localStorage:

```javascript
// Configure SDK to use cookies
new Auth0Client({
  domain: 'yourtenant.auth0.com',
  client_id: 'YOUR_CLIENT_ID',
  useRefreshTokens: true,
  cookieDomain: 'yourapp.com'
});
```

**Source**: [Cookies](https://auth0.com/docs/manage-users/cookies) | [SPA Cookie Auth](https://auth0.com/docs/manage-users/cookies/spa-authenticate-with-cookies) | [Add Login: Auth Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-using-the-authorization-code-flow) | [Add Login: Auth Code Flow with PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-using-the-authorization-code-flow-with-pkce) | [Add Login: Implicit Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-using-the-implicit-flow-with-form-post) | [Call API: Auth Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow) | [Call API: Auth Code Flow with PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce) | [Call API: Client Credentials](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow) | [Call API: Device Auth Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-device-authorization-flow) | [Call API: Hybrid Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-hybrid-flow) | [Call API: RO Password Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-resource-owner-password-flow) | [Call API: Custom Token Exchange](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-custom-token-exchange-flow) | [Email Notifications with CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/email-notifications-with-ciba) | [Mobile Push Notifications with CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/mobile-push-notifications-with-ciba) | [User Authorization with CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/user-authorization-with-ciba) | [Customize Tokens with Hooks: Client Credentials](https://auth0.com/docs/get-started/authentication-and-authorization-flow/customize-tokens-using-hooks-with-client-credentials-flow) | [Custom Database](https://auth0.com/docs/authenticate/identity-providers/database-connections/custom-database) | [Password Policy](https://auth0.com/docs/authenticate/identity-providers/database-connections/password-policy) | [Flexible Identifiers](https://auth0.com/docs/authenticate/identity-providers/database-connections/flexible-identifiers) | [Azure AD](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/azure-ad) | [Google Workspace](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/google-workspace) | [Okta Enterprise](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/okta-enterprise) | [PingOne](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/pingone) | [SAML Identity Provider](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/saml-identity-provider) | [OIDC Identity Provider](https://auth0.com/docs/authenticate/identity-providers/enterprise-connections/oidc-identity-provider)
