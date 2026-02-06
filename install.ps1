$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "pnpm nao encontrado. Ativando via corepack..."
  corepack enable
  corepack prepare pnpm@latest --activate
}

Write-Host "Instalando dependencias (pnpm)..."
pnpm -w install

Write-Host "Build do CLI..."
pnpm -C packages/seedgrid-fe-cli run build

Write-Host "Linkando CLI globalmente..."
pnpm -C packages/seedgrid-fe-cli link --global

Write-Host "Pronto. Use: seedgrid init <app>"
