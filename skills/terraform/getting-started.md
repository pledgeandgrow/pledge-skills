# Terraform — Introduction & Getting Started

## What is Terraform?

Terraform is an infrastructure as code (IaC) tool that lets you build, change, and version cloud and on-prem resources safely and efficiently. It creates and manages resources on cloud platforms and other services through their APIs. Providers enable Terraform to work with virtually any platform or service with an accessible API.

### How Terraform Works

The core Terraform workflow consists of three stages:

1. **Write** — Define resources, which may span multiple cloud providers and services. For example, deploy an application on virtual machines in a VPC network with security groups and a load balancer.
2. **Plan** — Terraform creates an execution plan describing the infrastructure it will create, update, or destroy based on the existing infrastructure and your configuration.
3. **Apply** — On approval, Terraform performs the proposed operations in the correct order, respecting resource dependencies.

### Why Terraform?

- **Manage any infrastructure** — Find providers for many platforms in the Terraform Registry. Immutable infrastructure approach reduces complexity.
- **Track your infrastructure** — Terraform generates a plan and prompts for approval before modifying infrastructure. State file acts as source of truth.
- **Automate changes** — Declarative configuration describes end state. Terraform builds a resource graph to determine dependencies and creates non-dependent resources in parallel.
- **Standardize configurations** — Reusable modules define configurable collections of infrastructure, saving time and encouraging best practices.
- **Collaborate** — Configuration files can be committed to VCS. HCP Terraform provides secure access to shared state, role-based access controls, and private registries.

### Providers and the Registry

HashiCorp and the Terraform community have written thousands of providers. All publicly available providers are on the [Terraform Registry](https://registry.terraform.io/), including AWS, Azure, GCP, Kubernetes, Helm, GitHub, Splunk, DataDog, and many more.

---

## Use Cases

### Multi-Cloud Deployment
Provisioning infrastructure across multiple clouds increases fault-tolerance. Terraform lets you use the same workflow to manage multiple providers and handle cross-cloud dependencies.

### Application Infrastructure Deployment, Scaling, and Monitoring Tools
Use Terraform to manage Heroku application dependencies, Kubernetes clusters, and monitoring tools like Datadog.

### Self-Service Clusters
Codify software clusters into reusable modules. Operations teams can define standard configurations, and developers can self-serve infrastructure.

### Policy Compliance and Management
Enforce security and compliance policies using Sentinel or OPA with HCP Terraform.

### PaaS Application Setup
Deploy PaaS resources (Heroku, GoDaddy) and manage application lifecycle dependencies.

### Software Defined Networking
Interact with SDN systems like Cisco ACI, Juniper Contrail, and NSX-T.

### Kubernetes
Provision and manage Kubernetes clusters across cloud providers. Use the Kubernetes provider to manage cluster resources.

### Parallel Environments
Provision multiple environments (dev, staging, prod) with the same configuration, parameterized by variables.

### Software Demos
Spin up and tear down demo infrastructure quickly and reproducibly.

---

## Terraform vs. Alternatives

Terraform provides a flexible abstraction of resources and providers, from physical hardware and virtual machines to containers, email, and DNS providers.

### Terraform vs. Chef, Puppet, etc.
- **Terraform**: Declarative, infrastructure-focused, immutable infrastructure
- **Chef/Puppet**: Configuration management, procedural, mutable infrastructure
- Can be used together: Terraform provisions, Chef/Puppet configure

### Terraform vs. CloudFormation, Heat, etc.
- **Terraform**: Multi-cloud, HCL syntax, large provider ecosystem
- **CloudFormation**: AWS-only, JSON/YAML, deep AWS integration
- **Heat**: OpenStack-only

### Terraform vs. Boto, Fog, etc.
- **Terraform**: Declarative, state management, dependency resolution
- **Boto/Fog**: Imperative SDKs, no state management, manual orchestration

### Terraform vs. Custom Solutions
- **Terraform**: Mature, community-supported, consistent workflow
- **Custom**: Full control but high maintenance cost

---

## Phases of Terraform Adoption

### 1. Adopt
An individual practitioner establishes strong foundational practices that support future scale and make Terraform operations predictable and secure.

### 2. Collaborate
Multiple developers working on the same codebase. Solutions like remote state backends help ease collaboration and coordinate execution.

### 3. Scale
As Terraform usage expands across the organization, define boundaries of infrastructure ownership. Decide on cloud deployment strategy (single account, hybrid/multi-cloud, or divided by environment).

### 4. Govern
Enforce organization's standards and practices using codified, automated policy enforcement with Sentinel or OPA.

---

## Installing Terraform

### macOS
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

### Windows
```powershell
choco install terraform
```

### Linux
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Verify installation
```bash
terraform -version
```

---

## Quick Start

### 1. Create a configuration file

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-0c7217cdde317cfec"
  instance_type = "t2.micro"
}
```

### 2. Initialize

```bash
terraform init
```

Downloads and installs providers defined in the configuration.

### 3. Plan

```bash
terraform plan
```

Shows what Terraform will do without making changes.

### 4. Apply

```bash
terraform apply
```

Creates the infrastructure. Type `yes` to confirm.

### 5. Destroy

```bash
terraform destroy
```

Removes all resources managed by the configuration.

**Source**: [What is Terraform?](https://developer.hashicorp.com/terraform/intro) | [Use Cases](https://developer.hashicorp.com/terraform/intro/use-cases) | [Terraform vs Alternatives](https://developer.hashicorp.com/terraform/intro/vs) | [Phases of Adoption](https://developer.hashicorp.com/terraform/intro/phases)
