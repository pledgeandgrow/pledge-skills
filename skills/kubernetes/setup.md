# Kubernetes Setup

## Learning Environment

### Overview
- For learning Kubernetes, use local tools to set up a cluster on your machine
- These tools create a single-node or multi-node cluster for development

### Common Local Tools
- **minikube**: Runs a single-node Kubernetes cluster locally in a VM or container
- **kind (Kubernetes IN Docker)**: Runs Kubernetes clusters in Docker containers
- **k3d**: Lightweight wrapper for k3s in Docker
- **Docker Desktop**: Includes a built-in Kubernetes cluster
- **MicroK8s**: Single-node Kubernetes for development
- **OrbStack**: Lightweight VM for running containers and Kubernetes on macOS

### Installing kubectl
- Required to interact with any Kubernetes cluster
- Install via package manager (brew, choco, apt, etc.)
- Verify: `kubectl version --client`

## Production Environment

### Overview
- When evaluating production setup, consider what to manage yourself vs. hand off to a provider
- Options: self-managed, managed (cloud), turnkey solutions

### kubeadm
- Officially supported tool for deploying Kubernetes clusters
- Provides `kubeadm init` (control plane) and `kubeadm join` (worker nodes)
- Fast path for creating best-practice Kubernetes clusters
- Does not provision infrastructure (VMs, networking, load balancers)

### Container Runtimes
- Must install a container runtime on each node
- Supported runtimes: containerd, CRI-O
- Configure via kubelet's `--container-runtime-endpoint` flag
- containerd: most commonly used, CNCF graduated
- CRI-O: lightweight, Kubernetes-specific

### Production Best Practices
- **Control plane HA**: Run multiple API server instances with load balancer
- **etcd HA**: Run 3 or 5 etcd instances for quorum
- **Regular backups**: Backup etcd regularly for disaster recovery
- **Resource planning**: Size nodes appropriately for workloads
- **Network policies**: Implement network segmentation
- **RBAC**: Use least-privilege access
- **Pod Security**: Enforce Pod Security Standards
- **Monitoring**: Set up cluster and application monitoring
- **Logging**: Implement centralized logging
- **Upgrades**: Plan regular upgrades following version skew policy

### High Availability
- **Stacked etcd**: etcd runs on control plane nodes (simpler, fewer machines)
- **External etcd**: etcd runs on separate machines (more resilient)
- **Load balancer**: Distributes traffic across API server instances
- **Multiple control plane nodes**: Typically 3 for quorum

### Windows Nodes
- Kubernetes supports Windows nodes for running Windows containers
- Control plane must run on Linux
- Windows nodes use different networking (HNS, vSwitch)
- Supported via sig-windows-community

### Windows Container Runtime

- **containerd** is the recommended runtime for Windows nodes (since Kubernetes v1.24)
- Docker (dockershim) was deprecated and removed in v1.24
- Windows Server 2019 and Windows Server 2022 are supported host OS versions
- Process isolation and Hyper-V isolation modes supported

### Windows Networking

- Uses **HNS (Host Network Service)** and **vSwitch** for networking
- CNI plugins must support Windows (e.g., Calico, Flannel, Antrea)
- Windows pods get their own IP address via the CNI
- Overlay networks supported via VXLAN or other encapsulation
- Direct Server Return (DSR) for load balancing on Windows

### Windows Pod Limitations

- No privileged containers (process isolation only)
- No `hostNetwork` or `hostPID`
- Linux-specific features not available (e.g., seccomp, AppArmor)
- File system case sensitivity differences
- Time zone follows the node's time zone
- `node.kubernetes.io/windows-build` label identifies Windows build

### Windows Workload Considerations

- Use `nodeSelector` or `nodeAffinity` with `kubernetes.io/os: windows` to schedule on Windows nodes
- Use taints/tolerations to keep Linux workloads off Windows nodes and vice versa
- Image names must specify Windows-compatible tags
- Resource limits are enforced differently (CPU shares, memory job objects)

### Cloud Provider Setup
- **Managed Kubernetes**: EKS (AWS), GKE (Google Cloud), AKS (Azure)
- Cloud providers handle control plane management, upgrades, scaling
- Node pools for worker node management
- Integrated with cloud networking, storage, and load balancing

## Cluster Architecture

### Node Components
- Each node runs: kubelet, kube-proxy, container runtime
- Nodes register with API server
- Node controller manages node lifecycle

### Control Plane
- Can run on dedicated machines or as Pods (self-hosted)
- Components communicate via API server
- etcd stores all cluster state

### Networking Model
- Every Pod gets its own IP address
- Pods can communicate with all other Pods without NAT
- Nodes can communicate with all Pods without NAT
- Pod IP is visible to the Pod itself and other Pods

## Install Tools

Kubernetes provides several tools for setting up and managing clusters:

### kubectl

- Main CLI tool for running commands against Kubernetes clusters
- Install via package manager (Homebrew, Chocolatey, apt) or direct download
- Version should be within one minor version of the cluster API server

### kind

- "Kubernetes in Docker" — runs local Kubernetes clusters using Docker containers as nodes
- Ideal for CI pipelines and local development
- Install: `go install sigs.k8s.io/kind@latest` or download binary

### minikube

- Runs a single-node Kubernetes cluster locally on your machine
- Supports multiple hypervisors (VirtualBox, KVM, Hyper-V, Docker)
- Includes addons for dashboard, ingress, metrics-server, etc.
- Install via package manager or direct download

### kubeadm

- Tool for bootstrapping Kubernetes clusters (production)
- Performs preflight checks, generates certs, creates control plane
- Install via package manager (apt, yum, dnf)
