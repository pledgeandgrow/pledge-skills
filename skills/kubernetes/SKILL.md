# Kubernetes Skill

Kubernetes is an open-source container orchestration engine for automating deployment, scaling, and management of containerized applications. It provides service discovery, load balancing, storage orchestration, automated rollouts/rollbacks, self-healing, secret management, batch execution, and horizontal scaling. This skill covers the official Kubernetes documentation.

## When to Use

- Orchestrating containerized applications across clusters of machines
- Managing stateless and stateful workloads (Deployments, StatefulSets, DaemonSets, Jobs)
- Configuring networking (Services, Ingress, Network Policies, DNS)
- Managing persistent storage (PersistentVolumes, StorageClasses, CSI)
- Configuring applications (ConfigMaps, Secrets, Resource Management)
- Securing clusters (Pod Security Standards, RBAC, Service Accounts)
- Setting up clusters (kubeadm, production environments, high availability)
- Using kubectl for cluster operations and debugging

## Skill Files

- **`concepts.md`** — Overview (what is Kubernetes, features, extensibility), components (control plane: kube-apiserver, etcd, kube-scheduler, kube-controller-manager, cloud-controller-manager; node: kubelet, kube-proxy, container runtime; addons), objects (spec, status, manifests, labels, annotations, namespaces, selectors), Kubernetes API (API groups, versioning, etcd persistence), containers (images, runtimes, CRI, lifecycle hooks, environment)
- **`workloads.md`** — Pods (single/multi-container, shared namespaces, resource sharing, security settings, resource requests/limits, static pods, probes), Deployments (rollouts, rolling updates, rollbacks, scaling, pausing/resuming, canary, spec fields), StatefulSets (stable identity, ordered deployment, pod management policies, update strategies, PVC retention), DaemonSets (node-local pods, scheduling, taints/tolerations, updates), Jobs (parallel execution, completion modes, failure handling, patterns, cleanup, CronJobs)
- **`networking.md`** — Services (ClusterIP, NodePort, LoadBalancer, ExternalName, headless services, service discovery, virtual IP, traffic policies, session stickiness), Ingress (Ingress resource, rules, path types, hostname wildcards, IngressClass, TLS, load balancing, types: single Service, fanout, name-based virtual hosting), Network Policies (pod isolation, ingress/egress, default policies, selectors, namespace targeting), DNS for Services and Pods (A/AAAA records, SRV records, namespace scoping, Pod hostname/subdomain, DNS policies, DNS config, search domain limits, Windows DNS), Gateway API (design principles, resource model: GatewayClass/Gateway/HTTPRoute/GRPCRoute, relationships, example YAML, migrating from Ingress, conformance)
- **`storage.md`** — PersistentVolumes (lifecycle: provisioning, binding, using, reclaiming; capacity, access modes, volume modes, phases; PVCs: requests, selectors, class), StorageClasses (provisioner, parameters, reclaim policy, volume expansion, mount options, volume binding mode, allowed topologies, default StorageClass)
- **`configuration.md`** — ConfigMaps (motivation, data/binaryData fields, immutable ConfigMaps, using as files and environment variables), Secrets (types: Opaque, ServiceAccount token, Docker config, basic auth, SSH, TLS, bootstrap token; usage as files/env vars, image pull secrets, immutable secrets, security), Resource Management (requests, limits, CPU/memory units, enforcement), kubeconfig (clusters, users, contexts)
- **`security.md`** — Pod Security Standards (Privileged, Baseline, Restricted profiles; policy instantiation; Pod OS field; user namespaces), Pod Security Admission (admission controller, enforcement modes: enforce, audit, warn; namespace labels; workload resources and Pod templates; exemptions), security context (runAsUser, runAsGroup, fsGroup, capabilities, seccomp), TLS (CertificateSigningRequest, kubelet cert rotation, managing TLS certs, CA rotation)
- **`setup.md`** — Learning environment (local tools: minikube, kind, etc.), Production environment (kubeadm, container runtimes, best practices, high availability), Windows nodes (container runtime, networking, pod limitations, workload considerations), Install Tools (kubectl, kind, minikube, kubeadm), cloud provider setup
- **`tutorials.md`** — Hello Minikube (objectives, creating cluster, checking status, dashboard, creating Deployment, creating Service, enabling addons, cleanup)
- **`scheduling-eviction.md`** — kube-scheduler (scheduling overview, feasible nodes, scoring, binding, custom schedulers), Pod Priority and Preemption (PriorityClass, globalDefault, non-preempting, scheduling order, preemption, limitations, QoS interaction), API-initiated Eviction (Eviction API, responses, graceful termination, troubleshooting), Node-pressure Eviction (eviction signals, thresholds, node conditions, pod selection, self-healing, known issues)
- **`extending.md`** — Extension points (kubectl plugins, API access, API extensions, scheduler, controllers, network/storage/device plugins), Custom Resources (CRDs, API aggregation, CRDs vs aggregation, custom controllers, Operator pattern, deploying operators), API Access Extensions (authentication, authorization, admission control), Infrastructure Extensions (device plugins, CNI, CSI, image credential providers)
- **`policy.md`** — Resource Quotas (how they work, types: infrastructure/extended/storage/object count, scopes, cluster capacity), LimitRange (constraints, default values, min/max, types, admission checks), PodDisruptionBudgets (purpose, spec fields, eviction interaction, controller integration)
- **`tasks.md`** — Accessing clusters (kubectl, API access, in-cluster access), Managing objects (imperative, declarative, labeling, editing), Configuring Pods (node assignment, QoS, extended resources, probes, ConfigMaps/Secrets, storage), Managing cluster (taints, cordon/drain, debugging, ephemeral containers), Installing addons, Administering stateful applications, Cluster Administration (planning, managing, securing, certificates, observability: metrics/logs/traces, node autoscaling, HugePages scheduling, GPU scheduling with device plugins)
- **`reference.md`** — kubectl (syntax, operations, resource types, output options, common operations, plugins, version compatibility, declarative vs imperative), glossary (key terms), well-known labels, annotations and taints (common labels, app labels, node taints, pod annotations, security labels, storage annotations, service annotations, kubeadm labels), API versioning (alpha/beta/GA levels, API groups, deprecation policy), Feature Gates (usage, feature stages, lifecycle), Client Libraries (Go, Python, Java, JS, C#, Haskell), Component Reference (CLI flags, ports and protocols, JSONPath)

## Key Concepts

- **Cluster**: Set of machines (nodes) running containerized applications managed by Kubernetes
- **Control Plane**: Brain of the cluster (kube-apiserver, etcd, kube-scheduler, kube-controller-manager, cloud-controller-manager)
- **Node**: Worker machine in the cluster (kubelet, kube-proxy, container runtime)
- **Pod**: Smallest deployable unit, group of one or more containers with shared storage/network
- **Service**: Abstraction exposing an application running on Pods, with stable IP/DNS
- **Deployment**: Manages a set of Pods for stateless workloads with rolling updates
- **StatefulSet**: Manages stateful applications with stable identity and storage
- **ConfigMap**: Non-confidential configuration data in key-value pairs
- **Secret**: Sensitive data like passwords, tokens, keys
- **PersistentVolume**: Cluster storage resource independent of Pod lifecycle
- **kubectl**: Command-line tool for communicating with the Kubernetes API
- **Namespace**: Virtual cluster within a physical cluster for resource isolation

## Common Patterns

```yaml
# Deployment with 3 replicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
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

```yaml
# Service exposing a Deployment
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

```bash
# Common kubectl commands
kubectl apply -f deployment.yaml    # Create/update from file
kubectl get pods                    # List pods
kubectl describe pod <name>         # Show pod details
kubectl logs <pod-name>             # View pod logs
kubectl exec -it <pod> -- /bin/sh   # Execute command in pod
kubectl scale deployment <name> --replicas=5  # Scale deployment
kubectl rollout status deployment/<name>      # Check rollout status
kubectl rollout undo deployment/<name>        # Rollback deployment
```
