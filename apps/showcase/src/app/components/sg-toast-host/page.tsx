"use client";

import React from "react";
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: Readonly<{ title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: Readonly<{ code: string }>) {
  return <sgCodeBlockBase code={props.code} />;
}

// ---------------------------------------------------------------------------
// Toast helpers (same as SgToaster showcase)
// ---------------------------------------------------------------------------

const TOAST_TITLES_BY_TYPE: Record<SgToastType, string> = {
  default: "Default message",
  success: "All good!",
  info: "Important info",
  warning: "Attention!",
  error: "Failed!",
  loading: "Loading..."
};

function emitToastByType(type: SgToastType, options?: SgToastOptions) {
  const title = TOAST_TITLES_BY_TYPE[type];
  if (type === "default") return toast.message(title, options);
  if (type === "success") return toast.success(title, options);
  if (type === "info") return toast.info(title, options);
  if (type === "warning") return toast.warning(title, options);
  if (type === "error") return toast.error(title, options);
  return toast.loading(title, { duration: options?.duration ?? 2500, ...options });
}

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const WHAT_IS_CODE = `// Antes: SgToaster fixo no layout (sem prioridade)
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
<SgToaster position="top-right" />

// Depois: SgToastHost — suporta prioridade entre instâncias
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

// layout.tsx — host padrão
<SgToastHost position="top-right" />

// page.tsx específica — substitui o host do layout automaticamente
<SgToastHost position="bottom-center" />`;

const SETUP_CODE = `import { SgToastHost, toast } from "@seedgrid/fe-components";

// layout.tsx — mount once at root
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SgToastHost position="top-right" />
        {children}
      </body>
    </html>
  );
}

// Any component in the app:
toast.message("Basic message");
toast.success("Success!");
toast.dismiss(); // remove all toasts
`;

const PRIORITY_CODE = `// layout.tsx — host padrão para todas as rotas
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function RootLayout({ children }) {
  return (
    <html><body>
      <SgToastHost position="top-right" />
      {children}
    </body></html>
  );
}

// dashboard/page.tsx — host da página substitui o do layout
// Enquanto o usuário estiver nesta página, o host do layout fica INATIVO.
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function DashboardPage() {
  return (
    <div>
      <SgToastHost position="bottom-center" duration={6000} />
      <DashboardContent />
    </div>
  );
}`;

const TYPES_CODE = `import { toast } from "@seedgrid/fe-components";

toast.message("Neutral message");
toast.success("Operation completed");
toast.info("Important info");
toast.warning("Attention");
toast.error("Failed to save");
toast.loading("Processing...");
`;

const LOADING_BY_ID_CODE = `const id = toast.loading("Exporting report...");

// atualiza o mesmo toast pelo id
toast.success("Export completed", { id });
// ou
toast.error("Could not export", { id });

// remover todos
toast.dismiss();
`;

const PROMISE_CODE = `await toast.promise(
  () => saveOnServer(),
  {
    loading: "Saving...",
    success: (result) => "Saved successfully: " + result.id,
    error: (err) => "Failure: " + (err instanceof Error ? err.message : "error")
  },
  {
    description: "Helper handles loading/success/error lifecycle."
  }
);`;

const CUSTOM_CODE = `toast.warning("Item archived", {
  description: "You can undo this action.",
  action: {
    label: "Undo",
    onClick: () => toast.success("Action undone")
  }
});

toast.custom((id) => (
  <div className="rounded-md border border-primary/40 bg-background p-3">
    <div className="text-sm font-semibold">Custom toast</div>
    <button onClick={() => toast.dismiss(id)}>Close</button>
  </div>
));`;

const OPTIONS_CODE = `toast.info("Toast with options", {
  description: "Long duration, no close button, custom style.",
  duration: 10000,
  closeButton: false,
  className: "border-[#c56a2d]",
  style: {
    background: "#fff7f1",
    color: "#5b3b23"
  }
});`;

const TRANSPARENCY_CODE = `import { SgToastHost, toast } from "@seedgrid/fe-components";

<SgToastHost transparency={80} />;

toast.success("All good!");
toast.warning("Attention!");
toast.error("Failed!");
`;

