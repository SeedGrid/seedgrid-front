import { promises as fs } from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "src", "i18n", "pt-BR.json");
const dst = path.join(process.cwd(), "dist", "i18n", "pt-BR.json");

await fs.mkdir(path.dirname(dst), { recursive: true });
await fs.copyFile(src, dst);
console.log("copied i18n:", dst);
