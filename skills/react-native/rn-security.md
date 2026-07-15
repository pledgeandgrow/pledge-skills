# Security Guide

Security considerations for React Native apps — storing sensitive info, authentication, and network security.

---

## Storing Sensitive Info

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) is a community-maintained module providing an asynchronous, **unencrypted**, key-value store. Every app has its own sandbox environment and has no access to data from other apps.

> **Warning:** Async Storage is NOT for storing sensitive data. It's the React Native equivalent of Local Storage from the web.

### Secure Storage

React Native does not bundle any way of storing sensitive data. Use platform-specific solutions:

**iOS — Keychain Services:**
- [Keychain Services](https://developer.apple.com/documentation/security/keychain_services) securely stores small chunks of sensitive info (certificates, tokens, passwords)

**Android — Encrypted Shared Preferences:**
- [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) wraps Shared Preferences with automatic encryption of keys and values

**Android — Keystore:**
- [Android Keystore](https://developer.android.com/training/articles/keystore) stores cryptographic keys in a container to make extraction difficult

**Libraries to consider:**
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

> **Caution:** Don't accidentally store sensitive info — e.g., saving sensitive form data in Redux state and persisting the whole state tree in Async Storage, or sending user tokens to monitoring services like Sentry/Crashlytics.

---

## Authentication and Deep Linking

### OAuth2 and Redirects

OAuth2 is the most widely used authentication protocol. On the web, redirect URLs are guaranteed unique. For apps, there's no centralized URL scheme registration — an additional check is needed: **PKCE**.

**PKCE (Proof of Key Code Exchange):**
- Extension to OAuth 2 spec
- Verifies that authentication and token exchange requests come from the same client
- Uses SHA 256 Cryptographic Hash Algorithm

**How PKCE works:**
1. Client generates `code_verifier` (large random string)
2. Client computes `code_challenge` = SHA 256 of `code_verifier`
3. During `/authorize` request, client sends `code_challenge`
4. After authorization, client sends `code_verifier`
5. IDP calculates `code_challenge` from `code_verifier` and compares to original
6. Only if values match, access token is sent

This ensures only the application that triggered the initial authorization flow can exchange the verification code for a JWT.

**Library:** [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth) — SDK for OAuth2 providers, wraps native AppAuth-iOS and AppAuth-Android, supports PKCE.

---

## Network Security

### SSL Pinning

Using HTTPS alone can still leave data vulnerable to interception. An attacker could install a malicious root CA certificate, making the client trust attacker-signed certificates.

**SSL Pinning** embeds a list of trusted certificates in the client during development. Only requests signed with trusted certificates are accepted; self-signed certificates are rejected.

**Caveat:** Certificates expire every 1-2 years. When a certificate expires, it must be updated in both the app and server. Apps with old certificates will cease to work until updated.

---

## Summary

- Invest in security proportional to the sensitivity of data stored
- Use Keychain/Keystore for sensitive data, not Async Storage
- Use PKCE for OAuth2 flows
- Consider SSL pinning for high-security apps
- Be mindful of certificate expiry when using SSL pinning
- Don't accidentally expose sensitive data to monitoring services
