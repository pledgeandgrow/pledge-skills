# Terraform — Advanced Topics

## Provisioners

Provisioners run commands and scripts on local or remote machines after resource creation or destruction. **Use provisioners only as a last resort** — Terraform cannot model their behavior predictably.

### Built-in provisioners

| Provisioner | Description |
|-------------|-------------|
| `local-exec` | Run commands on the machine running Terraform |
| `remote-exec` | Run commands on a remote resource via SSH/WinRM |
| `file` | Upload files to a remote resource |

### local-exec

```hcl
resource "aws_instance" "web" {
  # ...

  provisioner "local-exec" {
    command = "echo The server's IP address is ${self.private_ip}"
  }
}
```

### remote-exec

```hcl
resource "aws_instance" "web" {
  # ...

  connection {
    type     = "ssh"
    user     = "root"
    password = var.root_password
    host     = self.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "yum install -y nginx",
      "systemctl start nginx",
    ]
  }
}
```

### file provisioner

```hcl
resource "aws_instance" "web" {
  # ...

  connection {
    type     = "ssh"
    user     = "root"
    password = var.root_password
    host     = self.public_ip
  }

  provisioner "file" {
    source      = "conf/nginx.conf"
    destination = "/etc/nginx/nginx.conf"
  }
}
```

### Connection block

Required for `remote-exec` and `file` provisioners:

```hcl
connection {
  type        = "ssh"          # or "winrm"
  user        = "root"
  password    = var.root_password
  host        = self.public_ip
  port        = 22
  private_key = file("~/.ssh/id_rsa")
  # For bastion host:
  # bastion_host = "bastion.example.com"
  # bastion_user = "bastion"
  # For proxy:
  # proxy_scheme = "socks5"
  # proxy_host   = "proxy.example.com"
  # proxy_port   = 1080
}
```

### When provisioners run

- **Creation-time** (default) — Runs after resource creation. On failure, resource is tainted.
- **Destroy-time** — Set `when = destroy`. Runs before resource destruction.

```hcl
provisioner "local-exec" {
  when    = destroy
  command = "echo 'Destroying resource'"
}
```

### Failure behavior

```hcl
provisioner "local-exec" {
  command     = "echo ${self.private_ip}"
  on_failure  = continue  # or "fail" (default)
}
```

### Multiple provisioners

Executed in order defined. Creation and destroy provisioners can be mixed:

```hcl
resource "aws_instance" "web" {
  provisioner "local-exec" { command = "echo first" }
  provisioner "local-exec" { command = "echo second" }
  provisioner "local-exec" {
    when    = destroy
    command = "echo cleanup"
  }
}
```

### Running provisioners without a resource

Use `terraform_data` resource:

```hcl
resource "terraform_data" "cluster" {
  triggers_replace = aws_instance.cluster[*].id

  connection {
    host = aws_instance.cluster[0].public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "bootstrap-cluster.sh ${join(" ", aws_instance.cluster[*].private_ip)}",
    ]
  }
}
```

### Destroy-time provisioner caveats

- If the resource block is removed from config, the destroy provisioner won't run
- Workaround: set `count = 0` first, apply, then remove the block
- Destroy provisioners don't run on tainted resources
- `create_before_destroy` prevents destroy-time provisioners from running

### Sensitive and ephemeral values

- **Sensitive** — Suppressed in log output
- **Ephemeral** — Not stored in state or plan files (Terraform v1.10+)

---

## Ephemeral Resources

Ephemeral resources have a unique lifecycle — Terraform does not store them in state or plan files. They are temporary, such as passwords or connections.

### ephemeral block

```hcl
ephemeral "random_password" "db_password" {
  length           = 16
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_db_instance" "example" {
  instance_class       = "db.t3.micro"
  allocated_storage    = "5"
  engine               = "postgres"
  username             = "example"
  password_wo          = ephemeral.random_password.db_password.result
  password_wo_version  = 1
}
```

### Write-only arguments

Managed resources can include write-only arguments (suffixed with `_wo`). These are only available during the current operation and are not stored in state or plan files.

```hcl
resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id          = aws_secretsmanager_secret.db_password.id
  secret_string_wo   = ephemeral.random_password.db_password.result
  secret_string_wo_version = 1
}
```

### Where ephemeral values can be referenced

- `locals` blocks
- `variable` blocks with `ephemeral` argument
- Child module `output` blocks with `ephemeral` argument
- Managed resource write-only arguments
- `ephemeral` blocks
- `provider` blocks
- `provisioner` and `connection` blocks

---

## Managing Sensitive Data

### sensitive argument

Redacts values from CLI output and HCP Terraform UI. Values are still stored in state.

