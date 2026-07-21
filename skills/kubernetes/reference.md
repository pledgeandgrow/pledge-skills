# Kubernetes Reference

## kubectl

### Overview
- Primary command-line tool for communicating with Kubernetes cluster control plane
- Uses the Kubernetes API for all operations
- Looks for config in `$HOME/.kube/config` (kubeconfig)
- Can be overridden via `KUBECONFIG` env var or `--kubeconfig` flag

### Syntax
```bash
kubectl [command] [TYPE] [NAME] [flags]
```

- **command**: Operation to perform (create, get, describe, delete, apply, etc.)
- **TYPE**: Resource type (case-insensitive, singular/plural/abbreviated: pod/pods/po)
- **NAME**: Resource name (case-sensitive, omit for all resources)
- **flags**: Optional flags (e.g., `-s` for server, `-n` for namespace, `-o` for output)

### Operations

#### Basic Operations
- `kubectl create -f <file>`: Create resource from file
- `kubectl apply -f <file>`: Apply configuration (declarative)
- `kubectl get <type>`: List resources
- `kubectl describe <type> <name>`: Show detailed info
- `kubectl delete <type> <name>`: Delete resource
- `kubectl edit <type> <name>`: Edit resource in editor
- `kubectl patch <type> <name> -p <json>`: Patch resource

#### Deploy and Manage
- `kubectl rollout status deployment/<name>`: Check rollout status
- `kubectl rollout undo deployment/<name>`: Rollback
- `kubectl rollout history deployment/<name>`: View history
- `kubectl scale deployment/<name> --replicas=N`: Scale
- `kubectl autoscale deployment/<name> --min=2 --max=10 --cpu-percent=80`: HPA

#### Debug and Investigate
- `kubectl logs <pod>`: View container logs
- `kubectl logs -f <pod>`: Follow logs
- `kubectl exec -it <pod> -- <command>`: Execute command in container
- `kubectl port-forward <pod> <local>:<remote>`: Forward port to Pod
- `kubectl proxy`: Proxy to Kubernetes API server
- `kubectl top pod`: Show resource usage (requires metrics-server)

#### Cluster Management
- `kubectl cordon <node>`: Mark node unschedulable
- `kubectl uncordon <node>`: Mark node schedulable
- `kubectl drain <node>`: Evict all Pods from node
- `kubectl taint nodes <node> <key>=<value>:<effect>`: Add taint

#### Advanced
- `kubectl label <type> <name> <key>=<value>`: Add label
- `kubectl annotate <type> <name> <key>=<value>`: Add annotation
- `kubectl config use-context <context>`: Switch context
- `kubectl config get-contexts`: List contexts

### Output Options
- `-o wide`: Additional columns
- `-o yaml`: YAML format
- `-o json`: JSON format
- `-o jsonpath='{.items[*].metadata.name}'`: JSONPath
- `-o custom-columns=NAME:.metadata.name`: Custom columns
- `-o name`: Only resource names
- `--sort-by=.metadata.creationTimestamp`: Sort output
- `--show-labels`: Show labels

