# CI/CD and Automation with Docker

## GitHub Actions

### Build and Push

```yaml
# .github/workflows/docker-build.yml
name: Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and Push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Multi-Stage with Test

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      
      - name: Build test stage
        uses: docker/build-push-action@v6
        with:
          context: .
          target: test
          load: true
          tags: myapp:test
          cache-from: type=gha
          cache-to: type=gha
      
      - name: Run tests
        run: docker run --rm myapp:test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## GitLab CI

```yaml
# .gitlab-ci.yml
variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  DOCKER_IMAGE_LATEST: $CI_REGISTRY_IMAGE:latest

stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: docker:28
  services:
    - docker:28-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker buildx build --cache-from type=registry,ref=$DOCKER_IMAGE_LATEST
        --cache-to type=registry,ref=$DOCKER_IMAGE_LATEST,mode=max
        -t $DOCKER_IMAGE -t $DOCKER_IMAGE_LATEST .
    - docker push $DOCKER_IMAGE
    - docker push $DOCKER_IMAGE_LATEST

test:
  stage: test
  image: docker:28
  services:
    - docker:28-dind
  script:
    - docker pull $DOCKER_IMAGE
    - docker run --rm $DOCKER_IMAGE npm test

deploy:
  stage: deploy
  image: docker:28
  services:
    - docker:28-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker pull $DOCKER_IMAGE
    - docker tag $DOCKER_IMAGE $DOCKER_IMAGE_LATEST
    - docker push $DOCKER_IMAGE_LATEST
  only:
    - main
```

## Docker Compose in CI

```yaml
# GitHub Actions — test with Compose
jobs:
  integration-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d
      
      - name: Wait for services
        run: |
          timeout 60 bash -c 'until docker compose ps | grep -q "healthy"; do sleep 2; done'
      
      - name: Run tests
        run: docker compose exec -T web npm test
      
      - name: Cleanup
        if: always()
        run: docker compose -f docker-compose.test.yml down -v
```

## Build Caching Strategies

### GitHub Actions Cache

```yaml
# Using GitHub Actions cache
- uses: docker/setup-buildx-action@v3

- uses: docker/build-push-action@v6
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
    push: true
    tags: myapp:latest
```

### Registry Cache

```yaml
# Using registry as cache
- uses: docker/build-push-action@v6
  with:
    context: .
    cache-from: type=registry,ref=ghcr.io/user/myapp:cache
    cache-to: type=registry,ref=ghcr.io/user/myapp:cache,mode=max
    push: true
    tags: ghcr.io/user/myapp:latest
```

### Local Cache

```yaml
# Using local cache
- uses: docker/build-push-action@v6
  with:
    context: .
    cache-from: type=local,src=/tmp/.buildx-cache
    cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max

- name: Move cache
  run: |
    rm -rf /tmp/.buildx-cache
    mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

## Docker in Docker (DinD)

```yaml
# GitHub Actions
jobs:
  docker:
    runs-on: ubuntu-latest
    container: docker:28-dind
    services:
      - docker:28-dind
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp .
      - run: docker run myapp npm test
```

### Kaniko (Dockerless Build)

```yaml
# Build without Docker daemon (more secure)
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: gcr.io/kaniko-project/executor:latest
      entrypoint: [""]
    steps:
      - uses: actions/checkout@v4
      - name: Build and push
        run: |
          /kaniko/executor \
            --context=. \
            --destination=ghcr.io/user/myapp:latest \
            --cache=true
```

## Multi-Platform Builds in CI

```yaml
jobs:
  build-multi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64,linux/arm/v7
          push: true
          tags: ghcr.io/user/myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Docker Makefile

```makefile
# Makefile for Docker builds
IMAGE_NAME := myapp
IMAGE_TAG := $(shell git rev-parse --short HEAD)
REGISTRY := ghcr.io/username

.PHONY: build run test push clean

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

build-multi:
	docker buildx build --platform linux/amd64,linux/arm64 \
		-t $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG) --push .

run:
	docker run -d -p 3000:3000 --name $(IMAGE_NAME) $(IMAGE_NAME):$(IMAGE_TAG)

test:
	docker build --target test -t $(IMAGE_NAME):test .
	docker run --rm $(IMAGE_NAME):test

push:
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(REGISTRY)/$(IMAGE_NAME):latest
	docker push $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(REGISTRY)/$(IMAGE_NAME):latest

compose-up:
	docker compose up -d --build

compose-down:
	docker compose down -v

clean:
	docker system prune -f
	docker image prune -f
```

## Security Scanning in CI

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        uses: docker/build-push-action@v6
        with:
          context: .
          load: true
          tags: myapp:latest
      
      - name: Scan with Docker Scout
        uses: docker/scout-action@v1
        with:
          command: cves
          image: myapp:latest
          severity: critical,high
      
      - name: Scan with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          format: table
          exit-code: '1'
          severity: CRITICAL,HIGH
```