```hcl
variable "database_password" {
  description = "Password for the database instance"
  type        = string
  sensitive   = true
}

output "connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_username}:${var.database_password}@${aws_db_instance.main.endpoint}/mydb"
  sensitive   = true
}
```

Terraform automatically treats expressions referencing sensitive variables/outputs as sensitive.

### ephemeral argument

Omits values from state and plan files entirely. Available at runtime only.

```hcl
variable "database_password" {
  description = "Password for the database instance"
  type        = string
  sensitive   = true
  ephemeral   = true
}
```

### State security best practices

- Store state remotely (not in VCS)
- Encrypt state at rest
- Use access controls to limit who can access state
- Use audit logs to track state access
- HCP Terraform encrypts state at rest with TLS in transit
- S3 backend supports encryption with `encrypt` option
- GCS backend supports customer-supplied/managed encryption keys

---

## terraform_remote_state Data Source

Retrieves root module output values from another Terraform state stored in a remote backend.

### Example (remote backend)

```hcl
data "terraform_remote_state" "vpc" {
  backend = "remote"
  config = {
    organization = "hashicorp"
    workspaces = {
      name = "vpc-prod"
    }
  }
}

resource "aws_instance" "foo" {
  subnet_id = data.terraform_remote_state.vpc.outputs.subnet_id
}
```

### Example (local backend)

```hcl
data "terraform_remote_state" "vpc" {
  backend = "local"
  config = {
    path = "..."
  }
}
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `backend` | Yes | The remote backend type |
| `workspace` | No | Terraform workspace (if backend supports workspaces) |
| `config` | No | Backend configuration (object) |
| `defaults` | No | Default output values if state is empty |

### Attributes

- `outputs` — Object containing all root-level outputs from remote state

### Alternative data sharing

Instead of `terraform_remote_state`, consider:
- **DNS records** — Share IP addresses/hostnames via DNS
- **Consul KV store** — Publish data accessible by Consul Template/Nomad
- **Kubernetes ConfigMaps** — Share data with pods
- **Explicit configuration stores** — Can be read by non-Terraform systems

---

## Testing (terraform test)

Terraform 1.6+ supports structured testing with `.tftest.hcl` or `.tftest.json` files.

### Test file structure

```hcl
# main.tftest.hcl

test {
  parallel = true
}

variables {
  bucket_prefix = "test"
}

run "first" {
  assert {
    condition     = aws_s3_bucket.bucket.bucket == "test-bucket"
    error_message = "S3 bucket name did not match expected"
  }
}

run "second" {
  assert {
    condition     = aws_s3_bucket.bucket.bucket == "test-bucket"
    error_message = "S3 bucket name did not match expected"
  }
}
```

### Run blocks

| Attribute | Description |
|-----------|-------------|
| `command` | `apply` (default) or `plan` |
| `plan_options` | Customize plan mode (`normal`, `refresh-only`, `replace`, `target`) |
| `variables` | Override variables for this run |
| `assert` | Assertion blocks with `condition` and `error_message` |
| `expect_failures` | List of checkable objects expected to fail |
| `state_key` | Control which internal state file to use |
| `parallel` | Run in parallel with other run blocks (default: `false`) |

### Assertions

```hcl
run "validate_bucket" {
  assert {
    condition     = output.bucket_name == "test_bucket"
    error_message = "Bucket name did not match expected"
  }
}
```

Assertions can reference:
- Any named values from the main configuration
- Outputs from current and previous run blocks

### Integration vs unit testing

- `command = apply` — Creates real infrastructure (integration test)
- `command = plan` — No infrastructure created (unit test)
- Mock provider data available since Terraform 1.7.0

### Expecting failures

```hcl
# main.tf
variable "input" {
  type = number
  validation {
    condition     = var.input % 2 == 0
    error_message = "must be even number"
  }
}

# input_validation.tftest.hcl
run "zero" {
  command = plan
  variables { input = 0 }
}

run "one" {
  command = plan
  variables { input = 1 }
  expect_failures = [var.input]
}
```

### Parallel execution

Set `parallel = true` in `test` block or individual `run` blocks:

```hcl
test {
  parallel = true
}

run "first" {
  # inherits parallel = true
}

run "second" {
  # inherits parallel = true
}

