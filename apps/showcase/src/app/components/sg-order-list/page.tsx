"use client";

import React from "react";
import {
  SgOrderList,
  type SgOrderListItem,
  type SgOrderListRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Bell, Heart, Landmark, RefreshCw, Star } from "lucide-react";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

type OrderListTexts = {
  subtitle: string;
  sectionTitles: [string, string, string, string, string, string];
  propsReferenceTitle: string;
};

const ORDER_LIST_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", OrderListTexts> = {
  "pt-BR": {
    subtitle: "Lista ordenavel inspirada no PrimeFaces OrderList, com selecao, controles de reordenacao e drag and drop.",
    sectionTitles: [
      "1) Basico (controles internos)",
      "2) Selecao multipla + controles externos (ref)",
      "3) Drag and drop sem botoes",
      "4) Item template customizado e item desabilitado",
      "5) Ordem controlada por estado externo",
      "6) Playground interativo"
    ],
    propsReferenceTitle: "Referencia de Props"
  },
  "pt-PT": {
    subtitle: "Lista ordenavel inspirada no PrimeFaces OrderList, com selecao, controlos de reordenacao e drag and drop.",
    sectionTitles: [
      "1) Basico (controlos internos)",
      "2) Selecao multipla + controlos externos (ref)",
      "3) Drag and drop sem botoes",
      "4) Item template customizado e item desabilitado",
      "5) Ordem controlada por estado externo",
      "6) Playground interativo"
    ],
    propsReferenceTitle: "Referencia de Props"
  },
  "en-US": {
    subtitle: "Sortable list inspired by PrimeFaces OrderList, with selection, reordering controls, and drag and drop.",
    sectionTitles: [
      "1) Basic (built-in controls)",
      "2) Multiple selection + external controls (ref)",
      "3) Drag and drop without buttons",
      "4) Custom item template and disabled item",
      "5) Order controlled by external state",
      "6) Interactive playground"
    ],
    propsReferenceTitle: "Props Reference"
  },
  es: {
    subtitle: "Lista ordenable inspirada en PrimeFaces OrderList, con seleccion, controles de reordenacion y drag and drop.",
    sectionTitles: [
      "1) Basico (controles internos)",
      "2) Seleccion multiple + controles externos (ref)",
      "3) Drag and drop sin botones",
      "4) Item template personalizado e item deshabilitado",
      "5) Orden controlada por estado externo",
      "6) Playground interactivo"
    ],
    propsReferenceTitle: "Referencia de Props"
  }
};

type PropDescriptionKey =
  | "id"
  | "title"
  | "source"
  | "value"
  | "onChange"
  | "selectedValues"
  | "onSelectionChange"
  | "selectionMode"
  | "showControls"
  | "controlsPosition"
  | "draggable"
  | "disabled"
  | "readOnly"
  | "emptyMessage"
  | "itemTemplate"
  | "className"
  | "style"
  | "listClassName"
  | "itemClassName"
  | "groupBoxProps"
  | "ref";

type PropField = {
  prop: string;
  type: string;
  defaultValue: string;
  descriptionKey: PropDescriptionKey;
};

