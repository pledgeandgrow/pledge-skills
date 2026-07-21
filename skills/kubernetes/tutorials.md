# Kubernetes Tutorials

## Hello Minikube

### Objectives
- Deploy a sample application to minikube
- Run the app
- View application logs

### Prerequisites
- Install minikube (local Kubernetes cluster tool)
- Install kubectl (Kubernetes command-line tool)

### Creating a minikube Cluster
```bash
minikube start
```

### Checking Cluster Status
```bash
minikube status
```
Output should show all components Running or Configured:
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### Opening the Dashboard
```bash
minikube dashboard
```
- Opens Kubernetes dashboard in browser
- Can create resources (Deployments, Services) from UI
- Use `--url` flag to get URL without opening browser

### Creating a Deployment
```bash
kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
```
- Creates a Deployment with a single Pod
- View Deployments: `kubectl get deployments`
- View Pods: `kubectl get pods`
- View cluster events: `kubectl get events`
- View kubectl config: `kubectl config view`

### Creating a Service
```bash
kubectl expose deployment hello-node --type=LoadBalancer --port=8080
```
- Exposes the Deployment as a Service
- `--type=LoadBalancer` makes it accessible externally
- View Services: `kubectl get services`
- On minikube, use `minikube service hello-node` to open in browser

### Enabling Addons
```bash
minikube addons list              # List available addons
minikube addons enable metrics-server  # Enable metrics server
```

### Cleanup
```bash
kubectl delete service hello-node
kubectl delete deployment hello-node
minikube stop
```

## Kubernetes Basics Tutorial

### Key Concepts Covered
- **Module 1**: Create a Kubernetes cluster
- **Module 2**: Deploy an application (Deployments)
- **Module 3**: Explore the application (Pods, Services, labels)
- **Module 4**: Expose the application publicly (Services)
- **Module 5**: Scale the application (scaling replicas)
- **Module 6**: Update the application (rolling updates)

### Common Commands Used
```bash
kubectl version                          # Check version
kubectl cluster-info                     # View cluster info
kubectl get nodes                        # List nodes
kubectl create deployment <name> --image=<image>  # Create deployment
kubectl get deployments                  # List deployments
kubectl get pods                         # List pods
kubectl describe pod <name>              # Pod details
kubectl get services                     # List services
kubectl expose deployment <name> --port=<port> --type=LoadBalancer
kubectl scale deployment <name> --replicas=<n>
kubectl set image deployment/<name> <container>=<new-image>
kubectl rollout status deployment/<name>
kubectl rollout undo deployment/<name>
```

## Guestbook Tutorial

### Overview
- Deploy a multi-tier web application (PHP frontend + Redis backend)
- Uses Deployments and Services
- Redis master (single instance) + Redis replicas (multiple instances)
- PHP frontend connects to Redis via Services

### Key Steps
1. Create Redis master Deployment and Service
2. Create Redis replica Deployment and Service
3. Create frontend Deployment and Service
4. Expose frontend via LoadBalancer Service
5. Scale frontend by updating replicas

## WordPress Tutorial

### Overview
- Deploy WordPress with MySQL backend
- Uses PersistentVolumes for data persistence
- Uses Secrets for MySQL credentials
- Demonstrates stateful application deployment

### Key Components
- MySQL Deployment with PVC for data
- WordPress Deployment with PVC for data
- Secret for MySQL password
- Services for both MySQL and WordPress
