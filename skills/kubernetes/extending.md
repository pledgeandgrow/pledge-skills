# Extending Kubernetes

Kubernetes provides multiple extension points to customize cluster behavior without modifying Kubernetes itself.

## Extension Points

1. **kubectl plugins** — customize client behavior
2. **API server access extensions** — authentication, authorization, admission control
3. **API extensions** — custom resources, API aggregation
4. **Scheduler extensions** — custom scheduling logic
5. **Controllers** — custom automation via controllers and operators
6. **Network plugins** (CNI) — pod networking implementations
7. **Device plugins** — custom hardware integration
8. **Storage plugins** (CSI) — new storage types
9. **Kubelet image credential provider plugins** — custom registry auth

## Configuration vs Extensions

- **Configuration**: command-line flags and config files for built-in components (kube-apiserver, kube-controller-manager, kube-scheduler, kubelet, kube-proxy). Usually only changeable by cluster operators. Subject to change between versions.
- **Built-in policy APIs**: ResourceQuota, NetworkPolicy, RBAC — declarative, stable, recommended over configuration where suitable.
- **Extensions**: software components that deeply integrate with Kubernetes to support new types and hardware.

## Custom Resources

A **custom resource** is an extension of the Kubernetes API that is not necessarily available in a default installation. It represents a customization of a particular Kubernetes installation.

### CustomResourceDefinitions (CRDs)

CRDs are the most common way to add custom resources. They:
- Are defined declaratively via YAML
- Can be dynamically registered and unregistered in a running cluster
- Are accessible via kubectl just like built-in resources
- Support schema validation via OpenAPI v3
- Support additional printer columns, status subresources, conversion webhooks, and defaulting

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

### API Server Aggregation

An alternative to CRDs. A custom API server registers as an extension API server and the main Kubernetes API server proxies requests to it. More powerful but more complex:
- Supports custom storage backends
- Full control over API semantics
- Requires running an additional API server

### CRDs vs API Aggregation

| Feature | CRDs | API Aggregation |
|---------|------|-----------------|
| Ease of use | Easy | Complex |
| Storage | etcd (via main API server) | Custom |
| Authentication | Main API server | Custom |
| Schema validation | OpenAPI v3 | Full control |
| Subresources | Supported | Full control |

### Custom controllers

Custom resources alone store and retrieve structured data. Combined with a **custom controller**, they provide a true declarative API. The controller watches the custom resource and takes action to reconcile actual state with desired state.

### Should I add a custom resource?

Consider adding a custom resource if:
- Your API follows **declarative** semantics (desired state, not imperative commands)
- You want to manage it with kubectl and other Kubernetes tools
- You want Kubernetes features like RBAC, labels, annotations, watch, etc.

Use a **ConfigMap** instead if:
- You just need configuration data consumed by existing resources
- The data is simple key-value pairs

### Preparing to install a custom resource

Before installing:
- Ensure third-party code is trusted (it runs in your cluster)
- Understand storage implications (data goes in etcd)
- Consider authentication, authorization, and auditing

## Operator Pattern

The **Operator pattern** combines custom resources and custom controllers to encode domain knowledge for specific applications into an extension of the Kubernetes API.

### Motivation

Operators capture the key aim of a human operator managing a service. They automate tasks beyond what Kubernetes itself provides:
- Deploying an application on demand
- Taking and restoring backups
- Handling upgrades (code + database schemas + config)
- Publishing a Service for discovery
- Simulating failure for resilience testing
- Choosing a leader for distributed applications

### Example operator

An operator for a database (SampleDB) might include:
1. A `SampleDB` custom resource
2. A Deployment running the controller
3. A container image with operator code
4. Controller code that queries the API server for `SampleDB` resources
5. Reconciliation logic:
   - **On create**: sets up PVCs, a StatefulSet, and an initial config Job
   - **On delete**: takes a snapshot, then removes StatefulSet and Volumes
   - **Backups**: creates Pods with ConfigMap/Secret for connection details
   - **Upgrades**: creates Jobs to handle version upgrades

### Deploying operators

The most common way is to add the CRD and its associated Controller to your cluster. The controller runs outside the control plane, typically as a Deployment.

### Writing operators

Operators can be written using:
- **Operator Framework** (Go, Ansible, Helm)
- **Kubebuilder** (Go)
- **Controller Runtime** (Go)
- **client-go** directly (Go)

## API Access Extensions

### Authentication

- **Bootstrap Tokens**: for node bootstrapping
- **OIDC tokens**: OpenID Connect integration
- **Webhook token authentication**: external authentication service
- **Client certificates**: X.509 client certs

### Authorization

- **RBAC** (Role-Based Access Control): built-in
- **ABAC** (Attribute-Based Access Control): legacy, file-based
- **Webhook mode**: external authorization service
- **Node authorization**: special mode for kubelet access

### Dynamic Admission Control

- **MutatingAdmissionWebhook**: modify requests before persistence
- **ValidatingAdmissionWebhook**: validate requests before persistence
- **ValidatingAdmissionPolicy**: CEL-based validation without webhooks

## Infrastructure Extensions

### Device Plugins

Device plugins advertise hardware resources (GPUs, RDMA, FPGA) to the kubelet so they can be consumed by Pods via `requests`/`limits`.

### Network Plugins (CNI)

Container Network Interface plugins implement pod networking. Different CNI plugins provide different features (overlay, BGP, network policies, etc.).

### Storage Plugins (CSI)

Container Storage Interface plugins provide storage to Kubernetes. CSI replaces the old in-tree volume plugins.

### Kubelet Image Credential Provider Plugins

Allow kubelet to dynamically fetch credentials for image registries using external providers.