const ORDER_LIST_PROP_FIELDS: PropField[] = [
  { prop: "id", type: "string", defaultValue: "-", descriptionKey: "id" },
  { prop: "title", type: "string", defaultValue: "-", descriptionKey: "title" },
  { prop: "source", type: "SgOrderListItem[]", defaultValue: "-", descriptionKey: "source" },
  { prop: "value", type: "SgOrderListItem[]", defaultValue: "-", descriptionKey: "value" },
  { prop: "onChange", type: "(items) => void", defaultValue: "-", descriptionKey: "onChange" },
  { prop: "selectedValues", type: "(string | number)[]", defaultValue: "-", descriptionKey: "selectedValues" },
  { prop: "onSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onSelectionChange" },
  { prop: "selectionMode", type: "\"single\" | \"multiple\"", defaultValue: "\"multiple\"", descriptionKey: "selectionMode" },
  { prop: "showControls", type: "boolean", defaultValue: "true", descriptionKey: "showControls" },
  { prop: "controlsPosition", type: "\"left\" | \"right\"", defaultValue: "\"left\"", descriptionKey: "controlsPosition" },
  { prop: "draggable", type: "boolean", defaultValue: "true", descriptionKey: "draggable" },
  { prop: "disabled", type: "boolean", defaultValue: "false", descriptionKey: "disabled" },
  { prop: "readOnly", type: "boolean", defaultValue: "false", descriptionKey: "readOnly" },
  { prop: "emptyMessage", type: "string", defaultValue: "i18n", descriptionKey: "emptyMessage" },
  { prop: "itemTemplate", type: "(item, state) => ReactNode", defaultValue: "-", descriptionKey: "itemTemplate" },
  { prop: "className", type: "string", defaultValue: "-", descriptionKey: "className" },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", descriptionKey: "style" },
  { prop: "listClassName", type: "string", defaultValue: "-", descriptionKey: "listClassName" },
  { prop: "itemClassName", type: "string", defaultValue: "-", descriptionKey: "itemClassName" },
  { prop: "groupBoxProps", type: "Partial<SgGroupBoxProps>", defaultValue: "-", descriptionKey: "groupBoxProps" },
  { prop: "ref", type: "SgOrderListRef", defaultValue: "-", descriptionKey: "ref" }
];

