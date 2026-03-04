"use client";

import * as React from "react";
import { SgButton, SgPlayground, SgQRCode } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

const INTERACTIVE_EXAMPLE_CODE = `const [value, setValue] = React.useState("https://seedgrid.com.br");
const [logoSrc, setLogoSrc] = React.useState("/logo-seedgrid.svg");
const [size, setSize] = React.useState(220);

<div className="grid gap-6 md:grid-cols-[1fr_auto]">
  <div className="space-y-4">
    <label className="block space-y-1">
      <span className="text-sm font-medium">Valor do QR Code</span>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
        placeholder="Digite texto, URL ou payload PIX"
      />
    </label>

    <label className="block space-y-1">
      <span className="text-sm font-medium">Logo central (URL)</span>
      <input
        type="text"
        value={logoSrc}
        onChange={(event) => setLogoSrc(event.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
        placeholder="https://exemplo.com/logo.png"
      />
    </label>

    <label className="block space-y-1">
      <span className="text-sm font-medium">Tamanho: {size}px</span>
      <input
        type="range"
        min={140}
        max={360}
        step={4}
        value={size}
        onChange={(event) => setSize(Number(event.target.value))}
        className="w-full"
      />
    </label>

    <div className="flex flex-wrap gap-2">
      <SgButton onClick={() => setValue("https://seedgrid.com.br")}>URL</SgButton>
      <SgButton
        severity="secondary"
        onClick={() =>
          setValue(
            "00020126580014BR.GOV.BCB.PIX0136contato@seedgrid.com.br5204000053039865802BR5922SEEDGRID TECNOLOGIA6009SAO PAULO62140510SEEDGRID1236304ABCD"
          )
        }
      >
        Exemplo PIX
      </SgButton>
      <SgButton severity="warning" onClick={() => setLogoSrc("")}>Sem logo</SgButton>
    </div>
  </div>

  <div className="inline-flex h-fit rounded-xl border border-border bg-white p-4 shadow-sm">
    <SgQRCode
      value={value}
      size={size}
      logoSrc={logoSrc || undefined}
      logoAlt="Logo SeedGrid"
      emptyFallback={<span className="text-sm text-muted-foreground">Informe um valor</span>}
    />
  </div>
</div>`;

const QRCODE_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgQRCodeFromLib = (SeedGrid as Record<string, unknown>).SgQRCode as
  | React.ComponentType<any>
  | undefined;

function LocalFallback(props: { value: string; size: number }) {
  return (
    <div
      className="inline-flex items-center justify-center rounded border border-slate-300 bg-slate-50 text-xs text-slate-600"
      style={{ width: props.size, height: props.size }}
    >
      {props.value ? "SgQRCode indisponivel na versao publicada" : "Informe um valor"}
    </div>
  );
}

