#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-${SCRIPT_DIR}}"

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

WORKSPACE_PATCH_FILE="${ABS_PKG_DIR}/.workspace-deps-patch.json"
rm -f "${WORKSPACE_PATCH_FILE}"

MANIFEST_FILE="${ABS_PKG_DIR}/package.json"

apply_workspace_dependency_resolution() {
  echo "==> Preparing workspace dependency metadata for ${PKG_NAME}"
  node - "${WORKSPACE_PATCH_FILE}" "${MANIFEST_FILE}" "${REPO_ROOT}" <<'NODE'
const fs = require('fs');
const path = require('path');
const [,, patchFile, manifestPath, rootDir] = process.argv;

const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sections = ['dependencies', 'peerDependencies', 'devDependencies', 'optionalDependencies'];
const workspacePackages = collectWorkspacePackages(rootDir);
const patch = { replacements: [] };

for (const section of sections) {
  const deps = manifestData[section];
  if (!deps) continue;
  for (const [depName, depSpec] of Object.entries(deps)) {
    if (typeof depSpec !== 'string') continue;
    if (!depSpec.startsWith('workspace:')) continue;

    const workspacePkg = workspacePackages[depName];
    if (!workspacePkg) {
      throw new Error(`Cannot resolve workspace dependency ${depName}; ensure the package exists under workspace directories`);
    }
    if (!workspacePkg.version) {
      throw new Error(`Workspace package ${depName} at ${workspacePkg.path} is missing a version`);
    }

    const resolvedRange = `^${workspacePkg.version}`;
    patch.replacements.push({
      section,
      key: depName,
      original: depSpec,
      resolved: resolvedRange
    });
    deps[depName] = resolvedRange;
  }
}

fs.writeFileSync(patchFile, JSON.stringify(patch, null, 2));

if (patch.replacements.length === 0) {
  console.log('==> No workspace dependencies required rewriting.');
  process.exit(0);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2) + '\n');
console.log('==> Updated workspace dependencies:');
for (const replacement of patch.replacements) {
  console.log(`    ${replacement.section}.${replacement.key}: ${replacement.original} -> ${replacement.resolved}`);
}

function collectWorkspacePackages(root) {
  const packages = {};
  const candidates = ['packages', 'apps'];

  for (const candidate of candidates) {
    const candidatePath = path.join(root, candidate);
    if (!fs.existsSync(candidatePath)) continue;
    visit(candidatePath);
  }

  return packages;

  function visit(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of entries) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === '.turbo' ||
        entry.name === 'dist'
      ) {
        continue;
      }

      const candidatePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(candidatePath);
        continue;
      }

      if (!entry.isFile() || entry.name !== 'package.json') {
        continue;
      }

      let pkg;
      try {
        pkg = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
      } catch (error) {
        continue;
      }
      if (!pkg || !pkg.name) {
        continue;
      }

      packages[pkg.name] = {
        version: pkg.version || '',
        path: candidatePath
      };
    }
  }
}
NODE
}

revert_workspace_dependency_resolution() {
  if [[ ! -f "${WORKSPACE_PATCH_FILE}" ]]; then
    return
  fi

  node - "${WORKSPACE_PATCH_FILE}" "${MANIFEST_FILE}" <<'NODE'
const fs = require('fs');
const [,, patchFile, manifestPath] = process.argv;
const patchContent = JSON.parse(fs.readFileSync(patchFile, 'utf8'));

if (!Array.isArray(patchContent.replacements) || patchContent.replacements.length === 0) {
  process.exit(0);
}

const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const { section, key, original } of patchContent.replacements) {
  if (!manifestData[section]) {
    manifestData[section] = {};
  }
  manifestData[section][key] = original;
}

fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2) + '\n');
console.log('==> Restored workspace dependency markers.');
NODE
}

cleanup_workspace_dependencies() {
  if [[ -f "${WORKSPACE_PATCH_FILE}" ]]; then
    revert_workspace_dependency_resolution
    rm -f "${WORKSPACE_PATCH_FILE}"
  fi
}

trap cleanup_workspace_dependencies EXIT

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

apply_workspace_dependency_resolution

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

if [[ "${PKG_VERSION}" == *-* ]]; then
  echo "==> Detected prerelease version, publishing with --tag next"
  PUBLISH_ARGS+=(--tag next)
fi

(
  cd "${ABS_PKG_DIR}"
  "${NPM_BIN}" publish "${PUBLISH_ARGS[@]}"
)

echo "Done publishing ${PKG_NAME_RESOLVED}@${PKG_VERSION}."
