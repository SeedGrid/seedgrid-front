# SeedGrid FE

Este repositório é um monorepo com o CLI e os módulos SeedGrid FE.

## Estrutura
- `packages/seedgrid-fe-cli` – CLI `seedgrid`
- `packages/seedgrid-fe-core`
- `packages/seedgrid-fe-commons`
- `packages/seedgrid-fe-security`
- `packages/seedgrid-fe-theme`
- `packages/seedgrid-fe-audit` (quando criado)
- `packages/seedgrid-fe-backup` (quando criado)

## Como instalar o CLI

### Windows (PowerShell)
```powershell
.\install.ps1
```

### Linux/WSL/Git Bash
```bash
./install.sh
```

#### Git Bash (Windows)
Se estiver usando Git Bash, garanta que o binário global do pnpm esteja no `PATH`.
```bash
export PNPM_HOME="/c/Users/<seu-usuario>/AppData/Local/pnpm"
export PATH="$PNPM_HOME:$PATH"
```
Para ficar permanente, adicione no `~/.bashrc` (ou `~/.bash_profile`):
```bash
export PNPM_HOME="/c/Users/lucia/AppData/Local/pnpm"
export PATH="$PNPM_HOME:$PATH"
```
Depois rode o link global:
```bash
pnpm -C packages/seedgrid-fe-cli link --global
```

## Apps independentes (sem CLI global)
O `seedgrid init` agora copia os pacotes SeedGrid para dentro do app em `seedgrid-packages/`
e configura as dependências como `file:`. Assim o app funciona sem depender do CLI global.

Depois de criar o app, use o CLI local:
```bash
pnpm seedgrid upgrade
```

Para atualizar com uma fonte específica:
```bash
pnpm seedgrid upgrade -- --source C:\caminho\para\seedgrid\front
```

Você também pode definir `SEEDGRID_SOURCE` com o caminho da fonte.

### Manual (sem script)
```bash
pnpm -w install
pnpm -C packages/seedgrid-fe-cli run build
pnpm -C packages/seedgrid-fe-cli link --global
```

## O que é o `link --global`?
O `pnpm link --global` cria um atalho global para o pacote local do CLI.
Com isso, o binário `seedgrid` passa a existir dentro do `PNPM_HOME` (ex.: `C:\Users\<usuario>\AppData\Local\pnpm`).
Se o `PNPM_HOME` estiver no `PATH`, qualquer terminal encontra o comando `seedgrid`.
Isso permite usar o CLI local sem publicar o pacote no npm.

### Alternativa sem link
Você também pode executar o CLI sem instalar globalmente:
```bash
pnpm -C packages/seedgrid-fe-cli exec seedgrid -- --help
```

## Como usar o CLI

### 1) Criar um app
```bash
seedgrid init seedgrid-fe-app
cd seedgrid-fe-app
```

### 2) Adicionar módulos
```bash
seedgrid add @seedgrid/fe-commons
seedgrid add @seedgrid/fe-theme
seedgrid add @seedgrid/fe-security
seedgrid add @seedgrid/fe-audit
seedgrid add @seedgrid/fe-backup
```

> Observação: no monorepo usamos `workspace:*` nas dependências. O comando `add` registra o manifest no `seedgrid.config.ts` e mescla o `pt-BR.json` do módulo no app.

### 3) Fluxo esperado do `seedgrid add`
- adiciona a dependência no `package.json`
- registra o manifest em `seedgrid.config.ts`
- mescla i18n em `src/i18n/messages/pt-BR/<namespace>.json`

## Os módulos ficam dentro do CLI?
Não. O CLI é apenas a ferramenta que cria o app e injeta módulos. Os módulos ficam em pacotes separados (`packages/seedgrid-fe-*`).
No monorepo, eles são irmãos do CLI. Em uso externo, eles seriam instalados como dependências NPM.
