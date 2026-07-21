# Symfony — Security

> Symfony Security provides authentication (identifying users), authorization (denying access), password hashing, CSRF protection, and LDAP integration.

**Security**: [symfony.com/doc/current/security.html](https://symfony.com/doc/current/security.html)  
**Passwords**: [symfony.com/doc/current/security/passwords.html](https://symfony.com/doc/current/security/passwords.html)  
**CSRF**: [symfony.com/doc/current/security/csrf.html](https://symfony.com/doc/current/security/csrf.html)  
**LDAP**: [symfony.com/doc/current/security/ldap.html](https://symfony.com/doc/current/security/ldap.html)  

## Security Introduction

### Installation

```bash
composer require security
```

### The User

Create a user class implementing `UserInterface`:

```php
namespace App\Entity;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private ?int $id = null;
    private ?string $email = null;
    private array $roles = [];
    private ?string $password = null;

    public function getId(): ?int { return $this->id; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string { return $this->password; }
    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void { /* ... */ }
}
```

### Loading the User: The User Provider

```php
namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class UserProvider implements UserProviderInterface
{
    public function __construct(private UserRepository $userRepository) {}

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $user = $this->userRepository->findOneBy(['email' => $identifier]);
        if (!$user) {
            throw new UserNotFoundException();
        }
        return $user;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }
}
```

### Registering the User: Hashing Passwords

```php
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

public function register(UserPasswordHasherInterface $passwordHasher): Response
{
    $user = new User();
    $plaintextPassword = 'plainpassword';
    $hashedPassword = $passwordHasher->hashPassword($user, $plaintextPassword);
    $user->setPassword($hashedPassword);
    // Persist...
}
```

## The Firewall

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        App\Entity\User: 'auto'

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false

        main:
            lazy: true
            provider: app_user_provider
            form_login:
                login_path: login
                check_path: login
                enable_csrf: true
            logout:
                path: app_logout

    access_control:
        - { path: ^/admin, roles: ROLE_ADMIN }
        - { path: ^/profile, roles: ROLE_USER }
```

## Authenticating Users

### Form Login

```php
#[Route('/login', name: 'login')]
public function login(AuthenticationUtils $authenticationUtils): Response
{
    $error = $authenticationUtils->getLastAuthenticationError();
    $lastUsername = $authenticationUtils->getLastUsername();

    return $this->render('security/login.html.twig', [
        'last_username' => $lastUsername,
        'error' => $error,
    ]);
}
```

```twig
{# templates/security/login.html.twig #}
<form action="{{ path('login') }}" method="post">
    <input type="email" name="_username" value="{{ last_username }}" required>
    <input type="password" name="_password" required>
    <input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate') }}">
    <button type="submit">Login</button>
</form>
```

### JSON Login

```yaml
# config/packages/security.yaml
firewalls:
    main:
        json_login:
            check_path: /api/login
```

### HTTP Basic

```yaml
firewalls:
    main:
        http_basic: ~
```

### Login Link

```yaml
firewalls:
    main:
        login_link:
            check_route: login_check
            signature_properties: ['id', 'email']
```

### Access Tokens

```yaml
firewalls:
    main:
        access_token:
            token_extractors:
                - header: Authorization
                  prefix: Bearer
```

### X.509 Client Certificates

```yaml
firewalls:
    main:
        x509:
            user: SSL_CLIENT_S_DN_CN
            credentials: SSL_CLIENT_S_DN_emailAddress
```

### Remote Users

```yaml
firewalls:
    main:
        remote_user:
            user: REMOTE_USER
```

### Limiting Login Attempts

```yaml
# config/packages/security.yaml
firewalls:
    main:
        login_throttling:
            max_attempts: 5
            interval: '15 minutes'
```

### Customizing Successful and Failed Authentication

```php
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;

class AuthenticationListener
{
    #[AsEventListener]
    public function onLoginSuccess(LoginSuccessEvent $event): void { /* ... */ }

    #[AsEventListener]
    public function onLoginFailure(LoginFailureEvent $event): void { /* ... */ }
}
```

## Login Programmatically

```php
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;

// Manual login
$this->container->get('security.token_storage')->setToken(
    new UsernamePasswordToken($user, 'main', $user->getRoles())
);
```

## Logging Out

```yaml
firewalls:
    main:
        logout:
            path: app_logout
            target: app_home
            invalidate_session: true
```

## Fetching the User Object

```php
// In controllers
$user = $this->getUser();

// In services
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class MyService
{
    public function __construct(private TokenStorageInterface $tokenStorage) {}

    public function getCurrentUser(): ?User
    {
        return $this->tokenStorage->getToken()?->getUser();
    }
}
```

```twig
{# In Twig templates #}
{% if app.user %}
    Hello {{ app.user.email }}
{% endif %}
```

## Access Control (Authorization)

### Roles

```php
// Check if user has role
$this->isGranted('ROLE_ADMIN');

// Deny access
$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Access denied.');
```

### Access Control in Configuration

```yaml
security:
    access_control:
        - { path: ^/admin, roles: ROLE_ADMIN }
        - { path: ^/api, roles: ROLE_API_USER, methods: [GET, POST] }
        - { path: ^/login, roles: PUBLIC_ACCESS }
```

### Voters

```php
namespace App\Security;

use App\Entity\Post;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PostVoter extends Voter
{
    public const EDIT = 'POST_EDIT';
    public const DELETE = 'POST_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE]) && $subject instanceof Post;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        $post = $subject;

        return match ($attribute) {
            self::EDIT => $this->canEdit($post, $user),
            self::DELETE => $this->canDelete($post, $user),
            default => false,
        };
    }

    private function canEdit(Post $post, User $user): bool
    {
        return $user === $post->getAuthor() || in_array('ROLE_ADMIN', $user->getRoles());
    }

    private function canDelete(Post $post, User $user): bool
    {
        return $this->canEdit($post, $user);
    }
}
```

### Using Voters

```php
#[Route('/post/{id}/edit', name: 'post_edit')]
public function edit(Post $post): Response
{
    $this->denyAccessUnlessGranted('POST_EDIT', $post);
    // ...
}
```

```twig
{% if is_granted('POST_EDIT', post) %}
    <a href="{{ path('post_edit', {id: post.id}) }}">Edit</a>
{% endif %}
```

### Security Events

| Event | When |
|-------|------|
| `LoginSuccessEvent` | Successful login |
| `LoginFailureEvent` | Failed login |
| `LogoutEvent` | User logs out |
| `AuthenticationSuccessEvent` | Authentication succeeds |
| `AuthenticationFailureEvent` | Authentication fails |

## Password Hashing

### Configuring a Password Hasher

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        App\Entity\User: 'auto'
        # Or specific algorithm
        App\Entity\User:
            algorithm: 'bcrypt'
            cost: 13
```

### Hashing the Password

```php
$hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
```

### Verifying a Password

```php
if ($passwordHasher->isPasswordValid($user, $plainPassword)) {
    // Valid
}
```

### Password Migration

```yaml
security:
    password_hashers:
        App\Entity\User:
            algorithm: 'auto'
            migrate_from:
                - 'bcrypt'
                - 'sha256'
```

### Supported Algorithms

- **auto** — Best available algorithm (recommended)
- **bcrypt** — Bcrypt with configurable cost
- **sodium** — Libsodium Argon2i
- **pbkdf2** — PBKDF2 with configurable hash

## CSRF Protection

### CSRF Protection in Symfony Forms

Automatically enabled for all forms:

```php
$builder->add('task', TextType::class, [
    'csrf_protection' => true,
    'csrf_field_name' => '_token',
    'csrf_token_id' => 'task_item',
]);
```

### CSRF Protection in Login Form

```yaml
# config/packages/security.yaml
firewalls:
    main:
        form_login:
            enable_csrf: true
        logout:
            enable_csrf: true
```

### Generating and Checking CSRF Tokens Manually

```php
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class MyController
{
    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager) {}

    public function someAction(Request $request): Response
    {
        $token = $this->csrfTokenManager->getToken('my_token_id')->getValue();

        if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('my_token_id', $request->request->get('_token')))) {
            throw new \Exception('Invalid CSRF token');
        }
    }
}
```

```twig
<input type="hidden" name="_token" value="{{ csrf_token('my_token_id') }}">
```

### Stateless CSRF Tokens

```yaml
framework:
    csrf_protection:
        stateless_token_ids:
            - my_api_token
```

## LDAP Authentication

### Installation

```bash
composer require symfony/ldap
```

### Configuring the LDAP Client

```yaml
# config/packages/security.yaml
services:
    Symfony\Component\Ldap\Ldap:
        arguments: ['@Symfony\Component\Ldap\Adapter\ExtLdap\Adapter']
    Symfony\Component\Ldap\Adapter\ExtLdap\Adapter:
        arguments:
            - { host: 'ldap.example.com', port: 389 }
```

### Fetching Users Using the LDAP User Provider

```yaml
security:
    providers:
        my_ldap_provider:
            ldap:
                service: Symfony\Component\Ldap\Ldap
                base_dn: 'ou=Users,dc=example,dc=com'
                search_dn: 'cn=read-only-admin,dc=example,dc=com'
                search_password: 'password'
                default_roles: ROLE_USER
                uid_key: 'uid'
```

### Authenticating against LDAP

```yaml
security:
    firewalls:
        main:
            form_login_ldap:
                service: Symfony\Component\Ldap\Ldap
                dn_string: 'uid={user},ou=Users,dc=example,dc=com'
```
