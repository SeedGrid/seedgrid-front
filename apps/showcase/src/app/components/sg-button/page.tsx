"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Bookmark, Search, Users, Bell, Heart } from "lucide-react";
import { SgButton, SgGrid, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

const ICON_MAP = [
  { severity: "primary", icon: <Bookmark className="size-4" /> },
  { severity: "secondary", icon: <Search className="size-4" /> },
  { severity: "success", icon: <Users className="size-4" /> },
  { severity: "info", icon: <Bell className="size-4" /> },
  { severity: "help", icon: <Heart className="size-4" /> },
  { severity: "danger", icon: <X className="size-4" /> },
  { severity: "warning", icon: <Check className="size-4" /> },
] as const;

function useFakeProcess(durationMs: number) {
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  const run = React.useCallback(() => {
    if (timerRef.current) return;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, durationMs);
  }, [durationMs]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { loading, run };
}

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-3">{props.children}</div>
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code.trim()} />;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const BUTTON_EXAMPLE_LINKS = [
  { id: "exemplo-1", label: "1) Basic" },
  { id: "exemplo-2", label: "2) Icons" },
  { id: "exemplo-3", label: "3) Severities" },
  { id: "exemplo-4", label: "4) Elevated Buttons" },
  { id: "exemplo-5", label: "5) Rounded Buttons" },
  { id: "exemplo-6", label: "6) Ghost Buttons" },
  { id: "exemplo-7", label: "7) Outlined + Elevation" },
  { id: "exemplo-8", label: "8) Outlined Buttons" },
  { id: "exemplo-9", label: "9) Rounded Icon Buttons" },
  { id: "exemplo-10", label: "10) Rounded Text Icon Buttons" },
  { id: "exemplo-11", label: "11) Rounded and Outlined Icon Buttons" },
  { id: "exemplo-12", label: "12) Sizes" },
  { id: "exemplo-13", label: "13) Loading" },
  { id: "exemplo-14", label: "14) Custom Colors" },
  { id: "exemplo-15", label: "15) Playground" }
];

const BUTTON_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid } from "@seedgrid/fe-components";
import { Check } from "lucide-react";

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger">("primary");
  const [appearance, setAppearance] = React.useState<"solid" | "outline" | "ghost">("solid");
  const [rounded, setRounded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 1, sm: 2, md: 3 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("solid")}>solid</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("outline")}>outline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("ghost")}>ghost</SgButton>
        <SgButton size="sm" appearance={rounded ? "solid" : "outline"} onClick={() => setRounded((prev) => !prev)}>
          rounded: {String(rounded)}
        </SgButton>
        <SgButton size="sm" appearance={loading ? "solid" : "outline"} onClick={() => setLoading((prev) => !prev)}>
          loading: {String(loading)}
        </SgButton>
        <SgButton size="sm" appearance={disabled ? "solid" : "outline"} onClick={() => setDisabled((prev) => !prev)}>
          disabled: {String(disabled)}
        </SgButton>
      </SgGrid>

      <SgButton
        severity={severity}
        appearance={appearance}
        shape={rounded ? "rounded" : "default"}
        loading={loading}
        disabled={disabled}
        leftIcon={<Check className="size-4" />}
      >
        Preview Button
      </SgButton>
    </div>
  );
}`;

export default function SgButtonShowcase() {
  const submit = useFakeProcess(2000);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, []);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl =
      (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        const next = Math.max(0, window.scrollY + delta);
        window.scrollTo({ top: next, behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      const next = Math.max(0, container.scrollTop + delta);
      container.scrollTo({ top: next, behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky -top-8 z-50 isolate bg-background pb-2 pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgButton</h1>
            <p className="mt-2 text-muted-foreground">
              Botao com suporte a severity, appearance, shape, elevation, icons e loading.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {BUTTON_EXAMPLE_LINKS.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                Props Reference
              </Link>
            </SgGrid>
          </div>
        </div>

      {/* ── Basic ── */}
      <Section id="exemplo-1" title="1) Basic" description="Botao padrao com onClick e estado disabled.">
        <Row>
          <SgButton onClick={submit.run} loading={submit.loading}>
            Submit
          </SgButton>
          <SgButton disabled>Disabled</SgButton>
        </Row>
        <CodeBlock code={`import { SgButton } from "@seedgrid/fe-components";

