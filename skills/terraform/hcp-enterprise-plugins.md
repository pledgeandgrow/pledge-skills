# Terraform — HCP Terraform, Enterprise, Plugin Development & Registry

## HCP Terraform

HCP Terraform is an application that helps teams use Terraform together, with version control, state sharing, governance, and more.

### Key Features

- **Remote operations** — Run Terraform in a consistent, reliable environment
- **Version control integration** — Connect workspaces to VCS repos for automatic runs
- **Shared state management** — Secure, centralized state storage
- **Variable sets** — Reusable variable groups across workspaces
- **Private registry** — Share modules and providers within your organization
- **Role-based access control** — Manage permissions for teams and users
- **Sentinel policy enforcement** — Codified compliance checks
- **Run tasks** — Integrate with external tools during run lifecycle
- **Cost estimation** — Estimate cloud costs before applying changes
- **Notifications** — Slack, email, webhook notifications for run events

### Workspaces

A workspace is the core unit in HCP Terraform. Each workspace contains:
- Terraform configuration (from VCS or uploaded)
- State file (managed remotely)
- Variables (workspace-specific and variable sets)
- Run history and logs
- Access controls

### Workspace variables

- **Terraform variables** — Map to `var.*` in configuration
- **Environment variables** — Set in the execution environment (e.g., `AWS_ACCESS_KEY_ID`)
- **Variable sets** — Shared across multiple workspaces
- **Sensitive variables** — Encrypted, write-only

### VCS integration

Connect workspaces to GitHub, GitLab, Bitbucket, or Azure DevOps:
- Automatic runs on PRs and merges
- Speculative plans on PRs
- Trigger patterns for file paths

### Policy enforcement

HCP Terraform supports three policy frameworks:

- **Terraform policy (beta)** — Native HCL-based policy framework
- **Sentinel** — HashiCorp's policy-as-code framework (recommended)
- **OPA** — Open Policy Agent with Rego language

#### Sentinel policies

```sentinel
import "tfplan/v2" as tfplan

main = rule {
    all tfplan.resource_changes as _, rc {
        rc.type is not "aws_instance" or
        rc.change.after.instance_type in ["t3.micro", "t3.small"]
    }
}
```

#### Policy workflow

1. Create a policy set (linked to VCS or uploaded)
2. Attach policy set to workspaces or projects
3. Policies run automatically during plan
4. Review policy results in the run UI
5. Soft mandatory policies can be overridden by authorized users
6. Hard mandatory policies cannot be overridden

### Projects

Projects let you organize workspaces into groups. Available on HCP Terraform Essentials, Standard, and Premium editions.

- Assign project-level permissions to scope access
- Group workspaces by business unit or responsibility
- Project-owned variable sets share variables across workspaces within a project

### Users, teams, and organizations

- **Organizations** — Top-level entity in HCP Terraform
- **Teams** — Groups of users within an organization; assigned permissions to workspaces
- **Users** — Individual accounts; can belong to multiple teams
- **RBAC** — Role-based access control for workspaces, projects, and organizations
- **API tokens** — User tokens, team tokens, organization tokens, audit trail tokens

### Run tasks

Integrate external tools at specific run stages:
- Pre-plan — After plan, before apply
- Post-plan — After plan completion
- Pre-apply — Before apply
- Post-apply — After apply

### Variable precedence

HCP Terraform resolves conflicting variables in this order (highest to lowest):

1. Priority global variable sets
2. Priority project-scoped variable set owned by an organization
3. Priority workspace-scoped variable set owned by an organization
4. Priority project-scoped variable set owned by a project
5. Priority workspace-scoped variable set owned by a project
6. Command line argument variables
7. Local environment variables prefixed with `TF_VAR_`
8. Workspace-specific variables
9. Workspace-scoped variable owned by a project
10. Project-scoped variable set owned by a project
11. Workspace-scoped variable set owned by an organization
12. Project-scoped variable set owned by an organization
13. Global variable sets
14. `*.auto.tfvars` variable files
15. `terraform.tfvars` variable file

### HCP Terraform API

REST API for automating HCP Terraform operations.

#### Authentication

All requests require a bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Token types:
- **User tokens** — Per-user, for personal API access
- **Team tokens** — Per-team, for CI/CD pipelines (plans and applies)
- **Organization tokens** — Per-organization, for automating team/workspace management (cannot perform plans/applies)
- **Audit trail tokens** — Read-only audit trail access

#### API features

- **Response codes** — Standard HTTP status codes; 401 for auth failures, 404 for forbidden with valid token
- **Versioning** — API versioned via URL paths
- **Pagination** — List endpoints support pagination with `page[number]` and `page[size]`
- **Rate limits** — Requests are rate-limited; some endpoints have lower limits
- **JSON API formatting** — Follows JSON API specification for request/response bodies
- **Client libraries** — Go client (`go-tfe`), TypeScript client, and community libraries

### CLI integration with HCP Terraform

Use the `cloud` block in configuration to connect Terraform CLI to HCP Terraform:

```hcl
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      name = "my-workspace"
    }
  }
}
```

CLI command flags specific to HCP Terraform:
- `-cloud-run` — Execute a run in HCP Terraform
- `terraform login` — Authenticate with HCP Terraform
- `terraform logout` — Remove stored credentials

### HCP Terraform in Europe

HCP Europe supports managing infrastructure with European data residency requirements. Resources are hosted, managed, and billed separately.

