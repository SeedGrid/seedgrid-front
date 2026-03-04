"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgInputCNPJ, SgPlayground } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../i18n";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

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

const INPUT_CNPJ_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputCNPJ } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance={withBorder ? "solid" : "outline"} onClick={() => setWithBorder((prev) => !prev)}>
          withBorder
        </SgButton>
      </SgGrid>

      <SgInputCNPJ
        id="playground-input-cnpj"
        label="SgInputCNPJ Playground"
        hintText="Digite um CNPJ"
        required={required}
        filled={filled}
        withBorder={withBorder}
        inputProps={{}}
        onChange={setValue}
      />

      <div className="rounded border border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputCNPJ id="label-float" label="Float" hintText="00.000.000/0000-00" labelPosition="float" inputProps={{}} />
          <SgInputCNPJ id="label-top" label="Top" hintText="00.000.000/0000-00" labelPosition="top" inputProps={{}} />
          <SgInputCNPJ
            id="label-left"
            label="Left"
            hintText="00.000.000/0000-00"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
            inputProps={{}}
          />
        </SgGrid>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        Valor atual: <strong>{value || "-"}</strong>
      </div>
    </div>
  );
}`;

export default function SgInputCNPJPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [publicaResult, setPublicaResult] = React.useState<unknown | null>(null);
  const [publicaError, setPublicaError] = React.useState<string | null>(null);
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.cnpj.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.cnpj.sections.alnum.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.cnpj.sections.alnumList.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.cnpj.sections.publica.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.cnpj.sections.required.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.cnpj.sections.length.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.cnpj.sections.invalid.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.cnpj.sections.validation.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.common.sections.noClear.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.common.sections.disabled.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-15", label: "15) Playground" }
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
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.cnpj.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.cnpj.subtitle")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(i18n, "showcase.component.cnpj.i18nNote").split("\n").map((part, idx, arr) => (
                <span key={idx}>
                  {part}
                  {idx < arr.length - 1 ? <code className="rounded bg-muted px-1">components.*</code> : null}
                </span>
              ))}
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
        title={`1) ${t(i18n, "showcase.component.cnpj.sections.basic.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-basic"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            inputProps={{}}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `\"${basicValue}\"` })}
          </p>
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpjHint")}"\n  inputProps={{}}\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.cnpj.sections.alnum.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.alnum.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-alnum"
            label={t(i18n, "showcase.component.cnpj.labels.alnum")}
            hintText={t(i18n, "showcase.component.cnpj.labels.alnumHint")}
            inputProps={{ defaultValue: "AB.12C.345/0001-40" }}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.alnum")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.alnumHint")}"\n  inputProps={{ defaultValue: "AB.12C.345/0001-40" }}\n/>`} />
      </Section>

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.cnpj.sections.alnumList.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.alnumList.description")}
      >
        <CodeBlock
          code={`// Filial 0001
9H.SD1.NFA/0001-01  (raw: 9HSD1NFA000101)
LJ.AUX.GU2/0001-40  (raw: LJAUXGU2000140)
GK.1EK.OFE/0001-58  (raw: GK1EKOFE000158)
QF.18A.388/0001-00  (raw: QF18A388000100)
KF.TG0.Z4P/0001-90  (raw: KFTG0Z4P000190)
9P.UO0.1W2/0001-07  (raw: 9PUO01W2000107)
GK.IPC.PIK/0001-52  (raw: GKIPCPIK000152)
11.TYE.JIE/0001-68  (raw: 11TYEJIE000168)
J1.KBD.U64/0001-09  (raw: J1KBDU64000109)
L2.WTW.2N8/0001-06  (raw: L2WTW2N8000106)
J0.KBM.EUL/0001-05  (raw: J0KBMEUL000105)
ZQ.V25.1CK/0001-33  (raw: ZQV251CK000133)

// Filial 0002
B4.TMM.Q8D/0002-24  (raw: B4TMMQ8D000224)
79.B4O.GMG/0002-50  (raw: 79B4OGMG000250)
DN.FP6.V2Z/0002-05  (raw: DNFP6V2Z000205)
RY.JCA.S6R/0002-68  (raw: RYJCAS6R000268)
IW.UJ6.3BG/0002-46  (raw: IWUJ63BG000246)
OW.R9D.U0T/0002-96  (raw: OWR9DU0T000296)`}
        />
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.cnpj.sections.publica.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.publica.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-publica"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            validateWithPublicaCnpj
            publicaCnpjErrorMessage={t(i18n, "showcase.component.cnpj.messages.publicaNotFound")}
            onPublicaCnpjResult={(data) => {
              setPublicaResult(data);
              setPublicaError(null);
            }}
            onPublicaCnpjError={() => setPublicaError(t(i18n, "showcase.component.cnpj.messages.publicaError"))}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpjHint")}"\n  validateWithPublicaCnpj\n  publicaCnpjErrorMessage="${t(i18n, "showcase.component.cnpj.messages.publicaNotFound")}"\n  onPublicaCnpjResult={(data) => console.log(data)}\n  onPublicaCnpjError={(error) => console.log(error)}\n  inputProps={{}}\n/>`} />
        {publicaResult ? (
          <div className="mt-3 w-full rounded border border-border bg-foreground/5 p-3 text-xs">
            <div className="mb-2 text-sm font-semibold">{t(i18n, "showcase.component.cnpj.labels.publicaResult")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(publicaResult, null, 2)}</pre>
          </div>
        ) : null}
        {publicaError ? (
          <p className="mt-2 text-xs text-muted-foreground">{publicaError}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.cnpj.notes.publicaUnavailable")}
        </p>
      </Section>

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.cnpj.sections.required.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.required.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required"
            label={t(i18n, "showcase.component.cnpj.labels.required")}
            hintText={t(i18n, "showcase.component.cnpj.labels.requiredHint")}
            required
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required-custom"
            label={t(i18n, "showcase.component.cnpj.labels.customMessage")}
            hintText={t(i18n, "showcase.component.cnpj.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.cnpj.messages.required")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.required")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.requiredHint")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.cnpj.messages.required")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.cnpj.sections.length.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.length.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-length"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            lengthMessage={t(i18n, "showcase.component.cnpj.messages.length")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpjHint")}"\n  lengthMessage="${t(i18n, "showcase.component.cnpj.messages.length")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.cnpj.sections.invalid.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-invalid"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            invalidMessage={t(i18n, "showcase.component.cnpj.messages.invalid")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpjHint")}"\n  invalidMessage="${t(i18n, "showcase.component.cnpj.messages.invalid")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.component.cnpj.sections.validation.title")}`}
        description={t(i18n, "showcase.component.cnpj.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-validation"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            validation={(v) => (v.startsWith("00") ? t(i18n, "showcase.component.cnpj.messages.cannotStart") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
            inputProps={{}}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `\"${validationMsg}\"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="cnpj"\n  label="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpjHint")}"\n  validation={(v) => (v.startsWith("00") ? "${t(i18n, "showcase.component.cnpj.messages.cannotStart")}" : null)}\n  onValidation={(msg) => console.log(msg)}\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.common.sections.visual.title")}`}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            withBorder={false}
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCNPJ
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            filled
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" withBorder={false} inputProps={{}} />\n<SgInputCNPJ id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" filled inputProps={{}} />`} />
      </Section>

      <Section
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.common.sections.noClear.title")}`}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            clearButton={false}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" clearButton={false} inputProps={{}} />`} />
      </Section>

      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.common.sections.sizeBorder.title")}`}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputCNPJ
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            width={200}
            inputProps={{}}
          />
          <SgInputCNPJ
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            width={300}
            borderRadius={20}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" width={200} inputProps={{}} />\n<SgInputCNPJ id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" width={300} borderRadius={20} inputProps={{}} />`} />
      </Section>

      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.common.sections.disabled.title")}`}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            enabled={false}
            inputProps={{ defaultValue: "00.000.000/0000-00" }}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}" enabled={false} inputProps={{}} />`} />
      </Section>

      <Section
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.common.sections.events.title")}`}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            required
            inputProps={{}}
            onChange={(v) => log(`onChange: \"${v}\"`)}
            onEnter={() => log(t(i18n, "showcase.component.cnpj.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.cnpj.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.cnpj.logs.onClear"))}
            onValidation={(msg) => log(`onValidation: ${msg ?? t(i18n, "showcase.common.labels.valid")}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">{t(i18n, "showcase.common.labels.interactHint")}</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputCNPJ\n  id="eventos"\n  label="${t(i18n, "showcase.component.cnpj.labels.withEvents")}"\n  hintText="${t(i18n, "showcase.component.cnpj.labels.cnpj")}"\n  required\n  inputProps={{}}\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("focus")}\n  onExit={() => console.log("blur")}\n  onClear={() => console.log("cleared")}\n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>

      <Section
  id="exemplo-14"
  title={`14) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputCNPJ
      id="sg-input-cnpj-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      inputProps={{}}
      labelPosition="float"
    />
    <SgInputCNPJ
      id="sg-input-cnpj-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      inputProps={{}}
      labelPosition="top"
    />
    <SgInputCNPJ
      id="sg-input-cnpj-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      inputProps={{}}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputCNPJ
  id="sg-input-cnpj-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  inputProps={{}}
  labelPosition="float"
/>

<SgInputCNPJ
  id="sg-input-cnpj-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  inputProps={{}}
  labelPosition="top"
/>

<SgInputCNPJ
  id="sg-input-cnpj-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  inputProps={{}}
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section id="exemplo-15" title="15) Playground" description={t(i18n, "showcase.common.playground.description")}>
        <SgPlayground
          title="SgInputCNPJ Playground"
          interactive
          codeContract="appFile"
          code={INPUT_CNPJ_PLAYGROUND_CODE}
          height={640}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, "showcase.component.cnpj.props.title")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.cnpj.props.headers.prop")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.cnpj.props.headers.type")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.cnpj.props.headers.default")}</th>
                <th className="pb-2 font-semibold">{t(i18n, "showcase.component.cnpj.props.headers.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label / hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.labelHintText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">lengthMessage / invalidMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.lengthInvalid")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation / onValidation</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.validation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateWithPublicaCnpj / publicaCnpjErrorMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.publicaSettings")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onPublicaCnpjResult / onPublicaCnpjError</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.publicaCallbacks")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onEnter / onExit / onClear</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.events")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder / filled / enabled / readOnly / clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">varies</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.visualFlags")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelPosition</td><td className="py-2 pr-4">"float" | "top" | "left"</td><td className="py-2 pr-4">"float"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelPosition")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelWidth</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"11rem"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelWidth")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelAlign</td><td className="py-2 pr-4">"start" | "center" | "end"</td><td className="py-2 pr-4">"start"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.labelAlign")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">"none" | "sm" | "md" | "lg"</td><td className="py-2 pr-4">"sm"</td><td className="py-2">{t(i18n, "showcase.common.props.rows.elevation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.widthBorderRadius")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">{t(i18n, "showcase.component.cnpj.props.rows.inputProps")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