<SgButton onClick={() => console.log("click")} loading={isLoading}>
  Submit
</SgButton>

<SgButton disabled>Disabled</SgButton>`} />
      </Section>

      {/* ── Icons ── */}
      <Section id="exemplo-2" title="2) Icons" description="Exemplos completos com icones para validar appearance/shape/elevation.">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Elevated Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-${s}`} severity={s} appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Rounded Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`rounded-${s}`} severity={s} shape="rounded" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Ghost Buttons (Flat)</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`flat-${s}`} severity={s} appearance="ghost" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Outlined + Elevation</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-text-${s}`} severity={s} appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Outlined Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`outline-${s}`} severity={s} appearance="outline" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>
        </div>

        <CodeBlock code={`import { Check } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

// Elevated Buttons (solid + elevation)
<SgButton severity="primary" appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>Primary</SgButton>
<SgButton severity="info" appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>Info</SgButton>
<SgButton severity="danger" appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>Danger</SgButton>

// Rounded Buttons
<SgButton severity="secondary" shape="rounded" leftIcon={<Check className="size-4" />}>Secondary</SgButton>
<SgButton severity="success" shape="rounded" leftIcon={<Check className="size-4" />}>Success</SgButton>

// Ghost Buttons (Flat)
<SgButton severity="secondary" appearance="ghost" leftIcon={<Check className="size-4" />}>Secondary</SgButton>
<SgButton severity="warning" appearance="ghost" leftIcon={<Check className="size-4" />}>Warning</SgButton>

// Outlined + Elevation
<SgButton severity="primary" appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>Primary</SgButton>
<SgButton severity="help" appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>Help</SgButton>

// Outlined Buttons
<SgButton severity="info" appearance="outline" leftIcon={<Check className="size-4" />}>Info</SgButton>
<SgButton severity="danger" appearance="outline" leftIcon={<Check className="size-4" />}>Danger</SgButton>`} />
      </Section>
      <Section id="exemplo-3" title='3) Severities' description='severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s}>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`import { SgButton } from "@seedgrid/fe-components";

<SgButton severity="primary">Primary</SgButton>
<SgButton severity="secondary">Secondary</SgButton>
<SgButton severity="success">Success</SgButton>
<SgButton severity="info">Info</SgButton>
<SgButton severity="warning">Warning</SgButton>
<SgButton severity="help">Help</SgButton>
<SgButton severity="danger">Danger</SgButton>`} />
      </Section>

      {/* ── Raised Buttons ── */}
      <Section id="exemplo-4" title='4) Elevated Buttons' description='appearance="solid" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="solid" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="solid" elevation="sm">Primary</SgButton>
<SgButton severity="secondary" appearance="solid" elevation="sm">Secondary</SgButton>
<SgButton severity="success" appearance="solid" elevation="sm">Success</SgButton>
<SgButton severity="info" appearance="solid" elevation="sm">Info</SgButton>
<SgButton severity="warning" appearance="solid" elevation="sm">Warning</SgButton>
<SgButton severity="help" appearance="solid" elevation="sm">Help</SgButton>
<SgButton severity="danger" appearance="solid" elevation="sm">Danger</SgButton>`} />
      </Section>

      {/* ── Rounded Buttons ── */}
      <Section id="exemplo-5" title='5) Rounded Buttons' description='shape="rounded" para formato pill.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} shape="rounded">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded">Primary</SgButton>
