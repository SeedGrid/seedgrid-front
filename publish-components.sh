#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="${ROOT_DIR}/packages/seedgrid-fe-components"

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

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found in PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found in PATH."
  exit 1
fi

if [[ ! -f "${PKG_DIR}/package.json" ]]; then
  echo "Package not found at: ${PKG_DIR}"
  exit 1
fi

if ! npm whoami >/dev/null 2>&1; then
  echo "You are not logged in to npm. Run: npm login"
  exit 1
fi

echo "==> Typecheck @seedgrid/fe-components"
pnpm -C "${PKG_DIR}" typecheck

echo "==> Build @seedgrid/fe-components"
pnpm -C "${PKG_DIR}" build

cd "${PKG_DIR}"

echo "==> npm publish --dry-run"
npm publish --dry-run --access public

if [[ "${BUMP_TYPE}" != "none" ]]; then
  echo "==> Bumping version: ${BUMP_TYPE}"
  npm version "${BUMP_TYPE}" --no-git-tag-version
else
  echo "==> Skipping version bump"
fi

PUBLISH_ARGS=(--access public)
if [[ -n "${NPM_OTP:-}" ]]; then
  PUBLISH_ARGS+=(--otp "${NPM_OTP}")
fi

echo "==> Publishing to npm"
npm publish "${PUBLISH_ARGS[@]}"

echo "Done."
