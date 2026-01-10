# 📦 Project Milestone 4 – Service Composition with Docker Compose

## 📍 Status
**Milestone 4 – Service Composition (✅ Current)**  
**Milestone 3 – Microservices Design (Completed)**  
**Milestone 2 – Continuous Integration (Completed)**  
**Milestone 1 – Repository Setup & Project Definition (Completed)**

---

## 🎯 Objective

The goal of **Milestone 4** is to design and implement a **reproducible multi-container environment** using **Docker and Docker Compose**, enabling the application to run consistently across development, testing, and future deployment environments.

This milestone focuses on **infrastructure and service composition**, ensuring that:

- The backend API runs in an isolated container.
- Auxiliary services (logging, database) are composed as independent containers.
- The entire cluster can be started, tested, and destroyed in a fully automated way.

---

## 🧩 Cluster Architecture Overview

The application is composed of **three main services**, orchestrated via Docker Compose:

| Service | Description | Port |
|-------|-------------|------|
| **API** | NestJS backend application | `3000` |
| **Log Service** | Lightweight Node.js service for centralized logging | `4000` |
| **Database** | PostgreSQL container with persistent volume | `5432` |

The architecture cleanly separates:

- **Infrastructure concerns** (containers, networks, volumes)
- **Application concerns** (API logic)
- **Observability concerns** (logging service)

---

## 🧱 Docker & Compose Configuration

### Dockerfiles

The project includes **two Dockerfiles**, each explicitly documented and versioned:

- **API Dockerfile** (root-level `Dockerfile`)
  - Multi-stage build using `node:22-alpine`
  - Builds NestJS application (`npm run build`)
  - Runs optimized production image with compiled `dist/`

- **Log Service Dockerfile** (`services/log-service/Dockerfile`)
  - Lightweight Node.js container
  - Exposes `/health` endpoint
  - Accepts log events via HTTP

### Docker Compose

The `compose.yaml` file defines:

- Service dependencies
- Port mappings (internal & external)
- Health checks for all services
- Named volumes for database persistence
- Configuration-as-code for full reproducibility

Key characteristics:

- The cluster can be started with a single command:
  ```bash
  docker compose up -d --build
  ```
- The environment behaves identically on any machine with Docker installed.

---

## 💾 Persistence & Data Containers
A PostgreSQL container is included as a dedicated data service:

- Uses a named Docker volume for persistence
- Can be replaced or extended in future milestones

This satisfies the requirement of having a container exclusively dedicated to storing data, while keeping the API decoupled from the database implementation at this stage.

---

## 📡 Observability – Log Service
A dedicated log-service microservice was implemented to demonstrate service-to-service communication and observability.

Features:

- Independent container
- Health endpoint: GET /health
- Receives logs via HTTP from the API
- Demonstrates decoupled logging architecture

The API sends log events to the log service without being tightly coupled to its internal implementation.

---

## 🧪 Smoke Testing (Local & CI)

A cluster smoke test validates that the entire environment works as expected.

Local Smoke Test Script

`scripts/compose-smoke-test.sh performs:`

1. Build and start the cluster
2. Wait for service health checks
3. Validate log-service availability
4. Send a demo log from API → log-service
5. Tear down the environment

This ensures the cluster is not only “running”, but **functionally correct**.

### Smoke Test in GitHub Actions

A dedicated workflow (`compose-smoke-test.yml`) runs the same test automatically on:

- push
- pull_request

This guarantees that:

- Dockerfiles remain valid
- Services start correctly
- Inter-service communication works
- The cluster is reproducible in CI
---

## 🚀 Docker Image Publication (GHCR)

Docker images are automatically built and published to **GitHub Container Registry (GHCR)** via GitHub Actions.

Published images:

- `ghcr.io/ximenacor/iwilldoit-api:latest`
- `ghcr.io/ximenacor/iwilldoit-log-service:latest`

Each push to `main`:

- Builds images
- Tags them with latest and commit SHA
- Publishes them automatically

This fulfills the requirement of **automated container publication**.

---

## 🔁 CI/CD Integration Summary

The repository now includes three CI workflows:

| Workflow | Purpose |
|-------|-------------|
| **NestJS CI Pipeline** | Lint, test, build |
| **Compose Smoke Test** | Validate cluster |
| **Docker Images (GHCR)** | Build & publish containers |

All workflows run successfully on `main`.

---

## 🔗 References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry (GHCR)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [12-Factor App – Logs](https://12factor.net/logs)

