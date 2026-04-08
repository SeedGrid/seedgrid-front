#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
  - Intended for npm Trusted Publishing (OIDC) in GitHub Actions.
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

NODE_BIN="$(resolve_bin node || true)"
if [[ -z "${NODE_BIN}" ]]; then
  echo "node/node.exe not found in PATH."
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

PKG_NAME="$("${NODE_BIN}" -p "require('${ABS_PKG_DIR}/package.json').name || ''")"
PKG_VERSION_BEFORE="$("${NODE_BIN}" -p "require('${ABS_PKG_DIR}/package.json').version || ''")"

if [[ -z "${PKG_NAME}" ]]; then
  echo "Invalid package.json: missing 'name' in ${ABS_PKG_DIR}/package.json"
  exit 1
fi

echo "==> Trusted Publishing mode"
echo "==> Node version: $("${NODE_BIN}" --version)"
echo "==> npm version: $("${NPM_BIN}" --version)"

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

PKG_NAME_RESOLVED="$("${NODE_BIN}" -p "require('${ABS_PKG_DIR}/package.json').name || ''")"
PKG_VERSION="$("${NODE_BIN}" -p "require('${ABS_PKG_DIR}/package.json').version || ''")"

echo "==> Package version before: ${PKG_VERSION_BEFORE:-<empty>}"
echo "==> Package version resolved: ${PKG_VERSION}"

if [[ -z "${PKG_NAME_RESOLVED}" || -z "${PKG_VERSION}" ]]; then
  echo "Invalid package.json after version step: missing name or version"
  exit 1
fi

PACK_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${PACK_DIR}"
}
trap cleanup EXIT

echo "==> Packing ${PKG_NAME_RESOLVED}@${PKG_VERSION} (pnpm resolves workspace:* dependencies)"
(
  cd "${ABS_PKG_DIR}"
  "${PNPM_BIN}" pack --pack-destination "${PACK_DIR}"
)

TARBALL_PATH="$(find "${PACK_DIR}" -maxdepth 1 -name '*.tgz' -print -quit)"
if [[ -z "${TARBALL_PATH}" || ! -f "${TARBALL_PATH}" ]]; then
  echo "Failed to locate packed tarball in ${PACK_DIR}"
  exit 1
fi

echo "==> Tarball: ${TARBALL_PATH}"

PUBLISH_ARGS=(--access public)

if [[ -n "${NPM_TAG:-}" ]]; then
  echo "==> Using explicit npm tag from env: ${NPM_TAG}"
  PUBLISH_ARGS+=(--tag "${NPM_TAG}")
elif [[ "${PKG_VERSION}" == *-* ]]; then
  echo "==> Detected prerelease version, publishing with --tag next"
  PUBLISH_ARGS+=(--tag next)
else
  echo "==> Publishing stable version with default npm tag"
fi

echo "==> Publishing ${PKG_NAME_RESOLVED}@${PKG_VERSION}"
"${NPM_BIN}" publish "${TARBALL_PATH}" "${PUBLISH_ARGS[@]}"

echo "Done publishing ${PKG_NAME_RESOLVED}@${PKG_VERSION}."