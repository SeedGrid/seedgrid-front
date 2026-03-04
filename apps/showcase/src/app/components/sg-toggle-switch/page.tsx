"use client";

import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgGrid, SgPlayground, SgToggleSwitch } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import { t, useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const TOGGLE_SWITCH_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgToggleSwitchFromLib = (SeedGrid as Record<string, unknown>).SgToggleSwitch as
  | React.ComponentType<any>
  | undefined;

function LocalFallback(props: {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  enabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        id={props.id}
        type="checkbox"
        checked={Boolean(props.checked)}
        disabled={props.enabled === false}
        readOnly={props.readOnly}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
      <span>{props.label}</span>
    </label>
  );
}

export default function App() {
  const hasToggle = typeof SgToggleSwitchFromLib === "function";
  const Toggle = (hasToggle ? SgToggleSwitchFromLib : LocalFallback) as React.ComponentType<any>;
  const [checked, setChecked] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(true);
  const [captured, setCaptured] = React.useState("(none)");

  return (
    <div className="space-y-4 p-2">
      {!hasToggle ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgToggleSwitch ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <Toggle
        id="toggle-playground"
        label="Exemplo dinamico"
        checked={checked}
        onChange={(next: boolean) => {
          setChecked(next);
          setCaptured("onChange -> " + String(next));
        }}
        enabled={enabled}
        readOnly={readOnly}
        required={required}
        onIcon={showIcons ? "ON" : undefined}
        offIcon={showIcons ? "OFF" : undefined}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked(true)}
        >
          Set true
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked(false)}
        >
          Set false
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked((prev) => !prev)}
        >
          Toggle
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          enabled
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
          required
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={showIcons} onChange={(e) => setShowIcons(e.target.checked)} />
          icons
        </label>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>value:</strong> {String(checked)}</div>
        <div><strong>captured:</strong> {captured}</div>
      </div>
    </div>
  );
}`;

const BASIC_SHOWCASE_CODE = `import * as React from "react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);

  return (
    <div>
      <SgToggleSwitch
        id="demo-basic"
        label="Ativar notificacoes"
        checked={value}
        onChange={setValue}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const ICONS_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(true);

  return (
    <div>
      <SgToggleSwitch
        id="demo-icons"
        label="Status da conta"
        checked={value}
        onChange={setValue}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const REMOTE_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  const handleRemoteToggle = (nextValue: boolean) => {
    setValue(nextValue);
    setLoading(true);
    setTimeout(() => {
      setLog((prev) => ["value=" + String(nextValue), ...prev].slice(0, 8));
      setLoading(false);
    }, 450);
  };

  return (
    <div>
      <SgToggleSwitch
        id="demo-remote"
        label={loading ? "Salvando..." : "Publicar automaticamente"}
        checked={value}
        onChange={handleRemoteToggle}
        enabled={!loading}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <div>{log.map((entry, index) => <div key={index}>{entry}</div>)}</div>
    </div>
  );
}`;

const EXTERNAL_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [captured, setCaptured] = React.useState("(sem evento)");

  return (
    <div>
      <SgToggleSwitch
        id="demo-external"
        label="Permitir sincronizacao"
        checked={value}
        onChange={(next) => {
          setValue(next);
          setCaptured("onChange -> " + String(next));
        }}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button onClick={() => setValue(true)}>Setar true</button>
      <button onClick={() => setValue(false)}>Setar false</button>
      <button onClick={() => setValue((prev) => !prev)}>Toggle externo</button>
      <button onClick={() => setCaptured("captura manual -> " + String(value))}>Capturar agora</button>

      <p>capturado: {captured}</p>
    </div>
  );
}`;

const RHF_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { useForm, type FieldValues } from "react-hook-form";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [submitResult, setSubmitResult] = React.useState("-");
  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))}>
      <SgToggleSwitch
        id="demo-rhf-register"
        name="notifications"
        label="Receber notificacoes por email"
        register={register}
      />

      <SgToggleSwitch
        id="demo-rhf-control"
        name="active"
        label="Conta ativa"
        control={control}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button type="submit">Enviar</button>
      <p>watch.notifications: {String(watch("notifications"))}</p>
      <p>watch.active: {String(watch("active"))}</p>
      <p>Ultimo submit: {submitResult}</p>
    </form>
  );
}`;

const DISABLED_READONLY_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div>
      <SgToggleSwitch
        id="demo-disabled"
        label="Disabled"
        checked
        enabled={false}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <SgToggleSwitch
        id="demo-readonly"
        label="ReadOnly"
        checked={false}
        readOnly
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
    </div>
  );
}`;


type ToggleTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
};

