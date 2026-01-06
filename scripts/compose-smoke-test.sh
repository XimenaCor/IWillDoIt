#!/usr/bin/env bash
set -euo pipefail

echo "==> Starting cluster (build + up)"
docker compose up -d --build

echo "==> Waiting for log-service health"
until curl -fsS http://localhost:4000/health >/dev/null; do
  sleep 1
done

echo "==> Waiting for API to accept connections"
until curl -s http://localhost:3000 >/dev/null; do
  sleep 1
done

echo "==> Sending demo log from API -> log-service"
curl -fsS -X POST http://localhost:3000/logs/demo >/dev/null

echo "==> Verifying log-service received LOG_EVENT"
docker compose logs log-service | grep -q "LOG_EVENT"

echo "==> Smoke test OK"
