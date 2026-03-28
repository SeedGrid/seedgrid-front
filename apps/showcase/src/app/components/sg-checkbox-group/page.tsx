"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  SgCheckboxGroup,
  type SgCheckboxGroupOption,
  type SgCheckboxGroupRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
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
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";

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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const BASIC_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
];

const FRUIT_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" }
];

const OPTIONS_WITH_ICONS: SgCheckboxGroupOption[] = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

const SHAPE_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Circle", value: "circle", icon: <Circle className="w-5 h-5" /> },
  { label: "Square", value: "square", icon: <Square className="w-5 h-5" /> },
  { label: "Triangle", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
];

const WEATHER_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Sun", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  { label: "Moon", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
  { label: "Cloud", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
];

const LIST_HIGHLIGHT_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Reserve", value: "reserve", icon: <Landmark className="w-4 h-4 text-indigo-600" /> },
  { label: "Alert", value: "alert", icon: <Bell className="w-4 h-4 text-rose-600" /> },
  { label: "Refresh", value: "refresh", icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> }
];

const CONTACT_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Email", value: "email", icon: <Mail className="w-4 h-4" /> },
  { label: "Phone", value: "phone", icon: <Phone className="w-4 h-4" /> },
  { label: "In person", value: "in-person", icon: <Home className="w-4 h-4" /> }
];

const PRIORITY_OPTIONS: SgCheckboxGroupOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent", disabled: true }
];

const SECTION_TITLES = [
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
  "15) Playground Interativo",
  "16) Check All (showCheckAll)",
  "17) Checked inicial no source",
  "18) Ref imperativo (getChecked / checkAll / clearAll)"
];

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import {
  Heart,
  Star,
  ThumbsUp,
} from "lucide-react";

const SgCheckboxGroupFromLib = (SeedGrid as Record<string, unknown>).SgCheckboxGroup as
  | React.ComponentType<any>
  | undefined;

const OPTIONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="h-4 w-4" /> },
  { label: "Importante", value: "important", icon: <Star className="h-4 w-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="h-4 w-4" /> }
];

