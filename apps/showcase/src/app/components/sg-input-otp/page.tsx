"use client";

import React from "react";
import Link from "next/link";
import { SgButton, SgGrid, SgInputOTP, SgPlayground, type SgInputOTPRef } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { t, useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

function ValuePanel(props: { masked: string; raw: string; expectedLength: number; completeValue?: string }) {
  const complete = props.raw.length === props.expectedLength;
  return (
    <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
      <p><strong>masked:</strong> {props.masked || "(vazio)"}</p>
      <p><strong>raw:</strong> {props.raw || "(vazio)"}</p>
      <p><strong>completo:</strong> {complete ? "sim" : "nao"}</p>
      {props.completeValue ? (
        <p><strong>onComplete:</strong> {props.completeValue}</p>
      ) : null}
    </div>
  );
}


type OtpTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
};

const OTP_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", OtpTexts> = {
  "pt-BR": {
    subtitle: "Input OTP com digitos separados, suporte a colagem e mascara configuravel.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referencia de Props",
    sectionTitles: [
      "1) Basico",
      "2) Mascara customizada",
      "3) Colagem + onComplete",
      "4) Acesso por ref",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Mascara padrao: 999999.",
      "Example: \"###-###-99\".",
      "Cole um OTP e receba callback ao completar.",
      "Focar, limpar e ler valores via API do ref.",
      "Simule as principais props em tempo real."
    ],
    playgroundTitle: "SgInputOTP Playground",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description"
  },
  "pt-PT": {
    subtitle: "Input OTP com digitos separados, suporte a colagem e mascara configuravel.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referencia de Props",
    sectionTitles: [
      "1) Basico",
      "2) Mascara customizada",
      "3) Colagem + onComplete",
      "4) Acesso por ref",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Mascara padrao: 999999.",
      "Example: \"###-###-99\".",
      "Cole um OTP e receba callback ao completar.",
      "Focar, limpar e ler valores via API do ref.",
      "Simule as principais props em tempo real."
    ],
    playgroundTitle: "SgInputOTP Playground",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description"
  },
  "en-US": {
    subtitle: "OTP input with separated digits, paste support, and configurable mask.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    sectionTitles: [
      "1) Basic",
      "2) Custom mask",
      "3) Paste + onComplete",
      "4) Ref access",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Default mask: 999999.",
      "Example: \"###-###-99\".",
      "Paste an OTP and receive callback on completion.",
      "Focus, clear, and read values using ref API.",
      "Simulate main props in real time."
    ],
    playgroundTitle: "SgInputOTP Playground",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description"
  },
  es: {
    subtitle: "Input OTP con digitos separados, soporte de pegado y mascara configurable.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    sectionTitles: [
      "1) Basico",
      "2) Mascara personalizada",
      "3) Pegado + onComplete",
      "4) Acceso por ref",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Mascara por defecto: 999999.",
      "Ejemplo: \"###-###-99\".",
      "Pega un OTP y recibe callback al completar.",
      "Enfocar, limpiar y leer valores via API del ref.",
      "Simula las props principales en tiempo real."
    ],
    playgroundTitle: "SgInputOTP Playground",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Predeterminado",
    propsColDescription: "Descripcion"
  }
};

function isSupportedOtpLocale(locale: ShowcaseLocale): locale is keyof typeof OTP_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
const OTP_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputOTP, type SgInputOTPRef } from "@seedgrid/fe-components";

