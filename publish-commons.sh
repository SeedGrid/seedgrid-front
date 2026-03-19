#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="${ROOT_DIR}/packages/seedgrid-fe-commons"

exec "${ROOT_DIR}/publish-package.sh" "${PKG_DIR}" "$@"