const CUSTOM_COLORS_CODE = `import { SgToastHost, toast } from "@seedgrid/fe-components";

<SgToastHost
  customColors={{
    default: { bg: "#1f2937", fg: "#f9fafb", border: "#6b7280" },
    success: { bg: "#065f46", fg: "#ecfeff", border: "#10b981" },
    info: { bg: "#1e3a8a", fg: "#dbeafe", border: "#60a5fa" },
    warning: { bg: "#78350f", fg: "#fef3c7", border: "#f59e0b" },
    error: { bg: "#7f1d1d", fg: "#fee2e2", border: "#ef4444" },
    loading: { bg: "#312e81", fg: "#e0e7ff", border: "#818cf8" }
  }}
/>;

toast.message("Default message");
toast.warning("Attention!");
`;

const POSITIONING_CODE = `// Todas as posições disponíveis
<SgToastHost position="top-left" />
<SgToastHost position="top-center" />
<SgToastHost position="top-right" />    {/* default */}
<SgToastHost position="bottom-left" />
<SgToastHost position="bottom-center" />
<SgToastHost position="bottom-right" />`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgButton,
  SgToastHost,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
  SgStack,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const positions = [
  "top-right",
  "top-left",
  "top-center",
  "bottom-right",
  "bottom-left",
  "bottom-center"
];

