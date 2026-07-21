# Kubernetes Security

## Pod Security Standards

### Overview
Pod Security Standards define three policy levels for Pod security:

### Privileged
- Purposely open, entirely unrestricted
- Aimed at system- and infrastructure-level workloads
- No restrictions on container isolation
- Can access host network, host PID, host IPC
- Can run as root, with privileged mode, with all capabilities
- No restrictions on volume types, host paths, or host ports

### Baseline
- Prevents known privilege escalations
- Provides baseline security for general-purpose workloads
- Prohibits: hostNetwork, hostPID, hostIPC, hostPath volumes, hostPorts
- Prohibits: privileged containers, additional Linux capabilities
- Prohibits: running as root (UID 0) without explicit override
- Prohibits: hostPath volumes, mounting docker socket
- Allows: non-privileged containers, specific volume types

### Restricted
- Most restrictive policy
- Aimed at security-critical applications
- Requires: runAsNonRoot: true
- Requires: seccompProfile set (RuntimeDefault or Localhost)
- Requires: drop ALL capabilities, only add NET_BIND_SERVICE if needed
- Requires: readOnlyRootFilesystem recommended
- Prohibits: privilege escalation, host namespaces, host paths
- Prohibits: hostNetwork, hostPID, hostIPC
- Prohibits: CAP_SYS_ADMIN, and most other capabilities

### Policy Instantiation
- Pod Security Standards are enforced via Pod Security Admission
- Can also be enforced via admission webhooks (OPA Gatekeeper, Kyverno)
- Namespace-level enforcement via labels

### Pod OS Field
- `.spec.os.name`: `linux` or `windows`
- Restricted policy has OS-specific requirements
- For Windows: different restrictions apply (no seccomp, no runAsNonRoot)

### User Namespaces
- Supported in Restricted policy
- Allows running containers with shifted UIDs
- Pod processes run as non-root inside container, root outside

## Pod Security Admission

### Overview
- Built-in admission controller that enforces Pod Security Standards
- Replaces deprecated PodSecurityPolicy (PSP)
- Available since Kubernetes 1.25 (GA)

### Pod Security Levels
- `privileged`: No restrictions
- `baseline`: Prevents known privilege escalations
- `restricted`: Hardened security profile

### Enforcement Modes
Three modes can be configured per namespace:

- **enforce**: Pods violating policy are rejected
- **audit**: Violations are logged as audit events (Pods still admitted)
- **warn**: Users get warnings via API response (Pods still admitted)

### Namespace Labels
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: latest
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: latest
```

### Version Skew
- `latest`: Use the latest installed version's policy
- `v1.X`: Use specific version's policy
- Allows gradual rollout of stricter policies

### Workload Resources and Pod Templates
- Pod Security Admission checks Pod templates in workload resources (Deployments, Jobs, etc.)
- Checks are performed at the controller level, not just Pod creation
- Warnings are returned to the user creating/updating the workload

### Exemptions
- `pod-security.kubernetes.io/enforce-exempt-namespace`: Exempt namespace
- `pod-security.kubernetes.io/audit-exempt-namespace`: Audit-exempt namespace
- `pod-security.kubernetes.io/warn-exempt-namespace`: Warn-exempt namespace
- Exemptions configured via admission controller configuration
- Username-based, runtimeClass-based, namespace-based exemptions

### Metrics
- `pod_security_status`: Number of Pod evaluations by mode and level
- `pod_security_violations`: Number of violations by mode, level, and action

## Security Context

### Pod-Level Security Context
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: nginx
```

### Container-Level Security Context
```yaml
containers:
- name: app
  image: nginx
  securityContext:
    runAsUser: 1000
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities:
      drop:
      - ALL
      add:
      - NET_BIND_SERVICE
```

### Key Fields
- `runAsUser`: UID to run the container process as
- `runAsGroup`: GID to run the container process as
- `runAsNonRoot`: Verify container runs as non-root
- `fsGroup`: Special group for volume access
- `allowPrivilegeEscalation`: Prevents gaining more privileges than parent
- `privileged`: Run in privileged mode (full host access)
- `readOnlyRootFilesystem`: Mount root filesystem as read-only
- `capabilities`: Add/drop Linux capabilities
- `seccompProfile`: Seccomp profile (RuntimeDefault, Localhost, Unconfined)

## RBAC (Role-Based Access Control)

### Overview
- Regulates access to Kubernetes resources based on roles
- Four RBAC objects: Role, ClusterRole, RoleBinding, ClusterRoleBinding

### Role (namespace-scoped)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

### ClusterRole (cluster-scoped)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

### RoleBinding
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### Verbs
- `get`, `list`, `watch`: Read operations
- `create`, `update`, `patch`, `delete`: Write operations
- `*`: All verbs
- `impersonate`: Act as another user

## Service Accounts

### Overview
- Identity for processes running in Pods
- Used by Pods to authenticate to the Kubernetes API
- Each namespace has a default ServiceAccount
- Auto-mounted into Pods at `/var/run/secrets/kubernetes.io/serviceaccount/`

### Creating a ServiceAccount
```bash
kubectl create serviceaccount my-sa
```

### Using ServiceAccount in a Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: my-sa
  containers:
  - name: app
    image: nginx
```

### Token-based Authentication
- ServiceAccount tokens are JWTs
- Tokens mounted as Secrets in Pods (v1.23 and earlier)
- Projected tokens via ServiceAccountToken volume (v1.24+)
- Tokens are audience and time-bound (expire automatically)

## TLS in Kubernetes

Transport Layer Security (TLS) protects traffic within a Kubernetes cluster.

### CertificateSigningRequest (CSR)

- Use the CertificateSigningRequest API to issue client certificates for API access
- Clients create a CSR object with a PEM-encoded PKCS#10 certificate request
- Signers (e.g., `kubernetes.io/kube-apiserver-client`) approve and sign the CSR
- Approved certificates can be used for kube-apiserver authentication

### Kubelet Certificate Rotation

- Kubelet can automatically rotate its client and serving certificates
- Enabled via `--rotate-certificates=true` (default: true)
- Kubelet requests new certificates before expiration via CSR API
- Client certs: used to authenticate to kube-apiserver
- Serving certs: used for HTTPS endpoint on the node

### Managing TLS Certificates in a Cluster

- Kubernetes requires TLS for all control plane communication
- Certificates needed: API server serving cert, API server client certs (kubelet, scheduler, controller-manager), etcd server/peer certs, kubelet serving certs
- Use tools: `openssl`, `cfssl`, `easyrsa`
- Certificate management tools: `cert-manager` (popular third-party operator)

### Manual CA Certificate Rotation

- Rotate CA certificates periodically for security
- Process: generate new CA, distribute new CA to all components, rotate serving certs, rotate client certs
- Requires careful ordering to avoid downtime
- Can use multiple CAs simultaneously during transition
