# Scheduling, Preemption and Eviction

## Overview

In Kubernetes, **scheduling** refers to making sure that Pods are matched to Nodes so that the kubelet can run them. **Preemption** is the process of terminating Pods with lower Priority so that Pods with higher Priority can schedule on Nodes. **Eviction** is the process of terminating one or more Pods on Nodes.

## kube-scheduler

The kube-scheduler is the default scheduler for Kubernetes and runs as part of the control plane. It selects an optimal node to run newly created or not yet scheduled (unscheduled) pods.

### How it works

1. The scheduler watches for newly created Pods that have no Node assigned
2. For every Pod, the scheduler finds feasible Nodes that meet the Pod's scheduling requirements
3. The scheduler runs functions to score the feasible Nodes and picks the Node with the highest score
4. The scheduler notifies the API server about this decision in a process called **binding**

### Scheduling factors

- Individual and collective resource requirements
- Hardware / software / policy constraints
- Affinity and anti-affinity specifications
- Data locality
- Inter-workload interference
- Taints and tolerations
- Node selectors and node affinity

### Feasible nodes

Nodes that meet the scheduling requirements for a Pod are called **feasible nodes**. If none of the nodes are suitable, the pod remains unscheduled until the scheduler is able to place it.

### Custom schedulers

You can write your own scheduling component and use that instead of kube-scheduler. The scheduler can be configured with:
- Filter plugins (filtering out nodes)
- Score plugins (ranking remaining nodes)
- Bind plugins (binding a pod to a node)
- Various extension points via the scheduling framework

## Pod Priority and Preemption

Pods can have priority. Priority indicates the importance of a Pod relative to other Pods. If a Pod cannot be scheduled, the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the pending Pod possible.

### PriorityClass

A `PriorityClass` is a non-namespaced object that defines a mapping from a priority class name to an integer value of the priority.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "Use this priority class for high-priority workloads."
```

- The `value` field is required and can be any 32-bit integer from -2147483648 to 1000000000
- Larger numbers are reserved for built-in PriorityClasses (`system-cluster-critical`, `system-node-critical`)
- `globalDefault`: if true, this PriorityClass is used for Pods without a `priorityClassName`. Only one can exist with this set to true
- If no `globalDefault` is set, Pods without `priorityClassName` get priority zero

### How to use priority and preemption

1. Add one or more PriorityClasses
2. Create Pods (or Pod templates in Deployments, etc.) with `priorityClassName` set to one of the added PriorityClasses

### Non-preempting PriorityClass

Setting `preemptionPolicy: Never` on a PriorityClass makes it non-preempting. Pods with this policy will be placed ahead of lower-priority pods in the scheduling queue but will not trigger preemption of other pods.

### Pod priority effect on scheduling order

Pods are scheduled in priority order. Higher priority pods are scheduled before lower priority pods.

### Preemption

When a Pod cannot be scheduled, the scheduler attempts to preempt lower priority Pods. The scheduler:
1. Looks for victims (lower priority pods on nodes that could fit the pending pod)
2. Selects the node with the lowest priority pods to evict
3. Evicts the selected pods to make room

### Limitations of preemption

- Pods with `PodDisruptionBudget` may not be evicted if it would violate the budget
- Pods with `scheduler.alpha.kubernetes.io/critical-pod` annotation (deprecated) get special treatment
- Preemption may not always result in the preemptor being scheduled if conditions change

### Interactions with QoS

Pod priority and QoS classes are orthogonal. A high-priority BestEffort pod can preempt a low-priority Guaranteed pod.

## API-initiated Eviction

API-initiated eviction uses the Eviction API to create an `Eviction` object that triggers graceful pod termination. You can request eviction by:
- Calling the Eviction API directly (POST to `/api/v1/namespaces/{namespace}/pods/{name}/eviction`)
- Using `kubectl drain` which uses the Eviction API

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```

### API responses

- **200 OK**: eviction allowed, Eviction subresource created, Pod deleted
- **429 Too Many Requests**: eviction not allowed due to PodDisruptionBudget or rate limiting
- **500 Internal Server Error**: misconfiguration (e.g., multiple PDBs reference the same Pod)

### How eviction works

1. Pod resource is updated with a deletion timestamp and grace period
2. kubelet notices and starts graceful shutdown
3. Control plane removes Pod from EndpointSlice objects
4. After grace period expires, kubelet forcefully terminates the Pod
5. kubelet tells API server to remove the Pod resource
6. API server deletes the Pod resource

### Troubleshooting stuck evictions

If the Eviction API returns 429 or 500 persistently:
- Abort or pause the automated operation causing the issue
- Wait a while, then directly delete the Pod instead of using the Eviction API

## Node-pressure Eviction

Node-pressure eviction is the process by which the kubelet proactively terminates pods to reclaim resources on nodes. The kubelet monitors resources like memory, disk space, and filesystem inodes.

### Eviction signals

- `memory.available` — available memory
- `nodefs.available` — available space on the node's main filesystem
- `nodefs.inodesFree` — available inodes on the node's main filesystem
- `imagefs.available` — available space on the image storage filesystem
- `imagefs.inodesFree` — available inodes on the image storage filesystem
- `containerfs.available` — available space on the container filesystem
- `pid.available` — available process IDs

### Eviction thresholds

Thresholds can be **soft** (with grace periods) or **hard** (immediate eviction):

- **Soft eviction thresholds**: `eviction-soft` — met before grace period expires
- **Hard eviction thresholds**: `eviction-hard` — met immediately, no grace period
- **Soft grace period**: `eviction-soft-grace-period` — duration before soft eviction

### Node conditions

The kubelet maps eviction signals to node conditions:

| Signal | Node Condition |
|--------|---------------|
| `memory.available` | `MemoryPressure` |
| `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, `imagefs.inodesFree`, `containerfs.available`, `containerfs.inodesFree` | `DiskPressure` |
| `pid.available` | `PIDPressure` |

The control plane maps these node conditions to taints (e.g., `node.kubernetes.io/memory-pressure`).

### Pod selection for eviction

When evicting pods, the kubelet:
1. Considers pods relative to their QoS class (BestEffort first, then Burstable, Guaranteed last)
2. Within each QoS class, considers the pod's priority
3. Evicts the pod that is furthest below its request

### Self-healing behavior

The kubelet attempts to reclaim resources before evicting pods:
- Disk pressure: garbage collection of unused images and dead containers
- Memory pressure: evict pods as a last resort

### Good practices

- Use **DaemonSets** for node-critical components (they respect taints/tolerations)
- Set appropriate **resource requests** for pods
- Configure **soft eviction thresholds** with grace periods for smoother operations
- Monitor node conditions and taints

### Known issues

- kubelet may not observe memory pressure right away due to kernel delays
- `active_file` memory (file-backed memory) is not considered as available memory, which can cause premature OOM eviction
