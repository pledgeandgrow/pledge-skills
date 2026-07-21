# Terraform — CLI Commands

## CLI Overview

The Terraform CLI manages configuration, plugins, infrastructure, and state. Use `-help` with any subcommand for details.

### Global options

```bash
terraform -chdir=environments/production apply
terraform -help
terraform -version
```

### Switching working directory with -chdir

```bash
terraform -chdir=environments/production apply
```

- `path.cwd` refers to the original working directory
- `path.root` refers to the root module directory
- CLI Configuration is processed before `-chdir`

### Shell tab-completion

```bash
terraform -install-autocomplete    # Install for bash/zsh
terraform -uninstall-autocomplete  # Remove
```

---

## Core Commands

### terraform init

Initialize a working directory containing Terraform configuration files.

```bash
terraform init
terraform init -upgrade              # Upgrade providers/modules
terraform init -backend-config=backend.hcl  # Partial backend config
terraform init -reconfigure          # Reconfigure backend
terraform init -migrate-state        # Migrate state to new backend
```

What it does:
- Downloads and installs providers
- Initializes configured backend
- Downloads and installs modules
- Creates `.terraform/` directory

### terraform plan

Create an execution plan.

```bash
terraform plan
terraform plan -out=tfplan          # Save plan to file
terraform plan -destroy             # Plan for destruction
terraform plan -var="env=prod"      # Set variable
terraform plan -var-file=prod.tfvars # Load variable file
terraform plan -refresh=false       # Skip state refresh
terraform plan -target=aws_instance.web  # Target specific resource
```

Exit codes:
- `0` — Success, plan is empty or all changes are safe
- `1` — Error
- `2` — Success, but there are changes to apply

### terraform apply

Apply changes to reach the desired state.

```bash
terraform apply
terraform apply tfplan               # Apply saved plan
terraform apply -auto-approve        # Skip approval prompt
terraform apply -var="env=prod"
terraform apply -var-file=prod.tfvars
terraform apply -target=aws_instance.web
terraform apply -parallelism=10      # Parallel resource operations
```

### terraform destroy

Destroy all resources managed by the configuration.

```bash
terraform destroy
terraform destroy -auto-approve
terraform destroy -target=aws_instance.web
```

### terraform validate

Validate configuration files for syntax and internal consistency.

```bash
terraform validate
```

Checks:
- HCL syntax
- Resource type and argument validity
- Variable references
- Module references

### terraform fmt

Format configuration files to canonical format.

```bash
terraform fmt                        # Format files in current directory
terraform fmt -recursive             # Format all subdirectories
terraform fmt -check                 # Check if files are formatted (exit code)
terraform fmt -diff                  # Show diff of changes
terraform fmt -write=false           # Don't write changes
```

---

## State Management Commands

### terraform state

Advanced state management.

```bash
terraform state list                          # List all resources
terraform state list aws_instance.*           # List matching resources
terraform state show aws_instance.web         # Show resource details
terraform state mv aws_instance.web aws_instance.app  # Rename resource
terraform state rm aws_instance.web           # Remove from state (keep real resource)
terraform state pull                          # Pull state to stdout
terraform state push tfstate                  # Push state file
terraform state replace-provider registry.terraform.io/hashicorp/aws registry.terraform.io/myorg/aws
```

### terraform import

Import existing infrastructure into Terraform state.

```bash
terraform import aws_instance.web i-1234567890abcdef0
terraform import aws_s3_bucket.data my-bucket-name
```

### terraform taint

Mark a resource as tainted (will be destroyed and recreated on next apply).

```bash
terraform taint aws_instance.web
```

### terraform untaint

Remove the tainted state from a resource.

```bash
terraform untaint aws_instance.web
```

---

## Resource Targeting

```bash
terraform plan -target=aws_instance.web
terraform plan -target=module.vpc
terraform apply -target=aws_instance.web -target=aws_s3_bucket.data
```

Use for:
- Isolated changes to specific resources
- Recovering from errors
- Quick fixes

**Caution**: Not recommended for routine use. Can cause state drift.

---

## Workspaces

Workspaces allow multiple state files for the same configuration.

```bash
terraform workspace new staging       # Create and switch to new workspace
terraform workspace select staging    # Switch to existing workspace
terraform workspace list              # List all workspaces
terraform workspace show              # Show current workspace
terraform workspace delete staging    # Delete workspace
```

Reference current workspace in configuration:
```hcl
terraform.workspace
```

Use case:
```hcl
resource "aws_instance" "web" {
  count = terraform.workspace == "prod" ? 3 : 1
}
```

---

## Other Commands

### terraform output

Read output values from state.

```bash
terraform output                      # All outputs
terraform output instance_id          # Specific output
terraform output -json                # JSON format
terraform output -raw instance_id     # Raw string (no quotes)
```

### terraform console

Interactive console for evaluating expressions.

```bash
terraform console
> aws_instance.web.id
> upper("hello")
> cidrsubnet("10.0.0.0/16", 8, 1)
```

### terraform graph

Generate a visual graph of Terraform resources.

```bash
terraform graph
terraform graph -type=plan
terraform graph | dot -Tpng > graph.png
```

### terraform login / logout

Authenticate with HCP Terraform or Terraform Enterprise.

```bash
terraform login                       # Login to app.terraform.io
terraform login terraform.example.com # Login to private Terraform Enterprise
terraform logout
```

### terraform force-unlock

Release a locked state.

```bash
terraform force-unlock <LOCK_ID>
```

### terraform refresh

Update state to match real-world resources (deprecated in favor of `plan -refresh`).

```bash
terraform refresh
```

### terraform test

Run configuration tests (Terraform 1.6+).

```bash
terraform test
terraform test -test-directory=tests
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TF_VAR_<name>` | Set input variable value |
| `TF_LOG` | Logging level (TRACE, DEBUG, INFO, WARN, ERROR) |
| `TF_LOG_PATH` | Log file location |
| `TF_PLUGIN_CACHE_DIR` | Provider plugin cache directory |
| `TF_CLI_ARGS` | Additional CLI arguments |
| `TF_CLI_ARGS_init` | Additional args for `init` command |
| `TF_CLI_ARGS_plan` | Additional args for `plan` command |
| `TF_CLI_ARGS_apply` | Additional args for `apply` command |
| `TF_INPUT` | Enable/disable interactive prompts (0/1) |
| `TF_DATA_DIR` | Data directory (default: `.terraform`) |
| `TF_WORKSPACE` | Select workspace |
| `TF_IN_AUTOMATION` | Hint that Terraform runs in automation |

---

## Upgrade and Security Bulletin Checks

Terraform checks for security bulletins and new versions during `terraform init` and `terraform plan`. Use `TF_SKIP_SECURITY_BULLETIN_CHECK=1` to disable.

**Source**: [CLI Overview](https://developer.hashicorp.com/terraform/cli/commands) | [CLI Documentation](https://developer.hashicorp.com/terraform/cli)
