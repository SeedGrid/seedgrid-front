// Garante que os pacotes do workspace que o showcase consome estejam compilados — SEM reconstruir
// o que ja' esta' pronto.
//
// O `predev` do showcase rodava `pnpm -C ../../packages/... build` incondicionalmente. Esse `build`
// comeca com `clean` (`rmSync('dist')`), e o `turbo dev` roda o `predev` do showcase EM PARALELO
// com `fe-components:dev` e `fe-playground:dev`, que escrevem/leem esses mesmos `dist/`. Resultado:
// um processo apagava o `dist` debaixo do outro. Dava ENOENT no build-style, TS2307 no playground,
// e — porque a tarefa morria — o `next dev` ficava orfao segurando a porta 3100, o que fazia a
// tentativa seguinte falhar por outro motivo.
//
// Aqui a reconstrucao vira condicional: se o `dist` ja' existe e tem conteudo, nao se mexe nele.
// Sob o `turbo`, o `dependsOn: ["^build"]` ja' construiu tudo antes → este script nao faz nada e
// nao ha' disputa. Rodando o showcase sozinho (`pnpm dev:showcase`) num clone novo, o `dist` nao
// existe → constroi, como antes.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(here, "..", "..", "..", "packages");

/** `dist` presente e nao-vazio conta como construido. */
function isBuilt(packageDir) {
  const dist = path.join(packageDir, "dist");
  try {
    return fs.statSync(dist).isDirectory() && fs.readdirSync(dist).length > 0;
  } catch {
    return false;
  }
}

for (const name of ["seedgrid-fe-components", "seedgrid-fe-playground"]) {
  const packageDir = path.join(packagesDir, name);
  if (isBuilt(packageDir)) {
    console.log(`[predev] ${name}: dist ja' presente, nao reconstruindo`);
    continue;
  }
  console.log(`[predev] ${name}: dist ausente, construindo`);
  execFileSync("pnpm", ["-C", packageDir, "build"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}
