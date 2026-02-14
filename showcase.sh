#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

pnpm -C "${ROOT_DIR}/packages/seedgrid-fe-components" build
pnpm -C "${ROOT_DIR}/packages/seedgrid-fe-components" dev &
COMPONENTS_PID=$!

cleanup() {
  kill "${COMPONENTS_PID}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

pnpm -C "${ROOT_DIR}/apps/showcase" dev
