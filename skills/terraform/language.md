# Terraform — Configuration Language

## About the Terraform Language

The main purpose of the Terraform language is declaring **resources**, which represent infrastructure objects. All other language features exist to make the definition of resources more flexible and convenient.

A Terraform configuration is a complete document that tells Terraform how to manage a given collection of infrastructure. It can consist of multiple files and directories.

### Syntax Overview

```hcl
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}
```

Structure:
- `<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" { ... }`
- Block body contains arguments: `<IDENTIFIER> = <EXPRESSION>`

The language is **declarative** — it describes an intended goal rather than the steps to reach it. The ordering of blocks and files is generally not significant.

### Arguments and Blocks

**Arguments** assign a value to a name:
```hcl
image_id = "abc123"
```

**Blocks** are containers for other content:
```hcl
resource "aws_instance" "example" {
  ami = "abc123"
  network_interface {
    # ...
  }
}
```

A block has a type (e.g., `resource`), zero or more labels, and a body delimited by `{` and `}`.

### Identifiers and Comments

- Identifiers: letters, digits, underscores, hyphens
- Comments: `#` (single line), `//` (single line), `/* */` (block)
- Character encoding: UTF-8

---

## Resources

A resource is any infrastructure object you want to create and manage. The `resource` block defines a resource:

```hcl
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t2.micro"
}
```

### Resource behavior on apply

- **Create** resources that don't exist yet
- **Destroy** resources in state but not in configuration
- **Update in place** if arguments changed and can be updated
- **Destroy and re-create** if arguments changed but cannot be updated in-place
- **Update state** so configuration, real infrastructure, and state match

### Meta-arguments

- `count` — Create multiple instances by count
- `for_each` — Create multiple instances by map/set
- `provider` — Select a non-default provider configuration
- `lifecycle` — Customize lifecycle behavior (`create_before_destroy`, `prevent_destroy`, `ignore_changes`, `replace_triggered_by`)
- `depends_on` — Explicit dependencies

### Resource addressing

```hcl
aws_instance.web            # Resource
aws_instance.web[0]         # Resource with count
aws_instance.web["name"]    # Resource with for_each
```

### Data sources

Data sources fetch data from providers without creating resources:

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

resource "aws_instance" "web" {
  ami = data.aws_ami.ubuntu.id
}
```

---

## Input Variables

Input variables parameterize configurations, making them reusable.

### Defining variables

```hcl
variable "instance_type" {
  type        = string
  description = "EC2 instance type for the web server"
  default     = "t2.micro"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the web server will be deployed"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```

### Variable arguments

| Argument | Description |
|----------|-------------|
| `type` | Type constraint (string, number, bool, list, map, set, object, tuple) |
| `default` | Default value |
| `description` | Human-readable description |
| `sensitive` | Prevents value from being displayed in CLI output |
| `ephemeral` | Omits variable from state and plan files |
| `validation` | Custom validation rules |
| `nullable` | Whether null is a valid value |

### Referencing variables

```hcl
var.instance_type
var.subnet_id
var.environment
```

### Assigning values to variables

**Precedence (highest to lowest):**
1. `-var` and `-var-file` CLI options / HCP Terraform variables
2. `*.auto.tfvars` and `*.auto.tfvars.json` files (lexical order)
3. `terraform.tfvars.json`
4. `terraform.tfvars`
5. Environment variables (`TF_VAR_<name>`)
6. `default` argument

### CLI variables
```bash
terraform apply -var="instance_type=t3.medium" -var="environment=prod"
terraform apply -var='subnet_ids=["subnet-12345","subnet-67890"]'
```

### Variable definition files
```hcl
# production.auto.tfvars
instance_type = "t3.large"
environment   = "prod"
subnet_ids    = ["subnet-12345", "subnet-67890", "subnet-abcdef"]
```

### Environment variables
```bash
export TF_VAR_instance_type="t3.medium"
export TF_VAR_complex_config='{"key": "value", "list": ["a", "b"]}'
```

---

## Output Values

Output values expose information about your infrastructure.

```hcl
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.web.private_ip
  sensitive   = true
}
```

### Accessing outputs

- **Root module**: Displayed in CLI after `terraform apply`
- **HCP Terraform**: Listed on workspace overview page
- **Child module**: Accessed via `module.<name>.<output_name>`

---

## Local Values

Local values assign names to expressions for reuse within a module:

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Owner       = "team-${var.team_name}"
  }
  instance_count = var.environment == "prod" ? 3 : 1
}

