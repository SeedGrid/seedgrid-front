"use client";

import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  type SandpackFiles,
  useSandpack
} from "@codesandbox/sandpack-react";
import { SgButton } from "../buttons/SgButton";
import { SgCard } from "../layout/SgCard";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgPlaygroundProps = {
  code: string;
  interactive?: boolean;
  codeContract?: "renderBody" | "appFile";
  title?: string;
  description?: string;
  height?: number | string;
  expandedHeight?: number | string;
  expandable?: boolean;
  resizable?: boolean;
  resizeAxis?: "vertical" | "horizontal" | "both";
  previewPadding?: number | string;
  className?: string;
  dependencies?: Record<string, string>;
  defaultImports?: string;
  previewWrapperClassName?: string;
  seedgridDependency?: string;
  withCard?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  cardId?: string;
};

const DEFAULT_SEEDGRID_DEPENDENCY = "0.2.6";
const DEFAULT_SEEDGRID_PEER_DEPENDENCIES: Record<string, string> = {
  "@codesandbox/sandpack-react": "^2.20.0",
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

#root {
  padding: var(--sg-preview-padding, 0px);
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

function parseRgbParts(raw: string): [number, number, number] | null {
  const value = raw.trim();
  if (!value) return null;

  const normalized = value
    .replace(/^rgb\(/i, "")
    .replace(/\)$/g, "")
    .replace(/\//g, " ")
    .replace(/,/g, " ")
    .trim();

  const pieces = normalized
    .split(/\s+/)
    .map((part) => Number(part))
    .filter((num) => Number.isFinite(num));

  if (pieces.length < 3) return null;

  const r = pieces[0] as number;
  const g = pieces[1] as number;
  const b = pieces[2] as number;
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return [clamp(r), clamp(g), clamp(b)];
}

function rgbToHslTriplet(r: number, g: number, b: number): string {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rr:
        h = ((gg - bb) / delta + (gg < bb ? 6 : 0)) / 6;
        break;
      case gg:
        h = ((bb - rr) / delta + 2) / 6;
        break;
      default:
        h = ((rr - gg) / delta + 4) / 6;
        break;
    }
  }

  const hue = Math.round(h * 360);
  const sat = Math.round(s * 100);
  const lig = Math.round(l * 100);
  return `${hue} ${sat}% ${lig}%`;
}

function toHslFromRgbVar(value?: string): string | null {
  if (!value) return null;
  const parts = parseRgbParts(value);
  if (!parts) return null;
  return rgbToHslTriplet(parts[0], parts[1], parts[2]);
}

function mapSgVarsToCoreVars(themeVars: Record<string, string>): Record<string, string> {
  const mapped: Record<string, string> = {};

  const assignFromSg = (coreVar: string, sgVar: string) => {
    const hsl = toHslFromRgbVar(themeVars[sgVar]);
    if (hsl) mapped[coreVar] = hsl;
  };

  assignFromSg("--background", "--sg-bg");
  assignFromSg("--foreground", "--sg-text");
  assignFromSg("--primary", "--sg-primary-600");
  assignFromSg("--primary-foreground", "--sg-on-primary");
  assignFromSg("--secondary", "--sg-secondary-600");
  assignFromSg("--secondary-foreground", "--sg-on-secondary");
  assignFromSg("--accent", "--sg-tertiary-600");
  assignFromSg("--accent-foreground", "--sg-on-tertiary");
  assignFromSg("--destructive", "--sg-error-600");
  assignFromSg("--destructive-foreground", "--sg-on-error");
  assignFromSg("--border", "--sg-border");
  assignFromSg("--ring", "--sg-primary-400");

  return mapped;
}

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

  Object.assign(themeVars, mapSgVarsToCoreVars(themeVars));

  return themeVars;
}

function normalizeCssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function buildSandpackStylesCss(themeVars: Record<string, string>, previewPadding: string): string {
  const mergedVars = {
    ...SANDPACK_FALLBACK_THEME_VARS,
    ...themeVars,
    "--sg-preview-padding": previewPadding
  };
  const rootVars = Object.entries(mergedVars)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([varName, value]) => `  ${varName}: ${value};`)
    .join("\n");
  return `:root {
${rootVars}
}

${SANDPACK_BASE_STYLES_CSS}`;
}

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

export default function SgPlayground(props: Readonly<SgPlaygroundProps>) {
  const {
    code,
    interactive = false,
    codeContract = "renderBody",
    title,
    description,
    height = 360,
    expandedHeight = "70vh",
    expandable = true,
    resizable = true,
    resizeAxis = "vertical",
    previewPadding,
    className,
    dependencies,
    defaultImports,
    previewWrapperClassName = "h-[420px] rounded-xl border border-border bg-muted/30 p-3",
    seedgridDependency,
    withCard = true,
    collapsible = true,
    defaultOpen = true,
    cardId
  } = props;
  const effectivePreviewPadding = normalizeCssSize(
    previewPadding ?? (codeContract === "appFile" ? 12 : 0)
  );

  const [sandpackStylesCss, setSandpackStylesCss] = React.useState<string>(() =>
    buildSandpackStylesCss(readThemeVarsFromHost(), effectivePreviewPadding)
  );
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const refreshStyles = () => {
      const liveThemeVars = readThemeVarsFromHost();
      setSandpackStylesCss(buildSandpackStylesCss(liveThemeVars, effectivePreviewPadding));
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
  }, [effectivePreviewPadding]);

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
    "/styles.css": { code: sandpackStylesCss || buildSandpackStylesCss({}, effectivePreviewPadding) }
  };

  const deps: Record<string, string> = {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    ...DEFAULT_SEEDGRID_PEER_DEPENDENCIES,
    "@seedgrid/fe-components": resolvedSeedgridDependency,
    ...(dependencies ?? {})
  };
  const currentHeight = isExpanded ? expandedHeight : height;
  const resizeClass = !resizable
    ? undefined
    : resizeAxis === "vertical"
      ? "resize-y"
      : resizeAxis === "horizontal"
        ? "resize-x"
        : "resize";

  const content = interactive ? (
    <div className={cn(withCard ? "" : "rounded-lg border border-border", withCard ? undefined : className)}>
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
            {withCard ? null : <span className="text-sm font-medium">{title ?? "Example"}</span>}
            <span className="text-xs text-muted-foreground">
              {codeContract === "renderBody" ? "editable snippet" : "editable App.tsx"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {expandable ? (
              <SgButton
                appearance="outline"
                size="sm"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Reduzir" : "Expandir"}
              </SgButton>
            ) : null}
            <RunButton />
          </div>
        </div>

        <div
          className={cn(
            "grid overflow-auto min-h-[260px] min-w-[480px]",
            resizeClass
          )}
          style={{
            gridTemplateColumns: "1fr 1fr",
            height: currentHeight
          }}
        >
          <div className="min-w-0 border-r border-border">
            <SandpackCodeEditor
              showLineNumbers
              wrapContent
              showTabs={false}
              showRunButton={false}
              style={{ height: "100%" }}
            />
            <div className="flex justify-end border-t border-border px-3 py-2">
              <CopyButton />
            </div>
          </div>
          <div className="min-w-0">
            <SandpackPreview
              style={{ height: "100%" }}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showRestartButton={false}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  ) : (
    <div className={cn(withCard ? undefined : "space-y-2", withCard ? undefined : className)}>
      {withCard ? null : title ? <div className="text-sm font-medium">{title}</div> : null}
      <ReadonlyBlock code={code} />
    </div>
  );

  if (!withCard) return content;

  return (
    <SgCard
      id={cardId}
      title={title ?? "Codigo"}
      description={description}
      collapsible={collapsible}
      defaultOpen={defaultOpen}
      className={cn("rounded-lg", className)}
      bodyClassName="p-0"
    >
      {content}
    </SgCard>
  );
}

