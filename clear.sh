#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESET_LOCK=false
PRUNE_STORE=false

usage() {
  cat <<'EOF'
Uso:
  ./clear.sh [--reset-lock] [--prune-store]

Opcoes:
  --reset-lock   Remove tambem o pnpm-lock.yaml antes de reinstalar
  --prune-store  Executa "pnpm store prune" para limpar cache global do pnpm
  -h, --help     Mostra esta ajuda
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reset-lock)
      RESET_LOCK=true
      ;;
    --prune-store)
      PRUNE_STORE=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Opcao invalida: $1"
      usage
      exit 1
      ;;
  esac
  shift
done

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm nao encontrado. Ativando via corepack..."
  corepack enable
  corepack prepare pnpm@latest --activate
fi

cd "${ROOT_DIR}"

safe_rm() {
  local target="$1"
  if [[ -e "${target}" ]]; then
    rm -rf "${target}"
    echo "removido: ${target#${ROOT_DIR}/}"
  fi
}

echo "==> Limpando artefatos locais"
safe_rm "${ROOT_DIR}/node_modules"
safe_rm "${ROOT_DIR}/.turbo"
safe_rm "${ROOT_DIR}/apps/showcase/.next"

if [[ -d "${ROOT_DIR}/apps" ]]; then
  while IFS= read -r app_dir; do
    safe_rm "${app_dir}/node_modules"
    safe_rm "${app_dir}/.next"
    safe_rm "${app_dir}/dist"
    safe_rm "${app_dir}/.turbo"
  done < <(find "${ROOT_DIR}/apps" -mindepth 1 -maxdepth 1 -type d)
fi

if [[ -d "${ROOT_DIR}/packages" ]]; then
  while IFS= read -r pkg_dir; do
    safe_rm "${pkg_dir}/node_modules"
    safe_rm "${pkg_dir}/dist"
    safe_rm "${pkg_dir}/.turbo"
  done < <(find "${ROOT_DIR}/packages" -mindepth 1 -maxdepth 1 -type d)
fi

echo "==> Removendo arquivos tsbuildinfo"
find "${ROOT_DIR}" -type f \( -name "*.tsbuildinfo" -o -name "tsconfig.tsbuildinfo" \) -print -delete

if [[ "${RESET_LOCK}" == true ]]; then
  safe_rm "${ROOT_DIR}/pnpm-lock.yaml"
fi

if [[ "${PRUNE_STORE}" == true ]]; then
  echo "==> Limpando store global do pnpm"
  pnpm store prune
fi

echo "==> Reinstalando dependencias (workspace completo, incluindo devDependencies)"
pnpm -r install --prod=false

echo "==> Build dos pacotes necessarios"
pnpm -C "${ROOT_DIR}/packages/seedgrid-fe-core" build
pnpm -C "${ROOT_DIR}/packages/seedgrid-fe-theme" build
pnpm -C "${ROOT_DIR}/packages/seedgrid-fe-components" build

echo "Concluido."
