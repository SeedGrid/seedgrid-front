"use client";

import React from "react";
import { SgInputBirthDate } from "@seedgrid/fe-components";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function buildRhfCode(code: string, baseName = "nascimento", defaultValues?: string) {
  const matches = code.match(/<SgInputBirthDate\b/g) ?? [];
  const count = Math.max(matches.length, 1);
  const names = Array.from({ length: count }, (_, index) => `${baseName}${count > 1 ? index + 1 : ""}`);
  let cursor = 0;
  const withControl = code.replace(/<SgInputBirthDate\b/g, () => {
    const name = names[cursor] ?? baseName;
    cursor += 1;
    return `<SgInputBirthDate\n  name="${name}"\n  control={control}`;
  });
  const defaults = defaultValues ?? `{ ${names.map((name) => `${name}: ""`).join(", ")} }`;
  return `import React from "react";\nimport { useForm } from "react-hook-form";\nimport { SgInputBirthDate } from "@seedgrid/fe-components";\n\nexport default function Example() {\n  const { control, handleSubmit } = useForm({\n    defaultValues: ${defaults}\n  });\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n${withControl.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}\n    </form>\n  );\n}`;
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
