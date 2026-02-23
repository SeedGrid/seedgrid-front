"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  SgRadioGroup,
  type SgRadioGroupOption,
  SgButton,
  SgGrid,
  SgPlayground
} from "@seedgrid/fe-components";
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
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

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
  return <CodeBlockBase code={props.children} />;
}

function PropsTable(props: { id: string; props: PropDef[] }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">Prop</th>
              <th className="pb-2 pr-4 font-semibold">Tipo</th>
              <th className="pb-2 pr-4 font-semibold">Padrão</th>
              <th className="pb-2 font-semibold">Descrição</th>
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

const RADIO_GROUP_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import { Heart, Star, ThumbsUp } from "lucide-react";

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
  showCancel: boolean;
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
      {props.showCancel ? (
        <button
          type="button"
          disabled={props.disabled || props.readOnly}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          onClick={() => props.onChange(null)}
        >
          Limpar
        </button>
      ) : null}
    </div>
  );
}

export default function App() {
  const hasComponent = typeof SgRadioGroupFromLib === "function";
  const [title, setTitle] = React.useState("Escolha uma opcao");
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [iconOnly, setIconOnly] = React.useState(false);
  const [showCancel, setShowCancel] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState<string | null>("favorite");

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgRadioGroup nao esta na versao publicada do Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Titulo</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientacao</span>
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as "vertical" | "horizontal")}
            className="w-full rounded border border-slate-300 px-2 py-1"
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
          <input type="checkbox" checked={showCancel} onChange={(event) => setShowCancel(event.target.checked)} />
          showCancel
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
            showCancel={showCancel}
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
            showCancel={showCancel}
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
  { label: "Opção 1", value: "option1" },
  { label: "Opção 2", value: "option2" },
  { label: "Opção 3", value: "option3" }
];

const FRUIT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Maçã", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Laranja", value: "orange" },
  { label: "Uva", value: "grape" }
];

const OPTIONS_WITH_ICONS: SgRadioGroupOption[] = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

