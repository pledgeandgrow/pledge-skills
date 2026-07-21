# Tasks

This file covers common Kubernetes operational tasks and how-to guides from the official documentation.

## Accessing Clusters

### Accessing for the first time

Use `kubectl` to access a cluster. You need a kubeconfig file (typically at `~/.kube/config`) that defines:
- **Clusters**: API server endpoints and CA certificates
- **Users**: client certificates or tokens
- **Contexts**: cluster + user + namespace combinations

```bash
kubectl config view                    # View kubeconfig
kubectl config use-context my-context  # Switch context
kubectl cluster-info                   # Show cluster endpoints
```

### Accessing the API

#### Direct API access

```bash
# Using kubectl proxy
kubectl proxy --port=8080
curl http://localhost:8080/apis/

# Direct API access with credentials
curl -k -H "Authorization: Bearer <token>" https://<api-server>/api/v1/namespaces/default/pods
```

#### Programmatic access

Use client libraries:
- **client-go** (Go) — the official Kubernetes client
- **client-python** (Python)
- **client-javascript** (JavaScript/TypeScript)
- Other community-maintained clients

### In-cluster API access

Pods can access the API server using the service account token mounted at `/var/run/secrets/kubernetes.io/serviceaccount/`:
- `token` — the bearer token
- `ca.crt` — the CA certificate
- `namespace` — the pod's namespace

```bash
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
curl -k -H "Authorization: Bearer $TOKEN" https://kubernetes.default.svc/api/v1/namespaces/$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)/pods
```

## Managing Objects

### Imperative commands

```bash
kubectl create deployment nginx --image=nginx --replicas=3
kubectl expose deployment nginx --port=80 --type=LoadBalancer
kubectl scale deployment nginx --replicas=5
kubectl set image deployment/nginx nginx=nginx:1.16
```

### Declarative management

```bash
kubectl apply -f deployment.yaml          # Create/update from file
kubectl apply -f ./manifests/             # Apply all files in directory
kubectl diff -f deployment.yaml           # Preview changes (dry-run)
kubectl delete -f deployment.yaml         # Delete from file
```

### Labeling and annotating

```bash
kubectl label pod <pod-name> env=prod     # Add label
kubectl label pod <pod-name> env-         # Remove label
kubectl annotate pod <pod-name> description="my pod"  # Add annotation
```

### Editing resources

```bash
kubectl edit deployment nginx             # Open in editor
kubectl patch deployment nginx -p '{"spec":{"replicas":5}}'  # JSON patch
```

## Configuring Pods and Containers

### Assigning a Pod to a Node

```yaml
# nodeSelector (simple)
spec:
  nodeSelector:
    disktype: ssd

# nodeAffinity (advanced)
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/arch
            operator: In
            values: ["amd64", "arm64"]
```

### Configuring pod quality of service

- **Guaranteed**: every container has equal requests and limits for cpu and memory
- **Burstable**: at least one container has requests but not all have limits equal to requests
- **BestEffort**: no requests or limits on any container

### Assigning extended resources

```yaml
spec:
  containers:
  - name: gpu-container
    image: cuda
    resources:
      limits:
        nvidia.com/gpu: 2
```

### Configuring liveness and readiness probes

```yaml
spec:
  containers:
  - name: app
    image: my-app
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

### Using ConfigMaps and Secrets

```bash
kubectl create configmap my-config --from-literal=key1=value1 --from-file=config.properties
kubectl create secret generic my-secret --from-literal=password=supersecret
```

### Attaching storage

```yaml
spec:
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: my-pvc
  containers:
  - name: app
    volumeMounts:
    - name: data
      mountPath: /data