<SgButton severity="secondary" shape="rounded">Secondary</SgButton>
<SgButton severity="success" shape="rounded">Success</SgButton>
<SgButton severity="info" shape="rounded">Info</SgButton>
<SgButton severity="warning" shape="rounded">Warning</SgButton>
<SgButton severity="help" shape="rounded">Help</SgButton>
<SgButton severity="danger" shape="rounded">Danger</SgButton>`} />
      </Section>

      {/* ── Flat Buttons (ghost) ── */}
      <Section id="exemplo-6" title='6) Ghost Buttons (Flat)' description='appearance="ghost" - sem fundo, apenas texto colorido.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="ghost">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="ghost">Primary</SgButton>
<SgButton severity="secondary" appearance="ghost">Secondary</SgButton>
<SgButton severity="success" appearance="ghost">Success</SgButton>
<SgButton severity="info" appearance="ghost">Info</SgButton>
<SgButton severity="warning" appearance="ghost">Warning</SgButton>
<SgButton severity="help" appearance="ghost">Help</SgButton>
<SgButton severity="danger" appearance="ghost">Danger</SgButton>`} />
      </Section>

      {/* ── Raised Text Buttons ── */}
      <Section id="exemplo-7" title='7) Outlined + Elevation' description='appearance="outline" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="outline" elevation="sm">Primary</SgButton>
<SgButton severity="secondary" appearance="outline" elevation="sm">Secondary</SgButton>
<SgButton severity="success" appearance="outline" elevation="sm">Success</SgButton>
<SgButton severity="info" appearance="outline" elevation="sm">Info</SgButton>
<SgButton severity="warning" appearance="outline" elevation="sm">Warning</SgButton>
<SgButton severity="help" appearance="outline" elevation="sm">Help</SgButton>
<SgButton severity="danger" appearance="outline" elevation="sm">Danger</SgButton>`} />
      </Section>

      {/* ── Outlined Buttons ── */}
      <Section id="exemplo-8" title='8) Outlined Buttons' description='appearance="outline" - apenas bordas coloridas.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="outline">Primary</SgButton>
<SgButton severity="secondary" appearance="outline">Secondary</SgButton>
<SgButton severity="success" appearance="outline">Success</SgButton>
<SgButton severity="info" appearance="outline">Info</SgButton>
<SgButton severity="warning" appearance="outline">Warning</SgButton>
<SgButton severity="help" appearance="outline">Help</SgButton>
<SgButton severity="danger" appearance="outline">Danger</SgButton>`} />
      </Section>

      {/* ── Rounded Icon Buttons (solid) ── */}
      <Section id="exemplo-9" title='9) Rounded Icon Buttons' description='shape="rounded" + icon only - botoes circulares.'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`import { Bookmark, Search, Users, Bell, Heart, X, Check } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

<SgButton severity="primary" shape="rounded" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="secondary" shape="rounded" leftIcon={<Search className="size-4" />} />
<SgButton severity="success" shape="rounded" leftIcon={<Users className="size-4" />} />
<SgButton severity="danger" shape="rounded" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Rounded Text Icon Buttons (ghost) ── */}
      <Section id="exemplo-10" title='10) Rounded Text Icon Buttons' description='shape="rounded" + icon only + appearance="ghost"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="ghost" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="ghost" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="ghost" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="ghost" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Rounded and Outlined Icon Buttons ── */}
      <Section id="exemplo-11" title='11) Rounded and Outlined Icon Buttons' description='shape="rounded" + icon only + appearance="outline"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="outline" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="outline" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="outline" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="outline" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Sizes ── */}
      <Section id="exemplo-12" title='12) Sizes' description='size="sm" | "md" | "lg"'>
        <Row>
          <SgButton size="sm">Small</SgButton>
          <SgButton size="md">Medium</SgButton>
          <SgButton size="lg">Large</SgButton>
        </Row>
        <Row>
          <SgButton size="sm" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="md" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="lg" shape="rounded" leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock code={`<SgButton size="sm">Small</SgButton>
<SgButton size="md">Medium</SgButton>
<SgButton size="lg">Large</SgButton>