const TOGGLE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ToggleTexts> = {
  "pt-BR": {
    subtitle: "Toggle switch inspirado no PrimeFaces (toggleSwitch) com suporte a icones, estados disabled/readonly e integracao com react-hook-form.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Padrao",
    propsColDescription: "Descricao",
    sectionTitles: [
      "1) Basico",
      "2) Com icones (on/off)",
      "3) Remote (simulacao de update)",
      "4) Controlado externamente + captura do valor",
      "5) React Hook Form",
      "6) Estados Disabled / ReadOnly",
      "7) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo simples controlado por estado React.",
      "Variacao visual com icones dentro do thumb, seguindo a ideia do exemplo com icon no PrimeFaces.",
      "Ao alterar o switch, simulamos uma atualizacao remota para reproduzir o fluxo comum do showcase PrimeFaces.",
      "Exemplo de value controlado por estado externo e captura via onChange.",
      "Suporte nativo para register e control.",
      "Demonstracao de estados disabled e readOnly.",
      "Ajuste as principais props do SgToolBar."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  "pt-PT": {
    subtitle: "Toggle switch inspirado no PrimeFaces (toggleSwitch) com suporte a icones, estados disabled/readonly e integracao com react-hook-form.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Padrao",
    propsColDescription: "Descricao",
    sectionTitles: [
      "1) Basico",
      "2) Com icones (on/off)",
      "3) Remote (simulacao de update)",
      "4) Controlado externamente + captura do valor",
      "5) React Hook Form",
      "6) Estados Disabled / ReadOnly",
      "7) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo simples controlado por estado React.",
      "Variacao visual com icones dentro do thumb, seguindo a ideia do exemplo com icon no PrimeFaces.",
      "Ao alterar o switch, simulamos uma atualizacao remota para reproduzir o fluxo comum do showcase PrimeFaces.",
      "Exemplo de value controlado por estado externo e captura via onChange.",
      "Suporte nativo para register e control.",
      "Demonstracao de estados disabled e readOnly.",
      "Ajuste as principais props do SgToolBar."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  "en-US": {
    subtitle: "PrimeFaces-inspired toggle switch with icon support, disabled/readonly states, and react-hook-form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basic",
      "2) With icons (on/off)",
      "3) Remote (update simulation)",
      "4) Externally controlled + captured value",
      "5) React Hook Form",
      "6) Disabled / ReadOnly states",
      "7) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Simple example controlled with React state.",
      "Visual variation with icons inside the thumb, matching the PrimeFaces icon style.",
      "When toggled, simulates a remote update to reproduce the common PrimeFaces showcase flow.",
      "Example with externally controlled value and onChange capture.",
      "Native support for register and control.",
      "Demonstrates disabled and readOnly states.",
      "Adjust the main SgToggleSwitch props."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  es: {
    subtitle: "Toggle switch inspirado en PrimeFaces con soporte de iconos, estados disabled/readonly e integracion con react-hook-form.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Predeterminado",
    propsColDescription: "Descripcion",
    sectionTitles: [
      "1) Basico",
      "2) Con iconos (on/off)",
      "3) Remote (simulacion de update)",
      "4) Controlado externamente + captura de valor",
      "5) React Hook Form",
      "6) Estados Disabled / ReadOnly",
      "7) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Ejemplo simple controlado con estado React.",
      "Variacion visual con iconos dentro del thumb, siguiendo el estilo PrimeFaces.",
      "Al cambiar el switch, simulamos una actualizacion remota para reproducir el flujo comun del showcase PrimeFaces.",
      "Ejemplo de value controlado externamente y captura via onChange.",
      "Soporte nativo para register y control.",
      "Demostracion de estados disabled y readOnly.",
      "Ajusta las props principales de SgToggleSwitch."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  }
};

function isSupportedToggleLocale(locale: ShowcaseLocale): locale is keyof typeof TOGGLE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
export default function SgToggleSwitchPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof TOGGLE_TEXTS = isSupportedToggleLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = TOGGLE_TEXTS[locale];
  const [basicValue, setBasicValue] = React.useState(false);
  const [iconValue, setIconValue] = React.useState(true);
  const [externalValue, setExternalValue] = React.useState(false);
  const [capturedValue, setCapturedValue] = React.useState<string>("(sem evento)");
  const [remoteValue, setRemoteValue] = React.useState(false);
  const [remoteLoading, setRemoteLoading] = React.useState(false);
  const [remoteLog, setRemoteLog] = React.useState<string[]>([]);
  const [submitResult, setSubmitResult] = React.useState<string>("-");
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  const watchedNotifications = Boolean(watch("notifications"));
  const watchedActive = Boolean(watch("active"));

  const handleRemoteToggle = (nextValue: boolean) => {
    setRemoteValue(nextValue);
    setRemoteLoading(true);
    window.setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      setRemoteLog((prev) => [`[${timestamp}] value=${String(nextValue)}`, ...prev].slice(0, 8));
      setRemoteLoading(false);
    }, 450);
  };

  const onSubmit = (data: FieldValues) => {
    setSubmitResult(JSON.stringify(data));
  };

  const handleExternalChange = React.useCallback((nextValue: boolean) => {
    setExternalValue(nextValue);
    setCapturedValue(`onChange -> ${String(nextValue)}`);
  }, []);

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

  const exampleLinks = React.useMemo(() => texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })), [texts]);

  return (
    <I18NReady>
      <div
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgToggleSwitch</h1>
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

      <Section
        id="exemplo-1"
        title={texts.sectionTitles[0] ?? ""}
        description={texts.sectionDescriptions[0] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-basic"
            label="Ativar notificacoes"
            checked={basicValue}
            onChange={setBasicValue}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Valor atual: <code className="rounded bg-muted px-1">{String(basicValue)}</code>
          </p>
        </div>
        <CodeBlockBase
          code={BASIC_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-2"
        title={texts.sectionTitles[1] ?? ""}
        description={texts.sectionDescriptions[1] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-icons"
            label="Status da conta"
            checked={iconValue}
            onChange={setIconValue}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Valor atual: <code className="rounded bg-muted px-1">{String(iconValue)}</code>
          </p>
        </div>
        <CodeBlockBase
          code={ICONS_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-3"
        title={texts.sectionTitles[2] ?? ""}
        description={texts.sectionDescriptions[2] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-remote"
            label={remoteLoading ? "Salvando..." : "Publicar automaticamente"}
            checked={remoteValue}
            onChange={handleRemoteToggle}
            enabled={!remoteLoading}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="mt-3 h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {remoteLog.length === 0 ? (
              <span className="text-muted-foreground">
                Altere o switch para registrar eventos.
              </span>
            ) : (
              remoteLog.map((entry, index) => <div key={index}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlockBase
          code={REMOTE_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-4"
        title={texts.sectionTitles[3] ?? ""}
        description={texts.sectionDescriptions[3] ?? ""}
      >
        <div className="rounded-md border border-border p-4 space-y-3">
          <SgToggleSwitch
            id="demo-external"
            label="Permitir sincronizacao"
            checked={externalValue}
            onChange={handleExternalChange}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue(true)}
            >
              Setar true
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue(false)}
            >
              Setar false
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue((prev) => !prev)}
            >
              Toggle externo
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setCapturedValue(`captura manual -> ${String(externalValue)}`)}
            >
              Capturar agora
            </button>
          </div>
          <div className="rounded border border-border bg-foreground/5 p-2 text-xs">
            <div>value externo: <code className="rounded bg-muted px-1">{String(externalValue)}</code></div>
            <div>capturado: <code className="rounded bg-muted px-1">{capturedValue}</code></div>
          </div>
        </div>
        <CodeBlockBase
          code={EXTERNAL_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-5"
        title={texts.sectionTitles[4] ?? ""}
        description={texts.sectionDescriptions[4] ?? ""}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-rhf-register"
            name="notifications"
            label="Receber notificacoes por email"
            register={register}
          />
          <SgToggleSwitch
            id="demo-rhf-control"
            name="active"
            label="Conta ativa"
            control={control}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            watch.notifications: <code className="rounded bg-muted px-1">{String(watchedNotifications)}</code>
            {" | "}
            watch.active: <code className="rounded bg-muted px-1">{String(watchedActive)}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Ultimo submit: <code className="rounded bg-muted px-1">{submitResult}</code>
          </p>
        </form>
        <CodeBlockBase
          code={RHF_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-6"
        title={texts.sectionTitles[5] ?? ""}
        description={texts.sectionDescriptions[5] ?? ""}
      >
        <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
          <SgToggleSwitch
            id="demo-disabled"
            label="Disabled"
            checked
            enabled={false}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <SgToggleSwitch
            id="demo-readonly"
            label="ReadOnly"
            checked={false}
            readOnly
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
        </div>
        <CodeBlockBase
          code={DISABLED_READONLY_SHOWCASE_CODE}
        />
      </Section>

      <Section
        id="exemplo-7"
        title={texts.sectionTitles[6] ?? ""}
        description={texts.sectionDescriptions[6] ?? ""}
      >
        <SgPlayground
          title={texts.playgroundTitle}
          interactive
          codeContract="appFile"
          code={TOGGLE_SWITCH_PLAYGROUND_APP_FILE}
          height={560}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">{texts.propsTitle}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{texts.propsColProp}</th>
                <th className="pb-2 pr-4 font-semibold">{texts.propsColType}</th>
                <th className="pb-2 pr-4 font-semibold">{texts.propsColDefault}</th>
                <th className="pb-2 font-semibold">{texts.propsColDescription}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.label")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">checked / defaultChecked</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.checked")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(next: boolean) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.onChange")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onIcon / offIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.icons")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.interaction")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">register / control / name</td><td className="py-2 pr-4">react-hook-form</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.rhf")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


