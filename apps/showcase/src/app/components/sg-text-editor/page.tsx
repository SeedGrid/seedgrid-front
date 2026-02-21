"use client";

import React from "react";
import { SgPlayground, SgTextEditor } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const TEXT_EDITOR_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";

export default function App() {
  const [htmlBody, setHtmlBody] = React.useState("<p><strong>SeedGrid</strong> editor</p>");
  const [cssText, setCssText] = React.useState("body { font-family: Arial; }");
  const [showCssEditor, setShowCssEditor] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={showCssEditor}
            onChange={(e) => setShowCssEditor(e.target.checked)}
          />
          showCssEditor
        </label>
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          disabled
        </label>
      </div>

      <SgTextEditor
        id="playground-text-editor"
        valueHtml={htmlBody}
        onChangeHtml={setHtmlBody}
        cssText={cssText}
        onCssTextChange={setCssText}
        showCssEditor={showCssEditor}
        disabled={disabled}
        onSave={(file) => console.log(file.name)}
      />
    </div>
  );
}`;

export default function SgTextEditorPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });
  const [htmlBody, setHtmlBody] = React.useState<string>("<p><strong>SeedGrid</strong> editor</p>");
  const [cssText, setCssText] = React.useState<string>("body { font-family: Arial; }");
  const [minimalBody, setMinimalBody] = React.useState<string>("<p>Editor sem CSS</p>");
  const [radiusBody, setRadiusBody] = React.useState<string>("<p>Editor com borderRadius customizado</p>");

  const onSave = React.useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.textEditor.title")}
          subtitle={t(i18n, "showcase.component.textEditor.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.textEditor.sections.basic.title")}
          description={t(i18n, "showcase.component.textEditor.sections.basic.description")}
        >
          <SgTextEditor
            id="sg-text-editor"
            valueHtml={htmlBody}
            onChangeHtml={setHtmlBody}
            cssText={cssText}
            onCssTextChange={setCssText}
            showCssEditor
            onSave={(file) => onSave(file)}
          />
          <CodeBlock
            code={`import React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";

export default function Example() {
  const [htmlBody, setHtmlBody] = React.useState("<p><strong>SeedGrid</strong> editor</p>");
  const [cssText, setCssText] = React.useState("body { font-family: Arial; }");

  return (
    <SgTextEditor
      id="sg-text-editor"
      valueHtml={htmlBody}
      onChangeHtml={setHtmlBody}
      cssText={cssText}
      onCssTextChange={setCssText}
      showCssEditor
      onSave={(file) => console.log(file.name)}
    />
  );
}`}
          />
        </Section>

        <Section title="2) Modo Sem CSS" description="Exemplo com editor de CSS oculto.">
          <SgTextEditor
            id="sg-text-editor-no-css"
            valueHtml={minimalBody}
            onChangeHtml={setMinimalBody}
            showCssEditor={false}
            onSave={(file) => onSave(file)}
          />
          <CodeBlock
            code={`import React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";

export default function Example() {
  const [htmlBody, setHtmlBody] = React.useState("<p>Editor sem CSS</p>");

  return (
    <SgTextEditor
      id="sg-text-editor-no-css"
      valueHtml={htmlBody}
      onChangeHtml={setHtmlBody}
      showCssEditor={false}
      onSave={(file) => console.log(file.name)}
    />
  );
}`}
          />
        </Section>

        <Section title="3) Desabilitado" description="Renderização somente visual do conteúdo.">
          <SgTextEditor
            id="sg-text-editor-disabled"
            valueHtml="<p><strong>Conteúdo bloqueado</strong></p>"
            disabled
            showCssEditor={false}
          />
          <CodeBlock
            code={`import { SgTextEditor } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgTextEditor
      id="sg-text-editor-disabled"
      valueHtml="<p><strong>Conteúdo bloqueado</strong></p>"
      disabled
      showCssEditor={false}
    />
  );
}`}
          />
        </Section>

        <Section title="4) Border radius" description="Aplica o raio no editor e na área de CSS.">
          <SgTextEditor
            id="sg-text-editor-radius"
            valueHtml={radiusBody}
            onChangeHtml={setRadiusBody}
            cssText={cssText}
            onCssTextChange={setCssText}
            showCssEditor
            borderRadius={20}
            onSave={(file) => onSave(file)}
          />
          <CodeBlock
            code={`import React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";

export default function Example() {
  const [radiusBody, setRadiusBody] = React.useState("<p>Editor com borderRadius customizado</p>");
  const [cssText, setCssText] = React.useState("body { font-family: Arial; }");
  const onSave = (file: File) => console.log(file.name);

  return (
    <SgTextEditor
      id="sg-text-editor-radius"
      valueHtml={radiusBody}
      onChangeHtml={setRadiusBody}
      cssText={cssText}
      onCssTextChange={setCssText}
      showCssEditor
      borderRadius={20}
      onSave={(file) => onSave(file)}
    />
  );
}`}
          />
        </Section>

        <Section title="5) Playground" description="Simule as principais props do SgTextEditor em tempo real.">
          <SgPlayground
            title="SgTextEditor Playground"
            interactive
            codeContract="appFile"
            code={TEXT_EDITOR_PLAYGROUND_APP_FILE}
            height={780}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
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
                <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do editor.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">valueHtml / onChangeHtml</td><td className="py-2 pr-4">string / function</td><td className="py-2 pr-4">-</td><td className="py-2">Valor HTML controlado e callback de mudança.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">cssText / onCssTextChange</td><td className="py-2 pr-4">string / function</td><td className="py-2 pr-4">"" / -</td><td className="py-2">CSS embutido e callback de alteração.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">showCssEditor</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe área de edição de CSS.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">disabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Desabilita edição e ações do editor.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Define o raio de borda do editor e do textarea de CSS.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onSave</td><td className="py-2 pr-4">(file, meta) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback ao exportar HTML.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onLoad</td><td className="py-2 pr-4">(meta) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback ao carregar arquivo HTML.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">height</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">320</td><td className="py-2">Altura da área de edição.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">fileName</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">{`"${"{id}.html"}"`}</td><td className="py-2">Nome do arquivo gerado no salvar.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

