"use client";

import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  type SandpackFiles,
  useSandpack
} from "@codesandbox/sandpack-react";
import { SgButton } from "@seedgrid/fe-components";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgCodeBlockBaseProps = {
  code: string;
  interactive?: boolean;
  codeContract?: "renderBody" | "appFile";
  title?: string;
  height?: number;
  className?: string;
  dependencies?: Record<string, string>;
  defaultImports?: string;
  previewWrapperClassName?: string;
  seedgridDependency?: string;
};

const DEFAULT_SEEDGRID_DEPENDENCY = "0.2.6";
const DEFAULT_SEEDGRID_PEER_DEPENDENCIES: Record<string, string> = {
  "react-hook-form": "^7.0.0",
  "lucide-react": "^0.468.0",
  "@tiptap/react": "^2.9.1",
  "@tiptap/starter-kit": "^2.9.1",
  "@tiptap/extension-underline": "^2.9.1",
  "@tiptap/extension-link": "^2.9.1",
  "@tiptap/extension-image": "^2.9.1",
  "@tiptap/extension-text-align": "^2.9.1",
  "@tiptap/extension-text-style": "^2.9.1",
  "@tiptap/extension-color": "^2.9.1",
  "@tiptap/extension-highlight": "^2.9.1",
  "@tiptap/extension-subscript": "^2.9.1",
  "@tiptap/extension-superscript": "^2.9.1",
  "@tiptap/extension-font-family": "^2.9.1"
};

const SANDPACK_EXTERNAL_RESOURCES = [
  // Prebuilt utility CSS so classes from @seedgrid/fe-components can render inside Sandpack
  "https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"
];

const SANDPACK_FALLBACK_THEME_VARS: Readonly<Record<string, string>> = {
  "--background": "0 0% 100%",
  "--foreground": "222.2 84% 4.9%",
  "--primary": "142 76% 36%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "210 40% 96.1%",
  "--secondary-foreground": "222.2 47.4% 11.2%",
  "--accent": "152 57% 40%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 84.2% 60.2%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "214.3 31.8% 91.4%",
  "--ring": "var(--primary)",
  "--sg-primary-600": "22 163 74",
  "--sg-secondary-600": "82 82 91",
  "--sg-tertiary-600": "20 184 166",
  "--sg-error-600": "220 38 38",
  "--sg-warning-600": "217 119 6",
  "--sg-info-600": "2 132 199",
  "--sg-success-600": "22 163 74"
};

const SANDPACK_CORE_THEME_VARS = [
  "--background",
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--ring"
] as const;

const SANDPACK_BASE_STYLES_CSS = `* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: rgb(var(--sg-bg, 255 255 255));
  color: rgb(var(--sg-text, 11 11 12));
}

/* Classes with arbitrary values used by SeedGrid components */
.bg-\\[var\\(--sg-btn-bg\\)\\] { background-color: var(--sg-btn-bg); }
.text-\\[var\\(--sg-btn-fg\\)\\] { color: var(--sg-btn-fg); }
.border-\\[var\\(--sg-btn-border\\)\\] { border-color: var(--sg-btn-border); }
.hover\\:bg-\\[var\\(--sg-btn-hover-bg\\)\\]:hover { background-color: var(--sg-btn-hover-bg); }
.hover\\:text-\\[var\\(--sg-btn-hover-fg\\)\\]:hover { color: var(--sg-btn-hover-fg); }
.hover\\:border-\\[var\\(--sg-btn-hover-border\\)\\]:hover { border-color: var(--sg-btn-hover-border); }
.active\\:bg-\\[var\\(--sg-btn-active-bg\\)\\]:active { background-color: var(--sg-btn-active-bg); }
.focus-visible\\:ring-\\[var\\(--sg-btn-ring\\)\\]:focus-visible { box-shadow: 0 0 0 4px var(--sg-btn-ring); }
.hover\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.12\\)\\]:hover { background-color: rgb(var(--sg-btn-tint) / 0.12); }
.active\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.18\\)\\]:active { background-color: rgb(var(--sg-btn-tint) / 0.18); }
.hover\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.10\\)\\]:hover { background-color: rgb(var(--sg-btn-tint) / 0.10); }
.active\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.16\\)\\]:active { background-color: rgb(var(--sg-btn-tint) / 0.16); }
.transition-\\[background-color\\,color\\,border-color\\,box-shadow\\,transform\\] {
  transition-property: background-color, color, border-color, box-shadow, transform;
}
.active\\:translate-y-\\[0\\.5px\\]:active { transform: translateY(0.5px); }
.size-4 { width: 1rem; height: 1rem; }
.size-5 { width: 1.25rem; height: 1.25rem; }
`;

function readThemeVarsFromHost(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const computed = window.getComputedStyle(document.documentElement);
  const themeVars: Record<string, string> = {};

  for (const varName of SANDPACK_CORE_THEME_VARS) {
    const value = computed.getPropertyValue(varName).trim();
    if (value) themeVars[varName] = value;
  }

  for (let index = 0; index < computed.length; index += 1) {
    const varName = computed.item(index)?.trim();
    if (!varName || !varName.startsWith("--sg-")) continue;
    const value = computed.getPropertyValue(varName).trim();
    if (value) themeVars[varName] = value;
  }

  return themeVars;
}

