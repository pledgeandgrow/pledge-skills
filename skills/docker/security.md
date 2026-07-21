# Docker Security Deep Dive

## Namespace Isolation

Docker uses Linux kernel namespaces to isolate containers:

| Namespace | Isolates | Flag |
|-----------|----------|------|
| PID | Process IDs | `--pid` |
| NET | Network stack, interfaces, routing | `--network` |
| IPC | System V IPC, POSIX message queues | `--ipc` |
| MNT | Mount points, filesystem | `--mount` |
| UTS | Hostname, domain name | `--uts` |
| USER | User and group IDs | `--userns` |
| CGROUP | Cgroup root directory | `--cgroupns` |

```bash
# Share host PID namespace (see host processes)
docker run --pid host alpine ps aux

# Share PID with another container
docker run --pid container:web alpine ps aux

# Share host network (no isolation)
docker run --network host nginx

# Share host IPC (shared memory)
docker run --ipc host myapp

# Share host UTS (hostname)
docker run --uts host myapp

# User namespace remap (root in container = non-root on host)
# Enable in daemon.json:
# "userns-remap": "default"
# or specific user:
# "userns-remap": "dockremap"
```

## Control Groups (cgroups)

Cgroups limit and isolate resource usage:

```bash
# Memory limit
docker run -m 512m myapp
docker run -m 512m --memory-reservation 256m myapp
docker run -m 512m --memory-swappiness=0 myapp
docker run -m 512m --memory-swap 1g myapp  # memory + swap

# CPU limits
docker run --cpus 1.0 myapp           # 1 CPU
docker run --cpus 2.5 myapp           # 2.5 CPUs
docker run --cpuset-cpus 0,1 myapp    # specific cores
docker run --cpu-shares 512 myapp     # relative weight (default 1024)

# Block I/O
docker run --blkio-weight 500 myapp
docker run --device-read-bps /dev/sda:10mb myapp
docker run --device-write-iops /dev/sda:100 myapp

# PIDs limit (prevent fork bombs)
docker run --pids-limit 100 myapp

# cgroup namespace
docker run --cgroupns host myapp      # share host cgroup namespace
docker run --cgroupns private myapp   # private cgroup namespace (default)
```

## Linux Capabilities

### Default Capabilities

Docker grants these capabilities by default:

```
CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE,
NET_RAW, SETFCAP, SETGID, SETPCAP, SETUID, SYS_CHROOT
```

### Adding/Dropping Capabilities

```bash
# Drop all, add only what's needed
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx

# Add specific capability
docker run --cap-add NET_ADMIN myapp
docker run --cap-add SYS_PTRACE myapp
docker run --cap-add SYS_ADMIN myapp  # dangerous — near root

# Drop specific
docker run --cap-drop MKNOD myapp
docker run --cap-drop CHOWN myapp
```

### Full Capability Reference

| Capability | Description |
|-----------|-------------|
| `AUDIT_CONTROL` | Enable/disable kernel auditing |
| `AUDIT_READ` | Read audit log |
| `AUDIT_WRITE` | Write to audit log |
| `BLOCK_SUSPEND` | Block system suspend |
| `CHOWN` | Change file ownership |
| `DAC_OVERRIDE` | Bypass file read/write/execute checks |
| `DAC_READ_SEARCH` | Bypass file read/search checks |
| `FOWNER` | Bypass ownership checks |
| `FSETID` | Set setuid/setgid bits |
| `IPC_LOCK` | Lock memory for IPC |
| `IPC_OWNER` | Bypass IPC ownership checks |
| `KILL` | Send signals to processes |
| `LEASE` | Establish leases on files |
| `LINUX_IMMUTABLE` | Set immutable flag |
| `MAC_ADMIN` | Override MAC (SELinux) |
| `MAC_OVERRIDE` | Override MAC policy |
| `MKNOD` | Create special files |
| `NET_ADMIN` | Network administration |
| `NET_BIND_SERVICE` | Bind to ports < 1024 |
| `NET_BROADCAST` | Broadcast to network |
| `NET_RAW` | Use raw sockets |
| `PERFMON` | Performance monitoring |
| `SETFCAP` | Set file capabilities |
| `SETGID` | Set GID |
| `SETPCAP` | Set process capabilities |
| `SETUID` | Set UID |
| `SYS_ADMIN` | System administration (dangerous) |
| `SYS_BOOT` | Boot/reboot |
| `SYS_CHROOT` | Use chroot |
| `SYS_MODULE` | Load/unload kernel modules |
| `SYS_NICE` | Modify process priority |
| `SYS_PACCT` | Configure process accounting |
| `SYS_PTRACE` | Trace processes |
| `SYS_RAWIO` | Raw I/O operations |
| `SYS_RESOURCE` | Override resource limits |
| `SYS_TIME` | Set system clock |
| `SYS_TTY_CONFIG` | Configure TTY devices |
| `WAKE_ALARM` | Trigger wake-up alarms |

