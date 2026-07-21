# Docker Scout, Desktop, and Ecosystem

## Docker Scout

Docker Scout is a supply chain security tool that analyzes container images for vulnerabilities, provides recommendations, and enforces policies.

### Basic Commands

```bash
# Quick overview of an image
docker scout quickview myapp:latest

# List CVEs (vulnerabilities)
docker scout cves myapp:latest
docker scout cves --format json myapp:latest
docker scout cves --only-type npm myapp:latest

# Get remediation recommendations
docker scout recommendations myapp:latest

# Generate SBOM (Software Bill of Materials)
docker scout sbom myapp:latest
docker scout sbom --format spdx-json myapp:latest

# Compare two images
docker scout compare myapp:1.0 myapp:2.0

# View policy status
docker scout policy myapp:latest

# Watch for new vulnerabilities
docker scout watch myapp:latest
```

### Integration with CI/CD

```yaml
# GitHub Actions
- name: Docker Scout
  uses: docker/scout-action@v1
  with:
    command: cves
    image: myapp:latest
    severity: critical,high
    exit-code: true  # fail CI on critical/high CVEs
```

```bash
# GitLab CI
docker scout cves $IMAGE --exit-code --severity critical,high
```

### Policy Evaluation

```bash
# Define policies in .docker/scout/policy.yml
# Policies control what CVEs are acceptable

# Example policy:
# - Block critical CVEs in production
# - Allow high CVEs with available fix
# - Ignore CVEs in dev dependencies

docker scout policy myapp:latest
```

### Docker Scout in Docker Desktop

```
# Docker Desktop → Scout tab
# - View vulnerabilities for all local images
# - See affected packages and versions
# - Get fix recommendations
# - Compare images
# - Set policy thresholds
```

## Docker Desktop

### Features

- **GUI Dashboard**: Manage containers, images, volumes, networks
- **Kubernetes**: Built-in single-node cluster
- **Docker Compose**: Visual management of Compose apps
- **Dev Environments**: Share and reproduce dev environments
- **Extensions**: Install third-party tools (e.g., databases, monitoring)
- **Resource Monitor**: CPU, memory, disk, network usage
- **Volume Mounting**: Fast file sharing between host and containers
- **WSL 2 Integration**: Native Linux experience on Windows

### Settings

```
Settings → Resources:
  - CPUs: Number of CPU cores
  - Memory: RAM allocated to Docker VM
  - Swap: Swap space
  - Disk image size: Maximum disk for Docker VM
  - Disk image location: Path to Docker VM disk

Settings → Docker Engine:
  - Edit daemon.json directly
  - Restart daemon after changes

Settings → Kubernetes:
  - Enable/Disable Kubernetes
  - Reset Kubernetes cluster

Settings → General:
  - Start Docker Desktop on login
  - Use WSL 2 based engine (Windows)
  - Send usage statistics

Settings → Builders:
  - Configure Buildx builders
  - Set default builder
```

### Dev Environments

```bash
# Create a dev environment from a directory
docker dev create . --name myproject

# Create from a Git repo
docker dev create https://github.com/user/repo --name cloned

# List dev environments
docker dev list

# Open in VS Code
docker dev open myproject

# Share dev environment
docker dev share myproject
```

### Extensions

```bash
# List installed extensions
docker extension ls

# Install extension
docker extension install diskusage/disk-usage-extension

# Update extension
docker extension update diskusage/disk-usage-extension

# Remove extension
docker extension rm diskusage/disk-usage-extension

# Popular extensions:
# - Disk Usage — visualize disk usage
# - Docker Scout — security scanning
# - Registry Explorer — browse registries
# - Resource Usage — monitor resources
# - Logs Explorer — advanced log viewing
```

### Docker Desktop CLI

```bash
# Start Docker Desktop (macOS)
open -a Docker

# Start Docker Desktop (Windows)
"C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Check status
docker info

# Factory reset
docker system factory-reset
```

## Docker Engine API

The Docker Engine REST API allows programmatic control of Docker.

### API Versions