// Icon buttons in different sizes
<SgButton size="sm" shape="rounded" leftIcon={<Check className="size-4" />} />
<SgButton size="md" shape="rounded" leftIcon={<Check className="size-4" />} />
<SgButton size="lg" shape="rounded" leftIcon={<Check className="size-4" />} />`} />
      </Section>

      {/* ── Loading ── */}
      <Section id="exemplo-13" title="13) Loading" description="loading=true exibe spinner e desabilita o botao.">
        <Row>
          <SgButton loading>Processing...</SgButton>
          <SgButton severity="success" loading>Saving...</SgButton>
          <SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
          <SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock code={`<SgButton loading>Processing...</SgButton>
<SgButton severity="success" loading>Saving...</SgButton>
<SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
<SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />`} />
      </Section>

      {/* ── Custom Colors ── */}
      <Section id="exemplo-14" title="14) Custom Colors" description="customColors permite qualquer cor via CSS.">
        <Row>
          <SgButton
            customColors={{
              bg: "#0f172a",
              fg: "#ffffff",
              hoverBg: "#020617",
              ring: "rgba(15,23,42,.35)"
            }}
          >
            Brand Dark
          </SgButton>
          <SgButton
            customColors={{
              bg: "#ec4899",
              fg: "#ffffff",
              border: "#db2777",
              hoverBg: "#db2777",
              ring: "rgba(236,72,153,.35)"
            }}
          >
            Pink
          </SgButton>
          <SgButton
            appearance="outline"
            customColors={{
              bg: "#8b5cf6",
              fg: "#8b5cf6",
              border: "#8b5cf6",
              ring: "rgba(139,92,246,.35)"
            }}
          >
            Violet Outline
          </SgButton>
        </Row>
        <CodeBlock code={`<SgButton
  customColors={{
    bg: "#0f172a",
    fg: "#ffffff",
    hoverBg: "#020617",
    ring: "rgba(15,23,42,.35)"
  }}
>
  Brand Dark
</SgButton>

<SgButton
  customColors={{
    bg: "#ec4899",
    fg: "#ffffff",
    border: "#db2777",
    hoverBg: "#db2777",
    ring: "rgba(236,72,153,.35)"
  }}
>
  Pink
</SgButton>

<SgButton
  appearance="outline"
  customColors={{
    bg: "#8b5cf6",
    fg: "#8b5cf6",
    border: "#8b5cf6",
    ring: "rgba(139,92,246,.35)"
  }}
>
  Violet Outline
</SgButton>`} />
      </Section>

      <Section id="exemplo-15" title="15) Playground" description="Teste as principais props do SgButton em tempo real.">
        <SgPlayground
          title="SgButton Playground"
          interactive
          codeContract="appFile"
          code={BUTTON_PLAYGROUND_CODE}
          height={600}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrão</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">severity</td><td className="py-2 pr-4">"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"</td><td className="py-2 pr-4">"primary"</td><td className="py-2">Varia o tema visual do botao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">appearance</td><td className="py-2 pr-4">"solid" | "outline" | "ghost"</td><td className="py-2 pr-4">"solid"</td><td className="py-2">Define estilo de preenchimento.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">size</td><td className="py-2 pr-4">"sm" | "md" | "lg"</td><td className="py-2 pr-4">"md"</td><td className="py-2">Tamanho do componente.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">shape</td><td className="py-2 pr-4">"default" | "rounded"</td><td className="py-2 pr-4">"default"</td><td className="py-2">Formato das bordas.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">"none" | "sm" | "md" | "lg"</td><td className="py-2 pr-4">"none"</td><td className="py-2">Nivel de elevacao/sombra.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">leftIcon / rightIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Icones antes/depois do texto.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">loading</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe spinner e bloqueia clique.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">disabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Desabilita o botao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">customColors</td><td className="py-2 pr-4">object</td><td className="py-2 pr-4">-</td><td className="py-2">Sobrescreve cores de fundo, texto, borda e foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClick</td><td className="py-2 pr-4">(event) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Manipulador de clique.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">children</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Conteudo interno do botao.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
