# Kubernetes Concepts

## Overview

Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services. It facilitates declarative configuration and automation.

### Features
- **Service discovery and load balancing**: Pods can be exposed via Services with stable IPs and DNS names
- **Storage orchestration**: Automatically mount storage systems (local, cloud, network)
- **Automated rollouts and rollbacks**: Controlled deployment of changes with rollback capability
- **Self-healing**: Restarts failed containers, replaces/reschedules Pods on unhealthy nodes
- **Secret and configuration management**: Store and manage sensitive information via Secrets
- **Batch execution**: Manage batch and CI workloads via Jobs
- **Horizontal scaling**: Scale applications up/down with a command or automatically via HPA
- **IPv4/IPv6 dual-stack**: Support for both IP addressing schemes
- **Extensibility**: Custom resources, controllers, admission webhooks, scheduling, volume plugins

### What Kubernetes Is Not
- Does not limit the types of applications supported
- Does not deploy source code or build applications (CI/CD pipelines handle this)
- Does not provide application-level services (databases, message queues, caches)
- Does not dictate logging/monitoring/tracing solutions (provides integration points)

## Components

### Control Plane Components

#### kube-apiserver
- Front-end for the Kubernetes control plane
- Exposes the Kubernetes API (RESTful)
- Horizontally scalable (can run multiple instances)
- Validates and configures data for API objects (Pods, Services, Deployments, etc.)

#### etcd
- Consistent and highly-available key-value store
- The sole persistent store for all cluster data
- Must have a backup plan for recovery

#### kube-scheduler
- Watches for newly created Pods with no assigned node
- Selects a node for the Pod based on resource requirements, policy constraints, affinity/anti-affinity, data locality, deadlines

#### kube-controller-manager
- Runs controller processes (node, replication, deployment, statefulset, etc.)
- Logically each controller is separate but compiled into one binary for simplicity
- Watches shared state via the API server and makes changes to move toward desired state

#### cloud-controller-manager
- Embeds cloud-specific control logic
- Links cluster to cloud provider's API
- Separates Kubernetes core from cloud-specific code
- Contains node, route, service controllers

### Node Components

#### kubelet
- Agent running on each node
- Ensures containers are running in a Pod as expected
- Takes PodSpecs and ensures corresponding containers are running and healthy
- Does not manage containers not created by Kubernetes

#### kube-proxy
- Network proxy on each node
- Maintains network rules on nodes for Pod communication
- Implements part of the Kubernetes Service concept (connection forwarding)
- Uses iptables, IPVS, or userspace proxy modes

#### Container Runtime
- Software responsible for running containers
- Supports runtimes implementing the Kubernetes CRI (Container Runtime Interface)
- Common runtimes: containerd, CRI-O
- Image should be immutable (don't update code in existing containers)

### Addons
- DNS: Cluster DNS (CoreDNS) for service discovery
- Web UI (Dashboard): General-purpose web UI for cluster management
- Container Resource Monitoring: Collects and stores container metrics
- Cluster-level Logging: Saves logs to central log store
- Network Plugins: Implement CNI for Pod networking

## Objects

### Understanding Objects
Kubernetes objects are persistent entities representing the state of the cluster:
- **Desired state**: What you want the cluster to look like (defined in `spec`)
- **Actual state**: Current cluster state (reported in `status`)
- The control plane continuously works to make actual state match desired state

### Object Spec and Status
- Almost every Kubernetes object includes `spec` (desired state) and `status` (current state)
- `spec` is provided by the user; `status` is maintained by Kubernetes
- For some objects, `spec` is replaced or supplemented by other fields (e.g., ConfigMap uses `data`)

### Describing Objects
Objects are created/modified via the Kubernetes API, typically using YAML manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Required Fields
- `apiVersion`: Which version of the Kubernetes API to use
- `kind`: What kind of object to create
- `metadata`: Data that uniquely identifies the object (name, UID, namespace)
- `spec`: The desired state of the object

### Labels and Selectors
- **Labels**: Key/value pairs attached to objects for identification and organization
- **Selectors**: Used to filter/select objects based on labels
  - Equality-based: `environment = production`, `tier != frontend`
  - Set-based: `environment in (production, staging)`

### Annotations
- Key/value pairs for attaching non-identifying metadata
- Used for build information, release IDs, image hashes, logging/monitoring config
- Cannot be used for filtering/selecting

### Namespaces
- Virtual clusters backed by the same physical cluster
- Provide scope for names (resource names must be unique within a namespace)
- Default namespaces: `default`, `kube-system`, `kube-public`, `kube-node-lease`
- Use for environments with many users across multiple teams/projects

### Names and UIDs
- **Names**: DNS subdomain names (max 253 chars), unique within a namespace
- **UIDs**: Globally unique identifiers generated by Kubernetes

## Kubernetes API

### Overview
- The Kubernetes API is the core of the control plane
- Users, cluster components, and external components all interact through the API
- The API server (kube-apiserver) handles REST operations and serves the API

### API Groups and Versioning
- API groups make it easier to extend the Kubernetes API
- Groups are versioned (e.g., `v1`, `v1beta1`, `v1alpha1`)
- Version levels:
  - **Alpha** (`v1alpha1`): May be buggy, disabled by default, may be removed
  - **Beta** (`v1beta1`): Well-tested, enabled by default, but semantics may change
  - **Stable** (`v1`): Guaranteed long-term compatibility

### API Paths
```
/api/v1                          # core group (legacy)
/apis/apps/v1                    # apps group
/apis/rbac.authorization.k8s.io/v1  # RBAC group
/apis/storage.k8s.io/v1          # storage group
/apis/networking.k8s.io/v1       # networking group
```

### Persistence
- `etcd` is the sole persistent store for all API objects
- The API server is the only component that talks to etcd directly
- All other components read/write through the API server

## Containers

### Container Images
- Container images are ready-to-run software packages containing application code, libraries, and dependencies
- Images are immutable; to update, build a new image and redeploy
- Image names format: `registry/repository:tag` (e.g., `nginx:1.14.2`)
- Private registries require authentication via imagePullSecrets

### Container Runtimes
- Software that runs containers
- Must implement the Kubernetes CRI (Container Runtime Interface)
- Supported runtimes:
  - **containerd**: CNCF graduated project, widely used
  - **CRI-O**: Lightweight runtime for Kubernetes
- Runtime is configured on each node via kubelet

### Container Environment
- Environment variables can be set in the container spec
- Sources: direct values, ConfigMaps, Secrets, Pod fields (downward API)
- Variables are resolved in order; later references to earlier variables are supported

### Container Lifecycle Hooks
- **PostStart**: Executed immediately after container creation (may run concurrently with entrypoint)
- **PreStop**: Executed before container termination (blocking, must complete before SIGTERM)
- Hook handlers: `exec` (run command), `httpGet` (HTTP GET request)
- Hook delivery is at-least-once (may be called multiple times)

### Container Probes
- **Liveness probe**: Determines if container is running; failed probe triggers restart
- **Readiness probe**: Determines if container is ready to serve traffic; failed probe removes from Service endpoints
- **Startup probe**: Determines if container has started; disables liveness/readiness until success
- Probe types: `exec`, `httpGet`, `tcpSocket`, `grpc`

### Init Containers
- Run before app containers, must complete successfully
- Useful for setup tasks (waiting for dependencies, initializing config)
- If any init container fails, the Pod is considered failed

### Multi-container Pod Patterns
- **Sidecar**: Helper container that augments the main container
- **Ambassador**: Proxy container representing the main container to the outside
- **Adapter**: Adapts the main container's interface to match expectations
