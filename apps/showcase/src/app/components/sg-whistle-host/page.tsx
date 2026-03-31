"use client";

import React from "react";
import {
  SgButton,
  SgWhistleHost,
  sgWhistle,
  type SgWhistleId,
  type SgWhistleSeverity
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
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

function CodeBlock(props: Readonly<{ sampleFile: string }>) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const WHISTLE_PROPS: ShowcasePropRow[] = [
  { prop: "max", type: "number", defaultValue: "4", description: "Maximum visible whistles rendered by the host." },
  { prop: "newestOnTop", type: "boolean", defaultValue: "false", description: "Reverses the visual order of the visible stack." },
  { prop: "gap", type: "number", defaultValue: "12", description: "Vertical spacing between whistle items." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Styles the host container in the page flow." },
  { prop: "customColors", type: "Partial<Record<SgWhistleSeverity, { bg; fg; border }>>", defaultValue: "-", description: "Overrides contextual colors by severity." }
];

const WARM_COLORS = {
  default: { bg: "#fff7ed", fg: "#7c2d12", border: "#fdba74" },
  success: { bg: "#ecfdf5", fg: "#065f46", border: "#34d399" },
  info: { bg: "#eff6ff", fg: "#1d4ed8", border: "#60a5fa" },
  warning: { bg: "#fffbeb", fg: "#92400e", border: "#f59e0b" },
  error: { bg: "#fef2f2", fg: "#b91c1c", border: "#f87171" },
  loading: { bg: "#f5f3ff", fg: "#6d28d9", border: "#a78bfa" }
} satisfies Partial<Record<SgWhistleSeverity, { bg: string; fg: string; border: string }>>;

const TITLES_BY_SEVERITY: Record<SgWhistleSeverity, string> = {
  default: "Context note",
  success: "Saved",
  info: "Heads up",
  warning: "Pending review",
  error: "Action failed",
  loading: "Working..."
};

function fireSeverity(severity: SgWhistleSeverity) {
  const messageBySeverity: Record<SgWhistleSeverity, string> = {
    default: "Inline feedback rendered inside the layout flow.",
    success: "The record was persisted successfully.",
    info: "This section can show contextual progress or hints.",
    warning: "The action needs confirmation before continuing.",
    error: "The request returned an error and needs attention.",
    loading: "Processing without blocking the page layout."
  };

  return sgWhistle.show({
    severity,
    title: TITLES_BY_SEVERITY[severity],
    message: messageBySeverity[severity],
    duration: severity === "loading" ? 0 : 5000
  });
}

export default function SgWhistleHostPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [max, setMax] = React.useState(4);
  const [gap, setGap] = React.useState(12);
  const [newestOnTop, setNewestOnTop] = React.useState(false);
  const [warmPalette, setWarmPalette] = React.useState(false);
  const [activeId, setActiveId] = React.useState<SgWhistleId | null>(null);

  React.useEffect(() => {
    sgWhistle.dismiss();
    return () => {
      sgWhistle.dismiss();
    };
  }, []);

  const startLoading = React.useCallback(() => {
    const id = sgWhistle.loading({
      title: "Synchronizing",
      message: "The same whistle id will be updated when the request finishes.",
      borderStyle: "left-accent",
      dismissible: false
    });
    setActiveId(id);
  }, []);

  const finishLoading = React.useCallback((severity: "success" | "error") => {
    if (!activeId) {
      sgWhistle.warning({
        title: "No active loading",
        message: "Start a loading whistle before trying to update it."
      });
      return;
    }

    sgWhistle.update(activeId, {
      severity,
      title: severity === "success" ? "Sync complete" : "Sync failed",
      message:
        severity === "success"
          ? "The loading whistle was updated in place."
          : "The same whistle id now renders the error state.",
      dismissible: true,
      duration: 5000
    });
    setActiveId(null);
  }, [activeId]);

  const runPromiseDemo = React.useCallback(async () => {
    try {
      await sgWhistle.promise(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (Math.random() < 0.35) {
            throw new Error("simulated network error");
          }
          return { protocol: "SG-2026-031" };
        },
        {
          loading: {
            title: "Submitting report",
            message: "Waiting for the server..."
          },
          success: (value) => ({
            title: "Report sent",
            message: `Protocol ${value.protocol} generated successfully.`,
            borderStyle: "soft"
          }),
          error: (error) => ({
            title: "Submission failed",
            message: error instanceof Error ? error.message : "Unknown error",
            borderStyle: "full-accent"
          })
        }
      );
    } catch {
      // already represented by sgWhistle.promise
    }
  }, []);

  const runActionDemo = React.useCallback(() => {
    sgWhistle.warning({
      title: "Archived section",
      message: "The action is reversible for a few seconds.",
      borderStyle: "left-accent",
      opacity: 0.96,
      action: {
        label: "Undo",
        onClick: () =>
          sgWhistle.success({
            title: "Undo applied",
            message: "The archived section returned to the active list.",
            borderStyle: "soft"
          })
      }
    });
  }, []);

  const runBorderDemo = React.useCallback((borderStyle: "solid" | "soft" | "left-accent" | "full-accent" | "none") => {
    sgWhistle.info({
      title: `Border style: ${borderStyle}`,
      message: "Use borderStyle and opacity for contextual emphasis without leaving the layout flow.",
      borderStyle,
      opacity: borderStyle === "none" ? 0.88 : 1
    });
  }, []);

  const runCustomDemo = React.useCallback(() => {
    sgWhistle.custom(
      (id) => (
        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-sm font-semibold">Custom renderer</div>
          <p className="text-sm opacity-90">
            This whistle renders arbitrary JSX and still uses the same imperative lifecycle.
          </p>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" onClick={() => sgWhistle.dismiss(id)}>Close</SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => {
                sgWhistle.dismiss(id);
                sgWhistle.success({
                  title: "Escalated",
                  message: "The custom whistle triggered a follow-up action."
                });
              }}
            >
              Escalate
            </SgButton>
          </div>
        </div>
      ),
      {
        message: "custom",
        duration: 0,
        dismissible: false,
        borderStyle: "full-accent"
      }
    );
  }, []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgWhistleHost"
          subtitle="Contextual inline messaging with an imperative API (sgWhistle) and a host that stays inside the layout flow."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <section className="rounded-xl border border-border bg-muted/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Live Host Preview</h2>
              <p className="text-sm text-muted-foreground">
                All examples below dispatch into this host, so the feedback stays contextual and pushes content instead of overlaying it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setNewestOnTop((value) => !value)}>
                newestOnTop: {String(newestOnTop)}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setMax((value) => (value >= 6 ? 2 : value + 1))}>
                max: {max}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setGap((value) => (value >= 20 ? 8 : value + 4))}>
                gap: {gap}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setWarmPalette((value) => !value)}>
                palette: {warmPalette ? "warm" : "default"}
              </SgButton>
              <SgButton size="sm" appearance="ghost" onClick={() => sgWhistle.dismiss()}>
                Clear
              </SgButton>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-4">
            <SgWhistleHost
              max={max}
              newestOnTop={newestOnTop}
              gap={gap}
              customColors={warmPalette ? WARM_COLORS : undefined}
            />
          </div>
        </section>

        <Section
          title="1) Base setup"
          description="Mount one SgWhistleHost where the layout should reveal contextual messages. Then dispatch whistles from anywhere in the page."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => sgWhistle.show({ title: "Base example", message: "A default whistle appeared in the host above." })}>
              sgWhistle.show
            </SgButton>
            <SgButton severity="success" onClick={() => sgWhistle.success({ title: "Saved", message: "This message stayed in the document flow." })}>
              sgWhistle.success
            </SgButton>
            <SgButton appearance="outline" onClick={() => sgWhistle.dismiss()}>
              sgWhistle.dismiss
            </SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/base-setup.tsx.sample" />
        </Section>

        <Section
          title="2) Severities and stack behavior"
          description="The service exposes convenience methods by severity, while host props such as max, newestOnTop and gap control the stack."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => fireSeverity("default")}>default</SgButton>
            <SgButton severity="success" onClick={() => fireSeverity("success")}>success</SgButton>
            <SgButton severity="info" onClick={() => fireSeverity("info")}>info</SgButton>
            <SgButton severity="warning" onClick={() => fireSeverity("warning")}>warning</SgButton>
            <SgButton severity="danger" onClick={() => fireSeverity("error")}>error</SgButton>
            <SgButton appearance="outline" onClick={() => fireSeverity("loading")}>loading</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/severities-and-stack.tsx.sample" />
        </Section>

        <Section
          title="3) Actions, border styles and opacity"
          description="Whistles can expose quick CTAs and lightweight visual emphasis without needing overlay positioning."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton severity="warning" onClick={runActionDemo}>Action + undo</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("solid")}>solid</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("soft")}>soft</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("left-accent")}>left-accent</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("full-accent")}>full-accent</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("none")}>none</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/actions-border-opacity.tsx.sample" />
        </Section>

        <Section
          title="4) Update by id"
          description="Loading flows are usually created once and then updated in place as the task resolves or fails."
        >
          <div className="flex flex-wrap items-center gap-2">
            <SgButton onClick={startLoading}>Start loading</SgButton>
            <SgButton severity="success" onClick={() => finishLoading("success")}>Finish success</SgButton>
            <SgButton severity="danger" onClick={() => finishLoading("error")}>Finish error</SgButton>
            <SgButton appearance="outline" onClick={() => activeId && sgWhistle.dismiss(activeId)}>
              Dismiss active
            </SgButton>
            <span className="text-xs text-muted-foreground">activeId: <code>{activeId ?? "none"}</code></span>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/update-by-id.tsx.sample" />
        </Section>

        <Section
          title="5) sgWhistle.promise"
          description="The helper centralizes loading, success and error state transitions for async flows."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runPromiseDemo}>Run promise demo</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/promise.tsx.sample" />
        </Section>

        <Section
          title="6) Custom renderer and host colors"
          description="Use sgWhistle.custom for arbitrary JSX and customColors on the host to align the stack with the surrounding context."
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runCustomDemo}>Custom whistle</SgButton>
            <SgButton appearance="outline" onClick={() => setWarmPalette((value) => !value)}>
              Toggle host palette
            </SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/custom-renderer-and-colors.tsx.sample" />
        </Section>

        <Section
          title="7) Playground"
          description="Interactive sandbox for host props and common whistle flows."
        >
          <SgPlayground
            title="SgWhistleHost Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-whistle-host/sg-whistle-host.tsx.playground"
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={WHISTLE_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