```bash
# Get API version
curl --unix-socket /var/run/docker.sock http://localhost/version

# List containers
curl --unix-socket /var/run/docker.sock http://localhost/v1.45/containers/json

# Create container
curl --unix-socket /var/run/docker.sock \
  -X POST http://localhost/v1.45/containers/create \
  -H "Content-Type: application/json" \
  -d '{
    "Image": "nginx:latest",
    "ExposedPorts": {"80/tcp": {}},
    "HostConfig": {
      "PortBindings": {"80/tcp": [{"HostPort": "8080"}]}
    }
  }'

# Start container
curl --unix-socket /var/run/docker.sock \
  -X POST http://localhost/v1.45/containers/CONTAINER_ID/start

# Get logs
curl --unix-socket /var/run/docker.sock \
  "http://localhost/v1.45/containers/CONTAINER_ID/logs?stdout=true&follow=true"

# Remote API (with TLS)
curl --cert cert.pem --key key.pem --cacert ca.pem \
  https://docker.example.com:2376/v1.45/containers/json
```

### SDK Examples

```python
# Python SDK
import docker

client = docker.from_env()
container = client.containers.run("nginx", ports={'80/tcp': 8080}, detach=True)
print(container.id)
container.stop()
container.remove()
```

```javascript
// JavaScript SDK
import Docker from 'dockerode';
const docker = new Docker();

const container = await docker.createContainer({
  Image: 'nginx',
  HostConfig: { PortBindings: { '80/tcp': [{ HostPort: '8080' }] } }
});
await container.start();
```

```go
// Go SDK
import "github.com/docker/docker/client"

cli, _ := client.NewClientWithOpts(client.FromEnv)
resp, _ := cli.ContainerCreate(ctx, &container.Config{
  Image: "nginx",
}, &container.HostConfig{
  PortBindings: nat.PortMap{"80/tcp": []nat.PortBinding{{HostPort: "8080"}}},
}, nil, nil, "")
cli.ContainerStart(ctx, resp.ID, container.StartOptions{})
```

## Testcontainers

Testcontainers is a library for creating disposable, clean-container environments for testing.

```java
// Java — JUnit 5
@Container
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17")
    .withDatabaseName("testdb")
    .withUsername("test")
    .withPassword("test");

@Test
void testQuery() {
    String jdbcUrl = postgres.getJdbcUrl();
    // connect to postgres.getJdbcUrl() with test/test
}
```

```python
# Python — pytest
from testcontainers.postgres import PostgresContainer

def test_docker():
    with PostgresContainer("postgres:17") as pg:
        conn = psycopg2.connect(pg.get_connection_url())
        # run tests against the container
```

```go
// Go
func TestWithPostgres(t *testing.T) {
    ctx := context.Background()
    pgContainer, _ := postgresmodule.Run(ctx, "postgres:17")
    defer pgContainer.Terminate(ctx)
    // run tests
}
```

```javascript
// Node.js — Jest
const { PostgreSqlContainer } = require("testcontainers");

let container;
beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:17").start();
});
afterAll(async () => {
  await container.stop();
});
```

## Docker Build Cloud

```bash
# Docker Build Cloud — cloud-based builds
# Requires Docker subscription

# Create cloud builder
docker buildx create --name cloud --driver cloud --provider docker

# Use cloud builder
docker buildx use cloud

# Build in cloud
docker buildx build --builder cloud -t myapp:latest --push .

# Benefits:
# - Faster builds (powerful cloud machines)
# - Multi-platform without local QEMU
# - Shared cache across team
# - No local resources needed
```

## Docker Offload

```bash
# Docker Offload — run containers in the cloud
# Requires Docker subscription

# Move workloads to cloud
docker offload run -d -p 8080:80 nginx

# Benefits:
# - Free up local resources
# - Run on cloud GPUs
# - Access cloud networks
# - Seamless local experience
```

## Docker Model Runner

```bash
# Docker Model Runner — run LLMs locally in containers
# Part of Docker Desktop

# Pull a model
docker model pull ai/llama3:8b

# Run a model
docker model run ai/llama3:8b

# List models
docker model ls

# Inspect model
docker model inspect ai/llama3:8b

# Serve model as API
docker model serve ai/llama3:8b --port 8080
```

## Docker Hardened Images

```bash
# Docker Hardened Images — pre-built, security-hardened images
# Minimal attack surface, verified supply chain

# Pull hardened image
docker pull dhi.docker.com/nginx:hardened

# Features:
# - Minimal base (no shell, no package manager)
# - SBOM included
# - Signed and verified
# - Regularly scanned for CVEs
# - Compliance-ready (CIS, NIST)
```

## Docker Sandboxes

Docker Sandboxes run AI coding agents in isolated microVM environments, keeping your host system safe while giving the agent full access to your project files.

