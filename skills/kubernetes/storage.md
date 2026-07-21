# Kubernetes Storage

## Persistent Volumes

### Introduction
- PersistentVolume (PV): Piece of storage in the cluster, provisioned by admin or dynamically via StorageClasses
- PersistentVolumeClaim (PVC): Request for storage by a user
- PVs have lifecycle independent of any individual Pod
- Abstracts storage details (NFS, iSCSI, cloud-specific) from consumption

### Lifecycle of a Volume and Claim

#### Provisioning
- **Static**: Admin creates PVs manually
- **Dynamic**: PVC triggers automatic provisioning via StorageClass

#### Binding
- PVC is matched to a PV based on size, access modes, and storage class
- Binding is one-to-one
- If no matching PV exists, PVC remains Pending (for dynamic provisioning, a PV is created)

#### Using
- Pod references PVC as a volume
- PVC must be bound before Pod can use it
- Kubernetes mounts the PV into the Pod's container

#### Reclaiming
- **Retain** (default): PV retained after PVC deletion; data preserved; PV must be manually reclaimed
- **Delete**: PV and underlying storage deleted when PVC is deleted
- **Recycle** (deprecated): Basic scrub (`rm -rf /thevolume/*`) before reuse

### PersistentVolume Properties

#### Capacity
- PV has storage capacity specified via `.spec.capacity.storage`

#### Volume Mode
- `Filesystem` (default): Mounted into Pods as a directory
- `Block`: Raw block device, no filesystem

#### Access Modes
- `ReadWriteOnce` (RWO): Mounted as read-write by a single node
- `ReadOnlyMany` (ROX): Mounted as read-only by many nodes
- `ReadWriteMany` (RWX): Mounted as read-write by many nodes
- `ReadWriteOncePod` (RWOP): Read-write by a single Pod (Kubernetes 1.22+)

#### Reclaim Policy
- `Retain`, `Delete`, `Recycle` (deprecated)

#### Phase
- `Available`: Not bound to a claim
- `Bound`: Bound to a claim
- `Released`: Claim deleted, but resource not yet reclaimed
- `Failed`: Automated reclamation failed

#### Node Affinity
- Constrains which nodes can access the PV
- Useful for topology-constrained storage (e.g., local volumes)

### PersistentVolumeClaim Properties
- `accessModes`: Requested access modes
- `volumeMode`: Filesystem or Block
- `resources.requests.storage`: Requested storage size
- `selector`: Filter PVs by labels
- `storageClassName`: Request a specific StorageClass

### Claims as Volumes
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myfrontend
    image: nginx
    volumeMounts:
    - mountPath: "/var/www/html"
      name: mypd
  volumes:
  - name: mypd
    persistentVolumeClaim:
      claimName: myclaim
```

### Expanding Persistent Volume Claims
- Supported for certain volume types (e.g., GCE PD, AWS EBS, Azure Disk, CSI)
- Set `allowVolumeExpansion: true` in StorageClass
- Edit PVC to request larger size; expansion happens automatically

### Volume Snapshots
- VolumeSnapshot: Snapshot of a volume at a specific point in time
- VolumeSnapshotClass: Defines how snapshots are taken
- Restore: Create new PVC from snapshot using `dataSource`

### Volume Cloning
- Create a new PVC from an existing PVC using `dataSource`
- Clone is a duplicate of the original volume

## StorageClasses

### Overview
- Provides a way for administrators to describe classes of storage
- Different classes map to QoS levels, backup policies, or arbitrary policies
- Kubernetes is unopinionated about what classes represent

### StorageClass Object
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: low-latency
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
provisioner: csi-driver.example-vendor.example
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
- discard
volumeBindingMode: WaitForFirstConsumer
parameters:
  guaranteedReadWriteLatency: "true"
```

### Fields

#### Provisioner
- Determines what volume plugin is used for provisioning PVs
- CSI (Container Storage Interface) drivers are the recommended approach
- Built-in provisioners are being deprecated in favor of CSI

#### Reclaim Policy
- `Delete` (default for dynamically provisioned) or `Retain`

#### Volume Expansion
- `allowVolumeExpansion: true` allows PVC resizing

#### Mount Options
- List of mount options applied to dynamically provisioned PVs

#### Volume Binding Mode
- `Immediate` (default): PV created/bound as soon as PVC is created
- `WaitForFirstConsumer`: PV binding delayed until Pod using PVC is scheduled
  - Ensures PV is in the same topology as the Pod

#### Allowed Topologies
- Constrains where dynamically provisioned PVs are created
- Uses node affinity-like topology constraints

#### Parameters
- Provisioner-specific parameters
- Common provisioners: AWS EBS, AWS EFS, NFS, vSphere, Azure Disk, Azure File, Portworx, Local
- CSI drivers have their own parameter sets

### Default StorageClass
- Mark with annotation: `storageclass.kubernetes.io/is-default-class: "true"`
- When PVC doesn't specify `storageClassName`, default is used
- If multiple defaults exist, most recently created one is used
- PVCs created before a default exists remain unbound until a default is set

## Volume Types

### Common Volume Types
- **emptyDir**: Empty directory, lifetime tied to Pod, good for scratch space
- **hostPath**: Mounts file/directory from host node's filesystem (security risk)
- **configMap**: Injects ConfigMap data as files
- **secret**: Injects Secret data as files
- **persistentVolumeClaim**: Mounts a PVC
- **nfs**: NFS share
- **csi**: CSI driver volume
- **projected**: Projects multiple volume sources into one directory

### CSI (Container Storage Interface)
- Standard for exposing storage systems to container orchestration systems
- Replaces in-tree volume plugins
- Third-party CSI drivers provide storage integration
- Installed as cluster addons (DaemonSet, Deployment, etc.)
