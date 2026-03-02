"use client";

import React from "react";
import Link from "next/link";
import { Save, RefreshCw, Trash2, Home, Plus, Download, Upload, Copy, Printer, Share2, Mail, FileText } from "lucide-react";
import { SgGrid, SgPlayground, SgSplitButton } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

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

const SPLIT_BUTTON_EXAMPLE_LINKS = [
  { id: "exemplo-1", label: "1) Basic" },
  { id: "exemplo-2", label: "2) Severities" },
  { id: "exemplo-3", label: "3) Outlined" },
  { id: "exemplo-4", label: "4) Ghost" },
  { id: "exemplo-5", label: "5) Elevated" },
  { id: "exemplo-6", label: "6) Sizes" },
  { id: "exemplo-7", label: "7) With Icons" },
  { id: "exemplo-8", label: "8) Menu Separators" },
  { id: "exemplo-9", label: "9) Disabled" },
  { id: "exemplo-10", label: "10) Loading" },
  { id: "exemplo-11", label: "11) Disabled Items" },
  { id: "exemplo-12", label: "12) Playground" }
];

const SPLIT_BUTTON_PLAYGROUND_CODE = `import * as React from "react";
import { Save, RefreshCw, Trash2 } from "lucide-react";
import { SgButton, SgGrid, SgSplitButton } from "@seedgrid/fe-components";

const items = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
];

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "success" | "danger">("primary");
  const [appearance, setAppearance] = React.useState<"solid" | "outline" | "ghost">("solid");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
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
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
        <SgButton size="sm" appearance={loading ? "solid" : "outline"} onClick={() => setLoading((prev) => !prev)}>
          loading: {String(loading)}
        </SgButton>
        <SgButton size="sm" appearance={disabled ? "solid" : "outline"} onClick={() => setDisabled((prev) => !prev)}>
          disabled: {String(disabled)}
        </SgButton>
      </SgGrid>

      <SgSplitButton
        label="Preview"
        leftIcon={<Save className="size-4" />}
        severity={severity}
        appearance={appearance}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={() => {}}
        items={items}
      />
    </div>
  );
}`;

const BASIC_ITEMS = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => console.log("Update") },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => console.log("Delete") },
  { label: "Homepage", icon: <Home className="size-4" />, onClick: () => console.log("Homepage") }
];

const FILE_ITEMS = [
  { label: "Copy", icon: <Copy className="size-4" />, onClick: () => console.log("Copy") },
  { label: "Print", icon: <Printer className="size-4" />, onClick: () => console.log("Print") },
  { separator: true, label: "Export as PDF", icon: <FileText className="size-4" />, onClick: () => console.log("PDF") },
  { label: "Share via email", icon: <Mail className="size-4" />, onClick: () => console.log("Email") }
];

export default function SgSplitButtonShowcase() {
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
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgSplitButton</h1>
            <p className="mt-2 text-muted-foreground">
              Botao dividido com acao principal e menu dropdown de opcoes adicionais.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {SPLIT_BUTTON_EXAMPLE_LINKS.map((example) => (
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
      <Section id="exemplo-1" title="1) Basic" description="Split button com acao principal e dropdown de itens.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`import { Save, RefreshCw, Trash2, Home } from "lucide-react";
import { SgSplitButton } from "@seedgrid/fe-components";

<SgSplitButton
  label="Save"
  leftIcon={<Save className="size-4" />}
  onClick={() => handleSave()}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => handleUpdate() },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => handleDelete() },
    { label: "Homepage", icon: <Home className="size-4" />, onClick: () => navigate("/") },
  ]}
/>`} />
      </Section>

      {/* ── Severities ── */}
      <Section id="exemplo-2" title='2) Severities' description='severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`import { SgSplitButton } from "@seedgrid/fe-components";

const items = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
];

<SgSplitButton label="Primary" severity="primary" onClick={() => {}} items={items} />
<SgSplitButton label="Success" severity="success" onClick={() => {}} items={items} />
<SgSplitButton label="Danger" severity="danger" onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Outlined ── */}
      <Section id="exemplo-3" title='3) Outlined' description='appearance="outline" - bordas coloridas sem preenchimento.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="outline"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="outline" onClick={() => {}} items={items} />
<SgSplitButton label="Success" severity="success" appearance="outline" onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Ghost ── */}
      <Section id="exemplo-4" title='4) Ghost' description='appearance="ghost" - sem fundo, apenas texto colorido.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="ghost"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="ghost" onClick={() => {}} items={items} />
<SgSplitButton label="Danger" severity="danger" appearance="ghost" onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Raised ── */}
      <Section id="exemplo-5" title='5) Elevated' description='appearance="solid" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="solid"
              elevation="sm"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="solid" elevation="sm" onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Sizes ── */}
      <Section id="exemplo-6" title='6) Sizes' description='size="sm" | "md" | "lg"'>
        <Row>
          <SgSplitButton
            label="Small"
            size="sm"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("sm")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Medium"
            size="md"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("md")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Large"
            size="lg"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("lg")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Small" size="sm" onClick={() => {}} items={items} />
