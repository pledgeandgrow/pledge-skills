---
name: terraform-docs
version: "1.15.x"
tags:
  - terraform
  - iac
  - infrastructure-as-code
  - hcl
  - providers
  - resources
  - modules
  - state
  - backends
  - variables
  - outputs
  - locals
  - expressions
  - functions
  - plan
  - apply
  - destroy
  - init
  - validate
  - fmt
  - import
  - workspace
  - hcp-terraform
  - terraform-enterprise
  - sentinel
  - plugin-development
  - terraform-registry
  - aws
  - azure
  - gcp
  - multi-cloud
  - declarative
  - automation
  - devops
  - provisioning
  - provisioners
  - local-exec
  - remote-exec
  - file-provisioner
  - ephemeral-resources
  - write-only-arguments
  - sensitive-data
  - terraform-remote-state
  - terraform-test
  - override-files
  - cli-configuration
  - terraformrc
  - style-guide
  - tflint
  - import-blocks
  - removed-blocks
  - check-blocks
  - terraform-data
  - hcp-api
  - hcp-projects
  - opa
  - rbac
  - variable-precedence
  - hcp-cli-integration
description: |
  Terraform 1.15.x — configuration language, resources, variables, modules, state, backends, providers, functions.
---

# Terraform

> **Version**: Latest (1.15.x) | **Source**: [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs)

## Overview

Terraform is an infrastructure as code (IaC) tool that lets you build, change, and version cloud and on-prem resources safely and efficiently. It uses a declarative configuration language (HCL) to describe infrastructure, supports multi-cloud providers, and manages state to track real-world resources.

## Quick Reference

| Topic | File | Key Content |
|-------|------|-------------|
| Getting Started | `getting-started.md` | What is Terraform, how it works (write/plan/apply), use cases (multi-cloud, Kubernetes, SDN, self-service), Terraform vs alternatives (Chef, CloudFormation, Boto), phases of adoption (adopt/collaborate/scale/govern), installation, quick start |
| Configuration Language | `language.md` | Syntax (blocks, arguments, expressions), resources (meta-arguments, lifecycle, data sources), input variables (types, defaults, validation, sensitive, precedence), output values, local values, providers (requirements, configuration, aliases, lock file), modules (sources, hierarchy, development), state (storage, inspection, import), backends (types, configuration, credentials), terraform block, cloud block |
| Expressions & Functions | `expressions-functions.md` | Types, literals, operators, references, conditional/for/splat/dynamic expressions, type constraints, version constraints, all built-in functions (numeric, string, collection, encoding, filesystem, date/time, hash/crypto, IP network, type conversion, Terraform-specific) |
| CLI Commands | `cli.md` | init, plan, apply, destroy, validate, fmt, state (list/show/mv/rm/pull/push), import, taint/untaint, targeting, workspaces, output, console, graph, login/logout, force-unlock, refresh, test, environment variables, upgrade/security checks |
| HCP, Enterprise & Plugins | `hcp-enterprise-plugins.md` | HCP Terraform (workspaces, VCS integration, Sentinel policies, run tasks, variable sets, private registry, Europe region), Terraform Enterprise (self-hosted, air-gapped, SAML SSO), plugin development (framework, SDKv2, design principles, testing), Terraform Registry (publishing providers/modules, private registry, naming conventions), module development (structure, best practices, refactoring with moved blocks) |
| Advanced Topics | `advanced.md` | Provisioners (local-exec, remote-exec, file, connection blocks, when/on_failure, terraform_data), ephemeral resources (ephemeral block, write-only arguments, reference restrictions), managing sensitive data (sensitive/ephemeral arguments, state security best practices), terraform_remote_state data source (arguments, attributes, alternatives), testing (.tftest.hcl files, run blocks, assertions, expect_failures, parallel execution, integration vs unit testing), override files (merging behavior, special rules per block type), CLI configuration file (.terraformrc/terraform.rc, settings, plugin cache, provider installation, development overrides), style guide (code style, file naming, resource naming, parameter order, .gitignore, version pinning, workflow best practices, linting with TFLint), import blocks (declarative import, for_each, generate-config-out), removed blocks (declarative state removal, destroy=false), check blocks (declarative condition checks, assertions), terraform_data resource |