### In-Cluster Authentication
- kubectl running inside a Pod uses ServiceAccount token
- Token mounted at `/var/run/secrets/kubernetes.io/serviceaccount/`
- CA cert at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`
- Namespace at `/var/run/secrets/kubernetes.io/serviceaccount/namespace`

### Declarative vs Imperative
- **Declarative** (`kubectl apply`): Define desired state in files, Kubernetes reconciles
  - Preferred for production, GitOps workflows
  - Tracks changes, easy to audit
- **Imperative** (`kubectl create`, `kubectl run`): Direct commands
  - Good for development and experimentation
  - Harder to reproduce and audit

### Plugins
- Extend kubectl with sub-commands
- Naming convention: `kubectl-<plugin-name>`
- Must be in PATH and executable
- Manage with Krew plugin manager (https://krew.sigs.k8s.io/)

### Version Compatibility
- kubectl supports version skew of ±1 minor version from cluster
- e.g., kubectl v1.32 works with clusters v1.31, v1.32, v1.33
- Using compatible versions avoids unexpected behavior

## Glossary

### Key Terms

- **API-initiated eviction**: Process using Eviction API to trigger graceful Pod termination (respects PodDisruptionBudgets)
- **App Container**: Containers in a Pod started after init containers complete
- **Application Architect**: Person responsible for high-level application design
- **Application Developer**: Person who writes applications running in a Kubernetes cluster
- **Approver**: Person who can review and approve Kubernetes code contributions
- **cAdvisor**: Daemon collecting container resource usage and performance data
- **Certificate**: Cryptographically secure file for validating cluster access
- **cgroup (control group)**: Linux kernel feature for resource isolation, accounting, and limits
- **CIDR**: Notation for describing IP address blocks; used for Node Pod IP ranges
- **CLA (Contributor License Agreement)**: Terms under which contributor grants license to project
- **Cloud Controller Manager**: Kubernetes control plane component embedding cloud-specific logic
- **Cluster**: Set of Nodes running containerized applications managed by Kubernetes
- **Cluster Architect**: Person designing Kubernetes cluster infrastructure
- **Cluster Operator**: Person configuring, running, and maintaining a cluster
- **Container Runtime**: Software responsible for running containers (containerd, CRI-O)
- **Containerd**: CNCF graduated container runtime emphasizing simplicity, robustness, portability
- **ConfigMap**: API object for storing non-confidential data in key-value pairs
- **Controller**: Control loop watching shared state and making changes toward desired state
- **CRI-O**: Lightweight container runtime for Kubernetes
- **CronJob**: Manages time-based scheduled Jobs
- **CustomResourceDefinition (CRD)**: Custom Kubernetes resource definition
- **DaemonSet**: Ensures copy of Pod runs on all (or some) nodes
- **Deployment**: Manages set of Pods for stateless workloads
- **DNS**: Domain Name System for service discovery in cluster (CoreDNS)
- **EndpointSlice**: Tracks Pod IPs for Service load balancing
- **etcd**: Consistent, highly-available key-value store for all cluster data
- **Eviction**: Process of terminating Pods (API-initiated or node-pressure)
- **Feature Gate**: Mechanism for enabling/disabling experimental features
- **Headless Service**: Service without cluster IP, DNS returns Pod IPs directly
- **Horizontal Pod Autoscaler (HPA)**: Automatically scales Pods based on metrics
- **Ingress**: API object managing external access to cluster Services (HTTP/HTTPS)
- **Init Container**: Container running before app containers for setup tasks
- **Job**: Runs Pods to completion for one-off tasks
- **kube-apiserver**: Front-end for Kubernetes control plane, exposes API
- **kube-controller-manager**: Runs controller processes
- **kube-proxy**: Network proxy on each node maintaining network rules
- **kube-scheduler**: Selects nodes for newly created Pods
- **kubeconfig**: Configuration file for cluster access
- **kubectl**: Command-line tool for Kubernetes API communication
- **Kubelet**: Agent on each node ensuring containers run as expected
- **Label**: Key/value pair attached to objects for identification
- **Namespace**: Virtual cluster within physical cluster
- **Network Policy**: Rules for controlling traffic flow between Pods
- **Node**: Worker machine in Kubernetes cluster
- **PersistentVolume (PV)**: Piece of storage in cluster independent of Pod lifecycle
- **PersistentVolumeClaim (PVC)**: Request for storage by user
- **Pod**: Smallest deployable unit, group of containers with shared resources
- **Pod Disruption Budget (PDB)**: Limits number of Pods that can be down simultaneously
- **Pod Security Policy**: (Deprecated) Cluster-level Pod security rules
- **ReplicaSet**: Maintains stable set of replica Pods
- **ReplicationController**: (Deprecated) Ensures specified number of Pod replicas
- **Secret**: Object containing sensitive data (passwords, tokens, keys)
- **Service**: Abstraction exposing application on Pods behind endpoint
- **ServiceAccount**: Identity for processes in Pods
- **StatefulSet**: Manages stateful applications with stable identity
- **StorageClass**: Way for admins to describe classes of storage
- **Taint**: Mark on node repelling certain Pods (with tolerations as exceptions)
- **Toleration**: Pod property allowing scheduling on tainted nodes
- **Volume**: Directory accessible to containers in a Pod

## Well-Known Labels, Annotations and Taints

Kubernetes reserves all labels, annotations and taints in the `kubernetes.io` and `k8s.io` namespaces.

### Common Labels

- `kubernetes.io/arch` — node architecture (amd64, arm64, etc.)
- `kubernetes.io/os` — node OS (linux, windows)
- `kubernetes.io/hostname` — node hostname
- `kubernetes.io/metadata.name` — object's metadata.name as a label
- `topology.kubernetes.io/region` — cloud region
- `topology.kubernetes.io/zone` — cloud availability zone
- `node.kubernetes.io/instance-type` — node instance type
- `beta.kubernetes.io/instance-type` — (deprecated) use above instead

### App Labels (recommended)

- `app.kubernetes.io/name` — app name
- `app.kubernetes.io/instance` — unique instance (e.g., release name)
- `app.kubernetes.io/version` — app version
- `app.kubernetes.io/component` — component within the app
- `app.kubernetes.io/part-of` — higher-level app this is part of
- `app.kubernetes.io/managed-by` — tool managing this (e.g., Helm)

### Node Taints (built-in)

- `node.kubernetes.io/not-ready` — node is not ready
- `node.kubernetes.io/unreachable` — node is unreachable from controller
- `node.kubernetes.io/unschedulable` — node is cordoned
- `node.kubernetes.io/memory-pressure` — low memory
- `node.kubernetes.io/disk-pressure` — low disk space
- `node.kubernetes.io/pid-pressure` — low PIDs
- `node.kubernetes.io/network-unavailable` — network not available
- `node.kubernetes.io/out-of-service` — node is out of service
- `node.cloudprovider.kubernetes.io/uninitialized` — kubelet not yet initialized by cloud provider
- `node.cloudprovider.kubernetes.io/shutdown` — cloud provider indicates node is shutting down

### Pod Annotations (common)

- `kubectl.kubernetes.io/last-applied-configuration` — last config applied by `kubectl apply`
- `kubectl.kubernetes.io/default-container` — default container for kubectl commands
- `deployment.kubernetes.io/revision` — deployment revision number
- `deployment.kubernetes.io/desired-replicas` — desired replica count
- `controller.kubernetes.io/pod-deletion-cost` — deletion priority for pods
- `cluster-autoscaler.kubernetes.io/safe-to-evict` — whether pod is safe to evict

### Security Labels

- `pod-security.kubernetes.io/enforce` — enforced Pod Security Standard level
- `pod-security.kubernetes.io/enforce-version` — PSS version to enforce
- `pod-security.kubernetes.io/audit` — audited Pod Security Standard level
- `pod-security.kubernetes.io/audit-version` — PSS version to audit
- `pod-security.kubernetes.io/warn` — warned Pod Security Standard level
- `pod-security.kubernetes.io/warn-version` — PSS version to warn

### Storage Annotations

- `pv.kubernetes.io/bind-completed` — PV binding completed
- `pv.kubernetes.io/bound-by-controller` — PV bound by controller
- `pv.kubernetes.io/provisioned-by` — provisioner name
- `volume.kubernetes.io/storage-provisioner` — storage provisioner
- `volume.kubernetes.io/selected-node` — selected node for volume
- `storageclass.kubernetes.io/is-default-class` — default StorageClass

### Service Annotations

- `service.kubernetes.io/headless` — service is headless
- `service.kubernetes.io/topology-mode` — topology-aware routing mode
- `kubernetes.io/service-name` — service name (for endpoints)

### Kubeadm Labels

- `node-role.kubernetes.io/control-plane` — control plane node
- `node-role.kubernetes.io/master` — (deprecated) control plane node

## API Versioning

Kubernetes API versioning indicates different levels of stability and support:

### Version levels

- **Alpha** (e.g., `v1alpha1`):
  - Disabled by default; must be explicitly enabled in kube-apiserver
  - May contain bugs; support may be dropped without notice
  - API may change in incompatible ways
  - Recommended only for short-lived testing clusters

- **Beta** (e.g., `v2beta3`):
  - Disabled by default (since Kubernetes 1.22); must be explicitly enabled
  - Maximum lifetime of 9 months or 3 minor releases from introduction to removal
  - Well tested; enabling is considered safe
  - Schema/semantics may change in incompatible ways in subsequent versions
  - Not recommended for production; migration may require downtime

- **Stable/GA** (e.g., `v1`):
  - Enabled by default
  - Stable, long-term support
  - Features remain available once graduated to stable

### API groups

- **Core group** (legacy): `/api/v1` (no group name, e.g., Pods, Services)
- **Named groups**: `/apis/<group>/<version>` (e.g., `apps/v1`, `networking.k8s.io/v1`)
- API groups can be enabled/disabled via `--runtime-config` flag on kube-apiserver

### Deprecation policy

- GA API versions: guaranteed for at least 12 months or 3 minor releases
- Beta API versions: guaranteed for 9 months or 3 minor releases
- Alpha API versions: no guarantee
- Deprecated APIs trigger warnings in kubectl and API responses

## Feature Gates

Feature gates are key=value pairs that control Kubernetes features. They can be turned on/off using the `--feature-gates` command line flag.

### Usage

```bash
kube-apiserver --feature-gates=FeatureName1=true,FeatureName2=false
kubelet --feature-gates=GracefulNodeShutdown=true
```

### Feature stages

- **Alpha**: disabled by default, may have bugs, may be removed
- **Beta**: enabled by default (pre-1.22) or disabled by default (post-1.22), well-tested
- **GA/Stable**: enabled by default, cannot be disabled
- **Deprecated**: being removed in a future release

### Lifecycle

1. Introduced as Alpha (disabled by default)
2. Promoted to Beta (testing, feedback)
3. Graduated to GA/Stable (locked in)
4. Eventually deprecated and removed

Each component supports only relevant feature gates. Use `<component> -h` to list available gates.

## Client Libraries

Officially supported client libraries for calling the Kubernetes API:

- **Go**: `github.com/kubernetes/client-go/` (most complete, used by kubectl)
- **Python**: `github.com/kubernetes-client/python`
- **Java**: `github.com/kubernetes-client/java`
- **JavaScript**: `github.com/kubernetes-client/javascript`
- **C#**: `github.com/kubernetes-client/csharp`
- **Haskell**: `github.com/kubernetes-client/haskell`

Community-maintained libraries also exist for Ruby, PHP, Rust, Scala, and others.

## Component Reference

### Component CLI Flags

Each Kubernetes component has configurable command-line flags:

- **kubelet**: `--config`, `--node-ip`, `--pod-manifest-path`, `--rotate-certificates`, etc.
- **kube-apiserver**: `--etcd-servers`, `--secure-port`, `--authorization-mode`, `--feature-gates`, etc.
- **kube-controller-manager**: `--controllers`, `--horizontal-pod-autoscaler-sync-period`, etc.
- **kube-proxy**: `--proxy-mode`, `--cluster-cidr`, `--conntrack-max-per-core`, etc.
- **kube-scheduler**: `--config`, `--policy-config-file`, scheduler profiles and policies

### Ports and Protocols

Required open ports on control plane and worker nodes:

| Protocol | Port | Component | Purpose |
|----------|------|-----------|---------|
| TCP | 6443 | kube-apiserver | HTTPS API |
| TCP | 2379-2380 | etcd | Client/peer communication |
| TCP | 10250 | kubelet | HTTPS API |
| TCP | 10257 | kube-controller-manager | Metrics |
| TCP | 10259 | kube-scheduler | Metrics |
| TCP | 10256 | kube-proxy | Health check |
| TCP | 30000-32767 | NodePort | Service range |

### JSONPath Support

kubectl supports JSONPath expressions for custom output formatting:
- `kubectl get pods -o jsonpath='{.items[*].metadata.name}'`
- `kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'`
