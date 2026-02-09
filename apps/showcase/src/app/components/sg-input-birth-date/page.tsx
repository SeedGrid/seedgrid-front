"use client";

import React from "react";
import { SgInputBirthDate } from "@seedgrid/fe-components";
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
  return <CodeBlockBase code={wrapFullExample(props.code)} />;
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("
")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("
");
}

function wrapFullExample(body: string) {
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputBirthDate } from "@seedgrid/fe-components";`
  ].join("
");

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


export default function SgInputBirthDatePage() {
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputBirthDate</h1>
        <p className="mt-2 text-muted-foreground">
          Input de data de nascimento com politica de idade minima/maxima.
        </p>
      </div>

      <Section title="Basico" description="Data de nascimento com idade minima.">
        <div className="w-80">
          <SgInputBirthDate
            id="demo-basic"
            label="Data de nascimento"
            minAge={18}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputBirthDate
  id="nascimento"
  label="Data de nascimento"
  minAge={18}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida campo vazio.">
        <div className="w-80">
          <SgInputBirthDate
            id="demo-required"
            label="Data de nascimento"
            minAge={18}
            required
            requiredMessage="Informe a data de nascimento."
          />
        </div>
        <CodeBlock code={`<SgInputBirthDate
  id="nascimento"
  label="Data de nascimento"
  minAge={18}
  required
  requiredMessage="Informe a data de nascimento."
/>`} />
      </Section>

      <Section title="Faixa customizada" description="minAge e maxAge configuraveis.">
        <div className="w-80">
          <SgInputBirthDate
            id="demo-range"
            label="Data de nascimento"
            minAge={12}
            maxAge={80}
          />
        </div>
        <CodeBlock code={`<SgInputBirthDate
  id="nascimento"
  label="Data de nascimento"
  minAge={12}
  maxAge={80}
/>`} />
      </Section>
    </div>
  );
}
