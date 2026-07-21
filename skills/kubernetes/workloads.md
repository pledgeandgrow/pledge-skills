# Kubernetes Workloads

## Pods

### What is a Pod?
- Smallest deployable unit of computing in Kubernetes
- Group of one or more containers with shared storage and network resources
- Contents are always co-located and co-scheduled
- Shared context: Linux namespaces, cgroups, isolation facets
- Similar to a set of containers with shared namespaces and shared filesystem volumes

### Pod Usage Patterns
- **One-container-per-Pod**: Most common; Pod wraps a single container
- **Multi-container Pod**: Tightly coupled containers sharing resources (advanced use case)
- Pods are generally not created directly; use workload resources (Deployments, StatefulSets, etc.)

### Example Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

### Pod Templates
- Workload resources use Pod templates (`spec.template`) to create Pods
- Templates define the Pod spec that controllers use to create new Pods

### Pod Security Settings
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
  containers:
  - name: sec-ctx-demo
    image: busybox
    command: ["sh", "-c", "sleep 1h"]
```

### Resource Requests and Limits
- **Requests**: What the container is guaranteed to get; used for scheduling
- **Limits**: Maximum amount a container can use; enforced by kubelet
- CPU limits enforced by throttling; memory limits enforced by OOM kills
- Common resources: CPU and memory (RAM)

### Static Pods
- Managed directly by kubelet on a specific node
- Not observed by the API server
- Main use: running self-hosted control plane components
- Always bound to one kubelet on a specific node

### Container Probes
- **Liveness**: Determines if container is running; failure triggers restart
- **Readiness**: Determines if container is ready for traffic; failure removes from Service
- **Startup**: Determines if container has started; disables other probes until success
- Types: `exec`, `httpGet`, `tcpSocket`, `grpc`

### Pod Lifecycle
- **Pending**: Pod accepted but containers not yet created
- **Running**: At least one container running
- **Succeeded**: All containers terminated successfully (won't restart)
- **Failed**: All containers terminated, at least one failed
- **Unknown**: Pod state cannot be determined (communication issue)

## Deployments

### Use Cases
- Rollout a ReplicaSet
- Declare new state (updates PodTemplateSpec, creates new ReplicaSet)
- Rollback to earlier revision
- Scale up for more load
- Pause/resume rollout for multiple fixes
- Use status as indicator of rollout health
- Clean up older ReplicaSets

### Example Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
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

### Updating a Deployment
- Update PodTemplateSpec to trigger a new rollout
- New ReplicaSet is created; old is scaled down gradually
- Rolling updates ensure controlled rate of Pod replacement
- Each new ReplicaSet updates the revision

### Rolling Back
- `kubectl rollout undo deployment/<name>`: Rollback to previous revision
- `kubectl rollout history deployment/<name>`: View rollout history
- `kubectl rollout undo deployment/<name> --to-revision=N`: Rollback to specific revision

### Scaling
- `kubectl scale deployment/<name> --replicas=N`
- Proportional scaling: handles multiple replicas changes simultaneously

### Pausing and Resuming
- `kubectl rollout pause deployment/<name>`
- Apply multiple fixes while paused
- `kubectl rollout resume deployment/<name>`

### Deployment Status
- **Progressing**: Deployment is being rolled out
- **Complete**: All replicas updated and available
- **Failed**: Rollout cannot complete (insufficient quota, readiness probe failures, image errors)

### Deployment Spec Fields
- `.spec.replicas`: Desired number of Pods (default 1)
- `.spec.selector`: Label selector for Pods (must match template labels)
- `.spec.strategy`: RollingUpdate (default) or Recreate
  - `maxSurge`: Max extra Pods during rollout (default 25%)
  - `maxUnavailable`: Max unavailable Pods during rollout (default 25%)
- `.spec.revisionHistoryLimit`: Old ReplicaSets to retain (default 10)
- `.spec.progressDeadlineSeconds`: Max time for rollout before failure reported
- `.spec.minReadySeconds`: Min time Pod must be ready before considered available
- `.spec.paused`: Pauses rollout when true

### Canary Deployment
- Create multiple Deployments for different releases
- Use label selectors to route subset of traffic to new version

## StatefulSets

### When to Use
- Stable, unique network identifiers
- Stable, persistent storage
- Ordered, graceful deployment and scaling
- Ordered, automated rolling updates

### Limitations
- Storage must be provisioned by PersistentVolume Provisioner or pre-provisioned
- Deleting/scaling down does not delete volumes (data safety)
- Requires a Headless Service for network identity
- No guarantee on Pod termination when StatefulSet is deleted
- Rolling Updates with OrderedReady can get stuck requiring manual intervention

### Components
- **Headless Service**: Provides network identity for Pods
- **VolumeClaimTemplates**: Provides stable storage via PVCs
- **Pod Selector**: Must match template labels

### Pod Identity
- **Ordinal Index**: Pods named `<statefulset-name>-<ordinal>` (0, 1, 2, ...)
- **Start Ordinal**: Can be configured with `.spec.ordinals.start`
- **Stable Network ID**: `<pod-name>.<service-name>.<namespace>.svc.cluster.local`
- **Stable Storage**: Each Pod gets its own PVC from VolumeClaimTemplates

### Deployment and Scaling Guarantees
- Ordered: Pods created sequentially (0, 1, 2, ...)
- Parallel: Pods created in parallel (configurable `.spec.podManagementPolicy`)
- Pod Management Policies: `OrderedReady` (default) or `Parallel`

### Update Strategies
- **RollingUpdate** (default): Updates Pods in reverse ordinal order
  - **Partitioned**: Only update Pods with ordinal >= partition
  - **MaxUnavailable**: Controls how many Pods can be unavailable during update
  - **Forced rollback**: Manual intervention may be needed
- **OnDelete**: Only updates when Pod is manually deleted

### PVC Retention
- `.spec.persistentVolumeClaimRetentionPolicy`: Controls PVC behavior on deletion
- WhenDeleted: Retain (default) or Delete
- WhenScaled: Retain (default) or Delete

## DaemonSets

### Purpose
- Ensures a copy of a Pod runs on all (or some) nodes
- Used for node-local facilities: networking helpers, log collectors, monitoring agents, storage daemons

### Example DaemonSet
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
  labels:
    k8s-app: fluentd-logging
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v5.0.1
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
```

