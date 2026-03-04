"use client";

import React from "react";
import { SgPlayground, SgTextEditor } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
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
  const [minimalBody, setMinimalBody] = React.useState<string>("<p>Editor without CSS</p>");
  const [radiusBody, setRadiusBody] = React.useState<string>("<p>Editor with custom border radius</p>");
  const textEditorPropsRows = React.useMemo<ShowcasePropRow[]>(
    () => [
      { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.textEditor.props.rows.id") },
      { prop: "valueHtml / onChangeHtml", type: "string / function", defaultValue: "-", description: t(i18n, "showcase.component.textEditor.props.rows.valueHtmlOnChangeHtml") },
      { prop: "cssText / onCssTextChange", type: "string / function", defaultValue: "\"\" / -", description: t(i18n, "showcase.component.textEditor.props.rows.cssTextOnCssTextChange") },
      { prop: "showCssEditor", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.textEditor.props.rows.showCssEditor") },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.textEditor.props.rows.disabled") },
      { prop: "borderRadius", type: "number | string", defaultValue: "-", description: t(i18n, "showcase.component.textEditor.props.rows.borderRadius") },
      { prop: "onSave", type: "(file, meta) => void", defaultValue: "-", description: t(i18n, "showcase.component.textEditor.props.rows.onSave") },
      { prop: "onLoad", type: "(meta) => void", defaultValue: "-", description: t(i18n, "showcase.component.textEditor.props.rows.onLoad") },
      { prop: "height", type: "number", defaultValue: "320", description: t(i18n, "showcase.component.textEditor.props.rows.height") },
      { prop: "fileName", type: "string", defaultValue: "\"{id}.html\"", description: t(i18n, "showcase.component.textEditor.props.rows.fileName") }
    ],
    [i18n]
  );

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

        <Section
          title={`2) ${t(i18n, "showcase.component.textEditor.sections.noCss.title")}`}
          description={t(i18n, "showcase.component.textEditor.sections.noCss.description")}
        >
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
  const [htmlBody, setHtmlBody] = React.useState("<p>Editor without CSS</p>");

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

        <Section
          title={`3) ${t(i18n, "showcase.component.textEditor.sections.disabled.title")}`}
          description={t(i18n, "showcase.component.textEditor.sections.disabled.description")}
        >
          <SgTextEditor
            id="sg-text-editor-disabled"
            valueHtml="<p><strong>Locked content</strong></p>"
            disabled
            showCssEditor={false}
          />
          <CodeBlock
            code={`import { SgTextEditor } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgTextEditor
      id="sg-text-editor-disabled"
      valueHtml="<p><strong>Locked content</strong></p>"
      disabled
      showCssEditor={false}
    />
  );
}`}
          />
        </Section>

        <Section
          title={`4) ${t(i18n, "showcase.component.textEditor.sections.radius.title")}`}
          description={t(i18n, "showcase.component.textEditor.sections.radius.description")}
        >
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
  const [radiusBody, setRadiusBody] = React.useState("<p>Editor with custom border radius</p>");
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

        <Section
          title={`5) ${t(i18n, "showcase.component.textEditor.sections.playground.title")}`}
          description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgTextEditor" })}
        >
          <SgPlayground
            title="SgTextEditor Playground"
            interactive
            codeContract="appFile"
            code={TEXT_EDITOR_PLAYGROUND_APP_FILE}
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference
          id="props-reference"
          title={t(i18n, "showcase.component.textEditor.props.title")}
          rows={textEditorPropsRows}
        />

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



