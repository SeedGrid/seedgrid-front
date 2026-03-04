"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgInputBirthDate, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
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

const INPUT_BIRTH_DATE_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputBirthDate } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [minAge, setMinAge] = React.useState(18);
  const [maxAgeEnabled, setMaxAgeEnabled] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [validation, setValidation] = React.useState<string | null>(null);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMinAge((prev) => (prev === 18 ? 21 : 18))}>
          minAge: {minAge}
        </SgButton>
        <SgButton size="sm" appearance={maxAgeEnabled ? "solid" : "outline"} onClick={() => setMaxAgeEnabled((prev) => !prev)}>
          maxAge
        </SgButton>
      </SgGrid>

      <SgInputBirthDate
        id="playground-input-birth-date"
        label="SgInputBirthDate Playground"
        required={required}
        minAge={minAge}
        maxAge={maxAgeEnabled ? 80 : undefined}
        filled={filled}
        onValidation={setValidation}
      />

      <div className="rounded border border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputBirthDate id="label-float" label="Float" hintText="DD/MM/YYYY" labelPosition="float" />
          <SgInputBirthDate id="label-top" label="Top" hintText="DD/MM/YYYY" labelPosition="top" />
          <SgInputBirthDate
            id="label-left"
            label="Left"
            hintText="DD/MM/YYYY"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>
      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        onValidation: <strong>{validation ?? "(valid)"}</strong>
      </div>
    </div>
  );
}`;

export default function SgInputBirthDatePage() {
  const i18n = useShowcaseI18n();
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputBirthDate.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputBirthDate.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputBirthDate.sections.range.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-5", label: "5) Playground" }
    ],
    [i18n.locale]
  );

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputBirthDate.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.inputBirthDate.subtitle")}</p>
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
          title={`1) ${t(i18n, "showcase.component.inputBirthDate.sections.basic.title")}`}
          description={t(i18n, "showcase.component.inputBirthDate.sections.basic.description")}
        >
          <div className="w-80">
            <SgInputBirthDate
              id="demo-basic"
              label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
              minAge={18}
              onValidation={(msg) => setValidationMsg(msg)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg ?? t(i18n, "showcase.common.labels.valid")}
            </p>
          </div>
          <CodeBlock code={`<SgInputBirthDate\n  id="demo-basic"\n  label="${t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}"\n  minAge={18}\n  onValidation={(msg) => setValidationMsg(msg)}\n/>`} />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.inputBirthDate.sections.required.title")}`}
          description={t(i18n, "showcase.component.inputBirthDate.sections.required.description")}
        >
          <div className="w-80">
            <SgInputBirthDate
              id="demo-required"
              label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
              minAge={18}
              required
              requiredMessage={t(i18n, "showcase.component.inputBirthDate.messages.required")}
            />
          </div>
          <CodeBlock code={`<SgInputBirthDate\n  id="demo-required"\n  label="${t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}"\n  minAge={18}\n  required\n  requiredMessage="${t(i18n, "showcase.component.inputBirthDate.messages.required")}"\n/>`} />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.inputBirthDate.sections.range.title")}`}
          description={t(i18n, "showcase.component.inputBirthDate.sections.range.description")}
        >
          <div className="w-80">
            <SgInputBirthDate
              id="demo-range"
              label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
              minAge={12}
              maxAge={80}
            />
          </div>
          <CodeBlock code={`<SgInputBirthDate\n  id="demo-range"\n  label="${t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}"\n  minAge={12}\n  maxAge={80}\n/>`} />
        </Section>

        <Section
  id="exemplo-4"
  title={`4) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputBirthDate
      id="sg-input-birth-date-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputBirthDate
      id="sg-input-birth-date-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputBirthDate
      id="sg-input-birth-date-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputBirthDate
  id="sg-input-birth-date-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputBirthDate
  id="sg-input-birth-date-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputBirthDate
  id="sg-input-birth-date-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section id="exemplo-5" title="5) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgInputBirthDate Playground"
            interactive
            codeContract="appFile"
            code={INPUT_BIRTH_DATE_PLAYGROUND_CODE}
            height={540}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">
            {t(i18n, "showcase.component.inputBirthDate.props.title")}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputBirthDate.props.headers.prop")}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputBirthDate.props.headers.type")}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputBirthDate.props.headers.default")}</th>
                  <th className="pb-2 font-semibold">{t(i18n, "showcase.component.inputBirthDate.props.headers.description")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.id")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">label / hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.labelHintText")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.required")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">minAge / maxAge</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">18 / -</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.ageRange")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly / withBorder / filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">varies</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.visualFlags")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">labelPosition</td><td className="py-2 pr-4">"float" | "top" | "left"</td><td className="py-2 pr-4">"float"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelPosition")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">labelWidth</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"11rem"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelWidth")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">labelAlign</td><td className="py-2 pr-4">"start" | "center" | "end"</td><td className="py-2 pr-4">"start"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelAlign")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">"none" | "sm" | "md" | "lg"</td><td className="py-2 pr-4">"sm"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.elevation")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.widthBorderRadius")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onValidation</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.events")}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">{t(i18n, "showcase.component.inputBirthDate.props.rows.inputProps")}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