### Installation

```bash
# macOS
brew trust docker/tap
brew install docker/tap/sbx

# Windows
winget install -h Docker.sbx

# Linux
curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh
sudo apt-get install docker-sbx
sudo usermod -aG kvm $USER
newgrp kvm

# Sign in
sbx login
```

### Usage

```bash
# Launch an agent in a sandbox (from project directory)
cd ~/my-project
sbx run claude

# List available agents
sbx agents

# Stop a running sandbox
sbx stop

# View sandbox status
sbx ls

# View sandbox logs
sbx logs

# Open shell in sandbox
sbx shell
```

### Architecture

```
┌─────────────────────────────────────┐
│         Host Machine                │
│  ┌───────────┐  ┌────────────────┐ │
│  │  sbx CLI  │  │  Docker Engine │ │
│  └─────┬─────┘  └───────┬────────┘ │
│        │                 │          │
│  ┌─────┴─────────────────┴───────┐ │
│  │     microVM (isolation)       │ │
│  │  ┌─────────────────────────┐  │ │
│  │  │   AI Agent (Claude, etc)│  │ │
│  │  │   Workspace mount (ro)  │  │ │
│  │  │   Network policies      │  │ │
│  │  └─────────────────────────┘  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Key Features

- **microVM Isolation**: Each agent runs in its own microVM, fully isolated from the host
- **Workspace Mounting**: Project files are mounted read-only by default; agent writes go to a separate overlay
- **Network Policies**: Control outbound network access (allowlist/denylist)
- **Credential Handling**: Host credentials (API keys, SSH keys) are injected securely, never stored in the sandbox
- **Customizable Templates**: Reusable sandbox configurations via declarative kits
- **Supported Agents**: Claude Code, Cursor, Windsurf, and more

### Customization

```yaml
# sandbox-kit.yaml — reusable sandbox template
agent: claude
workspace:
  mount: .
  readonly: false
network:
  allow:
    - api.anthropic.com
    - github.com
  deny:
    - "*"
resources:
  cpus: 4
  memory: 8G
environment:
  - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

```bash
# Run with custom kit
sbx run --kit sandbox-kit.yaml

# Share a kit
sbx kit push ./my-kit.yaml myuser/my-kit
sbx kit pull myuser/my-kit
```

### Security Model

- Agents cannot access host filesystem outside the mounted workspace
- No access to Docker socket or host processes
- Network egress controlled by policy
- Credentials injected via secure channel, not environment files
- Sandbox destroyed on exit — no persistent state

## Gordon

Gordon is Docker's AI assistant that helps with Docker tasks — explaining concepts, writing Dockerfiles, debugging containers, and managing resources.

### Where to Use Gordon

| Surface | Access | Cost |
|---------|--------|------|
| Docker Desktop | Sidebar → Gordon | Counts against plan limits |
| CLI | `docker ai` | Counts against plan limits |
| Docker Hub | Gordon icon on repo pages | Free |
| docs.docker.com | Gordon icon on any page | Free |

### Prerequisites

- Docker Desktop 4.74 or later
- Signed in to Docker account
- For org/Business: admin must enable Gordon via Settings Management

### Quick Start

```bash
# CLI — opens Terminal User Interface (TUI)
docker ai

# Ask a question
docker ai "what containers are running?"

# Review proposed actions and approve with 'y'
```

### Examples

```bash
# Container inspection
docker ai "show me logs from my nginx container"

# Dockerfile review
docker ai "review my Dockerfile for best practices"

# Image management
docker ai "list my local images and their sizes"

# Debug a failing container
docker ai "why is my web container exiting?"

# Write a Dockerfile
docker ai "write a Dockerfile for a Node.js Express app"

# Compose help
docker ai "create a docker-compose.yml for postgres and redis"

# Cleanup
docker ai "remove all stopped containers and dangling images"
```

### Permissions

```bash
# Gordon asks for approval before every action by default
# Approve individual actions: type 'y'
# Allow all for session: type 'a'
# Deny: type 'n'

# Configure auto-approve (in Docker Desktop settings)
# Settings → Gordon → Auto-approve → Enable
```

### What Gordon Can Do

- **Explain**: Docker concepts, commands, error messages
- **Search**: Docker documentation and web resources
- **Write**: Dockerfiles following best practices
- **Debug**: Read container logs, propose fixes
- **Manage**: Start/stop/remove containers, images, volumes, networks
- **Review**: Analyze Dockerfiles for optimization and security

