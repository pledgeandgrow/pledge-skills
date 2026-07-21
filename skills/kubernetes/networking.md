# Kubernetes Networking

## Services

### What is a Service?
- Abstraction that exposes an application running on Pods behind a single endpoint
- Provides stable IP address and DNS name
- Load balances traffic across matching Pods
- Decouples frontend from backend Pod instances

### Defining a Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

### Service Types

#### ClusterIP (default)
- Exposes Service on cluster-internal IP
- Only reachable from within the cluster
- Default Service type

#### NodePort
- Exposes Service on each Node's IP at a static port
- Port range: 30000-32767 (default)
- ClusterIP Service is automatically created
- Can be accessed from outside via `<NodeIP>:<NodePort>`

#### LoadBalancer
- Cloud provider's load balancer is provisioned
- Exposes Service externally using cloud LB
- NodePort and ClusterIP Services created automatically
- Cloud-specific implementation

#### ExternalName
- Maps Service to a DNS name (not a selector)
- Returns a CNAME record for the external name
- No proxying of any kind

### Services Without Selectors
- Can define a Service without a selector
- Use EndpointSlices to manually map to backend IPs
- Useful for routing to services outside the cluster

### EndpointSlices
- Track the IP addresses of Pods matching a Service's selector
- Replaces deprecated Endpoints API
- Scales better for large number of endpoints

### Multi-port Services
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8443
```

### Headless Services
- Set `clusterIP: None` for headless Service
- No load balancing or proxying
- DNS returns Pod IPs directly
- Used by StatefulSets for stable Pod identities
- With selectors: DNS returns Pod IPs
- Without selectors: DNS returns CNAME to externalName

### Service Discovery
- **Environment variables**: Services inject env vars into Pods (e.g., `<SVCNAME>_SERVICE_HOST`, `<SVCNAME>_SERVICE_PORT`)
- **DNS**: Cluster DNS (CoreDNS) provides A/AAAA records for Services
  - `<service-name>.<namespace>.svc.cluster.local`

### Virtual IP Addressing
- Services use virtual IPs (not real Pod IPs)
- kube-proxy maintains iptables/IPVS rules for VIP → Pod IP mapping
- Traffic policies:
  - `Cluster`: Traffic can go to any endpoint (default)
  - `Local`: Traffic stays on the same node (preserves client IP)
- **Traffic distribution**: `PreferClose` routes to topologically closest endpoints
- **Session stickiness**: `clientIP` based session affinity with timeout

### External IPs
- Service can be reached via external IPs if they route to cluster nodes
- Traffic on external IP + port is routed to Service endpoints

## Ingress

### What is Ingress?
- Exposes HTTP/HTTPS routes from outside the cluster to Services within
- Traffic routing controlled by rules on the Ingress resource
- Configurable: externally-reachable URLs, load balancing, SSL/TLS termination, name-based virtual hosting
- Does not expose arbitrary ports/protocols (use NodePort/LoadBalancer for non-HTTP)

### Prerequisites
- Must have an Ingress controller (e.g., NGINX Ingress, Traefik, HAProxy)
- Only creating an Ingress resource has no effect without a controller

### Terminology
- **Node**: Worker machine in the cluster
- **Cluster**: Set of nodes managed by Kubernetes
- **Edge router**: Router enforcing firewall policy
- **Cluster network**: Links facilitating communication within cluster
- **Service**: Kubernetes Service identifying Pods via label selectors

### The Ingress Resource
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx-example
  rules:
  - http:
      paths:
      - path: /testpath
        pathType: Prefix
        backend:
          service:
            name: test
            port:
              number: 80
```

### Ingress Rules
- Each rule contains: host (optional), list of paths, backend service
- If no host specified, rule applies to all inbound HTTP traffic
- Path types: `Exact`, `Prefix`, `ImplementationSpecific`

### Default Backend
- Handles traffic not matching any rule
- Specified in `spec.defaultBackend`

### Ingress Class
- Multiple Ingress controllers can run simultaneously
- `ingressClassName` field links Ingress to specific controller
- Default IngressClass: marked with `ingressclass.kubernetes.io/is-default-class: "true"`

### Types of Ingress

#### Single Service Ingress
- All traffic routed to one Service

#### Simple Fanout
- Different paths route to different Services
- e.g., `/foo` → service1, `/bar` → service2

#### Name-based Virtual Hosting
- Different hostnames route to different Services
- e.g., `foo.example.com` → service1, `bar.example.com` → service2

### TLS
- Configure TLS via `spec.tls` with a Secret containing TLS cert and key
```yaml
spec:
  tls:
  - hosts:
    - https-example.foo.com
    secretName: testsecret-tls
```

### Load Balancing
- Ingress controller handles load balancing
- Default: round-robin
- Session affinity, weighted load balancing: controller-specific features

## Network Policies

### Prerequisites
- Must use a network plugin that supports NetworkPolicy enforcement
- Creating a NetworkPolicy without a supporting controller has no effect

### Pod Isolation
- Two types: egress isolation and ingress isolation
- **Non-isolated**: No restrictions in that direction (default)
- **Isolated**: Only connections matching policy rules are allowed
- Policies are additive: union of all applicable policies