resource "aws_instance" "web" {
  count         = local.instance_count
  tags          = local.common_tags
}
```

---

## Providers

Providers are plugins that offer resource types and data sources for a specific platform.

### Provider requirements

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}
```

### Provider configuration

```hcl
provider "aws" {
  region = var.aws_region
}

# Multiple provider configurations
provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

provider "aws" {
  alias  = "east"
  region = "us-east-1"
}
```

### Provider sources

- **Terraform Registry**: `hashicorp/aws`, `hashicorp/azurerm`, etc.
- **Private Registry**: HCP Terraform private registry for internal providers
- **Local paths**: File system-based providers

### Dependency lock file

`.terraform.lock.hcl` pins provider versions for reproducible installs:

```hcl
provider "registry.terraform.io/hashicorp/aws" {
  version     = "5.40.0"
  constraints = "~> 5.0"
  hashes = [
    "h1:...",
  ]
}
```

---

## Modules

Modules are containers for multiple resources used together. Every Terraform configuration has a root module. Modules called via `module` blocks are child modules.

### Module blocks

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  cidr_vpc            = "10.0.0.0/16"
  enable_dns_support  = true
}
```

### Module sources

- **Terraform Registry**: `terraform-aws-modules/vpc/aws`
- **Local paths**: `./modules/vpc`
- **VCS repositories**: `git::https://github.com/example/vpc.git`
- **HCP Terraform private registry**: For internal modules

### Module hierarchy

- Root module calls child modules
- Child modules can call nested child modules
- Each `module` block creates a separate instance

### Module development best practices

- Use input variables for configuration
- Use outputs to expose useful data
- Keep modules focused on a single responsibility
- Version your modules
- Use `terraform validate` and tests

---

## State

Terraform uses state to map real-world resources to your configuration, track metadata, and improve performance.

### Storing state

- **Default**: Local file `terraform.tfstate` with backup `terraform.tfstate.backup`
- **Recommended**: Remote backend (S3, GCS, Azure Blob, HCP Terraform) for collaboration
- **Avoid**: VCS storage (no locking, secrets exposure risk)

### State inspection and modification

```bash
terraform state list              # List resources in state
terraform state show <address>    # Show resource details
terraform state mv <src> <dst>    # Move/rename resource
terraform state rm <address>      # Remove resource from state
terraform state pull              # Pull state to local file
terraform state push              # Push state file
```

### Importing existing resources

```bash
terraform import aws_instance.web i-1234567890abcdef0
```

### State format

State is stored as JSON. Do not edit directly — use `terraform state` commands.

---

## Backends

Backends determine where Terraform stores state and how it runs operations.

### Backend configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### Backend types

| Backend | State storage | Locking |
|---------|--------------|---------|
| `local` | Local file | No |
| `s3` | AWS S3 | Yes (DynamoDB) |
| `gcs` | Google Cloud Storage | Yes |
| `azurerm` | Azure Blob Storage | Yes |
| `remote` | HCP Terraform | Yes |
| `consul` | HashiCorp Consul | Yes |
| `http` | HTTP endpoint | Depends |
| `pg` | PostgreSQL | Yes |

### Backend limitations

- Only one backend block per configuration
- Backend block cannot refer to named values (variables, locals, data sources)
- Cannot reference backend values elsewhere in configuration

### Initializing backends

```bash
terraform init          # Initialize with backend config in .tf files
terraform init -backend-config=backend.hcl  # Partial configuration
```

### Credentials

Use environment variables for credentials. Do not hardcode in configuration — Terraform writes backend config in plain text in `.terraform/terraform.tfstate`.

---

## The terraform block

The top-level `terraform` block configures Terraform behavior:

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }

  experiments = [example_feature]
}
```

### Cloud block (HCP Terraform)

```hcl
terraform {
  cloud {
    organization = "example_corp"
    workspaces {
      name = "my-app-prod"
    }
  }
}
```

**Source**: [Configuration Language](https://developer.hashicorp.com/terraform/language) | [Resources](https://developer.hashicorp.com/terraform/language/resources) | [Variables](https://developer.hashicorp.com/terraform/language/values/variables) | [Outputs](https://developer.hashicorp.com/terraform/language/values/outputs) | [Providers](https://developer.hashicorp.com/terraform/language/providers) | [Modules](https://developer.hashicorp.com/terraform/language/modules) | [State](https://developer.hashicorp.com/terraform/language/state) | [Backends](https://developer.hashicorp.com/terraform/language/backend) | [Data Sources](https://developer.hashicorp.com/terraform/language/data-sources)
