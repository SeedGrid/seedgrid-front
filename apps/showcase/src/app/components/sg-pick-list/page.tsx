"use client";

import React from "react";
import {
  SgPickList,
  type SgPickListItem,
  type SgPickListRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Bell, Landmark, RefreshCw, Star } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

type PickListTexts = {
  subtitle: string;
  sectionTitles: [string, string, string, string, string, string, string];
  propsTitle: string;
  currentStateLabel: string;
  transferOnlyHint: string;
  dragHint: string;
};

const PICK_LIST_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", PickListTexts> = {
  "pt-BR": {
    subtitle: "PickList inspirado no PrimeFaces, com transferencia de itens entre listas, filtros e reordenacao.",
    sectionTitles: [
      "1) Basico",
      "2) Com Filtros",
      "3) Somente transferencia (sem ordenacao)",
      "4) Reordenacao com controles de lista",
      "5) Controles externos por ref",
      "6) Item template customizado",
      "7) Playground interativo"
    ],
    propsTitle: "Referencia de Props",
    currentStateLabel: "Estado atual",
    transferOnlyHint: "Exemplo para cenarios em que voce so precisa mover itens entre listas.",
    dragHint: "Dica: arraste itens entre listas ou dentro da mesma lista para reordenar."
  },
  "pt-PT": {
    subtitle: "PickList inspirado no PrimeFaces, com transferencia de itens entre listas, filtros e reordenacao.",
    sectionTitles: [
      "1) Basico",
      "2) Com Filtros",
      "3) Apenas transferencia (sem reordenacao)",
      "4) Reordenacao com controlos de lista",
      "5) Controlos externos por ref",
      "6) Item template customizado",
      "7) Playground interativo"
    ],
    propsTitle: "Referencia de Props",
    currentStateLabel: "Estado atual",
    transferOnlyHint: "Exemplo para cenarios em que so precisa mover itens entre listas.",
    dragHint: "Dica: arraste itens entre listas ou dentro da mesma lista para reordenar."
  },
  "en-US": {
    subtitle: "PrimeFaces-inspired PickList with item transfer between lists, filtering, and reordering.",
    sectionTitles: [
      "1) Basic",
      "2) With Filters",
      "3) Transfer only (no reordering)",
      "4) Reordering with list controls",
      "5) External controls through ref",
      "6) Custom item template",
      "7) Interactive playground"
    ],
    propsTitle: "Props Reference",
    currentStateLabel: "Current state",
    transferOnlyHint: "Example for scenarios where you only need to move items between lists.",
    dragHint: "Tip: drag items between lists or inside the same list to reorder."
  },
  es: {
    subtitle: "PickList inspirado en PrimeFaces, con transferencia de items entre listas, filtros y reordenacion.",
    sectionTitles: [
      "1) Basico",
      "2) Con Filtros",
      "3) Solo transferencia (sin reordenacion)",
      "4) Reordenacion con controles de lista",
      "5) Controles externos por ref",
      "6) Item template personalizado",
      "7) Playground interactivo"
    ],
    propsTitle: "Referencia de Props",
    currentStateLabel: "Estado actual",
    transferOnlyHint: "Ejemplo para escenarios donde solo necesitas mover items entre listas.",
    dragHint: "Tip: arrastra items entre listas o dentro de la misma lista para reordenar."
  }
};

type PropDescriptionKey =
  | "id"
  | "title"
  | "source"
  | "target"
  | "value"
  | "onChange"
  | "sourceSelection"
  | "targetSelection"
  | "onSourceSelectionChange"
  | "onTargetSelectionChange"
  | "selectionMode"
  | "sourceHeader"
  | "targetHeader"
  | "showTransferControls"
  | "showSourceControls"
  | "showTargetControls"
  | "showSourceFilter"
  | "showTargetFilter"
  | "sourceFilterPlaceholder"
  | "targetFilterPlaceholder"
  | "filterMatchMode"
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

