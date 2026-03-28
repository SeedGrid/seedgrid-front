"use client";

import React from "react";
import {
  SgButton,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

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
  return toast.loading(title, {
    duration: options?.duration ?? 2500,
    ...options
  });
}

const TOASTER_PROPS: ShowcasePropRow[] = [
  {
    prop: "position",
    type: "\"top-right\" | \"top-left\" | \"top-center\" | \"bottom-right\" | \"bottom-left\" | \"bottom-center\"",
    defaultValue: "\"top-right\"",
    description: "Toast container position."
  },
  { prop: "duration", type: "number", defaultValue: "4000", description: "Default duration in ms for auto-close." },
  { prop: "visibleToasts", type: "number", defaultValue: "6", description: "Maximum number visible simultaneously." },
  { prop: "closeButton", type: "boolean", defaultValue: "true", description: "Shows close button on each toast." },
  { prop: "richColors", type: "boolean", defaultValue: "true", description: "Uses strong palette by severity." },
  { prop: "transparency", type: "number (0-100)", defaultValue: "0", description: "Transparency level applied to toasts." },
  {
    prop: "customColors",
    type: "Partial<Record<SgToastType, SgToasterTypeColors>>",
    defaultValue: "-",
    description: "Overrides bg/fg/border by type."
  }
];

export default function SgToasterPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [loadingId, setLoadingId] = React.useState<SgToastId | null>(null);

  const startLoading = React.useCallback(() => {
    const id = toast.loading("Processing batch...", {
      description: "This toast stays open until you update or close it."
    });
    setLoadingId(id);
  }, []);

  const finishLoadingSuccess = React.useCallback(() => {
    if (!loadingId) {
      toast.warning("No active loading");
      return;
    }

    toast.success("Processamento concluido", {
      id: loadingId,
      description: "Update using the same id."
    });
    setLoadingId(null);
  }, [loadingId]);

  const finishLoadingError = React.useCallback(() => {
    if (!loadingId) {
      toast.warning("No active loading");
      return;
    }

    toast.error("Processing failed", {
      id: loadingId,
      description: "Loading updated to error."
    });
    setLoadingId(null);
  }, [loadingId]);

  const runPromiseDemo = React.useCallback(async () => {
    const task = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (Math.random() < 0.35) {
        throw new Error("Random demo error");
      }
      return { id: "ORD-2026-001" };
    };

    try {
      await toast.promise(task, {
        loading: "Saving order...",
        success: (value) => `Order saved: ${value.id}`,
        error: (error) => `Failure: ${error instanceof Error ? error.message : "error"}`
      });
    } catch {
      // error already handled by toast.promise
    }
  }, []);

  const runActionDemo = React.useCallback(() => {
    toast.warning("Item archived", {
      description: "Click undo to restore.",
      action: {
        label: "Undo",
        onClick: () =>
          toast.success("Action undone", {
            description: "The item returned to the list."
          })
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
            <SgButton size="sm" onClick={() => toast.dismiss(id)}>
              Close
            </SgButton>
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
      style: {
        background: "#fff7f1",
        color: "#5b3b23"
      }
    });
  }, []);

  const transparencyLevel = 80;
  const transparencyOptions = React.useMemo<SgToastOptions>(
    () => ({
      style: {
        opacity: 1 - transparencyLevel / 100
      }
    }),
    [transparencyLevel]
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
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgToaster"
          subtitle="Notification system with imperative API (toast) and renderer (SgToaster)."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title="1) Base setup"
        description="In this showcase, SgToaster is already mounted in layout. In a real app, mount it once at root."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message("Basic message")}>toast.message</SgButton>
          <SgButton severity="success" onClick={() => toast.success("Success!")}>
            toast.success
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            toast.dismiss (all)
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/base-setup.tsx.sample" />
      </Section>

      <Section
        title="2) Toast types"
        description="Use type-specific methods by severity."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message("Neutral message")}>default</SgButton>
          <SgButton severity="success" onClick={() => toast.success("Operation completed")}>
            success
          </SgButton>
          <SgButton severity="info" onClick={() => toast.info("Important info")}>
            info
          </SgButton>
          <SgButton severity="warning" onClick={() => toast.warning("Attention in flow")}>
            warning
          </SgButton>
          <SgButton severity="danger" onClick={() => toast.error("Failed to save")}>
            error
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.loading("Processing...")}>
            loading
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/toast-types.tsx.sample" />
      </Section>

      <Section
        title="3) Loading by id (update same toast)"
        description="Store returned id and reuse it to switch state without creating another toast."
      >
        <div className="flex flex-wrap items-center gap-2">
          <SgButton onClick={startLoading}>Start loading</SgButton>
          <SgButton severity="success" onClick={finishLoadingSuccess}>
            Finish with success
          </SgButton>
          <SgButton severity="danger" onClick={finishLoadingError}>
            Finish with error
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            Clear all
          </SgButton>
          <span className="text-xs text-muted-foreground">
            loadingId: <code>{loadingId ?? "none"}</code>
          </span>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/loading-by-id-update-same-toast.tsx.sample" />
      </Section>

      <Section
        title="4) toast.promise"
        description="Convenience helper for loading/success/error lifecycle in promises."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runPromiseDemo}>Run promise demo</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/toast-promise.tsx.sample" />
      </Section>

      <Section
        title="5) Actions and custom toast"
        description="Use action for quick CTA and custom for free-form render."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton severity="warning" onClick={runActionDemo}>
            Toast with action
          </SgButton>
          <SgButton appearance="outline" onClick={runCustomDemo}>
            Custom toast
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/actions-and-custom-toast.tsx.sample" />
      </Section>

      <Section
        title="6) Options per toast"
        description="Each toast accepts duration, closeButton, className, and style."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runOptionsDemo}>Trigger toast with options</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/options-per-toast.tsx.sample" />
      </Section>

      <Section
        title="7) Transparency"
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
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/transparency.tsx.sample" />
      </Section>

      <Section
        title="8) Custom Colors"
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
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/custom-colors.tsx.sample" />
      </Section>

      <Section
        title="9) Isolated SgToaster Playground"
        description="Here you can change all props in real time (position, duration, visibleToasts, closeButton, richColors, transparency and customColors)."
      >
        <SgPlayground
          title="SgToaster Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-toaster/sg-toaster.tsx.playground"
          height={560}
          defaultOpen
        />
      </Section>

        <ShowcasePropsReference rows={TOASTER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