run "third" {
  parallel = false  # override
}
```

### Running tests

```bash
terraform test
terraform test -test-directory=tests
```

---

## Override Files

Override files merge additional settings into existing configuration objects. Files named `override.tf`, `override.tf.json`, or ending with `_override.tf`/`_override.tf.json` are loaded last.

### Example

**example.tf:**
```hcl
resource "aws_instance" "web" {
  instance_type = "t2.micro"
  ami           = "ami-408c7f28"
}
```

**override.tf:**
```hcl
resource "aws_instance" "web" {
  ami = "foo"
}
```

**Result (merged):**
```hcl
resource "aws_instance" "web" {
  instance_type = "t2.micro"
  ami           = "foo"
}
```

### Merging behavior

- Top-level blocks merge by matching block header (type + labels)
- Attribute arguments in override replace same-named arguments in original
- Nested blocks in override replace all blocks of the same type in original
- Nested block contents are not merged
- Multiple override files compound in lexicographical order

### Special merging rules

| Block type | Special behavior |
|------------|-----------------|
| `resource`/`data` | `lifecycle` merged argument-by-argument; `provisioner` blocks in override replace all original provisioners; `connection` block fully replaced |
| `variable` | Type/default interactions: changing type attempts to convert default; changing default must be compatible with original type |
| `output` | `depends_on` not allowed in override |
| `locals` | Merged value-by-value, ignoring which `locals` block defines them |
| `terraform` | `depends_on` not allowed in override |

---

## CLI Configuration File

Per-user CLI settings that apply across all Terraform working directories.

### File locations

- **Windows**: `terraform.rc` in `%APPDATA%` directory
- **Other systems**: `.terraformrc` in home directory
- **Override**: `TF_CLI_CONFIG_FILE` environment variable (file must match `*.tfrc`)

### Available settings

```hcl
plugin_cache_dir    = "$HOME/.terraform.d/plugin-cache"
disable_checkpoint  = true
disable_checkpoint_signature = true

credentials "app.terraform.io" {
  token = "xxxx.atlasv1.zzz"
}

provider_installation {
  filesystem_mirror {
    path = "/usr/local/terraform/providers"
  }
  direct {
    exclude = ["example.com/*/*"]
  }
}
```

| Setting | Description |
|---------|-------------|
| `credentials` | Credentials for HCP Terraform / Terraform Enterprise |
| `credentials_helper` | External helper for credential storage |
| `disable_checkpoint` | Disable upgrade/security bulletin checks |
| `disable_checkpoint_signature` | Disable anonymous ID for checkpoint |
| `plugin_cache_dir` | Shared plugin cache directory |
| `provider_installation` | Customize provider installation methods |

### Provider plugin cache

Enable shared plugin cache to avoid downloading the same provider multiple times:

```hcl
plugin_cache_dir = "$HOME/.terraform.d/plugin-cache"
```

Or via environment variable:
```bash
export TF_PLUGIN_CACHE_DIR="$HOME/.terraform.d/plugin-cache"
```

- Directory must already exist (Terraform won't create it)
- Not guaranteed concurrency-safe
- Terraform never deletes cached plugins (manual cleanup needed)
- Use forward slashes `/` on Windows in config file

### Provider installation methods

- **direct** — Download from origin registry (default)
- **filesystem_mirror** — Local filesystem mirror
- **network_mirror** — HTTP mirror
- **development_overrides** — For provider development (symlinks to local builds)

### Development overrides

```hcl
provider_installation {
  dev_overrides {
    "hashicorp/aws" = "/path/to/local/aws/provider"
  }
}
```

**Warning**: Development overrides bypass version checks and the dependency lock file. Only use during development.

---

## Style Guide

### Code style

- Run `terraform fmt` and `terraform validate` before committing
- Use `#` for comments (not `//` or `/* */`)
- Use nouns for resource names, don't include resource type in name
- Use underscores to separate words
- Wrap resource type and name in double quotes
- Define dependent resources after the resources they reference
- Include `type` and `description` for every variable
- Include `description` for every output
- Avoid overuse of variables and local values
- Always include a default provider configuration
- Use `count` and `for_each` sparingly

### File naming conventions

| File | Contents |
|------|----------|
| `backend.tf` | Backend configuration |
| `main.tf` | Resource and data source blocks |
| `outputs.tf` | Output blocks (alphabetical) |
| `providers.tf` | Provider blocks and configuration |
| `terraform.tf` | `terraform` block with `required_version` and `required_providers` |
| `variables.tf` | Variable blocks (alphabetical) |
| `locals.tf` | Local values |
| `override.tf` | Override definitions (use sparingly) |

For larger codebases, split by logical group: `network.tf`, `storage.tf`, `compute.tf`, etc.

### Resource naming

```hcl
# Bad
resource aws_instance webAPI-aws-instance {...}

# Good
resource "aws_instance" "web_api" {...}
```

### Resource parameter order