```

## Managing Cluster

### Tainting and tolerating nodes

```bash
kubectl taint nodes node1 key=value:NoSchedule    # Add taint
kubectl taint nodes node1 key:NoSchedule-         # Remove taint
```

### Cordoning and draining nodes

```bash
kubectl cordon node1     # Mark node unschedulable
kubectl drain node1 --ignore-daemonsets --delete-emptydir-data  # Evict pods
kubectl uncordon node1   # Mark node schedulable again
```

### Viewing cluster resources

```bash
kubectl get nodes -o wide
kubectl describe node node1
kubectl top nodes         # Resource usage
kubectl top pods          # Pod resource usage
```

### Managing cluster DNS

CoreDNS is the default DNS server. Configure via the `coredns` ConfigMap in `kube-system` namespace.

### Logging

```bash
kubectl logs <pod-name>                    # View pod logs
kubectl logs <pod-name> -c <container>     # Specific container
kubectl logs -f <pod-name>                 # Follow logs
kubectl logs --previous <pod-name>         # Previous container instance
```

### Monitoring

Common monitoring approaches:
- **Metrics Server** — resource metrics (CPU/memory)
- **Prometheus** — full monitoring and alerting
- **cAdvisor** — container metrics (built into kubelet)

### Auditing

Kubernetes audit logs record API server requests. Configure via audit policy file:
- Audit levels: None, Metadata, Request, RequestResponse
- Audit rules based on verbs, resources, namespaces, users

### Debugging

```bash
kubectl describe pod <pod-name>            # Pod events and status
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl exec -it <pod> -- /bin/sh          # Shell into pod
kubectl port-forward pod/<pod> 8080:80     # Port forward
kubectl proxy                              # Proxy to API server
```

### Debugging with ephemeral containers

```bash
kubectl debug -it <pod> --image=busybox --target=<container>
```

## Installing Addons

Addons extend Kubernetes functionality:
- **DNS**: CoreDNS (required)
- **Web UI**: Dashboard
- **Container Resource Monitoring**: Metrics Server
- **Cluster-level Logging**: Fluentd/Elasticsearch/Kibana
- **Ingress Controllers**: NGINX, Traefik, HAProxy
- **Network Policies**: Calico, Cilium

## Administering Stateful Applications

### Scaling StatefulSets

```bash
kubectl scale statefulset <name> --replicas=5
```

### Performing rolling updates

```bash
kubectl rollout status statefulset/<name>
kubectl rollout pause statefulset/<name>
kubectl rollout resume statefulset/<name>
kubectl rollout undo statefulset/<name>
```

### Deleting StatefulSets

```bash
kubectl delete statefulset <name>              # Delete (pods may persist)
kubectl delete statefulset <name> --cascade=orphan  # Delete, keep pods
```

## Cluster Administration

### Planning a cluster

Considerations before choosing a Kubernetes distribution:
- Try on computer vs. production high-availability cluster
- Hosted Kubernetes (GKE, EKS, AKS) vs. self-hosted
- On-premises vs. cloud (IaaS); Kubernetes does not support hybrid clusters
- Networking model selection for on-premises
- Bare metal vs. virtual machines
- Active development vs. binary releases only

### Managing a cluster

- **Node management**: learn to manage nodes, configure node autoscaling
- **Resource quotas**: set up ResourceQuotas for shared clusters
- **Node autoscaling**: cluster autoscaler adjusts node count based on demand
- **Upgrading clusters**: upgrade control plane first, then worker nodes

### Securing a cluster

- **Certificates**: generate and manage PKI certificates for cluster components
- **Controlling API access**: authentication, authorization, admission control
- **Admission controllers**: plugins that intercept API requests after auth
- **Admission webhooks**: good practices for mutating and validating webhooks
- **Sysctls**: set kernel parameters using sysctl in a cluster
- **Auditing**: configure audit logging for API server requests

### Generating Certificates

Kubernetes requires PKI certificates for:
- API server (serving certificate)
- API server client certificates (for kubelet, scheduler, controller-manager)
- Kubelet serving certificates
- etcd server and peer certificates

Use tools like `openssl`, `cfssl`, or `easyrsa` to generate certificates.

### Observability

#### Metrics

Kubernetes components emit metrics in Prometheus format from `/metrics` endpoints:
- kube-apiserver, kube-scheduler, kube-controller-manager, kube-proxy, kubelet
- kubelet also exposes `/metrics/cadvisor`, `/metrics/resource`, `/metrics/probes`
- **kube-state-metrics**: enriches control plane signals with object status
- **metrics-server**: provides resource usage metrics (CPU/memory) for HPA

Typical metrics pipeline: components → Prometheus scraper → time series storage → dashboards/alerts

#### Logs

- Container runtimes capture stdout/stderr; kubelet makes logs available via `kubectl logs`
- System components: kube-scheduler and kube-proxy write to `/var/log` (in containers)
- kubelet and container runtime: write to journald (systemd) or `/var/log` (.log files)
- Node-level logging agents (Fluent Bit, Fluentd) tail logs and forward to central store
- Log rotation is needed to prevent uncontrolled growth

Typical logging pipeline: app stdout/stderr + control plane logs + audit records → node log agent → central log store → dashboards/SIEM

#### Traces

- Kubernetes 1.36 can export spans over OpenTelemetry Protocol (OTLP)
- Built-in gRPC exporters or via OpenTelemetry Collector
- Traces capture request flow across components, linking latency and timing
- Collector processes spans (sampling, redaction) and forwards to tracing backend

Typical tracing pipeline: control plane spans + app spans → OTLP exporter → OpenTelemetry Collector → tracing backend → visualization

### Node Autoscaling

The cluster autoscaler:
- Watches for pods that cannot be scheduled due to insufficient resources
- Automatically adds nodes to the cluster when needed
- Removes nodes when they are underutilized
- Works with cloud provider APIs to provision/deprovision nodes

## Managing HugePages

HugePages provide a mechanism for allocating large contiguous memory pages, reducing TLB overhead for memory-intensive workloads.

### Prerequisites

- Nodes must pre-allocate huge pages via kernel boot parameters
- Example GRUB config: `GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"`
- Nodes auto-discover and report huge page resources as schedulable

### Scheduling HugePages

- Resource name: `hugepages-<size>` (e.g., `hugepages-2Mi`, `hugepages-1Gi`)
- Huge pages do not support overcommit
- Requests must equal limits
- Must also request memory or CPU alongside hugepages
- Consumed via `emptyDir` volumes with `medium: HugePages-<size>`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command: ["sleep", "inf"]
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
```

### HugePages with ResourceQuotas

- Huge page usage in a namespace is controllable via ResourceQuota
- Use `hugepages-<size>` token in ResourceQuota spec

## Scheduling GPUs

Kubernetes supports scheduling GPUs using device plugins.

### Using Device Plugins

- Install GPU drivers from hardware vendor on nodes (AMD, Intel, NVIDIA)
- Run the corresponding device plugin (vendor-specific DaemonSet)
- Plugin registers custom schedulable resources: `amd.com/gpu`, `nvidia.com/gpu`, `intel.com/gpu`

### Requesting GPUs

GPUs are only specified in the `limits` section:
- Can specify GPU limits without requests (Kubernetes uses limit as request)
- Can specify in both limits and requests, but values must be equal
- Cannot specify GPU requests without limits

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  containers:
  - name: example-vector-add
    image: "registry.example/example-vector-add:v42"
    resources:
      limits:
        gpu-vendor.example/example-gpu: 1  # requesting 1 GPU
```

### Managing Different GPU Types

Use node labels and node selectors to schedule pods to appropriate nodes:

```bash
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

Then use `nodeSelector` in Pod spec to target specific GPU types.