const SHAPE_OPTIONS: SgRadioGroupOption[] = [
  { label: "Círculo", value: "circle", icon: <Circle className="w-5 h-5" /> },
  { label: "Quadrado", value: "square", icon: <Square className="w-5 h-5" /> },
  { label: "Triângulo", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
];

const WEATHER_OPTIONS: SgRadioGroupOption[] = [
  { label: "Sol", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  { label: "Lua", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
  { label: "Nuvem", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
];

const LIST_HIGHLIGHT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Reserve", value: "reserve", icon: <Landmark className="w-4 h-4 text-indigo-600" /> },
  { label: "Alert", value: "alert", icon: <Bell className="w-4 h-4 text-rose-600" /> },
  { label: "Refresh", value: "refresh", icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> }
];

const CONTACT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Email", value: "email", icon: <Mail className="w-4 h-4" /> },
  { label: "Telefone", value: "phone", icon: <Phone className="w-4 h-4" /> },
  { label: "Presencial", value: "in-person", icon: <Home className="w-4 h-4" /> }
];

const PRIORITY_OPTIONS: SgRadioGroupOption[] = [
  { label: "Baixa", value: "low" },
  { label: "Média", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Urgente", value: "urgent", disabled: true }
];

const EXAMPLE_LINKS = [
  { id: "exemplo-1", label: "1) Básico" },
  { id: "exemplo-2", label: "2) Orientação Horizontal" },
  { id: "exemplo-3", label: "3) Com Ícones" },
  { id: "exemplo-4", label: "4) Apenas Ícones (Icon Only)" },
  { id: "exemplo-5", label: "5) Com Opção de Cancelar" },
  { id: "exemplo-6", label: "6) Controle Externo (setValue/getValue)" },
  { id: "exemplo-7", label: "7) Com Opção Desabilitada" },
  { id: "exemplo-8", label: "8) Grupo Desabilitado" },
  { id: "exemplo-9", label: "9) Somente Leitura" },
  { id: "exemplo-10", label: "10) Obrigatório com Validação" },
  { id: "exemplo-11", label: "11) Horizontal com Ícones Coloridos" },
  { id: "exemplo-12", label: "12) Selection Style Highlight (Lista)" },
  { id: "exemplo-13", label: "13) Com GroupBox Customizado" },
  { id: "exemplo-14", label: "14) React Hook Form - Register" },
  { id: "exemplo-15", label: "15) Playground Interativo" }
];

export default function SgRadioGroupShowcase() {
  const [selectedBasic, setSelectedBasic] = React.useState<string | number | null>("option1");
  const [selectedFruit, setSelectedFruit] = React.useState<string | number | null>(null);
  const [selectedWithCancel, setSelectedWithCancel] = React.useState<string | number | null>("option2");
  const [externalValue, setExternalValue] = React.useState<string | number | null>("banana");
  const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<string | number | null>("reserve");

  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(`Dados do formulário: ${JSON.stringify(data, null, 2)}`);
  };

  const propDefs: PropDef[] = [
    {
      name: "id",
      type: "string",
      description: "ID único para o grupo de radio buttons"
    },
    {
      name: "title",
      type: "string",
      description: "Título exibido acima do grupo"
    },
    {
      name: "source",
      type: "SgRadioGroupOption[]",
      description: "Array de opções. Cada opção deve ter label, value, e opcionalmente icon e disabled"
    },
    {
      name: "value",
      type: "string | number",
      description: "Valor selecionado (para controle externo)"
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"vertical"',
      description: "Orientação do layout das opções"
    },
    {
      name: "selectionStyle",
      type: '"radio" | "highlight"',
      defaultValue: '"radio"',
      description: "Define o estilo visual da seleção (radio padrão ou destaque em linha)"
    },
    {
      name: "iconOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Exibe apenas os ícones, sem os labels"
    },
    {
      name: "showCancel",
      type: "boolean",
      defaultValue: "false",
      description: "Mostra opção para cancelar/limpar seleção"
    },
    {
      name: "cancelLabel",
      type: "string",
      description: "Label customizado para a opção de cancelar"
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Desabilita todo o grupo"
    },
    {
      name: "readOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Torna o grupo apenas leitura"
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: "Marca o campo como obrigatório (com validação)"
    },
    {
      name: "onChange",
      type: "(value: string | number | null) => void",
      description: "Callback quando o valor muda"
    },
    {
      name: "name",
      type: "string",
      description: "Nome do campo (para React Hook Form)"
    },
    {
      name: "control",
      type: "Control",
      description: "Controle do React Hook Form"
    },
    {
      name: "register",
      type: "UseFormRegister",
      description: "Função register do React Hook Form"
    },
    {
      name: "error",
      type: "string",
      description: "Mensagem de erro para exibir"
    },
    {
      name: "className",
      type: "string",
      description: "Classes CSS adicionais para o container"
    },
    {
      name: "optionClassName",
      type: "string",
      description: "Classes CSS adicionais para cada opção"
    },
    {
      name: "groupBoxProps",
      type: "object",
      description: "Props adicionais para o SgGroupBox interno"
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
        <div ref={stickyHeaderRef} className="sticky -top-8 z-50 isolate bg-background pb-2 pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgRadioGroup</h1>
            <p className="mt-2 text-muted-foreground">
              Grupo de radio buttons com orientação horizontal/vertical, ícones, opção de limpar e integração com
              React Hook Form.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {EXAMPLE_LINKS.map((example) => (
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

      <Section id="exemplo-1" title="1) Básico">
        <SgRadioGroup
          id="basic"
          title="Escolha uma opção"
          source={BASIC_OPTIONS}
          value={selectedBasic ?? undefined}
          onChange={setSelectedBasic}
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor selecionado: <strong>{selectedBasic}</strong>
        </p>
        <CodeBlock>
          {`const [selectedBasic, setSelectedBasic] = React.useState<string | number | null>("option1");

<SgRadioGroup
  id="basic"
  title="Escolha uma opção"
  source={BASIC_OPTIONS}
  value={selectedBasic ?? undefined}
  onChange={setSelectedBasic}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-2" title="2) Orientação Horizontal">
        <SgRadioGroup
          id="horizontal"
          title="Selecione uma fruta"
          source={FRUIT_OPTIONS}
          orientation="horizontal"
          value={selectedFruit ?? undefined}
          onChange={setSelectedFruit}
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="horizontal"
  title="Selecione uma fruta"
  source={FRUIT_OPTIONS}
  orientation="horizontal"
  value={selectedFruit ?? undefined}
  onChange={setSelectedFruit}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-3" title="3) Com Ícones">
        <SgRadioGroup
          id="with-icons"
          title="Escolha uma ação"
          source={OPTIONS_WITH_ICONS}
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="with-icons"
  title="Escolha uma ação"
  source={OPTIONS_WITH_ICONS}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-4" title="4) Apenas Ícones (Icon Only)">
        <SgRadioGroup
          id="icon-only"
          title="Escolha uma forma"
          source={SHAPE_OPTIONS}
          iconOnly
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="icon-only"
  title="Escolha uma forma"
  source={SHAPE_OPTIONS}
  iconOnly
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-5" title="5) Com Opção de Cancelar">
        <SgRadioGroup
          id="with-cancel"
          title="Selecione (com opção de cancelar)"
          source={BASIC_OPTIONS}
          value={selectedWithCancel ?? undefined}
          onChange={setSelectedWithCancel}
          showCancel
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor: {selectedWithCancel === null ? "Nenhum" : selectedWithCancel}
        </p>
        <CodeBlock>
          {`<SgRadioGroup
  id="with-cancel"
  title="Selecione (com opção de cancelar)"
  source={BASIC_OPTIONS}
  value={selectedWithCancel ?? undefined}
  onChange={setSelectedWithCancel}
  showCancel
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-6" title="6) Controle Externo (setValue/getValue)">
        <div className="space-y-4">
          <SgRadioGroup
            id="external-control"
            title="Fruta favorita"
            source={FRUIT_OPTIONS}
            value={externalValue ?? undefined}
            onChange={setExternalValue}
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => setExternalValue("apple")}>
              Definir Maçã
            </SgButton>
            <SgButton onClick={() => setExternalValue("banana")}>
              Definir Banana
            </SgButton>
            <SgButton onClick={() => setExternalValue("orange")}>
              Definir Laranja
            </SgButton>
            <SgButton onClick={() => setExternalValue(null)}>
              Limpar
            </SgButton>
          </SgGrid>
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            Valor atual: <strong>{externalValue || "Nenhum"}</strong>
          </p>
        </div>
        <CodeBlock>
          {`const [externalValue, setExternalValue] = React.useState<string | number | null>("banana");

<SgRadioGroup
  id="external-control"
  title="Fruta favorita"
  source={FRUIT_OPTIONS}
  value={externalValue ?? undefined}
  onChange={setExternalValue}
/>

<SgButton onClick={() => setExternalValue("apple")}>
  Definir Maçã
</SgButton>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-7" title="7) Com Opção Desabilitada">
        <SgRadioGroup
          id="with-disabled-option"
          title="Nível de prioridade"
          source={PRIORITY_OPTIONS}
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="with-disabled-option"
  title="Nível de prioridade"
  source={PRIORITY_OPTIONS}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-8" title="8) Grupo Desabilitado">
        <SgRadioGroup
          id="disabled-group"
          title="Opções desabilitadas"
          source={BASIC_OPTIONS}
          value="option2"
          disabled
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="disabled-group"
  title="Opções desabilitadas"
  source={BASIC_OPTIONS}
  value="option2"
  disabled
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-9" title="9) Somente Leitura">
        <SgRadioGroup
          id="readonly"
          title="Configuração atual (somente leitura)"
          source={FRUIT_OPTIONS}
          value="banana"
          readOnly
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="readonly"
  title="Configuração atual (somente leitura)"
  source={FRUIT_OPTIONS}
  value="banana"
  readOnly
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-10" title="10) Obrigatório com Validação">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="preference"
            title="Preferência de contato *"
            source={CONTACT_OPTIONS}
            control={control}
            required
          />
          <SgButton type="submit">Enviar</SgButton>
        </form>
        <CodeBlock>
          {`const { control, handleSubmit } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <SgRadioGroup
    name="preference"
    title="Preferência de contato *"
    source={CONTACT_OPTIONS}
    control={control}
    required
  />
  <SgButton type="submit">Enviar</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-11" title="11) Horizontal com Ícones Coloridos">
        <SgRadioGroup
          id="horizontal-colored"
          title="Condição do tempo"
          source={WEATHER_OPTIONS}
          orientation="horizontal"
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="horizontal-colored"
  title="Condição do tempo"
  source={WEATHER_OPTIONS}
  orientation="horizontal"
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-12" title="12) Selection Style Highlight (Lista)">
        <SgRadioGroup
          id="highlight-list"
          title="Opções"
          source={LIST_HIGHLIGHT_OPTIONS}
          value={selectedHighlightStyle ?? undefined}
          onChange={setSelectedHighlightStyle}
          selectionStyle="highlight"
          className="max-w-xs"
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor: <strong>{selectedHighlightStyle ?? "Nenhum"}</strong>
        </p>
        <CodeBlock>
          {`const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<string | number | null>("reserve");

<SgRadioGroup
  id="highlight-list"
  title="Opções"
  source={LIST_HIGHLIGHT_OPTIONS}
  value={selectedHighlightStyle ?? undefined}
  onChange={setSelectedHighlightStyle}
  selectionStyle="highlight"
  className="max-w-xs"
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-13" title="13) Com GroupBox Customizado">
        <SgRadioGroup
          id="custom-groupbox"
          title="Escolha com estilo customizado"
          source={OPTIONS_WITH_ICONS}
          groupBoxProps={{
            title: "Preferências",
            className: "border-2 border-[rgb(var(--sg-primary-500))]"
          }}
        />
        <CodeBlock>
          {`<SgRadioGroup
  id="custom-groupbox"
  title="Escolha com estilo customizado"
  source={OPTIONS_WITH_ICONS}
  groupBoxProps={{
    title: "Preferências",
    className: "border-2 border-[rgb(var(--sg-primary-500))]"
  }}
/>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-14" title="14) React Hook Form - Register">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="fruit"
            title="Escolha sua fruta"
            source={FRUIT_OPTIONS}
            register={register}
          />
          <SgButton type="submit">Enviar</SgButton>
        </form>
        <CodeBlock>
          {`const { register, handleSubmit } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <SgRadioGroup
    name="fruit"
    title="Escolha sua fruta"
    source={FRUIT_OPTIONS}
    register={register}
  />
  <SgButton type="submit">Enviar</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section id="exemplo-15" title="15) Playground Interativo">
        <SgPlayground
          title="SgRadioGroup Playground"
          interactive
          codeContract="appFile"
          code={RADIO_GROUP_PLAYGROUND_APP_FILE}
          height={650}
          defaultOpen
        />
      </Section>
      <PropsTable id="props-reference" props={propDefs} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