---

## Terraform Enterprise

Terraform Enterprise is a self-hosted distribution of HCP Terraform for organizations with strict security and compliance requirements.

### Key differences from HCP Terraform

- **Self-hosted** — Runs on your own infrastructure
- **Air-gapped** — Can operate without internet access
- **Custom TLS** — Full control over certificates
- **SAML SSO** — Enterprise identity provider integration
- **Audit logging** — Comprehensive audit trails

### Deployment options

- **Docker** — Single Docker container for evaluation
- **Kubernetes** — Helm chart for production
- **External services** — PostgreSQL, S3-compatible storage, Redis

---

## Plugin Development

Providers are plugins that connect Terraform to external services.

### How Terraform Core interacts with plugins

1. Terraform Core parses configuration
2. Core sends gRPC requests to provider plugins
3. Providers translate requests to API calls
4. Providers return results to Core
5. Core updates state

### Plugin SDKs and Libraries

| SDK | Description |
|-----|-------------|
| **Terraform Plugin Framework** | Modern SDK for new providers (recommended) |
| **Terraform Plugin SDKv2** | Legacy SDK for existing providers |
| **Terraform Plugin Go** | Low-level Go bindings |

### Plugin Framework (recommended for new providers)

```go
package main

import (
    "context"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/provider"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/types"
)

func main() {
    provider.Serve(...)
}
```

### Provider design principles

- **One resource per API object** — Map resources to API objects 1:1
- **Single source of truth** — Provider reflects API state
- **Predictable behavior** — Consistent naming, arguments, behavior
- **Idempotent operations** — Same input → same result
- **Clear error messages** — Actionable feedback

### Provider development workflow

1. Scaffold provider from template
2. Define resource schemas
3. Implement CRUD operations (Create, Read, Update, Delete)
4. Add data sources
5. Write acceptance tests
6. Generate documentation
7. Publish to registry

### Testing providers

```go
func TestAccExampleResource(t *testing.T) {
    resource.Test(t, resource.TestCase{
        PreCheck:                 func() { testAccPreCheck(t) },
        ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
        Steps: []resource.TestStep{
            {
                Config: testAccExampleResourceConfig,
                Check: resource.ComposeAggregateTestCheckFunc(
                    resource.TestCheckResourceAttr("example_resource.test", "name", "test"),
                ),
            },
        },
    })
}
```

---

## Terraform Registry

The Terraform Registry is the public directory of providers and modules.

### Publishing providers

1. **Build the provider binary** for all target platforms
2. **Create a GPG signing key** for verification
3. **Create a GitHub release** with provider binaries
4. **Configure the registry** to point to your repository
5. **Namespace**: `namespace/provider-name` (e.g., `hashicorp/aws`)

### Provider verification

- **Partner providers** — Verified by HashiCorp, get a badge
- **Community providers** — Created by community members
- **Archived providers** — No longer maintained

### Publishing modules

1. **Create a GitHub repository** named `terraform-<PROVIDER>-<NAME>`
2. **Add module files** — `main.tf`, `variables.tf`, `outputs.tf`, `README.md`
3. **Tag releases** with semantic versioning
4. **Registry auto-discovers** the repository

Module naming convention:
```
terraform-aws-vpc        # AWS VPC module
terraform-google-kubernetes-engine  # GCP GKE module
terraform-azurerm-virtual-network   # Azure VNet module
```

### Private registry

HCP Terraform and Terraform Enterprise include a private registry for sharing:
- Internal modules
- Internal providers
- Versioned and access-controlled

### Registry usage in configuration

```hcl
# Public provider from registry
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Public module from registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
}

# Private module from HCP Terraform
module "internal_vpc" {
  source  = "app.terraform.io/example-corp/vpc/aws"
  version = "1.0.0"
}
```

---

## Module Development

### Module structure

```
modules/vpc/
├── main.tf          # Resource definitions
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── versions.tf      # Provider/version requirements
├── README.md        # Documentation
└── examples/        # Usage examples
    └── basic/
        └── main.tf
```

### Best practices

- **Version constraints** — Always pin provider versions
- **Input validation** — Use `validation` blocks on variables
- **Outputs** — Expose all useful attributes
- **Description** — Document every variable and output
- **Examples** — Include runnable examples
- **Testing** — Use `terraform test` or Terratest
- **Semantic versioning** — Use `v1.0.0` format for releases
- **Standard structure** — Follow the module structure convention

### Refactoring modules

Use `moved` blocks to preserve resources when restructuring:

```hcl
moved {
  from = aws_instance.web
  to   = module.web.aws_instance.main
}
```

**Source**: [HCP Terraform](https://developer.hashicorp.com/terraform/cloud-docs) | [Workspaces](https://developer.hashicorp.com/terraform/cloud-docs/workspaces) | [Variables](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/variables) | [Policy Enforcement](https://developer.hashicorp.com/terraform/cloud-docs/policy-enforcement) | [Private Registry](https://developer.hashicorp.com/terraform/cloud-docs/registry) | [API Docs](https://developer.hashicorp.com/terraform/cloud-docs/api-docs) | [CLI Cloud Integration](https://developer.hashicorp.com/terraform/cli/cloud) | [Plugin Development](https://developer.hashicorp.com/terraform/plugin) | [Terraform Enterprise](https://developer.hashicorp.com/terraform/enterprise) | [Registry](https://registry.terraform.io/)
