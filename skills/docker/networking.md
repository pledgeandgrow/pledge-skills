# Docker Networking

## Network Drivers

| Driver | Description | Use Case |
|--------|-------------|----------|
| `bridge` | Default, virtual network on host | Standalone containers |
| `host` | Use host network directly | Maximum performance, no isolation |
| `none` | No networking | Isolated batch jobs |
| `overlay` | Multi-host network (Swarm) | Swarm services across nodes |
| `macvlan` | Assign MAC address to container | Legacy apps needing physical network |
| `ipvlan` | L2/L3 mode, no MAC assignment | Advanced network integration |

## Bridge Networks

### Default Bridge

```bash
# Default bridge network (pre-created)
docker run --network bridge nginx

# Limitations of default bridge:
# - No automatic DNS resolution between containers
# - No container name-based service discovery
# - Less secure (all containers share default bridge)
```

### User-Defined Bridge

```bash
# Create a user-defined bridge
docker network create mynet
docker network create --driver bridge mynet

# With subnet
docker network create \
  --subnet 10.0.0.0/24 \
  --gateway 10.0.0.1 \
  mynet

# Run containers on the network
docker run -d --name web --network mynet nginx
docker run -d --name db --network mynet postgres:17

# DNS resolution works automatically
# web can connect to db using hostname "db"
# db can connect to web using hostname "web"

# Connect a running container to a network
docker network connect mynet existing_container

# Disconnect
docker network disconnect mynet existing_container
```

### Benefits of User-Defined Bridge

- **Automatic DNS**: Containers resolve each other by name
- **Better isolation**: Only containers on same network can communicate
- **Dynamic attachment**: Connect/disconnect without restarting
- **Configurable**: Custom subnet, gateway, IP range

## Port Mapping

```bash
# Publish to random host port
docker run -P nginx
# Check assigned port: docker port CONTAINER

# Publish specific port
docker run -p 8080:80 nginx          # host:container
docker run -p 8080:80/tcp nginx      # explicit TCP
docker run -p 8080:80/udp nginx      # UDP
docker run -p 8080:80 -p 8443:443 nginx  # multiple ports

# Bind to specific address
docker run -p 127.0.0.1:8080:80 nginx
docker run -p 0.0.0.0:8080:80 nginx

# Range
docker run -p 8000-8100:8000-8100 nginx

# IPv6
docker run -p [::1]:8080:80 nginx
```

### Compose Port Mapping

```yaml
services:
  web:
    ports:
      - "8080:80"
      - "127.0.0.1:3000:3000"
      - target: 443
        published: "8443"
        protocol: tcp
        mode: host
```

## Host Network

```bash
# Use host network directly — no port mapping needed
docker run --network host nginx

# Container uses host's IP and ports directly
# No isolation, highest performance
# Port conflicts possible

# Useful for:
# - Performance-critical applications
# - Network monitoring tools
# - Applications needing raw network access
```

## None Network

```bash
# No networking at all
docker run --network none nginx

# Useful for:
# - Batch processing jobs
# - Security-sensitive operations
# - Testing without network dependencies
```

## Overlay Networks (Swarm)

```bash
# Initialize swarm first
docker swarm init --advertise-addr 10.0.0.1

# Create overlay network
docker network create --driver overlay myoverlay
docker network create --driver overlay --attachable myoverlay

# --attachable allows standalone containers to join
docker run -d --network myoverlay --name web nginx

# Deploy service on overlay
docker service create --name web --network myoverlay --replicas 3 -p 80:80 nginx
```

## Macvlan Network

```bash
# Create macvlan — containers get their own MAC/IP
docker network create -d macvlan \
  --subnet 192.168.1.0/24 \
  --gateway 192.168.1.1 \
  -o parent=eth0 \
  mymacvlan

# Run with specific IP
docker run -d --network mymacvlan --ip 192.168.1.100 nginx

# Use cases:
# - Legacy applications expecting physical network
# - DHCP-based applications
# - Network monitoring tools
```

## IPvlan Network

