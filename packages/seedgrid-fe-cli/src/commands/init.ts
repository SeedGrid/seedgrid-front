import fs from "fs-extra";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { ensureSeedgridVendor, vendorDependencySpec } from "../lib/seedgridVendor.js";

const APP_I18N = {
  "app.errors.401.title": "Não autorizado",
  "app.errors.401.message": "Você precisa estar autenticado para acessar esta página.",
  "app.errors.403.title": "Acesso proibido",
  "app.errors.403.message": "Você não tem permissão para acessar este recurso.",
  "app.errors.404.title": "Recurso não encontrado",
  "app.errors.404.message": "A página solicitada não existe ou foi movida.",
  "app.errors.500.title": "Algo deu errado",
  "app.errors.500.message": "Ocorreu um problema no servidor. Estamos cuidando disso.",
  "app.errors.cta.home": "Voltar para o início",
  "app.errors.cta.retry": "Tentar novamente",
  "app.theme.title": "Personalizar tema",
  "app.theme.primary": "Cor primária",
  "app.theme.accent": "Cor de destaque",
  "app.theme.background": "Cor de fundo",
  "app.theme.foreground": "Cor do texto",
  "app.theme.reset": "Restaurar padrão",
  "app.nav.theme": "Tema"
};

type Palette = {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  onTertiary: string;
  error: string;
  onError: string;
};

const MUI_COLORS: Record<string, { main: string; on: string }> = {
  red: { main: "#f44336", on: "#ffffff" },
  pink: { main: "#e91e63", on: "#ffffff" },
  purple: { main: "#9c27b0", on: "#ffffff" },
  deeppurple: { main: "#673ab7", on: "#ffffff" },
  indigo: { main: "#3f51b5", on: "#ffffff" },
  blue: { main: "#2196f3", on: "#ffffff" },
  lightblue: { main: "#03a9f4", on: "#00313b" },
  cyan: { main: "#00bcd4", on: "#00313b" },
  teal: { main: "#009688", on: "#ffffff" },
  green: { main: "#4caf50", on: "#ffffff" },
  lightgreen: { main: "#8bc34a", on: "#0b1f0f" },
  lime: { main: "#cddc39", on: "#1a1a1a" },
  yellow: { main: "#ffeb3b", on: "#1a1a1a" },
  amber: { main: "#ffc107", on: "#1a1a1a" },
  orange: { main: "#ff9800", on: "#1a1a1a" },
  deeporange: { main: "#ff5722", on: "#ffffff" },
  brown: { main: "#795548", on: "#ffffff" },
  grey: { main: "#9e9e9e", on: "#1a1a1a" },
  bluegrey: { main: "#607d8b", on: "#ffffff" }
};

const FALLBACK_SECONDARY = { main: "#7c3aed", on: "#ffffff" };
const FALLBACK_TERTIARY = { main: "#14b8a6", on: "#ffffff" };
const FALLBACK_ERROR = { main: "#d32f2f", on: "#ffffff" };

function normalizeColorKey(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "");
}

function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

