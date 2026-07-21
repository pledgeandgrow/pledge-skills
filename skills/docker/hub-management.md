# Docker Hub Management

## Accounts

### Personal Accounts

```bash
# Create account at hub.docker.com
# Free tier: 1 private repository, unlimited public
# Pro tier: unlimited private, parallel builds
# Team tier: organization features, team management
```

### Access Tokens

```bash
# Create access tokens (recommended over password)
# Docker Hub → Account Settings → Security → New Access Token

# Login with token
echo $TOKEN | docker login -u username --password-stdin

# Token types:
# - Personal Access Token (PAT) — full access
# - Scoped tokens — limited permissions (read-only, etc.)
```

## Organizations

### Creating Organizations

```
# Docker Hub → Organizations → Create Organization
# Organization namespace: myorg
# Images: myorg/myapp:latest
```

### Teams and Permissions

```bash
# Teams within organizations
# Docker Hub → Organization → Teams → Create Team

# Team roles:
# - Owner: full org management
# - Admin: manage teams, repos, members
# - Write: push to repos
# - Read: pull from repos

# CLI (limited — most management via web UI)
# Add member to team (via API)
curl -X POST "https://hub.docker.com/v2/orgs/myorg/teams/developers/members/" \
  -H "Authorization: JWT $TOKEN" \
  -d '{"user":"username"}'
```

### Organization Settings

```
# Organization → Settings:
# - Organization name and description
# - Logo
# - Company association
# - SSO/SAML configuration (Team tier+)
# - SCIM provisioning (Team tier+)
# - Audit logs (Team tier+)
```

## Repositories

### Creating Repositories

```bash
# Create via Docker Hub web UI
# Docker Hub → Repositories → Create Repository

# Or just push (auto-creates if you have permission)
docker tag myapp:1.0 myorg/myapp:1.0
docker push myorg/myapp:1.0
```

### Repository Settings

```
# Repository → Settings:
# - Visibility: Public / Private
# - Description and README
# - Dockerfile link
# - Categories
# - Featured
# - Collaborators
# - Webhooks
# - Vulnerability scanning (Docker Scout)
```

### Automated Builds (Deprecated)

```bash
# Docker Hub automated builds are deprecated
# Use CI/CD (GitHub Actions, GitLab CI) instead
# See cicd.md for examples
```

### Webhooks

```bash
# Repository → Webhooks → Create Webhook
# Triggers on: push, tag

# Webhook payload:
{
  "callback_url": "https://hub.docker.com/callback/...",
  "push_data": {
    "images": ["myapp:latest", "myapp:1.0"],
    "pushed_at": "2024-01-15T10:00:00Z",
    "pusher": "username"
  },
  "repository": {
    "name": "myapp",
    "namespace": "myorg",
    "repo_name": "myorg/myapp",
    "tags": ["latest", "1.0"],
    "star_count": 10,
    "comment_count": 0,
    "is_private": false,
    "is_official": false,
    "description": "My app"
  }
}
```

## Rate Limits and Usage

### Pull Rate Limits

```
# Anonymous: 100 pulls / 6 hours per IP
# Authenticated (free): 200 pulls / 6 hours
# Pro/Team: unlimited pulls

# Check rate limit
curl -s "https://auth.docker.io/token?service=registry.docker.io&scope=repository:ratelimitpreview/test:pull" | \
  jq -r .token | \
  xargs -I{} curl -s -H "Authorization: Bearer {}" \
  "https://registry-1.docker.io/v2/ratelimitpreview/test/manifests/latest" \
  -I 2>&1 | grep -i ratelimit
```

### Managing Rate Limits

```bash
# Use a registry mirror
# daemon.json:
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}

# Authenticate to increase limits
docker login

# Use specific version tags instead of :latest
# (avoids re-pulling same image)

# Pull once and retag locally
docker pull myapp:1.0
docker tag myapp:1.0 local-registry/myapp:1.0
docker push local-registry/myapp:1.0
```

## Docker Hub API

