# Auth0 — Customize & Secure

> **Version**: Latest | **Source**: [auth0.com/docs/customize](https://auth0.com/docs/customize) | [auth0.com/docs/secure](https://auth0.com/docs/secure)

## Brand Customization

### Customize Login Pages

**New Universal Login**:
- Customize via Dashboard → Branding → Universal Login
- Page templates with variables (logo, colors, font)
- Custom HTML/CSS/JS via page templates
- Internationalization and localization built-in

**Classic Universal Login**:
- Custom HTML template with `{{ widget }}` placeholder
- Full control over HTML/CSS/JS
- Lock widget configuration

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.auth0.com/js/lock/12.4/lock.min.js"></script>
  </head>
  <body>
    <div id="widget-container"></div>
    <script>
      var lock = new Auth0Lock('CLIENT_ID', 'TENANT.auth0.com', {
        container: 'widget-container',
        auth: { redirectUrl: 'https://yourapp.com/callback' }
      });
      lock.show();
    </script>
  </body>
</html>
```

### Custom Domains

Use your own domain for Auth0-hosted pages (e.g., `auth.yourcompany.com`):

- **Self-managed certificates**: Bring your own TLS certificate
- **Auth0-managed certificates**: Auth0 provisions and renews certificates
- **CNAME verification**: Point CNAME to Auth0
- **Reverse proxy**: For advanced setups

**Setup**: Dashboard → Branding → Custom Domains → Create Domain → Configure DNS → Verify

### Customize Emails

Auth0 sends emails for: welcome, verification, password reset, password breach, MFA enrollment.

- **Email Provider**: Configure SMTP (SendGrid, AWS SES, Mailgun, etc.)
- **Email Templates**: HTML/text templates with Liquid syntax variables
- **Custom Sender**: From name and email address
- **Subject and Body**: Fully customizable per template

```html
<!-- Email template with Liquid variables -->
<h2>Welcome to {{ application.name }}</h2>
<p>Click <a href="{{ url }}">here</a> to verify your email.</p>
```

### Customize Phone Messages

Customize SMS and voice messages for MFA and passwordless:

- **SMS Templates**: Custom text with variables
- **Voice Messages**: Custom voice message text
- **Language**: Per-locale customization

### Internationalization and Localization

- **Supported Languages**: 25+ languages built-in
- **Custom Translations**: Override any text via Dashboard or API
- **Language Detection**: Browser language, `ui_locales` parameter, custom logic
- **Right-to-Left**: RTL support for Arabic, Hebrew

### Experiment Center

- A/B test login page variations
- Measure conversion rates
- Test different connection configurations

**Source**: [Customize Login Pages](https://auth0.com/docs/customize/login-pages) | [Custom Domains](https://auth0.com/docs/customize/custom-domains) | [Customize Emails](https://auth0.com/docs/customize/email/customize-email-templates) | [Customize SMS](https://auth0.com/docs/customize/customize-sms-or-voice-messages) | [Internationalization](https://auth0.com/docs/customize/internationalization-and-localization) | [Experiment Center](https://auth0.com/docs/customize/experiment-center)

## Actions

Actions are versioned, promise-based Node.js functions that execute during auth flows. They replace Rules and Hooks.

### Action Triggers

| Trigger | When | Use Cases |
|---------|------|-----------|
| `post-login` | After user authenticates | Add custom claims, call external APIs, enforce MFA |
| `pre-user-registration` | Before user is created | Validate email, block signups, add custom metadata |
| `post-user-registration` | After user is created | Send welcome email, sync to CRM, provision user |
| `post-change-password` | After password change | Notify user, sync to external system |
| `credentials-exchange` | M2M token issuance | Customize token claims, validate client |
| `send-phone-message` | SMS/voice MFA | Custom SMS provider integration |
| `password-reset-post-challenge` | After password reset challenge | Custom validation, notification |

### Action Structure

```javascript
// Post-login Action example
exports.onExecutePostLogin = async (event, api) => {
  // Add custom claim to Access Token
  api.accessToken.setCustomClaim('https://myapp.com/role', event.user.role);

  // Add custom claim to ID Token
  api.idToken.setCustomClaim('https://myapp.com/department', event.user.department);

  // Enforce MFA for admins
  if (event.user.role === 'admin') {
    api.multifactor.enable('any', { allowRememberBrowser: false });
  }

  // Call external API
  const response = await fetch('https://api.myapp.com/sync', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${event.secrets.API_KEY}` },
    body: JSON.stringify({ user_id: event.user.user_id })
  });

  // Redirect to custom page
  if (event.user.app_metadata.requires_consent) {
    api.redirect.sendUserTo('https://myapp.com/consent');
  }
};
```

### Action Event Object

```javascript
event = {
  user: {
    user_id, email, name, nickname, picture,
    email_verified, phone_number, phone_verified,
    user_metadata, app_metadata, created_at, updated_at,
    identities, last_login, logins_count
  },
  connection: { strategy, name, ... },
  context: { protocol, clientID, clientName, connection, ... },
  secrets: { API_KEY, ... },  // Configured secrets
  transaction: { ... },
  resource_server: { ... },
  scope: ['openid', 'profile', 'email'],
  client: { client_id, client_name, ... },
  tenant: { id, friendly_name, ... }
}
```

### Action API Object

```javascript
api = {
  accessToken: { setCustomClaim, setScope, ... },
  idToken: { setCustomClaim, ... },
  multifactor: { enable, ... },
  redirect: { sendUserTo, ... },
  user: { setAppMetadata, setUserMetadata, ... },
  caching: { cache, ... },
  management: { access_token, ... },  // Management API access
  rules: { ... },
  state: { setState, ... },
  response: { ... }
}
```

### Key Benefits

- **npm packages**: Install and use any npm package
- **Secrets**: Securely store API keys and secrets
- **Versions**: Versioned with rollback support
- **Multiple Actions**: Stack multiple Actions per trigger
- **Observability**: Built-in logging and monitoring
- **Node.js 18+**: Modern JavaScript runtime

### Rules (Legacy)

> **Deprecated**: Migrate to Actions. Rules end of life: Nov 2024 (Enterprise) / Jun 2025 (all).

Rules are JavaScript functions executed after authentication:

```javascript
function (user, context, callback) {
  // Add role to user
  user.role = context.clientName === 'AdminApp' ? 'admin' : 'user';
  // Add custom claim
  context.idToken['https://myapp.com/role'] = user.role;
  callback(null, user, context);
}
```

### Hooks (Legacy)

> **Deprecated**: Migrate to Actions.

Hooks are Node.js functions triggered by specific extensibility points:

- `credentials-exchange`: M2M token issuance
- `pre-user-registration`: Before signup
- `post-user-registration`: After signup
- `post-change-password`: After password change
- `send-phone-message`: Custom SMS

### Forms

Auth0 Forms (available in some plans) allow custom data collection during auth flows:

- Custom input fields during registration
- Progressive profiling
- Consent collection
- Custom validation

### Events

Auth0 Events enable real-time notifications:

- `auth.login`, `auth.signup`, `auth.password_reset`
- `auth.failure`, `auth.lockout`
- Configure webhooks to receive event payloads

**Source**: [Actions](https://auth0.com/docs/customize/actions) | [Actions Triggers](https://auth0.com/docs/customize/actions/triggers) | [Manage Versions](https://auth0.com/docs/customize/actions/manage-versions) | [Rules](https://auth0.com/docs/customize/rules) | [Hooks](https://auth0.com/docs/customize/hooks) | [Forms](https://auth0.com/docs/customize/forms) | [Events](https://auth0.com/docs/customize/events) | [Event Streams](https://auth0.com/docs/api/management/v2/event-streams) | [Prompts](https://auth0.com/docs/api/management/v2/prompts) | [Experiment Center](https://auth0.com/docs/customize/experiment-center) | [Experimentation API](https://auth0.com/docs/api/management/v2/experimentation) | [Feature Flags](https://auth0.com/docs/api/management/v2/experimentation/get-feature-flags)

## Third-Party Customization

### Extensions

Auth0 Extensions add functionality to your tenant:

- **Auth0 Authorization Extension**: RBAC management UI (legacy)
- **Custom Social Connections Extension**: Configure custom OAuth 2.0 providers
- **Delegated Administration Extension**: Admin UI for non-dashboard users
- **Auth0 Rules Extension**: Rules management UI

### Integrations

Pre-built integrations with third-party services:

- **AWS**: IAM, API Gateway, Lambda
- **Azure**: AD, Functions, API Management
- **Slack**: Notifications
- **Segment**: Analytics
- **Splunk**: Logging
- **Datadog**: Monitoring
- **Salesforce**: CRM sync
- **Zapier**: Workflow automation

### Log Streams

Stream Auth0 logs to external services in real-time:

- **Amazon EventBridge**: AWS event bus
- **Amazon Kinesis**: AWS streaming
- **Azure Event Hubs**: Azure streaming
- **Google Cloud Pub/Sub**: GCP messaging
- **HTTP Event Collector (Splunk)**: Splunk logging
- **HTTP Webhook**: Custom HTTP endpoint
- **Datadog**: Monitoring platform
- **Sumo Logic**: Log analytics

**Configure**: Dashboard → Logs → Log Streams → Create Stream

### Auth0 Marketplace

- Browse and install third-party integrations
- Community and official integrations
- [marketplace.auth0.com](https://marketplace.auth0.com/)

**Source**: [Extensions](https://auth0.com/docs/customize/extensions) | [Integrations](https://auth0.com/docs/customize/integrations) | [Log Streams](https://auth0.com/docs/customize/log-streams) | [Marketplace](https://marketplace.auth0.com/)

## Tokens

### ID Tokens

JWT containing user identity claims:

```json
{
  "iss": "https://yourtenant.auth0.com/",
  "sub": "auth0|123456789",
  "aud": "YOUR_CLIENT_ID",
  "exp": 1234567890,
  "iat": 1234567890,
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "nickname": "john",
  "picture": "https://..."
}
```

**Validation**: Verify signature (JWKS), `iss`, `aud`, `exp`, `nonce`.

### Access Tokens

Tokens used to call protected APIs:

- **JWT Access Tokens**: Self-contained, signed JWT with claims and scopes
- **Opaque Access Tokens**: Random string, must introspect at Auth0
- **Custom Claims**: Added via Actions (`api.accessToken.setCustomClaim`)
- **Scopes**: Permissions encoded in the token
- **Audience**: Target API identifier
- **JWE**: Encrypted access tokens (Highly Regulated Identity)

### Refresh Tokens

Used to obtain new Access Tokens without re-authenticating:

- **Rotating Refresh Tokens**: New refresh token on each use
- **Refresh Token Expiration**: Absolute and inactivity timeouts
- **Offline Access**: `offline_access` scope
- **Token Revocation**: `/oauth/revoke` endpoint

### Specialized Tokens

| Token Type | Description |
|------------|-------------|
| **IDP Access Tokens** | Tokens from social/enterprise IdPs |
| **Management API Token** | Token for Management API calls |
| **MFA Token** | Token for MFA challenge flow |
| **Password Reset Token** | One-time token for password reset |
| **Email Verification Token** | One-time token for email verification |

### JSON Web Tokens (JWT)

JWT structure: `header.payload.signature`

```
header = { "alg": "RS256", "typ": "JWT", "kid": "key-id" }
payload = { "iss", "sub", "aud", "exp", "iat", "scope", ... }
signature = RSA-SHA256(header + "." + payload, private_key)
```

**Verification steps**:
1. Decode header, get `kid`
2. Fetch JWKS from `/.well-known/jwks.json`
3. Find matching key by `kid`
4. Verify signature with public key
5. Validate `iss`, `aud`, `exp`, `iat`, `nonce`

### Token Best Practices

- **Store tokens securely**: HttpOnly cookies preferred, avoid localStorage for sensitive tokens
- **Use short-lived access tokens**: 15-60 minutes
- **Use refresh tokens**: For longer sessions
- **Validate tokens server-side**: Always verify signature and claims
- **Use sender constraining**: mTLS or DPoP for high-security APIs
- **Revoke on logout**: Call `/oauth/revoke` for refresh tokens

**Source**: [Tokens](https://auth0.com/docs/secure/tokens) | [ID Tokens](https://auth0.com/docs/secure/tokens/id-tokens) | [Get ID Tokens](https://auth0.com/docs/secure/tokens/id-tokens/get-id-tokens) | [ID Token Structure](https://auth0.com/docs/secure/tokens/id-tokens/id-token-structure) | [Update ID Token Lifetime](https://auth0.com/docs/secure/tokens/id-tokens/update-id-token-lifetime) | [Validate ID Tokens](https://auth0.com/docs/secure/tokens/id-tokens/validate-id-tokens) | [Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens) | [Access Token Profiles](https://auth0.com/docs/secure/tokens/access-tokens/access-token-profiles) | [Get Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens/get-access-tokens) | [Use Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens/use-access-tokens) | [Validate Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens/validate-access-tokens) | [Update Access Token Lifetime](https://auth0.com/docs/secure/tokens/access-tokens/update-access-token-lifetime) | [Identity Provider Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens/identity-provider-access-tokens) | [Management API Access Tokens](https://auth0.com/docs/secure/tokens/management-api-access-tokens) | [Delegation Tokens](https://auth0.com/docs/secure/tokens/delegation-tokens) | [Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens) | [Get Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens/get-refresh-tokens) | [Configure Refresh Token Expiration](https://auth0.com/docs/secure/tokens/refresh-tokens/configure-refresh-token-expiration) | [Configure Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/configure-refresh-token-rotation) | [Disable Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/disable-refresh-token-rotation) | [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation) | [Use Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/use-refresh-token-rotation) | [Use Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens/use-refresh-tokens) | [Revoke Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens/revoke-refresh-tokens) | [Manage Refresh Tokens with Actions](https://auth0.com/docs/secure/tokens/refresh-tokens/manage-refresh-tokens-with-actions) | [Multi-Resource Refresh Token](https://auth0.com/docs/secure/tokens/refresh-tokens/multi-resource-refresh-token) | [Configure MRRT](https://auth0.com/docs/secure/tokens/refresh-tokens/configure-and-implement-multi-resource-refresh-token) | [Online Refresh Tokens](https://auth0.com/docs/secure/tokens/refresh-tokens/online-refresh-tokens) | [Configure ORTs](https://auth0.com/docs/secure/tokens/refresh-tokens/configure-and-use-online-refresh-tokens) | [Refresh Token Metadata](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-metadata) | [Configure Refresh Token Metadata](https://auth0.com/docs/secure/tokens/refresh-tokens/configure-refresh-token-metadata) | [Session Tokens](https://auth0.com/docs/secure/tokens/session-tokens) | [JWT](https://auth0.com/docs/secure/tokens/json-web-tokens) | [JWT Structure](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure) | [JWT Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims) | [Create Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims) | [Validate JWTs](https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens) | [JWKS](https://auth0.com/docs/secure/tokens/json-web-keys) | [JWKS Properties](https://auth0.com/docs/secure/tokens/json-web-key-set-properties) | [Locate JWKS](https://auth0.com/docs/secure/tokens/locate-json-web-key-sets) | [Token Best Practices](https://auth0.com/docs/secure/tokens/token-best-practices) | [Token Storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage) | [Data Security](https://auth0.com/docs/secure/security-guidance/data-security) | [JWE](https://auth0.com/docs/secure/tokens/access-tokens/json-web-encryption) | [Token Vault](https://auth0.com/docs/secure/tokens/token-vault) | [Configure Token Vault](https://auth0.com/docs/secure/tokens/token-vault/configure-token-vault) | [Connected Accounts for Token Vault](https://auth0.com/docs/secure/tokens/token-vault/connected-accounts-for-token-vault) | [Access Token Exchange with Token Vault](https://auth0.com/docs/secure/tokens/token-vault/access-token-exchange-with-token-vault) | [Refresh Token Exchange with Token Vault](https://auth0.com/docs/secure/tokens/token-vault/refresh-token-exchange-with-token-vault) | [Privileged Worker Token Exchange with Token Vault](https://auth0.com/docs/secure/tokens/token-vault/privileged-worker-token-exchange-with-token-vault) | [Cross App Access](https://auth0.com/docs/secure/cross-app-access) | [End-to-end Testing](https://auth0.com/docs/secure/cross-app-access/end-to-end-testing) | [Add Organization Support](https://auth0.com/docs/secure/cross-app-access/add-organization-support)

## Security

### Application Credentials

- **Client Secrets**: For confidential clients (web apps, M2M)
- **Private Key JWT**: Use RSA/ECDSA keys instead of secrets
- **mTLS**: X.509 certificate authentication
- **Credential Rotation**: Rotate secrets and keys regularly
- **Credential Storage**: Auth0 stores credentials securely (never returns them)

### Attack Protection

| Feature | Description |
|---------|-------------|
| **Brute-Force Protection** | Block IPs after consecutive failed logins |
| **Suspicious IP Throttling** | Rate-limit IPs with excessive attempts |
| **Breached Password Detection** | Check credentials against known breaches (Have I Been Pwned) |
| **Bot Detection** | CAPTCHA and bot detection on login/signup |

**Configure**: Dashboard → Security → Attack Protection

### Breached Password Detection

- Real-time check against public breach databases
- Block login or require password reset
- Notify users via email
- Available on all plans (limited on free)

### Multi-Factor Authentication (MFA)

**MFA Factors**:

| Factor | Type | Plan |
|--------|------|------|
| **Push notifications** (Auth0 Guardian) | Something you own | Essential+ |
| **SMS** | Something you own | Essential+ |
| **Voice** | Something you own | Essential+ |
| **OTP** (Google Authenticator, etc.) | Something you own | Essential+ |
| **WebAuthn with security keys** (YubiKey) | Something you own | Enterprise |
| **WebAuthn with device biometrics** (FaceID, TouchID) | Something you are | Enterprise |
| **Email** | Something you have | Essential+ |
| **Cisco Duo** | Something you own | Enterprise |
| **Recovery codes** | Backup | Essential+ |

**Enable MFA**: Dashboard → Security → Multi-Factor Auth → Enable factors → Configure policies

**MFA Configuration**: [FIDO/WebAuthn](https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn) | [WebAuthn Device Biometrics](https://auth0.com/docs/secure/multi-factor-authentication/configure-webauthn-with-device-biometrics-for-mfa) | [WebAuthn Security Keys](https://auth0.com/docs/secure/multi-factor-authentication/configure-webauthn-with-security-keys-for-mfa) | [Email Notifications](https://auth0.com/docs/secure/multi-factor-authentication/configure-email-notifications-for-mfa) | [OTP Notifications](https://auth0.com/docs/secure/multi-factor-authentication/configure-otp-notifications-for-mfa) | [Push Notifications](https://auth0.com/docs/secure/multi-factor-authentication/configure-push-notifications-for-mfa) | [SMS/Voice Notifications](https://auth0.com/docs/secure/multi-factor-authentication/configure-sms-and-voice-notifications-for-mfa) | [Step-up Auth](https://auth0.com/docs/secure/multi-factor-authentication/add-step-up-authentication) | [Step-up for APIs](https://auth0.com/docs/secure/multi-factor-authentication/configure-step-up-authentication-for-apis) | [Step-up for Web Apps](https://auth0.com/docs/secure/multi-factor-authentication/configure-step-up-authentication-for-web-apps) | [Recovery Codes](https://auth0.com/docs/secure/multi-factor-authentication/configure-recovery-codes-for-mfa) | [Manage Factors with APIs](https://auth0.com/docs/secure/multi-factor-authentication/manage-authentication-factors-with-apis) | [Manage Auth Methods with Management API](https://auth0.com/docs/secure/multi-factor-authentication/manage-authentication-methods-with-management-api) | [Manage Factors with Auth API](https://auth0.com/docs/secure/multi-factor-authentication/manage-authentication-factors-with-authentication-api) | [MFA Developer Resources](https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-developer-resources) | [Guardian Error Codes](https://auth0.com/docs/secure/multi-factor-authentication/guardian-error-code-reference) | [Auth0 MFA API](https://auth0.com/docs/secure/multi-factor-authentication/auth0-mfa-api) | [Reset MFA & Recovery Codes](https://auth0.com/docs/secure/multi-factor-authentication/reset-user-multi-factor-authentication-and-recovery-codes)

**MFA with Actions**:
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Require MFA for admin users
  if (event.user.app_metadata.role === 'admin') {
    api.multifactor.enable('any', {
      allowRememberBrowser: false
    });
  }
};
```

### Security Center

- View security events and alerts
- Monitor attack protection triggers
- Track breached password detections
- Security recommendations

### Security Guidance

Best practices documentation:
- Token storage
- CORS configuration
- HTTPS/TLS requirements
- Session management
- Input validation
- Rate limiting

### Sender Constraining

Bind access tokens to a specific client:

- **mTLS**: Bind token to client's X.509 certificate
- **DPoP**: Bind token to client's public key (Demonstrating Proof-of-Possession)

**Configure**: [Configure Sender Constraining](https://auth0.com/docs/secure/sender-constraining/configure-sender-constraining)

### Continuous Session Protection

- Detect session hijacking
- Monitor session integrity
- Step-up authentication for sensitive operations
- Session context validation

### Highly Regulated Identity

For industries with strict compliance (healthcare, finance):

- **Customer Managed Keys (CMK)**: Bring your own encryption keys
- **Transactional Authorization**: Per-transaction auth with PAR + RAR
- **JWE**: Encrypted access tokens
- **mTLS**: Certificate-based client auth
- **Step-up authentication**: Context-aware MFA

**Source**: [Security](https://auth0.com/docs/secure) | [Application Credentials](https://auth0.com/docs/secure/application-credentials) | [Attack Protection](https://auth0.com/docs/secure/attack-protection) | [Breached Password Detection](https://auth0.com/docs/secure/attack-protection/breached-password-detection) | [Brute Force Protection](https://auth0.com/docs/secure/attack-protection/brute-force-protection) | [Suspicious IP Throttling](https://auth0.com/docs/secure/attack-protection/suspicious-ip-throttling) | [Bot Detection](https://auth0.com/docs/secure/attack-protection/bot-detection) | [Captcha](https://auth0.com/docs/secure/attack-protection/captcha) | [Phone Provider Protection](https://auth0.com/docs/secure/attack-protection/phone-provider-protection) | [MFA](https://auth0.com/docs/secure/multi-factor-authentication) | [Security Center](https://auth0.com/docs/secure/security-center) | [Metrics](https://auth0.com/docs/secure/security-center/metrics) | [Configure Security Monitoring Alerts](https://auth0.com/docs/secure/security-center/configure-security-monitoring-alerts) | [Security Guidance](https://auth0.com/docs/secure/security-guidance) | [Auth0 IP Addresses for Allow Lists](https://auth0.com/docs/secure/security-guidance/auth0-ip-addresses-for-allow-lists) | [Add User Attributes to Deny List](https://auth0.com/docs/secure/security-guidance/add-user-attributes-to-deny-list) | [Token Storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage) | [User Data Storage](https://auth0.com/docs/secure/security-guidance/data-security/user-data-storage) | [Incident Response: Using Logs](https://auth0.com/docs/secure/security-guidance/incident-response-using-logs) | [Measures Against Application Impersonation](https://auth0.com/docs/secure/security-guidance/measures-against-application-impersonation) | [Prevent Common Cybersecurity Threats](https://auth0.com/docs/secure/security-guidance/prevent-common-cybersecurity-threats) | [General Security Tips](https://auth0.com/docs/secure/security-guidance/general-security-tips) | [Sender Constraining](https://auth0.com/docs/secure/sender-constraining) | [DPoP](https://auth0.com/docs/secure/sender-constraining/demonstrating-proof-of-possession) | [mTLS Sender Constraining](https://auth0.com/docs/secure/sender-constraining/mTLS-sender-constraining) | [Continuous Session Protection](https://auth0.com/docs/secure/continuous-session-protection) | [Highly Regulated Identity](https://auth0.com/docs/secure/highly-regulated-identity) | [Transactional Authorization](https://auth0.com/docs/secure/highly-regulated-identity/transactional-authorization-with-authorization-code-flow) | [Customer Managed Keys](https://auth0.com/docs/secure/highly-regulated-identity/customer-managed-keys) | [Fine Grained Authorization](https://auth0.com/docs/secure/highly-regulated-identity/fine-grained-authorization) | [Tenant ACL](https://auth0.com/docs/secure/highly-regulated-identity/tenant-access-control-list) | [Configure Tenant ACL Rules](https://auth0.com/docs/secure/highly-regulated-identity/tenant-access-control-list/configure-tenant-access-control-list-rules) | [Rule Evaluation for Tenant ACL](https://auth0.com/docs/secure/highly-regulated-identity/tenant-access-control-list/rule-evaluation-for-the-tenant-access-control-list) | [Data Privacy and Compliance](https://auth0.com/docs/secure/data-privacy-and-compliance) | [Auth0 GDPR Compliance](https://auth0.com/docs/secure/data-privacy-and-compliance/auth0-general-data-protection-regulation-compliance) | [GDPR: Conditions for Consent](https://auth0.com/docs/secure/data-privacy-and-compliance/gdpr-conditions-for-consent) | [Risk Assessments](https://auth0.com/docs/api/management/v2/risk-assessments) | [Supplemental Signals](https://auth0.com/docs/api/management/v2/supplemental-signals) | [Verifiable Credentials](https://auth0.com/docs/api/management/v2/verifiable-credentials) | [Rate Limit Policies](https://auth0.com/docs/api/management/v2/rate-limit-policies) | [Network ACLs](https://auth0.com/docs/api/management/v2/network-acls) | [Device Credentials](https://auth0.com/docs/api/management/v2/device-credentials) | [Grants](https://auth0.com/docs/api/management/v2/grants) | [Groups](https://auth0.com/docs/api/management/v2/groups)

## Call APIs On User's Behalf

### On-Behalf-Of Token Exchange

RFC 8693 token exchange for app-to-app API calls on behalf of a user:

```http
POST /oauth/token
{
  "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token": "USER_ACCESS_TOKEN",
  "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "audience": "OTHER_API_IDENTIFIER",
  "scope": "read:data"
}
```

### Cross App Access (XAA)

Allow one app to access another app's resources on behalf of the user, across tenants or domains.

### Token Vault

Securely store and manage tokens for external services (e.g., Salesforce, Google) that the user has authorized. Users can grant and revoke access to specific services.

**Source**: [On-Behalf-Of](https://auth0.com/docs/secure/call-apis-on-users-behalf/on-behalf-of-token-exchange) | [Cross App Access](https://auth0.com/docs/secure/call-apis-on-users-behalf/cross-app-access) | [Token Vault](https://auth0.com/docs/secure/call-apis-on-users-behalf/token-vault)

## Tenant Protection

### Tenant Access Control List

- IP allowlisting for dashboard and Management API access
- Per-IP rules for tenant access
- Configure in Dashboard → Settings → Advanced

### Rate Limits

| Plan | Rate Limit |
|------|-----------|
| Free | 50 logins/min |
| Essential | 100 logins/min |
| Professional | 200 logins/min |
| Enterprise | Custom |

- Management API: 1,000 requests/min (varies by plan)
- Token endpoints: Rate-limited per client

## Compliance

### Data Privacy and Compliance

| Framework | Status |
|-----------|--------|
| **GDPR** | Compliant — EU data residency available |
| **HIPAA** | Compliant — BAA available on Enterprise |
| **SOC 2 Type II** | Compliant — Annual audits |
| **PCI DSS** | Compliant — For payment-related auth |
| **ISO 27001** | Certified |
| **FedRAMP** | In process |
| **CCPA** | Compliant — California privacy |
| **FERPA** | Compliant — Education records |

**Data Residency**: US, EU, Australia, Japan, Canada (select regions)

**Source**: [Compliance](https://auth0.com/docs/secure/data-privacy-and-compliance) | [Tenant ACL](https://auth0.com/docs/secure/tenant-access-control-list) | [Auth0 Security](https://auth0.com/security)