function hexToRgb(value: string) {
  const cleaned = value.replace("#", "").trim();
  const full = cleaned.length === 3
    ? cleaned
        .split("")
        .map((c) => c + c)
        .join("")
    : cleaned.padEnd(6, "0");
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

function pickOnColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

function buildPalette(primaryInput: string): Palette {
  const trimmed = primaryInput.trim();
  if (isHexColor(trimmed)) {
    return {
      primary: trimmed,
      onPrimary: pickOnColor(trimmed),
      secondary: FALLBACK_SECONDARY.main,
      onSecondary: FALLBACK_SECONDARY.on,
      tertiary: FALLBACK_TERTIARY.main,
      onTertiary: FALLBACK_TERTIARY.on,
      error: FALLBACK_ERROR.main,
      onError: FALLBACK_ERROR.on
    };
  }

  const key = normalizeColorKey(trimmed);
  const match = (MUI_COLORS[key] ?? MUI_COLORS.green) as { main: string; on: string };
  return {
    primary: match.main,
    onPrimary: match.on,
    secondary: FALLBACK_SECONDARY.main,
    onSecondary: FALLBACK_SECONDARY.on,
    tertiary: FALLBACK_TERTIARY.main,
    onTertiary: FALLBACK_TERTIARY.on,
    error: FALLBACK_ERROR.main,
    onError: FALLBACK_ERROR.on
  };
}

async function askLine(question: string) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

export async function cmdInit(params: { appName?: string }) {
  let appName = params.appName?.trim();
  if (!appName) {
    appName = await askLine("Nome da pasta do app: ");
  }
  if (!appName) {
    throw new Error("Nome do app nao informado.");
  }

  const descriptiveName = await askLine("Nome descritivo do projeto: ");
  const primaryInput = await askLine(
    "Cor primaria (nome em ingles ou hex, ex: green, blue, #16a34a): "
  );
  const palette = buildPalette(primaryInput || "green");

  const root = process.cwd();
  const appRoot = path.join(root, appName);

  if (await fs.pathExists(appRoot)) {
    throw new Error("Pasta ja existe.");
  }

  await fs.ensureDir(appRoot);

  const seedgridDeps = [
    "@seedgrid/fe-core",
    "@seedgrid/fe-commons",
    "@seedgrid/fe-theme"
  ];

  await fs.writeJson(
    path.join(appRoot, "package.json"),
    {
      name: appName,
      private: true,
      type: "module",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
        typecheck: "tsc --noEmit",
        seedgrid: "seedgrid"
      },
      dependencies: {
        next: "15.0.7",
        react: "18.2.0",
        "react-dom": "18.2.0",
        clsx: "^2.1.1",
        "tailwind-merge": "^2.5.2",
        "class-variance-authority": "^0.7.0",
        "@seedgrid/fe-core": vendorDependencySpec("@seedgrid/fe-core"),
        "@seedgrid/fe-commons": vendorDependencySpec("@seedgrid/fe-commons"),
        "@seedgrid/fe-theme": vendorDependencySpec("@seedgrid/fe-theme"),
        "@seedgrid/fe-components": vendorDependencySpec("@seedgrid/fe-components")
      },
      devDependencies: {
        tailwindcss: "^3.4.10",
        "tailwindcss-animate": "^1.0.7",
        postcss: "^8.4.45",
        autoprefixer: "^10.4.20",
        typescript: "^5.5.4",
        "@types/react": "18.2.0",
        "@types/react-dom": "18.2.0"
      }
    },
    { spaces: 2 }
  );

  await fs.writeFile(
    path.join(appRoot, "next.config.ts"),
    `const nextConfig = {\n  reactStrictMode: true,\n  transpilePackages: [\n    "@seedgrid/fe-core",\n    "@seedgrid/fe-commons",\n    "@seedgrid/fe-theme",\n    "@seedgrid/fe-components",\n    "@seedgrid/fe-audit",\n    "@seedgrid/fe-backup",\n    "@seedgrid/fe-multitenancy"\n  ]\n};\n\nexport default nextConfig;\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "postcss.config.mjs"),
    "export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "tailwind.config.ts"),
    "import type { Config } from \"tailwindcss\";\nimport animate from \"tailwindcss-animate\";\n\nconst config = {\n  darkMode: [\"class\"],\n  content: [\"./src/**/*.{ts,tsx}\", \"./seedgrid-packages/**/*.{ts,tsx}\"],\n  theme: {\n    container: {\n      center: true,\n      padding: \"2rem\",\n      screens: {\n        \"2xl\": \"1400px\"\n      }\n    },\n    extend: {\n      colors: {\n        border: \"hsl(var(--border))\",\n        input: \"hsl(var(--input))\",\n        ring: \"hsl(var(--ring))\",\n        background: \"hsl(var(--background))\",\n        foreground: \"hsl(var(--foreground))\",\n        primary: {\n          DEFAULT: \"hsl(var(--primary))\",\n          foreground: \"hsl(var(--primary-foreground))\"\n        },\n        secondary: {\n          DEFAULT: \"hsl(var(--secondary))\",\n          foreground: \"hsl(var(--secondary-foreground))\"\n        },\n        destructive: {\n          DEFAULT: \"hsl(var(--destructive))\",\n          foreground: \"hsl(var(--destructive-foreground))\"\n        },\n        muted: {\n          DEFAULT: \"hsl(var(--muted))\",\n          foreground: \"hsl(var(--muted-foreground))\"\n        },\n        accent: {\n          DEFAULT: \"hsl(var(--accent))\",\n          foreground: \"hsl(var(--accent-foreground))\"\n        },\n        popover: {\n          DEFAULT: \"hsl(var(--popover))\",\n          foreground: \"hsl(var(--popover-foreground))\"\n        },\n        card: {\n          DEFAULT: \"hsl(var(--card))\",\n          foreground: \"hsl(var(--card-foreground))\"\n        }\n      },\n      borderRadius: {\n        lg: \"var(--radius)\",\n        md: \"calc(var(--radius) - 2px)\",\n        sm: \"calc(var(--radius) - 4px)\"\n      },\n      keyframes: {\n        \"accordion-down\": {\n          from: { height: \"0\" },\n          to: { height: \"var(--radix-accordion-content-height)\" }\n        },\n        \"accordion-up\": {\n          from: { height: \"var(--radix-accordion-content-height)\" },\n          to: { height: \"0\" }\n        }\n      },\n      animation: {\n        \"accordion-down\": \"accordion-down 0.2s ease-out\",\n        \"accordion-up\": \"accordion-up 0.2s ease-out\"\n      }\n    }\n  },\n  plugins: [animate]\n} satisfies Config;\n\nexport default config;\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "tsconfig.base.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          jsx: "react-jsx",
          strict: true,
          noUncheckedIndexedAccess: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          esModuleInterop: true,
          resolveJsonModule: true,
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*"]
          }
        }
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "./tsconfig.base.json",
        compilerOptions: {
          noEmit: true
        },
        include: ["src", "next-env.d.ts"],
        exclude: ["node_modules"]
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "components.json"),
    "{\n  \"$schema\": \"https://ui.shadcn.com/schema.json\",\n  \"style\": \"default\",\n  \"rsc\": true,\n  \"tsx\": true,\n  \"tailwind\": {\n    \"config\": \"tailwind.config.ts\",\n    \"css\": \"src/app/globals.css\",\n    \"baseColor\": \"slate\",\n    \"cssVariables\": true,\n    \"prefix\": \"\"\n  },\n  \"aliases\": {\n    \"components\": \"@/components\",\n    \"utils\": \"@/lib/utils\"\n  }\n}\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "next-env.d.ts"),
    "/// <reference types=\"next\" />\n/// <reference types=\"next/image-types/global\" />\n\n// NOTE: This file should not be edited\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(appRoot, "seedgrid.config.ts"),
    `import type { SeedGridModuleManifest } from "@seedgrid/fe-core";
import { commonsManifest } from "@seedgrid/fe-commons";
import { themeManifest } from "@seedgrid/fe-theme";

export type SeedGridAppConfig = {
  appName: string;
  appTitle?: string;
  locale: "pt-BR";
  theme?: {
    brand?: { name?: string; logoUrl?: string };
    colors?: {
      primary?: string;
      onPrimary?: string;
      secondary?: string;
      onSecondary?: string;
      tertiary?: string;
      onTertiary?: string;
      error?: string;
      onError?: string;
      accent?: string;
      background?: string;
      foreground?: string;
    };
    layout?: { sidebarWidth?: number; radius?: number };
  };
  modules: SeedGridModuleManifest[];
};

export const seedgridConfig: SeedGridAppConfig = {
  appName: "${descriptiveName || appName}",
  appTitle: "${descriptiveName || appName}",
  locale: "pt-BR",
  theme: {
    brand: { name: "${descriptiveName || appName}" },
    colors: {
      primary: "${palette.primary}",
      onPrimary: "${palette.onPrimary}",
      secondary: "${palette.secondary}",
      onSecondary: "${palette.onSecondary}",
      tertiary: "${palette.tertiary}",
      onTertiary: "${palette.onTertiary}",
      error: "${palette.error}",
      onError: "${palette.onError}",
      accent: "${palette.secondary}",
      background: "#ffffff",
      foreground: "#0b0b0b"
    }
  },
  modules: [commonsManifest, themeManifest]
};
`,
    "utf8"
  );

  const files: Array<{ path: string; content: string }> = [
    {
      path: path.join(appRoot, "src", "app", "globals.css"),
      content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;\n    --card: var(--background);\n    --card-foreground: var(--foreground);\n    --popover: var(--background);\n    --popover-foreground: var(--foreground);\n    --primary: 142 76% 36%;\n    --primary-foreground: 0 0% 100%;\n    --secondary: 210 40% 96.1%;\n    --secondary-foreground: 222.2 47.4% 11.2%;\n    --muted: 210 40% 96.1%;\n    --muted-foreground: 215.4 16.3% 46.9%;\n    --accent: 152 57% 40%;\n    --accent-foreground: 0 0% 100%;\n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 0 0% 100%;\n    --border: 214.3 31.8% 91.4%;\n    --input: 214.3 31.8% 91.4%;\n    --ring: var(--primary);\n    --radius: 12px;\n    --sg-primary: hsl(var(--primary));\n    --sg-accent: hsl(var(--accent));\n    --sg-bg: hsl(var(--background));\n    --sg-fg: hsl(var(--foreground));\n    --sg-radius: var(--radius);\n    --sg-sidebar: 260px;\n  }\n\n  .dark {\n    --background: 222.2 84% 4.9%;\n    --foreground: 210 40% 98%;\n    --card: var(--background);\n    --card-foreground: var(--foreground);\n    --popover: var(--background);\n    --popover-foreground: var(--foreground);\n    --primary: 142 70% 45%;\n    --primary-foreground: 222.2 84% 4.9%;\n    --secondary: 217.2 32.6% 17.5%;\n    --secondary-foreground: 210 40% 98%;\n    --muted: 217.2 32.6% 17.5%;\n    --muted-foreground: 215 20.2% 65.1%;\n    --accent: 152 57% 40%;\n    --accent-foreground: 210 40% 98%;\n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 210 40% 98%;\n    --border: 217.2 32.6% 17.5%;\n    --input: 217.2 32.6% 17.5%;\n    --ring: var(--primary);\n  }\n\n  * {\n    @apply border-border;\n  }\n\n  body {\n    @apply bg-background text-foreground;\n  }\n}\n\na { color: inherit; text-decoration: none; }\n\n.sg-error-screen {\n  position: fixed;\n  inset: 0;\n  z-index: 50;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  text-align: center;\n  color: var(--sg-error-fg, #ffffff);\n  background-color: var(--sg-primary);\n  background-image:\n    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.18)),\n    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.08), transparent 40%),\n    radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.06), transparent 35%),\n    radial-gradient(circle at 82% 80%, rgba(255, 255, 255, 0.04), transparent 32%),\n    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 14px);\n}\n\n.sg-error-inner {\n  width: 100%;\n  max-width: 560px;\n}\n\n.sg-error-code {\n  font-size: clamp(72px, 18vw, 180px);\n  font-weight: 700;\n  line-height: 1;\n  letter-spacing: -0.04em;\n}\n\n.sg-error-title {\n  margin-top: 0.5rem;\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n\n.sg-error-message {\n  margin-top: 0.35rem;\n  opacity: 0.9;\n}\n\n.sg-error-actions {\n  margin-top: 1.35rem;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  justify-content: center;\n}\n\n.sg-error-btn {\n  background: var(--sg-accent, #22c55e);\n  color: #ffffff;\n  border: 0;\n  padding: 0.65rem 1.4rem;\n  border-radius: 999px;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n\n.sg-error-btn.secondary {\n  background: rgba(255, 255, 255, 0.16);\n  border: 1px solid rgba(255, 255, 255, 0.25);\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "layout.tsx"),
      content: `import "./globals.css";\nimport React from "react";\nimport { SeedGridAppProvider } from "../seedgrid/provider";\nimport { SeedGridNav } from "../seedgrid/navigation";\nimport { AppShell } from "@seedgrid/fe-theme";\nimport { SgToaster } from "@seedgrid/fe-components";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"pt-BR\">\n      <body>\n        <SeedGridAppProvider>\n          <AppShell nav={<SeedGridNav />}>{children}</AppShell>\n          <SgToaster />\n        </SeedGridAppProvider>\n      </body>\n    </html>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "page.tsx"),
      content: `export default function HomePage() {\n  return (\n    <div className=\"space-y-2\">\n      <h1 className=\"text-xl font-semibold\">SeedGrid FE</h1>\n      <p>Base pronta. Use o CLI para adicionar modulos.</p>\n    </div>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "lib", "utils.ts"),
      content: `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "not-found.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../seedgrid/error-screen";\nimport { useI18n, t } from "../seedgrid/provider";\n\nexport default function NotFound() {\n  const i18n = useI18n();\n  return (\n    <ErrorScreen\n      code=\"404\"\n      title={t(i18n, \"app.errors.404.title\")}\n      message={t(i18n, \"app.errors.404.message\")}\n      homeLabel={t(i18n, \"app.errors.cta.home\")}\n    />\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "error.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../seedgrid/error-screen";\nimport { useI18n, t } from "../seedgrid/provider";\n\nexport default function Error({ reset }: { error: Error; reset: () => void }) {\n  const i18n = useI18n();\n  return (\n    <ErrorScreen\n      code=\"500\"\n      title={t(i18n, \"app.errors.500.title\")}\n      message={t(i18n, \"app.errors.500.message\")}\n      homeLabel={t(i18n, \"app.errors.cta.home\")}\n      retryLabel={t(i18n, \"app.errors.cta.retry\")}\n      onRetry={reset}\n    />\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "global-error.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../seedgrid/error-screen";\n\nexport default function GlobalError({ reset }: { error: Error; reset: () => void }) {\n  return (\n    <html lang=\"pt-BR\">\n      <body>\n        <ErrorScreen\n          code=\"500\"\n          title=\"Algo deu errado\"\n          message=\"Ocorreu um problema no servidor. Estamos cuidando disso.\"\n          homeLabel=\"Voltar para o início\"\n          retryLabel=\"Tentar novamente\"\n          onRetry={reset}\n        />\n      </body>\n    </html>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "401", "page.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../../seedgrid/error-screen";\nimport { useI18n, t } from "../../seedgrid/provider";\n\nexport default function Error401Page() {\n  const i18n = useI18n();\n  return (\n    <ErrorScreen\n      code=\"401\"\n      title={t(i18n, \"app.errors.401.title\")}\n      message={t(i18n, \"app.errors.401.message\")}\n      homeLabel={t(i18n, \"app.errors.cta.home\")}\n    />\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "403", "page.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../../seedgrid/error-screen";\nimport { useI18n, t } from "../../seedgrid/provider";\n\nexport default function Error403Page() {\n  const i18n = useI18n();\n  return (\n    <ErrorScreen\n      code=\"403\"\n      title={t(i18n, \"app.errors.403.title\")}\n      message={t(i18n, \"app.errors.403.message\")}\n      homeLabel={t(i18n, \"app.errors.cta.home\")}\n    />\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "500", "page.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ErrorScreen } from "../../seedgrid/error-screen";\nimport { useI18n, t } from "../../seedgrid/provider";\n\nexport default function Error500Page() {\n  const i18n = useI18n();\n  return (\n    <ErrorScreen\n      code=\"500\"\n      title={t(i18n, \"app.errors.500.title\")}\n      message={t(i18n, \"app.errors.500.message\")}\n      homeLabel={t(i18n, \"app.errors.cta.home\")}\n    />\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "app", "(protected)", "theme", "page.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { ThemeCustomizer } from "../../../seedgrid/theme-customizer";\n\nexport default function ThemePage() {\n  return <ThemeCustomizer />;\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "runtime.ts"),
      content: `import { SeedGridRegistry } from "@seedgrid/fe-core";\nimport { seedgridConfig } from "../../seedgrid.config";\nimport { appMessagesPtBr } from "../i18n";\n\nexport function buildRegistry() {\n  const registry = new SeedGridRegistry();\n  for (const mod of seedgridConfig.modules) mod.register(registry);\n  return registry;\n}\n\nexport function buildMessagesPtBr() {\n  const out: Record<string, Record<string, string>> = {};\n\n  for (const mod of seedgridConfig.modules) {\n    const bundles = mod.i18n?.bundles ?? [];\n    for (const b of bundles) {\n      out[b.namespace] = { ...(out[b.namespace] ?? {}), ...(b.resources ?? {}) };\n    }\n  }\n\n  for (const [namespace, resources] of Object.entries(appMessagesPtBr)) {\n    out[namespace] = { ...(out[namespace] ?? {}), ...(resources ?? {}) };\n  }\n\n  return out;\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "provider.tsx"),
      content: `"use client";\n\nimport React, { useMemo } from "react";\nimport { buildRegistry, buildMessagesPtBr } from "./runtime";\nimport { seedgridConfig } from "../../seedgrid.config";\nimport type { SeedGridThemeConfig } from "@seedgrid/fe-theme";\nimport { ThemeProvider } from "@seedgrid/fe-theme";\nimport { ThemeRuntimeProvider, useThemeRuntime } from "./themeRuntime";\n\ntype I18nState = {\n  locale: "pt-BR";\n  messages: Record<string, Record<string, string>>;\n};\n\nconst I18nContext = React.createContext<I18nState | null>(null);\n\nexport function useI18n() {\n  const ctx = React.useContext(I18nContext);\n  if (!ctx) throw new Error("useI18n must be used inside SeedGridAppProvider");\n  return ctx;\n}\n\nexport function t(i18n: I18nState, key: string): string {\n  const dot = key.indexOf(".");\n  if (dot < 0) return key;\n  const ns = key.slice(0, dot);\n  return i18n.messages?.[ns]?.[key] ?? key;\n}\n\nfunction mergeTheme(base?: Partial<SeedGridThemeConfig>, overrides?: Partial<SeedGridThemeConfig>) {\n  return {\n    ...(base ?? {}),\n    ...(overrides ?? {}),\n    brand: { ...(base?.brand ?? {}), ...(overrides?.brand ?? {}) },\n    colors: { ...(base?.colors ?? {}), ...(overrides?.colors ?? {}) },\n    layout: { ...(base?.layout ?? {}), ...(overrides?.layout ?? {}) }\n  };\n}\n\nfunction ThemeRoot(props: { children: React.ReactNode }) {\n  const { overrides } = useThemeRuntime();\n  const themeOverrides = useMemo(\n    () => mergeTheme(seedgridConfig.theme as Partial<SeedGridThemeConfig> | undefined, overrides),\n    [overrides]\n  );\n\n  return <ThemeProvider theme={themeOverrides}>{props.children}</ThemeProvider>;\n}\n\nexport function SeedGridAppProvider(props: { children: React.ReactNode }) {\n  const registry = useMemo(() => buildRegistry(), []);\n  const i18n = useMemo<I18nState>(() => ({ locale: "pt-BR", messages: buildMessagesPtBr() }), []);\n\n  const providers = registry.getProviders();\n  const composed = providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, props.children);\n\n  return (\n    <I18nContext.Provider value={i18n}>\n      <ThemeRuntimeProvider>\n        <ThemeRoot>{composed}</ThemeRoot>\n      </ThemeRuntimeProvider>\n    </I18nContext.Provider>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "navigation.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport Link from "next/link";\nimport { buildRegistry } from "./runtime";\nimport { useI18n, t } from "./provider";\n\nexport function SeedGridNav() {\n  const registry = React.useMemo(() => buildRegistry(), []);\n  const items = registry.getNavItems();\n  const i18n = useI18n();\n\n  const extraItems = [\n    { id: "theme", href: "/theme", labelKey: "app.nav.theme", requiresAuth: false }\n  ];\n\n  const allItems = [...items, ...extraItems];\n\n  return (\n    <nav className=\"flex flex-col gap-2\">\n      {allItems.map((i) => (\n        <Link key={i.id} href={i.href} className=\"rounded px-2 py-1 hover:bg-black/5\">\n          {t(i18n, i.labelKey)}\n        </Link>\n      ))}\n    </nav>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "themeRuntime.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport type { SeedGridThemeConfig } from "@seedgrid/fe-theme";\n\ntype ThemeOverrides = Partial<SeedGridThemeConfig>;\n\ntype ThemeRuntimeCtx = {\n  overrides: ThemeOverrides;\n  setOverrides: (next: ThemeOverrides) => void;\n  resetOverrides: () => void;\n};\n\nconst STORAGE_KEY = "seedgrid.theme";\nconst ThemeRuntimeContext = React.createContext<ThemeRuntimeCtx | null>(null);\n\nfunction mergeTheme(base: ThemeOverrides, next: ThemeOverrides): ThemeOverrides {\n  return {\n    ...base,\n    ...next,\n    brand: { ...(base.brand ?? {}), ...(next.brand ?? {}) },\n    colors: { ...(base.colors ?? {}), ...(next.colors ?? {}) },\n    layout: { ...(base.layout ?? {}), ...(next.layout ?? {}) }\n  };\n}\n\nfunction readStored(): ThemeOverrides {\n  if (typeof window === "undefined") return {};\n  try {\n    const raw = localStorage.getItem(STORAGE_KEY);\n    if (!raw) return {};\n    const parsed = JSON.parse(raw);\n    if (!parsed || typeof parsed !== "object") return {};\n    return parsed as ThemeOverrides;\n  } catch {\n    return {};\n  }\n}\n\nfunction writeStored(next: ThemeOverrides) {\n  try {\n    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));\n  } catch {\n    // ignore\n  }\n}\n\nfunction clearStored() {\n  try {\n    localStorage.removeItem(STORAGE_KEY);\n  } catch {\n    // ignore\n  }\n}\n\nexport function ThemeRuntimeProvider(props: { children: React.ReactNode }) {\n  const [overrides, setOverridesState] = React.useState<ThemeOverrides>({});\n\n  React.useEffect(() => {\n    setOverridesState(readStored());\n  }, []);\n\n  const setOverrides = React.useCallback((next: ThemeOverrides) => {\n    setOverridesState((prev) => {\n      const merged = mergeTheme(prev, next);\n      writeStored(merged);\n      return merged;\n    });\n  }, []);\n\n  const resetOverrides = React.useCallback(() => {\n    setOverridesState({});\n    clearStored();\n  }, []);\n\n  return (\n    <ThemeRuntimeContext.Provider value={{ overrides, setOverrides, resetOverrides }}>\n      {props.children}\n    </ThemeRuntimeContext.Provider>\n  );\n}\n\nexport function useThemeRuntime() {\n  const ctx = React.useContext(ThemeRuntimeContext);\n  if (!ctx) throw new Error("useThemeRuntime must be used inside ThemeRuntimeProvider");\n  return ctx;\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "theme-customizer.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport { useTheme } from "@seedgrid/fe-theme";\nimport { useThemeRuntime } from "./themeRuntime";\nimport { useI18n, t } from "./provider";\n\ntype HslParts = { h: number; s: number; l: number };\n\nfunction clamp(value: number, min: number, max: number) {\n  return Math.min(Math.max(value, min), max);\n}\n\nfunction hexToHsl(hex: string) {\n  const cleaned = hex.replace("#", "").trim();\n  const full = cleaned.length === 3\n    ? cleaned\n        .split("")\n        .map((c) => c + c)\n        .join("")\n    : cleaned.padEnd(6, "0");\n\n  const r = parseInt(full.slice(0, 2), 16) / 255;\n  const g = parseInt(full.slice(2, 4), 16) / 255;\n  const b = parseInt(full.slice(4, 6), 16) / 255;\n\n  const max = Math.max(r, g, b);\n  const min = Math.min(r, g, b);\n  let h = 0;\n  let s = 0;\n  const l = (max + min) / 2;\n\n  if (max !== min) {\n    const d = max - min;\n    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);\n    switch (max) {\n      case r:\n        h = (g - b) / d + (g < b ? 6 : 0);\n        break;\n      case g:\n        h = (b - r) / d + 2;\n        break;\n      default:\n        h = (r - g) / d + 4;\n    }\n    h /= 6;\n  }\n\n  const hDeg = Math.round(h * 360);\n  const sPct = Math.round(s * 100);\n  const lPct = Math.round(l * 100);\n  return hDeg + " " + sPct + "% " + lPct + "%";\n}\n\nfunction normalizeHsl(value: string) {\n  const trimmed = value.trim();\n  if (trimmed.startsWith("#")) return hexToHsl(trimmed);\n  if (trimmed.startsWith("hsl")) {\n    return trimmed.replace(/hsl\\(|\\)/g, "").replace(/,/g, " ").replace(/\\s+/g, " ").trim();\n  }\n  return trimmed.replace(/\\s+/g, " ").trim();\n}\n\nfunction parseHsl(value: string): HslParts | null {\n  const normalized = normalizeHsl(value);\n  const parts = normalized.split(/\\s+/).filter(Boolean);\n  if (parts.length < 3) return null;\n  const h = parseFloat(parts[0]);\n  const s = parseFloat(parts[1].replace("%", ""));\n  const l = parseFloat(parts[2].replace("%", ""));\n  if ([h, s, l].some((n) => Number.isNaN(n))) return null;\n  return { h, s, l };\n}\n\nfunction hueToRgb(p: number, q: number, t: number) {\n  let tt = t;\n  if (tt < 0) tt += 1;\n  if (tt > 1) tt -= 1;\n  if (tt < 1 / 6) return p + (q - p) * 6 * tt;\n  if (tt < 1 / 2) return q;\n  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;\n  return p;\n}\n\nfunction hslToHex(value: string) {\n  const parsed = parseHsl(value);\n  if (!parsed) return "#000000";\n\n  const h = ((parsed.h % 360) + 360) / 360;\n  const s = clamp(parsed.s, 0, 100) / 100;\n  const l = clamp(parsed.l, 0, 100) / 100;\n\n  let r = l;\n  let g = l;\n  let b = l;\n\n  if (s !== 0) {\n    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;\n    const p = 2 * l - q;\n    r = hueToRgb(p, q, h + 1 / 3);\n    g = hueToRgb(p, q, h);\n    b = hueToRgb(p, q, h - 1 / 3);\n  }\n\n  const toHex = (val: number) => Math.round(val * 255).toString(16).padStart(2, "0");\n  return "#" + toHex(r) + toHex(g) + toHex(b);\n}\n\nexport function ThemeCustomizer() {\n  const theme = useTheme();\n  const { overrides, setOverrides, resetOverrides } = useThemeRuntime();\n  const i18n = useI18n();\n\n  const current = {\n    primary: normalizeHsl(overrides.colors?.primary ?? theme.colors.primary),\n    accent: normalizeHsl(overrides.colors?.accent ?? theme.colors.accent),\n    background: normalizeHsl(overrides.colors?.background ?? theme.colors.background),\n    foreground: normalizeHsl(overrides.colors?.foreground ?? theme.colors.foreground)\n  };\n\n  return (\n    <div className="space-y-4">\n      <div>\n        <h1 className="text-xl font-semibold">{t(i18n, "app.theme.title")}</h1>\n        <p className="text-sm text-black/60">Altere as cores e salve no navegador.</p>\n      </div>\n\n      <div className="grid gap-4 sm:grid-cols-2">\n        <label className="space-y-2 text-sm">\n          <span>{t(i18n, "app.theme.primary")}</span>\n          <input\n            className="h-11 w-full rounded-md border border-black/10 bg-white p-1"\n            type="color"\n            value={hslToHex(current.primary)}\n            onChange={(e) => setOverrides({ colors: { primary: hexToHsl(e.target.value) } })}\n          />\n        </label>\n\n        <label className="space-y-2 text-sm">\n          <span>{t(i18n, "app.theme.accent")}</span>\n          <input\n            className="h-11 w-full rounded-md border border-black/10 bg-white p-1"\n            type="color"\n            value={hslToHex(current.accent)}\n            onChange={(e) => setOverrides({ colors: { accent: hexToHsl(e.target.value) } })}\n          />\n        </label>\n\n        <label className="space-y-2 text-sm">\n          <span>{t(i18n, "app.theme.background")}</span>\n          <input\n            className="h-11 w-full rounded-md border border-black/10 bg-white p-1"\n            type="color"\n            value={hslToHex(current.background)}\n            onChange={(e) => setOverrides({ colors: { background: hexToHsl(e.target.value) } })}\n          />\n        </label>\n\n        <label className="space-y-2 text-sm">\n          <span>{t(i18n, "app.theme.foreground")}</span>\n          <input\n            className="h-11 w-full rounded-md border border-black/10 bg-white p-1"\n            type="color"\n            value={hslToHex(current.foreground)}\n            onChange={(e) => setOverrides({ colors: { foreground: hexToHsl(e.target.value) } })}\n          />\n        </label>\n      </div>\n\n      <button className="border rounded px-3 py-2" onClick={resetOverrides}>\n        {t(i18n, "app.theme.reset")}\n      </button>\n    </div>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "seedgrid", "error-screen.tsx"),
      content: `"use client";\n\nimport React from "react";\nimport Link from "next/link";\n\nexport type ErrorScreenProps = {\n  code: string;\n  title: string;\n  message: string;\n  homeLabel: string;\n  retryLabel?: string;\n  onRetry?: () => void;\n};\n\nexport function ErrorScreen(props: ErrorScreenProps) {\n  return (\n    <main className=\"sg-error-screen\">\n      <div className=\"sg-error-inner\">\n        <div className=\"sg-error-code\">{props.code}</div>\n        <div className=\"sg-error-title\">{props.title}</div>\n        <div className=\"sg-error-message\">{props.message}</div>\n        <div className=\"sg-error-actions\">\n          <Link href=\"/\" className=\"sg-error-btn\">\n            {props.homeLabel}\n          </Link>\n          {props.retryLabel && props.onRetry ? (\n            <button className=\"sg-error-btn secondary\" type=\"button\" onClick={props.onRetry}>\n              {props.retryLabel}\n            </button>\n          ) : null}\n        </div>\n      </div>\n    </main>\n  );\n}\n`
    },
    {
      path: path.join(appRoot, "src", "i18n", "index.ts"),
      content: `import app from "./messages/pt-BR/app.json";\nimport commons from "./messages/pt-BR/commons.json";\nimport theme from "./messages/pt-BR/theme.json";\n\nexport const appMessagesPtBr = {\n  app,\n  commons,\n  theme\n};\n`
    }
  ];

  for (const f of files) {
    await fs.ensureDir(path.dirname(f.path));
    await fs.writeFile(f.path, f.content, "utf8");
  }

  await fs.ensureDir(path.join(appRoot, "src", "i18n", "messages", "pt-BR"));
  await fs.writeJson(path.join(appRoot, "src", "i18n", "messages", "pt-BR", "app.json"), APP_I18N, { spaces: 2 });
  await fs.writeJson(path.join(appRoot, "src", "i18n", "messages", "pt-BR", "commons.json"), {}, { spaces: 2 });
  await fs.writeJson(path.join(appRoot, "src", "i18n", "messages", "pt-BR", "theme.json"), {}, { spaces: 2 });

  await ensureSeedgridVendor(appRoot, seedgridDeps, { writeSource: true });

  console.log(`App criado em: ${appRoot}`);
}