export default function App() {
  const [position, setPosition] = React.useState("top-right");
  const [duration, setDuration] = React.useState(3500);
  const [visibleToasts, setVisibleToasts] = React.useState(4);
  const [closeButton, setCloseButton] = React.useState(true);
  const [richColors, setRichColors] = React.useState(true);
  const [transparency, setTransparency] = React.useState(0);
  const [customPalette, setCustomPalette] = React.useState(false);

  const toasterCustomColors = customPalette
    ? {
        default: { bg: "#1f2937", fg: "#f9fafb", border: "#6b7280" },
        success: { bg: "#065f46", fg: "#ecfeff", border: "#10b981" },
        info: { bg: "#1e3a8a", fg: "#dbeafe", border: "#60a5fa" },
        warning: { bg: "#78350f", fg: "#fef3c7", border: "#f59e0b" },
        error: { bg: "#7f1d1d", fg: "#fee2e2", border: "#ef4444" },
        loading: { bg: "#312e81", fg: "#e0e7ff", border: "#818cf8" }
      }
    : undefined;

  const resolveToastVisual = (type) => {
    const alpha = 1 - Math.max(0, Math.min(100, transparency)) / 100;
    const colors = toasterCustomColors?.[type];
    const style = {};

    if (alpha < 1) style.opacity = alpha;
    if (colors?.bg) style.backgroundColor = colors.bg;
    if (colors?.fg) style.color = colors.fg;
    if (colors?.border) style.borderColor = colors.border;

    return Object.keys(style).length > 0 ? { style } : {};
  };

  return (
    <div className="space-y-3">
      <SgToastHost
        position={position}
        duration={duration}
        visibleToasts={visibleToasts}
        closeButton={closeButton}
        richColors={richColors}
        transparency={transparency}
        customColors={toasterCustomColors}
      />

      <SgStack direction="row" wrap gap={8} align="center">
        <label className="text-sm">
          Position:
          <select
            className="ml-2 rounded border px-2 py-1 text-xs"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Duration:
          <input
            className="ml-2 w-24 rounded border px-2 py-1 text-xs"
            type="number"
            min={500}
            step={500}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          Visible:
          <input
            className="ml-2 w-16 rounded border px-2 py-1 text-xs"
            type="number"
            min={1}
            max={10}
            value={visibleToasts}
            onChange={(e) => setVisibleToasts(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          <input
            className="mr-1"
            type="checkbox"
            checked={closeButton}
            onChange={(e) => setCloseButton(e.target.checked)}
          />
          closeButton
        </label>

        <label className="text-sm">
          <input
            className="mr-1"
            type="checkbox"
            checked={richColors}
            onChange={(e) => setRichColors(e.target.checked)}
          />
          richColors
        </label>

        <label className="text-sm">
          Transparency:
          <input
            className="ml-2 w-20 rounded border px-2 py-1 text-xs"
            type="number"
            min={0}
            max={90}
            step={5}
            value={transparency}
            onChange={(e) => setTransparency(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          <input
            className="mr-1"
            type="checkbox"
            checked={customPalette}
            onChange={(e) => setCustomPalette(e.target.checked)}
          />
          customColors
        </label>
      </SgStack>

      <SgStack direction="row" wrap gap={8}>
        <SgButton onClick={() => toast.message("Default message", resolveToastVisual("default"))}>Message</SgButton>
        <SgButton severity="success" onClick={() => toast.success("All good!", resolveToastVisual("success"))}>Success</SgButton>
        <SgButton severity="info" onClick={() => toast.info("Info", resolveToastVisual("info"))}>Info</SgButton>
        <SgButton severity="warning" onClick={() => toast.warning("Attention!", resolveToastVisual("warning"))}>Warning</SgButton>
        <SgButton severity="danger" onClick={() => toast.error("Failed!", resolveToastVisual("error"))}>Error</SgButton>
        <SgButton appearance="outline" onClick={() => toast.loading("Loading...", { duration: 2500, ...resolveToastVisual("loading") })}>Loading</SgButton>
        <SgButton appearance="outline" onClick={() => toast.dismiss()}>Dismiss all</SgButton>
      </SgStack>
    </div>
  );
}`;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const PROP_ROWS: ShowcasePropRow[] = [
  { prop: "position", type: '"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"', defaultValue: '"top-right"', description: "Toast container position." },
  { prop: "duration", type: "number", defaultValue: "4000", description: "Default duration in ms for auto-close." },
  { prop: "visibleToasts", type: "number", defaultValue: "6", description: "Maximum number visible simultaneously." },
  { prop: "closeButton", type: "boolean", defaultValue: "true", description: "Shows close button on each toast." },
  { prop: "richColors", type: "boolean", defaultValue: "true", description: "Uses strong palette by severity." },
  { prop: "transparency", type: "number (0-100)", defaultValue: "0", description: "Transparency level applied to toasts." },
  { prop: "customColors", type: "Partial<Record<SgToastType, SgToasterTypeColors>>", defaultValue: "-", description: "Overrides bg/fg/border by type." }
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SgToastHostShowcase() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [loadingId, setLoadingId] = React.useState<SgToastId | null>(null);

  const startLoading = React.useCallback(() => {
    const id = toast.loading("Processing batch...", {
      description: "This toast stays open until you update or close it."
    });
    setLoadingId(id);
  }, []);

  const finishLoadingSuccess = React.useCallback(() => {
    if (!loadingId) { toast.warning("No active loading"); return; }
    toast.success("Processamento concluido", { id: loadingId, description: "Update using the same id." });
    setLoadingId(null);
  }, [loadingId]);

  const finishLoadingError = React.useCallback(() => {
    if (!loadingId) { toast.warning("No active loading"); return; }
    toast.error("Processing failed", { id: loadingId, description: "Loading updated to error." });
    setLoadingId(null);
  }, [loadingId]);

  const runPromiseDemo = React.useCallback(async () => {
    const task = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (Math.random() < 0.35) throw new Error("Random demo error");
      return { id: "ORD-2026-001" };
    };
    try {
      await toast.promise(task, {
        loading: "Saving order...",
        success: (value) => `Order saved: ${value.id}`,
        error: (error) => `Failure: ${error instanceof Error ? error.message : "error"}`
      });
    } catch {
      // handled by toast.promise
    }
  }, []);

  const runActionDemo = React.useCallback(() => {
    toast.warning("Item archived", {
      description: "Click undo to restore.",
      action: {
        label: "Undo",
        onClick: () => toast.success("Action undone", { description: "The item returned to the list." })
      }
    });
  }, []);

  const runCustomDemo = React.useCallback(() => {
    toast.custom(
      (id) => (
        <div className="w-full max-w-[280px] rounded-md border border-[#c56a2d]/50 bg-[#fff7f1] p-3">
          <div className="text-sm font-semibold text-[#8f4b1f]">Custom toast</div>
          <p className="mt-1 text-xs text-[#6b4b33]">Content rendered via toast.custom(...)</p>
          <div className="mt-2 flex gap-2">
            <SgButton size="sm" onClick={() => toast.dismiss(id)}>Close</SgButton>
          </div>
        </div>
      ),
      { duration: 8000, closeButton: false }
    );
  }, []);

  const runOptionsDemo = React.useCallback(() => {
    toast.info("Toast with custom options", {
      description: "10s duration, no closeButton, custom style.",
      duration: 10000,
      closeButton: false,
      className: "border-[#c56a2d]",
      style: { background: "#fff7f1", color: "#5b3b23" }
    });
  }, []);

  const transparencyLevel = 80;
  const transparencyOptions = React.useMemo<SgToastOptions>(
    () => ({ style: { opacity: 1 - transparencyLevel / 100 } }),
    []
  );

  const customColorStyles = React.useMemo<Record<SgToastType, React.CSSProperties>>(
    () => ({
      default: { backgroundColor: "#1f2937", color: "#f9fafb", borderColor: "#6b7280" },
      success: { backgroundColor: "#065f46", color: "#ecfeff", borderColor: "#10b981" },
      info: { backgroundColor: "#1e3a8a", color: "#dbeafe", borderColor: "#60a5fa" },
      warning: { backgroundColor: "#78350f", color: "#fef3c7", borderColor: "#f59e0b" },
      error: { backgroundColor: "#7f1d1d", color: "#fee2e2", borderColor: "#ef4444" },
      loading: { backgroundColor: "#312e81", color: "#e0e7ff", borderColor: "#818cf8" }
    }),
    []
  );

  const runTransparencyByType = React.useCallback((type: SgToastType) => {
    emitToastByType(type, transparencyOptions);
  }, [transparencyOptions]);

  const runCustomColorsByType = React.useCallback((type: SgToastType) => {
    emitToastByType(type, { style: customColorStyles[type] });
  }, [customColorStyles]);

  return (
    <I18NReady>
      {/* Host ativo desta página — tem prioridade sobre o host do layout */}
      <SgToastHost position="bottom-right" />

      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgToastHost"
          subtitle="Marks where toasts appear in the tree. When multiple hosts exist simultaneously, the deepest one takes priority — letting a page override the layout host automatically."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section
          title="1) O que é o SgToastHost"
          description="Versão inteligente do SgToaster com suporte a prioridade entre múltiplas instâncias na árvore React."
        >
          <div className="rounded-md border border-border bg-muted/30 p-4 text-sm space-y-3">
            <p><strong>SgToaster</strong> — renderiza toasts no local onde é colocado, sem nenhuma lógica de prioridade.</p>
            <p><strong>SgToastHost</strong> — igual ao SgToaster, mas se registra globalmente. Se houver dois hosts na árvore ao mesmo tempo, o mais profundo (mais próximo do conteúdo atual) fica ativo. O host do layout é desativado automaticamente enquanto o da página estiver montado.</p>
          </div>
          <CodeBlock code={WHAT_IS_CODE} />
        </Section>

        {/* 2 */}
        <Section
          title="2) Base setup"
          description="In this showcase, SgToastHost is already mounted in the page. In a real app, mount it once at root."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => toast.message("Basic message")}>toast.message</SgButton>
            <SgButton severity="success" onClick={() => toast.success("Success!")}>toast.success</SgButton>
            <SgButton appearance="outline" onClick={() => toast.dismiss()}>toast.dismiss (all)</SgButton>
          </div>
          <CodeBlock code={SETUP_CODE} />
        </Section>

        {/* 3 */}
        <Section
          title="3) Prioridade: layout vs página"
          description="React executa os efeitos dos filhos antes dos pais (depth-first postorder). O host da página registra por último — e último registrado vence."
        >
          <div className="rounded-md border border-border bg-muted/30 p-4 text-sm space-y-2">
            <p className="font-medium">Como funciona internamente:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Layout monta → SgToastHost do layout registra (stack: [layout]). Ele fica ativo.</li>
              <li>Página monta → SgToastHost da página registra (stack: [layout, page]). Ele passa a ser o ativo.</li>
              <li>Usuário navega → SgToastHost da página desmonta, sai do stack. Layout volta a ser ativo.</li>
              <li>Nova página com host próprio monta → ela passa a ser ativa imediatamente.</li>
            </ol>
          </div>
          <CodeBlock code={PRIORITY_CODE} />
        </Section>

        {/* 4 */}
        <Section
          title="4) Toast types"
          description="Use type-specific methods by severity."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => toast.message("Neutral message")}>default</SgButton>
            <SgButton severity="success" onClick={() => toast.success("Operation completed")}>success</SgButton>
            <SgButton severity="info" onClick={() => toast.info("Important info")}>info</SgButton>
            <SgButton severity="warning" onClick={() => toast.warning("Attention in flow")}>warning</SgButton>
            <SgButton severity="danger" onClick={() => toast.error("Failed to save")}>error</SgButton>
            <SgButton appearance="outline" onClick={() => toast.loading("Processing...")}>loading</SgButton>
          </div>
          <CodeBlock code={TYPES_CODE} />
        </Section>

        {/* 5 */}
        <Section
          title="5) Loading by id (update same toast)"
          description="Store returned id and reuse it to switch state without creating another toast."
        >
          <div className="flex flex-wrap items-center gap-2">
            <SgButton onClick={startLoading}>Start loading</SgButton>
            <SgButton severity="success" onClick={finishLoadingSuccess}>Finish with success</SgButton>
            <SgButton severity="danger" onClick={finishLoadingError}>Finish with error</SgButton>
            <SgButton appearance="outline" onClick={() => toast.dismiss()}>Clear all</SgButton>
            <span className="text-xs text-muted-foreground">
              loadingId: <code>{loadingId ?? "none"}</code>
            </span>
          </div>
          <CodeBlock code={LOADING_BY_ID_CODE} />
        </Section>

        {/* 6 */}
        <Section
          title="6) toast.promise"
          description="Convenience helper for loading/success/error lifecycle in promises."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runPromiseDemo}>Run promise demo</SgButton>
          </div>
          <CodeBlock code={PROMISE_CODE} />
        </Section>

        {/* 7 */}
        <Section
          title="7) Actions and custom toast"
          description="Use action for quick CTA and custom for free-form render."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton severity="warning" onClick={runActionDemo}>Toast with action</SgButton>
            <SgButton appearance="outline" onClick={runCustomDemo}>Custom toast</SgButton>
          </div>
          <CodeBlock code={CUSTOM_CODE} />
        </Section>

        {/* 8 */}
        <Section
          title="8) Options per toast"
          description="Each toast accepts duration, closeButton, className, and style."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runOptionsDemo}>Trigger toast with options</SgButton>
          </div>
          <CodeBlock code={OPTIONS_CODE} />
        </Section>

        {/* 9 */}
        <Section
          title="9) Transparency"
          description="Example focused only on transparency (80%)."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => runTransparencyByType("default")}>default</SgButton>
            <SgButton severity="success" onClick={() => runTransparencyByType("success")}>success</SgButton>
            <SgButton severity="info" onClick={() => runTransparencyByType("info")}>info</SgButton>
            <SgButton severity="warning" onClick={() => runTransparencyByType("warning")}>warning</SgButton>
            <SgButton severity="danger" onClick={() => runTransparencyByType("error")}>error</SgButton>
            <SgButton appearance="outline" onClick={() => runTransparencyByType("loading")}>loading</SgButton>
            <SgButton appearance="outline" onClick={() => toast.dismiss()}>dismiss all</SgButton>
          </div>
          <CodeBlock code={TRANSPARENCY_CODE} />
        </Section>

        {/* 10 */}
        <Section
          title="10) Custom Colors"
          description="Example focused only on custom colors per type."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => runCustomColorsByType("default")}>default</SgButton>
            <SgButton severity="success" onClick={() => runCustomColorsByType("success")}>success</SgButton>
            <SgButton severity="info" onClick={() => runCustomColorsByType("info")}>info</SgButton>
            <SgButton severity="warning" onClick={() => runCustomColorsByType("warning")}>warning</SgButton>
            <SgButton severity="danger" onClick={() => runCustomColorsByType("error")}>error</SgButton>
            <SgButton appearance="outline" onClick={() => runCustomColorsByType("loading")}>loading</SgButton>
            <SgButton appearance="outline" onClick={() => toast.dismiss()}>dismiss all</SgButton>
          </div>
          <CodeBlock code={CUSTOM_COLORS_CODE} />
        </Section>

        {/* 11 */}
        <Section
          title="11) Posicionamento"
          description="Aceita as mesmas 6 posições do SgToaster."
        >
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            {(["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]).map((pos) => (
              <SgButton
                key={pos}
                onClick={() => toast.info(`position: ${pos}`, { duration: 2500 })}
                className="text-xs"
              >
                {pos}
              </SgButton>
            ))}
          </div>
          <CodeBlock code={POSITIONING_CODE} />
        </Section>

        {/* 12 */}
        <Section
          title="12) Isolated SgToastHost Playground"
          description="Change all props in real time (position, duration, visibleToasts, closeButton, richColors, transparency and customColors)."
        >
          <SgPlayground
            title="SgToastHost Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_APP_FILE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROP_ROWS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