## Seccomp Profiles

Seccomp filters system calls available to a container.

```bash
# Default seccomp profile (blocks dangerous syscalls)
docker run --security-opt seccomp=unconfined myapp  # disable
docker run --security-opt seccomp=/path/to/profile.json myapp

# Default blocked syscalls include:
# mount, umount, reboot, kexec_load, open_by_handle_at,
# pivot_root, swapon, swapoff, init_module, finit_module,
# kcmp, perf_event_open, fanotify_init, lookup_dcookie,
# bpf, ptrace, process_vm_readv, process_vm_writev,
# keyctl, add_key, request_key, inotify_add_watch,
# personality (some flags), create_module, query_module,
# get_kernel_syms, nfsservctl, ...
```

### Custom Seccomp Profile

```json
{
  "defaultAction": "SCMP_ACT_ALLOW",
  "architectures": [
    "SCMP_ARCH_X86_64",
    "SCMP_ARCH_X86",
    "SCMP_ARCH_X32"
  ],
  "syscalls": [
    {
      "names": ["mount", "umount2", "reboot"],
      "action": "SCMP_ACT_ERRNO",
      "args": [],
      "comment": "Block mount/umount/reboot",
      "includes": {},
      "excludes": {}
    }
  ]
}
```

```bash
# Use custom profile
docker run --security-opt seccomp=/etc/docker/seccomp-profile.json myapp
```

## AppArmor

AppArmor provides mandatory access control via profiles.

```bash
# Default Docker AppArmor profile
docker run --security-opt apparmor=docker-default myapp

# Disable AppArmor
docker run --security-opt apparmor=unconfined myapp

# Custom AppArmor profile
# /etc/apparmor.d/docker-custom
#include <tunables/global>
profile docker-custom flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>
  network inet tcp,
  network inet udp,
  network inet icmp,
  deny network raw,
  deny network packet,
  deny mount,
  deny /sys/[^f]*/** wklx,
  deny /sys/f[^s]*/** wklx,
  deny /sys/fs/[^c]*/** wklx,
  deny /sys/fs/c[^g]*/** wklx,
  deny /sys/fs/cg[^r]*/** wklx,
  deny /sys/firmware/** rwklx,
  deny /sys/kernel/security/** rwklx,
}

# Load profile
sudo apparmor_parser -r /etc/apparmor.d/docker-custom

# Use in container
docker run --security-opt apparmor=docker-custom myapp
```

## SELinux

SELinux provides type enforcement mandatory access control.

```bash
# Check if SELinux is enabled
getenforce

# Run with SELinux labels
docker run --security-opt label=type:container_t myapp
docker run --security-opt label=level:s0:c100,c200 myapp
docker run --security-opt label=user:system_u myapp

# Disable SELinux for container
docker run --security-opt label=disable myapp

# Volume mount with SELinux labels
docker run -v /host/path:/container:z myapp    # relabel shared
docker run -v /host/path:/container:Z myapp    # relabel private
# z = shared among containers
# Z = private to this container
```

