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

PKG_NAME=$(node -p "require('${ABS_PKG_DIR}/package.json').name")

if ! "${NPM_BIN}" whoami >/dev/null 2>&1; then
  echo "You are not logged in to npm. Run: npm login"
  exit 1
fi

echo "==> Typecheck ${PKG_NAME}"
"${PNPM_BIN}" -C "${ABS_PKG_DIR}" typecheck

echo "==> Build ${PKG_NAME}"
"${PNPM_BIN}" -C "${ABS_PKG_DIR}" build

echo "==> npm publish --dry-run ${PKG_NAME}"
"${NPM_BIN}" --prefix "${ABS_PKG_DIR}" publish --dry-run --access public

if [[ -n "${PUBLISH_VERSION:-}" ]]; then
  echo "==> Setting version: ${PUBLISH_VERSION}"
  "${NPM_BIN}" --prefix "${ABS_PKG_DIR}" version "${PUBLISH_VERSION}" --no-git-tag-version
elif [[ "${BUMP_TYPE}" != "none" ]]; then
  echo "==> Bumping version: ${BUMP_TYPE}"
  "${NPM_BIN}" --prefix "${ABS_PKG_DIR}" version "${BUMP_TYPE}" --no-git-tag-version
else
  echo "==> Skipping version bump"
fi

PKG_VERSION=$(node -p "require('${ABS_PKG_DIR}/package.json').version")

echo "==> Publishing ${PKG_NAME}@${PKG_VERSION}"
PUBLISH_ARGS=(--access public)
if [[ -n "${NPM_OTP:-}" ]]; then
  PUBLISH_ARGS+=(--otp "${NPM_OTP}")
fi

"${NPM_BIN}" --prefix "${ABS_PKG_DIR}" publish "${PUBLISH_ARGS[@]}"

echo "Done publishing ${PKG_NAME}."