## Core Concepts

- **Configuration** — Declarative HCL files describing infrastructure
- **Resource** — Infrastructure object managed by Terraform (e.g., `aws_instance`)
- **Provider** — Plugin that offers resource types for a specific platform
- **Data Source** — Read-only query of existing infrastructure data
- **Module** — Reusable collection of resources (root module, child modules)
- **State** — JSON file mapping configuration to real-world resources
- **Backend** — Where state is stored (local, S3, GCS, HCP Terraform, etc.)
- **Variable** — Input parameter for parameterizing configurations
- **Output** — Value exposed from a module for use by consumers
- **Expression** — Value computation (literals, references, operators, functions)
- **Function** — Built-in transformation (numeric, string, collection, etc.)
- **Workspace** — Multiple state files for the same configuration
- **Plan** — Execution plan showing what Terraform will do
- **Apply** — Execute changes to reach desired state
- **HCP Terraform** — Managed platform for team collaboration
- **Terraform Enterprise** — Self-hosted HCP Terraform
- **Registry** — Public directory of providers and modules
- **Sentinel** — Policy-as-code framework for compliance
- **Plugin Framework** — Modern SDK for developing providers
- **Provisioner** — Post-apply operations (local-exec, remote-exec, file)
- **Ephemeral Resource** — Temporary resource not stored in state or plan files
- **Write-only Argument** — Resource argument not persisted to state
- **Override File** — File that merges settings into existing configuration
- **Test File** — `.tftest.hcl` file for structured configuration testing
- **Import Block** — Declarative import of existing infrastructure
- **Removed Block** — Declarative removal of resources from state
- **Check Block** — Declarative condition checks during plan/apply
- **terraform_data** — Built-in resource with no real infrastructure
- **CLI Config** — `.terraformrc` for per-user CLI settings
- **Style Guide** — Recommended conventions for Terraform code

## Official Documentation Links

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [What is Terraform?](https://developer.hashicorp.com/terraform/intro)
- [Use Cases](https://developer.hashicorp.com/terraform/intro/use-cases)
- [Terraform vs Alternatives](https://developer.hashicorp.com/terraform/intro/vs)
- [Phases of Adoption](https://developer.hashicorp.com/terraform/intro/phases)
- [Configuration Language](https://developer.hashicorp.com/terraform/language)
- [Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Resources](https://developer.hashicorp.com/terraform/language/resources)
- [Input Variables](https://developer.hashicorp.com/terraform/language/values/variables)
- [Output Values](https://developer.hashicorp.com/terraform/language/values/outputs)
- [Providers](https://developer.hashicorp.com/terraform/language/providers)
- [Modules](https://developer.hashicorp.com/terraform/language/modules)
- [State](https://developer.hashicorp.com/terraform/language/state)
- [Backends](https://developer.hashicorp.com/terraform/language/backend)
- [Data Sources](https://developer.hashicorp.com/terraform/language/data-sources)
- [Expressions](https://developer.hashicorp.com/terraform/language/expressions)
- [Functions](https://developer.hashicorp.com/terraform/language/functions)
- [Terraform CLI](https://developer.hashicorp.com/terraform/cli)
- [CLI Commands](https://developer.hashicorp.com/terraform/cli/commands)
- [HCP Terraform](https://developer.hashicorp.com/terraform/cloud-docs)
- [Terraform Enterprise](https://developer.hashicorp.com/terraform/enterprise)
- [Plugin Development](https://developer.hashicorp.com/terraform/plugin)
- [Terraform Registry](https://registry.terraform.io/)
- [Provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax)
- [Ephemeral Resources](https://developer.hashicorp.com/terraform/language/resources/ephemeral)
- [Manage Sensitive Data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data)
- [terraform_remote_state](https://developer.hashicorp.com/terraform/language/state/remote-state-data)
- [Testing](https://developer.hashicorp.com/terraform/language/tests)
- [Override Files](https://developer.hashicorp.com/terraform/language/files/override)
- [CLI Configuration](https://developer.hashicorp.com/terraform/cli/config/config-file)
- [Style Guide](https://developer.hashicorp.com/terraform/language/style)