const PICK_LIST_PROP_FIELDS: PropField[] = [
  { prop: "id", type: "string", defaultValue: "-", descriptionKey: "id" },
  { prop: "title", type: "string", defaultValue: "-", descriptionKey: "title" },
  { prop: "source", type: "SgPickListItem[]", defaultValue: "-", descriptionKey: "source" },
  { prop: "target", type: "SgPickListItem[]", defaultValue: "-", descriptionKey: "target" },
  { prop: "value", type: "SgPickListValue", defaultValue: "-", descriptionKey: "value" },
  { prop: "onChange", type: "(event) => void", defaultValue: "-", descriptionKey: "onChange" },
  { prop: "sourceSelection", type: "(string | number)[]", defaultValue: "-", descriptionKey: "sourceSelection" },
  { prop: "targetSelection", type: "(string | number)[]", defaultValue: "-", descriptionKey: "targetSelection" },
  { prop: "onSourceSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onSourceSelectionChange" },
  { prop: "onTargetSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onTargetSelectionChange" },
  { prop: "selectionMode", type: "\"single\" | \"multiple\"", defaultValue: "\"multiple\"", descriptionKey: "selectionMode" },
  { prop: "sourceHeader", type: "string", defaultValue: "i18n", descriptionKey: "sourceHeader" },
  { prop: "targetHeader", type: "string", defaultValue: "i18n", descriptionKey: "targetHeader" },
  { prop: "showTransferControls", type: "boolean", defaultValue: "true", descriptionKey: "showTransferControls" },
  { prop: "showSourceControls", type: "boolean", defaultValue: "true", descriptionKey: "showSourceControls" },
  { prop: "showTargetControls", type: "boolean", defaultValue: "true", descriptionKey: "showTargetControls" },
  { prop: "showSourceFilter", type: "boolean", defaultValue: "false", descriptionKey: "showSourceFilter" },
  { prop: "showTargetFilter", type: "boolean", defaultValue: "false", descriptionKey: "showTargetFilter" },
  { prop: "sourceFilterPlaceholder", type: "string", defaultValue: "i18n", descriptionKey: "sourceFilterPlaceholder" },
  { prop: "targetFilterPlaceholder", type: "string", defaultValue: "i18n", descriptionKey: "targetFilterPlaceholder" },
  { prop: "filterMatchMode", type: "\"contains\" | \"startsWith\" | \"endsWith\"", defaultValue: "\"contains\"", descriptionKey: "filterMatchMode" },
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
  { prop: "ref", type: "SgPickListRef", defaultValue: "-", descriptionKey: "ref" }
];

