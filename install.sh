#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm nao encontrado. Ativando via corepack..."
  corepack enable
  corepack prepare pnpm@latest --activate
fi

cd "$ROOT_DIR"

echo "Instalando dependencias (pnpm)..."
pnpm -w install

echo "Build do CLI..."
pnpm -C packages/seedgrid-fe-cli run build

echo "Linkando CLI globalmente..."
pnpm -C packages/seedgrid-fe-cli link --global

PNPM_BIN_DIR="$(pnpm bin -g)"
if [ -n "$PNPM_BIN_DIR" ]; then
  if ! command -v seedgrid >/dev/null 2>&1; then
    echo "Adicionando pnpm global bin ao PATH (bash)..."
    for rc in "$HOME/.bashrc" "$HOME/.bash_profile"; do
      if [ -f "$rc" ]; then
        if ! grep -Fq "$PNPM_BIN_DIR" "$rc"; then
          echo "export PATH=\"$PNPM_BIN_DIR:\$PATH\"" >> "$rc"
        fi
      else
        echo "export PATH=\"$PNPM_BIN_DIR:\$PATH\"" >> "$rc"
      fi
    done
    export PATH="$PNPM_BIN_DIR:$PATH"
  fi
fi

echo "Pronto. Use: seedgrid init <app>"
