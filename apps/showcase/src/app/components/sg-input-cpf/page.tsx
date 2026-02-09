"use client";

import React from "react";
import { SgInputCPF } from "@seedgrid/fe-components";
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
    `import { SgInputCPF } from "@seedgrid/fe-components";`
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


export default function SgInputCPFPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputCPF</h1>
        <p className="mt-2 text-muted-foreground">
          Input de CPF com mascara e validacao de tamanho/digitos.
        </p>
      </div>

      <Section title="Basico" description="CPF com label e hint.">
        <div className="w-80">
          <SgInputCPF
            id="demo-basic"
            label="CPF"
            hintText="000.000.000-00"
            inputProps={{}}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputCPF
  id="cpf"
  label="CPF"
  hintText="000.000.000-00"
  inputProps={{}}
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputCPF
            id="demo-required"
            label="CPF obrigatorio"
            hintText="Obrigatorio"
            required
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCPF
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe o CPF."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF
  id="cpf"
  label="CPF obrigatorio"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe o CPF."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Mensagem de tamanho" description="Personaliza mensagem quando CPF nao tem 11 digitos.">
        <div className="w-80">
          <SgInputCPF
            id="demo-length"
            label="CPF"
            hintText="000.000.000-00"
            lengthMessage="CPF deve ter 11 digitos."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF
  id="cpf"
  label="CPF"
  hintText="000.000.000-00"
  lengthMessage="CPF deve ter 11 digitos."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Mensagem invalida" description="Personaliza mensagem de CPF invalido.">
        <div className="w-80">
          <SgInputCPF
            id="demo-invalid"
            label="CPF"
            hintText="000.000.000-00"
            invalidMessage="CPF invalido."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF
  id="cpf"
  label="CPF"
  hintText="000.000.000-00"
  invalidMessage="CPF invalido."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputCPF
            id="demo-validation"
            label="CPF"
            hintText="000.000.000-00"
            validation={(v) => (v.startsWith("123") ? "CPF nao pode iniciar com 123." : null)}
            onValidation={(msg) => setValidationMsg(msg)}
            inputProps={{}}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCPF
  id="cpf"
  label="CPF"
  hintText="000.000.000-00"
  validation={(v) => (v.startsWith("123") ? "CPF nao pode iniciar com 123." : null)}
  onValidation={(msg) => console.log(msg)}
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputCPF id="demo-noborder" label="Sem borda" hintText="CPF" withBorder={false} inputProps={{}} />
        </div>
        <div className="w-80">
          <SgInputCPF id="demo-filled" label="Preenchido" hintText="CPF" filled inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="Sem borda" hintText="CPF" withBorder={false} inputProps={{}} />
<SgInputCPF id="b" label="Preenchido" hintText="CPF" filled inputProps={{}} />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputCPF id="demo-noclear" label="Sem limpar" hintText="CPF" clearButton={false} inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCPF id="x" label="Sem limpar" hintText="CPF" clearButton={false} inputProps={{}} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputCPF id="demo-w200" label="200px" hintText="CPF" width={200} inputProps={{}} />
          <SgInputCPF id="demo-w300" label="Arredondado" hintText="CPF" width={300} borderRadius={20} inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="200px" hintText="CPF" width={200} inputProps={{}} />
<SgInputCPF id="b" label="Arredondado" hintText="CPF" width={300} borderRadius={20} inputProps={{}} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputCPF
            id="demo-disabled"
            label="Desabilitado"
            hintText="CPF"
            enabled={false}
            inputProps={{ defaultValue: "000.000.000-00" }}
          />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="Desabilitado" hintText="CPF" enabled={false} inputProps={{}} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputCPF
            id="demo-events"
            label="Digite e observe o log"
            hintText="CPF"
            required
            inputProps={{}}
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
        <CodeBlock code={`<SgInputCPF
  id="eventos"
  label="Com eventos"
  hintText="CPF"
  required
  inputProps={{}}
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
