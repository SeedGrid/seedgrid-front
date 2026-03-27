"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SgRadioGroup, type SgRadioGroupOption, SgButton, SgGrid } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import {
  Heart,
  Star,
  ThumbsUp,
  Circle,
  Square,
  Triangle,
  Sun,
  Moon,
  Cloud,
  Mail,
  Phone,
  Home,
  Landmark,
  Bell,
  RefreshCw
} from "lucide-react";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import { t, useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

type PropDef = {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
};

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { children: string }) {
  return <sgCodeBlockBase code={props.children} />;
}

function PropsTable(props: { id: string; props: PropDef[]; title: string; colProp: string; colType: string; colDefault: string; colDescription: string }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">{props.colProp}</th>
              <th className="pb-2 pr-4 font-semibold">{props.colType}</th>
              <th className="pb-2 pr-4 font-semibold">{props.colDefault}</th>
              <th className="pb-2 font-semibold">{props.colDescription}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.props.map((prop) => (
              <tr key={prop.name}>
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="py-2 pr-4">{prop.type}</td>
                <td className="py-2 pr-4">{prop.defaultValue ?? "-"}</td>
                <td className="py-2">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


type RadioGroupTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  sectionTitles: string[];
  playgroundTitle: string;
};

const RADIO_GROUP_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", RadioGroupTexts> = {
  "pt-BR": {
    subtitle: "Radio button group with horizontal/vertical orientation, icons, and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    playgroundTitle: "SgRadioGroup Playground",
    sectionTitles: [
      "1) Basico",
      "2) Orientation Horizontal",
      "3) Com Icones",
      "4) Apenas Icones (Icon Only)",
      "5) Selecao Controlada",
      "6) Controle Externo (setValue/getValue)",
      "7) Com Opcao Desabilitada",
      "8) Grupo Disabled",
      "9) Read-only",
      "10) Obrigatorio com Validacao",
      "11) Horizontal com Icones Coloridos",
      "12) Selection Style Highlight (Lista)",
      "13) Com GroupBox Customizado",
      "14) React Hook Form - Register",
      "15) Playground Interativo"
    ]
  },
  "pt-PT": {
    subtitle: "Radio button group with horizontal/vertical orientation, icons, and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    playgroundTitle: "SgRadioGroup Playground",
    sectionTitles: [
      "1) Basico",
      "2) Orientation Horizontal",
      "3) Com Icones",
      "4) Apenas Icones (Icon Only)",
      "5) Selecao Controlada",
      "6) Controlo Externo (setValue/getValue)",
      "7) Com Opcao Desabilitada",
      "8) Grupo Disabled",
      "9) Read-only",
      "10) Obrigatorio com Validacao",
      "11) Horizontal com Icones Coloridos",
      "12) Selection Style Highlight (Lista)",
      "13) Com GroupBox Customizado",
      "14) React Hook Form - Register",
      "15) Playground Interativo"
    ]
  },
  "en-US": {
    subtitle: "Radio button group with horizontal/vertical orientation, icons, and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    playgroundTitle: "SgRadioGroup Playground",
    sectionTitles: [
      "1) Basic",
      "2) Horizontal Orientation",
      "3) With Icons",
      "4) Icon Only",
      "5) Controlled Selection",
      "6) External Control (setValue/getValue)",
      "7) With Disabled Option",
      "8) Disabled Group",
      "9) Read-Only",
      "10) Required with Validation",
      "11) Horizontal with Colored Icons",
      "12) Selection Style Highlight (List)",
      "13) With Custom GroupBox",
      "14) React Hook Form - Register",
      "15) Interactive Playground"
    ]
  },
  es: {
    subtitle: "Grupo de radio buttons con orientacion horizontal/vertical, iconos, opcion de limpiar e integracion con React Hook Form.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Predeterminado",
    propsColDescription: "Descripcion",
    playgroundTitle: "SgRadioGroup Playground",
    sectionTitles: [
      "1) Basico",
      "2) Orientacion Horizontal",
      "3) Con Iconos",
      "4) Suno Iconos (Icon Only)",
      "5) Seleccion Controlada",
      "6) Control Externo (setValue/getValue)",
      "7) Con Opcion Deshabilitada",
      "8) Grupo Deshabilitado",
      "9) Suno Lectura",
      "10) Obligatorio con Validacion",
      "11) Horizontal con Iconos Coloreados",
      "12) Selection Style Highlight (Lista)",
      "13) Con GroupBox Personalizado",
      "14) React Hook Form - Register",
      "15) Playground Interactivo"
    ]
  }
};

function isSupportedRadioLocale(locale: ShowcaseLocale): locale is keyof typeof RADIO_GROUP_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
const RADIO_GROUP_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import {
  Heart,
  Star,
  ThumbsUp,
} from "lucide-react";

const SgRadioGroupFromLib = (SeedGrid as Record<string, unknown>).SgRadioGroup as
  | React.ComponentType<any>
  | undefined;

const OPTIONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="h-4 w-4" /> },
  { label: "Importante", value: "important", icon: <Star className="h-4 w-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="h-4 w-4" /> }
];