const PICK_LIST_PROP_DESCRIPTIONS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", Record<PropDescriptionKey, string>> = {
  "pt-BR": {
    id: "Identificador base do componente.",
    title: "Titulo exibido no GroupBox.",
    source: "Lista de origem.",
    target: "Lista de destino.",
    value: "Valor controlado contendo source e target.",
    onChange: "Callback disparado em transferencias, reordenacao e drag and drop.",
    sourceSelection: "Selecao controlada da lista source.",
    targetSelection: "Selecao controlada da lista target.",
    onSourceSelectionChange: "Callback da mudanca de selecao na source.",
    onTargetSelectionChange: "Callback da mudanca de selecao na target.",
    selectionMode: "Define selecao unica ou multipla.",
    sourceHeader: "Texto do cabecalho da lista source.",
    targetHeader: "Texto do cabecalho da lista target.",
    showTransferControls: "Exibe os botoes de transferencia entre listas.",
    showSourceControls: "Exibe controles de reordenacao da source.",
    showTargetControls: "Exibe controles de reordenacao da target.",
    showSourceFilter: "Exibe filtro de busca da source.",
    showTargetFilter: "Exibe filtro de busca da target.",
    sourceFilterPlaceholder: "Placeholder do filtro da source.",
    targetFilterPlaceholder: "Placeholder do filtro da target.",
    filterMatchMode: "Modo de comparacao do filtro.",
    draggable: "Permite arrastar para transferir/reordenar.",
    disabled: "Desabilita interacao do componente.",
    readOnly: "Mantem visualizacao sem alterar estado.",
    emptyMessage: "Mensagem exibida quando lista estiver vazia.",
    itemTemplate: "Template customizado para render de item.",
    className: "Classe CSS adicional do container.",
    style: "Estilo inline adicional do container.",
    listClassName: "Classe CSS adicional das listas.",
    itemClassName: "Classe CSS adicional de cada item.",
    groupBoxProps: "Props extras repassadas ao SgGroupBox.",
    ref: "Ref imperativo com transferencias e clearSelection."
  },
  "pt-PT": {
    id: "Identificador base do componente.",
    title: "Titulo exibido no GroupBox.",
    source: "Lista de origem.",
    target: "Lista de destino.",
    value: "Valor controlado contendo source e target.",
    onChange: "Callback disparado em transferencias, reordenacao e drag and drop.",
    sourceSelection: "Selecao controlada da lista source.",
    targetSelection: "Selecao controlada da lista target.",
    onSourceSelectionChange: "Callback da mudanca de selecao na source.",
    onTargetSelectionChange: "Callback da mudanca de selecao na target.",
    selectionMode: "Define selecao unica ou multipla.",
    sourceHeader: "Texto do cabecalho da lista source.",
    targetHeader: "Texto do cabecalho da lista target.",
    showTransferControls: "Exibe os botoes de transferencia entre listas.",
    showSourceControls: "Exibe controlos de reordenacao da source.",
    showTargetControls: "Exibe controlos de reordenacao da target.",
    showSourceFilter: "Exibe filtro de pesquisa da source.",
    showTargetFilter: "Exibe filtro de pesquisa da target.",
    sourceFilterPlaceholder: "Placeholder do filtro da source.",
    targetFilterPlaceholder: "Placeholder do filtro da target.",
    filterMatchMode: "Modo de comparacao do filtro.",
    draggable: "Permite arrastar para transferir/reordenar.",
    disabled: "Desabilita interacao do componente.",
    readOnly: "Mantem visualizacao sem alterar estado.",
    emptyMessage: "Mensagem exibida quando lista estiver vazia.",
    itemTemplate: "Template customizado para render de item.",
    className: "Classe CSS adicional do container.",
    style: "Estilo inline adicional do container.",
    listClassName: "Classe CSS adicional das listas.",
    itemClassName: "Classe CSS adicional de cada item.",
    groupBoxProps: "Props extras repassadas ao SgGroupBox.",
    ref: "Ref imperativo com transferencias e clearSelection."
  },
  "en-US": {
    id: "Base identifier for the component.",
    title: "Title displayed in the GroupBox.",
    source: "Source list.",
    target: "Target list.",
    value: "Controlled value containing source and target.",
    onChange: "Callback fired on transfer, reorder, and drag/drop.",
    sourceSelection: "Controlled selection for source list.",
    targetSelection: "Controlled selection for target list.",
    onSourceSelectionChange: "Selection change callback for source.",
    onTargetSelectionChange: "Selection change callback for target.",
    selectionMode: "Defines single or multiple selection.",
    sourceHeader: "Header text for source list.",
    targetHeader: "Header text for target list.",
    showTransferControls: "Shows transfer buttons between lists.",
    showSourceControls: "Shows reorder controls for source.",
    showTargetControls: "Shows reorder controls for target.",
    showSourceFilter: "Shows source filter input.",
    showTargetFilter: "Shows target filter input.",
    sourceFilterPlaceholder: "Source filter placeholder.",
    targetFilterPlaceholder: "Target filter placeholder.",
    filterMatchMode: "Filter comparison mode.",
    draggable: "Enables drag to transfer/reorder.",
    disabled: "Disables component interaction.",
    readOnly: "Keeps view mode without state changes.",
    emptyMessage: "Message displayed when list is empty.",
    itemTemplate: "Custom item render template.",
    className: "Additional CSS class for container.",
    style: "Additional inline style for container.",
    listClassName: "Additional CSS class for lists.",
    itemClassName: "Additional CSS class for each item.",
    groupBoxProps: "Extra props forwarded to SgGroupBox.",
    ref: "Imperative ref with transfer helpers and clearSelection."
  },
  es: {
    id: "Identificador base del componente.",
    title: "Titulo mostrado en GroupBox.",
    source: "Lista de origen.",
    target: "Lista de destino.",
    value: "Valor controlado con source y target.",
    onChange: "Callback disparado en transferencias, reordenacion y drag/drop.",
    sourceSelection: "Seleccion controlada de source.",
    targetSelection: "Seleccion controlada de target.",
    onSourceSelectionChange: "Callback del cambio de seleccion en source.",
    onTargetSelectionChange: "Callback del cambio de seleccion en target.",
    selectionMode: "Define seleccion unica o multiple.",
    sourceHeader: "Texto del encabezado de source.",
    targetHeader: "Texto del encabezado de target.",
    showTransferControls: "Muestra botones de transferencia entre listas.",
    showSourceControls: "Muestra controles de reordenacion de source.",
    showTargetControls: "Muestra controles de reordenacion de target.",
    showSourceFilter: "Muestra filtro de source.",
    showTargetFilter: "Muestra filtro de target.",
    sourceFilterPlaceholder: "Placeholder del filtro de source.",
    targetFilterPlaceholder: "Placeholder del filtro de target.",
    filterMatchMode: "Modo de comparacion del filtro.",
    draggable: "Permite arrastrar para transferir/reordenar.",
    disabled: "Deshabilita interaccion del componente.",
    readOnly: "Mantiene visualizacion sin alterar estado.",
    emptyMessage: "Mensaje mostrado cuando la lista esta vacia.",
    itemTemplate: "Template personalizado para render de item.",
    className: "Clase CSS adicional del contenedor.",
    style: "Estilo inline adicional del contenedor.",
    listClassName: "Clase CSS adicional de las listas.",
    itemClassName: "Clase CSS adicional de cada item.",
    groupBoxProps: "Props adicionales reenviadas a SgGroupBox.",
    ref: "Ref imperativo con transferencias y clearSelection."
  }
};