1. `count` or `for_each` (if present)
2. Resource-specific non-block parameters
3. Resource-specific block parameters
4. `lifecycle` block (if required)
5. `depends_on` (if required)

### Variable parameter order

1. `type`
2. `description`
3. `default` (optional)
4. `sensitive` (optional)
5. `validation` blocks

### .gitignore

**Do not commit:**
- `terraform.tfstate` and `terraform.tfstate.*` backup files
- `.terraform.tfstate.lock.info`
- `.terraform/` directory
- Saved plan files (`-out` flag output)
- `.tfvars` files with sensitive information

**Always commit:**
- All Terraform code files (`.tf`)
- `.terraform.lock.hcl` dependency lock file
- `.gitignore` file
- `README.md`

### Version pinning

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.34.0"
    }
  }
  required_version = ">= 1.7"
}
```

### Workflow best practices

- Pin Terraform, provider, and module versions
- Name module repos `terraform-<PROVIDER>-<NAME>` for registry
- Store local modules at `./modules/<module_name>`
- Use `tfe_outputs` data source or provider-specific data sources to share state
- Use dynamic provider credentials or a secrets manager (e.g., Vault)
- Write tests for modules
- Use policy enforcement (Sentinel) on HCP Terraform

### Linting

Use [TFLint](https://github.com/terraform-linters/tflint) for static code analysis and enforcing organization-specific rules.

---

## Import Blocks (Declarative Import)

Terraform 1.5+ supports declarative import via `import` blocks in configuration, as an alternative to the `terraform import` CLI command.

```hcl
import {
  to = aws_instance.example
  id = "i-1234567890abcdef0"
}

resource "aws_instance" "example" {
  # ... configuration matching the imported resource
}
```

### Import with for_each

```hcl
import {
  for_each = {
    "i-aaa" = "aws_instance.a"
    "i-bbb" = "aws_instance.b"
  }
  to = aws_instance.example
  id = each.key
}
```

### Generate config from import

```bash
terraform plan -generate-config-out=generated.tf
```

---

## Removed Blocks (Declarative State Removal)

Terraform 1.7+ supports declarative removal of resources from state without destroying the real infrastructure.

```hcl
removed {
  from = aws_instance.example

  lifecycle {
    destroy = false
  }
}
```

- `destroy = true` (default) — Destroy the real resource
- `destroy = false` — Only remove from state, keep real resource

---

## Check Blocks

Check blocks allow declarative condition checks that run during `plan` and `apply`.

```hcl
check "dns" {
  data "dns_a_record_set" "api" {
    host = "api.example.com"
  }

  assert {
    condition     = length(data.dns_a_record_set.api.addrs) > 0
    error_message = "DNS A record for api.example.com does not exist"
  }
}
```

- Check blocks can contain `data` blocks and `assert` blocks
- Assertions have `condition` and `error_message`
- Failures are reported as warnings during `plan` and errors during `apply`
- Can be used in testing with `expect_failures`

---

## terraform_data Resource

A built-in resource that implements the standard resource lifecycle but manages no real infrastructure. Useful for:

- Running provisioners without a real resource
- Triggering replacements via `triggers_replace`
- Holding arbitrary data via `input` argument

```hcl
resource "terraform_data" "bootstrap" {
  input = "bootstrap-data"

  triggers_replace = [
    aws_instance.web.id
  ]

  provisioner "local-exec" {
    command = "echo ${self.input}"
  }
}
```

**Source**: [Provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax) | [Ephemeral Resources](https://developer.hashicorp.com/terraform/language/resources/ephemeral) | [Sensitive Data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data) | [terraform_remote_state](https://developer.hashicorp.com/terraform/language/state/remote-state-data) | [Testing](https://developer.hashicorp.com/terraform/language/tests) | [Override Files](https://developer.hashicorp.com/terraform/language/files/override) | [CLI Configuration](https://developer.hashicorp.com/terraform/cli/config/config-file) | [Style Guide](https://developer.hashicorp.com/terraform/language/style)

---

## JSON Configuration Syntax

Terraform supports a JSON variant of its configuration language using `.tf.json` files. This is useful when generating configurations programmatically with systems that don't have an HCL library.

### Example

```json
{
  "resource": {
    "aws_instance": {
      "web": {
        "instance_type": "t2.micro",
        "ami": "ami-408c7f28"
      }
    }
  }
}
```

### Key differences from native syntax

- Blocks become JSON objects with the block type as key
- Labels become nested object keys
- Arguments become object properties
- No comments support
- Less human-readable; primarily for machine-generated configurations
- Both `.tf` and `.tf.json` files can coexist in the same directory

---

## Moved Blocks

The `moved` block (Terraform 1.1+) tells Terraform that a resource has moved to a new address in the configuration, without destroying and recreating it.

### Syntax

```hcl
moved {
  from = aws_instance.old_name
  to   = aws_instance.new_name
}
```

### Behavior

- Terraform updates the state to reflect the new address
- No resource destruction or creation occurs
- The `moved` block can be removed after all states have been updated
- Works across module boundaries: `from = module.old.a` to `to = module.new.a`

### Use cases

- Renaming resources without recreating them
- Moving resources between modules
- Refactoring module structure
- Splitting or merging modules

### Multiple moved blocks

```hcl
moved {
  from = aws_instance.web
  to   = aws_instance.web_server
}

