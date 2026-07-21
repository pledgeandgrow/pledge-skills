# Spring Security Reference

## Overview

Spring Security is a framework that provides authentication, authorization, and protection against common attacks. With first-class support for securing both imperative and reactive applications, it is the de-facto standard for securing Spring-based applications.

**Key capabilities:**
- Authentication and authorization for servlet and reactive applications
- Protection against common exploits (CSRF, clickjacking, XSS, etc.)
- OAuth2 client and resource server support
- Session management
- Method-level security
- Integration with Spring Web MVC and WebFlux

Source: https://docs.spring.io/spring-security/reference/

---

## Getting Started

### Minimal Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout.permitAll());
        return http.build();
    }

    @Bean
    public UserDetailsService users() {
        UserDetails admin = User.builder()
            .username("admin")
            .password("{bcrypt}$2a$10$...")
            .roles("ADMIN")
            .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Security Filter Chain

Spring Security uses a chain of servlet filters. Key filters in order:
1. `SecurityContextHolderFilter` - Manages SecurityContext
2. `UsernamePasswordAuthenticationFilter` - Form-based auth
3. `BasicAuthenticationFilter` - HTTP Basic auth
4. `AuthorizationFilter` - URL-based authorization
5. `ExceptionTranslationFilter` - Handles security exceptions
6. `FilterSecurityInterceptor` - Method authorization

---

## Authentication

### Authentication Architecture

Core components:
- **SecurityContextHolder** - Stores the SecurityContext (current authenticated user)
- **SecurityContext** - Holds the Authentication object
- **Authentication** - Represents the authenticated principal (username, credentials, authorities)
- **AuthenticationManager** - Processes Authentication requests
- **ProviderManager** - Delegates to AuthenticationProviders
- **AuthenticationProvider** - Performs specific authentication type
- **UserDetailsService** - Loads user data
- **UserDetails** - Represents user details (username, password, authorities)
- **PasswordEncoder** - Encodes/validates passwords

### Form-Based Authentication

```java
http.formLogin(form -> form
    .loginPage("/login")
    .loginProcessingUrl("/authenticate")
    .defaultSuccessUrl("/home")
    .failureUrl("/login?error")
    .permitAll()
);
```

### HTTP Basic Authentication

```java
http.httpBasic(Customizer.withDefaults());
```

### Password Encoding

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
```

Supported encoders: `bcrypt`, `argon2`, `scrypt`, `pbkdf2`, `noop` (plaintext, not recommended).

### UserDetailsService

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(username));
        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRoles().toArray(new String[0]))
            .accountExpired(!user.isActive())
            .build();
    }
}
```

### JWT Authentication

```java
// JWT filter
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String token = extractToken(request);
        if (token != null && jwtUtil.validateToken(token)) {
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    jwtUtil.getUsername(token), null, jwtUtil.getAuthorities(token));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}

// Register filter
http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
```

### Remember-Me Authentication

```java
http.rememberMe(remember -> remember
    .key("uniqueAndSecret")
    .tokenValiditySeconds(86400)
    .rememberMeParameter("remember-me")
);
```

### Multiple HttpSecurity Instances

```java
@Configuration
@Order(1)
public static class ApiSecurityConfig {
    @Bean
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/**")
            .authorizeHttpRequests(authz -> authz.anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}

@Configuration
@Order(2)
public static class WebSecurityConfig {
    @Bean
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }
}
```

Source: https://docs.spring.io/spring-security/reference/servlet/authentication/index.html

---

## Authorization

### URL-Based Authorization

```java
http.authorizeHttpRequests(authz -> authz
    .requestMatchers("/public/**", "/login", "/error").permitAll()
    .requestMatchers("/admin/**").hasRole("ADMIN")
    .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
    .requestMatchers("/api/**").hasAuthority("API_ACCESS")
    .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/posts/**").authenticated()
    .anyRequest().denyAll()
);
```

### Method-Level Security

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig { }

@Service
public class DocumentService {

    @PreAuthorize("hasRole('ADMIN')")
    public Document getDocument(Long id) { ... }

    @PreAuthorize("hasPermission(#id, 'document', 'read')")
    public Document readDocument(Long id) { ... }

    @PostAuthorize("returnObject.owner == authentication.name")
    public Document getMyDocument(Long id) { ... }

    @PreFilter("filterObject.owner == authentication.name")
    public List<Document> filterDocuments(List<Document> documents) { ... }

    @PostFilter("filterObject.owner == authentication.name")
    public List<Document> getDocuments() { ... }

    @Secured("ROLE_ADMIN")
    public void deleteDocument(Long id) { ... }
}
```

### Authorization Architecture

- **AuthorizationManager** - Decides if access should be granted
- **AuthenticatedAuthorizationManager** - Checks if authenticated
- **AuthorityAuthorizationManager** - Checks authorities
- **RequestAuthorizationManager** - Request-level authorization
- **AuthorizationEventPublisher** - Publishes authorization events

As of Spring Security 7, the legacy `AccessDecisionManager` and `AccessDecisionVoter` are moved to `spring-security-access` module.

Source: https://docs.spring.io/spring-security/reference/servlet/authorization/index.html

---

## OAuth2

Spring Security provides comprehensive OAuth 2.0 support for servlet-based applications.

### OAuth2 Resource Server (JWT)

```java
http.oauth2ResourceServer(oauth2 -> oauth2
    .jwt(Customizer.withDefaults())
);
```

Configuration:
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://issuer.example.com
          jwk-set-uri: https://issuer.example.com/.well-known/jwks.json
```

### OAuth2 Client (Login)

```java
http.oauth2Login(Customizer.withDefaults());
```

Configuration:
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: profile, email
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
```

### OAuth2 Client (Access Protected Resources)

```java
@Autowired
private OAuth2AuthorizedClientManager authorizedClientManager;

public String callProtectedApi() {
    OAuth2AuthorizedClient client = authorizedClientManager.authorize(
        OAuth2AuthorizeRequest.withClientRegistrationId("google")
            .principal(authentication)
            .build()
    );
    String accessToken = client.getAccessToken().getTokenValue();
    // Use access token to call protected API
}
```

### Client Credentials Grant

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          my-client:
            client-id: ${CLIENT_ID}
            client-secret: ${CLIENT_SECRET}
            authorization-grant-type: client_credentials
            scope: read, write
```

### Custom JWT Decoder

```java
@Bean
public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuerUri));
    return decoder;
}
```

Source: https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html

---

## Protection Against Common Exploits

### CSRF Protection

Enabled by default for non-GET requests. Use CSRF tokens in forms:

```html
<input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
```

Disable CSRF (for stateless APIs):
```java
http.csrf(csrf -> csrf.disable());
```

### Security Headers

Spring Security adds security headers by default:
- `Cache-Control: no-cache, no-store, max-age=0, must-revalidate`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY` (clickjacking protection)
- `Content-Security-Policy` (configurable)

Customize:
```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
    .frameOptions(fo -> fo.sameOrigin())
    .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
);
```

### X-XSS-Protection

Spring Security adds `X-XSS-Protection: 0` by default (recommends CSP instead). Can be customized.

---

## Session Management

```java
http.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // ALWAYS, NEVER, IF_REQUIRED, STATELESS
    .maximumSessions(1)
    .maxSessionsPreventsLogin(true) // false = kick out previous session
    .sessionRegistry(sessionRegistry())
    .invalidSessionUrl("/login?expired")
);
```

### Session Fixation Protection

Spring Security protects against session fixation by default by creating a new session on authentication.

### Concurrent Session Control

```java
http.sessionManagement(session -> session
    .maximumSessions(1)
    .maxSessionsPreventsLogin(true)
);
```

---

## Reactive Security (WebFlux)

```java
@Configuration
@EnableWebFluxSecurity
public class ReactiveSecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/public/**").permitAll()
                .pathMatchers("/admin/**").hasRole("ADMIN")
                .anyExchange().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public ReactiveUserDetailsService userDetailsService() {
        UserDetails admin = User.withUsername("admin")
            .password("{bcrypt}$2a$10$...")
            .roles("ADMIN")
            .build();
        return new MapReactiveUserDetailsService(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Reactive Method Security

```java
@Configuration
@EnableReactiveMethodSecurity
public class ReactiveMethodSecurityConfig { }

@Service
public class ReactiveDocumentService {

    @PreAuthorize("hasRole('ADMIN')")
    public Mono<Document> getDocument(Long id) { ... }
}
```

---

## Security Testing

```java
@SpringBootTest
class SecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void adminCanAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
            .andExpect(status().isOk());
    }

    @Test
    @WithAnonymousUser
    void anonymousCannotAccessProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/user/profile"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void userCannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
            .andExpect(status().isForbidden());
    }
}
```

### @WithUserDetails

```java
@Test
@WithUserDetails("customuser")
void testWithCustomUser() { ... }
```

### CSRF in Tests

```java
@Test
void testPostWithCsrf() throws Exception {
    mockMvc.perform(post("/api/data")
            .with(csrf()))
        .andExpect(status().isOk());
}
```

---

## SAML 2.0

Spring Security provides comprehensive SAML 2.0 support for servlet-based applications, including service provider (SP) and identity provider (IdP) integration.

### SAML 2.0 Service Provider

```java
http.saml2Login(Customizer.withDefaults());
```

Configuration:
```yaml
spring:
  security:
    saml2:
      relyingparty:
        registration:
          my-idp:
            identityprovider:
              entity-id: https://idp.example.com
              sso-url: https://idp.example.com/sso
              verification:
                credentials:
                  - x509-certificate: |
                      -----BEGIN CERTIFICATE-----
                      MIID...
                      -----END CERTIFICATE-----
            assertingparty:
              entity-id: https://idp.example.com
```

### SAML 2.0 Logout

```java
http.saml2Logout(logout -> logout.logoutUrl("/saml2/logout"));
```

### SAML 2.0 Attributes

Access SAML attributes after authentication:
```java
@GetMapping("/user")
public Map<String, List<String>> user(@AuthenticationPrincipal Saml2AuthenticatedPrincipal principal) {
    return principal.getAttributes();
}
```

Source: https://docs.spring.io/spring-security/reference/servlet/saml2/index.html

---

## LDAP Authentication

Spring Security provides LDAP authentication support via `LdapAuthenticationProvider`.

### Configuration

```java
@Bean
public AuthenticationManager ldapAuthenticationManager(BaseLdapPathContextSource contextSource) {
    LdapBindAuthenticationManagerFactory factory = new LdapBindAuthenticationManagerFactory(contextSource);
    factory.setUserDnPatterns("uid={0},ou=people");
    return factory.createAuthenticationManager();
}
```

### Password Comparison

```java
@Bean
public AuthenticationManager ldapAuthenticationManager(BaseLdapPathContextSource contextSource) {
    LdapPasswordComparisonAuthenticationManagerFactory factory =
        new LdapPasswordComparisonAuthenticationManagerFactory(contextSource, passwordEncoder());
    factory.setUserDnPatterns("uid={0},ou=people");
    factory.setPasswordAttribute("userPassword");
    return factory.createAuthenticationManager();
}
```

### LDAP Configuration

```yaml
spring:
  ldap:
    urls: ldap://localhost:8389/dc=example,dc=com
    username: cn=admin
    password: secret
```

### Embedded LDAP Server (Testing)

```xml
<dependency>
    <groupId>com.unboundid</groupId>
    <artifactId>unboundid-ldapsdk</artifactId>
    <scope>test</scope>
</dependency>
```

```yaml
spring:
  ldap:
    embedded:
      base-dn: dc=example,dc=com
      port: 8389
      ldif: classpath:test-server.ldif
```

---

## X.509 Certificate Authentication

X.509 certificate authentication uses SSL mutual authentication. The server requests a client certificate during the SSL handshake, and Spring Security extracts the certificate via a filter.

### Configuration

```java
http.x509(x509 -> x509
    .subjectPrincipalRegex("CN=(.*?)(?:,|$)")
    .userDetailsService(userDetailsService())
);
```

### SSL Configuration (Tomcat)

```properties
server.ssl.enabled=true
server.ssl.client-auth=need
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=changeit
server.ssl.trust-store=classpath:truststore.p12
server.ssl.trust-store-password=changeit
```

### How It Works

1. Client presents certificate during SSL handshake
2. `X509AuthenticationFilter` extracts certificate from `X509Certificate[]`
3. Subject principal regex extracts username from certificate subject DN
4. `UserDetailsService` loads user authorities
5. Authentication includes `FACTOR_X509` authority

Source: https://docs.spring.io/spring-security/reference/servlet/authentication/x509.html

---

## Authentication Events

Spring Security publishes events for successful and failed authentications.

### Publishing Events

```java
@Bean
public AuthenticationEventPublisher authenticationEventPublisher(
        ApplicationEventPublisher applicationEventPublisher) {
    return new DefaultAuthenticationEventPublisher(applicationEventPublisher);
}
```

### Listening to Events

```java
@Component
public class AuthenticationEvents {

    @EventListener
    public void onSuccess(AuthenticationSuccessEvent success) {
        // log successful authentication
    }

    @EventListener
    public void onFailure(AbstractAuthenticationFailureEvent failure) {
        // log failed authentication
    }
}
```

### Event Types

| Event | Description |
|-------|-------------|
| `AuthenticationSuccessEvent` | Successful authentication |
| `AuthenticationFailureBadCredentialsEvent` | Bad credentials |
| `AuthenticationFailureDisabledEvent` | Account disabled |
| `AuthenticationFailureExpiredEvent` | Account expired |
| `AuthenticationFailureLockedEvent` | Account locked |
| `AuthenticationFailureServiceExceptionEvent` | Service exception |
| `AuthenticationFailureProviderNotFoundEvent` | Provider not found |

Source: https://docs.spring.io/spring-security/reference/servlet/authentication/events.html

---

## Pre-Authentication Scenarios

Pre-authentication scenarios handle cases where the application is already authenticated by an external system (e.g., JEE container, SiteMinder, CA Siteminder).

### Pre-Authentication Filter

```java
public class RequestHeaderAuthenticationFilter extends AbstractPreAuthenticatedProcessingFilter {

    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
        return request.getHeader("SM_USER");
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
        return "N/A";
    }
}
```

### Configuration

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .addFilterBefore(requestHeaderAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(authz -> authz.anyRequest().authenticated());
    return http.build();
}

@Bean
public RequestHeaderAuthenticationFilter requestHeaderAuthenticationFilter() {
    RequestHeaderAuthenticationFilter filter = new RequestHeaderAuthenticationFilter();
    filter.setPrincipalRequestHeader("SM_USER");
    filter.setAuthenticationManager(authenticationManager());
    return filter;
}
```

---

## CSRF Protection for SPAs (Angular, React, Vue)

For single-page applications, CSRF protection requires special handling since forms are submitted via AJAX.

### CookieCsrfTokenRepository (SPA-friendly)

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
);
```

This approach:
- Stores CSRF token in a cookie readable by JavaScript
- SPA reads the cookie and sends token as a header (`X-XSRF-TOKEN`)
- Spring Security validates the header against the token

### Angular Integration

Angular's `HttpClientXsrfModule` automatically reads `XSRF-TOKEN` cookie and sends it as `X-XSRF-TOKEN` header:

```typescript
imports: [
  HttpClientXsrfModule.withOptions({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  })
]
```

### React/Vue Integration

Read the CSRF cookie and include it as a header in requests:

```javascript
function getCookie(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
}

fetch('/api/data', {
    headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') }
});
```

### Disabling CSRF for Stateless APIs

If using JWT or stateless authentication, CSRF can be disabled:

```java
http.csrf(csrf -> csrf.disable());
```

---

## Spring Authorization Server

Spring Authorization Server is a separate framework for building OAuth2/OIDC authorization servers.

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-authorization-server</artifactId>
    <version>1.3.0</version>
</dependency>
```

### Configuration

```java
@Configuration
@EnableWebSecurity
public class AuthorizationServerConfig {

    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient client = RegisteredClient.withId(UUID.randomUUID().toString())
            .clientId("client")
            .clientSecret("{noop}secret")
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
            .redirectUri("http://127.0.0.1:8080/login/oauth2/code/client")
            .scope(OidcScopes.OPENID)
            .scope("read")
            .scope("write")
            .clientSettings(ClientSettings.builder().requireAuthorizationConsent(true).build())
            .tokenSettings(TokenSettings.builder()
                .accessTokenTimeToLive(Duration.ofMinutes(30))
                .refreshTokenTimeToLive(Duration.ofDays(1))
                .build())
            .build();
        return new InMemoryRegisteredClientRepository(client);
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        RSAKey rsaKey = generateRsaKey();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return (jwkSelector, context) -> jwkSelector.select(jwkSet);
    }

    @Bean
    public ProviderSettings providerSettings() {
        return ProviderSettings.builder()
            .issuer("http://localhost:9000")
            .build();
    }
}
```

### Supported Grant Types

- Authorization Code
- Refresh Token
- Client Credentials
- Resource Owner Password Credentials (deprecated)
- Device Authorization Code
- Token Exchange (RFC 8693)

### Endpoints

| Endpoint | Path |
|----------|------|
| Authorization | `/oauth2/authorize` |
| Token | `/oauth2/token` |
| JWK Set | `/oauth2/jwks` |
| UserInfo | `/userinfo` |
| Revocation | `/oauth2/revoke` |
| Introspection | `/oauth2/introspect` |
| Device Authorization | `/oauth2/device_authorization` |