## User Namespaces (userns-remap)

User namespace remapping maps container root to a non-root host user.

```json
// /etc/docker/daemon.json
{
  "userns-remap": "default"
}
```

```bash
# Create remap user
sudo useradd -r -M dockremap
echo "dockremap:100000:65536" | sudo tee -a /etc/subuid
echo "dockremap:100000:65536" | sudo tee -a /etc/subgid

# Restart Docker
sudo systemctl restart docker

# Now root in container = UID 100000 on host
# Container UIDs 0-65535 → Host UIDs 100000-165535

# Disable userns-remap for specific container
docker run --userns=host myapp  # dangerous, bypasses remap
```

## Docker Content Trust (DCT)

Content Trust uses Notary to sign and verify image integrity.

```bash
# Enable content trust globally
export DOCKER_CONTENT_TRUST=1

# Now all pulls verify signatures
docker pull myapp:latest  # fails if unsigned

# Push with signing
docker push myapp:latest  # prompts for passphrase

# Disable for specific command
DOCKER_CONTENT_TRUST=0 docker pull myapp:latest

# Configure in daemon.json (enforce at daemon level)
{
  "content-trust": {
    "trustpinning": {
      "mode": "enforce"
    }
  }
}
```

### Managing Trust Keys

```bash
# Generate delegation key
docker trust key generate alice

# Add signer to repository
docker trust signer add alice myapp:latest

# Inspect trust data
docker trust inspect myapp:latest
docker trust inspect --pretty myapp:latest

# Revoke trust
docker trust revoke myapp:latest

# Key storage
# Root key: ~/.docker/trust/private/root_keys/
# Repository keys: ~/.docker/trust/private/
# Passphrase protected
```

## No-New-Privileges

Prevents processes from gaining new privileges via setuid/setgid.

```bash
# Recommended for all containers
docker run --security-opt no-new-privileges myapp

# In Compose
services:
  web:
    security_opt:
      - no-new-privileges:true
```

## Read-Only Root Filesystem

```bash
# Read-only root, with writable tmpfs
docker run --read-only --tmpfs /tmp --tmpfs /run myapp

# In Compose
services:
  web:
    read_only: true
    tmpfs:
      - /tmp
      - /run
```

## Security Hardening Checklist

```bash
# 1. Run as non-root
docker run -u 1001:1001 myapp

# 2. Drop all capabilities
docker run --cap-drop ALL myapp

# 3. No new privileges
docker run --security-opt no-new-privileges myapp

# 4. Read-only filesystem
docker run --read-only --tmpfs /tmp myapp

# 5. Resource limits
docker run -m 512m --cpus 1.0 --pids-limit 100 myapp

# 6. Seccomp profile
docker run --security-opt seccomp=profile.json myapp

# 7. AppArmor/SELinux
docker run --security-opt apparmor=docker-custom myapp

# 8. Content trust
DOCKER_CONTENT_TRUST=1 docker run myapp:latest

# 9. User namespace remap
# Enable in daemon.json: "userns-remap": "default"

# 10. No --privileged
# Never use --privileged in production

# 11. Pin image digest
docker run myapp@sha256:abc123... myapp

# 12. Scan for vulnerabilities
docker scout cves myapp:latest
```

## Detecting Container Breakout

```bash
# Check if running in a container
cat /proc/1/cgroup | grep docker
# or
ls -la /.dockerenv

# Check capabilities
grep Cap /proc/1/status
capsh --print

# Check seccomp mode
grep Seccomp /proc/1/status

# Check namespace isolation
ls -la /proc/1/ns/

# Tools for security auditing:
# - docker bench security
docker run --rm --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib:ro \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/etc:ro \
  --label docker_bench_security \
  docker/docker-bench-security

# - Trivy
trivy image myapp:latest

# - Falco (runtime security)
# - Sysdig Secure
# - Aqua Security
# - Twistlock / Prisma Cloud
```