function buildSandpackStylesCss(themeVars: Record<string, string>): string {
  const mergedVars = { ...SANDPACK_FALLBACK_THEME_VARS, ...themeVars };
  const rootVars = Object.entries(mergedVars)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([varName, value]) => `  ${varName}: ${value};`)
    .join("\n");
  return `:root {
${rootVars}
}

${SANDPACK_BASE_STYLES_CSS}`;
}

const SANDPACK_STYLES_CSS_FALLBACK = buildSandpackStylesCss({});

function ReadonlyBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function buildAppTsxFromRenderBody(
  renderBody: string,
  defaultImports: string,
  wrapperClassName?: string
) {
  const body = renderBody
    .replace(/\t/g, "  ")
    .split("\n")
    .map((line) => (line ? `        ${line}` : ""))
    .join("\n");

  if (!wrapperClassName) {
    return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <>
${body}
    </>
  );
}
`;
  }

  return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <div className="${wrapperClassName}">
      <>
${body}
      </>
    </div>
  );
}
`;
}

async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

function CopyButton() {
  const { sandpack } = useSandpack();
  const [copyState, setCopyState] = React.useState<"idle" | "success" | "error">("idle");

  const handleCopy = React.useCallback(async () => {
    try {
      const activeFilePath = sandpack.activeFile;
      const activeCode = sandpack.files[activeFilePath]?.code ?? "";
      const copied = await copyText(activeCode);
      setCopyState(copied ? "success" : "error");
    } catch {
      setCopyState("error");
    }
  }, [sandpack.activeFile, sandpack.files]);

  React.useEffect(() => {
    if (copyState === "idle") return;
    const timerId = window.setTimeout(() => setCopyState("idle"), 1400);
    return () => window.clearTimeout(timerId);
  }, [copyState]);

  return (
    <SgButton appearance="outline" size="sm" onClick={handleCopy}>
      {copyState === "success" ? "Copiado" : copyState === "error" ? "Erro" : "Copiar"}
    </SgButton>
  );
}

function RunButton() {
  const { sandpack } = useSandpack();

  return (
    <SgButton severity="primary" size="sm" onClick={() => sandpack.runSandpack()}>
      Run
    </SgButton>
  );
}

export default function SgCodeBlockBase(props: Readonly<SgCodeBlockBaseProps>) {
  const {
    code,
    interactive = false,
    codeContract = "renderBody",
    title,
    height = 360,
    className,
    dependencies,
    defaultImports,
    previewWrapperClassName = "h-[420px] rounded-xl border border-border bg-muted/30 p-3",
    seedgridDependency
  } = props;

  const [sandpackStylesCss, setSandpackStylesCss] = React.useState<string>(() =>
    buildSandpackStylesCss(readThemeVarsFromHost())
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const refreshStyles = () => {
      const liveThemeVars = readThemeVarsFromHost();
      setSandpackStylesCss(buildSandpackStylesCss(liveThemeVars));
    };

    let frameId: number | null = null;
    const scheduleRefresh = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        refreshStyles();
      });
    };

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"]
    });

    refreshStyles();

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  if (!interactive) {
    return (
      <div className={cn("space-y-2", className)}>
        {title ? <div className="text-sm font-medium">{title}</div> : null}
        <ReadonlyBlock code={code} />
      </div>
    );
  }

  const seedgridDefaultImports = defaultImports ?? `import {
  SgScreen,
  SgMainPanel,
  SgPanel,
  SgGrid,
  SgStack,
  SgButton,
  SgAutocomplete
} from "@seedgrid/fe-components";`;

  const appTsx =
    codeContract === "appFile"
      ? code
      : buildAppTsxFromRenderBody(code, seedgridDefaultImports, previewWrapperClassName);

  const resolvedSeedgridDependency =
    seedgridDependency ??
    process.env.NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY ??
    DEFAULT_SEEDGRID_DEPENDENCY;

  const files: SandpackFiles = {
    "/App.tsx": { code: appTsx, active: true },
    "/styles.css": { code: sandpackStylesCss || SANDPACK_STYLES_CSS_FALLBACK }
  };

  const deps: Record<string, string> = {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    ...DEFAULT_SEEDGRID_PEER_DEPENDENCIES,
    "@seedgrid/fe-components": resolvedSeedgridDependency,
    ...(dependencies ?? {})
  };

  return (
    <div className={cn("rounded-lg border border-border", className)}>
      <SandpackProvider
        template="react-ts"
        files={files}
        customSetup={{ dependencies: deps }}
        options={{
          autorun: false,
          activeFile: "/App.tsx",
          visibleFiles: ["/App.tsx"],
          externalResources: SANDPACK_EXTERNAL_RESOURCES
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{title ?? "Example"}</span>
            <span className="text-xs text-muted-foreground">
              {codeContract === "renderBody" ? "editable snippet" : "editable App.tsx"}
            </span>
          </div>
          <RunButton />
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1fr"
          }}
        >
          <div className="min-w-0 border-r border-border">
            <SandpackCodeEditor
              showLineNumbers
              wrapContent
              showTabs={false}
              showRunButton={false}
              style={{ height }}
            />
            <div className="flex justify-end border-t border-border px-3 py-2">
              <CopyButton />
            </div>
          </div>
          <div className="min-w-0">
            <SandpackPreview
              style={{ height }}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showRestartButton={false}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}

