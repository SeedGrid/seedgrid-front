"use client";

import React from "react";
import { SgInputDate } from "@seedgrid/fe-components";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function buildRhfCode(code: string, baseName = "data", defaultValues?: string) {
  const matches = code.match(/<SgInputDate\b/g) ?? [];
  const count = Math.max(matches.length, 1);
  const names = Array.from({ length: count }, (_, index) => `${baseName}${count > 1 ? index + 1 : ""}`);
  let cursor = 0;
  const withControl = code.replace(/<SgInputDate\b/g, () => {
    const name = names[cursor] ?? baseName;
    cursor += 1;
    return `<SgInputDate\n  name="${name}"\n  control={control}`;
  });
  const defaults = defaultValues ?? `{ ${names.map((name) => `${name}: ""`).join(", ")} }`;
  return `import React from "react";\nimport { useForm } from "react-hook-form";\nimport { SgInputDate } from "@seedgrid/fe-components";\n\nexport default function Example() {\n  const { control, handleSubmit } = useForm({\n    defaultValues: ${defaults}\n  });\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n${withControl.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}\n    </form>\n  );\n}`;
}

function CodeBlock(props: { code: string; wrapRHF?: boolean; rhfBaseName?: string; rhfDefaultValues?: string }) {
  const content = props.wrapRHF === false
    ? props.code
    : buildRhfCode(props.code, props.rhfBaseName, props.rhfDefaultValues);
  return (
    <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {content}
    </pre>
  );
}

export default function SgInputDatePage() {
  const [basicValue, setBasicValue] = React.useState("");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputDate</h1>
        <p className="mt-2 text-muted-foreground">
          Input de data com suporte a min/max e label sempre flutuando.
        </p>
      </div>

      <Section title="Basico" description="Date input com label e hint.">
        <div className="w-80">
          <SgInputDate
            id="demo-basic"
            label="Data"
            hintText="Selecione a data"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputDate
  id="data"
  label="Data"
  hintText="Selecione a data"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Com min/max" description="Restringe intervalo de datas.">
        <div className="w-80">
          <SgInputDate
            id="demo-range"
            label="Periodo"
            minDate="2020-01-01"
            maxDate="2030-12-31"
          />
        </div>
        <CodeBlock code={`<SgInputDate
  id="periodo"
  label="Periodo"
  minDate="2020-01-01"
  maxDate="2030-12-31"
/>`} />
      </Section>

      <Section title="Label fixo" description="Label sempre acima da borda.">
        <div className="w-80">
          <SgInputDate
            id="demo-float"
            label="Data do evento"
          />
        </div>
        <CodeBlock code={`<SgInputDate
  id="evento"
  label="Data do evento"
/>`} />
      </Section>
    </div>
  );
}