export default function App() {
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const [mask, setMask] = React.useState("###-###-99");
  const [masked, setMasked] = React.useState("");
  const [raw, setRaw] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={mask === "###-###-99" ? "solid" : "outline"} onClick={() => setMask("###-###-99")}>
          mask ###-###-99
        </SgButton>
        <SgButton size="sm" appearance={mask === "999999" ? "solid" : "outline"} onClick={() => setMask("999999")}>
          mask 999999
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>
          Focar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>
          Limpar
        </SgButton>
      </SgGrid>

      <SgInputOTP
        id="playground-otp"
        ref={otpRef}
        label="SgInputOTP Playground"
        hintText="Digite ou cole o codigo"
        mask={mask}
        onChange={setMasked}
        onRawChange={setRaw}
      />

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>masked:</strong> {masked || "(vazio)"}</div>
        <div><strong>raw:</strong> {raw || "(vazio)"}</div>
      </div>
    </div>
  );
}`;

export default function SgInputOTPPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof OTP_TEXTS = isSupportedOtpLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = OTP_TEXTS[locale];
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const [basicMasked, setBasicMasked] = React.useState("");
  const [basicRaw, setBasicRaw] = React.useState("");
  const [maskMasked, setMaskMasked] = React.useState("");
  const [maskRaw, setMaskRaw] = React.useState("");
  const [pasteMasked, setPasteMasked] = React.useState("");
  const [pasteRaw, setPasteRaw] = React.useState("");
  const [completeValue, setCompleteValue] = React.useState("");
  const [refReadout, setRefReadout] = React.useState('Clique em "Ler conteudo".');
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
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      container.scrollTo({ top: Math.max(0, container.scrollTop + delta), behavior: "auto" });
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

  const exampleLinks = React.useMemo(() => texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })), [texts]);
  const inputOtpPropsRows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.id") },
    { prop: "label / hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.labelHintText") },
    { prop: "mask", type: "string", defaultValue: "\"999999\"", description: t(i18n, "showcase.component.inputOtp.props.rows.mask") },
    { prop: "value / defaultValue", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.valueDefault") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputOtp.props.rows.required") },
    { prop: "onChange / onRawChange / onComplete", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.callbacks") },
    { prop: "enabled / readOnly", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.inputOtp.props.rows.enabledReadOnly") },
    { prop: "className / groupClassName / slotClassName / separatorClassName", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.classNames") },
    { prop: "register / control / name", type: "react-hook-form", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.rhf") },
    { prop: "ref API", type: "SgInputOTPRef", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.refApi") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgInputOTP</h1>
            <p className="mt-2 text-muted-foreground">{texts.subtitle}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
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
              >{texts.propsLinkLabel}</Link>
            </SgGrid>
          </div>
        </div>

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-basic"
              label="Codigo OTP"
              hintText="Digite os 6 digitos"
              onChange={setBasicMasked}
              onRawChange={setBasicRaw}
            />
            <ValuePanel masked={basicMasked} raw={basicRaw} expectedLength={6} />
          </div>
          <CodeBlock code={`const [masked, setMasked] = React.useState("");\nconst [raw, setRaw] = React.useState("");\n\nreturn (\n  <SgInputOTP\n    id="otp-basic"\n    label="Codigo OTP"\n    hintText="Digite os 6 digitos"\n    onChange={setMasked}\n    onRawChange={setRaw}\n  />\n);`} />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-mask"
              label="Token de acesso"
              hintText="Formato: ###-###-99"
              mask="###-###-99"
              onChange={setMaskMasked}
              onRawChange={setMaskRaw}
            />
            <ValuePanel masked={maskMasked} raw={maskRaw} expectedLength={8} />
          </div>
          <CodeBlock code={`<SgInputOTP\n  id="otp-mask"\n  label="Token de acesso"\n  hintText="Formato: ###-###-99"\n  mask="###-###-99"\n  onChange={setMaskMasked}\n  onRawChange={setMaskRaw}\n/>`} />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-paste"
              label="Cole o codigo"
              hintText='Teste colando: "AB1-CD2-34"'
              mask="###-###-99"
              onChange={setPasteMasked}
              onRawChange={setPasteRaw}
              onComplete={(value) => setCompleteValue(value)}
            />
            <ValuePanel masked={pasteMasked} raw={pasteRaw} expectedLength={8} completeValue={completeValue} />
          </div>
          <CodeBlock code={`<SgInputOTP\n  id="otp-paste"\n  label="Cole o codigo"\n  hintText='Teste colando: "AB1-CD2-34"'\n  mask="###-###-99"\n  onChange={setPasteMasked}\n  onRawChange={setPasteRaw}\n  onComplete={(value) => setCompleteValue(value)}\n/>`} />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP id="otp-ref" ref={otpRef} label="OTP por ref" hintText="Use os botoes abaixo" mask="###-###-99" />
            <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>Focar</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>Limpar</SgButton>
              <SgButton
                size="sm"
                appearance="outline"
                onClick={() => {
                  const masked = otpRef.current?.getMaskedValue() ?? "";
                  const raw = otpRef.current?.getRawValue() ?? "";
                  setRefReadout(`masked="${masked || "(vazio)"}" | raw="${raw || "(vazio)"}"`);
                }}
              >
                Ler conteudo
              </SgButton>
            </SgGrid>
            <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
              <strong>saida:</strong> {refReadout}
            </div>
          </div>
          <CodeBlock code={`const otpRef = React.useRef<SgInputOTPRef | null>(null);\n\nreturn (\n  <>\n    <SgInputOTP id="otp-ref" ref={otpRef} mask="###-###-99" />\n    <SgButton onClick={() => otpRef.current?.focus()}>Focar</SgButton>\n    <SgButton onClick={() => otpRef.current?.clear()}>Limpar</SgButton>\n    <SgButton onClick={() => console.log(otpRef.current?.getMaskedValue())}>Ler conteudo</SgButton>\n  </>\n);`} />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={OTP_PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={inputOtpPropsRows} title={texts.propsTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