```bash
# Authentication
TOKEN=$(curl -s -H "Content-Type: application/json" \
  -X POST -d '{"username":"user","password":"pass"}' \
  https://hub.docker.com/v2/users/login/ | jq -r .token)

# List repositories
curl -s -H "Authorization: JWT $TOKEN" \
  https://hub.docker.com/v2/repositories/myorg/?page_size=100 | jq

# Create repository
curl -s -H "Authorization: JWT $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST -d '{
    "namespace": "myorg",
    "name": "myapp",
    "description": "My application",
    "is_private": false,
    "full_description": "# My App\n\nDetailed description"
  }' \
  https://hub.docker.com/v2/repositories/

# Delete repository
curl -s -H "Authorization: JWT $TOKEN" \
  -X DELETE https://hub.docker.com/v2/repositories/myorg/myapp/

# List tags
curl -s -H "Authorization: JWT $TOKEN" \
  https://hub.docker.com/v2/repositories/myorg/myapp/tags/?page_size=100 | jq

# Delete tag
curl -s -H "Authorization: JWT $TOKEN" \
  -X DELETE https://hub.docker.com/v2/repositories/myorg/myapp/tags/latest/

# Get build history
curl -s -H "Authorization: JWT $TOKEN" \
  https://hub.docker.com/v2/repositories/myorg/myapp/buildhistory/ | jq

# Get webhooks
curl -s -H "Authorization: JWT $TOKEN" \
  https://hub.docker.com/v2/repositories/myorg/myapp/webhooks/ | jq

# Search
curl -s "https://hub.docker.com/v2/search/repositories/?query=nginx&page_size=10" | jq
```

## Docker Hub MCP Server

```bash
# Docker Hub MCP server for AI agents
# Provides access to image metadata, repository management

# Run MCP server
docker run -d --name docker-hub-mcp \
  -e DOCKER_HUB_USERNAME=user \
  -e DOCKER_HUB_TOKEN=token \
  -p 8080:8080 \
  docker/hub-mcp-server

# Available tools:
# - search_images: Search Docker Hub
# - get_image_metadata: Get image details
# - list_tags: List tags for a repository
# - get_readme: Get repository README
# - get_vulnerabilities: Get Scout results
```

## Official Images

### Using Official Images

```bash
# Official images are curated and security-scanned
docker pull nginx:latest
docker pull node:22-alpine
docker pull postgres:17

# Verified by Docker
# Regularly updated
# Follow best practices
# Available for multiple architectures
```

### Docker-Sponsored Open Source Images

```bash
# Community-maintained, Docker-sponsored
# Namespace: namespace/image (e.g., user/myapp)
# Have "Sponsored OSS" badge
```

### Docker Verified Publishers

```bash
# Verified commercial publishers
# Have "Verified Publisher" badge
# High-quality, trusted images
# Examples: hashicorp/terraform, datadog/agent
```

## Docker Hub CLI (Experimental)

```bash
# hub-tool (experimental CLI for Docker Hub)
docker run --rm -it docker/hub-tool:latest

# List repositories
hub-tool repo ls

# List tags
hub-tool tag ls myorg/myapp

# Create repository
hub-tool repo create myorg/newapp --private

# Delete tag
hub-tool tag rm myorg/myapp:old

# View org members
hub-tool org members ls myorg

# View audit logs
hub-tool org audit-logs myorg
```

## SSO and SAML (Team/Enterprise)

```
# Organization → Settings → Security → SSO
# Configure SAML 2.0 identity provider:
# - IdP metadata XML or URL
# - ACS URL: https://hub.docker.com/sso/saml/acs/
# - Entity ID: https://hub.docker.com/sso/saml/metadata/
# - NameID: email address

# Supported IdPs:
# - Okta
# - Azure AD (Entra ID)
# - Google Workspace
# - OneLogin
# - ADFS
# - Custom SAML 2.0

# SCIM provisioning (auto user management)
# Organization → Settings → Security → SCIM
# SCIM endpoint: https://hub.docker.com/scim/v2/
```

## Audit Logs

```
# Team/Enterprise tier only
# Organization → Audit Logs
# Tracks: login, repo creation, tag push/delete, member changes,
#   team changes, SSO events, API token creation

# Export via API
curl -s -H "Authorization: JWT $TOKEN" \
  "https://hub.docker.com/v2/orgs/myorg/audit-logs/?page_size=100" | jq
```