<SgSplitButton label="Medium" size="md" onClick={() => {}} items={items} />
<SgSplitButton label="Large" size="lg" onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── With Icons ── */}
      <Section id="exemplo-7" title="7) With Icons" description="leftIcon na acao principal e icon nos itens do menu.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            severity="primary"
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="New"
            leftIcon={<Plus className="size-4" />}
            severity="success"
            onClick={() => console.log("New")}
            items={[
              { label: "Import", icon: <Upload className="size-4" />, onClick: () => console.log("Import") },
              { label: "Download template", icon: <Download className="size-4" />, onClick: () => console.log("Template") }
            ]}
          />
          <SgSplitButton
            label="Share"
            leftIcon={<Share2 className="size-4" />}
            severity="info"
            onClick={() => console.log("Share")}
            items={FILE_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="Save"
  leftIcon={<Save className="size-4" />}
  severity="primary"
  onClick={() => handleSave()}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>

      {/* ── Separators ── */}
      <Section id="exemplo-8" title="8) Menu Separators" description="separator=true para dividir grupos de itens no menu.">
        <Row>
          <SgSplitButton
            label="File"
            leftIcon={<FileText className="size-4" />}
            severity="secondary"
            onClick={() => console.log("File")}
            items={FILE_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="File"
  leftIcon={<FileText className="size-4" />}
  severity="secondary"
  onClick={() => console.log("File")}
  items={[
    { label: "Copy", icon: <Copy className="size-4" />, onClick: () => {} },
    { label: "Print", icon: <Printer className="size-4" />, onClick: () => {} },
    { separator: true, label: "Export as PDF", icon: <FileText className="size-4" />, onClick: () => {} },
    { label: "Share via email", icon: <Mail className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>

      {/* ── Disabled ── */}
      <Section id="exemplo-9" title="9) Disabled" description="disabled=true desabilita o split button inteiro.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            disabled
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Disabled Outline"
            severity="danger"
            appearance="outline"
            disabled
            onClick={() => console.log("disabled")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Save" leftIcon={<Save className="size-4" />} disabled onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Loading ── */}
      <Section id="exemplo-10" title="10) Loading" description="loading=true exibe spinner na acao principal e desabilita o menu.">
        <Row>
          <SgSplitButton
            label="Saving..."
            leftIcon={<Save className="size-4" />}
            loading
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Processing..."
            severity="success"
            loading
            onClick={() => console.log("process")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Saving..." leftIcon={<Save className="size-4" />} loading onClick={() => {}} items={items} />`} />
      </Section>

      {/* ── Disabled Items ── */}
      <Section id="exemplo-11" title="11) Disabled Items" description="Itens individuais podem ser desabilitados.">
        <Row>
          <SgSplitButton
            label="Actions"
            severity="primary"
            onClick={() => console.log("Action")}
            items={[
              { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => console.log("Update") },
              { label: "Delete (disabled)", icon: <Trash2 className="size-4" />, onClick: () => console.log("Delete"), disabled: true },
              { label: "Homepage", icon: <Home className="size-4" />, onClick: () => console.log("Homepage") }
            ]}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="Actions"
  severity="primary"
  onClick={() => {}}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {}, disabled: true },
    { label: "Homepage", icon: <Home className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>

      <Section id="exemplo-12" title="12) Playground" description="Ajuste props principais do SgSplitButton.">
        <SgPlayground
          title="SgSplitButton Playground"
          interactive
          codeContract="appFile"
          code={SPLIT_BUTTON_PLAYGROUND_CODE}
          height={620}
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
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do botao principal.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">items</td><td className="py-2 pr-4">SplitButtonItem[]</td><td className="py-2 pr-4">-</td><td className="py-2">Itens do menu dropdown.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClick</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Acao principal do split button.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">severity</td><td className="py-2 pr-4">"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"</td><td className="py-2 pr-4">"primary"</td><td className="py-2">Tema visual.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">appearance</td><td className="py-2 pr-4">"solid" | "outline" | "ghost"</td><td className="py-2 pr-4">"solid"</td><td className="py-2">Estilo de preenchimento.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">size</td><td className="py-2 pr-4">"sm" | "md" | "lg"</td><td className="py-2 pr-4">"md"</td><td className="py-2">Tamanho do componente.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">leftIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Icone no botao principal.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">"none" | "sm" | "md" | "lg"</td><td className="py-2 pr-4">"none"</td><td className="py-2">Nivel de sombra/elevacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">disabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Desabilita acao principal e menu.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">loading</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Mostra spinner na acao principal.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