## Docker Agent

Docker Agent is an open-source multi-agent framework for building, orchestrating, and sharing teams of AI agents that work together.

### Installation

```bash
# Included in Docker Desktop 4.63+
# For standalone use:

# macOS
brew install docker-agent

# Windows
winget install Docker.Agent

# Linux — download from GitHub releases
# https://github.com/docker/docker-agent/releases

# Install as Docker CLI plugin
cp docker-agent ~/.docker/cli-plugins/

# Verify
docker agent --help
```

### Agent Team Configuration

```yaml
# debugger.yaml — two-agent team for bug fixing
agents:
  root:
    model: openai/gpt-5-mini
    description: Bug investigator
    instruction: |
      Analyze error messages, stack traces, and code to find bug root causes.
      Explain what's wrong and why it's happening.
      Delegate fix implementation to the fixer agent.
    sub_agents: [fixer]
    toolsets:
      - type: filesystem
      - type: mcp
        ref: docker:duckduckgo

  fixer:
    model: anthropic/claude-sonnet-4-5
    description: Fix implementer
    instruction: |
      Write fixes for bugs diagnosed by the investigator.
      Make minimal, targeted changes and add tests to prevent regression.
    toolsets:
      - type: filesystem
      - type: shell
```

### Running Agent Teams

```bash
# Set API keys for model providers
export ANTHROPIC_API_KEY=<your_key>
export OPENAI_API_KEY=<your_key>
export GOOGLE_API_KEY=<your_key>

# Run an agent team
docker agent run debugger.yaml

# Run with a specific prompt
docker agent run debugger.yaml "fix the TypeError in src/api.py"

# List available agent configurations
docker agent ls
```

### How It Works

```
┌─────────────────────────────────────┐
│         Agent Team                   │
│                                      │
│  ┌──────────┐                       │
│  │  Root    │  ← user interacts     │
│  │  Agent   │                       │
│  └────┬─────┘                       │
│       │ delegates                    │
│  ┌────┴─────┐  ┌──────────┐        │
│  │  Fixer   │  │  Helper  │        │
│  │  Agent   │  │  Agent   │        │
│  └──────────┘  └──────────┘        │
│                                      │
│  Each agent has:                     │
│  - Own model & parameters           │
│  - Own context (no shared memory)   │
│  - Built-in tools (todo, memory)    │
│  - MCP server tools                 │
│  - Sub-agent delegation             │
└─────────────────────────────────────┘
```

### Configuration Reference

```yaml
# Full agent configuration structure
agents:
  root:
    model: claude-sonnet-4-0          # model identifier
    description: Brief role summary    # short description
    instruction: |                     # detailed system prompt
      Detailed instructions for this agent...
    sub_agents: [helper, researcher]   # agents this can delegate to
    toolsets:
      - type: filesystem              # file access
      - type: shell                   # shell command execution
      - type: mcp                     # MCP server tools
        ref: docker:duckduckgo
    model_settings:
      context_limit: 200000
      temperature: 0.7

  helper:
    model: gpt-5-mini
    description: Specialist agent
    instruction: |
      Instructions for the helper agent...
    toolsets:
      - type: filesystem
```

### Sharing Agent Teams

```bash
# Package and push to registry (OCI artifact)
docker agent share push ./debugger.yaml myusername/debugger

# Pull a shared agent team
docker agent share pull myusername/debugger

# Works with Docker Hub or any OCI-compatible registry
# Repository is auto-created on push if it doesn't exist
```

### Toolsets

```yaml
# Available toolset types:
toolsets:
  # Filesystem — read/write files in workspace
  - type: filesystem

  # Shell — execute shell commands
  - type: shell

  # MCP — connect to MCP servers via Docker MCP Gateway
  - type: mcp
    ref: docker:duckduckgo        # search the web
  - type: mcp
    ref: docker:github            # GitHub operations
  - type: mcp
    ref: docker:filesystem        # advanced file ops
```

### Integration

```bash
# Use Docker Agent as a tool in MCP clients
# (e.g., Claude Desktop, Cursor, Windsurf)
# See: https://docs.docker.com/ai/docker-agent/tools/mcp/

# Editor integration via ACP (Agent Communication Protocol)
# See: https://docs.docker.com/ai/docker-agent/features/acp/

# Browse example configurations
# https://github.com/docker/docker-agent/tree/main/examples
```
