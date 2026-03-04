"use client";

import React from "react";
import {
  Save,
  RefreshCw,
  Trash2,
  Home,
  Plus,
  Download,
  Upload,
  Copy,
  Printer,
  Share2,
  Mail,
  FileText
} from "lucide-react";
import { SgGrid, SgPlayground, SgSplitButton } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

function Section(props: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
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

type SplitButtonTexts = {
  subtitle: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  labels: {
    save: string;
    update: string;
    delete: string;
    homepage: string;
    file: string;
    copy: string;
    print: string;
    exportPdf: string;
    shareEmail: string;
    disabledOutline: string;
    saving: string;
    processing: string;
    actions: string;
    deleteDisabled: string;
    newAction: string;
    import: string;
    downloadTemplate: string;
    share: string;
    small: string;
    medium: string;
    large: string;
    propsTitle: string;
    playgroundTitle: string;
  };
};

const SPLIT_BUTTON_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", SplitButtonTexts> = {
  "pt-BR": {
    subtitle: "Botao dividido com acao principal e menu dropdown de opcoes adicionais.",
    sectionTitles: [
      "1) Basico",
      "2) Severidades",
      "3) Outlined",
      "4) Ghost",
      "5) Elevated",
      "6) Tamanhos",
      "7) Com icones",
      "8) Separadores de menu",
      "9) Desabilitado",
      "10) Loading",
      "11) Itens desabilitados",
      "12) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Split button com acao principal e dropdown de itens.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger".',
      'appearance="outline": bordas coloridas sem preenchimento.',
      'appearance="ghost": sem fundo, apenas texto colorido.',
      'appearance="solid" + elevation="sm".',
      'size="sm" | "md" | "lg".',
      "leftIcon na acao principal e icon nos itens do menu.",
      "separator=true para dividir grupos de itens no menu.",
      "disabled=true desabilita o split button inteiro.",
      "loading=true exibe spinner na acao principal e desabilita o menu.",
      "Itens individuais do menu podem ser desabilitados.",
      "Ajuste props principais do SgSplitButton."
    ],
    labels: {
      save: "Salvar",
      update: "Atualizar",
      delete: "Excluir",
      homepage: "Inicio",
      file: "Arquivo",
      copy: "Copiar",
      print: "Imprimir",
      exportPdf: "Exportar PDF",
      shareEmail: "Compartilhar por e-mail",
      disabledOutline: "Outline desabilitado",
      saving: "Salvando...",
      processing: "Processando...",
      actions: "Acoes",
      deleteDisabled: "Excluir (desabilitado)",
      newAction: "Novo",
      import: "Importar",
      downloadTemplate: "Baixar modelo",
      share: "Compartilhar",
      small: "Pequeno",
      medium: "Medio",
      large: "Grande",
      propsTitle: "Referencia de Props",
      playgroundTitle: "SgSplitButton Playground"
    }
  },
  "pt-PT": {
    subtitle: "Botao dividido com acao principal e menu dropdown de opcoes adicionais.",
    sectionTitles: [
      "1) Basico",
      "2) Severidades",
      "3) Outlined",
      "4) Ghost",
      "5) Elevated",
      "6) Tamanhos",
      "7) Com icones",
      "8) Separadores de menu",
      "9) Desativado",
      "10) Loading",
      "11) Itens desativados",
      "12) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Split button com acao principal e dropdown de itens.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger".',
      'appearance="outline": bordas coloridas sem preenchimento.',
      'appearance="ghost": sem fundo, apenas texto colorido.',
      'appearance="solid" + elevation="sm".',
      'size="sm" | "md" | "lg".',
      "leftIcon na acao principal e icon nos itens do menu.",
      "separator=true para dividir grupos de itens no menu.",
      "disabled=true desativa o split button inteiro.",
      "loading=true mostra spinner na acao principal e desativa o menu.",
      "Itens individuais do menu podem ser desativados.",
      "Ajuste props principais do SgSplitButton."
    ],
    labels: {
      save: "Guardar",
      update: "Atualizar",
      delete: "Eliminar",
      homepage: "Inicio",
      file: "Ficheiro",
      copy: "Copiar",
      print: "Imprimir",
      exportPdf: "Exportar PDF",
      shareEmail: "Partilhar por e-mail",
      disabledOutline: "Outline desativado",
      saving: "A guardar...",
      processing: "A processar...",
      actions: "Acoes",
      deleteDisabled: "Eliminar (desativado)",
      newAction: "Novo",
      import: "Importar",
      downloadTemplate: "Descarregar modelo",
      share: "Partilhar",
      small: "Pequeno",
      medium: "Medio",
      large: "Grande",
      propsTitle: "Referencia de Props",
      playgroundTitle: "SgSplitButton Playground"
    }
  },
  "en-US": {
    subtitle: "Split button with primary action and dropdown menu for additional options.",
    sectionTitles: [
      "1) Basic",
      "2) Severities",
      "3) Outlined",
      "4) Ghost",
      "5) Elevated",
      "6) Sizes",
      "7) With icons",
      "8) Menu separators",
      "9) Disabled",
      "10) Loading",
      "11) Disabled items",
      "12) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Split button with primary action and dropdown items.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger".',
      'appearance="outline": colored borders without fill.',
      'appearance="ghost": no background, colored text only.',
      'appearance="solid" + elevation="sm".',
      'size="sm" | "md" | "lg".',
      "leftIcon in the main action and icon in menu items.",
      "separator=true to split groups inside menu.",
      "disabled=true disables the whole split button.",
      "loading=true shows spinner in the main action and disables menu.",
      "Individual menu items can be disabled.",
      "Adjust main SgSplitButton props."
    ],
    labels: {
      save: "Save",
      update: "Update",
      delete: "Delete",
      homepage: "Homepage",
      file: "File",
      copy: "Copy",
      print: "Print",
      exportPdf: "Export as PDF",
      shareEmail: "Share via email",
      disabledOutline: "Disabled Outline",
      saving: "Saving...",
      processing: "Processing...",
      actions: "Actions",
      deleteDisabled: "Delete (disabled)",
      newAction: "New",
      import: "Import",
      downloadTemplate: "Download template",
      share: "Share",
      small: "Small",
      medium: "Medium",
      large: "Large",
      propsTitle: "Props Reference",
      playgroundTitle: "SgSplitButton Playground"
    }
  },
  es: {
    subtitle: "Boton dividido con accion principal y menu desplegable de opciones adicionales.",
    sectionTitles: [
      "1) Basico",
      "2) Severidades",
      "3) Outlined",
      "4) Ghost",
      "5) Elevated",
      "6) Tamaños",
      "7) Con iconos",
      "8) Separadores de menu",
      "9) Deshabilitado",
      "10) Loading",
      "11) Items deshabilitados",
      "12) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Split button con accion principal y menu de items.",
      'severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger".',
      'appearance="outline": bordes de color sin relleno.',
      'appearance="ghost": sin fondo, solo texto de color.',
      'appearance="solid" + elevation="sm".',
      'size="sm" | "md" | "lg".',
      "leftIcon en la accion principal e icono en los items del menu.",
      "separator=true para dividir grupos en el menu.",
      "disabled=true deshabilita todo el split button.",
      "loading=true muestra spinner en la accion principal y deshabilita el menu.",
      "Los items individuales del menu pueden deshabilitarse.",
      "Ajusta las props principales de SgSplitButton."
    ],
    labels: {
      save: "Guardar",
      update: "Actualizar",
      delete: "Eliminar",
      homepage: "Inicio",
      file: "Archivo",
      copy: "Copiar",
      print: "Imprimir",
      exportPdf: "Exportar PDF",
      shareEmail: "Compartir por correo",
      disabledOutline: "Outline deshabilitado",
      saving: "Guardando...",
      processing: "Procesando...",
      actions: "Acciones",
      deleteDisabled: "Eliminar (deshabilitado)",
      newAction: "Nuevo",
      import: "Importar",
      downloadTemplate: "Descargar plantilla",
      share: "Compartir",
      small: "Pequeño",
      medium: "Medio",
      large: "Grande",
      propsTitle: "Referencia de Props",
      playgroundTitle: "SgSplitButton Playground"
    }
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof SPLIT_BUTTON_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

const SPLIT_BUTTON_PLAYGROUND_CODE = `import * as React from "react";
import { Save, RefreshCw, Trash2 } from "lucide-react";
import { SgButton, SgGrid, SgSplitButton } from "@seedgrid/fe-components";

const items = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
];

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "success" | "danger">("primary");
  const [appearance, setAppearance] = React.useState<"solid" | "outline" | "ghost">("solid");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
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
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
        <SgButton size="sm" appearance={loading ? "solid" : "outline"} onClick={() => setLoading((prev) => !prev)}>
          loading: {String(loading)}
        </SgButton>
        <SgButton size="sm" appearance={disabled ? "solid" : "outline"} onClick={() => setDisabled((prev) => !prev)}>
          disabled: {String(disabled)}
        </SgButton>
      </SgGrid>

      <SgSplitButton
        label="Preview"
        leftIcon={<Save className="size-4" />}
        severity={severity}
        appearance={appearance}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={() => {}}
        items={items}
      />
    </div>
  );
}`;

const SPLIT_BUTTON_PROPS: ShowcasePropRow[] = [
  { prop: "label", type: "string", defaultValue: "-", description: "Main action button label." },
  { prop: "items", type: "SplitButtonItem[]", defaultValue: "-", description: "Dropdown menu items." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Main action callback." },
  { prop: "severity", type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"', defaultValue: '"primary"', description: "Visual severity theme." },
  { prop: "appearance", type: '"solid" | "outline" | "ghost"', defaultValue: '"solid"', description: "Visual appearance style." },
  { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Component size." },
  { prop: "leftIcon", type: "ReactNode", defaultValue: "-", description: "Icon in the main button." },
  { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"none"', description: "Shadow elevation level." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables main action and menu." },
  { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows loading spinner in main action." }
];

export default function SgSplitButtonShowcase() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof SPLIT_BUTTON_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = SPLIT_BUTTON_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const basicItems = React.useMemo(() => ([
    { label: texts.labels.update, icon: <RefreshCw className="size-4" />, onClick: () => console.log(texts.labels.update) },
    { label: texts.labels.delete, icon: <Trash2 className="size-4" />, onClick: () => console.log(texts.labels.delete) },
    { label: texts.labels.homepage, icon: <Home className="size-4" />, onClick: () => console.log(texts.labels.homepage) }
  ]), [texts]);

  const fileItems = React.useMemo(() => ([
    { label: texts.labels.copy, icon: <Copy className="size-4" />, onClick: () => console.log(texts.labels.copy) },
    { label: texts.labels.print, icon: <Printer className="size-4" />, onClick: () => console.log(texts.labels.print) },
    { separator: true, label: texts.labels.exportPdf, icon: <FileText className="size-4" />, onClick: () => console.log(texts.labels.exportPdf) },
    { label: texts.labels.shareEmail, icon: <Mail className="size-4" />, onClick: () => console.log(texts.labels.shareEmail) }
  ]), [texts]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSplitButton"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.save} leftIcon={<Save className="size-4" />} onClick={() => console.log(texts.labels.save)} items={basicItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="${texts.labels.save}" leftIcon={<Save className="size-4" />} onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="outline" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="outline" onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="ghost" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="ghost" onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="solid" elevation="sm" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="solid" elevation="sm" onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-6" title={texts.sectionTitles[5] ?? ""} description={texts.sectionDescriptions[5] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.small} size="sm" leftIcon={<Save className="size-4" />} onClick={() => console.log("sm")} items={basicItems} />
            <SgSplitButton label={texts.labels.medium} size="md" leftIcon={<Save className="size-4" />} onClick={() => console.log("md")} items={basicItems} />
            <SgSplitButton label={texts.labels.large} size="lg" leftIcon={<Save className="size-4" />} onClick={() => console.log("lg")} items={basicItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="Small" size="sm" onClick={() => {}} items={items} />
<SgSplitButton label="Medium" size="md" onClick={() => {}} items={items} />
<SgSplitButton label="Large" size="lg" onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-7" title={texts.sectionTitles[6] ?? ""} description={texts.sectionDescriptions[6] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.save} leftIcon={<Save className="size-4" />} severity="primary" onClick={() => console.log(texts.labels.save)} items={basicItems} />
            <SgSplitButton
              label={texts.labels.newAction}
              leftIcon={<Plus className="size-4" />}
              severity="success"
              onClick={() => console.log(texts.labels.newAction)}
              items={[
                { label: texts.labels.import, icon: <Upload className="size-4" />, onClick: () => console.log(texts.labels.import) },
                { label: texts.labels.downloadTemplate, icon: <Download className="size-4" />, onClick: () => console.log(texts.labels.downloadTemplate) }
              ]}
            />
            <SgSplitButton label={texts.labels.share} leftIcon={<Share2 className="size-4" />} severity="info" onClick={() => console.log(texts.labels.share)} items={fileItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="Save" leftIcon={<Save className="size-4" />} onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-8" title={texts.sectionTitles[7] ?? ""} description={texts.sectionDescriptions[7] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.file} leftIcon={<FileText className="size-4" />} severity="secondary" onClick={() => console.log(texts.labels.file)} items={fileItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="File" items={[{ label: "Copy" }, { separator: true, label: "Export as PDF" }]} />`} />
        </Section>

        <Section id="exemplo-9" title={texts.sectionTitles[8] ?? ""} description={texts.sectionDescriptions[8] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.save} leftIcon={<Save className="size-4" />} disabled onClick={() => {}} items={basicItems} />
            <SgSplitButton label={texts.labels.disabledOutline} severity="danger" appearance="outline" disabled onClick={() => {}} items={basicItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="Save" disabled onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-10" title={texts.sectionTitles[9] ?? ""} description={texts.sectionDescriptions[9] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.saving} leftIcon={<Save className="size-4" />} loading onClick={() => {}} items={basicItems} />
            <SgSplitButton label={texts.labels.processing} severity="success" loading onClick={() => {}} items={basicItems} />
          </Row>
          <CodeBlock code={`<SgSplitButton label="Saving..." loading onClick={() => {}} items={items} />`} />
        </Section>

        <Section id="exemplo-11" title={texts.sectionTitles[10] ?? ""} description={texts.sectionDescriptions[10] ?? ""}>
          <Row>
            <SgSplitButton
              label={texts.labels.actions}
              severity="primary"
              onClick={() => console.log(texts.labels.actions)}
              items={[
                { label: texts.labels.update, icon: <RefreshCw className="size-4" />, onClick: () => console.log(texts.labels.update) },
                { label: texts.labels.deleteDisabled, icon: <Trash2 className="size-4" />, onClick: () => console.log(texts.labels.delete), disabled: true },
                { label: texts.labels.homepage, icon: <Home className="size-4" />, onClick: () => console.log(texts.labels.homepage) }
              ]}
            />
          </Row>
          <CodeBlock code={`<SgSplitButton label="Actions" items={[{ label: "Delete", disabled: true }]} onClick={() => {}} />`} />
        </Section>

        <Section id="exemplo-12" title={texts.sectionTitles[11] ?? ""} description={texts.sectionDescriptions[11] ?? ""}>
          <SgPlayground
            title={texts.labels.playgroundTitle}
            interactive
            codeContract="appFile"
            code={SPLIT_BUTTON_PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.labels.propsTitle} rows={SPLIT_BUTTON_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
