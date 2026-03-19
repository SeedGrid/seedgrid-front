#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./publish-package.sh <package-directory> [patch|minor|major|prerelease|none]

Examples:
  ./publish-package.sh packages/seedgrid-fe-components
  ./publish-package.sh packages/seedgrid-fe-core minor

Notes:
  - Default bump type is "patch".
  - Pass "none" to skip version bump.
  - Set PUBLISH_VERSION=1.2.3 to force a specific version and skip bumping.
  - NPM_OTP=123456 ./publish-package.sh packages/seedgrid-fe-components
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

PKG_DIR_RAW="$1"
shift
BUMP_TYPE="${1:-patch}"

if [[ "${BUMP_TYPE}" == "-h" || "${BUMP_TYPE}" == "--help" ]]; then
  usage
  exit 0
fi

case "${BUMP_TYPE}" in
  patch|minor|major|prerelease|none) ;;
  *)
    echo "Invalid bump type: ${BUMP_TYPE}"
    usage
    exit 1
    ;;
esac

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

if ! ABS_PKG_DIR="$(cd "${PKG_DIR_RAW}" && pwd)"; then
  echo "Cannot access package directory: ${PKG_DIR_RAW}"
  exit 1
fi

if [[ ! -f "${ABS_PKG_DIR}/package.json" ]]; then
  echo "Package not found at: ${ABS_PKG_DIR}/package.json"
  exit 1
fi

echo "==> Package directory: ${ABS_PKG_DIR}"
echo "==> Current working dir before anything: $(pwd)"
echo "==> package.json contents:"
cat "${ABS_PKG_DIR}/package.json"

PKG_NAME="$(node -p "require('${ABS_PKG_DIR}/package.json').name || ''")"
PKG_VERSION_BEFORE="$(node -p "require('${ABS_PKG_DIR}/package.json').version || ''")"

if [[ -z "${PKG_NAME}" ]]; then
  echo "Invalid package.json: missing 'name' in ${ABS_PKG_DIR}/package.json"
  exit 1
fi

if ! "${NPM_BIN}" whoami >/dev/null 2>&1; then
  if [[ -n "${NODE_AUTH_TOKEN:-}" || -n "${NPM_TOKEN:-}" ]]; then
    echo "npm whoami failed, but a token is present; continuing."
  else
    echo "You are not logged in to npm. Run: npm login"
    exit 1
  fi
fi

echo "==> Typecheck ${PKG_NAME}"
"${PNPM_BIN}" -C "${ABS_PKG_DIR}" typecheck

echo "==> Build ${PKG_NAME}"
"${PNPM_BIN}" -C "${ABS_PKG_DIR}" build

if [[ -n "${PUBLISH_VERSION:-}" ]]; then
  echo "==> Setting version: ${PUBLISH_VERSION}"
  (
    cd "${ABS_PKG_DIR}"
    "${NPM_BIN}" version "${PUBLISH_VERSION}" --no-git-tag-version
  )
elif [[ "${BUMP_TYPE}" != "none" ]]; then
  echo "==> Bumping version: ${BUMP_TYPE}"
  (
    cd "${ABS_PKG_DIR}"
    "${NPM_BIN}" version "${BUMP_TYPE}" --no-git-tag-version
  )
else
  echo "==> Skipping version bump"
fi

PKG_NAME_RESOLVED="$(node -p "require('${ABS_PKG_DIR}/package.json').name || ''")"
PKG_VERSION="$(node -p "require('${ABS_PKG_DIR}/package.json').version || ''")"

echo "==> Package version before: ${PKG_VERSION_BEFORE:-<empty>}"
echo "==> Package version resolved: ${PKG_VERSION}"

if [[ -z "${PKG_NAME_RESOLVED}" || -z "${PKG_VERSION}" ]]; then
  echo "Invalid package.json after version step: missing name or version"
  exit 1
fi

echo "==> npm sees these values:"
(
  cd "${ABS_PKG_DIR}"
  pwd
  node -p "require('./package.json').name"
  node -p "require('./package.json').version"
)

echo "==> npm pack --dry-run ${PKG_NAME_RESOLVED}@${PKG_VERSION}"
(
  cd "${ABS_PKG_DIR}"
  "${NPM_BIN}" pack --dry-run --loglevel verbose
)

echo "==> Publishing ${PKG_NAME_RESOLVED}@${PKG_VERSION}"
PUBLISH_ARGS=(--access public)

if [[ -n "${NPM_OTP:-}" ]]; then
  PUBLISH_ARGS+=(--otp "${NPM_OTP}")
fi

(
  cd "${ABS_PKG_DIR}"
  "${NPM_BIN}" publish "${PUBLISH_ARGS[@]}"
)

echo "Done publishing ${PKG_NAME_RESOLVED}@${PKG_VERSION}."