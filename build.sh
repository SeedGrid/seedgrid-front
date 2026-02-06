#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

pnpm -C packages/seedgrid-fe-cli run build
pnpm -C packages/seedgrid-fe-cli link --global