function isSupportedPickListLocale(locale: ShowcaseLocale): locale is keyof typeof PICK_LIST_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

const ROADMAP_SOURCE: SgPickListItem[] = [
  { label: "Authentication", value: "auth" },
  { label: "Dashboard", value: "dashboard" },
  { label: "Notifications", value: "notifications" },
  { label: "Audit logs", value: "audit" },
  { label: "Billing", value: "billing" }
];

export default function SgPickListShowcase() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof PICK_LIST_TEXTS = isSupportedPickListLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = PICK_LIST_TEXTS[locale];
  const propDescriptions = PICK_LIST_PROP_DESCRIPTIONS[locale];
  const propRows = React.useMemo<ShowcasePropRow[]>(
    () =>
      PICK_LIST_PROP_FIELDS.map((field) => ({
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

  const [basicValue, setBasicValue] = React.useState({ source: ROADMAP_SOURCE, target: [] as SgPickListItem[] });
  const [filterValue, setFilterValue] = React.useState({
    source: [
      { label: "Berlin", value: "berlin" },
      { label: "Boston", value: "boston" },
      { label: "Lisbon", value: "lisbon" },
      { label: "Madrid", value: "madrid" },
      { label: "Sao Paulo", value: "sao-paulo" }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });
  const [transferOnlyValue, setTransferOnlyValue] = React.useState({
    source: [
      { label: "Backlog", value: "backlog", icon: <Landmark className="h-4 w-4" /> },
      { label: "In progress", value: "in-progress", icon: <RefreshCw className="h-4 w-4" /> },
      { label: "Review", value: "review", icon: <Bell className="h-4 w-4" /> }
    ] as SgPickListItem[],
    target: [
      { label: "Done", value: "done", icon: <Star className="h-4 w-4" /> }
    ] as SgPickListItem[]
  });
  const [reorderValue, setReorderValue] = React.useState({
    source: [
      { label: "Task A", value: "task-a" },
      { label: "Task B", value: "task-b" },
      { label: "Task C", value: "task-c" }
    ] as SgPickListItem[],
    target: [
      { label: "Done X", value: "done-x" },
      { label: "Done Y", value: "done-y" }
    ] as SgPickListItem[]
  });
  const [templateValue, setTemplateValue] = React.useState({
    source: [
      { label: "Frontend", value: "frontend", data: { owner: "Ana", effort: "M" } },
      { label: "Backend", value: "backend", data: { owner: "Bruno", effort: "L" } },
      { label: "QA", value: "qa", data: { owner: "Carla", effort: "S" }, disabled: true }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });
  const [externalValue, setExternalValue] = React.useState({
    source: [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
      { label: "Push", value: "push" }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });

  const pickListRef = React.useRef<SgPickListRef>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPickList"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0]}>
          <SgPickList
            id="pick-basic"
            title="Roadmap planning"
            source={ROADMAP_SOURCE}
            target={[]}
            value={basicValue}
            onChange={(event) => setBasicValue({ source: event.source, target: event.target })}
          />
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            {texts.currentStateLabel}: source [{basicValue.source.length}] | target [{basicValue.target.length}]
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/basico.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[1]}>
          <SgPickList
            id="pick-filter"
            title="Cities"
            source={filterValue.source}
            target={filterValue.target}
            value={filterValue}
            onChange={(event) => setFilterValue({ source: event.source, target: event.target })}
            showSourceFilter
            showTargetFilter
            sourceHeader="Available"
            targetHeader="Selected"
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/com-filtros.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[2]}>
          <SgPickList
            id="pick-transfer-only"
            title="Transfer only"
            source={transferOnlyValue.source}
            target={transferOnlyValue.target}
            value={transferOnlyValue}
            onChange={(event) => setTransferOnlyValue({ source: event.source, target: event.target })}
            showSourceControls={false}
            showTargetControls={false}
            draggable={false}
          />
          <p className="text-xs text-muted-foreground">
            {texts.transferOnlyHint}
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/somente-transferencia-sem-ordenacao.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[3]}>
          <p className="text-sm text-muted-foreground">{texts.dragHint}</p>
          <SgPickList
            id="pick-reorder"
            title="Sprint board"
            source={reorderValue.source}
            target={reorderValue.target}
            value={reorderValue}
            onChange={(event) => setReorderValue({ source: event.source, target: event.target })}
            showSourceControls
            showTargetControls
            draggable
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/reordenacao-com-controles-de-lista.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[4]}>
          <SgPickList
            ref={pickListRef}
            id="pick-ref"
            title="Channels"
            source={externalValue.source}
            target={externalValue.target}
            value={externalValue}
            onChange={(event) => setExternalValue({ source: event.source, target: event.target })}
            showTransferControls={false}
            selectionMode="multiple"
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => pickListRef.current?.moveToTarget()}>Move &gt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveAllToTarget()}>Move &gt;&gt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveToSource()}>Move &lt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveAllToSource()}>Move &lt;&lt;</SgButton>
          </SgGrid>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/controles-externos-por-ref.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[5]}>
          <SgPickList
            id="pick-template"
            title="Team capacity"
            source={templateValue.source}
            target={templateValue.target}
            value={templateValue}
            onChange={(event) => setTemplateValue({ source: event.source, target: event.target })}
            itemTemplate={(item) => {
              const meta = item.data as { owner: string; effort: string } | undefined;
              return (
                <SgGrid columns={{ base: 1, sm: 2 }} gap={8} className="w-full">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-[rgb(var(--sg-muted))]">
                    {"Owner: " + (meta?.owner ?? "-") + " | Effort: " + (meta?.effort ?? "-")}
                  </span>
                </SgGrid>
              );
            }}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/item-template-customizado.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[6]}>
          <SgPlayground
            title="SgPickList Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-pick-list/sg-pick-list.tsx.playground"
            height={700}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={propRows} title={texts.propsTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

