# Daemon Configuration and Logging

## daemon.json Reference

The Docker daemon configuration file at `/etc/docker/daemon.json`:

```json
{
  "data-root": "/var/lib/docker",
  "debug": false,
  "live-restore": true,
  "shutdown-timeout": 15,
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 5,

  "features": {
    "buildkit": true
  },

  "dns": ["8.8.8.8", "8.8.4.4"],
  "dns-search": ["example.com"],
  "no-proxy": "*.local,169.254.169.254",

  "bip": "10.0.0.1/24",
  "fixed-cidr": "10.0.0.0/24",
  "default-address-pools": [
    {"base": "10.10.0.0/16", "size": 24}
  ],

  "iptables": true,
  "ip6tables": false,
  "ip-forward": true,
  "ip-masq": true,
  "userland-proxy": false,
  "userns-remap": "default",

  "insecure-registries": ["registry.local:5000"],
  "registry-mirrors": ["https://mirror.gcr.io"],

  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.size=1G"
  ],

  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production",
    "env": "os,customer"
  },

  "default-runtime": "runc",
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },

  "default-shm-size": "64M",
  "default-ipc-mode": "private",
  "default-cgroupns-mode": "private",
  "default-ulimits": {
    "nofile": {"Hard": 65536, "Soft": 1024}
  },

  "default-network-opts": {
    "bridge": {
      "com.docker.network.bridge.enable_icc": true
    }
  },

  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "10GB"
    }
  },

  "cgroup-parent": "/docker",
  "oom-score-adjust": -500
}
```

### Applying Configuration

```bash
# After editing daemon.json, restart Docker
sudo systemctl restart docker

# Verify configuration
docker info
docker info --format '{{json .}}' | jq

# Check effective config
docker system info
```

## Logging Drivers

| Driver | Description | Default |
|--------|-------------|---------|
| `json-file` | JSON logs to file | Yes |
| `local` | Protobuf logs, log rotation | No |
| `syslog` | Syslog facility | No |
| `journald` | systemd journal | No |
| `gelf` | Graylog Extended Log Format | No |
| `fluentd` | Fluentd collector | No |
| `awslogs` | Amazon CloudWatch Logs | No |
| `splunk` | Splunk HTTP Event Collector | No |
| `gcplogs` | Google Cloud Logging | No |
| `etwlogs` | Windows ETW (Windows only) | No |
| `none` | No logs | No |

### json-file (default)

```bash
# Per-container log rotation
docker run --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  --log-opt labels=production \
  --log-opt env=APP_VERSION \
  nginx

# Global default in daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### local

```bash
# Optimized for local storage with rotation
docker run --log-driver local \
  --log-opt max-size=10m \
  --log-opt max-file=5 \
  nginx
```

### syslog

```bash
docker run --log-driver syslog \
  --log-opt syslog-address=unix:///dev/log \
  --log-opt syslog-facility=daemon \
  --log-opt tag="{{.Name}}/{{.ID}}" \
  nginx

# Remote syslog
docker run --log-driver syslog \
  --log-opt syslog-address=tcp://192.168.1.100:514 \
  nginx

# TLS syslog
docker run --log-driver syslog \
  --log-opt syslog-address=tcp+tls://syslog.example.com:514 \
  nginx
```

### journald

```bash
docker run --log-driver journald \
  --log-opt tag=myapp \
  nginx

# View logs
journalctl CONTAINER_NAME=myapp
```

### fluentd

```bash
docker run --log-driver fluentd \
  --log-opt fluentd-address=localhost:24224 \
  --log-opt tag=docker.{{.Name}} \
  nginx

# With async options
docker run --log-driver fluentd \
  --log-opt fluentd-address=localhost:24224 \
  --log-opt fluentd-async-connect=true \
  --log-opt fluentd-buffer-limit=8192 \
  --log-opt fluentd-retry-wait=1s \
  nginx
```

### awslogs (CloudWatch)

```bash
docker run --log-driver awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=myapp-logs \
  --log-opt awslogs-stream-prefix=prod \
  nginx

# With credentials
docker run --log-driver awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=myapp-logs \
  --log-opt awslogs-access-key-id=$AWS_KEY \
  --log-opt awslogs-secret-access-key=$AWS_SECRET \
  nginx
```

### splunk

```bash
docker run --log-driver splunk \
  --log-opt splunk-token=YOUR_TOKEN \
  --log-opt splunk-url=https://splunk.example.com:8088 \
  --log-opt splunk-source=myapp \
  --log-opt splunk-sourcetype=json \
  nginx
```

### gcplogs (Google Cloud)

```bash
docker run --log-driver gcplogs \
  --log-opt gcp-project=my-project \
  --log-opt gcp-log-cmd=nginx \
  nginx
```

### none

```bash
# Disable logging entirely
docker run --log-driver none nginx
```

## Remote Daemon Access

### Enable TCP with TLS

```json
// /etc/docker/daemon.json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/ca.pem",
  "tlscert": "/etc/docker/server-cert.pem",
  "tlskey": "/etc/docker/server-key.pem"
}
```

```bash
# Generate TLS certificates
# Create CA
openssl genrsa -aes256 -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

# Create server key and cert
openssl genrsa -out server-key.pem 4096
openssl req -subj "/CN=$HOST" -new -key server-key.pem -out server.csr
echo subjectAltName = IP:10.0.0.1,IP:127.0.0.1 > extfile.cnf
openssl x509 -req -days 365 -in server.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem -extfile extfile.cnf

# Create client key and cert
openssl genrsa -out key.pem 4096
openssl req -subj '/CN=client' -new -key key.pem -out client.csr
echo extendedKeyUsage = clientAuth > extfile-client.cnf
openssl x509 -req -days 365 -in client.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out cert.pem -extfile extfile-client.cnf

# Connect to remote daemon
docker --tlsverify \
  --tlscacert=ca.pem \
  --tlscert=cert.pem \
  --tlskey=key.pem \
  -H tcp://10.0.0.1:2376 \
  ps
```

## Rootless Mode

Run Docker daemon without root privileges for better security.

```bash
# Install rootless Docker
dockerd-rootless-setuptool.sh install

# Start rootless Docker
systemctl --user start docker
systemctl --user enable docker

# Set DOCKER_HOST
export DOCKER_HOST=unix:///run/user/1000/docker.sock

# Verify
docker info

# Rootless limitations:
# - No --privileged
# - No --cap-add (most capabilities)
# - No --network=host
# - No --device (limited)
# - cgroups v2 required
# - No overlayfs on some kernels (use fuse-overlayfs)
# - Port forwarding < 1024 requires sysctl:
#   sudo sysctl net.ipv4.ip_unprivileged_port_start=80
```

## Docker Context for Remote Daemons

```bash
# Create context for remote daemon
docker context create remote \
  --docker "host=ssh://user@server"
  # or
  --docker "host=tcp://server:2376,ca=ca.pem,cert=cert.pem,key=key.pem"

# Switch context
docker context use remote

# Use context for single command
docker --context remote ps

# List contexts
docker context ls

# Remove
docker context rm remote
```
