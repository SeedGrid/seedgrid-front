"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Bookmark, Search, Users, Bell, Heart } from "lucide-react";
import { SgButton, SgGrid, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

const BUTTON_EXAMPLE_IDS = [
  "exemplo-1",
  "exemplo-2",
  "exemplo-3",
  "exemplo-4",
  "exemplo-5",
  "exemplo-6",
  "exemplo-7",
  "exemplo-8",
  "exemplo-9",
  "exemplo-10",
  "exemplo-11",
  "exemplo-12",
  "exemplo-13",
  "exemplo-14",
  "exemplo-15",
] as const;

type ButtonTexts = {
  headerSubtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  iconsGroupElevated: string;
  iconsGroupRounded: string;
  iconsGroupGhost: string;
  iconsGroupOutlinedElevation: string;
  iconsGroupOutlined: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
};

const BUTTON_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ButtonTexts> = {
  "pt-BR": {
    headerSubtitle: "Botao com suporte a severity, appearance, shape, elevation, icons e loading.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referência de Props",
    sectionTitles: [
      "1) Basico",
      "2) Icones",
      "3) Severities",
      "4) Elevated Buttons",
      "5) Rounded Buttons",
      "6) Ghost Buttons (Flat)",
      "7) Outlined + Elevation",
      "8) Outlined Buttons",
      "9) Rounded Icon Buttons",
      "10) Rounded Text Icon Buttons",
      "11) Rounded and Outlined Icon Buttons",
      "12) Sizes",
      "13) Loading",
      "14) Custom Colors",
      "15) Playground",
    ],
    sectionDescriptions: [
      "Botao padrao com onClick e estado disabled.",
      "Examples completos com icones para validar appearance/shape/elevation.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      'appearance="solid" + elevation="sm".',
      'shape="rounded" para formato pill.',
      'appearance="ghost" - sem fundo, apenas texto colorido.',
      'appearance="outline" + elevation="sm".',
      'appearance="outline" - apenas bordas coloridas.',
      'shape="rounded" + icon only - botoes circulares.',
      'shape="rounded" + icon only + appearance="ghost"',
      'shape="rounded" + icon only + appearance="outline"',
      'size="sm" | "md" | "lg"',
      "loading=true exibe spinner e desabilita o botao.",
      "customColors permite qualquer cor via CSS.",
      "Teste as principais props do SgButton em tempo real.",
    ],
    iconsGroupElevated: "Elevated Buttons",
    iconsGroupRounded: "Rounded Buttons",
    iconsGroupGhost: "Ghost Buttons (Flat)",
    iconsGroupOutlinedElevation: "Outlined + Elevation",
    iconsGroupOutlined: "Outlined Buttons",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  "pt-PT": {
    headerSubtitle: "Botao com suporte a severity, appearance, shape, elevation, icons e loading.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referência de Props",
    sectionTitles: [
      "1) Basico",
      "2) Icones",
      "3) Severities",
      "4) Elevated Buttons",
      "5) Rounded Buttons",
      "6) Ghost Buttons (Flat)",
      "7) Outlined + Elevation",
      "8) Outlined Buttons",
      "9) Rounded Icon Buttons",
      "10) Rounded Text Icon Buttons",
      "11) Rounded and Outlined Icon Buttons",
      "12) Sizes",
      "13) Loading",
      "14) Custom Colors",
      "15) Playground",
    ],
    sectionDescriptions: [
      "Botao padrao com onClick e estado disabled.",
      "Examples completos com icones para validar appearance/shape/elevation.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      'appearance="solid" + elevation="sm".',
      'shape="rounded" para formato pill.',
      'appearance="ghost" - sem fundo, apenas texto colorido.',
      'appearance="outline" + elevation="sm".',
      'appearance="outline" - apenas bordas coloridas.',
      'shape="rounded" + icon only - botoes circulares.',
      'shape="rounded" + icon only + appearance="ghost"',
      'shape="rounded" + icon only + appearance="outline"',
      'size="sm" | "md" | "lg"',
      "loading=true exibe spinner e desabilita o botao.",
      "customColors permite qualquer cor via CSS.",
      "Teste as principais props do SgButton em tempo real.",
    ],
    iconsGroupElevated: "Elevated Buttons",
    iconsGroupRounded: "Rounded Buttons",
    iconsGroupGhost: "Ghost Buttons (Flat)",
    iconsGroupOutlinedElevation: "Outlined + Elevation",
    iconsGroupOutlined: "Outlined Buttons",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  "en-US": {
    headerSubtitle: "Button with support for severity, appearance, shape, elevation, icons, and loading.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    sectionTitles: [
      "1) Basic",
      "2) Icons",
      "3) Severities",
      "4) Elevated Buttons",
      "5) Rounded Buttons",
      "6) Ghost Buttons (Flat)",
      "7) Outlined + Elevation",
      "8) Outlined Buttons",
      "9) Rounded Icon Buttons",
      "10) Rounded Text Icon Buttons",
      "11) Rounded and Outlined Icon Buttons",
      "12) Sizes",
      "13) Loading",
      "14) Custom Colors",
      "15) Playground",
    ],
    sectionDescriptions: [
      "Default button with onClick and disabled state.",
      "Full icon examples to validate appearance/shape/elevation.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      'appearance="solid" + elevation="sm".',
      'shape="rounded" for pill format.',
      'appearance="ghost" - no background, text only.',
      'appearance="outline" + elevation="sm".',
      'appearance="outline" - outlined style only.',
      'shape="rounded" + icon only - circular buttons.',
      'shape="rounded" + icon only + appearance="ghost"',
      'shape="rounded" + icon only + appearance="outline"',
      'size="sm" | "md" | "lg"',
      "loading=true shows spinner and disables the button.",
      "customColors allows any CSS color.",
      "Test the main SgButton props in real time.",
    ],
    iconsGroupElevated: "Elevated Buttons",
    iconsGroupRounded: "Rounded Buttons",
    iconsGroupGhost: "Ghost Buttons (Flat)",
    iconsGroupOutlinedElevation: "Outlined + Elevation",
    iconsGroupOutlined: "Outlined Buttons",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  es: {
    headerSubtitle: "Boton con soporte para severity, appearance, shape, elevation, iconos y loading.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    sectionTitles: [
      "1) Basico",
      "2) Iconos",
      "3) Severities",
      "4) Elevated Buttons",
      "5) Rounded Buttons",
      "6) Ghost Buttons (Flat)",
      "7) Outlined + Elevation",
      "8) Outlined Buttons",
      "9) Rounded Icon Buttons",
      "10) Rounded Text Icon Buttons",
      "11) Rounded and Outlined Icon Buttons",
      "12) Sizes",
      "13) Loading",
      "14) Custom Colors",
      "15) Playground",
    ],
    sectionDescriptions: [
      "Boton estandar con onClick y estado disabled.",
      "Ejemplos completos con iconos para validar appearance/shape/elevation.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      'appearance="solid" + elevation="sm".',
      'shape="rounded" para formato pill.',
      'appearance="ghost" - sin fondo, solo texto.',
      'appearance="outline" + elevation="sm".',
      'appearance="outline" - solo bordes.',
      'shape="rounded" + icon only - botones circulares.',
      'shape="rounded" + icon only + appearance="ghost"',
      'shape="rounded" + icon only + appearance="outline"',
      'size="sm" | "md" | "lg"',
      "loading=true muestra spinner y deshabilita el boton.",
      "customColors permite cualquier color CSS.",
      "Prueba las principales props de SgButton en tiempo real.",
    ],
    iconsGroupElevated: "Elevated Buttons",
    iconsGroupRounded: "Rounded Buttons",
    iconsGroupGhost: "Ghost Buttons (Flat)",
    iconsGroupOutlinedElevation: "Outlined + Elevation",
    iconsGroupOutlined: "Outlined Buttons",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
  },
};

type SupportedButtonLocale = keyof typeof BUTTON_TEXTS;

function isSupportedButtonLocale(locale: ShowcaseLocale): locale is SupportedButtonLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getButtonTexts(locale: ShowcaseLocale): ButtonTexts {
  const normalized: SupportedButtonLocale = isSupportedButtonLocale(locale) ? locale : "en-US";
  return BUTTON_TEXTS[normalized];
}

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

const BUTTON_PROPS: ShowcasePropRow[] = [
  {
    prop: "severity",
    type: "\"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"help\" | \"danger\"",
    defaultValue: "\"primary\"",
    description: "Varia o tema visual do botao."
  },
  {
    prop: "appearance",
    type: "\"solid\" | \"outline\" | \"ghost\"",
    defaultValue: "\"solid\"",
    description: "Define estilo de preenchimento."
  },
  {
    prop: "size",
    type: "\"sm\" | \"md\" | \"lg\"",
    defaultValue: "\"md\"",
    description: "Tamanho do componente."
  },
  {
    prop: "shape",
    type: "\"default\" | \"rounded\"",
    defaultValue: "\"default\"",
    description: "Formato das bordas."
  },
  {
    prop: "elevation",
    type: "\"none\" | \"sm\" | \"md\" | \"lg\"",
    defaultValue: "\"none\"",
    description: "Nivel de elevacao/sombra."
  },
  {
    prop: "leftIcon / rightIcon",
    type: "ReactNode",
    defaultValue: "-",
    description: "Icones antes/depois do texto."
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Exibe spinner e bloqueia clique."
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Desabilita o botao."
  },
  {
    prop: "customColors",
    type: "object",
    defaultValue: "-",
    description: "Sobrescreve cores de fundo, texto, borda e foco."
  },
  {
    prop: "onClick",
    type: "(event) => void",
    defaultValue: "-",
    description: "Manipulador de clique."
  },
  {
    prop: "children",
    type: "ReactNode",
    defaultValue: "-",
    description: "Conteudo interno do botao."
  }
];

export default function SgButtonShowcase() {
  const submit = useFakeProcess(2000);
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getButtonTexts(i18n.locale), [i18n.locale]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const sectionTitle = React.useCallback((index: number) => texts.sectionTitles[index - 1] ?? "", [texts]);
  const sectionDescription = React.useCallback(
    (index: number) => texts.sectionDescriptions[index - 1] ?? "",
    [texts]
  );

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
            <h1 className="text-3xl font-bold">SgButton</h1>
            <p className="mt-2 text-muted-foreground">
              {texts.headerSubtitle}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {BUTTON_EXAMPLE_IDS.map((exampleId, index) => (
                <Link
                  key={exampleId}
                  href={`#${exampleId}`}
                  onClick={(event) => handleAnchorClick(event, exampleId)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {sectionTitle(index + 1)}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                {texts.propsLinkLabel}
              </Link>
            </SgGrid>
          </div>
        </div>

      {/* â”€â”€ Basic â”€â”€ */}
      <Section id="exemplo-1" title={sectionTitle(1)} description={sectionDescription(1)}>
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

      {/* â”€â”€ Icons â”€â”€ */}
      <Section id="exemplo-2" title={sectionTitle(2)} description={sectionDescription(2)}>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupElevated}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-${s}`} severity={s} appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupRounded}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`rounded-${s}`} severity={s} shape="rounded" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupGhost}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`flat-${s}`} severity={s} appearance="ghost" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupOutlinedElevation}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-text-${s}`} severity={s} appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupOutlined}</div>
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
      <Section id="exemplo-3" title={sectionTitle(3)} description={sectionDescription(3)}>
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

      {/* â”€â”€ Raised Buttons â”€â”€ */}
      <Section id="exemplo-4" title={sectionTitle(4)} description={sectionDescription(4)}>
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

      {/* â”€â”€ Rounded Buttons â”€â”€ */}
      <Section id="exemplo-5" title={sectionTitle(5)} description={sectionDescription(5)}>
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

      {/* â”€â”€ Flat Buttons (ghost) â”€â”€ */}
      <Section id="exemplo-6" title={sectionTitle(6)} description={sectionDescription(6)}>
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

      {/* â”€â”€ Raised Text Buttons â”€â”€ */}
      <Section id="exemplo-7" title={sectionTitle(7)} description={sectionDescription(7)}>
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

      {/* â”€â”€ Outlined Buttons â”€â”€ */}
      <Section id="exemplo-8" title={sectionTitle(8)} description={sectionDescription(8)}>
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

      {/* â”€â”€ Rounded Icon Buttons (solid) â”€â”€ */}
      <Section id="exemplo-9" title={sectionTitle(9)} description={sectionDescription(9)}>
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

      {/* â”€â”€ Rounded Text Icon Buttons (ghost) â”€â”€ */}
      <Section id="exemplo-10" title={sectionTitle(10)} description={sectionDescription(10)}>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="ghost" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="ghost" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="ghost" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="ghost" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* â”€â”€ Rounded and Outlined Icon Buttons â”€â”€ */}
      <Section id="exemplo-11" title={sectionTitle(11)} description={sectionDescription(11)}>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="outline" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="outline" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="outline" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="outline" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* â”€â”€ Sizes â”€â”€ */}
      <Section id="exemplo-12" title={sectionTitle(12)} description={sectionDescription(12)}>
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

      {/* â”€â”€ Loading â”€â”€ */}
      <Section id="exemplo-13" title={sectionTitle(13)} description={sectionDescription(13)}>
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

      {/* â”€â”€ Custom Colors â”€â”€ */}
      <Section id="exemplo-14" title={sectionTitle(14)} description={sectionDescription(14)}>
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

      <Section id="exemplo-15" title={sectionTitle(15)} description={sectionDescription(15)}>
        <SgPlayground
          title="SgButton Playground"
          interactive
          codeContract="appFile"
          code={BUTTON_PLAYGROUND_CODE}
          height={600}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={BUTTON_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

