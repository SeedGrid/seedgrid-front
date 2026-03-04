"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgInputDate, SgPlayground } from "@seedgrid/fe-components";
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

const INPUT_DATE_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputDate } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [withRange, setWithRange] = React.useState(true);
  const [filled, setFilled] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={withRange ? "solid" : "outline"} onClick={() => setWithRange((prev) => !prev)}>
          range
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
      </SgGrid>

      <SgInputDate
        id="playground-input-date"
        label="SgInputDate Playground"
        hintText="Selecione uma data"
        required={required}
        filled={filled}
        minDate={withRange ? "2020-01-01" : undefined}
        maxDate={withRange ? "2030-12-31" : undefined}
        onChange={setValue}
      />

      <div className="rounded border border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputDate id="label-float" label="Float" hintText="YYYY-MM-DD" labelPosition="float" />
          <SgInputDate id="label-top" label="Top" hintText="YYYY-MM-DD" labelPosition="top" />
          <SgInputDate
            id="label-left"
            label="Left"
            hintText="YYYY-MM-DD"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        Valor atual: <strong>{value || "-"}</strong>
      </div>
    </div>
  );
}`;

export default function SgInputDatePage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputDate.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputDate.sections.range.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputDate.sections.fixed.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-5", label: "5) Playground" }
    ],
    [i18n.locale]
  );
  const inputDatePropsRows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputDate.props.rows.id") },
    { prop: "label / hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputDate.props.rows.labelHintText") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputDate.props.rows.required") },
    { prop: "minDate / maxDate", type: "string (YYYY-MM-DD)", defaultValue: "-", description: t(i18n, "showcase.component.inputDate.props.rows.minMaxDate") },
    { prop: "withBorder / filled / enabled / readOnly", type: "boolean", defaultValue: "varies", description: t(i18n, "showcase.component.inputDate.props.rows.visualFlags") },
    { prop: "labelPosition", type: '"float" | "top" | "left"', defaultValue: '"float"', description: t(i18n, "showcase.common.props.rows.labelPosition") },
    { prop: "labelWidth", type: "number | string", defaultValue: '"11rem"', description: t(i18n, "showcase.common.props.rows.labelWidth") },
    { prop: "labelAlign", type: '"start" | "center" | "end"', defaultValue: '"start"', description: t(i18n, "showcase.common.props.rows.labelAlign") },
    { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"sm"', description: t(i18n, "showcase.common.props.rows.elevation") },
    { prop: "width / borderRadius", type: "number | string", defaultValue: "100% / -", description: t(i18n, "showcase.component.inputDate.props.rows.widthBorderRadius") },
    { prop: "onChange / onValidation", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputDate.props.rows.events") },
    { prop: "inputProps", type: "InputHTMLAttributes", defaultValue: "{}", description: t(i18n, "showcase.component.inputDate.props.rows.inputProps") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputDate.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.inputDate.subtitle")}</p>
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
          title={`1) ${t(i18n, "showcase.component.inputDate.sections.basic.title")}`}
          description={t(i18n, "showcase.component.inputDate.sections.basic.description")}
        >
          <div className="w-80">
            <SgInputDate
              id="demo-basic"
              label={t(i18n, "showcase.component.inputDate.labels.date")}
              hintText={t(i18n, "showcase.component.inputDate.labels.dateHint")}
              onChange={(value) => setBasicValue(value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
            </p>
          </div>
          <CodeBlock code={`<SgInputDate\n  id="demo-basic"\n  label="${t(i18n, "showcase.component.inputDate.labels.date")}"\n  hintText="${t(i18n, "showcase.component.inputDate.labels.dateHint")}"\n  onChange={(value) => setBasicValue(value)}\n/>`} />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.inputDate.sections.range.title")}`}
          description={t(i18n, "showcase.component.inputDate.sections.range.description")}
        >
          <div className="w-80">
            <SgInputDate
              id="demo-range"
              label={t(i18n, "showcase.component.inputDate.labels.period")}
              minDate="2020-01-01"
              maxDate="2030-12-31"
            />
          </div>
          <CodeBlock code={`<SgInputDate\n  id="demo-range"\n  label="${t(i18n, "showcase.component.inputDate.labels.period")}"\n  minDate="2020-01-01"\n  maxDate="2030-12-31"\n/>`} />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.inputDate.sections.fixed.title")}`}
          description={t(i18n, "showcase.component.inputDate.sections.fixed.description")}
        >
          <div className="w-80">
            <SgInputDate
              id="demo-float"
              label={t(i18n, "showcase.component.inputDate.labels.eventDate")}
            />
          </div>
          <CodeBlock code={`<SgInputDate\n  id="demo-float"\n  label="${t(i18n, "showcase.component.inputDate.labels.eventDate")}"\n/>`} />
        </Section>

        <Section
  id="exemplo-4"
  title={`4) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputDate
      id="sg-input-date-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputDate
      id="sg-input-date-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputDate
      id="sg-input-date-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputDate
  id="sg-input-date-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputDate
  id="sg-input-date-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputDate
  id="sg-input-date-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section id="exemplo-5" title="5) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgInputDate Playground"
            interactive
            codeContract="appFile"
            code={INPUT_DATE_PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={inputDatePropsRows} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
