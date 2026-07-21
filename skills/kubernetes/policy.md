# Policy

## Resource Quotas

ResourceQuotas provide constraints that limit aggregate resource consumption per namespace. They prevent one team from using more than its fair share of cluster resources.

### How ResourceQuotas work

1. Different teams work in different namespaces (enforced via RBAC)
2. Cluster administrator creates at least one ResourceQuota for each namespace
3. Users create resources in the namespace; the quota system tracks usage
4. If creating or updating a resource violates a quota constraint, the request is rejected with HTTP 403 Forbidden
5. If quotas are enabled for cpu/memory, users must specify requests or limits for Pods

### Types of resource quota

**Infrastructure resources**:
- `requests.cpu` — total CPU requests
- `requests.memory` — total memory requests
- `limits.cpu` — total CPU limits
- `limits.memory` — total memory limits

**Extended resources**:
- `requests.nvidia.com/gpu` — total GPU requests

**Storage**:
- `requests.storage` — total storage requests
- `persistentvolumeclaims` — total number of PVCs
- `.storageclass.storage.k8s.io/requests.storage` — storage per StorageClass
- `.storageclass.storage.k8s.io/persistentvolumeclaims` — PVCs per StorageClass

**Object count** (by API kind):
- `count/pods`
- `count/services`
- `count/replicationcontrollers`
- `count/secrets`
- `count/configmaps`
- `count/persistentvolumeclaims`
- `count/deployments.apps`
- `count/replicasets.apps`
- `count/statefulsets.apps`
- `count/jobs.batch`
- `count/cronjobs.batch`

### Example ResourceQuota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: my-namespace
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "5"
    count/pods: "20"
```

### Quota scopes

ResourceQuotas can be scoped to limit which resources they apply to:

- **BestEffort** — only applies to BestEffort pods (no requests/limits)
- **NotBestEffort** — applies to pods with requests/limits set
- **Terminating** — applies to pods with `activeDeadlineSeconds >= 0`
- **NonTerminating** — applies to pods without `activeDeadlineSeconds`
- **PriorityClass** — applies to pods matching a specific PriorityClass
- **CrossNamespacePodAffinity** — applies to pods with cross-namespace affinity

### Quota and cluster capacity

ResourceQuotas are independent of cluster capacity. Quotas limit usage, not available capacity. If the cluster scales up, quotas remain the same until updated.

## LimitRange

A LimitRange ensures that a single object cannot monopolize all available resources within a namespace. It provides:

- **Default values** for resource requests/limits when not specified
- **Minimum and maximum** constraints on resource requests/limits
- **Default values** for PVC sizes
- **Ratio** between request and limit

### How LimitRange works

1. Administrator creates a LimitRange in a namespace
2. Users create objects (Pods, PVCs) in that namespace
3. The LimitRange admission controller applies default request/limit values for containers that don't set them
4. The LimitRange tracks usage to ensure it doesn't exceed min/max/ratio constraints
5. Violations result in HTTP 403 Forbidden

### Example LimitRange

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-mem-limit-range
  namespace: my-namespace
spec:
  limits:
  - default:
      cpu: 1
      memory: 512Mi
    defaultRequest:
      cpu: 0.5
      memory: 256Mi
    max:
      cpu: 2
      memory: 1Gi
    min:
      cpu: 100m
      memory: 128Mi
    type: Container
```

### LimitRange types

- `Container` — applies to individual containers
- `Pod` — applies to the aggregate of all containers in a pod
- `PersistentVolumeClaim` — applies to PVC storage requests

### Notes

- LimitRange validations occur only at Pod admission stage, not on running Pods
- If two or more LimitRange objects exist in a namespace, it is not deterministic which default value will be applied
- Use LimitRange with ResourceQuota to ensure pods have resource requirements even when users don't specify them

## PodDisruptionBudgets

A PodDisruptionBudget (PDB) limits the number of pods of a replicated application that are down simultaneously from voluntary disruptions.

### Purpose

PDBs protect applications from voluntary disruptions caused by:
- `kubectl drain` (node maintenance)
- Cluster autoscaler
- Application updates

PDBs do **not** protect against involuntary disruptions (node failure, kernel panic, OOM kill).

### Example PDB

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-app-pdb
  namespace: my-namespace
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: my-app
```

### Spec fields

- `minAvailable` — minimum number of pods that must remain available (integer or percentage)
- `maxUnavailable` — maximum number of pods that can be unavailable (integer or percentage)
- Only one of `minAvailable` or `maxUnavailable` can be specified

### How PDBs work with eviction

When the Eviction API is called:
- If evicting the pod would violate the PDB, the API server returns 429 Too Many Requests
- The eviction is retried later
- PDBs are respected by `kubectl drain` and cluster autoscaler

### PDB with controllers

PDBs work with workload controllers (Deployment, StatefulSet, ReplicaSet). The controller's desired replica count is used to calculate availability:
- `minAvailable: 2` means at least 2 pods must be running and ready
- `maxUnavailable: 1` means at most 1 pod can be unavailable at a time
