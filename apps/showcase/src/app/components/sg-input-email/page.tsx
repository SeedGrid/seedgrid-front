"use client";

import React from "react";
import Link from "next/link";
import { DEFAULT_BLOCKED_EMAIL_DOMAINS, SgGrid, SgInputEmail, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code.trimStart()} />;
}

const INPUT_EMAIL_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputEmail } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [blockFakeMail, setBlockFakeMail] = React.useState(true);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={blockFakeMail ? "solid" : "outline"} onClick={() => setBlockFakeMail((prev) => !prev)}>
          blockFakeMail
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance={withBorder ? "solid" : "outline"} onClick={() => setWithBorder((prev) => !prev)}>
          withBorder
        </SgButton>
      </SgGrid>

      <SgInputEmail
        id="playground-input-email"
        label="SgInputEmail Playground"
        hintText="Type a valid email"
        required={required}
        blockFakeMail={blockFakeMail}
        filled={filled}
        withBorder={withBorder}
        onChange={setValue}
      />

      <div className="rounded border border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputEmail id="label-float" label="Float" hintText="name@domain.com" labelPosition="float" />
          <SgInputEmail id="label-top" label="Top" hintText="name@domain.com" labelPosition="top" />
          <SgInputEmail
            id="label-left"
            label="Left"
            hintText="name@domain.com"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        Current value: <strong>{value || "-"}</strong>
      </div>
    </div>
  );
}`;


export default function SgInputEmailPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

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
  }, [i18n.locale]);

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
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

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

  const exampleLinks = React.useMemo(
    () => [
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputEmail.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputEmail.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputEmail.sections.invalid.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputEmail.sections.blocked.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputEmail.sections.validation.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputEmail.sections.blockedList.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputEmail.sections.json.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.common.sections.noClear.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.common.sections.disabled.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-14", label: "14) Playground" }
    ],
    [i18n.locale]
  );
  const inputEmailPropsRows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputEmail.props.rows.id") },
    { prop: "label / hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputEmail.props.rows.labelHintText") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputEmail.props.rows.required") },
    { prop: "invalidMessage", type: "string", defaultValue: "auto", description: t(i18n, "showcase.component.inputEmail.props.rows.invalid") },
    { prop: "blockFakeMail", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.inputEmail.props.rows.blockFakeMail") },
    { prop: "validation / onValidation", type: "functions", defaultValue: "-", description: t(i18n, "showcase.component.inputEmail.props.rows.validation") },
    { prop: "onChange / onEnter / onExit / onClear", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputEmail.props.rows.events") },
    { prop: "withBorder / filled / enabled / readOnly", type: "boolean", defaultValue: "varies", description: t(i18n, "showcase.component.inputEmail.props.rows.visualFlags") },
    { prop: "labelPosition", type: '"float" | "top" | "left"', defaultValue: '"float"', description: t(i18n, "showcase.common.props.rows.labelPosition") },
    { prop: "labelWidth", type: "number | string", defaultValue: '"11rem"', description: t(i18n, "showcase.common.props.rows.labelWidth") },
    { prop: "labelAlign", type: '"start" | "center" | "end"', defaultValue: '"start"', description: t(i18n, "showcase.common.props.rows.labelAlign") },
    { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"sm"', description: t(i18n, "showcase.common.props.rows.elevation") },
    { prop: "width / borderRadius", type: "number | string", defaultValue: "100% / -", description: t(i18n, "showcase.component.inputEmail.props.rows.widthBorderRadius") },
    { prop: "inputProps", type: "InputHTMLAttributes", defaultValue: "{}", description: t(i18n, "showcase.component.inputEmail.props.rows.inputProps") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputEmail.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputEmail.subtitle")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(i18n, "showcase.common.examples")}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {exampleLinks.map((example) => (
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

      <Section
        id="exemplo-1"
        title={`1) ${t(i18n, "showcase.component.inputEmail.sections.basic.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-basic"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="${t(i18n, "showcase.component.inputEmail.labels.email")}"
  hintText="${t(i18n, "showcase.component.inputEmail.labels.emailHint")}"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.inputEmail.sections.required.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.required.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-required"
            label={t(i18n, "showcase.component.inputEmail.labels.required")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputEmail.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputEmail.messages.required")}
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="${t(i18n, "showcase.component.inputEmail.labels.required")}"
  hintText="${t(i18n, "showcase.component.inputEmail.labels.requiredHint")}"
  required
  requiredMessage="${t(i18n, "showcase.component.inputEmail.messages.required")}"
/>`} />
      </Section>

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.inputEmail.sections.invalid.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-invalid"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            invalidMessage={t(i18n, "showcase.component.inputEmail.messages.invalid")}
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="${t(i18n, "showcase.component.inputEmail.labels.email")}"
  hintText="${t(i18n, "showcase.component.inputEmail.labels.emailHint")}"
  invalidMessage="${t(i18n, "showcase.component.inputEmail.messages.invalid")}"
/>`} />
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.inputEmail.sections.blocked.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.blocked.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked-off"
            label={t(i18n, "showcase.component.inputEmail.labels.noBlock")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            blockFakeMail={false}
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="${t(i18n, "showcase.component.inputEmail.labels.email")}"
  blockFakeMail={false}
/>`} />
      </Section>

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.inputEmail.sections.validation.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-validation"
            label={t(i18n, "showcase.component.inputEmail.labels.onlyCom")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.domainHint")}
            validation={(v) =>
              v.endsWith(".com") ? null : t(i18n, "showcase.component.inputEmail.messages.onlyCom")
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}:{" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="${t(i18n, "showcase.component.inputEmail.labels.onlyCom")}"
  hintText="${t(i18n, "showcase.component.inputEmail.labels.domainHint")}"
  validation={(v) => (v.endsWith(".com") ? null : "${t(i18n, "showcase.component.inputEmail.messages.onlyCom")}")}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.inputEmail.sections.blockedList.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.blockedList.description")}
      >
        <div className="w-full overflow-x-auto rounded border border-border bg-foreground/5 p-3 font-mono text-xs">
          {DEFAULT_BLOCKED_EMAIL_DOMAINS.join(", ")}
        </div>
      </Section>

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.inputEmail.sections.json.title")}`}
        description={t(i18n, "showcase.component.inputEmail.sections.json.description")}
      >
        <CodeBlock
          code={`// 1) Coloque o arquivo em public/seedgrid-blocked-email-domains.json
// {
//   "blockedEmailDomains": ["exemplo.com", "teste.com"]
// }
//
// 2) No startup da app:
fetch("/seedgrid-blocked-email-domains.json")
  .then((res) => res.json())
  .then((data) => {
    window.__seedgridBlockedEmailDomains = data.blockedEmailDomains ?? [];
  });`}
        />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.common.sections.visual.title")}`}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            filled
          />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" withBorder={false} />
<SgInputEmail id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" filled />`} />
      </Section>

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.common.sections.noClear.title")}`}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            clearButton={false}
          />
        </div>
        <CodeBlock
          code={`<SgInputEmail id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" clearButton={false} />`}
        />
      </Section>

      <Section
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.common.sections.sizeBorder.title")}`}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputEmail
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            width={200}
          />
          <SgInputEmail
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" width={200} />
<SgInputEmail id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" width={300} borderRadius={20} />`} />
      </Section>

      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.common.sections.disabled.title")}`}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            enabled={false}
            inputProps={{ defaultValue: t(i18n, "showcase.common.labels.notEditable") }}
          />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}" enabled={false} />`} />
      </Section>

      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.common.sections.events.title")}`}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? t(i18n, "showcase.common.labels.valid")}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.common.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputEmail
  id="eventos"
  label="${t(i18n, "showcase.common.labels.typeAndLog")}"
  hintText="${t(i18n, "showcase.component.inputEmail.labels.email")}"
  required
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>

      <Section
  id="exemplo-13"
  title={`13) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputEmail
      id="sg-input-email-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputEmail
      id="sg-input-email-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputEmail
      id="sg-input-email-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputEmail
  id="sg-input-email-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputEmail
  id="sg-input-email-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputEmail
  id="sg-input-email-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section id="exemplo-14" title="14) Playground" description={t(i18n, "showcase.common.playground.description")}>
        <SgPlayground
          title="SgInputEmail Playground"
          interactive
          codeContract="appFile"
          code={INPUT_EMAIL_PLAYGROUND_CODE}
          height={620}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={inputEmailPropsRows} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