function FallbackRadioGroup(props: {
  value: string | null;
  onChange: (next: string | null) => void;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  readOnly: boolean;
}) {
  return (
    <div className={props.orientation === "horizontal" ? "flex flex-wrap gap-3" : "space-y-2"}>
      {OPTIONS.map((option) => (
        <label key={option.value} className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={props.value === option.value}
            disabled={props.disabled || props.readOnly}
            onChange={() => props.onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function App() {
  const hasComponent = typeof SgRadioGroupFromLib === "function";
  const [title, setTitle] = React.useState("Choose an option");
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [iconOnly, setIconOnly] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState<string | null>("favorite");

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgRadioGroup is not available in the published Sandpack version. Showing fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded border border-border px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientation</span>
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as "vertical" | "horizontal")}
            className="w-full rounded border border-border px-2 py-1"
          >
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={iconOnly} onChange={(event) => setIconOnly(event.target.checked)} />
          iconOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          disabled
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={required} onChange={(event) => setRequired(event.target.checked)} />
          required
        </label>
      </div>

      <div className="rounded border border-border p-4">
        {hasComponent ? (
          <SgRadioGroupFromLib
            id="radio-playground"
            title={title}
            source={OPTIONS}
            orientation={orientation}
            iconOnly={iconOnly}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            value={value}
            onChange={(next: string | number | null) => setValue(next as string | null)}
          />
        ) : (
          <FallbackRadioGroup
            value={value}
            onChange={setValue}
            orientation={orientation}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        value: {value ?? "(nenhum)"}
      </div>
    </div>
  );
}
`;

const BASIC_OPTIONS: SgRadioGroupOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
];

const FRUIT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Uva", value: "grape" }
];

const OPTIONS_WITH_ICONS: SgRadioGroupOption[] = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

const SHAPE_OPTIONS: SgRadioGroupOption[] = [
  { label: "Circle", value: "circle", icon: <Circle className="w-5 h-5" /> },
  { label: "Square", value: "square", icon: <Square className="w-5 h-5" /> },
  { label: "Triangle", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
];

const WEATHER_OPTIONS: SgRadioGroupOption[] = [
  { label: "Sun", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  { label: "Moon", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
  { label: "Cloud", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
];

const LIST_HIGHLIGHT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Reserve", value: "reserve", icon: <Landmark className="w-4 h-4 text-indigo-600" /> },
  { label: "Alert", value: "alert", icon: <Bell className="w-4 h-4 text-rose-600" /> },
  { label: "Refresh", value: "refresh", icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> }
];

const CONTACT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Email", value: "email", icon: <Mail className="w-4 h-4" /> },
  { label: "Phone", value: "phone", icon: <Phone className="w-4 h-4" /> },
  { label: "In person", value: "in-person", icon: <Home className="w-4 h-4" /> }
];

const PRIORITY_OPTIONS: SgRadioGroupOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent", disabled: true }
];

export default function SgRadioGroupShowcase() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof RADIO_GROUP_TEXTS = isSupportedRadioLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = RADIO_GROUP_TEXTS[locale];
  const [selectedBasic, setSelectedBasic] = React.useState<string | number | null>("option1");
  const [selectedFruit, setSelectedFruit] = React.useState<string | number | null>(null);
  const [selectedControlled, setSelectedControlled] = React.useState<string | number | null>("option2");
  const [externalValue, setExternalValue] = React.useState<string | number | null>("banana");
  const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<string | number | null>("reserve");

  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(`Dados do formulario: ${JSON.stringify(data, null, 2)}`);
  };

  const propDefs: PropDef[] = [
    {
      name: "id",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.id")
    },
    {
      name: "title",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.title")
    },
    {
      name: "source",
      type: "SgRadioGroupOption[]",
      description: t(i18n, "showcase.component.radioGroup.props.rows.source")
    },
    {
      name: "value",
      type: "string | number",
      description: t(i18n, "showcase.component.radioGroup.props.rows.value")
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"vertical"',
      description: t(i18n, "showcase.component.radioGroup.props.rows.orientation")
    },
    {
      name: "selectionStyle",
      type: '"radio" | "highlight"',
      defaultValue: '"radio"',
      description: t(i18n, "showcase.component.radioGroup.props.rows.selectionStyle")
    },
    {
      name: "iconOnly",
      type: "boolean",
      defaultValue: "false",
      description: t(i18n, "showcase.component.radioGroup.props.rows.iconOnly")
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t(i18n, "showcase.component.radioGroup.props.rows.disabled")
    },
    {
      name: "readOnly",
      type: "boolean",
      defaultValue: "false",
      description: t(i18n, "showcase.component.radioGroup.props.rows.readOnly")
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: t(i18n, "showcase.component.radioGroup.props.rows.required")
    },
    {
      name: "onChange",
      type: "(value: string | number | null) => void",
      description: t(i18n, "showcase.component.radioGroup.props.rows.onChange")
    },
    {
      name: "name",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.name")
    },
    {
      name: "control",
      type: "Control",
      description: t(i18n, "showcase.component.radioGroup.props.rows.control")
    },
    {
      name: "register",
      type: "UseFormRegister",
      description: t(i18n, "showcase.component.radioGroup.props.rows.register")
    },
    {
      name: "error",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.error")
    },
    {
      name: "className",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.className")
    },
    {
      name: "style",
      type: "React.CSSProperties",
      description: "Inline style adicional do container."
    },
    {
      name: "optionClassName",
      type: "string",
      description: t(i18n, "showcase.component.radioGroup.props.rows.optionClassName")
    },
    {
      name: "groupBoxProps",
      type: "object",
      description: t(i18n, "showcase.component.radioGroup.props.rows.groupBoxProps")
    }
  ];

  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

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
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgRadioGroup</h1>
            <p className="mt-2 text-muted-foreground">{texts.subtitle}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })).map((example) => (
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

      <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""}>
        <SgRadioGroup
          id="basic"
          title="Choose an option"
          source={BASIC_OPTIONS}
          value={selectedBasic ?? undefined}
          onChange={setSelectedBasic}
          style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: 12 }}
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor selecionado: <strong>{selectedBasic}</strong>
        </p>
        <CodeBlock>
          {`const BASIC_OPTIONS = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
];

const [selectedBasic, setSelectedBasic] = React.useState<string | number | null>("option1");

<SgRadioGroup
  id="basic"
  title="Choose an option"
  source={BASIC_OPTIONS}
  value={selectedBasic ?? undefined}
  onChange={setSelectedBasic}
  style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: 12 }}
/>

<p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
  Valor selecionado: <strong>{selectedBasic}</strong>
</p>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""}>
        <SgRadioGroup
          id="horizontal"
          title="Select a fruit"
          source={FRUIT_OPTIONS}
          orientation="horizontal"
          value={selectedFruit ?? undefined}
          onChange={setSelectedFruit}
        />
        <CodeBlock>
          {`const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Uva", value: "grape" }
];

const [selectedFruit, setSelectedFruit] = React.useState<string | number | null>(null);

<SgRadioGroup
  id="horizontal"
  title="Select a fruit"
  source={FRUIT_OPTIONS}
  orientation="horizontal"
  value={selectedFruit ?? undefined}
  onChange={setSelectedFruit}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""}>
        <SgRadioGroup
          id="with-icons"
          title="Choose an action"
          source={OPTIONS_WITH_ICONS}
        />
        <CodeBlock>
          {`const OPTIONS_WITH_ICONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

<SgRadioGroup
  id="with-icons"
  title="Choose an action"
  source={OPTIONS_WITH_ICONS}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""}>
        <SgRadioGroup
          id="icon-only"
          title="Choose a shape"
          source={SHAPE_OPTIONS}
          iconOnly
        />
        <CodeBlock>
          {`const SHAPE_OPTIONS = [
  { label: "Circle", value: "circle", icon: <Circle className="w-5 h-5" /> },
  { label: "Square", value: "square", icon: <Square className="w-5 h-5" /> },
  { label: "Triangle", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
];

<SgRadioGroup
  id="icon-only"
  title="Choose a shape"
  source={SHAPE_OPTIONS}
  iconOnly
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""}>
        <SgRadioGroup
          id="controlled-selection"
          title="Controlled selection"
          source={BASIC_OPTIONS}
          value={selectedControlled ?? undefined}
          onChange={setSelectedControlled}
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Value: {selectedControlled === null ? "None" : selectedControlled}
        </p>
        <CodeBlock>
          {`const BASIC_OPTIONS = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
];

const [selectedControlled, setSelectedControlled] = React.useState<string | number | null>("option2");

<SgRadioGroup
  id="controlled-selection"
  title="Controlled selection"
  source={BASIC_OPTIONS}
  value={selectedControlled ?? undefined}
  onChange={setSelectedControlled}
/>

<p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
  Value: {selectedControlled === null ? "None" : selectedControlled}
</p>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-6" title={texts.sectionTitles[5] ?? ""}>
        <div className="space-y-4">
          <SgRadioGroup
            id="external-control"
            title="Favorite fruit"
            source={FRUIT_OPTIONS}
            value={externalValue ?? undefined}
            onChange={setExternalValue}
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => setExternalValue("apple")}>
              Set Apple
            </SgButton>
            <SgButton onClick={() => setExternalValue("banana")}>
              Set Banana
            </SgButton>
            <SgButton onClick={() => setExternalValue("orange")}>
              Set Orange
            </SgButton>
            <SgButton onClick={() => setExternalValue(null)}>
              Clear
            </SgButton>
          </SgGrid>
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            Current value: <strong>{externalValue || "None"}</strong>
          </p>
        </div>
        <CodeBlock>
          {`const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Uva", value: "grape" }
];

const [externalValue, setExternalValue] = React.useState<string | number | null>("banana");

<div className="space-y-4">
  <SgRadioGroup
    id="external-control"
    title="Favorite fruit"
    source={FRUIT_OPTIONS}
    value={externalValue ?? undefined}
    onChange={setExternalValue}
  />
  <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
    <SgButton onClick={() => setExternalValue("apple")}>
      Set Apple
    </SgButton>
    <SgButton onClick={() => setExternalValue("banana")}>
      Set Banana
    </SgButton>
    <SgButton onClick={() => setExternalValue("orange")}>
      Set Orange
    </SgButton>
    <SgButton onClick={() => setExternalValue(null)}>
      Clear
    </SgButton>
  </SgGrid>
  <p className="text-sm text-[rgb(var(--sg-muted))]">
    Current value: <strong>{externalValue || "None"}</strong>
  </p>
</div>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-7" title={texts.sectionTitles[6] ?? ""}>
        <SgRadioGroup
          id="with-disabled-option"
          title="Priority level"
          source={PRIORITY_OPTIONS}
        />
        <CodeBlock>
          {`const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent", disabled: true }
];