moved {
  from = aws_instance.db
  to   = module.database.aws_instance.primary
}
```

---

## Module Composition

### Dependency inversion

Pass dependencies into modules rather than having modules create their own dependencies. This improves flexibility and reusability.

```hcl
# Instead of module creating its own VPC:
module "consul_cluster" {
  source     = "./modules/aws-consul-cluster"
  vpc_id     = data.aws_vpc.main.id
  subnet_ids = data.aws_subnet_ids.main.ids
}
```

### Conditional creation with count

```hcl
module "consul_cluster" {
  source = "./modules/aws-consul-cluster"
  count  = var.enable_consul ? 1 : 0
  # ...
}
```

### Multi-cloud abstractions

Use modules to abstract cloud-specific implementations behind a common interface:

```hcl
module "load_balancer" {
  source = var.cloud == "aws" ? "./modules/aws-lb" : "./modules/azure-lb"
  # ...
}
```

### Data-only modules

Modules that only contain data sources — no resources are created. Useful for sharing infrastructure information across configurations:

```hcl
module "network" {
  source      = "./modules/join-network-aws"
  environment = "production"
}

module "k8s_cluster" {
  source     = "./modules/aws-k8s-cluster"
  subnet_ids = module.network.aws_subnet_ids
}
```

Data-only modules can retrieve data via:
- Provider data sources (e.g., `aws_vpc`, `aws_subnet_ids`)
- Consul KV store (`consul_keys`)
- `terraform_remote_state` data source

---

## Files and Configuration Structure

### File extensions

- `.tf` — Native Terraform configuration files (HCL syntax)
- `.tf.json` — JSON variant of Terraform configuration
- `.tfvars` / `.tfvars.json` — Variable definition files
- `.terraform.lock.hcl` — Dependency lock file
- `.terraformrc` / `terraform.rc` — CLI configuration file

### Text encoding

- Configuration files must use **UTF-8** encoding
- Unix-style line endings (LF) preferred; Windows (CRLF) also accepted

### Directories and modules

- A module is a collection of `.tf` and/or `.tf.json` files in a single directory
- Only top-level files in a directory are part of that module
- Nested directories are separate modules (not automatically included)
- Terraform evaluates all files in a module as a single document
- Separating blocks into different files is purely for organization — no behavioral effect

### The root module

- Terraform always runs in the context of a single root module
- **Terraform CLI**: Root module is the working directory where Terraform is invoked
- **HCP Terraform / Enterprise**: Root module defaults to top level of configuration directory (VCS or upload), but workspace settings can specify a subdirectory
- A complete configuration = root module + tree of child modules

### Override files

Files named `override.tf`, `override.tf.json`, or ending with `_override.tf` / `_override.tf.json` are loaded last and merged into the configuration:

- `override.tf` and `override.tf.json` — processed first
- `*_override.tf` and `*_override.tf.json` — processed in lexicographical order after

### Dependency lock file

`.terraform.lock.hcl` records provider versions used. Always commit to version control. Prevents unintended provider upgrades.

**Source**: [Provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax) | [Ephemeral Resources](https://developer.hashicorp.com/terraform/language/resources/ephemeral) | [Sensitive Data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data) | [terraform_remote_state](https://developer.hashicorp.com/terraform/language/state/remote-state-data) | [Testing](https://developer.hashicorp.com/terraform/language/tests) | [Override Files](https://developer.hashicorp.com/terraform/language/files/override) | [CLI Configuration](https://developer.hashicorp.com/terraform/cli/config/config-file) | [Style Guide](https://developer.hashicorp.com/terraform/language/style) | [JSON Syntax](https://developer.hashicorp.com/terraform/language/syntax/json) | [Module Composition](https://developer.hashicorp.com/terraform/language/modules/develop/composition) | [Files Structure](https://developer.hashicorp.com/terraform/language/files) | [terraform_data](https://developer.hashicorp.com/terraform/language/resources/terraform-data)