const ORDER_LIST_PROP_DESCRIPTIONS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", Record<PropDescriptionKey, string>> = {
  "pt-BR": {
    id: "Identificador do listbox interno.",
    title: "Titulo exibido no GroupBox do componente.",
    source: "Lista base de itens para modo nao controlado.",
    value: "Lista ordenada em modo controlado.",
    onChange: "Callback chamado apos qualquer reordenacao.",
    selectedValues: "Selecao controlada dos itens.",
    onSelectionChange: "Callback da mudanca de selecao.",
    selectionMode: "Define se permite selecionar um ou varios itens.",
    showControls: "Mostra a coluna com botoes Top, Up, Down e Bottom.",
    controlsPosition: "Posicao da coluna de controles.",
    draggable: "Ativa reordenacao por drag and drop.",
    disabled: "Desabilita interacao do componente inteiro.",
    readOnly: "Permite visualizacao sem alterar ordem/selecao.",
    emptyMessage: "Texto exibido quando a lista estiver vazia.",
    itemTemplate: "Template customizado para renderizar cada item.",
    className: "Classe CSS adicional do container raiz.",
    style: "Estilo inline do container raiz.",
    listClassName: "Classe CSS extra para o listbox.",
    itemClassName: "Classe CSS extra para cada item.",
    groupBoxProps: "Props extras repassadas para o SgGroupBox.",
    ref: "Ref imperativo com moveTop/moveUp/moveDown/moveBottom e APIs de selecao."
  },
  "pt-PT": {
    id: "Identificador do listbox interno.",
    title: "Titulo exibido no GroupBox do componente.",
    source: "Lista base de itens para modo nao controlado.",
    value: "Lista ordenada em modo controlado.",
    onChange: "Callback chamado apos qualquer reordenacao.",
    selectedValues: "Selecao controlada dos itens.",
    onSelectionChange: "Callback da mudanca de selecao.",
    selectionMode: "Define se permite selecionar um ou varios itens.",
    showControls: "Mostra a coluna com botoes Top, Up, Down e Bottom.",
    controlsPosition: "Posicao da coluna de controlos.",
    draggable: "Ativa reordenacao por drag and drop.",
    disabled: "Desabilita interacao do componente inteiro.",
    readOnly: "Permite visualizacao sem alterar ordem/selecao.",
    emptyMessage: "Texto exibido quando a lista estiver vazia.",
    itemTemplate: "Template customizado para renderizar cada item.",
    className: "Classe CSS adicional do container raiz.",
    style: "Estilo inline do container raiz.",
    listClassName: "Classe CSS extra para o listbox.",
    itemClassName: "Classe CSS extra para cada item.",
    groupBoxProps: "Props extras repassadas para o SgGroupBox.",
    ref: "Ref imperativo com moveTop/moveUp/moveDown/moveBottom e APIs de selecao."
  },
  "en-US": {
    id: "Internal listbox identifier.",
    title: "Title shown in the component GroupBox.",
    source: "Base list used in uncontrolled mode.",
    value: "Ordered list in controlled mode.",
    onChange: "Callback fired after any reordering action.",
    selectedValues: "Controlled selected item values.",
    onSelectionChange: "Selection change callback.",
    selectionMode: "Defines if one or multiple items can be selected.",
    showControls: "Shows the Top, Up, Down and Bottom control column.",
    controlsPosition: "Position of the controls column.",
    draggable: "Enables drag-and-drop reordering.",
    disabled: "Disables interaction for the whole component.",
    readOnly: "Allows visualization without changing order/selection.",
    emptyMessage: "Text shown when the list is empty.",
    itemTemplate: "Custom template to render each item.",
    className: "Additional CSS class for the root container.",
    style: "Inline style for the root container.",
    listClassName: "Additional CSS class for the listbox.",
    itemClassName: "Additional CSS class for each item.",
    groupBoxProps: "Additional props forwarded to SgGroupBox.",
    ref: "Imperative ref with moveTop/moveUp/moveDown/moveBottom and selection APIs."
  },
  es: {
    id: "Identificador interno del listbox.",
    title: "Titulo mostrado en el GroupBox del componente.",
    source: "Lista base para modo no controlado.",
    value: "Lista ordenada en modo controlado.",
    onChange: "Callback disparado despues de cualquier reordenacion.",
    selectedValues: "Seleccion controlada de los items.",
    onSelectionChange: "Callback del cambio de seleccion.",
    selectionMode: "Define si permite seleccionar uno o varios items.",
    showControls: "Muestra la columna con botones Top, Up, Down y Bottom.",
    controlsPosition: "Posicion de la columna de controles.",
    draggable: "Activa reordenacion por drag and drop.",
    disabled: "Deshabilita la interaccion del componente completo.",
    readOnly: "Permite visualizacion sin cambiar orden/seleccion.",
    emptyMessage: "Texto mostrado cuando la lista esta vacia.",
    itemTemplate: "Template personalizado para renderizar cada item.",
    className: "Clase CSS adicional del contenedor raiz.",
    style: "Estilo inline del contenedor raiz.",
    listClassName: "Clase CSS extra para el listbox.",
    itemClassName: "Clase CSS extra para cada item.",
    groupBoxProps: "Props adicionales reenviadas a SgGroupBox.",
    ref: "Ref imperativo con moveTop/moveUp/moveDown/moveBottom y APIs de seleccion."
  }
};

function isSupportedOrderListLocale(locale: ShowcaseLocale): locale is keyof typeof ORDER_LIST_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

const PRODUCT_ITEMS: SgOrderListItem[] = [
  { label: "Notebook", value: "notebook", icon: <Landmark className="h-4 w-4" /> },
  { label: "Mouse", value: "mouse", icon: <RefreshCw className="h-4 w-4" /> },
  { label: "Teclado", value: "keyboard", icon: <Bell className="h-4 w-4" /> },
  { label: "Monitor", value: "monitor", icon: <Star className="h-4 w-4" /> },
  { label: "Webcam", value: "webcam", icon: <Heart className="h-4 w-4" /> }
];

const PIPELINE_STEPS: SgOrderListItem[] = [
  { label: "Prospeccao", value: "lead" },
  { label: "Qualificacao", value: "qualify" },
  { label: "Proposta", value: "proposal" },
  { label: "Negociacao", value: "negotiation" },
  { label: "Fechamento", value: "close" }
];

const TEAM_ITEMS: SgOrderListItem[] = [
  { label: "Ana - Produto", value: "ana" },
  { label: "Bruno - Design", value: "bruno" },
  { label: "Carla - Frontend", value: "carla" },
  { label: "Diego - Backend", value: "diego" },
  { label: "Elaine - QA", value: "elaine" }
];