export default function App() {
  const hasComponent = typeof SgCheckboxGroupFromLib === "function";
  const [title, setTitle] = React.useState("Choose options");
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [iconOnly, setIconOnly] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [showCheckAll, setShowCheckAll] = React.useState(false);
  const [value, setValue] = React.useState<(string | number)[]>(["favorite"]);

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgCheckboxGroup is not available in the published Sandpack version. Showing fallback.
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

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
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
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showCheckAll} onChange={(event) => setShowCheckAll(event.target.checked)} />
          showCheckAll
        </label>
      </div>

      <div className="rounded border border-border p-4">
        {hasComponent ? (
          <SgCheckboxGroupFromLib
            id="checkbox-playground"
            title={title}
            source={OPTIONS}
            orientation={orientation}
            iconOnly={iconOnly}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            showCheckAll={showCheckAll}
            value={value}
            onChange={(next: (string | number)[]) => setValue(next)}
          />
        ) : (
          <div className="space-y-2">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  disabled={disabled || readOnly}
                  onChange={() =>
                    setValue((prev) =>
                      prev.includes(opt.value)
                        ? prev.filter((v) => v !== opt.value)
                        : [...prev, opt.value]
                    )
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        value: [{value.join(", ")}]
      </div>
    </div>
  );
}
`;

export default function SgCheckboxGroupShowcase() {
  const [selectedBasic, setSelectedBasic] = React.useState<(string | number)[]>(["option1"]);
  const [selectedFruit, setSelectedFruit] = React.useState<(string | number)[]>([]);
  const [selectedControlled, setSelectedControlled] = React.useState<(string | number)[]>(["option2"]);
  const [externalValue, setExternalValue] = React.useState<(string | number)[]>(["banana"]);
  const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<(string | number)[]>(["reserve"]);

  const checkboxRef = React.useRef<SgCheckboxGroupRef>(null);
  const [refOutput, setRefOutput] = React.useState<string>("");

  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(`Dados do formulario: ${JSON.stringify(data, null, 2)}`);
  };

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

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef2 = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef2.current = navigateToAnchor;
  }, [navigateToAnchor]);

  return (
    <I18NReady>
      <div
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgCheckboxGroup</h1>
            <p className="mt-2 text-muted-foreground">Checkbox group with multi-selection, horizontal/vertical orientation, icons, check all, and React Hook Form integration.</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Examples</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {SECTION_TITLES.map((label, index) => ({ id: `exemplo-${index + 1}`, label })).map((example) => (
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
              >Referencia de Props</Link>
            </SgGrid>
          </div>
        </div>

        {/* 1 - Basico */}
        <Section id="exemplo-1" title={SECTION_TITLES[0]!}>
          <SgCheckboxGroup
            id="basic"
            title="Choose options"
            source={BASIC_OPTIONS}
            value={selectedBasic}
            onChange={setSelectedBasic}
            style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: 12 }}
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            Valores selecionados: <strong>[{selectedBasic.join(", ")}]</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/basico.tsx.sample" />
        </Section>

        {/* 2 - Orientation Horizontal */}
        <Section id="exemplo-2" title={SECTION_TITLES[1]!}>
          <SgCheckboxGroup
            id="horizontal"
            title="Select fruits"
            source={FRUIT_OPTIONS}
            orientation="horizontal"
            value={selectedFruit}
            onChange={setSelectedFruit}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/orientation-horizontal.tsx.sample" />
        </Section>

        {/* 3 - Com Icones */}
        <Section id="exemplo-3" title={SECTION_TITLES[2]!}>
          <SgCheckboxGroup
            id="with-icons"
            title="Choose actions"
            source={OPTIONS_WITH_ICONS}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-icones.tsx.sample" />
        </Section>

        {/* 4 - Apenas Icones */}
        <Section id="exemplo-4" title={SECTION_TITLES[3]!}>
          <SgCheckboxGroup
            id="icon-only"
            title="Choose shapes"
            source={SHAPE_OPTIONS}
            iconOnly
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/apenas-icones.tsx.sample" />
        </Section>

        {/* 5 - Selecao Controlada */}
        <Section id="exemplo-5" title={SECTION_TITLES[4]!}>
          <SgCheckboxGroup
            id="controlled-selection"
            title="Controlled selection"
            source={BASIC_OPTIONS}
            value={selectedControlled}
            onChange={setSelectedControlled}
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            Value: [{selectedControlled.join(", ")}]
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/selecao-controlada.tsx.sample" />
        </Section>

        {/* 6 - Controle Externo */}
        <Section id="exemplo-6" title={SECTION_TITLES[5]!}>
          <div className="space-y-4">
            <SgCheckboxGroup
              id="external-control"
              title="Favorite fruits"
              source={FRUIT_OPTIONS}
              value={externalValue}
              onChange={setExternalValue}
            />
            <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
              <SgButton onClick={() => setExternalValue(["apple"])}>Set Apple</SgButton>
              <SgButton onClick={() => setExternalValue(["banana", "grape"])}>Banana + Grape</SgButton>
              <SgButton onClick={() => setExternalValue(FRUIT_OPTIONS.map((o) => o.value))}>Select All</SgButton>
              <SgButton onClick={() => setExternalValue([])}>Clear</SgButton>
            </SgGrid>
            <p className="text-sm text-[rgb(var(--sg-muted))]">
              Current value: <strong>[{externalValue.join(", ")}]</strong>
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/controle-externo-setvalue-getvalue.tsx.sample" />
        </Section>

        {/* 7 - Com Opcao Desabilitada */}
        <Section id="exemplo-7" title={SECTION_TITLES[6]!}>
          <SgCheckboxGroup
            id="with-disabled-option"
            title="Priority level"
            source={PRIORITY_OPTIONS}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-opcao-desabilitada.tsx.sample" />
        </Section>

        {/* 8 - Grupo Disabled */}
        <Section id="exemplo-8" title={SECTION_TITLES[7]!}>
          <SgCheckboxGroup
            id="disabled-group"
            title="Options desabilitadas"
            source={BASIC_OPTIONS}
            value={["option2"]}
            disabled
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/grupo-disabled.tsx.sample" />
        </Section>

        {/* 9 - Read-only */}
        <Section id="exemplo-9" title={SECTION_TITLES[8]!}>
          <SgCheckboxGroup
            id="readonly"
            title="Current configuration (read-only)"
            source={FRUIT_OPTIONS}
            value={["banana", "grape"]}
            readOnly
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/read-only.tsx.sample" />
        </Section>

        {/* 10 - Obrigatorio com Validacao */}
        <Section id="exemplo-10" title={SECTION_TITLES[9]!}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SgCheckboxGroup
              name="preference"
              title="Contact preference *"
              source={CONTACT_OPTIONS}
              control={control}
              required
            />
            <SgButton type="submit">Submit</SgButton>
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/obrigatorio-com-validacao.tsx.sample" />
        </Section>

        {/* 11 - Horizontal com Icones Coloridos */}
        <Section id="exemplo-11" title={SECTION_TITLES[10]!}>
          <SgCheckboxGroup
            id="horizontal-colored"
            title="Weather conditions"
            source={WEATHER_OPTIONS}
            orientation="horizontal"
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/horizontal-com-icones-coloridos.tsx.sample" />
        </Section>

        {/* 12 - Selection Style Highlight */}
        <Section id="exemplo-12" title={SECTION_TITLES[11]!}>
          <SgCheckboxGroup
            id="highlight-list"
            title="Options"
            source={LIST_HIGHLIGHT_OPTIONS}
            value={selectedHighlightStyle}
            onChange={setSelectedHighlightStyle}
            selectionStyle="highlight"
            className="max-w-xs"
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            Value: <strong>[{selectedHighlightStyle.join(", ")}]</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/selection-style-highlight-lista.tsx.sample" />
        </Section>

        {/* 13 - Com GroupBox Customizado */}
        <Section id="exemplo-13" title={SECTION_TITLES[12]!}>
          <SgCheckboxGroup
            id="custom-groupbox"
            title="Choose with custom style"
            source={OPTIONS_WITH_ICONS}
            groupBoxProps={{
              title: "Preferences",
              className: "border-2 border-[rgb(var(--sg-primary-500))]"
            }}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-groupbox-customizado.tsx.sample" />
        </Section>

        {/* 14 - React Hook Form - Register */}
        <Section id="exemplo-14" title={SECTION_TITLES[13]!}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SgCheckboxGroup
              name="fruits"
              title="Choose your fruits"
              source={FRUIT_OPTIONS}
              register={register}
            />
            <SgButton type="submit">Submit</SgButton>
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/react-hook-form-register.tsx.sample" />
        </Section>

        {/* 15 - Playground */}
        <Section id="exemplo-15" title={SECTION_TITLES[14]!}>
          <SgPlayground
            title="SgCheckboxGroup Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-checkbox-group/sg-checkbox-group.tsx.playground"
            height={650}
            defaultOpen
          />
        </Section>

        {/* 16 - Check All */}
        <Section id="exemplo-16" title={SECTION_TITLES[15]!} description="Checkbox 'Selecionar todos' separado por divider, com estado indeterminate quando parcialmente selecionado">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Sem label customizado (usa i18n)</p>
              <SgCheckboxGroup
                id="check-all"
                title="Select all example"
                source={BASIC_OPTIONS}
                showCheckAll
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Com checkAllLabel e checkAllIcon</p>
              <SgCheckboxGroup
                id="check-all-custom"
                title="With custom label + icon"
                source={BASIC_OPTIONS}
                showCheckAll
                checkAllLabel="Marcar tudo"
                checkAllIcon={<Star className="w-4 h-4 text-yellow-500" />}
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/check-all-showcheckall.tsx.sample" />
        </Section>

        {/* 17 - Checked inicial no source */}
        <Section id="exemplo-17" title={SECTION_TITLES[16]!} description="Estado inicial definido diretamente na prop checked de cada option (modo uncontrolled)">
          <SgCheckboxGroup
            id="source-checked"
            title="Favorite fruits (initial from source)"
            source={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana", checked: true },
              { label: "Orange", value: "orange" },
              { label: "Grape", value: "grape", checked: true }
            ]}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/checked-inicial-no-source.tsx.sample" />
        </Section>

        {/* 18 - Ref imperativo */}
        <Section id="exemplo-18" title={SECTION_TITLES[17]!} description="Acesso imperativo via ref: getChecked, checkAll, clearAll, setChecked">
          <SgCheckboxGroup
            ref={checkboxRef}
            id="ref-example"
            title="Select options"
            source={BASIC_OPTIONS}
            showCheckAll
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => setRefOutput(JSON.stringify(checkboxRef.current?.getChecked()))}>
              getChecked()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.checkAll(); setRefOutput("checkAll()"); }}>
              checkAll()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.clearAll(); setRefOutput("clearAll()"); }}>
              clearAll()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.setChecked(["option2"]); setRefOutput('setChecked(["option2"])'); }}>
              setChecked
            </SgButton>
          </SgGrid>
          {refOutput && (
            <p className="text-sm text-[rgb(var(--sg-muted))]">
              Output: <strong>{refOutput}</strong>
            </p>
          )}
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/ref-imperativo.tsx.sample" />
        </Section>

        {/* Props reference */}
        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">Referencia de Props</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">Prop</th>
                  <th className="pb-2 pr-4 font-semibold">Tipo</th>
                  <th className="pb-2 pr-4 font-semibold">Default</th>
                  <th className="pb-2 font-semibold">DescriÃ§Ã£o</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["id", "string", "-", "ID do elemento raiz"],
                  ["title", "string", "-", "TÃ­tulo exibido no GroupBox"],
                  ["source", "SgCheckboxGroupOption[]", "-", "Lista de opÃ§Ãµes (label, value, checked?, icon?, disabled?)"],
                  ["value", "(string | number)[]", "-", "Valores selecionados (modo controlado)"],
                  ["orientation", '"horizontal" | "vertical"', '"vertical"', "Layout das opÃ§Ãµes"],
                  ["selectionStyle", '"checkbox" | "highlight"', '"checkbox"', "Estilo visual das opÃ§Ãµes"],
                  ["iconOnly", "boolean", "false", "Exibe apenas Ã­cones, sem labels"],
                  ["disabled", "boolean", "false", "Desabilita todo o grupo"],
                  ["readOnly", "boolean", "false", "Permite visualizar sem interagir"],
                  ["required", "boolean", "false", "Campo obrigatÃ³rio (adiciona * ao tÃ­tulo)"],
                  ["onChange", "(value: (string | number)[]) => void", "-", "Callback chamado ao mudar seleÃ§Ã£o"],
                  ["showCheckAll", "boolean", "false", "Exibe checkbox 'Selecionar todos' com estado indeterminate"],
                  ["checkAllLabel", "string", '"Selecionar todos"', "Texto do checkbox de seleÃ§Ã£o total"],
                  ["name", "string", "-", "Nome do campo para RHF"],
                  ["control", "Control", "-", "Control do React Hook Form (modo Controller)"],
                  ["register", "UseFormRegister", "-", "Register do React Hook Form"],
                  ["error", "string", "-", "Mensagem de erro exibida abaixo do componente"],
                  ["className", "string", "-", "Classe CSS adicional do container"],
                  ["style", "React.CSSProperties", "-", "Inline style adicional do container"],
                  ["optionClassName", "string", "-", "Classe CSS adicional de cada opÃ§Ã£o"],
                  ["groupBoxProps", "object", "-", "Props adicionais para o SgGroupBox wrapper"],
                  ["ref", "SgCheckboxGroupRef", "-", "Ref com getChecked, setChecked, checkAll, clearAll"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-2 pr-4 font-mono text-xs">{prop}</td>
                    <td className="py-2 pr-4">{type}</td>
                    <td className="py-2 pr-4">{def}</td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

