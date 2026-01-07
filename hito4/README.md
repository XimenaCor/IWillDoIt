
# Hito 4 – Service Composition with Docker Compose

## Project
**IWillDoIt**

This milestone focuses on composing multiple services using Docker Compose to create a reproducible, testable cluster that can be validated locally and in CI, and that serves as a stable foundation for future deployment (Hito 5).

---

## 1. Objective of Hito 4

The objective of Hito 4 is to design and implement a reproducible service composition using Docker Compose that includes:

- Multiple containers working together as a cluster
- At least one container dedicated exclusively to data storage
- Configuration-as-code so the system can be started in any environment
- Automated validation via CI using a smoke test
- Docker images published to a public container registry (GHCR)

This milestone focuses on **infrastructure and composition**, not on final business logic or full persistence.

---

## 2. Cluster Architecture

The system is composed of three main services orchestrated via `compose.yaml`:

### 2.1 API Service (NestJS)
- Implements the application logic developed in previous milestones
- Exposes REST endpoints
- Sends structured logs to the log-service
- Runs on port **3000**

### 2.2 Log Service
- Independent Node.js microservice
- Receives log events from the API
- Provides a `/health` endpoint for validation
- Runs on port **4000**

### 2.3 Database Service
- PostgreSQL container
- Dedicated exclusively to data storage
- Uses a Docker volume for persistence
- Included to satisfy the requirement of a data container and to prepare the system for future persistence (Hito 5)

---

## 3. Docker Compose Configuration

The `compose.yaml` file located at the root of the repository defines:

- All services in the cluster
- Internal service networking
- External port mappings for testing
- Volumes for data persistence
- Health checks to ensure correct startup order

Key characteristics:
- Services can communicate using service names (e.g. `log-service`, `db`)
- Ports are exposed only where needed for development and testing
- The cluster can be started with a single command:
  
  docker compose up -d --build

---

## 4. Dockerfiles

### 4.1 API Dockerfile
- Located at the root of the repository
- Uses a multi-stage build
- First stage builds the NestJS application
- Second stage runs the compiled application with only production dependencies
- Ensures smaller and reproducible images

### 4.2 Log Service Dockerfile
- Located at `services/log-service/Dockerfile`
- Uses the official Node.js Alpine image
- Installs only required dependencies
- Runs a lightweight HTTP server for log ingestion

Both Dockerfiles are version-controlled and part of the repository, fulfilling the infrastructure-as-code requirement.

---

## 5. Environment Configuration

Environment variables are managed via Docker Compose and documented using `.env.example`.

Examples:
- `PORT`
- `LOG_SERVICE_URL`
- `POSTGRES_*` variables

This ensures that the system can be configured consistently across environments without modifying code.

---

## 6. Smoke Test

### 6.1 Local Smoke Test Script

A script located at:

`scripts/compose-smoke-test.sh`

Performs the following steps:
1. Builds and starts the Docker Compose cluster
2. Waits for services to become healthy
3. Calls the log-service health endpoint
4. Sends a demo log request through the API
5. Shuts down the cluster and removes volumes

This validates that:
- All containers start correctly
- Services can communicate
- The system behaves as expected end-to-end

### 6.2 CI Smoke Test (GitHub Actions)

The smoke test is executed automatically in CI using the workflow:

`.github/workflows/compose-smoke-test.yml`

It runs:
- On push
- On pull requests

This guarantees that the composed system is always validated before integration.

---

## 7. Continuous Integration

The repository includes multiple GitHub Actions workflows:

### 7.1 NestJS CI Pipeline
- Linting
- Build
- Unit tests

### 7.2 Compose Smoke Test
- Builds the Docker images
- Starts the full cluster
- Runs the smoke test
- Tears down the environment

### 7.3 Docker Image Publication (GHCR)
- Builds Docker images for:
  - API
  - Log Service
- Publishes them to GitHub Container Registry (GHCR)
- Uses commit SHA and `latest` tags

All workflows run successfully on the `main` branch.

---

## 8. Docker Images

The following images are published to GHCR:

- `ghcr.io/<owner>/iwilldoit-api`
- `ghcr.io/<owner>/iwilldoit-log-service`

Images are:
- Built automatically via GitHub Actions
- Versioned using commit SHAs
- Publicly accessible for deployment