```bash
# L2 mode (default) — containers share parent MAC, have unique IPs
docker network create -d ipvlan \
  --subnet 192.168.1.0/24 \
  --gateway 192.168.1.1 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  myipvlan

# L3 mode — containers have unique IPs, routed by parent
docker network create -d ipvlan \
  --subnet 192.168.1.0/24 \
  -o parent=eth0 \
  -o ipvlan_mode=l3 \
  myipvlan

# Run with specific IP
docker run -d --network myipvlan --ip 192.168.1.100 nginx

# Differences from macvlan:
# - No unique MAC address (shares parent's MAC)
# - L3 mode: routing instead of switching
# - Works with switches that restrict MAC learning
# - Better for cloud environments (AWS, GCP)
```

## Gateway Priority

```bash
# When connected to multiple networks, control default gateway
docker run -d \
  --network name=gwnet,gw-priority=1 \
  --network name=internal,gw-priority=0 \
  --name web nginx

# Connect with priority
docker network connect --gw-priority 1 gwnet web

# Highest gw-priority wins as default gateway
# Default gw-priority is 0
```

## DNS and Service Discovery

```bash
# User-defined networks have built-in DNS
docker network create appnet
docker run -d --name api --network appnet myapi
docker run -d --name web --network appnet nginx

# Inside "web" container:
# curl http://api:3000  → resolves to api container's IP

# Network aliases (multiple names)
docker run -d --network appnet --network-alias backend --network-alias api myapi
# Both "backend" and "api" resolve to this container

# Compose with aliases
```

```yaml
services:
  api:
    image: myapi
    networks:
      appnet:
        aliases:
          - backend
          - api-server
```

## Embedded DNS Server

```
# Docker has an embedded DNS server at 127.0.0.11
# Available on user-defined networks only

# Inside a container:
cat /etc/resolv.conf
# nameserver 127.0.0.11

# DNS resolution:
# 1. Container name → container IP
# 2. Service name (Compose) → container IP(s)
# 3. Network alias → container IP
# 4. External hostnames → forwarded to host DNS
```

## Custom DNS

```bash
# Set custom DNS servers
docker run --dns 8.8.8.8 --dns 8.8.4.4 nginx

# Set DNS search domains
docker run --dns-search example.com nginx

# Add hosts entries
docker run --add-host api.example.com:10.0.0.5 nginx
docker run --add-host host.docker.internal:host-gateway nginx

# Global DNS config
# /etc/docker/daemon.json:
{
  "dns": ["8.8.8.8", "8.8.4.4"],
  "dns-search": ["example.com"]
}
```

## host.docker.internal

```bash
# Access host services from container
docker run --add-host host.docker.internal:host-gateway nginx

# Inside container:
# curl http://host.docker.internal:3000  → host's port 3000

# macOS and Windows: built-in
# Linux: requires --add-host flag or daemon.json:
{
  "bip": "10.0.0.1/24"
}
```

## Network Inspection

```bash
# Inspect a network
docker network inspect mynet

# See containers on a network
docker network inspect --format '{{json .Containers}}' mynet | jq

# List networks by driver
docker network ls --filter driver=bridge

# Find a container's IP
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER

# Find all IPs on a network
docker network inspect mynet --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
```

## Compose Networking

```yaml
services:
  web:
    build: .
    networks:
      - frontend
      - backend
    ports:
      - "80:80"

  api:
    build: .
    networks:
      - backend
    ports:
      - "3000:3000"

  db:
    image: postgres:17
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # no external access
  existing:
    external: true
    name: my-existing-network
```

## Troubleshooting

```bash
# Check container network settings
docker inspect CONTAINER --format '{{json .NetworkSettings}}'

# Test connectivity from container
docker exec -it CONTAINER ping db
docker exec -it CONTAINER curl http://api:3000
docker exec -it CONTAINER nslookup db

# Check port bindings
docker port CONTAINER

# View iptables rules (bridge networks)
sudo iptables -t nat -L -n

# Packet capture
docker run --rm --net=host --cap-add=NET_ADMIN nicolaka/netshoot tcpdump -i any port 80

# Network namespace debugging
docker run --rm --net=container:TARGET nicolaka/netshoot ss -tlnp
```
