# Docker and Kubernetes

## Docker vs Kubernetes

| Feature | Docker | Kubernetes |
|---------|--------|------------|
| Scope | Single host | Cluster (multi-host) |
| Orchestration | Docker Compose / Swarm | Full orchestrator |
| Scaling | Manual / Swarm | Auto-scaling |
| Load balancing | Basic | Built-in services |
| Rolling updates | Swarm | Advanced strategies |
| Service mesh | No | Yes (Istio, Linkerd) |
| Storage | Volumes | PV/PVC, StorageClasses |
| Networking | Bridge/Overlay | CNI plugins |
| Secrets | Docker secrets | K8s Secrets |

## Docker to Kubernetes Migration

### Compose to Kubernetes

```bash
# Using kompose to convert docker-compose.yml
kompose convert -f docker-compose.yml

# Output: Kubernetes YAML files
# - deployment.yaml
# - service.yaml
# - persistentvolumeclaim.yaml
# - configmap.yaml

# Convert with options
kompose convert -f docker-compose.yml \
  --replicas 3 \
  --controller deployment \
  --service nodeport
```

### Manual Mapping

| Docker Compose | Kubernetes |
|----------------|------------|
| `services:` | `Deployment` / `StatefulSet` |
| `ports:` | `Service` + `ContainerPort` |
| `volumes:` | `PersistentVolumeClaim` |
| `environment:` | `ConfigMap` / `Secret` |
| `depends_on:` | `initContainers` |
| `healthcheck:` | `livenessProbe` / `readinessProbe` |
| `restart:` | `restartPolicy` |
| `resources:` | `resources.limits` / `resources.requests` |
| `networks:` | `NetworkPolicy` |

### Example: Docker Compose to Kubernetes

**docker-compose.yml:**
```yaml
services:
  web:
    image: myapp:1.0
    ports:
      - "80:3000"
    environment:
      DB_HOST: db
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '1'
  
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

**Kubernetes equivalent:**
```yaml
---
# Deployment: web
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:1.0
          ports:
            - containerPort: 3000
          env:
            - name: DB_HOST
              value: db
          resources:
            limits:
              memory: 512Mi
              cpu: '1'
            requests:
              memory: 256Mi
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10

---
# Service: web
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 3000
  selector:
    app: web

---
# Deployment: db
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
        - name: db
          image: postgres:17
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
          volumeMounts:
            - name: dbdata
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: dbdata
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi

---
# Secret: db
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  password: secret

---
# Service: db
apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  ports:
    - port: 5432
  selector:
    app: db
```

## Docker Desktop with Kubernetes

```bash
# Enable Kubernetes in Docker Desktop
# Settings → Kubernetes → Enable Kubernetes

# Check cluster
kubectl cluster-info
kubectl get nodes
kubectl get pods -A

# Docker Desktop provides a single-node K8s cluster
# Uses containerd as runtime
# Includes kubectl, Helm, ingress support
```

## Docker Images in Kubernetes

```bash
# Kubernetes uses container images same as Docker
# Image format: registry/image:tag

# Pull policy
# Always: always pull from registry
# IfNotPresent: pull if not cached (default)
# Never: never pull (use cached only)

# In pod spec:
spec:
  containers:
    - name: app
      image: myapp:1.0
      imagePullPolicy: IfNotPresent

# Private registry
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=user \
  --docker-password=token \
  --docker-email=user@example.com

# Use in pod
spec:
  imagePullSecrets:
    - name: regcred
  containers:
    - name: app
      image: ghcr.io/user/myapp:1.0
```

## Docker Swarm vs Kubernetes

```bash
# Docker Swarm — built into Docker
docker swarm init
docker swarm join --token TOKEN MANAGER:2377

# Deploy with Compose file
docker stack deploy -c docker-compose.yml myapp

# Scale
docker service scale myapp_web=5

# Update
docker service update --image myapp:2.0 myapp_web

# Kubernetes — more powerful but more complex
kubectl apply -f deployment.yaml
kubectl scale deployment web --replicas=5
kubectl set image deployment/web web=myapp:2.0
```

### When to Use What

| Scenario | Recommendation |
|----------|---------------|
| Single host, simple app | Docker + Compose |
| Small team, simple orchestration | Docker Swarm |
| Production, multi-host | Kubernetes |
| Need auto-scaling | Kubernetes |
| Need service mesh | Kubernetes + Istio |
| Quick dev environment | Docker Compose |
| CI/CD testing | Docker Compose or K8s (kind/minikube) |

## Local Kubernetes with Docker

### kind (Kubernetes in Docker)

```bash
# Install kind
go install sigs.k8s.io/kind@latest
# or: brew install kind

# Create cluster
kind create cluster --name mycluster

# Use kubectl
kubectl cluster-info
kubectl get nodes

# Load Docker image into kind
kind load docker-image myapp:1.0 --name mycluster

# Delete cluster
kind delete cluster --name mycluster
```

### minikube

```bash
# Install minikube
# https://minikube.sigs.k8s.io/docs/start/

# Start cluster
minikube start
minikube start --driver=docker
minikube start --cpus=4 --memory=8g

# Use Docker daemon inside minikube
eval $(minikube docker-env)
docker build -t myapp:1.0 .
# Now image is available in minikube

# Dashboard
minikube dashboard

# Stop / Delete
minikube stop
minikube delete
```

### k3d (k3s in Docker)

```bash
# Install k3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Create cluster
k3d cluster create mycluster

# Use kubectl
kubectl get nodes

# Delete
k3d cluster delete mycluster
```

## Helm Charts

```bash
# Install Helm
# https://helm.sh/docs/intro/install/

# Add chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search
helm search repo nginx

# Install
helm install mynginx bitnami/nginx

# List
helm list

# Uninstall
helm uninstall mynginx

# Create your own chart
helm create myapp
# Edit myapp/values.yaml and myapp/templates/

# Package
helm package myapp

# Install local chart
helm install myapp ./myapp-0.1.0.tgz
```