### Scheduling Daemon Pods
- Scheduled by DaemonSet controller (not kube-scheduler) by default
- Taints and tolerations: DaemonSet Pods get tolerations for node taints
- Can use nodeSelector, nodeAffinity, or scheduling gates for targeting

### Updating a DaemonSet
- **RollingUpdate** (default): Updates Pods on each node gradually
  - `maxUnavailable`: Max unavailable Pods during update
- **OnDelete**: Only updates when Pod is manually deleted

### Alternatives
- Init scripts (outside Kubernetes)
- Bare Pods (no self-healing)
- Static Pods (managed by kubelet)
- Deployments (for replicated stateless workloads)

## Jobs

### Purpose
- Run one-off tasks to completion and stop
- Creates Pods that run until successful termination
- Failed Pods are retried until completion or backoff limit reached

### Example Job
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

### Job Spec Fields
- `.spec.parallelism`: Max number of Pods running in parallel (default 1)
- `.spec.completions`: Desired number of successful completions (default 1)
- `.spec.backoffLimit`: Max retries before marking Job failed (default 6)
- `.spec.activeDeadlineSeconds`: Max duration before timeout
- `.spec.ttlSecondsAfterFinished`: Auto-cleanup of finished Jobs
- `.spec.completionMode`: `NonIndexed` (default) or `Indexed`
- `.spec.podFailurePolicy`: Rules for handling Pod failures
- `.spec.successPolicy`: Rules for when to consider Job successful (Indexed Jobs)

### Parallel Execution
- Set `.spec.parallelism` > 1 for parallel Pods
- Set `.spec.completions` for total successful completions needed
- Indexed Jobs: each Pod gets an index (0 to completions-1)

### Handling Failures
- **Pod backoff failure policy**: Exponential backoff with `.spec.backoffLimit`
- **Pod failure policy**: Custom rules based on exit codes or conditions
- **Backoff limit per index**: Separate backoff for each index in Indexed Jobs

### Job Patterns
- **Single Job**: One Pod to completion
- **Parallel Jobs with work queue**: External queue, multiple workers
- **Indexed Jobs**: Each Pod handles a specific index

### CronJobs
- Schedule Jobs on a recurring schedule using cron format
- `.spec.schedule`: Cron expression (e.g., `*/1 * * * *`)
- `.spec.concurrencyPolicy`: Allow (default), Forbid, or Replace
- `.spec.startingDeadlineSeconds`: Deadline for starting if missed
- `.spec.suspend`: Pause future executions

### Clean Up
- TTL mechanism: `.spec.ttlSecondsAfterFinished` auto-deletes finished Jobs
- Manual cleanup: `kubectl delete job <name>`

### Advanced Usage
- Suspending Jobs: `.spec.suspend: true`
- Mutable scheduling directives: Update scheduling constraints on suspended Jobs
- Job tracking with finalizers: Ensures accurate Pod tracking
- Elastic Indexed Jobs: Can scale completions for Indexed Jobs
