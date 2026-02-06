import path from "node:path";
import fs from "fs-extra";

export async function mergePtBrNamespace(params: {
  appRoot: string;
  namespace: string;
  resources: Record<string, string>;
}) {
  const file = path.join(
    params.appRoot,
    "src",
    "i18n",
    "messages",
    "pt-BR",
    `${params.namespace}.json`
  );

  const current = (await fs.pathExists(file)) ? await fs.readJson(file) : {};
  const merged = { ...current, ...params.resources };

  await fs.ensureDir(path.dirname(file));
  await fs.writeJson(file, merged, { spaces: 2 });
}