export default function App() {
  const hasQrCode = typeof SgQRCodeFromLib === "function";
  const [value, setValue] = React.useState("https://seedgrid.com.br");
  const [logoSrc, setLogoSrc] = React.useState("/logo-seedgrid.svg");
  const [size, setSize] = React.useState(220);
  const [margin, setMargin] = React.useState(2);
  const [fgColor, setFgColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#FFFFFF");
  const [level, setLevel] = React.useState<"L" | "M" | "Q" | "H">("H");

  return (
    <div className="space-y-4 p-2">
      {!hasQrCode ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgQRCode ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-3">
          <label className="block text-xs">
            <span className="mb-1 block font-medium">Valor</span>
            <textarea
              rows={3}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full rounded border border-slate-300 px-2 py-1"
            />
          </label>

          <label className="block text-xs">
            <span className="mb-1 block font-medium">Logo URL</span>
            <input
              value={logoSrc}
              onChange={(event) => setLogoSrc(event.target.value)}
              className="w-full rounded border border-slate-300 px-2 py-1"
            />
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <label>
              <span className="mb-1 block font-medium">Tamanho ({size}px)</span>
              <input type="range" min={140} max={360} step={4} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </label>
            <label>
              <span className="mb-1 block font-medium">Margem ({margin})</span>
              <input type="range" min={0} max={8} step={1} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
            </label>
            <label>
              <span className="mb-1 block font-medium">FG</span>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-8 w-full rounded border border-slate-300" />
            </label>
            <label>
              <span className="mb-1 block font-medium">BG</span>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-full rounded border border-slate-300" />
            </label>
          </div>

          <label className="block text-xs">
            <span className="mb-1 block font-medium">Error correction</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as "L" | "M" | "Q" | "H")}
              className="w-full rounded border border-slate-300 px-2 py-1"
            >
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="Q">Q</option>
              <option value="H">H</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setValue("https://seedgrid.com.br")}>URL</button>
            <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setValue("00020126580014BR.GOV.BCB.PIX0136contato@seedgrid.com.br5204000053039865802BR5922SEEDGRID TECNOLOGIA6009SAO PAULO62140510SEEDGRID1236304ABCD")}>PIX</button>
            <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setLogoSrc("")}>Sem logo</button>
          </div>
        </div>

        <div className="inline-flex h-fit rounded-xl border border-border bg-white p-4 shadow-sm">
          {hasQrCode ? (
            <SgQRCodeFromLib
              value={value}
              size={size}
              margin={margin}
              fgColor={fgColor}
              bgColor={bgColor}
              errorCorrectionLevel={level}
              logoSrc={logoSrc || undefined}
              logoAlt="Logo"
              emptyFallback={<span className="text-xs text-muted-foreground">Informe um valor</span>}
            />
          ) : (
            <LocalFallback value={value} size={size} />
          )}
        </div>
      </div>
    </div>
  );
}`;

const QR_CODE_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Valor usado para gerar o QR Code." },
  { prop: "size", type: "number", defaultValue: "220", description: "Tamanho em pixels." },
  { prop: "logoSrc / logoAlt", type: "string / string", defaultValue: "- / -", description: "Logo opcional no centro." },
  { prop: "margin", type: "number", defaultValue: "2", description: "Margem interna do QR Code." },
  { prop: "fgColor / bgColor", type: "string / string", defaultValue: "#000000 / #FFFFFF", description: "Cores do QR." },
  { prop: "errorCorrectionLevel", type: "\"L\" | \"M\" | \"Q\" | \"H\"", defaultValue: "H", description: "Nível de correção de erro." },
  { prop: "emptyFallback", type: "ReactNode", defaultValue: "-", description: "Fallback quando value está vazio." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customização visual." }
];

type QrCodeTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  playgroundTitle: string;
  qrValueLabel: string;
  qrValuePlaceholder: string;
  logoLabel: string;
  logoPlaceholder: string;
  sizeLabel: string;
  presetUrl: string;
  presetPix: string;
  presetNoLogo: string;
  emptyFallback: string;
};

const QR_CODE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", QrCodeTexts> = {
  "pt-BR": {
    subtitle: "Generates a QR Code from a value and allows configuring a centered logo.",
    section1Title: "1) Interactive example",
    section1Description: "Change the QR Code value, center logo, and size.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Interactive sandbox to simulate scenarios with value, logo, size, colors, margin, and correction level.",
    playgroundTitle: "SgQRCode Playground",
    qrValueLabel: "QR Code value",
    qrValuePlaceholder: "Digite texto, URL ou payload PIX",
    logoLabel: "Logo central (URL)",
    logoPlaceholder: "https://exemplo.com/logo.png",
    sizeLabel: "Tamanho",
    presetUrl: "URL",
    presetPix: "PIX example",
    presetNoLogo: "Sem logo",
    emptyFallback: "Enter a value"
  },
  "pt-PT": {
    subtitle: "Generates a QR Code from a value and allows configuring a centered logo.",
    section1Title: "1) Interactive example",
    section1Description: "Change the QR Code value, center logo, and size.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Interactive sandbox to simulate scenarios with value, logo, size, colors, margin, and correction level.",
    playgroundTitle: "SgQRCode Playground",
    qrValueLabel: "QR Code value",
    qrValuePlaceholder: "Digite texto, URL ou payload PIX",
    logoLabel: "Logo central (URL)",
    logoPlaceholder: "https://exemplo.com/logo.png",
    sizeLabel: "Tamanho",
    presetUrl: "URL",
    presetPix: "PIX example",
    presetNoLogo: "Sem logo",
    emptyFallback: "Enter a value"
  },
  "en-US": {
    subtitle: "Generates QR Code from a value and allows configuring a centered logo.",
    section1Title: "1) Interactive example",
    section1Description: "Change QR value, centered logo, and size.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Interactive sandbox to simulate value, logo, size, colors, margin and error-correction level.",
    playgroundTitle: "SgQRCode Playground",
    qrValueLabel: "QR Code value",
    qrValuePlaceholder: "Type text, URL, or PIX payload",
    logoLabel: "Centered logo (URL)",
    logoPlaceholder: "https://example.com/logo.png",
    sizeLabel: "Size",
    presetUrl: "URL",
    presetPix: "PIX sample",
    presetNoLogo: "No logo",
    emptyFallback: "Provide a value"
  },
  es: {
    subtitle: "Generates a QR Code from a value and allows configuring a centered logo.",
    section1Title: "1) Ejemplo interactivo",
    section1Description: "Change the QR Code value, center logo, and size.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Interactive sandbox to simulate value, logo, size, colors, margin, and correction level.",
    playgroundTitle: "SgQRCode Playground",
    qrValueLabel: "QR Code value",
    qrValuePlaceholder: "Escribe texto, URL o payload PIX",
    logoLabel: "Logo central (URL)",
    logoPlaceholder: "https://ejemplo.com/logo.png",
    sizeLabel: "Tamano",
    presetUrl: "URL",
    presetPix: "Ejemplo PIX",
    presetNoLogo: "Sin logo",
    emptyFallback: "Ingresa un valor"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof QR_CODE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgQRCodePage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof QR_CODE_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = QR_CODE_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const [value, setValue] = React.useState("https://seedgrid.com.br");
  const [logoSrc, setLogoSrc] = React.useState("/logo-seedgrid.svg");
  const [size, setSize] = React.useState(220);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgQRCode"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={texts.section1Title}
        description={texts.section1Description}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium">{texts.qrValueLabel}</span>
              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                placeholder={texts.qrValuePlaceholder}
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium">{texts.logoLabel}</span>
              <input
                type="text"
                value={logoSrc}
                onChange={(event) => setLogoSrc(event.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                placeholder={texts.logoPlaceholder}
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium">{texts.sizeLabel}: {size}px</span>
              <input
                type="range"
                min={140}
                max={360}
                step={4}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="w-full"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <SgButton onClick={() => setValue("https://seedgrid.com.br")}>{texts.presetUrl}</SgButton>
              <SgButton
                severity="secondary"
                onClick={() =>
                  setValue(
                    "00020126580014BR.GOV.BCB.PIX0136contato@seedgrid.com.br5204000053039865802BR5922SEEDGRID TECNOLOGIA6009SAO PAULO62140510SEEDGRID1236304ABCD"
                  )
                }
              >
                {texts.presetPix}
              </SgButton>
              <SgButton severity="warning" onClick={() => setLogoSrc("")}>{texts.presetNoLogo}</SgButton>
            </div>
          </div>

          <div className="inline-flex h-fit rounded-xl border border-border bg-white p-4 shadow-sm">
            <SgQRCode
              value={value}
              size={size}
              logoSrc={logoSrc || undefined}
              logoAlt="Logo SeedGrid"
              emptyFallback={<span className="text-sm text-muted-foreground">{texts.emptyFallback}</span>}
            />
          </div>
        </div>

        <div className="mt-6">
          <CodeBlockBase code={INTERACTIVE_EXAMPLE_CODE} />
        </div>
      </Section>

      <Section
        title={texts.section2Title}
        description={texts.section2Description}
      >
        <SgPlayground
          title={texts.playgroundTitle}
          interactive
          codeContract="appFile"
          code={QRCODE_PLAYGROUND_APP_FILE}
          height={620}
          defaultOpen
        />
      </Section>

        <ShowcasePropsReference rows={QR_CODE_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
