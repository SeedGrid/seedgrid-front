#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="${ROOT_DIR}/packages/seedgrid-fe-components"

resolve_bin() {
  local base="$1"
  if command -v "${base}" >/dev/null 2>&1; then
    echo "${base}"
    return 0
  fi
  if command -v "${base}.cmd" >/dev/null 2>&1; then
    echo "${base}.cmd"
    return 0
  fi
  return 1
}

usage() {
  cat <<'EOF'
Usage:
  ./publish-components.sh [patch|minor|major|prerelease|none]

Examples:
  ./publish-components.sh
  ./publish-components.sh minor
  ./publish-components.sh none

Notes:
  - Default bump is "patch".
  - "none" skips version bump.
  - To publish with 2FA, pass NPM_OTP:
      NPM_OTP=123456 ./publish-components.sh
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

BUMP_TYPE="${1:-patch}"

case "${BUMP_TYPE}" in
  patch|minor|major|prerelease|none) ;;
  *)
    echo "Invalid bump type: ${BUMP_TYPE}"
    usage
    exit 1
    ;;
esac

PNPM_BIN="$(resolve_bin pnpm || true)"
if [[ -z "${PNPM_BIN}" ]]; then
  echo "pnpm/pnpm.cmd not found in PATH."
  exit 1
fi

NPM_BIN="$(resolve_bin npm || true)"
if [[ -z "${NPM_BIN}" ]]; then
  echo "npm/npm.cmd not found in PATH."
  exit 1
fi

if [[ ! -f "${PKG_DIR}/package.json" ]]; then
  echo "Package not found at: ${PKG_DIR}"
  exit 1
fi

if ! "${NPM_BIN}" whoami >/dev/null 2>&1; then
  echo "You are not logged in to npm. Run: npm login"
  exit 1
fi

echo "==> Typecheck @seedgrid/fe-components"
"${PNPM_BIN}" -C "${PKG_DIR}" typecheck

echo "==> Build @seedgrid/fe-components"
"${PNPM_BIN}" -C "${PKG_DIR}" build

cd "${PKG_DIR}"

echo "==> npm publish --dry-run"
"${NPM_BIN}" publish --dry-run --access public

if [[ "${BUMP_TYPE}" != "none" ]]; then
  echo "==> Bumping version: ${BUMP_TYPE}"
  "${NPM_BIN}" version "${BUMP_TYPE}" --no-git-tag-version
else
  echo "==> Skipping version bump"
fi

PUBLISH_ARGS=(--access public)
if [[ -n "${NPM_OTP:-}" ]]; then
  PUBLISH_ARGS+=(--otp "${NPM_OTP}")
fi

echo "==> Publishing to npm"
"${NPM_BIN}" publish "${PUBLISH_ARGS[@]}"

echo "Done."