const BACKLOG_ITEMS: SgOrderListItem[] = [
  { label: "Implementar filtros", value: "filtros", data: { effort: "M", priority: "Alta" } },
  { label: "Ajustar layout mobile", value: "mobile", data: { effort: "S", priority: "Media" } },
  { label: "Refatorar API de pedidos", value: "api", data: { effort: "L", priority: "Alta" } },
  { label: "Atualizar testes E2E", value: "e2e", data: { effort: "M", priority: "Baixa" }, disabled: true }
];

const ORDER_LIST_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgOrderListFromLib = (SeedGrid as Record<string, unknown>).SgOrderList as
  | React.ComponentType<any>
  | undefined;

const ITEMS = [
  { label: "Planejamento", value: "plan" },
  { label: "Design", value: "design" },
  { label: "Implementacao", value: "build" },
  { label: "Testes", value: "test" },
  { label: "Publicacao", value: "release" }
];

export default function App() {
  const hasComponent = typeof SgOrderListFromLib === "function";
  const [value, setValue] = React.useState(ITEMS);
  const [showControls, setShowControls] = React.useState(true);
  const [selectionMode, setSelectionMode] = React.useState<"single" | "multiple">("multiple");

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgOrderList is not available in the published Sandpack version. Showing fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={showControls}
            onChange={(event) => setShowControls(event.target.checked)}
          />
          showControls
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">selectionMode</span>
          <select
            value={selectionMode}
            onChange={(event) => setSelectionMode(event.target.value as "single" | "multiple")}
            className="w-full rounded border border-border px-2 py-1"
          >
            <option value="single">single</option>
            <option value="multiple">multiple</option>
          </select>
        </label>
      </div>

      <div className="rounded border border-border p-4">
        {hasComponent ? (
          <SgOrderListFromLib
            id="orderlist-playground"
            title="Pipeline"
            source={ITEMS}
            value={value}
            onChange={setValue}
            showControls={showControls}
            selectionMode={selectionMode}
          />
        ) : (
          <ol className="list-inside list-decimal space-y-1 text-sm">
            {value.map((item: { value: string; label: string }) => (
              <li key={item.value}>{item.label}</li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        order: {value.map((item) => item.label).join(" > ")}
      </div>
    </div>
  );
}
`;

export default function SgOrderListShowcase() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof ORDER_LIST_TEXTS = isSupportedOrderListLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = ORDER_LIST_TEXTS[locale];
  const propDescriptions = ORDER_LIST_PROP_DESCRIPTIONS[locale];
  const orderListProps = React.useMemo<ShowcasePropRow[]>(
    () =>
      ORDER_LIST_PROP_FIELDS.map((field) => ({
        prop: field.prop,
        type: field.type,
        defaultValue: field.defaultValue,
        description: propDescriptions[field.descriptionKey]
      })),
    [propDescriptions]
  );

  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const [basicItems, setBasicItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);
  const [pipelineItems, setPipelineItems] = React.useState<SgOrderListItem[]>(PIPELINE_STEPS);
  const [teamItems, setTeamItems] = React.useState<SgOrderListItem[]>(TEAM_ITEMS);
  const [backlogItems, setBacklogItems] = React.useState<SgOrderListItem[]>(BACKLOG_ITEMS);
  const [controlledItems, setControlledItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);

  const pipelineRef = React.useRef<SgOrderListRef>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgOrderList"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0]}>
          <SgOrderList
            id="order-basic"
            title="Produtos"
            source={PRODUCT_ITEMS}
            value={basicItems}
            onChange={setBasicItems}
          />
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            Ordem atual: <strong>{basicItems.map((item) => item.label).join(" > ")}</strong>
          </p>
          <CodeBlock
            code={`const PRODUCT_ITEMS = [
  { label: "Notebook", value: "notebook", icon: <Landmark className="h-4 w-4" /> },
  { label: "Mouse", value: "mouse", icon: <RefreshCw className="h-4 w-4" /> },
  { label: "Teclado", value: "keyboard", icon: <Bell className="h-4 w-4" /> },
  { label: "Monitor", value: "monitor", icon: <Star className="h-4 w-4" /> },
  { label: "Webcam", value: "webcam", icon: <Heart className="h-4 w-4" /> }
];

const [basicItems, setBasicItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);

<SgOrderList
  id="order-basic"
  title="Produtos"
  source={PRODUCT_ITEMS}
  value={basicItems}
  onChange={setBasicItems}
/>

<p className="text-sm text-[rgb(var(--sg-muted))]">
  Ordem atual: <strong>{basicItems.map((item) => item.label).join(" > ")}</strong>
</p>`}
          />
        </Section>

        <Section title={texts.sectionTitles[1]}>
          <SgOrderList
            ref={pipelineRef}
            id="order-ref"
            title="Etapas do pipeline"
            source={PIPELINE_STEPS}
            value={pipelineItems}
            onChange={setPipelineItems}
            selectionMode="multiple"
            showControls={false}
          />
          <SgGrid columns={{ base: 2, md: 5 }} gap={8}>
            <SgButton onClick={() => pipelineRef.current?.moveTop()}>Move Top</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveUp()}>Move Up</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveDown()}>Move Down</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveBottom()}>Move Bottom</SgButton>
            <SgButton onClick={() => pipelineRef.current?.clearSelection()}>Clear Selection</SgButton>
          </SgGrid>
          <CodeBlock
            code={`const PIPELINE_STEPS = [
  { label: "Prospeccao", value: "lead" },
  { label: "Qualificacao", value: "qualify" },
  { label: "Proposta", value: "proposal" },
  { label: "Negociacao", value: "negotiation" },
  { label: "Fechamento", value: "close" }
];

const [pipelineItems, setPipelineItems] = React.useState<SgOrderListItem[]>(PIPELINE_STEPS);
const pipelineRef = React.useRef<SgOrderListRef>(null);

<SgOrderList
  ref={pipelineRef}
  id="order-ref"
  title="Etapas do pipeline"
  source={PIPELINE_STEPS}
  value={pipelineItems}
  onChange={setPipelineItems}
  selectionMode="multiple"
  showControls={false}
/>

<SgGrid columns={{ base: 2, md: 5 }} gap={8}>
  <SgButton onClick={() => pipelineRef.current?.moveTop()}>Move Top</SgButton>
  <SgButton onClick={() => pipelineRef.current?.moveUp()}>Move Up</SgButton>
  <SgButton onClick={() => pipelineRef.current?.moveDown()}>Move Down</SgButton>
  <SgButton onClick={() => pipelineRef.current?.moveBottom()}>Move Bottom</SgButton>
  <SgButton onClick={() => pipelineRef.current?.clearSelection()}>Clear Selection</SgButton>
</SgGrid>`}
          />
        </Section>

        <Section title={texts.sectionTitles[2]}>
          <SgOrderList
            id="order-drag"
            title="Time de atendimento"
            source={TEAM_ITEMS}
            value={teamItems}
            onChange={setTeamItems}
            showControls={false}
            draggable
          />
          <p className="text-xs text-muted-foreground">
            Dica: arraste os itens para reordenar, sem usar os botoes.
          </p>
          <CodeBlock
            code={`const TEAM_ITEMS = [
  { label: "Ana - Produto", value: "ana" },
  { label: "Bruno - Design", value: "bruno" },
  { label: "Carla - Frontend", value: "carla" },
  { label: "Diego - Backend", value: "diego" },
  { label: "Elaine - QA", value: "elaine" }
];

const [teamItems, setTeamItems] = React.useState<SgOrderListItem[]>(TEAM_ITEMS);

<SgOrderList
  id="order-drag"
  title="Time de atendimento"
  source={TEAM_ITEMS}
  value={teamItems}
  onChange={setTeamItems}
  showControls={false}
  draggable
/>

<p className="text-xs text-muted-foreground">
  Dica: arraste os itens para reordenar, sem usar os botoes.
</p>`}
          />
        </Section>

        <Section title={texts.sectionTitles[3]}>
          <SgOrderList
            id="order-template"
            title="Backlog da sprint"
            source={BACKLOG_ITEMS}
            value={backlogItems}
            onChange={setBacklogItems}
            controlsPosition="right"
            itemTemplate={(item) => {
              const meta = item.data as { effort: string; priority: string } | undefined;
              return (
                <SgGrid columns={{ base: 1, sm: 2 }} gap={8} className="w-full">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-[rgb(var(--sg-muted))]">
                    {"Prioridade: " + (meta?.priority ?? "-") + " | Esforco: " + (meta?.effort ?? "-")}
                  </span>
                </SgGrid>
              );
            }}
          />
          <CodeBlock
            code={`const BACKLOG_ITEMS = [
  { label: "Implementar filtros", value: "filtros", data: { effort: "M", priority: "Alta" } },
  { label: "Ajustar layout mobile", value: "mobile", data: { effort: "S", priority: "Media" } },
  { label: "Refatorar API de pedidos", value: "api", data: { effort: "L", priority: "Alta" } },
  { label: "Atualizar testes E2E", value: "e2e", data: { effort: "M", priority: "Baixa" }, disabled: true }
];

const [backlogItems, setBacklogItems] = React.useState<SgOrderListItem[]>(BACKLOG_ITEMS);

<SgOrderList
  id="order-template"
  title="Backlog da sprint"
  source={BACKLOG_ITEMS}
  value={backlogItems}
  onChange={setBacklogItems}
  controlsPosition="right"
  itemTemplate={(item) => {
    const meta = item.data as { effort: string; priority: string } | undefined;
    return (
      <SgGrid columns={{ base: 1, sm: 2 }} gap={8} className="w-full">
        <span className="font-medium">{item.label}</span>
        <span className="text-xs text-[rgb(var(--sg-muted))]">
          {"Prioridade: " + (meta?.priority ?? "-") + " | Esforco: " + (meta?.effort ?? "-")}
        </span>
      </SgGrid>
    );
  }}
/>`}
          />
        </Section>

        <Section title={texts.sectionTitles[4]}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
            <SgButton onClick={() => setControlledItems(PRODUCT_ITEMS)}>Reset</SgButton>
            <SgButton onClick={() => setControlledItems((prev) => [...prev].reverse())}>Reverse</SgButton>
            <SgButton onClick={() => setControlledItems((prev) => [...prev].sort((a, b) => a.label.localeCompare(b.label)))}>
              Sort A-Z
            </SgButton>
          </SgGrid>
          <SgOrderList
            id="order-controlled"
            title="Produtos (controlado)"
            source={PRODUCT_ITEMS}
            value={controlledItems}
            onChange={setControlledItems}
          />
          <CodeBlock
            code={`const [controlledItems, setControlledItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);

<SgGrid columns={{ base: 1, md: 3 }} gap={8}>
  <SgButton onClick={() => setControlledItems(PRODUCT_ITEMS)}>Reset</SgButton>
  <SgButton onClick={() => setControlledItems((prev) => [...prev].reverse())}>Reverse</SgButton>
  <SgButton onClick={() => setControlledItems((prev) => [...prev].sort((a, b) => a.label.localeCompare(b.label)))}>
    Sort A-Z
  </SgButton>
</SgGrid>

<SgOrderList
  id="order-controlled"
  title="Produtos (controlado)"
  source={PRODUCT_ITEMS}
  value={controlledItems}
  onChange={setControlledItems}
/>`}
          />
        </Section>

        <Section title={texts.sectionTitles[5]}>
          <SgPlayground
            title="SgOrderList Playground"
            interactive
            codeContract="appFile"
            code={ORDER_LIST_PLAYGROUND_APP_FILE}
            height={650}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={orderListProps} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