<SgRadioGroup
  id="with-disabled-option"
  title="Priority level"
  source={PRIORITY_OPTIONS}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-8" title={texts.sectionTitles[7] ?? ""}>
        <SgRadioGroup
          id="disabled-group"
          title="Options desabilitadas"
          source={BASIC_OPTIONS}
          value="option2"
          disabled
        />
        <CodeBlock>
          {`const BASIC_OPTIONS = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
];

<SgRadioGroup
  id="disabled-group"
  title="Options desabilitadas"
  source={BASIC_OPTIONS}
  value="option2"
  disabled
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-9" title={texts.sectionTitles[8] ?? ""}>
        <SgRadioGroup
          id="readonly"
          title="Current configuration (read-only)"
          source={FRUIT_OPTIONS}
          value="banana"
          readOnly
        />
        <CodeBlock>
          {`const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Uva", value: "grape" }
];

<SgRadioGroup
  id="readonly"
  title="Current configuration (read-only)"
  source={FRUIT_OPTIONS}
  value="banana"
  readOnly
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-10" title={texts.sectionTitles[9] ?? ""}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="preference"
            title="Contact preference *"
            source={CONTACT_OPTIONS}
            control={control}
            required
          />
          <SgButton type="submit">Submit</SgButton>
        </form>
        <CodeBlock>
          {`const CONTACT_OPTIONS = [
  { label: "Email", value: "email", icon: <Mail className="w-4 h-4" /> },
  { label: "Phone", value: "phone", icon: <Phone className="w-4 h-4" /> },
  { label: "In person", value: "in-person", icon: <Home className="w-4 h-4" /> }
];

const { control, handleSubmit } = useForm();

const onSubmit = (data: any) => {
  console.log("Form submitted:", data);
  alert(\`Dados do formulario: \${JSON.stringify(data, null, 2)}\`);
};

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <SgRadioGroup
    name="preference"
    title="Contact preference *"
    source={CONTACT_OPTIONS}
    control={control}
    required
  />
  <SgButton type="submit">Submit</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-11" title={texts.sectionTitles[10] ?? ""}>
        <SgRadioGroup
          id="horizontal-colored"
          title="Weather condition"
          source={WEATHER_OPTIONS}
          orientation="horizontal"
        />
        <CodeBlock>
          {`const WEATHER_OPTIONS = [
  { label: "Sun", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  { label: "Moon", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
  { label: "Cloud", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
];

<SgRadioGroup
  id="horizontal-colored"
  title="Weather condition"
  source={WEATHER_OPTIONS}
  orientation="horizontal"
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-12" title={texts.sectionTitles[11] ?? ""}>
        <SgRadioGroup
          id="highlight-list"
          title="Options"
          source={LIST_HIGHLIGHT_OPTIONS}
          value={selectedHighlightStyle ?? undefined}
          onChange={setSelectedHighlightStyle}
          selectionStyle="highlight"
          className="max-w-xs"
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Value: <strong>{selectedHighlightStyle ?? "None"}</strong>
        </p>
        <CodeBlock>
          {`const LIST_HIGHLIGHT_OPTIONS = [
  { label: "Reserve", value: "reserve", icon: <Landmark className="w-4 h-4 text-indigo-600" /> },
  { label: "Alert", value: "alert", icon: <Bell className="w-4 h-4 text-rose-600" /> },
  { label: "Refresh", value: "refresh", icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> }
];

const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<string | number | null>("reserve");

<SgRadioGroup
  id="highlight-list"
  title="Options"
  source={LIST_HIGHLIGHT_OPTIONS}
  value={selectedHighlightStyle ?? undefined}
  onChange={setSelectedHighlightStyle}
  selectionStyle="highlight"
  className="max-w-xs"
/>

<p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
  Value: <strong>{selectedHighlightStyle ?? "None"}</strong>
</p>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-13" title={texts.sectionTitles[12] ?? ""}>
        <SgRadioGroup
          id="custom-groupbox"
          title="Choose with custom style"
          source={OPTIONS_WITH_ICONS}
          groupBoxProps={{
            title: "Preferences",
            className: "border-2 border-[rgb(var(--sg-primary-500))]"
          }}
        />
        <CodeBlock>
          {`const OPTIONS_WITH_ICONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

<SgRadioGroup
  id="custom-groupbox"
  title="Choose with custom style"
  source={OPTIONS_WITH_ICONS}
  groupBoxProps={{
    title: "Preferences",
    className: "border-2 border-[rgb(var(--sg-primary-500))]"
  }}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-14" title={texts.sectionTitles[13] ?? ""}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="fruit"
            title="Choose your fruit"
            source={FRUIT_OPTIONS}
            register={register}
          />
          <SgButton type="submit">Submit</SgButton>
        </form>
        <CodeBlock>
          {`const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Uva", value: "grape" }
];

const { register, handleSubmit } = useForm();

const onSubmit = (data: any) => {
  console.log("Form submitted:", data);
  alert(\`Dados do formulario: \${JSON.stringify(data, null, 2)}\`);
};

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <SgRadioGroup
    name="fruit"
    title="Choose your fruit"
    source={FRUIT_OPTIONS}
    register={register}
  />
  <SgButton type="submit">Submit</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-15" title={texts.sectionTitles[14] ?? ""}>
        <SgPlayground
          title={texts.playgroundTitle}
          interactive
          codeContract="appFile"
          code={RADIO_GROUP_PLAYGROUND_APP_FILE}
          height={650}
          defaultOpen
        />
      </Section>
      <PropsTable id="props-reference" props={propDefs} title={texts.propsTitle} colProp={texts.propsColProp} colType={texts.propsColType} colDefault={texts.propsColDefault} colDescription={texts.propsColDescription} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}




