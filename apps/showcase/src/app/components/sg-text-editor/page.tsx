"use client";

import React from "react";
import { SgTextEditor } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

export default function SgTextEditorPage() {
  const i18n = useShowcaseI18n();
  const [htmlBody, setHtmlBody] = React.useState<string>("<p><strong>SeedGrid</strong> editor</p>");
  const [cssText, setCssText] = React.useState<string>("body { font-family: Arial; }");

  const onSave = React.useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.textEditor.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.textEditor.subtitle")}</p>
      </div>

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
      onSave={(file) => console.log(file)}
    />
  );
}`}
        />
      </Section>
    </div>
  );
}
