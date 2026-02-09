"use client";

import React from "react";
import { SgInputPhone } from "@seedgrid/fe-components";
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
    `import { SgInputPhone } from "@seedgrid/fe-components";`
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


export default function SgInputPhonePage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputPhone</h1>
        <p className="mt-2 text-muted-foreground">
          Input de telefone com mascara brasileira e validacao de tamanho.
        </p>
      </div>

      <Section title="Basico" description="Telefone com label e hint.">
        <div className="w-80">
          <SgInputPhone
            id="demo-basic"
            label="Telefone"
            hintText="(00) 00000-0000"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputPhone
  id="telefone"
  label="Telefone"
  hintText="(00) 00000-0000"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputPhone
            id="demo-required"
            label="Telefone obrigatorio"
            hintText="Obrigatorio"
            required
          />
        </div>
        <div className="w-80">
          <SgInputPhone
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe o telefone."
          />
        </div>
        <CodeBlock code={`<SgInputPhone
  id="telefone"
  label="Telefone obrigatorio"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe o telefone."
/>`} />
      </Section>

      <Section title="Mensagem invalida" description="Personaliza mensagem de telefone invalido.">
        <div className="w-80">
          <SgInputPhone
            id="demo-invalid"
            label="Telefone"
            hintText="(00) 00000-0000"
            invalidMessage="Telefone invalido."
          />
        </div>
        <CodeBlock code={`<SgInputPhone
  id="telefone"
  label="Telefone"
  hintText="(00) 00000-0000"
  invalidMessage="Telefone invalido."
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputPhone
            id="demo-validation"
            label="Telefone"
            hintText="(00) 00000-0000"
            validation={(v) => (v.startsWith("(00)") ? "DDD invalido." : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputPhone
  id="telefone"
  label="Telefone"
  hintText="(00) 00000-0000"
  validation={(v) => (v.startsWith("(00)") ? "DDD invalido." : null)}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputPhone id="demo-noborder" label="Sem borda" hintText="Telefone" withBorder={false} />
        </div>
        <div className="w-80">
          <SgInputPhone id="demo-filled" label="Preenchido" hintText="Telefone" filled />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="Sem borda" hintText="Telefone" withBorder={false} />
<SgInputPhone id="b" label="Preenchido" hintText="Telefone" filled />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputPhone id="demo-noclear" label="Sem limpar" hintText="Telefone" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputPhone id="x" label="Sem limpar" hintText="Telefone" clearButton={false} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputPhone id="demo-w200" label="200px" hintText="Telefone" width={200} />
          <SgInputPhone id="demo-w300" label="Arredondado" hintText="Telefone" width={300} borderRadius={20} />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="200px" hintText="Telefone" width={200} />
<SgInputPhone id="b" label="Arredondado" hintText="Telefone" width={300} borderRadius={20} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputPhone
            id="demo-disabled"
            label="Desabilitado"
            hintText="Telefone"
            enabled={false}
            inputProps={{ defaultValue: "(11) 99999-0000" }}
          />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="Desabilitado" hintText="Telefone" enabled={false} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputPhone
            id="demo-events"
            label="Digite e observe o log"
            hintText="Telefone"
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">Interaja com o input...</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputPhone
  id="eventos"
  label="Com eventos"
  hintText="Telefone"
  required
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>
    </div>
  );
}