### The NetworkPolicy Resource
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
spec:
  podSelector:
    matchLabels:
      app: bookstore
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: bookstore
```

### Policy Types
- `Ingress`: Controls inbound connections
- `Egress`: Controls outbound connections
- Both can be specified simultaneously

### Selectors
- `podSelector`: Selects Pods in the same namespace
- `namespaceSelector`: Selects entire namespaces
- `namespaceSelector` + `podSelector`: Selects specific Pods across namespaces
- `ipBlock`: Selects IP CIDR ranges (for external traffic)

### Default Policies
- **Default deny all ingress**: Isolate all Pods from ingress
- **Allow all ingress**: Allow all inbound (undo isolation)
- **Default deny all egress**: Isolate all Pods from egress
- **Allow all egress**: Allow all outbound (undo isolation)
- **Default deny all**: Deny all ingress and egress traffic

### Port Targeting
- `ports` field specifies allowed ports
- Supports `protocol` (TCP, UDP, SCTP) and `port` (number or name)

### Namespace Targeting
- By label: `namespaceSelector` with `matchLabels`
- By name: `namespaceSelector` with `kubernetes.io/metadata.name` label

### Limitations
- Does not apply to hostNetwork Pods
- Cannot block loopback traffic
- Cannot block traffic from the same Pod's node
- Only affects new connections, not existing ones

## DNS for Services and Pods

Kubernetes provides DNS-based service discovery. The cluster DNS server (CoreDNS) creates DNS records for Services and Pods.

### Service DNS Records

- **A/AAAA records**: Each Service gets a DNS record `my-service.my-namespace.svc.cluster.local`
- **SRV records**: Created for named ports (`_port-name._protocol.my-service.my-namespace.svc.cluster.local`)
- **CNAME records**: For ExternalName services (aliases to external DNS names)

### Namespaces in DNS

DNS queries are namespace-scoped. A Pod in namespace `test` querying `data` resolves to `data.test.svc.cluster.local`. To query a service in another namespace, use the fully-qualified name: `data.prod.svc.cluster.local`.

The Pod's `/etc/resolv.conf` is configured by kubelet:
```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

### Pod DNS Records

Pods can get DNS records based on their IP:
- A/AAAA record: `10-0-0-1.my-namespace.pod.cluster.local` (dashed IP)

### Pod hostname and subdomain

Pods can set `hostname` and `subdomain` fields. When both are set, a DNS A record is created: `<hostname>.<subdomain>.<namespace>.svc.cluster.local`.

### Pod DNS Policy

- **ClusterFirst**: DNS queries go to cluster DNS first, fall back to upstream
- **ClusterFirstWithHostNet**: For hostNetwork pods, same as ClusterFirst
- **Default**: Use the node's DNS resolution
- **None**: Custom DNS config via `dnsConfig`

### Pod DNS Config

Custom DNS configuration:
```yaml
spec:
  dnsPolicy: None
  dnsConfig:
    nameservers:
    - 1.2.3.4
    searches:
    - ns1.svc.cluster.local
    - my.dns.search.suffix
    options:
    - name: ndots
      value: "5"
    - name: edns0
```

### DNS search domain limits

Kubernetes limits the number of search domains to 6 (reduced from the default 32) to prevent DNS resolution issues. This is controlled by `ClusterDNS` and `ndots` settings.

### DNS on Windows nodes

Windows nodes have different DNS resolution behavior. The `search` list is limited to a smaller number of entries due to Windows DNS client limitations.

## Gateway API

Gateway API is a family of API kinds that provide dynamic infrastructure provisioning and advanced traffic routing. It is the successor to Ingress, offering more expressive and role-oriented configuration.

### Design principles

- **Role-oriented**: Modeled after organizational roles (Infrastructure Provider, Cluster Operator, Application Developer)
- **Portable**: Defined as custom resources, supported by many implementations
- **Expressive**: Supports header-based matching, traffic weighting, and other advanced routing without custom annotations
- **Extensible**: Custom resources can be linked at various layers of the API

### Resource model

Gateway API has four stable API kinds:

- **GatewayClass**: Defines a set of gateways with common configuration, managed by a controller
- **Gateway**: Defines an instance of traffic handling infrastructure (e.g., cloud load balancer)
- **HTTPRoute**: Defines HTTP-specific rules for mapping traffic from a Gateway listener to backend Services
- **GRPCRoute**: Defines gRPC-specific rules for mapping traffic from a Gateway listener to backend Services

### Relationships

- A Gateway is associated with exactly one GatewayClass
- One or more route kinds (HTTPRoute, GRPCRoute) are associated with Gateways
- A Gateway can filter which routes attach to its listeners (bidirectional trust model)

### Example Gateway API resources

```yaml
# GatewayClass
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-gateway-class
spec:
  controllerName: example.com/gateway-controller
---
# Gateway
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
---
# HTTPRoute
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
  - name: example-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /api
    backendRefs:
    - name: api-service
      port: 8080
```

### Migrating from Ingress

Gateway API addresses Ingress limitations:
- No need for custom annotations for advanced features
- Role-oriented separation of concerns
- Native support for TCP, UDP, and gRPC (not just HTTP/HTTPS)
- Better cross-namespace routing support
- Standardized traffic splitting and weighting

### Conformance

Gateway API defines conformance tests to ensure implementations behave consistently. Implementations can claim conformance at different levels (Core, Extended).
