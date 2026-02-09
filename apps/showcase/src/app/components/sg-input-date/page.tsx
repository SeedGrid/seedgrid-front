"use client";

import React from "react";
import { SgInputDate } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  const trimmed = props.code.trimStart();
  const content = trimmed.startsWith("import ") ? props.code : wrapFullExample(props.code);
  return <CodeBlockBase code={content} />;
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function wrapFullExample(body: string) {
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputDate } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { }
  });

  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}

export default function Example() {
  ${indentCode(setup, 2)}

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
${bodyIndented}
    </form>
  );
}`;
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
